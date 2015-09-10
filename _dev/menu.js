function menu()
{
	this.toggled = true;
	this.start = $('#startGame');
	this.restart = $('#resetGame');
	this.soundFx = $('#toggleSound');
	this.music = $('#toggleMusic');
	this.all = $('.menu-option-btn');

	// this.widthProp = $(gameArea).height() * (9/16);


	this.toggleSound = function()
	{
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
			game.tracks.push(game.soundTracks['tune1.mp3']);

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


	this.toggle = function()
	{

		this.toggled = this.toggled ? false : true;


		// IMPROVE THIS WITH LEFT RIGHT BTN CLASSES
		if (!this.toggled)
		{
			game.paused = true;
			
			this.all.css({"display": "block"});

			this.start.animate({
				opacity: 1,
				"right": "-=50%",
			},800);
			this.restart.animate({
				opacity: 1,
				"left": "-=50%",
			},800);
			this.soundFx.animate({
				opacity: 1,
				"right": "-=50%",
			},800);
			this.music.animate({
				opacity: 1,
				"left": "-=50%",
			},800);
		}
		else
		{
			game.paused = false;

			this.start.animate({
				opacity: 0,
				"right": "+=50%",
			},800);
			this.restart.animate({
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
		}

		// this.start.css({"left": ($(gameArea).width()-widthProp)*0.55});		
	};

	this.init = function()
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

		gameMenu.toggle();

	};

	this.hide = function() {
		this.score = game.score;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15*dtSize + 'px helvetica';
		game.contextText.clearRect(this.scoreX, this.height*0.3, this.width*0.14, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.scoreX, this.scoreY); //printing the score
	};
	
}

gameMenu = new menu();