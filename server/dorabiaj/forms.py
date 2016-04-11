from .models import User


class Form:
    def __init__(self, data):
        try:
            self.fields
        except AttributeError:
            self.fields = None
        try:
            self.required
        except AttributeError:
            self.required = []
        try:
            self.max_length
        except AttributeError:
            self.max_length = {}
        try:
            self.min_length
        except AttributeError:
            self.min_length = {}
        self.data = data
        self.error = {}
        self.cleaned_data = {}
        for key, value in self.data.items():
            self.cleaned_data[key] = self.clean(value)
        self.check_all()

    def clean(self, value):
        cleaned = value.strip()
        return cleaned

    def is_vailid(self):
        if self.error:
            return False
        return True

    def check_required(self):
        for key, value in self.cleaned_data.items():
            if not value and key in self.required:
                try:
                    self.error[key] = self.error_message[key]['required']
                except KeyError:
                    self.error[key] = 'Uzupełnij pole'

    def check_max_length(self):
            if self.max_length:
                for key, value in self.max_length.items():
                    if not self.error.get(key):
                        if len(self.cleaned_data[key]) > value:
                            try:
                                self.error[key] = self.error_message[key]['max_length']
                            except KeyError:
                                self.error[key] = 'Pole posiada za duza liczbe znaków. Maksymalnie {}.'.format(value)

    def check_min_length(self):
        if self.min_length:
            for key, value in self.min_length.items():
                if not self.error.get(key):
                    if len(self.cleaned_data[key]) < value:
                        try:
                            self.error[key] = self.error_message[key]['min_length']
                        except KeyError:
                            self.error[key] = 'Pole posiada za małą liczbe znaków. Minimalnie {}.'.format(value)

    def check_all(self):
        self.check_required()
        self.check_max_length()
        self.check_min_length()

    def get_errors(self):
        return self.error

    def data_to_save(self):
        if self.fields:
            result = {}
            for key, value in self.cleaned_data.items():
                if key in self.fields:
                    result[key] = value
            return result
        else:
            return self.cleaned_data

    def save(self):
        data = self.data_to_save()
        self.model(**data).save()


class RegisterForm(Form):

    model = User
    fields = ['username', 'password', 'email', 'first_name', 'last_name', 'city']
    required = ['username', 'password', 'password2', 'email', ]
    max_length = {'username': 50, }
    min_length = {'email': 5, }
    error_message = {
        'username': {
            'required': 'Wpisz poprawny nick!'
        }
    }

    def check_password(self):
        if self.cleaned_data['password'] != self.cleaned_data['password2']:
            if not self.error.get('password'):
                self.error['password'] = 'Hasła nie są takie same'

    def check_all(self):
        super(RegisterForm, self).check_all()
        self.check_password()

    def save(self):
        super(RegisterForm, self).save()
