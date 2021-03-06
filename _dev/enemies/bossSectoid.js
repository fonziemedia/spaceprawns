sectoidBoss = function(x, y, speed, direction, hull, image)
{
	boss.call(this, x, y, speed, direction, hull, image);

	this.laser1 = {};
	this.laser2 = {};
	this.laser1.y = Math.round(this.yStop + this.height);
	this.laser2.y = this.laser1.y;
	this.laser1.offSetX = Math.round(this.width*0.4);
	this.laser2.offSetX = Math.round(this.width*0.6);
	this.missile1 = {};
	this.missile2 = {};
	this.missile1.y = Math.round(this.yStop + this.height*0.5);
	this.missile2.y = this.missile1.y;
};
sectoidBoss.prototype = Object.create(boss.prototype);
sectoidBoss.prototype.constructor = sectoidBoss;

sectoidBoss.prototype.lasersFireRate = 40;
sectoidBoss.prototype.missilesFireRate = 120;

sectoidBoss.prototype.fireLasers = function()
{
	this.laser1.x = Math.round(this.x + this.laser1.offSetX);
	this.laser2.x = Math.round(this.x + this.laser2.offSetX);
	getNewEnemyBullet(this.laser1.x, this.laser1.y, 4, Math.PI/2, 1.5, 'bullet_p_laser');
	getNewEnemyBullet(this.laser2.x, this.laser2.y, 4, Math.PI/2, 1.5, 'bullet_p_laser');
};

sectoidBoss.prototype.fireMissiles = function()
{
	this.missile1.x = this.x;
	this.missile2.x = this.x + this.width;
	getNewEnemyBullet(this.missile1.x, this.missile1.y, 1, utils.angleTo(this.missile1, playerShip), 1, 'bullet_e_missile');
	getNewEnemyBullet(this.missile2.x, this.missile1.y, 1, utils.angleTo(this.missile2, playerShip), 1, 'bullet_e_missile');
};

sectoidBoss.prototype.introMovement = function()
{
	this.direction = Math.PI/2;
	this.vy = Math.sin(this.direction) * this.speed;
	this.x = this.x;
	this.y += Math.round(this.vy);

	if (this.y >= this.yStop)
	{
		sectoidBoss.prototype.setMovement = sectoidBoss.prototype.fightMovement;
	}
};

sectoidBoss.prototype.setMovement = sectoidBoss.prototype.introMovement;

sectoidBoss.prototype.fightMovement = function()
{
	this.vx = Math.cos(this.direction) * this.speed;
	if (this.x + this.hCenter < (playerShip.x + playerShip.centerX) - this.vx)
	{
		this.direction = 0;
		this.x += Math.round(this.vx);
	}
	else if (this.x + this.hCenter > (playerShip.x + playerShip.centerX) + this.vx)
	{
		this.direction = Math.PI;
		this.x += Math.round(this.vx);
	}
	else if (this.x + this.hCenter == playerShip.x + playerShip.centerX)
	{
		this.x = this.x;
	}
};

sectoidBoss.prototype.recycle = function()
{
	sectoidBoss.prototype.setMovement = sectoidBoss.prototype.introMovement;
	freeSectoidBoss(this);
};

////////////
// Factory
////////////
function getNewSectoidBoss()
{
	var boss = null;

	boss = game.bossesPool[0]; //get the specific boss
	boss.reset(game.width*0.40, game.outerTop, 100);
	game.enemies.push(boss);
	game.bossUp = true;

	game.bossesPool.splice(0, 1); //remove it from the pool while it's active
}

function freeSectoidBoss(boss)
{
	//find the active boss and remove it
	game.enemies.splice(game.enemies.indexOf(boss), 1);
	//return the boss back into the pool
	game.bossesPool.splice(0, 0, boss); //return at specific index (0)
	game.bossDead = true;
	game.bossUp = false;
}
