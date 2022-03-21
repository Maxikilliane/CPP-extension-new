import os
basedir = os.path.abspath(os.path.dirname(__file__))
DATABASE_URL="postgresql://postgres:password@localhost:5432/cpp"


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    print(SQLALCHEMY_DATABASE_URI)

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
