var level1 = {};

// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
level1.second1 = function ()
{
	getNewEnemyWave('left', game.width*0.3, 'enemy_sectoid', 'pawn', 1, 300, 1, 0);
	getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 'pawn', 1, 250, 1, 0);
};

level1.second3 = function ()
{
  getNewEnemyWave('left', game.height*0.5, 'enemy_sectoid', 'pawn', 1, 250, 1, 0);
  getNewEnemyWave('right', game.height*0.5, 'enemy_sectoid', 'pawn', 1, 300, 1, 0);
};

level1.second5 = function ()
{
  getNewEnemy(game.width * 0.7, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second7 = function ()
{
  getNewEnemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'enemy_base_sectoid', 1);
};

level1.second8 = function ()
{
  getNewEnemyWave('left', game.height*0.3, 'enemy_sectoid', 'pawn', 4, 250, 1, 3);
};

level1.second9 = function ()
{
  getNewEnemyWave('right', game.height*0.2, 'enemy_sectoid', 'pawn', 3, 300, 1, 3);
};

level1.second10 = function ()
{
  getNewEnemyWave('top', game.width*0.5, 'enemy_sectoid', 'pawn', 6, 300, 1, 3);
};

level1.second11 = function ()
{
  getNewEnemyWave('top', game.width*0.7, 'enemy_sectoid', 'pawn', 4, 300, 1, 3);
};

level1.second12 = function ()
{
  getNewEnemyWave('left', game.height*0.2, 'enemy_sectoid', 'pawn', 3, 300, 1, 3);
};

level1.second13 = function ()
{
  getNewEnemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'enemy_base_floater', 1);
};

level1.second15 = function ()
{
  getNewEnemyWave('top', game.width*0.2, 'enemy_sectoid', 'pawn', 2, 300, 1, 2);
};

level1.second16 = function ()
{
  getNewEnemyWave('top', game.width*0.4, 'enemy_sectoid', 'pawn', 3, 300, 1, 2);
};

level1.second17 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second18 = function ()
{
  getNewEnemyWave('top', game.width*0.8, 'enemy_sectoid', 'pawn', 5, 300, 1, 2);
};

level1.second22 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second25 = function ()
{
  getNewEnemyWave('left', game.width*0.4, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second27 = function ()
{
  getNewEnemyWave('right', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second30 = function ()
{
  getNewEnemyWave('top', game.width*0.3, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second33 = function ()
{
  getNewEnemyWave('top', game.width*0.6, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second35 = function ()
{
  getNewEnemyWave('right', game.width*0.2, 'enemy_sectoid', 'pawn', 4, 300, 1, 2);
};

level1.second37 = function ()
{
  getNewEnemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second38 = function ()
{
  getNewEnemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second39 = function ()
{
  getNewEnemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second40 = function ()
{
  getNewEnemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second41 = function ()
{
  getNewEnemy(game.width * 0.5, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second42 = function ()
{
  getNewEnemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second43 = function ()
{
  getNewEnemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second44 = function ()
{
  getNewEnemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.second45 = function ()
{
  getNewEnemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'enemy_floater', 2);
};

level1.update = function ()
{
	if (game.seconds > 13 && game.tracks.length < 2 && game.enemies.length > 0 && !game.bossDead) //NEEDS WORK
	{
		if(game.music)
		{
			game.tracks.push(game.soundTracks['tune2' + fileFormat]);
			game.tracks[1].play();
			game.tracks[1].loop = true;
		}
	}
	if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead)
	{
		if (game.music)
		{
			game.tracks.push(game.soundTracks['boss' + fileFormat]);
			game.tracks[2].play();
			game.tracks[2].loop = true;
		}
		game.enemies.push(new boss(game.width*0.3, game.outerTop, 150, Math.PI/2, 100, 'boss_sectoid'));
	}

	if (game.seconds > 55 && game.enemies.length === 0 && game.bossDead && game.tracks.length == 3)
	{
		game.tracks[0].pause();
		game.tracks[1].pause();
		game.tracks[2].pause();
		game.tracks=[];
		if (game.music && game.tracks.length === 0)
		{
			game.tracks.push(game.soundTracks['victory' + fileFormat]);
		}

		game.tracks[0].play();
	}
};
//boss(x, y, speed, direction, hull, image)
// };
