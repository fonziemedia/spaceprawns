function text() {

	this.font = game.isMobile ? 'Monaco' : 'Helvetica';
	this.fontWeight = 'bold';
	this.fontColor0 = 'purple';
	this.fontColor1 = '#FFC619';
	this.fontColor2 = '#FFFFFF';
	this.levelBriefing = ['Outside the galaxy', 'The outer space', 'AlphaPI 2034' ];
	this.introBackground = 'intro_bg.jpg';

	// function message(message, row, font, fontSize, fontColor, fontWeight)

	// this.gameLoading = function() {
	// 	game.contextText.clearRect(0, 0, game.width, game.height);

	// 	message('Loading...', 1, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 

	// };

	this.gameIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		game.contextBackground.drawImage(game.images[this.introBackground], 0, 0, game.width, game.height);

		message('Space Prawns 2039', 1,  this.font, game.width*0.09, this.fontColor0, this.fontWeight); 
		message('We invited, they came...', 2, this.font, game.width*0.07, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to start', 3, this.font, game.width*0.06, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to start', 3, this.font, game.width*0.06, this.fontColor2, this.fontWeight);
		}
	};

	this.lvlIntro = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);				

		message('Stage ' + game.level, 1,  this.font, game.width*0.06, this.fontColor1, this.fontWeight); 
		message(this.levelBriefing[game.level - 1], 2, this.font, game.width*0.05, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight);
		}
	};

	this.lvlComplete = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Stage Complete!', 1,  this.font, game.width*0.06, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, game.width*0.05, this.fontColor1, this.fontWeight);

		if (game.isMobile)
		{
			message('Tap screen to continue', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to continue', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight);
		}

	};

	this.gameOver = function() {
		game.contextText.clearRect(0, 0, game.width, game.height);
		
		message('Game Over', 1,  this.font, game.width*0.06, this.fontColor1, this.fontWeight); 
		message(game.score + ' enemy ships destroyed', 2, this.font, game.width*0.05, this.fontColor1, this.fontWeight);
		
		if (game.isMobile)
		{
			message('Tap screen to restart', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight); 
		}
		else
		{
			message('Press ENTER or LMB to restart', 3, this.font, game.width*0.04, this.fontColor2, this.fontWeight);
		}

	};

}

gameText = new text();