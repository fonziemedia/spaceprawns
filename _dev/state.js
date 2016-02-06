function state()  ///OPTIMISE THIS LATER - Disable UI during transitions and skiping these
{
	this.start = function()
	{
		if (game.canVibrate) navigator.vibrate(15);
		//disabling buttons so we don't this function more than once
		document.getElementById("resumeGame").disabled = true;
		document.getElementById("startGame").disabled = true;

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
		introText = new text('Stage ' + game.level, introBriefing[game.level - 1], true);  //needs reclying centre!

		$('.menu-option-btn').promise().done(function()
		{
			$('#menuBackground').promise().done(function()
			{
				gameBackground.update();
				introText.fade('in');

				$('.all-text').promise().done(function()
				{
					removeStandByInput();
					if (game.textFaded) //remove this later
					{
						if (!game.loaded)
						{
							startGame();
						}
						addGamePlayInput();
						resetGame();
						gameLights.fade('in');
						gameState.unPause();
						document.getElementById("resumeGame").disabled = false;
						document.getElementById("startGame").disabled = false;
					}
					else
					{
						$('#inputarea').on('mousedown touchstart', function()
						{
							//only trigger this event listner once text animations have ended
							$('#inputarea').off('mousedown touchstart');
							introText.fade('out');
							$('.all-text').promise().done(function()
							{
								if (!game.loaded)
								{
									startGame();
								}
								addGamePlayInput();
								resetGame();
								gameLights.fade('in');
								gameState.unPause();
								document.getElementById("resumeGame").disabled = false;
								document.getElementById("startGame").disabled = false;
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
		gameUI.fade('out');
	};

	this.unPause = function()
	{
		game.paused = false;
		gameUI.updateAll();
		gameUI.fade('in');
	};
}

gameState = new state();
