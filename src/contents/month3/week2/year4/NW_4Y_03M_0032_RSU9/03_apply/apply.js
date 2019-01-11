var owner = this;
var audio1 = new AudioControl("../04_sound/0007_voice_05.mp3");
var audio2 = new AudioControl("../04_sound/0007_voice_06.mp3");
var audio3 = new AudioControl("../04_sound/0007_voice_07.mp3");
var audio4 = new AudioControl("../04_sound/0007_voice_08.mp3");
var audio5 = new AudioControl("../04_sound/0007_voice_09.mp3");


$(function ()
{
	audio1.play();
	$("#gate").on("button.click", function ( e ) {
		audio1.stop();
		audio2.play();
	})
	
	$("#drag-content").on("draggable.touchStart", function ( e, idx ) {
		audio1.stop();
		audio2.stop();
		audio3.stop();
		audio4.stop();
		audio5.stop();

		owner['audio' + (idx+3)].play( idx );
	});	

});