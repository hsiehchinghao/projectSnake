//getContext() method回傳一個canvas的drawing context
//drawing context 在canvas畫

const canvas = document.getElementById("myCanvas"); //canvas
const ctx = canvas.getContext("2d");//設定ctx這個function 

//設定單位
const unit = 20;
//分 行 跟 列 的區塊
const row = canvas.height / unit;
const column = canvas.width / unit;


let snake = [];//每個元素都是物件


//創建蛇
function createSnake(){
    //蛇的初始位置
    //物件裡的工作 儲存每格身體的x,y 
    snake[0] = {x:80,y:0};
    snake[1] = {x:60,y:0};
    snake[2] = {x:40,y:0};
    snake[3] = {x:20,y:0};
}

//果實功能
//隨機出現果實＆畫出果實＆選擇新的果實位置（不可跟身體重疊）
class Fruit{
    //隨機出現果實
    constructor(){
        let overlape = false;
        do{
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
        this.check(this.x,this.y);
        
        }while(overlape)
    }
    //畫出果實
    drawFruit(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    check(x,y){
        for(let i = 0; i < snake.length; i++){
            if (x == snake[i].x && y == snake[i].y){
                return this.overlape = true;
            } else {
                return this.overlape = false;
            }
        }
    }
}

//初始設定
createSnake();


//constructor 執行並返回新物件
let myFruit = new Fruit();

//分數初始設定
let score = 0;
document.getElementById("myScore").innerHTML = "Score : "+ score;


//歷史最高分 初始設定
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML = "Highest Score : " + highestScore;


//取消預設上下左右鍵的行為  怕調整到螢幕
window.addEventListener("keydown",(e)=>{
    if (e.key == "ArrowUp"){
        e.preventDefault();
    } else if (e.key == "ArrowDown"){
        e.preventDefault();
    }
})

//初始方向設定
let d = "right";

function changeDirection(){
    window.addEventListener("keydown",(e)=>{
        if(e.key == "ArrowRight" && d != "left"){
            d = "right";
        } else if (e.key == "ArrowLeft" && d != "right"){
            d = "left";
        }else if (e.key == "ArrowUp" && d != "down"){
            d = "up";
        }else if (e.key == "ArrowDown" && d != "up"){
            d = "down";
        }
       
    }, {once : true})
}

function draw(){

    //每次開始前看蛇是否有咬到自己
    //function  瀏覽器會跑完才更新畫面
    //如果寫在尾部 其實畫蛇也已經畫完了只是畫面還沒更新 但會先alert("GameOver") 然後畫面才更新
    //用for迴圈檢查 是否頭的座標有碰到 身體的座標
    for (let i = 1; i < snake.length; i++){
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            alert("GameOver");
            clearInterval(myGame);
            return;
        }
    }

    //canvas 本身是一個畫布 畫過的東西沒有特別更新會一直保留 背景設定黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    myFruit.drawFruit();
    console.log(myFruit);

    //檢查執行
    console.log("正在執行中...") 
    //ctx.fillStyle 是在getContext()裡面的method可以用來填色＝> getContext是用來作畫的function 
    //畫出當前的蛇
    for(let i = 0; i < snake.length; i++){
        //snake的頭的位置 要上不同顏色
        if(i == 0) {
            ctx.fillStyle = "lightpink";
        } else {
            ctx.fillStyle = "lightgreen";
        }
        //外匡樣式
        ctx.strokeStyle = "white";


        //根據x,y座標 畫出一隻蛇
        //fillRect畫出長方形 是getContext()裡的method
        //x,y,width,height=>4個參數
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    
    }
  
    //畫出目前的蛇以後 去改變移動後的蛇的座標 
    //以目前的d變數方向 來決定蛇的下一幀要放哪個座標
    //unshift新的蛇頭 蛇尾又會pop()
    changeDirection();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "left") {
        snakeX -= unit;
    } else if(d == "up"){
        snakeY -= unit;
    } else if(d == "down"){
        snakeY += unit;
    } else {
        snakeX += unit;
    }

    //穿牆功能 寫在這裡
    //因為上面設定新的蛇頭位置 但如果新的蛇頭位置有離開canvas
    //就要移到canvas上的新位置
    if (snakeX >= canvas.width){
        snakeX = 0;
    } else if (snakeX < 0){
        snakeX = canvas.width - unit;
    } else if (snakeY >= canvas.height){
        snakeY = 0;
    } else if (snakeY < 0){
        snakeY = canvas.height - unit;
    };

    let newHead = { 
        x: snakeX,
        y: snakeY,
    };


    //先確認是否有吃到果實
    //確定蛇頭的x,y座標 是否有跟果實相同
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        //更新分數
        score ++;
        plusScore();
        //還要確認是否更新 歷史最高分
        setHighest(score);
        
        //有吃到就要重新選定果實位置並畫出心果實
        myFruit = new Fruit();
        myFruit.drawFruit();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);//新增新的頭
    
};

//setInterval()代表 要執行的函式＆每隔多久執行一次
let myGame = setInterval(draw, 100); 

//吃到果實html分數要加
function plusScore(){
    document.getElementById("myScore").innerHTML = "Score : "+ score;
}

//讀取歷史最高分
function loadHighestScore(){
    //先確定 是否有這個數據 
    //console.log(localStorage.getItem("highestScore"));
    if (localStorage.getItem("highestScore") == null){
        highestScore = 0;
    } else {
        //要是 有數據就等於歷史最高 
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

//設定歷史最高分
//此function 判斷score 是否需要更新 highestScore 
function setHighest(score){
    if( score > highestScore){
        //確認 當前分數大於 歷史高再去做更新 
        localStorage.setItem("highestScore", score);//key : highestScore,value : score
        highestScore = score; //去改變宣告的變數 
        document.getElementById("myScore2").innerHTML = "Highest Score : " + highestScore;
    }
}


