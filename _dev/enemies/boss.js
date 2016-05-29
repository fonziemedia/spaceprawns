boss = function(x, y, speed, direction, hull, image)
{
	this.speed = speed/pixelRatio;
	this.direction = direction;
	this.hull = hull;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);	//these are for explosions, see playerBullet's checkCollision()
	this.centerY = Math.round(this.height*0.5);
	this.hCenter = Math.round(this.width/2);
	this.x = Math.round(game.centerX - this.hCenter);

	this.xBondary = Math.round(game.width - this.width);
	this.ctx = game.context;
};
boss.prototype.y = game.outerTop;
boss.prototype.yStop = Math.round(game.height*0.05);
boss.prototype.audioHit1 = 'hit' + fileFormat;
boss.prototype.audioHit2 = 'hit2' + fileFormat;
boss.prototype.audioHit3 = 'hit3' + fileFormat;
boss.prototype.deadTimer = 0;
boss.prototype.lasersTimer = 1;
boss.prototype.missilesTimer = 1;
boss.prototype.lasersFireRate = null;
boss.prototype.missilesFireRate = null;

boss.prototype.reset = function(x, y, hull) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.hull = hull;
};

boss.prototype.detectCollision = function()
{
	// player-boss collision
	if (Collision(playerShip, this) && !playerShip.imune && !game.gameOver)
	{
		playerShip.hull -= this.hull;
		playerShip.hit = true;
		this.hull -= playerShip.hull;
	}
};

boss.prototype.die = function()
{
	getNewExplosion(this.x, this.y, this.speed, this.direction, 4);
	if (!playerShip.crashed)
	{
		game.score++;
		game.levelScore++;
		gameUI.updateScore();
		game.bossDead = true;
	}

	player.prototype.update = player.prototype.levelCompleteUpdate;

	this.recycle();
};

boss.prototype.checkHull = function()
{
	if (this.hull <= 0 )
	{
		this.die();
	}
};

boss.prototype.setGuns = function()
{
	this.lasersTimer++;
	this.missilesTimer++;

	if (this.lasersTimer % this.lasersFireRate === 0)
	{
		this.fireLasers();
	}

	if (this.missilesTimer % this.missilesFireRate === 0)
	{
		this.fireMissiles();
	}
};

boss.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

boss.prototype.aliveUpdate = function()
{
	this.setMovement();
	this.setGuns();
	this.detectCollision();
	this.checkHull();
	this.draw();
};

boss.prototype.update = boss.prototype.aliveUpdate;


/////////////////////////
// Pre-load game bosses
/////////////////////////
function initBosses()
{
	for (var b = 1 ; b <= game.requiredBosses; b++)
	{
		var firstBoss = new sectoidBoss(game.width*0.40, game.outerTop, 150, Math.PI/2, 100, 'boss_sectoid');
		game.bossesPool.push(firstBoss);
		game.doneObjects++;
	}
}
