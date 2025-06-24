from django.shortcuts import render, redirect
from .models import Post, Like, Comment, Favorite
from MyPage.models import Follow
from users.models import CustomUser
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

def index(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'Community.html', {'posts': posts})

@login_required(login_url='login')
@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        image = request.FILES.get('image')
        video = request.FILES.get('video')

        if content or image or video:
            try:
                post = Post.objects.create(
                    user=request.user,
                    content=content,
                    image=image,
                    video=video
                )
                print("✅ 帖子成功写入数据库！ID:", post.id)
            except Exception as e:
                print("❌ 帖子写入失败：", e)
        else:
            print("⚠️ 无内容、图片或视频，跳过写入。")

        return redirect('community')

    # GET 请求展示帖子列表
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'Community.html', {'posts': posts})



# 浏览已发布帖子
def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'Community.html', {'posts': posts})


@login_required(login_url='login')
@csrf_exempt
def like_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
        # 检查是否已点赞
        if Like.objects.filter(user=user, post=post).exists():
            return JsonResponse({'success': False, 'message': '已点赞'})
        # 没有则创建记录
        Like.objects.create(user=user, post=post)
        post.like_count += 1
        post.save()
        return JsonResponse({'success': True, 'likes': post.like_count})
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'error': '帖子不存在'}, status=404)


@login_required(login_url='login')
@csrf_exempt
def comment_post(request, post_id):
    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        if not content:
            return JsonResponse({'success': False, 'message': '评论不能为空'})
        
        try:
            post = Post.objects.get(id=post_id)
            comment = Comment.objects.create(user=request.user, post=post, content=content)
            post.comment_count += 1
            post.save()
            return JsonResponse({
                'success': True,
                'username': comment.user.username,
                'content': comment.content,
                'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'comment_count': post.comment_count
            })
        except Post.DoesNotExist:
            return JsonResponse({'success': False, 'error': '帖子不存在'}, status=404)
        
@login_required(login_url='login')
@csrf_exempt
def favorite_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
        # 检查是否已收藏
        if Favorite.objects.filter(user=user, post=post).exists():
            return JsonResponse({'success': False, 'message': '已收藏'})
        # 没有则创建记录
        Favorite.objects.create(user=user, post=post)
        post.favorite_count += 1
        post.save()
        return JsonResponse({'success': True, 'favorites': post.favorite_count})
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'error': '帖子不存在'}, status=404)
    
@login_required(login_url='login')
@csrf_exempt
def toggle_follow(request, user_id):
    follower = request.user
    try:
        followed = CustomUser.objects.get(id=user_id)
        if follower == followed:
            return JsonResponse({'success': False, 'message': '不能关注自己'})

        existing = Follow.objects.filter(follower=follower, followed=followed)
        if existing.exists():
            existing.delete()
            return JsonResponse({'success': True, 'following': False, 'message': '已取消关注'})
        else:
            Follow.objects.create(follower=follower, followed=followed)
            return JsonResponse({'success': True, 'following': True, 'message': '关注成功'})
    except CustomUser.DoesNotExist:
        return JsonResponse({'success': False, 'message': '用户不存在'})
    

def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    user = request.user
    for post in posts:
        post.is_followed = False
        if user.is_authenticated and post.user != user:
            post.is_followed = Follow.objects.filter(follower=user, followed=post.user).exists()
    return render(request, 'Community.html', {'posts': posts})