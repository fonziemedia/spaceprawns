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
				game.keys[13] = false;
				if(!game.textFaded)
				{						
					this.keyframe0 = false;
					this.keyframe1 = true;				
				}
				gameLights.on('text');
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
				game.keys[13] = false;
				if(game.textFaded)
				{	
					this.keyframe2 = false;
					this.keyframe0 = true;
					game.contextText.clearRect(0, 0, game.width, game.height);	//move this, need to improve clrcanvas function							
					resetGame();
					game.lvlIntro = false;
					game.lvlStart = true;
				}
				gameLights.off('text');								
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
				mouseIsDown = 0;
				game.keys[13] = false;
				if (game.faded)
				{
					game.lvlIntro = true;	
					this.keyframe0 = true;
					this.keyframe1 = false;
					game.levelComplete = false;
					game.level++;
				}
				gameLights.off('all'); //lights out and setting game.faded = true						
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
				game.keys[13] = 0;				
				if (game.faded){ //this will only trigger in the next frame
					this.keyframe0 = true;
					this.keyframe1 = false;
					game.start = true;
					gameLights.on('text');
					gameText.gameIntro();
					game.gameOver = false;
					game.paused = true;
				}	
				gameLights.off('all'); //lights out and setting game.faded = true									
			}
		}	
	};

	this.load = function()
	{
		if (game.lvlIntro)
		{
			gameTransition.lvlIntro();
		}
		else if (game.lvlStart)
		{
			gameTransition.lvlStart();
		}
		else if (game.levelComplete)
		{
			gameTransition.lvlComplete();
		}
		else if (game.gameOver)
		{
			gameTransition.gameOver();
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