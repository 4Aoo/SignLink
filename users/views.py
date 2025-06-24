import uuid
from django.views.generic.edit import CreateView
from .forms import RegistrationForm, LoginForm
from .models import CustomUser
from django.urls import reverse_lazy
from django.contrib import messages  # 可选：添加注册成功提示
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return redirect('home')


def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.activation_token = uuid.uuid4().hex
            user.save()
            messages.success(request, "注册成功！请登录")
            return redirect('login')
    else:
        form = RegistrationForm()
    
    return render(request, 'register.html', {'form': form})
    
    
def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')

    form = LoginForm(request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            username = form.cleaned_data['username'].strip()
            password = form.cleaned_data['password'].strip()

            # 检查用户名是否存在
            if not CustomUser.objects.filter(username=username).exists():
                messages.error(request, "该用户名未注册")
            else:
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        return redirect('home')
                    else:
                        messages.error(request, "账户已被禁用，请联系管理员")
                else:
                    messages.error(request, "密码错误，请重新输入")
        else:
            messages.error(request, "请输入完整的用户名和密码")

    return render(request, 'Login.html', {'form': form})