from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@localhost:5432/dms"
# SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://cbtvabhhzsyfgu:a14258514e9c325752c5388960ea86920ce222d5b105ddf1d488ae4fedeafd14@ec2-44-209-57-4.compute-1.amazonaws.com:5432/dj35ommef4265"
engine = create_engine(SQLALCHEMY_DATABASE_URL,  pool_size=100,
                       max_overflow=15, pool_pre_ping=True, pool_recycle=60*60)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()
