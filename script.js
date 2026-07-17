const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");

const state = {
  score: 0,
  bubbles: [],
  spawnTimer: 0,
};

const sizeConfig = {
  small: { size: 56, points: 3 },
  medium: { size: 84, points: 2 },
  big: { size: 120, points: 1 },
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createBubble() {
  const sizeType = Math.random() < 0.4 ? "small" : Math.random() < 0.7 ? "medium" : "big";
  const config = sizeConfig[sizeType];
  const bubble = document.createElement("button");
  bubble.className = `bubble ${sizeType}`;
  bubble.type = "button";
  bubble.setAttribute("aria-label", `${sizeType} bubble worth ${config.points} points`);

  const bubbleData = {
    el: bubble,
    sizeType,
    points: config.points,
    x: random(40, gameArea.clientWidth - 40),
    y: random(40, gameArea.clientHeight - 40),
    vx: random(-120, 120),
    vy: random(-120, 120),
    age: 0,
    life: random(2.6, 4.6),
    popped: false,
  };

  bubble.style.width = `${config.size}px`;
  bubble.style.height = `${config.size}px`;
  bubble.style.left = `${bubbleData.x}px`;
  bubble.style.top = `${bubbleData.y}px`;

  bubble.addEventListener("click", () => popBubble(bubbleData));
  gameArea.appendChild(bubble);
  state.bubbles.push(bubbleData);
}

function popBubble(bubbleData) {
  if (bubbleData.popped) return;
  bubbleData.popped = true;
  state.score += bubbleData.points;
  scoreEl.textContent = state.score;

  const popText = document.createElement("div");
  popText.className = "floating-score";
  popText.textContent = `+${bubbleData.points}`;
  popText.style.left = `${bubbleData.x}px`;
  popText.style.top = `${bubbleData.y}px`;
  gameArea.appendChild(popText);

  bubbleData.el.classList.add("popped");
  setTimeout(() => removeBubble(bubbleData), 180);
}

function removeBubble(bubbleData) {
  if (!bubbleData.el.isConnected) return;
  bubbleData.el.remove();
  state.bubbles = state.bubbles.filter((item) => item !== bubbleData);
}

function updateBubbles(delta) {
  state.bubbles.forEach((bubble) => {
    if (bubble.popped) return;

    bubble.age += delta;
    bubble.x += bubble.vx * delta;
    bubble.y += bubble.vy * delta;

    if (bubble.age >= bubble.life || bubble.x < -80 || bubble.x > gameArea.clientWidth + 80 || bubble.y < -80 || bubble.y > gameArea.clientHeight + 80) {
      bubble.el.classList.add("popped");
      setTimeout(() => removeBubble(bubble), 140);
      return;
    }

    bubble.el.style.left = `${bubble.x}px`;
    bubble.el.style.top = `${bubble.y}px`;
  });

  if (state.bubbles.length < 8 && state.spawnTimer > 0.7) {
    state.spawnTimer = 0;
    createBubble();
  }
}

function animate(now) {
  const delta = Math.min((now - (animate.lastTime || now)) / 1000, 0.03);
  animate.lastTime = now;
  state.spawnTimer += delta;
  updateBubbles(delta);
  requestAnimationFrame(animate);
}

for (let i = 0; i < 6; i += 1) {
  createBubble();
}

requestAnimationFrame(animate);
