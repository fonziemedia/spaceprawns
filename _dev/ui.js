function ui() {

	this.width = game.width;
	this.height = game.height*0.04;
	this.enContainerWidth = game.width*0.3;
	this.enContainerHeight = game.height*0.04;
	this.enBarHeight = game.height*0.019;
	this.enBarVol = game.width*0.2;	
	this.hangarShipSize = game.height*0.03;
	this.level = game.level;
	this.hangarImg = 'fighter.png';
	this.enPointImg = 'energypoint.png'; // jshint ignore:line
	this.enContainerImg = 'energybar.png';// jshint ignore:line
	this.scoreX = Math.round(this.width*0.1);
	this.scoreY = Math.round(this.height*0.6);
	this.energyX = Math.round(this.width*0.3);
	this.energyY = Math.round(this.height*0.18);


	this.updateLevel = function() {
		this.level = game.level;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15 + 'px helvetica';
		game.contextText.clearRect(this.width*0.02, this.height*0.3, this.width*0.05, this.height*0.35); 
		game.contextText.fillText("S" + this.level, this.width*0.02, this.height*0.6); //printing level
	};

	this.updateScore = function() {
		this.score = game.score;
		game.contextText.fillStyle = "#FFD455";
		game.contextText.font = 15 + 'px helvetica';
		game.contextText.clearRect(this.scoreX, this.height*0.3, this.width*0.14, this.height*0.35);  
		game.contextText.fillText("Score: " + this.score, this.scoreX, this.scoreY); //printing the score
	};

	// this.updateSound = function() {	
	// 	this.soundFx = game.sound ? "ON" : "OFF";
	// 	// this.music = game.music;			

	// 	if (!game.isMobile) {
	// 		game.contextText.fillStyle = "#FFD455";
	// 		game.contextText.font = 15 + 'px helvetica';
	// 		game.contextText.clearRect(this.width*0.25, this.height*0.3, this.width*0.2, this.height*0.35); 
	// 		game.contextText.fillText("Sound(F8): " + this.soundFx, this.width*0.25, this.height*0.6);
	// 	}
	// };

	this.updateEnergy = function() {		
		this.hull = playerShip.hull > 0 ? playerShip.hull*game.width*0.02 : 0;
		game.contextText.clearRect(this.energyX, this.height*0.2, this.enBarVol, this.enBarHeight);	
		game.contextText.drawImage(game.images[this.enPointImg], this.energyX, this.energyY, this.hull, this.enBarHeight);		
	};

	this.updateHangar = function() {
		this.hangar = playerShip.lives;
		game.contextText.clearRect(this.width*0.69, this.height*0.2, this.hangarShipSize*3, this.hangarShipSize);		
		for (i = 0; i < this.hangar; i++){
			//printing lives
			game.contextText.drawImage(game.images[this.hangarImg], this.width*0.68 + (this.width * 0.05 * i) , this.height*0.2, this.hangarShipSize, this.hangarShipSize);
		}
	};

	this.updateAll = function() {
		game.contextText.clearRect(0, 0, this.width, this.height*1.5);
		game.contextText.drawImage(game.images[this.enContainerImg], this.width*0.25, -this.height*0.1, this.enContainerWidth, this.enContainerHeight);
		this.updateLevel();
		this.updateScore();
		// this.updateSound();
		this.updateEnergy();
		this.updateHangar();		
	};
	
}

gameUI = new ui();