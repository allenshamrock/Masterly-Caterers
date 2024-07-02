from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify,make_response
from flask_restful import Resource
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
from models import User, Booking, BlogPost, Menu, Gallery
from config import app, api, db
from datetime import datetime
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import logging
from functools import wraps

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        # Fix: use first() instead of .first()
        user = User.query.filter_by(id=identity['id']).first()
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper



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

            access_token = create_access_token( identity={"email": user.email, "id": user.id})
            refresh_token = create_refresh_token( identity={"email": user.email, "id": user.id})

            response = {
                "access_token": access_token,
                'id': user.id,
                'content': user.to_dict(),
                'username': user.username,
                'is_admin': user.is_admin,
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
    
    @admin_required
    def post(self):
        data = request.json
        if data is None:
            return jsonify({"error":"Invalid JSON payload "}), 400
        try:
            media_type = data['media_type']
            description = data['description']

            gallery = Gallery(
                media_type = media_type,
                description = description
            )
            db.session.add(gallery)
            db.session.commit()
            return make_response(jsonify({"message":"Media added successfully"}),201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error":"media already exists"}),400)
        except Exception as e:
            return make_response(jsonify({"error":str(e)}),500)

    @admin_required   
    def patch(self,id):
        gallery = Gallery.query.filter(Gallery.id==id).first()
        if not gallery:
            return make_response(jsonify({"error":"Media type is not found"}),404)
        
        data = request.json
        if not data:
            return jsonify({"error":"No input data provided"}),400
        gallery.media_type = data.get('media_type',gallery.media_type)
        gallery.description = data.get('description',gallery.description)

        db.session.commit()
        return make_response(jsonify({'message':'meadia updated successfully'}),200)
    
    @admin_required
    def delete(self,id):
        gallery = Gallery.query.filter(Gallery.id==id).first()
        if not gallery:
            return jsonify({"error":"Media-type not found"}), 404
        db.session.delete(gallery)
        db.session.commit()
        return make_response(jsonify({'message':'Media has been deleted successfuly'}),200)
    
api.add_resource(Galleries,'/gallery','/gallery/<int:id>')

class Menus(Resource):
    def get(self):
        menus =[ menu.to_dict() for menu in Menu.query.all()]
        return jsonify(menus)
    
    def post(self):
        data = request.get_json()
        if  data is None:
            return jsonify({"error": "Invalid JSON payload"}), 404
        
        try:
            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            category = data.get('category')

            menu= Menu(
                name=name,
                description=description,
                price=price,
                category=category
            )
            db.session.add(menu)
            db.session.commit()

            return make_response(jsonify({"message": "Menu created successfully"}), 200)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "Menu already exists"}), 400)
        except Exception as e:
            return make_response(jsonify({"error":str(e)}),500)

api.add_resource(Menus,'/menus')

class MenuId(Resource):
    def get(self,id):
        menu = Menu.query.filter(Menu.id==id).first()
        if not menu:
            return jsonify({"error":"Menu not found"}), 404

        return jsonify(menu.to_dict())
    
    def patch(self,id):
        menu = Menu.query.filter(Menu.id==id).first()
        if not menu:
            return jsonify({"error":"Menu not found"}),404
        
        data = request.json
        if data is None:
            return make_response(jsonify({"error": "No data input provided"}), 400)
        menu.name = data.get('name',menu.name)
        menu.description = data.get('description',menu.description)
        menu.category = data.get('category',menu.category)

        db.session.commit()
        return make_response(jsonify({"message": "Menu successfully updated"}), 200)
    
    def delete(self,id):
        menu = Menu.query.filter(Menu.id==id).first()
        if not menu:
            return make_response(jsonify({"error": "Menu not found"}), 404)
        
        db.session.delete(menu)
        db.session.commit()
        return make_response(jsonify({"message": "Menu successfully deleted"}), 200)

api.add_resource(MenuId,'/menus/<int:id>')

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
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON payload"}), 400

        try:
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
                user_id=user_id
            )

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
        return jsonify({"message":"Blog delted successfully"}), 200
    
api.add_resource(BlogPostId, '/blogs/<int:id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
