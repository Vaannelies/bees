"use strict";
if (typeof document !== 'undefined') {
    class Hive {
        constructor() {
            const hive = document.createElement("div");
            hive.className = "hive";
            const body = document.querySelector("body");
            body === null || body === void 0 ? void 0 : body.appendChild(hive);
        }
    }
    class Flower {
        constructor(x, y) {
            this.isOccupied = false;
            this.x = x;
            this.y = y;
            this.flowerEl = document.createElement("div");
            this.flowerEl.className = "flower";
            this.updateFlowerPosition();
            const stem = document.createElement("div");
            stem.className = "flower-stem";
            const flowerTop = document.createElement("div");
            flowerTop.className = "flower-top";
            this.flowerEl.appendChild(flowerTop);
            this.flowerEl.appendChild(stem);
            const body = document.querySelector("body");
            body === null || body === void 0 ? void 0 : body.appendChild(this.flowerEl);
        }
        getX() {
            return this.x;
        }
        getY() {
            return this.y;
        }
        getFlowerEl() {
            return this.flowerEl;
        }
        setIsOccupied(state) {
            this.isOccupied = state;
        }
        updateFlowerPosition() {
            this.flowerEl.setAttribute("style", "top: " + this.y + "px; left: " + this.x + "px;");
        }
    }
    class Bee {
        constructor(startX, startY) {
            this.destination = { x: 0, y: 0 };
            this.flowerDistancePixels = 30;
            this.x = startX;
            this.y = startY;
            this.el = document.createElement('div');
            this.el.className = "bee";
            const body = document.querySelector('body');
            const torso = document.createElement('div');
            torso.className = "bee-torso";
            const wing1 = document.createElement('span');
            const wing2 = document.createElement('span');
            wing1.className = "bee-wing";
            wing2.className = "bee-wing";
            torso.appendChild(wing1);
            torso.appendChild(wing2);
            const head = document.createElement('div');
            head.className = "bee-head";
            const antenna1 = document.createElement('span');
            const antenna2 = document.createElement('span');
            antenna1.className = "bee-antenna";
            antenna2.className = "bee-antenna";
            head.appendChild(antenna1);
            head.appendChild(antenna2);
            this.el.append(torso);
            this.el.append(head);
            body === null || body === void 0 ? void 0 : body.appendChild(this.el);
            this.game = Game.getInstance();
        }
        update() {
            this.fly();
            this.checkFlowers();
            this.checkFellowBees();
        }
        fly() {
            if (this.y == this.destination.y && this.x == this.destination.x) {
                this.setNewDestination();
                return;
            }
            if (this.x < this.destination.x) {
                this.x++;
                this.el.classList.add('--mirrored');
            }
            else if (this.x > this.destination.x) {
                this.el.classList.remove('--mirrored');
                this.x--;
            }
            if (this.y < this.destination.y) {
                this.y++;
            }
            else if (this.y > this.destination.y) {
                this.y--;
            }
            if (this.el) {
                this.el.setAttribute('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;');
            }
        }
        checkFlowers() {
            this.game.flowers.forEach(flower => {
                // if bee is near flower and flower not occupied, go to flower, get nectar
                console.log("width: ", flower.getFlowerEl().getBoundingClientRect().width);
                if (this.x + this.flowerDistancePixels > flower.getX() && this.x + this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width) {
                }
            });
        }
        checkFellowBees() { }
        setNewDestination() {
            this.destination.x = Math.round(Math.random() * 500);
            this.destination.y = Math.round(Math.random() * 500);
        }
    }
    class Game {
        constructor() {
            this.bees = [];
            this.flowers = [];
            this.hive = new Hive();
            for (let i = 0; i < 10; i++) {
                const flowerAreaY = 200 + (Math.random() * (window.innerHeight - 200));
                const flowerAreaX = Math.random() * (window.innerWidth);
                this.flowers.push(new Flower(flowerAreaX, flowerAreaY));
            }
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            this.bees.push(new Bee(0, 0));
            setInterval(() => {
                this.update();
            }, 10);
        }
        update() {
            this.bees.forEach(bee => {
                // bee.destination = {x: 200, y: 200}
                bee.update();
            });
        }
        static getInstance() {
            if (Game.instance == null) {
                Game.instance = new Game();
            }
            return Game.instance;
        }
    }
    const game = new Game();
    game.update();
    console.log("hoi");
}
