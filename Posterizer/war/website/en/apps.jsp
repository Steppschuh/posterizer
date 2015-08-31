<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
	<head>
		<title>IntelliQ.me - Get the App</title>
		<%@include file="../includes/en/common_head.jsp"%>
	</head>
	
	<body>
		<%@include file="../includes/en/common_navigation.jsp"%>
	
		<main>
	
		<div id="index-banner" class="parallax-container">
			<div class="section no-pad-bot">
				<div class="container">
					<br>
					<br>
					<h1 class="header center white-text light">IntelliQ.me</h1>
					<div class="row center">
						<h5 class="header col s12 light">Get our free app for Android or iOS</h5>
	
					</div>
					<div class="row center">
						<a href="#" class="btn-large waves-effect waves-light accent-color">Smarter Waiting</a>
					</div>
					<br>
					<br>
	
				</div>
			</div>
			<div class="parallax primary-color">
				<img src="${staticUrl}images/queue_small.jpg">
			</div>
		</div>
	
	
		<div class="container">
			<div class="section">
	
				<div class="row">
					<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">phone_android</i>
							</h2>
							<h5 class="center">Android</h5>
	
							<p class="light center">Get IntelliQ for your Android smartphone or Wear device from the Play Store</p>
	
							<div class="row center">
								<a href="https://play.google.com/store/apps/details?id=com.steppschuh.intelliq" class="btn-large waves-effect waves-light primary-color">Google Play</a>
							</div>
						</div>
					</div>
	
					<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">phone_iphone</i>
							</h2>
							<h5 class="center">iOS</h5>
	
							<p class="light center">Visit the Apple App Store to get IntelliQ for your iPhone or Apple Watch.</p>
	
							<div class="row center">
								<a href="https://itunes.apple.com/pg/app/intelliq/id1019495717" class="btn-large waves-effect waves-light primary-color">iTunes</a>
							</div>
						</div>
					</div>
	
					<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">laptop_chromebook</i>
							</h2>
							<h5 class="center">Web</h5>
	
							<p class="light center">If you own a Google Chromebook you can get the IntelliQ Chrome extension.</p>
	
							<div class="row center">
								<a href="https://chrome.google.com/webstore/detail/intelliq/mbflidackmmffjigimaecbfkndgaaahd?hl=en" class="btn-large waves-effect waves-light primary-color">Chrome Store</a>
							</div>
						</div>
					</div>
				</div>
	
			</div>
		</div>
	
		<div id="modal-contact" class="modal">
			<div class="modal-content">
				<h4>Contact</h4>
				<p>If you want to learn more about IntelliQ, please get in touch at any time. We will get back to you as soon as possible.</p>
	
				<div class="row">
					<form class="col s12">
						<div class="row">
							<div class="input-field col s6">
								<input id="contact_first_name" type="text" class=""> <label for="contact_first_name">First name</label>
							</div>
							<div class="input-field col s6">
								<input id="contact_last_name" type="text" class=""> <label for="contact_last_name">Last name</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input id="contact_email" type="email" class=""> <label for="contact_email">Your e-mail address</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<textarea id="contact_message" class="materialize-textarea"></textarea>
								<label for="contact_message">Message</label>
							</div>
						</div>
					</form>
				</div>
	
			</div>
	
			<div class="modal-footer">
				<a href="javascript:submitContactForm();" class=" modal-action modal-close waves-effect waves-green btn-flat">Send</a>
			</div>
		</div>
	
		</main>
	
		<%@include file="../includes/en/common_footer.jsp"%>
	
	</body>
</html>
