var vector = {
	_x: 1,
	_y: 0,

	create: function(x, y) {
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},

	setX: function(value) {
		this._x = value;
	},

	getX: function() {
		return this._x;
	},

	setY: function(value) {
		this._y = value;
	},

	getY: function() {
		return this._y;
	},

	setAngle: function(angle) {
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getAngle: function() {
		return Math.atan2(this._y, this._x);
	},

	setLength: function(length) {
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getLength: function() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	add: function(v2) {
		return vector.create(this._x + v2.getX(), this._y + v2.getY());
	},

	subtract: function(v2) {
		return vector.create(this._x - v2.getX(), this._y - v2.getY());
	},

	multiply: function(val) {
		return vector.create(this._x * val, this._y * val);
	},

	divide: function(val) {
		return vector.create(this._x / val, this._y / val);
	},

	addTo: function(v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	},

	subtractFrom: function(v2) {
		this._x -= v2.getX();
		this._y -= v2.getY();
	},

	multiplyBy: function(val) {
		this._x *= val;
		this._y *= val;
	},

	divideBy: function(val) {
		this._x /= val;
		this._y /= val;
	}
};
var utils = {
	norm: function(value, min, max) {
		return (value - min) / (max - min);
	},

	lerp: function(norm, min, max) {
		return (max - min) * norm + min;
	},

	map: function(value, sourceMin, sourceMax, destMin, destMax) {
		return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
	},

	clamp: function(value, min, max) {
		return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
	},

	distance: function(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function(c0, c1) {
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function(x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},

	pointInRect: function(x, y, rect) {
		return utils.inRange(x, rect.x, rect.x + rect.width) &&
		       utils.inRange(y, rect.y, rect.y + rect.height);
	},

	inRange: function(value, min, max) {
		return value >= Math.min(min, max) && value <= Math.max(min, max);
	},

	rangeIntersect: function(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.min(min1, max1) && 
			   Math.min(min0, max0) <= Math.max(min1, max1);
	},

	rectIntersect: function(r0, r1) {
		return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
			   utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
	},

	degreesToRads: function(degrees) {
		return degrees / 180 * Math.PI;
	},

	radsToDegrees: function(radians) {
		return radians * 180 / Math.PI;
	},

	randomRange: function(min, max) {
		return min + Math.random() * (max - min);
	},

	randomInt: function(min, max) {
		return Math.floor(min + Math.random() * (max - min + 1));
	},

	roundToPlaces: function(value, places) {
		var mult = Math.pow(10, places);
		return Math.round(value * mult) / mult;
	},

	roundNearest: function(value, nearest) {
		return Math.round(value / nearest) * nearest;
	},

	quadraticBezier: function(p0, p1, p2, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 2) * p0.x + 
				   (1 - t) * 2 * t * p1.x + 
				   t * t * p2.x;
		pFinal.y = Math.pow(1 - t, 2) * p0.y + 
				   (1 - t) * 2 * t * p1.y + 
				   t * t * p2.y;
		return pFinal;
	},

	cubicBezier: function(p0, p1, p2, p3, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 3) * p0.x + 
				   Math.pow(1 - t, 2) * 3 * t * p1.x + 
				   (1 - t) * 3 * t * t * p2.x + 
				   t * t * t * p3.x;
		pFinal.y = Math.pow(1 - t, 3) * p0.y + 
				   Math.pow(1 - t, 2) * 3 * t * p1.y + 
				   (1 - t) * 3 * t * t * p2.y + 
				   t * t * t * p3.y;
		return pFinal;
	},

	multicurve: function(points, context) {
		var p0, p1, midx, midy;

		context.moveTo(points[0].x, points[0].y);

		for(var i = 1; i < points.length - 2; i += 1) {
			p0 = points[i];
			p1 = points[i + 1];
			midx = (p0.x + p1.x) / 2;
			midy = (p0.y + p1.y) / 2;
			context.quadraticCurveTo(p0.x, p0.y, midx, midy);
		}
		p0 = points[points.length - 2];
		p1 = points[points.length - 1];
		context.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
	}
	
};
var particle = function(x, y, speed, direction, grav) {
	this.x = x;
	this.y = y;
	this.vx = Math.cos(direction) * (speed*dt);
	this.vy = Math.sin(direction) * (speed*dt); 
	this.mass = 1;
	this.radius = 0;
	this.bounce = -1;
	this.friction = 1;
	this.gravity = grav || 0;
	this.springs = [];
	this.gravitations = [];


	this.addGravitation = function(p) {
		this.removeGravitation(p);
		this.gravitations.push(p);
	};

	this.removeGravitation = function(p) {
		for(var i = 0; i < this.gravitations.length; i += 1) {
			if(p === this.gravitations[i]) {
				this.gravitations.splice(i, 1);
				return;
			}
		}
	};

	this.addSpring = function(point, k, length) {
		this.removeSpring(point);
		this.springs.push({
			point: point,
			k: k,
			length: length || 0
		});
	};

	this.removeSpring = function(point) {
		for(var i = 0; i < this.springs.length; i += 1) {
			if(point === this.springs[i].point) {
				this.springs.splice(i, 1);
				return;
			}
		}
	};

	this.getSpeed = function() {
		return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	};

	this.setSpeed = function(speed) {
		var heading = this.getHeading();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	};

	this.getHeading = function() {
		return Math.atan2(this.vy, this.vx);
	};

	this.setHeading = function(heading) {
		var speed = this.getSpeed();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	};

	this.accelerate = function(ax, ay) {
		this.vx += ax;
		this.vy += ay;
	};

	this.update = function() {
		if (dt === 0){ //setting speed according to delta time if not yet set (might not be a perfect solution to the problem of friction and gravity - with this if statement we avoid reseting vx and vy all the time)
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
		}
		this.handleSprings();
		this.handleGravitations();
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};

	this.handleGravitations = function() {
		for(var i = 0; i < this.gravitations.length; i += 1) {
			this.gravitateTo(this.gravitations[i]);
		}
	};

	this.handleSprings = function() {
		for(var i = 0; i < this.springs.length; i += 1) {
			var spring = this.springs[i];
			this.springTo(spring.point, spring.k, spring.length);
		}
	};

	this.angleTo = function(p2) {
		return Math.atan2(p2.y - this.y, p2.x - this.x);
	};

	this.distanceTo = function(p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y;

		return Math.sqrt(dx * dx + dy * dy);
	};

	this.gravitateTo = function(p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y,
			distSQ = dx * dx + dy * dy,
			dist = Math.sqrt(distSQ),
			force = p2.mass / distSQ,
			ax = dx / dist * force,
			ay = dy / dist * force;

		this.vx += ax;
		this.vy += ay;
	};

	this.springTo = function(point, k, length) {
		var dx = point.x - this.x,
			dy = point.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			springForce = (distance - length || 0) * k; 
		this.vx += dx / distance * springForce;
		this.vy += dy / distance * springForce;
	};
	
};
(function(game){ // jshint ignore:line
	$(document).ready(function(){ // jshint ignore:line
		
		// Check if a new cache is available on page load.
		window.addEventListener('load', function(e) {

		  window.applicationCache.addEventListener('updateready', function(e) {
		    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		      // Browser downloaded a new app cache.
		      if (confirm('A new version of InVaDeRs is available. Load it?')) {
		        window.location.reload();
		      }
		    } else {
		      // Manifest didn't changed. Nothing new to server.
		    }
		  }, false);

		}, false);

		//start listening to mouse & touch events
		window.addEventListener('load', initInput, false);

		
		// /* Connect to XML */
		$.ajax({
		type: "GET",
		url: "game.xml",
		dataType: "xml",
		async: false,
		success: function(xmldata) {
			$(xmldata).find('data').each(function(){
				// SETTINGS
				X_Sound = parseInt($(this).find('sound').text());
				X_Music = parseInt($(this).find('music').text());
				X_Level = parseInt($(this).find('level').text());
				X_Lives = parseInt($(this).find('player-lives').text());
				X_PlayerSpeed = parseInt($(this).find('player-speed').text());
				X_EnemySpeed = parseInt($(this).find('enemy-speed').text());
				X_GunSpeed = parseInt($(this).find('reload-time').text());
				X_EnGunSpeed = parseInt($(this).find('enreload-time').text());
				X_BulletSpeed = parseInt($(this).find('bullet-speed').text());
				X_EnBulletSpeed = parseInt($(this).find('enbullet-speed').text());
				// INTRO TEXT
				X_Title = $(this).find('title').text();
				X_Subtitle = $(this).find('subtitle').text();
				X_dt_Start = $(this).find('dt-start').text();
				X_mb_Start = $(this).find('mb-start').text();
			});
		},
		error: function() {
			alert("The XML File could not be processed correctly.");
		}
		});


		/*GAME VARS*/

		var game = {}; //this is a global var which will contain other game vars
		game.stars = []; //this is an array which will contain our stars info: position in space and size		
		game.score = 0; //the game score
		game.levelScore = 0; //the score for each level
		game.level = X_Level; //starting at level X...
		game.lives = X_Lives; //with X ships (lives)
		game.keys = []; //the keyboard array
		game.playerBullets = []; //Our proton torpedoes!
		game.enemyBullets = []; //Enemy missiles!
		game.enemies = []; //The InVaDeRs
		game.waves = [];
		game.loot = [];
		game.explosions = [];
		
		dt = 0; // defining dt globally
		dtTimer = 0;		
		dtArray = [];
		timeThen = new Date().getTime();

		// res = 4*5; //check the 4th index every 5 frames
		
		//====================== Game state ========================
		
		game.start = true;
		game.paused = true;
		game.gameWon = false;
		game.gameOver = false;
		game.delayTimer = 0;
		game.timer = 0;	
		
		
		//========================== Audio ==========================
		
		game.sound = X_Sound;	//on/off trigger
		game.music = X_Music;	//on/off trigger
		game.sounds = [];
		game.songs = [];

		// game.enemyexplodeSound = new Audio("_sounds/explosion.wav");
		// game.playerexplodeSound = new Audio("_sounds/blast.mp3");
		// game.shootSound = new Audio("_sounds/laser.wav");
		// game.deathSound = new Audio("_sounds/death.mp3");
		// game.winSound = new Audio("_sounds/victory.mp3");

			
		//======================== Images ========================		
			
		game.images = [];
		game.doneImages  = 0; // will contain how many images have been loaded
		game.requiredImages = 0; // will contain how many images should be loaded
		// game.font = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? "Helvetica" : "Monaco";
		game.res = 4; //check the 4th index every 5 frames

		
		//====================== Canvases + Images + responsiveness  ============================
		
		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d"); //defining the 4 different canvas
		game.contextEnemies = document.getElementById("enemiesCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
		game.contextText = document.getElementById("textCanvas").getContext("2d");
				

		//making our canvases dynamically resize according to the size of the browser window
			
		// LOOKS LIKE WE'RE DUPLICATING STUFF HERE - CHECK THIS LATER

			//Get the canvas & context
		var c1 = $('#backgroundCanvas');
		var c2 = $('#enemiesCanvas');
		var c3 = $('#playerCanvas');
		var c4 = $('#textCanvas');
		var ct = c1.get(0).getContext('2d');
		var container = $(c1).parent();

		

		//Run function when browser resizes
		$(window).resize(respondCanvas);

		function respondCanvas(){ 

			c1.attr('height', $(container).height()); //max height
			c2.attr('height', $(container).height()); //max height
			c3.attr('height', $(container).height()); //max height
			c4.attr('height', $(container).height() * 0.2 ); //max height


			if ($(container).width() < 1080) {
			c1.attr('width', $(container).width()); //max width
			c2.attr('width', $(container).width()); //max width
			c3.attr('width', $(container).width()); //max width
			c4.attr('width', $(container).width()); //max width
			game.width = $(container).width();

			}
			else {
			var widthProp = $(container).height() * 9 / 16;
			c1.attr('width', widthProp); //max width
			c2.attr('width', widthProp); //max width
			c3.attr('width', widthProp); //max width
			c4.attr('width', widthProp); //max width
			c1.css({"left": ($(container).width()-widthProp)*0.5});
			c2.css({"left": ($(container).width()-widthProp)*0.5});
			c3.css({"left": ($(container).width()-widthProp)*0.5});
			c4.css({"left": ($(container).width()-widthProp)*0.5});
			game.width = widthProp;
			}

			 //we'll use width and height to limit the game to our canvas size
			game.height = $(container).height();

			//delta size will keep the size of our objects proportional to the display
			dtSize = game.height*0.001;
			// console.log (dtSize);
			
			// game.player = {	//creating our player
			// 	x: game.width*0.46,
			// 	y: game.height*0.90,
			// 	size: game.height*0.08,
			// 	speed: X_PlayerSpeed,
			// 	bulletspeed: X_BulletSpeed*game.height/1000,
			// 	image: 0,
			// 	rendered: false,
			// 	crashed: false					
			// };
			
			//the below needs width and height defined, thus we put it here	

			//======================  Game settings =====================				
			
			
			game.enemySpeed = X_EnemySpeed * game.height/2500; //the enemies' speed
			game.EnBulletSpeed = X_EnBulletSpeed * game.height/1000;

			game.fullShootTimer = X_GunSpeed;	//this timer will limit the number of bullets being fired
			game.enfullShootTimer = X_EnGunSpeed;	//this timer will limit the number of bullets being fired by enemies
			game.shootTimer = game.fullShootTimer;
			game.enshootTimer = game.enfullShootTimer;

			//=========================== Game loading Screen =================================== 	
			game.contextBackground.font = "bold " + game.width*0.08 + "px " + game.font; 
			game.contextBackground.fillStyle = "white";
			game.contextBackground.fillText("Loading...", game.width*0.30, game.height*0.47);
		}

		//Initial call 
		respondCanvas();
		
	// jshint ignore:line
function background(speed, image, section) {
	particle.call(this, speed);

	this.direction = Math.PI/2;
	this.section = section;
	this.width = game.width;
	this.height = (game.width * (16 / 9)) * 4 ;
	this.x = 0;
	this.y = (this.section === 0) ? -(this.height-game.height) : this.y = -(this.height);
	this.image = image;

	this.update = function() {
		this.vx = Math.cos(this.direction) * (speed*dt);
		this.vy = Math.sin(this.direction) * (speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};


	this.draw = function() {


		game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);

	};	
}

background.prototype = Object.create(particle.prototype); // Creating a background.prototype object that inherits from particle.prototype.
background.prototype.constructor = background; // Set the "constructor" property to refer to background

level1Bg = [];
function explosion(x, y, speed, direction, size) {
	particle.call(this, x, y, speed, direction);

	this.x = x - (size*0.2);
	this.y = y - (size*0.2);
	this.speed = speed;
	this.size = size*1.5;
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;
	this.image = 3;
	this.frameWidth = 96;
	this.frameHeight = 96;
	this.startFrame = 0;
	this.endFrame = 19;
	this.frameSpeed = 2;
	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth);


	// if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}

	this.update = function() {
		this.vx = Math.cos(direction) * (this.speed*dt);
		this.vy = Math.sin(direction) * (this.speed*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;


		// create the sequence of frame numbers for the animation
		for (this.FrameNum = this.startFrame; this.FrameNum <= this.endFrame; this.FrameNum++){
			this.animationSequence.push(this.FrameNum);
		}

		// update to the next frame if it is time
		if (this.counter == (this.frameSpeed - 1)) {
			this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
		}

		// update the counter
		this.counter = (this.counter + 1) % this.frameSpeed;

		this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
		this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);

	};

	this.draw = function() {
		// game.contextPlayer.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (this.currentFrame <= 19){
			game.contextPlayer.drawImage(
				game.images[this.image],
				this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
				this.frameWidth, this.frameHeight,
				this.x, this.y,
				this.size, this.size);
		}

	};
}

explosion.prototype = Object.create(particle.prototype); // Creating a explosion.prototype object that inherits from particle.prototype.
explosion.prototype.constructor = explosion; // Set the "constructor" property to refer to explosion

function player(hull, fireRate) {
	particle.call(this);

	this.x = game.width*0.46;
	this.y = game.height*0.90;
	this.speed = 0;
	this.direction = -Math.PI/2;
	this.size = 100*dtSize;
	this.hull = hull;
	this.bulletspeed = X_BulletSpeed*game.height/1000;
	this.image = 0;
	this.rendered = false;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bullets = [];
	this.bulletTimer = fireRate-1;
	this.bulletDivision = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
	this.context = game.contextPlayer;

	// bulletspeed: X_BulletSpeed*game.height/1000,

	this.update = function() {
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		// this.x += this.vx;
		// this.y += this.vy;

		if (mouseIsDown && !(game.paused) && !(game.gameOver) && !(game.gameWon)) {

				
			if((canvasX > (this.size/4) && canvasX <= (game.width - this.size/4)) && (canvasY > this.size) && canvasY <= (game.height - this.size/6)) {			
			
				moveRight1 = (canvasX > moveX && canvasX <= moveX + 2) ? true : false;
				moveRight2 = (canvasX > moveX + 2 && canvasX <= moveX + 4) ? true : false;
				moveRight3 = (canvasX > moveX + 4 && canvasX <= moveX + 6) ? true : false;
				moveRight4 = (canvasX > moveX + 6 && canvasX <= moveX + 8) ? true : false;
				moveRight5 = (canvasX > moveX + 8) ? true : false;

				moveLeft1 = (canvasX < moveX && canvasX >= moveX -2) ? true : false;
				moveLeft2 = (canvasX < moveX - 2 && canvasX >= moveX -4) ? true : false;
				moveLeft3 = (canvasX < moveX - 4 && canvasX >= moveX -6) ? true : false;
				moveLeft4 = (canvasX < moveX - 6 && canvasX >= moveX -8) ? true : false;
				moveLeft5 = (canvasX < moveX - 8) ? true : false;

				if (canvasX != moveX || canvasY != moveY) {
					distX = moveX - canvasX;
					distY = moveY - canvasY;
					
					if (distX < 10 && distX > -10){this.speed = 400;this.x -= distX;}
					else if (distX >= 10) {this.speed = 400;this.x -= this.speed*dt;}
					else if (distX <= -10) {this.speed = 400;this.x += this.speed*dt;}

					if (distY < 10 && distY > -10){this.speed = 400;this.y -= distY;}
					else if (distY >= 10) {this.speed = 400;this.y -= this.speed*dt;}
					else if (distY <= -10) {this.speed = 400;this.y += this.speed*dt;}

				}

				// console.log (canvasX);
				// console.log (moveX);
				// console.log (canvasY);
				// console.log (moveY);
				
				if (moveRight1) {
					this.image = 4;
				} else if (moveRight2) {
					this.image = 5;
				} else if (moveRight3) {
					this.image = 6;
				} else if (moveRight4) {
					this.image = 7;
				} else if (moveRight5) {
					this.image = 8;

				} else if (moveLeft1) {
					this.image = 9;
				} else if (moveLeft2) {
					this.image = 10;
				} else if (moveLeft3) {
					this.image = 11;
				} else if (moveLeft4) {
					this.image = 12;
				} else if (moveLeft5) {
					this.image = 13;
				} else {
				 this.image = 0;	
				}

				this.rendered = false;				
				moveX = this.x + this.size*0.5; 	//second define of moveX as canvasX position
				moveY = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? this.y + this.size*2 : this.y + this.size; 	//second define of moveX as canvasX position
			
			}
			/*		console.log (canvasX)
					console.log (moveX);
					console.log (moveRight);*/
		}

		if (!mouseIsDown && !game.gameOver) {
			this.image = 0;
			this.rendered = false;
		}

		//left
		if(game.keys[37] || game.keys[65] && !(game.gameOver) && !(game.gameWon)){ //if key pressed..				
			if(this.x > this.size/50){ // (keeping it within the boundaries of our canvas)
				this.speed = 400;
				this.direction = Math.PI;				
				this.image = 13;
				this.rendered = false;
				this.x -= this.speed*dt;
			}
		}
		//right
		if(game.keys[39] || game.keys[68] && !(game.gameOver) && !(game.gameWon)){
			if(this.x <= game.width - this.size){
				this.speed = 400;
				this.direction = 0;
				this.image = 8;
				this.rendered = false;
				this.x += this.speed*dt;
			}
		}
		if(game.keys[38] || game.keys[87] && !(game.gameOver) && !(game.gameWon)){
			if(this.y > this.size/12){
				this.speed = 400;
				this.direction = -Math.PI/2;
				this.rendered = false;
				this.y -= this.speed*dt;
			}
		}
		if(game.keys[40] || game.keys[83] && !(game.gameOver) && !(game.gameWon)){
			if(this.y <= game.height - this.size){
				this.speed = 400;
				this.direction = Math.PI/2;
				this.rendered = false;
				this.y += this.speed*dt;
			}	
		}
		else {
			this.speed = 0;
		}


		if((game.keys[32] || mouseIsDown) && !(game.gameOver)){ //only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
			this.bulletTimer++;
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer % this.bulletDivision === 0) {
				// (x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame)
				switch(this.laserLevel) {
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));				
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}				
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				 }

				 switch(this.missileLevel) {
				 	case 0:
				 		break;
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));										
				 }				
				this.bulletTimer = 1; //resetting our timer
			}
		}
		else {
			this.bulletTimer = fireRate-1;
		}

		if (this.hull <= 0) {
			// console.log(this.x);
			// console.log(this.y);
			// console.log(this.speed);
			// console.log(this.direction);
			game.explosions.push(new explosion(this.x, this.y, this.speed*0.5, this.direction, this.size));
			this.dead = true;
			if (game.sound){game.sounds.push(new Audio("_sounds/blast.mp3"));}
			PlayerDie();
			this.lives -= 1;
			this.hull = hull;
		}

		this.vx = Math.cos(this.direction) * this.speed;
		this.vy = Math.sin(this.direction) * this.speed;



	};



	this.draw = function() {


		if(!this.dead){		
			
			game.contextPlayer.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //rendering

			if (this.hit) {
				this.hitTimer++;
				navigator.vibrate(30);

				// var imgData = game.contextPlayer.getImageData(this.x, this.y, this.size, this.size);

				// var d = imgData.data;
			 //    for (var i = 0; i < d.length; i += 4) {
			 //      var r = d[i];
			 //      var g = d[i + 1];
			 //      var b = d[i + 2];
			 //      d[i] = d[i + 1] = d[i + 2] = 255;
			 //    }

				// game.contextPlayer.putImageData(imgData, this.x, this.y);

				if (this.hitTimer > 4){
					this.hit = false;
					this.hitTimer = 0;
				}				 
			}

		}
	};

	this.reset = function() {
		this.dead = false;
		this.x = game.width*0.46;
		this.y = game.height*0.90;
		this.image = 0;
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0; 
		this.dead = false;
		this.friction = 0;
		this.bullets = [];
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
player.prototype.constructor = player; // Set the "constructor" property to refer to player


playerShip = new player(10, 20);
function playerBullet(x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame) {
	particle.call(this, x, y, speed, direction);
	
	this.size = bulletSize*dtSize;
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.frameWidth = imageSize;
	this.frameHeight = imageSize;
	this.startFrame = 0;
	this.endFrame = endFrame;
	this.frameSpeed = 4;
	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth); //Sprite FramesperRow
	this.image = image;
	this.friction = friction;
	this.dtSet = false;
	this.context = game.contextPlayer;

	this.update = function(){ // Replacing the default 'update' method		
		//setting this to make friction work with deltaTime (dt), check particle.js
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
			this.dtSet = true;
		}
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		// create the sequence of frame numbers for the animation
		for (this.FrameNum = this.startFrame; this.FrameNum <= this.endFrame; this.FrameNum++){
			this.animationSequence.push(this.FrameNum);
		}

		// update to the next frame if it is time
		if (this.counter == (this.frameSpeed - 1)) {
			this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
		}

		// update the counter
		this.counter = (this.counter + 1) % this.frameSpeed;

		this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
		this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);
	};
	
	this.draw = function() {		
		
		if (!this.dead) {			

			// game.contextPlayer.save();
			// game.contextPlayer.translate(this.lastX, this.lastY);
			// game.contextPlayer.rotate(direction - Math.PI/2);

			// game.contextPlayer.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails

			// game.contextPlayer.restore();

			game.contextPlayer.save();
			game.contextPlayer.translate(this.x, this.y);
			game.contextPlayer.rotate(direction - Math.PI/2);

			game.contextPlayer.drawImage(
				game.images[this.image],
				this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
				this.frameWidth, this.frameHeight,
				-this.size/2, -this.size/2,
				this.size, this.size);
			
			game.contextPlayer.restore();

		}
	};
}

playerBullet.prototype = Object.create(particle.prototype); // Creating a playerBullet.prototype object that inherits from particle.prototype.
playerBullet.prototype.constructor = playerBullet; // Set the "constructor" property to refer to playerBullet
function enemy(x, y, speed, direction, hull, type, image, fireRate, sheep) {
	particle.call(this, x, y, speed, direction);

	this.type = type;
	switch (this.type){
		case 'pawn':
				this.size = 65*dtSize;
			break;
		case 'miniboss':
				this.size = 120*dtSize;	
			break;
		case 'base':
				this.size = 170*dtSize;
				this.rotation = 0;	
			break;
	}
	this.hull = hull;
	this.image = image;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bulletTimer = 1;
	this.sheep = sheep || false;
	this.fireRate = fireRate * 60; //bullets/sec

	this.bulletDivision = (this.sheep) ? (this.fireRate*2) - (Math.floor(Math.random()*this.fireRate)) || 99999 : this.bulletDivision = this.fireRate || 99999;
	this.context = game.contextEnemies;

	this.update = function() {
		this.lastX = this.x;
		this.lastY = this.y;
		this.vx = Math.cos(direction) * (speed*dt);
		this.vy = Math.sin(direction) * (speed*dt);		
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		if(this.hit && this.hull > 0 ){
			if(game.sound){game.sounds.push(new Audio("_sounds/_sfx/hit.mp3"));}
			//change image here		
			this.hit = false;
		}

		if (this.hull <= 0 ) {
			this.dead = true;

			if(this.type == 'base'){				
				game.explosions.push(new explosion(this.x-this.size/2, this.y-this.size/2, speed, direction, this.size));
			}
			else{
				game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));
			}
			if(game.sound){game.sounds.push(new Audio("_sounds/explosion.mp3"));}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;
				gameUI.updateScore();								
			}
		}

		if(this.fireRate !== 0){
			this.bulletTimer++;
			if (this.bulletTimer % this.bulletDivision == 1){
				this.bulletTimer = 1;				
				bulletX = (this.type == 'base') ? (this.x + this.size*0.42) - this.size/2 : this.x + this.size*0.42;
				bulletY = (this.type == 'base') ? (this.y + this.size) - this.size/2 : this.y + this.size;
				bulletDirection = this.angleTo(playerShip);
				game.enemyBullets.push(new enemyBullet(bulletX, bulletY, 50, bulletDirection, 1, 20));			
			}
		}

		if(this.type != 'base' )
		{	
		direction -= utils.randomRange(-0.05, 0.05);
		}
	};

	this.draw = function() {
		
		if(this.type == 'base'){ //making bases rotate
			// //clear trails
			// game.contextEnemies.save();
			// game.contextEnemies.translate(this.lastX, this.lastY);
			// game.contextEnemies.rotate(this.rotation);
			// game.contextEnemies.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails
			// game.contextEnemies.restore();

			if (!this.dead) {				

				//set rotation speed
				this.rotation += 0.01;

				//rotate canvas
				game.contextEnemies.save();
				game.contextEnemies.translate(this.x, this.y);
				game.contextEnemies.rotate(this.rotation);

				//draw image
				game.contextEnemies.drawImage(game.images[this.image], -this.size/2, -this.size/2, this.size, this.size);

				game.contextEnemies.restore();
			}
		}
		else {
			// game.contextEnemies.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
			if (!this.dead) {
				game.contextEnemies.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render
			}
		}

		// if (this.hit) {
		// 	this.hitTimer++;
		// 	var imgData = (this.type == 'base') ? game.contextEnemies.getImageData(this.x-this.size/2, this.y-this.size/2, this.size, this.size) : game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

		// 	var d = imgData.data;
		//     for (var i = 0; i < d.length; i += 4) {
		//       var r = d[i];
		//       var g = d[i + 1];
		//       var b = d[i + 2];
		//       d[i] = d[i + 1] = d[i + 2] = 255;
		//     }

		//     if (this.type == 'base'){
		//    		game.contextEnemies.putImageData(imgData, this.x-this.size/2, this.y-this.size/2);
		//    	}
		//    	else{
		// 		game.contextEnemies.putImageData(imgData, this.x, this.y);
		// 	}

		// 	if (this.hitTimer > 4){
		// 		this.hit = false;
		// 		this.hitTimer = 0;
		// 	} 
		// }
	};
}

enemy.prototype = Object.create(particle.prototype); // Creating a enemy.prototype object that inherits from particle.prototype.
enemy.prototype.constructor = enemy; // Set the "constructor" property to refer to enemy
function boss(x, y, speed, direction, hull, image) {
	particle.call(this, x, y, speed, direction);

	this.hull = hull;
	this.image = image;
	this.size = 200*dtSize;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;
	this.bulletTimer1 = 1;
	this.bulletTimer2 = 1;
	this.bulletDivision1 = 50;
	this.bulletDivision2 = 30;
	this.fireRate = 0; //bullets/sec
	// this.fireRate = fireRate * 60; //bullets/sec
	this.context = game.contextEnemies;


	this.update = function() {
		this.bulletDirection = this.angleTo(playerShip);
		this.vx = Math.cos(direction) * (speed*dt);
		this.vy = Math.sin(direction) * (speed*dt);		
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;


		if(this.hit && this.hull > 0 ){
			if(game.sound){game.sounds.push(new Audio("_sounds/_sfx/hit.mp3"));}
			//change image here		
			this.hit = false;
		}

		// player-boss collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver){			
			playerShip.hull -= this.hull;
			playerShip.hit = true;			
			this.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 ) {
			this.dead = true;
			game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));			
			if(game.sound){game.sounds.push(new Audio("_sounds/blast.mp3"));}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;							
			}
		}


			this.bulletTimer1++;
			this.bulletTimer2++;

			// (x, y, speed, direction, power, image)
			if (this.bulletTimer1 % this.bulletDivision1 == 1){
				this.bulletTimer1 = 1;				
				game.enemyBullets.push(new enemyBullet(this.x, this.y + this.size*0.6, 50, this.bulletDirection, 1, 20));			
				game.enemyBullets.push(new enemyBullet(this.x + this.size, this.y + this.size*0.6, 50, this.bulletDirection, 1, 20));			
			}
		
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer2 % this.bulletDivision2 == 1) {				
				// if (game.sound){game.shootSound.play();}
				this.bulletTimer2 = 1; //resetting our timer
				bulletX = this.x + this.size*0.48;
				bulletY = this.y + this.size;
			    game.enemyBullets.push( new enemyBullet(bulletX, bulletY, 250, Math.PI/2, 1.5, 2));
			    game.enemyBullets.push( new enemyBullet(bulletX, bulletY, 250, Math.PI/2, 1.5, 2));				
			}

		

		if (this.y > game.height*0.1){
			speed = 0;
			if (this.x > 0 && this.x <= game.width - this.size/4) {

				if (this.x < playerShip.x){
					this.x += 1;
				}
				else if (this.x > playerShip.x){
					this.x -= 1;
				}

			}
		}

	};

	this.draw = function() {
		
		game.contextEnemies.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (!this.dead) {
				game.contextEnemies.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render
		}		

		// if (this.hit) {
		// 	this.hitTimer++;
		// 	var imgData = game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

		// 	var d = imgData.data;
		//     for (var i = 0; i < d.length; i += 4) {
		//       var r = d[i];
		//       var g = d[i + 1];
		//       var b = d[i + 2];
		//       d[i] = d[i + 1] = d[i + 2] = 255;
		//     }
			
		// 	game.contextEnemies.putImageData(imgData, this.x, this.y);

		// 	if (this.hitTimer > 4){
		// 		this.hit = false;
		// 		this.hitTimer = 0;
		// 	} 
		// }
	};
}

boss.prototype = Object.create(particle.prototype); // Creating a boss.prototype object that inherits from particle.prototype.
boss.prototype.constructor = boss; // Set the "constructor" property to refer to enemy
function enemyBullet(x, y, speed, direction, power, image) {
	particle.call(this, x, y, speed, direction);
	
	this.size = 30*dtSize;
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.frameWidth = 64;
	this.frameHeight = 64;
	this.startFrame = 0;
	this.endFrame = 2;
	this.frameSpeed = 5;
	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth); //Sprite FramesperRow
	this.image = image;
	this.friction = 1.02;
	this.dtSet = false;
	this.context = game.contextPlayer;

	this.update = function(){ // Replacing the default 'update' method
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
			this.dtSet = true;
		}		
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		// create the sequence of frame numbers for the animation
		for (this.FrameNum = this.startFrame; this.FrameNum <= this.endFrame; this.FrameNum++){
			this.animationSequence.push(this.FrameNum);
		}

		// update to the next frame if it is time
		if (this.counter == (this.frameSpeed - 1)) {
			this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
		}

		// update the counter
		this.counter = (this.counter + 1) % this.frameSpeed;

		this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
		this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);

	};
	
	this.draw = function() {
		
		
		if (!this.dead) {			

			// game.contextPlayer.save();
			// game.contextPlayer.translate(this.lastX, this.lastY);
			// game.contextPlayer.rotate(direction - Math.PI/2);

			// game.contextPlayer.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails

			// game.contextPlayer.restore();

			game.contextPlayer.save();
			game.contextPlayer.translate(this.x, this.y);
			game.contextPlayer.rotate(direction - Math.PI/2);

			game.contextPlayer.drawImage(
				game.images[this.image],
				this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
				this.frameWidth, this.frameHeight,
				-this.size/2, -this.size/2,
				this.size, this.size);
			
			game.contextPlayer.restore();

		}
	};
}

enemyBullet.prototype = Object.create(particle.prototype); // Creating a enemyBullet.prototype object that inherits from particle.prototype.
enemyBullet.prototype.constructor = enemyBullet; // Set the "constructor" property to refer to enemyBullet
function loot(x, y) {
	particle.call(this, x, y);

	this.speed = 250;
	this.direction = Math.PI/2;
	this.size = 45*dtSize;
	this.dead = false;
	this.drops = ['health', 'laser', 'missile'];
	var key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[key];

	switch(this.type) {
    case 'health':
        this.image = 0;
        break;
    case 'laser':
        this.image = 2;
        break;
    case 'missile':
        this.image = 20;
	}
	this.context = game.contextPlayer;

	this.update = function() {
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		// player-loot collision
		if (Collision(this, playerShip) && !this.dead && !game.gameOver){			
			switch(this.type) {
			    case 'health':
			    	if (this.hull <= 7.5) {
			    		playerShip.hull += 2.5;
					}
					else {
						playerShip.hull = 10;
					}
			        gameUI.updateEnergy();
			        break;
			    case 'laser':
			        playerShip.laserLevel += 1;
			        break;
			    case 'missile':
			        playerShip.missileLevel += 1;
			}
			if(game.sound){game.sounds.push(new Audio("_sounds/_sfx/loot_powerUp.mp3"));}
			this.dead = true;
		}

	};

	this.draw = function() {
		game.contextPlayer.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (!this.dead) {			
			game.contextPlayer.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render			
		}
	};
}

loot.prototype = Object.create(particle.prototype); // Creating a loot.prototype object that inherits from particle.prototype.
loot.prototype.constructor = loot; // Set the "constructor" property to refer to loot

var enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate) {
	
	this.side = side;
	this.spawnedShips = 0;
	this.race = race;
	this.type = type;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.fireRate = fireRate || 0;
	this.spawnTimer = 1;
	this.spawnDivision = 15;
	switch (this.side){
		case 'top':
			this.x = pos;
			this.y = -game.height*0.1;
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = -game.width*0.2;
			this.y = pos;
			this.direction = 0;
			break;
		case 'right':
			this.x = game.width*1.2;
			this.y = pos;
			this.direction = Math.PI;
			break;
	}
	this.over = false;
	// this.bulletTimer = 1;
	// this.bulletDivision = fireRate || 99999;
	// this.loot = [];
	


	this.update = function() {
					
		if (dt !== 0 && !this.spawnDivisionSet){
			this.spawnDivision = Math.round(700 * dt);
			this.spawnDivisionSet = true;
		}
						
			
		this.spawnTimer++;
				
		if (this.spawnedShips <= this.fleetSize){
			if (this.spawnTimer % this.spawnDivision == 1){   
				this.spawnTimer = 1;					
				game.enemies.push(new enemy(this.x, this.y, this.speed, this.direction, this.hull, this.type, this.race, this.fireRate, true));
				this.spawnedShips++;
			}
		}

		if (this.spawnedShips == this.fleetSize){
			this.over = true;
		}
	};
	
};
function ui() {

	this.width = game.width;
	this.height = game.height*0.04;
	this.energyBarSize = game.width*0.3;
	this.energyPointSize = game.height*0.01;
	this.hangarShipSize = game.height*0.03;
	this.level = game.level;
	game.contextText.fillStyle = "#FFD455";
	game.contextText.font = 15*dtSize + 'px helvetica';

	this.updateLevel = function() {
		this.level = game.level;
		game.contextText.clearRect(this.width*0.02, this.height*0.3, this.width*0.05, this.height*0.35); 
		game.contextText.fillText("S" + this.level, this.width*0.02, this.height*0.6); //printing level
	};

	this.updateScore = function() {
		this.score = game.score;
		game.contextText.clearRect(this.width*0.1, this.height*0.3, this.width*0.12, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.width*0.1, this.height*0.6); //printing the score
	};

	this.updateSound = function() {	
		this.soundFx = game.sound ? "ON" : "OFF";
		// this.music = game.music;	
		if (!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
			game.contextText.clearRect(this.width*0.39, this.height*0.3, this.width*0.05, this.height*0.35); 
			game.contextText.fillText("Sound(F8): " + this.soundFx, this.width*0.25, this.height*0.6);
		}
	};

	this.updateEnergy = function() {		
		this.hull = playerShip.hull;
		game.contextText.clearRect(this.width*0.555, this.height*0.27, this.width*0.205, this.height*0.34);				
		for (s = 0; s < this.hull; s++){	
			game.contextText.drawImage(game.images[26], (this.width*0.545)+s*11, this.height*0.15, this.energyPointSize, this.energyPointSize*2.2);
		}
	};

	this.updateHangar = function() {
		this.hangar = playerShip.lives;
		game.contextText.clearRect(this.width*0.83, this.height*0.35, this.width*0.13, this.height*0.58);		
		for (i = 0; i < this.hangar; i++){
			//printing lives
			game.contextText.drawImage(game.images[0], this.width*0.82 + (this.width * 0.05 * i) , this.height*0.3, this.hangarShipSize, this.hangarShipSize);
		}
	};

	this.updateAll = function() {
		game.contextText.clearRect(0, 0, this.width, this.height*1.5);
		game.contextText.drawImage(game.images[25], this.width*0.5, -this.height*0.1, this.energyBarSize, this.energyBarSize/4);
		this.updateLevel();
		this.updateScore();
		this.updateSound();
		this.updateEnergy();
		this.updateHangar();		
	};
	
}

gameUI = new ui();
//====================== Game state =================//
		
		function gameState() {


			//game start
			if ((game.keys[13] || mouseIsDown) && game.start && !(game.gameOver) && !(game.gameWon)) {
				game.paused = false;
				game.start = false;
				mouseIsDown = 0;				
				gameUI.updateAll();	
				if(game.music && game.songs.length < 1){
					game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
					game.songs[0].play();
					game.songs[0].loop = true;				
					// game.music[q].addEventListener("ended", game.music.splice(q,1));
				}				
			}
			
			//If Esc
			if (game.keys[27]) {
				game.lives = 0;
				resetGame();	
				game.keys[27] = false;			
			}

			//game sound
			if (game.keys[119]) {				
				game.sound = (game.sound) ? false : true;
				gameUI.updateSound();	
				game.keys[119] = false;
			}

			if (game.keys[120]) {
				game.music = (game.music) ? false : true;
				gameUI.updateSound();
				game.keys[120] = false;	



				if (game.songs.length > 0) {
					for(var g in game.songs){
						game.songs[g].pause();
					}
					game.songs = [];
				}
				else if (game.songs.length < 1) {
						game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
						for(var w in game.songs){
							game.songs[w].play();
							game.songs[w].loop = true;					
							// game.music[q].addEventListener("ended", game.music.splice(q,1));
						}
				}
			}


			//game pause
			if ((game.keys[80]) && !(game.gameWon) && !(game.gameOver)) {
				game.paused = (game.paused) ? false : true;
				game.keys[80] = false;
			}

			//If Esc pressed or if gameover and enter pressed
			if (game.keys[27] ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.gameOver && !(game.gameWon)) ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.level >= 7)){

					if (game.lives < 1 || game.level >=7){
						game.level = X_Level;
						game.score = 0;
						playerShip.lives = X_Lives;
						// game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
					}

					resetGame();

			}
			
			//level up
			if ((game.keys[13] || mouseIsDown) && !(game.gameOver) && !(game.start) && (game.gameWon) && game.level <= 6) {					
					game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
					resetGame();									
			}


			if (game.gameWon && game.level > 1 && game.level <=6 ){

				message('Battle Won!', 'Helvetica', game.height*0.08, '#FFD455', 'bold'); 
				message(game.levelScore + ' enemy ships destroyed', 'Helvetica', game.height*0.06, '#FFD455', 'bold');
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to continue', 'Helvetica', game.height*0.04, '#FFD455', 'bold'); 
				} else {
					message('Press ENTER or LMB to continue', 'Helvetica', game.height*0.04, '#FFD455', 'bold');
				}
				game.levelScore = 0;
			}

			if (game.gameWon && game.level >=7){
				game.contextPlayer.font = "bold " + game.width*0.08 + "px " + game.font;				
				game.contextPlayer.fillStyle = "#CC99FF";
				game.contextPlayer.fillText("Victory!", game.width*0.35, game.height*0.42);
				game.contextPlayer.font = "bold " + game.width*0.06 + "px " + game.font;
				game.contextPlayer.fillText(game.score + " enemy ships destroyed", game.width*0.17, game.height*0.52);
				game.contextPlayer.font = "bold " + game.width*0.04 + "px " + game.font;
				game.contextPlayer.fillStyle = "white";
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					game.contextPlayer.fillText("Tap screen to restart", game.width*0.30, game.height*0.62);
				} else {
					game.contextPlayer.fillText("Press Enter or LMB to restart", game.width*0.24, game.height*0.62);
				}
				game.levelScore = 0;
			}
		}
		//====================== Main update function =================//		
		function update(){
			//obtaining an average deltaTime
			if(dtTimer <= 30){

				var timeNow = new Date().getTime();
				var timeDiff = timeNow - (timeThen);
				// console.log (timeDiff);
	    		dtArray.push(timeDiff); // seconds since last frame
	    		timeThen = timeNow;
	    		dtTimer++;
    		}

    		if(dtTimer == 30){
    			var dtSum = 0;
    			for( var i = 0; i < dtArray.length-2; i++) {
					dtSum += dtArray[i+2]; //+2 skips first values which might be deviant
					// console.log (dtSum);
				}
					dt = Math.round(dtSum / dtArray.length)/1000;					
    		}	
    		// console.log (dt);
    		// console.log (timeNow);
    		// console.log (timeThen);

			game.timer++;
			game.seconds = game.timer/60 || 0;
			// console.log(game.seconds);	

			//////////////////////// 
			// Init
			///////////////////////							
			game.contextPlayer.clearRect(0, 0, game.width, game.height); //clear trails
			playerShip.update();
			playerShip.draw();
			game.contextEnemies.clearRect(0, 0, game.width, game.height); //clear trails

			//////////////////////// 
			// Background
			///////////////////////

			// addStars(1);		

			game.contextBackground.clearRect(0, 0, game.width, game.height); //clear trails

			if (level1Bg.length < 1){			
				level1Bg.push(new background(150, 21, 0));			
			}

			for (var b in level1Bg){

				if (level1Bg[b].y > -game.height*0.02 && level1Bg.length < 2){

					level1Bg.push(new background(150, 21, 1));				
				}

				if (level1Bg[b].y > game.height){
					level1Bg.splice(b, 1);
				}

				
				level1Bg[b].update();			
				level1Bg[b].draw();
			}


			/////////////////////////////////////////////////////////////////////////////////
			// LEVEL 1
			//
			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
			////////////////////////////////////////////////////////////////////////////////

			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 0, true));
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('left', game.width*0.3, 1, 'pawn', 4, 300, 1, 0, true));		
			}
			if (game.seconds == 5) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));		
			}
			if (game.seconds == 7) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 22, 1));
			}
			if (game.seconds == 11) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 13) {
				if(game.music){
					game.songs.push(new Audio("_sounds/_lvl1/tune2.mp3"));				
					game.songs[1].play();
					game.songs[1].loop = true;
				}
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 23, 1));				
			}
			if (game.seconds == 18) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 22) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 25) {
			    game.waves.push(new enemyWave('left', game.width*0.4, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 27) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 30) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 33) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 35) {
			    game.waves.push(new enemyWave('right', game.width*0.2, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 37) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 40) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 42) {
			    game.enemies.push(new enemy(game.width * 0.5, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 45) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}

			if (game.seconds == 55) {
				if (game.music) {
					game.songs.push(new Audio("_sounds/_lvl1/boss.mp3"));
					game.songs[2].play();
				}
			    game.enemies.push(new boss(game.width*0.3, -game.height*0.1, 150, Math.PI/2, 100, 27));
			}
			//boss(x, y, speed, direction, hull, image)

			///////////////////////////////////
			// Player bullets
			///////////////////////////////////
			if (game.playerBullets.length >= 1) {
				for (var k in game.playerBullets){
					
					if (!game.playerBullets[k].dead) {
						game.playerBullets[k].update();					
						game.playerBullets[k].draw();
					}
					else  if (game.playerBullets.dead || game.playerBullets[k].x > game.width + game.playerBullets[k].size || game.playerBullets[k].x < 0 - game.playerBullets[k].size || game.playerBullets[k].y > game.height + game.playerBullets[k].size || game.playerBullets[k].y < 0 - 30){
						game.playerBullets.splice(k,1);
					}
				}
			}

			///////////////////////////////////
			// Enemies
			///////////////////////////////////

			if (game.enemies.length > 0){
				
				for (var c in game.enemies){
					game.enemies[c].update();
					game.enemies[c].draw();
				}

				for (var j in game.enemies){
					//projectiles collision
					if (game.playerBullets.length >= 1){
						for (var f in game.playerBullets){
							if (Collision(game.enemies[j], game.playerBullets[f]) && !game.enemies[j].dead){ //dead check avoids ghost scoring														
								game.enemies[j].hit = true;	
								game.enemies[j].hull -= game.playerBullets[f].power;
								// game.contextEnemies.clearRect(game.playerBullets[f].x, game.playerBullets[f].y, game.playerBullets[f].size, game.playerBullets[f].size*1.8);								
								if(game.enemies[j].hull > 0) {
									game.explosions.push(new explosion(game.playerBullets[f].x, game.playerBullets[f].y, 0, 1, game.playerBullets[f].size*0.3));
								}
								game.playerBullets[f].dead = true;
								// game.playerBullets.splice(f,1);
							}
						}
					}
				}

				for (var t in game.enemies){					
					// player-enemy collision
					if (Collision(game.enemies[t], playerShip) && !game.enemies[t].dead && !game.gameOver){			
						playerShip.hull -= game.enemies[t].hull;
						gameUI.updateEnergy();						
						playerShip.hit = true;			
						game.enemies[t].hit = true;			
						game.enemies[t].hull -= playerShip.hull;
					}	
				}


				for (var o in game.enemies){
					if(game.enemies[o].dead || game.enemies[o].y > game.height + game.enemies[o].size ||  game.enemies[o].x < -game.width*0.3 ||  game.enemies[o].x > game.width*1.3){					
						if(game.enemies[o].dead){
							// game.contextEnemies.clearRect(game.enemies[o].x, game.enemies[o].y, game.enemies[o].size, game.enemies[o].size);
							lootchance = Math.random();
							if (lootchance < 0.1) {
								game.loot.push(new loot(game.enemies[o].x, game.enemies[o].y));					
							}
						}	

						game.enemies.splice(o,1);				
					}
				}
			}

			///////////////////////////////////
			// Waves
			///////////////////////////////////

			if (game.waves.length > 0){
				for (var h in game.waves){

					game.waves[h].update();

					if(game.waves[h].over){					
						game.waves.splice(h,1);				
					}
				}
			}

			///////////////////////////////////
			// Loot
			///////////////////////////////////

			if (game.loot.length >= 1) {
				for (var u in game.loot){
					game.loot[u].update();
					game.loot[u].draw();



					if(game.loot[u].dead || game.loot[u].x > game.width + game.loot[u].size || game.loot[u].x < 0 - game.loot[u].size || game.loot[u].y > game.height + game.loot[u].size || game.loot[u].y < 0 - 30){
						game.loot.splice(u,1);
					}
				}
			}




			///////////////////////////////////
			// Enemy Bullets
			///////////////////////////////////

			if (game.enemyBullets.length >= 1) {
				for (var z in game.enemyBullets){
					game.enemyBullets[z].update();
					game.enemyBullets[z].draw();


					if (Collision(game.enemyBullets[z], playerShip) && !game.gameOver){ //
						// if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}							
									// game.contextEnemies.clearRect(game.playerBullets[p].x, game.playerBullets[p].y, game.playerBullets[p].size, game.playerBullets[p].size*1.8);								
						playerShip.hull -= game.enemyBullets[z].power;
						gameUI.updateEnergy();	
						playerShip.hit = true;	
						// Xplode(playerShip.x, playerShip.y);
						// playerShip.dead = true;
						// 		game.contextPlayer.clearRect(game.player.x, game.player.y, game.player.size, game.player.size);
						// 		Xplode(game.player.x, game.player.y);
								// PlayerDie();
						// 	}
						game.enemyBullets[z].dead = true;
					}

					if(game.enemyBullets[z].dead || game.enemyBullets[z].x > game.width + game.enemyBullets[z].size || game.enemyBullets[z].x < 0 - game.enemyBullets[z].size || game.enemyBullets[z].y > game.height + game.enemyBullets[z].size || game.enemyBullets[z].y < 0 - 30){
						game.enemyBullets.splice(z,1);
					}
				}
			}

			///////////////////////////////////
			// Game Explosions
			///////////////////////////////////

			if (game.explosions.length > 0) {
				for(var l in game.explosions){

					game.explosions[l].update();
					game.explosions[l].draw();
				}

				for(var p in game.explosions){

					if (game.explosions[p].currentFrame == 19){
						game.explosions.splice(p,1);
					}
				}
			}

			///////////////////////////////////
			// Game Sounds
			///////////////////////////////////

			if (game.sounds.length > 0) {
				for(var s in game.sounds){

					game.sounds[s].play();
					game.sounds[s].addEventListener("ended", game.sounds.splice(s,1));

				}
			}			
		}	
		//====================== Game functions =================//


		//Keyboard		
		$(document).keydown(function(e){    //using jquery to listen to pressed keys
			game.keys[e.keyCode ? e.keyCode : e.which] = true;	//and cross browser proofing
		});
		
		$(document).keyup(function(e){   //using jquery to listen to released keys
			delete game.keys[e.keyCode ? e.keyCode : e.which]; //once key is released, delete the key pressed action previously defined 
		});
		
		//mouse and touch screens
		var canvas;
		var ctx;
		canvasX = playerShip.x;
		canvasY = playerShip.y;
		var mouseIsDown = 0;
		moveX = canvasX;      //initial define of moveX as canvasX position
		moveY = canvasY;      //initial define of moveX as canvasX position
 

		function initInput() {
        canvas = document.getElementById("playerCanvas");
        ctx = canvas.getContext("2d");
		         
        canvas.addEventListener("mousedown",mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);        
        canvas.addEventListener("mousemove",mouseXY, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchend", touchUp, false);
        canvas.addEventListener("touchcancel", touchUp, false);
        canvas.addEventListener("touchleave", touchUp, false);
		canvas.addEventListener("touchmove", touchXY, false);
		                
		}
		
		
		function mouseUp() {
			mouseIsDown = 0;
			mouseXY();
		}
		 
		function touchUp() {
			mouseIsDown = 0;
		}
		 
		function mouseDown() {
			mouseIsDown = 1;
			mouseXY();
		}
		  
		function touchDown() {
			mouseIsDown = 1;
			touchXY();
		}
		
		function mouseXY(e) {
			if (e) {
				e.preventDefault();
			canvasX = e.pageX - canvas.offsetLeft;
			canvasY = e.pageY - canvas.offsetTop;
			//showPos();
			}
		}
		 
		function touchXY(e) {
			if (e) {
				e.preventDefault();
			canvasX = e.targetTouches[0].pageX - canvas.offsetLeft;
			canvasY = e.targetTouches[0].pageY - canvas.offsetTop;
			}
		}
				
		// function addStars(num){ //this function is going to take a number thus num
		// 	for(var i=0; i<num; i+=4) {
		// 		game.stars.push({ //push values to the game.stars array
		// 			x:Math.floor(Math.random() * game.width), //floor will round down x which will be a random number between 0 and 550
		// 			y:game.height + 10, //+10 to spawn then outside the screen so players can't see them spawning
		// 			size: Math.random()*game.width*0.003,
		// 			image: Math.floor(Math.random()*(19-14+1)+14) // a random number between 14 and 18	
		// 		});
		// 	}
		// }
		
		function resetGame(){
			mouseIsDown = 0;
			game.gameOver = false; 
			game.gameWon = false;					
			// game.downCount = 1;
			// game.left = false;
			// game.down = false;
			// game.enshootTimer = game.enfullShootTimer;
			game.contextBackground.clearRect(1, 1, game.width, game.height); 
			game.contextPlayer.clearRect(1, 1, game.width, game.height); 
			game.contextEnemies.clearRect(1, 1, game.width, game.height); 
			game.contextText.clearRect(1, 1, game.width, game.height); 
			// game.projectiles = [];
			// game.enprojectiles = [];
			// game.enemies = [];
			playerShip.reset();
			gameUI.updateAll();
			game.enemies = [];
			game.waves = [];			
			game.enemyBullets = [];
			game.loot = [];
			game.timer = 0;		
			game.sounds = [];

			for(var g in game.songs){
					game.songs[g].pause();
			}
			game.songs = [];

			if (game.music){
				game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
				game.songs[0].play();
				game.songs[0].loop = true;	
			}


			// for(var y = 0; y < game.level; y++) {	// y enemies vertically..
			// 	for(var x = 0; x < game.level; x++){ // ..by x horizontally
			// 		game.enemies.push({ //adding value to the game.enemies array
			// 			x: game.width*0.05  + (x*(game.width*0.15)) ,  //setting positions (1st bit) and making space between enemies (2nd bit)
			// 			y: game.height*0.10 + y*(game.player.size),
			// 			size: game.height*0.06, //the size of our enemies
			// 			image: 1, //their ships...
			// 			dead: false,
			// 			deadTime: 60
			// 		});
			// 	}
			// }

			// game.player = {	//creating our player
			// 	x: game.width*0.46,
			// 	y: game.height*0.90,
			// 	size: game.height*0.08,
			// 	speed: X_PlayerSpeed,
			// 	bulletspeed: X_BulletSpeed*game.height/1000,
			// 	image: 0,
			// 	rendered: false,
			// 	crashed: false					
			// };
			game.paused = false;
			// scores();loading

		}

		// function Xplode(xpos,ypos){ 
		// 	game.explosions.push({
		// 		x: xpos,
		// 		y: ypos,
		// 		frameWidth: 96,
		// 		frameHeight: 96,
		// 		size: game.height*0.07,
		// 		startFrame: 0,
		// 		endFrame: 19,
		// 		frameSpeed: 2,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,             // keep track of frame rate
		// 		image: 3
		// 	});
		// 	if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}
		// }

		// function addBullet(){ //add bullet function will be triggered every time space is pressed
		// 	game.projectiles.push({
		// 		x: playerShip.x + playerShip.size*0.40,
		// 		y: playerShip.y - playerShip.bulletspeed*1.8,
		// 		size: game.height*0.022,
		// 		frameWidth: 48,
		// 		frameHeight: 48,
		// 		startFrame: 0,
		// 		endFrame: 11,
		// 		frameSpeed: 4,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,             // keep track of frame rate
		// 		image: 2

		// 	});
		// }

		// function addEnBullet(){ //add bullet function will be triggered every few seconds
		// 	xEn = game.enemies.length;
		// 	pEn = (xEn < 2) ? 0 : Math.floor(Math.random()*((xEn-1)+1)); //a random number between 0 and the maximum array index (xEn-1)

		// 	game.enprojectiles.push({
		// 		x: game.enemies[pEn].x + game.enemies[pEn].size*0.42,
		// 		y: game.enemies[pEn].y + game.enemies[pEn].size,
		// 		size: game.height*0.035,
		// 		frameWidth: 64,
		// 		frameHeight: 64,
		// 		startFrame: 0,
		// 		endFrame: 2,
		// 		frameSpeed: 5,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,
		// 		image: 20
		// 	});
		// }
		
		// function scores(){ 
		// 	game.contextText.fillStyle = "#FFD455";
		// 	game.contextText.font = game.height*0.025 + "px helvetica";
		// 	game.contextText.clearRect(0, 0, game.width, game.height*0.1);
		// 	game.contextText.fillText("Level: " + game.level, game.height*0.03, game.height*0.04); //printing level
		// 	game.contextText.fillText("Score: " + game.score, game.height*0.15, game.height*0.04); //printing the score
		// 	game.soundStatus = (game.sound) ? "ON" : "OFF";
		// 	if (!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
		// 		game.contextText.fillText("Sound(F8): " + game.soundStatus, game.width - (game.height*0.45), game.height*0.04); //printing lives
		// 	}
		// 	game.contextText.fillText("Hangar: ", game.width - (game.height*0.22), game.height*0.04); 
		// 	for (i = 0; i < game.lives; i++){
		// 		//printing lives
		// 		game.contextText.drawImage(game.images[0], ((i * game.height*0.03)+game.width - (game.height*0.12)), game.height*0.015, game.height*0.035, game.height*0.035);
		// 	}

		// }


		function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
			
			if (!(first.x + first.size < second.x || second.x + second.size < first.x || first.y + first.size < second.y || second.y + second.size < first.y)) {

				Cx = first.x < second.x ? second.x : first.x;
				Cy = first.y < second.y ? second.y : first.y;
				CX = first.x + first.size < second.x + second.size ? first.x + first.size : second.x + second.size;
				CY = first.y + first.size < second.y + second.size ? first.y + first.size : second.y + second.size;

				iFirst = first.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);
				iSecond = second.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);

				var length = iFirst.data.length;

				for (var i = 0 ; i < length; i+= game.res) {
					// return !(!iFirst.data[i] || !iSecond.data[i]);
					if (iFirst.data[i] > 0 && iSecond.data[i] > 0)
					{						
						return true;
					}
				}
			}			
			return false;			
		}

		
		// function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
		// 	return !(first.x > second.x + second.size ||
		// 		first.x + first.size < second.x ||
		// 		first.y > second.y + second.size ||
		// 		first.y + first.size < second.y);
		// }


		function PlayerDie(){
			// if (game.soundStatus == "ON"){game.playerexplodeSound.play();}
			// game.player.crashed = true;
			game.gameOver = true;
			game.lives--;
			game.score = game.score - game.levelScore;
			// scores();
			setTimeout(function(){
				game.paused = true;
				mouseIsDown = 0;

				if (game.gameOver && game.paused && game.lives < 1){
					// game.contextPlayer.font = "bold " + game.width*0.08 + "px " + game.font;
					// game.contextPlayer.fillStyle = "#FF7F00";
					// game.contextPlayer.fillText("Game Over", game.width*0.30, game.height*0.42);
					// game.contextPlayer.font = "bold " + game.width*0.06 + "px " + game.font;
					// game.contextPlayer.fillText(game.score + " enemy ships destroyed", game.width*0.19, game.height*0.52);
					// game.contextPlayer.font = "bold " + game.width*0.04 + "px " + game.font;
					// game.contextPlayer.fillStyle = "white";
					// if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					// 	game.contextPlayer.fillText("Tap screen to restart", game.width*0.30, game.height*0.62);
					// } else {
					// 	game.contextPlayer.fillText("Press Enter or LMB to restart", game.width*0.23, game.height*0.62);
					// }

					message('Game Over', 1,  'Helvetica', game.width*0.06, '#FFD455', 'bold'); 
					message(game.score + ' enemy ships destroyed', 2, 'Helvetica', game.width*0.05, '#FFD455', 'bold');
					if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to restart', 3, 'Helvetica', game.width*0.04, 'white', 'bold'); 
					} else {
					message('Press ENTER or LMB to restart', 3, 'Helvetica', game.width*0.04, 'white', 'bold');
					}

					if (game.soundStatus == "ON") {
						game.sounds.push(new Audio("_sounds/death.mp3"));
					}

					game.levelScore = 0;

				}

			if (game.gameOver && game.paused && game.lives >= 1){
				message('Your ship has been destroyed!', 1,  'Helvetica', game.width*0.06, '#FFD455', 'bold'); 
				message(game.lives + ' ships left', 2, 'Helvetica', game.width*0.05, '#FFD455', 'bold');
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to continue', 3, 'Helvetica', game.width*0.04, 'white', 'bold'); 
				} else {
					message('Press ENTER or LMB to continue', 3, 'Helvetica', game.width*0.04, 'white', 'bold');
				}

				game.levelScore = 0;
			}


			}, 1000);
		}

		//messages
		function message(message, row, font, fontSize, fontColor, fontWeight) {

			var text = message;
			var textLength = text.length;
			var textWidth = textLength * fontSize/2;
			var textHeight = game.height*0.1;
			// this.color = fontColor;
			// this.font = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? font : "Monaco";
			// this.fontSize = fontSize;
			// this.fontWeight = fontWeight;

			// var x = (game.width - textWidth) *0.5;
			// var y = (game.height - fontSize) *0.5;
			var x = (game.width - textWidth) *0.5;
			var y = (game.height/3.5) + (textHeight * row);

			// console.log (x, y);
			// console.log (game.width);			
			// console.log (textWidth);
			// console.log (textLength);


			game.contextPlayer.font = fontWeight + " " + fontSize + "px " + font;				
			game.contextPlayer.fillStyle = fontColor;
			game.contextPlayer.fillText(text, x, y);	
		}

		// //Init	
		// function init(){ //initialising our game full of stars all over the screen
		// 	for(var i=0; i<600; i++) {
		// 		game.stars.push({ //push values to the game.stars array
		// 			x:Math.floor(Math.random() * game.width), //floor will round down x which will be a random number between 0 and 550
		// 			y:Math.floor(Math.random() * game.height),
		// 			size:Math.random()*game.width*0.003, //size of the stars
		// 			image: Math.floor(Math.random()*(19-14+1)+14) //returns a random number between and 
		// 		});
		// 	}
						
		// 	loop();
			
		// }

			
		function loop(){ //the loop		
			requestAnimFrame(loop);
			gameState();
			if (!game.paused){
			update();
			}
		}

		//====================== Images engine =================//
		
		function initImages(paths) { //our images engine: passing the array 'paths' to the function
			game.requiredImages = paths.length;  //the number of required images will be equal to the length of the paths array
			for(var i in paths){
				var img = new Image(); //defining img as a new image
				img.src = paths[i]; //defining new image src as paths[i]
				game.images[i] = img; //defining game.image[i] as a new image (with paths)
				/*jshint -W083 */
				game.images[i].onload = function(){  //once an image loads..
					game.doneImages++; //  ..increment the doneImages variable by 1
				};
			}
		}	

		function checkImages(){	//checking if all images have been loaded. Once all loaded run init
			if(game.doneImages >= game.requiredImages){
				game.contextBackground.clearRect(0, 0, game.width, game.height);
				game.contextBackground.font = "bold " + game.width*0.11 + "px " + game.font; //Intro screen
				game.contextBackground.fillStyle = "purple";				
				game.contextBackground.fillText(X_Title, game.width*0.2, game.height*0.40);
				game.contextBackground.font = "bold " + game.width*0.04 + "px " + game.font; 
				game.contextBackground.fillStyle = "#FFD455";
				game.contextBackground.fillText(X_Subtitle, game.width*0.1, game.height*0.55);
				game.contextBackground.fillStyle = "white";
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					game.contextBackground.fillText(X_mb_Start, game.width*0.25, game.height*0.65);
				} else {
					game.contextBackground.fillText(X_dt_Start, game.width*0.1, game.height*0.70);
				}
				loop(); //LOoP CALL!!!
			}else{
				setTimeout(function(){
					checkImages();
				}, 1);
			}
		}
			
		initImages([	//using initimages function to load our images
			"_img/_dist/fighter/fighter.png",
			"_img/_dist/enemies/sectoid.png",
			"_img/_dist/laser.png",
			"_img/_dist/explosion.png",
			"_img/_dist/fighter/fighter_right1.png",
			"_img/_dist/fighter/fighter_right2.png",
			"_img/_dist/fighter/fighter_right3.png",
			"_img/_dist/fighter/fighter_right4.png",
			"_img/_dist/fighter/fighter_right5.png",
			"_img/_dist/fighter/fighter_left1.png",
			"_img/_dist/fighter/fighter_left2.png",
			"_img/_dist/fighter/fighter_left3.png",
			"_img/_dist/fighter/fighter_left4.png",
			"_img/_dist/fighter/fighter_left5.png",
			"_img/_dist/stars/star1.png",
			"_img/_dist/stars/star2.png",
			"_img/_dist/stars/star3.png",
			"_img/_dist/stars/star4.png",
			"_img/_dist/stars/star5.png",
			"_img/_dist/stars/star6.png",
			"_img/_dist/missile.png",
			"_img/_dist/background/level_1.jpg",
			"_img/_dist/enemies/_alienbase/alienbase1.png",			
			"_img/_dist/enemies/_alienbase/alienbase2.png",			
			"_img/_dist/enemies/_miniboss/floater.png",			
			"_img/_dist/ui/energyBar.png",			
			"_img/_dist/ui/energyPoint.png",			
			"_img/_dist/enemies/_bigboss/sectoidBoss.png",			
		]);
		
		checkImages(); //this function call starts our game
	/* jshint ignore:start */
	});
})();
/* jshint ignore:end */

window.requestAnimFrame = (function(){  // Creating a request animAnimeFrame function and making it work across browsers.  window.requestAnimationFrame is an HTML built in 60fps anim function
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame    ||
			window.msRequestAnimationFrame    ||
			function( callback ){
				// if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
				// 	window.setTimeout(callback, 1000 / 30);
				// }	
				// else {
				// 	window.setTimeout(callback, 1000 / 60);
				// }
				window.setTimeout(callback, 1000 / 60);			
			};
})(); // jshint ignore:line