var Banners = new Class({
	
	Implements: [Options, Events],
	
	options: {
		duration: 8000,
		transition: true,
		events: {}
	},
	
	initialize: function(banners, options)
	{
		this.setOptions(options);
		this.addEvents(this.options.events);
		this.banners = banners;
		this.banners.each(this.setup_banner.bind(this));
		this.current = -1;
		
		/*
if(this.banners.length > 1)
		{
			this.timeout = this.next.periodical(this.options.duration, this);
		}
*/
		this.next();
	},
	
	setup_banner: function(el)
	{
		new BannerItem(el);
		el.setStyles({'left': -el.getSize().x});
		el.setStyles({'opacity': 0});
		this.fireEvent('setupBanner', el);
	},
	
	prev: function()
	{
		this.go_to(this.current > 0 ? this.current - 1 : this.banners.length - 1);
		
	},
	
	next: function()
	{
		this.go_to(this.current < this.banners.length - 1 ? this.current + 1 : 0);
	},
	
	go_to: function(i)
	{
		var from = this.current == - 1 ? false : this.banners[this.current];
		this.current = i;
		this.transition(from, this.banners[i]);
	},
	
	transition: function(from, to)
	{
		clearInterval(this.timeout);
		if(this.options.transition)
		{
			if(from)
			{
				var onEnd = function(){
					$C(from).removeEvent('transitionEnd', onEnd);
					this.transitionIn(to, from);
				}.bind(this);
				$C(from).addEvent('transitionEnd', onEnd).transition('out');
			}
			else
			{
				this.transitionIn(to, from);
			}
		}
		
		this.fireEvent('current', [to, this.current]);
		this.fireEvent('transition', [from, to]);	
	},
	
	transitionIn: function(el, from)
	{
		if(from)
		{
			from.setStyle('z-index', 1);
			from.set('morph', {duration: 500}).morph({'left': -from.getSize().x, 'opacity': 0});
		}
		el.setStyle('z-index', 2);
		el.set('morph', {duration: 500}).morph({'left': 0, 'opacity': 1});
		(function(){
			var onEnd = function(){
				$C(el).removeEvent('transitionEnd', onEnd);
				this.start_timer();
			}.bind(this);
			$C(el).addEvent('transitionEnd', onEnd).transition('in');
		}.bind(this)).delay(500);
	},
	
	transitionOut: function(el)
	{
		
	},
	
	start_timer: function()
	{
		this.timeout = this.next.delay(this.options.duration, this);
	},
	
	stop: function()
	{
		clearInterval(this.timeout);
		return this;
	}

});


var BannerItem = new Class({
	Implements: [Options,Events],
	options:{},
	initialize: function(el, options)
	{
		this.setOptions(options);
		this.el = $(el);
		this.el.store('ClassRef', this);
		this.background_url = this.el.getStyle('background-image');
		this.background_url = this.background_url.substr(3, this.background_url.length - 1);
		this.content = this.el.getElement('.content');
		this.graphic = this.el.getElement('.graphic');
		
		this.graphic.setStyle(this.el.hasClass('image-left') ? 'right' : 'left', window.getSize().x * 2);
	},
	load: function()
	{
		new AssetLoader([this.background_url, this.graphic.getElement('img').get('src')], {events: {
			'load': function(){
				this.fireEvent('load');
			}.bind(this)
		}});
	},
	transition: function(dir)
	{
		this.fireEvent('transitionStart');
		
		if(dir.toLowerCase() == 'in')
		{
			var tween = new Fx.Tween(this.graphic, {property: this.el.hasClass('image-left') ? 'right' : 'left', duraction: 500});
			tween.set(window.getSize().x * 2);
			if(this.el.hasClass('image-center')) tween.start(0);
			else tween.start(window.getSize().x * .52);
			this.fireEvent.delay(500, this, ['transitionEnd']);
		}
		else if(dir.toLowerCase() == 'out')
		{
			var tween = new Fx.Tween(this.graphic, {property: this.el.hasClass('image-left') ? 'right' : 'left', duraction: 500});
			tween.start(window.getSize().x * 2);
			this.fireEvent.delay(500, this, ['transitionEnd']);
		}
	},
	toElement: function()
	{
		return this.el;
	}
});