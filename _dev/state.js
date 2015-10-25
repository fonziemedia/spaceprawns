function state()  ///OPTIMISE THIS LATER - Disable UI during transitions and skiping these
{

	this.start = function()
	{	
		if(!game.started) //checking if we're starting a new game or restarting
		{
			game.started = true;
		}
		else
		{
			game.score = 0;
			game.level = 1;			
		}

		game.contextText.clearRect(0, 0, game.width, game.height);
		removeGamePlayInput();
		addStandByInput(); 		

		introBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
		introText = new text('Stage ' + game.level, introBriefing[game.level - 1], true);

		if (gameMenu.toggled) //if the game menu is up toggle it off
		{
			gameMenu.toggle();
		}

		gameLights.switch('off');					
		gameBackground.load();

		introText.fade('in');

		$('.all-text').promise().done(function()
		{  
			removeStandByInput();
			if (game.textFaded) //remove this later
			{
				if (!game.loaded){
					game.loaded = true;
					startGame();
				}
				addGamePlayInput();
				resetGame();
				gameLights.fade('in');
				game.paused = false;
			} 
			else
			{			
				$('#inputarea').on('mousedown touchstart', function()
				{   //only trigger this event listner once text animations have ended
					$('#inputarea').off('mousedown touchstart');
					introText.fade('out');
					$('.all-text').promise().done(function()
					{  
						if (!game.loaded){
							game.loaded = true;
							startGame();
						}
						addGamePlayInput();
						resetGame();
						gameLights.fade('in');
						game.paused = false;
					});
				});
			}
		});
	};
	

	this.lvlComplete = function() //called at the end of each level
	{
		game.started = false;
		removeGamePlayInput();

		levelUpText = new text('Stage Complete!', game.score + ' enemy ships destroyed', true); 	
		levelUpText.switch('on');
		
		$('#inputarea').on('mousedown touchstart', function()
		{
			$('#inputarea').off('mousedown touchstart');
			levelUpText.fade('out');

			$('.all-text').promise().done(function()
			{		
				gameLights.fade('out');
					$('#fader').promise().done(function()
					{   //once text fades 			
						game.paused = true;
						game.level++;
						gameState.start();
					});
			});
		});
		
	};


	this.gameOver = function()
	{
		game.started = false;
		removeGamePlayInput();

		gameOverText = new text('Game Over', game.score + ' enemy ships destroyed', true);		
		gameOverText.switch('on');

		$('#inputarea').on('mousedown touchstart', function()
		{
			$('#inputarea').off('mousedown touchstart');
			gameOverText.fade('out');

			$('.all-text').promise().done(function()
			{		
				gameLights.fade('out');
					$('#fader').promise().done(function()
					{   //once text fades 			
						game.paused = true;
						game.score = 0;
						game.level = 1;
						gameLights.fade('out');
						gameMenu.toggle();								
					});
			});
		});	
	};

}


//====================== Game state =================//
		
			
		// 	//If Esc
		// 	if (game.keys[27]) {
		// 		mouseIsDown = 0;				
		// 		game.keys[27] = false;
		// 		playerShip.hull = 0;
		// 		playerShip.lives = 0;
		// 		game.gameOver = true;								
		// 	}

		// 	//game sound
		// 	if (game.keys[119]) {				
		// 		game.sound = (game.sound) ? false : true;
		// 		gameUI.updateSound();	
		// 		game.keys[119] = false;
		// 	}

		// 	if (game.keys[120]) {
		// 		game.music = (game.music) ? false : true;
		// 		gameUI.updateSound();
		// 		game.keys[120] = false;	



		// 		if (game.tracks.length > 0) {
		// 			for(var g in game.tracks){
		// 				game.tracks[g].pause();
		// 			}
		// 			game.tracks = [];
		// 		}
		// 		else if (game.tracks.length < 1) {
		// 				game.tracks.push(game.soundTracks['tune1.mp3']);
		// 				for(var w in game.tracks){
		// 					game.tracks[w].play();
		// 					game.tracks[w].loop = true;							
		// 				}
		// 		}
		// 	}


		// 	//game pause
		// 	if ((game.keys[80]) && !(game.gameOver))
		// 	{
		// 		game.paused = (game.paused) ? false : true;
		// 		game.keys[80] = false;
		// 	}

		// 	//If Esc pressed or if gameover and enter pressed
		// 	if (game.keys[27] ||
		// 	   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.gameOver) ||
		// 	   ((game.keys[13] || mouseIsDown) && game.paused && game.started && game.level >= 7))
		// 	{
		// 		if (game.lives < 1 || game.level >=7)
		// 		{
		// 			game.level = X_Level;
		// 			game.score = 0;
		// 			playerShip.lives = X_Lives;
		// 			// game.downDivision = Math.floor((300 * game.level)); //the higher the level the slower the enemies come down
		// 		}

		// 		resetGame();
		// 	}
		// }

gameState = new state();