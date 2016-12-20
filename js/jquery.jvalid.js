;(function($){
	
	var emptyFunc = function(){};
	var eventArr = ['keyup', 'keydown', 'keypress', 'blur', 'focus'];
	var dOption = {
		tips: 'invalid value',
		html : true,
		trigger : 'blur',
		emptyCheck : true,
		valid : emptyFunc,
		invalid : emptyFunc,
		clazz : '',
		pattern : '1==1',
		style : '',
		delay : 10
	};
	
	function isValidValue(event) {
		var value = event.target.value;
		var o = event.data;
		var empty = o.emptyCheck;
		var pattern = o.pattern;
		
		var isValid = true;
		if(!empty && value === '') {
			return true;
		}
		if(typeof pattern === 'string') {
			var s = 'var x="' + value + '";isValid=' + pattern;
			try {
				eval(s);
			} catch(e) {
				throw new Error('jValid pattern: invalid exp string: ' + e.message);
			}
		} else if(pattern instanceof RegExp) {
			isValid = pattern.test(value);
		}
		return !!isValid;
	}
	
	var timer = -1;
	function delayTrigger(event) {
		clearTimeout(timer);
		timer = setTimeout(jvalid.bind(this), event.data.delay, event);
	}
	
	function jvalid(event) {
		var $this = $(this);
		var isValid = isValidValue(event);
		if(isValid) {
			$this.trigger('jvalid.valid');
		} else {
			$this.trigger('jvalid.invalid');
		}
	}
	
	function validEvent(event) {
		var $this = $(this);
		var o = event.data;
		$this.removeClass(o.styleName);
		if(o.clazz) {
			$this.removeClass(o.clazz);
		}
		if(o.tips) {
			$this.next().hide();
		}
		o.valid.call(o, event.target.value);
	}
	
	function invalidEvent(event) {
		var $this = $(this);
		var o = event.data;
		$this.addClass(o.styleName);
		if(o.clazz) {
			$this.addClass(o.clazz);
		}
		if(o.tips) {
			$this.next().show();
		}
		o.invalid.call(o, event.target.value);
	}
	
	function bindEvent(ele, o) {
		if(eventArr.indexOf(o.trigger) === -1) {
			o.trigger = 'blur';
		}
		ele.on(o.trigger, o, delayTrigger);
		ele.on('jvalid.valid', o, validEvent);
		ele.on('jvalid.invalid', o, invalidEvent);
	}
	
	function addStyle(o) {
		if(o.style) {
			var style = $('<style></style>');
			style[0].innerHTML = '.' + o.styleName + '{' + o.style + '}';
			$(document.head).append(style);
		}
	}
	
	function addTips(ele, o) {
		if(o.tips === '') {
			return;
		}
		var reg = new RegExp('^\<.*?\>.*\<\/.*?\>$');
		if(o.html && reg.test(o.tips)) {
			var e = $(o.tips).hide();
			ele.after(e);
		} else {
			var span = $('<span>');
			span.text(o.tips);
			span.hide();
			ele.after(span);
		}
	}
	
	function combineConfig(ele, o) {
		var option;
		if(dOption === $.jValid.option) {
			option = dOption;
		} else {
			option = $.extend({}, dOption, $.jValid.option);
		}
		if(o === undefined) {
			o = {};
			var value;
			for(var i in option) {
				value = ele.data('jvalid-' + i);
				o[i] = value === undefined ? option[i] : value;
			}
		} else {
			o = $.extend({}, option, {});
		}
		convertRegExp(o);
		o.uid = Date.now();
		o.styleName = 'jv-inv-' + o.uid;
		return o;
	}
	
	function convertRegExp(o) {
		var reg = o.pattern;
		if(typeof reg === 'string' && reg.indexOf('/') === 0 && reg.lastIndexOf('/') !== 0) {
			var symbol = reg.slice(reg.lastIndexOf('/')+1) || undefined;
			reg = reg.slice(1, reg.lastIndexOf('/'));
			try {
				o.pattern = new RegExp(reg, symbol);
			} catch(e) {
				throw new Error('jValid pattern: ' + e.message);
			}
		}
	}
	
	$.fn.jValid = function(o) {
		o = combineConfig(this, o);	
		bindEvent(this, o);
		addStyle(o);
		addTips(this, o);
	};
	
	$.jValid = {
		option : dOption
	};
	
	$(function(){
		$('[data-jvalid]').each(function(){$(this).jValid();});
	});

})(window.jQuery);
