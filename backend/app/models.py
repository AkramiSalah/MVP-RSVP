from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    invitees = relationship("Invitee", back_populates="event")

class Invitee(Base):
    __tablename__ = "invitees"
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    phone_number = Column(String, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, server_default = 'pending')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    event = relationship("Event", back_populates="invitees")
