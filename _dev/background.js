background = function()
{
	this.image = game.offCtx['bg_level' + game.level];
	//main image properties
	this.image.sX = this.image.width <= game.width ? 0 : Math.ceil((this.image.width - game.width)/2);
	this.image.sY = this.image.height - game.height;
	this.image.sH = game.height;
	this.image.sW = game.width;
	this.image.dX = 0;
	this.image.dY = 0;
	this.image.dW = game.width;
	this.image.dH = game.height;
	//clone image properties
	this.image.TsX = this.image.sX;
	this.image.TsY = 1;
	this.image.TsW = this.image.sW;
	this.image.TsH = game.height;
	this.image.TdX = 0;
	this.image.TdY = 0;
	this.image.TdW = this.image.dW;
	this.image.TdH = game.height;

	this.speed = Math.floor(2*game.dt*game.deltaSpeed);
	this.ctx = game.context;
};

background.prototype.resize = function()
{
	this.image.sX = this.image.width <= game.width ? 0 : Math.ceil((this.image.width - game.width)/2);
	this.image.sW = game.width;
	this.image.dW = game.width;

	if (background.prototype.update == background.prototype.roll)
	{
		this.image.sH = game.height;
		this.image.dH = game.height;
	}
	else
	{
		// rescale trans image properties
		this.image.TsH = game.height;
		this.image.TdH = game.height;
	}
};

background.prototype.drawImage = function()
{
	this.ctx.drawImage(this.image, this.image.sX, this.image.sY, this.image.sW, this.image.sH, this.image.dX, this.image.dY, this.image.dW, this.image.dH);
};

background.prototype.drawTransImage = function()
{
	this.ctx.drawImage(this.image, this.image.TsX, this.image.TsY, this.image.TsW, this.image.TsH, this.image.TdX, this.image.TdY, this.image.TdW, this.image.TdH);
};

background.prototype.transitionReset = function()
{
	this.image.TsY = this.image.sY;
	this.image.TsH = this.image.sH;
	this.image.TdY = this.image.dY;
	this.image.TdH = this.image.dH;
	
	this.image.sY = this.image.height;
	this.image.sH = 1;
	this.image.dY = 0;
	this.image.dH = 1;

	background.prototype.update = background.prototype.transition;
};

background.prototype.rollReset = function()
{
	this.image.dH = this.image.TdY;
	background.prototype.update = background.prototype.roll;
};

background.prototype.roll = function()
{
	this.image.sY -= this.speed;
	// this.image.sH -= this.speed; //cool light speed effect

	if (this.image.sY <= 1)
	{
		this.transitionReset();
		return;
	}

	this.drawImage();
};

background.prototype.transition = function()
{
	this.image.TsH -= this.speed;
	this.image.TdY += this.speed;
	this.image.TdH -= this.speed;

	this.image.sY -= this.speed;
	this.image.sH += this.speed;
	this.image.dH += this.speed;

	if (this.image.TsH <= 0)
	{
		this.rollReset();
		return;
	}

	this.drawTransImage();
	this.drawImage();
};

background.prototype.update = background.prototype.roll;
