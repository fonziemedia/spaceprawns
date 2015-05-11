function text() {

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

	this.lvlIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);				

		message('Stage ' + game.level, 1,  this.font, this.fontSize0, this.fontColor1, this.fontWeight); 
		message(this.levelBriefing[game.level - 1], 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}
	};

	this.lvlComplete = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Stage Complete!', 1,  this.font,this.fontSize0, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}

	};

	this.gameOver = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Game Over', 1,  this.font, this.fontSize0, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, this.fontSize1, this.fontColor1, this.fontWeight);
		
		if (game.isMobile)
		{
			message('Tap screen to restart', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to restart', 3, this.font, this.fontSize2, this.fontColor2, this.fontWeight);
		}

	};

}

gameText = new text();