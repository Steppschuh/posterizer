<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
	<head>
		<title>IntelliQ.me - For Business</title>
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
						<h5 class="header col s12 light">
							The intelligent queue management system to get satisfied customers
						</h5>
	
					</div>
					<div class="row center">
						<a href="javascript:openContactForm();" class="btn-large waves-effect waves-light accent-color">Request Details</a>
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
	
				<!--   Icon Section   -->
				<div class="row">
					<div class="col s12 m6 l4">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">hourglass_empty</i>
							</h2>
							<h5 class="center">Less waiting time</h5>
	
							<p class="light">IntelliQ will let your customers know how many people are in front of them and provides an estimation about the remaining waiting time. 
							This way customers can use their time outside of your waiting room.
							Our app will let them know when it's time to get back to your business if they left your waiting room.</p>
						</div>
					</div>
	
					<div class="col s12 m6 l4">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">local_atm</i>
							</h2>
							<h5 class="center">Lower costs</h5>
	
							<p class="light">Existing ticketing solutions need maintenance and supplies of new printable paper. 
							IntelliQ causes no costs and doesn't need an proprietary hardware - it's an inexpensive and environmentally friendly solution even for large businesses.
							Initial costs for ticket dispensers and equipment can also be saved.</p>
						</div>
					</div>
	
					<div class="col s12 m12 l4">
						<div class="icon-block">
							<h2 class="center primary-color-text">
								<i class="material-icons">group_add</i>
							</h2>
							<h5 class="center">More satisfied customers</h5>
	
							<p class="light">Time spent in a waiting room will be perceived as unpleasant, no matter how well you furnish it.
							With IntelliQ your customers can spend their waiting time however they like and don't connect unpleasant feelings while waiting with your business.
							Being able to offer an estimation about remaining waiting time is a competitive advantage for your business.</p>
						</div>
					</div>
				</div>
	
			</div>
		</div>
	
		<div class="container hide">
			<div class="section">
	
				<div class="row">
					<div class="icon-block">
						<h5 class="center">Das Problem</h5>
	
						<p class="light">Pellentesque dolor mi, maximus eu sodales nec, sollicitudin vestibulum libero. Suspendisse potenti. Proin neque mi, gravida sit amet diam ut, pulvinar ornare libero.
							Curabitur in ligula eleifend, aliquet risus et, placerat enim. Donec dictum leo ut magna congue, at vulputate nunc finibus. Suspendisse potenti. Proin neque mi, gravida sit amet diam ut,
							pulvinar ornare libero. Curabitur in ligula eleifend, aliquet risus et, placerat enim. Donec dictum leo ut magna congue, at vulputate nunc finibus.</p>
					</div>
				</div>
			</div>
	
			<div class="row">
				<div class="icon-block">
					<h5 class="center">Die Lösung</h5>
	
					<p class="light">IntelliQ.me sed posuere felis. In blandit, ipsum et interdum volutpat, tellus tortor ultrices mi, luctus tincidunt purus sapien sed dui. Pellentesque dolor mi, maximus eu
						sodales nec, sollicitudin vestibulum libero. Suspendisse potenti. Proin neque mi, gravida sit amet diam ut, pulvinar ornare libero. Curabitur in ligula eleifend, aliquet risus et, placerat enim.
						Donec dictum leo ut magna congue, at vulputate nunc finibus. Suspendisse potenti. Proin neque mi, gravida sit amet diam ut, pulvinar ornare libero. Curabitur in ligula eleifend, aliquet risus et,
						placerat enim. Donec dictum leo ut magna congue, at vulputate nunc finibus.</p>
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
