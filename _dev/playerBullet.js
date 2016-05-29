playerBullet = function(x, y, speed, direction, power, friction, image)
{
	// this.size = Math.round(bulletSize/pixelRatio);
	this.sprite = new sprite(image, 3, 1, 4);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = speed;
	this.direction = direction;
	this.power = power;
	this.friction = friction;
	//setting these to make friction work with deltaTime (dt), check particle.js
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

playerBullet.prototype.ctx = game.context;

playerBullet.prototype.reset = function(x, y, speed, power, friction)  //only variable arguments here
{
	//reseting variable properties only (lasers != missiles)
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.x = Math.round(x - this.width*0.5);
	this.y = Math.round(y - this.height*0.5);
	this.speed = speed;
	this.power = power;
	this.friction = friction;
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

playerBullet.prototype.recycle = function()
{
	freeBullet(this);
};

playerBullet.prototype.checkCollision = function()
{
	var en = game.enemies.length;
	while (en--)
	{
		if (Collision(game.enemies[en], this))
		{
			game.enemies[en].hull -= this.power;
			if(game.enemies[en].hull > 0)
			{
				getNewExplosion(game.enemies[en].x + game.enemies[en].centerX, game.enemies[en].y + game.enemies[en].centerY, 0, 1, 0);
			}

			this.recycle();
		}
	}
};

playerBullet.prototype.setBoundaries = function()
{
	if (this.y < game.outerTop) //always goes up
	{
		this.recycle();
	}
};

playerBullet.prototype.setMovement = function()
{
	this.vx *= this.friction;
	this.vy *= this.friction;
	this.x += this.vx;
	this.y += this.vy;
};


playerBullet.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

playerBullet.prototype.update = function()
{
	this.checkCollision();
	this.setBoundaries();
	this.setMovement();
	this.draw();
};


////////////
// Factory
////////////
getNewBullet = function(x, y, speed, direction, power, friction, image)
{
	var b = null;
	//recycle
	b = game.playerBulletsPool.pop();
	//(image, columns, rows, animationSpeed)
	b.sprite.reset(image, 3, 1, 4);
  b.reset(x, y, speed, power, friction);
	game.objects.push(b);
};

freeBullet = function(b)
{
	//find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(b),1);
	//return the bullet back into the pool
	game.playerBulletsPool.push(b);
};

////////////////////////////////
// Pre-load game player bullets
////////////////////////////////
initPlayerBullets = function ()
{
	for (var pb = 1 ; pb <= game.requiredPlayerBullets; pb++)
	{
		b = new playerBullet(null, null, null, -Math.PI/2, null, null, 'bullet_p_laser');
		game.playerBulletsPool.push(b);
		game.doneObjects++;
	}
};
