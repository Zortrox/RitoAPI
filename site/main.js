var pageName = {
	MAIN : 1,
	CHAMP : 2,
	MISC : 3,
}

var currentPage = pageName.MAIN;
var canChangePage = true;
var pageLoaded = true;
var loadingDef = $.Deferred();	//deferred that resolves/rejects page load
var loadingMoreDef = $.Deferred();	//resolves/rejects downtime loading
var champData = null;	//converted JSON object
var champIDList = [];	//sorted champ IDs
var champScrollbar = null;
var currentChampX = 0;
var currentChampY = 0;
var currentChampZoom = .6;
var champPortraitWidth = 1215;
var champPortraitHeight = 717;
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
	$("#bg-img img").load(function() {bgImgDef.resolve()});
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
	//Do main page resizing here
}
var resizeChampPage = function(offsetX, offsetY, zoom) {
	var width = $(window).width();
	var circleWidth = $("#champ-main-img").width();
	var ratio = width/champPortraitWidth;

	if (offsetX != null) {
		currentChampX = offsetX;
	}
	if (offsetY != null) {
		currentChampY = offsetY;
	}
	if (zoom != null) {
		currentChampZoom = zoom;
	}

	$("#champ-main-img").height(circleWidth);
	$("#champ-main-img img").css({
		"width": $(window).width() * currentChampZoom,
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
		}
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
			if (page == pageName.MISC) {
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
		hasLoadedMain = true;
	}

	return $.when.apply($, proms);
}
var createMainChart = function() {
	var champNames = [];
	var newChamp = {
		name: "Winrate",
		color: "#B60F2B",
		data: [],
		showInLegend: false,
	};
	$.each(champIDList, function(i, value) {
		newChamp.data.push({ y: value, champID: value});
		champNames.push(champData[value].name);
	});

	$("#main-chart").highcharts({
		chart: {
			type: "column",
			backgroundColor: "transparent",
			marginLeft: 30,
			marginRight: 15
		},
		xAxis: {
			categories: champNames
		},
		yAxis: {
			min: 0,
			max: 130,
			gridLineWidth: 0,
			labels: {
				enabled: false
			},
			title: {
				text: "Pickrate"
			}
		},
		title: null,
		legend: {
			reversed: true
		},
		credits: {
			enabled: false
		},
		series: [newChamp],

		plotOptions: {
			column: {
				borderWidth: 0
			},
			series: {
				pointPadding: 0,
				//groupPadding: 0.1,
				cursor: "pointer",
				allowPointSelect: true,
				point: {
					events: {
						click: function(event) {
							var series = $("#main-chart").highcharts().series[0];
							//series.color = "#7cb5ec";
							$("#main-chart").highcharts().legend.colorizeItem(series, series.visible);
							$.each(series.data, function(i, point) {
								point.graphic.attr({
									//fill: "#7cb5ec"
								});
							});
							series.redraw();
							this.update({ y:126-this.y }, true, false);
							//selected = this;
						},
						mouseOver: function() {
							//if(this != selected)
							//this.update({ color: '' }, true,false);
						}
					}
				}
			}
		}
	});

	$("#main-chart").highcharts().series[0].redraw();

	$(".highcharts-yaxis-title").css("cursor", "pointer");
	$(".highcharts-yaxis-title").click(function(){
		if ($(this).text() == "Pickrate") {
			$("#main-chart").highcharts().yAxis[0].axisTitle.attr({
				text: "Winrate"
			});
			$("#main-chart").highcharts().series[0].setData(getWinrateData());
		} else if ($(this).text() == "Winrate") {
			$("#main-chart").highcharts().yAxis[0].axisTitle.attr({
				text: "Pickrate"
			});
			$("#main-chart").highcharts().series[0].setData(getPickrateData());
		}
	});

	$(window).click(function() {
		//$("#main-chart").highcharts().series[0].data[5].graphic.attr({width: $("#main-chart").highcharts().chartWidth - 50,
		//	x: 20
		//});
		//$("#main-chart").highcharts().series[0].redraw();
	});
}
var getPickrateData = function() {
	var data = [];

	$.each(champIDList, function(i, value) {
		data.push({ y: value, champID: value})
	});

	return data;
}
var getWinrateData = function() {
	var data = [];

	$.each(champIDList, function(i, value) {
		data.push({ y: value + 100, champID: value})
	});

	return data;
}

/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
CHAMP PANEL FUNCTIONS
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var loadChampPanel = function() {
	var proms = []

	proms.push(createChampWindow());

	return $.when.apply($, proms);
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
	//TODO: this function
	//spin champion main portrait
	//blank, gray, or mark out data
	var proms = [];

	$("#champ-main-img img").hide();
	var imgProm = loadSource($("#champ-main-img img"),
		"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + 
		champ.key + "_0.jpg");
	imgProm.done(function(){
		var x = champ.image.x;
		var y = champ.image.y;
		var zoom = champ.image.zoom == null ? 0.6 : parseFloat(champ.image.zoom);
		resizeChampPage(x, y, zoom);
	});
	proms.push(imgProm);

	return $.when.apply($, proms).then(function() {
		//TODO:
		//remove spinning wheel
		//add data to page and show
		$("#champ-main-img img").show();
	})
}
var createChampWindow = function() {
	var proms = [];

	//load basic data only once
	if (!hasLoadedChamp) {
		hasLoadedChamp = true;

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
				console.log('loop completed');
				callback();
			}
		},
		iteration: function() {
			return index - 1;
		},
		break: function() {
			done = true;
			console.log('cycle broken');
			callback();
		}
	};
	loop.next();
	return loop;
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

	proms.push(loadSource($("#misc-sr-map img"), "img/heatmap.jpg"));
	proms.push(loadSource($("#misc-map audio"), "snd/mapunroll.mp3"));
	proms.push(loadSource($("#misc-scroll-map img"), "img/parchment16x9.jpg"));

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