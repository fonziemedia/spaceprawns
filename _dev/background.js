background = function()
{
	this.imageA = game.offCtx['bg_level' + game.level + '_a'];
	this.imageB = game.offCtx['bg_level' + game.level + '_b'];
	this.imageC = game.offCtx['bg_level' + game.level + '_c'];
	this.x = this.imageA.width <= game.windowWidth ? 0 : Math.round(0 - (this.imageA.width - game.windowWidth)/2);
	this.speed = Math.floor(2*game.dt*game.deltaSpeed);
	this.imageA.isOn = true;
	this.imageA.sY = 0;
	this.imageA.sH = this.imageA.height;
	this.imageA.dY = 0;
	this.imageA.dH = this.imageA.height;
	this.imageB.isOn = true;
	this.imageB.sY = this.imageB.height;
	this.imageB.sH = 1;
	this.imageB.dY = 0;
	this.imageB.dH = 0;
	this.imageC.isOn = false;
	this.imageC.sY = this.imageC.height;
	this.imageC.sH = 1;
	this.imageC.dY = 0;
	this.imageC.dH = 0;
	this.ctx = game.context;
};

background.prototype.drawSlice = function(image)
{
	this.ctx.drawImage(image, 0, image.sY, image.width, image.sH, this.x, image.dY, image.width, image.dH);
};

background.prototype.retractReset = function(image)
{
	image.sY = 0;
	image.sH = image.height;
	image.dH = image.height;
};

background.prototype.expandReset = function(image)
{
	 image.sY = image.height;
	 image.sH = 1;
	 image.dY = 0;
	 image.dH = 0;
};

background.prototype.expandA = function()
{
	this.imageA.sY -= this.speed;
	this.imageA.sH += this.speed;
	this.imageA.dH += this.speed;

	if (this.imageA.sH > this.imageA.height)
	{
		this.retractReset(this.imageA);
		background.prototype.updateSliceA = background.prototype.retractA;
	}
};

background.prototype.retractA = function()
{
	this.imageA.sH -= this.speed;
	this.imageA.dY += this.speed;
	this.imageA.dH -= this.speed;

	if (this.imageA.sH < this.speed)
	{
		this.imageA.isOn = false;
		this.imageC.isOn = true;
		this.expandReset(this.imageA);
		background.prototype.updateSliceA = background.prototype.expandA;
	}
};

background.prototype.expandB = function()
{
	this.imageB.sY -= this.speed;
	this.imageB.sH += this.speed;
	this.imageB.dH += this.speed;

	if (this.imageB.sH > this.imageB.height)
	{
		this.retractReset(this.imageB);
		background.prototype.updateSliceB = background.prototype.retractB;
	}
};

background.prototype.retractB = function()
{
	this.imageB.sH -= this.speed;
	this.imageB.dY += this.speed;
	this.imageB.dH -= this.speed;

	if (this.imageB.sH < this.speed)
	{
		this.imageB.isOn = false;
		this.imageA.isOn = true;
		this.expandReset(this.imageB);
		background.prototype.updateSliceB = background.prototype.expandB;
	}
};

background.prototype.expandC = function()
{
	this.imageC.sY -= this.speed;
	this.imageC.sH += this.speed;
	this.imageC.dH += this.speed;

	if (this.imageC.sH > this.imageC.height)
	{
		this.retractReset(this.imageC);
		background.prototype.updateSliceC = background.prototype.retractC;
	}
};

background.prototype.retractC = function()
{
	this.imageC.sH -= this.speed;
	this.imageC.dY += this.speed;
	this.imageC.dH -= this.speed;

	if (this.imageC.sH < this.speed)
	{
		this.imageC.isOn = false;
		this.imageB.isOn = true;
		this.expandReset(this.imageC);
		background.prototype.updateSliceC = background.prototype.expandC;
	}
};

background.prototype.updateSliceA = background.prototype.retractA;
background.prototype.updateSliceB = background.prototype.expandB;
background.prototype.updateSliceC = background.prototype.expandC;

background.prototype.update = function()
{
	if (this.imageA.isOn)
	{
		this.updateSliceA();
		this.drawSlice(this.imageA);
	}
	if (this.imageB.isOn)
	{
		this.updateSliceB();
		this.drawSlice(this.imageB);
	}
	if (this.imageC.isOn)
	{
		this.updateSliceC();
		this.drawSlice(this.imageC);
	}
};
