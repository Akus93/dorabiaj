from flask import session, request, Response, redirect, url_for, json, render_template
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash

from . import app
from .models import User, DBSession, Classified, Category, Offer, Opinion
from .functions import is_authorized, get_user, login_required, crossdomain, pl_to_en, transfer_tokens
from .forms import RegisterForm, ClassifiedForm, UserForm, PasswordForm


@app.route('/')
def index():
    if is_authorized():
        return 'Logged in as {}'.format(get_user().get_full_name())
    return 'You are not logged in'


@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return render_template('login.html', error='Nie ma takiego użytkownika')
        if not check_password_hash(user.password, password):
            return render_template('login.html', error='Złe hasło')
        if not user.is_superuser:
            return render_template('login.html', error='Nie masz uprawnień')
        session['user'] = user.id
        return redirect('/admin/')


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


@app.route('/logout', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def logout():
    try:
        DBSession.objects.get(pk=session.sid).delete()
    except DBSession.DoesNotExist:
        print('Błąd wylogowania!!!')
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


@app.route('/classified/<id>', methods=['DELETE', 'OPTIONS'])
@crossdomain(origin='http://localhost:5555')
@login_required
def delete_classified(id):
    user = get_user()
    try:
        Classified.objects.get(id=id, owner=user).delete()
    except Classified.DoesNotExist:
        pass
    return Response(json.dumps({'success': True}), content_type='application/json')


@app.route('/classified/inappropriate/<id>', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
@login_required
def set_classified_as_inappropriate(id):
    try:
        classified = Classified.objects.get(id=id)
    except Classified.DoesNotExist:
        pass

    classified.is_inappropriate = True
    classified.save()
    return Response(json.dumps({'success': True}), content_type='application/json')


@app.route('/classified/<id>', methods=['PUT'])
@crossdomain(origin='http://localhost:5555')
def update_classified(id):
    try:
        classified = Classified.objects.get(id=id)
    except Classified.DoesNotExist:
        error = {'error': 'Brak ogloszenia'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    # walidacja formularza edycji
    form = ClassifiedForm(request.form, user=get_user())
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
    form = ClassifiedForm(data=request.form, user=get_user())
    if form.is_vailid():
        form.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/myclassifieds', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
@login_required
def my_classifields():
    user = get_user()
    classifieds = Classified.objects.filter(owner=user).order_by('-created_at')
    if not classifieds:
        error = {'error': 'Brak ogloszen'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(classifieds.to_json(), status=200, content_type='application/json')


@app.route('/user/<username>', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
def get_userinfo(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        error = {'error': 'Nie ma takiego użytkownika'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    user_info = {'username': user.username, 'email': user.email, 'firstName': user.first_name, 'interests': user.interests,
                 'lastName': user.last_name, 'city': user.city, 'admin': user.is_superuser, 'tokens': user.tokens,
                 'opinions': user.opinions}
    return Response(json.dumps(user_info), status=200, content_type='application/json')


@app.route('/myuser', methods=['GET'])
@crossdomain(origin='http://localhost:5555')
@login_required
def get_myuserinfo():
    try:
        user = get_user()
    except User.DoesNotExist:
        error = {'error': 'Nie ma takiego użytkownika'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    user_info = {'username': user.username, 'email': user.email, 'firstName': user.first_name, 'interests': user.interests,
                 'lastName': user.last_name, 'city': user.city, 'admin': user.is_superuser, 'tokens': user.tokens,
                 'opinions': user.opinions, 'ranks': user.ranks}
    return Response(json.dumps(user_info), status=200, content_type='application/json')


@app.route('/myuser/password', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
@login_required
def update_myuserpassword():
    user = get_user()

    form = PasswordForm(data=request.form)
    # walidacja formularza edycji
    if form.is_vailid():
        oldpassword = form.cleaned_data['oldpassword']
        #sprawdzenie czy obecne hasła uzytwkonika sie zgadzaja
        if not check_password_hash(user.password, oldpassword):
            error = {'error': "Nieprawidłowe stare hasło"}
            return Response(json.dumps(error), status=200, content_type='application/json')
        #sprawdzenie poprawnosci nowego hasla
        if form.cleaned_data['password'] != form.cleaned_data['confirmpassword']:
            error = {'error': "Hasła nie są takie same"}
            return Response(json.dumps(error), status=200, content_type='application/json')
        #wygenerowanie nowego hasla
        user.password = generate_password_hash(form.cleaned_data['password'])
        user.save()
        return Response(json.dumps({'success': True}), content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/changeMyUser', methods=['POST'])
@crossdomain(origin='http://localhost:5555')
@login_required
def update_myuserinfo():
    user = get_user()
    # walidacja formularza edycji
    form = UserForm(data=request.form)
    if form.is_vailid():
        user.first_name = form.cleaned_data['first_name']
        user.last_name = form.cleaned_data['last_name']
        user.city = form.cleaned_data['city']
        interest = request.form['interest']
        user.interests.append(interest)
        user.save()
        return Response(json.dumps({'success': True}), content_type='application/json')
    else:
        error = form.get_errors()
        return Response(json.dumps(error), status=200, content_type='application/json')


@app.route('/categories', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
def get_categories():
    try:
        categories = Category.objects.all()
    except Classified.DoesNotExist:
        error = {'error': 'Brak kategorii'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(categories.to_json(), status=200, content_type='application/json')


@app.route('/search/<city>/<category>', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
def search(city, category):
    city = pl_to_en(city)
    results = Classified.objects.filter(city__iexact=city, category=category)
    if not results:
        error = {'error': 'Brak ogloszeń spełniających Twoje kryteria.'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    return Response(results.to_json(), status=200, content_type='application/json')


@app.route('/offer/add', methods=['POST'])
@crossdomain(origin="http://localhost:5555")
@login_required
def add_offer():
    classified_id = request.form['classifiedId']
    owner_nick = get_user().username
    price = request.form['price']
    try:
        classified = Classified.objects.get(pk=classified_id)
    except Classified.DoesNotExist:
        return Response(json.dumps({'error': 'Nie ma takiego ogłoszenia'}), status=200, content_type='application/json')
    if float(price) < 0:
        return Response(json.dumps({'error': 'Niepoprawna kwota'}), status=200, content_type='application/json')
    if float(price) > classified.budget:
        return Response(json.dumps({'error': 'Za duża kwota'}), status=200, content_type='application/json')
    new_offer = Offer(owner_nick=owner_nick, price=price)
    try:
        Classified.objects.get(pk=classified_id, offers__owner_nick=owner_nick)
        Classified.objects(pk=classified_id, offers__owner_nick=new_offer.owner_nick).update_one(set__offers__S=new_offer)
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    except Classified.DoesNotExist:
        classified.offers.append(new_offer)
        classified.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')


@app.route('/offer/select', methods=['POST'])
@crossdomain(origin="http://localhost:5555")
@login_required
def select_offer():
    classified_id = request.form['classifiedId']
    user_nick = request.form['username']
    owner = get_user()
    if Classified.objects(pk=classified_id, offers__is_accepted=True).count():
        return Response(json.dumps({'error': 'Już wybrano oferte.'}), status=200, content_type='application/json')
    try:
        classified = Classified.objects(pk=classified_id, offers__owner_nick=user_nick).update(set__offers__S__is_accepted=True)
    except Classified.DoesNotExist:
        return Response(json.dumps({'error': 'Nie ma takiej oferty'}), status=200, content_type='application/json')
    return Response(json.dumps({'success': True}), status=200, content_type='application/json')


@app.route('/myoffers/accepted', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
@login_required
def my_accepted_offers():
    user = get_user()
    classifieds = Classified.objects(offers__is_accepted=True, offers__owner_nick=user.username)
    if not classifieds:
        return Response(json.dumps({'error': 'Nie masz żadnych ofert.'}), status=200, content_type='application/json')
    else:
        return Response(classifieds.to_json(), status=200, content_type='application/json')


@app.route('/myoffers/unaccepted', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
@login_required
def my_unaccepted_offers():
    user = get_user()
    classifieds = Classified.objects(offers__is_accepted=False, offers__owner_nick=user.username)
    if not classifieds:
        return Response(json.dumps({'error': 'Nie masz żadnych ofert.'}), status=200, content_type='application/json')
    else:
        return Response(classifieds.to_json(), status=200, content_type='application/json')


@app.route('/pay', methods=['POST'])
@crossdomain(origin="http://localhost:5555")
@login_required
def pay():
    classified_id = request.form['classifiedId']
    user_nick = request.form['username']
    user = User.objects.get(username=user_nick)
    owner = get_user()
    classified = Classified.objects.get(pk=classified_id)
    tokens = None
    for offer in classified.offers:
        if offer.owner_nick == user_nick:
            tokens = offer.price
            break
    if transfer_tokens(owner, user, tokens, classified.category):
        classified.is_paid = True
        classified.save()
        return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    else:
        return Response(json.dumps({'error': 'Wystąpił błąd, spróbuj jeszcze raz.'}), status=200, content_type='application/json')


#not working yet
@app.route('/opinion', methods=['POST'])
@crossdomain(origin="http://localhost:5555")
@login_required
def add_opinion():
    try:
        classified_id = request.form['classifiedId']
        print(classified_id)
        description = request.form['description']
        print(description)
        string_rank = request.form['rank']

        rank =  int(string_rank)
        owner = get_user()
    except:
        return Response(json.dumps({'error': 'Błąd danych'}), status=200, content_type='application/json')

    classified = Classified.objects(id=classified_id, offers__is_accepted = True)

    if not classified:
        return Response(json.dumps({'error': 'Nie ma takiego ogłoszenia'}), status=200, content_type='application/json')

    try:
        # classified.objects.filter({ offers: { $elemMatch: { is_accepted: True } } })
        accepted_user = classified.offers[0].owner_nick

        print(accepted_user)
        category = classified.category
        print(category)
        new_opinion = Opinion(owner_nick=owner.username, description=description, rank=rank, category=category)
        print(new_opinion)
        accepted_user.opinions.append(new_opinion)
        accepted_user.save()
    except:
        return Response(json.dumps({'error': 'Nie dodano opinii.'}), status=200, content_type='application/json')
    try:
        classified.delete()
    except:
        return Response(json.dumps({'error': 'Nie usinięto ogłoszenie po dodaniu opinii.'}), status=200, content_type='application/json')

    return Response(json.dumps({'success': True}), status=200, content_type='application/json')

@app.route('/opinions/<username>', methods=['GET'])
@crossdomain(origin="http://localhost:5555")
#@login_required
def get_user_opinion(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        error = {'error': 'Nie ma takiego użytkownika'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    opinions = user.opinions
    if not opinions:
        error = {'error': 'Nie ma żadnych opinii'}
        return Response(json.dumps(error), status=200, content_type='application/json')
    #print(user.opinions)
    #print(user)
    #return Response(json.dumps({'success': True}), status=200, content_type='application/json')
    return Response(opinions.to_json(), status=200, content_type='application/json')
