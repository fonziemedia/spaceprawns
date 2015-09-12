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
// (function(game){ // jshint ignore:line
	// $(document).ready(function(){ // jshint ignore:line
// function startGame(){	// jshint ignore:line
		

		document.getElementById('textCanvas').style.cursor = 'wait';
		
		// /* Connect to XML */
		$.ajax({
		type: "GET",
		url: "game.xml",
		contentType: 'text/xml',
		dataType: "text",
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

		game.isMobile = false;
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) game.isMobile = true;	//checking if game is running on mobile
		
				// Sound Test
		//init Sfx
		var fileFormat = "mp3";
		
		function soundTest()
		{
				var mp3Test = new Audio();
				var canPlayMP3 = (typeof mp3Test.canPlayType === "function" && mp3Test.canPlayType("audio/mpeg") !== "");
				if (!canPlayMP3) {fileFormat = "ogg";}
		}
		soundTest();

		game.stars = []; //this is an array which will contain our stars info: position in space and size
		game.faded = true;
		// game.backgroundFaded = true;
		game.enemiesFaded = true;
		game.playerFaded = true;
		game.textFaded = true;
		// game.background = [];		
		game.score = 0; //the game score
		game.levelScore = 0; //the score for each level
		game.level = X_Level; //starting at level X...
		game.bossDead = false;
		game.levelComplete = false;
		game.levelUpTimer = 0;
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
		
		
		//====================== Game state ========================
		
		game.started = false;		
		game.lvlIntro = true;
		game.lvlStart = false;
		game.paused = false;
		game.escaped = false;
		game.gameWon = false;
		game.gameOver = false;
		game.delayTimer = 0;
		game.timer = 0;	
		
		
		//========================== Audio ==========================
		
		// ON/OFF Trigger
		//checking browser support for local storage
		if ("localStorage" in window && window.localStorage !== null)
		{				
			//NOTE: localStorage won't accept boolean values! so we need to 'convert' these
			if (localStorage.prawnsSound === "true")
			{
				game.sound = true;
			}
			else
			{
				game.sound = false;
			}

			if (localStorage.prawnsMusic === "true")
			{
				game.music = true;
			}
			else
			{
				game.music = false;
			}
		}
		else
		{	
			game.sound = false;
			game.music = false;
		}

		//SFX vars
		game.sfx = [];		
		game.doneSfx  = 0; // will contain how many images have been loaded
		game.requiredSfx = 0; // will contain how many images should be loadedgame.doneSfx  = 0; // will contain how many images have been loaded

		//Sound Tracks vars
		game.soundTracks = [];		
		game.doneSoundTracks = 0; // will contain how many images should be loadedgame.doneSfx  = 0; // will contain how many images have been loaded
		game.requiredSoundTracks = 0; // will contain how many images should be loaded
		
		//Our main SOUND players arrays
		game.sounds = [];
		game.tracks = [];		
			
		//======================== Images ========================		
			
		game.images = [];
		game.doneImages  = 0; // will contain how many images have been loaded
		game.requiredImages = 0; // will contain how many images should be loaded
		game.font = game.isMobile ? "Helvetica" : "Monaco";
		// game.res = 4*5; //check the 4th index every 5 frames
		
		//====================== Canvases + Images + responsiveness  ============================
		
		// game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d"); //defining the 4 different canvas
		game.contextEnemies = document.getElementById("enemiesCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
		game.contextText = document.getElementById("textCanvas").getContext("2d");

		m_canvas = document.createElement('canvas');

		

		//SETTING CANVASES ATTRIBUTES
		//Note: the canvas dimensions need to be set here using attributes due to the nature of the canvas element: it works like an image and using css to set this will stretch it

		//get the gameArea and the canvases 
		var gameArea = $('#gamearea');
		var allCanvas = $('canvas');

		var gameAreaH = window.outerHeight; // !! On Android, window.outerWidth and window.outerHeight are reliably the screen size

		if (game.isMobile)
		{
		var gameAreaW = window.outerWidth;
		}
		else
		{
			gameAreaW = gameArea.css("width");
		}

		allCanvas.attr('height', gameAreaH); //max height
		allCanvas.attr('width', gameAreaW); //max height

		//SETTING GAME DIMENSIONS
		game.height = parseInt(gameAreaH); //using parseInt here to remove 'px'
		game.width = parseInt(gameAreaW);

		
		//delta size will keep the size of our game objects proportional to the display
		var dtSize = game.height*0.001;
		// console.log (dtSize);

		
		//// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! /////
		//making our canvases dynamically resize according to the size of the browser window	//! USE THIS TO SHOW ROTATE SCREEN MSG IF MOBILE AND GAME.WIDTH > GAME HEIGHT
		// function respondCanvas()
		// { 
			
		// 	// gameArea.attr('height', $(gameContainer).height()); //max height

		


		// }

		// //Initial call 
		// respondCanvas();

		// //Run function whenever browser resizes
		// $(window).resize(respondCanvas);

	// jshint ignore:line
function sprite(image, imageSize, frameWidth, frameHeight, startFrame, endFrame, frameSpeed, ctx) {	
	this.image = image;
	this.imageSize = imageSize;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.startFrame = startFrame;
	this.endFrame = endFrame;
	this.frameSpeed = frameSpeed;
	this.ctx = ctx;

	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth);

	// if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}

	this.draw = function(x, y)
	{
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

		this.ctx.drawImage(
			game.images[this.image],
			this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
			this.frameWidth, this.frameHeight,
			x, y,
			this.imageSize, this.imageSize);
	};
}
function background() {

	this.element = $('#backgroundCanvas');
	this.width = this.element.css("width");
	this.height = this.element.css("height");
	this.speed = Math.round(180*dt);
	// this.section = section;
	// this.width = game.width;
	// this.height = Math.round((game.width * (16 / 9)) * 4);
	this.y = 0;
	// this.y = (this.section === 0) ? -Math.round(this.height-game.height) : -(this.height);
	// this.image = 'level' + game.level + '.jpg'; //needs to be consecutive for this to work
	// this.limits = -game.height*0.02; // *0.02 because of speed and to disguise my bad image manipulation skills

	this.update = function() {

		this.y += 2;
		this.element.css('background-position', '0 ' + this.y + 'px');


		//testing using an off-screen canvas
		// game.contextBackground.drawImage(m_canvas, this.x, this.y, this.width, this.height);
		// game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {

		for (var i = 1; i <= 3; i++) {
			this.element.removeClass('level' + i);
		}
		
		this.element.addClass('level' + game.level);	
	};
}

gameBackground = new background();
function explosion(x, y, speed, direction, size) {
	particle.call(this, x, y, speed, direction);

	this.x = Math.round(x - (size*0.2));
	this.y = Math.round(y - (size*0.2));
	this.speed = speed;
	this.size = Math.round(size*1.5);
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;
	this.image = 'explosion.png';
	this.ctx = game.contextPlayer;
	this.sprite = new sprite(this.image, this.size, 96, 96, 0, 19, 2, this.ctx);


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
	};

	this.draw = function() {
		// this.ctx.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		this.sprite.draw(this.x, this.y);

	};
}

explosion.prototype = Object.create(particle.prototype); // Creating a explosion.prototype object that inherits from particle.prototype.
explosion.prototype.constructor = explosion; // Set the "constructor" property to refer to explosion

function player(hull, fireRate) {
	// particle.call(this);

	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.speed = 0;
	this.maxSpeed = 400;
	
	this.size = Math.round(100*dtSize);
	this.hull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.image = 'fighter.png';
	this.audioFire = 'laser.' + fileFormat;
	this.audioExplode = 'blast.' + fileFormat;
	this.rendered = false;
	this.hit = false;
	this.hitTimer = 0;
	this.imune = false;
	this.imuneTimer = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.bullets = [];
	this.bulletTimer = 1;
	this.bulletDivision = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
	this.ctx = game.contextPlayer;
	this.speedX = 0;
	this.speedY = 0;
	this.limitX1 = -this.size*0.5;
	this.limitX2 = game.width - this.size*0.5;
	this.limitY1 = -this.size*0.5;
	this.limitY2 = game.height - this.size*0.5;
	this.movement = Math.round(game.height*0.007);

	this.canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
	
	if (this.canVibrate && !("vibrate" in navigator))
	{
    navigator.vibrate = navigator.mozVibrate;
    }	

	// bulletspeed: X_BulletSpeed*game.height/1000,

	this.update = function() {		
		// this.vx = Math.cos(this.direction) * (this.speed*dt);
		// this.vy = Math.sin(this.direction) * (this.speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		// this.x += this.vx;
		// this.y += this.vy;
		this.playerImage = game.images[this.image];
		this.speedX = Math.round((touchInitX - canvasX)*0.1);
		this.speedY = Math.round((touchInitY - canvasY)*0.1);		
		
		//////////////////////////////
		//	Mouse and Touch controls
		/////////////////////////////

		if (mouseIsDown && !game.levelComplete && !game.paused && !game.gameOver && !game.gameWon) {

			//removing cursor
			if (!game.isMobile) {document.getElementById('textCanvas').style.cursor = 'none';}


			//defining the boundaries	
					
				
				moveRight1 = (this.speedX < -2 && this.speedX >= -4) ? true : false;
				moveRight2 = (this.speedX < -4 && this.speedX >= -6) ? true : false;
				moveRight3 = (this.speedX < -6 && this.speedX >= -8) ? true : false;
				moveRight4 = (this.speedX < -8 && this.speedX >= -10) ? true : false;
				moveRight5 = (this.speedX < -10) ? true : false;

				moveLeft1 = (this.speedX > 2 && this.speedX <= 4) ? true : false;
				moveLeft2 = (this.speedX > 4 && this.speedX <= 6) ? true : false;
				moveLeft3 = (this.speedX > 6 && this.speedX <= 8) ? true : false;
				moveLeft4 = (this.speedX > 8 && this.speedX <= 10) ? true : false;
				moveLeft5 = (this.speedX > 10) ? true : false;
				
				//making it move to touch or click point
				// if (canvasX != moveX || canvasY != moveY) {
					//the distance between the current ship pos and the user touch/click pos
					
					
					// console.log('canvasx:'+ canvasX);
					// console.log('canvasy:'+ canvasY);				
					// console.log('touchx:'+ touchInitX);
					// console.log('touchy:'+ touchInitY);
					// console.log (this.speedX);
					// console.log (this.speedY);
					// console.log (dtSize);

					// A MAIN CONTROLS


					// console.log('movement:' + this.movement);
					
					//this needs to come after movement vars above because he redefine this.speedX here
					this.speedX = this.speedX < this.movement ? this.speedX : this.movement;					
					this.speedY = this.speedY < this.movement ? this.speedY : this.movement;
					this.speedX = this.speedX > -this.movement ? this.speedX : -this.movement;					
					this.speedY = this.speedY > -this.movement ? this.speedY : -this.movement;

					// console.log('touchInitX:'+ touchInitX);
					// console.log('touchInitY:'+ touchInitY);
					// console.log('canvasX:'+ canvasX);
					// console.log('canvasY:'+ canvasY);					
					// console.log('this.speedX:'+ this.speedX);
					// console.log('this.speedY:'+ this.speedY);	
					
					if (this.speedX !== 0 || this.speedY !== 0) 
					{
						//the bondaries and edge portals				
						if (this.x >= this.limitX1 && this.x <= this.limitX2 && this.y >= this.limitY1 && this.y <= this.limitY2)
						{			
						this.x = this.x - this.speedX;
						this.y = this.y - this.speedY;
						}						
						else if(this.x < this.limitX1)
						{
						 this.x = this.limitX2;
						}
						else if(this.x > this.limitX2)
						{
						 this.x = this.limitX1;
						}
						else if(this.y < this.limitY1)
						{
						 this.y = this.limitY2;
						}
						else if(this.y > this.limitY2)
						{
						 this.y = this.limitY1;
						}

					}

					this.speedX = 0;
					this.speedY = 0; //not needed but..
					
					// B ALTERNATIVE CONTROLS 
					// this.speedX = (touchInitX - canvasX);
					// this.speedY = (touchInitY - canvasY);
					
					
					// this.x = this.x - this.speedX;
					// this.y = this.y - this.speedY;					


					// touchInitX = canvasX;
					// touchInitY = canvasY;


			

				
				if (moveRight1) {
					this.image = 'fighter_right1.png';
				} else if (moveRight2) {
					this.image = 'fighter_right2.png';
				} else if (moveRight3) {
					this.image = 'fighter_right3.png';
				} else if (moveRight4) {
					this.image = 'fighter_right4.png';
				} else if (moveRight5) {
					this.image = 'fighter_right5.png';

				} else if (moveLeft1) {
					this.image = 'fighter_left1.png';
				} else if (moveLeft2) {
					this.image = 'fighter_left2.png';
				} else if (moveLeft3) {
					this.image = 'fighter_left3.png';
				} else if (moveLeft4) {
					this.image = 'fighter_left4.png';
				} else if (moveLeft5) {
					this.image = 'fighter_left5.png';
				}

				this.rendered = false;		

		}
		else
		{
			this.image = 'fighter.png';	
			document.getElementById('textCanvas').style.cursor = 'crosshair';
		}

		/////////////////////////
		//	Keyboard controlls
		////////////////////////

		if(!game.isMobile)
		{
			//left
			if(game.keys[37] || game.keys[65] && !(game.gameOver) && !(game.gameWon)){ //if key pressed..				
				if(this.x > 0){ // (keeping it within the boundaries of our canvas)				
					this.speed = this.maxSpeed;							
					this.image = 'fighter_left5.png';
					this.rendered = false;
					this.x -= Math.round(this.speed*dt);
				}
			}
			//right
			if(game.keys[39] || game.keys[68] && !(game.gameOver) && !(game.gameWon)){
				if(this.x <= game.width - this.size){				
					this.speed = this.maxSpeed;
					this.image = 'fighter_right5.png';
					this.rendered = false;
					this.x += Math.round(this.speed*dt);
				}
			}
			//up
			if((game.keys[38] || game.keys[87]) && !game.gameOver && !game.gameWon){
				if(this.y > 0){				
					this.speed = this.maxSpeed;					
					this.rendered = false;
					this.y -= Math.round(this.speed*dt);
				}
			}
			//down
			if(game.keys[40] || game.keys[83] && !(game.gameOver) && !game.gameWon){
				if(this.y <= game.height - this.size){				
					this.speed = this.maxSpeed;					
					this.rendered = false;
					this.y += Math.round(this.speed*dt);
				}	
			}
		}

		
		if(game.levelComplete){			
			this.speed = this.maxSpeed;			
			this.rendered = false;
			this.y -= Math.round(this.speed*dt);
		}


		/////////////////////////
		//	Guns
		////////////////////////

		this.midLaserX = Math.round(this.x + this.size*0.5);
		this.leftlaserX = Math.round(this.x + this.size*0.25);
		this.rightlaserX = Math.round(this.x + this.size*0.75);
		this.LaserY = Math.round(this.y - this.size*0.2);

		this.midMissileX = Math.round(this.x + this.size*0.5);
		this.leftMissileX = this.x;
		this.rightMissileX = this.x + this.size;
		this.missileY = this.y + this.size;


		if((game.keys[32] || mouseIsDown) && !this.dead && !game.gameOver){ //only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
			this.bulletTimer++;
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer % this.bulletDivision === 0) {
				// (x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame)
				switch(this.laserLevel) {
				    case 1:
				        game.playerBullets.push( new playerBullet(this.midLaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        if (game.sound){game.sounds.push(game.sfx[this.audioFire]);}
				        // if (game.sound)
				        // {
				        // 	if (!audio1.paused)
				        // 	{
				        // 		if (!audio2.paused)
				        // 		{
				        // 			audio3.play();
				        // 		}
				        // 		else
				        // 		{
				        // 			audio2.play();
				        // 		}
				        // 	}
				        // 	else
				        // 	{
				        // 		audio1.play();
				        // 	}				        	
				        // }
				        break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.leftlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.rightlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));				
				        if (game.sound){game.sounds.push(game.sfx[this.audioFire]);}
				        break;
				    default:
				        game.playerBullets.push( new playerBullet(this.leftlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.midLaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.rightlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        if (game.sound){game.sounds.push(game.sfx[this.audioFire]);}
				        break;
				 }





				 switch(this.missileLevel) {
				 	case 0:
				 		break;
				    case 1:
				        game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;										
				 }				
				// this.bulletTimer = 1; //resetting our timer
			}
		}
		else {
			this.bulletTimer = 1;
		}


		///////////////////////////////////
		//	DEATH MANAGEMENT
		///////////////////////////////////

		if (this.hull <= 0 && !this.dead)
		{
			this.dead = true;			
			this.lives -= 1;
			game.explosions.push(new explosion(this.x, this.y, this.speed, 0, this.size));
			if (game.sound){game.sounds.push(game.sfx[this.audioExplode]);}
			gameUI.updateHangar();
		}	


		if (this.dead && this.deadTimer <= 100 && game.lives > 0) 
		{
			//waiting a few secs before any action
			this.deadTimer++; 

			if (this.deadTimer > 100 && this.lives > 0) 
			{
					mouseIsDown = 0;
					this.hull = hull;
					this.dead = false;
					this.x = Math.round(game.width*0.46);
					this.y = Math.round(game.height*0.90);
					this.image = 'fighter.png';
					this.rendered = false;
					this.hit = false;
					this.hitTimer = 0;
					this.friction = 0;
					this.laserLevel = 1;
					this.missileLevel = 0;						
					gameUI.updateEnergy();
					this.deadTimer = 0;
					this.imune = true;
					this.imuneTimer = 0;
			}
			else if (this.deadTimer > 100 && this.lives === 0)
			{	
				mouseIsDown = 0;
				game.keys[13] = false;				
				this.deadTimer = 0;
				game.gameOver = true;
			}
			else {
				this.x = Math.round(game.width*0.5); //keeping the player outside canvas while dead
				this.y = Math.round(game.height*1.5);
			}
		}

		if (this.imune){
			this.imuneTimer++;
			if (this.imuneTimer > 250){
				this.imune = false;
				this.imuneTimer = 0;
			}
		}

	};

	this.draw = function() {


		if(!this.dead){		
			
			if (this.imune && !game.faded && game.started && !game.levelComplete)
			{
				this.ctx.globalAlpha = 0.8;
				if (this.imuneTimer >= 0 && this.imuneTimer < 15  || this.imuneTimer >= 20 && this.imuneTimer < 35 ||this.imuneTimer >= 40 && this.imuneTimer < 55 || this.imuneTimer >= 70 && this.imuneTimer < 75 || this.imuneTimer >= 90 && this.imuneTimer < 95 || this.imuneTimer >= 110 && this.imuneTimer < 115 || this.imuneTimer >= 130 && this.imuneTimer < 135 || this.imuneTimer >= 150 && this.imuneTimer < 155 || this.imuneTimer >= 160 && this.imuneTimer < 175 || this.imuneTimer > 180)
				{
					this.ctx.drawImage(this.playerImage, this.x, this.y, this.size, this.size); //rendering
				}
			}


			if (!this.imune)
			{
				if (this.ctx.globalAlpha < 1 && !game.faded && !game.levelComplete)  //we need to avoid imunity clashing with game transitions
				{
						this.ctx.globalAlpha += 0.1;				
				}

				this.ctx.drawImage(this.playerImage, this.x, this.y, this.size, this.size); //rendering
			}


			if (this.hit && !this.imune) {
				// this.hitTimer++;
				if (this.canVibrate) 
				{
					navigator.vibrate(30);
				}

				this.hit = false;

				// var imgData = this.ctx.getImageData(this.x, this.y, this.size, this.size);

				// var d = imgData.data;
			 //    for (var i = 0; i < d.length; i += 4) {
			 //      var r = d[i];
			 //      var g = d[i + 1];
			 //      var b = d[i + 2];
			 //      d[i] = d[i + 1] = d[i + 2] = 255;
			 //    }

				// this.ctx.putImageData(imgData, this.x, this.y);

			// 	if (this.hitTimer > 4){
				// this.hit = false;
			// 		this.hitTimer = 0;
			// 	}				 
			// }

			}
		}
	};

	this.load = function()
	{
		this.update();
		this.draw();
	};
	
	this.reset = function() {
		this.dead = false;
		this.x = Math.round(game.width*0.46);
		this.y = Math.round(game.height*0.90);
		this.image = 'fighter.png';
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0; 
		this.dead = false;
		game.gameOver = false;
		this.friction = 0;
		this.bullets = [];
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = X_Lives;
		// this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

// player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
// player.prototype.constructor = player; // Set the "constructor" property to refer to player


playerShip = new player(10, 15);
function playerBullet(x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame) {
	particle.call(this, x, y, speed, direction);
	
	this.size = Math.round(bulletSize*dtSize);
	this.spriteX = -Math.round(this.size*0.5);
	this.spriteY = -Math.round(this.size*0.5);
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.friction = friction;
	this.dtSet = false;
	this.ctx = game.contextEnemies;
	this.sprite = new sprite(this.image, this.size, imageSize, imageSize, 0, endFrame, 4, this.ctx);

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
	};
	
	this.draw = function() {		
		
		if (!this.dead) {			

			// this.ctx.save();
			// this.ctx.translate(this.lastX, this.lastY);
			// this.ctx.rotate(direction - Math.PI/2);

			// this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails

			// this.ctx.restore();

			this.ctx.save();
			this.ctx.translate(this.x, this.y);
			this.ctx.rotate(direction - Math.PI/2);

			this.sprite.draw(this.spriteX, this.spriteY); //-this.size/2 because we're rotating ctx
			
			this.ctx.restore();

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
				this.size = Math.round(65*dtSize);
			break;
		case 'miniboss':
				this.size = Math.round(120*dtSize);	
			break;
		case 'base':
				this.size = Math.round(170*dtSize);
				this.rotation = 0;	
			break;
	}
	this.spritePos = Math.round(this.size * 0.5);
	this.hull = hull;
	this.image = game.images[image];
	this.audioHit = 'hit.' + fileFormat;	
	this.audioDead = 'explosion.' + fileFormat;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bulletTimer = 1;
	this.sheep = sheep || false;
	this.fireRate = fireRate * 60; //bullets/sec

	this.bulletDivision = (this.sheep) ? (this.fireRate*2) - (Math.floor(Math.random()*this.fireRate)) || 99999 : this.bulletDivision = this.fireRate || 99999;
	this.ctx = game.contextEnemies;
	this.inCanvas = false;
	this.speed = speed;
	this.direction = direction;
	this.collided = false;

	this.update = function() {
		// this.lastX = this.x;
		// this.lastY = this.y;
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);		
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
		this.spriteX = this.x + this.spritePos;
		this.spriteY = this.y + this.spritePos;


		//check if it got inside canvas
		// if (this.type == 'miniboss')
		// {
		// 	if (this.x >= this.size*0.2 || this.x <= game.width - this.size*0.2 || this.y >= this.size || this.y <= game.height - this.size*0.2)
		// 	{
		// 		this.inCanvas = true;
		// 	}

		// 	//once in canvas start controlling bondaries
		// 	if (this.inCanvas)
		// 	{
		// 		if (this.x < this.size*0.5 || this.x > game.width - this.size*0.5 || this.y < this.size*0.5)
		// 		{
		// 			//go right
		// 			this.direction = -this.direction;	
		// 		}
		// 	}
		// 	else
		// 	{
		// 		this.direction = Math.PI/2;
		// 	}
		// }

		if(this.hit && this.hull > 0 ){
			if(game.sound){game.sounds.push(game.sfx[this.audioHit]);}
			//change image here		
			this.hit = false;
		}

		if (this.hull <= 0) {
			this.dead = true;

			game.explosions.push(new explosion(this.x, this.y, this.speed, this.direction, this.size));			
			if(game.sound){game.sounds.push(game.sfx[this.audioDead]);}

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
				bulletX = Math.round(this.x + this.size*0.42);
				bulletY = Math.round(this.y + this.size);
				bulletDirection = this.angleTo(playerShip);
				game.enemyBullets.push(new enemyBullet(bulletX, bulletY, 50, bulletDirection, 1, 'missile.png'));			
			}
		}

		if(this.type != 'base' )
		{	
		this.direction -= utils.randomRange(-0.05, 0.05);
		}
	};

	this.draw = function() {
		
		if(this.type == 'base'){ //making bases rotate
			// //clear trails
			// this.ctx.save();
			// this.ctx.translate(this.lastX, this.lastY);
			// this.ctx.rotate(this.rotation);
			// this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails
			// this.ctx.restore();

			if (!this.dead) {				

				//set rotation this.speed
				this.rotation += 0.01;

				//rotate canvas
				this.ctx.save();
				this.ctx.translate(this.spriteX, this.spriteY);
				this.ctx.rotate(this.rotation);

				//draw image
				this.ctx.drawImage(this.image, -this.spritePos, -this.spritePos, this.size, this.size);

				this.ctx.restore();
			}
		}
		else {
			// this.ctx.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
			if (!this.dead) {
				this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size); //render
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
	this.image = game.images[image];
	this.size = Math.round(200*dtSize);
	this.hit = false;
	this.audioHit = 'hit.mp3';
	this.audioDead = 'blast.mp3';
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTimer = 0;
	this.bulletTimer1 = 1;
	this.bulletTimer2 = 1;
	this.bulletDivision1 = 50;
	this.bulletDivision2 = 30;
	this.fireRate = 0; //bullets/sec
	// this.fireRate = fireRate * 60; //bullets/sec
	this.yStop = Math.round(game.height*0.1);
	this.xBondary = Math.round(game.width - this.size/4);
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
			if(game.sound){game.sounds.push(game.sfx[this.audioHit]);}
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
			game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));			
			if(game.sound){game.sounds.push(game.sfx[this.audioDead]);}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;	
				game.bossDead = true;
				this.dead = true;						
			}
		}


			this.bulletTimer1++;
			this.bulletTimer2++;

			// (x, y, speed, direction, power, image)
			if (this.bulletTimer1 % this.bulletDivision1 == 1){
				this.bulletTimer1 = 1;	
				mBulletX1 = Math.round(this.x);
				mBulletX2 = Math.round(this.x + this.size);
				mBulletY = Math.round(this.y + this.size*0.6);		
				game.enemyBullets.push(new enemyBullet(mBulletX1, mBulletY, 50, this.bulletDirection, 1, 'missile.png'));			
				game.enemyBullets.push(new enemyBullet(mBulletX2, mBulletY, 50, this.bulletDirection, 1, 'missile.png'));			
			}
		
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer2 % this.bulletDivision2 == 1) {				
				// if (game.sound){game.shootSound.play();}
				this.bulletTimer2 = 1; //resetting our timer
				lBulletX = Math.round(this.x + this.size*0.48);
				lBulletY = Math.round(this.y + this.size);
			    game.enemyBullets.push( new enemyBullet(lBulletX, lBulletY, 250, Math.PI/2, 1.5, 'laser.png'));
			    game.enemyBullets.push( new enemyBullet(lBulletX, lBulletY, 250, Math.PI/2, 1.5, 'laser.png'));				
			}

		

		if (this.y > this.yStop){
			speed = 0;
			if (this.x > 0 && this.x <= this.xBondary) {

				if (this.x < playerShip.x && this.x <= this.xBondary-1){
					this.x += 1;
				}
				else if (this.x > playerShip.x && this.x > 1){
					this.x -= 1;
				}

			}
		}

	};

	this.draw = function() {
		
		if (!this.dead) {
				game.contextEnemies.drawImage(this.image, this.x, this.y, this.size, this.size); //render
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
	
	this.size = Math.round(30*dtSize);
	this.spriteX = -Math.round(this.size*0.5);
	this.spriteY = -Math.round(this.size*0.5);
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.friction = 1.02;
	this.dtSet = false;
	this.ctx = game.contextEnemies;
	this.sprite = new sprite(this.image, this.size, 64, 64, 0, 2, 5, this.ctx);

	this.update = function()
	{ 	
		// Replacing the default 'update' method
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
			this.dtSet = true;
		}		
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

	};
	
	this.draw = function() {
		
		
		if (!this.dead) {			

			// this.ctx.save();
			// this.ctx.translate(this.lastX, this.lastY);
			// this.ctx.rotate(direction - Math.PI/2);

			// this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails

			// this.ctx.restore();

			this.ctx.save();
			this.ctx.translate(this.x, this.y);
			this.ctx.rotate(direction - Math.PI/2);

			this.sprite.draw(this.spriteX, this.spriteY); //-this.size/2 because we're rotating ctx
			
			this.ctx.restore();

		}
	};
}

enemyBullet.prototype = Object.create(particle.prototype); // Creating a enemyBullet.prototype object that inherits from particle.prototype.
enemyBullet.prototype.constructor = enemyBullet; // Set the "constructor" property to refer to enemyBullet
function loot(x, y) {
	particle.call(this, x, y);

	this.speed = 250;
	this.direction = Math.PI/2;
	this.size = Math.round(45*dtSize);
	this.dead = false;
	this.drops = ['health', 'laser', 'missile'];
	var key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[key];

	switch(this.type) {
    case 'health':
        this.image = 'fighter.png';
        break;
    case 'laser':
        this.image = 'laser.png';
        break;
    case 'missile':    
        this.image = 'missile.png';
	}
	this.sfx = 'loot_powerUp.' + fileFormat;
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
			if(game.sound){game.sounds.push(game.sfx[this.sfx]);}
			this.dead = true;
		}

	};

	this.draw = function() {
		// game.contextPlayer.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
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
	this.spawnDivision = Math.round(1500 * dt);
	switch (this.side){
		case 'top':
			this.x = pos;
			this.y = -Math.round(game.height*0.1);
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = -Math.round(game.width*0.2);
			this.y = pos;
			this.direction = 0;
			break;
		case 'right':
			this.x = Math.round(game.width*1.2);
			this.y = pos;
			this.direction = Math.PI;
			break;
	}
	this.over = false;
	// this.bulletTimer = 1;
	// this.bulletDivision = fireRate || 99999;
	// this.loot = [];
	


	this.update = function() {
					
		// if (dt !== 0 && !this.spawnDivisionSet){
		// 	this.spawnDivision = Math.round(700 * dt);
		// 	this.spawnDivisionSet = true;
		// }
						
			
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
	this.enContainerWidth = game.width*0.3;
	this.enContainerHeight = game.height*0.04;
	this.enBarHeight = game.height*0.019;
	this.enBarVol = game.width*0.2;	
	this.hangarShipSize = game.height*0.03;
	this.level = game.level;
	this.hangarImg = 'fighter.png';
	this.enPointImg = 'energypoint.png'; // jshint ignore:line
	this.enContainerImg = 'energybar.png';// jshint ignore:line
	this.scoreX = Math.round(this.width*0.1);
	this.scoreY = Math.round(this.height*0.6);
	this.energyX = Math.round(this.width*0.3);
	this.energyY = Math.round(this.height*0.18);


	this.updateLevel = function() {
		this.level = game.level;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15*dtSize + 'px helvetica';
		game.contextText.clearRect(this.width*0.02, this.height*0.3, this.width*0.05, this.height*0.35); 
		game.contextText.fillText("S" + this.level, this.width*0.02, this.height*0.6); //printing level
	};

	this.updateScore = function() {
		this.score = game.score;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15*dtSize + 'px helvetica';
		game.contextText.clearRect(this.scoreX, this.height*0.3, this.width*0.14, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.scoreX, this.scoreY); //printing the score
	};

	// this.updateSound = function() {	
	// 	this.soundFx = game.sound ? "ON" : "OFF";
	// 	// this.music = game.music;			

	// 	if (!game.isMobile) {
	// 		game.contextText.fillStyle = "#FFD455";
	// 		game.contextText.font = 15*dtSize + 'px helvetica';
	// 		game.contextText.clearRect(this.width*0.25, this.height*0.3, this.width*0.2, this.height*0.35); 
	// 		game.contextText.fillText("Sound(F8): " + this.soundFx, this.width*0.25, this.height*0.6);
	// 	}
	// };

	this.updateEnergy = function() {		
		this.hull = playerShip.hull > 0 ? playerShip.hull*game.width*0.02 : 0;
		game.contextText.clearRect(this.energyX, this.height*0.2, this.enBarVol, this.enBarHeight);	
		game.contextText.drawImage(game.images[this.enPointImg], this.energyX, this.energyY, this.hull, this.enBarHeight);		
	};

	this.updateHangar = function() {
		this.hangar = playerShip.lives;
		game.contextText.clearRect(this.width*0.69, this.height*0.2, this.hangarShipSize*3, this.hangarShipSize);		
		for (i = 0; i < this.hangar; i++){
			//printing lives
			game.contextText.drawImage(game.images[this.hangarImg], this.width*0.68 + (this.width * 0.05 * i) , this.height*0.2, this.hangarShipSize, this.hangarShipSize);
		}
	};

	this.updateAll = function() {
		game.contextText.clearRect(0, 0, this.width, this.height*1.5);
		game.contextText.drawImage(game.images[this.enContainerImg], this.width*0.25, -this.height*0.1, this.enContainerWidth, this.enContainerHeight);
		this.updateLevel();
		this.updateScore();
		// this.updateSound();
		this.updateEnergy();
		this.updateHangar();		
	};
	
}

gameUI = new ui();
function lights() {

	//starting our game with a black screen
	// this.backgroundAlpha = 0;
	this.enemiesAlpha = 0;
	this.playerAlpha = 0;
	this.textAlpha = 0;
	
	this.alphaDelta = 0.01; //the speed of fade in/out 

	this.on = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':
				game.contextText.globalAlpha = 1;				
				// game.contextBackground.globalAlpha = 1;
				game.contextEnemies.globalAlpha = 1;
				game.contextPlayer.globalAlpha = 1;
				
				game.textFaded = false;
				// game.backgroundFaded = false;
				game.enemiesFaded = false;
				game.playerFaded = false;
				
				game.faded = false;	
			break;

			case 'text':
				game.contextText.globalAlpha = 1;
				game.textFaded = false;	
			break;

			// case 'background':
			// 	game.contextBackground.globalAlpha = 1;
			// 	game.backgroundFaded = false;												
			// break;

			case 'enemies':
				game.contextEnemies.globalAlpha = 1;
				game.enemiesFaded = false;	
			break;
		
			case 'player':
				game.contextPlayer.globalAlpha = 1;
				game.playerFaded = false;						
			break;
		}
	};

	this.off = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':
				game.contextText.globalAlpha = 0;				
				// game.contextBackground.globalAlpha = 0;
				game.contextEnemies.globalAlpha = 0;
				game.contextPlayer.globalAlpha = 0;
				
				game.textFaded = true;
				// game.backgroundFaded = true;
				game.enemiesFaded = true;
				game.playerFaded = true;
				
				game.faded = true;	
			break;

			case 'text':
				game.contextText.globalAlpha = 0;
				game.textFaded = true;	
			break;

			// case 'background':
			// 	game.contextBackground.globalAlpha = 0;
			// 	game.backgroundFaded = true;												
			// break;

			case 'enemies':
				game.contextEnemies.globalAlpha = 0;
				game.enemiesFaded = true;	
			break;
		
			case 'player':
				game.contextPlayer.globalAlpha = 0;
				game.playerFaded = true;						
			break;
		}	
	};

	this.fadeIn = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':	
				// if (this.backgroundAlpha < 1 || this.enemiesAlpha < 1 || this.playerAlpha < 1 || this.textAlpha < 1 )
				if (this.enemiesAlpha < 1 || this.playerAlpha < 1 || this.textAlpha < 1 )
				{	
					// this.backgroundAlpha += this.alphaDelta;
					this.enemiesAlpha += this.alphaDelta;
					this.playerAlpha += this.alphaDelta;			
					this.textAlpha += this.alphaDelta;
				}
				// else if (this.backgroundAlpha >= 1 && this.enemiesAlpha >= 1 && this.playerAlpha >= 1 && this.textAlpha >= 1)
				else if (this.enemiesAlpha >= 1 && this.playerAlpha >= 1 && this.textAlpha >= 1)
				{
					// game.contextBackground.globalAlpha = 1;
					game.contextEnemies.globalAlpha = 1;
					game.contextPlayer.globalAlpha = 1;
					game.contextText.globalAlpha = 1;
					// game.backgroundFaded = false;
					game.enemiesFaded = false;
					game.playerFaded = false;
					game.textFaded = false;
					game.faded = false;
				}

				// game.contextBackground.globalAlpha = this.backgroundAlpha;
				game.contextEnemies.globalAlpha = this.enemiesAlpha;
				game.contextPlayer.globalAlpha = this.playerAlpha;
				game.contextText.globalAlpha = this.textAlpha;
			break;

			case 'text':
				if (this.textAlpha < 1)
				{				
					this.textAlpha += this.alphaDelta;
				}
				else if (this.textAlpha >= 1)
				{
					game.contextText.globalAlpha = 1;
					game.textFaded = false;
				}

				game.contextText.globalAlpha = this.textAlpha;	
			break;

			// case 'background':
			// 	if (this.backgroundAlpha < 1)
			// 	{				
			// 		this.backgroundAlpha += this.alphaDelta;
			// 	}
			// 	else if (this.backgroundAlpha >= 1)
			// 	{
			// 		game.contextBackground.globalAlpha = 1;
			// 		game.backgroundFaded = false;
			// 	}

			// 	game.contextBackground.globalAlpha = this.backgroundAlpha;												
			// break;

			case 'enemies':
				if (this.enemiesAlpha < 1)
				{				
					this.enemiesAlpha += this.alphaDelta;
				}
				else if (game.enemiesApha >= 1)
				{
					game.contextEnemies.globalAlpha = 1;
					game.enemiesFaded = false;
				}

				game.contextEnemies.globalAlpha = this.enemiesAlpha;	
			break;
		
			case 'player':
				if (this.playerAlpha < 1)
				{				
					this.playerAlpha += this.alphaDelta;
				}
				else if (this.playerAlpha >= 1)
				{
					game.contextPlayer.globalAlpha = 1;
					game.playerFaded = false;
				}

				game.contextPlayer.globalAlpha = this.playerAlpha;						
			break;

		}
	};

	this.fadeOut = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':	
				if (this.backgroundAlpha > 0 || this.enemiesAlpha > 0 || this.playerAlpha > 0 || this.textAlpha > 0 )
				if (this.enemiesAlpha > 0 || this.playerAlpha > 0 || this.textAlpha > 0 )
				{	
					// this.backgroundAlpha -= this.alphaDelta;
					this.enemiesAlpha -= this.alphaDelta;
					this.playerAlpha -= this.alphaDelta;			
					this.textAlpha -= this.alphaDelta;
				}
				else if (this.enemiesAlpha <= 0 && this.playerAlpha <= 0 && this.textAlpha <= 0)
				{
					// game.contextBackground.globalAlpha = 0;
					game.contextEnemies.globalAlpha = 0;
					game.contextPlayer.globalAlpha = 0;
					game.contextText.globalAlpha = 0;
					// game.backgroundFaded = true;
					game.enemiesFaded = true;
					game.playerFaded = true;
					game.textFaded = true;
					game.faded = true;
				}

				// game.contextBackground.globalAlpha = this.backgroundAlpha;
				game.contextEnemies.globalAlpha = this.enemiesAlpha;
				game.contextPlayer.globalAlpha = this.playerAlpha;
				game.contextText.globalAlpha = this.textAlpha;
			break;

			case 'text':
				if (this.textAlpha > 0)
				{				
					this.textAlpha -= this.alphaDelta;
				}
				else if (this.textAlpha <= 0)
				{
					game.contextText.globalAlpha = 0;
					game.textFaded = true;
				}

				game.contextText.globalAlpha = this.textAlpha;
			break;

			// case 'background':
			// 	if (this.backgroundAlpha > 0)
			// 	{				
			// 		this.backgroundAlpha -= this.alphaDelta;
			// 	}
			// 	else if (this.backgroundAlpha <= 0)
			// 	{
			// 		game.contextBackground.globalAlpha = 0;
			// 		game.backgroundFaded = true;
			// 	}

			// 	game.contextBackground.globalAlpha = this.backgroundAlpha;													
			// break;

			case 'enemies':
				if (this.enemiesAlpha > 0)
				{				
					this.enemiesAlpha -= this.alphaDelta;
				}
				else if (game.enemiesApha <= 0)
				{
					game.contextEnemies.globalAlpha = 0;
					game.enemiesFaded = true;
				}

				game.contextEnemies.globalAlpha = this.enemiesAlpha;		
			break;
		
			case 'player':
				if (this.playerAlpha > 0)
				{				
					this.playerAlpha -= this.alphaDelta;
				}
				else if (this.playerAlpha <= 0)
				{
					game.contextPlayer.globalAlpha = 0;
					game.playerFaded = true;
				}

				game.contextPlayer.globalAlpha = this.playerAlpha;						
			break;
		}
	};

}

gameLights = new lights();
function text() {

	this.font = 'Helvetica';
	this.fontWeight = 'bold';
	this.fontColor0 = 'purple';
	this.fontColor1 = '#FFC619';
	this.fontColor2 = '#FFFFFF';
	this.introFontSize0 = Math.round(game.width*0.09); //Intro title size
	this.introFontSize1 = Math.round(game.width*0.07); //Intro sub-title size
	this.introFontSize2 = Math.round(game.width*0.06); //Intro hint size
	this.fontSize0 = Math.round(game.width*0.06); //title size
	this.fontSize1 = Math.round(game.width*0.05); //sub-title size
	this.fontSize2 = Math.round(game.width*0.04); //hint size

	this.levelBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
	this.introBackground = 'intro_bg.jpg';

	// function message(message, row, font, fontSize, fontColor, fontWeight)

	// this.gameLoading = function() {
	// 	game.contextText.clearRect(0, 0, game.width, game.height);

	// 	message('Loading...', 1, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 

	// };

	this.gameIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		game.contextText.drawImage(game.images[this.introBackground], 0, 0, game.width, game.height); //use ctx text here because ctx background will clear in main update

		message('Space Prawns 2039', 1,  this.font, this.introFontSize0, this.fontColor0, this.fontWeight); 
		message('We invited, they came...', 2, this.font, this.introFontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to start', 3, this.font, this.introFontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to start', 3, this.font, this.introFontSize2, this.fontColor2, this.fontWeight);
		}
	};

	this.lvlIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);				

		message('Stage ' + game.level, 1,  this.font, this.fontSize0, this.fontColor1, this.fontWeight); 
		message(this.levelBriefing[game.level - 1], 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}
	};

	this.lvlComplete = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Stage Complete!', 1,  this.font,this.fontSize0, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}

	};

	this.gameOver = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Game Over', 1,  this.font, this.fontSize0, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);
		
		if (game.isMobile)
		{
			message('Tap screen to restart', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to restart', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}

	};

}

gameText = new text();
function transition()
{

	this.keyframe0 = true;
	this.keyframe1 = false;
	this.keyframe2 = false;	


	this.lvlIntro = function()
	{		
		gameText.lvlIntro();

		if(this.keyframe0)
		{				
			gameLights.fadeIn('text');
			if(!game.textFaded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				if(!game.textFaded)
				{						
					this.keyframe0 = false;
					this.keyframe1 = true;				
				}
				gameLights.on('text');
			}
		}
		else if (this.keyframe1)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe1 = false;
				this.keyframe2 = true;
			}
		}
		else if(this.keyframe2)
		{
			gameLights.fadeOut('text');
			if(game.textFaded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				if(game.textFaded)
				{	
					this.keyframe2 = false;
					this.keyframe0 = true;
					game.contextText.clearRect(0, 0, game.width, game.height);	//move this, need to improve clrcanvas function							
					resetGame();
					game.lvlIntro = false;
					game.lvlStart = true;
				}
				gameLights.off('text');								
			}
		}
	};

	this.lvlStart = function()
	{
		gameLights.fadeIn('all');
		if(!game.faded)
		{
			gameUI.updateAll();
			game.lvlStart = false;		
		}	
	};

	this.lvlComplete = function()
	{

		gameText.lvlComplete();	

		if (this.keyframe0)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe0 = false;
				this.keyframe1 = true;
			}
		}
		else if(this.keyframe1)
		{
			gameLights.fadeOut('all');
			if(game.faded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				if (game.faded)
				{
					game.lvlIntro = true;	
					this.keyframe0 = true;
					this.keyframe1 = false;
					game.levelComplete = false;
					game.level++;
				}
				gameLights.off('all'); //lights out and setting game.faded = true						
			}
		}	
	};

	this.gameOver = function()
	{

		gameText.gameOver();	

		if (this.keyframe0)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe0 = false;
				this.keyframe1 = true;				
			}
		}
		else if(this.keyframe1)
		{
			gameLights.fadeOut('all');
			if(game.faded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = 0;				
				if (game.faded){ //this will only trigger in the next frame
					this.keyframe0 = true;
					this.keyframe1 = false;
					game.start = true;
					gameLights.on('text');
					gameText.gameIntro();
					game.gameOver = false;
					game.paused = true;
				}	
				gameLights.off('all'); //lights out and setting game.faded = true									
			}
		}	
	};

	this.load = function()
	{
		if (game.lvlIntro)
		{
			gameTransition.lvlIntro();
		}
		else if (game.lvlStart)
		{
			gameTransition.lvlStart();
		}
		else if (game.levelComplete)
		{
			gameTransition.lvlComplete();
		}
		else if (game.gameOver)
		{
			gameTransition.gameOver();
		}
	};

	this.reset = function()
	{
		this.keyframe0 = true;
		this.keyframe1 = false;
		this.keyframe2 = false;		
	};

}

gameTransition = new transition();
function menu()
{
	this.toggled = true;
	this.start = $('#startGame');
	this.restart = $('#resetGame');
	this.soundFx = $('#toggleSound');
	this.music = $('#toggleMusic');
	this.all = $('.menu-option-btn');

	// this.widthProp = $(gameArea).height() * (9/16);


	this.toggleSound = function()
	{
		game.sound = game.sound ? false : true ;

		localStorage.prawnsSound =  game.sound;


		if (game.sound)
		{
			this.soundFx.addClass('active');
			this.soundFx.text('Sound: ON');
		}
		else
		{			
		this.soundFx.removeClass('active');
		this.soundFx.text('Sound: OFF');
		}

	};

	this.toggleMusic = function()
	{
		game.music = game.music ? false : true ;

		localStorage.prawnsMusic =  game.music;

		if (game.started && game.tracks.length > 0)
		{
			for(var g in game.tracks)
			{
				game.tracks[g].pause();
			}
			game.tracks = [];
		}
		else if (game.started && game.tracks.length < 1)
		{
			game.tracks.push(game.soundTracks['tune1.mp3']);

			for(var w in game.tracks)
			{
				game.tracks[w].play();
				game.tracks[w].loop = true;							
			}
		}

		if (game.music)
		{
			this.music.addClass('active');
			this.music.text('Music: ON');
		}
		else
		{			
			this.music.removeClass('active');
			this.music.text('Music: OFF');
		}

	};


	this.toggle = function()
	{

		this.toggled = this.toggled ? false : true;


		// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
		if (!this.toggled)
		{
			game.paused = true;
			
			this.all.css({"display": "block"});

			this.start.animate({
				opacity: 1,
				"right": "-=50%",
			},800);
			this.restart.animate({
				opacity: 1,
				"left": "-=50%",
			},800);
			this.soundFx.animate({
				opacity: 1,
				"right": "-=50%",
			},800);
			this.music.animate({
				opacity: 1,
				"left": "-=50%",
			},800);
		}
		else
		{
			game.paused = false;

			this.start.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
			this.restart.animate({
				opacity: 0,
				"left": "+=50%",
			},800);
			this.soundFx.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
			this.music.animate({
				opacity: 0,
				"left": "+=50%",
			},800);
		}

		// this.start.css({"left": ($(gameArea).width()-widthProp)*0.55});		
	};

	this.init = function()
	{		
		if (localStorage.prawnsSound === 'true') //note = localStorage will only process string values
		{
			this.soundFx.addClass('active');
			this.soundFx.text('Sound: ON');
		}
		else
		{			
		this.soundFx.removeClass('active');
		this.soundFx.text('Sound: OFF');
		}

		if (localStorage.prawnsMusic === 'true') //note = localStorage will only process string values
		{
			this.music.addClass('active');
			this.music.text('Music: ON');
		}
		else
		{			
		this.music.removeClass('active');
		this.music.text('Music: OFF');
		}

		gameMenu.toggle();

	};

	this.hide = function() {
		this.score = game.score;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15*dtSize + 'px helvetica';
		game.contextText.clearRect(this.scoreX, this.height*0.3, this.width*0.14, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.scoreX, this.scoreY); //printing the score
	};
	
}

gameMenu = new menu();
//====================== Game state =================//
		
		function gameState() {

			//game start
			// if ((game.keys[13] || mouseIsDown) && !game.started && !(game.gameOver) && !(game.gameWon)) {
			// 	resetGame();
			// 	mouseIsDown = 0;
			// 	game.keys[13] = false;					
			// 	if(game.music && game.tracks.length < 1){
			// 		game.tracks.push(game.soundTracks['tune1.' + fileFormat]);
			// 		game.tracks[0].play();
			// 		game.tracks[0].loop = true;				
			// 		// game.music[q].addEventListener("ended", game.music.splice(q,1));
			// 	}
				
			// 	//setting alpha = 0
			// 	gameLights.off('all');
			// 	game.started = true;
			// 	game.paused = false;
			// 	gameUI.updateAll();
			// }
			
			//If Esc
			if (game.keys[27]) {
				mouseIsDown = 0;				
				game.keys[27] = false;
				playerShip.hull = 0;
				playerShip.lives = 0;
				game.gameOver = true;								
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



				if (game.tracks.length > 0) {
					for(var g in game.tracks){
						game.tracks[g].pause();
					}
					game.tracks = [];
				}
				else if (game.tracks.length < 1) {
						game.tracks.push(game.soundTracks['tune1.mp3']);
						for(var w in game.tracks){
							game.tracks[w].play();
							game.tracks[w].loop = true;							
						}
				}
			}


			//game pause
			if ((game.keys[80]) && !(game.gameWon) && !(game.gameOver))
			{
				game.paused = (game.paused) ? false : true;
				game.keys[80] = false;
			}

			//If Esc pressed or if gameover and enter pressed
			if (game.keys[27] ||
			   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.gameOver && !(game.gameWon)) ||
			   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.level >= 7))
			{
				if (game.lives < 1 || game.level >=7)
				{
					game.level = X_Level;
					game.score = 0;
					playerShip.lives = X_Lives;
					// game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
				}

				resetGame();
			}
		}
		//====================== Main update function =================//		
		function update(){
			//////////////////////// 
			// Init
			///////////////////////
			clrCanvas();	

			//obtaining an average deltaTime
			if(dtTimer <= 30){

				var timeNow = new Date().getTime();
				var timeDiff = timeNow - (timeThen);
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

    		//game time
			game.timer++;
			game.seconds = game.timer/60 || 0;
			// console.log(game.seconds);



			playerShip.load();


			//////////////////////// 
			// Background
			///////////////////////

			// addStars(1);		

			gameBackground.update();


			/////////////////////////////////////////////////////////////////////////////////
			// LEVELS
			////////////////////////////////////////////////////////////////////////////////

			if (game.level == 1) { lvl1(); }
			else if (game.level == 2) { lvl1(); }
			else if (game.level == 3) { lvl3(); }


			//level finished
			if (game.bossDead && game.levelUpTimer <= 100) 
			{
				//waiting a few secs before any action
				game.levelUpTimer++; 

				if (game.levelUpTimer == 100) 
				{
					game.levelComplete = true;
					mouseIsDown = 0;					
				}
			}

			/////////////////////////////////////////////////////////////////////////////////
			// TRANSITIONS
			////////////////////////////////////////////////////////////////////////////////
			
			gameTransition.load();			

			///////////////////////////////////
			// Player bullets
			///////////////////////////////////
			if (game.playerBullets.length >= 1)
			{
				for (var k in game.playerBullets)
				{					
					if (!game.playerBullets[k].dead)
					{
						game.playerBullets[k].update();					
						game.playerBullets[k].draw();
					}
				}

				for (var r in game.playerBullets)
				{					
					if (game.playerBullets[r].dead || game.playerBullets[r].x > game.width + game.playerBullets[r].size || game.playerBullets[r].x < 0 - game.playerBullets[r].size || game.playerBullets[r].y > game.height + game.playerBullets[r].size || game.playerBullets[r].y < 0 - 30)
					{
						game.playerBullets.splice(r,1);
					}
				}
			}

			// console.log(game.playerBullets.length);
			// console.log(game.enemyBullets.length);
			// console.log(game.enemies.length);


			///////////////////////////////////
			// Enemies
			///////////////////////////////////

			if (game.enemies.length > 0){
				
				for (var c in game.enemies){
					game.enemies[c].update();
					game.enemies[c].draw();
				}

				if (game.playerBullets.length >= 1){				
					//projectiles collision
					for (var j in game.enemies){
						for (var f in game.playerBullets){
							if (Collision(game.enemies[j], game.playerBullets[f]) && !game.enemies[j].dead){ //dead check avoids ghost scoring														
								game.enemies[j].hit = true;	
								game.enemies[j].hull -= game.playerBullets[f].power;
								// game.contextEnemies.clearRect(game.playerBullets[f].x, game.playerBullets[f].y, game.playerBullets[f].size, game.playerBullets[f].size*1.8);								
								if(game.enemies[j].hull > 0) {
									game.explosions.push(new explosion(game.enemies[j].x + game.enemies[j].size*0.5, game.enemies[j].y + game.enemies[j].size*0.5, 0, 1, game.enemies[j].size*0.25));
								}
								game.playerBullets[f].dead = true;
								// game.playerBullets.splice(f,1);
							}
						}
					}
				}

				// AI // pathfinding 
				// for (var w in game.enemies){														
				// 	for (var m in game.enemies){
				// 		if (m != w) {
				// 		// for (var w = 0; w <= game.enemies.length; w++) {												
				// 			if (Collision(game.enemies[m], game.enemies[w]) && !game.enemies[m].collided && !game.enemies[w].collided && (game.enemies[m].y > game.enemies[m].size || game.enemies[w] > game.enemies[w].size))
				// 			{
				// 				game.enemies[m].collided = true;
				// 				game.enemies[w].collided = true;

				// 				if (game.enemies[m].collided && game.enemies[w].collided)
				// 				{

				// 					if (game.enemies[m].type == 'base' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[w].direction = game.enemies[w].direction - Math.PI/8;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else if (game.enemies[w].type == 'base' && game.enemies[m].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[m].direction - Math.PI/8;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}								
				// 					else if (game.enemies[m].type == 'miniboss' && game.enemies[w].type !== 'miniboss' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else if (game.enemies[w].type == 'miniboss' && game.enemies[m].type !== 'miniboss' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[w].speed = game.enemies[m].speed;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else {
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].speed += 5;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 					}								
				// 				}

				// 				// game.enemies[w].direction = game.enemies[m].direction + Math.PI;
				// 				// game.enemies[w].speed = game.enemies[w].speed/2;
				// 				// console.log ('collision!');
				// 			}
				// 			else if (game.enemies[m].type !== 'base' && game.enemies[w].type !== 'base') {
				// 				game.enemies[m].direction -= utils.randomRange(-0.05, 0.05);
				// 				game.enemies[m].collided = false;
				// 				game.enemies[w].collided = false;
				// 				// game.enemies[w].direction -= utils.randomRange(-0.05, 0.05);
				// 				// game.enemies[m].speed = game.enemies[m].speed;
				// 				// game.enemies[w].speed = game.enemies[w].speed;
				// 			}
				// 			else
				// 			{
				// 				game.enemies[m].collided = false;
				// 				game.enemies[w].collided = false;
				// 			}
				// 			// else if (game.enemies[m].collided && game.enemies[w].collided)
				// 			// {
				// 			// 	if (game.enemies[m].type !== 'base' || game.enemies[w].type !== 'base')
				// 			// 	{
				// 			// 		game.enemies[m].speed = game.enemies[m].speed;
				// 			// 		game.enemies[w].speed = game.enemies[w].speed;
				// 			// 	}
				// 			// 	else if (game.enemies[m].type == 'base')
				// 			// 	{
				// 			// 		game.enemies[w].direction = -game.enemies[w].direction;
				// 			// 		// game.enemies[m].speed = game.enemies[w].speed;
				// 			// 	}
				// 			// 	else if (game.enemies[w].type == 'base')
				// 			// 	{
				// 			// 		game.enemies[m].direction = -game.enemies[m].direction/2;
				// 			// 	}								
				// 			// 	game.enemies[m].collided = false;
				// 			// 	game.enemies[w].collided = false;
				// 			// }
				// 			// else
				// 			// {

				// 			// }
				// 		}
				// 		// }
				// 	}	
				// }

				for (var t in game.enemies){					
					// player-enemy collision
					if (Collision(game.enemies[t], playerShip) && !game.enemies[t].dead && !playerShip.imune && !game.gameOver){			
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
							if (lootchance < 0.3) {
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
				}

				for (var v in game.loot){
					if(game.loot[v].dead || game.loot[v].x > game.width + game.loot[v].size || game.loot[v].x < 0 - game.loot[v].size || game.loot[v].y > game.height + game.loot[v].size || game.loot[v].y < 0 - 30){
						game.loot.splice(v,1);
					}
				}
			}




			///////////////////////////////////
			// Enemy Bullets
			///////////////////////////////////

			if (game.enemyBullets.length >= 1)
			{

				for (var z in game.enemyBullets){
					game.enemyBullets[z].update();
					game.enemyBullets[z].draw();
				}

				for (var d in game.enemyBullets)
				{
					if (Collision(game.enemyBullets[d], playerShip) && !playerShip.imune && !game.gameOver){ //
						// if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}							
									// game.contextEnemies.clearRect(game.playerBullets[p].x, game.playerBullets[p].y, game.playerBullets[p].size, game.playerBullets[p].size*1.8);								
						playerShip.hull -= game.enemyBullets[d].power;
						gameUI.updateEnergy();	
						playerShip.hit = true;	
						// Xplode(playerShip.x, playerShip.y);
						// playerShip.dead = true;
						// 		game.contextPlayer.clearRect(game.player.x, game.player.y, game.player.size, game.player.size);
						// 		Xplode(game.player.x, game.player.y);
								// PlayerDie();
						// 	}
						game.enemyBullets[d].dead = true;
					}
				}

				for (var w in game.enemyBullets){
					if(game.enemyBullets[w].dead || game.enemyBullets[w].x > game.width + game.enemyBullets[w].size || game.enemyBullets[w].x < 0 - game.enemyBullets[w].size || game.enemyBullets[w].y > game.height + game.enemyBullets[w].size || game.enemyBullets[w].y < 0 - 30){
						game.enemyBullets.splice(w,1);
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

					if (game.explosions[p].sprite.currentFrame >= game.explosions[p].sprite.endFrame){
						game.explosions.splice(p,1);
					}
				}
			}

			///////////////////////////////////
			// Game Sounds
			///////////////////////////////////

			// console.log (game.sounds.length);
			
			if (game.sounds.length > 0) {
				for(var s in game.sounds){

					game.sounds[s].cloneNode(true).play();
					game.sounds[s].addEventListener("ended", game.sounds.splice(s,1));
				}
			}


			///////////////////////////////////
			// D3BUG3R!
			///////////////////////////////////

			// console.log ('game font: ' + game.font);
			// console.log ('game tracks length: ' + game.tracks.length);
			// console.log ('game tracks: ' + game.tracks);
			// console.log ('game soundtracks length: ' + game.soundTracks.length);
			// console.log ('game sfx length: ' + game.sfx.length);

			// console.log ('update w:' + game.width);
			// console.log ('update h:' +game.height);
										
		}	
function lvl1() {

			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)

			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('left', game.width*0.3, 'sectoid.png', 'pawn', 1, 300, 1, 0));
			}
			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 1, 250, 1, 0));
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('left', game.height*0.5, 'sectoid.png', 'pawn', 1, 250, 1, 0));		
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('right', game.height*0.5, 'sectoid.png', 'pawn', 1, 300, 1, 0));		
			}

			if (game.seconds == 5) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));		
			}
			if (game.seconds == 7) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 'alienbase1.png', 1));
			}
			if (game.seconds == 8) {
			    game.waves.push(new enemyWave('left', game.height*0.3, 'sectoid.png', 'pawn', 4, 250, 1, 2));
			}
			if (game.seconds == 9) {
			    game.waves.push(new enemyWave('right', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}			
			if (game.seconds == 10) {
			    game.waves.push(new enemyWave('top', game.width*0.5, 'sectoid.png', 'pawn', 6, 300, 1, 2));
			}
			if (game.seconds == 11) {
			    game.waves.push(new enemyWave('top', game.width*0.7, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 12) {
			    game.waves.push(new enemyWave('left', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}
			if (game.seconds == 13) {				
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 'alienbase2.png', 1));				
			}
			if (game.seconds > 13 && game.tracks.length < 2 && game.enemies.length > 0 && !game.bossDead) //NEEDS WORK
			{
				if(game.music){
					game.tracks.push(game.soundTracks['tune2.' + fileFormat]);				
					game.tracks[1].play();
					game.tracks[1].loop = true;
				}
			}
			if (game.seconds == 15) {
			    game.waves.push(new enemyWave('top', game.width*0.2, 'sectoid.png', 'pawn', 2, 300, 1, 2));
			}
			if (game.seconds == 16) {
			    game.waves.push(new enemyWave('top', game.width*0.4, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}
			if (game.seconds == 17) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 18) {
			    game.waves.push(new enemyWave('top', game.width*0.8, 'sectoid.png', 'pawn', 5, 300, 1, 2));
			}
			if (game.seconds == 22) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 25) {
			    game.waves.push(new enemyWave('left', game.width*0.4, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 27) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 30) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 33) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 35) {
			    game.waves.push(new enemyWave('right', game.width*0.2, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 37) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 38) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 39) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 40) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 41) {
			    game.enemies.push(new enemy(game.width * 0.5, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}			
			if (game.seconds == 42) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 43) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 44) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 45) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead) {
				if (game.music) {
					game.tracks.push(game.soundTracks['boss.' + fileFormat]);
					game.tracks[2].play();
					game.tracks[2].loop = true;
				}
			    game.enemies.push(new boss(game.width*0.3, -game.height*0.1, 150, Math.PI/2, 100, 'sectoidBoss.png'));
			}

			if (game.seconds > 55 && game.enemies.length === 0 && game.bossDead && game.tracks.length == 3) {
				game.tracks[0].pause();
				game.tracks[1].pause();
				game.tracks[2].pause();
				game.tracks=[];
				if (game.music && game.tracks.length === 0)
					{
						game.tracks.push(game.soundTracks['victory.' + fileFormat]);
					}

				game.tracks[0].play();
			}
			//boss(x, y, speed, direction, hull, image)
}
		//====================== Game functions =================//
		

		// function toggleFullScreen()  //experimental   only works with user input
 	// 	{
		//   if (!document.fullscreenElement &&    // alternative standard method
		//       !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
		//     if (document.documentElement.requestFullscreen) {
		//       document.documentElement.requestFullscreen();
		//     } else if (document.documentElement.msRequestFullscreen) {
		//       document.documentElement.msRequestFullscreen();
		//     } else if (document.documentElement.mozRequestFullScreen) {
		//       document.documentElement.mozRequestFullScreen();
		//     } else if (document.documentElement.webkitRequestFullscreen) {
		//       document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		//     }
		//   } else {
		//     if (document.exitFullscreen) {
		//       document.exitFullscreen();
		//     } else if (document.msExitFullscreen) {
		//       document.msExitFullscreen();
		//     } else if (document.mozCancelFullScreen) {
		//       document.mozCancelFullScreen();
		//     } else if (document.webkitExitFullscreen) {
		//       document.webkitExitFullscreen();
		//     }
		//   }
		// }

		//Keyboard		
		$(document).keydown(function(e){    //using jquery to listen to pressed keys
			game.keys[e.keyCode ? e.keyCode : e.which] = true;	//and cross browser proofing
		});
		
		$(document).keyup(function(e){   //using jquery to listen to released keys
			delete game.keys[e.keyCode ? e.keyCode : e.which]; //once key is released, delete the key pressed action previously defined 
		});
		
		//mouse and touch screens
		var canvas;
		var canvasX = playerShip.x;
		var canvasY = playerShip.y;
		var mouseIsDown = 0;
		var touchInitX = 0;
		var touchInitY = 0;
 

		function initInput()
		{
	        canvas = document.getElementById("textCanvas");
			         
	        canvas.addEventListener("mousedown",mouseDown, false);
	        canvas.addEventListener("mouseup", mouseUp, false);        
	        canvas.addEventListener("mousemove",mouseXY, false);

	        canvas.addEventListener("touchstart", touchDown, false);
	        canvas.addEventListener("touchend", touchUp, false);
	        canvas.addEventListener("touchcancel", touchUp, false);
	        canvas.addEventListener("touchleave", touchUp, false);
			canvas.addEventListener("touchmove", touchXY, false);
		                
		}		
		
		function mouseUp(e)
		{
			e.preventDefault();
			mouseIsDown = 0;
		}
		 
		function touchUp(e)
		{
			e.preventDefault();
			mouseIsDown = 0;
		}
		 
		function mouseDown(e)
		{
			e.preventDefault();
			mouseIsDown = 1;
			touchInitX = e.pageX - canvas.offsetLeft;
			touchInitY = e.pageY - canvas.offsetTop;
		}
		  
		function touchDown(e)
		{
			e.preventDefault();
			mouseIsDown = 1;
			var touch = e.targetTouches[0];

			touchInitX =  touch.pageX - touch.target.offsetLeft;
			touchInitY =  touch.pageY - touch.target.offsetTop;

		}
		
		function mouseXY(e)
		{
			e.preventDefault();
			canvasX = e.pageX - canvas.offsetLeft;
			canvasY = e.pageY - canvas.offsetTop;
		}
		 
		function touchXY(e) {
			e.preventDefault();
			var touch = e.targetTouches[0];

    		canvasX = touch.pageX - canvas.offsetLeft;
    		canvasY = touch.pageY - canvas.offsetTop;
 
		}



		//testing using DOM audio sources

		// function setSource() {
  // 			audio1 = document.querySelector('#audio1');
  // 			audio2 = document.querySelector('#audio2');
  // 			audio3 = document.querySelector('#audio3');
  // 			audio1.src = '_sounds/_sfx/laser.' + fileFormat;
  // 			audio2.src = '_sounds/_sfx/laser.' + fileFormat;
  // 			audio3.src = '_sounds/_sfx/laser.' + fileFormat;
		// }

		// function mediaPlaybackRequiresUserGesture() {
		// 	// test if play() is ignored when not called from an input event handler
		// 	audio_test = document.createElement('audio');
		// 	audio_test.play();
		// 	return audio_test.paused;		  
		// }

		// function removeBehaviorsRestrictions() {
		// 	// audio1 = document.querySelector('#audio1');
		// 	// audio2 = document.querySelector('#audio2');
		// 	// audio3 = document.querySelector('#audio3');
		// 	sfxTest.load();
		// 	sfxBlast.load();
		// 	sfxExplosion.load();
		// 	sfxHit.load();
		// 	sfxLaser.load();
		// 	sfxLoot.load();
		// 	sfxHit.load();
		// 	stBoss.load();
		// 	stLvl1a.load();
		// 	stLvl1b.load();
		// 	stVictory.load();
		// 	window.removeEventListener('keydown', removeBehaviorsRestrictions);
		// 	window.removeEventListener('mousedown', removeBehaviorsRestrictions);
		// 	window.removeEventListener('touchstart', removeBehaviorsRestrictions);
		   	
  // 			setTimeout(setSource, 1000);
		// }

		// if (mediaPlaybackRequiresUserGesture()) {
		// 	window.addEventListener('keydown', removeBehaviorsRestrictions);
		// 	window.addEventListener('mousedown', removeBehaviorsRestrictions);
		// 	window.addEventListener('touchstart', removeBehaviorsRestrictions);
		// }
		// else
		// {
		// 	setSource();
		// }
				
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


		function clrCanvas(){
			// game.contextBackground.clearRect(0, 0, game.width, game.height); 
			game.contextPlayer.clearRect(0, 0, game.width, game.height); 
			game.contextEnemies.clearRect(0, 0, game.width, game.height);
		}

		function resetGame(){
			gameLights.off('all');
			gameTransition.reset();
			mouseIsDown = 0;
			game.gameOver = false; 
			game.gameWon = false;
			game.level = game.lvlIntro ? game.level : 1 ;
			game.bossDead = false;
			game.levelComplete = false;
			game.lvlStart = false;
			game.lvlIntro = true;
			game.levelUpTimer = 0;					
			// game.downCount = 1;
			// game.left = false;
			// game.down = false;
			// game.enshootTimer = game.enfullShootTimer;

			// game.projectiles = [];
			// game.enprojectiles = [];
			// game.enemies = [];
			clrCanvas();			
			gameBackground.load();							
			playerShip.reset();
			gameUI.updateAll();
			// game.background = [];
			game.enemies = [];
			game.waves = [];			
			game.enemyBullets = [];
			game.loot = [];
			game.delayTimer = 0;
			game.timer = 0;		
			game.sounds = [];

			for(var g in game.tracks){
					game.tracks[g].pause();
			}
			game.tracks = [];

			if (game.music){
				game.tracks.push(game.soundTracks['tune1.' + fileFormat]);
				game.tracks[0].play();
				game.tracks[0].loop = true;	
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
			// scores();

		}



		// function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
			
		// 	if (!(first.x + first.size < second.x || second.x + second.size < first.x || first.y + first.size < second.y || second.y + second.size < first.y)) {

		// 		Cx = first.x < second.x ? second.x : first.x;
		// 		Cy = first.y < second.y ? second.y : first.y;
		// 		CX = first.x + first.size < second.x + second.size ? first.x + first.size : second.x + second.size;
		// 		CY = first.y + first.size < second.y + second.size ? first.y + first.size : second.y + second.size;

		// 		iFirst = first.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);
		// 		iSecond = second.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);

		// 		var length = iFirst.data.length;

		// 		for (var i = 0 ; i < length; i+= game.res) {
		// 			// return !(!iFirst.data[i] || !iSecond.data[i]);
		// 			if (iFirst.data[i] > 0 && iSecond.data[i] > 0)
		// 			{	
		// 				// console.log('true1');
		// 				return true;
						
		// 			}
		// 		}
		// 		console.log(iFirst.data.length);
		// 	}
		// 	// console.log('false');			
		// 	return false;			
		// }

		
		function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
			return !(first.x > second.x + second.size ||
				first.x + first.size < second.x ||
				first.y > second.y + second.size ||
				first.y + first.size < second.y);
		}

		

		//messages
		function message(message, row, font, fontSize, fontColor, fontWeight) {

			var text = message;
			var textLength = text.length;
			var textWidth = Math.round(textLength * (fontSize/2));
			var textHeight = Math.round(game.height*0.1);
			// this.color = fontColor;
			// this.font = game.isMobile ? font : "Monaco";
			// this.fontSize = fontSize;
			// this.fontWeight = fontWeight;

			// var x = (game.width - textWidth) *0.5;
			// var y = (game.height - fontSize) *0.5;
			var x = Math.round((game.width - textWidth)*0.5);
			var y = Math.round((game.height/3.5) + (textHeight * row));

			// console.log (x, y);
			// console.log (game.width);			
			// console.log (textWidth);
			// console.log (textLength);


			game.contextText.font = fontWeight + " " + fontSize + "px " + font;				
			game.contextText.fillStyle = fontColor;
			game.contextText.fillText(text, x, y);	
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


		function startGame()
		{		
				gameMenu.toggle();

				resetGame();			
				if(game.music && game.tracks.length < 1){
					game.tracks.push(game.soundTracks['tune1.' + fileFormat]);
					game.tracks[0].play();
					game.tracks[0].loop = true;				
					// game.music[q].addEventListener("ended", game.music.splice(q,1));
				}
				
				//setting alpha = 0
				gameLights.off('all');
				game.started = true;
				game.paused = false;
				gameUI.updateAll();
				loop();
		}


		//====================== Images engine =================//
		
		function initImages(ipaths) { //our images engine: passing the array 'ipaths' to the function
			game.requiredImages = ipaths.length; //the number of required images will be equal to the length of the ipaths array
			for(var i in ipaths)
			{
				var img = new Image(); //defining img as a new image
				img.src = ipaths[i]; //defining new image src as ipaths[i]

				var imgIndex = img.src.split("/").pop(); //obtaining file name from path
				// var imgIndex = imgFile.substr(0, imgFile.lastIndexOf('.')) || imgFile;

				game.images[imgIndex] = img; //defining game.image[index] as a new image (with ipaths)

				/*jshint -W083 */
				game.images[imgIndex].onload = function()
				{ //once an image loads..
					game.doneImages++; //  ..increment the doneImages variable by 1
				};

				if(i < 1)
				{
					//=========================== Game loading Screen =================================== 	
					game.contextText.font = "bold " + game.width*0.06 + "px " + game.font; 
					game.contextText.fillStyle = "white";
					game.contextText.fillText("Loading Images...", game.width*0.22, game.height*0.47);
				}
				// console.log('reqImages: ' + game.requiredImages);
				// console.log('doneImages: ' + game.doneImages);
			}
		}

		function initSfx(sfxPaths) { //our Sfx engine: passing the array 'sfxPaths' to the function
			game.requiredSfx = sfxPaths.length; //the number of required Sfx will be equal to the length of the sfxPaths array
			// console.log('required soundSfx:' + game.requiredSfx);
			for(var i in sfxPaths)
			{
				var sfx = document.createElement('audio'); //defining sfx as a new Audio					
				sfx.setAttribute('src', sfxPaths[i]);

				var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path
				// var sfxIndex = imgFile.substr(0, imgFile.lastIndexOf('.')) || imgFile;

				sfx.setAttribute('id', sfxIndex);

				game.sfx[sfxIndex] = sfx; //defining game.Sfx[index] as a new Audio (with sfxPaths)

				var domContainer = document.getElementById("container"); 
  				document.body.insertBefore(sfx, domContainer);

				/*jshint -W083 */
				// game.sfx[sfxIndex].addEventListener("canplaythrough", function(){  //once an Sfx loads..
					game.doneSfx++; //  ..increment the doneSfx variable by 1
					// console.log('done Sfx:' + game.doneSfx);
				// });

				if(i < 1)
				{
					//=========================== Game loading Screen =================================== 	
					game.contextText.font = "bold " + game.width*0.06 + "px " + game.font; 
					game.contextText.fillStyle = "white";
					game.contextText.fillText("Loading Sfx...", game.width*0.23, game.height*0.47);
				}
				// console.log('reqSfx: ' + game.requiredSfx);
			}
		}

		function initSoundTracks(stPaths)
		{ //our Sfx engine: passing the array 'stPaths' to the function
			game.requiredSoundTracks = stPaths.length; //the number of required Sfx will be equal to the length of the stPaths array
			// console.log('required soundTracks:' + game.requiredSoundTracks);
			for(var i in stPaths)
			{
				var soundTracks = document.createElement('audio'); //defining img as a new Audio
				soundTracks.setAttribute('src', stPaths[i]);

				var soundTracksIndex = soundTracks.src.split("/").pop(); //obtaining file name from path
				// var soundTracksIndex = imgFile.substr(0, imgFile.lastIndexOf('.')) || imgFile;
				// console.log (soundTracksIndex);

				soundTracks.setAttribute('id', soundTracksIndex);

				game.soundTracks[soundTracksIndex] = soundTracks; //defining game.soundTracks[index] as a new Audio (with stPaths)

				var domContainer = document.getElementById("container"); 
  				document.body.insertBefore(soundTracks, domContainer);

				/*jshint -W083 */
				// game.soundTracks[soundTracksIndex].addEventListener("canplaythrough", function(){ //once a sound loads..
					game.doneSoundTracks++; //  ..increment the doneSoundTracks variable by 1
					// console.log('done soundTracks:' + game.doneSoundTracks);
					// game.contextText.fillText("+", game.width*0.20, (game.height*0.55) + (game.doneSoundTracks*5));
				// });

				if(i < 1)
				{
					//=========================== Game loading Screen =================================== 	
					game.contextText.font = "bold " + game.width*0.06 + "px " + game.font; 
					game.contextText.fillStyle = "white";
					game.contextText.fillText("Loading Sound Tracks...", game.width*0.15, game.height*0.47);
				}
				// console.log('requiredSoundTracks: ' + game.requiredSoundTracks);
			}
		}

		// function initSfx(paths) { //our Sfx engine: passing the array 'paths' to the function
		// 	game.requiredSfx = paths.length; //the number of required Sfx will be equal to the length of the paths array
		// 	for(var i in paths)
		// 	{
		// 		var sfx = new Audio(); //defining img as a new Audio
		// 		sfx.src = paths[i]; //defining new Audio src as paths[i]

		// 		var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path
		// 		// var sfxIndex = imgFile.substr(0, imgFile.lastIndexOf('.')) || imgFile;

		// 		game.sfx[sfxIndex] = sfx; //defining game.Sfx[index] as a new Audio (with paths)

		// 		/*jshint -W083 */
		// 		game.sfx[sfxIndex].oncanplaythrough = function()
		// 		{ //once an Sfx loads..
		// 			game.doneSfx++; //  ..increment the doneSfx variable by 1
		// 		};

		// 		if(i < 1)
		// 		{
		// 			//=========================== Game loading Screen =================================== 	
		// 			game.contextText.font = "bold " + game.width*0.08 + "px " + game.font; 
		// 			game.contextText.fillStyle = "white";
		// 			game.contextText.fillText("Loading Sound FX...", game.width*0.30, game.height*0.47);
		// 		}
		// 		console.log('reqSfx: ' + game.requiredSfx);
		// 	}
		// }

		function checkImages(){	//checking if all images have been loaded. Once all loaded run initSfx
			if(game.doneImages >= game.requiredImages){
				game.contextText.clearRect(0, 0, game.width, game.height);
				initSfx([	//using initSfx function to load our sounds
					"_sounds/_sfx/laser." + fileFormat,			
					"_sounds/_sfx/hit." + fileFormat,			
					"_sounds/_sfx/loot_powerUp." + fileFormat,			
					"_sounds/_sfx/explosion." + fileFormat,			
					"_sounds/_sfx/blast." + fileFormat		
				]);
				checkSfx();
			} 
			else
			{
				game.contextText.fillText("|", game.width*0.15+(game.doneImages+1), game.height*0.55);		
				setTimeout(function(){
					checkImages();
				}, 1);
			}
		}

		function checkSfx(){	//checking if all Sfx have been loaded. Once all loaded run init
			if(game.doneSfx >= game.requiredSfx){
				game.contextText.clearRect(0, 0, game.width, game.height);				
				initSoundTracks([	//using initSfx function to load our sound tracks
					"_sounds/_soundTracks/_lvl1/tune1." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/tune2." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/victory." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/boss." + fileFormat	
				]);
				checkSoundTracks();
			} 
			else
			{
				game.contextText.fillText("|", game.width*0.20+(game.doneSfx+1), game.height*0.55);					
				setTimeout(function(){
					checkSfx();
				}, 1);
			}
		}

		function checkSoundTracks(){	//checking if all Sfx have been loaded. Once all loaded run init
			if(game.doneSoundTracks >= game.requiredSoundTracks){
				gameText.gameIntro();
				gameMenu.init();
				// loop(); //LOoP CALL!!!
				if(!game.isMobile) {document.getElementById('textCanvas').style.cursor = 'corsair';} 				
			} 
			else
			{
				game.contextText.fillText("|", game.width*0.20+(game.doneSoundTracks+1), game.height*0.55);					
				setTimeout(function(){
					checkSoundTracks();
				}, 1);
			}
		}
			
		initImages([	//using initimages function to load our images
			//backgrounds
			"_img/_dist/background/intro_bg.jpg",
			// "_img/_dist/background/level1_small.jpg",
			
			//UI
			"_img/_dist/ui/energybar.png",			
			"_img/_dist/ui/energypoint.png",
			
			//Player
			"_img/_dist/fighter/fighter.png",
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
			
			//Enemies
			////Pawns
			"_img/_dist/enemies/sectoid.png",
			////Minibosses
			"_img/_dist/enemies/_miniboss/floater.png",			
			////Enemy Bases
			"_img/_dist/enemies/_alienbase/alienbase1.png",			
			"_img/_dist/enemies/_alienbase/alienbase2.png",
			////Big bosses
			"_img/_dist/enemies/_bigboss/sectoidBoss.png",			
			
			//Projectiles
			"_img/_dist/laser.png",
			"_img/_dist/missile.png",
			"_img/_dist/explosion.png"						
		]);



		//====================== Pre-loading Assets to Off-Screen canvas =================//

		//background

		// function loadOsCanvas() {

		// 	m_canvas = document.createElement('canvas');
		// 	m_canvas.width = game.width;
		// 	m_canvas.height = game.height;
		// 	var m_context = m_canvas.getContext('2d');

		// 	m_context.drawImage(game.images['level1.jpg'], 0, 0, m_canvas.width, m_canvas.height);

		// }

		// //Drawing (Add below to update function in game class
		// game.contextBackground.drawImage(m_canvas, this.x, this.y, this.width, this.height);



		function toggleSound() {

			game.sound = game.sound ? false : true ;

			localStorage.prawnsSound =  game.sound;
		}

		function toggleMusic() {

			game.music = game.music ? false : true ;

			localStorage.prawnsMusic =  game.music;

			if (game.tracks.length > 0)
			{
				for(var g in game.tracks)
				{
					game.tracks[g].pause();
				}
				game.tracks = [];
			}
			else if (game.tracks.length < 1)
			{
				game.tracks.push(game.soundTracks['tune1.mp3']);

				for(var w in game.tracks)
				{
					game.tracks[w].play();
					game.tracks[w].loop = true;							
				}
			}
		}


		
		window.addEventListener("load", function load(event)
		{
    		window.removeEventListener("load", load, false); //remove listener, no longer needed
    		
    		if (!game.isMobile) {document.getElementById('textCanvas').style.cursor = 'wait';}

    		//appcache
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

    		//load user input listeners
 			initInput();

 			// loadOsCanvas();

		},false);


 			//this function call starts our game
 			checkImages();  
		
	/* jshint ignore:start */
	// });
// })();
	// }	// jshint ignore:line
/* jshint ignore:end */

window.requestAnimFrame = (function(){  // Creating a request animAnimeFrame function and making it work across browsers.  window.requestAnimationFrame is an HTML built in 60fps anim function
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame    ||
			window.msRequestAnimationFrame    ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);			
			};
})(); // jshint ignore:line