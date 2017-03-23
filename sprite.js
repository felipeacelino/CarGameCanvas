function Sprite(x, y, width, height) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.draw = function(xCanvas, yCanvas) {

		ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);

	}
}

var street = new Sprite(70, 0, 219, 350);

var car1 = new Sprite(0, 0, 40, 81);
var car2 = new Sprite(0, 81, 40, 83);
var car3 = new Sprite(0, 164, 40, 83);