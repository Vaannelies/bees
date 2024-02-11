console.log("bees.")

class Hive {
  private x: number = 0;
  private y: number = 0;
  private el: HTMLElement
  private doorEl: HTMLElement
  constructor() {
    this.el = document.createElement("div")
    this.el.className = "hive"

    this.doorEl = document.createElement("span")
    this.doorEl.className = "hive-door"

    this.el.appendChild(this.doorEl)
    this.el.setAttribute('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px')

    const body = document.querySelector("body")
    body?.appendChild(this.el)
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getEl() {
    return this.el;
  }

  public getWidth() {
    return this.el.getBoundingClientRect().width
  }

  public getHeight() {
    return this.el.getBoundingClientRect().height
  }

  public getDoorCoordinates() {
    return {x: this.getWidth() / 2, y: this.getHeight()}
  }
}

class Flower {
  private isOccupied: boolean = false;
  private x: number;
  private y: number;
  private flowerEl: HTMLElement;
  private color: number;
  private colors: string[] = ['red', 'pink', 'blue', 'orange', 'purple'];

  constructor(x: number, y: number, color: number) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.flowerEl = document.createElement("div")
    this.flowerEl.className = "flower"
    this.updateFlowerPosition();

    const stem = document.createElement("div")
    stem.className = "flower-stem"

    const flowerTop = document.createElement("div")
    flowerTop.className = "flower-top"

    flowerTop.classList.add('--' + this.colors[this.color])

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
    private index: number;
    private x: number;
    private y: number;
    destination: {x: number, y: number} = {x: 0, y: 0}
    private el: HTMLElement;
    // receivedInstructions: {x: number, y: number};
    isPollinating: boolean;
    isHoldingPollen: boolean;
    game: Game;
    flowerDistancePixels: number = 30
    beeDistancePixels: number = 30
    private speechBubbleEl: HTMLElement
    private isCommunicating: boolean = false;
    private isInsideHive: boolean = true;
    private isAtHiveDoor: boolean = false;

    constructor(startX: number, startY: number, index: number) {
        this.game = Game.getInstance()
        if(this.isInsideHive) {
          this.goToHiveDoor()
        } else {
          this.setNewDestination()
        }
        this.x = startX;
        this.y = startY
        this.index = index;

        this.el = document.createElement('div')
        this.el.className = "bee"
        // this.el.innerText = this.index + ''

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

        this.speechBubbleEl = document.createElement("div")
        this.speechBubbleEl.className = "bee-speech --invisible"

        head.appendChild(antenna1)
        head.appendChild(antenna2)
        head.appendChild(this.speechBubbleEl)


        this.el.append(torso)
        this.el.append(head)
        body?.appendChild(this.el)
    }
    
    update() {
      this.fly()
      this.checkFlowers()
      this.checkFellowBees()
      this.checkInsideHive()
      this.checkAtHiveDoor()
    }

    fly() {
      if(this.y == this.destination.y && this.x == this.destination.x) {
        if(this.isHoldingPollen) {
          if(this.isAtHiveDoor) {
            // bee is outside at the door with pollen, bring pollen to the upper wall of the hive
            this.setNewDestination(this.game.hive.getX() + Math.round(Math.random() * this.game.hive.getWidth()), 0)
          } else if(this.y == 0) {
          // if bee touch wall of the hive, lose pollen, go outside again

            this.togglePollen()
            this.goToHiveDoor()
          
          } else {
            // bee is outside with pollen, bring pollen to the hive door!
            this.goToHiveDoor()
          }
        } else {
          // bee is not holding pollen
          if (this.isInsideHive) {
            if(this.isAtHiveDoor) {
              // bee is inside at the door and wants to leave.
              this.setNewDestination(null, this.game.hive.getHeight() + Math.round(Math.random() * window.innerHeight - this.game.hive.getHeight()))

            } else {
              // bee is inside without pollen, go to door.
              this.goToHiveDoor()
            }
          } else {
            // bee is outside, set new random destination
            this.setNewDestination(null, this.game.hive.getHeight() + Math.round(Math.random() * window.innerHeight - this.game.hive.getHeight()))
          }
        }
  
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
        // if(this.x + this.flowerDistancePixels > flower.getX() && this.x + this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width ) {
        //   if(this.y + this.flowerDistancePixels > flower.getY() && this.y + this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height ) {
          if(
            // this         |
            //             other
            (this.x + this.flowerDistancePixels > flower.getX() && this.x + this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width)
            ||
  
            //            this
            //    other           |
            (this.x < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width + this.flowerDistancePixels && this.x > flower.getX())
            ||
  
            //      |         this
            //    other
            (this.x - this.flowerDistancePixels > flower.getX() && this.x - this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width)
            ) {
              
            if(
                // this         |
                //             other
                (this.y + this.flowerDistancePixels > flower.getY() && this.y + this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height)
                ||
  
                //            this
                //    other           |
                (this.y < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height + this.flowerDistancePixels && this.y > flower.getY())
                ||
  
                //      |         this
                //    other
                (this.y - this.flowerDistancePixels > flower.getY() && this.y - this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height)
              // this.y + this.beeDistancePixels > bee.getY() && this.y + this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height 
            ) {
            if(!flower.getIsOccupied() && !this.isHoldingPollen && !this.isPollinating) {
              this.pollinate(flower);
            }
          }
        }
      })
    }


    checkFellowBees() {
      this.game.bees.forEach(bee => {
        if(
          // this         |
          //             other
          (this.x + this.beeDistancePixels > bee.getX() && this.x + this.beeDistancePixels < bee.getX() + bee.getEl().getBoundingClientRect().width)
          ||

          //            this
          //    other           |
          (this.x < bee.getX() + bee.getEl().getBoundingClientRect().width + this.beeDistancePixels && this.x > bee.getX())
          ||

          //      |         this
          //    other
          (this.x - this.beeDistancePixels > bee.getX() && this.x - this.beeDistancePixels < bee.getX() + bee.getEl().getBoundingClientRect().width)
          ) {
            
          if(
              // this         |
              //             other
              (this.y + this.beeDistancePixels > bee.getY() && this.y + this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height)
              ||

              //            this
              //    other           |
              (this.y < bee.getY() + bee.getEl().getBoundingClientRect().height + this.beeDistancePixels && this.y > bee.getY())
              ||

              //      |         this
              //    other
              (this.y - this.beeDistancePixels > bee.getY() && this.y - this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height)
          ) {
            
            // normal meeting, outside
            if(Math.round(Math.random() * 300) == 1 && !this.isCommunicating && !this.isPollinating) {
              // greet other bee!
              this.showSpeechBubble(":)")
              bee.showSpeechBubble(":D")
              setTimeout(() => {
                this.hideSpeechBubble()
                bee.hideSpeechBubble()
              }, 1000)
            }

            if(this.isHoldingPollen) {
              // if in hive, dance

            }
          }
        }
        
      });
    }

    checkAtHiveDoor() {
      console.log("inside hive", this.isInsideHive)
      if(this.isInsideHive) {
        this.isAtHiveDoor = this.x == this.game.hive.getDoorCoordinates().x && this.y == this.game.hive.getDoorCoordinates().y - 20
      } else {
        this.isAtHiveDoor = this.x == this.game.hive.getDoorCoordinates().x && this.y == this.game.hive.getDoorCoordinates().y
      }
    }

    checkInsideHive() {
      if(
        (this.x > this.game.hive.getX() && this.x < this.game.hive.getX() + this.game.hive.getWidth()) 
        &&
        // (this.y > this.game.hive.getY() && this.y < this.game.hive.getY() + this.game.hive.getHeight()) 
        (this.y < this.game.hive.getHeight()) // assuming that hive is always at top: 0
      ) {
        this.isInsideHive = true
        this.el.style.background = "green"
      } else {
        this.isInsideHive = false
        this.el.style.background = "red"
      }
    }

    setNewDestination(x: number = null, y: number = null) {
      this.destination.x = x !== null ? x : Math.round(Math.random() * window.innerWidth);
      this.destination.y = y !== null ? y : Math.round(Math.random() * window.innerHeight);
    }

    pollinate(flower: Flower) {
      this.hideSpeechBubble();
      this.isPollinating = true;
      this.destination = {x: flower.getX(), y: flower.getY()}
      flower.setIsOccupied(true)
      setTimeout(() => {
        this.togglePollen()
        this.goToHiveDoor();
        flower.setIsOccupied(false)
        this.isPollinating = false;
      }, 2000);
    }

    togglePollen() {
      if(!this.isHoldingPollen) {
        this.isHoldingPollen = true;
        if(this.el.querySelector('.pollen')) {
          this.el.querySelector('.pollen').classList.remove('--invisible')
        }
      } else {
        this.spawnPollen()

        this.isHoldingPollen = false;
        if(this.el.querySelector('.pollen')) {
          this.el.querySelector('.pollen').classList.add('--invisible')
        }
        this.game.increaseScore()
      }
    }

    spawnPollen() {
      const pollenEl = document.createElement('span')
      pollenEl.className = "pollen"
      pollenEl.setAttribute('style', `top: ${this.y}px; left: ${this.x}px; position: absolute`)
      const body = document.querySelector('body')
      body.appendChild(pollenEl)
    }

    showSpeechBubble(text: string) {
      this.isCommunicating = true;
      this.speechBubbleEl.innerText = text ? text : ''
      this.speechBubbleEl.classList.remove('--invisible')
    }
    
    hideSpeechBubble() {
      this.isCommunicating = false;
      this.speechBubbleEl.classList.add('--invisible')
    }

    goToHiveDoor() {
      if(this.isInsideHive) {
        this.setNewDestination(this.game.hive.getDoorCoordinates().x, this.game.hive.getDoorCoordinates().y - 20)
      } else {
        this.setNewDestination(this.game.hive.getDoorCoordinates().x, this.game.hive.getDoorCoordinates().y)
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

    getIndex() {
      return this.index
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

    for(let i = 0; i < 30; i++) {
      const flowerAreaY = 200 + (Math.random() * (window.innerHeight - 200))
      const flowerAreaX = Math.random() * (window.innerWidth)
      this.flowers.push(new Flower(flowerAreaX, flowerAreaY, Math.round(Math.random() * 5)))
    }
    
    for(let i = 0; i < 10; i++) {
      // this.bees.push(new Bee(Math.random() * (window.innerWidth),0))
      this.bees.push(new Bee(0,0, i))
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

