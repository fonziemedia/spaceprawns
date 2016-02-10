enemy = function(x, y, speed, direction, hull, type, image, fireRate)
{
	this.x = x;
	this.y = y;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	this.hull = hull;
	this.sprite = new sprite(image, 6, 5, 5);
	this.type = type;
	switch (type)
	{
		case 'pawn':
			this.explosionSize = 'medium';
		break;
		case 'miniboss':
			this.explosionSize = 'large';
		break;
		case 'base':
			this.width = this.sprite.frameWidth;
			this.height = this.sprite.frameHeight;
			this.explosionSize = 'xLarge';
		break;
	}
	this.fireRate = fireRate * 60; //fireRate = delay in seconds
	this.speed = speed/pixelRatio;
	this.direction = direction;
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
enemy.prototype.bulletTimer = 1;
enemy.prototype.hitTimer = 0;
enemy.prototype.ctx = game.context;
enemy.prototype.dead = false;
enemy.prototype.collided = false;

enemy.prototype.fireMissile = function()
{
		bulletX = Math.round(this.x + this.width*0.42);
		bulletY = Math.round(this.y + this.height);
		getNewEnemyBullet(bulletX, bulletY, 50, utils.angleTo(this, playerShip), 1, 'bullet_e_missile');
};

enemy.prototype.reset = function(x, y, speed, direction, hull, type, image, fireRate) //only variable arguments here
{
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.direction = direction;
	this.hull = hull;
	this.type = type;
	this.image = game.offCtx[image];
	this.fireRate = fireRate * 60; //fireRate = delay in seconds
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	switch (type)
	{
	case 'pawn':
		this.explosionSize = 'medium';
	break;
	case 'miniboss':
		this.explosionSize = 'large';
	break;
	case 'base':
		this.width = this.sprite.frameWidth;
		this.height = this.sprite.frameHeight;
		this.explosionSize = 'xLarge';
	break;
	}
	this.bulletTimer = 1;
	this.hitTimer = 0;
	this.collided = false;		//do we need this??
	this.dead = false;
	this.vx = Math.cos(this.direction) * ((this.speed)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed)*dt);
};

enemy.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
		this.x += this.vx;
		this.y += this.vy;

		if (this.type !== 'base' )
		{
			this.direction -= utils.randomRange(-0.05, 0.05);
		}

		this.draw(this.x, this.y);

		if(this.fireRate !== 0)
		{
			this.bulletTimer++;
			if (this.bulletTimer % this.fireRate === 0)
			{
				this.fireMissile();
			}
		}

		// player-enemy collision
		if (Collision(this, playerShip) && !this.dead && !playerShip.imune && !game.gameOver)
		{
			getNewExplosion(playerShip.x, playerShip.y, 0, 1, 'small', 'chasis');	//get new explosion sound for hiting player
			playerShip.hull -= this.hull;
			gameUI.updateEnergy();
			playerShip.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0)
		{
			this.dead = true;
			getNewExplosion(this.x, this.y, this.speed, this.direction, this.explosionSize, 'enemy');

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
		}

		if(this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
		{
			this.dead = true;
		}
	}
	else
	{
		freeEnemy(this);
	}
};

enemy.prototype.draw = function(x, y)
{
	if (this.type !== 'base')
	{
		this.ctx.drawImage(this.image, x, y);
	}
	else
	{
		this.sprite.draw(x, y);
	}
};

////////////
// Factory
////////////
function getNewEnemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
{
	var en = null;
	//check to see if there is a spare one
	if (game.enemiesPool.length > 0)
	{
		//recycle
		en = game.enemiesPool.pop();
		en.sprite.reset(image, 6, 5, 6);
		en.reset(x, y, speed, direction, hull, type, image, fireRate, sheep);
		game.enemies.push(en);
	}
	else
	{
		// none available, construct a new one
		en = new enemy(x, y, speed, direction, hull, type, image, fireRate, sheep);
		game.enemies.push(en);
	}
}

function freeEnemy(en)
{
	//find the active bullet and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the bullet back into the pool
	game.enemiesPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemies()
{
	for (var e = 1 ; e <= game.requiredEnemies; e++)
	{
		en = new enemy(0, 0, 0, 0, 0, 'pawn', 'enemy_sectoid', 0);
		game.enemiesPool.push(en);
		game.doneObjects++;
	}
}
