function enemyBullet(x, y, speed, direction, power, image) {
	particle.call(this, x, y, speed, direction);
	
	this.size = 30*dtSize;
	this.power = power;
	this.image = image; 
	this.dead = false;
	this.deadTime = 60;
	this.frameWidth = 64;
	this.frameHeight = 64;
	this.startFrame = 0;
	this.endFrame = 2;
	this.frameSpeed = 5;
	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth); //Sprite FramesperRow
	this.image = image;
	this.friction = 1.02;
	this.dtSet = false;
	this.ctx = game.contextEnemies;

	this.update = function(){ // Replacing the default 'update' method
		if (dt !== 0 && !this.dtSet){
			this.vx = Math.cos(direction) * (speed*dt);
			this.vy = Math.sin(direction) * (speed*dt);
			this.dtSet = true;
		}		
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		// create the sequence of frame numbers for the animation
		for (this.FrameNum = this.startFrame; this.FrameNum <= this.endFrame; this.FrameNum++){
			this.animationSequence.push(this.FrameNum);
		}

		// update to the next frame if it is time
		if (this.counter == (this.frameSpeed - 1)) {
			this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
		}

		// update the counter
		this.counter = (this.counter + 1) % this.frameSpeed;

		this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
		this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);

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

			this.ctx.drawImage(
				game.images[this.image],
				this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
				this.frameWidth, this.frameHeight,
				-this.size/2, -this.size/2,
				this.size, this.size);
			
			this.ctx.restore();

		}
	};
}

enemyBullet.prototype = Object.create(particle.prototype); // Creating a enemyBullet.prototype object that inherits from particle.prototype.
enemyBullet.prototype.constructor = enemyBullet; // Set the "constructor" property to refer to enemyBullet