// 头像
function changeAvatar(event) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
        // 预览
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profileAvatar").src = e.target.result;
        };
        reader.readAsDataURL(file);

        // 实时上传
        const formData = new FormData();
        formData.append("avatar", file);

        fetch("/MyPage/upload-avatar/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("头像上传成功");
            } else {
                console.error("上传失败:", data.message);
            }
        })
        .catch(error => {
            console.error("请求错误:", error);
        });
    }
}

// 工具函数：获取 CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}





// 个人资料背景图
function changeBanner(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        // 本地预览
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profileBanner").style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);

        // 实时上传
        const formData = new FormData();
        formData.append("personal_background", file);

        fetch("/MyPage/upload-banner/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("背景图上传成功");
            } else {
                console.error("上传失败:", data.message);
            }
        })
        .catch(error => {
            console.error("请求错误:", error);
        });
    }
}

// 页面背景
function changePageBg(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        // 本地预览
        const reader = new FileReader();
        reader.onload = function (e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);

        // 实时上传
        const formData = new FormData();
        formData.append("page_background", file);

        fetch("/MyPage/upload-pagebg/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("页面背景上传成功");
            } else {
                console.error("上传失败:", data.message);
            }
        })
        .catch(error => {
            console.error("请求错误:", error);
        });
    }
}



// 打开弹窗
function openProfileEdit() {
    document.getElementById("profileModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

// 关闭弹窗
function closeProfileEdit() {
    document.getElementById("profileModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

// 显示更新成功通知
function showProfileUpdateNotice() {
    const notice = document.getElementById("profileUpdateNotice");
    notice.style.display = "block";

    // 3秒后自动消失
    setTimeout(() => {
        notice.style.display = "none";
    }, 3000);
}



// 中栏
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("defaultOpen").click();
});



//删除帖子
function toggleOptionsMenuDelete(button) {
    const container = button.parentElement;
    const menu = container.querySelector('.options-menu');

    // 关闭其他菜单
    document.querySelectorAll('.options-menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });

    // 切换当前菜单
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// 点击空白处自动关闭
document.addEventListener('click', function (event) {
    if (!event.target.closest('.options-menu') && !event.target.closest('button')) {
        document.querySelectorAll('.options-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});










// //自定义背景
// document.getElementById("bgInput").addEventListener("change", function () {
//     let file = this.files[0];
//     if (file) {
//         let reader = new FileReader();
//         reader.onload = function (e) {
//             document.body.style.backgroundImage = `url('${e.target.result}')`;
//         };
//         reader.readAsDataURL(file);
//     }
// });


// // 编辑个人资料
// // 打开弹窗
// function openProfileEdit() {
//     document.getElementById("profileModal").style.display = "block";
//     document.getElementById("modalOverlay").style.display = "block";

//     // 预填充信息
//     document.getElementById("editName").value = document.querySelector(".profile-name").textContent;
//     document.getElementById("editLocation").value = document.querySelector(".profile-location").textContent.replace("📍 ", "");
//     document.getElementById("editBio").value = document.querySelector(".profile-bio").textContent;
// }

// // 关闭弹窗
// function closeProfileEdit() {
//     document.getElementById("profileModal").style.display = "none";
//     document.getElementById("modalOverlay").style.display = "none";
// }

// // 更新资料
// document.getElementById("saveProfile").addEventListener("click", function () {
//     const newName = document.getElementById("editName").value.trim();
//     const newLocation = document.getElementById("editLocation").value.trim();
//     const newBio = document.getElementById("editBio").value.trim();

//     if (newName) document.querySelector(".profile-name").textContent = newName;
//     if (newLocation) document.querySelector(".profile-location").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${newLocation}`;
//     if (newBio) document.querySelector(".profile-bio").textContent = newBio;

//     // 关闭弹窗
//     closeProfileEdit();

//     // 显示更新成功通知
//     showProfileUpdateNotice();
// });

// // 显示更新成功通知
// function showProfileUpdateNotice() {
//     const notice = document.getElementById("profileUpdateNotice");
//     notice.style.display = "block";

//     // 3秒后自动消失
//     setTimeout(() => {
//         notice.style.display = "none";
//     }, 3000);
// }

// // 更换个人资料背景图
// function changeBanner(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             document.getElementById("profileBanner").style.backgroundImage = `url(${e.target.result})`;
//         };
//         reader.readAsDataURL(file);
//     }
// }

// // 更换头像
// function changeAvatar(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             document.getElementById("profileAvatar").src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//     }
// }





// // 好友显示区

// // 生成 DiceBear 头像 URL
// function getAvatarUrl(id) {
//     return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${id}`;
// }

// // 生成好友 HTML 结构
// function createFriendElement(friend) {
//     return `
//         <div class="friend-item ${friend.status}">
//             <img src="${getAvatarUrl(friend.id)}" alt="${friend.name} 头像" onclick="viewProfile('${friend.id}')">
//             <span onclick="viewProfile('${friend.id}')">${friend.name}</span>
//             <button class="message-btn" onclick="sendMessage('${friend.id}')">
//                 <i class="fas fa-comment-dots"></i>
//             </button>
//         </div>
//     `;
// }

// // 按照姓名首字母排序
// function sortFriendsByName(friendsList) {
//     return friendsList.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
// }

// // 渲染好友列表（按默认排序）
// function renderFriends(searchTerm = "") {
//     const friendListContainer = document.getElementById("friendList");
//     const specialGroup = document.getElementById("special-group");
//     const otherGroup = document.getElementById("other-group");

//     // 清空原有内容
//     friendListContainer.innerHTML = "";
//     specialGroup.innerHTML = "";
//     otherGroup.innerHTML = "";

//     // 按姓名首字母排序
//     const sortedFriends = sortFriendsByName(friends);

//     sortedFriends.forEach(friend => {
//         const friendHTML = createFriendElement(friend);

//         if (searchTerm) {
//             // 进行搜索
//             if (friend.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//                 friendListContainer.innerHTML += friendHTML;
//             }
//         } else {
//             // 默认展示所有好友（按首字母排序）
//             friendListContainer.innerHTML += friendHTML;
//         }

//         // 分组显示（保持不变）
//         if (friend.group === "special") {
//             specialGroup.innerHTML += friendHTML;
//         } else if (friend.group === "other") {
//             otherGroup.innerHTML += friendHTML;
//         }
//     });
// }

// // 搜索好友（只影响主列表）
// function searchFriends() {
//     let input = document.getElementById('friendSearch').value.trim();
//     renderFriends(input);
// }

// // 展开/收起好友分组
// function toggleGroup(groupId) {
//     const group = document.getElementById(groupId);
//     const icon = document.getElementById(groupId + '-icon');

//     group.classList.toggle("show");
//     icon.classList.toggle("fa-chevron-up");
//     icon.classList.toggle("fa-chevron-down");
// }

// // 好友卡片操作
// function viewProfile(friendId) {
//     alert("查看 " + friendId + " 的主页");
//     window.location.href = "../手语教室/SLClassroom.html";
// }

// function sendMessage(friendId) {
//     alert("与 " + friendId + " 发送私信");
//     window.location.href = "../手语教室/SLClassroom.html";
// }

// // 页面加载时渲染好友列表
// document.addEventListener("DOMContentLoaded", () => renderFriends());





// // 默认展示n条帖子
// const postsPerPage = 5;

// // 🟢 **主函数：切换 Tab 并渲染帖子**
// function openTab(evt, tabName) {
//     var i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }

//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }

//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.className += " active";

//     tabPages[tabName] = 1; // 切换 Tab 时重置到第一页
//     renderPosts(tabName);
// }

// // 🟢 **渲染帖子列表**
// function renderPosts(tabName) {
//     const postContainer = document.querySelector(`#${tabName} .postContainer`);
//     postContainer.innerHTML = "";

//     const postList = postsData[tabName] || [];
//     const currentPage = tabPages[tabName];

//     // 计算总页数
//     const totalPages = Math.ceil(postList.length / postsPerPage) || 1;

//     // 计算分页范围
//     const start = (currentPage - 1) * postsPerPage;
//     const end = start + postsPerPage;
//     const postsToShow = postList.slice(start, end);

//     // 渲染帖子
//     postsToShow.forEach(post => {
//         const postElement = document.createElement("div");
//         postElement.className = "feed-post";
//         postElement.innerHTML = `
//             <div class="post-header">
//                 <div class="post-avatar">
//                     <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.user}321" alt="像素风头像">
//                 </div>
//                 <div class="post-info">
//                     <p class="post-user-name">${post.user}</p>
//                     <p class="post-time">${post.time}</p>
//                 </div>
//                 <!-- 🔹 右上角扩展栏 -->
//                 <div class="post-options">
//                     <i class="fas fa-ellipsis-h" onclick="toggleOptionsMenu(this)"></i>
//                     <div class="options-menu">
//                         <button onclick="toggleFavorite('${post.id}')">
//                             <i class="fas fa-heart"></i> 收藏
//                         </button>
//                         <button onclick="gotoPage('${post.user}')">
//                             <i class="fas fa-flag"></i> 查看个人主页
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div class="post-content">
//                 <p>${post.content}</p>
//             </div>

//             <!-- 🔹 帖子交互区 -->
//             <div class="post-actions">
//                 <button class="like-btn" onclick="toggleLike('${post.id}')">
//                     <i class="fas fa-thumbs-up"></i> <span id="likeCount-${post.id}">${post.likes}</span>
//                 </button>
//                 <button class="comment-btn" onclick="openComments('${post.id}')">
//                     <i class="fas fa-comment-dots"></i> 评论
//                 </button>
//                 <button class="share-btn" onclick="sharePost('${post.id}')">
//                     <i class="fas fa-share"></i> 转发
//                 </button>
//             </div>
//         `;
//         postContainer.appendChild(postElement);
//     });


//     // 更新分页信息
//     document.querySelector(`#${tabName} .page-info`).textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;

//     // 更新分页按钮状态
//     document.querySelector(`#${tabName} .prev-btn`).disabled = currentPage === 1;
//     document.querySelector(`#${tabName} .next-btn`).disabled = currentPage === totalPages;
// }

// // 🟢 **分页功能**
// function changePage(tabName, offset) {
//     const maxPage = Math.ceil(postsData[tabName].length / postsPerPage) || 1;
//     const newPage = tabPages[tabName] + offset;

//     if (newPage >= 1 && newPage <= maxPage) {
//         tabPages[tabName] = newPage;
//         renderPosts(tabName);
//     }
// }

// function jumpToPage(tabName) {
//     const input = document.querySelector(`#${tabName} .page-input`);
//     const maxPage = Math.ceil(postsData[tabName].length / postsPerPage) || 1;
//     const newPage = Math.max(1, Math.min(maxPage, parseInt(input.value, 10) || 1));

//     if (newPage !== tabPages[tabName]) {
//         tabPages[tabName] = newPage;
//         renderPosts(tabName);
//     }
// }

// // 🟢 **页面加载时，默认打开第一个 Tab**
// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("defaultOpen").click();
// });




// // 帖子交互
// // 1️⃣ 切换收藏
// function toggleFavorite(postId) {
//     alert("已收藏帖子：" + postId);
// }

// // 2️⃣ 查看个人主页
// function gotoPage(postUser) {
//     alert("进入" + postUser + "的主页");
//     window.location.href = "./myPage.html";
// }

// // 3️⃣ 点赞帖子
// function toggleLike(postId) {
//     let likeCountElement = document.getElementById(`likeCount-${postId}`);
//     let currentLikes = parseInt(likeCountElement.innerText);
//     likeCountElement.innerText = currentLikes + 1;
// }

// // 4️⃣ 展开/隐藏扩展菜单
// function toggleOptionsMenu(iconElement) {
//     let menu = iconElement.nextElementSibling;
//     menu.style.display = menu.style.display === "flex" ? "none" : "flex";
// }

// // 5️⃣ 打开评论框（示例）
// function openComments(postId) {
//     alert("打开评论区：" + postId);
// }

// // 6️⃣ 转发帖子（示例）
// function sharePost(postId) {
//     alert("分享帖子：" + postId);
// }


// 通知区
// 进入教室
// function gotoClassroom() {
//     window.location.href = "../手语教室/SLClassroom.html";
// }

// // 其他互动
// document.addEventListener("DOMContentLoaded", function () {
//     const checkinBtn = document.querySelector(".checkin-btn");
//     let checkinDays = 3; // 假设已签到3天

//     // 🏆 签到功能
//     checkinBtn.addEventListener("click", function () {
//         checkinBtn.innerText = "✅ 已签到";
//         checkinBtn.disabled = true;
//         checkinBtn.style.background = "#9E9E9E";

//         checkinDays += 1;
//         document.querySelector(".checkin-btn + p b").innerText = checkinDays;

//         // 签到成功提示
//         let successMsg = document.createElement("div");
//         successMsg.innerText = "🎉 签到成功！";
//         successMsg.style.position = "fixed";
//         successMsg.style.top = "50px";
//         successMsg.style.right = "20px";
//         successMsg.style.background = "#6A1B9A";
//         successMsg.style.color = "white";
//         successMsg.style.padding = "10px 15px";
//         successMsg.style.borderRadius = "5px";
//         successMsg.style.opacity = "0";
//         successMsg.style.transition = "opacity 0.5s ease";

//         document.body.appendChild(successMsg);
//         setTimeout(() => (successMsg.style.opacity = "1"), 100);
//         setTimeout(() => {
//             successMsg.style.opacity = "0";
//             setTimeout(() => successMsg.remove(), 500);
//         }, 1500);
//     });

//     // 🔔 互动通知
//     document.querySelectorAll(".notifications li").forEach((item) => {
//         item.addEventListener("click", function () {
//             this.style.opacity = "0.6";
//         });
//     });

//     // 📅 TODO 任务完成状态
//     document.querySelectorAll(".todo-list li").forEach((task) => {
//         task.addEventListener("click", function () {
//             this.style.textDecoration = "line-through";
//             this.style.opacity = "0.6";
//         });
//     });

//     // 🔥 监听新互动消息（模拟）
//     setTimeout(() => {
//         let newNotif = document.createElement("li");
//         newNotif.innerHTML =
//             '<img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=5"> <b>王五</b> 给你发了私信';
//         newNotif.style.color = "#6A1B9A";
//         newNotif.style.fontWeight = "bold";
//         document.querySelector(".notifications ul").prepend(newNotif);
//     }, 3000);
// });
