//Note: UI images are powered by CSS (see CSS assets folder)
graphics = function()
{
	this.self = this;
	this.images = [];
	this.doneImages  = 0; // will contain how many images have been loaded
	this.offCtx = [];
	
	this.fileExtension = !game.isMobile || game.windowHeight > 900 ? ".dkt.png" : ".mob.png";
	
	this.imagePaths = !game.isMobile || game.windowHeight > 640 ? ["_img/bg_level1.dkt.jpg"]
	 : ["_img/bg_level1.mob.jpg"];

	this.imagePaths.push(
		//Player
		"_img/player_ship"+this.fileExtension,
		"_img/player_ship_i"+this.fileExtension,
		"_img/player_shields"+this.fileExtension,
		//Enemies
			////Pawns
			"_img/enemy_sectoid"+this.fileExtension,
			////Minibosses
			"_img/enemy_floater"+this.fileExtension,
			////Enemy Bases
			"_img/enemy_base_sectoid"+this.fileExtension,
			"_img/enemy_base_floater"+this.fileExtension,
			////Big bosses
			"_img/boss_sectoid"+this.fileExtension,
		//Projectiles
		"_img/bullet_p_laser"+this.fileExtension,
		"_img/bullet_p_missile"+this.fileExtension,
		"_img/bullet_e_missile"+this.fileExtension,
		"_img/explosion_s0"+this.fileExtension,
		"_img/explosion_s1"+this.fileExtension,
		"_img/explosion_s2"+this.fileExtension,
		"_img/explosion_s3"+this.fileExtension,
		"_img/explosion_s4"+this.fileExtension,
		//Loot
		"_img/loot_lasers"+this.fileExtension,
		"_img/loot_missiles"+this.fileExtension,
		"_img/loot_shields"+this.fileExtension
	);	
	
	this.requiredImages = this.imagePaths.length; // will contain how many images should be loaded
};

graphics.prototype.loadEvent = function(self)
{
	this.removeEventListener("load", this.eventHandler, false);
	
	var indexName, ctxName, offCanvas, offCtx;

	indexName = this.src.split("/").pop();
	indexName = indexName.substr(0, indexName.indexOf('.')) || indexName;

	offCanvas = doc.createElement('canvas');
	offCanvas.width = Math.round(this.width);
	offCanvas.height = Math.round(this.height);

	offCtx = offCanvas.getContext('2d');
	offCtx.drawImage(this, 0, 0, offCanvas.width, offCanvas.height);
	self.offCtx[indexName] = offCanvas;
	self.doneImages++;
};

graphics.prototype.checkImages = function() {	//checking if all images have been loaded. Once all loaded run initSfx
	var self = this.self;
	
	if(this.doneImages >= this.requiredImages){
		gameUI.loadingBarUpdate(this.doneImages, this.requiredImages);
		gameUI.loadingBarReset('Loading Sfx.. ');
		gameSfx.init();
	}
	else
	{
		gameUI.loadingBarUpdate(this.doneImages, this.requiredImages);
		setTimeout(function(){
			self.checkImages();
		}, 1);
	}
};

graphics.prototype.init = function() {
	
	var self = this.self;
	
	for(var i in this.imagePaths)
	{
		var img = new Image(); //defining img as a new image
		img.eventHandler = self.loadEvent.bind(img, self);

		img.addEventListener("load", img.eventHandler, false); // !event listner needs to be set before loading the image (defining .src)

		img.src = this.imagePaths[i];
		var imgIndex = img.src.split("/").pop(); //obtaining file name from path
		imgIndex = imgIndex.substr(0, imgIndex.indexOf('.')) || imgIndex;

		//!check if you should change this to object notation! you can't access array functions like this anyway
		this.images[imgIndex] = img; //defining this.image[index] as a new image (with this.imagePaths)
	}
	
	this.checkImages();
};

var gameGfx = new graphics();
