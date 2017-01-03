sprite = function(image, columns, rows, animationSpeed)
{
	this.image = gameGfx.offCtx[image];
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
	//create the sequence of frame numbers for the animation
	for (this.frameNum = this.startFrame; this.frameNum <= this.endFrame; this.frameNum++)
	{
		this.animationSequence.push(this.frameNum);
	}
};

sprite.prototype.currentFrame = 0;
sprite.prototype.counter = 0;

sprite.prototype.reset = function(image, columns, rows, animationSpeed)
{
	this.image = gameGfx.offCtx[image];
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

//draw full sprite animation method
sprite.prototype.draw = function(x, y)
{
	this.ctx.drawImage(
		this.image,
		this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
		this.frameWidth, this.frameHeight,
		x, y,
		this.frameWidth, this.frameHeight);

	// update to the next frame if it is time
	if (this.counter == (this.frameSpeed - 1))
	{
		this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
	}

	// update the counter
	this.counter = (this.counter + 1) % this.frameSpeed;

	this.spriteRow = Math.floor(this.animationSequence[this.currentFrame] / this.fpr);
	this.spriteCol = Math.floor(this.animationSequence[this.currentFrame] % this.fpr);
};

//draw specific sprite frame method
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
