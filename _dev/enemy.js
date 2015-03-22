function enemy(x, y, speed, direction, hull, type, image, fireRate, sheep) {
	particle.call(this, x, y, speed, direction);

	this.type = type;
	switch (this.type){
		case 'pawn':
				this.size = 65*dtSize;
			break;
		case 'miniboss':
				this.size = 120*dtSize;	
			break;
		case 'base':
				this.size = 170*dtSize;
				this.rotation = 0;	
			break;
	}
	this.hull = hull;
	this.image = image;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bulletTimer = 1;
	this.sheep = sheep || false;
	this.fireRate = fireRate * 60; //bullets/sec

	this.bulletDivision = (this.sheep) ? (this.fireRate*2) - (Math.floor(Math.random()*this.fireRate)) || 99999 : this.bulletDivision = this.fireRate || 99999;


	this.update = function() {
		this.lastX = this.x;
		this.lastY = this.y;
		this.vx = Math.cos(direction) * (speed*dt);
		this.vy = Math.sin(direction) * (speed*dt);		
		this.handleSprings();
		this.handleGravitations();
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		// player-enemy collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver){			
			playerShip.hull -= this.hull;
			playerShip.hit = true;			
			this.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 ) {
			this.dead = true;

			if(this.type == 'base'){				
				game.explosions.push(new explosion(this.x-this.size/2, this.y-this.size/2, speed, direction, this.size));
			}
			else{
				game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));
			}
			if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;							
			}
		}

		if(this.fireRate !== 0){
			this.bulletTimer++;

			if (this.bulletTimer % this.bulletDivision == 1){
				this.bulletTimer = 1;				
				bulletX = (this.type == 'base') ? (this.x + this.size*0.42) - this.size/2 : this.x + this.size*0.42;
				bulletY = (this.type == 'base') ? (this.y + this.size) - this.size/2 : this.y + this.size;
				bulletDirection = this.angleTo(playerShip);
				game.enemyBullets.push(new enemyBullet(bulletX, bulletY, 50, bulletDirection, 100, 20));			
			}
		}

		if(this.type != 'base' )
		{	
		direction -= utils.randomRange(-0.05, 0.05);
		}
	};

	this.draw = function() {
		
		if(this.type == 'base'){ //making bases rotate
			//clear trails
			game.contextEnemies.save();
			game.contextEnemies.translate(this.lastX, this.lastY);
			game.contextEnemies.rotate(this.rotation);
			game.contextEnemies.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails
			game.contextEnemies.restore();

			if (!this.dead) {				

				//set rotation speed
				this.rotation += 0.01;

				//rotate canvas
				game.contextEnemies.save();
				game.contextEnemies.translate(this.x, this.y);
				game.contextEnemies.rotate(this.rotation);

				//draw image
				game.contextEnemies.drawImage(game.images[this.image], -this.size/2, -this.size/2, this.size, this.size);

				game.contextEnemies.restore();
			}
		}
		else {
			game.contextEnemies.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
			if (!this.dead) {
				game.contextEnemies.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render
			}
		}

		if (this.hit) {
			this.hitTimer++;
			var imgData = (this.type == 'base') ? game.contextEnemies.getImageData(this.x-this.size/2, this.y-this.size/2, this.size, this.size) : game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

			var d = imgData.data;
		    for (var i = 0; i < d.length; i += 4) {
		      var r = d[i];
		      var g = d[i + 1];
		      var b = d[i + 2];
		      d[i] = d[i + 1] = d[i + 2] = 255;
		    }

		    if (this.type == 'base'){
		   		game.contextEnemies.putImageData(imgData, this.x-this.size/2, this.y-this.size/2);
		   	}
		   	else{
				game.contextEnemies.putImageData(imgData, this.x, this.y);
			}

			if (this.hitTimer > 4){
				this.hit = false;
				this.hitTimer = 0;
			} 
		}
	};
}

enemy.prototype = Object.create(particle.prototype); // Creating a enemy.prototype object that inherits from particle.prototype.
enemy.prototype.constructor = enemy; // Set the "constructor" property to refer to enemy