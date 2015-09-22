function explosion(x, y, speed, direction, size, target) {
	particle.call(this, x, y, speed, direction);

	this.x = Math.round(x - (size*0.2));
	this.y = Math.round(y - (size*0.2));
	this.speed = speed;
	this.size = Math.round(size*1.5);
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;
	this.image = 'explosion.png';
	this.target = target;	
	this.audioHit1 = 'hit' + fileFormat;	
	this.audioHit2 = 'hit2' + fileFormat;	
	this.audioHit3 = 'hit3' + fileFormat;		
	this.audioDead1 = 'explosion' + fileFormat;
	this.audioDead2 = 'explosion2' + fileFormat;
	this.audioDead3 = 'explosion3' + fileFormat;	
	this.audioExplode = 'blast' + fileFormat;
	this.ctx = game.contextPlayer;
	this.sprite = new sprite(this.image, this.size, 96, 96, 0, 19, 2, this.ctx);


	// if (game.soundStatus == "ON"){game.enemyexplodeSound.play();}

	this.update = function() {
		this.vx = Math.cos(direction) * (this.speed*dt);
		this.vy = Math.sin(direction) * (this.speed*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};

	this.draw = function() {
		// this.ctx.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		this.sprite.draw(this.x, this.y);

	};

	this.load = function() {	
		
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

	this.load();
}

explosion.prototype = Object.create(particle.prototype); // Creating a explosion.prototype object that inherits from particle.prototype.
explosion.prototype.constructor = explosion; // Set the "constructor" property to refer to explosion
