function ui()
{
	var uiAll = $('#ui');
	var uiLevel = doc.getElementById("uiLevel");
	var uiScore = doc.getElementById("uiScore");
	var uiEBar = doc.getElementById("uiEBar");
	var uiHangar = doc.getElementById("uiHangarList");
	var effectDuration = 800;

	this.updateLevel = function()
	{
		uiLevel.innerHTML = 'STAGE ' + game.level;
	};

	this.updateScore = function()
	{
		uiScore.innerHTML = 'SCORE: ' + game.score;
	};

	this.updateEnergy = function()
	{
		shipEnergy = (playerShip.hull / playerShip.maxHull) * 100;

		if(shipEnergy < 0 ) {shipEnergy = 0;}

		shipEnergyPC = shipEnergy + '%';

		if (shipEnergy >= 66)
		{
			uiEBar.classList.remove('eBar-red');
			uiEBar.classList.remove('eBar-yellow');
			uiEBar.classList.add('eBar-blue');
		}
		else if (shipEnergy >= 33 && shipEnergy < 66  )
		{
			uiEBar.classList.remove('eBar-red');
			uiEBar.classList.add('eBar-yellow');
			uiEBar.classList.remove('eBar-blue');
		}
		else
		{
			uiEBar.classList.add('eBar-red');
			uiEBar.classList.remove('eBar-yellow');
			uiEBar.classList.remove('eBar-blue');
		}

		uiEBar.style.width = shipEnergyPC;
	};

	this.updateHangar = function()
	{
		switch(playerShip.lives)
		{
			case 3:
				uiHangar.getElementsByTagName("li")[0].style.display = 'inline-block';
				uiHangar.getElementsByTagName("li")[1].style.display = 'inline-block';
				uiHangar.getElementsByTagName("li")[2].style.display = 'inline-block';
			break;
			case 2:
				uiHangar.getElementsByTagName("li")[0].style.display = 'none';
			break;
			case 1:
				uiHangar.getElementsByTagName("li")[1].style.display = 'none';
			break;
			case 0:
				uiHangar.getElementsByTagName("li")[2].style.display = 'none';
			break;
		}
	};

	this.fade = function(trigger)
	{
		switch (trigger)
		{
			case 'in':
				uiAll.fadeIn(effectDuration);
			break;
			case 'out':
				uiAll.fadeOut(effectDuration);
			break;
		}
	};

	this.updateAll = function() {
		this.updateLevel();
		this.updateScore();
		this.updateEnergy();
		this.updateHangar();
	};
}

gameUI = new ui();
