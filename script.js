const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const carImagePath = './assets/tdrc01_car09_f.png'
const roadTexturePath = './assets/asphalt_road_2.jpg'

const Canvas = {
  dimensions: {
    width: canvas.width,
    height: canvas.height
  },
  resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    this.dimensions.width = canvas.width
    this.dimensions.height = canvas.height
  }
}

const Car = {
  image: new Image(),
  coords: {
    x: 50,
    y: 100
  },
  dimensions: {
    width: 28.3,
    height: 59.4
  },
  init() {
    const _this = this
    this.image.src = carImagePath
    this.image.onload = function () {
      _this.draw()
    }
    this.coords.x = Canvas.dimensions.width / 2 - this.dimensions.width / 2
  },
  draw() {
    const x = this.coords.x < 0 ? 0 : this.coords.x + this.dimensions.width > Canvas.dimensions.width ? Canvas.dimensions.width - this.dimensions.width : this.coords.x
    const y = Canvas.dimensions.height - this.dimensions.height - 40
    ctx.drawImage(this.image, x, y, this.dimensions.width, this.dimensions.height)
  }
}

const Road = {
  image: new Image(),
  dimensions: {
    width: 256,
    height: 256
  },
  init() {
    const _this = this
    this.image.src = roadTexturePath
    this.image.onload = function () {
      _this.draw()
    }
  },
  draw() {
    const x = (canvas.width / 2) - (Road.dimensions.width / 2)
    for (let y = -Road.dimensions.height; y < canvas.height; y += Road.dimensions.height) {
      ctx.drawImage(this.image, x, y + offsetY, Road.dimensions.width, Road.dimensions.height)
    }
  }
}

let lastTouchX = null
let offsetY = 0
const speed = 1

canvas.addEventListener('touchmove', function (e) {
  e.preventDefault()
  const touch = e.touches[0]
  Car.coords.x += touch.clientX - lastTouchX
  lastTouchX = touch.clientX
  requestAnimationFrame(drawFrame)
}, { passive: false })

canvas.addEventListener('touchstart', function (e) {
  lastTouchX = e.touches[0].clientX
})

window.addEventListener('load', function () {
  Canvas.resize()
  Road.init()
  Car.init()

  const interval = setInterval(function() {
    offsetY = offsetY >= Road.dimensions.height ? 0 : offsetY + speed
    requestAnimationFrame(drawFrame)
  }, 15)

  window.addEventListener('unload', function () {
    clearInterval(interval)
  })
})

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  Road.draw()
  Car.draw()
}
