const snakeDefault = [
  { x: 50, y: 25 },
  { x: 50, y: 30 },
  { x: 50, y: 35 },
  { x: 50, y: 40 },
];
let snake = [];
const foodLocation = {};
let movement, pts, highScore;
let level = 1;

const levelChange = (value) => {
  level = value * 1;
};

const createElement = ({ x, y }) => {
  const sn = document.createElement("div");
  sn.classList.add("snake");
  sn.style.left = x + "%";
  sn.style.top = y + "%";
  document.querySelector(".game-board").appendChild(sn);
};

const createFood = ({ x, y }) => {
  const fd = document.createElement("div");
  fd.classList.add("food");
  fd.style.left = x + "%";
  fd.style.top = y + "%";
  document.querySelector(".game-board").appendChild(fd);
};

const moveDown = () => {
  const y1 = snake[snake.length - 1].y;
  const y2 = snake[snake.length - 2].y;
  if (y1 === y2 - 5) {
    return;
  }
  clearInterval(movement);
  movement = setInterval(() => {
    const { x, y } = snake[snake.length - 1];
    snake.push({ x, y: y + 5 });
    if (!eatFood({ x, y })) snake.shift(1);
    if (!collision({ x, y })) displaySnake("down");
  }, 1000 - level * 100);
};

const moveUp = () => {
  const y1 = snake[snake.length - 1].y;
  const y2 = snake[snake.length - 2].y;
  if (y1 === y2 + 5) {
    return;
  }
  clearInterval(movement);
  movement = setInterval(() => {
    const { x, y } = snake[snake.length - 1];
    snake.push({ x, y: y - 5 });
    if (!eatFood({ x, y })) snake.shift(1);
    if (!collision({ x, y })) displaySnake("up");
  }, 1000 - level * 100);
};

const moveLeft = () => {
  const x1 = snake[snake.length - 1].x;
  const x2 = snake[snake.length - 2].x;
  if (x1 === x2 + 5) {
    return;
  }
  clearInterval(movement);
  movement = setInterval(() => {
    const { x, y } = snake[snake.length - 1];
    snake.push({ x: x - 5, y });
    if (!eatFood({ x, y })) snake.shift(1);
    if (!collision({ x, y })) displaySnake("left");
  }, 1000 - level * 100);
};

const moveRight = () => {
  const x1 = snake[snake.length - 1].x;
  const x2 = snake[snake.length - 2].x;
  if (x1 === x2 - 5) {
    return;
  }
  clearInterval(movement);
  movement = setInterval(() => {
    const { x, y } = snake[snake.length - 1];
    snake.push({ x: x + 5, y });
    if (!eatFood({ x, y })) snake.shift(1);
    if (!collision({ x, y })) displaySnake("right");
  }, 1000 - level * 100);
};

const displaySnake = (direction) => {
  const visualSnake = document.querySelectorAll(".snake");
  for (let i = 0; i < visualSnake.length; i++) {
    visualSnake[i].style.left = snake[i].x + "%";
    visualSnake[i].style.top = snake[i].y + "%";
    visualSnake[i].classList.remove(
      "snake--up",
      "snake--down",
      "snake--left",
      "snake--right"
    );
  }
  visualSnake[visualSnake.length - 1].classList.add(`snake--${direction}`);
  const tail =
    snake[0].x === snake[1].x - 5
      ? "left"
      : snake[0].x === snake[1].x + 5
      ? "right"
      : snake[0].y === snake[1].y + 5
      ? "down"
      : snake[0].y === snake[1].y - 5
      ? "up"
      : null;
  visualSnake[0].classList.add(`snake--${tail}`);
  console.log(tail);
};

const collision = ({ x, y }) => {
  if (
    x > 95 ||
    x < 0 ||
    y > 95 ||
    y < 0 ||
    snake.filter((cur) => cur.x === x && cur.y === y).length - 1
  ) {
    clearInterval(movement);
    if (pts > highScore) {
      highScore = pts;
      localStorage.setItem("snake-highscore", pts);
    }
    alert("Crashed");
    return true;
  }
};

const eatFood = ({ x, y }) => {
  if (x === foodLocation.x && y === foodLocation.y) {
    const location = () => {
      foodLocation.x = Math.floor(Math.random() * 20) * 5;
      foodLocation.y = Math.floor(Math.random() * 20) * 5;
      if (
        snake.filter(
          (cur) => cur.x === foodLocation.x && cur.y === foodLocation.y
        ).length
      )
        location();
    };
    location();
    const fd = document.querySelector(".food");
    fd.style.left = foodLocation.x + "%";
    fd.style.top = foodLocation.y + "%";
    createElement({ x, y });
    pts += level;
    document.querySelector(".points").textContent = pts;
    return true;
  }
  return false;
};

const handleReset = () => {
  highScore = localStorage.getItem("snake-highscore") * 1 || 0;
  document.querySelector(".high-score").textContent = highScore;
  pts = 0;
  document.querySelector(".points").textContent = pts;
  const food = document.querySelector(".food");
  food && food.remove();
  const sn = document.querySelectorAll(".snake");
  sn.forEach((cur) => cur.remove());
  clearInterval(movement);
  snake = [...snakeDefault];
  foodLocation.x = Math.floor(Math.random() * 20) * 5;
  foodLocation.y = Math.floor(Math.random() * 20) * 5;
  snake.forEach((cur) => createElement(cur));
  document.querySelectorAll(".snake")[0].classList.add("snake--up");
  document.querySelectorAll(".snake")[3].classList.add("snake--down");
  createFood(foodLocation);
};
handleReset();

const direction = ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      moveLeft();
      break;
    case 38:
      moveUp();
      break;
    case 39:
      moveRight();
      break;
    case 40:
      moveDown();
      break;
    case 32:
      clearInterval(movement);
      break;
  }
};

document.onkeydown = direction;
