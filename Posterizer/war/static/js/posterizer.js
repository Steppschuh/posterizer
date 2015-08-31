
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
		scaledTile = Object.create(tile);
		scaledTile.x = scaleFactor * scaledTile.x;
		scaledTile.y = scaleFactor * scaledTile.y;
		scaledTile.width = scaleFactor * this.targetTileWidthPX;
		scaledTile.height = scaleFactor * this.targetTileHeightPX;
		return scaledTile;
	},

	refreshRenderings: function(rasterize) {
		if (rasterize) {
			this.rasterizeImage();
		}
		this.renderSetupCanvas();
	},

	rasterizeImage: function() {
		console.log("Rasterizing image");

		if (this.sourceImage == null) {
			console.log("No sourceimage defined");
			return;
		}

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
			console.log("Image not yet rasterized");
			this.rasterizeImage();
		}

		console.log("Rendering image to canvas");

		var previewCanvasWrapper = document.getElementById('setupCanvasWrapper');
		var previewCanvas = document.getElementById('setupCanvas');
		var previewCanvasContext = previewCanvas.getContext('2d');

		// resize canvas
		previewCanvas.width = previewCanvasWrapper.offsetWidth;
		previewCanvas.height = previewCanvasWrapper.offsetHeight;
		
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

window.addEventListener('resize', function(event){
  rasterbation.refreshRenderings(false);
});

function initRasterbation() {

	var tilePresetSelector = document.getElementById("tilePresetSelector");
	tilePresetSelector.onchange = function() {
		var tileOrientationSelector = document.getElementById("tileOrientationSelector");
		var orientation = tileOrientationSelector.value;
		var portrait = orientation == "portrait";

		var tileSizePresetContainer = document.getElementById("tileSizePresetContainer");
		var tileSizeCustomContainer = document.getElementById("tileSizeCustomContainer");

		var value = tilePresetSelector.value;

		if (value == "custom") {
			tileSizePresetContainer.style.display = "none";
			tileSizeCustomContainer.style.display = "block";
			
			rasterbation.targetTileWidth = 5;
			rasterbation.targetTileHeight = 5;
		} else {
			tileSizePresetContainer.style.display = "block";
			tileSizeCustomContainer.style.display = "none";

			if (value == "a4") {
				if (portrait) {
					rasterbation.targetTileWidth = 8.27;
					rasterbation.targetTileHeight = 11.69;
				} else {
					rasterbation.targetTileWidth = 11.69;
					rasterbation.targetTileHeight = 8.27;
				}
			} else if (value == "a3") {
				if (portrait) {
					rasterbation.targetTileWidth = 11.69;
					rasterbation.targetTileHeight = 16.53;
				} else {
					rasterbation.targetTileWidth = 16.53;
					rasterbation.targetTileHeight = 11.69;
				}
			} else if (value == "usletter") {
				if (portrait) {
					rasterbation.targetTileWidth = 8.5;
					rasterbation.targetTileHeight = 11;
				} else {
					rasterbation.targetTileWidth = 11;
					rasterbation.targetTileHeight = 8.5;
				}
			} else if (value == "uslegal") {
				if (portrait) {
					rasterbation.targetTileWidth = 8.5;
					rasterbation.targetTileHeight = 14;
				} else {
					rasterbation.targetTileWidth = 14;
					rasterbation.targetTileHeight = 8.5;
				}
			}
		}

		rasterbation.refreshRenderings(true);
	};
	tilePresetSelector.onchange();

	var tileOrientationSelector = document.getElementById("tileOrientationSelector");
	tileOrientationSelector.onchange = function() {
		document.getElementById("tilePresetSelector").onchange();
	}

	var horizontalTilesCount = document.getElementById("horizontalTilesCount");
	horizontalTilesCount.onchange = function() {
		rasterbation.horizontalTilesCount = parseInt(horizontalTilesCount.value);
		rasterbation.refreshRenderings(true);
	};
	rasterbation.horizontalTilesCount = parseInt(horizontalTilesCount.value);

	var verticalTilesCount = document.getElementById("verticalTilesCount");
	verticalTilesCount.onchange = function() {
		rasterbation.verticalTilesCount = parseInt(verticalTilesCount.value);
		rasterbation.refreshRenderings(true);
	};
	rasterbation.verticalTilesCount = parseInt(verticalTilesCount.value);
	


	rasterbation.targetTileWidthPX = null;
	rasterbation.targetTileHeightPX = null;
	rasterbation.targetTileDPI = 300;

	rasterbation.sourceImage = null;
	rasterbation.sourceImageRaster = null;
	rasterbation.sourceImageScaleFactor = 1;
	rasterbation.sourceImageSwatches = null;
}

/*
	Helper functions
*/
function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function mmToInches(mm) {
	return mm * 0.039;
}

function inchesToMm(inches) {
	return inches * 25.4;
}