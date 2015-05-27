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
			game.contextBackground.clearRect(0, 0, game.width, game.height); 
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
			playerShip.reset();
			gameUI.updateAll();
			game.background = [];
			game.enemies = [];
			game.waves = [];			
			game.enemyBullets = [];
			game.loot = [];
			game.delayTimer = 0;
			game.timer = 0;		
			game.sounds = [];

			for(var g in game.songs){
					game.songs[g].pause();
			}
			game.songs = [];

			if (game.music){
				game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
				game.songs[0].play();
				game.songs[0].loop = true;	
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

		//====================== Images engine =================//
		
		function initImages(paths) { //our images engine: passing the array 'paths' to the function
			game.requiredImages = paths.length; //the number of required images will be equal to the length of the paths array
			for(var i in paths)
			{
				var img = new Image(); //defining img as a new image
				img.src = paths[i]; //defining new image src as paths[i]

				var imgIndex = img.src.split("/").pop(); //obtaining file name from path
				// var imgIndex = imgFile.substr(0, imgFile.lastIndexOf('.')) || imgFile;

				game.images[imgIndex] = img; //defining game.image[index] as a new image (with paths)

				/*jshint -W083 */
				game.images[imgIndex].onload = function()
				{ //once an image loads..
					game.doneImages++; //  ..increment the doneImages variable by 1
				};

				if(i < 1)
				{
					//=========================== Game loading Screen =================================== 	
					game.contextText.font = "bold " + game.width*0.08 + "px " + game.font; 
					game.contextText.fillStyle = "white";
					game.contextText.fillText("Loading...", game.width*0.30, game.height*0.47);
				}
			}
		}	

		function checkImages(){	//checking if all images have been loaded. Once all loaded run init
			if(game.doneImages >= game.requiredImages){
				gameText.gameIntro();
				loop(); //LOoP CALL!!!
				document.getElementById('textCanvas').style.cursor = 'corsair';
			} 
			else
			{
				game.contextText.fillText("|", game.width*0.30+(game.doneImages+1), game.height*0.55);					
				setTimeout(function(){
					checkImages();
				}, 1);
			}
		}
			
		initImages([	//using initimages function to load our images
			//backgrounds
			"_img/_dist/background/intro_bg.jpg",
			"_img/_dist/background/level1.jpg",
			
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
			"_img/_dist/explosion.png",						
		]);
		
		checkImages(); //this function call starts our game
		
	/* jshint ignore:start */
	});
})();
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