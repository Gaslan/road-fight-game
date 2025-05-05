const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const car = new Image();
const roadTexture = new Image();

const carImagePath = './assets/tdrc01_car09_f.png'
const roadTexturePath = './assets/asphalt_road_2.jpg'


const Canvas = {
  dimensions: {
    width: canvas.width,
    height: canvas.height
  }
}

const Car = {
  coords: {
    x: 50,
    y: 100
  },
  dimensions: {
    width: 28.3,
    height: 59.4
  }
}

const textureWidth = 256; // her döşemenin eni
const textureHeight = 256; // her döşemenin boyu

let lastTouchX = null
let offsetY = 0
const speed = 1



function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  Canvas.dimensions.width = canvas.width
  Canvas.dimensions.height = canvas.height
  Car.coords.x = Canvas.dimensions.width / 2 - Car.dimensions.width / 2
}

canvas.addEventListener('touchmove', function (e) {
  e.preventDefault(); // sayfanın kaymasını engelle
  const touch = e.touches[0]; // ilk dokunuşu al

  const x = touch.clientX;
  const y = touch.clientY;

  const dx = x - lastTouchX;

  Car.coords.x += dx; // görseli sağa veya sola kaydır
  lastTouchX = x;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // eskiyi temizle
  
  requestAnimationFrame(drawFrame)
}, { passive: false })

canvas.addEventListener('touchstart', function (e) {
  lastTouchX = e.touches[0].clientX;
})


window.addEventListener('load', function () {
  resizeCanvas()

  roadTexture.src = roadTexturePath
  roadTexture.onload = function () {
    drawRoad()
  }

  car.src = carImagePath
  car.onload = function () {
    drawCar()
  }

  const interval = setInterval(function() {
    offsetY = offsetY >= textureHeight ? 0 : offsetY + speed
    requestAnimationFrame(drawFrame)
  }, 15)

})

function drawCar() {
  const x = Car.coords.x < 0 ? 0 : Car.coords.x + Car.dimensions.width > Canvas.dimensions.width ? Canvas.dimensions.width - Car.dimensions.width : Car.coords.x
  console.log('X: ', x)
  const y = Canvas.dimensions.height - Car.dimensions.height - 40;
  ctx.drawImage(car, x, y, Car.dimensions.width, Car.dimensions.height);
}

function drawRoad() {
  
  const startX = (canvas.width / 2) - (textureWidth / 2)

  for (let y = -textureHeight; y < canvas.height; y += textureHeight) {
    ctx.drawImage(roadTexture, startX, y + offsetY, textureWidth, textureHeight);
  }
}

function drawFrame() {
  drawRoad()
  drawCar()
}