from flask import session, request, Response, redirect, url_for, render_template, json
from datetime import datetime
from werkzeug.security import check_password_hash

from . import app
from .models import User, DBSession
from .functions import is_authorized, get_user, login_required, crossdomain
from .forms import RegisterForm


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
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        error = {'error': 'Invalid username'}
        return Response(json.dumps(error), status=422, content_type='application/json')
    if not check_password_hash(user.password, password):
        error = {'error': 'Wrong password'}
        return Response(json.dumps(error), status=422, content_type='application/json')
    session['user'] = user.id
    return Response(user.to_json(), status=200, content_type='application/json')


@app.route('/login', methods=['GET', 'OPTIONS'])
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
    form = RegisterForm(request.form)
    if form.is_vailid():
        user = form.save()
        return Response(user.to_json(), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=400, content_type='application/json')


@app.route('/delete-old-sessions', methods=['GET'])
def delete_old_sessions():
    """
    Usuwa stare wpisy sesji z bazy danych.
    Powina być wywoływana z crona (czy czegoś podobnego w działaniu) raz dziennie.
    """
    old_sessions = DBSession.objects.filter(expiration__lte=datetime.now())
    old_sessions.delete()
    return redirect(url_for('index'))


@app.route('/ajax', methods=['GET'])
@crossdomain(origin='*')
def ajax():
    return Response(json.dumps({'test': 'value'}), status=200, content_type='application/json')


@app.route('/ajax-post', methods=['POST'])
# @crossdomain(origin='*')
def post_ajax():
    a = 'asdsad'
    response = Response(json.dumps({'asd': 'asdd'}), status=200, content_type='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


