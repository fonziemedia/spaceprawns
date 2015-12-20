explosion = function (x, y, speed, direction, size, target)
{
	switch(size)
	{
		case 'xSmall':
			this.image = 'explosion_s0';
		break;
		case 'small':
			this.image = 'explosion_s1';
		break;
		case 'medium':
			this.image = 'explosion_s2';
		break;
		case 'large':
			this.image = 'explosion_s3';
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
		break;										
	}
	this.sprite = new sprite(this.image, 5, 4, 2);	
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.speed = speed;
	this.direction = direction;
	this.target = target;


};

//invariables (note: any other object properties that require these need to be declared in the prototype function)
explosion.prototype.dead = false;
explosion.prototype.audioHit1 = 'hit' + fileFormat;	
explosion.prototype.audioHit2 = 'hit2' + fileFormat;	
explosion.prototype.audioHit3 = 'hit3' + fileFormat;		
explosion.prototype.audioDead1 = 'explosion' + fileFormat;
explosion.prototype.audioDead2 = 'explosion2' + fileFormat;
explosion.prototype.audioDead3 = 'explosion3' + fileFormat;	
explosion.prototype.audioExplode = 'blast' + fileFormat;

explosion.prototype.reset = function(x, y, speed, direction, size, target)
{
	switch(size)
	{
		case 'xSmall':
			this.image = 'explosion_s0';
		break;
		case 'small':
			this.image = 'explosion_s1';
		break;
		case 'medium':
			this.image = 'explosion_s2';
		break;
		case 'large':
			this.image = 'explosion_s3';
		break;
		case 'xLarge':
			this.image = 'explosion_s4';
		break;										
	}
	this.x = Math.round(x - (this.width*0.2));
	this.y = Math.round(y - (this.height*0.2));	
	this.speed = speed;
	this.direction = direction;
	this.target = target;
	this.dead = false;

	this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
	this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
};


explosion.prototype.update = function() {
	if (!this.dead)
	{
		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if (this.sprite.currentFrame >= this.sprite.endFrame)
		{
			this.dead = true;
		}
	}
	else
	{
		freeExplosion(this);
	}
};

explosion.prototype.draw = function(x, y) {
	
	this.sprite.draw(x, y);

};

explosion.prototype.loadSound = function() {	
	
	if (game.sound)
    {
    	if (this.target == 'chasis')
    	{
        	if (game.sfx[this.audioHit1].paused)
        	{
        		game.sounds.push(game.sfx[this.audioHit1]);
        	}
        	else if (game.sfx[this.audioHit2].paused)
        	{
        		game.sounds.push(game.sfx[this.audioHit2]);
        	}
        	else if (game.sfx[this.audioHit3].paused)
        	{
        		game.sounds.push(game.sfx[this.audioHit3]);
        	}				        	
        }

         else if (this.target == 'enemy')
         {
        	if (game.sfx[this.audioDead1].paused)
        	{
        		game.sounds.push(game.sfx[this.audioDead1]);
        	}
        	else if (game.sfx[this.audioDead2].paused)
        	{
        		game.sounds.push(game.sfx[this.audioDead2]);
        	}
        	else if (game.sfx[this.audioDead3].paused)
        	{
        		game.sounds.push(game.sfx[this.audioDead3]);
        	}				        	
        }	
		else if (this.target == 'player' || this.target == 'boss'){game.sounds.push(game.sfx[this.audioExplode]);}
		
	}
};


////////////
// Factory
////////////

function getNewExplosion(x, y, speed, direction, size, target)
{
    var e = null;

    // check to see if there is a spare one
    if (game.explosionsPool.length > 0)
    {
    	//recycle		    	
        e = game.explosionsPool.pop();

		e.reset(x, y, speed, direction, size, target);
		//(image, frameWidth, frameHeight, startFrame, endFrame, frameSpeed)
		e.sprite.reset(e.image, 5, 4, 2);

		//watch out for this, maybe we can avoid it?
		e.width = e.sprite.frameWidth;
		e.height = e.sprite.frameHeight;

		e.loadSound();

    	game.explosions.push(e);
    }
    else
    { 
        // none available, construct a new one
		e = new explosion(x, y, speed, direction, size, target);
		e.loadSound();
    	game.explosions.push(e);
    }

    // console.log('pool: ' + game.explosionsPool.length);
    // console.log('active: ' + game.explosions.length);

}


function freeExplosion(e)
{
    // find the active explosion and remove it
    game.explosions.splice(game.explosions.indexOf(e),1);

    // return the explosion back into the pool
	game.explosionsPool.push(e);
}