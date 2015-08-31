var baseUrl = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "";

var STATUS_ALL = -1;
var STATUS_WAITING = 0;
var STATUS_CANCELED = 1;
var STATUS_CALLED = 2;
var STATUS_DONE = 3;

var MINIMUM_REFRESH_INTERVAL = 3000;
var REFRESH_INTERVAL = 15000;
var lastRefresh = -1;

var business = null;
var queueItems = null;

function getCurrentQueueKeyId() {
	return getUrlParamOrCookie("queueKeyId", true);
}

function getCurrentBusinessKeyId() {
	return getUrlParamOrCookie("businessKeyId", true);
}

/*
 * Methods for DOM manipulation
 */
function renderQueueItems(items) {
	console.log("Rendering queue items:");
	console.log(items);
	

	var nowCalledList = document.getElementById("nowCalledList");
	var currentlyWaitingList = document.getElementById("currentlyWaitingList");
	var recentlyProcessedList = document.getElementById("recentlyProcessedList");
	var nowCalledListEmpty = document.getElementById("nowCalledListEmpty");
	var currentlyWaitingListEmpty = document.getElementById("currentlyWaitingListEmpty");
	var recentlyProcessedListEmpty = document.getElementById("recentlyProcessedListEmpty");
	var markAllAsDoneButton = document.getElementById("markAllAsDoneButton");
	var clearAllProcessedButton = document.getElementById("clearAllProcessedButton");
	var callNextCustomerButton = document.getElementById("callNextCustomerButton");

	nowCalledList.innerHTML = "";
	recentlyProcessedList.innerHTML = "";
	currentlyWaitingList.innerHTML = "";

	var calledCount = 0;
	var waitingCount = 0;
	var processedCount = 0;
	
	try {
		queueItems = items;
		queueItems.sort(compareLastStatusChangeTimestamp);
		
		for (var i = 0; i < queueItems.length; i++) {
			var item = queueItems[i];
			switch (item.status) {
				case STATUS_WAITING: {
					currentlyWaitingList.appendChild(generateListItemForQueueItem(item));
					waitingCount++;
					break;
				}
				case STATUS_CALLED: {
					nowCalledList.appendChild(generateListItemForQueueItem(item));
					calledCount++;
					break;
				}
				default: {
					if (recentlyProcessedList.children.length > 0) {
						recentlyProcessedList.insertBefore(generateListItemForQueueItem(item), recentlyProcessedList.children[0]);
					} else {
						recentlyProcessedList.appendChild(generateListItemForQueueItem(item));
					}
					processedCount++;
				}
			}
		}
	} catch(ex) {
		console.log(ex);
	}
	
	if (calledCount > 0) {
		nowCalledList.style.display = "block";
		nowCalledListEmpty.style.display = "none";
		removeClassName(markAllAsDoneButton, "disabled");
	} else {
		nowCalledList.style.display = "none";
		nowCalledListEmpty.style.display = "block";
		addClassName(markAllAsDoneButton, "disabled");
	}
	
	if (waitingCount > 0) {
		currentlyWaitingList.style.display = "block";
		currentlyWaitingListEmpty.style.display = "none";
		removeClassName(callNextCustomerButton, "disabled");
	} else {
		currentlyWaitingList.style.display = "none";
		currentlyWaitingListEmpty.style.display = "block";
		addClassName(callNextCustomerButton, "disabled");
	}

	if (processedCount > 0) {
		recentlyProcessedList.style.display = "block";
		recentlyProcessedListEmpty.style.display = "none";
		removeClassName(clearAllProcessedButton, "disabled");
	} else {
		recentlyProcessedList.style.display = "none";
		recentlyProcessedListEmpty.style.display = "block";
		addClassName(clearAllProcessedButton, "disabled");
	}
}

function renderBusiness(entry) {
	console.log("Rendering business:");
	console.log(entry);
	
	business = entry;
	
	var businessCard = document.getElementById("businessCard");
	var businessCardImage = document.getElementById("businessCardImage");
	var businessCardTitle = document.getElementById("businessCardTitle");
	var businessCardStatus = document.getElementById("businessCardStatus");
	var businessCardEditButton = document.getElementById("businessCardEditButton");
	var businessCardRevealTitle = document.getElementById("businessCardRevealTitle");
	
	businessCard.style.display = "block";
	
	if (entry.logoImageKeyId > 0) {
		businessCardImage.style.backgroundImage = "url(" + getResizedImageUrlById(entry.logoImageKeyId, 700) + ")";
	} else {
		businessCardImage.style.backgroundImage = "url(" + baseUrl + "/static/images/no_logo.png)";
	}
	
	businessCardEditButton.href = getEditBusinessUrl(entry.key.id);
	
	var cardMoreButton = document.createElement("i");
	cardMoreButton.className = "material-icons right";
	cardMoreButton.innerHTML = "more_vert";
	
	businessCardTitle.innerHTML = entry.name + htmlElementToString(cardMoreButton);
	
	businessCardStatus.innerHTML = "";
	
	var cardCloseButton = document.createElement("i");
	cardCloseButton.className = "material-icons right";
	cardCloseButton.innerHTML = "close";
	
	businessCardRevealTitle.innerHTML = entry.name + htmlElementToString(cardCloseButton);
	
	
	renderQueues(entry.queues);

}

function renderQueues(entries) {
	console.log("Rendering queues:");
	console.log(entries);
	
	var queuesContainer = document.getElementById("queuesContainer");
	var queuesContainerEmpty = document.getElementById("queuesContainerEmpty");
	
	queuesContainer.innerHTML = "";
	
	try {
		for (var i = 0; i < entries.length; i++) {
			var queue = entries[i];
			queuesContainer.appendChild(generateCardForQueue(queue));
		}
	} catch(ex) {
		console.log(ex);
	}
	
	if (entries && entries.length > 0) {
		queuesContainer.style.display = "block";
		queuesContainerEmpty.style.display = "none";
	} else {
		queuesContainer.style.display = "none";
		queuesContainerEmpty.style.display = "block";
	}

}

function generateListItemForQueueItem(item) {
	/*
	 * <li class="collection-item avatar"> <i class="material-icons
	 * circle">smartphone</i> <span class="title">Markus Petrykowski</span><br />
	 * <span class="status">waiting since 12 minutes</span><span
	 * class="ticket"> - ticket #29</span> <a href="#!"
	 * class="secondary-content grey-text"><i class="material-icons">clear</i></a>
	 * </li>
	 */
	try {
		var listItem = document.createElement("li");
		listItem.className = "collection-item avatar";
		listItem.queueItemKeyId = item.key.id;

		var br = document.createElement("br");

		var listItemIcon = document.createElement("i");
		listItemIcon.className = "material-icons circle";
		if (item.status == STATUS_WAITING) {
			if (item.usingApp) {
				listItemIcon.innerHTML = "smartphone";
			} else {
				listItemIcon.innerHTML = "dvr";
			}
		} else if (item.status == STATUS_CALLED) {
			listItemIcon.innerHTML = "announcement";
		} else if (item.status == STATUS_CANCELED) {
			listItemIcon.innerHTML = "clear";
		} else if (item.status == STATUS_DONE) {
			listItemIcon.innerHTML = "done";
		}
		
		var listItemTitle = document.createElement("span");
		listItemTitle.className = "title";
		listItemTitle.innerHTML = item.name;

		var listItemStatus = document.createElement("span");
		listItemStatus.className = "status";
		listItemStatus.innerHTML = getQueueItemStatusString(item);

		var listItemTicket = document.createElement("span");
		listItemTicket.className = "ticket";
		listItemTicket.innerHTML = "ticket #" + item.ticketNumber;

		var listItemAction = document.createElement("a");
		listItemAction.className = "secondary-content grey-text text-lighten-1";
		listItemAction.href = "javascript:cancelQueueItem(" + item.key.id + ")";

		var listItemActionIcon = document.createElement("i");
		listItemActionIcon.className = "material-icons";
		if (item.status == STATUS_WAITING) {
			listItemActionIcon.innerHTML = "clear";
			listItemAction.href = "javascript:cancelQueueItem(" + item.key.id + ")";
		} else if (item.status == STATUS_CALLED) {
			listItemActionIcon.innerHTML = "done";
			listItemAction.href = "javascript:markQueueItemAsDone(" + item.key.id + ")";
		} else {
			listItemActionIcon.innerHTML = "delete";
			listItemAction.href = "javascript:deleteQueueItem(" + item.key.id + ")";
		}
		
		listItemAction.appendChild(listItemActionIcon);

		listItem.appendChild(listItemIcon);
		listItem.appendChild(listItemTitle);
		listItem.appendChild(br);
		listItem.appendChild(listItemStatus);
		listItem.appendChild(listItemTicket);
		listItem.appendChild(listItemAction);

		return listItem;
	} catch(ex) {
		console.log(ex);
		return null;
	}
}

function generateCardForQueue(item) {
	/*
	<div class="col s12 m6 l4">
		<div class="card medium">
			<div class="card-image waves-effect waves-block waves-light">
				<img class="activator" src="http://materializecss.com/images/sample-1.jpg">
			</div>
			<div class="card-content">
				<span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span> 
				<br /> 
				<span class="status">12 customers in queue</span>
				<div class="card-action">
					<a href="#">Manage</a>
					<a href="#">Edit</a>
				</div>
			</div>
			<div class="card-reveal">
				<span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
				<p>Here is some more information about this product that is only revealed once clicked on.</p>
				<a id="Button" href="javascript:();" class="btn-large waves-effect waves-light primary-color" style="width: 100%;"> <i
					class="material-icons right">group</i> Manage Customers
				</a> <br /> <a id="Button" href="javascript:();" class="btn-large waves-effect waves-light primary-color" style="width: 100%;"> <i
					class="material-icons right">group</i> Edit Queue
				</a>
			</div>
		</div>
	</div>
	 */
	try {		
		var br = document.createElement("br");
		
		var cardCol = document.createElement("div");
		cardCol.className = "col s12 m6 l4";
		cardCol.queueKeyId = item.key.id;
		
		var card = document.createElement("div");
		card.className = "card medium";
		
		var cardImageContainer = document.createElement("div");
		cardImageContainer.className = "card-image waves-effect waves-block waves-light grey lighten-3";
		
		var cardImage = document.createElement("div");
		cardImage.className = "card-image-div activator";
		
		if (item.photoImageKeyId > 0) {
			cardImage.style.backgroundImage = "url(" + getResizedImageUrlById(item.photoImageKeyId, 700) + ")";
		} else {
			cardImage.style.backgroundImage = "url(" + baseUrl + "/static/images/no_photo.jpg)";
		}
		
		var cardContent = document.createElement("div");
		cardContent.className = "card-content";
		
		var cardMoreButton = document.createElement("i");
		cardMoreButton.className = "material-icons right";
		cardMoreButton.innerHTML = "more_vert";
		
		var cardTitle = document.createElement("span");
		cardTitle.className = "card-title activator grey-text text-darken-4";
		cardTitle.innerHTML = item.name + htmlElementToString(cardMoreButton);
		
		var cardStatus = document.createElement("span");
		cardStatus.className = "status";
		cardStatus.innerHTML = getProtoString("waiting_customers").replace("[VALUE]", item.waitingPeople);
		
		var cardActions = document.createElement("div");
		cardActions.className = "card-action";
		
		var cardAction1 = document.createElement("a");
		cardAction1.innerHTML = "Manage";
		cardAction1.href = getManageQueueUrl(item.key.id);
		
		var cardAction2 = document.createElement("a");
		cardAction2.innerHTML = "Edit";
		cardAction2.href = getEditQueueUrl(item.key.id);
		
		var cardReveal = document.createElement("div");
		cardReveal.className = "card-reveal";
		
		var cardCloseButton = document.createElement("i");
		cardCloseButton.className = "material-icons right";
		cardCloseButton.innerHTML = "close";
		
		var cardRevealTitle = document.createElement("span");
		cardRevealTitle.className = "card-title grey-text text-darken-4";
		cardRevealTitle.innerHTML = item.name + htmlElementToString(cardCloseButton);
		
		var cardRevealDescription = document.createElement("p");
		cardRevealDescription.innerHTML = "Lorem Ipsum";
		
		var button1Icon = document.createElement("i");
		button1Icon.className = "material-icons right";
		button1Icon.innerHTML = "delete";
		
		var button1 = document.createElement("a");
		button1.innerHTML = htmlElementToString(button1Icon) + "Delete queue";
		button1.className = "btn-large waves-effect waves-light primary-color";
		button1.href = "#";
		button1.style.width = "100%";
		
		
		cardImageContainer.appendChild(cardImage);
		
		cardActions.appendChild(cardAction1);
		cardActions.appendChild(cardAction2);
		cardContent.appendChild(cardTitle);
		cardContent.appendChild(br.cloneNode(true));
		cardContent.appendChild(cardStatus);
		cardContent.appendChild(cardActions);
		
		cardReveal.appendChild(cardRevealTitle);
		cardReveal.appendChild(cardRevealDescription);
		cardReveal.appendChild(br.cloneNode(true));
		cardReveal.appendChild(button1);
		
		card.appendChild(cardImageContainer);
		card.appendChild(cardContent);
		card.appendChild(cardReveal);
		
		cardCol.appendChild(card);
		
		return cardCol;
	} catch(ex) {
		console.log(ex);
		return null;
	}
}

/*
 * Event handling
 */
function callNextCustomer(queueKeyId) {
	if (queueKeyId != null) {
		//TODO: don't use DOM for this
		var currentlyWaitingList = document.getElementById("currentlyWaitingList");
		if (currentlyWaitingList.children.length > 0) {
			var queueItemKeyId = currentlyWaitingList.children[0].queueItemKeyId;
			changeQueueItemStatus(queueItemKeyId, STATUS_CALLED);
		} else {
			Materialize.toast(getProtoString("something_went_wrong"), 5000);
		}
	} else {
		console.log("Invalid queueKeyId specified");
	}
}

function addCustomerDialogSubmitted() {
	var queueKeyId = getCurrentQueueKeyId();
	var name = document.getElementById("add_customer_first_name").value + " " + document.getElementById("add_customer_last_name").value;
	var showName = document.getElementById("add_customer_show_name").checked;
	
	if (queueKeyId != null) {
		addQueueItem(queueKeyId, name, showName)
	} else {
		console.log("Invalid queueKeyId specified");
	}
}

/*
 * API requests helper
 */
function getApiRequestUrl() {
	var requestUrl;
	if (baseUrl.indexOf("localhost") > -1) {
		requestUrl = baseUrl + "/api/";
	} else {
		requestUrl = "http://intelliq.me/api/";
	}
	return requestUrl;
}

function getEditQueueUrl(queueKeyId) {
	return baseUrl + "/edit/queue/?queueKeyId=" + queueKeyId;
}

function getEditBusinessUrl(businessKeyId) {
	return baseUrl + "/edit/business/?businessKeyId=" + businessKeyId;
}

function getManageQueueUrl(queueKeyId) {
	return baseUrl + "/manage/queue/?queueKeyId=" + queueKeyId;
}

function getManageBusinessUrl(businessKeyId) {
	return baseUrl + "/manage/business/?businessKeyId=" + businessKeyId;
}

function sendApiRequest(endpoint, params, callback) {
	// build request url
	var requestUrl = getApiRequestUrl() + endpoint;
	if (params) {
		requestUrl += "?";
		for (var i = 0; i < params.length; i++) {
			requestUrl += params[i][0] + "=" + encodeURIComponent(params[i][1]) + "&";
		}
		requestUrl = requestUrl.substring(0, requestUrl.length - 1);
	}

	// request JSON
	console.log("Requesting: " + requestUrl);
	$.ajax({
		url : requestUrl,
		type : 'GET',
		data : {},
		dataType : 'json',
		success : function(data) {
			callback(data);
		},
		error : function(err) {
			console.log(err)
			callback(null);
		},
		beforeSend : function(xhr) {
			// xhr.setRequestHeader("key", "value");
		}
	});
}

/*
 * API requests for Queue Item Management
 */

function getQueue(queueKeyId) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				console.log(data.statusMessage);
			} else {
				var editQueueButton = document.getElementById("editQueueButton")
				editQueueButton.href = getEditQueueUrl(data.content.key.id);
				
				var manageBusinessButton = document.getElementById("manageBusinessButton")
				manageBusinessButton.href = getManageBusinessUrl(data.content.businessKeyId);
			}
		}
	}
	
	sendApiRequest("queue/get/", params, callback);
}

function requestQueueItems(force) {
	// skip if queue items have been updated recently
	if (!force && Date.now() < lastRefresh + MINIMUM_REFRESH_INTERVAL) {
		return;
	} else {
		lastRefresh = Date.now();
	}
	
	var queueKeyId = getCurrentQueueKeyId();
	if (queueKeyId != null) {
		requestQueueItemsByKeyId(queueKeyId);
	} else {
		console.log("Invalid queueKeyId specified");
	}
}

function requestQueueItemsByKeyId(queueKeyId) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				console.log(data.statusMessage);
			} else {
				renderQueueItems(data.content);				
			}
		}
	}
	
	sendApiRequest("queue/items/", params, callback);
}

function addQueueItem(queueKeyId, name, showName) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	params.push(["name", name]);
	params.push(["showName", showName ? "true" : "false"]);
	params.push(["usingApp", "false"]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			var ticketNumber = data.content.ticketNumber;
			statusString = getProtoString("created_ticket");
			statusString = statusString.replace("[VALUE]", ticketNumber);
			console.log(data)
		} else {
			statusString = getProtoString("something_went_wrong");			
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems();
	}
	
	sendApiRequest("item/add/", params, callback);
}

function addDummyQueueItems(queueKeyId, count) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	params.push(["count", count]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				statusString = data.statusMessage;
			} else {
				statusString = getProtoString("status_changed");
			}
		} else {
			statusString = getProtoString("something_went_wrong");
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems(true);
	}
	
	sendApiRequest("queue/populate/", params, callback);
}

function cancelQueueItem(queueItemKeyId) {
	changeQueueItemStatus(queueItemKeyId, STATUS_CANCELED);
}

function callQueueItem(queueItemKeyId) {
	changeQueueItemStatus(queueItemKeyId, STATUS_CALLED);
}

function markQueueItemAsDone(queueItemKeyId) {
	changeQueueItemStatus(queueItemKeyId, STATUS_DONE);
}

function markAllQueueItemsAsDone(queueKeyId) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				statusString = data.statusMessage;
			} else {
				statusString = getProtoString("status_changed");
			}
		} else {
			statusString = getProtoString("something_went_wrong");
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems(true);
	}
	
	sendApiRequest("queue/done/", params, callback);
}


function changeQueueItemStatus(queueItemKeyId, status) {
	params = [];
	params.push(["queueItemKeyId", queueItemKeyId]);
	params.push(["status", status]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				statusString = data.statusMessage;
			} else {
				var status = data.content.status;
				statusString = getProtoString("status_changed");
			}
		} else {
			statusString = getProtoString("something_went_wrong");
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems(true);
	}
	
	sendApiRequest("item/status/", params, callback);
}

function deleteQueueItem(queueItemKeyId) {
	params = [];
	params.push(["queueItemKeyId", queueItemKeyId]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				statusString = data.statusMessage;
			} else {
				statusString = getProtoString("status_changed");
			}
		} else {
			statusString = getProtoString("something_went_wrong");
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems(true);
	}
	
	sendApiRequest("item/delete/", params, callback);
}

function deleteAllQueueItems(queueKeyId) {
	deleteQueueItems(queueKeyId, STATUS_ALL, true);
}

function deleteProcessedQueueItems(queueKeyId) {
	deleteQueueItems(queueKeyId, STATUS_ALL, false);
}

function deleteQueueItems(queueKeyId, status, clearWaiting) {
	params = [];
	params.push(["queueKeyId", queueKeyId]);
	params.push(["status", status]);
	params.push(["clearWaiting", clearWaiting ? "true" : "false"]);	
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				statusString = data.statusMessage;
			} else {
				statusString = getProtoString("status_changed");
			}
		} else {
			statusString = getProtoString("something_went_wrong");
		}
		Materialize.toast(statusString, 5000);
		requestQueueItems(true);
	}
	
	sendApiRequest("queue/clear/", params, callback);
}

/*
 * API requests for Business Management
 */
function getBusiness(businessKeyId) {
	params = [];
	params.push(["businessKeyId", businessKeyId]);
	params.push(["includeQueues", "true"]);
	
	var callback = function (data) {
		var statusString = "";
		if (data) {
			console.log(data)
			if (data.statusCode != 200) {
				console.log(data.statusMessage);
			} else {
				renderBusiness(data.content);
			}
		}
	}
	
	sendApiRequest("business/get/", params, callback);
}

/*
 * Helper functions
 */
function getQueueItemStatusString(item) {
	var statusString = "unknown";
	switch (item.status) {
	case STATUS_WAITING: {
		statusString = getProtoString("status_waiting_since");
		var delay = getNumberOfMinutesSince(item.entryTimestamp);
		statusString = statusString.replace("[VALUE]", delay);
		if (delay == 1) {
			statusString = statusString + getProtoString("unit_minute");
		} else {
			statusString = statusString + getProtoString("unit_minutes");
		}
		break;
	}
	case STATUS_CANCELED: {
		statusString = getProtoString("status_canceled");
		break;
	}
	case STATUS_CALLED: {
		statusString = getProtoString("status_called_since");
		var delay = getNumberOfMinutesSince(item.lastStatusChangeTimestamp);
		statusString = statusString.replace("[VALUE]", delay);
		if (delay == 1) {
			statusString = statusString + getProtoString("unit_minute");
		} else {
			statusString = statusString + getProtoString("unit_minutes");
		}
		break;
	}
	case STATUS_DONE: {
		statusString = getProtoString("status_done");
		break;
	}
	}
	return statusString;
}

function compareEntryTimestamp(a, b) {
	if (a.entryTimestamp < b.entryTimestamp)
		return -1;
	if (a.entryTimestamp > b.entryTimestamp)
		return 1;
	return 0;
}

function compareLastStatusChangeTimestamp(a, b) {
	if (a.lastStatusChangeTimestamp < b.lastStatusChangeTimestamp)
		return -1;
	if (a.lastStatusChangeTimestamp > b.lastStatusChangeTimestamp)
		return 1;
	return 0;
}

function getImageUrlById(imageKeyId) {
	var size = "original";
	var defaultColumn = document.getElementsByClassName("container")[0];
	if (defaultColumn !== undefined) {
		size = Math.max(defaultColumn.offsetWidth, 500);
	}
	return getResizedImageUrlById(imageKeyId, size);
}

function getResizedImageUrlById(imageKeyId, size) {
	return baseUrl + "/image/" + imageKeyId + "/" + size + ".jpg";
}

function getUrlParam(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

function getUrlParamOrCookie(key, createCookie) {
	var value = getUrlParam(key);
	if (value != null) {
		if (createCookie) {
			setCookie(key, value, 7);
		}
		return value;
	}
	
	value = getCookie(key);
	if (value != "") {
		return value;
	}
	
	return null;
}

function getHostNameFromUrl(url) {
	var l = document.createElement("a");
	l.href = url;
	return l.hostname;
}

function getNumberOfMinutesSince(timestamp) {
	var date = new Date(timestamp);
	var seconds = Math.floor((new Date() - date) / 1000);
	return Math.floor(seconds / 60);
}

function addClassName(div, newClass) {
	if (!div.className) {
		div.className = newClass;
		return;
	}
	if (div.className.indexOf(newClass) > -1) {
		return;
	} else {
		div.className += " " + newClass;
	}
}

function removeClassName(div, newClass) {
	if (!div.className) {
		return;
	}
	if (div.className.indexOf(newClass) > -1) {
		div.className = div.className.replace(newClass, "").trim();
	}
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    var cookieString = cname + "=" + cvalue + "; " + expires + "; path=/";
    document.cookie = cookieString;
    console.log("Created cookie: " + cookieString);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getProtoString(key) {
	var proto = document.getElementById("proto_" + key);
	if (proto) {
		return proto.innerHTML;
	}
	return "undefined string";
}

function htmlElementToString(element) {
	var tmp = document.createElement("div");
	tmp.innerHTML = "";
	tmp.appendChild(element);
	return tmp.innerHTML;
}