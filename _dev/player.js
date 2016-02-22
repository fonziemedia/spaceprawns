player = function(hull, fireRate)
{
	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.ctx = game.context;
	this.sprite = new sprite('player_ship', 5, 3, 5);
	this.sprite_i = new sprite('player_ship_i', 5, 3, 5);
	this.sprite_s = new sprite('player_shields', 3, 2, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.centerX = Math.round(this.width*0.5);
	this.centerRightX = Math.round(this.width*0.75);
	this.centerLeftX = Math.round(this.width*0.25);
	this.tipY = Math.round(this.height*0.2);
	this.speed = 0;
	this.speedX = 0;
	this.speedY = 0;
	this.hull = hull;
	this.maxHull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.audioFire1 = 'laser' + fileFormat;
	this.audioFire2 = 'laser2' + fileFormat;
	this.audioFire3 = 'laser3' + fileFormat;
	this.xMoving = false;
	this.yMoving = false;
	this.hit = false;
	this.imune = false;
	this.imuneTimer = -5;
	this.imuneTicks = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.lives = X_Lives;
	this.limitX1 = Math.round(-this.width*0.5);
	this.limitX2 = Math.round(game.width - this.width*0.5);
	this.limitY1 = 0;
	this.limitY2 = Math.round(game.height - this.height);
	this.accel = game.height*0.0007;
	this.speedLimit = Math.round(game.height*0.008);

	//====================== Laser bullets =================//
	this.fireTimer = 1;
	this.fireRate = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
};

player.prototype.fireGuns = function()
{
	//only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
	this.fireTimer++;
	if (this.fireTimer % this.fireRate === 0)
	{
		// (x, y, speed, direction, power, friction, image)
		switch(this.laserLevel)
		{
			case 1:
				this.midLaserX = Math.round(this.x + this.centerX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.midLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
			case 2:
				this.leftLaserX = Math.round(this.x + this.centerLeftX);
				this.rightLaserX = Math.round(this.x + this.centerRightX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.leftLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.rightLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
			case 3:
				this.midLaserX = Math.round(this.x + this.centerX);
				this.leftLaserX = Math.round(this.x + this.centerLeftX);
				this.rightLaserX = Math.round(this.x + this.centerRightX);
				this.laserY = Math.round(this.y - this.tipY);

				getNewBullet(this.leftLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.midLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');
				getNewBullet(this.rightLaserX, this.laserY, 600, -Math.PI/2, 1, 1, 'bullet_p_laser');

				if (game.sound)
				{
					if (game.sfx[this.audioFire1].paused)
					{
						game.sounds.push(game.sfx[this.audioFire1]);
					}
					else if (game.sfx[this.audioFire2].paused)
					{
						game.sounds.push(game.sfx[this.audioFire2]);
					}
					else if (game.sfx[this.audioFire3].paused)
					{
						game.sounds.push(game.sfx[this.audioFire3]);
					}
				}
			break;
		}
		switch(this.missileLevel)
		{
			case 0:
			break;
			case 1:
				this.midMissileX = Math.round(this.x + this.centerX);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 2:
				this.leftMissileX = Math.round(this.x);
				this.rightMissileX = Math.round(this.x + this.width);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 3:
				this.midMissileX = Math.round(this.x + this.centerX);
				this.leftMissileX = Math.round(this.x);
				this.rightMissileX = Math.round(this.x + this.width);
				this.missileY = Math.round(this.y + this.height);
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
		}
	}
};

player.prototype.update = function()
{
	//////////////////////////////
	//	Mouse and Touch controls
	/////////////////////////////
	if (!this.dead)
	{
		if (mouseIsDown && !game.levelComplete)
		{
			if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'none';

			this.fireGuns();

			this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)/pixelRatio);
			this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)/pixelRatio);

			//this needs to come after movement vars above because we redefine this.speedX here
			this.speedX = this.speedX < this.speedLimit ? this.speedX : this.speedLimit;
			this.speedY = this.speedY < this.speedLimit ? this.speedY : this.speedLimit;
			this.speedX = this.speedX > -this.speedLimit ? this.speedX : -this.speedLimit;
			this.speedY = this.speedY > -this.speedLimit ? this.speedY : -this.speedLimit;
		}
		else if (!game.isMobile && (game.keys[37] || game.keys[39] || game.keys[38] || game.keys[40]) && !game.levelComplete)
		{
			if(game.keys[37]) //left
			{
				this.speedX = this.speedX < this.speedLimit ? this.speedX + this.accel : this.speedLimit;
			}
			if(game.keys[39]) //right
			{
				this.speedX = this.speedX > -this.speedLimit ? this.speedX - this.accel : -this.speedLimit;
			}
			if(game.keys[38]) //up
			{
				this.speedY = this.speedY < this.speedLimit ? this.speedY + this.accel : this.speedLimit;
			}
			if(game.keys[40]) //down
			{
				this.speedY = this.speedY > -this.speedLimit ? this.speedY - this.accel : -this.speedLimit;
			}
		}
		else if(!game.levelComplete)
		{
			if (this.speedX !== 0)
			{
				this.speedX = this.speedX > 0 ? Math.round(this.speedX - this.accel) : Math.round(this.speedX + this.accel);
			}

			if (this.speedY !== 0)
			{
				this.speedY = this.speedY > 0 ? Math.round(this.speedY - this.accel) : Math.round(this.speedY + this.accel);
			}

			if (!game.isMobile) doc.getElementById('gamearea').style.cursor = 'crosshair';
		}
		else
		{
			this.spriteFrame = 10;
			this.speedX = 0;
			this.speedY = 0;
			this.speed = Math.round(this.speedLimit*2);
			this.y -= this.speed;
		}

		if (!game.isMobile && game.keys[32])
		{
			this.fireGuns();
		}

		this.xMoving = this.speedX !== 0 ? true : false;
		this.yMoving = this.speedY !== 0 ? true : false;

		if (this.xMoving || this.yMoving)
		{
			//thrust
			this.x = this.x - this.speedX;
			this.y = this.y - this.speedY;

			//the bondaries and edge portals
			if (this.x < this.limitX1)
			{
			 this.x = this.limitX2;
			}
			else if (this.x > this.limitX2)
			{
			 this.x = this.limitX1;
			}
			else if (this.y < this.limitY1 && !game.levelComplete)
			{
			 this.y = this.limitY1 - this.speedY;
			}
			else if (this.y > this.limitY2)
			{
			 this.y = this.limitY2 - this.speedY;
			}

			if (this.xMoving)
			{
				//defining different speeds for different sprites
				this.spriteFrame = (this.speedX < -this.accel && this.speedX >= -this.accel*4) ? 5 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*4 && this.speedX >= -this.accel*6) ? 6 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*6 && this.speedX >= -this.accel*8) ? 7 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*8 && this.speedX >= -this.accel*10) ? 8 : this.spriteFrame;
				this.spriteFrame = (this.speedX < -this.accel*10) ? 9 : this.spriteFrame;

				this.spriteFrame = (this.speedX > 2 && this.speedX >= this.accel*4) ? 0 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*4 && this.speedX >= this.accel*6) ? 1 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*6 && this.speedX >= this.accel*8) ? 2 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*8 && this.speedX >= this.accel*10) ? 3 : this.spriteFrame;
				this.spriteFrame = (this.speedX > this.accel*10) ? 4 : this.spriteFrame;

				// log('speedLimit', this.speedLimit);
				// log('speedX', this.speedX);
				// log('speedY', this.speedX);
				// log('accel', this.accel);
				// log('accel*2', this.accel*2);
				// log('accel*4', this.accel*4);
				// log('accel*6', this.accel*6);
				// log('accel*8', this.accel*8);
				// log('accel*10', this.accel*10);
				// log('this.spriteFrame', this.spriteFrame);
			}
		}
		else
		{
			this.spriteFrame = 10;
		}

		this.draw();

		if (this.imune)
		{
			this.imuneTimer++;

			if (this.imuneTimer > 15)
			{
				this.imuneTicks++;
				this.imuneTimer = -5;
			}

			if (this.imuneTicks > 8)
			{
				this.imune = false;
				this.imuneTicks = 0;
			}
		}

		if (this.hit)
		{
			if (this.sprite_s.currentFrame < 1) vibrateDevice(30);

			this.drawShields();

			if (this.sprite_s.currentFrame >= this.sprite_s.endFrame)
			{
				this.hit = false;
				this.sprite_s.counter = 0;
				this.sprite_s.currentFrame = 0;
			}
		}

		if (this.hull <= 0 && !this.dead)
		{
			this.dead = true;
			this.lives -= 1;
			getNewExplosion(this.x, this.y, 0, 0, 'large', 'player'); //need to obtain player direction if we want dinamic explosions, for now we just blow it still
			gameUI.updateHangar();
		}
	}
	else if (this.deadTimer <= 100)
	{
		//keeping the player outside canvas while dead
		this.x = game.centerX;
		this.y = game.outerBottom;

		//waiting a few ms before any action
		this.deadTimer++;

		if (this.deadTimer > 100 && this.lives > 0)
		{
			this.reset();
		}
		else if (this.deadTimer > 100 && this.lives === 0 && !game.gameOver)
		{
			mouseIsDown = 0;
			game.keys[13] = false;
			this.deadTimer = 0;
			game.gameOver = true;
			gameState.gameOver();
		}
	}
};

player.prototype.drawShields = function()
{
	this.sprite_s.draw(this.x - this.width*0.7, this.y - this.height*0.1);
};

player.prototype.draw = function()
{
	if (!this.imune)
	{
		this.sprite.drawFrame(this.x, this.y, this.spriteFrame);
	}
	else if (this.imuneTimer > 0)
	{
		this.sprite_i.drawFrame(this.x, this.y, this.spriteFrame);
	}
};

player.prototype.reset = function()
{
	this.lives = game.gameOver ? X_Lives : this.lives;
	game.gameOver = false;
	this.dead = false;
	this.imune = true;
	this.imuneTimer = -5;
	this.hull = 10;
	this.deadTimer = 0;
	this.speed = 0;
	this.hit = false;
	this.spriteFrame = 10;
	this.x = Math.round(game.centerX - this.centerX);
	this.y = Math.round(game.height - this.height);
	this.friction = 0;
	this.laserLevel = 1;
	this.missileLevel = 0;
	gameUI.updateEnergy();
};

var playerShip = null;
