function lights() {

	//starting our game with a black screen
	this.backgroundAlpha = 0;
	this.enemiesAlpha = 0;
	this.playerAlpha = 0;
	this.textAlpha = 0;
	
	this.alphaDelta = 0.01; //the speed of fade in/out 

	this.on = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':
				game.contextText.globalAlpha = 1;				
				game.contextBackground.globalAlpha = 1;
				game.contextEnemies.globalAlpha = 1;
				game.contextPlayer.globalAlpha = 1;
				
				game.textFaded = false;
				game.backgroundFaded = false;
				game.enemiesFaded = false;
				game.playerFaded = false;
				
				game.faded = false;	
			break;

			case 'text':
				game.contextText.globalAlpha = 1;
				game.textFaded = false;	
			break;

			case 'background':
				game.contextBackground.globalAlpha = 1;
				game.backgroundFaded = false;												
			break;

			case 'enemies':
				game.contextEnemies.globalAlpha = 1;
				game.enemiesFaded = false;	
			break;
		
			case 'player':
				game.contextPlayer.globalAlpha = 1;
				game.playerFaded = false;						
			break;
		}
	};

	this.off = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':
				game.contextText.globalAlpha = 0;				
				game.contextBackground.globalAlpha = 0;
				game.contextEnemies.globalAlpha = 0;
				game.contextPlayer.globalAlpha = 0;
				
				game.textFaded = true;
				game.backgroundFaded = true;
				game.enemiesFaded = true;
				game.playerFaded = true;
				
				game.faded = true;	
			break;

			case 'text':
				game.contextText.globalAlpha = 0;
				game.textFaded = true;	
			break;

			case 'background':
				game.contextBackground.globalAlpha = 0;
				game.backgroundFaded = true;												
			break;

			case 'enemies':
				game.contextEnemies.globalAlpha = 0;
				game.enemiesFaded = true;	
			break;
		
			case 'player':
				game.contextPlayer.globalAlpha = 0;
				game.playerFaded = true;						
			break;
		}	
	};

	this.fadeIn = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':	
				if (this.backgroundAlpha < 1 || this.enemiesAlpha < 1 || this.playerAlpha < 1 || this.textAlpha < 1 )
				{	
					this.backgroundAlpha += this.alphaDelta;
					this.enemiesAlpha += this.alphaDelta;
					this.playerAlpha += this.alphaDelta;			
					this.textAlpha += this.alphaDelta;
				}
				else if (this.backgroundAlpha >= 1 && this.enemiesAlpha >= 1 && this.playerAlpha >= 1 && this.textAlpha >= 1)
				{
					game.contextBackground.globalAlpha = 1;
					game.contextEnemies.globalAlpha = 1;
					game.contextPlayer.globalAlpha = 1;
					game.contextText.globalAlpha = 1;
					game.backgroundFaded = false;
					game.enemiesFaded = false;
					game.playerFaded = false;
					game.textFaded = false;
					game.faded = false;
				}

				game.contextBackground.globalAlpha = this.backgroundAlpha;
				game.contextEnemies.globalAlpha = this.enemiesAlpha;
				game.contextPlayer.globalAlpha = this.playerAlpha;
				game.contextText.globalAlpha = this.textAlpha;
			break;

			case 'text':
				if (this.textAlpha < 1)
				{				
					this.textAlpha += this.alphaDelta;
				}
				else if (this.textAlpha >= 1)
				{
					game.contextText.globalAlpha = 1;
					game.textFaded = false;
				}

				game.contextText.globalAlpha = this.textAlpha;	
			break;

			case 'background':
				if (this.backgroundAlpha < 1)
				{				
					this.backgroundAlpha += this.alphaDelta;
				}
				else if (this.backgroundAlpha >= 1)
				{
					game.contextBackground.globalAlpha = 1;
					game.backgroundFaded = false;
				}

				game.contextBackground.globalAlpha = this.backgroundAlpha;												
			break;

			case 'enemies':
				if (this.enemiesAlpha < 1)
				{				
					this.enemiesAlpha += this.alphaDelta;
				}
				else if (game.enemiesApha >= 1)
				{
					game.contextEnemies.globalAlpha = 1;
					game.enemiesFaded = false;
				}

				game.contextEnemies.globalAlpha = this.enemiesAlpha;	
			break;
		
			case 'player':
				if (this.playerAlpha < 1)
				{				
					this.playerAlpha += this.alphaDelta;
				}
				else if (this.playerAlpha >= 1)
				{
					game.contextPlayer.globalAlpha = 1;
					game.playerFaded = false;
				}

				game.contextPlayer.globalAlpha = this.playerAlpha;						
			break;

		}
	};

	this.fadeOut = function(ctx)
	{
		ctx = ctx;

		switch (ctx)
		{
			case 'all':	
				if (this.backgroundAlpha > 0 || this.enemiesAlpha > 0 || this.playerAlpha > 0 || this.textAlpha > 0 )
				{	
					this.backgroundAlpha -= this.alphaDelta;
					this.enemiesAlpha -= this.alphaDelta;
					this.playerAlpha -= this.alphaDelta;			
					this.textAlpha -= this.alphaDelta;
				}
				else if (this.backgroundAlpha <= 0 && this.enemiesAlpha <= 0 && this.playerAlpha <= 0 && this.textAlpha <= 0)
				{
					game.contextBackground.globalAlpha = 0;
					game.contextEnemies.globalAlpha = 0;
					game.contextPlayer.globalAlpha = 0;
					game.contextText.globalAlpha = 0;
					game.backgroundFaded = true;
					game.enemiesFaded = true;
					game.playerFaded = true;
					game.textFaded = true;
					game.faded = true;
				}

				game.contextBackground.globalAlpha = this.backgroundAlpha;
				game.contextEnemies.globalAlpha = this.enemiesAlpha;
				game.contextPlayer.globalAlpha = this.playerAlpha;
				game.contextText.globalAlpha = this.textAlpha;
			break;

			case 'text':
				if (this.textAlpha > 0)
				{				
					this.textAlpha -= this.alphaDelta;
				}
				else if (this.textAlpha <= 0)
				{
					game.contextText.globalAlpha = 0;
					game.textFaded = true;
				}

				game.contextText.globalAlpha = this.textAlpha;
			break;

			case 'background':
				if (this.backgroundAlpha > 0)
				{				
					this.backgroundAlpha -= this.alphaDelta;
				}
				else if (this.backgroundAlpha <= 0)
				{
					game.contextBackground.globalAlpha = 0;
					game.backgroundFaded = true;
				}

				game.contextBackground.globalAlpha = this.backgroundAlpha;													
			break;

			case 'enemies':
				if (this.enemiesAlpha > 0)
				{				
					this.enemiesAlpha -= this.alphaDelta;
				}
				else if (game.enemiesApha <= 0)
				{
					game.contextEnemies.globalAlpha = 0;
					game.enemiesFaded = true;
				}

				game.contextEnemies.globalAlpha = this.enemiesAlpha;		
			break;
		
			case 'player':
				if (this.playerAlpha > 0)
				{				
					this.playerAlpha -= this.alphaDelta;
				}
				else if (this.playerAlpha <= 0)
				{
					game.contextPlayer.globalAlpha = 0;
					game.playerFaded = true;
				}

				game.contextPlayer.globalAlpha = this.playerAlpha;						
			break;
		}
	};

}

gameLights = new lights();