from django import forms
from users.models import CustomUser
from .models import UserProfile

# 表单上传更新
class ProfileUpdateForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True)
    avatar = forms.ImageField(required=False)
    personal_background = forms.ImageField(required=False)
    page_background = forms.ImageField(required=False)
    bio = forms.CharField(widget=forms.Textarea, required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'avatar']
