background = function(section)
{
	this.imageA = game.offCtx['bg_level' + game.level + '_a'];
	this.imageB = game.offCtx['bg_level' + game.level + '_b'];
	this.imageC = game.offCtx['bg_level' + game.level + '_c'];
	this.height = Math.round(this.imageA.height);
	this.width = Math.round(this.imageA.width);
	this.x = this.width <= game.windowWidth ? 0 : Math.round(0 - (this.width-game.windowWidth)/2);
	this.y1 = 0;
	this.y2 = this.y1-this.height;
	this.y3 = this.y2-this.height;
	this.yDrawLimit = !game.isMobile || win.innerHeight >= 900 ? -1080 : -640;
	this.speed = Math.round(200*dt);
	this.ctx = game.context;
};


background.prototype.update = function()
{

	this.y1 += this.speed;
	this.y2 += this.speed;
	this.y3 += this.speed;


	if (this.y1 >= this.yDrawLimit && this.y1 < game.height)
	{
		this.draw(this.imageA, this.x, this.y1);
	}
	else
	{
		this.y1 = this.y3-this.height;
	}

	if (this.y2 >= this.yDrawLimit && this.y2 < game.height)
	{
		this.draw(this.imageB, this.x, this.y2);
	}
	else
	{
		this.y2 = this.y1-this.height;
	}

	if (this.y3 >= this.yDrawLimit && this.y3 < game.height)
	{
		this.draw(this.imageC, this.x, this.y3);
	}
	else
	{
		this.y3 = this.y2-this.height;
	}

};

background.prototype.draw = function(image, x, y)
{
	this.ctx.drawImage(image, x, y);
};
