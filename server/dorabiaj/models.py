import datetime
from flask import url_for
from dorabiaj import db


class User(db.Document):
    username = db.StringField(max_length=50, min_length=5, required=True)
    password = db.StringField(required=True)
    email = db.EmailField(max_length=64, required=True)
    first_name = db.StringField(max_length=64, required=True)
    last_name = db.StringField(max_length=64, required=True)
    city = db.StringField(max_length=64, required=True)
    interests = db.ListField()
    tokens = db.IntField(default=0, require=True)
    is_superuser = db.BooleanField(default=False, require=True)
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)

    def get_full_name(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def __str__(self):
        return self.username

    meta = {
        'indexes': ['pk']
    }
