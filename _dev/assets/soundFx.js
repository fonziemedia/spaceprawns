//Note: UI images are powered by CSS (see CSS assets folder)
soundfx = function()
{
	this.self = this;	
	this.on = localStorage.prawnsSound === "true" ? true : false;	
	this.sfx = [];
	this.loadedSfx  = 0;

	this.sfxPaths = [	//used in initSfx function to load our sounds
		"_sounds/_sfx/laser" + fileFormat,
		"_sounds/_sfx/hit" + fileFormat,
		"_sounds/_sfx/loot_powerUp" + fileFormat,
		"_sounds/_sfx/explosion" + fileFormat,
		"_sounds/_sfx/blast" + fileFormat
	];

	this.requiredSfx = this.sfxPaths.length; // will contain how many images should be loaded
	this.maxPlaying = game.isMobile ? 3 : 6;
};

soundfx.prototype.loadEvent = function(self)
{
	this.removeEventListener("canplaythrough", this.eventHandler, false);
	self.loadedSfx++;
};

soundfx.prototype.play = function(track, instance)
{ 
	var i = instance || 0;
	
	if (i < this.maxPlaying)
	{
		if (this.sfx[track + i].paused)
		{
			this.sfx[track + i].play();
		}
		else
		{
			i++;
			this.play(track, i);
		}
	}
};

soundfx.prototype.checkSfx = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	if(this.loadedSfx >= this.requiredSfx){
		gameUI.loadingBarUpdate(this.loadedSfx, this.requiredSfx);
		gameUI.loadingBarReset('Loading Sound Tracks.. ');
		gameMusic.init();
	}
	else
	{
		gameUI.loadingBarUpdate(this.loadedSfx, this.requiredSfx);
		setTimeout(function(){
			self.checkSfx();
		}, 1);
	}
};

soundfx.prototype.chromiumFix = function ()
{
	//playing chached sfx once onclick
	for (var s in this.sfx)
	{
		this.sfx[s].volume = 0;
		this.sfx[s].play();
		this.sfx[s].pause();
		this.sfx[s].volume = 1;
	}
};

soundfx.prototype.init = function ()
{ 
	var self = this.self;
	
	for(var i in this.sfxPaths)
	{
		for (var n = 0; n < this.maxPlaying; n++) //caching each sfx source n times for poliphony
		{
			var sfx = new Audio(); //defining sfx as a new Audio
			sfx.src = this.sfxPaths[i]; //defining new Audio src as stPaths[i]

			var sfxIndex = sfx.src.split("/").pop(); //obtaining file name from path and setting our sfxIndex as such
			sfxIndex = sfxIndex.replace(/\.[^/.]+$/, "");

			this.sfx[sfxIndex + n] = sfx;

			if(audiopreload)
			{
				this.sfx[sfxIndex + n].eventHandler = self.loadEvent.bind(this.sfx[sfxIndex + n], self);
				
				this.sfx[sfxIndex + n].preload = "auto";
				//checking if sfx have loaded
				this.sfx[sfxIndex + n].addEventListener("canplaythrough", this.sfx[sfxIndex + n].eventHandler, false);
			}
			else
			{
				this.loadedSfx++;
			}			
		}	
	}
	
	this.checkSfx();
};

var gameSfx = new soundfx();
