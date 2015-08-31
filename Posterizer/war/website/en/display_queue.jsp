<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
<head>
<title>IntelliQ.me - Manage</title>
<%@include file="../includes/de/common_head.jsp"%>
<link href="${staticUrl}css/display.css" type="text/css" rel="stylesheet" media="screen,projection" />

<script type="text/javascript">
	window.onload = function() {		
		// get queue details
		//getQueue(getCurrentQueueKeyId());
		
		// update the queue items
		//requestQueueItems();

		// keep updating
		//window.setInterval(requestQueueItems, REFRESH_INTERVAL);
	}
</script>

</head>

<body>
	
	<main>
		
		<div id="nowCalledContainer">
		<div class="row">
			<div class="col s12 m6">
				<div class="card-panel teal">
					<span class="white-text">I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively. I am similar to
						what is called a panel in other frameworks. </span>
				</div>
			</div>
			<div class="col s12 m6">
				<div class="card-panel teal">
					<span class="white-text">I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively. I am similar to
						what is called a panel in other frameworks. </span>
				</div>
			</div>
			<div class="col s12 m6">
				<div class="card-panel teal">
					<span class="white-text">I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively. I am similar to
						what is called a panel in other frameworks. </span>
				</div>
			</div>
			<div class="col s12 m6">
				<div class="card-panel teal">
					<span class="white-text">I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively. I am similar to
						what is called a panel in other frameworks. </span>
				</div>
			</div>
		</div>
	</div>
		
		<div id="backgroundImageContainer">
			<div id="backgroundImage" style="background-image: url(http://localhost:8888/image/4763084371525632/500.jpg);">
				&nbsp;
			</div>
		</div>

	</main>

	<!-- Scripts -->
	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="${staticUrl}js/materialize.js"></script>
	<script src="${staticUrl}js/init.js"></script>
	<script src="${staticUrl}js/manage.js"></script>
	
	<!-- GA -->
	<script>
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o), m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js',
				'ga');
		ga('create', 'UA-15327134-25', 'auto');
		ga('send', 'pageview');
	</script>
	
</body>
</html>
