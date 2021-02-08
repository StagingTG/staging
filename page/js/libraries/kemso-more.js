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

name: LoadImage

description: Loads an image, showing a spinner and fading in on load. 
Optionally replaces image with pixel.gif, setting source to background-image

license: MIT-style license.

authors: Kemso, LLC (http://www.kemso.com)
			- Matt McCloskey

provides: [Touch]

...
*/

var LoadImage = new Class({
	Implements: [Options, Events],
	options: {
		replace: true,
		spinner_size: 'large'
	},
	initialize: function(el, options)
	{
		this.setOptions(options);
		this.img = document.id(el);
		
		if(this.img.retrieve('loading') || this.img.retrieve('loaded'))
		{
			// image has been loaded already, check the source
			//if(document.id(this.img).src == this.img)
			return $C(this.img);
		}
		
		this.img.store('ClassRef', this);
		
		this.spinner = new Spinner({relativeTo: this.img.getParent(), 'size': this.options.spinner_size}).start();
		document.id(this.spinner).position({relativeTo: this.img});
		
		// Are we lazy loading this image?
		if(this.img.get('data-src')){
			this.img.set('src', this.img.get('data-src'));
		}
		
		// Fade the image in when it's loaded
		this.img.style.visibility = 'hidden';
		this.img.store('loading', true);
		this.src = this.img.get('src');
		new AssetLoader(this.src, {
			events: {
				'load': function(){
					
					document.id(this.img).addClass('loaded');
					this.img.store('loading', false);
					this.img.store('loaded', true);
					// Use CSS transitions where available for better results
					var usecss = false;
					if(usecss && (Browser.Platform.ios || Browser.Platform.android || Browser.Platform.webos || Browser.safari || Browser.chrome))
					{
						setTimeout(function(){
							this.img.style.webkitTransition = 'opacity 500ms cubic-bezier(0,0,0.25,1)';
							this.img.setStyle('opacity', 1);
						}.bind(this), 1);
					}
					else
					{
						//document.id(this.img).setStyle('opacity', 1);
						document.id(this.img).tween('opacity', [0,1]);
						//this.img.style.visibility = 'visible';
					}
					
					this.spinner.destroy();
					this.fireEvent('load', this.img);
				}.bind(this)
			}
		});
		
		// Swap image src with pixel.gif and set background-image to original source
		// This helps prevent image theft, and gets around mobile web-kit memory issues
		if(this.options.replace && config && config.get('site_url')) 
		this.img.setStyles({
			'background-image': 'url('+this.src+')',
			'background-repeat': 'no-repeat'
		}).set('src', config.get('site_url')+'assets/images/pixel.gif');
	},
	
	toElement: function()
	{
		return this.img;
	}
});






/*
---
description: A Cross Broser rotation Fx

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.2.4: Element,Fx,Class

provides: [Fx.Rotate]

...
*/
Fx.Rotate = new Class({
	Extends: Fx,
	options: {
		origin: 'center center'
	},
	initialize: function(element, options) {
		this.parent(options);
		
		this.element = document.id(element);
		this.prefix = (Browser.firefox ? 'moz' : (Browser.safari || Browser.chrome ? 'webkit' : 'o'));
		this.radions = Math.PI * 2 / 360;

		if(Browser.ie) { // IE
			this.element.setStyle('filter','progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand")');
		}
		else {
			this.element.setStyle('-' + this.prefix + '-transform-origin',this.options.origin);
		}
		
	},
	
	start: function(from,to) {
		if(typeOf(to) == 'null') to = from, from = this.element.retrieve('rotate:current', 0);
		this.parent(from,to);
		
		return this;
	},
	
	set: function(current) {
	
		if (Browser.ie) current *=-1;
		var matrix = this.getMatrix(current);

		if (Browser.ie){
			this.element.filters.item(0).M11 = matrix[0];
			this.element.filters.item(0).M12 = matrix[1];
			this.element.filters.item(0).M21 = matrix[2];
			this.element.filters.item(0).M22 = matrix[3];
		}else{
			this.element.setStyle('-' + this.prefix + '-transform', 'matrix(' + matrix[0] + ',' + matrix[1] + ',' + matrix[2] + ', ' + matrix[3] + ', 0, 0)');
		}
		
		this.element.store('rotate:current', current);
		
		return this;
	},
	
	getMatrix: function(deg) {
		var rad = deg * (this.radions), costheta = Math.cos(rad), sintheta = Math.sin(rad);
		var a = parseFloat(costheta).toFixed(8),
			c = parseFloat(-sintheta).toFixed(8),
			b = parseFloat(sintheta).toFixed(8),
			d = parseFloat(costheta).toFixed(8);
		return [a,b,c,d];
	}
});



Element.implement({

	inView: function(){
		
		var status = this.retrieve('inview:status'),
			scroll = InView.scroll,
			lats = this.retrieve('inview:lats') || [1, .5, 0],
			pos = this.getCoordinates(),
			args = [];
			pos.y = pos.top;
		
		// Is it on the page?
		if(pos.top < scroll.y + scroll.height && pos.bottom > scroll.y)
		{
			if( ! status)
			{
				this.fireEvent('enterview');
				this.store('inview:status', true);
			}
			
			// What percentage of the element height is laying on the window lat
			var lat_percs = [];
			for(var i = 0, l = lats.length; i < l; i++){
				args.push((scroll.y + (scroll.height * lats[i]) - pos.top) / pos.height);
			}
			
			// how much is on the page?
			/*
var showing = Math.min(scroll.y + scroll.height - pos.top, scroll.height);
			showing -= Math.max(scroll.y + scroll.height - pos.bottom, 0);
			args.push(showing);
*/
			
			args.push(scroll);
			args.push(pos);
			
			for(var i = 0, l = lats.length; i < l; i++){
				args.push((scroll.y + (scroll.height * lats[i]) - pos.top) / (scroll.height * (1-lats[i])));
			}
			
			return args;
		}
		else
		{
			if(status)
			{
				this.fireEvent('leaveview');
				this.store('inview:status', false);
			}
			
			return false;
		}
	}
});

var InView = {};
InView.active = false;
InView.elements = [];
InView.scroll = { y: 0, height: 0 };
InView.register = function(el){
	if( ! InView.active) InView.start();
	InView.elements.push(el);
	
	args = el.inView();
	if(args) el.fireEvent.delay(2, el, ['inview', args]);
};

InView.start = function(){
	InView.scroll = { y: window.getScroll().y, height: window.getSize().y };
	window.addEvent('scroll', function(){
		
		InView.check();
		
	});
	
	InView.active = true;
};

InView.check = function(){
	InView.scroll = { y: window.getScroll().y, height: window.getSize().y };
		
	for(var i = 0, l = InView.elements.length; i < l; i++){
		var el = InView.elements[i],
		args = el.inView();
		if(args) el.fireEvent('inview', args);
	};
}


Element.Events.inview = {
    onAdd: function(){
    	InView.register(this);
    }
};


Element.Events.enterview = {
	onAdd: function(){
		InView.register(this);
	}
};
Element.Events.leaveview = {
	onAdd: function(){
		InView.register(this);
	}	
};


// OverLabel
var OverLabel = new Class({
	
	initialize: function(input)
	{
		OverLabel.register(this);
			
		input = document.id(input);
		if(document.id(document.body).getElement('label[for="'+input.get('id')+'"]') && ! input.retrieve('overlabel'))
		{
			input.store('overlabel', this);
			
			var label = document.id(document).getElement('label[for="'+input.get('id')+'"]');
			
			this.input = input;
			this.label = label.addClass('overlabel');
			
			label.setStyles({
				'position': 'absolute',
				'color': input.getStyle('color'),
				'font-size': input.getStyle('font-size'),
				'line-height': input.getStyle('line-height'),
				'width': input.getStyle('width'),
				'padding-top': input.getStyle('padding-top').toInt() + 1,
				'padding-right': input.getStyle('padding-right').toInt() + 1,
				'padding-bottom': input.getStyle('padding-bottom').toInt() + 1,
				'padding-left': input.getStyle('padding-left').toInt() + 1
			});
			label.position({relativeTo: input, position: 'topLeft', edge: 'topLeft'});
			
			input.addEvent('blur', function(){ input.store('hasFocus', false); });
			input.addEvents({
				'click': this.enterEdit.bind(this),
				'focus': this.enterEdit.bind(this),
				'blur': this.leaveEdit.bind(this),
				'keyup': this.assert.bind(this),
				'keypress': function(){ label.setStyles({'display': 'none'}); }
			});
			input.addEvents({
				'click': this.update.bind(this),
				'focus': this.update.bind(this),
				'blur': this.update.bind(this)
			});
			label.addEvents({
				'click': this.enterEdit.bind(this)
			});
			
			this.assert();			
		}
	},
	
	assert: function()
	{
		if(this.input.get('value').length > 0){
			this.label.setStyles({'display': 'none'});
		} else {
			this.leaveEdit();
		}
	},
	
	enterEdit: function()
	{
		this.assert();
		this.input.store('hasFocus', true);
		this.input.focus();
		this.label.setStyle('opacity', .5);
	},
	
	leaveEdit: function()
	{
		if(this.input.get('value') == '') this.label.setStyles({'display': 'block', 'opacity': this.input.retrieve('hasFocus') ? .5 : 1});
		else this.label.setStyles({'display': 'none'});
	},
	
	update: function(all)
	{
		this.label.position({relativeTo: this.input, position: 'topLeft', edge: 'topLeft'});
		this.assert();
		
		if(typeOf(all) == 'null' || all == true)
		{
			// Update the rest
			OverLabel.instances.each(function(i){
				if(i !== this) i.update(false); 
			}.bind(this));
		}
	}
});


OverLabel.instances = [];
OverLabel.register = function(el){
	return OverLabel.instances.push(el);
};
OverLabel.update = function(){
	OverLabel.instances.each(function(i){ i.update(false); });
};


OverLabel.init = function(){
	document.id(document.body).getElements('input[type="text"].overlabel, input[type="password"], textarea.overlabel').each(function(el){ new OverLabel(el); });
};

window.addEvent('domready', function(){
	OverLabel.init();
});