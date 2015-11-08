function text(header1, header2, inputRequired) {

	var h1 = $('#h1');
	var h2 = $('#h2');
	var h3 = $('#h3');

	var h1Text = header1;
	var h2Text = header2;
	var h3Text = game.isMobile ? 'Tap screen to continue' : 'Press ENTER or LMB to continue';
	var allText = $('.all-text');
	var textInput = inputRequired;

	var effectDuration = 2000;


	this.switch = function(trigger)
	{
		switch (trigger)
		{
			case 'on':
				allText.show();
				game.textFaded = false;
			break;

			case 'off':
				allText.stop(true, true);
				allText.hide();
				game.textFaded = true;
			break;
		}
	};

	this.fade = function(trigger)
	{
		switch (trigger)
		{
			case 'in':				
				game.textFadingIn = true;				
				allText.fadeIn(effectDuration, function(){
					game.textFadingIn = false;
					game.textFaded = false;
				});
			break;

			case 'out':
				game.textFadingOut = true;
				allText.fadeOut(effectDuration, function(){
					h1.text('');		
					h2.text('');
					h3.text('');
					game.textFadingOut = false;
					game.textFaded = true;
				});
			break;
		}
	};

	this.init = function()
	{
		h1.text(h1Text);		
		h2.text(h2Text);
		if (textInput){h3.text(h3Text);}else{h3.text('');}		
	};

	this.init();

}

gameText = new text(); //To be removed!