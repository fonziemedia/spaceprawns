function ui() {

	this.width = game.width;
	this.height = game.height*0.04;
	this.energyBarSize = game.width*0.3;
	this.energyPointSize = game.height*0.01;
	this.hangarShipSize = game.height*0.03;
	this.level = game.level;
	game.contextText.fillStyle = "#FFD455";
	game.contextText.font = 15*dtSize + 'px helvetica';

	this.updateLevel = function() {
		this.level = game.level;
		game.contextText.clearRect(this.width*0.02, this.height*0.3, this.width*0.05, this.height*0.35); 
		game.contextText.fillText("S" + this.level, this.width*0.02, this.height*0.6); //printing level
	};

	this.updateScore = function() {
		this.score = game.score;
		game.contextText.clearRect(this.width*0.1, this.height*0.3, this.width*0.12, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.width*0.1, this.height*0.6); //printing the score
	};

	this.updateSound = function() {	
		this.soundFx = game.sound ? "ON" : "OFF";
		// this.music = game.music;	
		if (!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
			game.contextText.clearRect(this.width*0.39, this.height*0.3, this.width*0.05, this.height*0.35); 
			game.contextText.fillText("Sound(F8): " + this.soundFx, this.width*0.25, this.height*0.6);
		}
	};

	this.updateEnergy = function() {		
		this.hull = playerShip.hull;
		game.contextText.clearRect(this.width*0.555, this.height*0.27, this.width*0.205, this.height*0.34);				
		for (s = 0; s < this.hull; s++){	
			game.contextText.drawImage(game.images[26], (this.width*0.545)+s*11, this.height*0.15, this.energyPointSize, this.energyPointSize*2.2);
		}
	};

	this.updateHangar = function() {
		this.hangar = playerShip.lives;
		game.contextText.clearRect(this.width*0.83, this.height*0.35, this.width*0.13, this.height*0.58);		
		for (i = 0; i < this.hangar; i++){
			//printing lives
			game.contextText.drawImage(game.images[0], this.width*0.82 + (this.width * 0.05 * i) , this.height*0.3, this.hangarShipSize, this.hangarShipSize);
		}
	};

	this.updateAll = function() {
		game.contextText.clearRect(0, 0, this.width, this.height*1.5);
		game.contextText.drawImage(game.images[25], this.width*0.5, -this.height*0.1, this.energyBarSize, this.energyBarSize/4);
		this.updateLevel();
		this.updateScore();
		this.updateSound();
		this.updateEnergy();
		this.updateHangar();		
	};
	
}

gameUI = new ui();