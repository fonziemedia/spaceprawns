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
	this.y = game.outerTop;
	this.audioHit1 = 'hit' + fileFormat;
	this.audioHit2 = 'hit2' + fileFormat;
	this.audioHit3 = 'hit3' + fileFormat;
	this.dead = false;
	this.deadTimer = 0;
	this.lasersTimer = 1;
	this.missilesTimer = 1;
	this.lasersFireRate = 40;
	this.missilesFireRate = 120;
	this.yStop = Math.round(game.height*0.05);
	this.laser1 = {};
	this.laser2 = {};
	this.laser1.y = Math.round(this.yStop + this.height);
	this.laser2.y = this.laser1.y;
	this.missile1 = {};
	this.missile2 = {};
	this.missile1.y = Math.round(this.yStop + this.height*0.5);
	this.missile2.y = this.missile1.y;
	this.xBondary = Math.round(game.width - this.width);
	this.ctx = game.context;
};

boss.prototype.fireLasers = function()
{
	this.laser1.x = Math.round(this.x + this.width*0.4);
	this.laser2.x = Math.round(this.x + this.width*0.6);
	getNewEnemyBullet(this.laser1.x, this.laser1.y, 250, Math.PI/2, 1.5, 'bullet_p_laser');
	getNewEnemyBullet(this.laser2.x, this.laser2.y, 250, Math.PI/2, 1.5, 'bullet_p_laser');
};

boss.prototype.fireMissiles = function()
{
	this.missile1.x = Math.round(this.x);
	this.missile2.x = Math.round(this.x + this.width);
	getNewEnemyBullet(this.missile1.x, this.missile1.y, 50, utils.angleTo(this.missile1, playerShip), 1, 'bullet_e_missile');
	getNewEnemyBullet(this.missile2.x, this.missile1.y, 50, utils.angleTo(this.missile2, playerShip), 1, 'bullet_e_missile');
};

boss.prototype.update = function()
{
	if (!this.dead)
	{
		if (this.y >= this.yStop) //boss fight AI
		{
			this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
			if (this.x + this.hCenter < (playerShip.x + playerShip.centerX) - this.vx)
			{
				this.direction = 0;
				this.x += this.vx;
			}
			else if (this.x + this.hCenter > (playerShip.x + playerShip.centerX) + this.vx)
			{
				this.direction = Math.PI;
				this.x += this.vx;
			}
			else if (this.x + this.hCenter == playerShip.x + playerShip.centerX)
			{
				this.x = this.x;
			}
		}
		else //enter boss
		{
			this.direction = Math.PI/2;
			this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
			this.x = this.x;
			this.y += this.vy;
		}

		this.draw(this.x, this.y);

		// player-boss collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver)
		{
			playerShip.hull -= this.hull;
			playerShip.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 )
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
		}

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

	}
	else
	{
		game.levelUpTimer++; //waiting a few secs before engaging warp speed

		if (game.levelUpTimer == 100)
		{
			game.levelComplete = true;
			gameState.lvlComplete();
			mouseIsDown = 0;
		}
	}
};

boss.prototype.draw = function(x, y)
{
	this.ctx.drawImage(this.image, x, y);
};
