function state()  ///OPTIMISE THIS LATER - Disable UI during transitions and skiping these
{

	this.start = function()
	{
		gameState.pause();		  
		gameLights.switch('off');

		removeGamePlayInput();
		addStandByInput(); 		

		if (gameMenu.toggled) //if the game menu is up toggle it off
		{
			gameMenu.toggle();
		}

		if(!game.started) //checking if we're starting a new game or restarting
		{
			game.started = true; //this needs to be set after gameMenu.toggle() or will break resume button
		}
		else
		{
			game.score = 0;
			game.level = 1;			
		}

		introBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
		introText = new text('Stage ' + game.level, introBriefing[game.level - 1], true);

		$('.menu-option-btn').promise().done(function()
		{
			$('#menuBackground').promise().done(function()
			{					
				gameBackground.load();
				introText.fade('in');

				$('.all-text').promise().done(function()
				{  
					removeStandByInput();
					if (game.textFaded) //remove this later
					{
						if (!game.loaded){
							startGame();
						}
						addGamePlayInput();
						resetGame();
						gameLights.fade('in');
						gameState.unPause();
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
									startGame();
								}
								addGamePlayInput();
								resetGame();
								gameLights.fade('in');
								gameState.unPause();
							});
						});
					}
				});
			});
		});
	};
	

	this.lvlComplete = function() //called at the end of each level
	{
		game.started = false;
		removeGamePlayInput();		
		gameUI.fade('out');

		levelUpText = new text('Stage Complete!', game.score + ' enemy ships destroyed', true); 	
		levelUpText.switch('on');
		
		$('#inputarea').on('mousedown touchstart', function()
		{
			$('#inputarea').off('mousedown touchstart');
			levelUpText.fade('out');

			$('.all-text').promise().done(function()
			{	
				gameUI.fade('out');	
				gameLights.fade('out');
					$('#fader').promise().done(function()
					{   //once text fades 			
						gameState.pause();
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
		gameUI.fade('out');

		gameOverText = new text('Game Over', game.score + ' enemy ships destroyed', true);		
		gameOverText.switch('on');

		$('#inputarea').on('mousedown touchstart', function()
		{
			$('#inputarea').off('mousedown touchstart');
			gameOverText.fade('out');

			$('.all-text').promise().done(function()
			{
				gameUI.fade('out');		
				gameLights.fade('out');
					$('#fader').promise().done(function()
					{   //once text fades 			
						gameState.pause();
						game.score = 0;
						game.level = 1;
						gameLights.fade('out');
						gameMenu.toggle();								
					});
			});
		});	
	};


	this.pause = function()
	{
		game.paused = true;
		gameUI.updateAll();
		gameUI.fade('out');		
	};

	this.unPause = function()
	{
		game.paused = false;
		gameUI.fade('in');	
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