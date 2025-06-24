function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // 隐藏所有选项卡内容
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", ""); // 移除活动状态
    }
    document.getElementById(tabName).style.display = "block"; // 显示当前选中的内容
    evt.currentTarget.className += " active"; // 给当前按钮添加活动状态
}

// 获取 id="defaultOpen" 的元素并点击它，默认展示第一个选项卡
document.getElementById("defaultOpen").click();



// 监听任务项的悬停事件，播放积分和宝石动画
document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const bonus = item.querySelector('.bonus');
        bonus.classList.add('show'); // 显示积分动画
    });
    item.addEventListener('mouseleave', () => {
        const bonus = item.querySelector('.bonus');
        bonus.classList.remove('show'); // 隐藏积分动画
    });
});

function flipCard(card) {
    card.classList.toggle('flipped');
}

function openLesson(lessonNumber) {
    alert("你正在学习：" + lessonNumber + " 号课程");
}





