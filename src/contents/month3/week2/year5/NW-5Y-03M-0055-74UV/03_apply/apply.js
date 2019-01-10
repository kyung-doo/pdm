$(function ()
{
	//스와이퍼 클릭
	var swiper = $(".swiper-container").swiper("getSwiper");
	swiper.on('click', function( e )
	{
		var idx = $(e.target).parent().index();
		$("#content > div").hide();
		$("#content > div").eq(idx).show();
	});
	

});