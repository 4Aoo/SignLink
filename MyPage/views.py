from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ProfileUpdateForm
from .models import UserProfile, Follow
from Community.models import Like, Comment, Post
from users.models import CustomUser
from Schedule.models import Event, Task
from datetime import datetime, timedelta
from django.http import JsonResponse


@login_required(login_url='login')
def my_page_view(request):
    # 当前登录用户
    user = request.user
    profile = user.profile

    # 上传、修改资料
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            # 保存 username（avatar 字段不能自动保存）
            user.username = form.cleaned_data.get('username', user.username)
            if request.FILES.get('avatar'):
                user.avatar = request.FILES['avatar']  # ✅ 手动保存头像
            user.save()

            # 更新 UserProfile 的字段
            profile.bio = request.POST.get('bio', '')
            if 'personal_background' in request.FILES:
                profile.personal_background = request.FILES['personal_background']
            if 'page_background' in request.FILES:
                profile.page_background = request.FILES['page_background']
            profile.save()

            return redirect('my_page')

    else:
        form = ProfileUpdateForm(instance=user)

    # 我关注的人
    follows = Follow.objects.filter(follower=user).select_related('followed')

    # 我的帖子
    my_posts = Post.objects.filter(user=user).order_by('-created_at')

    # 我的点赞
    liked_posts = Post.objects.filter(like__user=user).distinct()

    # 我的收藏
    favorited_posts = Post.objects.filter(favorite__user=user).distinct()

    # 通知：别人点赞/评论了我的帖子
    recent_likes = Like.objects.filter(post__user=user).exclude(user=user).select_related('user', 'post').order_by('-created_at')[:10]
    recent_comments = Comment.objects.filter(post__user=user).exclude(user=user).select_related('user', 'post').order_by('-created_at')[:10]

    # 获取今天以后的最近3条日程
    now = datetime.now()

    upcoming_events = Event.objects.filter(user=request.user).filter(
        date__gt=now.date()
    ) | Event.objects.filter(
        user=request.user,
        date=now.date(),
        time__gte=now.time()
    )

    upcoming_events = upcoming_events.order_by('date', 'time')[:3]

    # 获取未完成任务（最近添加的3个）
    recent_tasks = Task.objects.filter(
        user=request.user,
        completed=False
    ).order_by('-created_at')[:3]


    return render(request, 'myPage.html', {
        'form': form,
        'user': user,
        'profile': profile,
        'follows': follows,
        'my_posts': my_posts,
        'liked_posts': liked_posts,
        'favorited_posts': favorited_posts,
        'recent_likes': recent_likes,
        'recent_comments': recent_comments,
        'upcoming_events': upcoming_events,
        'recent_tasks': recent_tasks,
    })



# 头像图片上传
def upload_avatar(request):
    if request.method == 'POST' and request.user.is_authenticated:
        user = request.user
        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']
            user.save()
            return JsonResponse({'success': True, 'avatar_url': user.avatar.url})
        else:
            return JsonResponse({'success': False, 'message': '没有接收到avatar文件'})
    return JsonResponse({'success': False, 'message': '请求失败，必须为POST并登录'})


# 个人资料背景上传
def upload_banner(request):
    if request.method == 'POST' and request.user.is_authenticated:
        profile = request.user.profile
        if 'personal_background' in request.FILES:
            profile.personal_background = request.FILES['personal_background']
            profile.save()
            return JsonResponse({'success': True, 'bg_url': profile.personal_background.url})
        else:
            return JsonResponse({'success': False, 'message': '未收到文件'})
    return JsonResponse({'success': False, 'message': '权限或方法错误'})


# 页面背景图片上传
def upload_page_background(request):
    if request.method == 'POST' and request.user.is_authenticated:
        profile = request.user.profile
        if 'page_background' in request.FILES:
            profile.page_background = request.FILES['page_background']
            profile.save()
            return JsonResponse({'success': True, 'bg_url': profile.page_background.url})
        else:
            return JsonResponse({'success': False, 'message': '未收到文件'})
    return JsonResponse({'success': False, 'message': '权限或方法错误'})


# 删除帖子
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        post.delete()
        messages.success(request, "帖子已删除！")
    return redirect('my_page')
