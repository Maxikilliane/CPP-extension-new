from app import db
from sqlalchemy.dialects.postgresql import JSON

class Annotation(db.Model):
    __tablename__ = 'annotation'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String())
    data = db.Column(JSON)
    length = db.Column(db.Numeric(4,10))
    performance = db.Column(db.Integer)

    def __init__(self, url, data, length, performance):
        self.url = url
        self.data = data
        self.length = length
        self.performance = performance

    def __repr__(self):
        return '<id {}>'.format(self.id)

class BugReport(db.Model):
    __tablename__ = 'bugReport'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String())
    data = db.Column(db.String())

    def __init__(self, url, data):
        self.url = url
        self.data = data

    def __repr__(self):
        return '<id {}>'.format(self.id)

class QuestionnaireData(db.Model):
    __tablename__ = 'questionnaireData'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String())
    url = db.Column(db.String())
    ratings = db.Column(JSON)

    def __init__(self, userId, url, ratings):
        self.userId = userId
        self.url = url
        self.ratings = ratings

    def __repr__(self):
        return '<id {}>'.format(self.id)

class DemographicData(db.Model):
    __tablename__ = 'demographicData'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String())
    gender = db.Column(db.String())
    age = db.Column(db.Integer)
    occupation = db.Column(db.String())
    occupationDesc = db.Column(db.String())

    def __init__(self, userId, gender, age, occupation, occupationDesc):
        self.userId = userId
        self.gender = gender
        self.age = age
        self.occupation = occupation
        self.occupationDesc = occupationDesc

    def __repr__(self):
        return '<id {}>'.format(self.id)

class BlockedUrls(db.Model):
    __tablename__ = 'blockedUrls'
    userId = db.Column(db.String(), primary_key=True)
    # column format for array
    urls = db.Column(db.ARRAY(db.String()))

    def __init__(self, userId, urls):
        self.userId = userId
        self.urls = urls

class OnlyUpdatesUrls(db.Model):
    __tablename__ = 'onlyUpdatesUrls'
    userId = db.Column(db.String(), primary_key=True)
    # column format for array
    urls = db.Column(db.ARRAY(db.String()))

    def __init__(self, userId, urls):
        self.userId = userId
        self.urls = urls
