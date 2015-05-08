function enemyBullet(x, y, speed, direction, power, image) {
	particle.call(this, x, y, speed, direction);
	
	this.size = Math.round(30*dtSize);
	this.spriteX = -Math.round(this.size*0.5);
	this.spriteY = -Math.round(this.size*0.5);
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.friction = 1.02;
	this.dtSet = false;
	this.ctx = game.contextEnemies;
	this.sprite = new sprite(this.image, this.size, 64, 64, 0, 2, 5, this.ctx);

	this.update = function()
	{ 	
		// Replacing the default 'update' method
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
			this.dtSet = true;
		}		
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

	};
	
	this.draw = function() {
		
		
		if (!this.dead) {			

			// this.ctx.save();
			// this.ctx.translate(this.lastX, this.lastY);
			// this.ctx.rotate(direction - Math.PI/2);

			// this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails

			// this.ctx.restore();

			this.ctx.save();
			this.ctx.translate(this.x, this.y);
			this.ctx.rotate(direction - Math.PI/2);

			this.sprite.draw(this.spriteX, this.spriteY); //-this.size/2 because we're rotating ctx
			
			this.ctx.restore();

		}
	};
}

enemyBullet.prototype = Object.create(particle.prototype); // Creating a enemyBullet.prototype object that inherits from particle.prototype.
enemyBullet.prototype.constructor = enemyBullet; // Set the "constructor" property to refer to enemyBullet