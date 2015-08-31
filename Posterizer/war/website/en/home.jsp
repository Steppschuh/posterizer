<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
	<head>
		<title>IntelliQ.me - Smarter Waiting</title>
		<%@include file="../includes/en/common_head.jsp"%>
	</head>
	
	<body>
		<%@include file="../includes/en/common_navigation.jsp"%>
	
		<main>
		<div id="index-banner">
			<div class="section no-pad-bot">
				<div class="container">
					<div class="row">
						<h1 class="header center white-text light hide-on-small-only">IntelliQ.me</h1>
	
						<div class="col s12 m6 l4 offset-l2" style="margin-top: 20px; margin-bottom: 40px;">
							<div class="icon-block">
								<h2 class="center white-text">
									<i class="material-icons">group</i>
								</h2>
								<h5 class="light center white-text">For Users</h5>
	
								<p class="light white-text center">Use your waiting time more effectively and download the free IntelliQ app</p>
	
								<div class="row center">
									<a href="${rootUrl}/apps/" class="btn-large waves-effect waves-light accent-color">Get the App</a>
								</div>
							</div>
						</div>
	
						<div class="col s12 m6 l4" style="margin-top: 20px; margin-bottom: 40px;">
							<div class="icon-block">
								<h2 class="center white-text">
									<i class="material-icons">business</i>
								</h2>
								<h5 class="light center white-text">For Business</h5>
	
								<p class="light white-text center">Learn how to get more satisfied customers and save costs by using IntelliQ</p>
	
								<div class="row center">
									<a href="${rootUrl}/business/" class="btn-large waves-effect waves-light accent-color">Learn More</a>
								</div>
							</div>
						</div>
	
					</div>
				</div>
			</div>
	
		</div>
	
		<div class="background-image-container primary-color">
			<img src="${staticUrl}images/queue_large.jpg">
		</div>
	
		</main>
	
		<%@include file="../includes/en/common_footer.jsp"%>
	
	</body>
</html>
