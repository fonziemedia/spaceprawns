var enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate) {
	
	this.side = side;
	this.spawnedShips = 0;
	this.race = race;
	this.type = type;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.fireRate = fireRate || 0;
	this.spawnTimer = 1;
	this.spawnDivision = Math.round(1500 * dt);
	switch (this.side){
		case 'top':
			this.x = pos;
			this.y = -Math.round(game.height*0.1);
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = -Math.round(game.width*0.2);
			this.y = pos;
			this.direction = 0;
			break;
		case 'right':
			this.x = Math.round(game.width*1.2);
			this.y = pos;
			this.direction = Math.PI;
			break;
	}
	this.over = false;
	// this.bulletTimer = 1;
	// this.bulletDivision = fireRate || 99999;
	// this.loot = [];
	


	this.update = function() {
					
		// if (dt !== 0 && !this.spawnDivisionSet){
		// 	this.spawnDivision = Math.round(700 * dt);
		// 	this.spawnDivisionSet = true;
		// }
						
			
		this.spawnTimer++;
				
		if (this.spawnedShips <= this.fleetSize){
			if (this.spawnTimer % this.spawnDivision == 1){   
				this.spawnTimer = 1;					
				game.enemies.push(new enemy(this.x, this.y, this.speed, this.direction, this.hull, this.type, this.race, this.fireRate, true));
				this.spawnedShips++;
			}
		}

		if (this.spawnedShips == this.fleetSize){
			this.over = true;
		}
	};
	
};