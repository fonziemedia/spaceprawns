function background(speed, image, section) {
	particle.call(this, speed);

	this.direction = Math.PI/2;
	this.section = section;
	this.width = game.width;
	this.height = (game.width * (16 / 9)) * 4 ;
	this.x = 0;
	switch (this.section) {
		case 0:
		this.y = -(this.height-game.height);
		break;
		case 1:
		this.y = -(this.height);
		break;
	}
	
	this.image = image;

	this.update = function() {
		this.vx = Math.cos(this.direction) * (speed*dt);
		this.vy = Math.sin(this.direction) * (speed*dt);
		this.handleSprings();
		this.handleGravitations();
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};


	this.draw = function() {


		game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);

	};	
}

background.prototype = Object.create(particle.prototype); // Creating a background.prototype object that inherits from particle.prototype.
background.prototype.constructor = background; // Set the "constructor" property to refer to background

level1Bg = [];