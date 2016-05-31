from flask import session, Response
from .models import User, Rank
from functools import wraps
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from json import dumps


def login_required(f):
    """
    Dekorator wymuszający bycie zalogowanym.
    Używać wszędzie tam gdzie wymagany będzie zalogowany użytkownik.
    Sposób użycia: @login_required zaraz pod @app.route(...)
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_authorized():
            return Response(dumps({'error': 'Musisz być zalogowany'}), status=200, content_type='application/json')
        return f(*args, **kwargs)
    return decorated_function


def get_user():
    """
    :return User instancja zalogowanego użytkownika
    """
    try:
        user = User.objects.get(pk=session['user'])
    except User.DoesNotExist:
        return False
    return user


def is_authorized():
    """
    Sprawdza czy użytkownik jest zalogowany
    :return bool
    """
    return True if 'user' in session else False


def is_admin():
    if User.objects.get_or_404(pk=session['user']).is_superuser:
        return True
    return False


def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_admin():
            return Response(dumps({'error': 'Nie masz uprawnień'}), status=200, content_type='application/json')
        return f(*args, **kwargs)
    return decorated_function


def pl_to_en(word):
    return word.translate(str.maketrans("ąćęłńóśżźĄĆĘŁŃÓŚŻŹ", "acelnoszzACELNOSZZ"))


def transfer_tokens(_from, _to, tokens, category):
    if _from.tokens >= tokens:
        _from.tokens -= tokens
        _to.tokens += tokens
        found = False
        for rank in _to.ranks:
            if rank.category == category:
                rank.points += tokens
                found = True
        if not found:
            new_rank = Rank(category=category, points=tokens)
            _to.ranks.append(new_rank)
        _to.save()
        _from.save()
        return True
    return False

