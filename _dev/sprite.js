function sprite(image, imageSize, frameWidth, frameHeight, startFrame, endFrame, frameSpeed, ctx) {	
	this.image = image;
	this.imageSize = imageSize;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.startFrame = startFrame;
	this.endFrame = endFrame;
	this.frameSpeed = frameSpeed;
	this.ctx = ctx;

	this.animationSequence = [];  // array holding the order of the animation
	this.currentFrame = 0;        // the current frame to draw
	this.counter = 0;
	this.fpr = Math.floor(game.images[this.image].width / this.frameWidth);

	//====================== Caching Off-Screen canvas =================//
	this.offCanvas = document.createElement('canvas');
	this.offCanvas.width = game.images[this.image].width;
	this.offCanvas.height = game.images[this.image].height;
	this.offCtx = this.offCanvas.getContext('2d');

	this.offCtx.drawImage(game.images[this.image], 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.draw = function(x, y)
	{
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

		this.ctx.drawImage(
			this.offCanvas,
			this.spriteCol * this.frameWidth, this.spriteRow * this.frameHeight,
			this.frameWidth, this.frameHeight,
			x, y,
			this.imageSize, this.imageSize);
	};
}