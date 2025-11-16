"""
Database base classes and imports
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here for Alembic
from app.models.user import User
from app.models.organization import Organization
from app.models.subscription import Subscription
from app.models.document import Document
from app.models.conversation import Conversation, Message
from app.models.legal_data import LegalCase, Statute
