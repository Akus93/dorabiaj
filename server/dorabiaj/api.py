from flask import session, request, Response, redirect, url_for, render_template, json
from datetime import datetime
from werkzeug.security import check_password_hash

from . import app
from .models import User, DBSession, Classified, Category
from .functions import is_authorized, get_user, login_required, crossdomain, admin_required
from .forms import RegisterForm, ClassifiedForm, CategoryForm


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
def get_classifieds(id=None):
    try:
        classifieds = Classified.objects.all().order_by('-created_at')
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszen'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(classifieds.to_json(), status=200, content_type='application/json')


@app.route('/classified/<id>', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def get_classified(id):
    try:
        classified = Classified.objects.get(id=id)
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszenia'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(classified.to_json(), status=200, content_type='application/json')

@app.route('/classified/<id>', methods=['GET', 'DELETE'])
@crossdomain(origin='http://localhost:5555')
def delete_classified(id):
    try:
        classified = Classified.objects.get(id=id).delete()
    except Classified.DoesNotExist:
        pass
    return Response(json.dumps({'success': True}), content_type='application/json')


@app.route('/classified/<id>', methods=['GET', 'PUT'])
@crossdomain(origin='http://localhost:5555')
def update_classified(id):
    try:
        classified = Classified.objects.get(id=id)
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszenia'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    #walidacja formularza edycji
    form = ClassifiedForm(request.form)
    if form.is_vailid():
        try:
            classified.title = form.data['title']
            classified.description = form.data['description']
            classified.budget = float(form.data['budget'])
            classified.province = form.data['province']
            classified.city = form.data['city']
            classified.category = form.data['category']
            classified.begin_date = form.data['begin_date']
            classified.end_date = form.data['end_date']
            classified.phone = form.data['phone']
            classified.save()
        except:
            error = {'error': 'Edycja nie powiodla sie'}
            return Response(json.dumps(error), status=200, content_type='application/json')

        return Response(json.dumps({'success': True}), content_type='application/json')

    else:
        error = {'error': 'Blednie wypelniony formularz'}
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/classified', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
@login_required
def post_classified():
    form = ClassifiedForm(request.form)
    if form.is_vailid():
        #form.owner = session['user']
        #print(session['user'])
        form.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/admin', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
@login_required
@admin_required
def admin():
    pass


@app.route('/user/<username>', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def get_user(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        error = {'error': 'Nie ma takiego użytkownika'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    user_info = {'username': user.username, 'email': user.email, 'firstName': user.first_name, 'interests': user.interests,
                 'lastName': user.last_name, 'city': user.city, 'admin': user.is_superuser, 'tokens': user.tokens,
                 'opinions': user.opinions}
    return Response(json.dumps(user_info), status=200, content_type='application/json')


@app.route('/categories', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
def get_categories():
    try:
        categories = Category.objects.all()
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszen'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(categories.to_json(), status=200, content_type='application/json')

'''
gdy chcemy dodać kategorie
@app.route('/category', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
def post_cattegory():
    form = CategoryForm(request.form)
    if form.is_vailid():
        form.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')
'''
