var box = document.getElementById("box")
var bj1 = document.getElementById("bj1")
var bj2 = document.getElementById("bj2")

var timer = setInterval(function () {
    a = parseInt(getComputedStyle(bj1, null)["top"]) + 1
    b = parseInt(getComputedStyle(bj2, null)["top"]) + 1
    if (a > 649) {
        a = -650
    }
    if (b > 649) {
        b = -650
    }
    bj1.style.top = a
    bj2.style.top = b
}, 5)

var feiji = document.getElementById("feiji")

feiji.onmousemove = function (e) {
    var ev = e || window.event
    posX = ev.clientX - feiji.offsetLeft - box.offsetLeft
    posY = ev.clientY - feiji.offsetTop - box.offsetTop
    console.log(posX, posY)
    document.onmousemove = function (e) {
        var ev = e || window.event
        feijiX = ev.clientX - box.offsetLeft - posX
        feijiY = ev.clientY - box.offsetTop - posY
        if (feijiX < 0) {
            feijiX = 0
        }
        if (feijiX > 420) {
            feijiX = 420
        }
        if (feijiY < 0) {
            feijiY = 0
        }
        if (feijiY > 738) {
            feijiY = 738
        }
        feiji.style.left = feijiX
        feiji.style.top = feijiY
    }

}
document.onmouseup = function () {
    document.onmousemove = null
    // document.onmouseuo
}

//创建敌机

var timerdiji = setInterval(function () {
    var diji = document.createElement("div")
    box.appendChild(diji)
    diji.className = "diji"
    m = Math.floor(Math.random() * 400)
    diji.style.left = 35 + m
    diji.style.top = -30
    var timers = setInterval(function () {
        diji.style.top = diji.offsetTop + 5
        if (diji.offsetTop > 800) {
            clearInterval(timers)
            box.removeChild(diji)
        }
    }, 20)
}, 150)

//创建子弹
var timerzidan = setInterval(function () {
    var zidan = document.createElement('div')
    box.appendChild(zidan)
    zidan.className = 'zidan'
    zidan.style.left = feiji.offsetLeft + 22 + 'px'
    zidan.style.top = feiji.offsetTop - 15 + 'px'
    var timers = setInterval(function () {
        zidan.style.top = zidan.offsetTop - 2 + 'px'
        if (zidan.offsetTop < -20) {
            clearInterval(timers)
            box.removeChild(zidan)
        }
    }, 1)
}, 150)


// //碰撞检测
function crash(object1, object2) {
    var ob1_left = object1.offsetLeft
    var ob1_top = object1.offsetTop
    var ob1_right = object1.offsetLeft + object1.offsetWidth
    var ob1_bottom = object1.offsetTop + object1.offsetHeight
    var ob2_left = object2.offsetLeft
    var ob2_top = object2.offsetTop
    var ob2_right = object2.offsetLeft + object2.offsetWidth
    var ob2_bottom = object2.offsetTop + object2.offsetHeight

    if (ob1_top > ob2_bottom) {
        return false
    } else if (ob1_bottom < ob2_top) {
        return false
    } else if (ob1_left > ob2_right) {
        return false
    } else if (ob1_right < ob2_left) {
        return false
    } else {
        return true
    }
}

//定义计分的方法
var jishu = document.getElementById("jishu")

var number = 0

//子弹与敌机检测
var air_timer = setInterval(function () {
    var diji = document.getElementsByClassName("diji")
    var zidan = document.getElementsByClassName("zidan")
    for (var i = 0; i < diji.length; i++) {
        for (var j = 0; j < zidan.length; j++) {
            if (crash(zidan[j], diji[i])) {
                box.removeChild(zidan[j])
                box.removeChild(diji[i])
                //击中一个敌机获得50分
                number = number + 50
                jishu.innerText = "得分：" + number
                break
            }
        }
    }
}, 1)


var over = document.getElementById("over")
//子弹与敌机检测
var air_timer = setInterval(function () {
    var diji = document.getElementsByClassName("diji")
    for (var i = 0; i < diji.length; i++) {
        if (crash(feiji, diji[i])) {
            box.removeChild(feiji)
            clearTimeout(timerdiji)
            clearTimeout(timerzidan)
            clearTimeout(timer)
            over.style.display = "inline"
        }
    }
}, 1)
