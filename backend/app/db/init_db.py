from app.db.database import Base, engine
from app.models import Company, User


def init_db():
    Base.metadata.create_all(bind=engine)