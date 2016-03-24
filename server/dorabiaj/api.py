from flask import session, escape, request, redirect, url_for, render_template, jsonify
from . import app
from .models import User, DBSession
from datetime import datetime


@app.route('/')
def index():
    if 'user' in session:
        user = User.objects.get(id=session['user'])
        return 'Logged in as {}'.format(user.get_full_name())
    return 'You are not logged in'


@app.route('/login', methods=['POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        try:
            user = User.objects.get(username=username, password=password)
        except User.DoesNotExist:
            error = 'Invalid username or password'
            return jsonify(error=error)
        session['user'] = user.id
        return user.to_json()
    return jsonify(error=error)


@app.route('/login', methods=['GET'])
def login_get():
    return render_template('login.html')


@app.route('/logout', methods=['GET'])
def logout():
    DBSession.objects.get(pk=session.sid).delete()
    session.clear()
    return redirect(url_for('index'))


@app.route('/delete-old-sessions', methods=['GET'])
def delete_old_sessions():
    old_sessions = DBSession.objects.filter(expiration__lte=datetime.now())
    old_sessions.delete()
    return redirect(url_for('index'))

