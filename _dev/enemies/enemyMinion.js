enemyMinion = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);

	// change prop names, confusing
	this.waveAmp = 1*game.deltaSpeed;
	this.wavePeriod = 0.06/game.deltaSpeed;

	if (this.direction === Math.PI/2)
	{
		this.vy = Math.sin(this.direction) * (this.speed);
		this.yThrust = Math.round(this.vy); // always goes down at the same speed
		this.setMovement = enemyMinion.prototype.setMovementV;
	}
	else
	{
		this.vx = Math.cos(this.direction) * (this.speed);
		this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
		this.setMovement = enemyMinion.prototype.setMovementH;
	}
};
enemyMinion.prototype = Object.create(enemy.prototype);
enemyMinion.prototype.constructor = enemyMinion;

enemyMinion.prototype.explosionSize = 2;

enemyMinion.prototype.reset = function(x, y, speed, direction, hull, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = gameGfx.offCtx[image].width;
	this.height = gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.fireRate = fireRate * 60;
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;

	this.waveAmp = 1*game.deltaSpeed;
	this.wavePeriod = 0.06/game.deltaSpeed;

	if (this.direction === Math.PI/2)
	{
		this.vy = Math.sin(this.direction) * (this.speed);
		this.yThrust = Math.round(this.vy); // always goes down at the same speed
		this.setMovement = enemyMinion.prototype.setMovementV;
	}
	else
	{
		this.vx = Math.cos(this.direction) * (this.speed);
		this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
		this.setMovement = enemyMinion.prototype.setMovementH;
	}
};

enemyMinion.prototype.getWaveMovementH = function(x)
{
	return this.waveAmp*Math.sin(this.wavePeriod*x);
};

enemyMinion.prototype.getWaveMovementV = function(y)
{
	return this.waveAmp*Math.cos(this.wavePeriod*y);
};

enemyMinion.prototype.setMovementH = function()
{
	this.x += this.xThrust;
	this.y += this.getWaveMovementH(this.x); // += vy
};

enemyMinion.prototype.setMovementV = function()
{
	this.y += this.yThrust; // always goes down
	this.x += this.getWaveMovementV(this.y);
};

enemyMinion.prototype.recycle = function()
{
	freeEnemyMinion(this);
};

////////////
// Factory
////////////
function getNewEnemyMinion(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.minionsPool.pop();
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyMinion(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.minionsPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyMinions()
{
	for (var e = 1 ; e <= game.requiredMinions; e++)
	{
		en = new enemyMinion(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.minionsPool.push(en);
		game.doneObjects++;
	}
}
