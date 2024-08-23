from werkzeug.security import generate_password_hash
from flask import request, jsonify,make_response,session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from models import User, Booking, BlogPost, Gallery,Quote
from config import app, api, db
from datetime import datetime
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import logging
import cloudinary
from cloudinary import uploader
from authlib.integrations.flask_client import OAuth
import cloudinary.api
from dotenv import load_dotenv
import os
from functools import wraps

load_dotenv()
oauth = OAuth(app)


# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET')
)

if not all([cloudinary.config().cloud_name, cloudinary.config().api_key, cloudinary.config().api_secret]):
    raise ValueError(
        "No cloudinary configurations found.Ensure CLOUD_NAME,API_KEY,SECRET_KEY are set")

google = oauth.register(
    name = 'google',
    client_id = os.getenv('GOOGLE_CLIENT_ID'),
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET'),
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params = None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params = None,
    refresh_token_url = None,
    # redirect_uri = os.getenv('GOOGLE_REDIRECT_URI'),
    client_kwargs = {'scope':'openid email profile'} 
)





class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users),200)

    def post(self):
        data = request.json
        if data is None:
            return jsonify({"error": "Invalid JSON payload"}), 400
        try:
            username = data['username']
            email = data['email']
            is_admin = data.get('is_admin', False)
            password = data['password']
            hashed_password = generate_password_hash(
                password, method="pbkdf2:sha512")

            user = User(
                username=username,
                email=email,
                is_admin=is_admin,
                password_hash=hashed_password
            )

            db.session.add(user)
            db.session.commit()

            return make_response(jsonify({"message": "Successfully created a user"}), 201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({'error': "Username or email already exists"}), 400)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)

api.add_resource(Users, '/users')


class UserId(Resource):
    def get(self,id):
        user =User.query.filter(User.id==id).first()
        if not user:
            return jsonify({"error":"User not found"}),404 
        return jsonify(user.to_dict())

    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        if data is None:
            return jsonify({"error": "No input data provided"}), 400

        user.username = data.get('username', user.username)
        if 'password' in data:
            user.set_password(data['password'])

        db.session.commit()
        return make_response(jsonify({"message": "User updated successfully"}), 200)

    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 400)
        db.session.delete(user)
        db.session.commit()
        return make_response(jsonify({'message': 'User deleted successfully'}), 200)
    
api.add_resource(UserId,'/users/<int:id>')

class GoogleLogin(Resource):
    @staticmethod
    def authorized():
        if request.method == 'GET':
            token = google.authorize_access_token()
            user_info = google.parse_id_token(token)
            if user_info is None:
                return {'message': 'Failed to retrieve user info from Google'}, 400

            email = user_info.get('email')
            username = user_info.get('name')

            # Check if the user exists in the database
            user = User.query.filter_by(email=email).first()
            if not user:
                # If the user doesn't exist, register the user using Google info
                user = User(username=username, email=email)
                db.session.add(user)
                db.session.commit()

            # Generate JWT tokens for the user
            access_token = create_access_token(
                identity={"email": user.email, "role": user.role, "id": user.id})
            refresh_token = create_refresh_token(
                identity={"email": user.email, "role": user.role, "id": user.id})

            # Return the tokens and user info in the response
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()  # Assuming to_dict() method returns user info as a dictionary
            })

    def post(self):
        access_token = request.json.get('access_token')
        nonce = request.json.get('nonce')  # Retrieve nonce from the request
        if access_token:
            # Retrieve the nonce value stored in session or elsewhere
            stored_nonce = session.get('nonce')

            if stored_nonce == nonce:  # Compare nonce from request with stored nonce
                user_info = google.parse_id_token(access_token, nonce=nonce)
                if user_info is None:
                    return {'message': 'Invalid or expired access token'}, 400

                email = user_info.get('email')
                username = user_info.get('name')
                user = User.query.filter_by(email=email).first()
                if user:
                    access_token = create_access_token(
                        identity={"email": user.email, "role": user.role, "id": user.id})
                    refresh_token = create_refresh_token(
                        identity={"email": user.email, "role": user.role, "id": user.id})
                    return jsonify({
                        'access_token': access_token,
                        'id': user.id,
                        'content': user.to_dict(),
                        'username': user.username,
                        'role': user.role,
                        'refresh_token': refresh_token
                    }), 200
                else:
                    return {'message': 'User not found'}, 404
            else:
                return {'message': 'Nonce mismatch'}, 400
        else:
            return {'message': 'Access token not provided'}, 400
        
api.add_resource(GoogleLogin, '/login/authorized')

class Login(Resource):
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({'error': 'Content-Type must be application/json'}), 415

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter(User.email == email).first()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if user and user.check_password(password):
            if email == 'allenshamrock37@gmail.com':
                user.is_admin = True
                db.session.commit()

            access_token = create_access_token( identity={"email": user.email, "role":user.role, "id": user.id})
            refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})

            response = {
                "access_token": access_token,
                'id': user.id,
                'content': user.to_dict(),
                'username': user.username,
                'role': user.role,
                'refresh_token': refresh_token
            }
                
            return make_response(jsonify(response), 200)

        return make_response(jsonify({'error': 'Invalid email or password'}), 401)


api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        current_user = get_jwt_identity()
        response = make_response(jsonify({"message":f"Logged out user {current_user}"}),200)
        unset_jwt_cookies(response)
        return response


class Galleries(Resource):
    def get(self):
        galleries = [gallery.to_dict() for gallery in Gallery.query.all()]
        return make_response(jsonify(galleries),200)
    
   
    def post(self):
        app.logger.info(f"Form data:{request.form}")
        app.logger.info(f"Files:{request.files}")

        file_to_upload = request.files.get("file")
        description = request.form.get("description")
        user_id = request.form.get("user_id")
        media_type = request.form.get("type")

        app.logger.info(
            f"Recieved data:description ={description},user_id={user_id}, type={media_type} ")
        
        # check for missing fields and log them
        missing_fields = []
        if not description:
            missing_fields.append("description")
        if not file_to_upload:
            missing_fields.append("file")
        if not media_type:
            missing_fields.append("type")

        if missing_fields:
            app.logger.error(f"Missing fields:{missing_fields}")
            return {'error':f"Missing fields:{','.join(missing_fields)}"}, 400
        
        try:
            if media_type == 'video':
                upload_result = uploader.upload(
                    file_to_upload,resource_type='video'
                )
            
            else:
                upload_result = uploader.upload(file_to_upload)

        except Exception as e:
            app.logger.error(f"Error uploading to Cloudinary:{e}")
            return make_response(jsonify({"error": "File upload failed"}), 500)

        app.logger.info(upload_result)
        file_url = upload_result['url']

        file_url = upload_result.get('url')

        try:
           new_media = Gallery(
               media_type=file_url,
               description=description,
               user_id = user_id
           ) 

           db.session.add(new_media)
           db.session.commit()

        except Exception as e:
            app.logger.error(f"Error saving content to database:{e}")
            return make_response(jsonify({"error": "Content creation failed"}), 500)

        return make_response(jsonify({
            "message": "Content uploaded and created successfully",
            "new_media": new_media.id,
            "upload_result": upload_result}), 201)
   
api.add_resource(Galleries,'/gallery')

class GalleryId(Resource):
    def get(self,id):
        media = Gallery.query.filter(Gallery.id ==id).first()
        if not media:
            return make_response(jsonify({"error":"Media not found"}),404)
        return jsonify(media.to_dict())
    

    def patch(self, id):
        gallery = Gallery.query.filter(Gallery.id == id).first()
        if not gallery:
            return make_response(jsonify({"error": "Media type is not found"}), 404)

        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        # gallery.media_type = data.get('media_type',gallery.media_type)
        gallery.description = data.get('description', gallery.description)

        db.session.commit()
        return make_response(jsonify({'message': 'meadia updated successfully'}), 200)

    def delete(self, id):
        gallery = Gallery.query.filter(Gallery.id == id).first()
        if not gallery:
            return jsonify({"error": "Media-type not found"}), 404
        db.session.delete(gallery)
        db.session.commit()
        return make_response(jsonify({'message': 'Media has been deleted successfuly'}), 200)

api.add_resource(GalleryId,'/gallery/<int:id>')

class Quotes(Resource):
    def get(self):
        quotes =[ quote.to_dict() for quote in Quote.query.all()]
        return jsonify(quotes)
    
    def post(self):
        data = request.get_json()
        if  data is None:
            return jsonify({"error": "Invalid JSON payload"}), 404
        
        try:
            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            phone_number = data.get('phone_number')
            address = data.get('address')
            date = data.get('date')

            quote= Quote(
                name=name,
                description=description,
                price=price,
                phone_number = phone_number,
                address = address,
                date=date
            )
            db.session.add(quote)
            db.session.commit()

            return make_response(jsonify({"message": "Quote created successfully"}), 200)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "Menu already exists"}), 400)
        except Exception as e:
            return make_response(jsonify({"error":str(e)}),500)

api.add_resource(Quotes,'/quotes')

class QuotesId(Resource):
    def get(self,id):
        quote = Quote.query.filter(Quote.id==id).first()
        if not quote:
            return jsonify({"error":"Quote not found"}), 404

        return jsonify(quote.to_dict())
    
    def patch(self,id):
        quote = Quote.query.filter(Quote.id==id).first()
        if not quote:
            return jsonify({"error":"Quote not found"}),404
        
        data = request.json
        if data is None:
            return make_response(jsonify({"error": "No data input provided"}), 400)
        quote.name = data.get('name',quote.name)
        quote.description = data.get('description',quote.description)
        quote.category = data.get('category',quote.category)

        db.session.commit()
        return make_response(jsonify({"message": "Menu successfully updated"}), 200)
    
    def delete(self,id):
        quote = Quote.query.filter(Quote.id==id).first()
        if not quote:
            return make_response(jsonify({"error": "Quote not found"}), 404)
        
        db.session.delete(quote)
        db.session.commit()
        return make_response(jsonify({"message": "Quote successfully deleted"}), 200)

api.add_resource(QuotesId,'/quotes/<int:id>')

class Bookings(Resource):
    def get(self):
        booking = [booking.to_dict() for booking in Booking.query.all()]
        return jsonify(booking)
    
    def post(self):
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON payload"}), 400

        try:
            user_id = data.get('user_id')
            event_date_str = data.get('event_date')
            # Convert string to datetime object
            event_date = datetime.strptime(event_date_str, '%Y-%m-%d')
            event_type = data.get('event_type')
            guest_count = data.get('guest_count')
            menu_id = data.get('menu_id')
            special_requests = data.get('special_requests')

            # Validate required fields
            if not user_id or not event_date or not event_type or not guest_count or not menu_id:
                return jsonify({"error": "user_id, event_date, event_type, guest_count, and menu_id are required"}), 400

            # Create a new Booking instance
            booking = Booking(
                user_id=user_id,
                event_date=event_date,
                event_type=event_type,
                guest_count=guest_count,
                menu_id=menu_id,
                special_requests=special_requests,
                booking_date=datetime.utcnow()
            )

            # Add the new booking to the session and commit
            db.session.add(booking)
            db.session.commit()

            # Return success response
            return make_response(jsonify({"message": "Booking has been placed successfully"}), 201)

        except IntegrityError as e:
            db.session.rollback()
            logging.error(f"IntegrityError: {e}")
            return make_response(jsonify({"error": "IntegrityError: Failed to create booking"}), 400)

        except Exception as e:
            logging.error(f"Exception: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


api.add_resource(Bookings, '/bookings')

class BookingId(Resource):
    def get(self,id):
        booking = Booking.query.filter(Booking.id == id).first()
        if not booking:
            return jsonify({"error":"Booking not found"}), 404
        return jsonify(booking.to_dict())
    
    def patch(self,id):
        booking = Booking.query.filter(Booking.id==id).first()
        if not booking:
            return jsonify({"error":"Booking not found"}) ,404
        
        data = request.json
        if data is None:
            return jsonify({"error":"No data input provided"}), 400
        
        booking.event_date = datetime.strptime(
            data.get('event_date', booking.event_date), '%Y-%m-%d')
        booking.event_type = data.get('event_type',booking.event_type)
        booking.guest_count = data.get('guest_count',booking.guest_count)
        booking.special_requests = data.get('special_requests',booking.special_requests)
        # booking.booking_date = data.get('booking_date',booking.booking_date)

        db.session.commit()
        return jsonify({"message":"Booking updated successfully"})
    
    def delete(self,id):
        booking = Booking.query.filter(Booking.id==id).first()
        if not booking:
            return make_response(jsonify({"error": "Booking not found"}), 404)
        
        db.session.delete(booking)
        db.session.commit()
        return make_response(jsonify({"message": "Booking has been deleted successfully"}), 200)

api.add_resource(BookingId,'/bookings/<int:id>')

class BlogPosts(Resource):
    def get(self):
        blogposts = [blogposts.to_dict() for blogposts in BlogPost.query.all()]
        return jsonify(blogposts)
    

    def post(self):
        data = request.form
        image_file = request.files.get('file')  # Change 'image' to 'file'

        if image_file:
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('url')
        else:
            image_url = None

        title = data.get('title')
        content = data.get('content')
        user_id = data.get('user_id')

        if not title or not content or not user_id:
            return jsonify({"error": "Title, content, and user_id are required"}), 400

        blogpost = BlogPost(
            title=title,
            content=content,
            publish_date=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            user_id=user_id,
            image_url=image_url
        )

        try:
            db.session.add(blogpost)
            db.session.commit()
            return make_response(jsonify({"message": "Blogpost successfully created"}), 201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"message": "Blogpost already exists"}), 400)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)


api.add_resource(BlogPosts, '/blogs')

class BlogPostId(Resource):
    def get(self,id):
        blogs = BlogPost.query.filter(BlogPost.id==id).first()
        if not blogs:
            return jsonify({"message":"Blog not found"}),404
        return jsonify(blogs.to_dict())
    
    def patch(self,id):
        blogs = BlogPost.query.filter(BlogPost.id==id).first()
        if not blogs:
            return jsonify({"message":"Blog not found"}), 404
        
        data = request.json
        if data is None:
            return jsonify({"message":"Invalid JSON payload"}),400
        blogs.title = data.get('title',blogs.title)
        blogs.content  = data.get('content',blogs.content)
        blogs.updated_at = data.get('updated_at',blogs.updated_at)

        db.session.commit()
        return jsonify({"message":"Blog upldated successfully"})
    
    def delete(self,id):
        blogs = BlogPost.query.filter(BlogPost.id==id).first()
        if not blogs:
            return jsonify({"error":"Blog not found"}), 404
        db.session.delete(blogs)
        db.session.commit()
        return make_response(jsonify({"message":"Blog delted successfully"}), 200)
       
api.add_resource(BlogPostId, '/blogs/<int:id>')

class Promotion(Resource):
    def get(self):
        promotions = [promotion.to_dict() for promotion in Promotion.query.all()]
        return jsonify(promotions)
    
    def post(self):
        data = request.get_json()

        if data is None:
            return make_response(jsonify("Invalid JSON payload"),400)
        try:
            offer_name = data['offer_name'],
            description = data['description'],
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
            season_holiday = data['season_holiday'],
            discount = data.get('discount'),
            conditions = data.get('conditions')

            promotion = Promotion(
                offer_name = offer_name,
                description=description,
                start_date=start_date,
                end_date=end_date,
                season_holiday=season_holiday,
                discount=discount,
                conditions=conditions
            )

            db.session.add(promotion)
            db.session.commit()
            return make_response(jsonify({"message": "Promotion created successfully"}),200)
        
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error":"Promotion already exists"}),400)
        
        except Exception as e:
            return make_response(jsonify({"error":str(e)}),500)
api.add_resource(Promotion,'/promotions')

class PromotionId(Resource):
    def get(self,id):
        promotion = Promotion.query.filter(Promotion.id==id).first()
        if not promotion:
            return jsonify({"error":"Promotion not found"}),404
        return jsonify(promotion.to_dict())
    
    def patch(self,id):
        promotion = Promotion.query.filter(Promotion.id==id).first()
        if not promotion:
            return jsonify({"error":"Promotion not found"}), 404
        
        data = request.json
        if data is None:
            return jsonify({"message":"INvalid JSON payload"}),400
        promotion.offfer_name = data.get('offer_name',promotion.offer_name)
        promotion.description = data.get('description',promotion.description)
        promotion.start_date = data.get('start_date',promotion.start_date)
        promotion.end_date = data.get('end_date',promotion.end_date)
        promotion.season_holiday = data.get('season_holiday',promotion.season_holiday)
        promotion.discount = data.get('discount',promotion.discount)
        promotion.conditions =data.get('conditions',promotion.conditions)

        db.session.commit()
        return jsonify({"message":"Prommotion updated successfully"})
    
    def delete(self,id):
        promotion = Promotion.query.filter_by(id=id).first()
        if not promotion:
            return jsonify({"message":"Promotion not found"}), 404
        db.session.delete(promotion)
        db.session.commit()
        return make_response(jsonify({"message":"Promoton deleted successfully"}))
    
api.add_resource(PromotionId,'/promotions/<int:id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
