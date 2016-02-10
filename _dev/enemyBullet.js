enemyBullet = function(x, y, speed, direction, power, image)
{
	this.sprite = new sprite(image, 3, 1, 5);
	this.x = x;
	this.y = y;
	this.power = power;
	this.speed = speed;
	this.direction = direction;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;

	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);

	this.spriteX = -Math.round(this.width*0.5);  //-this.size/2 because we're rotating ctx
	this.spriteY = -Math.round(this.height*0.5);  //-this.size/2 because we're rotating ctx
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
enemyBullet.prototype.dead = false;
enemyBullet.prototype.friction = 1.02;
enemyBullet.prototype.ctx = game.context;

enemyBullet.prototype.reset = function(x, y, speed, direction, power)	//only variable arguments here
{
	this.x = x;
	this.y = y;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;
	this.power = power;
	this.dead = false;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

enemyBullet.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
		{
			getNewExplosion(this.x, this.y, 0, 1, 'xSmall', 'chasis');
			playerShip.hull -= this.power;
			gameUI.updateEnergy();
			playerShip.hit = true;
			this.dead = true;
		}

		if(this.x > game.outerRight || this.x < game.outerLeft || this.y > game.outerBottom || this.y < game.outerTop)
		{
			this.dead = true;
		}
	}
	else
	{
		freeEnemyBullet(this);
	}
};

enemyBullet.prototype.draw = function(x, y)	//fix this with sprites with diferent angles
{
	this.ctx.save();
	this.ctx.translate(x, y);
	this.ctx.rotate(this.direction - Math.PI/2);

	this.sprite.draw(this.spriteX, this.spriteY);

	this.ctx.restore();
};

////////////
// Factory
////////////
getNewEnemyBullet = function(x, y, speed, direction, power, image)
{
    var eb = null;
    // check to see if there is a spare one
    if (game.enemyBulletsPool.length > 0)
    {
			//recycle
			eb = game.enemyBulletsPool.pop();
			eb.sprite.reset(image, 3, 1, 4);
			eb.reset(x, y, speed, direction, power);
			game.bullets.push(eb);
    }
    else
    {
    	// none available, construct a new one
    	eb = new enemyBullet(x, y, speed, direction, power, image);
    	game.bullets.push(eb);
    }
};

freeEnemyBullet = function(eb)
{
	// find the active bullet and remove it
	game.bullets.splice(game.bullets.indexOf(eb),1);
	// return the bullet back into the pool
	game.enemyBulletsPool.push(eb);
};

////////////////////////////////
// Pre-load game enemy bullets
////////////////////////////////
function initEnemyBullets()
{
	for (var ebul = 1 ; ebul <= game.requiredEnemyBullets; ebul++)
	{
		eb = new enemyBullet(null, null, null, null, null, 'bullet_e_missile');
		game.enemyBulletsPool.push(eb);
		game.doneObjects++;
	}
}
