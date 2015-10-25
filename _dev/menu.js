function menu()
{

	var startBtn = $('#startGame');
	var soundFx = $('#toggleSound');
	var music = $('#toggleMusic');
	var allButtons = $('.menu-option-btn');
	var animationSpeed = 800;

	this.toggled = false;

	// this.widthProp = $(gameArea).height() * (9/16);


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
			game.paused = true;


			if(game.started && startBtn.text !== 'Restart')
			{
				startBtn.text('Restart');
			}
			else
			{
				startBtn.text('Start');
			}

			allButtons.css({"display": "block"});

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
		}
		else
		{
			game.paused = false;

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

		gameMenu.toggle();

	};
	
}

gameMenu = new menu();