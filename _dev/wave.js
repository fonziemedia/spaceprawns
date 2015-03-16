var enemyWave = function(race, fleetSize, speed, hull, nWaves, waveInterval, fireRate) {
	
	this.spawnedShips = 0;
	this.race = race;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.interval = 1;
	this.intervalDivision = waveInterval;
	this.spawnTimer = 1;
	this.spawnDivisionSet = false;
	this.waveCount = 0;
	this.nWaves = nWaves;
	this.started = false;
	this.finished = false;

	// FOR REFERENCE ONLY: Math.random()*(max-min+1)+min; //a random number between max and min
	this.xVal = [Math.random()*((game.width*0.85)-(game.width*0.15)+1) + game.width*0.15, Math.random()*((-game.width*0.1)-(-game.width*0.3)+1) - game.width*0.3, Math.random()*((game.width*1.3)-(game.width*1.1)+1) + game.width*1.3];
	this.randomX = Math.floor(Math.random() * this.xVal.length);
	this.x = this.xVal[this.randomX];

	if (this.x < 0 || this.x > game.width) {
		this.y = Math.random()*((game.height*0.5)-(game.height*0.15)+1) + game.height*0.15;
		if (this.x < 0){
			this.direction = 0;
		}
		else if (this.x > game.width)
		{
			this.direction = Math.PI;
		} 
	}
	else {
		this.y = -game.height*0.1;
		this.direction = Math.PI/2;
	}


	this.units = [];
	this.bullets = [];
	this.bulletTimer = 1;
	this.bulletDivision = fireRate || 99999;
	this.loot = [];
	


	this.update = function() {
					
		if (dt !== 0 && !this.spawnDivisionSet){
			this.spawnDivision = Math.round(700 * dt);
			this.spawnDivisionSet = true;
		}

		if (!this.finished) {			
			this.interval++;

			// console.log (this.interval);
			// console.log (this.interval % this.intervalDivision == 1);			

			if (this.interval % this.intervalDivision == 1){   //this is our timer for enemies to change movement direction. If the division of these vars equals 0 then..
				this.started = true;
			}

			if (this.started) {							
				//this 1
				
				this.spawnTimer++;
				
				if (this.spawnedShips <= this.fleetSize){
					if (this.spawnTimer % this.spawnDivision == 1 & !this.finished){   
						this.spawnTimer = 1;					
						this.units.push(new enemy(this.x, this.y, this.speed, this.direction, this.hull, this.race));
						this.spawnedShips++;
					}
				}

				remainingEnemies = this.units.length;
				remainingBullets = this.bullets.length;
				
				// console.log(remainingBullets);


				if (this.units.length >= 1) {
					this.bulletTimer++;
				}

				
				// enemy bullets
				//(x, y, speed, direction, power, image)				
				pEn = (remainingEnemies < 2) ? 0 : Math.floor(Math.random()*((remainingEnemies-1)+1)); //a random number between 0 and the maximum array index (remainingEnemies-1)

				if (this.bulletTimer % this.bulletDivision == 1 && remainingEnemies >= 1 && this.units[pEn].y < game.height - this.units[pEn].size && this.units[pEn].y > 0 + this.units[pEn].size){
					this.bulletTimer = 1;
					bulletX = this.units[pEn].x + this.units[pEn].size*0.42;
					bulletY = this.units[pEn].y + this.units[pEn].size;
					bulletDirection = this.units[pEn].angleTo(playerShip);

					this.bullets.push(new enemyBullet(bulletX, bulletY, 50, bulletDirection, 100, 20));			
					
				}

				for(var m in this.units){

					this.units[m].update();
					this.units[m].draw();


					//projectiles collision
					for(var p in playerShip.bullets){
						if(Collision(this.units[m], playerShip.bullets[p]) && !this.units[m].dead){ //dead check avoids ghost scoring														
							this.units[m].hit = true;							
							this.units[m].hull -= playerShip.bullets[p].power;							
							// game.contextEnemies.clearRect(playerShip.bullets[p].x, playerShip.bullets[p].y, playerShip.bullets[p].size, playerShip.bullets[p].size*1.8);								
							playerShip.bullets[p].dead = true;
							playerShip.bullets.splice(p,1);
						}
					}				


					if(!this.finished && this.units[m].dead || this.units[m].y > game.height + this.units[m].size ||  this.units[m].x < -game.width*0.3 ||  this.units[m].x > game.width*1.3){					
						if(this.units[m].dead){
							game.contextEnemies.clearRect(this.units[m].x, this.units[m].y, this.units[m].size, this.units[m].size);
							lootchance = Math.random();
							if (lootchance < 0.05) {
								this.loot.push(new loot(this.units[m].x, this.units[m].y));					
							}
						}	

						this.units.splice(m,1);				
					}
				}

				if (this.spawnedShips >= this.fleetSize && remainingEnemies === 0 ) { //if all wave is gone
					this.waveCount++;
					this.started = false;
					this.interval = 1;
					this.spawnedShips = 0;	
					this.randomX = Math.floor(Math.random() * this.xVal.length);
					this.x = this.xVal[this.randomX];
					if (this.x < 0 || this.x > game.width) {
						this.y = Math.random()*((game.height*0.5)-(game.height*0.15)+1) + game.height*0.15;
						if (this.x < 0){
							this.direction = 0;
						}
						else if (this.x > game.width){
							this.direction = Math.PI;
						} 
					}
					else {
						this.y = -game.height*0.1;
						this.direction = Math.PI/2;
					}			
				}

				if(this.waveCount >= this.nWaves) {
					this.finished = true;
				}
			}
		}

		if (this.bullets.length >= 1) {
			for (var z in this.bullets){
				this.bullets[z].update();
				this.bullets[z].draw();



				if(this.bullets[z].dead || this.bullets[z].x > game.width + this.bullets[z].size || this.bullets[z].x < 0 - this.bullets[z].size || this.bullets[z].y > game.height + this.bullets[z].size || this.bullets[z].y < 0 - 30){
					this.bullets.splice(z,1);
				}
			}
		}

		if (this.loot.length >= 1) {
			for (var u in this.loot){
				this.loot[u].update();
				this.loot[u].draw();



				if(this.loot[u].x > game.width + this.loot[u].size || this.loot[u].x < 0 - this.loot[u].size || this.loot[u].y > game.height + this.loot[u].size || this.loot[u].y < 0 - 30){
					this.loot.splice(u,1);
				}
			}
		}
	};

	this.reset = function() {
		this.spawnedShips = 0;
		this.waveCount = 0;
		this.started = false;
		this.finished = false;
		this.randomX = Math.floor(Math.random() * this.xVal.length);
		this.x = this.xVal[this.randomX];
		if (this.x < 0 || this.x > game.width) {
			this.y = Math.random()*((game.height*0.5)-(game.height*0.15)+1) + game.height*0.15;
			if (this.x < 0){
				this.direction = 0;
			}
			else if (this.x > game.width){
				this.direction = Math.PI;
			} 
		}
		else {
			this.y = -game.height*0.1;
			this.direction = Math.PI/2;
		}	
		this.units = [];
		this.bullets = [];
		this.bulletTimer = 1;
		this.loot = [];
	};
	
};


// (race, fleetSize, speed, hull, nWaves, waveInterval, fireRate)
var sectoidWave = new enemyWave(1, 7, 250, 100, 10, 300);
var sectoidWave2 = new enemyWave(1, 4, 300, 100, 1, 300);
var sectoidWave3 = new enemyWave(1, 3, 275, 200, 10, 300);
var sectoidWave4 = new enemyWave(1, 6, 300, 200, 10, 300, 150);
var sectoidWave5 = new enemyWave(1, 5, 275, 300, 10, 300, 150);
var sectoidWave6 = new enemyWave(1, 8, 250, 300, 10, 300, 150);