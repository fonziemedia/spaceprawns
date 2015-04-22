function lvl1() {

			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)

			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('left', game.width*0.3, 1, 'pawn', 1, 300, 1, 0, true));
			}
			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 1, 'pawn', 1, 250, 1, 0, true));
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('left', game.height*0.5, 1, 'pawn', 1, 250, 1, 0, true));		
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('right', game.height*0.5, 1, 'pawn', 1, 300, 1, 0, true));		
			}

			if (game.seconds == 5) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));		
			}
			if (game.seconds == 7) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 22, 1));
			}
			if (game.seconds == 8) {
			    game.waves.push(new enemyWave('left', game.height*0.3, 1, 'pawn', 4, 250, 1, 2, true));
			}
			if (game.seconds == 9) {
			    game.waves.push(new enemyWave('right', game.height*0.2, 1, 'pawn', 3, 300, 1, 2, true));
			}			
			if (game.seconds == 10) {
			    game.waves.push(new enemyWave('top', game.width*0.5, 1, 'pawn', 6, 300, 1, 2, true));
			}
			if (game.seconds == 11) {
			    game.waves.push(new enemyWave('top', game.width*0.7, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 12) {
			    game.waves.push(new enemyWave('left', game.height*0.2, 1, 'pawn', 3, 300, 1, 2, true));
			}
			if (game.seconds == 13) {
				if(game.music){
					game.songs.push(new Audio("_sounds/_lvl1/tune2.mp3"));				
					game.songs[1].play();
					game.songs[1].loop = true;
				}
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 23, 1));				
			}
			if (game.seconds == 15) {
			    game.waves.push(new enemyWave('top', game.width*0.2, 1, 'pawn', 2, 300, 1, 2, true));
			}
			if (game.seconds == 16) {
			    game.waves.push(new enemyWave('top', game.width*0.4, 1, 'pawn', 3, 300, 1, 2, true));
			}
			if (game.seconds == 17) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 18) {
			    game.waves.push(new enemyWave('top', game.width*0.8, 1, 'pawn', 5, 300, 1, 2, true));
			}
			if (game.seconds == 22) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 25) {
			    game.waves.push(new enemyWave('left', game.width*0.4, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 27) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 30) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 33) {
			    game.waves.push(new enemyWave('top', game.width*0.6, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 35) {
			    game.waves.push(new enemyWave('right', game.width*0.2, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 37) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 38) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 39) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 40) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 41) {
			    game.enemies.push(new enemy(game.width * 0.5, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}			
			if (game.seconds == 42) {
			    game.enemies.push(new enemy(game.width * 0.2, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 43) {
			    game.enemies.push(new enemy(game.width * 0.4, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 44) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 45) {
			    game.enemies.push(new enemy(game.width * 0.8, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds > 50 && game.enemies.length === 0 && !game.bossDead) {
				if (game.music) {
					game.songs.push(new Audio("_sounds/_lvl1/boss.mp3"));
					game.songs[2].play();
				}
			    game.enemies.push(new boss(game.width*0.3, -game.height*0.1, 150, Math.PI/2, 100, 27));
			}
			//boss(x, y, speed, direction, hull, image)
}