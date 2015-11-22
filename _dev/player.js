function player(hull, fireRate) {
	// particle.call(this);

	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.speed = 0;
	this.maxSpeed = 400;
	
	this.size = Math.round(100/pixelRatio);
	this.hull = hull;
	this.maxHull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.imageO = game.images['fighter.png'];
	this.imageL1 = game.images['fighter_left1.png'];
	this.imageL2 = game.images['fighter_left2.png'];
	this.imageL3 = game.images['fighter_left3.png'];
	this.imageL4 = game.images['fighter_left4.png'];
	this.imageL5 = game.images['fighter_left5.png'];
	this.imageR1 = game.images['fighter_right1.png'];
	this.imageR2 = game.images['fighter_right2.png'];
	this.imageR3 = game.images['fighter_right3.png'];
	this.imageR4 = game.images['fighter_right4.png'];
	this.imageR5 = game.images['fighter_right5.png'];
	this.audioFire1 = 'laser' + fileFormat;
	this.audioFire2 = 'laser2' + fileFormat;
	this.audioFire3 = 'laser3' + fileFormat;
	this.rendered = false;
	this.hit = false;
	this.hitTimer = 0;
	this.imune = false;
	this.imuneTimer = 0;
	this.dead = false;
	this.deadTimer = 0;
	this.bulletTimer = 1;
	this.bulletDivision = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
	this.ctx = game.contextPlayer;
	this.speedX = 0;
	this.speedY = 0;
	this.limitX1 = Math.round(-this.size*0.5);
	this.limitX2 = Math.round(game.width - this.size*0.5);
	this.limitY1 = Math.round(-this.size*0.5);
	this.limitY2 = Math.round(game.height - this.size*0.5);
	this.movement = Math.round(game.height*0.007);
	this.canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;	
	if (this.canVibrate && !("vibrate" in navigator)){navigator.vibrate = navigator.mozVibrate;}	

	//====================== Caching Off-Screen canvas =================//
	this.offCanvas = document.createElement('canvas');
	this.offCanvas.width = this.size;
	this.offCanvas.height = this.size;
	this.offCtx = this.offCanvas.getContext('2d');

	this.offCtx.drawImage(this.imageO, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.image = this.offCanvas;
	this.playerImage = this.image;

	this.offCanvasL1 = document.createElement('canvas');
	this.offCanvasL1.width = this.size;
	this.offCanvasL1.height = this.size;
	this.offCtxL1 = this.offCanvasL1.getContext('2d');

	this.offCtxL1.drawImage(this.imageL1, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasL2 = document.createElement('canvas');
	this.offCanvasL2.width = this.size;
	this.offCanvasL2.height = this.size;
	this.offCtxL2 = this.offCanvasL2.getContext('2d');

	this.offCtxL2.drawImage(this.imageL2, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasL3 = document.createElement('canvas');
	this.offCanvasL3.width = this.size;
	this.offCanvasL3.height = this.size;
	this.offCtxL3 = this.offCanvasL3.getContext('2d');

	this.offCtxL3.drawImage(this.imageL3, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasL4 = document.createElement('canvas');
	this.offCanvasL4.width = this.size;
	this.offCanvasL4.height = this.size;
	this.offCtxL4 = this.offCanvasL4.getContext('2d');

	this.offCtxL4.drawImage(this.imageL4, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasL5 = document.createElement('canvas');
	this.offCanvasL5.width = this.size;
	this.offCanvasL5.height = this.size;
	this.offCtxL5 = this.offCanvasL5.getContext('2d');

	this.offCtxL5.drawImage(this.imageL5, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasR1 = document.createElement('canvas');
	this.offCanvasR1.width = this.size;
	this.offCanvasR1.height = this.size;
	this.offCtxR1 = this.offCanvasR1.getContext('2d');

	this.offCtxR1.drawImage(this.imageR1, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasR2 = document.createElement('canvas');
	this.offCanvasR2.width = this.size;
	this.offCanvasR2.height = this.size;
	this.offCtxR2 = this.offCanvasR2.getContext('2d');

	this.offCtxR2.drawImage(this.imageR2, 0, 0, this.offCanvas.width, this.offCanvas.height);
	
	this.offCanvasR3 = document.createElement('canvas');
	this.offCanvasR3.width = this.size;
	this.offCanvasR3.height = this.size;
	this.offCtxR3 = this.offCanvasR3.getContext('2d');

	this.offCtxR3.drawImage(this.imageR3, 0, 0, this.offCanvas.width, this.offCanvas.height);

	this.offCanvasR4 = document.createElement('canvas');
	this.offCanvasR4.width = this.size;
	this.offCanvasR4.height = this.size;
	this.offCtxR4 = this.offCanvasR4.getContext('2d');

	this.offCtxR4.drawImage(this.imageR4, 0, 0, this.offCanvas.width, this.offCanvas.height);
	
	this.offCanvasR5 = document.createElement('canvas');
	this.offCanvasR5.width = this.size;
	this.offCanvasR5.height = this.size;
	this.offCtxR5 = this.offCanvasR5.getContext('2d');

	this.offCtxR5.drawImage(this.imageR5, 0, 0, this.offCanvas.width, this.offCanvas.height);


	this.update = function() {		
		// this.vx = Math.cos(this.direction) * (this.speed*dt);
		// this.vy = Math.sin(this.direction) * (this.speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		// this.x += this.vx;
		// this.y += this.vy;
		this.speed = 0; // !! check if you can optimise this !!
		this.playerImage = this.image; // !! check if you can optimise this !!
		this.speedX = Math.round(((touchInitX - inputAreaX)*0.1)/pixelRatio);
		this.speedY = Math.round(((touchInitY - inputAreaY)*0.1)/pixelRatio);		
		
		//////////////////////////////
		//	Mouse and Touch controls
		/////////////////////////////

		if (mouseIsDown && !game.levelComplete && !game.paused && !game.gameOver) {

			//removing cursor
			if (!game.isMobile) {document.getElementById('gamearea').style.cursor = 'none';}


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
				
				//making it move to touch or click point
				// if (inputAreaX != moveX || inputAreaY != moveY) {
					//the distance between the current ship pos and the user touch/click pos
					
					
					// console.log('inputAreax:'+ inputAreaX);
					// console.log('inputAreay:'+ inputAreaY);				
					// console.log('touchx:'+ touchInitX);
					// console.log('touchy:'+ touchInitY);
					// console.log (this.speedX);
					// console.log (this.speedY);
					// console.log (dtSize);

					// A MAIN CONTROLS


					// console.log('movement:' + this.movement);
					
					//this needs to come after movement vars above because he redefine this.speedX here
					this.speedX = this.speedX < this.movement ? this.speedX : this.movement;					
					this.speedY = this.speedY < this.movement ? this.speedY : this.movement;
					this.speedX = this.speedX > -this.movement ? this.speedX : -this.movement;					
					this.speedY = this.speedY > -this.movement ? this.speedY : -this.movement;

					// console.log('touchInitX:'+ touchInitX);
					// console.log('touchInitY:'+ touchInitY);
					// console.log('inputAreaX:'+ inputAreaX);
					// console.log('inputAreaY:'+ inputAreaY);					
					// console.log('this.speedX:'+ this.speedX);
					// console.log('this.speedY:'+ this.speedY);	
					
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
					
					// B ALTERNATIVE CONTROLS 
					// this.speedX = (touchInitX - canvasX);
					// this.speedY = (touchInitY - canvasY);
					
					
					// this.x = this.x - this.speedX;
					// this.y = this.y - this.speedY;					


					// touchInitX = canvasX;
					// touchInitY = canvasY;


			

				
				if (moveRight1) {
					this.image = this.offCanvasR1;
				} else if (moveRight2) {
					this.image = this.offCanvasR2;
				} else if (moveRight3) {
					this.image = this.offCanvasR3;
				} else if (moveRight4) {
					this.image = this.offCanvasR4;
				} else if (moveRight5) {
					this.image = this.offCanvasR5;

				} else if (moveLeft1) {
					this.image = this.offCanvasL1;
				} else if (moveLeft2) {
					this.image = this.offCanvasL2;
				} else if (moveLeft3) {
					this.image = this.offCanvasL3;
				} else if (moveLeft4) {
					this.image = this.offCanvasL4;
				} else if (moveLeft5) {
					this.image = this.offCanvasL5;
				}

				this.rendered = false;		

		}
		else
		{
			this.image = this.offCanvas;	
			document.getElementById('gamearea').style.cursor = 'crosshair';
		}

		/////////////////////////
		//	Keyboard controlls
		////////////////////////

		if(!game.isMobile)
		{
			//left
			if(game.keys[37] || game.keys[65] && !game.gameOver){ //if key pressed..				
				if(this.x > 0){ // (keeping it within the boundaries of our canvas)				
					this.speed = this.maxSpeed;							
					this.image = this.offCanvasL5;
					this.rendered = false;
					this.x -= Math.round(this.speed*dt);
				}
			}
			//right
			if(game.keys[39] || game.keys[68] && !game.gameOver){
				if(this.x <= game.width - this.size){				
					this.speed = this.maxSpeed;
					this.image = this.offCanvasR5;
					this.rendered = false;
					this.x += Math.round(this.speed*dt);
				}
			}
			//up
			if((game.keys[38] || game.keys[87]) && !game.gameOver){
				if(this.y > 0){				
					this.speed = this.maxSpeed;					
					this.rendered = false;
					this.y -= Math.round(this.speed*dt);
				}
			}
			//down
			if(game.keys[40] || game.keys[83] && !game.gameOver){
				if(this.y <= game.height - this.size){				
					this.speed = this.maxSpeed;					
					this.rendered = false;
					this.y += Math.round(this.speed*dt);
				}	
			}
		}

		
		if(game.levelComplete){			
			this.speed = this.maxSpeed*2;			
			this.rendered = false;
			this.y -= Math.round(this.speed*dt);
		}


		/////////////////////////
		//	Guns
		////////////////////////

		this.midLaserX = Math.round(this.x + this.size*0.5);
		this.leftlaserX = Math.round(this.x + this.size*0.25);
		this.rightlaserX = Math.round(this.x + this.size*0.75);
		this.LaserY = Math.round(this.y - this.size*0.2);

		this.midMissileX = Math.round(this.x + this.size*0.5);
		this.leftMissileX = this.x;
		this.rightMissileX = this.x + this.size;
		this.missileY = this.y + this.size;


		if((game.keys[32] || mouseIsDown) && !this.dead && !game.gameOver){ //only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
			this.bulletTimer++;
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer % this.bulletDivision === 0) {
				// (x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame)
				switch(this.laserLevel) {
				    case 1:
				        game.playerBullets.push( new playerBullet(this.midLaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
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
				    	game.playerBullets.push( new playerBullet(this.leftlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.rightlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));				
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
				    default:
				        game.playerBullets.push( new playerBullet(this.leftlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.midLaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.rightlaserX, this.LaserY, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
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

				 switch(this.missileLevel) {
				 	case 0:
				 		break;
				    case 1:
				        game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'p_missile.png', 64, 2));
						break;										
				 }				
				// this.bulletTimer = 1; //resetting our timer
			}
		}
		else {
			this.bulletTimer = 1;
		}


		///////////////////////////////////
		//	DEATH MANAGEMENT
		///////////////////////////////////

		if (this.hull <= 0 && !this.dead)
		{
			this.dead = true;			
			this.lives -= 1;
			game.explosions.push(new explosion(this.x, this.y, 0, 0, this.size, 'player')); //need to obtain player direction if we want dinamic explosions, for now we just blow it still			
			gameUI.updateHangar();
		}	


		if (this.dead && this.deadTimer <= 100) 
		{
			//waiting a few secs before any action
			this.deadTimer++; 

			if (this.deadTimer > 100 && this.lives > 0) 
			{
				mouseIsDown = 0;
				this.hull = hull;
				this.dead = false;
				this.x = Math.round(game.width*0.46);
				this.y = Math.round(game.height*0.90);
				this.image = this.offCanvas;
				this.rendered = false;
				this.hit = false;
				this.hitTimer = 0;
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
			else {
				this.x = Math.round(game.width*0.5); //keeping the player outside canvas while dead
				this.y = Math.round(game.height*1.5);
			}
		}

		if (this.imune){
			this.imuneTimer++;
			if (this.imuneTimer > 250){
				this.imune = false;
				this.imuneTimer = 0;
			}
		}

	};

	this.draw = function() {


		if(!this.dead){		
			
			if (this.imune && !game.faded && game.started && !game.levelComplete)
			{
				this.ctx.globalAlpha = 0.8;
				////  !!!!!!   ///
				/// !!?WTF?!! ///
				////////////////
				if (this.imuneTimer >= 0 && this.imuneTimer < 15  || this.imuneTimer >= 20 && this.imuneTimer < 35 ||this.imuneTimer >= 40 && this.imuneTimer < 55 || this.imuneTimer >= 70 && this.imuneTimer < 75 || this.imuneTimer >= 90 && this.imuneTimer < 95 || this.imuneTimer >= 110 && this.imuneTimer < 115 || this.imuneTimer >= 130 && this.imuneTimer < 135 || this.imuneTimer >= 150 && this.imuneTimer < 155 || this.imuneTimer >= 160 && this.imuneTimer < 175 || this.imuneTimer > 180)
				{
					this.ctx.drawImage(this.playerImage, this.x, this.y); //rendering
				}
			}


			if (!this.imune)
			{
				if (this.ctx.globalAlpha < 1 && !game.faded && !game.levelComplete)  //we need to avoid imunity clashing with game transitions
				{
						this.ctx.globalAlpha += 0.1;				
				}

				this.ctx.drawImage(this.playerImage, this.x, this.y); //rendering
			}


			if (this.hit && !this.imune) {
				// this.hitTimer++;
				if (this.canVibrate) 
				{
					navigator.vibrate(30);
				}

				this.hit = false;

				// var imgData = this.ctx.getImageData(this.x, this.y, this.size, this.size);

				// var d = imgData.data;
			 //    for (var i = 0; i < d.length; i += 4) {
			 //      var r = d[i];
			 //      var g = d[i + 1];
			 //      var b = d[i + 2];
			 //      d[i] = d[i + 1] = d[i + 2] = 255;
			 //    }

				// this.ctx.putImageData(imgData, this.x, this.y);

			// 	if (this.hitTimer > 4){
				// this.hit = false;
			// 		this.hitTimer = 0;
			// 	}				 
			// }

			}
		}
	};

	this.load = function()
	{
		this.update();
		this.draw();
	};
	
	this.reset = function() {
		game.gameOver = false;
		this.dead = false;
		this.deadTimer = 0;				
		this.x = Math.round(game.width*0.46);
		this.y = Math.round(game.height*0.90);
		this.image = this.offCanvas;
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0;
		this.friction = 0;
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = X_Lives;
		// this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

// player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
// player.prototype.constructor = player; // Set the "constructor" property to refer to player


var playerShip;