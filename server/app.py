from flask import request, jsonify
from flask_restful import Resource
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
from models import User, Booking, BlogPost, Menu, Gallery
from config import app, api, db
from flask_jwt_extended import get_jwt_identity, create_access_token, jwt_required


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return jsonify(users), 200

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

            return jsonify({"message": "Successfully created a user"}), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': "Username or email already exists"}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

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
        return jsonify({"message": "User updated successfully"}), 200

    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 400
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200


api.add_resource(Users, '/users')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
