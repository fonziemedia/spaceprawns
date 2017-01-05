var vector = {
	_x: 1,
	_y: 0,

	create: function(x, y)
	{
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},

	setX: function(value)
	{
		this._x = value;
	},

	getX: function()
	{
		return this._x;
	},

	setY: function(value)
	{
		this._y = value;
	},

	getY: function()
	{
		return this._y;
	},

	setAngle: function(angle)
	{
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getAngle: function()
	{
		return Math.atan2(this._y, this._x);
	},

	setLength: function(length)
	{
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getLength: function()
	{
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	add: function(v2)
	{
		return vector.create(this._x + v2.getX(), this._y + v2.getY());
	},

	subtract: function(v2)
	{
		return vector.create(this._x - v2.getX(), this._y - v2.getY());
	},

	multiply: function(val)
	{
		return vector.create(this._x * val, this._y * val);
	},

	divide: function(val)
	{
		return vector.create(this._x / val, this._y / val);
	},

	addTo: function(v2)
	{
		this._x += v2.getX();
		this._y += v2.getY();
	},

	subtractFrom: function(v2)
	{
		this._x -= v2.getX();
		this._y -= v2.getY();
	},

	multiplyBy: function(val)
	{
		this._x *= val;
		this._y *= val;
	},

	divideBy: function(val)
	{
		this._x /= val;
		this._y /= val;
	}
};

var utils = {
	norm: function(value, min, max)
	{
		return (value - min) / (max - min);
	},

	lerp: function(norm, min, max)
	{
		return (max - min) * norm + min;
	},

	map: function(value, sourceMin, sourceMax, destMin, destMax)
	{
		return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
	},

	clamp: function(value, min, max)
	{
		return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
	},

	angleTo: function(p1, p2)
	{
		return Math.atan2((p2.y + p2.centerY) - p1.y, (p2.x + p2.centerX) - p1.x);
	},

	distance: function(p0, p1)
	{
		var dx = p1.x - p0.x,
		dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function(x0, y0, x1, y1)
	{
		var dx = x1 - x0,
		dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function(c0, c1)
	{
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function(x, y, circle)
	{
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},

	pointInRect: function(x, y, rect)
	{
		return utils.inRange(x, rect.x, rect.x + rect.width) &&
		       utils.inRange(y, rect.y, rect.y + rect.height);
	},

	inRange: function(value, min, max)
	{
		return value >= Math.min(min, max) && value <= Math.max(min, max);
	},

	rangeIntersect: function(min0, max0, min1, max1)
	{
		return Math.max(min0, max0) >= Math.min(min1, max1) &&
			   Math.min(min0, max0) <= Math.max(min1, max1);
	},

	rectIntersect: function(r0, r1)
	{
		return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
			   utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
	},

	degreesToRads: function(degrees)
	{
		return degrees / 180 * Math.PI;
	},

	radsToDegrees: function(radians)
	{
		return radians * 180 / Math.PI;
	},

	randomRange: function(min, max)
	{
		return min + Math.random() * (max - min);
	},

	randomInt: function(min, max)
	{
		return Math.floor(min + Math.random() * (max - min + 1));
	},

	roundToPlaces: function(value, places)
	{
		var mult = Math.pow(10, places);
		return Math.round(value * mult) / mult;
	},

	roundNearest: function(value, nearest)
	{
		return Math.round(value / nearest) * nearest;
	},

	quadraticBezier: function(p0, p1, p2, t, pFinal)
	{
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 2) * p0.x +
				   (1 - t) * 2 * t * p1.x +
				   t * t * p2.x;
		pFinal.y = Math.pow(1 - t, 2) * p0.y +
				   (1 - t) * 2 * t * p1.y +
				   t * t * p2.y;
		return pFinal;
	},

	cubicBezier: function(p0, p1, p2, p3, t, pFinal)
	{
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

	multicurve: function(points, context)
	{
		var p0, p1, midx, midy;

		context.moveTo(points[0].x, points[0].y);

		for(var i = 1; i < points.length - 2; i += 1)
		{
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

/////////////////////
// GLOBAL VARS
/////////////////////
var doc = document,
win = window,
game = {};

//iOS viewport fix
if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !win.MSStream)
{
  doc.querySelector('meta[name=viewport]')
    .setAttribute(
      'content',
      'initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=1.0001, user-scalable=no'
    );
}

// Connect to XML
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

game.isMobile = false;
// mobile device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) game.isMobile = true;

//====================== Game vars ========================
game.seconds = 0;
game.background = null;
game.score = 0;
game.levelScore = 0;
game.level = X_Level;
game.bossDead = false;
game.bossUp = false;
game.levelComplete = false;
game.levelUpTimer = 0;
game.lives = X_Lives;
game.keys = [];

game.objects = [];

game.bullets = [];
	game.playerBulletsPool = [];
	game.enemyBulletsPool = [];
	game.lootPool = [];

game.enemies = [];
	game.minionsPool = [];
	game.miniBossPool = [];
	game.enemyBasePool = [];
	game.bossesPool = [];

game.waves = [];
	game.wavesPool = [];

game.explosions = [];
	game.explosionsPool = [];

//required = number of objects to be preloaded (and maximum that can be 'alive' at a given time)
game.requiredWaves = 10;
game.requiredMinions = 25;
game.requiredMiniBosses = 15;
game.requiredEnemyBases = 3;
game.requiredBosses = 5;
game.requiredEnemies = game.requiredMinions + game.requiredMiniBosses + game.requiredEnemyBases + game.requiredBosses;
game.requiredPlayerBullets = 70;
game.requiredEnemyBullets = 30;
game.requiredLoot = 10;
game.requiredExplosions = 30;

game.requiredObjects = game.requiredWaves + game.requiredEnemies + game.requiredPlayerBullets + game.requiredEnemyBullets + game.requiredLoot + game.requiredExplosions;
game.doneObjects = 0;

//====================== Delta Time ======================== (!Needs Work! Move calculation outside loop)
game.dt = 1;
game.dtTimer = 0;
game.dtArray = [];
game.timeThen = new Date().getTime();
game.dtTimerSet = false;

//====================== Game state ========================
game.loaded = false;
game.started = false;
game.paused = false;
game.gameOver = false;
game.timer = 0;

game.fadingIn = false;
game.fadingOut = false;
game.faded = true;

game.textFadingIn = false;
game.textFadingOut = false;
game.textFaded = true;

//========================== Display ==========================   ! Add below to setGameDimensions() (!Needs Work!)
game.windowWidth = game.isMobile ? doc.documentElement.clientWidth : parseInt($('#gamearea').css("width")); //using parseInt here to remove 'px'
game.windowHeight = doc.documentElement.clientHeight;
game.deltaSpeed = null; // game speed normalizer (mobile first / iPhone 4)

game.fullScreen = false;

//========================== Input ==========================
if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'crosshair';

game.mouseControls = true;
game.keyboardControls = false;

var inputArea = doc.getElementById("inputarea");
var inputAreaX, inputAreaY;
var mouseIsDown = 0;
var touchInitX = 0;
var touchInitY = 0;

game.canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
if (game.canVibrate && !("vibrate" in navigator)) navigator.vibrate = navigator.mozVibrate;

//========================== Audio ==========================
//Audio Support
var audioElementSupported = (function(d)
{
	var a = d.createElement("audio"),
	  o = {},
	  s = "audio\/";

	if (typeof a.canPlayType === "function") {
	    o.supported = Boolean(true);
	    o.mp3 = a.canPlayType(s + "mpeg");
	    o.wav = a.canPlayType(s + 'wav; codecs="1"');
	    o.ogg = a.canPlayType(s + 'ogg; codecs="vorbis"');
	    o.m4a = a.canPlayType(s + "x-m4a") || a.canPlayType(s + "aac");
	    o.webm = a.canPlayType(s + 'webm; codecs="vorbis"');
	} else {
	    o.supported = Boolean(0);
	}
	return o;
})(this.document);

if (audioElementSupported.m4a !== "")  //note: audioElementSupported.x is likely to return 'probably' or 'maybe' so you might want to do a thorough check
{
	fileFormat = ".m4a";
}
else if (audioElementSupported.ogg !== "")
{
	fileFormat = ".ogg";
}
else
{
	fileFormat = ".mp3";
}

//====================== Canvases + Responsiveness  ============================
game.canvas = doc.getElementById("gameCanvas");
game.context = game.canvas.getContext("2d");

function setGameDimensions()
{
	//SETTING CANVASES ATTRIBUTES
	//Note: the canvas dimensions need to be set here using attributes due to the nature of the canvas element: it works like an image and using css to set this will stretch it

	//get the gameArea and the canvases
	var gameArea = $('#gamearea');
	var allCanvas = $('canvas');

  game.windowWidth = game.isMobile ? doc.documentElement.clientWidth : parseInt($('#gamearea').css("width")); //using parseInt here to remove 'px'
  game.windowHeight = doc.documentElement.clientHeight;
  game.deltaSpeed = game.windowHeight >= 480 ? game.windowHeight/480 : 1; // game speed normalizer (mobile first / iPhone 4)
  game.deltaSpeed = game.windowHeight >= 720 ? 1.5 : game.deltaSpeed; // game speed limiter (high res devices)

	allCanvas.attr('width', game.windowWidth);
	allCanvas.attr('height', game.windowHeight);

	//SETTING GAME DIMENSIONS
  // game.isHighRes = game.height > 1080 ? true : false;
	game.width = Math.round(game.windowWidth); //needs high res limiter to avoid black game regions on high res devices
	game.height = Math.round(game.windowHeight);

	//outer borders
	game.outerLeft = -Math.round(game.width*0.1);
	game.outerRight = Math.round(game.width + game.width*0.1);
	game.outerTop = -Math.round(game.height*0.1);
	game.outerBottom = Math.round(game.height + game.height*0.1);

	//center coords
	game.centerX = Math.round(game.width/2);
	game.centerY = Math.round(game.height/2);

	if (playerShip && typeof playerShip != 'undefined')
	{
		//re-set playerShip's dimensions/boundaries
		// playerShip.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
		playerShip.limitX2 = Math.round(game.width - (playerShip.width*0.5));
		playerShip.limitY2 = Math.round(game.height - playerShip.height);
    playerShip.accel = game.height*0.0007;
    playerShip.speedLimit = Math.round(3*game.dt*game.deltaSpeed);
	}

  if (typeof gameBackground != 'undefined')
  {
    gameBackground.resize();
  }
  // !Add any vars defined on runtime dependant of game dimensions!

	//set game bosses' boundaries  !Need to give this enemy a name in the array
	// this.yStop = Math.round(game.height*0.1);
	// this.xBondary = Math.round(game.width - this.size/4);
}

setGameDimensions();

//====================== Local Storage ============================

if ("localStorage" in win && win.localStorage !== null) //checking browser support for local storage
{
	//NOTE: localStorage won't accept boolean values! so we need to 'convert' these

	//CONTROLS
	if (localStorage.keyboardControls === "true")
	{
		game.mouseControls = false;
		game.keyboardControls = true;
	}
	else
	{
		game.mouseControls = true;
		game.keyboardControls = false;
	}
}

sprite = function(image, columns, rows, animationSpeed)
{
	this.image = gameGfx.offCtx[image];
	this.width = this.image.width;
	this.height = this.image.height;
	this.totalFrames = columns * rows;
	this.frameWidth = this.width / columns;
	this.frameHeight = this.height / rows;
	this.startFrame = 0;
	this.endFrame = this.totalFrames - 1;	//will be used to create the animationSequence array
	this.frameSpeed = animationSpeed;
	this.ctx = game.context;
	this.animationSequence = [];	// array holding the order of the animation
	this.fpr = Math.floor(this.image.width / this.frameWidth);
	//create the sequence of frame numbers for the animation
	for (this.frameNum = this.startFrame; this.frameNum <= this.endFrame; this.frameNum++)
	{
		this.animationSequence.push(this.frameNum);
	}
};

sprite.prototype.currentFrame = 0;
sprite.prototype.counter = 0;

sprite.prototype.reset = function(image, columns, rows, animationSpeed)
{
	this.image = gameGfx.offCtx[image];
	this.width = this.image.width;
	this.height = this.image.height;
	this.totalFrames = columns * rows;
	this.frameWidth = this.width / columns;
	this.frameHeight = this.height / rows;
	this.startFrame = 0;
	this.endFrame = this.totalFrames - 1;	//will be used to create the animationSequence array
	this.frameSpeed = animationSpeed;
	this.animationSequence = [];  // array holding the order of the animation
	this.fpr = Math.floor(this.image.width / this.frameWidth);

	this.currentFrame = 0;
	this.counter = 0;

	// create the sequence of frame numbers for the animation
	for (this.frameNum = this.startFrame; this.frameNum <= this.endFrame; this.frameNum++)
	{
		this.animationSequence.push(this.frameNum);
	}
};

//draw full sprite animation method
sprite.prototype.draw = function(x, y)
{
	this.ctx.drawImage(
		this.image,
		this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
		this.frameWidth, this.frameHeight,
		x, y,
		this.frameWidth, this.frameHeight);

	// update to the next frame if it is time
	if (this.counter == (this.frameSpeed - 1))
	{
		this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
	}

	// update the counter
	this.counter = (this.counter + 1) % this.frameSpeed;

	this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
	this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);
};

//draw specific sprite frame method
sprite.prototype.drawFrame = function(x, y, frame)
{
	this.currentFrame =  frame % this.animationSequence.length;

	this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
	this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);

	this.ctx.drawImage(
		this.image,
		this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
		this.frameWidth, this.frameHeight,
		x, y,
		this.frameWidth, this.frameHeight);
};

background = function()
{
	this.image = gameGfx.offCtx['bg_level' + game.level];
	//main image properties
	this.image.sX = this.image.width <= game.width ? 0 : Math.ceil((this.image.width - game.width)/2);
	this.image.sY = this.image.height - game.height;
	this.image.sH = game.height;
	this.image.sW = game.width;
	this.image.dX = 0;
	this.image.dY = 0;
	this.image.dW = game.width;
	this.image.dH = game.height;
	//clone image properties
	this.image.TsX = this.image.sX;
	this.image.TsY = 1;
	this.image.TsW = this.image.sW;
	this.image.TsH = game.height;
	this.image.TdX = 0;
	this.image.TdY = 0;
	this.image.TdW = this.image.dW;
	this.image.TdH = game.height;

	this.speed = Math.floor(2*game.dt*game.deltaSpeed);
	this.ctx = game.context;
};

background.prototype.resize = function()
{
	this.image.sX = this.image.width <= game.width ? 0 : Math.ceil((this.image.width - game.width)/2);
	this.image.sW = game.width;
	this.image.dW = game.width;
	this.image.TsX = this.image.sX;
	this.image.TsW = this.image.sW;
	this.image.TdW = this.image.dW;

	if (background.prototype.update == background.prototype.roll)
	{
		this.image.sH = game.height;
		this.image.dH = game.height;
	}
	else
	{
		// rescale trans image properties
		this.image.TsH = game.height;
		this.image.TdH = game.height;
	}
};

background.prototype.drawImage = function()
{
	this.ctx.drawImage(this.image, this.image.sX, this.image.sY, this.image.sW, this.image.sH, this.image.dX, this.image.dY, this.image.dW, this.image.dH);
};

background.prototype.drawTransImage = function()
{
	this.ctx.drawImage(this.image, this.image.TsX, this.image.TsY, this.image.TsW, this.image.TsH, this.image.TdX, this.image.TdY, this.image.TdW, this.image.TdH);
};

background.prototype.transitionReset = function()
{
	this.image.TsY = this.image.sY + 1;
	this.image.TsH = this.image.sH;
	this.image.TdY = this.image.dY;
	this.image.TdH = this.image.dH;

	this.image.sY = this.image.height - 1;
	this.image.sH = 1;
	this.image.dY = 0;
	this.image.dH = 1;

	background.prototype.update = background.prototype.transition;
};

background.prototype.rollReset = function()
{
	this.image.dH = this.image.TdY;
	background.prototype.update = background.prototype.roll;
};

background.prototype.roll = function()
{
	this.image.sY -= this.speed;
	// this.image.sH -= this.speed; //cool light speed effect

	if (this.image.sY <= 1)
	{
		this.transitionReset();
		return;
	}

	this.drawImage();
};

background.prototype.transition = function()
{
	this.image.TsH -= this.speed;
	this.image.TdY += this.speed;
	this.image.TdH -= this.speed;

	this.image.sY -= this.speed;
	this.image.sH += this.speed;
	this.image.dH += this.speed;

	if (this.image.TsH <= 0)
	{
		this.rollReset();
		return;
	}

	this.drawTransImage();
	this.drawImage();
};

background.prototype.update = background.prototype.roll;

explosion = function (x, y, speed, direction, size)
{
	this.size = size;
	this.image = 'explosion_s' + this.size;

	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.sprite = new sprite(this.image, 5, 4, 2);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

explosion.prototype.reset = function(x, y, speed, direction, size)
{
	this.size = size;
	this.image = 'explosion_s' + this.size;
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.speed = speed;
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

explosion.prototype.playSfx = function()
{
	switch(this.size)
	{
		case 0:
			gameSfx.play('hit');
		break;
		case 4:
			gameSfx.play('blast');
		break;
		default:
			gameSfx.play('explosion');
	}
};

explosion.prototype.recycle = function()
{
	freeExplosion(this);
};

explosion.prototype.checkStatus = function()
{
	if (gameSfx.on && this.sprite.currentFrame === this.sprite.startFrame)
	{
		this.playSfx();
	}
	if (this.sprite.currentFrame >= this.sprite.endFrame)
	{
		this.recycle();
	}
};

explosion.prototype.setMovement = function()
{
	this.x += this.xThrust;
	this.y += this.yThrust;
};

explosion.prototype.update = function()
{
	this.checkStatus();
	this.setMovement();
	this.draw();
};

explosion.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

////////////
// Factory
////////////
function getNewExplosion(x, y, speed, direction, size)
{
  var e = null;
	// recycle
	e = game.explosionsPool.pop();
	e.reset(x, y, speed, direction, size);
	e.sprite.reset(e.image, 5, 4, 2);
	game.objects.push(e);
}

function freeExplosion(e)
{
	// find the active explosion and remove it
	game.objects.splice(game.objects.indexOf(e),1);
	// return the explosion back into the pool
	game.explosionsPool.push(e);
}

////////////////////////////
// Pre-load game explosions
////////////////////////////
function initExplosions()
{
	for (var ex = 1 ; ex <= game.requiredExplosions; ex++)
	{
		e = new explosion(null, null, null, null, 1, null);
		game.explosionsPool.push(e);
		game.doneObjects++;
	}
}

player = function(hull, fireRate)
{
	self = this;
	this.fireRate = fireRate;
	this.hull = hull;
	this.maxHull = hull;
	this.sprite = new sprite('player_ship', 5, 3, 5);
	this.sprite_i = new sprite('player_ship_i', 5, 3, 5);
	this.sprite_s = new sprite('player_shields', 3, 2, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.centerX = Math.round(this.width*0.5);
	this.centerRightX = Math.round(this.width*0.75);
	this.centerLeftX = Math.round(this.width*0.25);
	this.centerY = Math.round(this.height*0.5);
	this.tipY = Math.round(this.height*0.2);
	this.limitX1 = Math.round(-this.width*0.5);
	this.limitX2 = Math.round(game.width - this.width*0.5);
	this.limitY1 = 0;
	this.limitY2 = Math.round(game.height - this.height);
};

player.prototype.x = Math.round(game.width*0.46);
player.prototype.y = Math.round(game.height*0.90);
player.prototype.ctx = game.context;
player.prototype.speed = 0;
player.prototype.speedX = 0;
player.prototype.speedY = 0;
player.prototype.spriteLeftFrames = [0,0,1,2,3,4,4,4,4,4,4]; // the 1st array item is dummy(never called) array size needs to equal max possible speed + 1 (dummy)
player.prototype.spriteRightFrames = [5,5,6,7,8,9,9,9,9,9,9]; // the 1st array item is dummy(never called) array size needs to equal max possible speed + 1 (dummy)
player.prototype.hit = false;
player.prototype.imune = false;
player.prototype.imuneTimer = -5;
player.prototype.imuneTicks = 0;
player.prototype.deadTimer = 0;
player.prototype.lives = X_Lives;
player.prototype.accel = game.height*0.0007;
player.prototype.speedLimit = Math.round(5*game.dt*game.deltaSpeed);
player.prototype.fireTimer = 1;
player.prototype.laserLevel = 1;
player.prototype.missileLevel = 0;

player.prototype.reset = function()
{
	this.lives = game.gameOver ? X_Lives : this.lives;
	game.gameOver = false;
	this.imune = true;
	this.imuneTimer = -5;
	this.hull = 10;
	this.deadTimer = 0;
	this.speed = 0;
	this.hit = false;
	this.spriteFrame = 10;
	this.x = Math.round(game.centerX - this.centerX);
	this.y = Math.round(game.height - this.height);
	this.friction = 0;
	this.laserLevel = 1;
	this.missileLevel = 0;
	gameUI.updateEnergy();
	player.prototype.update = player.prototype.aliveUpdate;
};

player.prototype.mouseControls = function()
{
	if (mouseIsDown)
	{
		this.fireGuns();

		this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)*game.deltaSpeed);
		this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)*game.deltaSpeed);

		//this needs to come after movement vars above because we redefine this.speedX here
		this.speedX = this.speedX < this.speedLimit ? this.speedX : this.speedLimit;
		this.speedY = this.speedY < this.speedLimit ? this.speedY : this.speedLimit;
		this.speedX = this.speedX > -this.speedLimit ? this.speedX : -this.speedLimit;
		this.speedY = this.speedY > -this.speedLimit ? this.speedY : -this.speedLimit;
	}
	else
	{
		if (this.speedX !== 0)
		{
			this.speedX = this.speedX > 0 ? Math.floor(this.speedX - this.accel) : Math.ceil(this.speedX + this.accel);		// !Should be decel!*
		}

		if (this.speedY !== 0)
		{
			this.speedY = this.speedY > 0 ? Math.floor(this.speedY - this.accel) : Math.ceil(this.speedY + this.accel);		// !Should be decel!*
		}
	}
};

player.prototype.keyboardControls = function()	// !accel/speedLimit needs tweaking!*
{
	if (game.keys[32])
	{
		this.fireGuns();
	}

	if ((game.keys[37] || game.keys[39] || game.keys[38] || game.keys[40]))
	{
		if(game.keys[37]) //left
		{
			this.speedX = this.speedX < this.speedLimit ? Math.round(this.speedX + this.accel) : Math.round(this.speedLimit);
		}
		if(game.keys[39]) //right
		{
			this.speedX = this.speedX > -this.speedLimit ? Math.round(this.speedX - this.accel) : Math.round(-this.speedLimit);
		}
		if(game.keys[38]) //up
		{
			this.speedY = this.speedY < this.speedLimit ? Math.round(this.speedY + this.accel) : Math.round(this.speedLimit);
		}
		if(game.keys[40]) //down
		{
			this.speedY = this.speedY > -this.speedLimit ? Math.round(this.speedY - this.accel) : Math.round(-this.speedLimit);
		}
	}
	else
	{
		if (this.speedX !== 0)
		{
			this.speedX = this.speedX > 0 ? Math.floor(this.speedX - this.accel) : Math.ceil(this.speedX + this.accel);
		}

		if (this.speedY !== 0)
		{
			this.speedY = this.speedY > 0 ? Math.floor(this.speedY - this.accel) : Math.ceil(this.speedY + this.accel);
		}
	}
};

player.prototype.setControls = game.mouseControls ? player.prototype.mouseControls : player.prototype.keyboardControls;

player.prototype.setThrust = function()
{
	this.x -= this.speedX;
	this.y -= this.speedY;
};

player.prototype.setBoundaries = function()
{
	//the bondaries and edge portals
	if (this.x < this.limitX1)
	{
	 this.x = this.limitX2;
	}
	else if (this.x > this.limitX2)
	{
	 this.x = this.limitX1;
	}
	else if (this.y < this.limitY1)
	{
	 this.y = this.limitY1 - this.speedY;
	}
	else if (this.y > this.limitY2)
	{
	 this.y = this.limitY2 - this.speedY;
	}
};

player.prototype.fireLasers = function(level)
{
	switch (level)
	{
		case 3:
			this.midLaserX = Math.round(this.x + this.centerX);
			this.leftLaserX = Math.round(this.x + this.centerLeftX);
			this.rightLaserX = Math.round(this.x + this.centerRightX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.leftLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.midLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.rightLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			break;
		case 2:
			this.leftLaserX = Math.round(this.x + this.centerLeftX);
			this.rightLaserX = Math.round(this.x + this.centerRightX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.leftLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.rightLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			break;
		default:
			this.midLaserX = Math.round(this.x + this.centerX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.midLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
	}
	if(gameSfx.on) gameSfx.play('laser');
};

player.prototype.fireMissiles = function(level)
{
	switch (level)
	{
		case 3:
			this.midMissileX = Math.round(this.x + this.centerX);
			this.leftMissileX = Math.round(this.x);
			this.rightMissileX = Math.round(this.x + this.width);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.leftMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.midMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.rightMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		case 2:
			this.leftMissileX = Math.round(this.x);
			this.rightMissileX = Math.round(this.x + this.width);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.leftMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.rightMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		case 1:
			this.midMissileX = Math.round(this.x + this.centerX);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.midMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		default:
	}
};

player.prototype.fireGuns = function()
{
	//only add a bullet if enough time has passed i.e. our timer has reached 0
	this.fireTimer++;

	if (this.fireTimer % this.fireRate === 0)
	{
		this.fireLasers(this.laserLevel);
		this.fireMissiles(this.missileLevel);
	}
};

player.prototype.setImunity = function()
{
	this.imuneTimer++;

	if (this.imuneTimer > 15)
	{
		this.imuneTicks++;
		this.imuneTimer = -5;
	}

	if (this.imuneTicks > 8)
	{
		this.imune = false;
		this.imuneTicks = 0;
	}
};

player.prototype.checkImunity = function()
{
	if (this.imune)
	{
		this.setImunity();
	}
};

player.prototype.detectCollision = function()
{
	if (this.hit)
	{
		if (this.sprite_s.currentFrame < 1) vibrateDevice(30);

		this.drawShields();

		if (this.sprite_s.currentFrame >= this.sprite_s.endFrame)
		{
			this.hit = false;
			this.sprite_s.counter = 0;
			this.sprite_s.currentFrame = 0;
		}
	}
};

player.prototype.checkHull = function()
{
	if (this.hull <= 0 && !this.imune)
	{
		this.lives -= 1;
		getNewExplosion(this.x-this.width, this.y-this.centerY, 0, 0, 4); //need to obtain player direction if we want dinamic explosions, for now we just blow it still
		player.prototype.update = player.prototype.die;
		gameUI.updateHangar();
		this.imune = true; //avoids collision while dead
	}
};

player.prototype.die = function()
{
	if (this.deadTimer <= 100)
	{
		//keeping the player outside canvas while dead
		this.x = game.centerX;
		this.y = game.outerBottom;

		//waiting a few ms before any action
		this.deadTimer++;

		if (this.deadTimer > 100 && this.lives > 0)
		{
			this.reset();
		}
		else if (this.deadTimer > 100 && this.lives === 0 && !game.gameOver)
		{
			mouseIsDown = 0;
			game.keys[13] = false;
			this.deadTimer = 0;
			game.gameOver = true;
			gameState.gameOver();
		}
	}
};

player.prototype.levelComplete = function()
{
	game.levelUpTimer++;

	if (game.levelUpTimer < 100) //waiting a few ms before engaging warp speed
	{
		this.setControls();
		this.setThrust();
		this.setBoundaries();
		this.checkImunity();
		this.detectCollision();
		this.checkHull();
	}
	else if (game.levelUpTimer > 100)
	{
		this.spriteFrame = 10;
		this.speedX = 0;
		this.speedY = 0;
		this.speed = Math.round(this.speedLimit*2);
		this.y -= this.speed;
	}
	else // game.levelUpTimer === 100
	{
		game.levelComplete = true;
		gameState.lvlComplete();
		mouseIsDown = 0;
	}
};

player.prototype.getSpriteFrame = function()
{
	if (this.speedX > 0)
	{
		this.spriteFrame = this.spriteLeftFrames[this.speedX];
	}
	else if (this.speedX < 0)
	{
		this.spriteFrame = this.spriteRightFrames[-this.speedX];
	}
	else
	{
		this.spriteFrame = 10;
	}
};

player.prototype.drawShields = function()
{
	this.sprite_s.draw(this.x - this.width*0.7, this.y - this.height*0.1);
};

player.prototype.draw = function()
{
	this.getSpriteFrame();

	if (!this.imune)
	{
		this.sprite.drawFrame(this.x, this.y, this.spriteFrame);
	}
	else if (this.imuneTimer > 0)
	{
		this.sprite_i.drawFrame(this.x, this.y, this.spriteFrame);
	}
};

player.prototype.aliveUpdate = function()
{
	this.setControls();
	this.setThrust();
	this.setBoundaries();
	this.checkImunity();
	this.detectCollision();
	this.checkHull();
	this.draw();
};

player.prototype.levelCompleteUpdate = function()
{
	this.levelComplete();
	this.draw();
};

player.prototype.update = player.prototype.aliveUpdate;

var playerShip = null;

playerBullet = function(x, y, speed, power, friction, image)
{
	this.sprite = new sprite(image, 3, 1, 4);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = -Math.PI/2;
	this.power = power;
	this.friction = friction;
	//setting these to make friction work with deltaTime (dt), check particle.js
	this.vy = Math.sin(this.direction) * this.speed;
	this.yThrust = Math.round(this.vy *= this.friction);
};

playerBullet.prototype.ctx = game.context;

playerBullet.prototype.reset = function(x, y, speed, power, friction)  //only variable arguments here
{
	//reseting variable properties only (lasers != missiles)
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.power = power;
	this.friction = friction;
	this.vy = Math.sin(this.direction) * this.speed;
	this.yThrust = Math.round(this.vy *= this.friction);
};

playerBullet.prototype.recycle = function()
{
	freeBullet(this);
};

playerBullet.prototype.checkCollision = function()
{
	var en = game.enemies.length;
	while (en--)
	{
		if (Collision(game.enemies[en], this))
		{
			game.enemies[en].hull -= this.power;
			if(game.enemies[en].hull > 0)
			{
				getNewExplosion(game.enemies[en].x + game.enemies[en].centerX, game.enemies[en].y + game.enemies[en].centerY, 0, 1, 0);
			}

			this.recycle();
		}
	}
};

playerBullet.prototype.setBoundaries = function()
{
	if (this.y < game.outerTop) //always goes up
	{
		this.recycle();
	}
};

playerBullet.prototype.setMovement = function()
{
	// just goes up
	this.y += Math.round(this.vy *= this.friction);
};


playerBullet.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

playerBullet.prototype.update = function()
{
	this.checkCollision();
	this.setBoundaries();
	this.setMovement();
	this.draw();
};


////////////
// Factory
////////////
getNewBullet = function(x, y, speed, power, friction, image)
{
	var b = null;
	//recycle
	b = game.playerBulletsPool.pop();
	//(image, columns, rows, animationSpeed)
	b.sprite.reset(image, 3, 1, 4);
  b.reset(x, y, speed, power, friction);
	game.objects.push(b);
};

freeBullet = function(b)
{
	//find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(b),1);
	//return the bullet back into the pool
	game.playerBulletsPool.push(b);
};

////////////////////////////////
// Pre-load game player bullets
////////////////////////////////
initPlayerBullets = function ()
{
	for (var pb = 1 ; pb <= game.requiredPlayerBullets; pb++)
	{
		b = new playerBullet(null, null, null, null, null, 'bullet_p_laser');
		game.playerBulletsPool.push(b);
		game.doneObjects++;
	}
};

enemy = function(x, y, speed, direction, hull, image, fireRate)
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = gameGfx.offCtx[image].width;
	this.height = gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);	//these are for explosions, see playerBullet's checkCollision()
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.bullet = {};
	this.bullet.x = null;
	this.bullet.y = null;
	this.fireRate = fireRate * 60; //fireRate = delay in seconds

	// this.vx = Math.cos(this.direction) * (this.speed);
	// this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

// note: properties/objects declared as prototype won't have access to private data added in the main prototype function i.e. this.hull)
enemy.prototype.bulletTimer = 1;
enemy.prototype.hitTimer = 0;
enemy.prototype.collided = false;
enemy.prototype.ctx = game.context;

enemy.prototype.reset = function(x, y, speed, direction, hull, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = this instanceof enemyBase ? this.sprite.frameWidth : gameGfx.offCtx[image].width;
	this.height = this instanceof enemyBase ? this.sprite.frameHeight : gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.fireRate = fireRate * 60;
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;

	// this.vx = Math.cos(this.direction) * (this.speed);
	// this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

enemy.prototype.setMovement = function()
{
	// this.x += this.xThrust;
	this.y += this.yThrust;
};

enemy.prototype.die = function()
{
	getNewExplosion(this.x, this.y, this.speed/2, this.direction, this.explosionSize);

	lootchance = Math.random();
	if (lootchance < 0.4)
	{
		getNewLoot(this.x, this.y);
	}

	if (!playerShip.crashed)
	{
		game.score++;
		game.levelScore++;
		gameUI.updateScore();
	}

	this.recycle();
};

enemy.prototype.checkHull = function()
{
	if (this.hull <= 0)
	{
		this.die();
	}
};

enemy.prototype.checkCollision = function()
{
	if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
	{
		getNewExplosion(playerShip.x, playerShip.y, 0, 1, 1, 'chasis');	//get new explosion sound for hiting player
		playerShip.hull -= this.hull;
		gameUI.updateEnergy();
		playerShip.hit = true;
		this.hull -= playerShip.hull;
	}
};

enemy.prototype.setBoundaries = function()
{
	if (this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
	{
		this.recycle();
	}
};

enemy.prototype.setGuns = function()
{
	if (this.fireRate !== 0)
	{
		this.bulletTimer++;
		if (this.bulletTimer % this.fireRate === 0)
		{
			this.fireMissile();
		}
	}
};

enemy.prototype.fireMissile = function()
{
	this.bullet.x = this.x + this.centerX;
	this.bullet.y = this.y + this.height;
	getNewEnemyBullet(this.bullet.x, this.bullet.y, 1, utils.angleTo(this.bullet, playerShip), 1, 'bullet_e_missile');
};

enemy.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

enemy.prototype.update = function()
{
	this.checkCollision();
	this.setMovement();
	this.setBoundaries();
	this.setGuns();
	this.checkHull();
	this.draw();
};

enemyMinion = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);

	// change prop names, confusing
	this.waveAmp = 1*game.deltaSpeed;
	this.wavePeriod = 0.06/game.deltaSpeed;

	if (this.direction === Math.PI/2)
	{
		this.vy = Math.sin(this.direction) * (this.speed);
		this.yThrust = Math.round(this.vy); // always goes down at the same speed
		this.setMovement = enemyMinion.prototype.setMovementV;
	}
	else
	{
		this.vx = Math.cos(this.direction) * (this.speed);
		this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
		this.setMovement = enemyMinion.prototype.setMovementH;
	}
};
enemyMinion.prototype = Object.create(enemy.prototype);
enemyMinion.prototype.constructor = enemyMinion;

enemyMinion.prototype.explosionSize = 2;

enemyMinion.prototype.reset = function(x, y, speed, direction, hull, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = gameGfx.offCtx[image].width;
	this.height = gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.fireRate = fireRate * 60;
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;

	this.waveAmp = 1*game.deltaSpeed;
	this.wavePeriod = 0.06/game.deltaSpeed;

	if (this.direction === Math.PI/2)
	{
		this.vy = Math.sin(this.direction) * (this.speed);
		this.yThrust = Math.round(this.vy); // always goes down at the same speed
		this.setMovement = enemyMinion.prototype.setMovementV;
	}
	else
	{
		this.vx = Math.cos(this.direction) * (this.speed);
		this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
		this.setMovement = enemyMinion.prototype.setMovementH;
	}
};

enemyMinion.prototype.getWaveMovementH = function(x)
{
	return this.waveAmp*Math.sin(this.wavePeriod*x);
};

enemyMinion.prototype.getWaveMovementV = function(y)
{
	return this.waveAmp*Math.cos(this.wavePeriod*y);
};

enemyMinion.prototype.setMovementH = function()
{
	this.x += this.xThrust;
	this.y += this.getWaveMovementH(this.x); // += vy
};

enemyMinion.prototype.setMovementV = function()
{
	this.y += this.yThrust; // always goes down
	this.x += this.getWaveMovementV(this.y);
};

enemyMinion.prototype.recycle = function()
{
	freeEnemyMinion(this);
};

////////////
// Factory
////////////
function getNewEnemyMinion(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.minionsPool.pop();
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyMinion(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.minionsPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyMinions()
{
	for (var e = 1 ; e <= game.requiredMinions; e++)
	{
		en = new enemyMinion(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.minionsPool.push(en);
		game.doneObjects++;
	}
}

enemyMiniBoss = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);
};
enemyMiniBoss.prototype = Object.create(enemy.prototype);
enemyMiniBoss.prototype.constructor = enemyMiniBoss;

enemyMiniBoss.prototype.explosionSize = 3;

enemyMiniBoss.prototype.recycle = function()
{
	freeEnemyMiniBoss(this);
};

////////////
// Factory
////////////
function getNewEnemyMiniBoss(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.miniBossPool.pop();
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyMiniBoss(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.miniBossPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyMiniBosses()
{
	for (var e = 1 ; e <= game.requiredMiniBosses; e++)
	{
		en = new enemyMiniBoss(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.miniBossPool.push(en);
		game.doneObjects++;
	}
}

enemyBase = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);

	this.sprite = new sprite(image, 6, 5, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
};
enemyBase.prototype = Object.create(enemy.prototype);
enemyBase.prototype.constructor = enemyBase;

enemyBase.prototype.explosionSize = 4;

enemyBase.prototype.recycle = function()
{
	freeEnemyBase(this);
};

enemyBase.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

////////////
// Factory
////////////
function getNewEnemyBase(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.enemyBasePool.pop();
	en.sprite.reset(image, 6, 5, 6);
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyBase(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.enemyBasePool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyBases()
{
	for (var e = 1 ; e <= game.requiredEnemyBases; e++)
	{
		en = new enemyBase(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.enemyBasePool.push(en);
		game.doneObjects++;
	}
}

enemyWave = function(side, pos, race, fleetSize, speed, hull, fireRate)
{
	this.side = side;
	this.spawnedShips = 0;
	this.race = race;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.fireRate = fireRate;
	this.spawnTimer = 1;
	this.spawnRate = 6*this.speed; // distance between spawns (px);
	switch (this.side)
	{
		case 'top':
			this.x = Math.round(pos);
			this.y = game.outerTop;
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = game.outerLeft;
			this.y = Math.round(pos);
			this.direction = 0;
			break;
		case 'right':
			this.x = game.outerRight;
			this.y = Math.round(pos);
			this.direction = Math.PI;
			break;
	}
};

enemyWave.prototype.recycle = function()
{
	freeEnemyWave(this);
};

enemyWave.prototype.update = function()
{
		this.spawnTimer++;

		if (this.spawnTimer % this.spawnRate === 0)
		{
				this.spawnFireRate = Math.round(utils.randomRange(this.fireRate, this.fireRate*2)); //a randomRange so that each ship has it's own fireRate
				getNewEnemyMinion(this.x, this.y, this.speed, this.direction, this.hull, this.race, this.spawnFireRate);
				this.spawnedShips++;
		}

		if (this.spawnedShips == this.fleetSize)
		{
			this.recycle();
		}
};

////////////
// Factory
////////////
function getNewEnemyWave(side, pos, race, fleetSize, speed, hull, fireRate)
{
  var ew = null;

	//recycle
  ew = game.wavesPool.pop();
  ew.side = side;
	ew.spawnedShips = 0;
	ew.race = race;
	ew.fleetSize = fleetSize;
	ew.speed = speed;
	ew.hull = hull;
	ew.fireRate = fireRate;
	ew.spawnTimer = 1;
	ew.spawnRate = 6*ew.speed;
	switch (ew.side)
	{
		case 'top':
			ew.x = Math.round(pos);
			ew.y = game.outerTop;
			ew.direction = Math.PI/2;
		break;
		case 'left':
			ew.x = game.outerLeft;
			ew.y = Math.round(pos);
			ew.direction = 0;
		break;
		case 'right':
			ew.x = game.outerRight;
			ew.y = Math.round(pos);
			ew.direction = Math.PI;
		break;
	}
	game.objects.push(ew);
}

function freeEnemyWave(ew)
{
	// find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(ew),1);
	// return the bullet back into the pool
	game.wavesPool.push(ew);
}

///////////////////////
// Pre-load game waves
///////////////////////
function initWaves()
{
	for (var w = 1 ; w <= game.requiredWaves; w++)
	{
		ew = new enemyWave(null, null, 'enemy_sectoid', 'pawn', 0, 0, 0, 0);
		game.wavesPool.push(ew);
		game.doneObjects++;
	}
}

boss = function(x, y, speed, direction, hull, image)
{
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.image = gameGfx.offCtx[image];
	this.width = gameGfx.offCtx[image].width;
	this.height = gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);	//these are for explosions, see playerBullet's checkCollision()
	this.centerY = Math.round(this.height*0.5);
	this.hCenter = Math.round(this.width/2);
	this.x = Math.round(game.centerX - this.hCenter);

	this.xBondary = Math.round(game.width - this.width);
	this.ctx = game.context;
};
boss.prototype.y = game.outerTop;
boss.prototype.yStop = Math.round(game.height*0.05);
boss.prototype.audioHit1 = 'hit' + fileFormat;
boss.prototype.audioHit2 = 'hit2' + fileFormat;
boss.prototype.audioHit3 = 'hit3' + fileFormat;
boss.prototype.deadTimer = 0;
boss.prototype.lasersTimer = 1;
boss.prototype.missilesTimer = 1;
boss.prototype.lasersFireRate = null;
boss.prototype.missilesFireRate = null;

boss.prototype.reset = function(x, y, hull) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.hull = hull;
};

boss.prototype.detectCollision = function()
{
	// player-boss collision
	if (Collision(playerShip, this) && !playerShip.imune && !game.gameOver)
	{
		playerShip.hull -= this.hull;
		playerShip.hit = true;
		this.hull -= playerShip.hull;
	}
};

boss.prototype.die = function()
{
	getNewExplosion(this.x, this.y, this.speed/2, this.direction, 4);

	if (!playerShip.crashed)
	{
		game.score++;
		game.levelScore++;
		gameUI.updateScore();
		if (gameMusic.on) gameMusic.lvlComplete();
	}

	player.prototype.update = player.prototype.levelCompleteUpdate;

	this.recycle();
};

boss.prototype.checkHull = function()
{
	if (this.hull <= 0 )
	{
		this.die();
	}
};

boss.prototype.setGuns = function()
{
	this.lasersTimer++;
	this.missilesTimer++;

	if (this.lasersTimer % this.lasersFireRate === 0)
	{
		this.fireLasers();
	}

	if (this.missilesTimer % this.missilesFireRate === 0)
	{
		this.fireMissiles();
	}
};

boss.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

boss.prototype.aliveUpdate = function()
{
	this.setMovement();
	this.setGuns();
	this.detectCollision();
	this.checkHull();
	this.draw();
};

boss.prototype.update = boss.prototype.aliveUpdate;


/////////////////////////
// Pre-load game bosses
/////////////////////////
function initBosses()
{
	for (var b = 1 ; b <= game.requiredBosses; b++)
	{
		var firstBoss = new sectoidBoss(game.width*0.40, game.outerTop, 1, Math.PI/2, 100, 'boss_sectoid');
		game.bossesPool.push(firstBoss);
		game.doneObjects++;
	}
}

sectoidBoss = function(x, y, speed, direction, hull, image)
{
	boss.call(this, x, y, speed, direction, hull, image);

	this.laser1 = {};
	this.laser2 = {};
	this.laser1.y = Math.round(this.yStop + this.height);
	this.laser2.y = this.laser1.y;
	this.laser1.offSetX = Math.round(this.width*0.4);
	this.laser2.offSetX = Math.round(this.width*0.6);
	this.missile1 = {};
	this.missile2 = {};
	this.missile1.y = Math.round(this.yStop + this.height*0.5);
	this.missile2.y = this.missile1.y;
};
sectoidBoss.prototype = Object.create(boss.prototype);
sectoidBoss.prototype.constructor = sectoidBoss;

sectoidBoss.prototype.lasersFireRate = 40;
sectoidBoss.prototype.missilesFireRate = 120;

sectoidBoss.prototype.fireLasers = function()
{
	this.laser1.x = Math.round(this.x + this.laser1.offSetX);
	this.laser2.x = Math.round(this.x + this.laser2.offSetX);
	getNewEnemyBullet(this.laser1.x, this.laser1.y, 4, Math.PI/2, 1.5, 'bullet_p_laser');
	getNewEnemyBullet(this.laser2.x, this.laser2.y, 4, Math.PI/2, 1.5, 'bullet_p_laser');
};

sectoidBoss.prototype.fireMissiles = function()
{
	this.missile1.x = this.x;
	this.missile2.x = this.x + this.width;
	getNewEnemyBullet(this.missile1.x, this.missile1.y, 1, utils.angleTo(this.missile1, playerShip), 1, 'bullet_e_missile');
	getNewEnemyBullet(this.missile2.x, this.missile1.y, 1, utils.angleTo(this.missile2, playerShip), 1, 'bullet_e_missile');
};

sectoidBoss.prototype.introMovement = function()
{
	this.direction = Math.PI/2;
	this.vy = Math.sin(this.direction) * this.speed;
	this.x = this.x;
	this.y += Math.round(this.vy);

	if (this.y >= this.yStop)
	{
		sectoidBoss.prototype.setMovement = sectoidBoss.prototype.fightMovement;
	}
};

sectoidBoss.prototype.setMovement = sectoidBoss.prototype.introMovement;

sectoidBoss.prototype.fightMovement = function()
{
	this.vx = Math.cos(this.direction) * this.speed;
	if (this.x + this.hCenter < (playerShip.x + playerShip.centerX) - this.vx)
	{
		this.direction = 0;
		this.x += Math.round(this.vx);
	}
	else if (this.x + this.hCenter > (playerShip.x + playerShip.centerX) + this.vx)
	{
		this.direction = Math.PI;
		this.x += Math.round(this.vx);
	}
	else if (this.x + this.hCenter == playerShip.x + playerShip.centerX)
	{
		this.x = this.x;
	}
};

sectoidBoss.prototype.recycle = function()
{
	sectoidBoss.prototype.setMovement = sectoidBoss.prototype.introMovement;
	freeSectoidBoss(this);
};

////////////
// Factory
////////////
function getNewSectoidBoss()
{
	var boss = null;

	boss = game.bossesPool[0]; //get the specific boss
	boss.reset(game.width*0.40, game.outerTop, 100);
	game.enemies.push(boss);
	game.bossUp = true;

	game.bossesPool.splice(0, 1); //remove it from the pool while it's active
}

function freeSectoidBoss(boss)
{
	//find the active boss and remove it
	game.enemies.splice(game.enemies.indexOf(boss), 1);
	//return the boss back into the pool
	game.bossesPool.splice(0, 0, boss); //return at specific index (0)
	game.bossDead = true;
	game.bossUp = false;
}

enemyBullet = function(x, y, speed, direction, power, image)
{
	this.sprite = new sprite(image, 3, 1, 5);
	this.x = x;
	this.y = y;
	this.power = power;
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;

	this.vx = Math.cos(this.direction) * this.speed;
	this.vy = Math.sin(this.direction) * this.speed;

	this.spriteX = -Math.round(this.width*0.5);  //-this.width/2 because we're rotating ctx
	this.spriteY = -Math.round(this.height*0.5);  //-this.height/2 because we're rotating ctx
};
enemyBullet.prototype.friction = 1.02;
enemyBullet.prototype.ctx = game.context;

enemyBullet.prototype.reset = function(x, y, speed, direction, power)
{
	this.x = x;
	this.y = y;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.power = power;
	this.vx = Math.cos(this.direction) * this.speed;
	this.vy = Math.sin(this.direction) * this.speed;
};

enemyBullet.prototype.recycle = function()
{
	freeEnemyBullet(this);
};

enemyBullet.prototype.checkCollision = function()
{
	if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
	{
		getNewExplosion(this.x, this.y, 0, 1, 0);
		playerShip.hull -= this.power;
		gameUI.updateEnergy();
		playerShip.hit = true;

		this.recycle();
	}
};

enemyBullet.prototype.setBoundaries = function()
{
	if (this.x > game.outerRight ||
		 this.x < game.outerLeft ||
		 this.y > game.outerBottom ||
		 this.y < game.outerTop)
	{
		this.recycle();
	}
};

enemyBullet.prototype.setMovement = function()
{
	this.x += this.vx *= this.friction;
	this.y += this.vy *= this.friction;
};

enemyBullet.prototype.draw = function()	//fix this with sprites with diferent angles
{
	this.ctx.save();
	this.ctx.translate(this.x, this.y);
	this.ctx.rotate(this.direction - Math.PI/2);

	this.sprite.draw(this.spriteX, this.spriteY);

	this.ctx.restore();
};

enemyBullet.prototype.update = function()
{
	this.checkCollision();
	this.setBoundaries();
	this.setMovement();
	this.draw();
};

////////////
// Factory
////////////
getNewEnemyBullet = function(x, y, speed, direction, power, image)
{
  var eb = null;
	//recycle
	eb = game.enemyBulletsPool.pop();
	eb.sprite.reset(image, 3, 1, 4);
	eb.reset(x, y, speed, direction, power);

	game.objects.push(eb);
};

freeEnemyBullet = function(eb)
{
	// find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(eb),1);
	// return the bullet back into the pool
	game.enemyBulletsPool.push(eb);
};

////////////////////////////////
// Pre-load game enemy bullets
////////////////////////////////
function initEnemyBullets()
{
	for (var ebul = 1 ; ebul <= game.requiredEnemyBullets; ebul++)
	{
		eb = new enemyBullet(null, null, null, null, null, 'bullet_e_missile');
		game.enemyBulletsPool.push(eb);
		game.doneObjects++;
	}
}

loot = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = gameGfx.offCtx[this.type];
	this.width = this.image.width;
	this.height = this.image.height;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};
// note: prototype properties are set at run time, the constructor properties/methods are set upon object creation
loot.prototype.speed = Math.round(1*game.dt*game.deltaSpeed);
loot.prototype.direction = Math.PI/2;
loot.prototype.drops = ['loot_shields', 'loot_lasers', 'loot_missiles'];
loot.prototype.ctx = game.context;

loot.prototype.reset = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = gameGfx.offCtx[this.type];

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

loot.prototype.recycle = function()
{
	freeLoot(this);
};

loot.prototype.reward = function()
{
	switch(this.type)
	{
		case 'loot_shields':
			playerShip.hull = playerShip.hull <= 7.5 ? playerShip.hull + 2.5 : playerShip.hull = 10;
			gameUI.updateEnergy();
		break;
		case 'loot_lasers':
			playerShip.laserLevel = playerShip.laserLevel < 3 ? playerShip.laserLevel + 1 : playerShip.laserLevel;
		break;
		case 'loot_missiles':
			playerShip.missileLevel = playerShip.missileLevel < 3 ? playerShip.missileLevel + 1 : playerShip.missileLevel;
		break;
	}
};

loot.prototype.setMovement = function()
{
	this.x += this.xThrust;
	this.y += this.yThrust;
};

loot.prototype.setBoundaries = function()
{
	if (this.y > game.outerBottom) //always goes down
	{
		this.recycle();
	}
};

loot.prototype.checkCollision = function()
{
	if (Collision(this, playerShip))
	{
		this.reward();
		this.recycle();
		
		if(gameSfx.on) gameSfx.play('loot_powerUp');
	}
};

loot.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

loot.prototype.update = function()
{
	this.checkCollision();
	this.setMovement();
	this.setBoundaries();
	this.draw();
};

////////////
// Factory
////////////
function getNewLoot(x, y)
{
	var l = null;

	//recycle
	l = game.lootPool.pop();
	l.reset(x, y);
	game.objects.push(l);
}

function freeLoot(l)
{
	// find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(l),1);
	// return the bullet back into the pool
	game.lootPool.push(l);
}

///////////////////////
// Pre-load game loot
///////////////////////
function initLoot ()
{
	for (var loo = 1 ; loo <= game.requiredLoot; loo++)
	{
		l = new loot(null, null);
		game.lootPool.push(l);
		game.doneObjects++;
	}
}

text = function(header1, header2, inputRequired)
{
	this.h1Text = header1;
	this.h2Text = header2;
	this.textInput = inputRequired;

	this.init();
};

text.prototype.h1 = $('#h1'); //remove jquery here
text.prototype.h2 = $('#h2');
text.prototype.h3 = $('#h3');

if (game.isMobile)
{
	text.prototype.h3Text = 'Tap screen to continue';
}
else if (game.mouseControls)
{
	text.prototype.h3Text = 'Click to continue';
}
else if (game.keyboardControls)
{
	text.prototype.h3Text = 'Press any key to continue';	
}

text.prototype.allText = $('.all-text');
text.prototype.effectDuration = 2000;

text.prototype.switch = function(trigger)
{
	switch (trigger)
	{
		case 'on':
			this.allText.show();
			game.textFaded = false;
		break;
		case 'off':
			this.allText.stop(true, true);
			this.allText.hide();
			game.textFaded = true;
		break;
	}
};

text.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		case 'in':
			game.textFadingIn = true;
			this.allText.fadeIn(this.effectDuration, function(){
				game.textFadingIn = false;
				game.textFaded = false;
			});
		break;
		case 'out':
			var self = this;
			game.textFadingOut = true;
			this.allText.fadeOut(this.effectDuration, function(){
				self.h1.text('');
				self.h2.text('');
				self.h3.text('');
				game.textFadingOut = false;
				game.textFaded = true;
			});
		break;
	}
};

text.prototype.init = function()
{
	this.h1.text(this.h1Text);
	this.h2.text(this.h2Text);
	if (this.textInput){this.h3.text(this.h3Text);}else{this.h3.text('');}
};

gameText = new text(); //To be removed!

ui = function()
{
	this.loadingBar = $('#loadingBar');
	this.loadingBarWidth = 0;
	this.loadingBarFiller = $('#loadingBarFiller');
	this.loadingText = new text('Loading Images.. ', '', false);
	
	this.uiAll = $('#ui');
	this.uiLevel = doc.getElementById("uiLevel");
	this.uiScore = doc.getElementById("uiScore");
	this.uiEBar = doc.getElementById("uiEBar");
	this.uiHangar = doc.getElementById("uiHangarList");
	this.effectDuration = 800;
	
	this.loadingBarInit();
};

ui.prototype.loadingBarInit = function()
{
	this.loadingText.switch('on');
	this.loadingBar.show();
};

ui.prototype.loadingBarClose = function()
{
	this.loadingText.switch('off');
	this.loadingBar.hide();
};

ui.prototype.loadingBarReset = function(loadingTxt)
{
	this.loadingText.h1.text(loadingTxt);
	this.loadingBarFiller.css({"width": "0"});
};

ui.prototype.loadingBarUpdate = function(assetsDone, assetsRequired)
{
	this.loadingBarWidth = (assetsDone / assetsRequired) * 100 + '%';
	this.loadingBarFiller.css({"width": this.loadingBarWidth});
};

ui.prototype.updateLevel = function()
{
	this.uiLevel.innerHTML = 'STAGE ' + game.level;
};

ui.prototype.updateScore = function()
{
	this.uiScore.innerHTML = 'SCORE: ' + game.score;
};

ui.prototype.updateEnergy = function()
{
	shipEnergy = (playerShip.hull / playerShip.maxHull) * 100;

	if(shipEnergy < 0 ) {shipEnergy = 0;}

	shipEnergyPC = shipEnergy + '%';

	if (shipEnergy >= 66)
	{
		this.uiEBar.classList.remove('eBar-red');
		this.uiEBar.classList.remove('eBar-yellow');
		this.uiEBar.classList.add('eBar-blue');
	}
	else if (shipEnergy >= 33 && shipEnergy < 66  )
	{
		this.uiEBar.classList.remove('eBar-red');
		this.uiEBar.classList.add('eBar-yellow');
		this.uiEBar.classList.remove('eBar-blue');
	}
	else
	{
		this.uiEBar.classList.add('eBar-red');
		this.uiEBar.classList.remove('eBar-yellow');
		this.uiEBar.classList.remove('eBar-blue');
	}

	this.uiEBar.style.width = shipEnergyPC;
};

ui.prototype.updateHangar = function()
{
	switch(playerShip.lives)
	{
		case 3:
			this.uiHangar.getElementsByTagName("li")[0].style.display = 'inline-block';
			this.uiHangar.getElementsByTagName("li")[1].style.display = 'inline-block';
			this.uiHangar.getElementsByTagName("li")[2].style.display = 'inline-block';
		break;
		case 2:
			this.uiHangar.getElementsByTagName("li")[0].style.display = 'none';
		break;
		case 1:
			this.uiHangar.getElementsByTagName("li")[1].style.display = 'none';
		break;
		case 0:
			this.uiHangar.getElementsByTagName("li")[2].style.display = 'none';
		break;
	}
};

ui.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		case 'in':
			this.uiAll.fadeIn(this.effectDuration);
		break;
		case 'out':
			this.uiAll.fadeOut(this.effectDuration);
		break;
	}
};

ui.prototype.updateAll = function()
{
	this.updateLevel();
	this.updateScore();
	this.updateEnergy();
	this.updateHangar();
};

var gameUI = new ui();

lights = function()
{
	this.fader = $('#fader');
	this.effectDuration = 2000;
};

lights.prototype.switch = function(trigger)
{
	switch (trigger)
	{
		case 'on':
			this.fader.hide();
			game.faded = false;
		break;

		case 'off':
			this.fader.show();
			game.faded = true;
		break;
	}
};

lights.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		//note that we're fadding this.fader(div) here to give the illusion that our game is fading so the jquery effects below should be opposite to what we want to achieve
		case 'in':
			game.fadingIn = true;
			this.fader.fadeOut(this.effectDuration, function()
			{
				game.fadingIn = false;
				game.faded = false;
			});
		break;

		case 'out':
			game.fadingOut = true;
			this.fader.fadeIn(this.effectDuration, function()
			{
				game.fadingOut = false;
				game.faded = true;
			});
		break;
	}
};

gameLights = new lights();

state = function() {};

state.prototype.start = function()
{
	vibrateDevice(15);
	//disabling buttons so we don't this function more than once
	document.getElementById("resumeGame").disabled = true;
	document.getElementById("startGame").disabled = true;

	gameState.pause();
	gameLights.switch('off');
	gameMusic.pauseAll();

	removeGamePlayInput();
	addStandByInput();

	if (gameMenu.toggled) //if the game menu is up toggle it off
	{
		gameMenu.toggle();
	}

	if(!game.started) //checking if we're starting a new game or restarting
	{
		game.started = true; // set after gameMenu.toggle() to prevent breaking resume button
	}
	else
	{
		// this shouldn't be here!
		game.score = 0;
		game.level = 1;
	}

	introBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
	introText = new text('Stage ' + game.level, introBriefing[game.level - 1], true);  //needs reclying centre!

	$('.menu-option-btn').promise().done(function()
	{
		$('#menuBackground').promise().done(function()
		{
			gameBackground.update();
			introText.fade('in');

			$('.all-text').promise().done(function()
			{
				removeStandByInput();
				if (game.textFaded) //remove this later
				{
					if (!game.loaded)
					{
						startGame();
					}
					addGamePlayInput();
					resetGame();
					gameLights.fade('in');
					gameState.unPause();
					document.getElementById("resumeGame").disabled = false;
					document.getElementById("startGame").disabled = false;
				}
				else
				{
					$(document).on('mousedown touchstart keypress', function(e)
					{
						//only trigger this event listner once text animations have ended
						$(document).off('mousedown touchstart keypress');
						introText.fade('out');
						$('.all-text').promise().done(function()
						{
							if (!game.loaded)
							{
								startGame();
							}
							addGamePlayInput();
							resetGame();
							gameLights.fade('in');
							gameState.unPause();
							document.getElementById("resumeGame").disabled = false;
							document.getElementById("startGame").disabled = false;
						});
					});
				}
			});
		});
	});
};


state.prototype.lvlComplete = function() //called at the end of each level
{
	game.started = false;
	removeGamePlayInput();
	gameUI.fade('out');

	levelUpText = new text('Stage Complete!', game.score + ' enemy ships destroyed', true);
	levelUpText.switch('on');

	$(document).on('mousedown touchstart keypress', function(e)
	{
		$(document).off('mousedown touchstart keypress');
		levelUpText.fade('out');

		$('.all-text').promise().done(function()
		{
			gameUI.fade('out');
			gameLights.fade('out');
				$('#fader').promise().done(function()
				{   //once text fades
					gameState.pause();
					game.level++;
					gameState.start();
				});
		});
	});
};

state.prototype.gameOver = function()
{
	game.started = false;
	removeGamePlayInput();
	gameUI.fade('out');

	gameOverText = new text('Game Over', game.score + ' enemy ships destroyed', true);
	gameOverText.switch('on');

	$(document).on('mousedown touchstart keypress', function(e)
	{
		$(document).off('mousedown touchstart keypress');
		gameOverText.fade('out');

		$('.all-text').promise().done(function()
		{
			gameUI.fade('out');
			gameLights.fade('out');
			$('#fader').promise().done(function()
			{   //once text fades
				gameState.pause();
				game.score = 0;
				game.level = 1;
				gameLights.fade('out');
				gameMenu.toggle();
			});
		});
	});
};

state.prototype.pause = function()
{
	game.paused = true;
	gameUI.fade('out');
};

state.prototype.unPause = function()
{
	game.paused = false;
	if (gameMusic.on) gameMusic.resumeGame();
	gameUI.updateAll();
	gameUI.fade('in');
};

gameState = new state();

menu = function()
{
	self = this;
	this.modal = $('#modal');
	this.modalTitle = $('#modalTitle');
	this.modalBody = $('#modalBody');
	this.modalBtns = $('.modal-btn');
	this.menuBg = $('#menuBackground');
	this.gameTitle = $('#gameTitle');
	this.resumeBtn = $('#resumeGame');
	this.startBtn = $('#startGame');
	this.optionsBtn = $('#toggleOptions');
	this.sfxBtn = $('#toggleSound');
	this.musicBtn = $('#toggleMusic');
	this.ctrlsBtn = $('#toggleControls');
	this.fullScrnBtn = $('#toggleFullScreen');
	this.creditsBtn = $('#toggleCredits');
	this.allButtons = $('.menu-option-btn');
	this.animationSpeed = 800;
	this.toggled = false;

	//enabling buttons (firefox caching disabled)
	document.getElementById("resumeGame").disabled = false;
	document.getElementById("startGame").disabled = false;

	//disabling UI menu button so game.dt calculation doesn't get interrupted
	document.getElementById("toggle-menu-btn").disabled = true;
};

menu.prototype.closeModal = function()
{
	var self = this;
	
	this.modal.fadeOut(400, function () {
		self.modalBtns.hide();
		self.modalBody.children("credits").remove();
	});
};

menu.prototype.toggleOptions = function()
{
	this.modalTitle.html('<h1>OPTIONS</h1>');
	this.modalBtns.show();
	this.modal.fadeIn(400);
};

menu.prototype.toggleCredits = function()
{
	this.modalTitle.html('<h1>CREDITS</h1>');
	this.modalBody.append("<credits><h3><u>Programming:</u></h3><p>Carlos Fonseca<br><a href='http://fonziemedia.com' target='_blank'>(fonziemedia.com)</a></p><br><h3><u>Game Design & UI:</u></h3><p>Carlos Fonseca</p><br><h3><u>Graphics:</u></h3><p><a href='http://millionthvector.blogspot.pt' target='_blank'>Millionthvector</a><br>Carlos Fonseca</p><p><br>Copyright &copy; <a href='http://fonziemedia.com' target='_blank'>fonziemedia.com</a></p></credits>");
	this.modal.fadeIn(400);
};

menu.prototype.toggleFullScreen = function(trigger)  //experimental   only works with user input
{
	vibrateDevice(15);

	if (!doc.fullscreenElement &&    // alternative standard method
	!doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)   // current working methods
	{
		if (doc.documentElement.requestFullscreen)
		{
			doc.documentElement.requestFullscreen();
		}
		else if (doc.documentElement.msRequestFullscreen)
		{
			doc.documentElement.msRequestFullscreen();
		}
		else if (doc.documentElement.mozRequestFullScreen)
		{
			doc.documentElement.mozRequestFullScreen();
		}
		else if (doc.documentElement.webkitRequestFullscreen)
		{
			doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	}
	else
	{
		if (doc.exitFullscreen)
		{
		  doc.exitFullscreen();
		}
		else if (doc.msExitFullscreen)
		{
		  doc.msExitFullscreen();
		}
		else if (doc.mozCancelFullScreen)
		{
		  doc.mozCancelFullScreen();
		}
		else if (doc.webkitExitFullscreen)
		{
		  doc.webkitExitFullscreen();
		}
	}
};

menu.prototype.toggleSound = function()
{
	vibrateDevice(15);
	gameSfx.on = gameSfx.on ? false : true ;
	localStorage.prawnsSound =  gameSfx.on;

	if (gameSfx.on)
	{
		this.sfxBtn.addClass('active');
		this.sfxBtn.text('Sound: ON');
	}
	else
	{
	this.sfxBtn.removeClass('active');
	this.sfxBtn.text('Sound: OFF');
	}
};

menu.prototype.toggleMusic = function()
{
	vibrateDevice(15);
	gameMusic.on = gameMusic.on ? false : true ;
	localStorage.prawnsMusic =  gameMusic.on;

	if (gameMusic.on)
	{
		this.musicBtn.addClass('active');
		this.musicBtn.text('Music: ON');
	}
	else
	{
		this.musicBtn.removeClass('active');
		this.musicBtn.text('Music: OFF');
	}
};

menu.prototype.toggleControls = function()
{
	if (game.mouseControls)
	{
		game.mouseControls = false;
		game.keyboardControls = true;

		this.ctrlsBtn.text('Controls: keyboard');
		player.prototype.setControls = player.prototype.keyboardControls;
		player.prototype.setGunControls = player.prototype.setKeyboardGuns;
		text.prototype.h3Text = 'Press any key to continue';
	}
	else if (game.keyboardControls)
	{
		game.mouseControls = true;
		game.keyboardControls = false;

		this.ctrlsBtn.text('Controls: mouse');
		player.prototype.setControls = player.prototype.mouseControls;
		player.prototype.setGunControls = player.prototype.setMouseGuns;
		text.prototype.h3Text = game.isMobile ? 'Tap screen to continue' : 'Click to continue';
	}

	localStorage.mouseControls =  game.mouseControls;
	localStorage.keyboardControls =  game.keyboardControls;

};

menu.prototype.toggle = function()
{
	var self = this;
	document.getElementById("toggle-menu-btn").disabled = true;
	this.toggled = this.toggled ? false : true;

	// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
	if (this.toggled)
	{
		gameState.pause();

		if (gameMusic.on)
		{
			gameMusic.pauseAll();
		}

		this.allButtons.css({"display": "block"});

		this.menuBg.fadeIn(this.animationSpeed);
		this.menuBg.promise().done(function()
		{
			self.gameTitle.fadeIn(this.animationSpeed);
			
			if(game.started)
			{
				if(self.startBtn.text !== 'Restart')
				{
					self.startBtn.text('Restart');
				}
				self.resumeBtn.animate({
					opacity: 1,
					"right": "-=50%",
				},800);
			}
			else
			{
				self.startBtn.text('Start');
			}

			self.startBtn.animate({
				opacity: 1,
				"left": "-=50%",
			},800);
			
			self.optionsBtn.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			self.creditsBtn.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			document.getElementById("toggle-menu-btn").disabled = false;
		});
	}
	else
	{
		if(game.started)
		{
			this.resumeBtn.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
		}

		this.startBtn.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.optionsBtn.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		this.creditsBtn.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.allButtons.promise().done(function()
		{
			self.allButtons.hide();
			self.gameTitle.fadeOut(this.animationSpeed);
			self.menuBg.fadeOut(self.animationSpeed);
			self.menuBg.promise().done(function()
			{
				if(game.loaded && !game.faded)	gameState.unPause();
				document.getElementById("toggle-menu-btn").disabled = false;
			});
		});
	}
};

menu.prototype.init = function()
{
	if (localStorage.prawnsSound === 'true') //note = localStorage will only process string values
	{
		this.sfxBtn.addClass('active');
		this.sfxBtn.text('Sound: ON');
	}
	else
	{
	this.sfxBtn.removeClass('active');
	this.sfxBtn.text('Sound: OFF');
	}

	if (localStorage.prawnsMusic === 'true') //note = localStorage will only process string values
	{
		this.musicBtn.addClass('active');
		this.musicBtn.text('Music: ON');
	}
	else
	{
		this.musicBtn.removeClass('active');
		this.musicBtn.text('Music: OFF');
	}

	if (localStorage.fullScreen === 'true') //note = localStorage will only process string values
	{
		this.fullScrnBtn.addClass('active');
		this.fullScrnBtn.text('Fullscreen: ON');
	}
	else
	{
		this.fullScrnBtn.removeClass('active');
		this.fullScrnBtn.text('Fullscreen: OFF');
	}

	if (!game.isMobile)
	{
		if (localStorage.mouseControls === 'true') //note = localStorage will only process string values
		{
			this.ctrlsBtn.text('Controls: mouse');
		}

		if (localStorage.keyboardControls === 'true') //note = localStorage will only process string values
		{
			this.ctrlsBtn.text('Controls: keyboard');
		}
	}
	else
	{
		this.ctrlsBtn.disabled = true;
	}

	this.toggle();
};

gameMenu = new menu();

function update()
{
	////////////////////////
	// Init
	///////////////////////
	gameBackground.update();

	if(!game.dtTimerSet)
	{
		getDeltaTime();
	}

	updateGameTime();

	/////////////////////////////////////////////////////////////////////////////////
	// LEVELS
	////////////////////////////////////////////////////////////////////////////////
	/* jshint ignore:start */
	if(game.seconds == Math.round(game.seconds) && win['level'+game.level]['second'+game.seconds])
	{
		win['level'+game.level]['second'+game.seconds]();
	}

	win['level'+game.level].update();
	/* jshint ignore:end */

	/////////////////////////////////////////////////////////////////////
	// Game objects	**!Load in order of appearance (bottom layer = 1st)!**
	/////////////////////////////////////////////////////////////////////

	// enemies on separate loop
	// to optimise complex collision detection
	// (see playerBullet collision)
	var en = game.enemies.length;
	while (en--)
	{
			game.enemies[en].update();
	}

	var obj = game.objects.length;
	while (obj--)
	{
			game.objects[obj].update();
	}

	// playerShip.update();

	///////////////////////////////////
	// D3BUG3R!
	///////////////////////////////////
	// console.log (dt);
	// console.log(fileFormat);
	//
	// console.log ('game width:' + game.width);
	// console.log ('game height:' + game.height);
	//
	// console.log(win.devicePixelRatio);
	// console.log(win.outerHeight);
	// console.log(win.outerWidth);

	///////////////////////////////////
	// GAME ARRAYS
	///////////////////////////////////
	// console.log('keys: '+ game.keys.length);
	// console.log('objects: ' + game.objects.length);
	// console.log('playerBulletsPool: '+ game.playerBulletsPool.length);
	// console.log('playerBulletsPool: '+ game.enemyBulletsPool.length);
  // console.log('bulletsActive: ' + game.bullets.length);
	// console.log('enemies: '+ game.enemies.length);
	// console.log('game.minionsPool: ' + game.minionsPool.length);
	// console.log('game.bossesPool: ' + game.bossesPool.length);
	// console.log('game.explosionsPool: ' + game.explosionsPool.length);
	// console.log('Waves pool: ' + game.wavesPool.length);
	// console.log('Waves active: ' + game.waves.length);
  // console.log('pool: ' + game.lootPool.length);
  // console.log('active: ' + game.bullets.length);
	// console.log('explosions: '+ game.explosions.length);
	// console.log(game.dtArray.length);
	// console.log(audiopreload);
	// console.log('required soundSfx:' + game.requiredSfx);
	// console.log('sfx: '+ gameSfx.sfx.length);
	// console.log('required soundTracks:' + game.requiredSoundTracks);
	// console.log('soundtracks: '+ gameMusic.soundTracks.length);
	// console.log('sounds: '+ gameSfx.playQueue.length);
	// console.log ('game tracks: ' + gameMusic.playQueue);
	// console.log('tracks: '+ gameMusic.playQueue.length);
	// console.log('images: '+ game.images.length);
	// console.log('reqImages: ' + game.requiredImages);
	// console.log('doneImages: ' + game.doneImages);

	///////////////////////////////////
	// TOUCH INPUT
	///////////////////////////////////
	// console.log('touchInitX:' + touchInitX);
	// console.log('touchInitY:' + touchInitY);
	// console.log('inputAreaX:' + inputAreaX);
	// console.log('inputAreaY:' + inputAreaY);

	///////////////////////////////////
	// PLAYER MOVEMENT
	///////////////////////////////////
	// console.log ('speedX: ' + playerShip.speedX);
	// console.log ('spriteFrame: ' + playerShip.spriteFrame);
	// console.log ('speedY: ' + playerShip.speedY);
	// console.log ('accel: ' + playerShip.accel);
	// console.log ('speedLimit: ' + playerShip.speedLimit);

	// console.log('playerShip.hull: ' + playerShip.hull);


}

var level1 = {};

// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
level1.second1 = function ()
{
	getNewEnemyWave('left', game.width*0.3, 'enemy_sectoid', 1, 2, 1, 0);
	getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 1, 2, 1, 0);
};

level1.second3 = function ()
{
  getNewEnemyWave('left', game.height*0.5, 'enemy_sectoid', 1, 2, 1, 0);
  getNewEnemyWave('right', game.height*0.5, 'enemy_sectoid', 1, 2, 1, 0);
};

level1.second5 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.7, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 2);
};

level1.second7 = function ()
{
  getNewEnemyBase(game.width * 0.3, game.outerTop, 1, Math.PI/2, 10, 'enemy_base_sectoid', 2);
};

level1.second8 = function ()
{
  getNewEnemyWave('left', game.height*0.3, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second9 = function ()
{
  getNewEnemyWave('right', game.height*0.2, 'enemy_sectoid', 3, 2, 1, 3);
};

level1.second10 = function ()
{
  getNewEnemyWave('top', game.width*0.5, 'enemy_sectoid', 6, 2, 1, 3);
};

level1.second11 = function ()
{
  getNewEnemyWave('top', game.width*0.7, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second12 = function ()
{
  getNewEnemyWave('left', game.height*0.2, 'enemy_sectoid', 3, 2, 1, 3);
};

level1.second13 = function ()
{
  getNewEnemyBase(game.width * 0.3, game.outerTop, 1, Math.PI/2, 10, 'enemy_base_floater', 2);
};

level1.second15 = function ()
{
	if (gameMusic.on) gameMusic.playTrack('tune2', true);
  getNewEnemyWave('top', game.width*0.2, 'enemy_sectoid', 2, 2, 1, 3);
};

level1.second16 = function ()
{
  getNewEnemyWave('top', game.width*0.4, 'enemy_sectoid', 3, 2, 1, 3);
};

level1.second17 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second18 = function ()
{
  getNewEnemyWave('top', game.width*0.8, 'enemy_sectoid', 5, 2, 1, 3);
};

level1.second22 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second25 = function ()
{
  getNewEnemyWave('left', game.width*0.4, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second27 = function ()
{
  getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second30 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second33 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second35 = function ()
{
  getNewEnemyWave('right', game.width*0.2, 'enemy_sectoid', 4, 2, 1, 3);
};

level1.second37 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.2, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 2);
};

level1.second38 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.4, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 3);
};

level1.second39 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.6, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 2);
};

level1.second40 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.8, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 3);
};

level1.second41 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.5, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 2);
};

level1.second42 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.2, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 3);
};

level1.second43 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.4, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 3);
};

level1.second44 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.6, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 2);
};

level1.second45 = function ()
{
  getNewEnemyMiniBoss(game.width * 0.8, game.outerTop, 1, Math.PI/2, 10, 'enemy_floater', 3);
};

level1.update = function ()
{
	if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead)
	{
		if (gameMusic.on)
		{
			gameMusic.pauseAll();
			gameMusic.playTrack('boss', true);
		}
		
		getNewSectoidBoss();
	}
};
//boss(x, y, speed, direction, hull, image)
// };

//Note: UI images are powered by CSS (see CSS assets folder)
graphics = function()
{
	this.self = this;
	this.images = [];
	this.doneImages  = 0; // will contain how many images have been loaded
	this.offCtx = [];
	
	this.fileExtension = !game.isMobile || game.windowHeight > 900 ? ".dkt.png" : ".mob.png";
	
	this.imagePaths = !game.isMobile || game.windowHeight > 640 ? ["_img/bg_level1.dkt.jpg"]
	 : ["_img/bg_level1.mob.jpg"];

	this.imagePaths.push(
		//Player
		"_img/player_ship"+this.fileExtension,
		"_img/player_ship_i"+this.fileExtension,
		"_img/player_shields"+this.fileExtension,
		//Enemies
			////Pawns
			"_img/enemy_sectoid"+this.fileExtension,
			////Minibosses
			"_img/enemy_floater"+this.fileExtension,
			////Enemy Bases
			"_img/enemy_base_sectoid"+this.fileExtension,
			"_img/enemy_base_floater"+this.fileExtension,
			////Big bosses
			"_img/boss_sectoid"+this.fileExtension,
		//Projectiles
		"_img/bullet_p_laser"+this.fileExtension,
		"_img/bullet_p_missile"+this.fileExtension,
		"_img/bullet_e_missile"+this.fileExtension,
		"_img/explosion_s0"+this.fileExtension,
		"_img/explosion_s1"+this.fileExtension,
		"_img/explosion_s2"+this.fileExtension,
		"_img/explosion_s3"+this.fileExtension,
		"_img/explosion_s4"+this.fileExtension,
		//Loot
		"_img/loot_lasers"+this.fileExtension,
		"_img/loot_missiles"+this.fileExtension,
		"_img/loot_shields"+this.fileExtension
	);	
	
	this.requiredImages = this.imagePaths.length; // will contain how many images should be loaded
};

graphics.prototype.loadEvent = function(self)
{
	this.removeEventListener("load", this.eventHandler, false);
	
	var indexName, ctxName, offCanvas, offCtx;

	indexName = this.src.split("/").pop();
	indexName = indexName.substr(0, indexName.indexOf('.')) || indexName;

	offCanvas = doc.createElement('canvas');
	offCanvas.width = Math.round(this.width);
	offCanvas.height = Math.round(this.height);

	offCtx = offCanvas.getContext('2d');
	offCtx.drawImage(this, 0, 0, offCanvas.width, offCanvas.height);
	self.offCtx[indexName] = offCanvas;
	self.doneImages++;
};

graphics.prototype.checkImages = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	if(this.doneImages >= this.requiredImages){
		gameUI.loadingBarUpdate(this.doneImages, this.requiredImages);
		gameUI.loadingBarReset('Loading Sfx.. ');
		gameSfx.init();
	}
	else
	{
		gameUI.loadingBarUpdate(this.doneImages, this.requiredImages);
		setTimeout(function(){
			self.checkImages();
		}, 1);
	}
};

graphics.prototype.init = function() {
	
	var self = this.self;
	
	for(var i in this.imagePaths)
	{
		var img = new Image(); //defining img as a new image
		img.eventHandler = self.loadEvent.bind(img, self);

		img.addEventListener("load", img.eventHandler, false); // !event listner needs to be set before loading the image (defining .src)

		img.src = this.imagePaths[i];
		var imgIndex = img.src.split("/").pop(); //obtaining file name from path
		imgIndex = imgIndex.substr(0, imgIndex.indexOf('.')) || imgIndex;

		//!check if you should change this to object notation! you can't access array functions like this anyway
		this.images[imgIndex] = img; //defining this.image[index] as a new image (with this.imagePaths)
	}
	
	this.checkImages();
};

var gameGfx = new graphics();

//Note: UI images are powered by CSS (see CSS assets folder)
soundfx = function()
{
	this.self = this;	
	this.on = localStorage.prawnsSound === "true" ? true : false;	
	this.sfx = [];
	this.loadedSfx  = 0;

	this.sfxPaths = [	//used in initSfx function to load our sounds
		"_sounds/_sfx/laser" + fileFormat,
		"_sounds/_sfx/hit" + fileFormat,
		"_sounds/_sfx/loot_powerUp" + fileFormat,
		"_sounds/_sfx/explosion" + fileFormat,
		"_sounds/_sfx/blast" + fileFormat
	];

	this.requiredSfx = this.sfxPaths.length; // will contain how many images should be loaded
	this.maxPlaying = game.isMobile ? 3 : 6;
};

soundfx.prototype.loadEvent = function(self)
{
	this.removeEventListener("canplaythrough", this.eventHandler, false);
	self.loadedSfx++;
};

soundfx.prototype.play = function(track, instance)
{ 
	var i = instance || 0;
	
	if (i < this.maxPlaying)
	{
		if (this.sfx[track + i].paused)
		{
			this.sfx[track + i].play();
		}
		else
		{
			i++;
			this.play(track, i);
		}
	}
};

soundfx.prototype.checkSfx = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	if(this.loadedSfx >= this.requiredSfx){
		gameUI.loadingBarUpdate(this.loadedSfx, this.requiredSfx);
		gameUI.loadingBarReset('Loading Sound Tracks.. ');
		gameMusic.init();
	}
	else
	{
		gameUI.loadingBarUpdate(this.loadedSfx, this.requiredSfx);
		setTimeout(function(){
			self.checkSfx();
		}, 1);
	}
};

soundfx.prototype.chromiumFix = function ()
{
	//playing chached sfx once onclick
	for (var s in this.sfx)
	{
		this.sfx[s].volume = 0;
		this.sfx[s].play();
		this.sfx[s].pause();
		this.sfx[s].volume = 1;
	}
};

soundfx.prototype.init = function ()
{ 
	var self = this.self;
	
	for(var i in this.sfxPaths)
	{
		for (var n = 0; n < this.maxPlaying; n++) //caching each sfx source n times for poliphony
		{
			var sfx = new Audio(); //defining sfx as a new Audio
			sfx.src = this.sfxPaths[i]; //defining new Audio src as stPaths[i]

			var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path and setting our sfxIndex as such
			sfxIndex = sfxIndex.replace(/\.[^/.]+$/, "");

			this.sfx[sfxIndex + n] = sfx;

			if(audiopreload)
			{
				this.sfx[sfxIndex + n].eventHandler = self.loadEvent.bind(this.sfx[sfxIndex + n], self);
				
				this.sfx[sfxIndex + n].preload = "auto";
				//checking if sfx have loaded
				this.sfx[sfxIndex + n].addEventListener("canplaythrough", this.sfx[sfxIndex + n].eventHandler, false);
			}
			else
			{
				this.loadedSfx++;
			}			
		}	
	}
	
	this.checkSfx();
};

var gameSfx = new soundfx();

//Note: UI images are powered by CSS (see CSS assets folder)
music = function()
{
	this.self = this;	
	this.on = localStorage.prawnsMusic === "true" ? true : false;
	
	this.soundTracks = [];
	this.loadedSoundTracks = 0;

	//Sound Tracks vars
	this.soundTrackPaths = [	//used in initSfx function to load our sound tracks
		"_sounds/_soundTracks/_lvl1/tune1" + fileFormat,
		"_sounds/_soundTracks/_lvl1/tune2" + fileFormat,
		"_sounds/_soundTracks/_lvl1/victory" + fileFormat,
		"_sounds/_soundTracks/_lvl1/boss" + fileFormat
	];
	
	this.requiredSoundTracks = this.soundTrackPaths.length;
};

music.prototype.loadEvent = function(self)
{
	this.removeEventListener("canplaythrough", this.eventHandler, false);
	self.loadedSoundTracks++;
};

music.prototype.checkSoundTracks = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	//checking if all Sfx have been loaded. Once all loaded run init
	if(this.loadedSoundTracks >= this.requiredSoundTracks)
	{
		gameUI.loadingBarUpdate(this.loadedSoundTracks, this.requiredSoundTracks);
		gameUI.loadingBarReset('Loading Assets.. ');
		//starting game menu
		initObjects();
		checkObjects();
	}
	else
	{
		gameUI.loadingBarUpdate(this.loadedSoundTracks, this.requiredSoundTracks);
		setTimeout(function()
		{
			self.checkSoundTracks();
		}, 1);
	}
};

music.prototype.playTrack = function (track, loop)
{ 
	this.soundTracks[track].play();
	this.soundTracks[track].loop = loop;
};

music.prototype.pauseAll = function ()
{ 
	for(var t in this.soundTracks)
	{
		this.soundTracks[t].pause();
	}
};

music.prototype.lvlComplete = function ()
{ 
	this.pauseAll();
	this.playTrack('victory', false);
};

music.prototype.resumeGame = function ()
{ 
	if (game.seconds <= 14)
	{
		this.playTrack('tune1', true);
	}
	else if (!game.bossUp)
	{
		this.playTrack('tune1', true);
		this.playTrack('tune2', true);
	}
	else if (game.bossUp)
	{
		this.playTrack('boss', true);
	}
};

music.prototype.chromiumFix = function ()
{
	//playing chached sfx once onclick
	for (var t in this.soundTracks)
	{
		this.soundTracks[t].volume = 0;
		this.soundTracks[t].play();
		this.soundTracks[t].pause();
		this.soundTracks[t].volume = 1;
	}
};

music.prototype.init = function ()
{ 
	var self = this.self;
	
	for(var i in this.soundTrackPaths)
	{
		var soundTracks = new Audio(); //defining soundTracks as a new Audio
		soundTracks.src = this.soundTrackPaths[i];

		var soundTracksIndex = soundTracks.src.split("/").pop(); //obtaining file name from path
		soundTracksIndex = soundTracksIndex.replace(/\.[^/.]+$/, "");

		this.soundTracks[soundTracksIndex] = soundTracks; //defining this.soundTracks[soundTracksIndex] as a new Audio (with this.soundTrackPaths)

		if(audiopreload)
		{
			this.soundTracks[soundTracksIndex].eventHandler = self.loadEvent.bind(this.soundTracks[soundTracksIndex], self);
			this.soundTracks[soundTracksIndex].preload = "auto";
			//checking if st's have loaded
			this.soundTracks[soundTracksIndex].addEventListener("canplaythrough", this.soundTracks[soundTracksIndex].eventHandler, false);
		}
		else
		{
			this.loadedSoundTracks++;
		}
	}
	
	this.checkSoundTracks();
};

var gameMusic = new music();

//====================== Game functions =================//

////////////
// Display
////////////
//making our canvases dynamically resize according to the size of the browser win	//! USE THIS TO SHOW ROTATE SCREEN MSG IF MOBILE AND GAME.WIDTH > GAME HEIGHT
function respondCanvas()
{
	game.paused = gameMenu.toggled ? game.paused : true; //promtp to pause the game if called outside game menu
	setGameDimensions();
	game.paused = gameMenu.toggled ? game.paused : false; //prompt to unpause the game if called outside game menu
}

///////////////////
// Input/controls
///////////////////
//vibration
function vibrateDevice(ms)
{
	if (game.canVibrate) navigator.vibrate(ms);
}
//Keyboard
$(document).keydown(function(e)
{
	//listen to pressed keys
	game.keys[e.keyCode ? e.keyCode : e.which] = true;

	if (game.keys[27] && game.dtTimerSet && !game.gameOver) gameMenu.toggle();
	if (game.keys[80] && game.dtTimerSet && !game.paused && !game.gameOver) gameState.pause();
	else if (game.keys[80] && game.dtTimerSet && game.paused && !game.gameOver) gameState.unPause();
});

$(document).keyup(function(e)
{
	//listen to released keys
	delete game.keys[e.keyCode ? e.keyCode : e.which];
});

function addGamePlayInput()
{
	inputAreaX = playerShip.x;
	inputAreaY = playerShip.y;

  inputArea.addEventListener("mousedown",mouseDown, false);
  inputArea.addEventListener("mouseup", mouseUp, false);
  inputArea.addEventListener("mousemove",mouseXY, false);

  inputArea.addEventListener("touchstart", touchDown, false);
  inputArea.addEventListener("touchend", touchUp, false);
  inputArea.addEventListener("touchcancel", touchUp, false);
  inputArea.addEventListener("touchleave", touchUp, false);
  inputArea.addEventListener("touchmove", touchXY, false);
}

//remove this later
function addStandByInput()
{
	inputArea.addEventListener("mouseup", standByInput, false);
	inputArea.addEventListener("touchstart", standByInput, false);
}

function removeGamePlayInput()
{
	inputArea.removeEventListener("mousedown",mouseDown, false);
	inputArea.removeEventListener("mouseup", mouseUp, false);
	inputArea.removeEventListener("mousemove",mouseXY, false);

	inputArea.removeEventListener("touchstart", touchDown, false);
	inputArea.removeEventListener("touchend", touchUp, false);
	inputArea.removeEventListener("touchcancel", touchUp, false);
	inputArea.removeEventListener("touchleave", touchUp, false);
	inputArea.removeEventListener("touchmove", touchXY, false);
}

function removeStandByInput()
{
	inputArea.removeEventListener("mouseup", standByInput, false);
	inputArea.removeEventListener("touchstart", standByInput, false);
}

function mouseUp(e)
{
	e.preventDefault();
	mouseIsDown = 0;
	if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'crosshair';
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
	touchInitX = e.pageX - inputArea.offsetLeft;
	touchInitY = e.pageY - inputArea.offsetTop;
	if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'none';
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
	inputAreaX = e.pageX - inputArea.offsetLeft;
	inputAreaY = e.pageY - inputArea.offsetTop;
}

function touchXY(e)
{
	e.preventDefault();
	var touch = e.targetTouches[0];

	inputAreaX = touch.pageX - inputArea.offsetLeft;
	inputAreaY = touch.pageY - inputArea.offsetTop;
}

//remove this later
function standByInput(e)
{
	e.preventDefault();

	if(game.fadingIn)
	{
		gameLights.fader.stop(true, true);
		gameLights.switch('on');
	}

	if(game.fadingOut)
	{
		gameLights.fader.stop(true, true);
		gameLights.switch('off');
	}

	if(game.textFadingIn)
	{
		$('.all-text').stop(true, true);
		gameText.switch('off');
	}

	if(game.textFadingOut)
	{
		$('.all-text').stop(true, true);
		gameText.switch('off');
	}
}

////////////////////////
// Performance checking        !NEEDS WORK!
////////////////////////
function getDeltaTime()
{
	//disabling UI menu button so game.dt calculation doesn't get interrupted
	document.getElementById("toggle-menu-btn").disabled = true;
	//obtaining an average deltaTime
	if(game.dtTimer <= 200)
	{
		var timeNow = new Date().getTime();
		var timeDiff = timeNow - (game.timeThen);
		game.dtArray.push(timeDiff); // seconds since last frame
		game.timeThen = timeNow;
		game.dtTimer++;

		if(game.dtTimer == 200)
		{
			var dtSum = 0;
			var msPerFrame = 0;
			for( var i = 0; i < game.dtArray.length-10; i++)
			{
			dtSum += game.dtArray[i+10]; //+10 skips first values which might be deviant
			}
			msPerFrame = dtSum / game.dtArray.length;
			game.dt = msPerFrame < 16.6 ? 16.6/msPerFrame : 1; //ratio 60fps ~ 16.66ms/frame; game.dt; compensates lower frame rates by making the game run faster;
			game.dtTimerSet = true;
			document.getElementById("toggle-menu-btn").disabled = false;
		}
	}
}

function updateGameTime()
{
	game.timer++;
	game.seconds = game.timer/60 || 0;
}

function resetGame() //called on level start
{
	mouseIsDown = 0;
	gameLights.switch('off');

	//Game state
	game.gameOver = true;
	game.bossDead = false;
	game.levelComplete = false;

	//Timers
	game.timer = 0;
	game.seconds = 0;
	game.levelUpTimer = 0;

	// Back to the pool dudes
	var en = game.enemies.length;
	while (en--)
	{
		game.enemies[en].recycle();
	}

	var obj = game.objects.length;
	while (obj-- && obj > 0) // > 0 excludes playerShip
	{
		game.objects[obj].recycle();
	}

	playerShip.reset();

	gameUI.updateAll();
	gameMusic.pauseAll();

	if(gameMusic.on)
	{
		gameMusic.playTrack('tune1', true);
	}
}

////////////////////////
// Game Collisions
////////////////////////
function Collision(first, second)
{
	//detecting rectangles' (objects) collision
	return !(first.x > second.x + second.width ||
		first.x + first.width < second.x ||
		first.y > second.y + second.height ||
		first.y + first.height < second.y);
}

////////////////////////
// The game Loop
////////////////////////
function loop(){ //the loop
	requestAnimFrame(loop);
	if (!game.paused){
	update();
	}
}

////////////////////////
// Game start
////////////////////////
function startGame()
{
	game.loaded = true;

	if (!(game.objects[0] instanceof player))
	{
		game.objects.unshift(new player(10, 15));
		playerShip = game.objects[0];
	}

	gameMusic.chromiumFix();
	gameSfx.chromiumFix();

	if(gameMusic.on) gameMusic.playTrack('tune1', true);
	
	loop();
}

////////////////////////
// Game Loaders
////////////////////////

function checkObjects()
{
	//checking if all objects have been loaded. Once all loaded run init
	if(game.doneObjects >= game.requiredObjects){
		gameUI.loadingBarClose();
		//starting game menu
		gameMenu.init();
		gameBackground = new background();
	}
	else
	{
		gameUI.loadingBarUpdate(game.doneObjects, game.requiredObjects);
		setTimeout(function(){
			checkObjects();
		}, 1);
	}
}

function initObjects()
{
	initWaves();
	initEnemyMinions();
	initEnemyMiniBosses();
	initEnemyBases();
	initBosses();
	initEnemyBullets();
	initPlayerBullets();
	initExplosions();
	initLoot();
}

////////////////////////////
// On Window load functions
////////////////////////////
//Handler functions
function windowLoadEvent()
{
	//remove listener, no longer needed
	win.removeEventListener("load", windowLoadEvent, false);
	//Run function whenever browser resizes
	window.onresize = respondCanvas;
	//listen to fullscreen changes
	doc.addEventListener("fullscreenchange", fullScreenHandler);
	doc.addEventListener("webkitfullscreenchange", fullScreenHandler);
	doc.addEventListener("mozfullscreenchange", fullScreenHandler);
	doc.addEventListener("MSFullscreenChange", fullScreenHandler);
	//check for updates appcache
	win.applicationCache.addEventListener("updateready", appCacheEvent, false);
	//load images
	gameGfx.init();
}

function fullScreenHandler()
{
	var fullScreen = $('#toggleFullScreen');

	game.fullScreen = game.fullScreen ? false : true;

  if (game.fullScreen)
  {
		fullScreen.addClass('active');
		fullScreen.text('Fullscreen: ON');
  }
  else
  {
		fullScreen.removeClass('active');
		fullScreen.text('Fullscreen: OFF');
  }
}

function appCacheEvent()
{
	win.applicationCache.removeEventListener("updateready", appCacheEvent, false);

	if (win.applicationCache.status == win.applicationCache.UPDATEREADY)
	{
		// Browser downloaded a new app cache.
		if (confirm('A new version of InVaDeRs is available. Load it?'))
		{
			win.location.reload();
	  }
	}
}

//run on window load functions
win.addEventListener("load", windowLoadEvent, false);

//Audio pre-load test
var audiopreload = false;
var timeout;
var waitTime = 1000;
var audioTest = new Audio();

if (fileFormat === '.mp3')
{
	// 75ms of silence (minumum Mp3 duration loaded by Safari, not tested other formats thoroughly: may be possible to shrink base64 URI)
	audioTest.src = 'data:audio/mpeg;base64,//MUxAAB6AXgAAAAAPP+c6nf//yi/6f3//MUxAMAAAIAAAjEcH//0fTX6C9Lf//0//MUxA4BeAIAAAAAAKX2/6zv//+IlR4f//MUxBMCMAH8AAAAABYWalVMQU1FMy45//MUxBUB0AH0AAAAADkuM1VVVVVVVVVV//MUxBgBUATowAAAAFVVVVVVVVVVVVVV';
}
else if (fileFormat === '.m4a')
{
	audioTest.src = 'data:audio/x-m4a;base64,AAAAGGZ0eXBNNEEgAAACAGlzb21pc28yAAAACGZyZWUAAAAfbWRhdN4EAABsaWJmYWFjIDEuMjgAAAFoAQBHAAACiG1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAYAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAG0dHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAYAAAAAAAAAAAAAAAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAABUG1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAArEQAAAQAVcQAAAAAAC1oZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU291bmRIYW5kbGVyAAAAAPttaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAL9zdGJsAAAAW3N0c2QAAAAAAAAAAQAAAEttcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAACdlc2RzAAAAAAMZAAEABBFAFQAAAAABftAAAAAABQISCAYBAgAAABhzdHRzAAAAAAAAAAEAAAABAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAXAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAoAAAAYHVkdGEAAABYbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAraWxzdAAAACOpdG9vAAAAG2RhdGEAAAABAAAAAExhdmY1Mi42NC4y';
}
else if (fileFormat === '.ogg')
{
	audioTest.src = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAD/QwAAAAAAAM2LVKsBHgF2b3JiaXMAAAAAAUSsAAAAAAAAgLsAAAAAAAC4AU9nZ1MAAAAAAAAAAAAA/0MAAAEAAADmvOe6Dy3/////////////////MgN2b3JiaXMdAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAwNzA2MjIAAAAAAQV2b3JiaXMfQkNWAQAAAQAYY1QpRplS0kqJGXOUMUaZYpJKiaWEFkJInXMUU6k515xrrLm1IIQQGlNQKQWZUo5SaRljkCkFmVIQS0kldBI6J51jEFtJwdaYa4tBthyEDZpSTCnElFKKQggZU4wpxZRSSkIHJXQOOuYcU45KKEG4nHOrtZaWY4updJJK5yRkTEJIKYWSSgelU05CSDWW1lIpHXNSUmpB6CCEEEK2IIQNgtCQVQAAAQDAQBAasgoAUAAAEIqhGIoChIasAgAyAAAEoCiO4iiOIzmSY0kWEBqyCgAAAgAQAADAcBRJkRTJsSRL0ixL00RRVX3VNlVV9nVd13Vd13UgNGQVAAABAEBIp5mlGiDCDGQYCA1ZBQAgAAAARijCEANCQ1YBAAABAABiKDmIJrTmfHOOg2Y5aCrF5nRwItXmSW4q5uacc845J5tzxjjnnHOKcmYxaCa05pxzEoNmKWgmtOacc57E5kFrqrTmnHPGOaeDcUYY55xzmrTmQWo21uaccxa0pjlqLsXmnHMi5eZJbS7V5pxzzjnnnHPOOeecc6oXp3NwTjjnnHOi9uZabkIX55xzPhmne3NCOOecc84555xzzjnnnHOC0JBVAAAQAABBGDaGcacgSJ+jgRhFiGnIpAfdo8MkaAxyCqlHo6ORUuoglFTGSSmdIDRkFQAACAAAIYQUUkghhRRSSCGFFFKIIYYYYsgpp5yCCiqppKKKMsoss8wyyyyzzDLrsLPOOuwwxBBDDK20EktNtdVYY62555xrDtJaaa211koppZRSSikIDVkFAIAAABAIGWSQQUYhhRRSiCGmnHLKKaigAkJDVgEAgAAAAgAAADzJc0RHdERHdERHdERHdETHczxHlERJlERJtEzL1ExPFVXVlV1b1mXd9m1hF3bd93Xf93Xj14VhWZZlWZZlWZZlWZZlWZZlWYLQkFUAAAgAAIAQQgghhRRSSCGlGGPMMeegk1BCIDRkFQAACAAgAAAAwFEcxXEkR3IkyZIsSZM0S7M8zdM8TfREURRN01RFV3RF3bRF2ZRN13RN2XRVWbVdWbZt2dZtX5Zt3/d93/d93/d93/d93/d1HQgNWQUASAAA6EiOpEiKpEiO4ziSJAGhIasAABkAAAEAKIqjOI7jSJIkSZakSZ7lWaJmaqZneqqoAqEhqwAAQAAAAQAAAAAAKJriKabiKaLiOaIjSqJlWqKmaq4om7Lruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7rui4QGrIKAJAAANCRHMmRHEmRFEmRHMkBQkNWAQAyAAACAHAMx5AUybEsS9M8zdM8TfRET/RMTxVd0QVCQ1YBAIAAAAIAAAAAADAkw1IsR3M0SZRUS7VUTbVUSxVVT1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTVN0zRNIDRkJQAABADAYo3B5SAhJSXl3hDCEJOeMSYhtV4hBJGS3jEGFYOeMqIMct5C4xCDHggNWREARAEAAMYgxxBzyDlHqZMSOeeodJQa5xyljlJnKcWYYs0oldhSrI1zjlJHraOUYiwtdpRSjanGAgAAAhwAAAIshEJDVgQAUQAAhDFIKaQUYow5p5xDjCnnmHOGMeYcc44556B0UirnnHROSsQYc445p5xzUjonlXNOSiehAACAAAcAgAALodCQFQFAnACAQZI8T/I0UZQ0TxRFU3RdUTRd1/I81fRMU1U90VRVU1Vt2VRVWZY8zzQ901RVzzRV1VRVWTZVVZZFVdVt03V123RV3ZZt2/ddWxZ2UVVt3VRd2zdV1/Zd2fZ9WdZ1Y/I8VfVM03U903Rl1XVtW3VdXfdMU5ZN15Vl03Vt25VlXXdl2fc103Rd01Vl2XRd2XZlV7ddWfZ903WF35VlX1dlWRh2XfeFW9eV5XRd3VdlVzdWWfZ9W9eF4dZ1YZk8T1U903RdzzRdV3VdX1dd19Y105Rl03Vt2VRdWXZl2fddV9Z1zzRl2XRd2zZdV5ZdWfZ9V5Z13XRdX1dlWfhVV/Z1WdeV4dZt4Tdd1/dVWfaFV5Z14dZ1Ybl1XRg+VfV9U3aF4XRl39eF31luXTiW0XV9YZVt4VhlWTl+4ViW3feVZXRdX1ht2RhWWRaGX/id5fZ943h1XRlu3efMuu8Mx++k+8rT1W1jmX3dWWZfd47hGDq/8OOpqq+brisMpywLv+3rxrP7vrKMruv7qiwLvyrbwrHrvvP8vrAso+z6wmrLwrDatjHcvm4sv3Acy2vryjHrvlG2dXxfeArD83R1XXlmXcf2dXTjRzh+ygAAgAEHAIAAE8pAoSErAoA4AQCPJImiZFmiKFmWKIqm6LqiaLqupGmmqWmeaVqaZ5qmaaqyKZquLGmaaVqeZpqap5mmaJqua5qmrIqmKcumasqyaZqy7LqybbuubNuiacqyaZqybJqmLLuyq9uu7Oq6pFmmqXmeaWqeZ5qmasqyaZquq3meanqeaKqeKKqqaqqqraqqLFueZ5qa6KmmJ4qqaqqmrZqqKsumqtqyaaq2bKqqbbuq7Pqybeu6aaqybaqmLZuqatuu7OqyLNu6L2maaWqeZ5qa55mmaZqybJqqK1uep5qeKKqq5ommaqqqLJumqsqW55mqJ4qq6omea5qqKsumatqqaZq2bKqqLZumKsuubfu+68qybqqqbJuqauumasqybMu+78qq7oqmKcumqtqyaaqyLduy78uyrPuiacqyaaqybaqqLsuybRuzbPu6aJqybaqmLZuqKtuyLfu6LNu678qub6uqrOuyLfu67vqucOu6MLyybPuqrPq6K9u6b+sy2/Z9RNOUZVM1bdtUVVl2Zdn2Zdv2fdE0bVtVVVs2TdW2ZVn2fVm2bWE0Tdk2VVXWTdW0bVmWbWG2ZeF2Zdm3ZVv2ddeVdV/XfePXZd3murLty7Kt+6qr+rbu+8Jw667wCgAAGHAAAAgwoQwUGrISAIgCAACMYYwxCI1SzjkHoVHKOecgZM5BCCGVzDkIIZSSOQehlJQy5yCUklIIoZSUWgshlJRSawUAABQ4AAAE2KApsThAoSErAYBUAACD41iW55miatqyY0meJ4qqqaq27UiW54miaaqqbVueJ4qmqaqu6+ua54miaaqq6+q6aJqmqaqu67q6Lpqiqaqq67qyrpumqqquK7uy7Oumqqqq68quLPvCqrquK8uybevCsKqu68qybNu2b9y6ruu+7/vCka3rui78wjEMRwEA4AkOAEAFNqyOcFI0FlhoyEoAIAMAgDAGIYMQQgYhhJBSSiGllBIAADDgAAAQYEIZKDRkRQAQJwAAGEMppJRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkgppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkqppJRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSCgCQinAAkHowoQwUGrISAEgFAACMUUopxpyDEDHmGGPQSSgpYsw5xhyUklLlHIQQUmktt8o5CCGk1FJtmXNSWosx5hgz56SkFFvNOYdSUoux5ppr7qS0VmuuNedaWqs115xzzbm0FmuuOdecc8sx15xzzjnnGHPOOeecc84FAOA0OACAHtiwOsJJ0VhgoSErAYBUAAACGaUYc8456BBSjDnnHIQQIoUYc845CCFUjDnnHHQQQqgYc8w5CCGEkDnnHIQQQgghcw466CCEEEIHHYQQQgihlM5BCCGEEEooIYQQQgghhBA6CCGEEEIIIYQQQgghhFJKCCGEEEIJoZRQAABggQMAQIANqyOcFI0FFhqyEgAAAgCAHJagUs6EQY5Bjw1BylEzDUJMOdGZYk5qMxVTkDkQnXQSGWpB2V4yCwAAgCAAIMAEEBggKPhCCIgxAABBiMwQCYVVsMCgDBoc5gHAA0SERACQmKBIu7iALgNc0MVdB0IIQhCCWBxAAQk4OOGGJ97whBucoFNU6iAAAAAAAAwA4AEA4KAAIiKaq7C4wMjQ2ODo8AgAAAAAABYA+AAAOD6AiIjmKiwuMDI0Njg6PAIAAAAAAAAAAICAgAAAAAAAQAAAAICAT2dnUwAE7AwAAAAAAAD/QwAAAgAAADuydfsFAQEBAQEACg4ODg==';
}

audioTest.preload = "auto";

function testpreload(event)
{
	clearTimeout(timeout);
	audioTest.removeEventListener('loadeddata', testpreload);
	audiopreload = event !== undefined && event.type === 'loadeddata' ? true : false;
}

audioTest.addEventListener('loadeddata', testpreload);
timeout = setTimeout(testpreload, waitTime);

///////////////////////////
// Request Animation Frame
///////////////////////////
/*
Provides requestAnimationFrame in a cross browser way.
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/
win.requestAnimFrame = (function()
{
	return  win.requestAnimationFrame	||
	win.webkitRequestAnimationFrame ||
	win.mozRequestAnimationFrame	||
	win.oRequestAnimationFrame	||
	win.msRequestAnimationFrame	||
	function(callback)
	{
		win.setTimeout(callback, 1000 / 30);
	};
})(); // jshint ignore:line
