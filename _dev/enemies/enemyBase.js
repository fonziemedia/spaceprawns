enemyBase = function(x, y, speed, direction, hull, image, fireRate)
{
	enemy.call(this, x, y, speed, direction, hull, image, fireRate);

	this.sprite = new sprite(image, 6, 5, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
};
enemyBase.prototype = Object.create(enemy.prototype);
enemyBase.prototype.constructor = enemyBase;

enemyBase.prototype.explosionSize = 'xLarge';

enemyBase.prototype.recycle = function(en)
{
	freeEnemyBase(en);
};

enemyBase.prototype.draw = function()
{
	this.sprite.draw(this.x, this.y);
};

////////////
// Factory
////////////
function getNewEnemyBase(x, y, speed, direction, hull, image, fireRate)
{
	var en = null;

	//recycle
	en = game.enemyBasePool.pop();
	en.sprite.reset(image, 6, 5, 6);
	en.reset(x, y, speed, direction, hull, image, fireRate);
	game.enemies.push(en);
}

function freeEnemyBase(en)
{
	//find the active minion and remove it
	game.enemies.splice(game.enemies.indexOf(en),1);
	//return the minion back into the pool
	game.enemyBasePool.push(en);
}

/////////////////////////
// Pre-load game enemies
/////////////////////////
function initEnemyBases()
{
	for (var e = 1 ; e <= game.requiredEnemyBases; e++)
	{
		en = new enemyBase(0, 0, 0, 0, 0, 'enemy_sectoid', 0);
		game.enemyBasePool.push(en);
		game.doneObjects++;
	}
}
