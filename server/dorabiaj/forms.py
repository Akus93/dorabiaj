class Form:
    def __init__(self, fields):
        self.fields = fields
        self.error = {}
        self.cleaned_data = {}
        for key, value in self.fields.items():
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

    def check_all(self):
        self.check_required()


class RegisterForm(Form):

    required = ['username', 'password', 'password2', 'email']
    error_message = {
        'username': {
            'required': 'Wpisz poprawny nick!'
        }
    }

    def check_password(self):
        if self.cleaned_data['password'] != self.cleaned_data['password2']:
            self.error['password'] = 'Hasła nie są takie same'

    def check_all(self):
        super(RegisterForm, self).check_all()
        self.check_password()





