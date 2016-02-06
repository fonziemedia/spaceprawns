var particle = function(x, y, speed, direction, grav)
{
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.direction = direction;
	this.vx = Math.cos(this.direction) * (this.speed*dt);
	this.vy = Math.sin(this.direction) * (this.speed*dt);
	this.mass = 1;
	this.radius = 0;
	this.bounce = -1;
	this.friction = 1;
	this.gravity = grav || 0;
	this.springs = [];
	this.gravitations = [];
};

particle.prototype.update = function()
{
	if (dt === 0)
	{ //setting speed according to delta time if not yet set (might not be a perfect solution to the problem of friction and gravity - with this if statement we avoid reseting vx and vy all the time)
		this.vx = Math.cos(this.direction) * (this.speed*dt);
		this.vy = Math.sin(this.direction) * (this.speed*dt);
	}
	this.handleSprings();
	this.handleGravitations();
	this.vx *= this.friction;
	this.vy *= this.friction;
	this.vy += this.gravity;
	this.x += this.vx;
	this.y += this.vy;
};

particle.prototype.angleTo = function(p2)
{
	return Math.atan2(p2.y - this.y, p2.x - this.x);
};

// particle.prototype.addGravitation = function(p)
//{
// 	this.removeGravitation(p);
// 	this.gravitations.push(p);
//};

// particle.prototype.removeGravitation = function(p)
//{
// 	for(var i = 0; i < this.gravitations.length; i += 1)
//	{
// 		if(p === this.gravitations[i])
//		{
// 			this.gravitations.splice(i, 1);
// 			return;
// 		}
// 	}
//};

// particle.prototype.addSpring = function(point, k, length)
//{
// 	this.removeSpring(point);
// 	this.springs.push({
// 		point: point,
// 		k: k,
// 		length: length || 0
// 	});
//};

// particle.prototype.removeSpring = function(point)
//{
// 	for(var i = 0; i < this.springs.length; i += 1)
//	{
// 		if(point === this.springs[i].point)
//		{
// 			this.springs.splice(i, 1);
// 			return;
// 		}
// 	}
//};

// particle.prototype.getSpeed = function()
//{
// 	return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
//};

// particle.prototype.setSpeed = function(speed)
//{
// 	var heading = this.getHeading();
// 	this.vx = Math.cos(heading) * speed;
// 	this.vy = Math.sin(heading) * speed;
//};

// particle.prototype.getHeading = function()
//{
// 	return Math.atan2(this.vy, this.vx);
//};

// particle.prototype.setHeading = function(heading)
//{
// 	var speed = this.getSpeed();
// 	this.vx = Math.cos(heading) * speed;
// 	this.vy = Math.sin(heading) * speed;
//};

// particle.prototype.accelerate = function(ax, ay)
//{
// 	this.vx += ax;
// 	this.vy += ay;
//};

// particle.prototype.handleGravitations = function()
//{
// 	for(var i = 0; i < this.gravitations.length; i += 1)
//	{
// 		this.gravitateTo(this.gravitations[i]);
// 	}
//};

// particle.prototype.handleSprings = function()
//{
// 	for(var i = 0; i < this.springs.length; i += 1)
//  {
// 	var spring = this.springs[i];
// 	this.springTo(spring.point, spring.k, spring.length);
// 	}
//};

// particle.prototype.distanceTo = function(p2)
//{
// 	var dx = p2.x - this.x,
// 	dy = p2.y - this.y;

// 	return Math.sqrt(dx * dx + dy * dy);
//};

// particle.prototype.gravitateTo = function(p2)
//{
// 	var dx = p2.x - this.x,
// 	dy = p2.y - this.y,
// 	distSQ = dx * dx + dy * dy,
// 	dist = Math.sqrt(distSQ),
// 	force = p2.mass / distSQ,
// 	ax = dx / dist * force,
// 	ay = dy / dist * force;

// 	this.vx += ax;
// 	this.vy += ay;
//};

// particle.prototype.springTo = function(point, k, length)
//{
// 	var dx = point.x - this.x,
// 	dy = point.y - this.y,
// 	distance = Math.sqrt(dx * dx + dy * dy),
// 	springForce = (distance - length || 0) * k;
// 	this.vx += dx / distance * springForce;
// 	this.vy += dy / distance * springForce;
//};
