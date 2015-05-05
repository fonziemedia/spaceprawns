function background(section) {

	this.speed = 180*dt;
	this.section = section;
	this.width = game.width;
	this.height = (game.width * (16 / 9)) * 4 ;
	this.x = 0;
	this.y = (this.section === 0) ? -(this.height-game.height) : this.y = -(this.height);
	this.image = 'level' + game.level + '.jpg'; //needs to be consecutive for this to work
	this.limits = -game.height*0.01; // *0.01 to disguise my bad image manipulation skills

	this.update = function() {
		this.y += this.speed;
		game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {
		if (game.background.length < 1)
		{					
			game.background.push(new background(0));			
		}

		for (var b in game.background)
		{
			if (game.background[b].y > this.limits && game.background.length < 2){

				game.background.push(new background(1));				
			}

			if (game.background[b].y > game.height){
				game.background.splice(b, 1);
			}

			game.background[b].update();			
		}
	};
}

gameBackground = new background();