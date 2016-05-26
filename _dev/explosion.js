explosion = function (x, y, speed, direction, size)
{
	switch(size)
	{
		case 'xSmall':
			this.image = 'explosion_s0';
		break;
		case 'small':
			this.image = 'explosion_s1';
		break;
		case 'medium':
			this.image = 'explosion_s2';
		break;
		case 'large':
			this.image = 'explosion_s3';
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
		break;
	}
	this.sprite = new sprite(this.image, 5, 4, 2);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;
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
		case 'xSmall':
			this.image = 'explosion_s0';
			explosion.prototype.playSfx = explosion.prototype.sfxChasis;
		break;
		case 'small':
			this.image = 'explosion_s1';
			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 'medium':
			this.image = 'explosion_s2';
			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 'large':
			this.image = 'explosion_s3';
			explosion.prototype.playSfx = explosion.prototype.sfxDefault;
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
			explosion.prototype.playSfx = explosion.prototype.sfxBlast;
		break;
	}
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));
	this.speed = speed;
	this.direction = direction;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
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
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
	this.x += this.vx;
	this.y += this.vy;
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
		e = new explosion(null, null, null, null, 'small', null);
		game.explosionsPool.push(e);
		game.doneObjects++;
	}
}
