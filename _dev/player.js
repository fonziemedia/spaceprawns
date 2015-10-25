function player(hull, fireRate) {
	// particle.call(this);

	this.x = Math.round(game.width*0.46);
	this.y = Math.round(game.height*0.90);
	this.speed = 0;
	this.maxSpeed = 400;
	
	this.size = 100;
	this.hull = hull;
	this.bulletspeed = Math.round(X_BulletSpeed*game.height/1000);
	this.image = 'fighter.png';
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
	this.bullets = [];
	this.bulletTimer = 1;
	this.bulletDivision = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
	this.ctx = game.contextPlayer;
	this.speedX = 0;
	this.speedY = 0;
	this.limitX1 = -this.size*0.5;
	this.limitX2 = game.width - this.size*0.5;
	this.limitY1 = -this.size*0.5;
	this.limitY2 = game.height - this.size*0.5;
	this.movement = Math.round(game.height*0.007);

	this.canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
	
	if (this.canVibrate && !("vibrate" in navigator))
	{
    navigator.vibrate = navigator.mozVibrate;
    }	

	// bulletspeed: X_BulletSpeed*game.height/1000,

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
		this.playerImage = game.images[this.image]; // !! check if you can optimise this !!
		this.speedX = Math.round((touchInitX - inputAreaX)*0.1);
		this.speedY = Math.round((touchInitY - inputAreaY)*0.1);		
		
		//////////////////////////////
		//	Mouse and Touch controls
		/////////////////////////////

		if (mouseIsDown && !game.levelComplete && !game.paused && !game.gameOver) {

			//removing cursor
			if (!game.isMobile) {document.getElementById('textCanvas').style.cursor = 'none';}


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
					this.image = 'fighter_right1.png';
				} else if (moveRight2) {
					this.image = 'fighter_right2.png';
				} else if (moveRight3) {
					this.image = 'fighter_right3.png';
				} else if (moveRight4) {
					this.image = 'fighter_right4.png';
				} else if (moveRight5) {
					this.image = 'fighter_right5.png';

				} else if (moveLeft1) {
					this.image = 'fighter_left1.png';
				} else if (moveLeft2) {
					this.image = 'fighter_left2.png';
				} else if (moveLeft3) {
					this.image = 'fighter_left3.png';
				} else if (moveLeft4) {
					this.image = 'fighter_left4.png';
				} else if (moveLeft5) {
					this.image = 'fighter_left5.png';
				}

				this.rendered = false;		

		}
		else
		{
			this.image = 'fighter.png';	
			document.getElementById('textCanvas').style.cursor = 'crosshair';
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
					this.image = 'fighter_left5.png';
					this.rendered = false;
					this.x -= Math.round(this.speed*dt);
				}
			}
			//right
			if(game.keys[39] || game.keys[68] && !game.gameOver){
				if(this.x <= game.width - this.size){				
					this.speed = this.maxSpeed;
					this.image = 'fighter_right5.png';
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
				        game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.leftMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.rightMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.midMissileX, this.missileY, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
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
				this.image = 'fighter.png';
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
					this.ctx.drawImage(this.playerImage, this.x, this.y, this.size, this.size); //rendering
				}
			}


			if (!this.imune)
			{
				if (this.ctx.globalAlpha < 1 && !game.faded && !game.levelComplete)  //we need to avoid imunity clashing with game transitions
				{
						this.ctx.globalAlpha += 0.1;				
				}

				this.ctx.drawImage(this.playerImage, this.x, this.y, this.size, this.size); //rendering
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
		this.image = 'fighter.png';
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0;
		this.friction = 0;
		this.bullets = [];
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = X_Lives;
		// this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

// player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
// player.prototype.constructor = player; // Set the "constructor" property to refer to player


playerShip = new player(10, 15);