from flask import session, escape, request, redirect, url_for, render_template
from . import app
from .models import User


@app.route('/')
def index():
    if 'user' in session:
        user = User.objects.get(id=session['user'])
        return 'Logged in as {}'.format(user.get_full_name())
    return 'You are not logged in'


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        try:
            user = User.objects.get(username=username, password=password)
        except User.DoesNotExist:
            error = 'Invalid username or password'
            return render_template('login.html', error=error)
        session['user'] = user.id
        return redirect(url_for('index'))
    return render_template('login.html', error=error)


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))
