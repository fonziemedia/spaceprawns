//====================== Game functions =================//

////////////
// Display
////////////
//making our canvases dynamically resize according to the size of the browser win	//! USE THIS TO SHOW ROTATE SCREEN MSG IF MOBILE AND GAME.WIDTH > GAME HEIGHT
function respondCanvas() {
  game.paused = gameMenu.toggled ? game.paused : true; //promtp to pause the game if called outside game menu
  setGameDimensions();
  game.paused = gameMenu.toggled ? game.paused : false; //prompt to unpause the game if called outside game menu
}

///////////////////
// Input/controls
///////////////////
//vibration
function vibrateDevice(ms) {
  if (game.canVibrate) navigator.vibrate(ms);
}
//Keyboard
$(document).keydown(function (e) {
  //listen to pressed keys
  game.keys[e.keyCode ? e.keyCode : e.which] = true;

  if (game.keys[27] && game.dtTimerSet && !game.gameOver) gameMenu.toggle();
  if (game.keys[80] && game.dtTimerSet && !game.paused && !game.gameOver)
    gameState.pause();
  else if (game.keys[80] && game.dtTimerSet && game.paused && !game.gameOver)
    gameState.unPause();
});

$(document).keyup(function (e) {
  //listen to released keys
  delete game.keys[e.keyCode ? e.keyCode : e.which];
});

function addGamePlayInput() {
  inputAreaX = playerShip.x;
  inputAreaY = playerShip.y;

  inputArea.addEventListener("mousedown", mouseDown, false);
  inputArea.addEventListener("mouseup", mouseUp, false);
  inputArea.addEventListener("mousemove", mouseXY, false);

  inputArea.addEventListener("touchstart", touchDown, false);
  inputArea.addEventListener("touchend", touchUp, false);
  inputArea.addEventListener("touchcancel", touchUp, false);
  inputArea.addEventListener("touchleave", touchUp, false);
  inputArea.addEventListener("touchmove", touchXY, false);
}

//remove this later
function addStandByInput() {
  inputArea.addEventListener("mouseup", standByInput, false);
  inputArea.addEventListener("touchstart", standByInput, false);
}

function removeGamePlayInput() {
  inputArea.removeEventListener("mousedown", mouseDown, false);
  inputArea.removeEventListener("mouseup", mouseUp, false);
  inputArea.removeEventListener("mousemove", mouseXY, false);

  inputArea.removeEventListener("touchstart", touchDown, false);
  inputArea.removeEventListener("touchend", touchUp, false);
  inputArea.removeEventListener("touchcancel", touchUp, false);
  inputArea.removeEventListener("touchleave", touchUp, false);
  inputArea.removeEventListener("touchmove", touchXY, false);
}

function removeStandByInput() {
  inputArea.removeEventListener("mouseup", standByInput, false);
  inputArea.removeEventListener("touchstart", standByInput, false);
}

function mouseUp(e) {
  e.preventDefault();
  mouseIsDown = 0;
  if (!game.isMobile) doc.getElementById("gamearea").style.cursor = "crosshair";
}

function touchUp(e) {
  e.preventDefault();
  mouseIsDown = 0;
}

function mouseDown(e) {
  e.preventDefault();
  mouseIsDown = 1;
  touchInitX = e.pageX - inputArea.offsetLeft;
  touchInitY = e.pageY - inputArea.offsetTop;
  if (!game.isMobile) doc.getElementById("gamearea").style.cursor = "none";
}

function touchDown(e) {
  e.preventDefault();
  mouseIsDown = 1;
  var touch = e.targetTouches[0];

  touchInitX = touch.pageX - touch.target.offsetLeft;
  touchInitY = touch.pageY - touch.target.offsetTop;
}

function mouseXY(e) {
  e.preventDefault();
  inputAreaX = e.pageX - inputArea.offsetLeft;
  inputAreaY = e.pageY - inputArea.offsetTop;
}

function touchXY(e) {
  e.preventDefault();
  var touch = e.targetTouches[0];

  inputAreaX = touch.pageX - inputArea.offsetLeft;
  inputAreaY = touch.pageY - inputArea.offsetTop;
}

//remove this later
function standByInput(e) {
  e.preventDefault();

  if (game.fadingIn) {
    gameLights.fader.stop(true, true);
    gameLights.switch("on");
  }

  if (game.fadingOut) {
    gameLights.fader.stop(true, true);
    gameLights.switch("off");
  }

  if (game.textFadingIn) {
    $(".all-text").stop(true, true);
    gameText.switch("off");
  }

  if (game.textFadingOut) {
    $(".all-text").stop(true, true);
    gameText.switch("off");
  }
}

////////////////////////
// Performance checking        !NEEDS WORK!
////////////////////////
function getDeltaTime() {
  //disabling UI menu button so game.dt calculation doesn't get interrupted
  document.getElementById("toggle-menu-btn").disabled = true;
  //obtaining an average deltaTime
  if (game.dtTimer <= 200) {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - game.timeThen;
    game.dtArray.push(timeDiff); // seconds since last frame
    game.timeThen = timeNow;
    game.dtTimer++;

    if (game.dtTimer == 200) {
      var dtSum = 0;
      var msPerFrame = 0;
      for (var i = 0; i < game.dtArray.length - 10; i++) {
        dtSum += game.dtArray[i + 10]; //+10 skips first values which might be deviant
      }
      msPerFrame = dtSum / game.dtArray.length;
      game.dt = msPerFrame < 16.6 ? 16.6 / msPerFrame : 1; //ratio 60fps ~ 16.66ms/frame; game.dt; compensates lower frame rates by making the game run faster;
      game.dtTimerSet = true;
      document.getElementById("toggle-menu-btn").disabled = false;
    }
  }
}

function updateGameTime() {
  game.timer++;
  game.seconds = game.timer / 60 || 0;
}

function resetGame() {
  //called on level start
  mouseIsDown = 0;
  gameLights.switch("off");

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
  while (en--) {
    game.enemies[en].recycle();
  }

  var obj = game.objects.length;
  while (obj-- && obj > 0) {
    // > 0 excludes playerShip
    game.objects[obj].recycle();
  }

  playerShip.reset();

  gameUI.updateAll();
  gameMusic.pauseAll();

  if (gameMusic.on) {
    gameMusic.playTrack("tune1", true);
  }
}

////////////////////////
// Game Collisions
////////////////////////
function Collision(first, second) {
  //detecting rectangles' (objects) collision
  return !(
    first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y
  );
}

////////////////////////
// The game Loop
////////////////////////
function loop() {
  //the loop
  requestAnimFrame(loop);
  if (!game.paused) {
    update();
  }
}

////////////////////////
// Game start
////////////////////////
function startGame() {
  game.loaded = true;

  if (!(game.objects[0] instanceof player)) {
    game.objects.unshift(new player(10, 15));
    playerShip = game.objects[0];
  }

  gameMusic.chromiumFix();
  gameSfx.chromiumFix();

  if (gameMusic.on) gameMusic.playTrack("tune1", true);

  loop();
}

////////////////////////
// Game Loaders
////////////////////////

function checkObjects() {
  //checking if all objects have been loaded. Once all loaded run init
  if (game.doneObjects >= game.requiredObjects) {
    gameUI.loadingBarClose();
    //starting game menu
    gameMenu.init();
    gameBackground = new background();
  } else {
    gameUI.loadingBarUpdate(game.doneObjects, game.requiredObjects);
    setTimeout(function () {
      checkObjects();
    }, 1);
  }
}

function initObjects() {
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
function windowLoadEvent() {
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
  // win.applicationCache.addEventListener("updateready", appCacheEvent, false);
  //load images
  gameGfx.init();
}

function fullScreenHandler() {
  var fullScreen = $("#toggleFullScreen");

  game.fullScreen = game.fullScreen ? false : true;

  if (game.fullScreen) {
    fullScreen.addClass("active");
    fullScreen.text("Fullscreen: ON");
  } else {
    fullScreen.removeClass("active");
    fullScreen.text("Fullscreen: OFF");
  }
}

function appCacheEvent() {
  win.applicationCache.removeEventListener("updateready", appCacheEvent, false);

  if (win.applicationCache.status == win.applicationCache.UPDATEREADY) {
    // Browser downloaded a new app cache.
    if (confirm("A new version of InVaDeRs is available. Load it?")) {
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

if (fileFormat === ".mp3") {
  // 75ms of silence (minumum Mp3 duration loaded by Safari, not tested other formats thoroughly: may be possible to shrink base64 URI)
  audioTest.src =
    "data:audio/mpeg;base64,//MUxAAB6AXgAAAAAPP+c6nf//yi/6f3//MUxAMAAAIAAAjEcH//0fTX6C9Lf//0//MUxA4BeAIAAAAAAKX2/6zv//+IlR4f//MUxBMCMAH8AAAAABYWalVMQU1FMy45//MUxBUB0AH0AAAAADkuM1VVVVVVVVVV//MUxBgBUATowAAAAFVVVVVVVVVVVVVV";
} else if (fileFormat === ".m4a") {
  audioTest.src =
    "data:audio/x-m4a;base64,AAAAGGZ0eXBNNEEgAAACAGlzb21pc28yAAAACGZyZWUAAAAfbWRhdN4EAABsaWJmYWFjIDEuMjgAAAFoAQBHAAACiG1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAYAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAG0dHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAYAAAAAAAAAAAAAAAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAABUG1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAArEQAAAQAVcQAAAAAAC1oZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU291bmRIYW5kbGVyAAAAAPttaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAL9zdGJsAAAAW3N0c2QAAAAAAAAAAQAAAEttcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAACdlc2RzAAAAAAMZAAEABBFAFQAAAAABftAAAAAABQISCAYBAgAAABhzdHRzAAAAAAAAAAEAAAABAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAXAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAoAAAAYHVkdGEAAABYbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAraWxzdAAAACOpdG9vAAAAG2RhdGEAAAABAAAAAExhdmY1Mi42NC4y";
} else if (fileFormat === ".ogg") {
  audioTest.src =
    "data:audio/ogg;base64,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lFJKKaWUUkoppZRSSimllFJKKaWUUkqppJRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSCgCQinAAkHowoQwUGrISAEgFAACMUUopxpyDEDHmGGPQSSgpYsw5xhyUklLlHIQQUmktt8o5CCGk1FJtmXNSWosx5hgz56SkFFvNOYdSUoux5ppr7qS0VmuuNedaWqs115xzzbm0FmuuOdecc8sx15xzzjnnGHPOOeecc84FAOA0OACAHtiwOsJJ0VhgoSErAYBUAAACGaUYc8456BBSjDnnHIQQIoUYc845CCFUjDnnHHQQQqgYc8w5CCGEkDnnHIQQQgghcw466CCEEEIHHYQQQgihlM5BCCGEEEooIYQQQgghhBA6CCGEEEIIIYQQQgghhFJKCCGEEEIJoZRQAABggQMAQIANqyOcFI0FFhqyEgAAAgCAHJagUs6EQY5Bjw1BylEzDUJMOdGZYk5qMxVTkDkQnXQSGWpB2V4yCwAAgCAAIMAEEBggKPhCCIgxAABBiMwQCYVVsMCgDBoc5gHAA0SERACQmKBIu7iALgNc0MVdB0IIQhCCWBxAAQk4OOGGJ97whBucoFNU6iAAAAAAAAwA4AEA4KAAIiKaq7C4wMjQ2ODo8AgAAAAAABYA+AAAOD6AiIjmKiwuMDI0Njg6PAIAAAAAAAAAAICAgAAAAAAAQAAAAICAT2dnUwAE7AwAAAAAAAD/QwAAAgAAADuydfsFAQEBAQEACg4ODg==";
}

audioTest.preload = "auto";

function testpreload(event) {
  clearTimeout(timeout);
  audioTest.removeEventListener("loadeddata", testpreload);
  audiopreload =
    event !== undefined && event.type === "loadeddata" ? true : false;
}

audioTest.addEventListener("loadeddata", testpreload);
timeout = setTimeout(testpreload, waitTime);

///////////////////////////
// Request Animation Frame
///////////////////////////
/*
Provides requestAnimationFrame in a cross browser way.
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/
win.requestAnimFrame = (function () {
  return (
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame ||
    function (callback) {
      win.setTimeout(callback, 1000 / 30);
    }
  );
})(); // jshint ignore:line
