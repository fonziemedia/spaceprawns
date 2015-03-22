function ui() {

	this.width = game.width;
	this.height = game.height*0.025;
	this.textColor = "#FFD455";
	this.font = "px helvetica";
	this.fontSize = 15*dtSize;
	this.energyBarSize = game.width*0.3;
	this.energyPointSize = game.height*0.01;
	this.hangarShipSize = game.height*0.03;

	this.update = function() {
		this.level = game.level;
		this.score = game.score;
		this.soundFx = game.sound ? "ON" : "OFF";
		// this.music = game.music;
		this.hangar = playerShip.lives;		
		this.hull = playerShip.hull; 

	
		game.contextText.fillStyle = this.textColor;
		game.contextText.font = this.fontSize + this.font;
		game.contextText.clearRect(0, 0, this.width, this.height*1.5);
		game.contextText.fillText("S" + this.level, this.width*0.02, this.height); //printing level
		game.contextText.fillText("Score: " + this.score, this.width*0.1, this.height); //printing the score

		if (!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
			game.contextText.fillText("Sound(F8): " + this.soundFx, this.width*0.25, this.height); //printing lives
		}
		game.contextText.drawImage(game.images[25], this.width*0.5, -this.height*0.1, this.energyBarSize, this.energyBarSize/4);
		for (s = 0; s < this.hull; s++){	
			game.contextText.drawImage(game.images[26], (this.width*0.545)+(s/10), this.height*0.32, this.energyPointSize, this.energyPointSize*2.2);
		}
		for (i = 0; i < this.hangar; i++){
			//printing lives
			game.contextText.drawImage(game.images[0], this.width*0.82 + (this.width * 0.05 * i) , this.height*0.3, this.hangarShipSize, this.hangarShipSize);
		}
	};
	
}

gameUI = new ui();