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
