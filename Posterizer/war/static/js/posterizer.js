
var rasterbation = {
	horizontalTilesCount: null,
	verticalTilesCount: null,
	targetTileWidthPX: null,
	targetTileHeightPX: null,
	targetTileWidth: null,
	targetTileHeight: null,
	targetTileDPI: 300,

	sourceImage: null,
	sourceImageRaster: null,
	sourceImageScaleFactor: null,
	sourceImagePreviewScaleFactor: 5,
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

	    	rasterbation.createImageSwatches();

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
			image.width = 400;
			image.height = 400;
			image.crossOrigin = "Anonymous";

			image.onload = function() {
				try {
					var vibrant = new Vibrant(image);
					rasterbation.sourceImageSwatches = vibrant.swatches()
					console.log(rasterbation.sourceImageSwatches);
					console.log("Vibrant color: " + rasterbation.getSwatchHex("Vibrant"));
					//rasterbation.getSwatch("Vibrant").getHex();
					//getTitleTextColor();

					rasterbation.refreshRenderings(false);
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

	getSwatchHex: function(name, defaultColor) {
		var swatch = this.getSwatch(name);
		if (swatch != null) {
			return swatch.getHex();
		} else {
			return defaultColor;
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
		this.renderPreviewCanvas();
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

		console.log("Rendering setup image");

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

	renderPreviewCanvas: function() {
		if (this.sourceImage == null) {
			console.log("No sourceimage defined");
			return;
		}

		if (this.sourceImageRaster == null) {
			console.log("Image not yet rasterized");
			this.rasterizeImage();
		}

		console.log("Rendering preview image");

		var previewCanvasWrapper = document.getElementById('previewCanvasWrapper');
		var previewCanvas = document.getElementById('previewCanvas');
		var previewCanvasContext = previewCanvas.getContext('2d');

		// resize canvas
		previewCanvas.width = previewCanvasWrapper.offsetWidth;
		previewCanvas.height = previewCanvasWrapper.offsetHeight;
		
		var wallColor = "rgba(240, 240, 240, 1)";
		var floorColor = "rgba(200, 200, 200, 1)";
		var borderColor = "rgba(100, 100, 100, 1)";
		var transparentColor = "rgba(255, 255, 255, 0)";

		// try to adjust colors if swatches are available
		if (this.sourceImageSwatches != null) {
			swatch = this.getSwatch("LightVibrant");
			if (swatch != null) {
				var swatchRGB = swatch.getRgb();
				// make sure that the color is not too dark
				if (swatchRGB[0] + swatchRGB[1] + swatchRGB[2] < 100) {
					swatchRGB = modifyRgbByFactor(swatchRGB, 2.5);
				}
				wallColor = "rgba(" + swatchRGB[0] + "," + swatchRGB[1] + "," + swatchRGB[2] + ", 0.1)";
				console.log("Wall color updated to: " + wallColor);
			}

			swatch = this.getSwatch("DarkMuted");
			if (swatch != null) {
				var swatchRGB = swatch.getRgb();				
				borderColor = "rgba(" + swatchRGB[0] + "," + swatchRGB[1] + "," + swatchRGB[2] + ", 1)";
				console.log("Border color updated to: " + borderColor);

				floorColor = "rgba(" + swatchRGB[0] + "," + swatchRGB[1] + "," + swatchRGB[2] + ", 0.2)";
				console.log("Floor color updated to: " + floorColor);
			}
			
		}

		// draw background
		previewCanvasContext.fillStyle = wallColor;
		previewCanvasContext.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

		// draw baseline
		var baselineMarginBottom = 50;
		var baselineHeight = inchesToPreviewPixels(2);

		previewCanvasContext.setTransform(1, 0, 0, 1, 0, previewCanvas.height - baselineMarginBottom);
		previewCanvasContext.fillStyle = borderColor;
		previewCanvasContext.fillRect(0, -baselineHeight, previewCanvas.width, baselineHeight);

		previewCanvasContext.save();

		// draw floor
		previewCanvasContext.fillStyle = floorColor;
		previewCanvasContext.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

		// draw door
		var doorMarginLeft = 110;
		var doorHeight = inchesToPreviewPixels(80.315);
		var doorWidth = inchesToPreviewPixels(32.2835);
		var doorFrameWidth = inchesToPreviewPixels(2);

		previewCanvasContext.translate(doorMarginLeft, 0);

		// draw door frame
		previewCanvasContext.fillStyle = borderColor;
		previewCanvasContext.fillRect(-doorFrameWidth, -doorHeight - doorFrameWidth, doorWidth + doorFrameWidth + doorFrameWidth, doorHeight + doorFrameWidth);

		// draw door wood
		previewCanvasContext.fillStyle = "rgba(255, 255, 255, 1)";
		previewCanvasContext.fillRect(0, -doorHeight, doorWidth, doorHeight);

		previewCanvasContext.restore();

		// draw images
		var imageMarginLeft = inchesToPreviewPixels(30);
		var imageMarginBottom = inchesToPreviewPixels(40);
		var imageTileMargin = inchesToPreviewPixels(1);
		var imageTileWidth = inchesToPreviewPixels(this.targetTileWidth);
		var imageTileHeight = inchesToPreviewPixels(this.targetTileHeight);

		previewCanvasContext.translate(doorMarginLeft + doorWidth + imageMarginLeft, -imageMarginBottom);

		previewCanvasContext.fillStyle = "rgba(200, 200, 200, 0.5)";
		
		// iterate over rows, starting from the bottom
		for (var tileRow = this.verticalTilesCount - 1; tileRow >= 0; tileRow--) {
			// iterate over collumns, starting from the left
			for (var tileCol = 0; tileCol < this.horizontalTilesCount; tileCol++) {
				previewCanvasContext.save();

				var tileIndex = (tileRow * this.horizontalTilesCount) + tileCol;
				var tile = this.sourceImageRaster[tileIndex];
				tile = this.scaleTile(tile, 1 / this.sourceImageScaleFactor);

				//console.log("Tile at " + tileCol + "|" + tileRow + " has index " + tileIndex);

				var horizontalOffset = (tileCol * (imageTileWidth + imageTileMargin)) + imageTileMargin;
				var verticalOffset = ((this.verticalTilesCount - 1 - tileRow) * (imageTileHeight + imageTileMargin)) + imageTileMargin;
				//var verticalOffset = (tileRow * (imageTileHeight + imageTileMargin)) + imageTileMargin;

				previewCanvasContext.translate(horizontalOffset, -verticalOffset);

				previewCanvasContext.fillRect(0, -imageTileHeight, imageTileWidth, imageTileHeight);

				previewCanvasContext.drawImage(this.sourceImage, tile.x, tile.y, tile.width, tile.height, 0, -imageTileHeight, imageTileWidth, imageTileHeight);

				previewCanvasContext.restore();
			}
		}


		previewCanvasContext.resetTransform();

		// draw gradients to fade out edges
		var fadeOutAmountLeft = 100;
		var fadeOutAmountRight = 300;
		var fadeOutAmountTop = 50;
		var fadeOutAmountBottom = 0;

		// left edge		
		var grd = previewCanvasContext.createLinearGradient(0, 0, fadeOutAmountLeft, 0);
		grd.addColorStop(1, transparentColor);
		grd.addColorStop(0, "#FFFFFF");

		previewCanvasContext.fillStyle = grd;
		previewCanvasContext.fillRect(0, 0, fadeOutAmountLeft, previewCanvas.height);
		
		// right edge
		var grd = previewCanvasContext.createLinearGradient(previewCanvas.width - fadeOutAmountRight, 0, previewCanvas.width, 0);
		grd.addColorStop(0, transparentColor);
		grd.addColorStop(1, "#FFFFFF");

		previewCanvasContext.fillStyle = grd;
		previewCanvasContext.fillRect(previewCanvas.width - fadeOutAmountRight, 0, fadeOutAmountRight, previewCanvas.height);
		
		// top edge
		var grd = previewCanvasContext.createLinearGradient(0, 0, 0, fadeOutAmountTop);
		grd.addColorStop(1, transparentColor);
		grd.addColorStop(0, "#FFFFFF");

		previewCanvasContext.fillStyle = grd;
		previewCanvasContext.fillRect(0, 0, previewCanvas.width, fadeOutAmountTop);
		
		// bottom edge
		var grd = previewCanvasContext.createLinearGradient(0, previewCanvas.height - fadeOutAmountBottom, 0, previewCanvas.height);
		grd.addColorStop(0, transparentColor);
		grd.addColorStop(1, "#FFFFFF");

		previewCanvasContext.fillStyle = grd;
		previewCanvasContext.fillRect(0, previewCanvas.height - fadeOutAmountBottom, previewCanvas.width, previewCanvas.height);
		
	}	
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
	
	var tileUnitSelector = document.getElementById("tileUnitSelector");
	tileUnitSelector.onchange = function() {
		var tileWidth = document.getElementById("tileWidth");
		var tileHeight = document.getElementById("tileHeight");
		if (tileUnitSelector.value == "cm") {
			rasterbation.targetTileWidth = mmToInches(parseInt(tileWidth.value) * 10);
			rasterbation.targetTileHeight = mmToInches(parseInt(tileHeight.value) * 10);
		} else {
			rasterbation.targetTileWidth = parseInt(tileWidth.value);
			rasterbation.targetTileHeight = parseInt(tileHeight.value);
		}		
		rasterbation.refreshRenderings(true);
	};

	var tileWidth = document.getElementById("tileWidth");
	tileWidth.onchange = function() {
		var tileUnitSelector = document.getElementById("tileUnitSelector");
		if (tileUnitSelector.value == "cm") {
			rasterbation.targetTileWidth = mmToInches(parseInt(tileWidth.value) * 10);
		} else {
			rasterbation.targetTileWidth = parseInt(tileWidth.value);
		}
		rasterbation.refreshRenderings(true);
	};

	var tileHeight = document.getElementById("tileHeight");
	tileHeight.onchange = function() {
		var tileUnitSelector = document.getElementById("tileUnitSelector");
		if (tileUnitSelector.value == "cm") {
			rasterbation.targetTileHeight = mmToInches(parseInt(tileHeight.value) * 10);
		} else {
			rasterbation.targetTileHeight = parseInt(tileHeight.value);
		}
		rasterbation.refreshRenderings(true);
	};

	
}

/*
	Helper functions
*/
function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function modifyRgbByFactor(rgb, factor) {
	var r = Math.min(Math.max(Math.round(rgb[0] * factor), 0), 255);
	var g = Math.min(Math.max(Math.round(rgb[1] * factor), 0), 255);
	var b = Math.min(Math.max(Math.round(rgb[2] * factor), 0), 255);
	return [r, g, b];
}

function mmToInches(mm) {
	return mm * 0.039;
}

function inchesToMm(inches) {
	return inches * 25.4;
}

function inchesToPreviewPixels(inches) {
	return inches * rasterbation.sourceImagePreviewScaleFactor;
}