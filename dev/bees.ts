console.log("bees.")

class Hive {
  constructor() {
    const hive = document.createElement("div")
    hive.className = "hive"
    const body = document.querySelector("body")
    body?.appendChild(hive)
  }
}

class Flower {
  private isOccupied: boolean = false;
  private x: number;
  private y: number;
  private flowerEl: HTMLElement;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.flowerEl = document.createElement("div")
    this.flowerEl.className = "flower"
    this.updateFlowerPosition();

    const stem = document.createElement("div")
    stem.className = "flower-stem"

    const flowerTop = document.createElement("div")
    flowerTop.className = "flower-top"

    this.flowerEl.appendChild(flowerTop)
    this.flowerEl.appendChild(stem)

    const body = document.querySelector("body")
    body?.appendChild(this.flowerEl)
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getFlowerEl() {
    return this.flowerEl
  }

  setIsOccupied(state: boolean) {
    this.isOccupied = state
  }

  getIsOccupied() {
    return this.isOccupied
  }

  private updateFlowerPosition() {
    this.flowerEl.setAttribute("style", "top: " + this.y + "px; left: " + this.x + "px;")
  }

}

class Bee {
    private x: number;
    private y: number;
    destination: {x: number, y: number} = {x: 0, y: 0}
    private el: HTMLElement;
    // receivedInstructions: {x: number, y: number};
    isHoldingPollen: boolean;
    game: Game;
    flowerDistancePixels: number = 30
    beeDistancePixels: number = 30


    constructor(startX: number, startY: number) {
        this.setNewDestination()
        this.x = startX;
        this.y = startY

        this.el = document.createElement('div')
        this.el.className = "bee"
        const body = document.querySelector('body')

        const torso = document.createElement('div')
        torso.className = "bee-torso"

        const wing1 = document.createElement('span')
        const wing2 = document.createElement('span')
        wing1.className = "bee-wing"
        wing2.className = "bee-wing"

        const pollen = document.createElement('span')
        pollen.className = "pollen --invisible"
        
        torso.appendChild(wing1)
        torso.appendChild(wing2)
        torso.appendChild(pollen)

        const head = document.createElement('div')
        head.className = "bee-head"

        const antenna1 = document.createElement('span')
        const antenna2 = document.createElement('span')
        antenna1.className = "bee-antenna"
        antenna2.className = "bee-antenna"

        head.appendChild(antenna1)
        head.appendChild(antenna2)


        this.el.append(torso)
        this.el.append(head)
        body?.appendChild(this.el)

        this.game = Game.getInstance()
    }
    
    update() {
      this.fly()
      this.checkFlowers()
      this.checkFellowBees()
    }

    fly() {
      if(this.y == this.destination.y && this.x == this.destination.x) {
        if(this.isHoldingPollen) {
          console.log("pollen")
          this.togglePollen()
          if(this.y == 0) {
            this.setNewDestination()
          }
        } else {
          this.setNewDestination()
        }
        console.log("flyinggg yeeeaa")
        return;
      }
      
      if(this.x < this.destination.x) {
          this.x++
          this.el.classList.add('--mirrored')
        } else if(this.x > this.destination.x) {
          this.el.classList.remove('--mirrored')
          this.x--
      }

      if(this.y < this.destination.y) {
          this.y++
      } else if(this.y > this.destination.y) {
          this.y--
      }

      if(this.el) {
        this.el.setAttribute('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;')
      }
    }

    checkFlowers() {
      this.game.flowers.forEach(flower => {
        // if bee is near flower and flower not occupied, go to flower, get nectar

        // console.log("width: ", flower.getFlowerEl().getBoundingClientRect().width)
        if(this.x + this.flowerDistancePixels > flower.getX() && this.x + this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width ) {
          // width is correct.
          // now check height.
          if(this.y + this.flowerDistancePixels > flower.getY() && this.y + this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height ) {
            console.log("flower nearby!")
            if(!flower.getIsOccupied() && !this.isHoldingPollen) {
              this.pollinate(flower);
            }
          }

          if(flower.getIsOccupied()) {
            console.log("occupied!")
          }
        }
      })
    }


    checkFellowBees() {
      this.game.bees.forEach(bee => {
        if(this.x + this.beeDistancePixels > bee.getX() && this.x + this.flowerDistancePixels < bee.getX() + bee.getEl().getBoundingClientRect().width ) {
          if(this.y + this.beeDistancePixels > bee.getY() && this.y + this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height ) {
            if(this.isHoldingPollen) {
              // if in hive, dance
            }
          }
        }
        
      });
    }

    setNewDestination(x: number = null, y: number = null) {
      this.destination.x = x !== null ? x : Math.round(Math.random() * window.innerWidth);
      this.destination.y = y !== null ? y : Math.round(Math.random() * window.innerHeight);
    }

    pollinate(flower: Flower) {
      this.destination = {x: flower.getX(), y: flower.getY()}
      flower.setIsOccupied(true)
      setTimeout(() => {
        this.togglePollen()
        this.setNewDestination(null, 0)
        flower.setIsOccupied(false)
      }, 2000);
    }

    togglePollen() {
      if(!this.isHoldingPollen) {
        this.isHoldingPollen = true;
        this.el.querySelector('.pollen').classList.remove('--invisible')
      } else {
        this.isHoldingPollen = false;
        this.el.querySelector('.pollen').classList.add('--invisible')
        this.game.increaseScore()
      }
    }

    dance() {
      // move up-down-up-down for example, only when meeting another bee and only when they are at the hive.
    }

    getX() {
      return this.x
    }

    getY() {
      return this.y
    }

    getEl() {
      return this.el
    }
}

class Game {
  private static instance: Game;
  bees: Bee[] = [];
  hive: Hive;
  flowers: Flower[] = [];
  private score: number;
  private scoreEl: HTMLElement;

  constructor() {
    Game.instance = this;
    this.hive = new Hive()
    this.score = 0;

    for(let i = 0; i < 100; i++) {
      const flowerAreaY = 200 + (Math.random() * (window.innerHeight - 200))
      const flowerAreaX = Math.random() * (window.innerWidth)
      this.flowers.push(new Flower(flowerAreaX, flowerAreaY))
    }
    
    for(let i = 0; i < 10; i++) {
      this.bees.push(new Bee(Math.random() * (window.innerWidth),0))
    }    

    this.scoreEl = document.createElement("div")
    this.scoreEl.className = "score"
    this.scoreEl.innerText = "Pollen collected: 0"

    const body = document.querySelector('body')
    body.appendChild(this.scoreEl)

    setInterval(() => {
      this.update();
    }, 10);
  }

  update() {
    this.bees.forEach(bee => {
      // bee.destination = {x: 200, y: 200}
      bee.update()
    })
  }

  public static getInstance(): Game {
    if(!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance
  }

  increaseScore() {
    this.score++;
    this.scoreEl.innerText = "Pollen collected: " + this.score
  }
  
}

const game = Game.getInstance();
// game.update()

console.log("hoi")

