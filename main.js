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
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
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

function log(label, variable)
{
	var txt = label;
	console.log(txt + ': ' + variable);
}

//iOS viewport fix
if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
{
  document.querySelector('meta[name=viewport]')
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


/////////////////////
// GLOBAL VARS
/////////////////////
var doc = document,
win = window,
game = {};

game.isMobile = false;
// mobile device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) game.isMobile = true;

//====================== Game vars ========================
game.background = [];
game.score = 0;
game.levelScore = 0;
game.level = X_Level;
game.bossDead = false;
game.levelComplete = false;
game.levelUpTimer = 0;
game.lives = X_Lives;
game.keys = [];

game.bullets = [];
	game.playerBulletsPool = [];
	game.enemyBulletsPool = [];
	game.lootPool = [];

game.enemies = [];
	game.enemiesPool = [];

game.waves = [];
	game.wavesPool = [];

game.explosions = [];
	game.explosionsPool = [];

game.requiredWaves = 5;
game.requiredEnemies = 12;
game.requiredPlayerBullets = 70;
game.requiredEnemyBullets = 15;
game.requiredLoot = 5;
game.requiredExplosions = 20;

game.requiredObjects = game.requiredWaves + game.requiredEnemies + game.requiredPlayerBullets + game.requiredEnemyBullets + game.requiredLoot + game.requiredExplosions;
game.doneObjects = 0;

//====================== Delta Time ========================
var dt = 0.017,
dtTimer = 0,
dtArray = [],
timeThen = new Date().getTime();
dtTimerSet = false;

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

//========================== Display ==========================
game.windowWidth = doc.documentElement.clientWidth;
game.windowHeight = doc.documentElement.clientHeight;

game.fullScreen = false;

//========================== Input ==========================
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

// Obtaining Audio ON/OFF status from local storage
if ("localStorage" in win && win.localStorage !== null) //checking browser support for local storage
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

//Our main SOUND players
game.sounds = [];
game.tracks = [];

//SFX vars
game.sfxPaths = [	//used in initSfx function to load our sounds
	"_sounds/_sfx/laser" + fileFormat,
	"_sounds/_sfx/laser" + fileFormat,
	"_sounds/_sfx/laser" + fileFormat,
	"_sounds/_sfx/hit" + fileFormat,
	"_sounds/_sfx/hit" + fileFormat,
	"_sounds/_sfx/hit" + fileFormat,
	"_sounds/_sfx/loot_powerUp" + fileFormat,
	"_sounds/_sfx/loot_powerUp" + fileFormat,
	"_sounds/_sfx/loot_powerUp" + fileFormat,
	"_sounds/_sfx/explosion" + fileFormat,
	"_sounds/_sfx/explosion" + fileFormat,
	"_sounds/_sfx/explosion" + fileFormat,
	"_sounds/_sfx/blast" + fileFormat
];
game.sfx = [];
game.doneSfx  = 0;
game.requiredSfx = 0;

//Sound Tracks vars
game.soundTrackPaths = [	//used in initSfx function to load our sound tracks
	"_sounds/_soundTracks/_lvl1/tune1" + fileFormat,
	"_sounds/_soundTracks/_lvl1/tune2" + fileFormat,
	"_sounds/_soundTracks/_lvl1/victory" + fileFormat,
	"_sounds/_soundTracks/_lvl1/boss" + fileFormat
];
game.soundTracks = [];
game.doneSoundTracks = 0;
game.requiredSoundTracks = 0;

//======================== Graphics ========================
game.images = [];
game.doneImages  = 0; // will contain how many images have been loaded
game.requiredImages = 0; // will contain how many images should be loaded
game.offCtx = [];
game.font = game.isMobile ? "Helvetica" : "Monaco";

if (!game.isMobile || win.innerHeight >= 900)
{
	//Note: UI images are powered by CSS (see CSS assets folder)
	game.imagePaths = [
		//backgrounds
		"_img/bg_level1_a.dkt.jpg",
		"_img/bg_level1_b.dkt.jpg",
		"_img/bg_level1_c.dkt.jpg",
		//Player
		"_img/player_ship.dkt.png",
		"_img/player_ship_i.dkt.png",
		"_img/player_shields.dkt.png",
		//Enemies
			////Pawns
			"_img/enemy_sectoid.dkt.png",
			////Minibosses
			"_img/enemy_floater.dkt.png",
			////Enemy Bases
			"_img/enemy_base_sectoid.dkt.png",
			"_img/enemy_base_floater.dkt.png",
			////Big bosses
			"_img/boss_sectoid.dkt.png",
		//Projectiles
		"_img/bullet_p_laser.dkt.png",
		"_img/bullet_p_missile.dkt.png",
		"_img/bullet_e_missile.dkt.png",
		"_img/explosion_s0.dkt.png",
		"_img/explosion_s1.dkt.png",
		"_img/explosion_s2.dkt.png",
		"_img/explosion_s3.dkt.png",
		"_img/explosion_s4.dkt.png",
		//Loot
		"_img/loot_lasers.dkt.png",
		"_img/loot_missiles.dkt.png",
		"_img/loot_shields.dkt.png"
	];
}
else
{
	game.imagePaths = [
		//backgrounds
		"_img/bg_level1_a.mob.jpg",
		"_img/bg_level1_b.mob.jpg",
		"_img/bg_level1_c.mob.jpg",
		//Player
		"_img/player_ship.mob.png",
		"_img/player_ship_i.mob.png",
		"_img/player_shields.mob.png",
		//Enemies
			////Pawns
			"_img/enemy_sectoid.mob.png",
			////Minibosses
			"_img/enemy_floater.mob.png",
			////Enemy Bases
			"_img/enemy_base_sectoid.mob.png",
			"_img/enemy_base_floater.mob.png",
			////Big bosses
			"_img/boss_sectoid.mob.png",
		//Projectiles
		"_img/bullet_p_laser.mob.png",
		"_img/bullet_p_missile.mob.png",
		"_img/bullet_e_missile.mob.png",
		"_img/explosion_s0.mob.png",
		"_img/explosion_s1.mob.png",
		"_img/explosion_s2.mob.png",
		"_img/explosion_s3.mob.png",
		"_img/explosion_s4.mob.png",
		//Loot
		"_img/loot_lasers.mob.png",
		"_img/loot_missiles.mob.png",
		"_img/loot_shields.mob.png"
	];
}

//====================== Canvases + Responsiveness  ============================
game.canvas = doc.getElementById("gameCanvas");
game.context = game.canvas.getContext("2d");

var pixelRatio = win.devicePixelRatio > 1.5 ? 2 : 1; // This is our game size delta to keep the size of our game + objects proportional to the display
pixelRatio = game.isMobile && pixelRatio < 1.5 ? 2 : pixelRatio; //adjustment for mobile devices with low pixel ratio
pixelRatio = game.isMobile && win.innerHeight >= 900 ? 1 : pixelRatio; //adjusment for tablets

function setGameDimensions()
{
	//SETTING CANVASES ATTRIBUTES
	//Note: the canvas dimensions need to be set here using attributes due to the nature of the canvas element: it works like an image and using css to set this will stretch it

	//get the gameArea and the canvases
	var gameArea = $('#gamearea');
	var allCanvas = $('canvas');

	if (!game.isMobile)
	{
		game.windowWidth = parseInt(gameArea.css("width"))*pixelRatio;  //using parseInt here to remove 'px'
	}

	allCanvas.attr('width', game.windowWidth*pixelRatio);
	allCanvas.attr('height', game.windowHeight*pixelRatio);

	game.context.scale(pixelRatio,pixelRatio);

	//SETTING GAME DIMENSIONS
	game.width = Math.round(game.windowWidth);
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
		playerShip.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
		playerShip.limitX2 = Math.round(game.width - (playerShip.width*0.5));
		playerShip.limitY2 = Math.round(game.height - (playerShip.height*0.5));
		playerShip.movement = Math.round(game.height*0.007);
	}

	//set game bosses' boundaries  !Need to give this enemy a name in the array
	// this.yStop = Math.round(game.height*0.1);
	// this.xBondary = Math.round(game.width - this.size/4);

	if(!game.started && playerShip && typeof playerShip != 'undefined')
	{
		playerShip.x = Math.round(game.width*0.46);
		playerShip.y = Math.round(game.height*0.90);
	}
}

setGameDimensions();

sprite = function(image, columns, rows, animationSpeed)
{
	this.image = game.offCtx[image];
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
	this.image = game.offCtx[image];
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

background = function(section)
{
	this.imageA = game.offCtx['bg_level' + game.level + '_a'];
	this.imageB = game.offCtx['bg_level' + game.level + '_b'];
	this.imageC = game.offCtx['bg_level' + game.level + '_c'];
	this.height = Math.round(this.imageA.height);
	this.width = Math.round(this.imageA.width);
	this.x = this.width <= game.windowWidth ? 0 : Math.round(0 - (this.width-game.windowWidth)/2);
	this.y1 = 0;
	this.y2 = this.y1-this.height;
	this.y3 = this.y2-this.height;
	this.yDrawLimit = !game.isMobile || win.innerHeight >= 900 ? -1080 : -640;
	this.speed = Math.round(200*dt);
	this.ctx = game.context;
};

background.prototype.update = function()
{
	this.y1 += this.speed;
	this.y2 += this.speed;
	this.y3 += this.speed;

	if (this.y1 >= this.yDrawLimit && this.y1 < game.height)
	{
		this.draw(this.imageA, this.x, this.y1);
	}
	else
	{
		this.y1 = this.y3-this.height;
	}

	if (this.y2 >= this.yDrawLimit && this.y2 < game.height)
	{
		this.draw(this.imageB, this.x, this.y2);
	}
	else
	{
		this.y2 = this.y1-this.height;
	}

	if (this.y3 >= this.yDrawLimit && this.y3 < game.height)
	{
		this.draw(this.imageC, this.x, this.y3);
	}
	else
	{
		this.y3 = this.y2-this.height;
	}
};

background.prototype.draw = function(image, x, y)
{
	this.ctx.drawImage(image, x, y);
};

explosion = function (x, y, speed, direction, size, target)
{
	switch(size)
	{
		case 'xSmall':
			this.image = 'explosion_s0';
		break;
		case 'small':
			this.image = 'explosion_s1';
		break;
		case 'medium':
			this.image = 'explosion_s2';
		break;
		case 'large':
			this.image = 'explosion_s3';
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
		break;
	}
	this.sprite = new sprite(this.image, 5, 4, 2);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;
	this.target = target;
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
explosion.prototype.dead = false;
explosion.prototype.audioHit1 = 'hit' + fileFormat;
explosion.prototype.audioHit2 = 'hit2' + fileFormat;
explosion.prototype.audioHit3 = 'hit3' + fileFormat;
explosion.prototype.audioDead1 = 'explosion' + fileFormat;
explosion.prototype.audioDead2 = 'explosion2' + fileFormat;
explosion.prototype.audioDead3 = 'explosion3' + fileFormat;
explosion.prototype.audioExplode = 'blast' + fileFormat;

explosion.prototype.reset = function(x, y, speed, direction, size, target)
{
	switch(size)
	{
		case 'xSmall':
			this.image = 'explosion_s0';
		break;
		case 'small':
			this.image = 'explosion_s1';
		break;
		case 'medium':
			this.image = 'explosion_s2';
		break;
		case 'large':
			this.image = 'explosion_s3';
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
		break;
	}
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.speed = speed;
	this.direction = direction;
	this.target = target;
	this.dead = false;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

explosion.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (this.sprite.currentFrame >= this.sprite.endFrame)
		{
			this.dead = true;
		}
	}
	else
	{
		freeExplosion(this);
	}
};

explosion.prototype.draw = function(x, y)
{
	this.sprite.draw(x, y);
};

explosion.prototype.loadSound = function()
{
	if (game.sound)
  {
  	if (this.target == 'chasis')
  	{
			if (game.sfx[this.audioHit1].paused)
			{
				game.sounds.push(game.sfx[this.audioHit1]);
			}
			else if (game.sfx[this.audioHit2].paused)
			{
				game.sounds.push(game.sfx[this.audioHit2]);
			}
			else if (game.sfx[this.audioHit3].paused)
			{
				game.sounds.push(game.sfx[this.audioHit3]);
			}
    }
		else if (this.target == 'enemy')
		{
			if (game.sfx[this.audioDead1].paused)
			{
				game.sounds.push(game.sfx[this.audioDead1]);
			}
			else if (game.sfx[this.audioDead2].paused)
			{
				game.sounds.push(game.sfx[this.audioDead2]);
			}
			else if (game.sfx[this.audioDead3].paused)
			{
				game.sounds.push(game.sfx[this.audioDead3]);
			}
		}
		else if (this.target == 'player' || this.target == 'boss')
		{
			game.sounds.push(game.sfx[this.audioExplode]);
		}
	}
};

////////////
// Factory
////////////
function getNewExplosion(x, y, speed, direction, size, target)
{
  var e = null;
	//check to see if there is a spare one
	if (game.explosionsPool.length > 0)
	{
	// recycle
	e = game.explosionsPool.pop();
	e.reset(x, y, speed, direction, size, target);
	e.sprite.reset(e.image, 5, 4, 2);
	e.loadSound();
	game.explosions.push(e);
  }
  else
  {
		//none available, construct a new one
		e = new explosion(x, y, speed, direction, size, target);
		e.loadSound();
		game.explosions.push(e);
  }
}

function freeExplosion(e)
{
	// find the active explosion and remove it
	game.explosions.splice(game.explosions.indexOf(e),1);
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
		e = new explosion(null, null, null, null, 'small', null);
		game.explosionsPool.push(e);
		game.doneObjects++;
	}
}

player = function(hull, fireRate)
{
	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.ctx = game.context;
	this.sprite = new sprite('player_ship', 5, 3, 5);
	this.sprite_i = new sprite('player_ship_i', 5, 3, 5);
	this.sprite_s = new sprite('player_shields', 3, 2, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.centerX = Math.round(this.width*0.5);
	this.centerRightX = Math.round(this.width*0.75);
	this.centerLeftX = Math.round(this.width*0.25);
	this.tipY = Math.round(this.height*0.2);
	this.speed = 0;
	this.speedX = 0;
	this.speedY = 0;
	this.hull = hull;
	this.maxHull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.audioFire1 = 'laser' + fileFormat;
	this.audioFire2 = 'laser2' + fileFormat;
	this.audioFire3 = 'laser3' + fileFormat;
	this.xMoving = false;
	this.yMoving = false;
	this.hit = false;
	this.imune = false;
	this.imuneTimer = -5;
	this.imuneTicks = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.lives = X_Lives;
	this.limitX1 = Math.round(-this.width*0.5);
	this.limitX2 = Math.round(game.width - this.width*0.5);
	this.limitY1 = 0;
	this.limitY2 = Math.round(game.height - this.height);
	this.accel = game.height*0.0007;
	this.speedLimit = Math.round(game.height*0.008);

	//====================== Laser bullets =================//
	this.fireTimer = 1;
	this.fireRate = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
};

player.prototype.fireGuns = function()
{
	//only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
	this.fireTimer++;
	if (this.fireTimer % this.fireRate === 0)
	{
		// (x, y, speed, direction, power, friction, image)
		switch(this.laserLevel)
		{
			case 1:
				this.midLaserX = Math.round(this.x + this.centerX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.midLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
			case 2:
				this.leftLaserX = Math.round(this.x + this.centerLeftX);
				this.rightLaserX = Math.round(this.x + this.centerRightX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.leftLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.rightLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
			case 3:
				this.midLaserX = Math.round(this.x + this.centerX);
				this.leftLaserX = Math.round(this.x + this.centerLeftX);
				this.rightLaserX = Math.round(this.x + this.centerRightX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.leftLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.midLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.rightLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
		}
		switch(this.missileLevel)
		{
			case 0:
			break;
			case 1:
				this.midMissileX = Math.round(this.x + this.centerX);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 2:
				this.leftMissileX = Math.round(this.x);
				this.rightMissileX = Math.round(this.x + this.width);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 3:
				this.midMissileX = Math.round(this.x + this.centerX);
				this.leftMissileX = Math.round(this.x);
				this.rightMissileX = Math.round(this.x + this.width);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
		}
	}
};

player.prototype.update = function()
{
	//////////////////////////////
	//	Mouse and Touch controls
	/////////////////////////////
	if (!this.dead)
	{
		if (mouseIsDown && !game.levelComplete)
		{
			if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'none';

			this.fireGuns();

			this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)/pixelRatio);
			this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)/pixelRatio);

			//this needs to come after movement vars above because we redefine this.speedX here
			this.speedX = this.speedX < this.speedLimit ? this.speedX : this.speedLimit;
			this.speedY = this.speedY < this.speedLimit ? this.speedY : this.speedLimit;
			this.speedX = this.speedX > -this.speedLimit ? this.speedX : -this.speedLimit;
			this.speedY = this.speedY > -this.speedLimit ? this.speedY : -this.speedLimit;
		}
		else if (!game.isMobile && (game.keys[37] || game.keys[39] || game.keys[38] || game.keys[40]) && !game.levelComplete)
		{
			if(game.keys[37]) //left
			{
				this.speedX = this.speedX < this.speedLimit ? this.speedX + this.accel : this.speedLimit;
			}
			if(game.keys[39]) //right
			{
				this.speedX = this.speedX > -this.speedLimit ? this.speedX - this.accel : -this.speedLimit;
			}
			if(game.keys[38]) //up
			{
				this.speedY = this.speedY < this.speedLimit ? this.speedY + this.accel : this.speedLimit;
			}
			if(game.keys[40]) //down
			{
				this.speedY = this.speedY > -this.speedLimit ? this.speedY - this.accel : -this.speedLimit;
			}
		}
		else if(!game.levelComplete)
		{
			if (this.speedX !== 0)
			{
				this.speedX = this.speedX > 0 ? Math.round(this.speedX - this.accel) : Math.round(this.speedX + this.accel);
			}

			if (this.speedY !== 0)
			{
				this.speedY = this.speedY > 0 ? Math.round(this.speedY - this.accel) : Math.round(this.speedY + this.accel);
			}

			if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'crosshair';
		}
		else
		{
			this.spriteFrame = 10;
			this.speedX = 0;
			this.speedY = 0;
			this.speed = Math.round(this.speedLimit*2);
			this.y -= this.speed;
		}

		if (!game.isMobile && game.keys[32])
		{
			this.fireGuns();
		}

		this.xMoving = this.speedX !== 0 ? true : false;
		this.yMoving = this.speedY !== 0 ? true : false;

		if (this.xMoving || this.yMoving)
		{
			//thrust
			this.x = this.x - this.speedX;
			this.y = this.y - this.speedY;

			//the bondaries and edge portals
			if (this.x < this.limitX1)
			{
			 this.x = this.limitX2;
			}
			else if (this.x > this.limitX2)
			{
			 this.x = this.limitX1;
			}
			else if (this.y < this.limitY1 && !game.levelComplete)
			{
			 this.y = this.limitY1 - this.speedY;
			}
			else if (this.y > this.limitY2)
			{
			 this.y = this.limitY2 - this.speedY;
			}

			if (this.xMoving)
			{
				//defining different speeds for different sprites
				this.spriteFrame = (this.speedX < -this.accel && this.speedX >= -this.accel*4) ? 5 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*4 && this.speedX >= -this.accel*6) ? 6 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*6 && this.speedX >= -this.accel*8) ? 7 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*8 && this.speedX >= -this.accel*10) ? 8 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*10) ? 9 : this.spriteFrame;

				this.spriteFrame = (this.speedX > 2 && this.speedX >= this.accel*4) ? 0 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*4 && this.speedX >= this.accel*6) ? 1 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*6 && this.speedX >= this.accel*8) ? 2 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*8 && this.speedX >= this.accel*10) ? 3 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*10) ? 4 : this.spriteFrame;

				// log('speedLimit', this.speedLimit);
				// log('speedX', this.speedX);
				// log('speedY', this.speedX);
				// log('accel', this.accel);
				// log('accel*2', this.accel*2);
				// log('accel*4', this.accel*4);
				// log('accel*6', this.accel*6);
				// log('accel*8', this.accel*8);
				// log('accel*10', this.accel*10);
				// log('this.spriteFrame', this.spriteFrame);
			}
		}
		else
		{
			this.spriteFrame = 10;
		}

		this.draw();

		if (this.imune)
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
		}

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

		if (this.hull <= 0 && !this.dead)
		{
			this.dead = true;
			this.lives -= 1;
			getNewExplosion(this.x, this.y, 0, 0, 'large', 'player'); //need to obtain player direction if we want dinamic explosions, for now we just blow it still
			gameUI.updateHangar();
		}
	}
	else if (this.deadTimer <= 100)
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

player.prototype.drawShields = function()
{
	this.sprite_s.draw(this.x - this.width*0.7, this.y - this.height*0.1);
};

player.prototype.draw = function()
{
	if (!this.imune)
	{
		this.sprite.drawFrame(this.x, this.y, this.spriteFrame);
	}
	else if (this.imuneTimer > 0)
	{
		this.sprite_i.drawFrame(this.x, this.y, this.spriteFrame);
	}
};

player.prototype.reset = function()
{
	this.lives = game.gameOver ? X_Lives : this.lives;
	game.gameOver = false;
	this.dead = false;
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
};

var playerShip = null;

playerBullet = function(x, y, speed, direction, power, friction, image)
{
	// this.size = Math.round(bulletSize/pixelRatio);
	this.sprite = new sprite(image, 3, 1, 4);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = speed;
	this.direction = direction;
	this.power = power;
	this.friction = friction;
	//setting these to make friction work with deltaTime (dt), check particle.js
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

playerBullet.prototype.dead = false;
playerBullet.prototype.ctx = game.context;

playerBullet.prototype.reset = function(x, y, speed, power, friction)  //only variable arguments here
{
	//reseting variable properties only (lasers != missiles)
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = speed;
	this.power = power;
	this.friction = friction;
	this.dead = false;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

playerBullet.prototype.update = function()
{
	// Replacing the default 'update' method
	if (!this.dead)
	{
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		//projectiles collision
		for (var e in game.enemies)
		{
			if (Collision(game.enemies[e], this))
			{ //dead check avoids ghost scoring
				game.enemies[e].hull -= this.power;
				if(game.enemies[e].hull > 0)
				{
					getNewExplosion(game.enemies[e].x + game.enemies[e].width*0.5, game.enemies[e].y + game.enemies[e].height*0.5, 0, 1, 'xSmall', 'chasis');
				}
				this.dead = true;
			}
		}

		if (this.y < game.outerTop) //always goes up
		{
			this.dead = true;
		}
	}
	else
	{
		freeBullet(this);
	}
};

playerBullet.prototype.draw = function(x, y)
{
	this.sprite.draw(x, y);
};

////////////
// Factory
////////////
getNewBullet = function(x, y, speed, direction, power, friction, image)
{
	var b = null;
	//check to see if there is a spare one
	if (game.playerBulletsPool.length > 0)
	{
		//recycle
		b = game.playerBulletsPool.pop();
		//(image, columns, rows, animationSpeed)
		b.sprite.reset(image, 3, 1, 4);
    b.reset(x, y, speed, power, friction, image);
		game.bullets.push(b);
	}
	else
	{
		// none available, construct a new one
		b = new playerBullet(x, y, speed, direction, power, friction, image);
		game.bullets.push(b);
	}
};

freeBullet = function(b)
{
	//find the active bullet and remove it
	game.bullets.splice(game.bullets.indexOf(b),1);
	//return the bullet back into the pool
	game.playerBulletsPool.push(b);
};

////////////////////////////////
// Pre-load game player bullets
////////////////////////////////
function initPlayerBullets()
{
	for (var pb = 1 ; pb <= game.requiredPlayerBullets; pb++)
	{
		b = new playerBullet(null, null, null, -Math.PI/2, null, null, 'bullet_p_laser');
		game.playerBulletsPool.push(b);
		game.doneObjects++;
	}
}

enemy = function(x, y, speed, direction, hull, type, image, fireRate)
{
	this.x = x;
	this.y = y;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	this.hull = hull;
	this.sprite = new sprite(image, 6, 5, 5);
	this.type = type;
	switch (type)
	{
		case 'pawn':
			this.explosionSize = 'medium';
		break;
		case 'miniboss':
			this.explosionSize = 'large';
		break;
		case 'base':
			this.width = this.sprite.frameWidth;
			this.height = this.sprite.frameHeight;
			this.explosionSize = 'xLarge';
		break;
	}
	this.fireRate = fireRate * 60; //fireRate = delay in seconds
	this.speed = speed/pixelRatio;
	this.direction = direction;
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
enemy.prototype.bulletTimer = 1;
enemy.prototype.hitTimer = 0;
enemy.prototype.collided = false;
enemy.prototype.dead = false;
enemy.prototype.ctx = game.context;

enemy.prototype.fireMissile = function()
{
		bulletX = Math.round(this.x + this.width*0.42);
		bulletY = Math.round(this.y + this.height);
		getNewEnemyBullet(bulletX, bulletY, 50, utils.angleTo(this, playerShip), 1, 'bullet_e_missile');
};

enemy.prototype.reset = function(x, y, speed, direction, hull, type, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.direction = direction;
	this.hull = hull;
	this.type = type;
	this.image = game.offCtx[image];
	this.fireRate = fireRate * 60; //fireRate = delay in seconds
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	switch (type)
	{
		case 'pawn':
			this.explosionSize = 'medium';
		break;
		case 'miniboss':
			this.explosionSize = 'large';
		break;
		case 'base':
			this.width = this.sprite.frameWidth;
			this.height = this.sprite.frameHeight;
			this.explosionSize = 'xLarge';
		break;
	}
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;
	this.dead = false;
};

enemy.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
		this.x += this.vx;
		this.y += this.vy;

		if (this.type !== 'base' )
		{
			this.direction -= utils.randomRange(-0.05, 0.05);
		}

		this.draw(this.x, this.y);

		if(this.fireRate !== 0)
		{
			this.bulletTimer++;
			if (this.bulletTimer % this.fireRate === 0)
			{
				this.fireMissile();
			}
		}

		// player-enemy collision
		if (Collision(this, playerShip) && !this.dead && !playerShip.imune && !game.gameOver)
		{
			getNewExplosion(playerShip.x, playerShip.y, 0, 1, 'small', 'chasis');	//get new explosion sound for hiting player
			playerShip.hull -= this.hull;
			gameUI.updateEnergy();
			playerShip.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0)
		{
			this.dead = true;
			getNewExplosion(this.x, this.y, this.speed, this.direction, this.explosionSize, 'enemy');

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
		}

		if(this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
		{
			this.dead = true;
		}
	}
	else
	{
		freeEnemy(this);
	}
};

enemy.prototype.draw = function(x, y)
{
	if (this.type !== 'base')
	{
		this.ctx.drawImage(this.image, x, y);
	}
	else
	{
		this.sprite.draw(x, y);
	}
};

////////////
// Factory
////////////
function getNewEnemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
{
	var en = null;
	//check to see if there is a spare one
	if (game.enemiesPool.length > 0)
	{
		//recycle
		en = game.enemiesPool.pop();
		en.sprite.reset(image, 6, 5, 6);
		en.reset(x, y, speed, direction, hull, type, image, fireRate, sheep);
		game.enemies.push(en);
	}
	else
	{
		// none available, construct a new one
		en = new enemy(x, y, speed, direction, hull, type, image, fireRate, sheep);
		game.enemies.push(en);
	}
}

function freeEnemy(en)
{
	//find the active bullet and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the bullet back into the pool
	game.enemiesPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemies()
{
	for (var e = 1 ; e <= game.requiredEnemies; e++)
	{
		en = new enemy(0, 0, 0, 0, 0, 'pawn', 'enemy_sectoid', 0);
		game.enemiesPool.push(en);
		game.doneObjects++;
	}
}

boss = function(x, y, speed, direction, hull, image)
{
	this.speed = speed/pixelRatio;
	this.direction = direction;
	this.hull = hull;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	this.hCenter = Math.round(this.width/2);
	this.x = Math.round(game.centerX - this.hCenter);
	this.y = game.outerTop;
	this.audioHit1 = 'hit' + fileFormat;
	this.audioHit2 = 'hit2' + fileFormat;
	this.audioHit3 = 'hit3' + fileFormat;
	this.dead = false;
	this.deadTimer = 0;
	this.lasersTimer = 1;
	this.missilesTimer = 1;
	this.lasersFireRate = 40;
	this.missilesFireRate = 120;
	this.yStop = Math.round(game.height*0.05);
	this.laser1 = {};
	this.laser2 = {};
	this.laser1.y = Math.round(this.yStop + this.height);
	this.laser2.y = this.laser1.y;
	this.missile1 = {};
	this.missile2 = {};
	this.missile1.y = Math.round(this.yStop + this.height*0.5);
	this.missile2.y = this.missile1.y;
	this.xBondary = Math.round(game.width - this.width);
	this.ctx = game.context;
};

boss.prototype.fireLasers = function()
{
	this.laser1.x = Math.round(this.x + this.width*0.4);
	this.laser2.x = Math.round(this.x + this.width*0.6);
	getNewEnemyBullet(this.laser1.x, this.laser1.y, 250, Math.PI/2, 1.5, 'bullet_p_laser');
	getNewEnemyBullet(this.laser2.x, this.laser2.y, 250, Math.PI/2, 1.5, 'bullet_p_laser');
};

boss.prototype.fireMissiles = function()
{
	this.missile1.x = Math.round(this.x);
	this.missile2.x = Math.round(this.x + this.width);
	getNewEnemyBullet(this.missile1.x, this.missile1.y, 50, utils.angleTo(this.missile1, playerShip), 1, 'bullet_e_missile');
	getNewEnemyBullet(this.missile2.x, this.missile1.y, 50, utils.angleTo(this.missile2, playerShip), 1, 'bullet_e_missile');
};

boss.prototype.update = function()
{
	if (!this.dead)
	{
		if (this.y >= this.yStop) //boss fight AI
		{
			this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
			if (this.x + this.hCenter < (playerShip.x + playerShip.centerX) - this.vx)
			{
				this.direction = 0;
				this.x += this.vx;
			}
			else if (this.x + this.hCenter > (playerShip.x + playerShip.centerX) + this.vx)
			{
				this.direction = Math.PI;
				this.x += this.vx;
			}
			else if (this.x + this.hCenter == playerShip.x + playerShip.centerX)
			{
				this.x = this.x;
			}
		}
		else //enter boss
		{
			this.direction = Math.PI/2;
			this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
			this.x = this.x;
			this.y += this.vy;
		}

		this.draw(this.x, this.y);

		// player-boss collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver)
		{
			playerShip.hull -= this.hull;
			playerShip.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 )
		{
			getNewExplosion(this.x, this.y, this.speed, this.direction, 'xLarge', 'boss');
			if (!playerShip.crashed)
			{
				game.score++;
				game.levelScore++;
				gameUI.updateScore();
				game.bossDead = true;
				this.dead = true;
			}
		}

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

	}
	else
	{
		game.levelUpTimer++; //waiting a few secs before engaging warp speed

		if (game.levelUpTimer == 100)
		{
			game.levelComplete = true;
			gameState.lvlComplete();
			mouseIsDown = 0;
		}
	}
};

boss.prototype.draw = function(x, y)
{
	this.ctx.drawImage(this.image, x, y);
};

enemyBullet = function(x, y, speed, direction, power, image)
{
	this.sprite = new sprite(image, 3, 1, 5);
	this.x = x;
	this.y = y;
	this.power = power;
	this.speed = speed;
	this.direction = direction;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;

	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);

	this.spriteX = -Math.round(this.width*0.5);  //-this.size/2 because we're rotating ctx
	this.spriteY = -Math.round(this.height*0.5);  //-this.size/2 because we're rotating ctx
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
enemyBullet.prototype.dead = false;
enemyBullet.prototype.friction = 1.02;
enemyBullet.prototype.ctx = game.context;

enemyBullet.prototype.reset = function(x, y, speed, direction, power)	//only variable arguments here
{
	this.x = x;
	this.y = y;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;
	this.power = power;
	this.dead = false;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

enemyBullet.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
		{
			getNewExplosion(this.x, this.y, 0, 1, 'xSmall', 'chasis');
			playerShip.hull -= this.power;
			gameUI.updateEnergy();
			playerShip.hit = true;
			this.dead = true;
		}

		if(this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
		{
			this.dead = true;
		}
	}
	else
	{
		freeEnemyBullet(this);
	}
};

enemyBullet.prototype.draw = function(x, y)	//fix this with sprites with diferent angles
{
	this.ctx.save();
	this.ctx.translate(x, y);
	this.ctx.rotate(this.direction - Math.PI/2);

	this.sprite.draw(this.spriteX, this.spriteY);

	this.ctx.restore();
};

////////////
// Factory
////////////
getNewEnemyBullet = function(x, y, speed, direction, power, image)
{
    var eb = null;
    // check to see if there is a spare one
    if (game.enemyBulletsPool.length > 0)
    {
			//recycle
			eb = game.enemyBulletsPool.pop();
			eb.sprite.reset(image, 3, 1, 4);
			eb.reset(x, y, speed, direction, power);
			game.bullets.push(eb);
    }
    else
    {
    	// none available, construct a new one
    	eb = new enemyBullet(x, y, speed, direction, power, image);
    	game.bullets.push(eb);
    }
};

freeEnemyBullet = function(eb)
{
	// find the active bullet and remove it
	game.bullets.splice(game.bullets.indexOf(eb),1);
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
	this.dead = false;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	switch(this.type)
	{
		/* jshint ignore:start */
		case 'health':
			this.image = game.offCtx['loot_shields'];
		break;
		case 'laser':
			this.image = game.offCtx['loot_lasers'];
		break;
		case 'missile':
			this.image = game.offCtx['loot_missiles'];
		break;
		/* jshint ignore:end */
	}
	this.width = this.image.width;
	this.height = this.image.height;
};

loot.prototype.speed = Math.round(250/pixelRatio);
loot.prototype.direction = Math.PI/2;
loot.prototype.dead = false;
loot.prototype.drops = ['health', 'laser', 'missile'];
loot.prototype.sfx1 = 'loot_powerUp' + fileFormat;
loot.prototype.sfx2 = 'loot_powerUp2' + fileFormat;
loot.prototype.sfx3 = 'loot_powerUp3' + fileFormat;
loot.prototype.ctx = game.context;

loot.prototype.reset = function(x, y)
{
	this.x = x;
	this.y = y;
	this.dead = false;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	switch(this.type) {
		/* jshint ignore:start */
		case 'health':
			this.image = game.offCtx['loot_shields'];
		break;
		case 'laser':
			this.image = game.offCtx['loot_lasers'];
		break;
		case 'missile':
			this.image = game.offCtx['loot_missiles'];
		break;
		/* jshint ignore:end */
	}
};

loot.prototype.update = function()
{
	if(!this.dead)
	{
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (Collision(this, playerShip))
		{
			switch(this.type)
			{
		    case 'health':
					if (this.hull <= 7.5)
					{
						playerShip.hull += 2.5;
					}
					else {
						playerShip.hull = 10;
					}
		      gameUI.updateEnergy();
		    break;
		    case 'laser':
		      playerShip.laserLevel = playerShip.laserLevel < 3 ? playerShip.laserLevel + 1 : playerShip.laserLevel;
		    break;
		    case 'missile':
		      playerShip.missileLevel = playerShip.missileLevel < 3 ? playerShip.missileLevel + 1 : playerShip.missileLevel;
		    break;
			}
			if (game.sound)
      {
      	if (game.sfx[this.sfx1].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx1]);
      	}
      	else if (game.sfx[this.sfx2].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx2]);
      	}
      	else if (game.sfx[this.sfx3].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx3]);
      	}
      }
			this.dead = true;
		}

		if (this.y > game.outerBottom) //always goes down
		{
			this.dead = true;
		}
	}
	else
	{
		freeLoot(this);
	}
};

loot.prototype.draw = function(x, y)
{
	this.ctx.drawImage(this.image, x, y);
};

////////////
// Factory
////////////
function getNewLoot(x, y)
{
	var l = null;
	// check to see if there is a spare one
	if (game.lootPool.length > 0)
	{
		//recycle
		l = game.lootPool.pop();
		l.reset(x, y);
		game.bullets.push(l);
	}
	else
	{
		// none available, construct a new one
		l = new loot(x, y);
		game.bullets.push(l);
	}
}

function freeLoot(l)
{
	// find the active bullet and remove it
	game.bullets.splice(game.bullets.indexOf(l),1);
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

var enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
{
	this.side = side;
	this.spawnedShips = 0;
	this.race = race;
	this.type = type;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.fireRate = fireRate;
	this.spawnTimer = 1;
	this.spawnRate = Math.round((1500 * dt)/pixelRatio);
	switch (this.side)
	{
		case 'top':
			this.x = pos;
			this.y = game.outerTop;
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = game.outerLeft;
			this.y = pos;
			this.direction = 0;
			break;
		case 'right':
			this.x = game.outerRight;
			this.y = pos;
			this.direction = Math.PI;
			break;
	}
	this.over = false;

	this.update = function()
	{
		if(!this.over)
		{
			this.spawnTimer++;

			if (this.spawnTimer % this.spawnRate === 0)
			{
					this.spawnFireRate = Math.round(utils.randomRange(this.fireRate, this.fireRate*2)); //a randomRange so that each ship fires at it's own time
					getNewEnemy(this.x, this.y, this.speed, this.direction, this.hull, this.type, this.race, this.spawnFireRate);
					this.spawnedShips++;
			}

			if (this.spawnedShips == this.fleetSize)
			{
				this.over = true;
			}
		}
		else
		{
			freeEnemyWave(this);
		}
	};
};

////////////
// Factory
////////////
function getNewEnemyWave(side, pos, race, type, fleetSize, speed, hull, fireRate)
{
  var ew = null;
  //check to see if there is a spare one
  if (game.wavesPool.length > 0)
  {
  	//recycle
    ew = game.wavesPool.pop();
    ew.side = side;
		ew.spawnedShips = 0;
		ew.race = race;
		ew.type = type;
		ew.fleetSize = fleetSize;
		ew.speed = speed;
		ew.hull = hull;
		ew.fireRate = fireRate;
		ew.spawnTimer = 1;
		ew.spawnRate = Math.round(1500 * dt);
		switch (ew.side)
		{
			case 'top':
				ew.x = pos;
				ew.y = game.outerTop;
				ew.direction = Math.PI/2;
			break;
			case 'left':
				ew.x = game.outerLeft;
				ew.y = pos;
				ew.direction = 0;
			break;
			case 'right':
				ew.x = game.outerRight;
				ew.y = pos;
				ew.direction = Math.PI;
			break;
		}
		ew.over = false;
  	game.waves.push(ew);
  }
  else
  {
		//none available, construct a new one
		ew = new enemyWave(side, pos, race, type, fleetSize, speed, hull, fireRate);
		game.waves.push(ew);
  }
}

function freeEnemyWave(ew)
{
	// find the active bullet and remove it
	game.waves.splice(game.waves.indexOf(ew),1);
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

ui = function()
{
	this.uiAll = $('#ui');
	this.uiLevel = doc.getElementById("uiLevel");
	this.uiScore = doc.getElementById("uiScore");
	this.uiEBar = doc.getElementById("uiEBar");
	this.uiHangar = doc.getElementById("uiHangarList");
	this.effectDuration = 800;
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

gameUI = new ui();

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

text = function(header1, header2, inputRequired)
{
	this.h1 = $('#h1'); //remove jquery here
	this.h2 = $('#h2');
	this.h3 = $('#h3');
	this.h1Text = header1;
	this.h2Text = header2;
	this.h3Text = game.isMobile ? 'Tap screen to continue' : 'Press ENTER or LMB to continue';
	this.allText = $('.all-text');
	this.textInput = inputRequired;
	this.effectDuration = 2000;

	this.init();
};

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

state = function() {};

state.prototype.start = function()
{
	vibrateDevice(15);
	//disabling buttons so we don't this function more than once
	document.getElementById("resumeGame").disabled = true;
	document.getElementById("startGame").disabled = true;

	gameState.pause();
	gameLights.switch('off');

	removeGamePlayInput();
	addStandByInput();

	if (gameMenu.toggled) //if the game menu is up toggle it off
	{
		gameMenu.toggle();
	}

	if(!game.started) //checking if we're starting a new game or restarting
	{
		game.started = true; //this needs to be set after gameMenu.toggle() or will break resume button
	}
	else
	{
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
					$('#inputarea').on('mousedown touchstart', function()
					{
						//only trigger this event listner once text animations have ended
						$('#inputarea').off('mousedown touchstart');
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

	$('#inputarea').on('mousedown touchstart', function()
	{
		$('#inputarea').off('mousedown touchstart');
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

	$('#inputarea').on('mousedown touchstart', function()
	{
		$('#inputarea').off('mousedown touchstart');
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
	gameUI.updateAll();
	gameUI.fade('in');
};

gameState = new state();

menu = function()
{
	self = this;
	this.menuBg = $('#menuBackground');
	this.resumeBtn = $('#resumeGame');
	this.startBtn = $('#startGame');
	this.soundFx = $('#toggleSound');
	this.music = $('#toggleMusic');
	this.fullScreen = $('#toggleFullScreen');
	this.credits = $('#credits');
	this.allButtons = $('.menu-option-btn');
	this.animationSpeed = 800;
	this.toggled = false;

	doc.addEventListener("fullscreenchange", this.fullScreenHandler);
	doc.addEventListener("webkitfullscreenchange", this.fullScreenHandler);
	doc.addEventListener("mozfullscreenchange", this.fullScreenHandler);
	doc.addEventListener("MSFullscreenChange", this.fullScreenHandler);
};

menu.prototype.fullScreenHandler = function()
{
	game.fullScreen = game.fullScreen ? false : true;

  if (game.fullScreen)
  {
		self.fullScreen.addClass('active');
		self.fullScreen.text('Fullscreen: ON');
  }
  else
  {
		self.fullScreen.removeClass('active');
		self.fullScreen.text('Fullscreen: OFF');
  }
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

menu.prototype.toggleMusic = function()
{
	vibrateDevice(15);
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
	else if (game.started && game.tracks.length < 1)
	{
		game.tracks.push(game.soundTracks['tune1' + fileFormat]);

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


menu.prototype.toggle = function()
{
	var self = this;
	document.getElementById("toggle-menu-btn").disabled = true;
	this.toggled = this.toggled ? false : true;

	// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
	if (this.toggled)
	{
		gameState.pause();

		this.allButtons.css({"display": "block"});

		this.menuBg.fadeIn(this.animationSpeed);
		this.menuBg.promise().done(function()
		{
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

			self.soundFx.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			self.music.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			self.fullScreen.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			self.credits.animate({
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

		this.soundFx.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		this.music.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.fullScreen.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		this.credits.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.allButtons.promise().done(function()
		{
			self.allButtons.hide();
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

	if (localStorage.fullScreen === 'true') //note = localStorage will only process string values
	{
		this.fullScreen.addClass('active');
		this.fullScreen.text('Fullscreen: ON');
	}
	else
	{
		this.fullScreen.removeClass('active');
		this.fullScreen.text('Fullscreen: OFF');
	}

	gameMenu.toggle();
};

gameMenu = new menu();

function update()
{
	////////////////////////
	// Init
	///////////////////////
	clrCanvas();
	gameBackground.update();

	if(!dtTimerSet)
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
	// Game objects	**!Load in order of appearance (bottom layer 1st)!**
	/////////////////////////////////////////////////////////////////////
	if (game.enemies.length > 0);
	{
		var ew = game.waves.length;
		while (ew--)
		{
		    game.waves[ew].update();
		}

		var en = game.enemies.length;
		while (en--)
		{
		    game.enemies[en].update();
		}
	}

	if (game.bullets.length > 0);
	{
		var b = game.bullets.length;
		while (b--)
		{
		    game.bullets[b].update();
		}
	}

	playerShip.update();

	if (game.explosions.length > 0);
	{
		var e = game.explosions.length;
		while (e--)
		{
		    game.explosions[e].update();
		}
	}

	///////////////////////////////////
	// Game Sounds
	///////////////////////////////////
	if (game.sounds.length > 0)
	{
		for(var s in game.sounds)
		{
			game.sounds[s].play();
			game.sounds[s].addEventListener("paused", game.sounds.splice(s,1));
		}
	}

	// ///////////////////////////////////
	// // D3BUG3R!
	// ///////////////////////////////////
	// console.log (dt);
	// console.log(fileFormat);
	//
	// console.log ('game width:' + game.width);
	// console.log ('game height:' + game.height);
	//
	// console.log(win.devicePixelRatio);
	// console.log(win.outerHeight);
	// console.log(win.outerWidth);

	// ///////////////////////////////////
	// // GAME ARRAYS
	// ///////////////////////////////////
	// console.log('keys: '+ game.keys.length);
	// console.log('playerBulletsPool: '+ game.playerBulletsPool.length);
  // console.log('bulletsActive: ' + game.bullets.length);
	// console.log('enemies: '+ game.enemies.length);
	// console.log('Waves pool: ' + game.wavesPool.length);
	// console.log('Waves active: ' + game.waves.length);
  // console.log('pool: ' + game.lootPool.length);
  // console.log('active: ' + game.bullets.length);
	// console.log('explosions: '+ game.explosions.length);
	// console.log(dtArray.length);
	// console.log(audiopreload);
	// console.log('required soundSfx:' + game.requiredSfx);
	// console.log('sfx: '+ game.sfx.length);
	// console.log('required soundTracks:' + game.requiredSoundTracks);
	// console.log('soundtracks: '+ game.soundTracks.length);
	// console.log('sounds: '+ game.sounds.length);
	// console.log ('game tracks: ' + game.tracks);
	// console.log('tracks: '+ game.tracks.length);
	// console.log('images: '+ game.images.length);
	// console.log('reqImages: ' + game.requiredImages);
	// console.log('doneImages: ' + game.doneImages);

	// ///////////////////////////////////
	// // TOUCH INPUT
	// ///////////////////////////////////
	// console.log('touchInitX:' + touchInitX);
	// console.log('touchInitY:' + touchInitY);
	// console.log('inputAreaX:' + inputAreaX);
	// console.log('inputAreaY:' + inputAreaY);
}

var level1 = {};

// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
level1.second1 = function ()
{
	getNewEnemyWave('left', game.width*0.3, 'enemy_sectoid', 'pawn', 1, 300, 1, 0);
	getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 'pawn', 1, 250, 1, 0);
};

level1.second3 = function ()
{
  getNewEnemyWave('left', game.height*0.5, 'enemy_sectoid', 'pawn', 1, 250, 1, 0);
  getNewEnemyWave('right', game.height*0.5, 'enemy_sectoid', 'pawn', 1, 300, 1, 0);
};

level1.second5 = function ()
{
  getNewEnemy(game.width * 0.7, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second7 = function ()
{
  getNewEnemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'enemy_base_sectoid', 1);
};

level1.second8 = function ()
{
  getNewEnemyWave('left', game.height*0.3, 'enemy_sectoid', 'pawn', 4, 250, 1, 3);
};

level1.second9 = function ()
{
  getNewEnemyWave('right', game.height*0.2, 'enemy_sectoid', 'pawn', 3, 300, 1, 3);
};

level1.second10 = function ()
{
  getNewEnemyWave('top', game.width*0.5, 'enemy_sectoid', 'pawn', 6, 300, 1, 3);
};

level1.second11 = function ()
{
  getNewEnemyWave('top', game.width*0.7, 'enemy_sectoid', 'pawn', 4, 300, 1, 3);
};

level1.second12 = function ()
{
  getNewEnemyWave('left', game.height*0.2, 'enemy_sectoid', 'pawn', 3, 300, 1, 3);
};

level1.second13 = function ()
{
  getNewEnemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'enemy_base_floater', 1);
};

level1.second15 = function ()
{
  getNewEnemyWave('top', game.width*0.2, 'enemy_sectoid', 'pawn', 2, 300, 1, 2);
};

level1.second16 = function ()
{
  getNewEnemyWave('top', game.width*0.4, 'enemy_sectoid', 'pawn', 3, 300, 1, 2);
};

level1.second17 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second18 = function ()
{
  getNewEnemyWave('top', game.width*0.8, 'enemy_sectoid', 'pawn', 5, 300, 1, 2);
};

level1.second22 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second25 = function ()
{
  getNewEnemyWave('left', game.width*0.4, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second27 = function ()
{
  getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second30 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second33 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second35 = function ()
{
  getNewEnemyWave('right', game.width*0.2, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second37 = function ()
{
  getNewEnemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second38 = function ()
{
  getNewEnemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second39 = function ()
{
  getNewEnemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second40 = function ()
{
  getNewEnemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second41 = function ()
{
  getNewEnemy(game.width * 0.5, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second42 = function ()
{
  getNewEnemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second43 = function ()
{
  getNewEnemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second44 = function ()
{
  getNewEnemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second45 = function ()
{
  getNewEnemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.update = function ()
{
	if (game.seconds > 13 && game.tracks.length < 2 && game.enemies.length > 0 && !game.bossDead) //NEEDS WORK
	{
		if(game.music)
		{
			game.tracks.push(game.soundTracks['tune2' + fileFormat]);
			game.tracks[1].play();
			game.tracks[1].loop = true;
		}
	}
	if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead)
	{
		if (game.music)
		{
			game.tracks.push(game.soundTracks['boss' + fileFormat]);
			game.tracks[2].play();
			game.tracks[2].loop = true;
		}
		game.enemies.push(new boss(game.width*0.3, game.outerTop, 150, Math.PI/2, 100, 'boss_sectoid'));
	}

	if (game.seconds > 55 && game.enemies.length === 0 && game.bossDead && game.tracks.length == 3)
	{
		game.tracks[0].pause();
		game.tracks[1].pause();
		game.tracks[2].pause();
		game.tracks=[];
		if (game.music && game.tracks.length === 0)
		{
			game.tracks.push(game.soundTracks['victory' + fileFormat]);
		}

		game.tracks[0].play();
	}
};
//boss(x, y, speed, direction, hull, image)
// };

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
// Performance checking
////////////////////////
function getDeltaTime()
{
	//disabling UI menu button so dt calculation doesn't get interrupted
	document.getElementById("toggle-menu-btn").disabled = true;
	//obtaining an average deltaTime
	if(dtTimer <= 200)
	{
		var timeNow = new Date().getTime();
		var timeDiff = timeNow - (timeThen);
		dtArray.push(timeDiff); // seconds since last frame
		timeThen = timeNow;
		dtTimer++;

		if(dtTimer == 200)
		{
			var dtSum = 0;
			for( var i = 0; i < dtArray.length-10; i++)
			{
			dtSum += dtArray[i+10]; //+10 skips first values which might be deviant
			// console.log (dtSum);
			}
			dt = Math.ceil(dtSum / dtArray.length)/1000;
			dtTimerSet = true;
			document.getElementById("toggle-menu-btn").disabled = false;
		}
	}
}

function updateGameTime()
{
	game.timer++;
	game.seconds = game.timer/60 || 0;
}

function clrCanvas()
{
	game.context.clearRect(0, 0, game.width, game.height);
}

function resetGame() //called on level start
{
	mouseIsDown = 0;
	gameLights.switch('off');
	clrCanvas();

	//Game state
	game.bossDead = false;
	game.levelComplete = false;

	//Timers
	game.timer = 0;
	game.levelUpTimer = 0;

	//Objects
	playerShip.reset();
	game.bullets = [];
	game.explosions = [];
	game.enemies = [];
	game.waves = [];
	game.loot = [];
	gameUI.updateAll();

	//Sounds
	game.sounds = [];
	for(var g in game.tracks)
	{
		game.tracks[g].pause();
	}
	game.tracks = [];

	if (game.music && game.tracks.length < 1)
	{
		game.tracks.push(game.soundTracks['tune1' + fileFormat]);
		game.tracks[0].play();
		game.tracks[0].loop = true;
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

	if (typeof win[playerShip] === "undefined")
	{
		playerShip = new player(10, 15);
	}

	//preparing sound tracks (chromium fix)
	game.tracks.push(game.soundTracks['tune1' + fileFormat]);
	game.tracks.push(game.soundTracks['tune2' + fileFormat]);
	game.tracks.push(game.soundTracks['boss' + fileFormat]);
	game.tracks.push(game.soundTracks['victory' + fileFormat]);

	for (var t in game.tracks)
	{
		game.tracks[t].play();
		game.tracks[t].pause();
	}

	game.tracks = [];

	//preparing soundfx (chromium fix)
	game.sounds.push(game.sfx['laser' + fileFormat]);
	game.sounds.push(game.sfx['laser2' + fileFormat]);
	game.sounds.push(game.sfx['laser3' + fileFormat]);
	game.sounds.push(game.sfx['hit' + fileFormat]);
	game.sounds.push(game.sfx['hit2' + fileFormat]);
	game.sounds.push(game.sfx['hit3' + fileFormat]);
	game.sounds.push(game.sfx['loot_powerUp' + fileFormat]);
	game.sounds.push(game.sfx['loot_powerUp2' + fileFormat]);
	game.sounds.push(game.sfx['loot_powerUp3' + fileFormat]);
	game.sounds.push(game.sfx['explosion' + fileFormat]);
	game.sounds.push(game.sfx['explosion2' + fileFormat]);
	game.sounds.push(game.sfx['explosion3' + fileFormat]);
	game.sounds.push(game.sfx['blast' + fileFormat]);

	for (var s in game.sounds)
	{
		game.sounds[s].play();
		game.sounds[s].pause();
	}

	game.sounds = [];

	loop();
}

////////////////////////
// Game Loaders
////////////////////////

//====================== Loading bars =================//
var loadingBar = $('#loadingBar');
var loadingBarFiller = $('#loadingBarFiller');
var loadingText = new text('Loading Images.. ', '', false);
loadingText.switch('on');
loadingBar.show();

//====================== Images engine =================//
function imgEventHandler ()
{
	this.removeEventListener("load", imgEventHandler, false);

	var indexName, ctxName, offCanvas, offCtx;

	indexName = this.src.split("/").pop();
	indexName = indexName.substr(0, indexName.indexOf('.')) || indexName;

	offCanvas = doc.createElement('canvas');
	offCanvas.width = Math.round(this.width);
	offCanvas.height = Math.round(this.height);

	offCtx = offCanvas.getContext('2d');
	offCtx.drawImage(this, 0, 0, offCanvas.width, offCanvas.height);
	game.offCtx[indexName] = offCanvas;

	game.doneImages++;
}

function initImages(ipaths) { //our images engine: passing the array 'ipaths' to the function
	game.requiredImages = ipaths.length; //the number of required images will be equal to the length of the ipaths array
	for(var i in ipaths)
	{
		var img = new Image(); //defining img as a new image

		img.addEventListener("load", imgEventHandler, false); // !event listner needs to be set before loading the image (defining .src)

		img.src = ipaths[i];
		var imgIndex = img.src.split("/").pop(); //obtaining file name from path

		//!check if you should change this to object notation! you can't access array functions like this anyway
		game.images[imgIndex] = img; //defining game.image[index] as a new image (with ipaths)
	}
}

//====================== Audio engine =================//
function sfxEventHandler()
{
	this.removeEventListener("canplaythrough", sfxEventHandler, false);
	game.doneSfx++;
}

function stEventHandler()
{
	this.removeEventListener("canplaythrough", stEventHandler, false);
	game.doneSoundTracks++;
}

function initSfx(sfxPaths) { //our Sfx engine: passing the array 'sfxPaths' to the function
	game.requiredSfx = sfxPaths.length; //the number of required Sfx will be equal to the length of the sfxPaths array

	for(var i in sfxPaths)
	{
		var sfx = new Audio(); //defining sfx as a new Audio
		sfx.src = sfxPaths[i]; //defining new Audio src as stPaths[i]

		var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path and setting our sfxIndex as such

		var sfxIndexInstance; //to keep track of sounds which use the same audio source and avoding duplicate indexes

		if (!(sfxIndex in game.sfx)) //if index is unique
		{
			sfxIndexInstance = 1;
			game.sfx[sfxIndex] = sfx;
		}
		else //if not increase our index instance and add it to its label
		{
			sfxIndexInstance++;
			sfxIndex = sfx.src.match(/([^\/]+)(?=\.\w+$)/)[0] + sfxIndexInstance + fileFormat;
			game.sfx[sfxIndex] = sfx;
		}

		if(audiopreload)
		{
			game.sfx[sfxIndex].preload = "auto";
			//checking if sfx have loaded
			game.sfx[sfxIndex].addEventListener("canplaythrough", sfxEventHandler, false);
		}
		else
		{
			game.doneSfx++;
		}
	}
}

function initSoundTracks(stPaths)
{ //our Sfx engine: passing the array 'stPaths' to the function
	game.requiredSoundTracks = stPaths.length; //the number of required SoundTracks will be equal to the length of the stPaths array

	for(var i in stPaths)
	{
		var soundTracks = new Audio(); //defining soundTracks as a new Audio
		soundTracks.src = stPaths[i];

		var soundTracksIndex = soundTracks.src.split("/").pop(); //obtaining file name from path

		game.soundTracks[soundTracksIndex] = soundTracks; //defining game.soundTracks[soundTracksIndex] as a new Audio (with stPaths)

		if(audiopreload)
		{
			game.soundTracks[soundTracksIndex].preload = "auto";
			//checking if st's have loaded
			game.soundTracks[soundTracksIndex].addEventListener("canplaythrough", stEventHandler, false);
		}
		else
		{
			game.doneSoundTracks++;
		}
	}
}

function checkImages(){	//checking if all images have been loaded. Once all loaded run initSfx
	if(game.doneImages >= game.requiredImages){
		loadingText = new text('Loading Sfx.. ', '', false);
		loadingBarFiller.css({"width": "0"});
		initSfx(game.sfxPaths);
		checkSfx();
	}
	else
	{
		loadingBarWidth = (game.doneImages / game.requiredImages) * 100 + '%';
		loadingBarFiller.css({"width": loadingBarWidth});
		setTimeout(function(){
			checkImages();
		}, 1);
	}
}

function checkSfx()
{
	//checking if all Sfx have been loaded. Once all loaded run init
	if(game.doneSfx >= game.requiredSfx){
		loadingText = new text('Loading Sound Tracks.. ', '', false);
		loadingBarFiller.css({"width": "0"});

		//start loading sound tracks
		initSoundTracks(game.soundTrackPaths);
		checkSoundTracks();
	}
	else
	{
		loadingBarWidth = (game.doneSfx / game.requiredSfx) * 100 + '%';
		loadingBarFiller.css({"width": loadingBarWidth});
		setTimeout(function(){
			checkSfx();
		}, 1);
	}
}

function checkSoundTracks()
{
	//checking if all Sfx have been loaded. Once all loaded run init
	if(game.doneSoundTracks >= game.requiredSoundTracks)
	{
		loadingText = new text('Loading Assets.. ', '', false);
		loadingBarFiller.css({"width": "0"});
		//starting game menu
		initObjects();
		checkObjects();
	}
	else
	{
		loadingBarWidth = (game.doneSoundTracks / game.requiredSoundTracks) * 100 + '%';
		loadingBarFiller.css({"width": loadingBarWidth});
		setTimeout(function()
		{
			checkSoundTracks();
		}, 1);
	}
}

function checkObjects()
{
	//checking if all objects have been loaded. Once all loaded run init
	if(game.doneObjects >= game.requiredObjects){
		loadingText.switch('off');
		loadingBar.hide();
		//starting game menu
		gameMenu.init();
		gameBackground = new background();
	}
	else
	{
		loadingBarWidth = (game.doneObjects / game.requiredObjects) * 100 + '%';
		loadingBarFiller.css({"width": loadingBarWidth});
		setTimeout(function(){
			checkObjects();
		}, 1);
	}
}

function initObjects()
{
	initWaves();
	initEnemies();
	initEnemyBullets();
	initPlayerBullets();
	initExplosions();
	initLoot();
}

function toggleSound()
{
	game.sound = game.sound ? false : true ;
	localStorage.prawnsSound =  game.sound;
}

function toggleMusic()
{
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
		game.tracks.push(game.soundTracks['tune1' + fileFormat]);

		for(var w in game.tracks)
		{
			game.tracks[w].play();
			game.tracks[w].loop = true;
		}
	}
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
	//check for updates appcache
	win.applicationCache.addEventListener("updateready", appCacheEvent, false);
	//load images
	initImages(game.imagePaths);
	//start checking loaded game assets
	checkImages();
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
win.addEventListener("load", windowLoadEvent,false);


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
