var AUDIO_BASE = "";
var VIDEO_BASE = "";

var touchstart = "mousedown";
var touchmove = "mousemove";
var touchend = "mouseup";


if( navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/webOS/i)|| navigator.userAgent.match(/iPhone/i)|| navigator.userAgent.match(/iPad/i) ||
	navigator.userAgent.match(/iPod/i)|| navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i)) {

	touchstart = "touchstart";
	touchmove = "touchmove";
	touchend = "touchend";
}



/*
* 제이쿼리 확장
*/
(function ( $ )
{
	$.extend({

		//파라메터 전체 가져오기
		getUrlVars: function(){
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},

		//파라메터 네임으로 가져오기
		getUrlVar: function(name) {
			return $.getUrlVars()[name];
		},

		//랜덤 만들기
		makeRandom : function ( randomNum, arNum )
		{
			var randomAr = new Array();
			var rand = new Array();
			var temp = new Array();
			var r,p,i;

			for(i = 0; i<randomNum; i++)
			{
				temp[i] = i;
			}

			for(i = 0; i<randomNum; i++)
			{
				r = Math.floor(Math.random() * (randomNum - i));
				p = temp[r];
				randomAr[i] = p;
				for(var j = r; j<randomNum - i- 1; j++)
				{
					temp[j] = temp[j + 1];
				}
			}

			for (i = 0; i < arNum; i++ )
			{
				rand[i] = randomAr[i];
			}

			return rand;
		},

		//앞뒤 공백제거
		trim : function ( str )
		{
			return str.replace(/(^\s*)|(\s*$)/gi, "");
		},

		//앞문자 공백제거
		trimLeft : function ( str )
		{
			return str.replace( /^\s*/g, "" );
		},

		//앞문자 공백제거
		trimRight : function ( str )
		{
			return str.replace( /^\s*/g, "" );
		},

		//  앞에 0 붙히기
		pad : function (num, size)
		{
			 var s = "0000" + num;
			return s.substr(s.length - size);
		},

		//배열 비교
		complement : function(a, b)
		{
			var res = [];
			var tmp = [];
			for(var i=0;i<a.length;i++) tmp.push(a[i]);
			for(var i=0;i<b.length;i++)
			{
				if(tmp[i] && b[i])  res.push(true);
				else              res.push(false);
			}
			return res;
		}
	});

})(jQuery);


/*
*	오디오 컨트롤
*/
(function ($){
	'use strict';

	var AudioControl = AudioControl || (function ()
	{
		/*
		* @ private 오디오 초기화
		* @ return void
		*/
		function initAudio()
		{
			for(var i=0; i < AudioControl.audioList.length; i++)
			{
				var audio = AudioControl.audioList[i];
				var src = $(audio).find("source").attr("src");
				if(src == this.source )
				{
					this.audio = audio;
					AudioControl.audioList.push(audio);
					return;
				}
			}
			
			this.audio = $("<audio><source src='"+this.source+"' type='audio/mpeg' /></audio>")[0];
			$("body").append($(this.audio));
			AudioControl.audioList.push(this.audio);
		}

		/*
		* @ private 오디오 업데이트 이벤트
		* @ return void
		*/
		function onUpdate()
		{
			if(this.audio.currentTime >= this.audio.duration)
            {
				this.audio.pause();
				this.audio.currentTime = 0;
				if(this.options.onUpdate) this.options.onUpdate( this.audio, 1);
				if(this.options.onFinish) this.options.onFinish( this.audio );

				if(this.loop)
				{
					this.audio.play();	
				}
				else
				{
					clearInterval(this.timer);
				}
			}
			else
			{
				var currentTime = this.audio.currentTime;
                var totalTime = this.audio.duration;
				var percent = this.audio.currentTime/this.audio.duration
				if(this.options.onUpdate) this.options.onUpdate( this.audio, percent);
			}
		}

		return Class.extend({

			/*
			* @ public constructor
			* @ params {source:String 소스경로, options:JSONObject 옵션}
			* @ return void
			*/
			init : function ( source, options )
			{
				this.audio;
				this.source = AUDIO_BASE+source;
				this.timer;
				this.options = {onFinish:null, onUpdate:null, loop:false}
				$.extend(this.options, options);
				initAudio.call(this);
			},

			/*
			* @ public 오디오 플레이
			* @ params {seek:Number 시작 타임}
			* @ return void
			*/
			play : function ( seek )
			{
				if( this.audio.paused )
				{
					if(seek)
					{
						this.audio.currentTime = this.audio.duration * seek;
					}
					var playPromise = this.audio.play();
					if (playPromise !== undefined)
					{
						playPromise.then(function(){}).catch(function (error){});
					}
					this.timer = setInterval($.proxy(onUpdate, this), 1000/30);
					onUpdate.call(this);
				}
			},

			/*
			* @ public 오디오 일시정지
			* @ return void
			*/
			pause : function ()
			{
				if(!this.audio.paused)
                {
                    this.audio.pause();
                    clearInterval(this.timer);
                }
			},

			/*
			* @ public 오디오 정지
			* @ return void
			*/
			stop : function ()
			{
				if(!this.audio.paused)
				{
					this.audio.pause();
					if(this.audio.currentTime > 0)this.audio.currentTime = 0;
					clearInterval(this.timer);
				}
			},

			/*
			* @ public 오디오 제거
			* @ return void
			*/
			dispose : function ()
			{
				$(this.audio).remove();
				this.audio = null;
				clearInterval(this.timer);
			}
		});

	})();

	AudioControl.audioList = [];

	window.AudioControl = AudioControl;

})(jQuery);



/*
*	비디오 컨트롤
*	비디오 컨트롤 클래스
*	생성 : var videoControl = new VideoControl( $(element), "video.mp4" );
*
*	options
*		onFinish : 비디오 재생 종료 콜백 ( default : null )
*		onUpdate : 비디오 재생 업데이트 콜백 ( default : null )
		controls : 시스템 컨트롤러 유무 ( default:"" )
*
*	public property
*		video : 비디오 객체
*		source : mp4 소스 경로
*
*	public method
*		setSource():void 비디오 소스 교체
*		play():void 비디오 플레이
*		pause():void 비디오 일시정지
*
*/
(function ($){
	'use strict';

	var VideoControl = VideoControl || (function ()
	{
		/*
		* @ private 비디오 초기화
		* @ return void
		*/
		function initVideo()
		{
			var html;
			if(this.options.controls)
			{
				html = "<video controls='"+this.options.controls+"'><source src='"+this.source+"' type='video/mp4' /></video>";
			}
			else
			{
				html = "<video preload='metadata'><source src='"+this.source+"' type='video/mp4' /></video>";
			}

			this.video = $(html)[0];
			this.video.load();
			this.target.append($(this.video));
			var owner = this;
			if(!this.options.controls)
			{
				this.video.controls = true;
				setTimeout(function ( e )
				{
					owner.video.controls = false;
				},10);
			}
		}

		/*
		* @ private 비디오 업데이트 이벤트
		* @ return void
		*/
		function onUpdate()
		{
			if(this.video.currentTime >= this.video.duration)
            {
				this.video.pause();
				this.video.currentTime = 0;
				if(this.options.onUpdate) this.options.onUpdate( this.video, 1);
				if(this.options.onFinish) this.options.onFinish( this.video );
				if(this.callBack)
				{
					this.callBack();
					this.callBack = null;
				}
				clearInterval(this.timer);
			}
			else
			{
				var currentTime = this.video.currentTime;
                var totalTime = this.video.duration;
				var percent = this.video.currentTime/this.video.duration
				if(this.options.onUpdate) this.options.onUpdate( this.video, percent);
			}
		}

		return Class.extend({

			/*
			* @ public constructor
			* @ params {source:String 소스경로, options:JSONObject 옵션}
			* @ return void
			*/
			init : function ( target, source, options )
			{
				this.target = target;
				this.source = VIDEO_BASE+source;
				this.video;
				this.timer;
				this.options = {onFinish:null, onUpdate:null, controls:""}
				this.callback = null;
				$.extend(this.options, options);
				initVideo.call(this);
			},

			setSource : function ( mp4 )
			{
				this.video.src = VIDEO_BASE + mp4;
			},

			/*
			* @ public 비디오 플레이
			* @ params {seek:Number 시작 타임}
			* @ return void
			*/
			play : function ( seek, callBack )
			{
				if( this.video.paused )
				{
					if(callBack) this.callBack = callBack;
					if(seek)
					{
						this.video.currentTime = this.video.duration * seek;
					}

					var playPromise = this.video.play();
					if (playPromise !== undefined) {
						playPromise.then(function(){}).catch(function (error){});
					  }
					this.timer = setInterval($.proxy(onUpdate, this), 1000/30);
					onUpdate.call(this);
				}
			},

			/*
			* @ public 비디오 일시정지
			* @ return void
			*/
			pause : function ()
			{
				if(!this.video.paused)
                {
                    this.video.pause();
                    clearInterval(this.timer);
                }
			},

			/*
			* @ public 비디오 정지
			* @ return void
			*/
			stop : function ()
			{
				if(!this.video.paused)
				{
					this.video.pause();
					this.video.currentTime = 0;
					clearInterval(this.timer);
				}
			},

			volume : function (vol)
			{
				if(vol == 0)
				{
					this.video.muted = true;
				}
				else
				{
					this.video.muted = false;
				}
				this.video.volume = vol;
			},

			fullscreen : function ()
			{
				if (this.video.requestFullscreen) {
					this.video.requestFullscreen();
				} else if (this.video.mozRequestFullScreen) {
					this.video.mozRequestFullScreen();
				} else if (this.video.webkitRequestFullscreen) {
					this.video.webkitRequestFullscreen();
				} else if(this.video.msRequestFullscreen){
					this.video.msRequestFullscreen();
				} else if(this.video.webkitEnterFullscreen){
					this.video.webkitEnterFullscreen();
				}
			},

			/*
			* @ public 비디오 제거
			* @ return void
			*/
			dispose : function ()
			{
				$(this.video).remove();
				this.video = null;
				clearInterval(this.timer);
			}
		});

	})();


	window.VideoControl = VideoControl;

})(jQuery);







/*
*	png 시퀀스
*/
(function ($){
	'use strict';

	
	
	var Sequence = Sequence || (function ()
	{

		function initSequence()
		{
			var owner = this;
			this.container = $('<div></div>');
			this.element.append(this.container);
			var image = $("<img src='../common/animation/"+this.options.source+"/"+this.options.name + pad(this.currentFrame, 4) + ".png' />");
			owner.container.append(image);
			if(this.options.autoPlay)
			{
				this.play();
			}
		}


		function pad(num, size)
		{
			 var s = "0000" + num;
			return s.substr(s.length - size);
		}

		function onUpdate( isFirst )
		{
			var owner = this;
			if(!isFirst)	this.currentFrame++;
			if(this.currentFrame > this.totalFrams) this.currentFrame = this.totalFrams;
			
			this.container.find("img").eq(0).attr("src", "../common/animation/"+this.options.source+"/"+this.options.name + pad(this.currentFrame, 4) + ".png");

			if(this.currentFrame >= this.totalFrams)
			{
				if(this.options.onFinish)
				{
					if(this.options.callbackTarget)   this.options.onFinish.call(this.options.callbackTarget, this );
					else                              this.options.onFinish( this );
				}
				
				this.stop();

				if(this.options.loop)
				{
					this.currentFrame = 1;
					this.timeout = setTimeout(function ()
					{
						owner.play();
					}, this.options.delay);
				}
			}
		}
		
		return Class.extend({

			init : function ( element, options )
			{
				this.element = element;
				this.container;
				this.options = {source:"", name:"", totalFrams:0, loop:true, autoPlay:true, fps:15, onFinish:null, delay:0, callbackTarget:null};
				$.extend(this.options, options);
				this.currentFrame = 1;
				this.timer;
				this.timeout;
				this.totalFrams = this.options.totalFrams;
				initSequence.call(this);
			},

			play : function ()
			{
				clearInterval(this.timer);
				this.timer = setInterval($.proxy(onUpdate, this), 1000/this.options.fps);
			},

			stop : function ()
			{
				
				clearInterval(this.timer);
				clearTimeout(this.timeout);
			},

			show : function ()
			{
				this.container.show();
			},

			hide : function (noUpdate)
			{
				var owner = this;
				if(!noUpdate)	onUpdate.call(this, true);
				setTimeout(function (){owner.container.hide();},100);
			},

			update:function ()
			{
				onUpdate.call(this);
			},

			dispose : function ()
			{
				clearInterval(this.timer);
				clearTimeout(this.timeout);
				this.container.remove();
			}
		});

	})();

	window.Sequence = Sequence;

})(jQuery);


