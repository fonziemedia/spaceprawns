function menu()
{

	var menuBg = $('#menuBackground');
	var resumeBtn = $('#resumeGame');
	var startBtn = $('#startGame');
	var soundFx = $('#toggleSound');
	var music = $('#toggleMusic');	
	var fullScreen = $('#toggleFullScreen');
	var credits = $('#credits');
	var allButtons = $('.menu-option-btn');
	var animationSpeed = 800;

	this.toggled = false;
	
	document.addEventListener("fullscreenchange", FShandler);
	document.addEventListener("webkitfullscreenchange", FShandler);
	document.addEventListener("mozfullscreenchange", FShandler);
	document.addEventListener("MSFullscreenChange", FShandler);

	function FShandler()
	{
		game.fullScreen = game.fullScreen ? false : true;

	    if (game.fullScreen)
	    {
			fullScreen.addClass('active');
			fullScreen.text('Fullscreen: ON');
	    }
	    else
	    {
			fullScreen.removeClass('active');
			fullScreen.text('Fullscreen: OFF');
	    }
	}

	this.toggleFullScreen = function(trigger)  //experimental   only works with user input
	{
		if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)   // current working methods
		{
			if (document.documentElement.requestFullscreen)
			{
			document.documentElement.requestFullscreen();
			}
			else if (document.documentElement.msRequestFullscreen)
			{
			document.documentElement.msRequestFullscreen();
			}
			else if (document.documentElement.mozRequestFullScreen)
			{
			document.documentElement.mozRequestFullScreen();
			}
			else if (document.documentElement.webkitRequestFullscreen)
			{
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		}
		else
		{
			if (document.exitFullscreen)
			{
			  document.exitFullscreen();
			}
			else if (document.msExitFullscreen)
			{
			  document.msExitFullscreen();
			}
			else if (document.mozCancelFullScreen)
			{
			  document.mozCancelFullScreen();
			}
			else if (document.webkitExitFullscreen)
			{
			  document.webkitExitFullscreen();
			}
		}
	};


	this.toggleSound = function()
	{
		game.sound = game.sound ? false : true ;

		localStorage.prawnsSound =  game.sound;


		if (game.sound)
		{
			soundFx.addClass('active');
			soundFx.text('Sound: ON');
		}
		else
		{			
		soundFx.removeClass('active');
		soundFx.text('Sound: OFF');
		}

	};

	this.toggleMusic = function()
	{
		game.music = game.music ? false : true ;

		localStorage.prawnsMusic =  game.music;

		if (game.started && game.tracks.length > 0)
		{
			for(var g in game.tracks)
			{
				game.tracks[g].pause();
			}
			game.tracks = [];
		}
		else if (game.started && game.tracks.length < 1)
		{
			game.tracks.push(game.soundTracks['tune1' + fileFormat]);

			for(var w in game.tracks)
			{
				game.tracks[w].play();
				game.tracks[w].loop = true;							
			}
		}

		if (game.music)
		{
			music.addClass('active');
			music.text('Music: ON');
		}
		else
		{			
			music.removeClass('active');
			music.text('Music: OFF');
		}

	};


	this.toggle = function()
	{

		this.toggled = this.toggled ? false : true;


		// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
		if (this.toggled)
		{
			gameState.pause();

			allButtons.css({"display": "block"});

			menuBg.fadeIn(animationSpeed);
			menuBg.promise().done(function()
			{
				if(game.started)
				{
					if(startBtn.text !== 'Restart')
					{
						startBtn.text('Restart');
					}
					resumeBtn.animate({
						opacity: 1,
						"right": "-=50%",
					},800);
				}	
				else
				{
				startBtn.text('Start');
				}			
				startBtn.animate({
					opacity: 1,
					"left": "-=50%",
				},800);
				soundFx.animate({
					opacity: 1,
					"right": "-=50%",
				},800);
				music.animate({
					opacity: 1,
					"left": "-=50%",
				},800);
				fullScreen.animate({
					opacity: 1,
					"right": "-=50%",
				},800);
				credits.animate({
					opacity: 1,
					"left": "-=50%",
				},800);
			});
		}
		else
		{
			if(game.started)
			{
				resumeBtn.animate({
					opacity: 0,
					"right": "+=50%",
				},800);
			}
			startBtn.animate({
				opacity: 0,
				"left": "+=50%",
			},800);
			soundFx.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
			music.animate({
				opacity: 0,
				"left": "+=50%",
			},800);
			fullScreen.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
			credits.animate({
				opacity: 0,
				"left": "+=50%",
			},800);


			allButtons.promise().done(function()
			{
				menuBg.fadeOut(animationSpeed);
				menuBg.promise().done(function()
				{
					if(game.loaded && !game.faded){gameState.unPause();}
				});				
			});
		}

		// startBtn.css({"left": ($(gameArea).width()-widthProp)*0.55});		
	};

	this.init = function()
	{
		if (localStorage.prawnsSound === 'true') //note = localStorage will only process string values
		{
			soundFx.addClass('active');
			soundFx.text('Sound: ON');
		}
		else
		{			
		soundFx.removeClass('active');
		soundFx.text('Sound: OFF');
		}

		if (localStorage.prawnsMusic === 'true') //note = localStorage will only process string values
		{
			music.addClass('active');
			music.text('Music: ON');
		}
		else
		{			
			music.removeClass('active');
			music.text('Music: OFF');
		}

		if (localStorage.fullScreen === 'true') //note = localStorage will only process string values
		{
			fullScreen.addClass('active');
			fullScreen.text('Fullscreen: ON');
		}
		else
		{			
			fullScreen.removeClass('active');
			fullScreen.text('Fullscreen: OFF');
		}

		gameMenu.toggle();

	};
	
}

gameMenu = new menu();