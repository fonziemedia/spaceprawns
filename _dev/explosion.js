function explosion(x, y, speed, direction, size) {
	particle.call(this, x, y, speed, direction);

	this.x = x - (size*0.2);
	this.y = y - (size*0.2);
	this.speed = speed;
	this.size = size*1.5;
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;
	this.image = 3;
	this.frameWidth = 96;
	this.frameHeight = 96;
	this.startFrame = 0;
	this.endFrame = 19;
	this.frameSpeed = 2;
	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth);


	// if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}

	this.update = function() {
		this.vx = Math.cos(direction) * (this.speed*dt);
		this.vy = Math.sin(direction) * (this.speed*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
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
		// game.contextPlayer.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (this.currentFrame <= 19){
			game.contextPlayer.drawImage(
				game.images[this.image],
				this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
				this.frameWidth, this.frameHeight,
				this.x, this.y,
				this.size, this.size);
		}

	};
}

explosion.prototype = Object.create(particle.prototype); // Creating a explosion.prototype object that inherits from particle.prototype.
explosion.prototype.constructor = explosion; // Set the "constructor" property to refer to explosion
