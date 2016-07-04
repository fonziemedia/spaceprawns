explosion = function (x, y, speed, direction, size)
{
	this.explosions = ['explosion_s0',
										 'explosion_s1',
										 'explosion_s2',
										 'explosion_s3',
										 'explosion_s4'];

	switch(size)
	{
		case 0:
			this.image = this.explosions[0];
		break;
		case 1:
			this.image = this.explosions[1];
		break;
		case 2:
			this.image = this.explosions[2];
		break;
		case 3:
			this.image = this.explosions[3];
		break;
		case 4:
			this.image = this.explosions[4];
		break;
	}
	this.sprite = new sprite(this.image, 5, 4, 2);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = Math.round(speed);
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};
explosion.prototype.audioHit1 = 'hit' + fileFormat;
explosion.prototype.audioHit2 = 'hit2' + fileFormat;
explosion.prototype.audioHit3 = 'hit3' + fileFormat;
explosion.prototype.audioDead1 = 'explosion' + fileFormat;
explosion.prototype.audioDead2 = 'explosion2' + fileFormat;
explosion.prototype.audioDead3 = 'explosion3' + fileFormat;
explosion.prototype.audioExplode = 'blast' + fileFormat;

explosion.prototype.reset = function(x, y, speed, direction, size)
{
	switch(size)
	{
		case 0:
			this.image = this.explosions[0];
			explosion.prototype.playSfx = explosion.prototype.sfxChasis;
		break;
		case 1:
			this.image = this.explosions[1];			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 2:
			this.image = this.explosions[2];
			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 3:
			this.image = this.explosions[3];			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 4:
			this.image = this.explosions[4];
			explosion.prototype.playSfx = explosion.prototype.sfxBlast;
		break;
	}
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.speed = speed;
	this.direction = direction;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

explosion.prototype.sfxDefault = function()
{
	if (game.sound)
	{
		if (game.sfx[this.audioDead1].paused)
		{
			game.sounds.push(game.sfx[this.audioDead1]);
		}
		else if (game.sfx[this.audioDead2].paused)
		{
			game.sounds.push(game.sfx[this.audioDead2]);
		}
		else if (game.sfx[this.audioDead3].paused)
		{
			game.sounds.push(game.sfx[this.audioDead3]);
		}
	}
};

explosion.prototype.sfxChasis = function()
{
	if (game.sound)
  {
		if (game.sfx[this.audioHit1].paused)
		{
			game.sounds.push(game.sfx[this.audioHit1]);
		}
		else if (game.sfx[this.audioHit2].paused)
		{
			game.sounds.push(game.sfx[this.audioHit2]);
		}
		else if (game.sfx[this.audioHit3].paused)
		{
			game.sounds.push(game.sfx[this.audioHit3]);
		}
  }
};

explosion.prototype.sfxBlast = function()
{
	if (game.sound)
  {
		game.sounds.push(game.sfx[this.audioExplode]);
	}
};

explosion.prototype.playSfx = explosion.prototype.sfxDefault;

explosion.prototype.recycle = function()
{
	freeExplosion(this);
};

explosion.prototype.checkStatus = function()
{
	if (this.sprite.currentFrame === this.sprite.startFrame)
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
