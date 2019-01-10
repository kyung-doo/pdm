$(function ()
{
    $(".big-btn").on("button.click", function ( e )
    {
        $(".hand.normal").hide();
    });

    $(".small-btn").on("button.click", function ( e )
    {
        $(".hand.ani").hide();
    });
});