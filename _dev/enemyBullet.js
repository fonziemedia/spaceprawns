enemyBullet = function(x, y, speed, direction, power, image)
{
	this.sprite = new sprite(image, 3, 1, 5);
	this.x = x;
	this.y = y;
	this.power = power;
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;

	this.vx = Math.cos(this.direction) * this.speed;
	this.vy = Math.sin(this.direction) * this.speed;

	this.spriteX = -Math.round(this.width*0.5);  //-this.width/2 because we're rotating ctx
	this.spriteY = -Math.round(this.height*0.5);  //-this.height/2 because we're rotating ctx
};
enemyBullet.prototype.friction = 1.02;
enemyBullet.prototype.ctx = game.context;

enemyBullet.prototype.reset = function(x, y, speed, direction, power)
{
	this.x = x;
	this.y = y;
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = Math.round(speed*game.dt*game.deltaSpeed);
	this.direction = direction;
	this.power = power;
	this.vx = Math.cos(this.direction) * this.speed;
	this.vy = Math.sin(this.direction) * this.speed;
};

enemyBullet.prototype.recycle = function()
{
	freeEnemyBullet(this);
};

enemyBullet.prototype.checkCollision = function()
{
	if (Collision(this, playerShip) && !playerShip.imune && !game.gameOver)
	{
		getNewExplosion(this.x, this.y, 0, 1, 0);
		playerShip.hull -= this.power;
		gameUI.updateEnergy();
		playerShip.hit = true;

		this.recycle();
	}
};

enemyBullet.prototype.setBoundaries = function()
{
	if (this.x > game.outerRight ||
		 this.x < game.outerLeft ||
		 this.y > game.outerBottom ||
		 this.y < game.outerTop)
	{
		this.recycle();
	}
};

enemyBullet.prototype.setMovement = function()
{
	this.x += this.vx *= this.friction;
	this.y += this.vy *= this.friction;
};

enemyBullet.prototype.draw = function()	//fix this with sprites with diferent angles
{
	this.ctx.save();
	this.ctx.translate(this.x, this.y);
	this.ctx.rotate(this.direction - Math.PI/2);

	this.sprite.draw(this.spriteX, this.spriteY);

	this.ctx.restore();
};

enemyBullet.prototype.update = function()
{
	this.checkCollision();
	this.setBoundaries();
	this.setMovement();
	this.draw();
};

////////////
// Factory
////////////
getNewEnemyBullet = function(x, y, speed, direction, power, image)
{
  var eb = null;
	//recycle
	eb = game.enemyBulletsPool.pop();
	eb.sprite.reset(image, 3, 1, 4);
	eb.reset(x, y, speed, direction, power);

	game.objects.push(eb);
};

freeEnemyBullet = function(eb)
{
	// find the active bullet and remove it
	game.objects.splice(game.objects.indexOf(eb),1);
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
