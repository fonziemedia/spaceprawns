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

			if (game.music && game.tracks.length < 1){
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

			// var loadedSfx = 0;

			gameMenu.toggle();

			resetGame();			

			//preparing sound tracks (chromium fix)
			game.tracks.push(game.soundTracks['tune1.' + fileFormat]);
			game.tracks.push(game.soundTracks['tune2.' + fileFormat]);
			game.tracks.push(game.soundTracks['boss.' + fileFormat]);
			game.tracks.push(game.soundTracks['victory.' + fileFormat]);

			for (var t in game.tracks){
				game.tracks[t].play();
				game.tracks[t].pause();			
			}

			game.tracks = [];

			//preparing soundfx (chromium fix)
			game.sounds.push(game.sfx['laser.' + fileFormat]);
			game.sounds.push(game.sfx['laser2.' + fileFormat]);
			game.sounds.push(game.sfx['laser3.' + fileFormat]);
			game.sounds.push(game.sfx['hit.' + fileFormat]);
			game.sounds.push(game.sfx['hit2.' + fileFormat]);
			game.sounds.push(game.sfx['hit3.' + fileFormat]);
			game.sounds.push(game.sfx['loot_powerUp.' + fileFormat]);
			game.sounds.push(game.sfx['loot_powerUp2.' + fileFormat]);
			game.sounds.push(game.sfx['loot_powerUp3.' + fileFormat]);
			game.sounds.push(game.sfx['explosion.' + fileFormat]);
			game.sounds.push(game.sfx['explosion2.' + fileFormat]);
			game.sounds.push(game.sfx['explosion3.' + fileFormat]);
			game.sounds.push(game.sfx['blast.' + fileFormat]);

			for (var s in game.sounds){
				game.sounds[s].play();
				game.sounds[s].pause();
			}
		
			game.sounds = [];			
							

			// game.music[q].addEventListener("ended", game.music.splice(q,1));
			
			//setting alpha = 0
			gameLights.off('all');

			// !! Not sure if this double check is required to reduce sound latency at start			
			// function checkLoadedSfx ()
			// {
			
			// 	if (loadedSfx >= game.requiredSfx)
			// 	{
			// 		game.started = true;
			// 		game.paused = false;
			// 		gameUI.updateAll();
			// 		loop();
			// 	}
			// 	else
			// 	{
			// 		setTimeout(function(){
			// 			checkLoadedSfx();
			// 			console.log(loadedSfx);
			// 			console.log(game.requiredSfx);
			// 		}, 1);
			// 	}
			// }
			// checkLoadedSfx();

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
				var sfx = new Audio(); //defining sfx as a new Audio					
				sfx.src = sfxPaths[i]; //defining new Audio src as stPaths[i]

				var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path
				


				if (!(sfxIndex in game.sfx))
				{
					game.sfx[sfxIndex] = sfx; //defining game.Sfx[sfxIndex] as a new Audio (with sfxPaths)
				}
				else if (sfxIndex in game.sfx)
				{
					sfxIndex = sfx.src.match(/([^\/]+)(?=\.\w+$)/)[0] + 2 + '.' + fileFormat;

					if (!(sfxIndex in game.sfx))
					{
						game.sfx[sfxIndex] = sfx; //defining game.Sfx[sfxIndex] as a new Audio (with sfxPaths)
					}
					else
					{
						sfxIndex = sfx.src.match(/([^\/]+)(?=\.\w+$)/)[0] + 3 + '.' + fileFormat;
						game.sfx[sfxIndex] = sfx;
					}

				}
				
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
				var soundTracks = new Audio(); //defining soundTracks as a new Audio
				soundTracks.src = stPaths[i];

				var soundTracksIndex = soundTracks.src.split("/").pop(); //obtaining file name from path

				game.soundTracks[soundTracksIndex] = soundTracks; //defining game.soundTracks[soundTracksIndex] as a new Audio (with stPaths)

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
					"_sounds/_sfx/laser." + fileFormat,			
					"_sounds/_sfx/laser." + fileFormat,			
					"_sounds/_sfx/hit." + fileFormat,			
					"_sounds/_sfx/hit." + fileFormat,			
					"_sounds/_sfx/hit." + fileFormat,			
					"_sounds/_sfx/loot_powerUp." + fileFormat,			
					"_sounds/_sfx/loot_powerUp." + fileFormat,			
					"_sounds/_sfx/loot_powerUp." + fileFormat,			
					"_sounds/_sfx/explosion." + fileFormat,			
					"_sounds/_sfx/explosion." + fileFormat,			
					"_sounds/_sfx/explosion." + fileFormat,			
					"_sounds/_sfx/blast." + fileFormat		
				]);
				//checking if sfx have loaded
				//!!Improve this, try using a pre loaded function on the event listener with an argument for the sfx index, then put the event listener on the initSfx for loop
				game.sfx['laser.' + fileFormat].addEventListener("canplaythrough", function event(){ //once sound loads..
					game.sfx['laser.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['laser2.' + fileFormat].addEventListener("canplaythrough", function event(){ //once sound loads..
					game.sfx['laser2.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['laser3.' + fileFormat].addEventListener("canplaythrough", function event(){ //once sound loads..
					game.sfx['laser3.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['hit.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['hit.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['hit2.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['hit2.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['hit3.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['hit3.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['loot_powerUp.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['loot_powerUp.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['loot_powerUp2.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['loot_powerUp2.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['loot_powerUp3.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['loot_powerUp3.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});				
				game.sfx['explosion.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['explosion.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['explosion2.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['explosion2.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
				game.sfx['explosion3.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['explosion3.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});				
				game.sfx['blast.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.sfx['blast.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSfx++;
				});
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
				
				//remove event listerner which are not required anymore
				// game.sfx['laser.' + fileFormat].removeEventListener("canplaythrough");
				// game.sfx['hit.' + fileFormat].removeEventListener("canplaythrough");
				// game.sfx['loot_powerUp.' + fileFormat].removeEventListener("canplaythrough");
				// game.sfx['explosion.' + fileFormat].removeEventListener("canplaythrough");
				// game.sfx['blast.' + fileFormat].removeEventListener("canplaythrough");
				
				//clear the canvas
				game.contextText.clearRect(0, 0, game.width, game.height);

				//start loading sound tracks
				initSoundTracks([	//using initSfx function to load our sound tracks
					"_sounds/_soundTracks/_lvl1/tune1." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/tune2." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/victory." + fileFormat,			
					"_sounds/_soundTracks/_lvl1/boss." + fileFormat	
				]);

				//add sound tracks event listeners
				game.soundTracks['tune1.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.soundTracks['tune1.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSoundTracks++;
				});
				game.soundTracks['tune2.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.soundTracks['tune2.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSoundTracks++;
				});
				game.soundTracks['victory.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.soundTracks['victory.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSoundTracks++;
				});
				game.soundTracks['boss.' + fileFormat].addEventListener("canplaythrough", function event(){
					game.soundTracks['boss.' + fileFormat].removeEventListener("canplaythrough", event);
					game.doneSoundTracks++;
				});
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
				//remove sound tracks event listeners
				// game.soundTracks['tune1.' + fileFormat].removeEventListener("canplaythrough");
				// game.soundTracks['tune2.' + fileFormat].removeEventListener("canplaythrough");
				// game.soundTracks['victory.' + fileFormat].removeEventListener("canplaythrough");
				// game.soundTracks['boss.' + fileFormat].removeEventListener("canplaythrough");

				//starting game menu
				gameText.gameIntro();
				gameMenu.init();

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
    		window.applicationCache.addEventListener("updateready", function event() {

    			window.applicationCache.removeEventListener("updateready", event);

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