		//====================== Main update function =================//		
		function update(){
			game.timer++;
			game.seconds = game.timer/60 || 0;

			console.log(game.seconds);	

			//////////////////////// 
			// Init
			///////////////////////
			
			gameUI.update();					
			playerShip.update();
			game.contextPlayer.clearRect(0, 0, game.width, game.height); //clear trails
			playerShip.draw();


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



			//////////////////////// 
			// Enemies
			// enemy(x, y, speed, direction, hull, image)
			///////////////////////	

			if (game.seconds > 1) {
			    sectoidWave.update();
			}
			if (game.seconds > 5) {
			    sectoidWave2.update();				
			}
			if (game.seconds == 18) {
			    game.enemyBases.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 1000, 22));
				game.enemyBases[0].size = 170*dtSize;	
			}
			if (game.seconds > 20) {
			    sectoidWave3.update();
			}
			if (game.seconds == 30) {
			    game.enemyBases.push(new enemy(game.width * 0.3, -game.height*0.1, 155, Math.PI/2, 1000, 23));
				game.enemyBases[0].size = 170*dtSize;	
			}
			if (game.seconds > 40) {
			    sectoidWave5.update();
			}
			if (game.seconds > 50) {
			    sectoidWave6.update();
			}

			if (game.seconds > 90) {
			    sectoidWave3.update();
			}




			if(game.enemyBases.length > 0){
				for (var c in game.enemyBases){

					//projectiles collision
					for(var f in playerShip.bullets){
						if (Collision(game.enemyBases[c], playerShip.bullets[f]) && !game.enemyBases[c].dead){ //dead check avoids ghost scoring														
							game.enemyBases[c].hit = true;							
							game.enemyBases[c].hull -= playerShip.bullets[f].power;							
							// game.contextEnemies.clearRect(playerShip.bullets[f].x, playerShip.bullets[f].y, playerShip.bullets[f].size, playerShip.bullets[f].size*1.8);								
							playerShip.bullets[f].dead = true;
							playerShip.bullets.splice(f,1);
						}
					}

					game.enemyBases[c].update();
					game.enemyBases[c].draw();			


					if(game.enemyBases[c].dead || game.enemyBases[c].y > game.height + game.enemyBases[c].size ||  game.enemyBases[c].x < -game.width*0.3 ||  game.enemyBases[c].x > game.width*1.3){					
						if(game.enemyBases[c].dead){
							game.contextEnemies.clearRect(game.enemyBases[c].x, game.enemyBases[c].y, game.enemyBases[c].size, game.enemyBases[c].size);
							lootchance = Math.random();
							if (lootchance < 0.05) {
								this.loot.push(new loot(game.enemyBases[c].x, game.enemyBases[c].y));					
							}
						}	

						game.enemyBases.splice(c,1);				
					}

				}
			} 


			///////////////////////////////////
			// Collisions & Garbage collection
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
		}	