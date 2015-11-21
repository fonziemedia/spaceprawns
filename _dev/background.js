function background() {
	//no jquery here for increased fps
	this.element = document.getElementById("levelBackground");
	this.elementStyle = window.getComputedStyle(this.element);
    this.elementTop = -parseInt(this.elementStyle.getPropertyValue("top"));
	this.elementYpos = 1;
	this.speed = 4;

	this.update = function() {

		if(this.elementYpos <= this.elementTop)
		{
			this.elementYpos += this.speed;
			this.element.style.transform = 'translate3d(0,' + this.elementYpos + 'px, 0)';
			// this.element.style.webkitTransform = 'translate3d(0,' + this.elementYpos + 'px, 0) rotate(0.0000001deg)';
		}
		else
		{
			this.elementYpos = 1;
		}  

		//testing using an off-screen canvas
		// game.contextBackground.drawImage(m_canvas, this.x, this.y, this.width, this.height);
		// game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {

		for (var i = 1; i <= 3; i++) {
			this.element.classList.remove('level' + i);
		}
		
		this.element.classList.add('level' + game.level);

		this.elementTop = -parseInt(this.elementStyle.getPropertyValue("top"));
	};
}

gameBackground = new background();