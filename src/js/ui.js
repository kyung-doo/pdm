var touchstart = "mousedown";
var touchmove = "mousemove";
var touchend = "mouseup";


if( navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/webOS/i)|| navigator.userAgent.match(/iPhone/i)|| navigator.userAgent.match(/iPad/i) ||
	navigator.userAgent.match(/iPod/i)|| navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i)) {

	touchstart = "touchstart";
	touchmove = "touchmove";
	touchend = "touchend";
}


$(function ()
{
	//버튼 생성
	$("*[data-ui='button']").each(function ( i )
	{
		var option = $(this).attr("data-option") ? $.parseJSON($(this).attr("data-option")) : {};
		$(this).button(option);
	});


	//탭메뉴 생성
	$("*[data-ui='tabmenu']").each(function ( i )
	{
		var option = $(this).attr("data-option") ? $.parseJSON($(this).attr("data-option")) : {};
		$(this).tabmenu(option);
	});


	//드래그 생성
	$("*[data-ui='draggable']").each(function ( i )
	{
		var option = $(this).attr("data-option") ? $.parseJSON($(this).attr("data-option")) : {};
		$(this).draggable(option);
	});

	//스와이퍼 생성
	$("*[data-ui='swiper']").each(function ( i )
	{
		console.log('!!!!!!!')
		var option = $(this).attr("data-option") ? $.parseJSON($(this).attr("data-option")) : {};
		$(this).swiper(option);
	});

});




/*
*	버튼 플러그인
*   태그로 생성 시 		 <a data-ui="button" data-options='{}'></a>
*   스크립트로 생성 시    $("div").button({});
*	옵션
*	 	mp3    : 버튼 효과음 있을 시
*	 	toggle : 토글버튼일 경우
*	 	target : 모달 or 레이어 타겟
*		targetOpenOnce : 모달 or 레이어 한번만 열기
*   이벤트
*		.on("button.down") // 터치스타트 이벤트
*		.on("button.click") // 클릭 이벤트
*		.on("button.click") // 클릭 이벤트
*		.on("button.soundUpdate") // mp3가 있을경우 sound 업데이트 이벤트
*		.on("button.soundFinish") // mp3가 있을경우 sound 종료 이벤트
*	메서드
*		.button("click")
*		.button("stop")
*/

(function ($) {
	'use strict';

	var Button = Button || (function () {
		/*
		* @ private 버튼 초기화
		* @ return void
		*/
		function initUI() {
			var owner  = this;

			if(this.options.mp3) registSound.call(this);

			if(owner.options.target) {
				$(owner.options.target).data("target", this.element);
			}

			owner.element.on(touchstart, function ( e ) {
				owner.touchTarget = owner.element;
				owner.element.addClass("down");
				owner.element.trigger("button.down");
			});

			$(window).on(touchend, function ( e ) {
				if(owner.touchTarget) {
					click.call(owner, owner.touchTarget);
					owner.touchTarget = null;
				}
			});
		}

		function click() {

			var owner = this;

			if(owner.sound) {
				owner.sound.play();
			}
			if(owner.options.toggle) {
				if(owner.element.is(".active")) {
					owner.element.removeClass("active");
				} else {
					owner.element.addClass("active");
				}
			}

			if(owner.options.target) {
				if(!owner.options.targetOpenOnce) {
					if(!$(owner.options.target).is(":visible")) {
						$(owner.options.target).show(true);
					}
					else {
						$(owner.options.target).hide(true);
					}
				}
				else {
					$(owner.options.target).show(true);
				}
			}

			if(!owner.options.mp3)	owner.element.removeClass("playing");
			else                    owner.element.addClass("playing");
			owner.element.trigger("button.click").removeClass("down");;
		}

		/*
		* @ private 사운드 있을 경우 등록
		* @ return void
		*/
		function registSound() {
			var owner = this;
			this.sound =  new AudioControl( this.options.mp3, {
				onFinish : function () {
					owner.element.removeClass("down");
					owner.element.trigger("button.soundFinish");
				},
				onUpdate : function () {
					owner.element.trigger("button.soundUpdate", [owner.sound]);
				}
			});
		}


		return Class.extend({

			/*
			* @ public constructor
			* @ params {element:jQueryObject 컨테이너, options:JSONObject 옵션}
			* @ return void
			*/
			init : function (element, options) {
				this.element = element;
				this.options = options;
				this.sound = null;
				this.touchTarget = null;
				initUI.call(this);
			},

			/*
			* @ public 버튼 제거
			* @ return void
			*/
			dispose : function () {
				this.element.off("mousedown mouseup touchstart touchend");
				$(window).off("mousedown mouseup touchstart touchend");
				this.element.data("ui.button", null);
			},

			/*
			* @ public 버튼 사운드 있을 시 사운드 정지
			* @ return void
			*/
			stop : function () {
				if(this.options.mp3) {
					this.sound.stop();
					this.element.removeClass("playing");
				}
			},

			/*
			* @ public 클릭
			* @ return void
			*/
			click : function () {
				click.call(this);
			},


			/*
			* @ public 타겟 감추기
			* @ return void
			*/
			hideTarget: function () {
				$(this.options.target).hide(true);
			}

		});

	})();

	// 버튼 기본 옵션
	Button.DEFAULT = {type: "default", toggle: false, target: "", targetOpenOnce: false, mp3: ""};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.button');
            var options =  $.extend({}, Button.DEFAULT, typeof option == "object" && option);
            if (!data) $this.data('ui.button', (data = new Button($this, options)));
            if (typeof option == 'string') data[option](params);
        });
    }

	window.Button = Button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;

})(jQuery);





/*
*	탭메뉴 플러그인
*   태그로 생성 시 		 <div data-ui="tabmenu" data-options='{}'>
*							<a class="active" data-ui="button" data-options='{"target":"#tab-target1"}'></a>
*							<a data-ui="button" data-options='{"target":"#tab-target2"}'></a>
*							<a data-ui="button" data-options='{"target":"#tab-target3"}'></a>
*						</div>
*
*						<div id="tab-target1"></div>
*						<div id="tab-target2"></div>
*						<div id="tab-target3"></div>
*
*   스크립트로 생성 시    $("div").tabmenu({});
*	옵션
*	 	
*   이벤트
*		
*	메서드
*		
*/
(function ($) {
	'use strict';

	var Tabmenu = Tabmenu || (function () {
		
		function initUI() {
			var owner  = this;
			owner.element.find("*[data-ui='button']").on("button.click", function ( e )
			{
				var target = $(this);
				owner.element.find("*[data-ui='button']").each(function ( i ) {
					if($(this)[0] == target[0]) {
						$(this).addClass("active");
					}
					else {
						$(this).removeClass("active").button("hideTarget");
					}
				})
			});
		}

		return Class.extend({
			init : function (element, options) {
				this.element = element;
				this.options = options;
				initUI.call(this);
			},
			dispose : function () {
				owner.element.find("*[data-ui='button']").off("button.click");
			}
		});

	})();

	// 기본 옵션
	Tabmenu.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.tabmenu');
            var options =  $.extend({}, Tabmenu.DEFAULT, typeof option == "object" && option);
            if (!data) $this.data('ui.tabmenu', (data = new Tabmenu($this, options)));
            if (typeof option == 'string') data[option](params);
        });
    }

	window.Tabmenu = Tabmenu;
    $.fn.tabmenu = Plugin;
    $.fn.tabmenu.Constructor = Tabmenu;

})(jQuery);



/*
*	드래그 플러그인
*   태그로 생성 시 		 <div data-ui="draggable" data-options='{}'>
							<div class="">
						</div>
*   스크립트로 생성 시    $("div").draggable({});
*	옵션
*		dragNum: array  		: 	area에 넣을 drag-item 인덱스 번호 [1,2,3] 다중) [[1,2,3],[1,2,3]]
*		clone:boolean   		: 	한개의 drag-item이 여러 area에 들어가야 할경우 복제
*		multi:boolean   		: 	한개의 area에 여러게 drag-item 이 들어가야할 경우
*		free:boolean    		: 	drop시 기본은 영역위치에 고정되는데 고정을 안시키는경우
*   이벤트
*
*	메서드
*
*/
(function ($){
	'use strict';

	var Draggable = Draggable || (function ()
	{

		function setDraggable()
		{
			
			var owner = this;
			this.element.find(".drag-item").each(function (i)
			{
				$(this).data("idx", i+1).data("x", $(this).attr("x")).data("y", $(this).attr("y"));
				$(this).find(".area").on(touchstart, $.proxy(onTouchStart, owner));
				TweenLite.set($(this), {position:"absolute", cursor:"move", x:$(this).attr("x"), y:$(this).attr("y")});
			});
			
			$(window).on(touchmove, $.proxy(onTouchMove, this));
			$(window).on(touchend, $.proxy(onTouchEnd, this));
		}

		function onTouchStart( e )
		{
			var pageX = e.pageX;
			var pageY = e.pageY;

			if(e.originalEvent.changedTouches)
			{
				pageX = e.originalEvent.changedTouches[0].clientX;
				pageY = e.originalEvent.changedTouches[0].clientY;
			}

			var target = $(e.currentTarget).parent();
			if(!target.data("area"))
			{
				this.startX = target.position().left - pageX;
				this.startY = target.position().top - pageY;
				
				if(this.options.clone)
				{
					if(!target.is(".clone")) this.touchTarget = cloneDrag.call(this, target);
				}
				else
				{
					this.touchTarget = target;
				}
				this.touchTarget.css({"z-index":999});
				this.element.trigger("draggable.touchStart", target.index());
			}

			
			
			e.preventDefault();
			e.stopPropagation();
		}

		function onTouchMove( e )
		{
			if(this.touchTarget)
			{
				var pageX = e.pageX;
				var pageY = e.pageY;
				if(e.originalEvent.changedTouches)
				{
					pageX = e.originalEvent.changedTouches[0].clientX;
					pageY = e.originalEvent.changedTouches[0].clientY;
				}

				var moveX = pageX;
				var moveY = pageY;
				TweenLite.set(this.touchTarget, {x:moveX+this.startX, y:moveY+this.startY});

				e.preventDefault();
				e.stopPropagation();
			}
		}

		function onTouchEnd( e )
		{
			if(this.touchTarget)
			{
				this.touchTarget.css({"z-index":""});
				var hitTarget = null;
				for(var i = 0; i<this.element.find(".drag-area").length; i++)
				{
					var area = this.element.find(".drag-area").eq(i);
					if(this.touchTarget.find(".area").objectHitTest({"object":area.find(".area")}) )
					{
						if(!this.options.multi)
						{
							if(!area.data("drag")) hitTarget = area;
						}
						else
						{
							hitTarget = area;
						}
						break;
					}
				}
				
				if(hitTarget)
				{
					if(check.call(this, this.touchTarget, hitTarget))
					{
						this.touchTarget.data("area", hitTarget);
						hitTarget.data("drag", this.touchTarget);

						if(!this.options.free) {
							
							var moveX = hitTarget.position().left;
							var moveY = hitTarget.position().top;
							TweenLite.set(this.touchTarget, {x:moveX, y:moveY, cursor:"default"});
						}
						
						this.touchTarget.css({cursor:"default"});

						this.touchTarget.addClass("active");
						hitTarget.addClass("active");
						this.element.trigger("draggable.success", [hitTarget.index(), this.touchTarget.index()]);

						if(this.checkFinish())
						{
							this.element.trigger("draggable.finish");
						}
					}
					else
					{
						
						if(this.options.clone)
						{
							this.touchTarget.remove();
						}
						else
						{
							TweenLite.to(this.touchTarget, 0.6, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y"), ease:Cubic.easeOut});
						}
						
						this.element.trigger("draggable.failed", [hitTarget.index(), this.touchTarget.index()]);
					}
				}
				else
				{
					if(this.options.clone)
					{
						this.touchTarget.remove();
					}
					else
					{
						TweenLite.to(this.touchTarget, 0.6, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y"), ease:Cubic.easeOut});
					}
				}

				this.startX = this.startY = 0;
				this.touchTarget = null;
			}
		}

		function cloneDrag( target )
		{
			var newTarget = target.clone();
			newTarget.addClass("clone");
			// newTarget.css({
			// 					"width": target.width(), 
			// 					"height": target.height(), 
			// 					"background-image": target.css("background-image")
			// 				});
			newTarget.data("idx", target.data("idx"));
			newTarget.on(this.touchstart, $.proxy(this.touchStart, this));
			target.parent().append(newTarget);
			return newTarget;
		}

		function check(target, area)
		{
			if(typeof this.options.dragNum[area.index()] === "number")
			{
				if(target.data("idx") == this.options.dragNum[area.index()])
				{
					return true;
				}
			}
			else
			{
				if($.inArray(target.data("idx"), this.options.dragNum[area.index()])>-1)
				{
					return true;
				}
			}
			return false;
		}

		
		
		return Class.extend({

			init : function (element, options)
			{
				this.element = element;
				this.options = options;
				this.touchTarget = null;
				this.startX = 0;
				this.startY = 0;
				setDraggable.call(this);
			},

			start : function ()
			{
				this._super();
				
				this.element.find(".drag-item").each(function ( i )
				{
					var x = parseInt($(this).attr("x"));
					var y = parseInt($(this).attr("y"));
					TweenLite.set($(this), {x:x, y:y, forse3D:true});
					$(this).data("x", x).data("y", y).css({top:0, left:0});
					$(this).data("idx", i);
				});

				setDraggable.call(this);
			},

			checkFinish : function ()
			{
				var len = 0;
				if(this.options.multi)
				{
					for(var i=0; i< this.options.dragNum.length; i++)
					{
						if(typeof this.options.dragNum[i] === "object")
						{
							for(var j = 0; j < this.options.dragNum[i].length; j++)
							{
								len++;
							}
						}
						else
						{
							len++;
						}
					}
				}
				else
				{
					len = this.options.dragNum.length;
				}
				if(this.options.customLength) len = this.options.customLength;
				if(this.element.find(".drag-item.active").length == len)
				{
					return true;
				}

				return false;
			},

			dispose : function ()
			{
				this.element.find(".drag-item .area").off("touchstart mousedown");
				$(window).off("touchmove mousemove");
				$(window).off("touchend mouseup");
			},

			reset : function () {
				this.element.find(".drag-item").each(function ()
				{
					$(this).data("area", null).removeClass("active");
					TweenLite.set($(this), {x:$(this).data("x"), y:$(this).data("y")});
				});
				this.element.find(".drag-area").each(function ()
				{
					$(this).data("drag", null);
				});
			}
		});

	})();

	// 메인 기본 옵션
	Draggable.DEFAULT = { dragNum : [], clone: false, multi: false, free: false, customLength:0};

    function Plugin(option, params)
    {
        return this.each(function ()
        {
            var $this = $(this);
            var data = $this.data('ui.draggable');
            var options =  $.extend({}, Draggable.DEFAULT, typeof option == "object" && option);
            if (!data) $this.data('ui.draggable', (data = new Draggable($this, options)));
			if (typeof option == 'string') data[option](params);
        });
    }

	window.Draggable = Draggable;

    $.fn.draggable = Plugin;
    $.fn.draggable.Constructor = Draggable;

})(jQuery);




/*
*	탭메뉴 플러그인
*   태그로 생성 시 		 <div data-ui="swiper" data-options='{}'>
*							
*						</div>
*
*
*   스크립트로 생성 시    $("div").swiper({});
*	옵션
*	 	
*   이벤트
*		
*	메서드
*		
*/
(function ($) {
	'use strict';

	var SwiperPlugin = SwiperPlugin || (function () {
		
		function initUI() {
			this.swiper = new Swiper(this.element[0], this.options);
		}

		return Class.extend({
			init : function (element, options) {
				this.element = element;
				this.options = options;
				this.swiper;
				initUI.call(this);
			},
			dispose : function () {
				
			},

			getSwiper : function () {
				return this.swiper;
			}
		});

	})();

	// 기본 옵션
	SwiperPlugin.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.swiper');
            var options =  $.extend({}, SwiperPlugin.DEFAULT, typeof option == "object" && option);
            if (!data) $this.data('ui.swiper', (data = new SwiperPlugin($this, options)));
            if (typeof option == 'string') data[option](params);
        });
    }

	window.SwiperPlugin = SwiperPlugin;
    $.fn.swiper = Plugin;
    $.fn.swiper.Constructor = SwiperPlugin;

})(jQuery);