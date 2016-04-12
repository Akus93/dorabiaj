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


class Opinion(db.EmbeddedDocument):
    owner = db.ReferenceField(User)
    owner_nick = db.StringField()
    description = db.StringField()
    rank = db.IntField()
    category = db.StringField()
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)


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
    opinions = db.EmbeddedDocument(Opinion)
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)

    def get_full_name(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def __str__(self):
        return self.username

    meta = {
        'indexes': ['pk']
    }


class Province(db.Document):
    name = db.StringField()


class Category(db.Document):
    name = db.StringField()


class Offer(db.EmbeddedDocument):
    owner = db.ReferenceField(User)
    owner_nick = db.StringField()
    price = db.FloatField()
    is_accepted = db.BooleanField(default=False)
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)


class Classified(db.Document):
    title = db.StringField(required=True)
    owner = db.ReferenceField(User)
    owner_nick = db.StringField()
    description = db.StringField(required=True)
    budget = db.FloatField()
    province = db.StringField()
    city = db.StringField()
    category = db.StringField()
    begin_date = db.DateTimeField()
    end_date = db.DateTimeField()
    offers = db.EmbeddedDocumentField(Offer)
    phone = db.StringField()
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)

