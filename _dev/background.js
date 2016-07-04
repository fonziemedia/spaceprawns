background = function()
{
	this.imageA = game.offCtx['bg_level' + game.level + '_a'];
	this.imageB = game.offCtx['bg_level' + game.level + '_b'];
	this.imageC = game.offCtx['bg_level' + game.level + '_c'];
	this.height = Math.round(this.imageA.height);
	this.width = Math.round(this.imageA.width);
	this.x = this.width <= game.windowWidth ? 0 : Math.round(0 - (this.width-game.windowWidth)/2);
	this.speed = Math.floor(2*game.dt*game.deltaSpeed);
	this.yDrawLimit = -this.height;
	this.imageA_y = 0;
	this.imageB_y = this.imageA_y - this.height;
	this.imageC_y = this.yDrawLimit - 1;
	this.ctx = game.context;
};

background.prototype.draw = function(image, x, y)
{
	this.ctx.drawImage(image, x, y);
};

background.prototype.updateA = function()
{
	if (this.imageA_y >= this.yDrawLimit)
	{
		this.draw(this.imageA, this.x, this.imageA_y);
		this.imageA_y += this.speed;

		if (this.imageB_y > 0)
		{
			this.imageA_y = this.yDrawLimit - 1;
			this.imageC_y = this.imageB_y - this.height;
		}
	}
};

background.prototype.updateB = function()
{
	if (this.imageB_y >= this.yDrawLimit)
	{
		this.draw(this.imageB, this.x, this.imageB_y);
		this.imageB_y += this.speed;

		if (this.imageC_y > 0)
		{
			this.imageB_y = this.yDrawLimit - 1;
			this.imageA_y = this.imageC_y - this.height + this.speed; //+ this.speed to compensate loop position
		}
	}
};

background.prototype.updateC = function()
{
	if (this.imageC_y >= this.yDrawLimit)
	{
		this.draw(this.imageC, this.x, this.imageC_y);
		this.imageC_y += this.speed;

		if (this.imageA_y > 0)
		{
			this.imageC_y = this.yDrawLimit - 1;
			this.imageB_y = this.imageA_y - this.height + this.speed; //+ this.speed to compensate loop position
		}
	}
};

background.prototype.update = function()
{
	this.updateA();
	this.updateB();
	this.updateC();
};
