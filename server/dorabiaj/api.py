from flask import session, request, Response, redirect, url_for, render_template, json
from datetime import datetime
from werkzeug.security import check_password_hash

from . import app
from .models import User, DBSession, Classified
from .functions import is_authorized, get_user, login_required, crossdomain
from .forms import RegisterForm, ClassifiedForm


@app.route('/')
def index():
    if is_authorized():
        return 'Logged in as {}'.format(get_user().get_full_name())
    return 'You are not logged in'


@app.route('/login', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def get_login():
    return render_template('login.html')


@app.route('/login', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
def post_login():
    req = request
    username = request.form['username']
    password = request.form['password']
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        error = {'error': 'Niepoprawny login'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    if not check_password_hash(user.password, password):
        error = {'error': 'Zle hasło'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    session['user'] = user.id
    return Response(user.to_json(), status=200, content_type='application/json')


@app.route('/logout', methods=['GET', 'DELETE'])
@crossdomain(origin='http://localhost:5555')
def logout():
    try:
        DBSession.objects.get(pk=session.sid).delete()
    except DBSession.DoesNotExist:
        pass
    session.clear()
    return Response(json.dumps({'success': True}), content_type='application/json')


@app.route('/signup', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
def post_signup():
    form = RegisterForm(request.form)
    if form.is_vailid():
        form.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/delete-old-sessions', methods=['GET'])
def delete_old_sessions():
    """
    Usuwa stare wpisy sesji z bazy danych.
    Powina być wywoływana z crona (czy czegoś podobnego w działaniu) raz dziennie.
    """
    old_sessions = DBSession.objects.filter(expiration__lte=datetime.now())
    old_sessions.delete()
    return redirect(url_for('index'))


@app.route('/classifieds', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def get_classifieds():
    try:
        classifieds = Classified.objects.all()
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszen'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(classifieds.to_json(), status=200, content_type='application/json')


@app.route('/classified', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
def post_classified():
    form = ClassifiedForm(request.form)
    if form.is_vailid():
        form.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')

