loot = function(x, y)
{
	this.x = x;
	this.y = y;
	this.dead = false;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	switch(this.type)
	{
		/* jshint ignore:start */
		case 'health':
			this.image = game.offCtx['loot_shields'];
		break;
		case 'laser':
			this.image = game.offCtx['loot_lasers'];
		break;
		case 'missile':
			this.image = game.offCtx['loot_missiles'];
		break;
		/* jshint ignore:end */
	}
	this.width = this.image.width;
	this.height = this.image.height;
};

loot.prototype.speed = Math.round(250/pixelRatio);
loot.prototype.direction = Math.PI/2;
loot.prototype.dead = false;
loot.prototype.drops = ['health', 'laser', 'missile'];
loot.prototype.sfx1 = 'loot_powerUp' + fileFormat;
loot.prototype.sfx2 = 'loot_powerUp2' + fileFormat;
loot.prototype.sfx3 = 'loot_powerUp3' + fileFormat;
loot.prototype.ctx = game.context;

loot.prototype.reset = function(x, y)
{
	this.x = x;
	this.y = y;
	this.dead = false;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	switch(this.type) {
		/* jshint ignore:start */
		case 'health':
			this.image = game.offCtx['loot_shields'];
		break;
		case 'laser':
			this.image = game.offCtx['loot_lasers'];
		break;
		case 'missile':
			this.image = game.offCtx['loot_missiles'];
		break;
		/* jshint ignore:end */
	}
};

loot.prototype.update = function()
{
	if(!this.dead)
	{
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (Collision(this, playerShip))
		{
			switch(this.type)
			{
		    case 'health':
					if (this.hull <= 7.5)
					{
						playerShip.hull += 2.5;
					}
					else {
						playerShip.hull = 10;
					}
		      gameUI.updateEnergy();
		    break;
		    case 'laser':
		      playerShip.laserLevel = playerShip.laserLevel < 3 ? playerShip.laserLevel + 1 : playerShip.laserLevel;
		    break;
		    case 'missile':
		      playerShip.missileLevel = playerShip.missileLevel < 3 ? playerShip.missileLevel + 1 : playerShip.missileLevel;
		    break;
			}
			if (game.sound)
      {
      	if (game.sfx[this.sfx1].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx1]);
      	}
      	else if (game.sfx[this.sfx2].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx2]);
      	}
      	else if (game.sfx[this.sfx3].paused)
      	{
      		game.sounds.push(game.sfx[this.sfx3]);
      	}
      }
			this.dead = true;
		}

		if (this.y > game.outerBottom) //always goes down
		{
			this.dead = true;
		}
	}
	else
	{
		freeLoot(this);
	}
};

loot.prototype.draw = function(x, y)
{
	this.ctx.drawImage(this.image, x, y);
};

////////////
// Factory
////////////
function getNewLoot(x, y)
{
	var l = null;
	// check to see if there is a spare one
	if (game.lootPool.length > 0)
	{
		//recycle
		l = game.lootPool.pop();
		l.reset(x, y);
		game.bullets.push(l);
	}
	else
	{
		// none available, construct a new one
		l = new loot(x, y);
		game.bullets.push(l);
	}
}

function freeLoot(l)
{
	// find the active bullet and remove it
	game.bullets.splice(game.bullets.indexOf(l),1);
	// return the bullet back into the pool
	game.lootPool.push(l);
}

///////////////////////
// Pre-load game loot
///////////////////////
function initLoot ()
{
	for (var loo = 1 ; loo <= game.requiredLoot; loo++)
	{
		l = new loot(null, null);
		game.lootPool.push(l);
		game.doneObjects++;
	}
}
