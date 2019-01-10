$(function ()
{
	var clearPos = [
		{x:-27, y:300},
		{x:-19, y:520},
		{x:340, y:507},
		{x:660, y:507},
		{x:1048, y:417}
	];
	$(".gate-btn").on("button.click", function ( e ) {
		$(this).hide();
		if($(".obj").is(":visible")) {
			TweenLite.set($(".obj"), {scaleX:0.5, scaleY:0.5, opacity:0});
			TweenLite.to($(".obj"), 1, {scaleX:1, scaleY:1, opacity:1, ease:Back.easeOut});
		}
	});

	$(".garbages > a").on("button.click", function ( e ) {
		var target = $(this);
		var idx = $(this).index();
		TweenLite.to($(this), 1, {delay:1, opacity:0, onComplete:function () {
			target.hide();
		}});
		TweenLite.to($(".clear-con"), 0.5, {delay:1.5, opacity:0, onComplete:function () {
			$(".blind-con").hide();	
			$(".clear-con").hide();	
		}});

		$(".clear-con").show();
		TweenLite.set($(".clear-con"), {opacity:0, x:clearPos[idx].x, y:clearPos[idx].y});
		TweenLite.to($(".clear-con"), 0.5, {opacity:1});
		$(".blind-con").show();
	});
});