function player(hull, fireRate) {
	particle.call(this);

	this.x = game.width*0.46;
	this.y = game.height*0.90;
	this.speed = 0;
	this.direction = -Math.PI/2;
	this.size = 100*dtSize;
	this.hull = hull;
	this.bulletspeed = X_BulletSpeed*game.height/1000;
	this.image = 0;
	this.rendered = false;
	this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bullets = [];
	this.bulletTimer = fireRate-1;
	this.bulletDivision = fireRate;
	this.laserLevel = 1;
	this.missileLevel = 0;
	this.lives = X_Lives;
	this.context = game.contextPlayer;

	// bulletspeed: X_BulletSpeed*game.height/1000,

	this.update = function() {
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		// this.x += this.vx;
		// this.y += this.vy;

		if (mouseIsDown && !(game.paused) && !(game.gameOver) && !(game.gameWon)) {

				
			if((canvasX > (this.size/4) && canvasX <= (game.width - this.size/4)) && (canvasY > this.size) && canvasY <= (game.height - this.size/6)) {			
			
				moveRight1 = (canvasX > moveX && canvasX <= moveX + 2) ? true : false;
				moveRight2 = (canvasX > moveX + 2 && canvasX <= moveX + 4) ? true : false;
				moveRight3 = (canvasX > moveX + 4 && canvasX <= moveX + 6) ? true : false;
				moveRight4 = (canvasX > moveX + 6 && canvasX <= moveX + 8) ? true : false;
				moveRight5 = (canvasX > moveX + 8) ? true : false;

				moveLeft1 = (canvasX < moveX && canvasX >= moveX -2) ? true : false;
				moveLeft2 = (canvasX < moveX - 2 && canvasX >= moveX -4) ? true : false;
				moveLeft3 = (canvasX < moveX - 4 && canvasX >= moveX -6) ? true : false;
				moveLeft4 = (canvasX < moveX - 6 && canvasX >= moveX -8) ? true : false;
				moveLeft5 = (canvasX < moveX - 8) ? true : false;

				if (canvasX != moveX || canvasY != moveY) {
					distX = moveX - canvasX;
					distY = moveY - canvasY;
					
					if (distX < 10 && distX > -10){this.speed = 400;this.x -= distX;}
					else if (distX >= 10) {this.speed = 400;this.x -= this.speed*dt;}
					else if (distX <= -10) {this.speed = 400;this.x += this.speed*dt;}

					if (distY < 10 && distY > -10){this.speed = 400;this.y -= distY;}
					else if (distY >= 10) {this.speed = 400;this.y -= this.speed*dt;}
					else if (distY <= -10) {this.speed = 400;this.y += this.speed*dt;}

				}

				// console.log (canvasX);
				// console.log (moveX);
				// console.log (canvasY);
				// console.log (moveY);
				
				if (moveRight1) {
					this.image = 4;
				} else if (moveRight2) {
					this.image = 5;
				} else if (moveRight3) {
					this.image = 6;
				} else if (moveRight4) {
					this.image = 7;
				} else if (moveRight5) {
					this.image = 8;

				} else if (moveLeft1) {
					this.image = 9;
				} else if (moveLeft2) {
					this.image = 10;
				} else if (moveLeft3) {
					this.image = 11;
				} else if (moveLeft4) {
					this.image = 12;
				} else if (moveLeft5) {
					this.image = 13;
				} else {
				 this.image = 0;	
				}

				this.rendered = false;				
				moveX = this.x + this.size*0.5; 	//second define of moveX as canvasX position
				moveY = (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) ? this.y + this.size*2 : this.y + this.size; 	//second define of moveX as canvasX position
			
			}
			/*		console.log (canvasX)
					console.log (moveX);
					console.log (moveRight);*/
		}

		if (!mouseIsDown && !game.gameOver) {
			this.image = 0;
			this.rendered = false;
		}

		//left
		if(game.keys[37] || game.keys[65] && !(game.gameOver) && !(game.gameWon)){ //if key pressed..				
			if(this.x > this.size/50){ // (keeping it within the boundaries of our canvas)
				this.speed = 400;
				this.direction = Math.PI;				
				this.image = 13;
				this.rendered = false;
				this.x -= this.speed*dt;
			}
		}
		//right
		if(game.keys[39] || game.keys[68] && !(game.gameOver) && !(game.gameWon)){
			if(this.x <= game.width - this.size){
				this.speed = 400;
				this.direction = 0;
				this.image = 8;
				this.rendered = false;
				this.x += this.speed*dt;
			}
		}
		if(game.keys[38] || game.keys[87] && !(game.gameOver) && !(game.gameWon)){
			if(this.y > this.size/12){
				this.speed = 400;
				this.direction = -Math.PI/2;
				this.rendered = false;
				this.y -= this.speed*dt;
			}
		}
		if(game.keys[40] || game.keys[83] && !(game.gameOver) && !(game.gameWon)){
			if(this.y <= game.height - this.size){
				this.speed = 400;
				this.direction = Math.PI/2;
				this.rendered = false;
				this.y += this.speed*dt;
			}	
		}
		else {
			this.speed = 0;
		}


		if((game.keys[32] || mouseIsDown) && !(game.gameOver)){ //only add a bullet if space is pressed and enough time has passed i.e. our timer has reached 0
			this.bulletTimer++;
			// homing missiles, sort of
			// this.bulletAngle = sectoidWave.units.length > 0 ? this.angleTo(sectoidWave.units[Math.floor(Math.random() * sectoidWave.units.length)]) : -Math.PI/2;
			if (this.bulletTimer % this.bulletDivision === 0) {
				// (x, y, speed, direction, bulletSize, power, friction, image, imageSize, endFrame)
				switch(this.laserLevel) {
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));				
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.25, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.75, this.y - this.size*0.2, 600, -Math.PI/2, 45, 1, 1, 2, 48, 11));
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}				
				        if (game.sound){game.sounds.push(new Audio("_sounds/_sfx/laser.wav"));}
				 }

				 switch(this.missileLevel) {
				 	case 0:
				 		break;
				    case 1:
				        game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						break;
				    case 2:
				    	game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						break;
				    default:
				        game.playerBullets.push( new playerBullet(this.x, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));
						game.playerBullets.push( new playerBullet(this.x + this.size*0.5, this.y + this.size, 100, -Math.PI/2, 45, 2, 1.03, 20, 64, 2));										
				 }				
				this.bulletTimer = 1; //resetting our timer
			}
		}
		else {
			this.bulletTimer = fireRate-1;
		}

		if (this.hull <= 0) {
			// console.log(this.x);
			// console.log(this.y);
			// console.log(this.speed);
			// console.log(this.direction);
			game.explosions.push(new explosion(this.x, this.y, this.speed*0.5, this.direction, this.size));
			this.dead = true;
			if (game.sound){game.sounds.push(new Audio("_sounds/blast.mp3"));}
			PlayerDie();
			this.lives -= 1;
			this.hull = hull;
		}

		this.vx = Math.cos(this.direction) * this.speed;
		this.vy = Math.sin(this.direction) * this.speed;



	};



	this.draw = function() {


		if(!this.dead){		
			
			game.contextPlayer.drawImage(game.images[this.image], this.x, this.y, this.size, this.size); //rendering

			if (this.hit) {
				this.hitTimer++;
				navigator.vibrate(30);

				// var imgData = game.contextPlayer.getImageData(this.x, this.y, this.size, this.size);

				// var d = imgData.data;
			 //    for (var i = 0; i < d.length; i += 4) {
			 //      var r = d[i];
			 //      var g = d[i + 1];
			 //      var b = d[i + 2];
			 //      d[i] = d[i + 1] = d[i + 2] = 255;
			 //    }

				// game.contextPlayer.putImageData(imgData, this.x, this.y);

				if (this.hitTimer > 4){
					this.hit = false;
					this.hitTimer = 0;
				}				 
			}

		}
	};

	this.reset = function() {
		this.dead = false;
		this.x = game.width*0.46;
		this.y = game.height*0.90;
		this.image = 0;
		this.hull = hull;
		this.rendered = false;
		this.hit = false;
		this.hitTimer = 0; 
		this.dead = false;
		this.friction = 0;
		this.bullets = [];
		this.laserLevel = 1;
		this.missileLevel = 0;
		this.lives = (this.lives < 1) ? 3 : this.lives;
	};
}

player.prototype = Object.create(particle.prototype); // Creating a player.prototype object that inherits from particle.prototype.
player.prototype.constructor = player; // Set the "constructor" property to refer to player


playerShip = new player(10, 20);