var currentPage = 1;
var mainOpacity = 0.8;
var canChangePage = true;
var pageLoaded = true;
var loadingDef = $.Deferred();

$(document).ready(function(){
	$("#button-page1").click(function(){
		changePage(0, 1);
	})
	$("#button-page2").click(function(){
		changePage(50, 2);
	})
	$("#button-page3").click(function(){
		changePage(100, 3);
	})

	$("#wrapper").css("opacity", 0.0);
	$("#main-panel").css("opacity", mainOpacity);
	$("#load-bg-img").attr("src", "img/Bilgewater_Slaughter_Docks.jpg").load(function() {
		$(this).remove();
		$("#bg-img").css("opacity", 0.0);
		$("#bg-img").css("background-image", "url('img/Bilgewater_Slaughter_Docks.jpg')");
		$("#bg-img").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear", complete:
			function() {
				//show rest of page
				$("#wrapper").animate({"opacity": 1.0}, {duration: 500, queue: false, easing: "linear"});
			}})
	});
});

$.fn.animateBG = function(x, speed) {
	//animate background image position to simulate page movement
	var dfd = $.Deferred();
	var pos = this.css('background-position').split(' ');
	this.x = parseInt(pos[0]) || 0;
	$.Animation( this, {
			x: x,
		}, { 
			duration: speed,
			queue: false,
			complete: function() {
				canChangePage = true;
				//SHOW COIN HERE
				dfd.resolve();
			}
		}).progress(function(e) {
			this.css('background-position', e.tweens[0].now+'% 0%');
	});

	return dfd.promise();
}

var changePage = function(perc, page) {
	//wait until page switch ended before going to next page
	if (page != currentPage && canChangePage) {
		loadingDef.reject();	//don't show previous page
		canChangePage = false;
		currentPage = page;
		var prom1 = hidePanel();
		var prom2 = $("#bg-img").animateBG(perc, 2000);

		//shows panel when everything loads AND
		//when on correct "page"
		$.when(prom1, prom2).done(function() {
			showPanel();
		});
	}
}

var loadNewPage = function() {
	//remove current content
	//load all page content while switching
	loadingDef = $.Deferred();

	//when everything loaded
		loadingDef.resolve();

	return loadingDef.promise();
}

var showPanel = function() {
	//HIDE COIN HERE
	//show panel after everything loaded
	$("#main-panel").animate({"opacity": mainOpacity},
		{duration: 500, queue: false, easing: "linear", complete: function() {
			//finished showing current page
		}});
}
var hidePanel = function() {
	$("#main-panel").animate({"opacity": 0.0},
		{duration: 500, queue: false, easing: "linear", complete: function() {
			//load all content
			$("body").scrollTop(0);
			return loadNewPage();
		}});
}