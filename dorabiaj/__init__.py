from flask import Flask
from flask.ext.mongoengine import MongoEngine

app = Flask(__name__)

app.config['MONGODB_DB'] = 'dorabiajdb'
app.config['MONGODB_HOST'] = 'ds013579.mlab.com'
app.config['MONGODB_PORT'] = 13579
app.config['MONGODB_USERNAME'] = 'admin'
app.config['MONGODB_PASSWORD'] = '12345678'
app.config["SECRET_KEY"] = "KeepThisS3cr3t"

db = MongoEngine(app)

from .api import *
