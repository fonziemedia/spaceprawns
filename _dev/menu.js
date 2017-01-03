menu = function()
{
	self = this;
	this.menuBg = $('#menuBackground');
	this.resumeBtn = $('#resumeGame');
	this.startBtn = $('#startGame');
	this.sfxBtn = $('#toggleSound');
	this.musicBtn = $('#toggleMusic');
	this.ctrlsBtn = $('#toggleControls');
	this.fullScrnBtn = $('#toggleFullScreen');
	this.creditsBtn = $('#creditsBtn');
	this.allButtons = $('.menu-option-btn');
	this.animationSpeed = 800;
	this.toggled = false;

	//enabling buttons (firefox caching disabled)
	document.getElementById("resumeGame").disabled = false;
	document.getElementById("startGame").disabled = false;

	//disabling UI menu button so game.dt calculation doesn't get interrupted
	document.getElementById("toggle-menu-btn").disabled = true;
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
	gameSfx.on = gameSfx.on ? false : true ;
	localStorage.prawnsSound =  gameSfx.on;

	if (gameSfx.on)
	{
		this.sfxBtn.addClass('active');
		this.sfxBtn.text('Sound: ON');
	}
	else
	{
	this.sfxBtn.removeClass('active');
	this.sfxBtn.text('Sound: OFF');
	}
};

menu.prototype.toggleMusic = function()
{
	vibrateDevice(15);
	gameMusic.on = gameMusic.on ? false : true ;
	localStorage.prawnsMusic =  gameMusic.on;

	if (gameMusic.on)
	{
		this.musicBtn.addClass('active');
		this.musicBtn.text('Music: ON');
	}
	else
	{
		this.musicBtn.removeClass('active');
		this.musicBtn.text('Music: OFF');
	}
};

menu.prototype.toggleControls = function()
{
	if (game.mouseControls)
	{
		game.mouseControls = false;
		game.keyboardControls = true;

		this.ctrlsBtn.text('Controls: keyboard');
		player.prototype.setControls = player.prototype.keyboardControls;
		player.prototype.setGunControls = player.prototype.setKeyboardGuns;
		text.prototype.h3Text = 'Press any key to continue';
	}
	else if (game.keyboardControls)
	{
		game.mouseControls = true;
		game.keyboardControls = false;

		this.ctrlsBtn.text('Controls: mouse');
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

		if (gameMusic.on)
		{
			gameMusic.pauseAll();
		}

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

			self.sfxBtn.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			self.musicBtn.animate({
				opacity: 1,
				"left": "-=50%",
			},800);

			self.fullScrnBtn.animate({
				opacity: 1,
				"right": "-=50%",
			},800);

			if (!game.isMobile)
			{
				self.ctrlsBtn.animate({
					opacity: 1,
					"left": "-=50%",
				},800);
			}

			self.creditsBtn.animate({
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

		this.sfxBtn.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		this.musicBtn.animate({
			opacity: 0,
			"left": "+=50%",
		},800);

		this.fullScrnBtn.animate({
			opacity: 0,
			"right": "+=50%",
		},800);

		if (!game.isMobile)
		{
			this.ctrlsBtn.animate({
			opacity: 0,
			"left": "+=50%",
			},800);
		}

		this.creditsBtn.animate({
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
		this.sfxBtn.addClass('active');
		this.sfxBtn.text('Sound: ON');
	}
	else
	{
	this.sfxBtn.removeClass('active');
	this.sfxBtn.text('Sound: OFF');
	}

	if (localStorage.prawnsMusic === 'true') //note = localStorage will only process string values
	{
		this.musicBtn.addClass('active');
		this.musicBtn.text('Music: ON');
	}
	else
	{
		this.musicBtn.removeClass('active');
		this.musicBtn.text('Music: OFF');
	}

	if (localStorage.fullScreen === 'true') //note = localStorage will only process string values
	{
		this.fullScrnBtn.addClass('active');
		this.fullScrnBtn.text('Fullscreen: ON');
	}
	else
	{
		this.fullScrnBtn.removeClass('active');
		this.fullScrnBtn.text('Fullscreen: OFF');
	}

	if (!game.isMobile)
	{
		if (localStorage.mouseControls === 'true') //note = localStorage will only process string values
		{
			this.ctrlsBtn.text('Controls: mouse');
		}

		if (localStorage.keyboardControls === 'true') //note = localStorage will only process string values
		{
			this.ctrlsBtn.text('Controls: keyboard');
		}
	}
	else
	{
		this.ctrlsBtn.disabled = true;
	}

	this.toggle();
};

gameMenu = new menu();
