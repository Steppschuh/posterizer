<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
	<head>
		<title>Rasterbator</title>
		<%@include file="../includes/en/common_head.jsp"%>

		<!-- Page specific CSS -->
		<link href="${staticUrl}css/dropzone.css" type="text/css" rel="stylesheet" media="screen,projection" />
		
		<script type="text/javascript">
		    function loaded() {
		      // read URL parameters & cookies
		      restoreConfig();

		      // register listeners & create objects      
		      initRasterbation();

		      // load sample image
		      var imageLoadedCallback = function() {
		        rasterbation.refreshRenderings();
		      }
		      rasterbation.setImage(rasterbation.sampleImageUrl, imageLoadedCallback);
		    }
		</script>
	</head>
	
	<body onload="loaded();">
		<%@include file="../includes/en/common_navigation.jsp"%>
	
		<main>


	      <div class="container">
	        <h4>Rasterbator</h4>
	        <p>The rasterbator allows you to create posters larger than a standard page, using the tiled printing method. It will rasterize any image and output files that can be printed at home and reassemble to the original image. Inspired by the original <a href="http://arje.net/rasterbator" target="_blank">rasterbator application</a>.</p>
	        <div class="divider"></div>
	        <div class="section">
	          <h5>Select your image</h5>
	          <form action="#" class="dropzone" id="imageDropzone"></form>
	        </div>

	        <div class="divider"></div>
	        <div class="section">
	          <h5>Page setup</h5>
	          <p>Set the desired size of a single tile and the amount of tiles that you want to print. Choose "Custom" to use specific dimesnions. Keep in mind that your image will be scaled to fill all tiles, so make sure that you provide a high resolution image.</p>

	          <div class="row">

	            <div class="col s12 m8 l6">
	              
	              <div class="row">
	                <p>Tile dimensions</p>
	                <div class="input-field col s3">
	                  <select id="tilePresetSelector">
	                    <option value="a4" selected>A4</option>
	                    <option value="a3">A3</option>
	                    <option value="letter">US letter</option>
	                    <option value="legal">US legal</option>
	                    <option value="custom">Custom</option>
	                  </select>
	                  <label>Size</label>
	                </div>

	                <div id="tileSizePresetContainer">
	                  <div class="input-field col s3">
	                    <select id="tileOrientationSelector">
	                      <option value="portrait" selected>Portrait</option>
	                      <option value="landscape">Landscape</option>
	                    </select>
	                    <label>Orientation</label>
	                  </div>
	                </div>

	                <div id="tileSizeCustomContainer">
	                  <div class="input-field col s3">
	                    <input value="15" id="tileWidth" type="number" min="1" max="10000">
	                    <label class="active" for="tileWidth">Width</label>
	                  </div>
	                  <div class="input-field col s3">
	                    <input value="15" id="tileHeight" type="number" min="1" max="10000">
	                    <label class="active" for="tileHeight">Height</label>
	                  </div>
	                  <div class="input-field col s3">
	                    <select id="tileUnitSelector">
	                      <option value="in">Inches</option>
	                      <option value="cm" selected>Centimeters</option>
	                    </select>
	                    <label>Unit</label>
	                  </div>
	                </div>

	              </div>

	              <div class="row">
	                <p>Tile count</p>
	                <div class="input-field col s3">
	                  <input value="7" id="horizontalTilesCount" type="number" min="1" max="100">
	                  <label class="active" for="horizontalTilesCount">Collumns</label>
	                </div>
	                <div class="input-field col s3">
	                  <input value="3" id="verticalTilesCount" type="number" min="1" max="100">
	                  <label class="active" for="verticalTilesCount">Rows</label>
	                </div>
	              </div>


	            </div>

	            <div class="col s12 m4 l6">
	              <div id="setupCanvasWrapper">
	                <canvas id="setupCanvas" width="300" height="300"></canvas>
	              </div>
	            </div>

	          </div>

	          
	        </div>

	        <div class="divider"></div>
	        <div class="section">
	          <h5>Preview</h5>
	          <p>This is how your rasterbation will look like in relation to a standard door (2m / 80in high).</p>
	          <div id="previewCanvasWrapper">
	            <canvas id="previewCanvas" width="300" height="300"></canvas>
	          </div>
	        </div>

	        <div class="section">
	          <h5>Download</h5>
	          <p>If you are happy with your rasterbation, download the rasterized image tiles. Export may takes a few seconds, depending on your page setup. Make sure that you have sufficent memory available, otherwise the export may not work properly.</p>

	          <div class="row">
	            <div class="col s12 m6">
	              <p>Export to PDF if you want to directly pass this rasterbation to your printer. Each page will contain an image tile at maximum quality.</p>
	              <a id="downloadPDFButton" class="waves-effect waves-light btn"><i class="material-icons left"></i>Create PDF</a>
	            </div>
	            <div class="col s12 m6">
	              <p>Export to JPG if you want to continue working on the image tiles. You will get a ZIP file containing uncompressed JPG files and assemble instructions.</p>
	              <a id="downloadJPGsButton" class="waves-effect waves-light btn"><i class="material-icons left"></i>Create JPGs</a>
	            </div>
	          </div>
	        </div>

	        <div class="divider"></div>
	        <div class="section">
	          <h5>Printing Instructions</h5>
	          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ipsum nunc, lacinia id facilisis id, egestas sed mi. Phasellus interdum lacinia sapien id cursus. Donec vitae erat et nisl iaculis imperdiet. Pellentesque vitae massa quis magna ullamcorper malesuada. Ut tempor tempor ante, non interdum mi sollicitudin vel. Suspendisse sit amet tortor sed purus consectetur dignissim molestie eu quam. Maecenas fringilla elit at tellus sodales aliquam.</p>
	        </div>
	      </div>

		</main>
		
		<!-- Page specific scripts -->
		<script src="${staticUrl}js/canvas-toBlob.js"></script>
		<script src="${staticUrl}js/jspdf.debug.js"></script>
		<script src="${staticUrl}js/jszip.js"></script>
		<script src="${staticUrl}js/dropzone.js"></script>
		<script src="${staticUrl}js/rasterbator.js"></script>

		<%@include file="../includes/en/common_footer.jsp"%>
		
	</body>
</html>
