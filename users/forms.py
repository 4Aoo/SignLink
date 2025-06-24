from django import forms
from .models import CustomUser
from django.contrib.auth.hashers import make_password
import re
from django.core.exceptions import ValidationError


class LoginForm(forms.Form):
    username = forms.CharField(
        label="用户名",
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '请输入用户名',
        })
    )
    password = forms.CharField(
        label="密码",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': '请输入密码',
        })
    )


class RegistrationForm(forms.ModelForm):
    password_confirm = forms.CharField(
        label="确认密码",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': '请再次输入密码'
        })
    )
    email = forms.EmailField(
        label="邮箱",
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': '请输入邮箱'
        })
    )
    agreed_terms = forms.BooleanField(
        required=True,
        label="我已阅读并同意服务条款",
        error_messages={"required": "必须同意服务条款"},
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '请输入用户名'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': '请输入邮箱'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '请输入密码'}),
        }

    def clean_password(self):
        password = self.cleaned_data['password']
        pattern = r'^[A-Za-z\d]{8,}$'  # 至少8位，只包含英文字母和数字
        if not re.match(pattern, password):
            raise ValidationError("密码必须为至少8位的字母和数字组合")
        return password


    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError("两次输入的密码不一致")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(password=self.cleaned_data['password'])
        if commit:
            user.save()
        return user
    def clean_email(self):
        email = self.cleaned_data['email']  
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("该邮箱已被注册")
        return email
