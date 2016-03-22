import datetime
from flask import url_for
from .app import db


class Comment(db.EmbeddedDocument):
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)
    body = db.StringField(verbose_name="Comment", required=True)
    author = db.StringField(verbose_name="Name", max_length=255, required=True)

    def __str__(self):
        return self.body


class Post(db.Document):
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)
    title = db.StringField(max_length=255, required=True)
    slug = db.StringField(max_length=255, required=True)
    body = db.StringField(required=True)
    comments = db.ListField(db.EmbeddedDocumentField('Comment'))

    def get_absolute_url(self):
        return url_for('post', kwargs={"slug": self.slug})

    def __unicode__(self):
        return self.title

    meta = {
        'allow_inheritance': True,
        'indexes': ['-created_at', 'slug'],
        'ordering': ['-created_at']
    }


class User(db.Document):
    username = db.StringField(max_length=50, min_length=5, required=True)
    password = db.StringField(required=True)
    email = db.EmailField(max_length=64, required=True)
    first_name = db.StringField(max_length=64, required=True)
    last_name = db.StringField(max_length=64, required=True)
    city = db.StringField(max_length=64, required=True)
    interests = db.ListField()
    tokens = db.IntField(default=0, require=True)
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)

    def get_absolute_url(self):
        return url_for('user_info', kwargs={"user": self.username})

    def __str__(self):
        return self.username

    meta = {
        'allow_inheritance': True,
        'indexes': ['-created_at'],
        'ordering': ['-created_at']
    }

