function loot(x, y) {
	particle.call(this, x, y);

	this.speed = 250;
	this.direction = Math.PI/2;
	this.size = 45;
	this.dead = false;
	this.drops = ['health', 'laser', 'missile'];
	var key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[key];

	switch(this.type) {
    case 'health':
        this.image = 'fighter.png';
        break;
    case 'laser':
        this.image = 'laser.png';
        break;
    case 'missile':    
        this.image = 'missile.png';
	}
	this.sfx1 = 'loot_powerUp' + fileFormat;
	this.sfx2 = 'loot_powerUp2' + fileFormat;
	this.sfx3 = 'loot_powerUp3' + fileFormat;
	this.context = game.contextPlayer;

	this.update = function() {
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);	
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		// player-loot collision
		if (Collision(this, playerShip) && !this.dead && !game.gameOver){			
			switch(this.type) {
			    case 'health':
			    	if (this.hull <= 7.5) {
			    		playerShip.hull += 2.5;
					}
					else {
						playerShip.hull = 10;
					}
			        gameUI.updateEnergy();
			        break;
			    case 'laser':
			        playerShip.laserLevel += 1;
			        break;
			    case 'missile':
			        playerShip.missileLevel += 1;
			}
			if (game.sound)
	        {
	        	if (game.sfx[this.sfx1].paused)
	        	{
	        		game.sounds.push(game.sfx[this.sfx1]);
	        	}
	        	else if (game.sfx[this.sfx2].paused)
	        	{
	        		game.sounds.push(game.sfx[this.sfx2]);
	        	}
	        	else if (game.sfx[this.sfx3].paused)
	        	{
	        		game.sounds.push(game.sfx[this.sfx3]);
	        	}				        	
	        }
			this.dead = true;
		}

	};

	this.draw = function() {
		// game.contextPlayer.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (!this.dead) {			
			game.contextPlayer.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render			
		}
	};
}

loot.prototype = Object.create(particle.prototype); // Creating a loot.prototype object that inherits from particle.prototype.
loot.prototype.constructor = loot; // Set the "constructor" property to refer to loot
