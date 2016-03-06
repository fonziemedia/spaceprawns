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

	if (game.keys[27] && dtTimerSet && !game.gameOver) gameMenu.toggle();
	if (game.keys[80] && dtTimerSet && !game.paused && !game.gameOver) gameState.pause();
	else if (game.keys[80] && dtTimerSet && game.paused && !game.gameOver) gameState.unPause();
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
	initEnemyMinions();
	initEnemyMiniBosses();
	initEnemyBases();
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
	audioTest.src = 'data:audio/ogg;base64,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lFJKKaWUUkoppZRSSimllFJKKaWUUkqppJRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSCgCQinAAkHowoQwUGrISAEgFAACMUUopxpyDEDHmGGPQSSgpYsw5xhyUklLlHIQQUmktt8o5CCGk1FJtmXNSWosx5hgz56SkFFvNOYdSUoux5ppr7qS0VmuuNedaWqs115xzzbm0FmuuOdecc8sx15xzzjnnGHPOOeecc84FAOA0OACAHtiwOsJJ0VhgoSErAYBUAAACGaUYc8456BBSjDnnHIQQIoUYc845CCFUjDnnHHQQQqgYc8w5CCGEkDnnHIQQQgghcw466CCEEEIHHYQQQgihlM5BCCGEEEooIYQQQgghhBA6CCGEEEIIIYQQQgghhFJKCCGEEEIJoZRQAABggQMAQIANqyOcFI0FFhqyEgAAAgCAHJagUs6EQY5Bjw1BylEzDUJMOdGZYk5qMxVTkDkQnXQSGWpB2V4yCwAAgCAAIMAEEBggKPhCCIgxAABBiMwQCYVVsMCgDBoc5gHAA0SERACQmKBIu7iALgNc0MVdB0IIQhCCWBxAAQk4OOGGJ97whBucoFNU6iAAAAAAAAwA4AEA4KAAIiKaq7C4wMjQ2ODo8AgAAAAAABYA+AAAOD6AiIjmKiwuMDI0Njg6PAIAAAAAAAAAAICAgAAAAAAAQAAAAICAT2dnUwAE7AwAAAAAAAD/QwAAAgAAADuydfsFAQEBAQEACg4ODg==';
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
