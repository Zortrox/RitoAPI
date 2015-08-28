var pageName = {
	MAIN : 1,
	CHAMP : 2,
	MISC : 3,
}

chartType = 0;
var chartValue = {
	PICKRATE : 0,
	WINRATE : 1
}

var currentPage = pageName.MAIN;
var canChangePage = true;
var pageLoaded = true;
var loadingDef = $.Deferred();	//deferred that resolves/rejects page load
var loadingMoreDef = $.Deferred();	//resolves/rejects downtime loading
var champData = null;	//converted JSON object
var champIDList = [];	//sorted champ IDs by champ name
var timeData = null;
var champStats = null;	//champ stats (kill, assist, gold, etc);
var itemData = null;	//item data (stats, etc.)
var currentChampID = 0;
var mainTutNumber = 2;		//number of tutorials (on main page)
var champTutNumber = 3;		//number of tutorials (on champ page)
var champScrollbar = null;
var currentChampX = 0;
var currentChampY = 0;
var currentChampZoom = .6;
var champPortraitWidth = 1215;
var champPortraitHeight = 717;
var waveSeconds = 0;
var waveT = 0;
var mouseCanvasLeft = {x:0, y:0};		//mouse position on left canvas
var mouseCanvasRight = {x:1000, y:0};	//mouse position on right canvas
var doCoinAnim = false;
var hasLoadedMain = false;
var hasLoadedChamp = false;
var hasLoadedMisc = false;
var numChampsLoaded = 0;
var champLoopRunning = false;

$(document).ready(function(){
	var proms = [];

	loadingCoinStart();

	$("#button-page1").click(function(){
		changePage(pageName.MAIN);
	})
	$("#button-page2").click(function(){
		changePage(pageName.CHAMP);
	})
	$("#button-page3").click(function(){
		changePage(pageName.MISC);
	})

	proms.push(loadChampList())
	champScrollbar = new Scrollbar();
	
	$("#all-panel").css("opacity", 0.0);
	$("body").css("overflow", "hidden");
	$("#all-panel").show();
	$("#side-buttons").css("opacity", 0.0);
	$("#side-buttons").show();

	var bgImgDef = $.Deferred();
	$("#bg-img img").ensureLoad(function() {bgImgDef.resolve();});
	proms.push(bgImgDef.promise());

	$.when.apply($, proms).done(function() {
		loadNewPage().done(function() {
			loadingCoinStop();
			$("#bg-img img").css("opacity", 0.0);
			$("#bg-img img").show();
			var bgAniProm = $("#bg-img img").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear"}).promise();
			bgAniProm.done(function() {
				//show rest of page
				$("body").css("overflow", "auto");
				$("#side-buttons").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear"});
				arrivedAtPage();
				showWhenLoaded(currentPage);
			});
		});
	});

	$(window).resize(function(){
		resizeMainPage();
		resizeChampPage();
		resizeMiscPage();
	});
});

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
PAGE RESIZE FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var resizeMainPage = function() {
	//main page resizing
}
var resizeChampPage = function(offsetX, offsetY, zoom) {
	var circleWidth = $("#champ-circle").width();
	var ratio = (circleWidth * 5)/champPortraitWidth;

	if (offsetX != null) {
		currentChampX = offsetX;
	}
	if (offsetY != null) {
		currentChampY = offsetY;
	}
	if (zoom != null) {
		currentChampZoom = zoom;
	}

	$("#champ-circle").height(circleWidth);
	$("#champ-left-content canvas")[0].height = circleWidth;
	$("#champ-left-content canvas")[0].width = $("#champ-left-content").width();
	$("#champ-right-content canvas")[0].height = circleWidth;
	$("#champ-right-content canvas")[0].width = $("#champ-right-content").width();
	$("#champ-main-img").css({
		"width": circleWidth * 5 * currentChampZoom,
		"margin-left": -(currentChampX * ratio * currentChampZoom - circleWidth/2),
		"margin-top": -(currentChampY * ratio * currentChampZoom - circleWidth/2),
	});

	if ( $("champ-select-window").css("display") != "none") {
		champScrollbar.getSizes();
	}
}
var resizeMiscPage = function() {
	var width = $("#misc-map-width").width();

	$("#misc-map-beam").height(width * 9/16);
	$("#misc-scroll-map").width(width);
	$("#misc-scroll-map").height(width * 9/16);
	$("#map-content").width(width - 20);
	$("#map-content").height(width * 9/16 - 20);
	$("#misc-map-overlay img").width(width);
	$("#misc-map-overlay #map-shadows").height(width * 9/16);
	$("#misc-map-overlay #map-highlights").height(width * 9/16);
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
PAGE LOADING FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var arrivedAtPage = function() {
	canChangePage = true;
	loadingCoinStart();
}
var showWhenLoaded = function(page, promArray) {
	$.when.apply($, promArray).done(function() {
		showPanel(page);
	});
}
var changePage = function(page) {
	//wait until page switch ended before going to next page
	if (page != currentPage && canChangePage) {
		loadingMoreDef.reject();	//stop loading optional data
		loadingMoreDef = $.Deferred();

		loadingDef.reject();	//don't show previous page
		loadingDef = $.Deferred();
		var prom1 = loadingDef.promise();

		loadingCoinStop();	//cancel current loading anim
		canChangePage = false;
		currentPage = page;
		hidePanel();
		var prom2 = animateBG(page);

		//load more data when not in use
		loadingDef.done(function() {
			if (!champLoopRunning) {
				champLoopRunning = true;
				loadChampLoop(loadingMoreDef.promise());
			}
		});

		//shows panel when everything loads AND
		//when on correct "page"
		showWhenLoaded(currentPage, [prom1, prom2]);
	}
}
var loadNewPage = function() {
	var proms = [];

	//remove current content
	//load all page content while switching
	if (currentPage == pageName.MAIN) {
		$("#main-panel").show();
		$("#champ-panel").hide();
		$("#misc-panel").hide();

		proms.push(loadMainPanel());
	} else if (currentPage == pageName.CHAMP) {
		$("#main-panel").hide();
		$("#champ-panel").show();
		$("#misc-panel").hide();

		proms.push(loadChampPanel());
		resizeChampPage();
	} else if (currentPage == pageName.MISC) {
		$("#main-panel").hide();
		$("#champ-panel").hide();
		$("#misc-panel").show();

		proms.push(loadMiscPanel());
	}

	//when everything loaded
	var thisPromise = loadingDef.promise();
	$.when.apply($, proms).done(function () {
		//if page hadn't changed since loading
		if (thisPromise == loadingDef.promise()) {
			loadingDef.resolve();
		}
	});

	return thisPromise;
}
var loadSource = function(elem, data) {
	var dfd = $.Deferred();

	//load data
	elem.attr("src", data);

	//resolve when data fully loaded
	if (elem.is("audio")) {
		elem.on("canplay canplaythrough", function(){
			dfd.resolve();
		});
	} else {
		elem.load(function() {
			dfd.resolve();
		});
	}

	return dfd.promise();
}
$.fn.extend({
	ensureLoad: function(handler) {
		return this.each(function() {
			if(this.complete) {
				handler.call(this);
			} else {
				$(this).load(handler);
			}
		});
	}
});
var loadChampList = function() {
	var dfd = $.Deferred();

	$.ajax({
		'async': true,
		'global': false,
		'url': "champData.json",
		'dataType': "json",
		'success': function (data) {
			champData = data.data;
			sortChampList();
			dfd.resolve();
		},
	});

	return dfd.promise();
}
var sortChampList = function() {
	champIDList = [];
	$.each(champData, function(i, champID){
		champIDList.push(champID.id);
	});
	champIDList = champIDList.sort(function(a, b){
		return champData[a].name.localeCompare(champData[b].name);
	});
}
function createCookie(name, value, days) {
	var expires;

	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	} else {
		expires = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = encodeURIComponent(name) + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
PAGE ANIMATION FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var animateBG = function(page) {
	//animate background image position to simulate page movement
	var dfd = $.Deferred();
	var css = null;

	if (page == pageName.MAIN) {
		css = {"left": 0};
	} else if (page == pageName.CHAMP) {
		css = {"left": -($("#bg-img img").width() - $(window).width()) / 2};
	} else if (page == pageName.MISC) {
		css = {"left": -($("#bg-img img").width() - $(window).width())};
	}

	$("#bg-img img").animate(css, {duration: 2000, queue: false, complete: function() {
		arrivedAtPage();
		dfd.resolve();
	}})

	return dfd.promise();
}
var loadingCoinAnim = function(forwards, front) {
	var css = null;
	var coinEase = "";
	if (forwards) {
		css = {"left": "28px", "width": "0px"};
		coinEase = "easeInQuad";
	} else {
		css = {"left": "0px", "width": "60px"}
		coinEase = "easeOutQuad";
	}
	if (front) {
		$("#loading-coin img:first-of-type").attr("src", "img/krakenFront.png");
	} else {
		$("#loading-coin img:first-of-type").attr("src", "img/krakenBack.png");
	}

	$("#loading-coin img:first-of-type").animate(css,
		{duration: 500, queue: false, easing: coinEase, complete: function(){
			//flip coin
			if (forwards) front = !front;
			if (doCoinAnim) loadingCoinAnim(!forwards, front);
			else {
				$("#loading-coin img:first-of-type").css({"left": "0px", "width": "60px"});
			}
		}}); 
}
var loadingCoinStart = function() {
	$("#loading-coin").show();
	doCoinAnim = true;
	loadingCoinAnim(true, true);
}
var loadingCoinStop = function() {
	$("#loading-coin").hide();
	doCoinAnim = false;
}
var showPanel = function(page) {
	loadingCoinStop();

	//show panel after everything loaded
	$("#all-panel").animate({"opacity": 1.0},
		{duration: 500, queue: false, easing: "linear", complete: function() {
			//finished showing current page
			if (page == pageName.MAIN && readCookie("mainTutorialDone") == null) {
				//show chart tutorial
				createCookie("mainTutorialDone", "true", 1);
				animateMainTutorial();
			} else if (page == pageName.CHAMP && readCookie("champTutorialDone") == null) {
				//show chart tutorial
				createCookie("champTutorialDone", "true", 1);
				animateChampTutorial();
			} else if (page == pageName.MISC) {
				animateMap();
			}
		}});
}
var hidePanel = function() {
	$("#all-panel").animate({"opacity": 0.0},
		{duration: 500, queue: false, easing: "linear", complete: function() {
			$("body").scrollTop(0);
			loadNewPage();
		}});
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
MAIN PANEL FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var loadMainPanel = function() {
	var proms = [];

	if (!hasLoadedMain) {
		proms.push(createMainChart());
		proms.push(createBrawlersChart());
		hasLoadedMain = true;
	}

	return $.when.apply($, proms);
}
var createMainChart = function() {
	var proms = [];

	var champNames = [];
	var newChamp = {
		name: "Win Rate",
		color: "#B60F2B",
		data: [],
		showInLegend: false,
	};
	$.each(champIDList, function(i, value) {
		newChamp.data.push({ y: value, champID: value, select: false});
		champNames.push(champData[value].name);
	});

	$("#main-chart").highcharts({
		chart: {
			type: "column",
			backgroundColor: "transparent",
			marginLeft: 65,
			marginRight: 15
		},
		xAxis: {
			categories: champNames
		},
		yAxis: {
			min: 0,
			max: 100,
			gridLineWidth: 0,
			labels: {
				enabled: true
			},
			title: {
				text: null
			},
			tickInterval: 50
		},
		title: {
			text: "Champion Pick Rate Over Time",
			style: {
				color: "#A8A8A8",
				fontWeight: "bold"
			}
		},
		legend: {
			reversed: true
		},
		tooltip: {
			formatter: function() {
				var s = "<b>" + this.x +"</b><br>";

				if (chartType == chartValue.PICKRATE) {
					s += "Pick Rate: ";
				} else if (chartType == chartValue.WINRATE) {
					s += "Win Rate: ";
				}

				s += this.y + "%"; //" " + this.points[0].point.champID;

				return s;
			},
			shared: true
		},
		credits: {
			enabled: false
		},
		series: [newChamp],

		plotOptions: {
			column: {
				borderWidth: 0,
			},
			series: {
				pointPadding: 0,
				groupPadding: 0.1,
				cursor: "pointer",
				//allowPointSelect: true,
				point: {
					events: {
						click: function(event) {
							var series = $("#main-chart").highcharts().series[0];
							
							//make points selectable
							this.select = !this.select;
							if (this.select) {
								this.update({ color: "#8A8A8A"}, true, false);
							} else {
								this.update({ color: "#B60F2B"}, true, false);
							}

							series.redraw();
						}
					}
				}
			}
		}
	});

	$("#chart-slider").slider({
		orientation: "vertical",
		min: 0,
		max: 1,
		change: function() {
			var oldText = $("#time-slider p").text();
			var value = $("#chart-slider").slider("option", "value");
			chartType = value;
			if (chartType == chartValue.PICKRATE) {
				$("#main-chart").highcharts().setTitle({text: "Champion Pick Rate Over Time"});
				$("#main-chart").highcharts().series[0].setData(getPickrateData());
				$("#time-slider p").text("Pick" + oldText.substr(oldText.indexOf(" ")));
			} else if (chartType == chartValue.WINRATE) {
				$("#main-chart").highcharts().setTitle({text: "Champion Win Rate Over Time"});
				$("#main-chart").highcharts().series[0].setData(getWinrateData());
				$("#time-slider p").text("Win" + oldText.substr(oldText.indexOf(" ")));
			}
		}
	});
	$("#chart-slider span").mousedown(function() {
		var value = !$("#chart-slider").slider("option", "value");
		$("#chart-slider").slider("value", value);
	})

	$("#main-chart").highcharts().series[0].redraw();

	proms.push(loadTimeData());
	var timeSlots = [
		"6:50 - 7:00pm",
		"7:00 - 7:10pm",
		"7:10 - 7:20pm",
		"7:20 - 7:30pm",
		"7:30 - 7:40pm",
		"7:40 - 7:50pm",
		"7:50 - 8:00pm",
		"8:00 - 8:10pm",
		"8:10 - 8:20pm",
		"8:20 - 8:30pm",
		"8:30 - 8:40pm",
		"8:40 - 8:50pm",
		"8:50 - 9:00pm",
		"9:00 - 9:10pm",
		"9:10 - 9:10pm",
		"9:20 - 9:30pm",
		"9:30 - 9:40pm",
		"9:40 - 9:50pm",
		"9:50 - 10:00pm",
		"10:00 - 10:10pm",
		"10:10 - 10:20pm",
		"10:20 - 10:30pm",
		"10:30 - 10:40pm",
		"10:40 - 10:50pm",
		"10:50 - 11:00pm",
		"11:00 - 11:10pm",
		"11:10 - 11:20pm"];

	$("#time-slider div").slider({
		min: 1,
		max: 25,
		value: 1,
		slide: function(event, ui) {
			$(this).slider('value', ui.value);
			var oldText = $("#time-slider p").text();
			var newText = oldText.substr(0, oldText.indexOf("[") + 1);
			var timeSegment = $("#time-slider div").slider("option", "value");
			newText += timeSlots[timeSegment] + "] EST";
			$("#time-slider p").text(newText);

			if (chartType == chartValue.PICKRATE) {
				$("#main-chart").highcharts().series[0].setData(getPickrateData());
			} else if (chartType == chartValue.WINRATE) {
				$("#main-chart").highcharts().series[0].setData(getWinrateData());
			}
		}
	});

	//create tutorial window
	tutProm = loadSource($("#chart-tutorial img"), "img/tut-circle.png");
	tutProm.done(function() {
		$("#chart-tutorial img").width($("#chart-slider span").width() * 3);
	});
	proms.push(tutProm);
	$("#chart-tutorial-close").click(function() {
		if (mainTutNumber == 0){
			$("#chart-tutorial").hide();
		} else {
			animateMainTutorial();
		}
	});

	return $.when.apply($, proms).then(function() {
		//set time data into chart
		$("#main-chart").highcharts().series[0].setData(getPickrateData());
	});
}
var getPickrateData = function() {
	var data = new Array(126);
	var curData = $("#main-chart").highcharts().series[0].data;
	var timeSegmentData = timeData[$("#time-slider div").slider("option", "value")].graphInfo;

	var timeIndex = 0;
	$.each(champData, function(i, value) {
		var index = champIDList.indexOf(value.id);
		var pickRate = parseFloat(timeSegmentData[timeIndex].pickRate);
		data[index] = { y: pickRate, champID: value.id, select: curData[index].select};
		timeIndex++;
	});

	return data;
}
var getWinrateData = function() {
	var data = new Array(126);
	var curData = $("#main-chart").highcharts().series[0].data;
	var timeSegmentData = timeData[$("#time-slider div").slider("option", "value")].graphInfo;

	var timeIndex = 0;
	$.each(champData, function(i, value) {
		var index = champIDList.indexOf(value.id);
		var pickRate = parseFloat(timeSegmentData[timeIndex].winRate);
		data[index] = { y: pickRate, champID: value.id, select: curData[index].select};
		timeIndex++;
	});

	return data;
}
var loadTimeData = function() {
	var dfd = $.Deferred();

	$.ajax({
		'async': true,
		'global': false,
		'url': "timeGraph.json",
		'dataType': "json",
		'success': function (data) {
			timeData = data.segments;
			dfd.resolve();
		},
	});

	return dfd.promise();
}
var createBrawlersChart = function() {
	var proms = [];

	var brawlerData = [{
		name: "Buy Rate",
		color: "#FFD900",
		data: [31.51, 16.04, 11.26, 5.5, 2.72]
	}, {
		name: "Win Rate",
		color: "#0074E8",
		data: [50.99, 49.96, 50.61, 48.19, 41.57]
	}];

	$("#brawlers-chart").highcharts({
		chart: {
			type: "bar",
			backgroundColor: "transparent",
			marginLeft: 137
		},
		xAxis: {
			categories: ["Razorfin", "Ironback", "Plundercrab", "Ocklepod", "None Bought"]
		},
		yAxis: {
			min: 0,
			max: 100,
			gridLineWidth: 0,
			labels: {
				enabled: true
			},
			title: {
				text: null
			},
			tickInterval: 50,
		},
		title: {
			text: "Brawler Win Rate & Buy Rate",
			style: {
				color: "#A8A8A8",
				fontWeight: "bold"
			}
		},
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function() {
				var s = '<b>'+ this.x +'</b>';

				$.each(this.points.reverse(), function(i, point) {
					s += '<br/><span style="color:'+ point.series.color +'">\u25CF</span>: ' +
						point.series.name + ': ' + point.y + "%";
				});

				return s;
			},
			shared: true,
			valueSuffix: "%"
		},
		series: brawlerData,
		plotOptions: {
			bar: {
				borderWidth: 0
			}
		}
	});

	proms.push(loadSource($("#brawler-img-rf"), "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/item/3611.png"));
	proms.push(loadSource($("#brawler-img-ib"), "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/item/3612.png"));
	proms.push(loadSource($("#brawler-img-pc"), "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/item/3613.png"));
	proms.push(loadSource($("#brawler-img-op"), "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/item/3614.png"));
	proms.push(loadSource($("#brawler-img-none"), "img/brawler-none.jpg"));

	return $.when.apply($, proms);
}
var animateMainTutorial = function() {
	$("#chart-tutorial").show();

	var elemLink;
	var infoText;
	if (mainTutNumber == 1) {
		elemLink = $("#time-slider span");
		infoText = "This slider changes the graph data to show the win rate and pick rate times.";
	} else if (mainTutNumber == 2) {
		elemLink = $("#chart-slider span");
		infoText = "This switch changes the graph from \"Win Rate\" to \"Pick Rate\".";
	}

	$("#chart-tutorial img").offset(function(){
		var width = $("#chart-tutorial img").width();
		var oLeft = elemLink.offset().left - width / 2 + 11;
		var oTop = elemLink.offset().top - width / 2 + 15;
		return {left: oLeft, top: oTop};
	});
	$("#chart-tutorial").offset(function(){
		var height = $("#chart-tutorial").height();
		var oLeft = elemLink.offset().left + 50;
		var oTop = elemLink.offset().top - height / 2 + 11 - 8;
		return {left: oLeft, top: oTop};
	});
	$("#chart-tutorial-info").text(infoText);

	mainTutNumber--;
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
CHAMP PANEL FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var loadChampPanel = function() {
	var proms = []

	jsonProms = [loadStatsData(), loadItemData()];

	proms.push(
		$.when.apply($, jsonProms).then(function() {
			createChampWindow();
	}));

	return $.when.apply($, proms);
}
var loadStatsData = function() {
	var dfd = $.Deferred();

	$.ajax({
		'async': true,
		'global': false,
		'url': "champStats.json",
		'dataType': "json",
		'success': function (data) {
			champStats = data.info;
			organizeChampStats();
			dfd.resolve();
		},
	});

	return dfd.promise();
}
var organizeChampStats = function() {
	//creates objects to be able to recall data
	var tempData = {};

	$.each(champStats, function(i, value) {
		var champID = value.championId;
		tempData[champID.toString()] = value;
	});

	champStats = tempData;
}
var loadItemData = function() {
	var dfd = $.Deferred();

	$.ajax({
		'async': true,
		'global': false,
		'url': "itemData.json",
		'dataType': "json",
		'success': function (data) {
			itemData = data.data;
			dfd.resolve();
		},
	});

	return dfd.promise();
}
function Scrollbar() {
	var self = this;
	self.totalHeight = 0;
	self.visibleHeight = 0;
	self.scrollbarHeight = 0;
	self.scrollposHeight = 0;

	self.getSizes = function() {
		self.totalHeight = $("#champ-select-portraits").height() + 5;
		self.visibleHeight = $("#champ-select-area").height();
		self.scrollbarHeight = $("#champ-scroll").height();
		var ratio = self.visibleHeight/self.totalHeight;
		$("#champ-scroll .scrollbar-pos").height(ratio * self.scrollbarHeight);
		self.scrollposHeight = $("#champ-scroll .scrollbar-pos").height();
	};
}
var closeChampWindow = function() {
	$("champ-select-area").scrollTop(0);
	$("#champ-select-window").hide();
	$("#champ-select-button").show();
}
var loadNewChamp = function(champ) {
	var proms = [];
	currentChampID = champ.id;

	//remove and hide previous champ info
	$("#champ-main-img").hide();
	$("#champ-name").html("<b>nbsp;</b><br><i>nbsp;</i>");
	$("#champ-winning-item img").attr("src", "img/item-black.jpg");
	if (hasLoadedChamp) { changeChampStats(true); }

	//load new info
	var imgProm = loadSource($("#champ-main-img"),
		"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + 
		champ.key + "_0.jpg");
	imgProm.done(function(){
		var x = champ.image.x;
		var y = champ.image.y;
		var zoom = champ.image.zoom == null ? 0.6 : parseFloat(champ.image.zoom);
		resizeChampPage(x, y, zoom);
	});
	proms.push(imgProm);
	proms.push(loadSource($("#champ-winning-item img"),
		"http://ddragon.leagueoflegends.com/cdn/5.14.1/img/item/" +
		champStats[currentChampID].bestItem + ".png"));

	//load new item info
	var itemObj = itemData[champStats[currentChampID].bestItem];
	var innerHTML = "";
	innerHTML += "<b>" + itemObj.name + "</b><br>";
	innerHTML += "<span class=\"item-cost\">Cost: " + itemObj.gold.total + "</span><br><br>";
	var itemDesc = itemObj.description.replace("<stats>", "<span class=\"item-stats\">").replace(
		"</stats>", "</span>").replace("<unique>", "<span class=\"item-unique\">").replace(
		"</unique>", "</span>").replace("<active>", "<span class=\"item-active\">").replace("</active>", "</span>");
	innerHTML += itemDesc + "<br><br>";
	innerHTML += "<i class=\"item-text\">" + itemObj.plaintext + "</i>";
	$("#champ-item-desc").html(innerHTML);


	return $.when.apply($, proms).then(function() {
		//add data to page and show
		if (hasLoadedChamp) { changeChampStats(); }
		$("#champ-main-img").show();
		$("#champ-name").html("<b>" + champ.name + "</b><br><i>" + champ.title + "</i>");

	})
}
var changeChampStats = function(removeStats) {
	if (removeStats) {
		//clear bar charts to 0
		for (var i=0; i<7; i++) {
			createStatsChart($("#champ-stats-" + i), i, [ 0, 0 ]);
		}
	} else {
		var props = ["Kills", "Deaths", "Assist", "GoldEarned", "MinionsKilled", "TowerKills", "WardsPlaced"];
		//add new data to bar charts
		for (var i=0; i<7; i++) {
			createStatsChart($("#champ-stats-" + i), i, [ champStats[currentChampID]["Avg"+props[i]],
				champStats[currentChampID]["Max"+props[i]] ]);
		}
	}
}
var animateChampTutorial = function() {
	$("#champ-tutorial").show();

	var elemLink;
	var infoText;
	var imgOffset;
	var infoOffset;
	if (champTutNumber == 1) {
		elemLink = $("#champ-select-button img");
		infoText = "You can change champions with this button here.";
		loadSource($("#champ-tutorial img"), "img/tut-circle.png");
		$("#champ-tutorial img").width(48);
		elemOffset = {top: -12, left: -12};
		infoOffset = {top: 0, left: -270};
	} else if (champTutNumber == 2) {
		elemLink = $("#champ-right-content");
		infoText = "Hovering on this graph shows the current champ's win rate with and without the Black Market items.";
		elemOffset = {top: 100, left: -80};
		infoOffset = {top: 100, left: -330};
		$("#champ-tutorial img").removeClass("flipped");
	} else if (champTutNumber == 3) {
		elemLink = $("#champ-left-content");
		infoText = "Hover over the graph to see each champ's total pick rate and ban rate.";
		elemOffset = {top: 100, left: 250};
		infoOffset = {top: 100, left: 400};
		$("#champ-tutorial img").addClass("flipped");
	}

	$("#champ-tutorial img").offset(function(){
		var width = $("#champ-tutorial img").width();
		var oLeft = elemLink.offset().left + elemOffset.left;
		var oTop = elemLink.offset().top + elemOffset.top;
		return {left: oLeft, top: oTop};
	});
	$("#champ-tutorial").offset(function(){
		var height = $("#champ-tutorial").height();
		var oLeft = elemLink.offset().left + infoOffset.left;
		var oTop = elemLink.offset().top + infoOffset.top;
		return {left: oLeft, top: oTop};
	});
	$("#champ-tutorial-info").text(infoText);

	champTutNumber--;
}
var createChampWindow = function() {
	var proms = [];

	//load basic data only once
	if (!hasLoadedChamp) {
		$("#champ-select-window").hide();
		$("#champ-select-button").click(function(){
			$("#champ-select-window").show();
			$("#champ-select-button").hide();
			champScrollbar.getSizes();
		});
		$("#champ-select-close").click(function(){
			closeChampWindow();
		});

		proms.push(loadSource($("#champ-select-button img"), "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/ui/champion.png"));
		proms.push(loadSource($("#champ-winning-item img"), "img/item-black.jpg"));

		//create stats divs
		createChampDivs();

		//set first random champion
		var randID = Math.floor(Math.random() * champIDList.length);
		proms.push(loadNewChamp(champData[champIDList[randID]]));

		//set scrollbar size and movement
		$("#champ-select-area").scroll(function(){
			var scrollRatio = $("#champ-select-area").scrollTop() /
				(champScrollbar.totalHeight - champScrollbar.visibleHeight);
			var top = scrollRatio * (champScrollbar.scrollbarHeight -
				champScrollbar.scrollposHeight);
			$("#champ-scroll .scrollbar-pos").css("top", top);
		});

		proms.push(loadSource($("#champ-gold-circle"), "img/champ-circle.png"));

		//create side graphs
		drawChampSideCharts();
		$("#champ-left-content canvas").mousemove(function(evt) {
			mouseCanvasLeft = getMousePos($("#champ-left-content canvas")[0], evt);
		});
		$("#champ-left-content canvas").mouseout(function(evt) {
			mouseCanvasLeft = {x: 0, y:0};
		});
		$("#champ-right-content canvas").mousemove(function(evt) {
			mouseCanvasRight = getMousePos($("#champ-right-content canvas")[0], evt);
		});
		$("#champ-right-content canvas").mouseout(function(evt) {
			mouseCanvasRight = {x: $("#champ-right-content canvas").width(), y: 0};
		});

		//set up tutorial
		tutProm = loadSource($("#champ-tutorial img"), "img/tut-arrow.png");
		tutProm.done(function() {
			//$("#champ-tutorial img").width($("#champ-slider span").width() * 3);
		});
		proms.push(tutProm);
		$("#champ-tutorial-close").click(function() {
			if (champTutNumber == 0){
				$("#champ-tutorial").hide();
			} else {
				animateChampTutorial();
			}
		});

		//set up hover window
		$("#champ-winning-item img").hover(function() {
			$("#champ-item-desc").show();
		}, function() {
			$("#champ-item-desc").hide();
		});

		hasLoadedChamp = true;
	}

	//add custom grid of champions to elem
	//create all the champion portraits in async
	//(to stop when user goes to new page if they have slow connection)
	if (!champLoopRunning) {
		champLoopRunning = true;
		proms.push(loadChampLoop(loadingDef.promise()));
	}

	return $.when.apply($, proms);
}
var loadChampLoop = function(loadProm) {
	var dfd = $.Deferred();

	if (numChampsLoaded < champIDList.length) {
		function addChampPortrait(i, callback) {
			var champURL = "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/champion/"
			+ champData[champIDList[i]].image.full;
			$("#champ-select-portraits").append("<span class=\"champ-icon\" id=\"champ-icon-id-" + champIDList[i] + "\"><img></span>");
			var prom = loadSource($("#champ-icon-id-" + champIDList[i] + " img"), champURL);
			$("#champ-icon-id-" + champIDList[i]).click(function(){
				closeChampWindow();
				var champID = this.id.substr(14);	//break off "#champ-icon-id-"
				loadNewChamp(champData[champID]).done(function(){
					//all champ data loaded
					
				});
			});
			numChampsLoaded++;

			//continue when image/DOM element loaded
			prom.done(callback);
		}
		var champLoop = asyncLoop(champIDList.length, numChampsLoaded,
			function(loop) {	//function to loop
				addChampPortrait(loop.iteration(), function(result) {
					loop.next();
				})},
			function(){		//callback function
				dfd.resolve();
				champLoopRunning = false;
			}
		);

		loadProm.fail(function() {
			champLoop.break();
		});
	} else {
		dfd.resolve();
		champLoopRunning = false;
	}

	return dfd.promise();
}
var asyncLoop = function(iterations, currentIter, func, callback) {
	var index = currentIter;
	var done = false;
	var loop = {
		next: function() {
			if (done) {
				return;
			}
			
			if (index < iterations) {
				index++;
				func(loop);
			} else {
				done = true;
				callback();
			}
		},
		iteration: function() {
			return index - 1;
		},
		break: function() {
			done = true;
			callback();
		}
	};
	loop.next();
	return loop;
}
var drawChampSideCharts = function() {
	//----------------------------------------------
	//FIRST CANVAS
	//----------------------------------------------
	var ctx = $("#champ-left-content canvas")[0].getContext("2d");
	var width = $("#champ-left-content").width();
	var height = $("#champ-left-content").height();
	var centerX = width + width/3;
	var thickness = width * .156;
	var data = [champStats[currentChampID].pickRate / 100,
		champStats[currentChampID].banRate / 100];			//pick rate, ban rate

	//clear the screen (also stops the lagging)
	$("#champ-left-content canvas")[0].width = width;

	//create clip mask
	ctx.save();
	ctx.beginPath();
	ctx.arc(centerX, height/2, width/2, toRad(223), toRad(137), true);
	ctx.arc(centerX - thickness, height/2, width/2, toRad(137), toRad(223), false);
	ctx.closePath();
	ctx.clip();

	//draw data
	ctx.fillStyle = "#ABACFF";
	ctx.globalAlpha = 0.5;
	drawWave(ctx, height * (1 - (data[0] + data[1])), width, height, 0, false);
	ctx.fillStyle = "#000833";
	ctx.globalAlpha = 0.7;
	drawWave(ctx, height  * (1 - data[0]), width, height, 3*Math.PI/4, false);
	ctx.globalAlpha = 1.0;

	//draw border (helps antialias)
	ctx.restore();
	ctx.strokeStyle = "#514222";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(centerX, height/2, width/2, toRad(223), toRad(137), true);
	ctx.arc(centerX - thickness, height/2, width/2, toRad(137), toRad(223), false);
	ctx.closePath();
	ctx.stroke();

	//draw text if mouse is over chart
	if (mouseCanvasLeft.x >= width * 0.667) {
		ctx.font = "13px Lucida Grande, Lucida Sans Unicode, Arial, Helvetica, sans-serif";
		ctx.textAlign = "right";
		ctx.fillStyle = "#8A8A8A";

		var nonHeight = height * (1 - (data[0] + data[1])) / 2;
		if (nonHeight < 13) {nonHeight = 13;}
		var nonPicked = 100.0 - (parseFloat(champStats[currentChampID].banRate) +
			parseFloat(champStats[currentChampID].pickRate));
		nonPicked = Math.round(nonPicked * 100) / 100;
		ctx.fillText("Untouched Rate: " + nonPicked + "%", width * 0.667 - 5, nonHeight);

		var pickHeight = height * (1 - data[0]) + 13;
		if (pickHeight > height) {pickHeight = height;}
		ctx.fillText("Pick Rate: " + champStats[currentChampID].pickRate + "%",
			width * 0.667 - 5, pickHeight);

		var banHeight = height * (1 - (data[0] + data[1])) + 13;
		if (banHeight > pickHeight - 15) {banHeight = pickHeight - 15;}
		ctx.fillText("Ban Rate: " + champStats[currentChampID].banRate + "%",
			width * 0.667 - 5, banHeight);
	}

	//----------------------------------------------
	//SECOND CANVAS
	//----------------------------------------------
	ctx = $("#champ-right-content canvas")[0].getContext("2d");
	width = $("#champ-right-content").width();
	height = $("#champ-right-content").height();
	centerX = -width/3;
	thickness = width * .156;
	data = [champStats[currentChampID].winWithItems / 100,
		champStats[currentChampID].winWithoutItems / 100];	//winrate, winrate where bought item

	//clear the screen (also stops the lagging)
	$("#champ-right-content canvas")[0].width = width;

	//create clip mask
	ctx.save();
	ctx.beginPath();
	ctx.arc(centerX + thickness, height/2, width/2, toRad(43), toRad(-43), true);
	ctx.arc(centerX, height/2, width/2, toRad(-43), toRad(43), false);
	ctx.closePath();
	ctx.clip();

	//draw data
	ctx.fillStyle = "#ABACFF";
	ctx.globalAlpha = 0.5;
	drawWave(ctx, height * (1 - (data[0] + data[1])), width, height, 0, true);
	ctx.fillStyle = "#000833";
	ctx.globalAlpha = 0.7;
	drawWave(ctx, height  * (1 - data[0]), width, height, 3*Math.PI/4, true);
	ctx.globalAlpha = 1.0;

	//draw border (helps antialias)
	ctx.restore();
	ctx.strokeStyle = "#514222";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(centerX + thickness, height/2, width/2, toRad(43), toRad(-43), true);
	ctx.arc(centerX, height/2, width/2, toRad(-43), toRad(43), false);
	ctx.closePath();
	ctx.stroke();

		//draw text if mouse is over chart
	if (mouseCanvasRight.x <= width * .333) {
		ctx.font = "13px Lucida Grande, Lucida Sans Unicode, Arial, Helvetica, sans-serif";
		ctx.textAlign = "left";
		ctx.fillStyle = "#8A8A8A";

		var nonHeight = height * (1 - (data[0] + data[1])) / 2;
		if (nonHeight < 13) {nonHeight = 13;}
		var nonPicked = 100.0 - (parseFloat(champStats[currentChampID].winWithItems) +
			parseFloat(champStats[currentChampID].winWithoutItems));
		nonPicked = Math.round(nonPicked * 100) / 100;
		ctx.fillText(nonPicked + "%: Loss Rate", width * 0.333 + 5, nonHeight);

		var pickHeight = height * (1 - data[0]) + 13;
		if (pickHeight > height) {pickHeight = height;}
		ctx.fillText(champStats[currentChampID].winWithItems + "%: Win % w/ BMB Items",
			width * 0.333 + 5, pickHeight);

		var banHeight = height * (1 - (data[0] + data[1])) + 13;
		if (banHeight > height - 15) {banHeight = height - 15;}
		ctx.fillText(champStats[currentChampID].winWithoutItems + "%: Win % w/o BMB Items",
			width * 0.333 + 5, banHeight);
	}

	//move the "waves"
	waveT += 0.07;

	setTimeout(drawChampSideCharts, 1000/30);
}
var drawWave = function(ctx, top, width, height, xOffset, rightSide) {
	var x = waveT;
	var y = Math.sin(x);
	var unit = 20;

	var startX = width * .667;
	var endX = width;
	if (rightSide) {
		startX = 0;
		endX = width*.333;
	}

	// draw sin curve
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(startX, unit*y+top);
	for (i = startX; i <= endX; i += 5) {
		x = waveT+(-startX+i) / unit;
		y = Math.sin(x + xOffset) / 16;	//11
		ctx.lineTo(i, unit*y+top);
	}
	ctx.lineTo(endX, height);
	ctx.lineTo(startX, height);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
var toRad = function(degrees) {
	return degrees * (Math.PI/180);
}
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
var createChampDivs = function() {
	for (var i=0; i<7; i++) {
		$("#champ-stats-chart").append("<div id=\"champ-stats-" + i + "\"></div>")
	}
}
var createStatsChart = function(elem, chartNum, stats) {
	var cats = ["Kills", "Deaths", "Assists", "Gold Earned", "Minion Kills", "Tower Kills", "Wards Placed"];

	var chartHeight = 100;
	if (chartNum > 0 && chartNum < cats.length - 1) {
		chartHeight -= 38;
	}

	var legendShow = false;
	if (chartNum == cats.length - 1) {
		legendShow = true;
	};

	var statsData = [{
		name: "Average",
		color: "#2993CC",
		data: [parseFloat(stats[0])],
		showInLegend: legendShow,
		legendIndex: 1
	}, {
		name: "Max",
		color: "#E36F22",
		data: [parseFloat(stats[1])],
		showInLegend: legendShow,
		legendIndex: 0
	}];

	var titleObj = null;
	if (chartNum == 0) {
		titleObj = {
			text: "Champion Statistics",
			style: {
				color: "#A8A8A8",
				fontWeight: "bold"
			}
		}
	}

	var chartOptions = {
		type: "bar",
		backgroundColor: "transparent",
		height: chartHeight,
		marginLeft: 85,
	}
	if (chartNum > 0) {
		chartOptions.marginTop = 0;
	}
	if (chartNum < cats.length - 1) {
		chartOptions.marginBottom = 0;
	}

	elem.highcharts({
		chart: chartOptions,
		xAxis: {
			categories: [cats[chartNum]],
		},
		yAxis: {
			gridLineWidth: 0,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickInterval: 50
		},
		title: titleObj,
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function() {
				var s = '<b>'+ this.x +'</b>';

				$.each(this.points.reverse(), function(i, point) {
					s += '<br/><span style="color:'+ point.series.color +'">\u25CF</span>: ' + point.series.name + ': ' + point.y;
				});

				return s;
			},
			shared: true
		},
		series: statsData,
		plotOptions: {
			bar: {
				borderWidth: 0
			}
		}
	});
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
MISC PANEL FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var loadMiscPanel = function() {
	var proms = [];

	if (!hasLoadedMisc) {
		proms.push(createMiscMap());
		hasLoadedMisc = true;
	}

	resizeMiscPage();
	$("#misc-map").width("20%");
	$("#misc-map-overlay img").css("right", "0px");
	$("#misc-map-overlay").width("80%");

	return $.when.apply($, proms);
}
var createMiscMap = function() {
	var proms = [];

	proms.push(loadSource($("#misc-sr-map img"), "img/heatmap.png"));
	proms.push(loadSource($("#misc-map audio"), "snd/mapunroll.mp3"));
	proms.push(loadSource($("#misc-scroll-map img"), "img/parchment16x9.jpg"));
	proms.push(loadSource($("#misc-teemo-killed img"), "img/teemo-killed.png"));
	proms.push(loadSource($("#misc-fifty-percent img"), "img/50-percent.png"))

	return $.when.apply($, proms).then(function() {
		$("#misc-map-overlay img").attr("src", "img/parchment16x9.jpg");
	});
}
var playMapSound = function() {
	$("#misc-map audio")[0].play();
}
var animateMap = function() {
	//don't go below 1000 (1 sec) for the speed
	var unrollSpeed = 1000;
	var uncurlSpeed = unrollSpeed * 1.0666;
	setTimeout(playMapSound, unrollSpeed - 1000);

	$("#misc-map").animate({"width": "100%"}, {duration: unrollSpeed, queue: false, easing: "easeInQuad",
		complete: function() {

		}});
	$("#misc-map-overlay img").animate({"right": -($("#misc-map").width())}, {duration: unrollSpeed, queue: false, easing: "easeInQuad",
		complete: function() {

		}});
	$("#misc-map-overlay").animate({"width": "0%"}, {duration: uncurlSpeed, queue: false, easing: "easeOutQuad",
		complete: function() {

		}});
}