loot = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = game.offCtx[this.type];
	this.width = this.image.width;
	this.height = this.image.height;
};
// note: prototype properties are set at run time, the constructor properties/methods are set upon object creation
loot.prototype.speed = Math.round(250/pixelRatio);
loot.prototype.direction = Math.PI/2;
loot.prototype.drops = ['loot_shields', 'loot_lasers', 'loot_missiles'];
loot.prototype.sfx1 = 'loot_powerUp' + fileFormat;
loot.prototype.sfx2 = 'loot_powerUp2' + fileFormat;
loot.prototype.sfx3 = 'loot_powerUp3' + fileFormat;
loot.prototype.ctx = game.context;

loot.prototype.reset = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = game.offCtx[this.type];
};

loot.prototype.reward = function()
{
	switch(this.type)
	{
		case 'loot_shields':
			playerShip.hull = playerShip.hull <= 7.5 ? playerShip.hull + 2.5 : playerShip.hull = 10;
			gameUI.updateEnergy();
		break;
		case 'loot_lasers':
			playerShip.laserLevel = playerShip.laserLevel < 3 ? playerShip.laserLevel + 1 : playerShip.laserLevel;
		break;
		case 'loot_missiles':
			playerShip.missileLevel = playerShip.missileLevel < 3 ? playerShip.missileLevel + 1 : playerShip.missileLevel;
		break;
	}
};

loot.prototype.sfxPlay = function()
{
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
};

loot.prototype.setMovement = function()
{
	this.vx = Math.cos(this.direction) * (this.speed*dt);
	this.vy = Math.sin(this.direction) * (this.speed*dt);
	this.x += this.vx;
	this.y += this.vy;
};

loot.prototype.setBoundaries = function()
{
	if (this.y > game.outerBottom) //always goes down
	{
		freeLoot(this);
	}
};

loot.prototype.checkCollision = function()
{
	if (Collision(this, playerShip))
	{
		this.reward();
		this.sfxPlay();

		freeLoot(this);
	}
};

loot.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

loot.prototype.update = function()
{
	this.setMovement();
	this.setBoundaries();
	this.checkCollision();
	this.draw();
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
