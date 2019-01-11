$(function(){
	$("#drag-content").on("draggable.failed", function (e, idx1, idx2)
	{
		console.log(idx1, idx2);
	});
})