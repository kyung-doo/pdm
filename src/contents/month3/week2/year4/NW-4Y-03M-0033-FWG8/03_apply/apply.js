$(function(){
	$("#drag-content").on("draggable.failed", function (e, idx1, idx2)
	{
		console.log(idx1, idx2);
		if( idx1 == 0 ) $(".answer1").addClass("hidden");
		if( idx1 == 1 ) $(".answer2").addClass("hidden");
		$(".answer1, .answer2").eq(idx2).removeClass("hidden").css("left", $(".drag-area").eq(idx1).position().left);
		$(".answer1, .answer2").eq(idx2).removeClass("hidden").css("top", $(".drag-area").eq(idx1).position().top);
	});
})