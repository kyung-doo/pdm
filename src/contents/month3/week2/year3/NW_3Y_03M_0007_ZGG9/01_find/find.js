$(function ()
{
	var audio1 = new AudioControl('../04_sound/0007_voice_02.mp3');
	audio1.play();

	$("#btn1").on("button.click", function ( e ) {
		$("#alert2").hide();
		$("#btn2").button("stop");
		audio1.stop();
	});

	$("#btn2").on("button.click", function ( e ) {
		$("#alert1").hide();
		$("#btn1").button("stop");
		audio1.stop();
	});

});