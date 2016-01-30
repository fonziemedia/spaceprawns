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
	this.spawnDivision = Math.round((1500 * dt)/pixelRatio);
	switch (this.side){
		case 'top':
			this.x = pos;
			this.y = game.outerTop;
			this.direction = Math.PI/2;
			break;
		case 'left':
			this.x = game.outerLeft;
			this.y = pos;
			this.direction = 0;
			break;
		case 'right':
			this.x = game.outerRight;
			this.y = pos;
			this.direction = Math.PI;
			break;
	}
	this.over = false;
	// this.bulletTimer = 1;
	// this.bulletDivision = fireRate || 99999;
	// this.loot = [];



	this.update = function() {
		if(!this.over)
		{
			// if (dt !== 0 && !this.spawnDivisionSet){
			// 	this.spawnDivision = Math.round(700 * dt);
			// 	this.spawnDivisionSet = true;
			// }

			this.spawnTimer++;

			if (this.spawnedShips <= this.fleetSize){
				if (this.spawnTimer == this.spawnDivision){
					this.spawnTimer = 1;

					getNewEnemy(this.x, this.y, this.speed, this.direction, this.hull, this.type, this.race, this.fireRate, true);

					this.spawnedShips++;
				}
			}

			if (this.spawnedShips == this.fleetSize){
				this.over = true;
			}
		}
		else
		{
			freeEnemyWave(this);
		}
	};

};

////////////
// Factory
////////////

function getNewEnemyWave(side, pos, race, type, fleetSize, speed, hull, fireRate)
{
    var ew = null;

    // check to see if there is a spare one
    if (game.wavesPool.length > 0)
    {
    	//recycle
        ew = game.wavesPool.pop();

        ew.side = side;
		ew.spawnedShips = 0;
		ew.race = race;
		ew.type = type;
		ew.fleetSize = fleetSize;
		ew.speed = speed;
		ew.hull = hull;
		ew.fireRate = fireRate || 0;
		ew.spawnTimer = 1;
		ew.spawnDivision = Math.round(1500 * dt);
		switch (ew.side){
			case 'top':
				ew.x = pos;
				ew.y = game.outerTop;
				ew.direction = Math.PI/2;
			break;
			case 'left':
				ew.x = game.outerLeft;
				ew.y = pos;
				ew.direction = 0;
			break;
			case 'right':
				ew.x = game.outerRight;
				ew.y = pos;
				ew.direction = Math.PI;
			break;
		}

		ew.over = false;

    	game.waves.push(ew);
    }
    else
    {
        // none available, construct a new one
		ew = new enemyWave(side, pos, race, type, fleetSize, speed, hull, fireRate);
    	game.waves.push(ew);
    }

    // console.log('pool: ' + game.wavesPool.length);
    // console.log('active: ' + game.waves.length);

}


function freeEnemyWave(ew)
{
    // find the active bullet and remove it
    game.waves.splice(game.waves.indexOf(ew),1);

    // return the bullet back into the pool
	game.wavesPool.push(ew);
}
