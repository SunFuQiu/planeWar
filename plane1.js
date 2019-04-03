/*创建地图 地图移动*/
var map = document.getElementsByClassName("map")[0];
(function () {    //(function(){})();即自调用函数function(){}
    var bgmap = document.getElementsByClassName("bgmap");
    //设置背景图片初始top值
    bgmap[0].style.top = "-600px";
    bgmap[1].style.top = "0px";

    //封装背景图片由上自下移动事件
    function bgmove() {
        for (var i = 0; i < bgmap.length; i++) {
            var Top = parseInt(bgmap[i].style.top);
            Top++;
            if (Top >= 600) {
                Top = -600;
            }
            bgmap[i].style.top = Top + "px";
        }
    }

    setInterval(bgmove, 20);
})();


/*创建子弹 封装子弹类*/
/*创建用户飞机 封装用户类*/
var user;//实例化的全局变量
function User() {
    this.width = 90;
    this.height = 70;
    this.position = "absolute";
    this.userf = null;
    this.src = "../img/plane_002.png";
    this.x;
    this.y;
    //构造创建用户飞机的方法
    this.createUser = function () {
        if (this.userf == null) {
            this.userf = document.createElement("img");
            this.userf.style.width = this.width + "px";
            this.userf.style.height = this.height + "px";
            this.userf.style.position = this.position;
            this.userf.style.zIndex = 1;
            this.userf.src = this.src;
            this.userf.style.left = "170px";//400/2-60/2
            this.userf.style.top = "530px";//630-70-30
            map.appendChild(this.userf);
        }
    };
    //构造用户飞机移动方法
    this.UserMove = function (x, y) {  //传参 利用地图鼠标移动事件获取鼠标坐标控制
        this.x = x;
        this.y = y;
        this.userf.style.left = x + "px";
        this.userf.style.top = y + "px";
    }
}

var shouter;

function Shouter() {
    this.width = 30;
    this.height = 60;
    this.shouterf = null;
    this.position = "absolute";
    this.src = "../img/bullet_001.png";
    this.x;
    this.y;
    //构造创建子弹的方法
    this.creatShouter = function (User) {
        if (this.shouterf == null) {
            this.shouterf = document.createElement("img");
            this.shouterf.style.width = this.width + "px";
            this.shouterf.style.height = this.height + "px";
            this.shouterf.style.position = this.position;
            this.shouterf.style.zIndex = 1;
            this.shouterf.src = this.src;
            map.appendChild(this.shouterf);
            //子弹坐标 x=飞机left+飞机自身的一半-子弹自身一半
            //y=飞机top-飞机自身的一半
            this.x = parseInt(user.userf.style.left) + user.width / 2 - this.width / 2;
            this.y = parseInt(user.userf.style.top) - user.height / 2;
        }
        this.shouterf.style.left = this.x + "px";
        this.shouterf.style.top = this.y + "px";
    };
    //构造子弹移动的方法
    this.ShouterMove = function (index, array) {
        this.y -= 2; //子弹的top值
        if (this.y <= 0) {//当子弹飞出屏幕 移除创建的子弹及其实例化对象
            this.shouterf.remove();
            array.splice(index, 1);//移除实例化数组中的子弹 利用数组截取的方法
        }
        this.creatShouter();//改变top后继续创建子弹形成连续发射效果
    };
    //构造子弹打到敌机移除二者的方法
    this.ShouterEnemy = function (enemyarr, index, shoutarr) {  //传参 子弹数组 敌机数组 移除所用缩引
        for (var key in enemyarr) { //遍历敌机数组
            //判断 子弹x y 值范围在敌机区域 移除
            if (this.x > enemyarr[key].x - this.width && this.x < enemyarr[key].x + enemyarr[key].width
                && this.y > enemyarr[key].y - this.height && this.y < enemyarr[key].y + enemyarr[key].height) {
                //大小敌机血量不同 当血量为0时  移除被击打的敌机及其实例化对象
                enemyarr[key].blood -= 1;
                if (enemyarr[key].blood <= 0) {
                    enemyarr[key].enemyf.remove();
                    enemyarr.splice(key, 1);
                }
                //同时移除击打中敌机的子弹及实例化对象
                this.shouterf.remove();
                shoutarr.splice(index, 1);
            }
        }
    }
}

/*创建敌机 封装敌机类*/
var enemy;

function Enemy(width, height, blood, score, s) {
    //敌机分为2种
    this.width = width || 60;
    this.height = height || 50;
    this.blood = blood || 3;
    this.score = score || 100;
    this.enemyf = null;
    this.src = s || "../img/enemy_plane_001.png";
    this.speed = 2;
    this.position = "absolute";
    this.x;//x轴 left
    this.y;//y轴 top
    //构造创建敌机的方法
    this.createEnemy = function () {
        if (this.enemyf == null) {
            this.enemyf = document.createElement("img");
            this.enemyf.style.width = this.width + "px";
            this.enemyf.style.height = this.height + "px";
            this.enemyf.style.position = this.position;
            this.enemyf.style.zIndex = 2;
            this.enemyf.src = this.src;
            map.appendChild(this.enemyf);
            //随机产生起始线不同位置的敌机
            this.x = Math.random() * (400 - this.width);
            this.y = -this.height;
        }
        this.enemyf.style.left = this.x + "px";
        this.enemyf.style.top = this.y + "px";
    }
    //构造敌机下落的方法
    this.EnemyMove = function (index, array) {
        //改变敌机的top值 赋回去
        this.y += this.speed;
        if (this.y > 630) {//敌机飞出界面 移除创建的敌机及实例化对象
            this.enemyf.remove();
            array.splice(index, 1);//移除实例化数组中的敌机 利用数组截取的方法
            count++;
        }
        this.enemyf.style.top = this.y + "px";

        //在敌机下落过程中判断是否与飞机相撞 相撞游戏结束
        if (user.x > this.x - user.width + 20 && user.x < this.x + this.width - 20
            && user.y > this.y - user.height + 20 && user.y < this.y + this.height - 20) {
            alert("Game over");
            clearInterval(time_creatShouter);
            clearInterval(time_ShouterMove);
            clearInterval(time_createEnemy);
            clearInterval(time_EnemyMove);
            map.onmousemove = null;
            return;
        }
    }
}

//定义定时器变量
var time_creatShouter;
var time_ShouterMove;
var time_createEnemy;
var time_EnemyMove;
//定义存储子弹的数组  存储敌机的数组
var shout = [];
var em_array = [];
window.onload = function () {
    //实例化用户飞机 调用创建方法
    user = new User();
    user.createUser();
    //实例化子弹 调用创建方法
    time_creatShouter = setInterval(function () {
        shouter = new Shouter();
        shouter.creatShouter(user);
        shout.push(shouter);
    }, 200);
    //调用子弹移动方法
    time_ShouterMove = setInterval(function () {
        if (shout.length > 0) {
            for (var i = 0; i < shout.length; i++) {
                shout[i].ShouterMove(i, shout);
                if (em_array.length > 0) { //当存在敌机时 被击中会移除
                    if (shout[i] == undefined) return;//处理当飞机飞到顶端的bug
                    shout[i].ShouterEnemy(em_array, i, shout);
                }
            }
        }
    }, 5);
    //实例化敌机 调用创建方法
    time_createEnemy = setInterval(function () {
        //利用随机数控制大小敌机创建比例
        if (Math.random() < 0.7) {
            enemy = new Enemy();
            enemy.createEnemy();
            em_array.push(enemy);
        }
        else {
            enemy = new Enemy(80, 65, 5, 300, "../img/enemy_plane_002.png");
            enemy.createEnemy();
            em_array.push(enemy);
        }
    }, 1000);
    //调用敌机移动方法
    time_EnemyMove = setInterval(function () {
        if (em_array.length > 0) {
            for (var key in em_array) {
                em_array[key].EnemyMove(key, em_array);
            }
        }
    }, 15)
    //创建地图鼠标移动事件
    map.onmousemove = function (e) {
        //鼠标位置-偏移量-用户飞机宽/高
        var x = e.pageX - this.offsetLeft - user.width / 2;
        var y = e.pageY - this.offsetTop - user.height / 2;
        user.UserMove(x, y);
    }
}