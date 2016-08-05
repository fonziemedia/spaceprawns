player = function(hull, fireRate)
{
	self = this;
	this.fireRate = fireRate;
	this.hull = hull;
	this.maxHull = hull;
	this.sprite = new sprite('player_ship', 5, 3, 5);
	this.sprite_i = new sprite('player_ship_i', 5, 3, 5);
	this.sprite_s = new sprite('player_shields', 3, 2, 5);
	this.width = this.sprite.frameWidth;
	this.height = this.sprite.frameHeight;
	this.centerX = Math.round(this.width*0.5);
	this.centerRightX = Math.round(this.width*0.75);
	this.centerLeftX = Math.round(this.width*0.25);
	this.centerY = Math.round(this.height*0.5);
	this.tipY = Math.round(this.height*0.2);
	this.limitX1 = Math.round(-this.width*0.5);
	this.limitX2 = Math.round(game.width - this.width*0.5);
	this.limitY1 = 0;
	this.limitY2 = Math.round(game.height - this.height);
};

player.prototype.x = Math.round(game.width*0.46);
player.prototype.y = Math.round(game.height*0.90);
player.prototype.ctx = game.context;
player.prototype.speed = 0;
player.prototype.speedX = 0;
player.prototype.speedY = 0;
player.prototype.spriteLeftFrames = [0,0,1,2,3,4,4,4,4];
player.prototype.spriteRightFrames = [5,5,6,7,8,9,9,9,9];
player.prototype.hit = false;
player.prototype.imune = false;
player.prototype.imuneTimer = -5;
player.prototype.imuneTicks = 0;
player.prototype.deadTimer = 0;
player.prototype.lives = X_Lives;
player.prototype.accel = game.height*0.0007;
player.prototype.speedLimit = Math.round(3*game.dt*game.deltaSpeed);
player.prototype.fireTimer = 1;
player.prototype.laserLevel = 1;
player.prototype.missileLevel = 0;
player.prototype.audioFire1 = 'laser' + fileFormat;
player.prototype.audioFire2 = 'laser2' + fileFormat;
player.prototype.audioFire3 = 'laser3' + fileFormat;

player.prototype.reset = function()
{
	this.lives = game.gameOver ? X_Lives : this.lives;
	game.gameOver = false;
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
	player.prototype.update = player.prototype.aliveUpdate;
};

player.prototype.mouseControls = function()
{
	if (mouseIsDown)
	{
		this.fireGuns();

		this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)*game.deltaSpeed);
		this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)*game.deltaSpeed);

		//this needs to come after movement vars above because we redefine this.speedX here
		this.speedX = this.speedX < this.speedLimit ? this.speedX : this.speedLimit;
		this.speedY = this.speedY < this.speedLimit ? this.speedY : this.speedLimit;
		this.speedX = this.speedX > -this.speedLimit ? this.speedX : -this.speedLimit;
		this.speedY = this.speedY > -this.speedLimit ? this.speedY : -this.speedLimit;
	}
	else
	{
		if (this.speedX !== 0)
		{
			this.speedX = this.speedX > 0 ? Math.floor(this.speedX - this.accel) : Math.ceil(this.speedX + this.accel);		// !Should be decel!*
		}

		if (this.speedY !== 0)
		{
			this.speedY = this.speedY > 0 ? Math.floor(this.speedY - this.accel) : Math.ceil(this.speedY + this.accel);		// !Should be decel!*
		}
	}
};

player.prototype.keyboardControls = function()	// !accel/speedLimit needs tweaking!*
{
	if (game.keys[32])
	{
		this.fireGuns();
	}

	if ((game.keys[37] || game.keys[39] || game.keys[38] || game.keys[40]))
	{
		if(game.keys[37]) //left
		{
			this.speedX = this.speedX < this.speedLimit ? Math.round(this.speedX + this.accel) : Math.round(this.speedLimit);
		}
		if(game.keys[39]) //right
		{
			this.speedX = this.speedX > -this.speedLimit ? Math.round(this.speedX - this.accel) : Math.round(-this.speedLimit);
		}
		if(game.keys[38]) //up
		{
			this.speedY = this.speedY < this.speedLimit ? Math.round(this.speedY + this.accel) : Math.round(this.speedLimit);
		}
		if(game.keys[40]) //down
		{
			this.speedY = this.speedY > -this.speedLimit ? Math.round(this.speedY - this.accel) : Math.round(-this.speedLimit);
		}
	}
	else
	{
		if (this.speedX !== 0)
		{
			this.speedX = this.speedX > 0 ? Math.floor(this.speedX - this.accel) : Math.ceil(this.speedX + this.accel);
		}

		if (this.speedY !== 0)
		{
			this.speedY = this.speedY > 0 ? Math.floor(this.speedY - this.accel) : Math.ceil(this.speedY + this.accel);
		}
	}
};

player.prototype.setControls = game.mouseControls ? player.prototype.mouseControls : player.prototype.keyboardControls;

player.prototype.setThrust = function()
{
	this.x -= this.speedX;
	this.y -= this.speedY;
};

player.prototype.setBoundaries = function()
{
	//the bondaries and edge portals
	if (this.x < this.limitX1)
	{
	 this.x = this.limitX2;
	}
	else if (this.x > this.limitX2)
	{
	 this.x = this.limitX1;
	}
	else if (this.y < this.limitY1)
	{
	 this.y = this.limitY1 - this.speedY;
	}
	else if (this.y > this.limitY2)
	{
	 this.y = this.limitY2 - this.speedY;
	}
};

player.prototype.fireLasers = function(level)
{
	switch (level)
	{
		case 3:
			this.midLaserX = Math.round(this.x + this.centerX);
			this.leftLaserX = Math.round(this.x + this.centerLeftX);
			this.rightLaserX = Math.round(this.x + this.centerRightX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.leftLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.midLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.rightLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			break;
		case 2:
			this.leftLaserX = Math.round(this.x + this.centerLeftX);
			this.rightLaserX = Math.round(this.x + this.centerRightX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.leftLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			getNewBullet(this.rightLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
			break;
		default:
			this.midLaserX = Math.round(this.x + this.centerX);
			this.laserY = Math.round(this.y - this.tipY);
			getNewBullet(this.midLaserX, this.laserY, 4, 1, 1, 'bullet_p_laser');
	}
};

player.prototype.fireMissiles = function(level)
{
	switch (level)
	{
		case 3:
			this.midMissileX = Math.round(this.x + this.centerX);
			this.leftMissileX = Math.round(this.x);
			this.rightMissileX = Math.round(this.x + this.width);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.leftMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.midMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.rightMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		case 2:
			this.leftMissileX = Math.round(this.x);
			this.rightMissileX = Math.round(this.x + this.width);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.leftMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			getNewBullet(this.rightMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		case 1:
			this.midMissileX = Math.round(this.x + this.centerX);
			this.missileY = Math.round(this.y + this.height);
			getNewBullet(this.midMissileX, this.missileY, 1, 2, 1.03, 'bullet_p_missile');
			break;
		default:
	}
};

player.prototype.fireSfx = function()
{
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
};

player.prototype.fireGuns = function()
{
	//only add a bullet if enough time has passed i.e. our timer has reached 0
	this.fireTimer++;

	if (this.fireTimer % this.fireRate === 0)
	{
		this.fireLasers(this.laserLevel);
		this.fireMissiles(this.missileLevel);
		this.fireSfx();
	}
};

player.prototype.setImunity = function()
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
};

player.prototype.checkImunity = function()
{
	if (this.imune)
	{
		this.setImunity();
	}
};

player.prototype.detectCollision = function()
{
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
};

player.prototype.checkHull = function()
{
	if (this.hull <= 0 && !this.imune)
	{
		this.lives -= 1;
		getNewExplosion(this.x-this.width, this.y-this.centerY, 0, 0, 4); //need to obtain player direction if we want dinamic explosions, for now we just blow it still
		player.prototype.update = player.prototype.die;
		gameUI.updateHangar();
		this.imune = true; //avoids collision while dead
	}
};

player.prototype.die = function()
{
	if (this.deadTimer <= 100)
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

player.prototype.levelComplete = function()
{
	game.levelUpTimer++;

	if (game.levelUpTimer < 100) //waiting a few ms before engaging warp speed
	{
		this.setControls();
		this.setThrust();
		this.setBoundaries();
		this.checkImunity();
		this.detectCollision();
		this.checkHull();
	}
	else if (game.levelUpTimer > 100)
	{
		this.spriteFrame = 10;
		this.speedX = 0;
		this.speedY = 0;
		this.speed = Math.round(this.speedLimit*2);
		this.y -= this.speed;
	}
	else // game.levelUpTimer === 100
	{
		game.levelComplete = true;
		gameState.lvlComplete();
		mouseIsDown = 0;
	}
};

player.prototype.getSpriteFrame = function()
{
	if (this.speedX > 0)
	{
		this.spriteFrame = this.spriteLeftFrames[this.speedX];
	}
	else if (this.speedX < 0)
	{
		this.spriteFrame = this.spriteRightFrames[-this.speedX];
	}
	else
	{
		this.spriteFrame = 10;
	}
};

player.prototype.drawShields = function()
{
	this.sprite_s.draw(this.x - this.width*0.7, this.y - this.height*0.1);
};

player.prototype.draw = function()
{
	this.getSpriteFrame();

	if (!this.imune)
	{
		this.sprite.drawFrame(this.x, this.y, this.spriteFrame);
	}
	else if (this.imuneTimer > 0)
	{
		this.sprite_i.drawFrame(this.x, this.y, this.spriteFrame);
	}
};

player.prototype.aliveUpdate = function()
{
	this.setControls();
	this.setThrust();
	this.setBoundaries();
	this.checkImunity();
	this.detectCollision();
	this.checkHull();
	this.draw();
};

player.prototype.levelCompleteUpdate = function()
{
	this.levelComplete();
	this.draw();
};

player.prototype.update = player.prototype.aliveUpdate;

var playerShip = null;
