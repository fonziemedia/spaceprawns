loot = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = gameGfx.offCtx[this.type];
	this.width = this.image.width;
	this.height = this.image.height;

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};
// note: prototype properties are set at run time, the constructor properties/methods are set upon object creation
loot.prototype.speed = Math.round(1*game.dt*game.deltaSpeed);
loot.prototype.direction = Math.PI/2;
loot.prototype.drops = ['loot_shields', 'loot_lasers', 'loot_missiles'];
loot.prototype.ctx = game.context;

loot.prototype.reset = function(x, y)
{
	this.x = x;
	this.y = y;
	this.key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[this.key];
	this.image = gameGfx.offCtx[this.type];

	this.vx = Math.cos(this.direction) * (this.speed);
	this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

loot.prototype.recycle = function()
{
	freeLoot(this);
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

loot.prototype.setMovement = function()
{
	this.x += this.xThrust;
	this.y += this.yThrust;
};

loot.prototype.setBoundaries = function()
{
	if (this.y > game.outerBottom) //always goes down
	{
		this.recycle();
	}
};

loot.prototype.checkCollision = function()
{
	if (Collision(this, playerShip))
	{
		this.reward();
		this.recycle();
		
		if(gameSfx.on) gameSfx.play('loot_powerUp');
	}
};

loot.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

loot.prototype.update = function()
{
	this.checkCollision();
	this.setMovement();
	this.setBoundaries();
	this.draw();
};

////////////
// Factory
////////////
function getNewLoot(x, y)
{
	var l = null;

	//recycle
	l = game.lootPool.pop();
	l.reset(x, y);
	game.objects.push(l);
}

function freeLoot(l)
{
	// find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(l),1);
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
