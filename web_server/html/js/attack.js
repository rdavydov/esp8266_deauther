var selectedAPs = getE("selectedAPs");
var selectedClients = getE("selectedClients");
var table = document.getElementsByTagName("table")[0];
var ssidList = document.getElementsByTagName("table")[1];
var saved = getE("saved");
var ssidCounter = getE("ssidCounter");
var ssid = getE("ssid");
var num = getE("num");
var randomIntrvl = getE("randomIntrvl");
var randomBtn = getE("randomBtn");
var resultInterval;
var data;
function getResults() {
  getResponse("attackInfo.json", function(responseText) {
    var res = JSON.parse(responseText);
    var aps = "";
    var clients = "";
    var tr = "<tr><th>Attack</th><th>Status</th><th>Start/Stop</th></tr>";
    for (var i = 0; i < res.aps.length; i++) aps += "<li>" + res.aps[i] + " <button onclick='cloneSSID(\""+res.aps[i]+"\")'>clone</button></li>";
    for (var i = 0; i < res.clients.length; i++) clients += "<li>" + res.clients[i] + "</li>";

    selectedAPs.innerHTML = aps;
    selectedClients.innerHTML = clients;
	
	if(res.randomMode == 1) randomBtn.innerHTML = "Disable Random";
	else randomBtn.innerHTML = "Enable Random";

    for (var i = 0; i < res.attacks.length; i++) {
      if (res.attacks[i].running) tr += "<tr class='selected'>";
      else tr += "<tr>";

      tr += "<td>" + res.attacks[i].name + "</td>";
      if (res.attacks[i].status == "ready") tr += "<td class='green' id='status"+i+"'>" + res.attacks[i].status + "</td>";
      else tr += "<td class='red' id='status"+i+"'>" + res.attacks[i].status + "</td>";
      if (res.attacks[i].running) tr += "<td><button class='marginNull selectedBtn' onclick='startStop(" + i + ")'>stop</button></td>";
      else tr += "<td><button class='marginNull' onclick='startStop(" + i + ")'>start</button></td>";

      tr += "</tr>";
    }
    table.innerHTML = tr;

	if(typeof res.ssid != 'undefined'){
		data = res;
		ssidCounter.innerHTML = res.ssid.length + "/48";
		
		var tr = "<tr><th>Name</th><th>X</th></tr>";
		for (var i = 0; i < res.ssid.length; i++) {
		  tr += "<tr>";
		  tr += "<td>" + res.ssid[i] + "</td>";
		  tr += '<td><button class="marginNull button-warn" onclick="deleteSSID(' + i + ')">x</button></td>';
		  tr += "</tr>";
		}
		ssidList.innerHTML = tr;
	}

  }, function() {
    clearInterval(resultInterval);
    showMessage("error loading attackInfo.json");
  });
}

function startStop(num) {
  getResponse("attackStart.json?num=" + num, function(responseText) {
	getE("status"+num).innerHTML = "loading";
    if (responseText == "true") getResults();
    else showMessage("response error attackStart.json");
  });
}

function addSSID() {
	
	var _ssidName = ssid.value;
	if(_ssidName.length > 0){
		if(data.ssid.length >= 64) showMessage("SSID list full :(", 2500);
		else{
			saved.innerHTML = "";
			getResponse("addSSID.json?ssid=" + _ssidName + "&num="+num.value, getResults);
		}
	}
}

function cloneSSID(_ssidName) {
  ssid.value = _ssidName;
  num.value = 48 - data.ssid.length;
}

function deleteSSID(num) {
  saved.innerHTML = "";
  getResponse("deleteSSID.json?num=" + num, getResults);
}

function randomSSID() {
  saved.innerHTML = "";
  getResponse("randomSSID.json", getResults);
}
function clearSSID() {
  saved.innerHTML = "";
  getResponse("clearSSID.json", getResults);
}
function saveSSID() {
  saved.innerHTML = "saved";
  getResponse("saveSSID.json", getResults);
}
function resetSSID() {
  saved.innerHTML = "saved";
  getResponse("resetSSID.json", getResults);
}
function random(){
	getResponse("enableRandom.json?interval="+randomIntrvl.value, getResults);
}

getResults();
resultInterval = setInterval(getResults, 2000);