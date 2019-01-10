$(function ()
{
	$(".enter-btn").on("button.click", function ( e ) {
        if($(".box-blind").is(":visible")) {
           $(".box-blind").addClass("active");
        } else {
            $(".box-blind").removeClass("active");
        }
    });
    
});