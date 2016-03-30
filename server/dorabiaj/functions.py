from flask import session
from .models import User
from functools import wraps
from flask import redirect, url_for


def login_required(f):
    """
    Dekorator wymuszający bycie zalogowanym.
    Używać wszędzie tam gdzie wymagany będzie zalogowany użytkownik.
    Sposób użycia: @login_required zaraz pod @app.route(...)
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_authorized():
            return redirect(url_for('get_login'))
        return f(*args, **kwargs)
    return decorated_function


def get_user():
    """
    :return User instancja zalogowanego użytkownika
    """
    return User.objects.get_or_404(pk=session['user'])


def is_authorized():
    """
    Sprawdza czy użytkownik jest zalogowany
    :return bool
    """
    return True if 'user' in session else False
