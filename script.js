var canvas,   // Canvas 
ctx,          // Canvas context 
canvasWidth,  // Canvas width 
canvasHeight, // Canvas height 
speed,        // Game speed 
status,       // Game status
carModels,    // Cars models array
img,          // Sprite image
streetBg,     // Street background
car1,         // Car model 1
car2,         // Car model 2
car3,         // Car model 3
gameOver,     // Game over element
// Game status types
states = {
	start: 1,
	playing: 2,
	loser: 3
},
// Game score
score = {
	value: 0,
	ele: document.querySelector('#score'),
	update: function() {
		this.value++;
		this.ele.innerHTML = this.value;
	},
	reset: function() {
		this.value = 0;
		this.ele.innerHTML = this.value;
	}
},
// Game highscore
highscore = {
	value: window.localStorage.getItem('highscore') != null ? window.localStorage.getItem('highscore') : 0,
	ele: document.querySelector('#highscore'),
	init: function() {
		this.ele.innerHTML = this.value;
	},
	update: function(val) {
		this.value = val;
		window.localStorage.setItem('highscore', this.value);
		this.ele.innerHTML = this.value;
	}
},
// Street
street = {
	x: 0,
	y: 0,
	draw: function() {
		streetBg.draw(this.x, this.y);
	}
},
// Car
car = {
	x: 60,
	y: 260,
	draw: function() { 			
		car1.draw(this.x, this.y);
	}
},
// Enemies
enemies = {
	cars: [],
	positionsRandom: [60, 120],
	x: 60,
	y: -80, 		
	delayInsert: 0,
	insert: function() {
		this.cars.push({
			model: carModels[Math.floor(Math.random() * 3)],
			x: this.positionsRandom[Math.floor(Math.random() * 2)],
			y: this.y
		});
		this.delayInsert = Math.round(220 / speed);
	},
	draw: function() {
		for (var i = 0; i < this.cars.length; i++) {			
			this.cars[i].model.draw(this.cars[i].x, this.cars[i].y);
		}			
	},
	update: function() { 
		if (this.delayInsert == 0) {
			this.insert();
		} else {
			this.delayInsert--;
		}
		for (var i = 0, tam = this.cars.length; i < tam; i++) {

			var enemi = this.cars[i];
			enemi.y += speed;

			if (enemi.x == car.x && (enemi.y + 80) >= car.y && enemi.y <= (car.y + 80)) {

				status = states.loser;					

			} else if (enemi.y >= canvasHeight) {

				this.cars.splice(i,1);
				tam--;
				i--;
				score.update();

			}
		}	
	},
	clear: function() {
		this.cars = [];
	}
},
// Grids
grids = {
	x: 0,
	y: 0,
	width: 20,
	height: 20,
	draw: function() {
		ctx.strokeStyle = '#CCC';
		var x,y = 0;
		for (var i = 0; i < (canvasHeight / this.height); i++) {	
			x = 0;
			for (var j = 0; j < (canvasWidth / this.width); j++) {
				ctx.strokeRect(x, y, this.width, this.height);
				x += this.width;
			} 			 		
			y += this.height;
		}	
	}
};

// Sprite Class
function Sprite(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.draw = function(xCanvas, yCanvas) {
		ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);
	}
}

// Keypress event
function keypress(e) {
	// Car control
	if (status == states.playing) {
		// Right
		if (e.keyCode == 39) {
			car.x = 120;
		} 
		// Left
		else if (e.keyCode == 37) {
			car.x = 60;
		}
 	} 
	// Start Game
	else if (status == states.start) { 			
		if (e.keyCode == 32) {
			status = states.playing;
		}
	} 
	// Restart Game
	else if (status == states.loser) { 			
		if (e.keyCode == 32) {
			gameOver.style.display = "none";
			enemies.clear();
			score.reset();
			speed = 1;	 			
			status = states.playing;
		}
	} 				
}

// Buttons events
function buttonsEvents(e) {

	//console.log(e.target.dataset.action);

	var action = e.target.dataset.action;
	
	// Car control
	if (status == states.playing) {
		// Right
 		if (action == 'car-right') {
 			car.x = 120;
 		} 
 		// Left
 		else if (action == 'car-left') {
 			car.x = 60;
 		}
	} 
	// Start Game
	else if (status == states.start) {		
 		if (action == 'start') {
 			status = states.playing;
 		}
	} 
	// Restart Game
	else if (status == states.loser) {		
 		if (action == 'start') {
 			gameOver.style.display = "none";
 			enemies.clear();
 			score.reset();
 			speed = 1;
 			car.x = 60;
 			status = states.playing;
 		}
 	}			
}

// Draw function
function draw() {
	street.draw(); 		
	car.draw();
	enemies.draw();	 
	//grids.draw();
}

// Update function
function update() {

	if (status == states.playing) {

		enemies.update();

		// Update levels
		if (score.value > 5 && score.value <= 10) {
			speed = 2;
		} else if (score.value > 10 && score.value <= 15) {
			speed = 3;
		} else if (score.value > 15 && score.value <= 20) {
			speed = 4;
		} else if (score.value > 20) {
			speed = 5;
		} else {
			speed = 1;
		}

	} else if (status == states.loser) {
		gameOver.style.display = "inline-block";
		if (score.value > highscore.value) {
			highscore.update(score.value);
		}		
	} 		
}

// Run function
function run() {
	update();
	draw();
	window.requestAnimationFrame(run);
}

// Init function
function init() {	

	// Setup canvas
	canvas = document.querySelector('#canvas');
	ctx = canvas.getContext('2d');
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	gameOver = document.querySelector('.game-over');

	// Events
	document.addEventListener('keydown', keypress);	
	document.querySelector('.btn.left').addEventListener('click', buttonsEvents);	
	document.querySelector('.btn.right').addEventListener('click', buttonsEvents);	
	document.querySelector('#btn-start').addEventListener('click', buttonsEvents);	

	// Setup Game	
	highscore.init();
	speed = 1;
	status = states.start;		

	// Sprites
	img = new Image();
	img.src = "sheet.png";
	streetBg = new Sprite(70, 0, 219, 360);
	car1 = new Sprite(0, 0, 40, 81);
	car2 = new Sprite(0, 81, 40, 83);
	car3 = new Sprite(0, 164, 40, 83);
	carModels = [car1, car2, car3];

	run();

}

init();