boss = function(x, y, speed, direction, hull, image)
{

	this.speed = speed;
	this.direction = direction;
	this.hull = hull;
	this.image = game.offCtx[image];
	this.width = game.offCtx[image].width;
	this.height = game.offCtx[image].height;
	this.x = (game.width/2) - (this.width/2);
	this.y = game.outerTop;
	this.hit = false;
	this.audioHit1 = 'hit' + fileFormat;
	this.audioHit2 = 'hit2' + fileFormat;
	this.audioHit3 = 'hit3' + fileFormat;
	this.hitTimer = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.bulletTimer1 = 1;
	this.bulletTimer2 = 1;
	this.bulletDivision1 = 50;
	this.bulletDivision2 = 30;
	this.fireRate = 0; //bullets/sec
	// this.fireRate = fireRate * 60; //bullets/sec
	this.yStop = Math.round(game.height*0.05);
	this.xBondary = Math.round(game.width - this.width/4);
	this.ctx = game.context;
};

boss.prototype.update = function()
{
	if (!this.dead)
	{
		this.vx = Math.cos(this.direction) * ((this.speed/pixelRatio)*dt);
		this.vy = Math.sin(this.direction) * ((this.speed/pixelRatio)*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		this.draw(this.x, this.y);

		if(this.hit && this.hull > 0 ){
			if (game.sound)
				        {
				        	if (game.sfx[this.audioHit1].paused)
				        	{
				        		game.sounds.push(game.sfx[this.audioHit1]);
				        	}
				        	else if (game.sfx[this.audioHit2].paused)
				        	{
				        		game.sounds.push(game.sfx[this.audioHit2]);
				        	}
				        	else if (game.sfx[this.audioHit3].paused)
				        	{
				        		game.sounds.push(game.sfx[this.audioHit3]);
				        	}
				        }
			//change image here
			this.hit = false;
		}

		// player-boss collision
		if (Collision(playerShip, this) && !this.dead && !game.gameOver){
			playerShip.hull -= this.hull;
			playerShip.hit = true;
			this.hit = true;
			this.hull -= playerShip.hull;
		}

		if (this.hull <= 0 ) {
			getNewExplosion(this.x, this.y, this.speed, this.direction, 'xLarge', 'boss');
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;
				gameUI.updateScore();
				game.bossDead = true;
				this.dead = true;
			}
		}


			this.bulletTimer1++;
			this.bulletTimer2++;

			if (this.bulletTimer1 % this.bulletDivision1 == 1){
				this.bulletTimer1 = 1;
				mBulletX1 = Math.round(this.x);
				mBulletX2 = Math.round(this.x + this.width);
				mBulletY = Math.round(this.y + this.height*0.6);

				getNewEnemyBullet(mBulletX1, mBulletY, 50, angleTo(this, playerShip), 1, 'bullet_e_missile');
				getNewEnemyBullet(mBulletX2, mBulletY, 50, angleTo(this, playerShip), 1, 'bullet_e_missile');
			}

			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer2 % this.bulletDivision2 == 1) {
				// if (game.sound){game.shootSound.play();}
				this.bulletTimer2 = 1; //resetting our timer
				lBulletX1 = Math.round(this.x + this.width*0.4);
				lBulletX2 = Math.round(this.x + this.width*0.6);
				lBulletY = Math.round(this.y + this.height);
			    getNewEnemyBullet(lBulletX1, lBulletY, 250, Math.PI/2, 1.5, 'bullet_p_laser');
			    getNewEnemyBullet(lBulletX2, lBulletY, 250, Math.PI/2, 1.5, 'bullet_p_laser');
			}



		if (this.y > this.yStop){
			this.speed = 0;
			if (this.x > 0 && this.x <= this.xBondary) {

				if (this.x < playerShip.x && this.x <= this.xBondary-1){
					this.x += 1;
				}
				else if (this.x > playerShip.x && this.x > 1){
					this.x -= 1;
				}

			}
		}
	}
	else
	{
		//level finished --- taken from update function, needs work, should be triggered in boss dead else function

		//waiting a few secs before engaging warp speed
		game.levelUpTimer++;

		if (game.levelUpTimer == 100)
		{
			game.levelComplete = true;
			gameState.lvlComplete();
			mouseIsDown = 0;
		}
	}
};

boss.prototype.draw = function(x, y)
{
	this.ctx.drawImage(this.image, x, y);
};
