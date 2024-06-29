from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import request, jsonify,make_response
from flask_restful import Resource
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
from models import User, Booking, BlogPost, Menu, Gallery
from config import app, api, db
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
# import logging
from functools import wraps

def admin_required(fn):
    @wraps
    @jwt_required()
    def wrapper(*args,**kwargs):
        identity = get_jwt_identity()
        user =User.query.filter_by(id=identity['id'].first())
        if not user or not user.is_admin:
            return jsonify({"error":"Admin access required"}),403
        return fn(*args,**kwargs)
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
            return jsonify({"error": "User not found"}), 400

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

            response = make_response(jsonify({
                "access_token": access_token,
                'id': user.id,
                'content': user.to_dict(),
                'username': user.username,
                'is_admin': user.is_admin,
                'refresh_token': refresh_token
            }),200)
                
            return response

        return jsonify({'error': 'Invalid email or password'}), 401


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
    
api.add_resource(Galleries,'/gallery','/gallery<int:id>')

        

    

if __name__ == "__main__":
    app.run(port=5555, debug=True)
