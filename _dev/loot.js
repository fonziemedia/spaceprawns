function loot(x, y) {
	particle.call(this, x, y);

	this.speed = 250;
	this.direction = Math.PI/2;
	this.size = 45*dtSize;
	this.dead = false;
	this.drops = ['health', 'laser', 'missile'];
	var key = Math.floor(Math.random() * this.drops.length);
	this.type = this.drops[key];

	switch(this.type) {
    case 'health':
        this.image = 0;
        break;
    case 'laser':
        this.image = 2;
        break;
    case 'missile':
        this.image = 20;
	}

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
		if (Collision(playerShip, this) && !this.dead && !game.gameOver){			
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
			this.dead = true;
		}

	};

	this.draw = function() {
		game.contextEnemies.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (!this.dead) {			
			game.contextEnemies.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render			
		}
	};
}

loot.prototype = Object.create(particle.prototype); // Creating a loot.prototype object that inherits from particle.prototype.
loot.prototype.constructor = loot; // Set the "constructor" property to refer to loot
