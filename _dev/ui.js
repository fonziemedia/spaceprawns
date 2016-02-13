ui = function()
{
	this.uiAll = $('#ui');
	this.uiLevel = doc.getElementById("uiLevel");
	this.uiScore = doc.getElementById("uiScore");
	this.uiEBar = doc.getElementById("uiEBar");
	this.uiHangar = doc.getElementById("uiHangarList");
	this.effectDuration = 800;
};

ui.prototype.updateLevel = function()
{
	this.uiLevel.innerHTML = 'STAGE ' + game.level;
};

ui.prototype.updateScore = function()
{
	this.uiScore.innerHTML = 'SCORE: ' + game.score;
};

ui.prototype.updateEnergy = function()
{
	shipEnergy = (playerShip.hull / playerShip.maxHull) * 100;

	if(shipEnergy < 0 ) {shipEnergy = 0;}

	shipEnergyPC = shipEnergy + '%';

	if (shipEnergy >= 66)
	{
		this.uiEBar.classList.remove('eBar-red');
		this.uiEBar.classList.remove('eBar-yellow');
		this.uiEBar.classList.add('eBar-blue');
	}
	else if (shipEnergy >= 33 && shipEnergy < 66  )
	{
		this.uiEBar.classList.remove('eBar-red');
		this.uiEBar.classList.add('eBar-yellow');
		this.uiEBar.classList.remove('eBar-blue');
	}
	else
	{
		this.uiEBar.classList.add('eBar-red');
		this.uiEBar.classList.remove('eBar-yellow');
		this.uiEBar.classList.remove('eBar-blue');
	}

	this.uiEBar.style.width = shipEnergyPC;
};

ui.prototype.updateHangar = function()
{
	switch(playerShip.lives)
	{
		case 3:
			this.uiHangar.getElementsByTagName("li")[0].style.display = 'inline-block';
			this.uiHangar.getElementsByTagName("li")[1].style.display = 'inline-block';
			this.uiHangar.getElementsByTagName("li")[2].style.display = 'inline-block';
		break;
		case 2:
			this.uiHangar.getElementsByTagName("li")[0].style.display = 'none';
		break;
		case 1:
			this.uiHangar.getElementsByTagName("li")[1].style.display = 'none';
		break;
		case 0:
			this.uiHangar.getElementsByTagName("li")[2].style.display = 'none';
		break;
	}
};

ui.prototype.fade = function(trigger)
{
	switch (trigger)
	{
		case 'in':
			this.uiAll.fadeIn(this.effectDuration);
		break;
		case 'out':
			this.uiAll.fadeOut(this.effectDuration);
		break;
	}
};

ui.prototype.updateAll = function()
{
	this.updateLevel();
	this.updateScore();
	this.updateEnergy();
	this.updateHangar();
};

gameUI = new ui();
