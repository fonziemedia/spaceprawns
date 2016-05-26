menu = function()
{
	self = this;
	this.menuBg = $('#menuBackground');
	this.resumeBtn = $('#resumeGame');
	this.startBtn = $('#startGame');
	this.soundFx = $('#toggleSound');
	this.music = $('#toggleMusic');
	this.controls = $('#toggleControls');
	this.fullScreen = $('#toggleFullScreen');
	this.credits = $('#credits');
	this.allButtons = $('.menu-option-btn');
	this.animationSpeed = 800;
	this.toggled = false;

	//enabling buttons (firefox caching disabled)
	document.getElementById("resumeGame").disabled = false;
	document.getElementById("startGame").disabled = false;
};

menu.prototype.toggleFullScreen = function(trigger)  //experimental   only works with user input
{
	vibrateDevice(15);

	if (!doc.fullscreenElement &&    // alternative standard method
	!doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)   // current working methods
	{
		if (doc.documentElement.requestFullscreen)
		{
			doc.documentElement.requestFullscreen();
		}
		else if (doc.documentElement.msRequestFullscreen)
		{
			doc.documentElement.msRequestFullscreen();
		}
		else if (doc.documentElement.mozRequestFullScreen)
		{
			doc.documentElement.mozRequestFullScreen();
		}
		else if (doc.documentElement.webkitRequestFullscreen)
		{
			doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	}
	else
	{
		if (doc.exitFullscreen)
		{
		  doc.exitFullscreen();
		}
		else if (doc.msExitFullscreen)
		{
		  doc.msExitFullscreen();
		}
		else if (doc.mozCancelFullScreen)
		{
		  doc.mozCancelFullScreen();
		}
		else if (doc.webkitExitFullscreen)
		{
		  doc.webkitExitFullscreen();
		}
	}
};

menu.prototype.toggleSound = function()
{
	vibrateDevice(15);
	game.sound = game.sound ? false : true ;
	localStorage.prawnsSound =  game.sound;

	if (game.sound)
	{
		this.soundFx.addClass('active');
		this.soundFx.text('Sound: ON');
	}
	else
	{
	this.soundFx.removeClass('active');
	this.soundFx.text('Sound: OFF');
	}
};

menu.prototype.toggleMusic = function()
{
	vibrateDevice(15);
	game.music = game.music ? false : true ;
	localStorage.prawnsMusic =  game.music;

	if (game.tracks.length > 0)
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
		this.music.addClass('active');
		this.music.text('Music: ON');
	}
	else
	{
		this.music.removeClass('active');
		this.music.text('Music: OFF');
	}
};

menu.prototype.toggleControls = function()
{
	if (game.mouseControls)
	{
		game.mouseControls = false;
		game.keyboardControls = true;

		this.controls.text('Controls: keyboard');
		player.prototype.setControls = player.prototype.keyboardControls;
		player.prototype.setGunControls = player.prototype.setKeyboardGuns;
		text.prototype.h3Text = 'Press any key to continue';
	}
	else if (game.keyboardControls)
	{
		game.mouseControls = true;
		game.keyboardControls = false;

		this.controls.text('Controls: mouse');
		player.prototype.setControls = player.prototype.mouseControls;
		player.prototype.setGunControls = player.prototype.setMouseGuns;
		text.prototype.h3Text = game.isMobile ? 'Tap screen to continue' : 'Click to continue';
	}

	localStorage.mouseControls =  game.mouseControls;
	localStorage.keyboardControls =  game.keyboardControls;

};

menu.prototype.toggle = function()
{
	var self = this;
	document.getElementById("toggle-menu-btn").disabled = true;
	this.toggled = this.toggled ? false : true;

	// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
	if (this.toggled)
	{
		gameState.pause();

		this.allButtons.css({"display": "block"});

		this.menuBg.fadeIn(this.animationSpeed);
		this.menuBg.promise().done(function()
		{
			if(game.started)
			{
				if(self.startBtn.text !== 'Restart')
				{
					self.startBtn.text('Restart');
				}
				self.resumeBtn.animate({
					opacity: 1,
					"right": "-=50%",
				},800);
			}
			else
			{
				self.startBtn.text('Start');
			}

			self.startBtn.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			self.soundFx.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			self.music.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			self.fullScreen.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			if (!game.isMobile)
			{
				self.controls.animate({
					opacity: 1,
					"left": "-=50%",
				},800);
			}

			self.credits.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			document.getElementById("toggle-menu-btn").disabled = false;
		});
	}
	else
	{
		if(game.started)
		{
			this.resumeBtn.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
		}

		this.startBtn.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.soundFx.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		this.music.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.fullScreen.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		if (!game.isMobile)
		{
			this.controls.animate({
			opacity: 0,
			"left": "+=50%",
			},800);
		}

		this.credits.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.allButtons.promise().done(function()
		{
			self.allButtons.hide();
			self.menuBg.fadeOut(self.animationSpeed);
			self.menuBg.promise().done(function()
			{
				if(game.loaded && !game.faded)	gameState.unPause();
				document.getElementById("toggle-menu-btn").disabled = false;
			});
		});
	}
};

menu.prototype.init = function()
{
	if (localStorage.prawnsSound === 'true') //note = localStorage will only process string values
	{
		this.soundFx.addClass('active');
		this.soundFx.text('Sound: ON');
	}
	else
	{
	this.soundFx.removeClass('active');
	this.soundFx.text('Sound: OFF');
	}

	if (localStorage.prawnsMusic === 'true') //note = localStorage will only process string values
	{
		this.music.addClass('active');
		this.music.text('Music: ON');
	}
	else
	{
		this.music.removeClass('active');
		this.music.text('Music: OFF');
	}

	if (localStorage.fullScreen === 'true') //note = localStorage will only process string values
	{
		this.fullScreen.addClass('active');
		this.fullScreen.text('Fullscreen: ON');
	}
	else
	{
		this.fullScreen.removeClass('active');
		this.fullScreen.text('Fullscreen: OFF');
	}

	if (!game.isMobile)
	{
		if (localStorage.mouseControls === 'true') //note = localStorage will only process string values
		{
			this.controls.text('Controls: mouse');
		}

		if (localStorage.keyboardControls === 'true') //note = localStorage will only process string values
		{
			this.controls.text('Controls: keyboard');
		}
	}
	else
	{
		this.controls.disabled = true;
	}

	gameMenu.toggle();
};

gameMenu = new menu();
