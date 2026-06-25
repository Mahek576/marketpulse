from app.db.database import Base, engine
from app.models import Article, Company, User, Watchlist


def init_db():
    Base.metadata.create_all(bind=engine)