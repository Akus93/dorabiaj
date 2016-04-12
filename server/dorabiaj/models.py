import datetime
from dorabiaj import db


class DBSession(db.Document):
    sid = db.StringField(primary_key=True)
    data = db.DictField()
    expiration = db.DateTimeField()
    meta = {
        'allow_inheritance': False,
        'collection': 'session',
        'indexes': [{'fields': ['expiration'],
                     'expireAfterSeconds': 60 * 60 * 24 * 7 * 31}]
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
    is_superuser = db.BooleanField(default=False, require=True)
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)

    def get_full_name(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def __str__(self):
        return self.username

    meta = {
        'indexes': ['pk']
    }


class Content(db.EmbeddedDocument):
    text = db.StringField()
    lang = db.StringField(max_length=3)


class Post(db.Document):
    # title = db.StringField(max_length=120, required=True, validators=[validators.InputRequired(message=u'Missing title.'),])
    title = db.StringField(max_length=120, required=True)
    author = db.ReferenceField(User)
    tags = db.ListField(db.StringField(max_length=30))
    content = db.EmbeddedDocumentField(Content)
