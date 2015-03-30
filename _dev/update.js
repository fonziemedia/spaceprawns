		//====================== Main update function =================//		
		function update(){
			//obtaining an average deltaTime
			if(dtTimer <= 30){

				var timeNow = new Date().getTime();
				var timeDiff = timeNow - (timeThen);
				// console.log (timeDiff);
	    		dtArray.push(timeDiff); // seconds since last frame
	    		timeThen = timeNow;
	    		dtTimer++;
    		}

    		if(dtTimer == 30){
    			var dtSum = 0;
    			for( var i = 0; i < dtArray.length-2; i++) {
					dtSum += dtArray[i+2]; //+2 skips first values which might be deviant
					// console.log (dtSum);
				}
					dt = Math.round(dtSum / dtArray.length)/1000;					
    		}	
    		// console.log (dt);
    		// console.log (timeNow);
    		// console.log (timeThen);

			game.timer++;
			game.seconds = game.timer/60 || 0;
			// console.log(game.seconds);	

			//////////////////////// 
			// Init
			///////////////////////							
			game.contextPlayer.clearRect(0, 0, game.width, game.height); //clear trails
			playerShip.update();
			playerShip.draw();
			game.contextEnemies.clearRect(0, 0, game.width, game.height); //clear trails

			//////////////////////// 
			// Background
			///////////////////////

			// addStars(1);		

			game.contextBackground.clearRect(0, 0, game.width, game.height); //clear trails

			if (level1Bg.length < 1){			
				level1Bg.push(new background(150, 21, 0));			
			}

			for (var b in level1Bg){

				if (level1Bg[b].y > -game.height*0.02 && level1Bg.length < 2){

					level1Bg.push(new background(150, 21, 1));				
				}

				if (level1Bg[b].y > game.height){
					level1Bg.splice(b, 1);
				}

				
				level1Bg[b].update();			
				level1Bg[b].draw();
			}


			/////////////////////////////////////////////////////////////////////////////////
			// LEVEL 1
			//
			// enemy(x, y, speed, direction, hull, type, image, fireRate, sheep)
			// enemyWave = function(side, pos, race, type, fleetSize, speed, hull, fireRate)
			////////////////////////////////////////////////////////////////////////////////

			if (game.seconds == 1) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 0, true));
			}
			if (game.seconds == 3) {
			    game.waves.push(new enemyWave('left', game.width*0.3, 1, 'pawn', 4, 300, 1, 0, true));		
			}
			if (game.seconds == 5) {
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));		
			}
			if (game.seconds == 7) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 22, 1));
			}
			if (game.seconds == 11) {
			    game.waves.push(new enemyWave('top', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
			}
			if (game.seconds == 13) {
				if(game.music){
					game.songs.push(new Audio("_sounds/_lvl1/tune2.mp3"));				
					game.songs[1].play();
					game.songs[1].loop = true;
				}
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 10, 'base', 23, 1));				
			}
			if (game.seconds == 18) {
			    game.waves.push(new enemyWave('right', game.width*0.3, 1, 'pawn', 4, 300, 1, 2, true));
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
			    game.enemies.push(new enemy(game.width * 0.7, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 40) {
			    game.enemies.push(new enemy(game.width * 0.3, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 42) {
			    game.enemies.push(new enemy(game.width * 0.5, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}
			if (game.seconds == 45) {
			    game.enemies.push(new enemy(game.width * 0.6, -game.height*0.1, 80, Math.PI/2, 10, 'miniboss', 24, 2));
			}

			if (game.seconds == 55) {
				if (game.music) {
					game.songs.push(new Audio("_sounds/_lvl1/boss.mp3"));
					game.songs[2].play();
				}
			    game.enemies.push(new boss(game.width*0.3, -game.height*0.1, 150, Math.PI/2, 100, 27));
			}
			//boss(x, y, speed, direction, hull, image)

			///////////////////////////////////
			// Player bullets
			///////////////////////////////////
			if (game.playerBullets.length >= 1) {
				for (var k in game.playerBullets){
					
					if (!game.playerBullets[k].dead) {
						game.playerBullets[k].update();					
						game.playerBullets[k].draw();
					}
					else  if (game.playerBullets.dead || game.playerBullets[k].x > game.width + game.playerBullets[k].size || game.playerBullets[k].x < 0 - game.playerBullets[k].size || game.playerBullets[k].y > game.height + game.playerBullets[k].size || game.playerBullets[k].y < 0 - 30){
						game.playerBullets.splice(k,1);
					}
				}
			}

			///////////////////////////////////
			// Enemies
			///////////////////////////////////

			if (game.enemies.length > 0){
				
				for (var c in game.enemies){
					game.enemies[c].update();
					game.enemies[c].draw();
				}

				for (var j in game.enemies){
					//projectiles collision
					if (game.playerBullets.length >= 1){
						for (var f in game.playerBullets){
							if (Collision(game.enemies[j], game.playerBullets[f]) && !game.enemies[j].dead){ //dead check avoids ghost scoring														
								game.enemies[j].hit = true;	
								game.enemies[j].hull -= game.playerBullets[f].power;
								// game.contextEnemies.clearRect(game.playerBullets[f].x, game.playerBullets[f].y, game.playerBullets[f].size, game.playerBullets[f].size*1.8);								
								if(game.enemies[j].hull > 0) {
									game.explosions.push(new explosion(game.playerBullets[f].x, game.playerBullets[f].y, 0, 1, game.playerBullets[f].size*0.3));
								}
								game.playerBullets[f].dead = true;
								// game.playerBullets.splice(f,1);
							}
						}
					}
				}

				for (var t in game.enemies){					
					// player-enemy collision
					if (Collision(game.enemies[t], playerShip) && !game.enemies[t].dead && !game.gameOver){			
						playerShip.hull -= game.enemies[t].hull;
						gameUI.updateEnergy();						
						playerShip.hit = true;			
						game.enemies[t].hit = true;			
						game.enemies[t].hull -= playerShip.hull;
					}	
				}


				for (var o in game.enemies){
					if(game.enemies[o].dead || game.enemies[o].y > game.height + game.enemies[o].size ||  game.enemies[o].x < -game.width*0.3 ||  game.enemies[o].x > game.width*1.3){					
						if(game.enemies[o].dead){
							// game.contextEnemies.clearRect(game.enemies[o].x, game.enemies[o].y, game.enemies[o].size, game.enemies[o].size);
							lootchance = Math.random();
							if (lootchance < 0.05) {
								game.loot.push(new loot(game.enemies[o].x, game.enemies[o].y));					
							}
						}	

						game.enemies.splice(o,1);				
					}
				}
			}

			///////////////////////////////////
			// Waves
			///////////////////////////////////

			if (game.waves.length > 0){
				for (var h in game.waves){

					game.waves[h].update();

					if(game.waves[h].over){					
						game.waves.splice(h,1);				
					}
				}
			}

			///////////////////////////////////
			// Loot
			///////////////////////////////////

			if (game.loot.length >= 1) {
				for (var u in game.loot){
					game.loot[u].update();
					game.loot[u].draw();



					if(game.loot[u].dead || game.loot[u].x > game.width + game.loot[u].size || game.loot[u].x < 0 - game.loot[u].size || game.loot[u].y > game.height + game.loot[u].size || game.loot[u].y < 0 - 30){
						game.loot.splice(u,1);
					}
				}
			}




			///////////////////////////////////
			// Enemy Bullets
			///////////////////////////////////

			if (game.enemyBullets.length >= 1) {
				for (var z in game.enemyBullets){
					game.enemyBullets[z].update();
					game.enemyBullets[z].draw();


					if (Collision(game.enemyBullets[z], playerShip) && !game.gameOver){ //
						// if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}							
									// game.contextEnemies.clearRect(game.playerBullets[p].x, game.playerBullets[p].y, game.playerBullets[p].size, game.playerBullets[p].size*1.8);								
						playerShip.hull -= game.enemyBullets[z].power;
						gameUI.updateEnergy();	
						playerShip.hit = true;	
						// Xplode(playerShip.x, playerShip.y);
						// playerShip.dead = true;
						// 		game.contextPlayer.clearRect(game.player.x, game.player.y, game.player.size, game.player.size);
						// 		Xplode(game.player.x, game.player.y);
								// PlayerDie();
						// 	}
						game.enemyBullets[z].dead = true;
					}

					if(game.enemyBullets[z].dead || game.enemyBullets[z].x > game.width + game.enemyBullets[z].size || game.enemyBullets[z].x < 0 - game.enemyBullets[z].size || game.enemyBullets[z].y > game.height + game.enemyBullets[z].size || game.enemyBullets[z].y < 0 - 30){
						game.enemyBullets.splice(z,1);
					}
				}
			}

			///////////////////////////////////
			// Game Explosions
			///////////////////////////////////

			if (game.explosions.length > 0) {
				for(var l in game.explosions){

					game.explosions[l].update();
					game.explosions[l].draw();
				}

				for(var p in game.explosions){

					if (game.explosions[p].currentFrame == 19){
						game.explosions.splice(p,1);
					}
				}
			}

			///////////////////////////////////
			// Game Sounds
			///////////////////////////////////

			if (game.sounds.length > 0) {
				for(var s in game.sounds){

					game.sounds[s].play();
					game.sounds[s].addEventListener("ended", game.sounds.splice(s,1));

				}
			}			
		}	