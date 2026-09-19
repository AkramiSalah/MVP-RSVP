from app.database import engine, SessionLocal, Base
from app.models import Event, Invitee

Base.metadata.create_all(bind=engine)

db = SessionLocal()

event = Event(name="Test Wedding")
db.add(event)
db.commit()
db.refresh(event)

invitee = Invitee(event_id=event.id, phone_number="972501234567", name="Dan Cohen")
db.add(invitee)
db.commit()

results = db.query(Invitee).all()
for guest in results:
    print(guest.name, guest.status, guest.event.name)

db.close()