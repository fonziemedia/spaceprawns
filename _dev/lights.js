lights = function()
{
	this.fader = $('#fader');
	this.effectDuration = 2000;
};

lights.prototype.switch = function(trigger)
{
	switch (trigger)
	{
		case 'on':
			this.fader.hide();
			game.faded = false;
		break;

		case 'off':
			this.fader.show();
			game.faded = true;
		break;
	}
};

lights.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		//note that we're fadding this.fader(div) here to give the illusion that our game is fading so the jquery effects below should be opposite to what we want to achieve
		case 'in':
			game.fadingIn = true;
			this.fader.fadeOut(this.effectDuration, function()
			{
				game.fadingIn = false;
				game.faded = false;
			});
		break;

		case 'out':
			game.fadingOut = true;
			this.fader.fadeIn(this.effectDuration, function()
			{
				game.fadingOut = false;
				game.faded = true;
			});
		break;
	}
};

gameLights = new lights();
