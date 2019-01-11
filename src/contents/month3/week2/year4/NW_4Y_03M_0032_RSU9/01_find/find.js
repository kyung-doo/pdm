var owner = this;
var count0 = 0;
var count1 = 0;
var count2 = 0;
var count3 = 0;
var count4 = 0;


$(function ()
{

	$(".drag-content").on("draggable.success", function ( e, idx1, idx2 )
    {
        var count = owner["count"+idx1];
        if(idx2 < 5) {
            $(".vote-set").eq(idx1).find(">div").eq(count).addClass("vote1");
        }
        else if(idx2 >= 5 && idx2 < 10) {
            $(".vote-set").eq(idx1).find(">div").eq(count).addClass("vote2");
        }
        else if(idx2 >= 10 && idx2 < 15) {
            $(".vote-set").eq(idx1).find(">div").eq(count).addClass("vote3");
        }
        else if(idx2 >= 15 && idx2 < 20) {
            $(".vote-set").eq(idx1).find(">div").eq(count).addClass("vote4");
        }
        else if(idx2 >= 20 && idx2 < 25) {
            $(".vote-set").eq(idx1).find(">div").eq(count).addClass("vote5");
        }
        owner["count"+idx1]++;
    });

    $(".drag-content").on("draggable.finish", function ( e )
    {
        console.log('finish')
    });

});