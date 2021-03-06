state = function() {};

state.prototype.start = function()
{
	vibrateDevice(15);
	//disabling buttons so we don't this function more than once
	document.getElementById("resumeGame").disabled = true;
	document.getElementById("startGame").disabled = true;

	gameState.pause();
	gameLights.switch('off');
	gameMusic.pauseAll();

	removeGamePlayInput();
	addStandByInput();

	if (gameMenu.toggled) //if the game menu is up toggle it off
	{
		gameMenu.toggle();
	}

	if(!game.started) //checking if we're starting a new game or restarting
	{
		game.started = true; // set after gameMenu.toggle() to prevent breaking resume button
	}
	else
	{
		// this shouldn't be here!
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
					$(document).on('mousedown touchstart keypress', function(e)
					{
						//only trigger this event listner once text animations have ended
						$(document).off('mousedown touchstart keypress');
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


state.prototype.lvlComplete = function() //called at the end of each level
{
	game.started = false;
	removeGamePlayInput();
	gameUI.fade('out');

	levelUpText = new text('Stage Complete!', game.score + ' enemy ships destroyed', true);
	levelUpText.switch('on');

	$(document).on('mousedown touchstart keypress', function(e)
	{
		$(document).off('mousedown touchstart keypress');
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

state.prototype.gameOver = function()
{
	game.started = false;
	removeGamePlayInput();
	gameUI.fade('out');

	gameOverText = new text('Game Over', game.score + ' enemy ships destroyed', true);
	gameOverText.switch('on');

	$(document).on('mousedown touchstart keypress', function(e)
	{
		$(document).off('mousedown touchstart keypress');
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

state.prototype.pause = function()
{
	game.paused = true;
	gameUI.fade('out');
};

state.prototype.unPause = function()
{
	game.paused = false;
	if (gameMusic.on) gameMusic.resumeGame();
	gameUI.updateAll();
	gameUI.fade('in');
};

gameState = new state();
