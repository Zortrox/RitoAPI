var pageName = {
	MAIN : 1,
	CHAMP : 2,
	MISC : 3,
}

var currentPage = pageName.MAIN;
var canChangePage = true;
var pageLoaded = true;
var loadingDef = $.Deferred();
var dataProms = [];
var champDATA = null;
var champArray = [];
var champScrollbar = null;
var currentChampX = 0;
var currentChampY = 0;
var currentChampZoom = .6;
var champPortraitWidth = 1215;
var champPortraitHeight = 717;
var doCoinAnim = false;

$(document).ready(function(){
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

	var prom1 = loadingDef.promise();
	champScrollbar = new Scrollbar();
	
	$("#all-panel").css("opacity", 0.0);
	$("body").css("overflow", "hidden");
	$("#all-panel").show();
	$("#side-buttons").css("opacity", 0.0);
	$("#side-buttons").show();
	
	loadNewPage();
	$("#bg-img img").css("opacity", 0.0);
	$("#bg-img img").load(function() {
		loadingCoinStop();
		$("#bg-img img").show();
		var prom2 = $("#bg-img img").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear", complete:
			function() {
				//show rest of page
				$("body").css("overflow", "auto");
				$("#side-buttons").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear"});
				arrivedAtPage();
			}}).promise();

		showWhenLoaded(prom1, prom2, currentPage);
	});

	$(window).resize(function(){
		resizeChampPage();
		if ( $("champ-select-window").css("display") != "none") {
			champScrollbar.getSizes();
		}

		resizeMiscPage();
	});
});

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

var arrivedAtPage = function() {
	canChangePage = true;
	loadingCoinStart();
}
var showWhenLoaded = function(prom1, prom2, page) {
	$.when(prom1, prom2).done(function() {
		showPanel(page);
	});
}

var changePage = function(page) {
	//wait until page switch ended before going to next page
	if (page != currentPage && canChangePage) {
		loadingDef.reject();	//don't show previous page
		loadingCoinStop();	//cancel current loading anim
		loadingDef = $.Deferred();
		var prom1 = loadingDef.promise();

		canChangePage = false;
		currentPage = page;
		hidePanel();
		var prom2 = animateBG(page);

		//shows panel when everything loads AND
		//when on correct "page"
		showWhenLoaded(prom1, prom2, currentPage);
	}
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

var loadMainPanel = function() {
	var newChamp = {
		name: "Winrate",
		color: "#B60F2B",
		data: [],
		showInLegend: false,
	};
	for (var i=0; i<126; i++) {
		newChamp.data.push({ y: i, champID: 62});
	}

	$("#main-chart").highcharts({
		chart: {
			type: "column",
			backgroundColor: "transparent",
			marginLeft: 30,
			marginRight: 15
		},
		xAxis: {
			categories: ["Aatrox", "Is", "Good"]
		},
		yAxis: {
			min: 0,
			max: 130,
			gridLineWidth: 0,
			labels: {
				enabled: false
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

	$(window).click(function() {
		$("#main-chart").highcharts().series[0].data[0].graphic.attr({width: $("#main-chart").highcharts().chartWidth - 50,
			x: 20
		});
		//$("#main-chart").highcharts().series[0].redraw();
	})
}

var loadChampList = function() {
	var dfd = $.Deferred();

	if (champDATA == null) {
		$.ajax({
			'async': true,
			'global': false,
			'url': "champData.json",
			'dataType': "json",
			'success': function (data) {
				champDATA = data.data;
				createChampArray(dfd);
			}
		});
	} else {
		dfd.resolve();
	}

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
	//TODO: this function
	//spin champion main portrait
	//blank, gray, or mark out data

	var imgProm = loadSource($("#champ-main-img img"),
		"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + 
		champ.key + "_0.jpg");
	imgProm.done(function(){
		var x = champ.image.x;
		var y = champ.image.y;
		var zoom = champ.image.zoom == null ? 0.6 : parseFloat(champ.image.zoom);
		resizeChampPage(x, y, zoom);
	});
	return imgProm;

	//when all data loaded,
		//remove spinning wheel
		//add data to page and show
}

var createChampArray = function(dfd) {
	var proms = [];

	//add custom grid of champions to elem
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

	champArray = [];
	$.each(champDATA, function(i, champID){
		champArray.push(champID.id);
	});
	champArray = champArray.sort(function(a, b){
		return champDATA[a].name.localeCompare(champDATA[b].name);
	});

	for (var i=0; i<champArray.length; i++) {
		//TODO check if add to proms
		var champUrl = "http://ddragon.leagueoflegends.com/cdn/5.14.1/img/champion/"
		+ champDATA[champArray[i]].image.full;
		$("#champ-select-portraits").append("<span class=\"champ-icon\" id=\"champ-icon-id-" + champArray[i] + "\"><img src=\"" + champUrl + "\"></span>");
		$("#champ-icon-id-" + champArray[i]).click(function(){
			closeChampWindow();
			var champID = this.id.substr(14);
			loadNewChamp(champDATA[champID]).done(function(){
				//TODO: Switch to loaded champ
			});
		});
	}

	//set first random champion
	var randID = Math.floor(Math.random() * champArray.length);
	proms.push(loadNewChamp(champDATA[champArray[randID]]));

	//set scrollbar size and movement
	$("#champ-select-area").scroll(function(){
		var scrollRatio = $("#champ-select-area").scrollTop() /
			(champScrollbar.totalHeight - champScrollbar.visibleHeight);
		var top = scrollRatio * (champScrollbar.scrollbarHeight -
			champScrollbar.scrollposHeight);
		$("#champ-scroll .scrollbar-pos").css("top", top);
	});

	$.when.apply($, proms).done(function() {
		dfd.resolve();
	});
}

var loadMiscPanel = function() {
	var proms = [];

	var parchmentProm = loadSource($("#misc-scroll-map img"), "img/parchment16x9.jpg");
	proms.push(parchmentProm);
	proms.push(loadSource($("#misc-sr-map img"), "img/heatmap.jpg"));
	proms.push(loadSource($("#misc-map audio"), "snd/mapunroll.mp3"));
	parchmentProm.done(function() {
		$("#misc-map-overlay img").attr("src", "img/parchment16x9.jpg");
	});

	resizeMiscPage();
	$("#misc-map").width("20%");
	$("#misc-map-overlay img").css("right", "0px");
	$("#misc-map-overlay").width("80%");

	return $.when.apply($, proms);
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

var loadNewPage = function() {
	dataProms = [];

	//remove current content
	//load all page content while switching
	if (currentPage == pageName.MAIN) {
		$("#main-panel").show();
		$("#champ-panel").hide();
		$("#misc-panel").hide();

		loadMainPanel();
	} else if (currentPage == pageName.CHAMP) {
		$("#main-panel").hide();
		$("#champ-panel").show();
		$("#misc-panel").hide();

		dataProms.push(loadChampList());
		resizeChampPage();
	} else if (currentPage == pageName.MISC) {
		$("#main-panel").hide();
		$("#champ-panel").hide();
		$("#misc-panel").show();

		dataProms.push(loadMiscPanel());
	}

	//when everything loaded
	$.when.apply($, dataProms).done(function () {
		loadingDef.resolve();

		//TODO: load other resources since page finished loading
	});
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