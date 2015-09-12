function background() {

	this.element = $('#backgroundCanvas');
	this.width = this.element.css("width");
	this.height = this.element.css("height");
	this.speed = Math.round(180*dt);
	// this.section = section;
	// this.width = game.width;
	// this.height = Math.round((game.width * (16 / 9)) * 4);
	this.y = 0;
	// this.y = (this.section === 0) ? -Math.round(this.height-game.height) : -(this.height);
	// this.image = 'level' + game.level + '.jpg'; //needs to be consecutive for this to work
	// this.limits = -game.height*0.02; // *0.02 because of speed and to disguise my bad image manipulation skills

	this.update = function() {

		this.y += 2;
		this.element.css('background-position', '0 ' + this.y + 'px');


		//testing using an off-screen canvas
		// game.contextBackground.drawImage(m_canvas, this.x, this.y, this.width, this.height);
		// game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {

		for (var i = 1; i <= 3; i++) {
			this.element.removeClass('level' + i);
		}
		
		this.element.addClass('level' + game.level);	
	};
}

gameBackground = new background();