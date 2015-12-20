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
	//setting this to make friction work with deltaTime (dt), check particle.js
	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
playerBullet.prototype.dead = false;
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
	this.dead = false;

	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};

playerBullet.prototype.update = function(){ // Replacing the default 'update' method
	if (!this.dead) 
	{
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);
		
		//projectiles collision
		for (var e in game.enemies)
		{
			if (Collision(game.enemies[e], this))
			{ //dead check avoids ghost scoring
				game.enemies[e].hull -= this.power;							
				if(game.enemies[e].hull > 0)
				{
					getNewExplosion(game.enemies[e].x + game.enemies[e].width*0.5, game.enemies[e].y + game.enemies[e].height*0.5, 0, 1, 'xSmall', 'chasis');
				}

				this.dead = true;
			}					
		}

		if (this.y < game.outerTop) //always goes up
		{
			this.dead = true;
		}
	}
	else
	{
		freeBullet(this);
	}
};

playerBullet.prototype.draw = function(x, y) {
	this.sprite.draw(x, y); //-this.size/2 because we're rotating ctx

		// for homing missiles
			// this.ctx.save();
			// this.ctx.translate(this.x, this.y);
			// this.ctx.rotate(direction - Math.PI/2);
			// ...
			// this.ctx.restore();	
};

// playerBullet.prototype = Object.create(particle.prototype); // Creating a playerBullet.prototype object that inherits from particle.prototype.
// playerBullet.prototype.constructor = playerBullet; // Set the "constructor" property to refer to playerBullet

////////////
// Factory
////////////

getNewBullet = function(x, y, speed, direction, power, friction, image)
{
    var b = null;

    // check to see if there is a spare one
    if (game.playerBulletsPool.length > 0)
    {
    	//recycle

        b = game.playerBulletsPool.pop();


		//(image, columns, rows, animationSpeed)
		b.sprite.reset(image, 3, 1, 4); 

        b.reset(x, y, speed, power, friction, image);
 		

    	game.bullets.push(b);
    }
    else
    {
    	// none available, construct a new one
    	b = new playerBullet(x, y, speed, direction, power, friction, image);

    	game.bullets.push(b);
    }

    // console.log('pool: ' + game.playerBulletsPool.length);
    // console.log('active: ' + game.bullets.length);

};

freeBullet = function(b)
{
    // find the active bullet and remove it
    game.bullets.splice(game.bullets.indexOf(b),1);

    // return the bullet back into the pool
	game.playerBulletsPool.push(b);
};