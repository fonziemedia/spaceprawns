ui = function()
{
	this.loadingBar = $('#loadingBar');
	this.loadingBarWidth = 0;
	this.loadingBarFiller = $('#loadingBarFiller');
	this.loadingText = new text('Loading Images.. ', '', false);
	
	this.uiAll = $('#ui');
	this.uiLevel = doc.getElementById("uiLevel");
	this.uiScore = doc.getElementById("uiScore");
	this.uiEBar = doc.getElementById("uiEBar");
	this.uiHangar = doc.getElementById("uiHangarList");
	this.effectDuration = 800;
	
	this.loadingBarInit();
};

ui.prototype.loadingBarInit = function()
{
	this.loadingText.switch('on');
	this.loadingBar.show();
};

ui.prototype.loadingBarClose = function()
{
	this.loadingText.switch('off');
	this.loadingBar.hide();
};

ui.prototype.loadingBarReset = function(loadingTxt)
{
	this.loadingText.h1.text(loadingTxt);
	this.loadingBarFiller.css({"width": "0"});
};

ui.prototype.loadingBarUpdate = function(assetsDone, assetsRequired)
{
	this.loadingBarWidth = (assetsDone / assetsRequired) * 100 + '%';
	this.loadingBarFiller.css({"width": this.loadingBarWidth});
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

var gameUI = new ui();
