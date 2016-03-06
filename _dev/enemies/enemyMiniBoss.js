enemyMiniBoss = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);
};
enemyMiniBoss.prototype = Object.create(enemy.prototype);
enemyMiniBoss.prototype.constructor = enemyMiniBoss;

enemyMiniBoss.prototype.explosionSize = 'large';

enemyMiniBoss.prototype.update = function()
{
	if (!this.dead)
	{
		this.setMovement();
		this.setBoundaries();
		this.checkHull();
		this.detectCollision();
		this.checkFireRate();
		this.draw();
	}
	else
	{
		freeEnemyMiniBoss(this);
	}
};

////////////
// Factory
////////////
function getNewEnemyMiniBoss(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.miniBossPool.pop();
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyMiniBoss(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.miniBossPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyMiniBosses()
{
	for (var e = 1 ; e <= game.requiredMiniBosses; e++)
	{
		en = new enemyMiniBoss(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.miniBossPool.push(en);
		game.doneObjects++;
	}
}
