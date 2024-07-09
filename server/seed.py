from config import app, db
from models import BlogPost, Booking, User, Gallery, Promotion,Quote
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
        User(username='Allen Shamrock', email='allenshamrock37@masterly.com',
             password_hash='Allen@123'),
        User(username='Naran Jackson', email='naran37@gmail.com',
             password_hash='Naran@123',),
        User(username='Tracy Tamara', email='trcy@gmail.com',
             password_hash='Tracy@123', )
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
    quotes = [
        Quote(name=fake.name(), description=fake.text(),
              price=10000, address=fake.word(), phone_number="0757772601", date=datetime(2024, 8, 1)),
        Quote(name=fake.name(), description=fake.text(),
              price=10000, address=fake.word(), phone_number="0757772601", date=datetime(2024, 8, 1)),
        Quote(name=fake.name(), description=fake.text(),
              price=10000, address=fake.word(), phone_number="0757772601", date=datetime(2024, 8, 1))
    ]

    for quote in quotes:
        db.session.add(quote)
        db.session.commit()

    # Fetch users and menus for creating bookings
    user_ids = [user.id for user in User.query.all()]
    quote_ids = [quote.id for menu in Quote.query.all()]

    print("Adding bookings..")
    bookings = [
        Booking(user_id=user_ids[0], event_date=datetime(2025, 2, 2), event_type='Wedding',
                guest_count=5, quote_id=quote_ids[0], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[1], event_date=datetime(2025, 2, 2), event_type='Corporate Event',
                guest_count=10, quote_id=quote_ids[1], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[2], event_date=datetime(2025, 2, 2), event_type='Birthday Party',
                guest_count=15, quote_id=quote_ids[2], special_requests=fake.text(), booking_date=datetime.now())
    ]

    for booking in bookings:
        db.session.add(booking)
        db.session.commit()

    print("Adding promotions..")
    promotions = [
        Promotion(offer_name="Summertides updated", description=fake.text(), start_date=datetime.now(),
                  end_date=datetime(2024, 8, 1), season_holiday="Summer", discount=25.0, conditions="Minimum $25 spend"),
        Promotion(offer_name="Summertides updated", description=fake.text(), start_date=datetime.now(),
                  end_date=datetime(2024, 8, 1), season_holiday="Summer", discount=25.0, conditions="Minimum $25 spend"),
        Promotion(offer_name="Summertides updated", description=fake.text(), start_date=datetime.now(),
                  end_date=datetime(2024, 8, 1), season_holiday="Summer", discount=25.0, conditions="Minimum $25 spend")
    ]

    for promotion in promotions:
        db.session.add(promotion)
        db.session.commit()

    # Fetch promotion IDs for creating bookings
    promotion_ids = [promotion.id for promotion in Promotion.query.all()]

    print("Adding bookings with promotions..")
    bookings_with_promotions = [
        Booking(user_id=user_ids[0], event_date=datetime(2025, 3, 2), event_type='Wedding',
                guest_count=5, quote_id=quote_ids[0], promotion_id=promotion_ids[0], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[1], event_date=datetime(2025, 3, 2), event_type='Corporate Event',
                guest_count=10, quote_id=quote_ids[1], promotion_id=promotion_ids[1], special_requests=fake.text(), booking_date=datetime.now()),
        Booking(user_id=user_ids[2], event_date=datetime(2025, 3, 2), event_type='Birthday Party',
                guest_count=15, quote_id=quote_ids[2], promotion_id=promotion_ids[2], special_requests=fake.text(), booking_date=datetime.now())
    ]

    for booking in bookings_with_promotions:
        db.session.add(booking)
        db.session.commit()

    print("Seeding complete!")
