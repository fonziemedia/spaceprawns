enemy = function(x, y, speed, direction, hull, image, fireRate)
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = gameGfx.offCtx[image].width;
	this.height = gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);	//these are for explosions, see playerBullet's checkCollision()
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.bullet = {};
	this.bullet.x = null;
	this.bullet.y = null;
	this.fireRate = fireRate * 60; //fireRate = delay in seconds

	// this.vx = Math.cos(this.direction) * (this.speed);
	// this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

// note: properties/objects declared as prototype won't have access to private data added in the main prototype function i.e. this.hull)
enemy.prototype.bulletTimer = 1;
enemy.prototype.hitTimer = 0;
enemy.prototype.collided = false;
enemy.prototype.ctx = game.context;

enemy.prototype.reset = function(x, y, speed, direction, hull, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.image = gameGfx.offCtx[image];
	this.width = this instanceof enemyBase ? this.sprite.frameWidth : gameGfx.offCtx[image].width;
	this.height = this instanceof enemyBase ? this.sprite.frameHeight : gameGfx.offCtx[image].height;
	this.centerX = Math.round(this.width*0.5);
	this.centerY = Math.round(this.height*0.5);
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.hull = hull;
	this.fireRate = fireRate * 60;
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;

	// this.vx = Math.cos(this.direction) * (this.speed);
	// this.xThrust = Math.round(this.vx); // always goes left/right at the same speed
	this.vy = Math.sin(this.direction) * (this.speed);
	this.yThrust = Math.round(this.vy); // always goes down at the same speed
};

enemy.prototype.setMovement = function()
{
	// this.x += this.xThrust;
	this.y += this.yThrust;
};

enemy.prototype.die = function()
{
	getNewExplosion(this.x, this.y, this.speed/2, this.direction, this.explosionSize);

	lootchance = Math.random();
	if (lootchance < 0.4)
	{
		getNewLoot(this.x, this.y);
	}

	if (!playerShip.crashed)
	{
		game.score++;
		game.levelScore++;
		gameUI.updateScore();
	}

	this.recycle();
};

enemy.prototype.checkHull = function()
{
	if (this.hull <= 0)
	{
		this.die();
	}
};

enemy.prototype.checkCollision = function()
{
	if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
	{
		getNewExplosion(playerShip.x, playerShip.y, 0, 1, 1, 'chasis');	//get new explosion sound for hiting player
		playerShip.hull -= this.hull;
		gameUI.updateEnergy();
		playerShip.hit = true;
		this.hull -= playerShip.hull;
	}
};

enemy.prototype.setBoundaries = function()
{
	if (this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
	{
		this.recycle();
	}
};

enemy.prototype.setGuns = function()
{
	if (this.fireRate !== 0)
	{
		this.bulletTimer++;
		if (this.bulletTimer % this.fireRate === 0)
		{
			this.fireMissile();
		}
	}
};

enemy.prototype.fireMissile = function()
{
	this.bullet.x = this.x + this.centerX;
	this.bullet.y = this.y + this.height;
	getNewEnemyBullet(this.bullet.x, this.bullet.y, 1, utils.angleTo(this.bullet, playerShip), 1, 'bullet_e_missile');
};

enemy.prototype.draw = function()
{
	this.ctx.drawImage(this.image, this.x, this.y);
};

enemy.prototype.update = function()
{
	this.checkCollision();
	this.setMovement();
	this.setBoundaries();
	this.setGuns();
	this.checkHull();
	this.draw();
};
