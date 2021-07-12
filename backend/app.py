from flask import Flask, render_template, jsonify, url_for
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask import request
from celery import Celery
from celery.result import AsyncResult
import classifiers.predict as predictor
import os
import time
import segmentation.segmenter as segmenterer

url = ""
APP_SETTINGS="config.DevelopmentConfig"

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)
app.config.from_object(APP_SETTINGS)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import *

startTime = time.time()
wordCount = None

@app.route('/predict', methods=['POST'])
def predict():
    print("PREDICTION!")
    jsonData = request.json["segments"]
    task = processing.delay(jsonData)
    return jsonify({}), 202, {'Location': url_for('taskstatus',
                                                  task_id=task.id)}

@app.route('/segments', methods=['POST'])
def getSegments():
    url = request.json["url"]
    global startTime
    startTime = time.time()
    task = segmentate_pp.delay(url)
    return jsonify({}), 202, {'Location': url_for('segmentationstatus',
                                                  task_id=task.id)}

@app.route('/saveQuestionnaireData', methods=['POST'])
def saveQuestionnaireData():
    userId = request.json["userId"]
    print(userId, type(userId))
    url = request.json["url"]

    print(url, type(url))
    ratings = request.json["ratings"]
    print(ratings, type(ratings))
    # try:
    questionnaireData=QuestionnaireData(
        userId=userId,
        url=url,
        ratings=ratings
    )
    db.session.add(questionnaireData)
    db.session.commit()
    statuscode = 200
    # except:
    #     print("unable to save questionnaire data")
    #     statuscode = 400
    return jsonify({}), statuscode

@app.route('/saveDemographics', methods=['POST'])
def saveDemographicData():
    userId = request.json["userId"]
    gender = request.json["gender"]
    age = request.json["age"]
    occupation = request.json["occupation"]
    occupationDesc = request.json["occupationDesc"]

    demographicData=DemographicData(
        userId=userId,
        gender=gender,
        age=age,
        occupation=occupation,
        occupationDesc=occupationDesc
    )
    db.session.add(demographicData)
    db.session.commit()
    statuscode = 200
    # except:
    #     print("unable to save questionnaire data")
    #     statuscode = 400
    return jsonify({}), statuscode

@app.route('/saveDisabledSites', methods=['POST'])
def saveDisabledSites():
    userId = request.json["userId"]
    urls = request.json["urls"]
    data = BlockedUrls.query.filter_by(userId=userId).first()
    print(data)
    if data is None:
        blockedUrls = BlockedUrls(
            userId=userId,
            urls=urls
        )
        db.session.add(blockedUrls)

    else:
        data.urls = urls
    db.session.commit()
    statuscode = 200
    return jsonify({}), statuscode

@app.route('/saveOnlyUpdatesSites', methods=['POST'])
def saveOnlyUpdatesSites():
    userId = request.json["userId"]
    urls = request.json["urls"]
    data = OnlyUpdatesUrls.query.filter_by(userId=userId).first()
    print(data)
    if data is None:
        blockedUrls = OnlyUpdatesUrls(
            userId=userId,
            urls=urls
        )
        db.session.add(blockedUrls)

    else:
        data.urls = urls
    db.session.commit()
    statuscode = 200
    return jsonify({}), statuscode

@app.route('/saveAnnotation', methods=['POST'])
def saveAnnotation():
    performance = time.time() - startTime
    print("PERFORMANCE!", time.time() - startTime, time.time(), startTime)
    url = request.json["baseUrl"]
    data = request.json["data"]
    # try:
    print("beim speichern:", wordCount)
    annotation=Annotation(
        url=url,
        data=data,
        length=wordCount,
        performance=performance
    )
    db.session.add(annotation)
    db.session.commit()
    statuscode = 200
    # except:
    #     print("unable to add to db")
    #     statuscode = 400
    return jsonify({}), statuscode

@app.route('/saveBugReport', methods=['POST'])
def saveBugReport():
    url = request.json["url"]
    data = request.json["bugReport"]
    try:
        bugReport = BugReport(
            url=url,
            data=data
        )
        db.session.add(bugReport)
        db.session.commit()
        statuscode = 200
    except:
        print("unable to add to db")
        statuscode = 400
    return jsonify({}), statuscode

@app.route('/getAnnotation', methods=['POST'])
def getAnnotation():
    url = request.json["url"]
    # try:
    data = Annotation.query.filter_by(url=url).first()
    print("DATA!!!!!",data.url)
    print("DATA!!!!!",data.data)
    statuscode = 200
    return jsonify({'data' : data.data}), statuscode
    # except:
    #     print("unable to read from db")
    #     statuscode = 400
    #     return jsonify({'data' : None}), statuscode

@app.route('/getDisabledSites', methods=['POST'])
def getDisabledSites():
    userId = request.json["userId"]
    userId = userId['userId']
    # try
    print(userId)
    urls =  db.session.query(BlockedUrls.urls).filter_by(userId=userId).first()
    db.session.commit()
    print("HALLO SVEN :)", urls)
    statuscode = 200
    print(urls)
    return jsonify({'urls' : urls}), statuscode
    # except:
    #     print("unable to read from db")
    #     statuscode = 400
    #     return jsonify({'data' : None}), statuscode

@app.route('/getOnlyUpdatesUrls', methods=['POST'])
def getOnlyUpdatesUrls():
    userId = request.json["userId"]
    userId = userId['userId']
    # try
    print(userId)
    urls =  db.session.query(OnlyUpdatesUrls.urls).filter_by(userId=userId).first()
    db.session.commit()
    print("HALLO SVENJA :)", urls)
    statuscode = 200
    print(urls)
    return jsonify({'urls' : urls}), statuscode

@app.route('/status/<task_id>')
def taskstatus(task_id):
    task = processing.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        response = task.get()
        print("DER TYPUS", type(response[len(response)-1]), response)
        if isinstance(response[len(response)-1], int):
        # if response[len(response)-1].isdigit():
            global wordCount
            wordCount = int(response[len(response)-1])
            response.pop()
            print("gepoppt", response)
            print(wordCount)
    else:
        response = None
    return jsonify({'data' : response})

@app.route('/status/<task_id>')
def segmentationstatus(task_id):
    task = segmentate_pp.AsyncResult(task_id)
    print("hooray")
    if task.state == 'SUCCESS':
        print("hooray")
        response = task.get()
    else:
        response = None
    return jsonify({'data' : response})


@celery.task(name='segmentation')
def segmentate_pp(url):
    segments = segmenterer.segmentatePP(url)
    return segments

@celery.task(name='prediction')
def processing(jsonData):
    predictions = predictor.predict(jsonData)
    return predictions


if __name__ == "__main__":
    app.run(debug=True)
