const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const carImagePath = './assets/Car.png'
const roadTexturePath = './assets/asphalt_road_2.jpg'

const car1Path = './assets/Car1.png'
const car2Path = './assets/Car2.png'
const car3Path = './assets/Car3.png'
const car4Path = './assets/Car4.png'

const onCrushed = new CustomEvent('crushed')

const rivalCarPaths = [
  './assets/Car11.png',
  './assets/Car12.png',
  './assets/Car13.png',
  './assets/Car14.png',
  './assets/Car15.png'
]

function randomNumber(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Canvas = {
  dimensions: {
    width: canvas.width,
    height: canvas.height
  },
  init() {
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
    this.coords.y = Canvas.dimensions.height - this.dimensions.height - 40
  },
  draw() {
    const x = this.coords.x < 0 ? 0 : this.coords.x + this.dimensions.width > Canvas.dimensions.width ? Canvas.dimensions.width - this.dimensions.width : this.coords.x
    ctx.drawImage(this.image, x, this.coords.y, this.dimensions.width, this.dimensions.height)
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

function RivalCar(speed) {
  const _this = this
  this.speed = speed
  this.position = {
    x: Canvas.dimensions.width * Math.random(),
    y: 0
  }
  this.dimensions = {
    width: 28.3,
    height: 59.4
  }
  this.image = new Image()
  this.image.src = rivalCarPaths[randomNumber(0, 4)]
  this.image.onload = function () {
    _this.draw()
  }
  this.destroy = function() {}
}

RivalCar.prototype.draw = function draw() {
  ctx.drawImage(this.image, this.position.x, this.position.y, this.dimensions.width, this.dimensions.height)
}

RivalCar.prototype.move = function move() {
  if (this.position.y > Canvas.dimensions.height) {
    this.destroy()
  }
  this.position.y += this.speed * 0.1
}

RivalCar.prototype.setDestroy = function setDestroy(fn) {
  this.destroy = fn
}

const RivalCarManager = {
  cars: [],
  distance: 0,
  init() {
    const _this = this
    const interval = setInterval(function() {
      const rand = Math.random()
      if (rand > 0.8) {
        _this.createRivalCar()
      }
    }, 200)
    document.addEventListener('crushed', function() {
      clearInterval(interval)
    })
  },
  createRivalCar() {
    const _this = this
    const newCar = new RivalCar(45)
    newCar.setDestroy(function() {
      _this.cars = _this.cars.filter(car => car != this)
    })
    this.cars.push(newCar)
  },
  checkCrush() {
    const crushed = this.cars.some(car => {
      if (car.position.y + car.dimensions.height < Car.coords.y) {
        return false
      }

      if (car.position.y > Car.coords.y + Car.dimensions.height) {
        return false
      }

      if (car.position.x + car.dimensions.width > Car.coords.x && car.position.x + car.dimensions.width < Car.coords.x + Car.dimensions.width) {
        return true
      }

      if (car.position.x < Car.coords.x + Car.dimensions.width && car.position.x > Car.coords.x) {
        return true
      }

      return false
    })
    if (crushed) {
      document.dispatchEvent(onCrushed)
    }
  },
  move(v) {
    this.distance += v
    document.getElementById('score').innerHTML = this.distance + ' meters'
  }
}

let lastTouchX = null
let offsetY = 0
const speed = 8

canvas.addEventListener('touchmove', function (e) {
  e.preventDefault()
  const touch = e.touches[0]
  Car.coords.x += touch.clientX - lastTouchX
  lastTouchX = touch.clientX
}, { passive: false })

canvas.addEventListener('touchstart', function (e) {
  lastTouchX = e.touches[0].clientX
})

window.addEventListener('load', function () {
  Canvas.init()
  Road.init()
  Car.init()
  RivalCarManager.init()

  const interval = setInterval(function () {
    offsetY = offsetY >= Road.dimensions.height ? 0 : offsetY + speed
    RivalCarManager.cars.forEach(car => car.move())
    requestAnimationFrame(drawFrame)
  }, 15)

  window.addEventListener('unload', function () {
    clearInterval(interval)
  })

  this.document.addEventListener('crushed', function() {
    clearInterval(interval)
  })
})

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  Road.draw()
  Car.draw()
  RivalCarManager.cars.forEach(car => car.draw())
  RivalCarManager.checkCrush()
  RivalCarManager.move(1)
}
