import os
basedir = os.path.abspath(os.path.dirname(__file__))
DATABASE_URL="postgresql://postgres:password@localhost:5432/cpp"
# DATABASE_URL="postgres://hqlbutwcdqbouq:ba840cbaa1e6350cf98e98aa242b9b70ebbf16e6ef4013f5d8387d496715e6a6@ec2-50-16-198-4.compute-1.amazonaws.com:5432/dbnrh9odfg4bem"


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    print(SQLALCHEMY_DATABASE_URI)


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
