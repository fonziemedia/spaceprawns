function background(speed, image, section) {
	particle.call(this, speed);

	this.direction = Math.PI/2;
	this.section = section;
	this.width = game.width;
	this.height = (game.width * (16 / 9)) * 4 ;
	this.x = 0;
	this.y = (this.section === 0) ? -(this.height-game.height) : this.y = -(this.height);
	this.image = 20 + game.level; //the image before all background images, these need to be consecutive in order for this to work	;
	this.limits = -game.height*0.02;

	this.update = function() {
		this.vx = Math.cos(this.direction) * (speed*dt);
		this.vy = Math.sin(this.direction) * (speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};


	this.draw = function() {
		game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {
		if (game.background.length < 1)
		{					
			game.background.push(new background(150, this.image, 0));			
		}

		for (var b in game.background)
		{
			if (game.background[b].y > this.limits && game.background.length < 2){

				game.background.push(new background(150, this.image, 1));				
			}

			if (game.background[b].y > game.height){
				game.background.splice(b, 1);
			}

			game.background[b].update();			
			game.background[b].draw();				
		}
	};
}

background.prototype = Object.create(particle.prototype); // Creating a background.prototype object that inherits from particle.prototype.
background.prototype.constructor = background; // Set the "constructor" property to refer to background

gameBackground = new background();