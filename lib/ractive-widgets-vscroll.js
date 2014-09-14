Ractive.components.vScroll = Ractive.extend({
	template: '<div class="virtual-scroller" id="{{id}}" on-touchmove="scroll"> {{#if reverse}} <span on-click="add:top" class="vscroll-loader-top">Previous</span> {{/if}} {{#each render:i}} <div class="v-block" on-viewport="visible:{{this}}" id="{{id}}-{{this}}"> {{#if visible.indexOf(this) > -1}} {{#each range(this, blockCount, list.length, reverse):j}} {{#if list[this]}} {{>formatter list[this]}} {{/if}} {{/each}} {{/if}} </div> {{/each}} {{#unless reverse}} <div class="vscroll-loader-bottom" on-viewport="add:bottom"></div> {{/unless}} </div>',
	init: function (options) {
		this.observe('list', function(){
			var data = this.data;
			var data = options.data, len = data.list.length, count = data.blockCount, rev = data.reverse;
			var arr = new Array(Math.floor(len / count) + (len % count > 0 ? 1 : 0));
			for (var i = 0; i < arr.length; i++) {
				arr[i] = i;
			}
			if (rev) {
				arr = arr.reverse();
			}
			if(data.visible.indexOf(0) == -1){
				data.visible.push(0);
			}
			if(data.render.indexOf(0) == -1){
				data.render.push(0);
			}
			this.set('blocks', arr.slice(0));
		});
		var element = document.getElementById(options.data.id), timer;
		var ADD_TOP = "top";
		var ADD_BOTTOM = "bottom";
		var scrolling;
		var fBlocks = {};
		if(options.data.reverse){
			element.scrollTop = element.scrollHeight;
		}
		function scroll() {
			scrolling = true;
			if(timer !== null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				scrolling = false;
			}, 100);
		}
		var that = this;
		window.setInterval(function(){
			if(!scrolling){
				for(var i in fBlocks) {
					(function(ind, vals){
						var el = document.getElementById(that.get('id') + '-' + ind);
						if(vals[ind] == "auto") {
							el.style.minHeight = "1px";
							if(that.get('visible').indexOf(ind * 1) == -1){
								that.push('visible', ind * 1);
							}
						} else {
							if(vals[ind] == "") debugger;
							el.style.minHeight = el.offsetHeight + "px";
							var idx = that.get('visible').indexOf(ind * 1);
							if(idx != -1) {
								console.log(that.get('visible'));
								that.splice('visible', idx, 1);
								console.log(that.get('visible'));
							}
						}
					})(i, fBlocks);
					delete fBlocks[i];
				}
			}
		}, 10);
		this.on('visible', function(event, item){
			if(event.original.visible) {
				fBlocks[item] = "auto";
			} else {
				console.log(item + ' is invisible');
				fBlocks[item] = "";
			}
			console.log(fBlocks);
		});
		element.addEventListener('touchmove', scroll, false);
		element.addEventListener('scroll', scroll, false);
		this.on('add', function(event, val) {
			if(event.original.visible || val == ADD_TOP) {
				var str = "render", vals = this.get(str), reverse = this.get('reverse');
				if(vals.length < this.get('blocks').length){
					if(reverse) element.style.overflow = "hidden";
					var idx;
					if(val == ADD_BOTTOM) {
						idx = vals[vals.length - 1] + 1;
						if(this.get('visible').indexOf(idx * 1) == -1){
							this.push('visible', idx * 1);
						}
						this.push(str, idx);
					} else if(val == ADD_TOP) {
						var child = element.querySelector('.v-block');
						idx = vals[0] + 1;
						if(this.get('visible').indexOf(idx * 1) == -1){
							this.push('visible', idx * 1);
						}
						this.unshift(str, idx).then(function(){
							element.style.overflow = "auto";
							element.scrollTop = child.offsetTop - 100;
						});
					}
				}
			}
		});
	},
	beforeInit: function (options) {
		options.data.id = 'vscroll-' + Math.random().toString(36).substring(7);
		options.data.blockCount = +options.data.blockCount || 50;
		options.data.render = [];
		options.data.visible = [];
		options.data.blocks = [];
	},
	partials: {
		formatter: function (data, parser) {
			return parser.fromId(data.formatter);
		}
	},
	data: {
		range : function(idx, count, length, reverse) {
			var start = (reverse ? length : 0) + ( idx * (reverse ? -count : count)) + (reverse ? -1 : 0);
			var end = start + count * (reverse ? -1 : +1) + (reverse ? 1 : -1), arr = [];
			for(var i = Math.min.apply(Math, [start, end]); i <= Math.max.apply(Math, [start, end]); i++){
				arr.push(i);
			}
			return arr;
		}
	}
});