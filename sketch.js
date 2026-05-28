let plants = [];
let clouds = [];
let birds = []; // nova array para pássaros
let sunX = 50;
let sunY = 80;
let sunSpeed = 0.2;
let score = 0;
let gameOver = false;
let telaInicial = true;

// Criar pássaros
function setupBirds(n) {
  for (let i = 0; i < n; i++) {
    birds.push({
      x: random(width),
      y: random(50, 150),
      speed: random(1, 2),
      wingOffset: random(TWO_PI)
    });
  }
}

function setup() {
  createCanvas(700, 400);
  
  // Criar plantas iniciais
  for (let i = 0; i < 5; i++) {
    plants.push({
      x: 100 + i * 120,
      y: height - 50,
      size: 20,
      water: 50,
      alive: true
    });
  }
  
  // Criar nuvens
  for (let i = 0; i < 3; i++) {
    clouds.push({x: random(width), y: random(50, 120)});
  }
  
  setupBirds(5); // cria 5 pássaros
}

function draw() {
  background(135, 206, 235); // céu
  
  // Sol
  fill(255, 204, 0);
  ellipse(sunX, sunY, 80, 80);
  sunX += sunSpeed;
  if (sunX > width) sunX = 0;
  
  // Nuvens
  fill(255);
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, 60, 40);
    cloud.x += 0.5;
    if (cloud.x > width + 30) cloud.x = -30;
  }
  
  // Pássaros
  drawBirds();
  
  // Solo
  fill(85, 53, 10);
  rect(0, height - 50, width, 50);
  
  if (telaInicial) {
    drawTelaInicial();
    return; // não roda o resto do jogo até clicar
  }
  
  if (gameOver) {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("Fim de Jogo!\nPontuação: " + score, width / 2, height / 2);
    return;
  }
  
  // Atualizar e desenhar plantas
  let aliveCount = 0;
  for (let plant of plants) {
    if (plant.alive) aliveCount++;
    
    if (plant.alive) {
      plant.size += 0.02 * (plant.water / 50);
      if (plant.size > 60) plant.size = 60;
      plant.water -= 0.05;
      if (plant.water <= 0) plant.alive = false;
    }
    
    fill(plant.alive ? color(34, 139, 34) : color(139, 69, 19));
    rect(plant.x, plant.y - plant.size, 10, plant.size);
    ellipse(plant.x + 5, plant.y - plant.size, 20, 20);
    
    // Barra de água
    fill(0, 0, 255);
    rect(plant.x - 5, plant.y - plant.size - 10, plant.water, 5);
    
    // Alerta de água baixa
    if (plant.water < 10 && plant.alive) {
      fill(255, 0, 0);
      ellipse(plant.x + 5, plant.y - plant.size - 20, 8, 8);
    }
  }
  
  // Pontuação
  score = aliveCount;
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Plantas vivas: " + score, 10, 20);
  
  // Checa fim de jogo
  if (aliveCount == 0) gameOver = true;
}

// Desenha pássaros e atualiza posição
function drawBirds() {
  for (let bird of birds) {
    bird.x += bird.speed;
    if (bird.x > width + 20) bird.x = -20;
    
    // asas batendo
    let wing = sin(frameCount * 0.2 + bird.wingOffset) * 10;
    
    fill(255, 0, 0);
    noStroke();
    // corpo
    ellipse(bird.x, bird.y, 15, 10);
    // asas
    line(bird.x - 5, bird.y, bird.x - 5 - wing, bird.y - wing);
    line(bird.x + 5, bird.y, bird.x + 5 + wing, bird.y - wing);
  }
}

// Tela inicial decorada
function drawTelaInicial() {
  // Título com sombra
  textAlign(CENTER);
  textSize(32);
  fill(255, 204, 0);
  text("Bem-vindo ao Jogo das Plantas!", width / 2 + 2, height / 2 - 62);
  fill(0);
  text("Bem-vindo ao Jogo das Plantas!", width / 2, height / 2 - 60);
  
  textSize(18);
  fill(50);
  text("Objetivo: Mantenha suas plantas vivas regando-as antes que a água acabe.", width / 2, height / 2 - 20);
  text("Clique nas nuvens para chover sobre todas as plantas.", width / 2, height / 2 + 10);
  text("Clique nas plantas individualmente para regá-las manualmente.", width / 2, height / 2 + 40);
  text("O jogo termina quando todas as plantas morrem.", width / 2, height / 2 + 70);
  
  // Clique para começar
  fill(255, 100, 100);
  textSize(16);
  text("Clique em qualquer lugar para começar!", width / 2, height - 30);
  
  // Plantas decorativas
  for (let i = 0; i < plants.length; i++) {
    let plant = plants[i];
    fill(34, 139, 34);
    rect(plant.x, plant.y - 20, 10, 20);
    ellipse(plant.x + 5, plant.y - 20, 20, 20);
  }
  
  // Gotas de água caindo das nuvens
  for (let cloud of clouds) {
    fill(0, 0, 255, 150);
    ellipse(cloud.x - 15, cloud.y + 25 + sin(frameCount * 0.1) * 5, 5, 10);
    ellipse(cloud.x + 10, cloud.y + 25 + cos(frameCount * 0.1) * 5, 5, 10);
  }
}

function mousePressed() {
  if (telaInicial) {
    telaInicial = false; // inicia o jogo ao clicar na tela de instrução
    return;
  }
  
  // Clique nas nuvens para chover
  for (let cloud of clouds) {
    if (dist(mouseX, mouseY, cloud.x, cloud.y) < 30) {
      for (let plant of plants) {
        if (plant.alive) {
          plant.water += 20;
          if (plant.water > 50) plant.water = 50;
        }
      }
      return; // previne que clique em planta regue e nuvem ao mesmo tempo
    }
  }
  
  // Clique nas plantas para regar manualmente
  for (let plant of plants) {
    if (plant.alive && mouseX > plant.x - 10 && mouseX < plant.x + 15 &&
        mouseY > plant.y - plant.size - 10 && mouseY < plant.y) {
      plant.water += 15;
      if (plant.water > 50) plant.water = 50;
    }
  }
}