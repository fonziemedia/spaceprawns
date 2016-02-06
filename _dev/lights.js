function lights()
{
	this.fader = $('#fader');
	var effectDuration = 2000;

	this.switch = function(trigger)
	{
		switch (trigger)
		{
			case 'on':
				// this.fader.stop();
				this.fader.hide();
				game.faded = false;
			break;

			case 'off':
				// this.fader.stop();
				this.fader.show();
				game.faded = true;
			break;
		}
	};

	this.fade = function(trigger)
	{
		switch (trigger)
		{
			//note that we're fadding the this.fader div here to give the illusion that our game is fading so the jquery effects below should be opposite to what we want to achieve
			case 'in':
				game.fadingIn = true;
				this.fader.fadeOut(effectDuration, function()
				{
					game.fadingIn = false;
					game.faded = false;
				});
			break;

			case 'out':
				game.fadingOut = true;
				this.fader.fadeIn(effectDuration, function()
				{
					game.fadingOut = false;
					game.faded = true;
				});
			break;
		}
	};
}

gameLights = new lights();
