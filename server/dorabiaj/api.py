from flask import session, escape, request, redirect, url_for, render_template, jsonify
from . import app
from .models import User, DBSession


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


@app.route('/logout')
def logout():
    DBSession.objects.get(pk=session.sid).delete()
    session.clear()
    return redirect(url_for('index'))
