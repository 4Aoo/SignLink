from django.shortcuts import render

def index(request):
    return render(request, 'Home.html')  # 渲染模板
def login_view(request):
    """渲染Login.html页面"""
    return render(request, 'Login.html')
def register_view(request):
    """渲染Register.html页面"""
    return render(request, 'Register.html')