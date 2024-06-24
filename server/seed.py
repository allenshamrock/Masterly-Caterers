from config import app, db
from models import BlogPost, Booking, User, Gallery, Menu
from faker import Faker
from datetime import datetime

fake = Faker()

with app.app_context():
    print("Dropping all tables..")
    db.drop_all()
    print("Creating all tables..")
    db.create_all()

    print("Adding users..")
    users = [
        User(username='Allen Shamrock', email='allenshamrock37@gmail.com',
             password_hash='Allen@123', is_admin=True),
        User(username='Naran Jackson', email='naran37@gmail.com',
             password_hash='Naran@123', is_admin=False),
        User(username='Tracy Tamara', email='trcy@gmail.com',
             password_hash='Tracy@123', is_admin=False)
    ]

    for user in users:
        user.set_password(user.password_hash) 
        db.session.add(user)
    db.session.commit()

    print("Adding galleries..")
    galleries = [
        Gallery(media_type='pic', description=fake.text()),
        Gallery(media_type='pic', description=fake.text()),
        Gallery(media_type='video', description=fake.text())
    ]

    for gallery in galleries:
        db.session.add(gallery)
    db.session.commit()

    print("Adding blogposts...")
    blogs = [
        BlogPost(title=fake.sentence(), content=fake.text(),
                 publish_date=datetime.now(), updated_at=datetime.now()),
        BlogPost(title=fake.sentence(), content=fake.text(),
                 publish_date=datetime.now(), updated_at=datetime.now()),
        BlogPost(title=fake.sentence(), content=fake.text(),
                 publish_date=datetime.now(), updated_at=datetime.now())
    ]

    for blog in blogs:
        db.session.add(blog)
    db.session.commit()

    print("Adding menus..")
    menus = [
        Menu(name=fake.name(), description=fake.text(),
             price=10000, category=fake.word()),
        Menu(name=fake.name(), description=fake.text(),
             price=10000, category=fake.word()),
        Menu(name=fake.name(), description=fake.text(),
             price=10000, category=fake.word())
    ]

    for menu in menus:
        db.session.add(menu)
    db.session.commit()

    # Fetch users and menus for creating bookings
    user_ids = [user.id for user in User.query.all()]
    menu_ids = [menu.id for menu in Menu.query.all()]

    print("Adding bookings..")
    bookings = [
        Booking(user_id=user_ids[0], event_date=datetime(2025, 2, 2), event_type='Wedding',
                guest_count=5, menu_id=menu_ids[0], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[1], event_date=datetime(2025, 2, 2), event_type='Corporate Event',
                guest_count=10, menu_id=menu_ids[1], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[2], event_date=datetime(2025, 2, 2), event_type='Birthday Party',
                guest_count=15, menu_id=menu_ids[2], special_requests=fake.text(), booking_date=datetime.now())
    ]

    for booking in bookings:
        db.session.add(booking)
    db.session.commit()

    print("Seeding completed.")
