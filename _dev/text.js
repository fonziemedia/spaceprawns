text = function(header1, header2, inputRequired)
{
	this.h1Text = header1;
	this.h2Text = header2;
	this.textInput = inputRequired;

	this.init();
};

text.prototype.h1 = $('#h1'); //remove jquery here
text.prototype.h2 = $('#h2');
text.prototype.h3 = $('#h3');

if (game.isMobile)
{
	text.prototype.h3Text = 'Tap screen to continue';
}
else if (game.mouseControls)
{
	text.prototype.h3Text = 'Click to continue';
}
else if (game.keyboardControls)
{
	text.prototype.h3Text = 'Press any key to continue';	
}

text.prototype.allText = $('.all-text');
text.prototype.effectDuration = 2000;

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
			var self = this;
			game.textFadingOut = true;
			this.allText.fadeOut(this.effectDuration, function(){
				self.h1.text('');
				self.h2.text('');
				self.h3.text('');
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
