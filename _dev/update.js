		//====================== Main update function =================//		
		function update(){
			//////////////////////// 
			// Init
			///////////////////////
			clrCanvas();	

			//obtaining an average deltaTime
			if(dtTimer <= 100){

				var timeNow = new Date().getTime();
				var timeDiff = timeNow - (timeThen);
	    		dtArray.push(timeDiff); // seconds since last frame
	    		timeThen = timeNow;
	    		dtTimer++;
    		}

    		if(dtTimer == 100){
    			var dtSum = 0;
    			for( var i = 0; i < dtArray.length-10; i++) {
					dtSum += dtArray[i+10]; //+10 skips first values which might be deviant
					// console.log (dtSum);
				}
					dt = Math.round(dtSum / dtArray.length)/1000;					
    		}
	

    		//game time
			game.timer++;
			game.seconds = game.timer/60 || 0;
			// console.log(game.seconds);



			playerShip.load();


			//////////////////////// 
			// Background
			///////////////////////

			// addStars(1);		

			gameBackground.update();


			/////////////////////////////////////////////////////////////////////////////////
			// LEVELS
			////////////////////////////////////////////////////////////////////////////////

			if (game.level == 1) { lvl1(); }
			else if (game.level == 2) { lvl1(); }
			else if (game.level == 3) { lvl3(); }


			//level finished
			if (game.bossDead && game.levelUpTimer <= 100) 
			{
				//waiting a few secs before any action
				game.levelUpTimer++; 

				if (game.levelUpTimer == 100) 
				{
					game.levelComplete = true;
					mouseIsDown = 0;					
				}
			}

			/////////////////////////////////////////////////////////////////////////////////
			// TRANSITIONS
			////////////////////////////////////////////////////////////////////////////////
			
			gameTransition.load();			

			///////////////////////////////////
			// Player bullets
			///////////////////////////////////
			if (game.playerBullets.length >= 1)
			{
				for (var k in game.playerBullets)
				{					
					if (!game.playerBullets[k].dead)
					{
						game.playerBullets[k].update();					
						game.playerBullets[k].draw();
					}
				}

				for (var r in game.playerBullets)
				{					
					if (game.playerBullets[r].dead || game.playerBullets[r].x > game.width + game.playerBullets[r].size || game.playerBullets[r].x < 0 - game.playerBullets[r].size || game.playerBullets[r].y > game.height + game.playerBullets[r].size || game.playerBullets[r].y < 0 - 30)
					{
						game.playerBullets.splice(r,1);
					}
				}
			}

			// console.log(game.playerBullets.length);
			// console.log(game.enemyBullets.length);
			// console.log(game.enemies.length);


			///////////////////////////////////
			// Enemies
			///////////////////////////////////

			if (game.enemies.length > 0){
				
				for (var c in game.enemies){
					game.enemies[c].update();
					game.enemies[c].draw();
				}

				if (game.playerBullets.length >= 1){				
					//projectiles collision
					for (var j in game.enemies){
						for (var f in game.playerBullets){
							if (Collision(game.enemies[j], game.playerBullets[f]) && !game.enemies[j].dead){ //dead check avoids ghost scoring														
								game.enemies[j].hit = true;	
								game.enemies[j].hull -= game.playerBullets[f].power;
								// game.contextEnemies.clearRect(game.playerBullets[f].x, game.playerBullets[f].y, game.playerBullets[f].size, game.playerBullets[f].size*1.8);								
								if(game.enemies[j].hull > 0) {
									game.explosions.push(new explosion(game.enemies[j].x + game.enemies[j].size*0.5, game.enemies[j].y + game.enemies[j].size*0.5, 0, 1, game.enemies[j].size*0.25, 'chasis'));
								}
								game.playerBullets[f].dead = true;
								// game.playerBullets.splice(f,1);
							}
						}
					}
				}

				// AI // pathfinding 
				// for (var w in game.enemies){														
				// 	for (var m in game.enemies){
				// 		if (m != w) {
				// 		// for (var w = 0; w <= game.enemies.length; w++) {												
				// 			if (Collision(game.enemies[m], game.enemies[w]) && !game.enemies[m].collided && !game.enemies[w].collided && (game.enemies[m].y > game.enemies[m].size || game.enemies[w] > game.enemies[w].size))
				// 			{
				// 				game.enemies[m].collided = true;
				// 				game.enemies[w].collided = true;

				// 				if (game.enemies[m].collided && game.enemies[w].collided)
				// 				{

				// 					if (game.enemies[m].type == 'base' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[w].direction = game.enemies[w].direction - Math.PI/8;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else if (game.enemies[w].type == 'base' && game.enemies[m].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[m].direction - Math.PI/8;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}								
				// 					else if (game.enemies[m].type == 'miniboss' && game.enemies[w].type !== 'miniboss' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else if (game.enemies[w].type == 'miniboss' && game.enemies[m].type !== 'miniboss' && game.enemies[w].type !== 'base')
				// 					{
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 						// game.enemies[w].speed = game.enemies[m].speed;
				// 						// game.enemies[m].speed = game.enemies[w].speed;
				// 					}
				// 					else {
				// 						game.enemies[m].direction = game.enemies[w].direction - Math.PI/10;
				// 						game.enemies[w].direction += Math.PI/2;
				// 						// game.enemies[m].speed += 5;
				// 						// game.enemies[m].collided = false;
				// 						// game.enemies[w].collided = false;
				// 					}								
				// 				}

				// 				// game.enemies[w].direction = game.enemies[m].direction + Math.PI;
				// 				// game.enemies[w].speed = game.enemies[w].speed/2;
				// 				// console.log ('collision!');
				// 			}
				// 			else if (game.enemies[m].type !== 'base' && game.enemies[w].type !== 'base') {
				// 				game.enemies[m].direction -= utils.randomRange(-0.05, 0.05);
				// 				game.enemies[m].collided = false;
				// 				game.enemies[w].collided = false;
				// 				// game.enemies[w].direction -= utils.randomRange(-0.05, 0.05);
				// 				// game.enemies[m].speed = game.enemies[m].speed;
				// 				// game.enemies[w].speed = game.enemies[w].speed;
				// 			}
				// 			else
				// 			{
				// 				game.enemies[m].collided = false;
				// 				game.enemies[w].collided = false;
				// 			}
				// 			// else if (game.enemies[m].collided && game.enemies[w].collided)
				// 			// {
				// 			// 	if (game.enemies[m].type !== 'base' || game.enemies[w].type !== 'base')
				// 			// 	{
				// 			// 		game.enemies[m].speed = game.enemies[m].speed;
				// 			// 		game.enemies[w].speed = game.enemies[w].speed;
				// 			// 	}
				// 			// 	else if (game.enemies[m].type == 'base')
				// 			// 	{
				// 			// 		game.enemies[w].direction = -game.enemies[w].direction;
				// 			// 		// game.enemies[m].speed = game.enemies[w].speed;
				// 			// 	}
				// 			// 	else if (game.enemies[w].type == 'base')
				// 			// 	{
				// 			// 		game.enemies[m].direction = -game.enemies[m].direction/2;
				// 			// 	}								
				// 			// 	game.enemies[m].collided = false;
				// 			// 	game.enemies[w].collided = false;
				// 			// }
				// 			// else
				// 			// {

				// 			// }
				// 		}
				// 		// }
				// 	}	
				// }

				for (var t in game.enemies){					
					// player-enemy collision
					if (Collision(game.enemies[t], playerShip) && !game.enemies[t].dead && !playerShip.imune && !game.gameOver){			
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
							if (lootchance < 0.3) {
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
				}

				for (var v in game.loot){
					if(game.loot[v].dead || game.loot[v].x > game.width + game.loot[v].size || game.loot[v].x < 0 - game.loot[v].size || game.loot[v].y > game.height + game.loot[v].size || game.loot[v].y < 0 - 30){
						game.loot.splice(v,1);
					}
				}
			}




			///////////////////////////////////
			// Enemy Bullets
			///////////////////////////////////

			if (game.enemyBullets.length >= 1)
			{

				for (var z in game.enemyBullets){
					game.enemyBullets[z].update();
					game.enemyBullets[z].draw();
				}

				for (var d in game.enemyBullets)
				{
					if (Collision(game.enemyBullets[d], playerShip) && !playerShip.imune && !game.gameOver){ //
						// if(game.soundStatus == "ON"){game.enemyexplodeSound.play();}							
									// game.contextEnemies.clearRect(game.playerBullets[p].x, game.playerBullets[p].y, game.playerBullets[p].size, game.playerBullets[p].size*1.8);								
						playerShip.hull -= game.enemyBullets[d].power;
						gameUI.updateEnergy();	
						playerShip.hit = true;	
						// Xplode(playerShip.x, playerShip.y);
						// playerShip.dead = true;
						// 		game.contextPlayer.clearRect(game.player.x, game.player.y, game.player.size, game.player.size);
						// 		Xplode(game.player.x, game.player.y);
								// PlayerDie();
						// 	}
						game.enemyBullets[d].dead = true;
					}
				}

				for (var w in game.enemyBullets){
					if(game.enemyBullets[w].dead || game.enemyBullets[w].x > game.width + game.enemyBullets[w].size || game.enemyBullets[w].x < 0 - game.enemyBullets[w].size || game.enemyBullets[w].y > game.height + game.enemyBullets[w].size || game.enemyBullets[w].y < 0 - 30){
						game.enemyBullets.splice(w,1);
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

					if (game.explosions[p].sprite.currentFrame >= game.explosions[p].sprite.endFrame){
						game.explosions.splice(p,1);
					}
				}
			}

			///////////////////////////////////
			// Game Sounds
			///////////////////////////////////

			// console.log (game.sounds.length);
			
			if (game.sounds.length > 0) {
				for(var s in game.sounds){

					game.sounds[s].play();
					game.sounds[s].addEventListener("paused", game.sounds.splice(s,1));
				}
			}


			///////////////////////////////////
			// D3BUG3R!
			///////////////////////////////////

			// console.log (dt);


			// console.log(fileFormat);

			// console.log ('game font: ' + game.font);
			// console.log ('game tracks length: ' + game.tracks.length);
			// console.log ('game tracks: ' + game.tracks);
			// console.log ('game soundtracks length: ' + game.soundTracks.length);
			// console.log ('game sfx length: ' + game.sfx.length);
			// console.log('reqSfx: ' + game.requiredSfx);

			// console.log ('update w:' + game.width);
			// console.log ('update h:' +game.height);


			// console.log(window.devicePixelRatio);
			// console.log(window.outerHeight);
			// console.log(window.outerWidth);
			// console.log(parseInt(gameArea.css("width")));
										
		}	