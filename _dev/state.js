//====================== Game state =================//
		
		function gameState() {

			//game start
			// if ((game.keys[13] || mouseIsDown) && !game.started && !(game.gameOver) && !(game.gameWon)) {
			// 	resetGame();
			// 	mouseIsDown = 0;
			// 	game.keys[13] = false;					
			// 	if(game.music && game.tracks.length < 1){
			// 		game.tracks.push(game.soundTracks['tune1.' + fileFormat]);
			// 		game.tracks[0].play();
			// 		game.tracks[0].loop = true;				
			// 		// game.music[q].addEventListener("ended", game.music.splice(q,1));
			// 	}
				
			// 	//setting alpha = 0
			// 	gameLights.off('all');
			// 	game.started = true;
			// 	game.paused = false;
			// 	gameUI.updateAll();
			// }
			
			//If Esc
			if (game.keys[27]) {
				mouseIsDown = 0;				
				game.keys[27] = false;
				playerShip.hull = 0;
				playerShip.lives = 0;
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



				if (game.tracks.length > 0) {
					for(var g in game.tracks){
						game.tracks[g].pause();
					}
					game.tracks = [];
				}
				else if (game.tracks.length < 1) {
						game.tracks.push(game.soundTracks['tune1.mp3']);
						for(var w in game.tracks){
							game.tracks[w].play();
							game.tracks[w].loop = true;							
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
			   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.gameOver && !(game.gameWon)) ||
			   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.level >= 7))
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