function update()
{
	////////////////////////
	// Init
	///////////////////////
	clrCanvas();
	gameBackground.update();

	if(!dtTimerSet)
	{
		getDeltaTime();
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

	/////////////////////////////////////////////////////////////////////
	// Game objects	**!Load in order of appearance (bottom layer = 1st)!**
	/////////////////////////////////////////////////////////////////////

	// enemies on separate loop
	// to optimise complex collision detection
	// (see playerBullet collision)
	var en = game.enemies.length;
	while (en--)
	{
			game.enemies[en].update();
	}

	var obj = game.objects.length;
	while (obj--)
	{
			game.objects[obj].update();
	}

	// playerShip.update();

	///////////////////////////////////
	// Game Sounds
	///////////////////////////////////
	if (game.sounds.length > 0)
	{
		for(var s in game.sounds)
		{
			game.sounds[s].play();
			game.sounds[s].addEventListener("paused", game.sounds.splice(s,1)); //needs recyling!
		}
	}

	///////////////////////////////////
	// D3BUG3R!
	///////////////////////////////////
	// console.log (dt);
	// console.log(fileFormat);
	//
	// console.log ('game width:' + game.width);
	// console.log ('game height:' + game.height);
	//
	// console.log(win.devicePixelRatio);
	// console.log(win.outerHeight);
	// console.log(win.outerWidth);

	///////////////////////////////////
	// GAME ARRAYS
	///////////////////////////////////
	// console.log('keys: '+ game.keys.length);
	// console.log('objects: ' + game.objects.length);
	// console.log('playerBulletsPool: '+ game.playerBulletsPool.length);
	// console.log('playerBulletsPool: '+ game.enemyBulletsPool.length);
  // console.log('bulletsActive: ' + game.bullets.length);
	// console.log('enemies: '+ game.enemies.length);
	// console.log('game.minionsPool: ' + game.minionsPool.length);
	// console.log('game.bossesPool: ' + game.bossesPool.length);
	// console.log('game.explosionsPool: ' + game.explosionsPool.length);
	// console.log('Waves pool: ' + game.wavesPool.length);
	// console.log('Waves active: ' + game.waves.length);
  // console.log('pool: ' + game.lootPool.length);
  // console.log('active: ' + game.bullets.length);
	// console.log('explosions: '+ game.explosions.length);
	// console.log(dtArray.length);
	// console.log(audiopreload);
	// console.log('required soundSfx:' + game.requiredSfx);
	// console.log('sfx: '+ game.sfx.length);
	// console.log('required soundTracks:' + game.requiredSoundTracks);
	// console.log('soundtracks: '+ game.soundTracks.length);
	// console.log('sounds: '+ game.sounds.length);
	// console.log ('game tracks: ' + game.tracks);
	// console.log('tracks: '+ game.tracks.length);
	// console.log('images: '+ game.images.length);
	// console.log('reqImages: ' + game.requiredImages);
	// console.log('doneImages: ' + game.doneImages);

	///////////////////////////////////
	// TOUCH INPUT
	///////////////////////////////////
	// console.log('touchInitX:' + touchInitX);
	// console.log('touchInitY:' + touchInitY);
	// console.log('inputAreaX:' + inputAreaX);
	// console.log('inputAreaY:' + inputAreaY);

	///////////////////////////////////
	// PLAYER MOVEMENT
	///////////////////////////////////
	// console.log ('speedX: ' + playerShip.speedX);
	// console.log ('spriteFrame: ' + playerShip.spriteFrame);
	// console.log ('speedY: ' + playerShip.speedY);
	// console.log ('accel: ' + playerShip.accel);
	// console.log ('speedLimit: ' + playerShip.speedLimit);

	// console.log('playerShip.hull: ' + playerShip.hull);


}
