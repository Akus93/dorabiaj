from flask import session, escape, request, Response, redirect, url_for, render_template, json
from datetime import datetime

from . import app
from .models import User, DBSession
from .functions import is_authorized, get_user, login_required


@app.route('/')
def index():
    if is_authorized():
        return 'Logged in as {}'.format(get_user().get_full_name())
    return 'You are not logged in'


@app.route('/login', methods=['POST'])
def post_login():
    username = request.form['username']
    password = request.form['password']
    try:
        user = User.objects.get(username=username, password=password)
    except User.DoesNotExist:
        error = {'error': 'Invalid username or password'}
        return Response(json.dumps(error), status=422, content_type='application/json')
    session['user'] = user.id
    return Response(user.to_json(), status=200, content_type='application/json')


@app.route('/login', methods=['GET'])
def get_login():
    return render_template('login.html')


@app.route('/logout', methods=['GET', 'DELETE'])
def logout():
    DBSession.objects.get(pk=session.sid).delete()
    session.clear()
    return redirect(url_for('index'))


@app.route('/delete-old-sessions', methods=['GET'])
def delete_old_sessions():
    """
    Usuwa stare wpisy sesji z bazy danych.
    Powina być wywoływana z crona (czy czegoś podobnego w działaniu) raz dziennie.
    """
    old_sessions = DBSession.objects.filter(expiration__lte=datetime.now())
    old_sessions.delete()
    return redirect(url_for('index'))

