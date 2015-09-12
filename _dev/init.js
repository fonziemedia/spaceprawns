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