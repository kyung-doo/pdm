
$(function ()
{
	var count = 0;

	$("#drag-content").on("draggable.success", function ( e, idx1, idx2 ) {
		$(".drag-area").eq(count+1).show();
		$(".img-con > div").eq(idx1).addClass("img"+(idx2+1));
		count++;
	});

});