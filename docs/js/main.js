console.log("bees.");
class Hive {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.el = document.createElement("div");
        this.el.className = "hive";
        this.doorEl = document.createElement("span");
        this.doorEl.className = "hive-door";
        this.el.appendChild(this.doorEl);
        this.el.setAttribute('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px');
        const body = document.querySelector("body");
        body === null || body === void 0 ? void 0 : body.appendChild(this.el);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getEl() {
        return this.el;
    }
    getWidth() {
        return this.el.getBoundingClientRect().width;
    }
    getHeight() {
        return this.el.getBoundingClientRect().height;
    }
    getDoorCoordinates() {
        return { x: this.getWidth() / 2, y: this.getHeight() };
    }
}
class Flower {
    constructor(x, y, color) {
        this.isOccupied = false;
        this.colors = ['red', 'pink', 'blue', 'orange', 'purple'];
        this.x = x;
        this.y = y;
        this.color = color;
        this.flowerEl = document.createElement("div");
        this.flowerEl.className = "flower";
        this.updateFlowerPosition();
        const stem = document.createElement("div");
        stem.className = "flower-stem";
        const flowerTop = document.createElement("div");
        flowerTop.className = "flower-top";
        flowerTop.classList.add('--' + this.colors[this.color]);
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
    getIsOccupied() {
        return this.isOccupied;
    }
    updateFlowerPosition() {
        this.flowerEl.setAttribute("style", "top: " + this.y + "px; left: " + this.x + "px;");
    }
}
class Bee {
    constructor(startX, startY, index) {
        this.destination = { x: 0, y: 0 };
        this.flowerDistancePixels = 30;
        this.beeDistancePixels = 30;
        this.isCommunicating = false;
        this.isInsideHive = true;
        this.isAtHiveDoor = false;
        this.game = Game.getInstance();
        if (this.isInsideHive) {
            this.goToHiveDoor();
        }
        else {
            this.setNewDestination();
        }
        this.x = startX;
        this.y = startY;
        this.index = index;
        this.el = document.createElement('div');
        this.el.className = "bee";
        const body = document.querySelector('body');
        const torso = document.createElement('div');
        torso.className = "bee-torso";
        const wing1 = document.createElement('span');
        const wing2 = document.createElement('span');
        wing1.className = "bee-wing";
        wing2.className = "bee-wing";
        const pollen = document.createElement('span');
        pollen.className = "pollen --invisible";
        torso.appendChild(wing1);
        torso.appendChild(wing2);
        torso.appendChild(pollen);
        const head = document.createElement('div');
        head.className = "bee-head";
        const antenna1 = document.createElement('span');
        const antenna2 = document.createElement('span');
        antenna1.className = "bee-antenna";
        antenna2.className = "bee-antenna";
        this.speechBubbleEl = document.createElement("div");
        this.speechBubbleEl.className = "bee-speech --invisible";
        head.appendChild(antenna1);
        head.appendChild(antenna2);
        head.appendChild(this.speechBubbleEl);
        this.el.append(torso);
        this.el.append(head);
        body === null || body === void 0 ? void 0 : body.appendChild(this.el);
    }
    update() {
        this.fly();
        this.checkFlowers();
        this.checkFellowBees();
        this.checkInsideHive();
        this.checkAtHiveDoor();
    }
    fly() {
        if (this.y == this.destination.y && this.x == this.destination.x) {
            if (this.isHoldingPollen) {
                if (this.isAtHiveDoor) {
                    this.setNewDestination(this.game.hive.getX() + Math.round(Math.random() * this.game.hive.getWidth()), 0);
                }
                else if (this.y == 0) {
                    this.togglePollen();
                    this.goToHiveDoor();
                }
                else {
                    this.goToHiveDoor();
                }
            }
            else {
                if (this.isInsideHive) {
                    if (this.isAtHiveDoor) {
                        this.setNewDestination(null, this.game.hive.getHeight() + Math.round(Math.random() * window.innerHeight - this.game.hive.getHeight()));
                    }
                    else {
                        this.goToHiveDoor();
                    }
                }
                else {
                    this.setNewDestination(null, this.game.hive.getHeight() + Math.round(Math.random() * window.innerHeight - this.game.hive.getHeight()));
                }
            }
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
            if ((this.x + this.flowerDistancePixels > flower.getX() && this.x + this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width)
                ||
                    (this.x < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width + this.flowerDistancePixels && this.x > flower.getX())
                ||
                    (this.x - this.flowerDistancePixels > flower.getX() && this.x - this.flowerDistancePixels < flower.getX() + flower.getFlowerEl().getBoundingClientRect().width)) {
                if ((this.y + this.flowerDistancePixels > flower.getY() && this.y + this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height)
                    ||
                        (this.y < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height + this.flowerDistancePixels && this.y > flower.getY())
                    ||
                        (this.y - this.flowerDistancePixels > flower.getY() && this.y - this.flowerDistancePixels < flower.getY() + flower.getFlowerEl().getBoundingClientRect().height)) {
                    if (!flower.getIsOccupied() && !this.isHoldingPollen && !this.isPollinating) {
                        this.pollinate(flower);
                    }
                }
            }
        });
    }
    checkFellowBees() {
        this.game.bees.forEach(bee => {
            if ((this.x + this.beeDistancePixels > bee.getX() && this.x + this.beeDistancePixels < bee.getX() + bee.getEl().getBoundingClientRect().width)
                ||
                    (this.x < bee.getX() + bee.getEl().getBoundingClientRect().width + this.beeDistancePixels && this.x > bee.getX())
                ||
                    (this.x - this.beeDistancePixels > bee.getX() && this.x - this.beeDistancePixels < bee.getX() + bee.getEl().getBoundingClientRect().width)) {
                if ((this.y + this.beeDistancePixels > bee.getY() && this.y + this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height)
                    ||
                        (this.y < bee.getY() + bee.getEl().getBoundingClientRect().height + this.beeDistancePixels && this.y > bee.getY())
                    ||
                        (this.y - this.beeDistancePixels > bee.getY() && this.y - this.beeDistancePixels < bee.getY() + bee.getEl().getBoundingClientRect().height)) {
                    if (Math.round(Math.random() * 300) == 1 && !this.isCommunicating && !this.isPollinating) {
                        this.showSpeechBubble(":)");
                        bee.showSpeechBubble(":D");
                        setTimeout(() => {
                            this.hideSpeechBubble();
                            bee.hideSpeechBubble();
                        }, 1000);
                    }
                    if (this.isHoldingPollen) {
                    }
                }
            }
        });
    }
    checkAtHiveDoor() {
        if (this.isInsideHive) {
            this.isAtHiveDoor = this.x == this.game.hive.getDoorCoordinates().x && this.y == this.game.hive.getDoorCoordinates().y - 20;
        }
        else {
            this.isAtHiveDoor = this.x == this.game.hive.getDoorCoordinates().x && this.y == this.game.hive.getDoorCoordinates().y;
        }
    }
    checkInsideHive() {
        if ((this.x > this.game.hive.getX() && this.x < this.game.hive.getX() + this.game.hive.getWidth())
            &&
                (this.y < this.game.hive.getHeight())) {
            this.isInsideHive = true;
            this.el.style.background = "#8f6c14";
        }
        else {
            this.isInsideHive = false;
            this.el.style.background = "goldenrod";
        }
    }
    setNewDestination(x = null, y = null) {
        this.destination.x = x !== null ? x : Math.round(Math.random() * window.innerWidth);
        this.destination.y = y !== null ? y : Math.round(Math.random() * window.innerHeight);
    }
    pollinate(flower) {
        this.hideSpeechBubble();
        this.isPollinating = true;
        this.destination = { x: flower.getX(), y: flower.getY() };
        flower.setIsOccupied(true);
        setTimeout(() => {
            this.togglePollen();
            this.goToHiveDoor();
            flower.setIsOccupied(false);
            this.isPollinating = false;
        }, 2000);
    }
    togglePollen() {
        if (!this.isHoldingPollen) {
            this.isHoldingPollen = true;
            if (this.el.querySelector('.pollen')) {
                this.el.querySelector('.pollen').classList.remove('--invisible');
            }
        }
        else {
            this.spawnPollen();
            this.isHoldingPollen = false;
            if (this.el.querySelector('.pollen')) {
                this.el.querySelector('.pollen').classList.add('--invisible');
            }
            this.game.increaseScore();
        }
    }
    spawnPollen() {
        const pollenEl = document.createElement('span');
        pollenEl.className = "pollen";
        pollenEl.setAttribute('style', `top: ${this.y}px; left: ${this.x}px; position: absolute`);
        const body = document.querySelector('body');
        body.appendChild(pollenEl);
    }
    showSpeechBubble(text) {
        this.isCommunicating = true;
        this.speechBubbleEl.innerText = text ? text : '';
        this.speechBubbleEl.classList.remove('--invisible');
    }
    hideSpeechBubble() {
        this.isCommunicating = false;
        this.speechBubbleEl.classList.add('--invisible');
    }
    goToHiveDoor() {
        if (this.isInsideHive) {
            this.setNewDestination(this.game.hive.getDoorCoordinates().x, this.game.hive.getDoorCoordinates().y - 20);
        }
        else {
            this.setNewDestination(this.game.hive.getDoorCoordinates().x, this.game.hive.getDoorCoordinates().y);
        }
    }
    dance() {
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getEl() {
        return this.el;
    }
    getIndex() {
        return this.index;
    }
}
class Game {
    constructor() {
        this.bees = [];
        this.flowers = [];
        Game.instance = this;
        this.hive = new Hive();
        this.score = 0;
        for (let i = 0; i < 30; i++) {
            const flowerAreaY = 100 + this.hive.getHeight() + (Math.random() * (window.innerHeight - (100 + this.hive.getHeight())));
            const flowerAreaX = Math.random() * (window.innerWidth);
            this.flowers.push(new Flower(flowerAreaX, flowerAreaY, Math.round(Math.random() * 5)));
        }
        for (let i = 0; i < 10; i++) {
            this.bees.push(new Bee(0, 0, i));
        }
        this.scoreEl = document.createElement("div");
        this.scoreEl.className = "score";
        this.scoreEl.innerText = "Pollen collected: 0";
        const body = document.querySelector('body');
        body.appendChild(this.scoreEl);
        setInterval(() => {
            this.update();
        }, 10);
    }
    update() {
        this.bees.forEach(bee => {
            bee.update();
        });
    }
    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    increaseScore() {
        this.score++;
        this.scoreEl.innerText = "Pollen collected: " + this.score;
    }
}
const game = Game.getInstance();
//# sourceMappingURL=main.js.map