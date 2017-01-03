//Note: UI images are powered by CSS (see CSS assets folder)
music = function()
{
	this.self = this;	
	this.on = localStorage.prawnsMusic === "true" ? true : false;
	
	this.soundTracks = [];
	this.loadedSoundTracks = 0;

	//Sound Tracks vars
	this.soundTrackPaths = [	//used in initSfx function to load our sound tracks
		"_sounds/_soundTracks/_lvl1/tune1" + fileFormat,
		"_sounds/_soundTracks/_lvl1/tune2" + fileFormat,
		"_sounds/_soundTracks/_lvl1/victory" + fileFormat,
		"_sounds/_soundTracks/_lvl1/boss" + fileFormat
	];
	
	this.requiredSoundTracks = this.soundTrackPaths.length;
};

music.prototype.loadEvent = function(self)
{
	this.removeEventListener("canplaythrough", this.eventHandler, false);
	self.loadedSoundTracks++;
};

music.prototype.checkSoundTracks = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	//checking if all Sfx have been loaded. Once all loaded run init
	if(this.loadedSoundTracks >= this.requiredSoundTracks)
	{
		gameUI.loadingBarUpdate(this.loadedSoundTracks, this.requiredSoundTracks);
		gameUI.loadingBarReset('Loading Assets.. ');
		//starting game menu
		initObjects();
		checkObjects();
	}
	else
	{
		gameUI.loadingBarUpdate(this.loadedSoundTracks, this.requiredSoundTracks);
		setTimeout(function()
		{
			self.checkSoundTracks();
		}, 1);
	}
};

music.prototype.playTrack = function (track, loop)
{ 
	this.soundTracks[track].play();
	this.soundTracks[track].loop = loop;
};

music.prototype.pauseAll = function ()
{ 
	for(var t in this.soundTracks)
	{
		this.soundTracks[t].pause();
	}
};

music.prototype.resumeGame = function ()
{ 
	if (game.seconds <= 14)
	{
		this.playTrack('tune1', true);
	}
	else if (!game.bossUp)
	{
		this.playTrack('tune1', true);
		this.playTrack('tune2', true);
	}
	else if (game.bossUp)
	{
		this.playTrack('boss', true);
	}
};

music.prototype.chromiumFix = function ()
{
	//playing chached sfx once onclick
	for (var t in this.soundTracks)
	{
		this.soundTracks[t].volume = 0;
		this.soundTracks[t].play();
		this.soundTracks[t].pause();
		this.soundTracks[t].volume = 1;
	}
};

music.prototype.init = function ()
{ 
	var self = this.self;
	
	for(var i in this.soundTrackPaths)
	{
		var soundTracks = new Audio(); //defining soundTracks as a new Audio
		soundTracks.src = this.soundTrackPaths[i];

		var soundTracksIndex = soundTracks.src.split("/").pop(); //obtaining file name from path
		soundTracksIndex = soundTracksIndex.replace(/\.[^/.]+$/, "");

		this.soundTracks[soundTracksIndex] = soundTracks; //defining this.soundTracks[soundTracksIndex] as a new Audio (with this.soundTrackPaths)

		if(audiopreload)
		{
			this.soundTracks[soundTracksIndex].eventHandler = self.loadEvent.bind(this.soundTracks[soundTracksIndex], self);
			this.soundTracks[soundTracksIndex].preload = "auto";
			//checking if st's have loaded
			this.soundTracks[soundTracksIndex].addEventListener("canplaythrough", this.soundTracks[soundTracksIndex].eventHandler, false);
		}
		else
		{
			this.loadedSoundTracks++;
		}
	}
	
	this.checkSoundTracks();
};

var gameMusic = new music();
