function playerBullet(x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame) {
	particle.call(this, x, y, speed, direction);
	
	this.size = Math.round(bulletSize/pixelRatio);
	this.spriteX = -Math.round(this.size*0.5);
	this.spriteY = -Math.round(this.size*0.5);
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.friction = friction;
	this.dtSet = false;
	this.ctx = game.contextEnemies;
	this.sprite = new sprite(this.image, this.size, imageSize, imageSize, 0, endFrame, 4, this.ctx);

	this.update = function(){ // Replacing the default 'update' method		
		//setting this to make friction work with deltaTime (dt), check particle.js
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * ((speed/pixelRatio)*dt);
			this.vy = Math.sin(direction) * ((speed/pixelRatio)*dt);
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

playerBullet.prototype = Object.create(particle.prototype); // Creating a playerBullet.prototype object that inherits from particle.prototype.
playerBullet.prototype.constructor = playerBullet; // Set the "constructor" property to refer to playerBullet