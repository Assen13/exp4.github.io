/* ===================== 模块1：实现缩略图的前进/后退切换效果 ===================== */
// 获取页面上“左箭头”按钮（类名prev），后续绑定点击事件
let prev = document.querySelector('.prev');
// 获取页面上“右箭头”按钮（类名next），后续绑定点击事件
let next = document.querySelector('.next');
// 获取存放所有缩略图的ul容器，后续通过修改left值控制左右移动
let ul = document.querySelector('.spec-items ul');
// 获取所有缩略图的li项（返回数组），后续遍历用（这里暂时没用到，保留原代码）
let lis = document.querySelectorAll('.spec-items ul li');

// 给左箭头绑定点击事件：点击后执行{}内代码
prev.onclick = function () {
    /* 让ul列表回到最左侧（left=0），显示前几个缩略图 */
    ul.style.left = '0';
    /* 左箭头背景换成“禁用状态”的图片（表示已经到最左边，不能再左移） */
    prev.style.background = 'url(./images/disabled-prev.png)';
}

// 给右箭头绑定点击事件：点击后执行{}内代码
next.onclick = function () {
    /* 让ul列表向左移动116像素，显示后面隐藏的缩略图 */
    ul.style.left = '-116px';
}

/**
 * 可以有过渡效果：（备注：给ul加CSS的transition属性，切换会更丝滑）
 * 1. 数值类的（比如left、top、width）
 * 2. 颜色类的（比如background、color）
 * 3. 转换：位移、旋转、缩放、倾斜（transform）
 * 4. 盒阴影（box-shadow）
 */

// 获取主图区域的中图元素（要切换的核心图片），后续跟随缩略图切换src
let img = document.querySelector('.img');
// 获取所有缩略图的img标签（返回数组），后续取src给中图
let imgs = document.querySelectorAll('.spec-items img');

/* ===================== 模块2：实现鼠标移到缩略图，自动切换中图的效果 ===================== */
/* 循环遍历所有缩略图的li项：i是当前遍历的下标（从0开始），lis.length是li的总数 */
for (let i = 0; i < lis.length; i++) {
    /* 给每个li项绑定“鼠标移上去”的事件：鼠标移到该缩略图时执行{}内代码 */
    lis[i].onmouseover = function () {
        /* 先循环清空所有li项的class：取消所有缩略图的高亮样式，避免多个高亮 */
        for (let j = 0; j < lis.length; j++) {
            /* 把第j个li的class设为空，移除所有样式（比如img-hover） */
            lis[j].className = '';
        }

        /* 给当前鼠标移上去的li项加class="img-hover"：高亮显示选中的缩略图 */
        lis[i].className = 'img-hover';
        /* 把中图的src换成当前缩略图的src：实现中图跟随缩略图切换 */
        img.src = imgs[i].src;
    }
}

/* ===================== 模块3：实现放大镜效果（鼠标移到中图，显示放大的细节图） ===================== */
// 获取中图的外层容器（main-img），后续绑定鼠标事件
let mainImg = document.querySelector('.main-img');
// 获取放大镜的小滑块（zoom-pup，黄色小块），后续控制显示/隐藏和位置
let zoomPup = document.querySelector('.zoom-pup');
// 获取放大镜的大图显示区域（zoom-div），后续控制显示/隐藏
let zoomDiv = document.querySelector('.zoom-div');
// 获取放大镜里的大图元素，后续控制其偏移显示细节
let bigImg = document.querySelector('.zoom-div img');
/* 给中图容器绑定“鼠标移上去”的事件：鼠标进入中图区域时执行 */
mainImg.onmouseover = function () {
    /* 显示小滑块：把display设为block（默认是none隐藏） */
    zoomPup.style.display = 'block';
    /* 显示大图区域：把display设为block（默认是none隐藏） */
    zoomDiv.style.display = 'block';
}

/* 给中图容器绑定“鼠标移开”的事件：鼠标离开中图区域时执行 */
mainImg.onmouseout = function () {
    /* 隐藏小滑块：把display设为none */
    zoomPup.style.display = 'none';
    /* 隐藏大图区域：把display设为none */
    zoomDiv.style.display = 'none';
}

/* 给中图容器绑定“鼠标移动”的事件：e是鼠标事件对象，包含鼠标位置等信息 */
mainImg.onmousemove = function (e) {
    // 获取鼠标距离整个文档顶部的距离（pageY是鼠标Y轴坐标）
    let pageY = e.pageY;
    // 获取鼠标距离整个文档左侧的距离（pageX是鼠标X轴坐标）
    let pageX = e.pageX;

    // 获取中图容器距离文档顶部的偏移量（offsetTop）
    let offsetTop = mainImg.offsetTop;
    // 获取中图容器距离文档左侧的偏移量（offsetLeft）
    let offsetLeft = mainImg.offsetLeft;

    // 计算小滑块高度的一半：让鼠标在小滑块正中间，体验更好
    let h = zoomPup.clientHeight / 2;
    // 计算小滑块宽度的一半：让鼠标在小滑块正中间
    let w = zoomPup.clientWidth / 2;

    /* 计算小滑块的top值：鼠标Y坐标 - 中图顶部偏移 - 滑块半高（滑块跟随鼠标Y轴） */
    let top = pageY - offsetTop - h;
    /* 计算小滑块的left值：鼠标X坐标 - 中图左侧偏移 - 滑块半宽（滑块跟随鼠标X轴） */
    let left = pageX - offsetLeft - w;

    /* 限制小滑块Y轴范围：不能超出中图顶部（top≤0时强制设为0） */
    if(top <= 0){
        top = 0;
    /* 限制小滑块Y轴范围：不能超出中图底部（中图高度 - 滑块高度） */
    }else if(top >= mainImg.clientHeight - zoomPup.clientHeight){
        top = mainImg.clientHeight - zoomPup.clientHeight;
    }

    /* 限制小滑块X轴范围：不能超出中图左侧（left≤0时强制设为0） */
    if(left <= 0){
        left = 0;
    /* 限制小滑块X轴范围：不能超出中图右侧（中图宽度 - 滑块宽度） */
    }else if(left >= mainImg.clientWidth - zoomPup.clientWidth){
        left = mainImg.clientWidth - zoomPup.clientWidth;
    }

    /* 把计算好的top值赋给小滑块：让滑块跟着鼠标Y轴移动 */
    zoomPup.style.top = top + 'px';
    /* 把计算好的left值赋给小滑块：让滑块跟着鼠标X轴移动 */
    zoomPup.style.left = left + 'px';

    // 计算Y轴比例：小滑块top值 / 中图可移动范围（用于换算大图偏移）
    let y = top / (mainImg.clientHeight - zoomPup.clientHeight);
    /* 计算大图Y轴偏移量：比例 * 大图可移动范围（800=大图高度，540=中图高度） */
    let yy = y * (800 - 540);
    /* 让大图反向偏移Y轴：实现“滑块移到哪，大图显示哪的细节” */
    bigImg.style.top = -yy + 'px';

    // 计算X轴比例：小滑块left值 / 中图可移动范围
    let x = left / (mainImg.clientWidth - zoomPup.clientWidth);
    /* 计算大图X轴偏移量：比例 * 大图可移动范围 */
    let xx = x * (800 - 540);
    /* 让大图反向偏移X轴：X轴跟随滑块位置 */
    bigImg.style.left = -xx + 'px';
}

/* ===================== 模块4：实现购物车数量的加减功能 ===================== */
// 获取“减号”按钮（类名reduce），后续绑定点击事件
let reduce = document.querySelector('.reduce');
// 获取“加号”按钮（类名add），后续绑定点击事件
let add = document.querySelector('.add');
// 获取数量输入框（类名buy-num），后续修改其value值
let buyNum = document.querySelector('.buy-num');

/* 给加号按钮绑定点击事件：点击后数量+1 */
add.onclick = function(){
    /* 输入框的值自增1（比如从1→2，2→3） */
    buyNum.value++;
    /* 如果数量>1：给减号按钮移除disabled类（启用减号，能点击） */
    if(buyNum.value > 1){
        reduce.className = 'reduce';
    }
}

/* 给减号按钮绑定点击事件：点击后数量-1 */
reduce.onclick = function(){
    /* 输入框的值自减1（比如从2→1，3→2） */
    buyNum.value--;
    /* 如果数量≤1：强制设为1（不能买0件/负数件） */
    if(buyNum.value <= 1){
        buyNum.value = 1;
        /* 给减号按钮加disabled类（禁用减号，不能点击） */
        reduce.className = 'reduce disabled';
    }
}