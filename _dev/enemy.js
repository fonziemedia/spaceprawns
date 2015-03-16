function enemy(x, y, speed, direction, hull, image) {
	particle.call(this, x, y, speed, direction);

	this.size = 65*dtSize;
	this.hull = hull;
	this.image = image;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTime = 60;

	this.update = function() {
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
			// console.log(this.x);
			// console.log(this.y);
			// console.log(speed);
			// console.log(direction);
			game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));
			if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;							
			}
			// scores();
		}

		// this.accelerate(3, 3);

	};

	this.draw = function() {
		game.contextEnemies.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
		
		if (!this.dead) {			
			game.contextEnemies.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //render

			if (this.hit) {
				this.hitTimer++;
				var imgData = game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

				var d = imgData.data;
			    for (var i = 0; i < d.length; i += 4) {
			      var r = d[i];
			      var g = d[i + 1];
			      var b = d[i + 2];
			      d[i] = d[i + 1] = d[i + 2] = 255;
			    }

				game.contextEnemies.putImageData(imgData, this.x, this.y);

				if (this.hitTimer > 4){
					this.hit = false;
					this.hitTimer = 0;
				} 
			}
		}
	};
}

enemy.prototype = Object.create(particle.prototype); // Creating a enemy.prototype object that inherits from particle.prototype.
enemy.prototype.constructor = enemy; // Set the "constructor" property to refer to enemy

// var wave = {}; //enemy wave

// wave.units = 0;
// wave.started = false;
// wave.finished = false;
// wave.interval = 1;
// wave.intervalDivision = 200;
// wave.spawnTimer = 1;
// wave.spawnDivision = 15;
// wave.x = Math.random()*game.width;

// var sectoidWave = [];
