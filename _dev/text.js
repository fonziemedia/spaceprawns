function text(header1, header2, inputRequired) {

	var h1 = $('#h1');
	var h2 = $('#h2');
	var h3 = $('#h3');

	var h1Text = header1;
	var h2Text = header2;
	var h3Text = game.isMobile ? 'Tap screen to continue' : 'Press ENTER or LMB to start';
	var allText = $('.all-text');
	var textInput = inputRequired;

	var effectDuration = 2000;


	this.font = 'Helvetica';
	this.fontWeight = 'bold';
	this.fontColor0 = 'purple';
	this.fontColor1 = '#FFC619';
	this.fontColor2 = '#FFFFFF';
	this.introFontSize0 = Math.round(game.width*0.09); //Intro title size
	this.introFontSize1 = Math.round(game.width*0.07); //Intro sub-title size
	this.introFontSize2 = Math.round(game.width*0.06); //Intro hint size
	this.fontSize0 = Math.round(game.width*0.06); //title size
	this.fontSize1 = Math.round(game.width*0.05); //sub-title size
	this.fontSize2 = Math.round(game.width*0.04); //hint size

	this.levelBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
	this.introBackground = 'intro_bg.jpg';

	// function message(message, row, font, fontSize, fontColor, fontWeight)

	// this.gameLoading = function() {
	// 	game.contextText.clearRect(0, 0, game.width, game.height);

	// 	message('Loading...', 1, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 

	// };

	

	this.gameIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		game.contextText.drawImage(game.images[this.introBackground], 0, 0, game.width, game.height); //use ctx text here because ctx background will clear in main update

		message('Space Prawns 2039', 1,  this.font, this.introFontSize0, this.fontColor0, this.fontWeight); 
		message('We invited, they came...', 2, this.font, this.introFontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to start', 3, this.font, this.introFontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to start', 3, this.font, this.introFontSize2, this.fontColor2, this.fontWeight);
		}
	};



	this.switch = function(trigger)
	{
		switch (trigger)
		{
			case 'on':
				allText.show();
				game.textFaded = false;
			break;

			case 'off':
				allText.stop(true, true);
				allText.hide();
				game.textFaded = true;
			break;
		}
	};

	this.fade = function(trigger)
	{
		switch (trigger)
		{
			case 'in':				
				game.textFadingIn = true;				
				allText.fadeIn(effectDuration, function(){
					game.textFadingIn = false;
					game.textFaded = false;
				});
			break;

			case 'out':
				game.textFadingOut = true;
				allText.fadeOut(effectDuration, function(){
					h1.text('');		
					h2.text('');
					h3.text('');
					game.textFadingOut = false;
					game.textFaded = true;
				});
			break;
		}
	};

	this.init = function()
	{
		h1.text(h1Text);		
		h2.text(h2Text);
		if (textInput){h3.text(h3Text);}else{h3.text('');}		
	};

	this.init();

}

gameText = new text(); //To be removed!