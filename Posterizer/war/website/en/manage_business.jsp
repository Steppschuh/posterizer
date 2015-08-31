<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
<head>
<title>IntelliQ.me - Manage</title>
<%@include file="../includes/de/common_head.jsp"%>

<script type="text/javascript">
	window.onload = function() {
		// update the business
		getBusiness(getCurrentBusinessKeyId());

		// keep updating
		//window.setInterval(requestQueueItems, REFRESH_INTERVAL);
	}
</script>

</head>

<body>
	<%@include file="../includes/de/common_navigation.jsp"%>

	<main>

	<div class="container">

		<div class="section">
			<h5>Business</h5>
			<div class="divider"></div>
			<div class="row">
				<div class="col s12 m6 l4">
					<div id="businessCard" class="card medium" style="display: none;">
						<div class="card-image waves-effect waves-block waves-light grey lighten-3">
							<div id="businessCardImage" class="card-image-div activator" style="background-size: contain;">&nbsp;</div>
						</div>
						<div class="card-content">
							<span id="businessCardTitle" class="card-title activator grey-text text-darken-4">Title<i class="material-icons right">more_vert</i></span> 
							<br /> 
							<span id="businessCardStatus" class="status">Status</span>
							<div class="card-action">
								<a id="businessCardEditButton" href="#">Edit</a>
							</div>
						</div>
						<div class="card-reveal">
							<span id="businessCardRevealTitle" class="card-title grey-text text-darken-4">Title<i class="material-icons right">close</i></span>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum urna eros. Cras congue nibh vitae pulvinar pellentesque. Nulla volutpat, purus bibendum euismod pharetra, est velit molestie ante.</p>							
						</div>
					</div>
				</div>

			</div>
		</div>

		<div class="section">
			<h5>Queues</h5>
			<div class="divider"></div>
			<div class="row">
				<p id="queuesContainerEmpty">No queues available.</p>

				<div id="queuesContainer"></div>
			</div>
		</div>

	</div>

	<div class="hide">
		<span id="proto_waiting_customers">[VALUE] waiting customers</span> <span id="proto_status_changed">Status updated</span> <span id="proto_something_went_wrong">Something
			went wrong</span> <span id="proto_unit_minute">minute</span> <span id="proto_unit_minutes">minutes</span>

	</div>

	</main>

	<%@include file="../includes/en/common_footer.jsp"%>
	<script src="${staticUrl}js/manage.js"></script>

</body>
</html>
