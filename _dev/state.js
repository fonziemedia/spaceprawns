//====================== Game state =================//
		
		function gameState() {

			//game start
			if ((game.keys[13] || mouseIsDown) && game.start && !(game.gameOver) && !(game.gameWon)) {
				resetGame();
				mouseIsDown = 0;
				game.keys[13] = false;					
				if(game.music && game.songs.length < 1){
					game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
					game.songs[0].play();
					game.songs[0].loop = true;				
					// game.music[q].addEventListener("ended", game.music.splice(q,1));
				}
				
				//setting alpha = 0
				gameLights.off('all');
				game.start = false;
				game.paused = false;
				gameUI.updateAll();
			}
			
			//If Esc
			if (game.keys[27]) {
				mouseIsDown = 0;				
				game.keys[27] = false;
				playerShip.hull = 0;
				game.gameOver = true;								
			}

			//game sound
			if (game.keys[119]) {				
				game.sound = (game.sound) ? false : true;
				gameUI.updateSound();	
				game.keys[119] = false;
			}

			if (game.keys[120]) {
				game.music = (game.music) ? false : true;
				gameUI.updateSound();
				game.keys[120] = false;	



				if (game.songs.length > 0) {
					for(var g in game.songs){
						game.songs[g].pause();
					}
					game.songs = [];
				}
				else if (game.songs.length < 1) {
						game.songs.push(new Audio("_sounds/_lvl1/tune1.mp3"));
						for(var w in game.songs){
							game.songs[w].play();
							game.songs[w].loop = true;							
						}
				}
			}


			//game pause
			if ((game.keys[80]) && !(game.gameWon) && !(game.gameOver))
			{
				game.paused = (game.paused) ? false : true;
				game.keys[80] = false;
			}

			//If Esc pressed or if gameover and enter pressed
			if (game.keys[27] ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.gameOver && !(game.gameWon)) ||
			   ((game.keys[13] || mouseIsDown) && game.paused && !(game.start) && game.level >= 7))
			{
				if (game.lives < 1 || game.level >=7)
				{
					game.level = X_Level;
					game.score = 0;
					playerShip.lives = X_Lives;
					// game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
				}

				resetGame();
			}
		}