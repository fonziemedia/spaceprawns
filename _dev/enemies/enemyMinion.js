enemyMinion = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);
};
enemyMinion.prototype = Object.create(enemy.prototype);
enemyMinion.prototype.constructor = enemyMinion;

enemyMinion.prototype.explosionSize = 'medium';

enemyMinion.prototype.recycle = function(en)
{
	freeEnemyMinion(en);
};

////////////
// Factory
////////////
function getNewEnemyMinion(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.minionsPool.pop();
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyMinion(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.minionsPool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyMinions()
{
	for (var e = 1 ; e <= game.requiredMinions; e++)
	{
		en = new enemyMinion(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.minionsPool.push(en);
		game.doneObjects++;
	}
}
