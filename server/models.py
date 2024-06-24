from werkzeug.security import check_password_hash, generate_password_hash
from config import db
from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False, unique=True)
    email = db.Column(db.String, nullable=True, unique=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    password_hash = db.Column(db.String(100), nullable=False)
    galleries = db.relationship('Gallery', back_populates='user', cascade='all, delete-orphan')
    blogposts = db.relationship('BlogPost', back_populates='user', cascade='all, delete-orphan')
    bookings = db.relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    # Association proxy to  access menu items directly from a user through thier bookings
    menus = association_proxy('bookings','menu',creator=lambda menu_obj:Booking(menu=menu_obj))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    @classmethod
    def create_user(cls,username,email,password,is_admin=False):
        if is_admin and cls.query.filter_by(is_admin=True).first():
            raise ValueError('An admin already exists')
        user = cls(
            username=username,
            email=email,
            is_admin=is_admin
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

class Gallery(db.Model):
    __tablename__ = 'galleries'
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='galleries')


class BlogPost(db.Model):
    __tablename__ = 'blogposts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    publish_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='blogposts')


class Menu(db.Model):
    __tablename__ = 'menus'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False) # e.g., 'Corporate', 'Birthday', 'Wedding'
    category = db.Column(db.String(100), nullable=False)
    bookings = db.relationship(
        'Booking', back_populates='menu', cascade='all, delete-orphan')


class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    event_date = db.Column(db.DateTime, nullable=False)  # e.g., 'Corporate Event', 'Wedding'
    event_type = db.Column(db.String(100), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)
    special_requests = db.Column(db.Text, nullable=True)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='bookings')
    menu = db.relationship('Menu', back_populates='bookings')
