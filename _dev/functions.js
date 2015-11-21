		//====================== Game functions =================//

		//making our canvases dynamically resize according to the size of the browser window	//! USE THIS TO SHOW ROTATE SCREEN MSG IF MOBILE AND GAME.WIDTH > GAME HEIGHT
		function respondCanvas()
		{ 

			game.paused = gameMenu.toggled ? game.paused : true; //promtp to pause the game if called outside game menu

			setGameDimensions();

			//set playerShip's dimensions/boundaries
			playerShip.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
			playerShip.limitX2 = Math.round(game.width - (playerShip.size*0.5));
			playerShip.limitY2 = Math.round(game.height - (playerShip.size*0.5));
			playerShip.movement = Math.round(game.height*0.007);

			//set game bosses' boundaries  !Need to give this enemy a name in the array
			// this.yStop = Math.round(game.height*0.1);
			// this.xBondary = Math.round(game.width - this.size/4);

			if(!game.started)
			{
				playerShip.x = Math.round(game.width*0.46);
				playerShip.y = Math.round(game.height*0.90);
			}		

			game.paused = gameMenu.toggled ? game.paused : false; //prompt to unpause the game if called outside game menu

		}

		//Run function whenever browser resizes
		$(window).resize(respondCanvas);

		//Keyboard		
		$(document).keydown(function(e){    //using jquery to listen to pressed keys
			game.keys[e.keyCode ? e.keyCode : e.which] = true;	//and cross browser proofing
		});
		
		$(document).keyup(function(e){   //using jquery to listen to released keys
			delete game.keys[e.keyCode ? e.keyCode : e.which]; //once key is released, delete the key pressed action previously defined 
		});
		
		//mouse and touch screens
		var inputArea = document.getElementById("inputarea");
		var inputAreaX = playerShip.x;
		var inputAreaY = playerShip.y;
		var mouseIsDown = 0;
		var touchInitX = 0;
		var touchInitY = 0;
 

		function addGamePlayInput()
		{	                
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
		 
		function touchXY(e) {
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


		//testing using DOM audio sources

		// function setSource() {
  // 			audio1 = document.querySelector('#audio1');
  // 			audio2 = document.querySelector('#audio2');
  // 			audio3 = document.querySelector('#audio3');
  // 			audio1.src = '_sounds/_sfx/laser' + fileFormat;
  // 			audio2.src = '_sounds/_sfx/laser' + fileFormat;
  // 			audio3.src = '_sounds/_sfx/laser' + fileFormat;
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

		function resetGame(){	//called on level start			
			
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
			game.playerBullets = [];
			game.enemyBullets = [];
			game.explosions = [];
			game.enemies = [];
			game.waves = [];
			game.loot = [];										
			gameUI.updateAll();		

			//Sounds
			game.sounds = [];
			for(var g in game.tracks){
					game.tracks[g].pause();
			}
			game.tracks = [];

			if (game.music && game.tracks.length < 1){
				game.tracks.push(game.soundTracks['tune1' + fileFormat]);
				game.tracks[0].play();
				game.tracks[0].loop = true;	
			}
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
			if (!game.paused){
			update();
			}
		}


		function startGame()
		{						
			game.loaded = true;
			
			//preparing sound tracks (chromium fix)
			game.tracks.push(game.soundTracks['tune1' + fileFormat]);
			game.tracks.push(game.soundTracks['tune2' + fileFormat]);
			game.tracks.push(game.soundTracks['boss' + fileFormat]);
			game.tracks.push(game.soundTracks['victory' + fileFormat]);

			for (var t in game.tracks){
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

			for (var s in game.sounds){
				game.sounds[s].play();
				game.sounds[s].pause();
			}
		
			game.sounds = [];

			gameUI.updateAll();
			loop();


		}


		//Loaders

		var loadingBar = $('#loadingBar');
		var loadingBarFiller = $('#loadingBarFiller');
		var loadingText = new text('Loading Images.. ', '', false);
		loadingText.switch('on');
		loadingBar.show();

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
				// console.log('reqImages: ' + game.requiredImages);
				// console.log('doneImages: ' + game.doneImages);
			}
		}

		//====================== Audio engine =================//

		function sfxEventHandler(sfx)
		{
			this.sfx = sfx;
			this.sfx.removeEventListener("canplaythrough", sfxEventHandler, false);
			game.doneSfx++;
		}

		function stEventHandler(st)
		{
			this.st = st;
			this.st.removeEventListener("canplaythrough", stEventHandler, false);
			game.doneSoundTracks++;
		}


		function initSfx(sfxPaths) { //our Sfx engine: passing the array 'sfxPaths' to the function
			game.requiredSfx = sfxPaths.length; //the number of required Sfx will be equal to the length of the sfxPaths array
			// console.log('required soundSfx:' + game.requiredSfx);
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

				console.log(audiopreload);
				if(audiopreload)
				{
					game.sfx[sfxIndex].preload = "auto";
					//checking if sfx have loaded
					game.sfx[sfxIndex].addEventListener("canplaythrough", sfxEventHandler.bind(window, this), false); //!!!!!! this is how you pass on args for event handler functions yo!!!
				}
				else
				{
					game.doneSfx++;
				}
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

								
				if(audiopreload)
				{
					game.soundTracks[soundTracksIndex].preload = "auto";
					//checking if st's have loaded
					game.soundTracks[soundTracksIndex].addEventListener("canplaythrough", stEventHandler.bind(window, this, false));				
				}
				else
				{
					game.doneSoundTracks++;
				}	

				// console.log('requiredSoundTracks: ' + game.requiredSoundTracks);
			}
		}


		function checkImages(){	//checking if all images have been loaded. Once all loaded run initSfx
			if(game.doneImages >= game.requiredImages){
				loadingText = new text('Loading Sfx.. ', '', false);
				loadingBarFiller.css({"width": "0"});
				initSfx([	//using initSfx function to load our sounds
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
				]);

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

		function checkSfx(){	//checking if all Sfx have been loaded. Once all loaded run init
			if(game.doneSfx >= game.requiredSfx){
				loadingText = new text('Loading Sound Tracks.. ', '', false);
				loadingBarFiller.css({"width": "0"});

				//start loading sound tracks
				initSoundTracks([	//using initSfx function to load our sound tracks
					"_sounds/_soundTracks/_lvl1/tune1" + fileFormat,			
					"_sounds/_soundTracks/_lvl1/tune2" + fileFormat,			
					"_sounds/_soundTracks/_lvl1/victory" + fileFormat,			
					"_sounds/_soundTracks/_lvl1/boss" + fileFormat	
				]);

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

		function checkSoundTracks(){	//checking if all Sfx have been loaded. Once all loaded run init
			if(game.doneSoundTracks >= game.requiredSoundTracks){
				loadingText.switch('off');
				loadingBar.hide();
				//starting game menu				
				gameMenu.init();				
			} 
			else
			{
				loadingBarWidth = (game.doneSoundTracks / game.requiredSoundTracks) * 100 + '%';
				loadingBarFiller.css({"width": loadingBarWidth});					
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
				game.tracks.push(game.soundTracks['tune1' + fileFormat]);

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

 			// loadOsCanvas();

		},false);



		//Audio pre-load test
		var audiopreload = false;
		var timeout;
		var waitTime = 1000;
		var audioTest = new Audio();

		if (fileFormat === '.mp3')
		{
		//75ms of silence (minumum Mp3 duration loaded by Safari, not tested other formats thoroughly: may be possible to shrink base64 URI)
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
		//add 'Audio not supported condition'

		audioTest.preload = "auto";

		function testpreload(event)
		{
			clearTimeout(timeout);
			audioTest.removeEventListener('loadeddata', testpreload);
			audiopreload = event !== undefined && event.type === 'loadeddata' ? true : false;
			 //this function call starts our game
 			checkImages(); 
		}

		setTimeout(function()
		{
			audioTest.addEventListener('loadeddata', testpreload);
			timeout = setTimeout(testpreload, waitTime);
		}, 0);
 
		
	/* jshint ignore:start */
	// });
// })();
	// }	// jshint ignore:line
/* jshint ignore:end */

/*
Provides requestAnimationFrame in a cross browser way.
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/
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