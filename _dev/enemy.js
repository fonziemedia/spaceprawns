function enemy(x, y, speed, direction, hull, type, image, fireRate, sheep) {
	particle.call(this, x, y, speed, direction);

	this.type = type;
	switch (this.type){
		case 'pawn':
				this.size = Math.round(65/pixelRatio);
			break;
		case 'miniboss':
				this.size = Math.round(120/pixelRatio);	
			break;
		case 'base':
				this.size = Math.round(170/pixelRatio);
				this.rotation = 0;	
			break;
	}
	this.spritePos = Math.round(this.size * 0.5);
	this.hull = hull;
	this.image = game.images[image];
	// this.hit = false;
	this.hitTimer = 0; 
	this.dead = false;
	this.bulletTimer = 1;
	this.sheep = sheep || false;
	this.fireRate = fireRate * 60; //bullets/sec

	this.bulletDivision = (this.sheep) ? (this.fireRate*2) - (Math.floor(Math.random()*this.fireRate)) || 99999 : this.bulletDivision = this.fireRate || 99999;
	this.ctx = game.contextEnemies;
	this.inCanvas = false;
	this.speed = speed/pixelRatio;
	this.direction = direction;
	this.collided = false;

	this.update = function() {
		// this.lastX = this.x;
		// this.lastY = this.y;
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);		
		// this.handleSprings();
		// this.handleGravitations();
		// this.vx *= this.friction;
		// this.vy *= this.friction;
		// this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
		this.spriteX = this.x + this.spritePos;
		this.spriteY = this.y + this.spritePos;


		//check if it got inside canvas
		// if (this.type == 'miniboss')
		// {
		// 	if (this.x >= this.size*0.2 || this.x <= game.width - this.size*0.2 || this.y >= this.size || this.y <= game.height - this.size*0.2)
		// 	{
		// 		this.inCanvas = true;
		// 	}

		// 	//once in canvas start controlling bondaries
		// 	if (this.inCanvas)
		// 	{
		// 		if (this.x < this.size*0.5 || this.x > game.width - this.size*0.5 || this.y < this.size*0.5)
		// 		{
		// 			//go right
		// 			this.direction = -this.direction;	
		// 		}
		// 	}
		// 	else
		// 	{
		// 		this.direction = Math.PI/2;
		// 	}
		// }

		// if(this.hit && this.hull > 0 ){
		// 	if (game.sound)
	 //        {
	 //        	if (game.sfx[this.audioHit1].paused)
	 //        	{
	 //        		game.sounds.push(game.sfx[this.audioHit1]);
	 //        	}
	 //        	else if (game.sfx[this.audioHit2].paused)
	 //        	{
	 //        		game.sounds.push(game.sfx[this.audioHit2]);
	 //        	}
	 //        	else if (game.sfx[this.audioHit3].paused)
	 //        	{
	 //        		game.sounds.push(game.sfx[this.audioHit3]);
	 //        	}				        	
	 //        }
		// 	//change image here		
		// 	this.hit = false;
		// }

		if (this.hull <= 0) {
			this.dead = true;
			game.explosions.push(new explosion(this.x, this.y, this.speed, this.direction, this.size, 'enemy'));		        
			if (!playerShip.crashed){
				game.score++;
				game.levelScore++;
				gameUI.updateScore();								
			}
		}

		if(this.fireRate !== 0){
			this.bulletTimer++;
			if (this.bulletTimer % this.bulletDivision == 1){
				this.bulletTimer = 1;				
				bulletX = Math.round(this.x + this.size*0.42);
				bulletY = Math.round(this.y + this.size);
				bulletDirection = this.angleTo(playerShip);
				game.enemyBullets.push(new enemyBullet(bulletX, bulletY, 50, bulletDirection, 1, 'missile.png'));			
			}
		}

		if(this.type != 'base' )
		{	
		this.direction -= utils.randomRange(-0.05, 0.05);
		}
	};

	this.draw = function() {
		
		if(this.type == 'base'){ //making bases rotate
			// //clear trails
			// this.ctx.save();
			// this.ctx.translate(this.lastX, this.lastY);
			// this.ctx.rotate(this.rotation);
			// this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size); //clear trails
			// this.ctx.restore();

			if (!this.dead) {				

				//set rotation this.speed
				this.rotation += 0.01;

				//rotate canvas
				this.ctx.save();
				this.ctx.translate(this.spriteX, this.spriteY);
				this.ctx.rotate(this.rotation);

				//draw image
				this.ctx.drawImage(this.image, -this.spritePos, -this.spritePos, this.size, this.size);

				this.ctx.restore();
			}
		}
		else {
			// this.ctx.clearRect(this.x - this.vx, this.y - this.vy, this.size, this.size); //clear trails
			if (!this.dead) {
				this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size); //render
			}
		}

		// if (this.hit) {
		// 	this.hitTimer++;
		// 	var imgData = (this.type == 'base') ? game.contextEnemies.getImageData(this.x-this.size/2, this.y-this.size/2, this.size, this.size) : game.contextEnemies.getImageData(this.x, this.y, this.size, this.size);

		// 	var d = imgData.data;
		//     for (var i = 0; i < d.length; i += 4) {
		//       var r = d[i];
		//       var g = d[i + 1];
		//       var b = d[i + 2];
		//       d[i] = d[i + 1] = d[i + 2] = 255;
		//     }

		//     if (this.type == 'base'){
		//    		game.contextEnemies.putImageData(imgData, this.x-this.size/2, this.y-this.size/2);
		//    	}
		//    	else{
		// 		game.contextEnemies.putImageData(imgData, this.x, this.y);
		// 	}

		// 	if (this.hitTimer > 4){
		// 		this.hit = false;
		// 		this.hitTimer = 0;
		// 	} 
		// }
	};
}

enemy.prototype = Object.create(particle.prototype); // Creating a enemy.prototype object that inherits from particle.prototype.
enemy.prototype.constructor = enemy; // Set the "constructor" property to refer to enemy