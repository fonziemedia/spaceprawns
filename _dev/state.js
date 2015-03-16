//====================== Game state =================//
		
		function gameState() {


			//game start
			if ((game.keys[13] || mouseIsDown) && game.start && !(game.gameOver) && !(game.gameWon)) {
				game.paused = false;
				game.start = false;
				mouseIsDown = 0;				
				// scores();				
			}
			
			//If Esc
			if (game.keys[27]) {
				game.lives = 0;
				resetGame();
			}

			//game sound
			if (game.keys[119]) {
				game.sound = (game.sound) ? false : true;
				game.keys[119] = false;
				// scores();
			}

			//game pause
			if ((game.keys[80]) && !(game.gameWon) && !(game.gameOver)) {
				game.paused = (game.paused) ? false : true;
				game.keys[80] = false;
			}

			//If Esc pressed or if gameover and enter pressed
			if (game.keys[27] ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.gameOver && !(game.gameWon)) ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.level >= 7)){

					if (game.lives < 1 || game.level >=7){
						game.level = X_Level;
						game.score = 0;
						playerShip.lives = X_Lives;
						// game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
					}

					resetGame();

			}
			
			//level up
			if ((game.keys[13] || mouseIsDown) && !(game.gameOver) && !(game.start) && (game.gameWon) && game.level <= 6) {					
					game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
					resetGame();									
			}


			if (game.gameWon && game.level > 1 && game.level <=6 ){

				message('Battle Won!', 'Helvetica', game.height*0.08, '#FFD455', 'bold'); 
				message(game.levelScore + ' enemy ships destroyed', 'Helvetica', game.height*0.06, '#FFD455', 'bold');
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					message('Tap screen to continue', 'Helvetica', game.height*0.04, '#FFD455', 'bold'); 
				} else {
					message('Press ENTER or LMB to continue', 'Helvetica', game.height*0.04, '#FFD455', 'bold');
				}
				game.levelScore = 0;
			}

			if (game.gameWon && game.level >=7){
				game.contextPlayer.font = "bold " + game.width*0.08 + "px " + game.font;				
				game.contextPlayer.fillStyle = "#CC99FF";
				game.contextPlayer.fillText("Victory!", game.width*0.35, game.height*0.42);
				game.contextPlayer.font = "bold " + game.width*0.06 + "px " + game.font;
				game.contextPlayer.fillText(game.score + " enemy ships destroyed", game.width*0.17, game.height*0.52);
				game.contextPlayer.font = "bold " + game.width*0.04 + "px " + game.font;
				game.contextPlayer.fillStyle = "white";
				if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					game.contextPlayer.fillText("Tap screen to restart", game.width*0.30, game.height*0.62);
				} else {
					game.contextPlayer.fillText("Press Enter or LMB to restart", game.width*0.24, game.height*0.62);
				}
				game.levelScore = 0;
			}
		}