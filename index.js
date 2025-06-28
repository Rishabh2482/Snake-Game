const board = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const controls = document.getElementById('controls');
const overlay = document.getElementById('overlay');
const gameOverMessgae = document.getElementById('gameOverMsg');
const playButton = document.getElementById('playButton');

let gameActive = false;
let score =0;
let snake = [{x:100,y:100}];
let foodItem = {x:200, y:100};
const blockSize =20;
const boardSize= 400;
let direction = 'ArrowRight';
let interval;

function createFood(){
    const foodVal= document.getElementById('food');
    if(foodVal) foodVal.remove();

    const foodEl = document.createElement('div');
    foodEl.style.left = `${foodItem.x}px`;
    foodEl.style.top = `${foodItem.y}px`;
    foodEl.setAttribute('id','food');

    board.appendChild(foodEl);
}

function genrateFood(){
    let x,y;

    do{
        // x = Math.floor(Math.random() * (boardSize - blockSize-1));
        // y = Math.floor(Math.random() * (boardSize - blockSize-1));
        x = Math.floor(Math.random() * (boardSize/blockSize)) * blockSize;
        y = Math.floor(Math.random() * (boardSize/blockSize)) * blockSize;
    }while(snake.some(segment => segment.x===x && segment.y===y))

    return {x,y};
}

function createSnake(){
    document.querySelectorAll('.snake').forEach(e => e.remove());

    snake.forEach(segment => {
        const snakeEl = document.createElement('div');
        snakeEl.style.left = `${segment.x}px`;
        snakeEl.style.top = `${segment.y}px`;
        snakeEl.classList.add('snake');
        board.appendChild(snakeEl);
    })
}

// createSnake();

function snakeMovement(){
    let head = {...snake[0]};

    switch(direction){
        case 'ArrowUp':
            head.y-= blockSize;
            break;
        case 'ArrowDown':
            head.y+= blockSize;
            break;
        case 'ArrowRight':
            head.x+= blockSize;
            break;
        case 'ArrowLeft':
            head.x-= blockSize;
            break;
    }

    if(head.x<0 || head.x >=boardSize || head.y< 0 || head.y >=boardSize || snake.some(seg => seg.x===head.x && seg.y === head.y))
    {
        clearInterval(interval);
        gameActive=false;
        overlay.classList.toggle('hidden');
        controls.classList.toggle('active');
        gameOverMessgae.textContent = 'Game Over';
        playButton.textContent = "Restart";
        return;
    }

    snake.unshift(head);
    console.log(head);  //! log
    // if snake eats food
    if(head.x===foodItem.x && head.y===foodItem.y){
        score+=10;
        scoreElement.textContent = `Score: ${score}`;
        foodItem = genrateFood(); 
        console.log("Snake eat")
    }else{ // if snake does not eats food
        snake.pop();
    }

    createSnake();
    createFood();
}

function changeDirection(newDirection){
    if(
        (newDirection === 'ArrowUp' && direction !== 'ArrowDown') || 
        (newDirection === 'ArrowDown' && direction !== 'ArrowUp') || 
        (newDirection === 'ArrowLeft' && direction !== 'ArrowRight') || 
        (newDirection === 'ArrowRight' && direction !== 'ArrowLeft')
    ){
        direction = newDirection;
    }
}

window.addEventListener('keydown', (e) => changeDirection(e.key))

function startGame(){
    snake = [{x: 100, y: 100}];
    direction = 'ArrowRight';
    foodItem = genrateFood();
    console.log(foodItem.x , foodItem.y);
    score = 0;
    gameActive = true;
    scoreElement.textContent = `Score: ${score}`;
    overlay.classList.toggle('hidden');
    controls.classList.toggle('active');
    gameOverMessgae.textContent = '';
    playButton.textContent = "Play";
    clearInterval(interval);
    interval = setInterval(snakeMovement, 400);
}

//  to fix the fooditem part when snake eats food food item location not changing.