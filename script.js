const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

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
  image: new Image(),
  imagePath: carImagePath,
  coords: {
    x: 50,
    y: 100
  },
  dimensions: {
    width: 28.3,
    height: 59.4
  }
}

const textureWidth = 256
const textureHeight = 256

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
  e.preventDefault()
  const touch = e.touches[0]

  const x = touch.clientX
  const dx = x - lastTouchX

  Car.coords.x += dx
  lastTouchX = x

  requestAnimationFrame(drawFrame)
}, { passive: false })

canvas.addEventListener('touchstart', function (e) {
  lastTouchX = e.touches[0].clientX
})


window.addEventListener('load', function () {
  resizeCanvas()

  roadTexture.src = roadTexturePath
  roadTexture.onload = function () {
    drawRoad()
  }

  Car.image.src = Car.imagePath
  Car.image.onload = function () {
    drawCar()
  }

  const interval = setInterval(function() {
    offsetY = offsetY >= textureHeight ? 0 : offsetY + speed
    requestAnimationFrame(drawFrame)
  }, 15)

  window.addEventListener('unload', function () {
    clearInterval(interval)
  })
})

function drawCar() {
  const x = Car.coords.x < 0 ? 0 : Car.coords.x + Car.dimensions.width > Canvas.dimensions.width ? Canvas.dimensions.width - Car.dimensions.width : Car.coords.x
  const y = Canvas.dimensions.height - Car.dimensions.height - 40
  ctx.drawImage(Car.image, x, y, Car.dimensions.width, Car.dimensions.height)
}

function drawRoad() {
  const x = (canvas.width / 2) - (textureWidth / 2)
  for (let y = -textureHeight; y < canvas.height; y += textureHeight) {
    ctx.drawImage(roadTexture, x, y + offsetY, textureWidth, textureHeight)
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawRoad()
  drawCar()
}
