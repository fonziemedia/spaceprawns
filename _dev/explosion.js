explosion = function (x, y, speed, direction, size)
{
	this.size = size;
	this.image = 'explosion_s' + this.size;

	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.sprite = new sprite(this.image, 5, 4, 2);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

explosion.prototype.reset = function(x, y, speed, direction, size)
{
	this.size = size;
	this.image = 'explosion_s' + this.size;
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.speed = speed;
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

explosion.prototype.playSfx = function()
{
	switch(this.size)
	{
		case 0:
			gameSfx.play('hit');
		break;
		case 4:
			gameSfx.play('blast');
		break;
		default:
			gameSfx.play('explosion');
	}
};

explosion.prototype.recycle = function()
{
	freeExplosion(this);
};

explosion.prototype.checkStatus = function()
{
	if (gameSfx.on && this.sprite.currentFrame === this.sprite.startFrame)
	{
		this.playSfx();
	}
	if (this.sprite.currentFrame >= this.sprite.endFrame)
	{
		this.recycle();
	}
};

explosion.prototype.setMovement = function()
{
	this.x += this.xThrust;
	this.y += this.yThrust;
};

explosion.prototype.update = function()
{
	this.checkStatus();
	this.setMovement();
	this.draw();
};

explosion.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

////////////
// Factory
////////////
function getNewExplosion(x, y, speed, direction, size)
{
  var e = null;
	// recycle
	e = game.explosionsPool.pop();
	e.reset(x, y, speed, direction, size);
	e.sprite.reset(e.image, 5, 4, 2);
	game.objects.push(e);
}

function freeExplosion(e)
{
	// find the active explosion and remove it
	game.objects.splice(game.objects.indexOf(e),1);
	// return the explosion back into the pool
	game.explosionsPool.push(e);
}

////////////////////////////
// Pre-load game explosions
////////////////////////////
function initExplosions()
{
	for (var ex = 1 ; ex <= game.requiredExplosions; ex++)
	{
		e = new explosion(null, null, null, null, 1, null);
		game.explosionsPool.push(e);
		game.doneObjects++;
	}
}
