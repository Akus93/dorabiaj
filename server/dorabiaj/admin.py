from flask import url_for, request
import flask_admin as admin
from flask_admin.form import rules
from flask_admin.contrib.mongoengine import ModelView
from werkzeug.utils import redirect

from .functions import is_authorized, is_admin


class UserView(ModelView):
    column_filters = ['username', ]
    column_searchable_list = ('username', 'last_name',)
    column_exclude_list = ['password', ]
    column_editable_list = ['is_superuser']
    can_view_details = True
    can_export = True
    page_size = 10

    def is_accessible(self):
        if is_authorized():
            if is_admin():
                return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))


class ProvinceView(ModelView):
    column_filters = ['name', ]
    can_export = True
    page_size = 10

    def is_accessible(self):
        if is_authorized():
            if is_admin():
                return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))


class CategoryView(ModelView):
    column_filters = ['name', ]
    can_export = True
    page_size = 10

    def is_accessible(self):
        if is_authorized():
            if is_admin():
                return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))


class ClassifiedView(ModelView):
    column_filters = ['created_at', 'budget', 'begin_date', 'end_date', ]
    column_exclude_list = ['owner_nick', ]
    column_searchable_list = ['owner_nick', 'title', ]
    can_export = True
    can_view_details = True
    page_size = 10

    def is_accessible(self):
        if is_authorized():
            if is_admin():
                return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))



