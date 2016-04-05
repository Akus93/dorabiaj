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
    try:
        DBSession.objects.get(pk=session.sid).delete()
    except User.DoesNotExist:
        pass
    session.clear()
    return redirect(url_for('index'))


@app.route('/signup', methods=['GET'])
def get_signup():
    return render_template('signup.html')


@app.route('/signup', methods=['POST'])
def post_signup():
    '''
    Bardzo prosta rejestracja, wymaga usprawnień
    '''
    username = request.form['username']
    password = request.form['password']
    password2 = request.form['password2']
    email = request.form['email']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    city = request.form['city']
    if password != password2:
        error = {'error': 'Hasła nie są takie same'}
        return Response(json.dumps(error), status=400, content_type='application/json')  # TODO bad status
    if User.objects.filter(username=username).count():
        error = {'error': 'Username jest już zajęty'}
        return Response(json.dumps(error), status=400, content_type='application/json')  # TODO bad status
    new_user = User(username=username, password=password, email=email,
                    first_name=first_name, last_name=last_name, city=city)
    new_user.save()
    return Response(new_user.to_json(), status=200, content_type='application/json')


@app.route('/delete-old-sessions', methods=['GET'])
def delete_old_sessions():
    """
    Usuwa stare wpisy sesji z bazy danych.
    Powina być wywoływana z crona (czy czegoś podobnego w działaniu) raz dziennie.
    """
    old_sessions = DBSession.objects.filter(expiration__lte=datetime.now())
    old_sessions.delete()
    return redirect(url_for('index'))

