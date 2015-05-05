function player(hull, fireRate) {
	particle.call(this);

	this.x = game.width*0.46;
	this.y = game.height*0.90;
	this.speed = 0;
	this.maxSpeed = 400;
	this.direction = -Math.PI/2;
	this.size = 100*dtSize;
	this.hull = hull;
	this.bulletspeed = X_BulletSpeed*game.height/1000;
	this.image = 'fighter.png';
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
	this.incline = [game.width*0.004, game.width*0.008, game.width*0.010, game.width*0.012];
	this.steering = game.width * 0.08; //ship drag radius
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
		this.playerImage = game.images[this.image];
		
		//////////////////////////////
		//	Mouse and Touch controls
		/////////////////////////////

		if (mouseIsDown && !game.levelComplete && !game.paused && !game.gameOver && !game.gameWon) {

			//defining the boundaries	
			if((canvasX > (this.size*0.25) && canvasX <= (game.width - this.size*0.25)) && (canvasY > this.size) && canvasY <= (game.height - this.size*0.16)) {			
				
				moveRight1 = (canvasX > moveX && canvasX <= moveX + this.incline[0]) ? true : false;
				moveRight2 = (canvasX > moveX + this.incline[0] && canvasX <= moveX + this.incline[1]) ? true : false;
				moveRight3 = (canvasX > moveX + this.incline[1] && canvasX <= moveX + this.incline[2]) ? true : false;
				moveRight4 = (canvasX > moveX + this.incline[2] && canvasX <= moveX + this.incline[3]) ? true : false;
				moveRight5 = (canvasX > moveX + this.incline[3]) ? true : false;

				moveLeft1 = (canvasX < moveX && canvasX >= moveX -this.incline[0]) ? true : false;
				moveLeft2 = (canvasX < moveX - this.incline[0] && canvasX >= moveX -this.incline[1]) ? true : false;
				moveLeft3 = (canvasX < moveX - this.incline[1] && canvasX >= moveX -this.incline[2]) ? true : false;
				moveLeft4 = (canvasX < moveX - this.incline[2] && canvasX >= moveX -this.incline[3]) ? true : false;
				moveLeft5 = (canvasX < moveX - this.incline[3]) ? true : false;
				
				//making it move to touch or click point
				if (canvasX != moveX || canvasY != moveY) {
					//the distance between the current ship pos and the user touch/click pos
					distX = moveX - canvasX;
					distY = moveY - canvasY;
					
					// if xy touch position is greater than the ships steering radius (approx 10px) make the ship move to touch point, else teleport to touch point (magnet effect)
					// this gives a smooth steering experience while avoiding cheating (teleportation)
					if (distX < this.steering && distX > -this.steering){this.speed = this.maxSpeed;this.x -= distX;}
					if (distX >= this.steering) {this.speed = this.maxSpeed;this.x -= this.speed*dt;}
					if (distX <= -this.steering) {this.speed = this.maxSpeed;this.x += this.speed*dt;}

					if (distY < this.steering && distY > -this.steering){this.speed = this.maxSpeed;this.y -= distY;}
					if (distY >= this.steering) {this.speed = this.maxSpeed;this.y -= this.speed*dt;}
					if (distY <= -this.steering) {this.speed = this.maxSpeed;this.y += this.speed*dt;}

					// this.speed = this.maxSpeed;
					// this.x -= distX;
					// this.y -= distY;

				}

				// console.log (canvasX);
				// console.log (moveX);
				// console.log (canvasY);
				// console.log (moveY);
				
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
				} else {
					this.image = 'fighter.png';	
				}

				this.rendered = false;				
				moveX = this.x + this.size*0.5; 	//second define of moveX as canvasX position
				moveY = game.isMobile ? this.y + this.size*1.7 : this.y + this.size; 	//second define of moveX as canvasX position
			
			}
			/*		console.log (canvasX)
					console.log (moveX);
					console.log (moveRight);*/
		}
		else if (!mouseIsDown && !game.gameOver) {
			this.image = 'fighter.png';
			this.rendered = false;
		}

		/////////////////////////
		//	Keyboard controlls
		////////////////////////

		//left
		if(game.keys[37] || game.keys[65] && !(game.gameOver) && !(game.gameWon)){ //if key pressed..				
			if(this.x > 0){ // (keeping it within the boundaries of our canvas)				
				this.speed = this.maxSpeed;
				this.direction = Math.PI;				
				this.image = 'fighter_left5.png';
				this.rendered = false;
				this.x -= this.speed*dt;
			}
		}
		//right
		if(game.keys[39] || game.keys[68] && !(game.gameOver) && !(game.gameWon)){
			if(this.x <= game.width - this.size){				
				this.speed = this.maxSpeed;
				this.direction = 0;
				this.image = 'fighter_right5.png';
				this.rendered = false;
				this.x += this.speed*dt;
			}
		}
		//up
		if((game.keys[38] || game.keys[87] && !game.gameOver && !game.gameWon) || game.levelComplete){ //also if game level is complete!
			if(this.y > 0 || game.levelComplete){				
				this.speed = this.maxSpeed;
				this.direction = -Math.PI/2;
				this.rendered = false;
				this.y -= this.speed*dt;
			}
		}
		//down
		if(game.keys[40] || game.keys[83] && !(game.gameOver) && !game.gameWon){
			if(this.y <= game.height - this.size){				
				this.speed = this.maxSpeed;
				this.direction = Math.PI/2;
				this.rendered = false;
				this.y += this.speed*dt;
			}	
		}
		else {
			this.speed = 0;
		}


		if((game.keys[32] || mouseIsDown) && !this.dead && !game.gameOver){ //only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
			this.bulletTimer++;
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer % this.bulletDivision === 0) {
				// (x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame)
				switch(this.laserLevel) {
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));				
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 'laser.png', 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				 }

				 switch(this.missileLevel) {
				 	case 0:
				 		break;
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 'missile.png', 64, 2));
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
			game.explosions.push(new explosion(this.x, this.y, this.speed*0.5, this.direction, this.size));
			if (game.sound){game.sounds.push(new Audio("_sounds/blast.mp3"));}
			gameUI.updateHangar();
		}	


		if (this.dead && this.deadTimer <= 100 && game.lives > 0) 
		{
			//waiting a few secs before any action
			this.deadTimer++; 

			if (this.deadTimer > 100 && this.lives > 0) 
			{
					mouseIsDown = 0;
					this.hull = hull;
					this.dead = false;
					this.x = game.width*0.46;
					this.y = game.height*0.90;
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
			else if (this.deadTimer > 100 && this.lives === 0)
			{	
				mouseIsDown = 0;
				game.keys[13] = false;				
				this.deadTimer = 0;
				game.gameOver = true;
			}
			else {
				this.x = -game.width; //keeping the player outside canvas while dead
				this.y = -game.height;
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
			
			if (this.imune && !game.faded && !game.starting && !game.levelComplete)
			{
				this.ctx.globalAlpha = 0.8;
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
		this.dead = false;
		this.x = game.width*0.46;
		this.y = game.height*0.90;
		this.image = 'fighter.png';
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0; 
		this.dead = false;
		game.gameOver = false;
		this.friction = 0;
		this.bullets = [];
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = X_Lives;
		// this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
player.prototype.constructor = player; // Set the "constructor" property to refer to player


playerShip = new player(10, 15);