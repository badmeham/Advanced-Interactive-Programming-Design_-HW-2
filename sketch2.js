let particles = [];
let flowField;
let cols, rows;
let inc = 0.1; // Влияние шума на поток
let scl = 20; // Масштаб сетки
let zoff = 0;
let song;

function preload() {
  soundFormats('mp3');
  song = loadSound('path/to/your/music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowField = new Array(cols * rows);

  for (let i = 0; i < 1000; i++) {
    particles[i] = new Particle();
  }
  background(0);

  // Menu handling
  const menu = document.getElementById('menu');
  const toggleButton = document.getElementById('toggle-button');
  const closeButton = document.getElementById('close-button');
  const showTextItem = document.getElementById('show-text');
  const refreshItem = document.getElementById('refresh');
  const playMusicItem = document.getElementById('play-music');

  toggleButton.addEventListener('click', () => {
    menu.classList.toggle('show');
    closeButton.classList.toggle('show');
  });

  closeButton.addEventListener('click', () => {
    menu.classList.remove('show');
    closeButton.classList.remove('show');
  });

  showTextItem.addEventListener('click', () => {
    alert('Hello, this is a message!');
  });

  refreshItem.addEventListener('click', () => {
    particles = [];
    for (let i = 0; i < 1000; i++) {
      particles[i] = new Particle();
    }
    background(0);
  });

  playMusicItem.addEventListener('click', () => {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.loop();
    }
  });
}

function draw() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2; // Основной угол от шума Перлина
      angle += random(-PI/2, PI/2); // Добавление случайного компонента к углу
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.5); // Уменьшение силы вектора
      flowField[index] = v;
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.0003;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2; // Уменьшение скорости для медленных частиц
    this.prevPos = this.pos.copy();
    this.color = color(random(100, 200), random(150, 255), random(200, 255), random(50, 200)); // Случайный цвет с прозрачностью
  }

  show() {
    stroke(this.color); // Установка цвета и прозрачности линии
    strokeWeight(1); // Установка толщины линии
    line(this.pos.x, this.prevPos.x, this.pos.y, this.prevPos.y);
    this.updatePrev();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}
