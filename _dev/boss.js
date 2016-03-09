boss = function(x, y, speed, direction, hull, image)
{
	this.speed = speed/pixelRatio;
	this.direction = direction;
	this.hull = hull;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
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
boss.prototype.dead = false;
boss.prototype.deadTimer = 0;
boss.prototype.lasersTimer = 1;
boss.prototype.missilesTimer = 1;
boss.prototype.lasersFireRate = null;
boss.prototype.missilesFireRate = null;

boss.prototype.detectCollision = function()
{
	// player-boss collision
	if (Collision(playerShip, this) && !this.dead && !playerShip.imune && !game.gameOver)
	{
		playerShip.hull -= this.hull;
		playerShip.hit = true;
		this.hull -= playerShip.hull;
	}
};

boss.prototype.die = function()
{
	getNewExplosion(this.x, this.y, this.speed, this.direction, 'xLarge', 'boss');
	if (!playerShip.crashed)
	{
		game.score++;
		game.levelScore++;
		gameUI.updateScore();
		game.bossDead = true;
		this.dead = true;
	}

	boss.prototype.update = boss.prototype.downedUpdate;
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

boss.prototype.downedUpdate = function()
{
	game.levelUpTimer++; //waiting a few secs before engaging warp speed

	if (game.levelUpTimer == 100)
	{
		game.levelComplete = true;
		player.prototype.update = player.prototype.levelCompleteUpdate;
		gameState.lvlComplete();
		mouseIsDown = 0;
	}
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
