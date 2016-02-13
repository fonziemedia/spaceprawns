text = function(header1, header2, inputRequired)
{
	this.h1 = $('#h1'); //remove jquery here
	this.h2 = $('#h2');
	this.h3 = $('#h3');
	this.h1Text = header1;
	this.h2Text = header2;
	this.h3Text = game.isMobile ? 'Tap screen to continue' : 'Press ENTER or LMB to continue';
	this.allText = $('.all-text');
	this.textInput = inputRequired;
	this.effectDuration = 2000;

	this.init();
};

text.prototype.switch = function(trigger)
{
	switch (trigger)
	{
		case 'on':
			this.allText.show();
			game.textFaded = false;
		break;
		case 'off':
			this.allText.stop(true, true);
			this.allText.hide();
			game.textFaded = true;
		break;
	}
};

text.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		case 'in':
			game.textFadingIn = true;
			this.allText.fadeIn(this.effectDuration, function(){
				game.textFadingIn = false;
				game.textFaded = false;
			});
		break;
		case 'out':
			game.textFadingOut = true;
			this.allText.fadeOut(this.effectDuration, function(){
				this.h1.text('');
				this.h2.text('');
				this.h3.text('');
				game.textFadingOut = false;
				game.textFaded = true;
			});
		break;
	}
};

text.prototype.init = function()
{
	this.h1.text(this.h1Text);
	this.h2.text(this.h2Text);
	if (this.textInput){this.h3.text(this.h3Text);}else{this.h3.text('');}
};

gameText = new text(); //To be removed!
