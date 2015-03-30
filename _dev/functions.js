		//====================== Game functions =================//


		//Keyboard		
		$(document).keydown(function(e){    //using jquery to listen to pressed keys
			game.keys[e.keyCode ? e.keyCode : e.which] = true;	//and cross browser proofing
		});
		
		$(document).keyup(function(e){   //using jquery to listen to released keys
			delete game.keys[e.keyCode ? e.keyCode : e.which]; //once key is released, delete the key pressed action previously defined 
		});
		
		//mouse and touch screens
		var canvas;
		var ctx;
		canvasX = playerShip.x;
		canvasY = playerShip.y;
		var mouseIsDown = 0;
		moveX = canvasX;      //initial define of moveX as canvasX position
		moveY = canvasY;      //initial define of moveX as canvasX position
 

		function initInput() {
        canvas = document.getElementById("playerCanvas");
        ctx = canvas.getContext("2d");
		         
        canvas.addEventListener("mousedown",mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);        
        canvas.addEventListener("mousemove",mouseXY, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchend", touchUp, false);
        canvas.addEventListener("touchcancel", touchUp, false);
        canvas.addEventListener("touchleave", touchUp, false);
		canvas.addEventListener("touchmove", touchXY, false);
		                
		}
		
		
		function mouseUp() {
			mouseIsDown = 0;
			mouseXY();
		}
		 
		function touchUp() {
			mouseIsDown = 0;
		}
		 
		function mouseDown() {
			mouseIsDown = 1;
			mouseXY();
		}
		  
		function touchDown() {
			mouseIsDown = 1;
			touchXY();
		}
		
		function mouseXY(e) {
			if (e) {
				e.preventDefault();
			canvasX = e.pageX - canvas.offsetLeft;
			canvasY = e.pageY - canvas.offsetTop;
			//showPos();
			}
		}
		 
		function touchXY(e) {
			if (e) {
				e.preventDefault();
			canvasX = e.targetTouches[0].pageX - canvas.offsetLeft;
			canvasY = e.targetTouches[0].pageY - canvas.offsetTop;
			}
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
		
		function resetGame(){
			mouseIsDown = 0;
			game.gameOver = false; 
			game.gameWon = false;					
			// game.downCount = 1;
			// game.left = false;
			// game.down = false;
			// game.enshootTimer = game.enfullShootTimer;
			game.contextBackground.clearRect(1, 1, game.width, game.height); 
			game.contextPlayer.clearRect(1, 1, game.width, game.height); 
			game.contextEnemies.clearRect(1, 1, game.width, game.height); 
			game.contextText.clearRect(1, 1, game.width, game.height); 
			// game.projectiles = [];
			// game.enprojectiles = [];
			// game.enemies = [];
			playerShip.reset();
			gameUI.updateAll();
			game.enemies = [];
			game.waves = [];			
			game.enemyBullets = [];
			game.loot = [];
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
			// scores();loading

		}

		// function Xplode(xpos,ypos){ 
		// 	game.explosions.push({
		// 		x: xpos,
		// 		y: ypos,
		// 		frameWidth: 96,
		// 		frameHeight: 96,
		// 		size: game.height*0.07,
		// 		startFrame: 0,
		// 		endFrame: 19,
		// 		frameSpeed: 2,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,             // keep track of frame rate
		// 		image: 3
		// 	});
		// 	if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}
		// }

		// function addBullet(){ //add bullet function will be triggered every time space is pressed
		// 	game.projectiles.push({
		// 		x: playerShip.x + playerShip.size*0.40,
		// 		y: playerShip.y - playerShip.bulletspeed*1.8,
		// 		size: game.height*0.022,
		// 		frameWidth: 48,
		// 		frameHeight: 48,
		// 		startFrame: 0,
		// 		endFrame: 11,
		// 		frameSpeed: 4,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,             // keep track of frame rate
		// 		image: 2

		// 	});
		// }

		// function addEnBullet(){ //add bullet function will be triggered every few seconds
		// 	xEn = game.enemies.length;
		// 	pEn = (xEn < 2) ? 0 : Math.floor(Math.random()*((xEn-1)+1)); //a random number between 0 and the maximum array index (xEn-1)

		// 	game.enprojectiles.push({
		// 		x: game.enemies[pEn].x + game.enemies[pEn].size*0.42,
		// 		y: game.enemies[pEn].y + game.enemies[pEn].size,
		// 		size: game.height*0.035,
		// 		frameWidth: 64,
		// 		frameHeight: 64,
		// 		startFrame: 0,
		// 		endFrame: 2,
		// 		frameSpeed: 5,
		// 		animationSequence: [],  // array holding the order of the animation
		// 		currentFrame: 0,        // the current frame to draw
		// 		counter: 0,
		// 		image: 20
		// 	});
		// }
		
		// function scores(){ 
		// 	game.contextText.fillStyle = "#FFD455";
		// 	game.contextText.font = game.height*0.025 + "px helvetica";
		// 	game.contextText.clearRect(0, 0, game.width, game.height*0.1);
		// 	game.contextText.fillText("Level: " + game.level, game.height*0.03, game.height*0.04); //printing level
		// 	game.contextText.fillText("Score: " + game.score, game.height*0.15, game.height*0.04); //printing the score
		// 	game.soundStatus = (game.sound) ? "ON" : "OFF";
		// 	if (!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
		// 		game.contextText.fillText("Sound(F8): " + game.soundStatus, game.width - (game.height*0.45), game.height*0.04); //printing lives
		// 	}
		// 	game.contextText.fillText("Hangar: ", game.width - (game.height*0.22), game.height*0.04); 
		// 	for (i = 0; i < game.lives; i++){
		// 		//printing lives
		// 		game.contextText.drawImage(game.images[0], ((i * game.height*0.03)+game.width - (game.height*0.12)), game.height*0.015, game.height*0.035, game.height*0.035);
		// 	}

		// }


		function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
			
			if (!(first.x + first.size < second.x || second.x + second.size < first.x || first.y + first.size < second.y || second.y + second.size < first.y)) {

				Cx = first.x < second.x ? second.x : first.x;
				Cy = first.y < second.y ? second.y : first.y;
				CX = first.x + first.size < second.x + second.size ? first.x + first.size : second.x + second.size;
				CY = first.y + first.size < second.y + second.size ? first.y + first.size : second.y + second.size;

				iFirst = first.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);
				iSecond = second.context.getImageData(Cx, Cy, CX-Cx, CY-Cy);

				var length = iFirst.data.length;

				for (var i = 0 ; i < length; i+= game.res) {
					// return !(!iFirst.data[i] || !iSecond.data[i]);
					if (iFirst.data[i] > 0 && iSecond.data[i] > 0)
					{						
						return true;
					}
				}
			}			
			return false;			
		}

		
		// function Collision(first, second){ //detecting rectangles' (image) collision, first is going to be the bullet, second will be the enemies. Note: the function itself can be applied to anything, 'first' and 'second' can be any variable as long as they have x and y values
		// 	return !(first.x > second.x + second.size ||
		// 		first.x + first.size < second.x ||
		// 		first.y > second.y + second.size ||
		// 		first.y + first.size < second.y);
		// }


		function PlayerDie(){
			// if (game.soundStatus == "ON"){game.playerexplodeSound.play();}
			// game.player.crashed = true;
			game.gameOver = true;
			game.lives--;
			game.score = game.score - game.levelScore;
			// scores();
			setTimeout(function(){
				game.paused = true;
				mouseIsDown = 0;

				if (game.gameOver && game.paused && game.lives < 1){
					// game.contextPlayer.font = "bold " + game.width*0.08 + "px " + game.font;
					// game.contextPlayer.fillStyle = "#FF7F00";
					// game.contextPlayer.fillText("Game Over", game.width*0.30, game.height*0.42);
					// game.contextPlayer.font = "bold " + game.width*0.06 + "px " + game.font;
					// game.contextPlayer.fillText(game.score + " enemy ships destroyed", game.width*0.19, game.height*0.52);
					// game.contextPlayer.font = "bold " + game.width*0.04 + "px " + game.font;
					// game.contextPlayer.fillStyle = "white";
					// if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					// 	game.contextPlayer.fillText("Tap screen to restart", game.width*0.30, game.height*0.62);
					// } else {
					// 	game.contextPlayer.fillText("Press Enter or LMB to restart", game.width*0.23, game.height*0.62);
					// }

					message('Game Over', 1,  'Helvetica', game.width*0.06, '#FFD455', 'bold'); 
					message(game.score + ' enemy ships destroyed', 2, 'Helvetica', game.width*0.05, '#FFD455', 'bold');
					if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to restart', 3, 'Helvetica', game.width*0.04, 'white', 'bold'); 
					} else {
					message('Press ENTER or LMB to restart', 3, 'Helvetica', game.width*0.04, 'white', 'bold');
					}

					if (game.soundStatus == "ON") {
						game.sounds.push(new Audio("_sounds/death.mp3"));
					}

					game.levelScore = 0;

				}

			if (game.gameOver && game.paused && game.lives >= 1){
				message('Your ship has been destroyed!', 1,  'Helvetica', game.width*0.06, '#FFD455', 'bold'); 
				message(game.lives + ' ships left', 2, 'Helvetica', game.width*0.05, '#FFD455', 'bold');
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to continue', 3, 'Helvetica', game.width*0.04, 'white', 'bold'); 
				} else {
					message('Press ENTER or LMB to continue', 3, 'Helvetica', game.width*0.04, 'white', 'bold');
				}

				game.levelScore = 0;
			}


			}, 1000);
		}

		//messages
		function message(message, row, font, fontSize, fontColor, fontWeight) {

			var text = message;
			var textLength = text.length;
			var textWidth = textLength * fontSize/2;
			var textHeight = game.height*0.1;
			// this.color = fontColor;
			// this.font = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? font : "Monaco";
			// this.fontSize = fontSize;
			// this.fontWeight = fontWeight;

			// var x = (game.width - textWidth) *0.5;
			// var y = (game.height - fontSize) *0.5;
			var x = (game.width - textWidth) *0.5;
			var y = (game.height/3.5) + (textHeight * row);

			// console.log (x, y);
			// console.log (game.width);			
			// console.log (textWidth);
			// console.log (textLength);


			game.contextPlayer.font = fontWeight + " " + fontSize + "px " + font;				
			game.contextPlayer.fillStyle = fontColor;
			game.contextPlayer.fillText(text, x, y);	
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
			game.requiredImages = paths.length;  //the number of required images will be equal to the length of the paths array
			for(var i in paths){
				var img = new Image(); //defining img as a new image
				img.src = paths[i]; //defining new image src as paths[i]
				game.images[i] = img; //defining game.image[i] as a new image (with paths)
				/*jshint -W083 */
				game.images[i].onload = function(){  //once an image loads..
					game.doneImages++; //  ..increment the doneImages variable by 1
				};
			}
		}	

		function checkImages(){	//checking if all images have been loaded. Once all loaded run init
			if(game.doneImages >= game.requiredImages){
				game.contextBackground.clearRect(0, 0, game.width, game.height);
				game.contextBackground.font = "bold " + game.width*0.11 + "px " + game.font; //Intro screen
				game.contextBackground.fillStyle = "purple";				
				game.contextBackground.fillText(X_Title, game.width*0.2, game.height*0.40);
				game.contextBackground.font = "bold " + game.width*0.04 + "px " + game.font; 
				game.contextBackground.fillStyle = "#FFD455";
				game.contextBackground.fillText(X_Subtitle, game.width*0.1, game.height*0.55);
				game.contextBackground.fillStyle = "white";
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					game.contextBackground.fillText(X_mb_Start, game.width*0.25, game.height*0.65);
				} else {
					game.contextBackground.fillText(X_dt_Start, game.width*0.1, game.height*0.70);
				}
				loop(); //LOoP CALL!!!
			}else{
				setTimeout(function(){
					checkImages();
				}, 1);
			}
		}
			
		initImages([	//using initimages function to load our images
			"_img/_dist/fighter/fighter.png",
			"_img/_dist/enemies/sectoid.png",
			"_img/_dist/laser.png",
			"_img/_dist/explosion.png",
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
			"_img/_dist/stars/star1.png",
			"_img/_dist/stars/star2.png",
			"_img/_dist/stars/star3.png",
			"_img/_dist/stars/star4.png",
			"_img/_dist/stars/star5.png",
			"_img/_dist/stars/star6.png",
			"_img/_dist/missile.png",
			"_img/_dist/background/level_1.jpg",
			"_img/_dist/enemies/_alienbase/alienbase1.png",			
			"_img/_dist/enemies/_alienbase/alienbase2.png",			
			"_img/_dist/enemies/_miniboss/floater.png",			
			"_img/_dist/ui/energyBar.png",			
			"_img/_dist/ui/energyPoint.png",			
			"_img/_dist/enemies/_bigboss/sectoidBoss.png",			
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
				// if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
				// 	window.setTimeout(callback, 1000 / 30);
				// }	
				// else {
				// 	window.setTimeout(callback, 1000 / 60);
				// }
				window.setTimeout(callback, 1000 / 60);			
			};
})(); // jshint ignore:line