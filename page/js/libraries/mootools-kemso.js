/*
---
Kemso More Extensions

copyrights:
  - [Kemso](http://kemso.com)

licenses:
  - You may not under any circumstances copy, redistribute, or re-sell this code, 
  	or use it as the basis for another site or application.
  - You may modify this code for the purposes of modifying a single insillation of the 
  	purchased product which which this code was distributed
  - http://whiteloupe.com/license.txt
...
*/



/*
---
MooTools: Kemso extensions

/*
---

name: Kemso

description: Mootools additions by Kemso

license: MIT-style license.

authors: Kemso, LLC (http://www.kemso.com)

provides: [Kemso]

...
*/

(function(){

this.Kemso = {
	version: '1.3'
};

// trace

var show_trace_hud = true;
var trace_hud_levels = ['debug', 'error'];

var trace = this.trace = function(){
	if(show_trace_hud){
		var level = false;
		var str = '';
		
		if(arguments.length == 2) level = arguments[0], str = arguments[1];
		else str = arguments[0];
		
		if(level && ! trace_hud_levels.contains(level.toLocaleLowerCase())) return false;
		if(level) str = level.toUpperCase()+' --> '+str;
		
		var hud = false;
		if( ! document.id('trace_hud')){
			hud = new Element('div', {
				'id': 'trace_hud',
				'styles': {
					'position': 'fixed',
					'z-index': '40',
					'top': '10px',
					'right': '10px',
					'width': Math.min(document.id(document.body).getSize().x - 40, 400),
					'padding': '10px',
					'background-color': '#000',
					'color': '#FFF',
					'font-size': '11px',
					'opacity': .9,
					'font-family': 'Helvetica'
				}
			}).inject(document.id(document.body), 'bottom');
			new Element('a', {'href': '#', 'class': 'hud_close', 'text': 'close'}).inject(hud).addEvent('click', function(e){
				e.stop();
				document.id('trace_hud').fade(0);
			});
			hud.appendText(' | ');
			new Element('a', {'href': '#', 'class': 'hud_close', 'text': 'off'}).inject(hud).addEvent('click', function(e){
				e.stop();
				window.show_trace_hud = false;
				document.id('trace_hud').fade(0);
			});
			new Element('div', {'class': 'hud_content', 'styles': {'position': 'static', 'max-height': 200, 'overflow-y': 'auto'}}).inject(hud);
		}else{
			hud = document.id('trace_hud');
		}
		var new_item = new Element('div', {'text': str, 'styles': {'border-bottom': '1px dotted #333'}}).inject(hud.getElement('.hud_content'));
		document.id('trace_hud').set('styles', {'display': 'block', 'visibility': 'visible', 'opacity': .9});
		hud.getElement('.hud_content').scrollTo(0, hud.getElement('.hud_content').getScrollSize().y - hud.getElement('.hud_content').getSize().y);
	}
};


// Alternate - adds even/odd classes to a collection of elements

var alternate = this.alternate = function(alternations){
	for(var i = 0, l = alternations.length; i < l; i++){
		var obj = document.id(alternations[i]);
		if(obj.getStyle('display') == 'none') continue;
		if (i % 2 == 0) obj.removeClass('even').addClass('odd');
		else obj.removeClass('odd').addClass('even');
	}
};


// Return stored class reference
var $C = this.$C = function(el){ return document.id(el).retrieve('ClassRef'); };


})();




var inline_elements = ['span', 'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'q', 'samp', 'select', 'small', 'strong', 'sub', 'sup', 'textarea', 'tt', 'var'];



/* Add to the Element Class */
Element.implement({

	getIndex: function(selector){
		var parent = this.getParent();
		if( ! parent) return 0;
		var children = parent.getChildren(selector);
		for(var i = 0, l = children.length; i < l; i++) if(children[i] == this) return i;
		return 0;
	},
	
	off: function(){
		if( ! this.retrieve('init_display_state') && this.getStyle('display') != 'none') this.store('init_display_state', this.getStyle('display'));
		this.setStyle('display', 'none');
		return this;
	},
	
	on: function(options){
		if( ! this.retrieve('init_display_state')){
			if(this.getStyle('display') != 'none') this.store('init_display_state', this.getStyle('display'));
			else this.store('init_display_state', inline_elements.contains(this.get('tag').toLowerCase()) ? 'inline' : 'block');
		}
		this.setStyles(Object.merge({
			opacity: this.getStyle('opacity') == 0 ? 1 : this.getStyle('opacity'),
			visibility: this.getStyle('visibility') == 'hidden' ? 'visible' : this.getStyle('visibility'),
			display: this.retrieve('init_display_state')
		}, options));
		return this;
	},
	
	toggle: function(){
		if(this.getStyle('display') != 'none') this.off(); else this.on();
		return this;
	},
	
	fadeOut: function(opts){
		options = Object.merge({ duration: 200, delay: 0, onComplete: function(){} }, opts);
		this.set('morph', {duration: options.duration, transition: Fx.Transitions.Quint.easeOut}).morph({opacity: 0});
		this.get('morph').addEvent('complete', options.onComplete).addEvent('complete', function(){
			$(this).setStyles({'visibility': 'visible', 'display': 'none', 'opacity': 1});
		}.bind(this));
		return this;
	},
	
	kill: function(opts){		
		this.fadeOut({onComplete: function(){ if(this) this.destroy(); }.bind(this)});
		return this;
	}
});

Elements.implement({ 
	off: function(){ this.each(function(el){ el.off(); }); return this; },
	on: function(){ this.each(function(el){ el.on(); }); return this; },
	toggle: function(){ this.each(function(el){ el.toggle(); }); return this; },
	fadeOut: function(){ this.each(function(el){ el.fadeOut(); }); return this; },
	kill: function(){ this.each(function(el){ el.kill(); }); return this; }
});



/*
---
description: Added the onhashchange event

license: MIT-style

authors: 
- sdf1981cgn
- Greggory Hernandez

requires: 
- core/1.2.4: '*'

provides: [Element.Events.hashchange]

...
*/
Element.Events.hashchange = {
    onAdd: function(){
        var hash = self.location.hash;

        var hashchange = function(){
            if (hash == self.location.hash) return;
            else hash = self.location.hash;

            var value = (hash.indexOf('#') == 0 ? hash.substr(1) : hash);
            value = (value.indexOf('!') == 0 ? value.substr(1) : value);
            value = (value.substr(0, 1) == '/' ? value.substr(1) : value);
            window.fireEvent('hashchange', value);
            document.fireEvent('hashchange', value);
        };

        if ("onhashchange" in window){
            window.onhashchange = hashchange;
        } else {
            hashchange.periodical(50);
        }
    }
};

function location_hash(hash)
{
	if(typeOf(hash) == 'number') return location_hash_segment(hash);
	if(typeof(hash) != 'undefined') window.location.hash = '!/'+hash;
	var val = window.location.hash.length > 1 ? window.location.hash.substr(1) : '';
	val = (val.indexOf('!') == 0 ? val.substr(1) : val);
	if(val.substr(0, 1) == '/') val = val.substr(1);
	return val;
}

function location_hash_segment(num)
{
	var hash = location_hash();
	if(hash.substr(0, 1) == '/') hash = hash.substr(1);
	if(hash.substr(-1) == '/') hash = hash.substr(0, hash.length - 1); // Don't think this works in IE
	
	var parts = hash.split('/');
	if(typeOf(parts[num]) == 'null') return false;
	return parts[num];
}


var LocationHash = new Class({
	
	Implements: [Options, Events],
	
	options: {
		seperator: '/',
		schema: ['controller', 'method'],
		listen_only: false,
		events: {}
	},
	
	parts: [],
	
	initialize: function(options)
	{
		this.setOptions(options);
		this.addEvents(this.options.events);
		
		this.fire_change = true;
		window.addEvent('hashchange', this.onChange.bind(this));
		
        this.parts = location_hash().split(this.options.seperator);
        
		//if(this.parts) this.onChange(location_hash());
	},
	
	onChange: function(value)
	{
		var oldparts = this.parts;
		var changes = [];
		this.parts = value.split(this.options.seperator);
		
		this.parts.each(function(item, key){
			if(item != oldparts[key]) changes.push(true); else changes.push(false);
		});
		
		if( ! this.fire_change)
		{
			this.fire_change = true;
		}
		else
		{
			this.fireEvent('change', [this.get(), this.parts, oldparts, changes]);
		}
	},
	
	set: function()
	{
		var hash = [];
		
		// Pass an object to change only specific parts of the hash
		if(typeOf(arguments[0]) == 'object')
		{
			hash = Array.clone(this.parts);
			for(var i in arguments[0]) hash.splice(i, 1, arguments[0][i]);
		}
		
		// Pass an array
		else if(typeOf(arguments[0]) == 'array')
		{
			hash = arguments[0];
		}
		
		// Parts as arguments
		else
		{
			for(var i = 0, l = arguments.length; i < l; i++) hash.push(arguments[i]);
		}
		
		hash = hash.join(this.options.seperator);
		
		// If we're we're in listen only mode AND the hash is different, don't fire change.
		if(this.options.listen_only && location_hash() != hash) this.fire_change = false;
		
		location_hash(hash);
	},
	
	
	get: function()
	{
		if(this.options.schema)
		{
			var schema = {arguments: false};
			this.options.schema.each(function(name, key){
				schema[name] = this.parts[key];
			}.bind(this));
			
			if(this.parts.length > this.options.schema.length) schema.arguments = this.parts.slice(this.options.schema.length);
			
			return schema;
		}
		else
		{
			return this.parts;
		}
	},
	
	
	schema: function()
	{
		this.options.schema = arguments;
		return this;
	}
	
});




/*
---
 
name: Kemso.Scrollbar
description: A MooTools Overflow scrollbar class

version: 1.0
copyright: Kemso, LLC (http://kemso.com)
license: MIT License
authors:
- Matt McCloskey

requires: [MooTools Core, More/Drag]

provides: Kemso.ScrollBar
 
...
*/


/* Implement a new Set method of Fx to fire an update event for the scroll bar */
Fx.implement({
	step: function(now){
		if (this.options.frameSkip){
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		} else {
			this.frame++;
		}
		
		if (this.frame < this.frames){
			var delta = this.transition(this.frame / this.frames);
			this.set(this.compute(this.from, this.to, delta));
			this.fireEvent('update');
		} else {
			this.frame = this.frames;
			this.set(this.compute(this.from, this.to, 1));
			this.stop();
		}
	}
});


/* Create a scroll bar from existing elements */
Kemso.ScrollBar = new Class({
	
	Implements: [Options, Events],

	options: {
		axis: 'y',
		trackClick: true,
		wheel: true,
		wheelSensitivity: 4,
		minHandleSize: 30,
		autoResize: true,
		events: {}
	},

	initialize: function(content, track, handle, options){
		this.setOptions(options);
		
		if(Browser.firefox) this.options.wheelSensitivity = .5;
		if(Browser.chrome) this.options.wheelSensitivity = .1;
		
		this.addEvents(this.options.events);
		
		/* Elements */
		this.content = document.id(content);
		this.control = false;
		if(typeOf(track) != 'null' && track) this.control = new Kemso.ScrollBar.Track(handle, track, this.options).addEvents({
			'move': this.update.bind(this)
		});
		
		this.has_scroll = false;
		this.scroll_pos = {x:0, y:0};
		this.wheel_last_value = 0;
		this.wheel_speed = 0;
			
		this.resize();		
		
		if(this.options.wheel)
		{
			this.content.addEvent('mousewheel', this.mousewheel.bind(this));
			if(this.control) this.control.track.addEvent('mousewheel', this.mousewheel.bind(this));
		}
				
		// Autoresize with window
		if(this.options.autoResize) window.addEvent('resize', this.resize.bind(this));
		
		// Is it an iPad?
		// Scroll Effect
		var desktop_touch = false; //Browser.safari;
		if(typeOf(Touch.Scroll) != 'null' && (desktop_touch || Browser.Platform.ios || Browser.Platform.android || Browser.Platform.webos))
		{
			// There has to be a wrapper around the content here for touch scroll to work.
			if(this.content.getChildren().length > 1)
			{
				var wrap = new Element('div', {'class': 'scroll-container-wrapper'});
				this.content.getChildren().each(function(el){
					el.inject(wrap);
				});
				wrap.inject(this.content);
			}
			
			this.touch_scroll = new Touch.Scroll(this.content, {
				desktopCompatibility: desktop_touch,
				direction: this.options.axis == 'x' ? 'horizontal' : 'vertical',
				snap: false,
				momentum: true,
				vScrollbar: false,
				hScrollbar: false,
				events: {
					'scroll': function(pos){
						pos.x = -pos.x;
						pos.y = -pos.y;
						this.scroll_pos = {
							x: pos.x / (this.content.getScrollSize().x - this.content.getSize().x),
							y: pos.y / (this.content.getScrollSize().y - this.content.getSize().y)
						};
						if(this.control) this.control.move(this.scroll_pos.x, this.scroll_pos.y);
					}.bind(this)
				}
			});
		}

	},
	
	// --------------------------------------------------------------------
		
	/**
	 * Set scroll by percentage object
	 * 
	 */
	update: function(pos)
	{
		this.scroll_pos = pos;
		this.scrollTo(
			this.scroll_pos.x * (this.content.getScrollSize().x - this.content.getSize().x),
			this.scroll_pos.y * (this.content.getScrollSize().y - this.content.getSize().y),
			false
		);
	},
	
	
	// --------------------------------------------------------------------
		
	/**
	 * Set scroll by x & y values.
	 * 
	 */
	scrollTo: function(x, y, animate)
	{
		if(typeOf(this.watch_timeout) == 'null' || this.watch_timeout === false){
			this.fireEvent('start');
			this.v_change = 0;
			this.h_change = 0;
			clearTimeout(this.watch_timeout);
		}else{
			this.fireEvent('scroll');
			clearTimeout(this.watch_timeout);
		}
		this.watch_timeout = setTimeout(function(){
			this.fireEvent('end');
			this.watch_timeout = false;
		}.bind(this), 100);
		
		//trace('scrollTo: '+x+', '+y);
		if( ! this.has_scroll) return false;
		
		if(typeOf(animate) == 'null') animate = true;
		var scroll_size = this.content.getScrollSize();
		var content_size = this.content.getSize();
		x = this.options.axis == 'x' ? Math.max(0, Math.min(x || this.content.getScroll().x, scroll_size.x - content_size.x)) : 0;
		y = this.options.axis == 'y' ? Math.max(0, Math.min(y || this.content.getScroll().y, scroll_size.y - content_size.y)) : 0;
		
		if(animate)
		{
			new Fx.Scroll(this.content, {duration: 500, transition: 'sine:in:out'}).addEvent('update', function(){
				this.scroll_pos = {
					x: this.content.getScroll().x / (this.content.getScrollSize().x - this.content.getSize().x),
					y: this.content.getScroll().y / (this.content.getScrollSize().y - this.content.getSize().y)
				};
				if(this.control) this.control.move(this.scroll_pos.x, this.scroll_pos.y);
			}.bind(this)).start(x, y);
		}
		else
		{
			this.content.scrollTo(x, y);
			
			this.scroll_pos = {
				x: this.content.getScroll().x / (this.content.getScrollSize().x - this.content.getSize().x),
				y: this.content.getScroll().y / (this.content.getScrollSize().y - this.content.getSize().y)
			};
			if(this.control) this.control.move(this.scroll_pos.x, this.scroll_pos.y);
			//trace(this.scroll_pos.x+', '+this.scroll_pos.y);
		}
	},
	
	
	// --------------------------------------------------------------------
		
	/**
	 * Handle mousewheel event
	 * 
	 */
	mousewheel: function(event){
		if(this.has_scroll){
		
			// Add X & Y values to event if possible
			event.wheelX = (typeOf(event.event.wheelDeltaX) == 'number') ? event.event.wheelDeltaX / 120 : false;
			event.wheelY = (typeOf(event.event.wheelDeltaY) == 'number') ? event.event.wheelDeltaY / 120 : false;
			if(Browser.firefox){
				var ff_diviser = 3;
				if (typeOf(event.event.axis) && event.event.axis == event.event.HORIZONTAL_AXIS){
	                // FF can only scroll one dirction at a time
	                event.wheelX = (-event.event.detail/ff_diviser) * Math.max(1, Math.abs(((event.event.detail/ff_diviser)/1.2)));
	                event.wheelY = false;
	            }else {
	            	event.wheelX = false;
	            	event.wheelY = (-event.event.detail/ff_diviser) * Math.max(1, Math.abs(((event.event.detail/ff_diviser)/1.2)));
	            } 
			}
			
			// Only use mouse wheel if the scroll is in the same direction as our axis (or if we can't tell direction)
			if(
				(this.options.axis == 'x' && event.wheelX) || 
				(this.options.axis == 'y' && event.wheelY) || 
				( ! event.wheelX && ! event.wheelY)
			)
			{
				var wheel = (this.options.axis == 'x' && event.wheelX) ? event.wheelX : ((this.options.axis == 'y' && event.wheelY) ? event.wheelY : event.wheel);
				
				// If we're getting data in both directions, try to calculate the change.
				if(event.wheelX && event.wheelY)
				{
					if(typeOf(this.v_change) == 'null') this.v_change = 0;
					if(typeOf(this.h_change) == 'null') this.h_change = 0;
					this.v_change += Math.abs(event.wheelY);
					this.h_change += Math.abs(event.wheelX);
					var dir = this.v_change > this.h_change ? 'y' : 'x';
					if(dir != this.options.axis) return;
				}
				
				// Only move if there's room left to scroll in the current scroll direction
				if((this.scroll_pos[this.options.axis] > 0 && this.scroll_pos[this.options.axis] < 1) || (wheel < 0 /* down */ && this.scroll_pos[this.options.axis] == 0) || (wheel > 0 /* up */ && this.scroll_pos[this.options.axis] == 1)){
					
					// Stop default window scroll
					event.stop();
					event.preventDefault();
					
					// Wheel speed
					if(this.wheel_last_value){
						this.wheel_speed = wheel - this.wheel_last_value;
					} else {
						this.wheel_speed = 0;
					}
					this.wheel_last_value = wheel;					
					var sensitivity = this.options.wheelSensitivity;
					//if(this.wheel_speed < 2 && sensitivity > 1) sensitivity = 1;
					//sensitivity = Math.abs(event.wheel) > sensitivity ? sensitivity : 1;
					var cur_scroll = this.content.getScroll();
					this.scrollTo(cur_scroll.x - (wheel/sensitivity), cur_scroll.y - (wheel/sensitivity), false);
					if(this.control) this.control.move(this.scroll_pos.x, this.scroll_pos.y);
				}
			}
		}
	},
	
	
	
	// --------------------------------------------------------------------
		
	/**
	 * Resize
	 * 
	 */
	resize: function()
	{
		if(this.content.getScrollSize()[this.options.axis] > this.content.getSize()[this.options.axis]){
			if(this.control) this.control.on();
			this.content.addClass('has-bar');
			this.has_scroll = true;
		}else{
			if(this.control) this.control.off();
			this.content.removeClass('has-bar');
			this.has_scroll = false;
		}
		if(this.control) this.control.resize(this.content.getSize()[this.options.axis] / this.content.getScrollSize()[this.options.axis]);
	}
});


/* Handle the scroll bar */
Kemso.ScrollBar.Track = new Class({

	Implements: [Options, Events],
	
	options: {
		axis: 'y',
		minHandleSize: 30
	},
	
	initialize: function(handle, track, options)
	{
		this.setOptions(options);
		this.handle = document.id(handle);
		this.track = document.id(track);
		this.handle_init = this.handle.getPosition(this.track);
		this.position = {x:0, y:0};
		this.resize();
		
		this.handle.setStyles({'position': 'absolute', 'left': this.handle_limit.left, 'top': this.handle_limit.top});
		
		this.drag = new Drag(this.handle, {
			preventDefault: true,
			snap: 0,
			limit: {
				x: [this.handle_limit.left, this.handle_limit.right], 
				y: [this.handle_limit.top, this.handle_limit.bottom]
			}
		}).addEvents({
			'drag': function(el, e){
				this.fireEvent('move', [this.getPosition()]);
			}.bind(this)
		});
		
		this.handle.addEvent('click', function(e){ e.stop(); });
		//this.handle.set('tween', {duration: 300, transition: 'sine:in:out'}).get('tween').addEvent('update', this.update.bind(this));
		
		if(this.options.trackClick){
			this.track.addEvent('click', function(e){
				var mouse = {x: e.page.x - this.track.getPosition().x, y: e.page.y - this.track.getPosition().y};
				var change = {x: this.handle.getSize().x, y: this.handle.getSize().y};
				if(mouse.x < this.handle.getPosition(this.track).x) change.x = -change.x;
				if(mouse.y > this.handle.getPosition(this.track).y) change.y = -change.y;
				//trace('trackClick');
			}.bind(this));
		}
	},
	
	/* Return an object with percentage x & y values for position of the handle */
	getPosition: function()
	{
		this.position = {
			x: (this.handle.getPosition(this.track).x - (this.handle_limit.left)) / (this.track.getSize().x - (this.handle_limit.left * 2) - this.handle.getSize().x),
			y: (this.handle.getPosition(this.track).y - (this.handle_limit.top)) / (this.track.getSize().y - (this.handle_limit.top * 2) - this.handle.getSize().y)
		};
		
		return this.position;
	},
	
	/* Move handle by a percentage */
	move: function(perc_x, perc_y)
	{
		this.handle.setStyles({
			'left': this.handle_limit.left + (perc_x * (this.track.getSize().x - this.handle.getSize().x - (this.handle_limit.left * 2))),
			'top': this.handle_limit.top + (perc_y * (this.track.getSize().y - this.handle.getSize().y - (this.handle_limit.top * 2)))
		});
	},
	
	resize: function(bar_size_perc)
	{
		if(typeOf(bar_size_perc) != 'null')
		{
			this.handle.setStyle(
				this.options.axis == 'x' ? 'width' : 'height', 
				Math.max(this.options.minHandleSize, (bar_size_perc * this.track.getSize()[this.options.axis]))
			);

		}	
		
		this.handle_limit = {
			'left': this.handle_init.x,
			'top': this.handle_init.y,
			'right': this.options.axis == 'x' ? this.track.getSize().x - this.handle.getSize().x - this.handle_init.x : this.handle_init.x,
			'bottom': this.options.axis == 'y' ? this.track.getSize().y - this.handle.getSize().y - this.handle_init.y : this.handle_init.y
		};
		if(this.drag) this.drag.options.limit = {
			x: [this.handle_limit.left, this.handle_limit.right], 
			y: [this.handle_limit.top, this.handle_limit.bottom]
		};
		
		this.move(this.position.x, this.position.y);
	},
	
	off: function()
	{
		this.handle.setStyle('display', 'none');
		this.track.setStyle('display', 'none');
	},
	
	on: function()
	{
		this.handle.setStyle('display', 'block');
		this.track.setStyle('display', 'block');
	},
	
	toElement: function()
	{
		return this.el;
	}
});
	

/* Automatically create a scroll bar from an existing element. */
Kemso.ScrollBar.Auto = new Class({
	
	Extends: Kemso.ScrollBar,
	
	options: {
		axis: 'y',
		position: 'relative'
	},

	initialize: function(el, options)
	{
		this.setOptions(options);
		
		this.el = document.id(el);
		this.el.store('ScrollBar', this);
		this.el.setStyles({'overflow': 'hidden', 'position': (this.el.getStyle('position') == 'absolute' ? 'absolute' : this.options.position)});
		
		this.content = new Element('div', {'class': 'scroll-container', 'styles': {
			'position': 'absolute', 
			'overflow': 'hidden',
			'top': 0, 'right': 0, 'bottom': 0, 'left': 0,
			'padding': this.el.getStyle('padding')
		}});
		var childNodes = Array.clone(this.el.childNodes);
		for(var i = 0, l = childNodes.length; i < l; i++){
			var child = childNodes[i];
			if(child.nodeType == 1) document.id(child).inject(this.content);
			else if(child.nodeType == 3) this.content.appendChild(child);
		}
		this.content.inject(this.el);
		
		
		this.track = new Element('div', {
			'class': 'scroll-bar-track',
			'styles': {
				'position': 'absolute',
				'top': 0,
				'right': 0,
				'bottom': 0
			}
		}).inject(this.el);
	
		this.handle = new Element('div', {
			'class': 'scroll-bar-handle',
			'styles': {
				'position': 'absolute',
				'top': 0,
				'left': 0
			}
		}).inject(this.track);
			
		this.parent(this.content, this.track, this.handle);
	}
	
});

function $ScrollBar(el){
	return document.id(el).retrieve('ScrollBar');
}





var AssetLoader = new Class({
	Implements: [Options, Events],
	options: {
		type: false,
		auto_load: true,
		events: {}
	},
	initialize: function(src, options)
	{
		this.setOptions(options);
		this.loaded = false;
		this.addEvent('load', function(){ this.loaded = true; }.bind(this));
		this.addEvents(this.options.events);
		
		if(typeOf(src) == 'array')
		{
			this.assets = [];
			this.load_count = 0;
			for(var i = 0, l = src.length; i < l; i++)
			{
				this.assets.push(new AssetLoader(src[i], {
					auto_load: false, 
					events: {
						'load': function(){
							this.load_count++;
							if(this.load_count == this.assets.length)
							{
								this.fireEvent('load');
							}
						}.bind(this)
					}
				}));
			}
			
			this.assets.each(function(a){ a.load(); });
			
			return true;
		}		
		
		this.source = src;
		this.filetype = typeOf(this.options.type) == 'string' ? type : this.source.substr(this.source.lastIndexOf('.')+1);
		
		if(this.options.auto_load === true) this.load();
	},
	
	
	load: function()
	{
		switch(this.filetype)
		{
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'tiff':
				var image = new Image();
				image.src = this.source;
				if(image.complete) this.fireEvent('load');
				else image.onload = this.fireEvent.bind(this, 'load');
				break;
			case 'js':
				this.el = new Element('script', {
					'type': 'text/javascript',
					'src': this.source, 
					'onload': function(){ this.fireEvent('load'); }.bind(this)
				}).inject(document.id(document.body).getElementsByName('head')[0]);
				break;
			case 'css':
				this.el = new Element('img', {
					'type': 'text/css',
					'rel': 'stylesheet',
					'media': 'screen',
					'href': this.source, 
					'onload': function(){ this.fireEvent('load'); }.bind(this)
				}).inject(document.id(document.body).getElementsByName('head')[0]);
				break;
		}
	}
});