var enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
{
	this.side = side;
	this.spawnedShips = 0;
	this.race = race;
	this.type = type;
	this.fleetSize = fleetSize;
	this.speed = speed;
	this.hull = hull;
	this.fireRate = fireRate;
	this.spawnTimer = 1;
	this.spawnRate = Math.round((1500 * dt)/pixelRatio);
	switch (this.side)
	{
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

	this.update = function()
	{
		if(!this.over)
		{
			this.spawnTimer++;

			if (this.spawnTimer % this.spawnRate === 0)
			{
					this.spawnFireRate = Math.round(utils.randomRange(this.fireRate, this.fireRate*2)); //a randomRange so that each ship fires at it's own time
					getNewEnemy(this.x, this.y, this.speed, this.direction, this.hull, this.type, this.race, this.spawnFireRate);
					this.spawnedShips++;
			}

			if (this.spawnedShips == this.fleetSize)
			{
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
  //check to see if there is a spare one
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
		ew.fireRate = fireRate;
		ew.spawnTimer = 1;
		ew.spawnRate = Math.round(1500 * dt);
		switch (ew.side)
		{
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
		//none available, construct a new one
		ew = new enemyWave(side, pos, race, type, fleetSize, speed, hull, fireRate);
		game.waves.push(ew);
  }
}

function freeEnemyWave(ew)
{
	// find the active bullet and remove it
	game.waves.splice(game.waves.indexOf(ew),1);
	// return the bullet back into the pool
	game.wavesPool.push(ew);
}

///////////////////////
// Pre-load game waves
///////////////////////
function initWaves()
{
	for (var w = 1 ; w <= game.requiredWaves; w++)
	{
		ew = new enemyWave(null, null, 'enemy_sectoid', 'pawn', 0, 0, 0, 0);
		game.wavesPool.push(ew);
		game.doneObjects++;
	}
}
