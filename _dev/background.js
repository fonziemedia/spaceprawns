function background() {
	//no jquery here for increased fps
	this.element = document.getElementById("levelBackground");
	this.y = 0;

	this.update = function() {

		this.y += 2;
		this.element.style.backgroundPosition = '0 ' + this.y + 'px';

		//testing using an off-screen canvas
		// game.contextBackground.drawImage(m_canvas, this.x, this.y, this.width, this.height);
		// game.contextBackground.drawImage(game.images[this.image], this.x, this.y, this.width, this.height);
	};

	this.load = function() {

		for (var i = 1; i <= 3; i++) {
			this.element.classList.remove('level' + i);
		}
		
		this.element.classList.add('level' + game.level);

	};
}

gameBackground = new background();