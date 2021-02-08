/*
---
Ember Page Controller: The Ember default controller

copyrights:
  - [Kemso, Ember](http://kemso.com, http://emberpack.com)

licenses:
  - [MIT License](http://emberpack.com/license.txt)
...
*/


var Controller = new Class({
	
	Implements: Options,
	
	options: {
		hash: {schema: false, listen_only: true, events: {}}
	},
	
	/* 
	|
	|	Set options.Initialize the page.
	|
	*/
	initialize: function(options)
	{

		/*
		*	Set the options
		*/
		this.setOptions(options);
		
		
		// External links
		$$('a[rel*="external"]').addEvent('click', function(e){
			e.preventDefault();
			window.open(this.get('href'));
		});
		
		// Mails
		$$('a[href^="mailto:"]').each(function(el){
			var 
				mail = el.get('href').replace('mailto:',''),
				replaced = mail.replace('/at/','@');
			el.set('href', 'mailto:' + replaced);
			if(el.get('text') === mail) {
				el.set('text', replaced);
			}
		});
		
		Object.merge(this.options.hash.events, { 'change': this.hash_change.bind(this) });
		this.hash = new LocationHash(this.options.hash);
		
		
		$$('.disclosure').each(function(el){
			var handle = el.getElement('.handle');
			var wrap = new Element('div', {'class': 'wrap'});
			el.getChildren().each(function(el){
				if(el !== handle) el.inject(wrap);
			});
			wrap.inject(handle, 'after').off();
			handle.setStyle('cursor', 'pointer').addEvent('click', function(e){
				e.stop();
				wrap.get('reveal').toggle();
			});
		});
		
		$$('a.icon-sm.text').each(function(el){
			el.set('html', '<span>'+el.get('html')+'</span>');
		});

	},
	
	hash_change: function()
	{
		
	}
	
	
});


function preloadImages() {
  	var d=document;
  	if(d.images){
  		if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=preloadImages.arguments;
		for(i=0; i<a.length; i++){
			if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}
		}
    }
}

/*
*	Set up HTML5 Elements
*/
function doeach(arr, fn) {
    for (var i = 0, arr_length = arr.length; i < arr_length; i++) {
        fn.call(arr, arr[i], i);
    }
}
doeach("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(el) { document.createElement(el); });