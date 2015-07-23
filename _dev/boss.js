function boss(x, y, speed, direction, hull, image) {
	particle.call(this, x, y, speed, direction);

	this.hull = hull;
	this.image = game.images[image];
	this.size = Math.round(200*dtSize);
	this.hit = false;
	this.audioHit = 'hit.mp3';
	this.audioDead = 'blast.mp3';
	this.hitTimer = 0; 
	this.dead = false;
	this.deadTimer = 0;
	this.bulletTimer1 = 1;
	this.bulletTimer2 = 1;
	this.bulletDivision1 = 50;
	this.bulletDivision2 = 30;
	this.fireRate = 0; //bullets/sec
	// this.fireRate = fireRate * 60; //bullets/sec
	this.yStop = Math.round(game.height*0.1);
	this.xBondary = Math.round(game.width - this.size/4);
	this.context = game.contextEnemies;


	this.update = function() {
		this.bulletDirection = this.angleTo(playerShip);
		this.vx = Math.cos(direction) * (speed*dt);
		this.vy = Math.sin(direction) * (speed*dt);		
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;


		if(this.hit && this.hull > 0 ){
			if(game.sound){game.sounds.push(game.sfx[this.audioHit]);}
			//change image here		
			this.hit = false;
		}

		// player-boss collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver){			
			playerShip.hull -= this.hull;
			playerShip.hit = true;			
			this.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 ) {
			game.explosions.push(new explosion(this.x, this.y, speed, direction, this.size));			
			if(game.sound){game.sounds.push(game.sfx[this.audioDead]);}
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;	
				game.bossDead = true;
				this.dead = true;						
			}
		}


			this.bulletTimer1++;
			this.bulletTimer2++;

			// (x, y, speed, direction, power, image)
			if (this.bulletTimer1 % this.bulletDivision1 == 1){
				this.bulletTimer1 = 1;	
				mBulletX1 = Math.round(this.x);
				mBulletX2 = Math.round(this.x + this.size);
				mBulletY = Math.round(this.y + this.size*0.6);		
				game.enemyBullets.push(new enemyBullet(mBulletX1, mBulletY, 50, this.bulletDirection, 1, 'missile.png'));			
				game.enemyBullets.push(new enemyBullet(mBulletX2, mBulletY, 50, this.bulletDirection, 1, 'missile.png'));			
			}
		
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer2 % this.bulletDivision2 == 1) {				
				// if (game.sound){game.shootSound.play();}
				this.bulletTimer2 = 1; //resetting our timer
				lBulletX = Math.round(this.x + this.size*0.48);
				lBulletY = Math.round(this.y + this.size);
			    game.enemyBullets.push( new enemyBullet(lBulletX, lBulletY, 250, Math.PI/2, 1.5, 'laser.png'));
			    game.enemyBullets.push( new enemyBullet(lBulletX, lBulletY, 250, Math.PI/2, 1.5, 'laser.png'));				
			}

		

		if (this.y > this.yStop){
			speed = 0;
			if (this.x > 0 && this.x <= this.xBondary) {

				if (this.x < playerShip.x && this.x <= this.xBondary-1){
					this.x += 1;
				}
				else if (this.x > playerShip.x && this.x > 1){
					this.x -= 1;
				}

			}
		}

	};

	this.draw = function() {
		
		if (!this.dead) {
				game.contextEnemies.drawImage(this.image, this.x, this.y, this.size, this.size); //render
		}		

		// if (this.hit) {
		// 	this.hitTimer++;
		// 	var imgData = game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

		// 	var d = imgData.data;
		//     for (var i = 0; i < d.length; i += 4) {
		//       var r = d[i];
		//       var g = d[i + 1];
		//       var b = d[i + 2];
		//       d[i] = d[i + 1] = d[i + 2] = 255;
		//     }
			
		// 	game.contextEnemies.putImageData(imgData, this.x, this.y);

		// 	if (this.hitTimer > 4){
		// 		this.hit = false;
		// 		this.hitTimer = 0;
		// 	} 
		// }
	};
}

boss.prototype = Object.create(particle.prototype); // Creating a boss.prototype object that inherits from particle.prototype.
boss.prototype.constructor = boss; // Set the "constructor" property to refer to enemy