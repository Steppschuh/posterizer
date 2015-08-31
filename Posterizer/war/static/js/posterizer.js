

var rasterbation = {
	horizontalTilesCount: null,
	verticalTilesCount: null,
	targetTileWidthPX: null,
	targetTileHeightPX: null,
	targetTileWidth: null,
	targetTileHeight: null,
	targetTileDPI: null,

	sourceImage: null,
	sourceImageRaster: null,
	sourceImageScaleFactor: null,
	sourceImageSwatches: null,

	calculateNeededPX: function() {
		this.targetTileWidthPX = this.targetTileWidth * this.targetTileDPI;
		this.targetTileHeightPX = this.targetTileHeight * this.targetTileDPI;
	},

	setImage: function(imageUrl, callback) {
		var sourceImage = new Image();
	    sourceImage.onload = function() {
	    	rasterbation.sourceImage = this;

	    	console.log("Image loaded: " + this.src);

	    	if (callback != null) {
	    		callback();
	    	}
	    };

	    //sourceImage.crossOrigin = "Anonymous";
	    sourceImage.src = imageUrl;
	},

	createImageSwatches: function() {
		console.log("Creating image swatches");

		try {
			var image = new Image();
			image.width = 200;
			image.height = 200;
			image.crossOrigin = "Anonymous";

			image.onload = function() {
				try {
					var vibrant = new Vibrant(image);
					rasterbation.sourceImageSwatches = vibrant.swatches()
					console.log(rasterbation.sourceImageSwatches);
					console.log("Vibrant color: " + rasterbation.getSwatchHex("Vibrant"));
					//rasterbation.getSwatch("Vibrant").getHex();
					//getTitleTextColor();
				} catch(ex) {
					console.log("Unable to create swatches");
					console.log(ex);
				}
		    };

			image.src = this.sourceImage.src;
		} catch(ex) {
			console.log("Unable to create swatches, most likely because of Cross-Origin Resource Sharing");
			console.log(ex);
		}
	},

	getSwatch: function(name) {
		if (this.sourceImageSwatches == null) {
			return null;
		}
		/* available swatches:
			Vibrant
			Muted
			DarkVibrant
			DarkMuted
			LightVibrant
		*/
		for (swatch in this.sourceImageSwatches) {
			if (this.sourceImageSwatches.hasOwnProperty(swatch) && this.sourceImageSwatches[swatch]) {
				if (swatch === name) {
					return this.sourceImageSwatches[swatch];
				}
				
			}
		}
	},

	getSwatchHex: function(name) {
		var swatch = this.getSwatch(name);
		if (swatch != null) {
			return swatch.getHex();
		} else {
			return "#999999";
		}
	},

	scaleTile: function(tile, scaleFactor) {
		tile.x = scaleFactor * tile.x;
		tile.y = scaleFactor * tile.y;
		tile.width = scaleFactor * this.targetTileWidthPX;
		tile.height = scaleFactor * this.targetTileHeightPX;
		return tile;
	},

	rasterizeImage: function() {
		console.log("Rasterizing image");

		// reset existing raster
		this.sourceImageRaster = [];

		// calculate the original image aspect ratio
		var imageGCD = gcd(this.sourceImage.width, this.sourceImage.height);
		var imageWidthRatio = this.sourceImage.width / imageGCD;
		var imageHeightRatio = this.sourceImage.height / imageGCD;
		var imageRatio = imageWidthRatio / imageHeightRatio;

		console.log("Image size: " + this.sourceImage.width + "x" + this.sourceImage.height);
		console.log("Image aspect ratio: " + imageWidthRatio + ":" + imageHeightRatio + " = " + imageRatio);

		// calculate the needed tile resolution for print quality
		this.calculateNeededPX();

		// calculate the tiled image aspect ratio
		var totalTilesWidth = this.targetTileWidthPX * this.horizontalTilesCount;
		var totalTilesHeight = this.targetTileHeightPX * this.verticalTilesCount;
		
		var tilesGCD = gcd(totalTilesWidth, totalTilesHeight);
		var tilesWidthRatio = totalTilesWidth / tilesGCD;
		var tilesHeightRatio = totalTilesHeight / tilesGCD;
		var tilesRatio = tilesWidthRatio / tilesHeightRatio;

		console.log("Tiles size: " + totalTilesWidth + "x" + totalTilesHeight);
		console.log("Tiles aspect ratio: " + tilesWidthRatio + ":" + tilesHeightRatio + " = " + tilesRatio);

		// decide if tiles should fill the width or height of the original image
		var fillImageWidth = imageRatio <= tilesRatio;
		if (fillImageWidth) {
			this.sourceImageScaleFactor = totalTilesWidth / this.sourceImage.width;
		} else {
			this.sourceImageScaleFactor = totalTilesHeight / this.sourceImage.height;
		}

		// scale image to match tiles size
		var scaledImageWidth = Math.round(this.sourceImage.width * this.sourceImageScaleFactor);
		var scaledImageHeight = Math.round(this.sourceImage.height * this.sourceImageScaleFactor);
		console.log("Image scale factor: " + this.sourceImageScaleFactor + " (new image size: " + scaledImageWidth + "x" + scaledImageHeight + ")");

		// calculate margins to center tiles in image (one of them should be 0)
		var tilesHorizontalMargin = (scaledImageWidth - totalTilesWidth) / 2;
		var tilesVerticalMargin = (scaledImageHeight - totalTilesHeight) / 2;
		
		// calculate tile positions in scaled image		
		var tile;
		var tileX;
		var tileY;
		for (var verticalTileIndex = 0; verticalTileIndex < this.verticalTilesCount; verticalTileIndex++) {
			for (var horizontalTileIndex = 0; horizontalTileIndex < this.horizontalTilesCount; horizontalTileIndex++) {
				tile = new Object();
				tile.x = tilesHorizontalMargin + (horizontalTileIndex * this.targetTileWidthPX);
				tile.y = tilesVerticalMargin + (verticalTileIndex * this.targetTileHeightPX);
				tile.width = this.targetTileWidthPX;
				tile.height = this.targetTileHeightPX;
				tile.horizontalIndex = horizontalTileIndex;
				tile.verticalIndex = verticalTileIndex;
				
				this.sourceImageRaster.push(tile);
			}
		}

		// sourceImageRaster is now an array of tile positions
		// each tile has the same dimensions
		console.log("Rasterization done, " + this.sourceImageRaster.length + " tiles created");
		console.log(this.sourceImageRaster);
	},

	renderSetupCanvas: function() {
		if (this.sourceImage == null) {
			console.log("No sourceimage defined");
			return;
		}

		if (this.sourceImageRaster == null) {
			this.rasterizeImage();
		}

		console.log("Rendering image to canvas");

		var previewCanvas = document.getElementById('setupCanvas');
		var previewCanvasContext = previewCanvas.getContext('2d');

		// resize canvas
		previewCanvas.width = 300;
		previewCanvas.height = 300;
		
		var previewScaleFactor;
		var imageRatio = this.sourceImage.width / this.sourceImage.height;
		var canvasRatio = previewCanvas.width / previewCanvas.height;
		if (imageRatio >= canvasRatio) {
			// fill width, resize height
			previewScaleFactor = previewCanvas.width / (this.sourceImageScaleFactor * this.sourceImage.width);
		} else {
			// fill height, resize width
			previewScaleFactor = previewCanvas.height / (this.sourceImageScaleFactor * this.sourceImage.height);
		}

		// translate the origin to center the preview on canvas
		var previewHorizontalMargin = (previewCanvas.width - (this.sourceImage.width * this.sourceImageScaleFactor * previewScaleFactor)) / 2;
		var previewVerticalMargin = (previewCanvas.height - (this.sourceImage.height * this.sourceImageScaleFactor * previewScaleFactor)) / 2;
		previewCanvasContext.translate(previewHorizontalMargin, previewVerticalMargin);

		// draw image
	    previewCanvasContext.drawImage(this.sourceImage, 0, 0, this.sourceImage.width * this.sourceImageScaleFactor * previewScaleFactor, this.sourceImage.height * this.sourceImageScaleFactor * previewScaleFactor);

	    // draw tiles grid
	    previewCanvasContext.strokeStyle = "#000000";
	    for (var tileIndex = 0; tileIndex < this.sourceImageRaster.length; tileIndex++) {
	    	var tile = this.scaleTile(this.sourceImageRaster[tileIndex], previewScaleFactor);
	    	previewCanvasContext.strokeRect(tile.x, tile.y, tile.width, tile.height);
	    }

	    // overlay solid
	    //previewCanvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";
		//previewCanvasContext.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
	},
};

function initRasterbation() {
	rasterbation.horizontalTilesCount = 5;
	rasterbation.verticalTilesCount = 3;
	rasterbation.targetTileWidthPX = null;
	rasterbation.targetTileHeightPX = null;
	rasterbation.targetTileWidth = 5;
	rasterbation.targetTileHeight = 5;
	rasterbation.targetTileDPI = 300;

	rasterbation.sourceImage = null;
	rasterbation.sourceImageRaster = null;
	rasterbation.sourceImageScaleFactor = 1;
	rasterbation.sourceImageSwatches = null;
}

function createImagePreviewOnCanvas(image, canvas) {
	console.log("Rendering image to canvas");

	console.log("Image size: " + image.width + " x " + image.height);
	var r = gcd (image.width, image.height);
	console.log("Image aspect ratio: " + image.width/r + ":" + image.height/r);

	var context = canvas.getContext('2d');
	//draw background image
    context.drawImage(image, 0, 0);
    //draw a box over the top
    context.fillStyle = "rgba(200, 0, 0, 0.5)";
    context.fillRect(0, 0, 50, 50);
}

function getVibrantColor() {
	var vibrant = new Vibrant(cardImage);
	var swatches = vibrant.swatches()

	var tagsDiv = cardImage.parentNode.parentNode
			.getElementsByClassName("card-tags")[0];
	tagsDiv.style.opacity = 0.9;
	var tags = tagsDiv.getElementsByTagName("li");

	for (swatch in swatches) {
		if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
			if (swatch === "DarkMuted") {
				for (var j = 0; j < tags.length; j++) {
					tags[j].style.backgroundColor = swatches[swatch]
							.getHex();
					tags[j].getElementsByTagName("a")[0].style.color = swatches[swatch]
							.getTitleTextColor();
				}
			}
			/*
			 * Vibrant #7a4426 Muted #7b9eae DarkVibrant
			 * #348945 DarkMuted #141414 LightVibrant
			 * #f3ccb4
			 */
		}
	}
}

/*
	Helper functions
*/
function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}