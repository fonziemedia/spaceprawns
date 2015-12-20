		//====================== Main update function =================//		
		function update(){
			//////////////////////// 
			// Init
			///////////////////////		

			// gameBackground.update();
			clrCanvas();
			gameBackground.update();

			if(!dtTimerSet)
			{
				getDeltaTime();
				console.log(dt);
			}	

    		updateGameTime();

			/////////////////////////////////////////////////////////////////////////////////
			// LEVELS
			////////////////////////////////////////////////////////////////////////////////
			/* jshint ignore:start */
			if(game.seconds == Math.round(game.seconds) && win['level'+game.level]['second'+game.seconds])
			{
				win['level'+game.level]['second'+game.seconds]();
			}

			win['level'+game.level].update();
			/* jshint ignore:end */


			///////////////////////////////////
			// Game objects								**!Load in order of appearance (bottom layer 1st)!**
			///////////////////////////////////

			if (game.enemies.length > 0);
			{
				var ew = game.waves.length;
				while (ew--)
				{
				    game.waves[ew].update();
				}

				var en = game.enemies.length;
				while (en--)
				{
				    game.enemies[en].update();
				}
			}

			if (game.bullets.length > 0);
			{	
				var b = game.bullets.length;
				while (b--)
				{
				    game.bullets[b].update();
				}
			}

			playerShip.load(); //change this, it's fugly

			
			if (game.explosions.length > 0);
			{	
				var e = game.explosions.length;
				while (e--)
				{
				    game.explosions[e].update();
				}
			}






			///////////////////////////////////
			// Game Sounds
			///////////////////////////////////

			// console.log (game.sounds.length);
			
			if (game.sounds.length > 0) {
				for(var s in game.sounds){

					game.sounds[s].play();
					// game.sounds[s].addEventListener("paused", game.sounds[s] = null);
					game.sounds[s].addEventListener("paused", game.sounds.splice(s,1));
				}
			}

			///////////////////////////////////
			// D3BUG3R!
			///////////////////////////////////

			// console.log (dt);
			// console.log(fileFormat);

			// console.log ('game tracks: ' + game.tracks);
			// console.log('reqSfx: ' + game.requiredSfx);

			// console.log ('update w:' + game.width);
			// console.log ('update h:' +game.height);


			// console.log(win.devicePixelRatio);
			// console.log(win.outerHeight);
			// console.log(win.outerWidth);

			///////////////////////////////////
			// GAME ARRAYS
			///////////////////////////////////

			// console.log('keys: '+game.keys.length); //the keyboard array
			// console.log('playerBullets: '+game.playerBullets.length); //Our proton torpedoes!
			// console.log('playerBulletsPool: '+game.playerBulletsPool.length); //Our proton torpedoes!
			// console.log('enemyBullets: '+game.enemyBullets.length); //Enemy missiles!
			// console.log('enemies: '+game.enemies.length); //The InVaDeRs
			// console.log('waves: '+game.waves.length);
			// console.log('loot: '+game.loot.length);
			// console.log('explosions: '+game.explosions.length);
			// console.log(dtArray.length);
			// console.log('sfx: '+game.sfx.length);
			// console.log('soundtracks: '+game.soundTracks.length);
			// console.log('sounds: '+game.sounds.length);
			// console.log('tracks: '+game.tracks.length);
			// console.log('images: '+game.images.length);
										
		}	