function lvl1() {

			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)

			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('left', game.width*0.3, 'sectoid.png', 'pawn', 1, 300, 1, 0));
			}
			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 1, 250, 1, 0));
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('left', game.height*0.5, 'sectoid.png', 'pawn', 1, 250, 1, 0));		
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('right', game.height*0.5, 'sectoid.png', 'pawn', 1, 300, 1, 0));		
			}

			if (game.seconds == 5) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));		
			}
			if (game.seconds == 7) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 'alienbase1.png', 1));
			}
			if (game.seconds == 8) {
			    game.waves.push(new enemyWave('left', game.height*0.3, 'sectoid.png', 'pawn', 4, 250, 1, 2));
			}
			if (game.seconds == 9) {
			    game.waves.push(new enemyWave('right', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}			
			if (game.seconds == 10) {
			    game.waves.push(new enemyWave('top', game.width*0.5, 'sectoid.png', 'pawn', 6, 300, 1, 2));
			}
			if (game.seconds == 11) {
			    game.waves.push(new enemyWave('top', game.width*0.7, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 12) {
			    game.waves.push(new enemyWave('left', game.height*0.2, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}
			if (game.seconds == 13) {				
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 'alienbase2.png', 1));				
			}
			if (game.seconds > 13 && game.tracks.length < 2 && game.enemies.length > 0 && !game.bossDead) //NEEDS WORK
			{
				if(game.music){
					game.tracks.push(game.soundTracks['tune2.' + fileFormat]);				
					game.tracks[1].play();
					game.tracks[1].loop = true;
				}
			}
			if (game.seconds == 15) {
			    game.waves.push(new enemyWave('top', game.width*0.2, 'sectoid.png', 'pawn', 2, 300, 1, 2));
			}
			if (game.seconds == 16) {
			    game.waves.push(new enemyWave('top', game.width*0.4, 'sectoid.png', 'pawn', 3, 300, 1, 2));
			}
			if (game.seconds == 17) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 18) {
			    game.waves.push(new enemyWave('top', game.width*0.8, 'sectoid.png', 'pawn', 5, 300, 1, 2));
			}
			if (game.seconds == 22) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 25) {
			    game.waves.push(new enemyWave('left', game.width*0.4, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 27) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 30) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 33) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 35) {
			    game.waves.push(new enemyWave('right', game.width*0.2, 'sectoid.png', 'pawn', 4, 300, 1, 2));
			}
			if (game.seconds == 37) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 38) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 39) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 40) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 41) {
			    game.enemies.push(new enemy(game.width * 0.5, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}			
			if (game.seconds == 42) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 43) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 44) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds == 45) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 'floater.png', 2));
			}
			if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead) {
				if (game.music) {
					game.tracks.push(game.soundTracks['boss.' + fileFormat]);
					game.tracks[2].play();
					game.tracks[2].loop = true;
				}
			    game.enemies.push(new boss(game.width*0.3, -game.height*0.1, 150, Math.PI/2, 100, 'sectoidBoss.png'));
			}

			if (game.seconds > 55 && game.enemies.length === 0 && game.bossDead && game.tracks.length == 3) {
				game.tracks[0].pause();
				game.tracks[1].pause();
				game.tracks[2].pause();
				game.tracks=[];
				if (game.music && game.tracks.length === 0)
					{
						game.tracks.push(game.soundTracks['victory.' + fileFormat]);
					}

				game.tracks[0].play();
			}
			//boss(x, y, speed, direction, hull, image)
}