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
	this.speed = 0;
	this.maxSpeed = 400;
	this.speedX = 0;
	this.speedY = 0;
	this.hull = hull;
	this.maxHull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.audioFire1 = 'laser' + fileFormat;
	this.audioFire2 = 'laser2' + fileFormat;
	this.audioFire3 = 'laser3' + fileFormat;
	this.rendered = false;
	this.hit = false;
	this.imune = false;
	this.imuneTimer = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.lives = X_Lives;
	this.limitX1 = Math.round(-this.width*0.5);
	this.limitX2 = Math.round(game.width - this.width*0.5);
	this.limitY1 = Math.round(-this.height*0.5);
	this.limitY2 = Math.round(game.height - this.height*0.5);
	this.movement = Math.round(game.height*0.007);

	//====================== Laser bullets =================//
	this.fireTimer = 1;
	this.fireRate = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;

	this.midLaserX = Math.round(this.x + this.width*0.5);
	this.leftlaserX = Math.round(this.x + this.width*0.25);
	this.rightlaserX = Math.round(this.x + this.width*0.75);
	this.LaserY = Math.round(this.y - this.height*0.2);
};

player.prototype.fireGuns = function()
{
	this.midLaserX = Math.round(this.x + this.width*0.5);
	this.leftLaserX = Math.round(this.x + this.width*0.25);
	this.rightLaserX = Math.round(this.x + this.width*0.75);
	this.laserY = Math.round(this.y - this.height*0.2);

	this.midMissileX = Math.round(this.x + this.width*0.5);
	this.leftMissileX = this.x;
	this.rightMissileX = this.x + this.width;
	this.missileY = this.y + this.height;
	//only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
	this.fireTimer++;
	if (this.fireTimer % this.fireRate === 0)
	{
		// (x, y, speed, direction, power, friction, image)
		switch(this.laserLevel)
		{
			case 1:
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
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 2:
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
			case 3:
				getNewBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
				getNewBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 2, 1.03, 'bullet_p_missile');
			break;
		}
	}
};

player.prototype.update = function()
{
	this.speed = 0; // !! check if you can optimise this !!
	this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)/pixelRatio);
	this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)/pixelRatio);

	//////////////////////////////
	//	Mouse and Touch controls
	/////////////////////////////
	if (mouseIsDown && !game.levelComplete && !game.paused && !game.gameOver)
	{
		//removing cursor
		if (!game.isMobile) {doc.getElementById('gamearea').style.cursor = 'none';}

		//defining the boundaries
		moveRight1 = (this.speedX < -2 && this.speedX >= -4) ? true : false;
		moveRight2 = (this.speedX < -4 && this.speedX >= -6) ? true : false;
		moveRight3 = (this.speedX < -6 && this.speedX >= -8) ? true : false;
		moveRight4 = (this.speedX < -8 && this.speedX >= -10) ? true : false;
		moveRight5 = (this.speedX < -10) ? true : false;

		moveLeft1 = (this.speedX > 2 && this.speedX <= 4) ? true : false;
		moveLeft2 = (this.speedX > 4 && this.speedX <= 6) ? true : false;
		moveLeft3 = (this.speedX > 6 && this.speedX <= 8) ? true : false;
		moveLeft4 = (this.speedX > 8 && this.speedX <= 10) ? true : false;
		moveLeft5 = (this.speedX > 10) ? true : false;

		// A MAIN CONTROLS
		//this needs to come after movement vars above because we redefine this.speedX here
		this.speedX = this.speedX < this.movement ? this.speedX : this.movement;
		this.speedY = this.speedY < this.movement ? this.speedY : this.movement;
		this.speedX = this.speedX > -this.movement ? this.speedX : -this.movement;
		this.speedY = this.speedY > -this.movement ? this.speedY : -this.movement;

		if (this.speedX !== 0 || this.speedY !== 0)
		{
			//the bondaries and edge portals
			if (this.x >= this.limitX1 && this.x <= this.limitX2 && this.y >= this.limitY1 && this.y <= this.limitY2)
			{
			this.x = this.x - this.speedX;
			this.y = this.y - this.speedY;
			}
			else if(this.x < this.limitX1)
			{
			 this.x = this.limitX2;
			}
			else if(this.x > this.limitX2)
			{
			 this.x = this.limitX1;
			}
			else if(this.y < this.limitY1)
			{
			 this.y = this.limitY2;
			}
			else if(this.y > this.limitY2)
			{
			 this.y = this.limitY1;
			}
		}

		this.speedX = 0;
		this.speedY = 0; //not needed but..

		if (moveRight1)
		{
			this.spriteFrame = 5;
		}
		else if (moveRight2)
		{
			this.spriteFrame = 6;
		}
		else if (moveRight3)
		{
			this.spriteFrame = 7;
		}
		else if (moveRight4)
		{
			this.spriteFrame = 8;
		}
		else if (moveRight5)
		{
			this.spriteFrame = 9;
		}
		else if (moveLeft1)
		{
			this.spriteFrame = 0;
		}
		else if (moveLeft2)
		{
			this.spriteFrame = 1;
		}
		else if (moveLeft3)
		{
			this.spriteFrame = 2;
		}
		else if (moveLeft4)
		{
			this.spriteFrame = 3;
		}
		else if (moveLeft5)
		{
			this.spriteFrame = 4;
		}
		this.rendered = false;
	}
	else
	{
		this.spriteFrame = 10;
		doc.getElementById('gamearea').style.cursor = 'crosshair';
	}

	/////////////////////////
	//	Keyboard controlls
	////////////////////////
	if(!game.isMobile)
	{
		//left
		if(game.keys[37] || game.keys[65] && !game.gameOver)
		{
			//if key pressed..
			if(this.x > 0)
			{ // (keeping it within the boundaries of our canvas)
				this.speed = this.maxSpeed;
				this.image = this.offCanvasL5;
				this.rendered = false;
				this.x -= Math.round(this.speed*dt);
			}
		}
		//right
		if(game.keys[39] || game.keys[68] && !game.gameOver)
		{
			if(this.x <= game.width - this.width)
			{
				this.speed = this.maxSpeed;
				this.image = this.offCanvasR5;
				this.rendered = false;
				this.x += Math.round(this.speed*dt);
			}
		}
		//up
		if((game.keys[38] || game.keys[87]) && !game.gameOver)
		{
			if(this.y > 0)
			{
				this.speed = this.maxSpeed;
				this.rendered = false;
				this.y -= Math.round(this.speed*dt);
			}
		}
		//down
		if(game.keys[40] || game.keys[83] && !game.gameOver)
		{
			if(this.y <= game.height - this.height)
			{
				this.speed = this.maxSpeed;
				this.rendered = false;
				this.y += Math.round(this.speed*dt);
			}
		}
	}

	if(game.levelComplete)
	{
		this.speed = this.maxSpeed*2;
		this.rendered = false;
		this.y -= Math.round(this.speed*dt);
	}

	if((game.keys[32] || mouseIsDown) && !this.dead && !game.gameOver)
	{
		this.fireGuns();
	}

	///////////////////////////////////
	//	DEATH MANAGEMENT
	///////////////////////////////////
	if (this.hull <= 0 && !this.dead)
	{
		this.dead = true;
		this.lives -= 1;
		getNewExplosion(this.x, this.y, 0, 0, 'large', 'player'); //need to obtain player direction if we want dinamic explosions, for now we just blow it still
		gameUI.updateHangar();
	}

	if (this.dead && this.deadTimer <= 100)
	{
		//waiting a few secs before any action
		this.deadTimer++;

		if (this.deadTimer > 100 && this.lives > 0)
		{
			mouseIsDown = 0;
			this.hull = 10;
			this.dead = false;
			this.x = Math.round(game.width*0.46);
			this.y = Math.round(game.height*0.90);
			this.image = this.offCanvas;
			this.rendered = false;
			this.hit = false;
			this.friction = 0;
			this.laserLevel = 1;
			this.missileLevel = 0;
			gameUI.updateEnergy();
			this.deadTimer = 0;
			this.imune = true;
			this.imuneTimer = 0;
		}
		else if (this.deadTimer > 100 && this.lives === 0 && !game.gameOver)
		{
			mouseIsDown = 0;
			game.keys[13] = false;
			this.deadTimer = 0;
			game.gameOver = true;
			gameState.gameOver();
		}
		else
		{
			this.x = Math.round(game.width*0.5); //keeping the player outside canvas while dead
			this.y = Math.round(game.height*1.5);
		}
	}

	if (this.imune)
	{
		this.imuneTimer++;
		if (this.imuneTimer > 250)
		{
			this.imune = false;
			this.imuneTimer = 0;
		}
	}
};

player.prototype.draw = function()
{
	if(!this.dead)
	{
		if (!this.imune)
		{
			this.sprite.drawFrame(this.x, this.y, this.spriteFrame);
		}
		else
		{
			if (this.imuneTimer >= 0 && this.imuneTimer < 15  || this.imuneTimer >= 20 && this.imuneTimer < 35 ||this.imuneTimer >= 40 && this.imuneTimer < 55 || this.imuneTimer >= 70 && this.imuneTimer < 75 || this.imuneTimer >= 90 && this.imuneTimer < 95 || this.imuneTimer >= 110 && this.imuneTimer < 115 || this.imuneTimer >= 130 && this.imuneTimer < 135 || this.imuneTimer >= 150 && this.imuneTimer < 155 || this.imuneTimer >= 160 && this.imuneTimer < 175 || this.imuneTimer > 180)
			{
				this.sprite_i.drawFrame(this.x, this.y, this.spriteFrame);
			}
		}

		if (this.hit && !this.imune)
		{
			if (this.sprite_s.currentFrame < 1) vibrateDevice(30);

			this.sprite_s.draw(this.x - this.width*0.7, this.y - this.height*0.1);
			if (this.sprite_s.currentFrame >= this.sprite_s.endFrame)
			{
				this.hit = false;
				this.sprite_s.counter = 0;
				this.sprite_s.currentFrame = 0;
			}
		}
	}
};

player.prototype.load = function()
{
	this.update();
	this.draw();
};

player.prototype.reset = function()
{
	game.gameOver = false;
	this.dead = false;
	this.deadTimer = 0;
	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.spriteFrame = 10;
	this.hull = 10;
	this.rendered = false;
	this.hit = false;
	this.friction = 0;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
};

var playerShip = null;
