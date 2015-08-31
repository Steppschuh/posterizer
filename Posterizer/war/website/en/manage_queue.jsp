<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html lang="en">
<head>
<title>IntelliQ.me - Manage</title>
<%@include file="../includes/de/common_head.jsp"%>

<script type="text/javascript">
	window.onload = function() {		
		// get queue details
		getQueue(getCurrentQueueKeyId());
		
		// update the queue items
		requestQueueItems();

		// keep updating
		window.setInterval(requestQueueItems, REFRESH_INTERVAL);
	}
</script>

</head>

<body>
	<%@include file="../includes/de/common_navigation.jsp"%>

	<main>

	<div class="container">
		
		<div class="section">
			<h5>Called now</h5>
			<div class="divider"></div>
			<div class="row">
				<div class="col s12 m8" style="margin-top: 20px; margin-bottom: 20px;">
					<p id="nowCalledListEmpty">You should call the next waiting customer.</p>
					<ul id="nowCalledList" class="collection z-depth-1" style="display: none;">

					</ul>
				</div>

				<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
					<a id="markAllAsDoneButton" href="javascript:markAllQueueItemsAsDone(getCurrentQueueKeyId());" class="btn-large waves-effect waves-light primary-color disabled" style="width: 100%;"> <i class="material-icons right">done_all</i>
						Mark all as done
					</a>
				</div>

			</div>
		</div>
		
		<div class="section">
			<h5>Currently waiting</h5>
			<div class="divider"></div>
			<div class="row">
				<div class="col s12 m8" style="margin-top: 20px; margin-bottom: 20px;">
					<p id="currentlyWaitingListEmpty">No customers are currently waiting.</p>
					<ul id="currentlyWaitingList" class="collection z-depth-1" style="display: none;">

					</ul>
				</div>

				<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
					<a id="callNextCustomerButton" href="javascript:callNextCustomer(getCurrentQueueKeyId());" class="btn-large waves-effect waves-light primary-color disabled" style="width: 100%;"> <i class="material-icons right">group</i>
						Call next customer
					</a> <br /> <a id="addNewCustomerButton" href="#modal_add_customer" class="btn-large waves-effect waves-light primary-color modal-trigger" style="width: 100%;"> <i class="material-icons right">group_add</i>
						Add new customer
					</a>
				</div>

			</div>
		</div>

		<div class="section">
			<h5>Recently processed</h5>
			<div class="divider"></div>
			<div class="row">
				<div class="col s12 m8" style="margin-top: 20px; margin-bottom: 20px;">
					<p id="recentlyProcessedListEmpty">No customers processed recently.</p>
					<ul id="recentlyProcessedList" class="collection z-depth-1" style="display: none;">

					</ul>
				</div>

				<div class="col s12 m4" style="margin-top: 20px; margin-bottom: 20px;">
					<a id="clearAllProcessedButton" href="javascript:deleteProcessedQueueItems(getCurrentQueueKeyId());" class="btn-large waves-effect waves-light primary-color disabled" style="width: 100%;"> <i
						class="material-icons right">delete</i> Clear all
					</a>
				</div>
			</div>
		</div>

		<div class="section">
			<h5>Miscellaneous</h5>
			<div class="divider"></div>
			<div class="row">

				<div class="col s12" style="margin-top: 20px; margin-bottom: 20px;">
					 <a id="editQueueButton" href="#" class="btn-large waves-effect waves-light primary-color"> <i class="material-icons right">settings</i> 
						Edit queue properties
					</a> <a id="manageBusinessButton" href="#" class="btn-large waves-effect waves-light primary-color"> <i class="material-icons right">business</i> 
						Manage business
					</a> <a id="addDummCustomersButton" href="javascript:addDummyQueueItems(getCurrentQueueKeyId(), 20);" class="btn-large waves-effect waves-light primary-color"> <i class="material-icons right">group_add</i>
						Add dummy customers
					</a> <a id="removeAllCustomersButton" href="javascript:deleteAllQueueItems(getCurrentQueueKeyId());" class="btn-large waves-effect waves-light primary-color"> <i class="material-icons right">delete</i>
						Remove all customers
					</a>
				</div>

			</div>
		</div>

	</div>

	<div id="modal_add_customer" class="modal">
		<div class="modal-content">
			<h4>Add a customer</h4>
			<p>Customer name</p>
			<div class="row">
				<div class="input-field col s12 m6">
					<input id="add_customer_first_name" type="text"> <label for="add_customer_first_name">First Name</label>
				</div>
				<div class="input-field col s12 m6">
					<input id="add_customer_last_name" type="text"> <label for="add_customer_last_name">Last Name</label>
				</div>
			</div>

			<p>Display name</p>
			<div class="switch">
				<label> private <input id="add_customer_show_name" type="checkbox" checked="checked"> <span class="lever"></span> public
				</label>
			</div>
		</div>
		<div class="modal-footer">
			<a href="javascript:addCustomerDialogSubmitted();" class=" modal-action modal-close waves-effect waves-green btn-flat">Add</a>
		</div>
	</div>

	<div class="hide">
		<span id="proto_status_waiting_since">waiting since [VALUE] </span> <span id="proto_status_called_since">called since [VALUE] </span> <span id="proto_status_waiting">waiting</span> <span id="proto_status_canceled">canceled</span> <span id="proto_status_called">called</span>
		<span id="proto_status_done">done</span> <span id="proto_created_ticket">Created ticket #[VALUE]</span> <span id="proto_status_changed">Status updated</span> <span id="proto_something_went_wrong">Something
			went wrong</span> <span id="proto_unit_minute">minute</span> <span id="proto_unit_minutes">minutes</span> <span id="proto_unit_seconds">seconds</span>

	</div>

	</main>

	<%@include file="../includes/en/common_footer.jsp"%>
	<script src="${staticUrl}js/manage.js"></script>

</body>
</html>
