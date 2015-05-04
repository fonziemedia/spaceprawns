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
		game.faded = true;
		game.backgroundFaded = true;
		game.enemiesFaded = true;
		game.playerFaded = true;
		game.textFaded = true;
		game.background = [];		
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
		
		game.start = true;		
		game.lvlIntro = true;
		game.lvlStart = false;
		game.paused = true;
		game.escaped = false;
		game.gameWon = false;
		game.gameOver = false;
		game.delayTimer = 0;
		game.timer = 0;	
		
		
		//========================== Audio ==========================
		
		game.sound = X_Sound;	//on/off trigger
		game.music = X_Music;	//on/off trigger
		game.sounds = [];
		game.songs = [];
			
		//======================== Images ========================		
			
		game.images = [];
		game.doneImages  = 0; // will contain how many images have been loaded
		game.requiredImages = 0; // will contain how many images should be loaded
		// game.font = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? "Helvetica" : "Monaco";
		// game.res = 4*5; //check the 4th index every 5 frames
		
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
			c4.attr('height', $(container).height()); //max height

			if ($(container).width() < 1080)
			{
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

			
			//the below needs width and height defined, thus we put it here	

			//======================  Game settings =====================				
						
			game.enemySpeed = X_EnemySpeed * game.height/2500; //the enemies' speed
			game.EnBulletSpeed = X_EnBulletSpeed * game.height/1000;

			game.fullShootTimer = X_GunSpeed;	//this timer will limit the number of bullets being fired
			game.enfullShootTimer = X_EnGunSpeed;	//this timer will limit the number of bullets being fired by enemies
			game.shootTimer = game.fullShootTimer;
			game.enshootTimer = game.enfullShootTimer;

			//=========================== Game loading Screen =================================== 	
			game.contextText.font = "bold " + game.width*0.08 + "px " + game.font; 
			game.contextText.fillStyle = "white";
			game.contextText.fillText("Loading...", game.width*0.30, game.height*0.47);
		}

		//Initial call 
		respondCanvas();

	// jshint ignore:line