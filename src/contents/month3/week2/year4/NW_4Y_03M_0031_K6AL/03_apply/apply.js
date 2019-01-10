$(function ()
{
	$(".puzzle-content").on("draggable.success", function (e, idx) {
		TweenLite.to( $(".puzzle-clear .item").eq(idx), 1, {opacity:1});
	});
	
});