function transition()
{

	this.keyframe0 = true;
	this.keyframe1 = false;
	this.keyframe2 = false;	


	this.lvlIntro = function()
	{		
		gameText.lvlIntro();

		if(this.keyframe0)
		{				
			gameLights.fadeIn('text');
			if(!game.textFaded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;	
				gameLights.on('text');
				this.keyframe0 = false;
				this.keyframe1 = true;				
			}
		}
		else if (this.keyframe1)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe1 = false;
				this.keyframe2 = true;
			}
		}
		else if(this.keyframe2)
		{
			gameLights.fadeOut('text');
			if(game.textFaded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				gameLights.off('text');
				this.keyframe2 = false;
				this.keyframe0 = true;								
				resetGame();
				game.lvlIntro = false;
				game.lvlStart = true;									
			}
		}
	};

	this.lvlStart = function()
	{
		gameLights.fadeIn('all');
		if(!game.faded)
		{
			gameUI.updateAll();
			game.lvlStart = false;		
		}	
	};

	this.lvlComplete = function()
	{

		gameText.lvlComplete();	

		if (this.keyframe0)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe0 = false;
				this.keyframe1 = true;
			}
		}
		else if(this.keyframe1)
		{
			gameLights.fadeOut('all');
			if(game.faded || game.keys[13] || mouseIsDown)
			{
				game.lvlIntro = true;	
				this.keyframe0 = true;
				this.keyframe1 = false;
				game.levelComplete = false;
				game.level++;						
			}
		}	
	};

	this.gameOver = function()
	{

		gameText.gameOver();	

		if (this.keyframe0)
		{
			if (game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				game.keys[13] = false;
				this.keyframe0 = false;
				this.keyframe1 = true;				
			}
		}
		else if(this.keyframe1)
		{
			gameLights.fadeOut('all');
			if(game.faded || game.keys[13] || mouseIsDown)
			{
				mouseIsDown = 0;
				// resetGame();
				this.keyframe0 = true;
				this.keyframe1 = false;
				game.start = true;
				gameLights.on('text');
				gameText.gameIntro();
				game.gameOver = false;
				game.paused = true;										
			}
		}	
	};

	this.reset = function()
	{
		this.keyframe0 = true;
		this.keyframe1 = false;
		this.keyframe2 = false;		
	};

}

gameTransition = new transition();