from werkzeug.security import check_password_hash, generate_password_hash
from config import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_only = ('id', 'username', 'email', 'is_admin')
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False, unique=True)
    email = db.Column(db.String, nullable=True, unique=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    password_hash = db.Column(db.String(100), nullable=False)
    galleries = db.relationship(
        'Gallery', back_populates='user', cascade='all, delete-orphan')
    blogposts = db.relationship(
        'BlogPost', back_populates='user', cascade='all, delete-orphan')
    bookings = db.relationship(
        'Booking', back_populates='user', cascade='all, delete-orphan')
    quotes = association_proxy(
        'bookings', 'quote', creator=lambda quote_obj: Booking(quote=quote_obj))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def create_user(cls, username, email, password, is_admin=False):
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


class Gallery(db.Model, SerializerMixin):
    __tablename__ = 'galleries'
    serialize_only = ('id', 'media_type', 'description', 'user_id')
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='galleries')


class BlogPost(db.Model, SerializerMixin):
    __tablename__ = 'blogposts'
    serialize_only = ('id', 'title', 'content',
                      'publish_date', 'updated_at', 'user_id')
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    publish_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='blogposts')


class Quote(db.Model, SerializerMixin):
    __tablename__ = 'quotes'
    serialize_only = ('id', 'name', 'description', 'price', 'category')
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime,nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(100), nullable=False)
    bookings = db.relationship(
        'Booking', back_populates='quotes', cascade='all, delete-orphan')
    promotions = db.relationship(
        'Promotion', back_populates='quote', cascade='all, delete-orphan')


class Promotion(db.Model):
    __tablename__ = 'promotions'
    id = db.Column(db.Integer, primary_key=True)
    offer_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    season_holiday = db.Column(db.String, nullable=False)
    discount = db.Column(db.Float, nullable=False)
    conditions = db.Column(db.String, nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quotes.id'))
    quote = db.relationship('Quote', back_populates='promotions')

    bookings = db.relationship('Booking', back_populates='promotion')


class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    serialize_only = ('id', 'user_id', 'event_date', 'event_type',
                      'guest_count', 'quote_id', 'promotion_id', 'special_requests', 'booking_date')
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey(
        'quotes.id'), nullable=False)
    promotion_id = db.Column(db.Integer, db.ForeignKey(
        'promotions.id'), nullable=True)
    special_requests = db.Column(db.Text, nullable=True)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='bookings')
    quote = db.relationship('Quote', back_populates='bookings')
    promotion = db.relationship('Promotion', back_populates='bookings')

    # Add this property to match the 'quotes' relationship in Quote
    quotes = db.relationship('Quote', back_populates='bookings')
