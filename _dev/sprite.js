sprite = function(image, columns, rows, animationSpeed)
{
	this.image = game.offCtx[image];
	this.width = this.image.width;
	this.height = this.image.height;
	this.totalFrames = columns * rows;
	this.frameWidth = this.width / columns;
	this.frameHeight = this.height / rows;
	this.startFrame = 0;
	this.endFrame = this.totalFrames - 1;	//will be used to create the animationSequence array
	this.frameSpeed = animationSpeed;
	this.ctx = game.context;
	this.animationSequence = [];	// array holding the order of the animation
	this.fpr = Math.floor(this.image.width / this.frameWidth);

	//calculate frame dimensions using number of frames / number of rows etc

	// create the sequence of frame numbers for the animation
	for (this.frameNum = this.startFrame; this.frameNum <= this.endFrame; this.frameNum++)
	{
		this.animationSequence.push(this.frameNum);
	}
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
sprite.prototype.currentFrame = 0;        // the current frame to draw
sprite.prototype.counter = 0;

sprite.prototype.reset = function(image, columns, rows, animationSpeed)
{
	this.image = game.offCtx[image];
	this.width = this.image.width;
	this.height = this.image.height;
	this.totalFrames = columns * rows;
	this.frameWidth = this.width / columns;
	this.frameHeight = this.height / rows;
	this.startFrame = 0;
	this.endFrame = this.totalFrames - 1;	//will be used to create the animationSequence array
	this.frameSpeed = animationSpeed;
	this.animationSequence = [];  // array holding the order of the animation
	this.fpr = Math.floor(this.image.width / this.frameWidth);

	this.currentFrame = 0;
	this.counter = 0;

	// create the sequence of frame numbers for the animation
	for (this.frameNum = this.startFrame; this.frameNum <= this.endFrame; this.frameNum++)
	{
		this.animationSequence.push(this.frameNum);
	}
};

// sprite.prototype.update = function(){ // Replacing the default 'update' method
// 	//setting this to make friction work with deltaTime (dt), check particle.js
// 	if (dt !== 0 && !this.dtSet){
// 		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
// 		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
// 		this.dtSet = true;
// 	}
// 	this.vx *= this.friction;
// 	this.vy *= this.friction;
// 	this.x += this.vx;
// 	this.y += this.vy;
// };

sprite.prototype.draw = function(x, y)
{
	this.ctx.drawImage(
		this.image,
		this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
		this.frameWidth, this.frameHeight,
		x, y,
		this.frameWidth, this.frameHeight);

	// update to the next frame if it is time
	if (this.counter == (this.frameSpeed - 1)) {
		this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
	}

	// update the counter
	this.counter = (this.counter + 1) % this.frameSpeed;

	this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
	this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);
};

sprite.prototype.drawFrame = function(x, y, frame)
{

	this.currentFrame =  frame % this.animationSequence.length;

	this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
	this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);

	this.ctx.drawImage(
		this.image,
		this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
		this.frameWidth, this.frameHeight,
		x, y,
		this.frameWidth, this.frameHeight);
};
