var level1 = {};

			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)

			level1.second1 = function () {
				game.waves.push(new enemyWave('left', game.width*0.3, 'sectoid.png', 'pawn', 1, 300, 1, 0));
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 1, 250, 1, 0));
			};

			level1.second3 = function () {
			    game.waves.push(new enemyWave('left', game.height*0.5, 'sectoid.png', 'pawn', 1, 250, 1, 0));
			    game.waves.push(new enemyWave('right', game.height*0.5, 'sectoid.png', 'pawn', 1, 300, 1, 0));		
			};

			level1.second5 = function () {
			    game.enemies.push(new enemy(game.width * 0.7, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));		
			};

			level1.second7 = function () {
			    game.enemies.push(new enemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'alienbase1.png', 1));
			};

			level1.second8 = function () {
			    game.waves.push(new enemyWave('left', game.height*0.3, 'sectoid.png', 'pawn', 4, 250, 1, 2));
			};

			level1.second9 = function () {
			    game.waves.push(new enemyWave('right', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			};

			level1.second10 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.5, 'sectoid.png', 'pawn', 6, 300, 1, 2));
			};

			level1.second11 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.7, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second12 = function () {
			    game.waves.push(new enemyWave('left', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			};

			level1.second13 = function () {				
			    game.enemies.push(new enemy(game.width * 0.3, game.outerTop, 155, Math.PI/2, 10, 'base', 'alienbase2.png', 1));			
			};			
			
			level1.second15 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.2, 'sectoid.png', 'pawn', 2, 300, 1, 2));
			};

			level1.second16 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.4, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			};

			level1.second17 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second18 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.8, 'sectoid.png', 'pawn', 5, 300, 1, 2));
			};

			level1.second22 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second25 = function () {
			    game.waves.push(new enemyWave('left', game.width*0.4, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second27 = function () {
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second30 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second33 = function () {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second35 = function () {
			    game.waves.push(new enemyWave('right', game.width*0.2, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			};

			level1.second37 = function () {
			    game.enemies.push(new enemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second38 = function () {
			    game.enemies.push(new enemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second39 = function () {
			    game.enemies.push(new enemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second40 = function () {
			    game.enemies.push(new enemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second41 = function () {
			    game.enemies.push(new enemy(game.width * 0.5, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second42 = function () {
			    game.enemies.push(new enemy(game.width * 0.2, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second43 = function () {
			    game.enemies.push(new enemy(game.width * 0.4, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second44 = function () {
			    game.enemies.push(new enemy(game.width * 0.6, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.second45 = function () {
			    game.enemies.push(new enemy(game.width * 0.8, game.outerTop, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			};

			level1.update = function () {
				if (game.seconds > 13 && game.tracks.length < 2 && game.enemies.length > 0 && !game.bossDead) //NEEDS WORK
				{
					if(game.music){
						game.tracks.push(game.soundTracks['tune2' + fileFormat]);				
						game.tracks[1].play();
						game.tracks[1].loop = true;
					}
				}				
				if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead) {
					if (game.music) {
						game.tracks.push(game.soundTracks['boss' + fileFormat]);
						game.tracks[2].play();
						game.tracks[2].loop = true;
					}
				    game.enemies.push(new boss(game.width*0.3, game.outerTop, 150, Math.PI/2, 50, 'sectoidBoss.png'));
				}

				if (game.seconds > 55 && game.enemies.length === 0 && game.bossDead && game.tracks.length == 3) {
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