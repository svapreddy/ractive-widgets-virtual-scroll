Ractive.components.vScroll = Ractive.extend({
	template: "#vScroll",
	init: function (options) {
		var that = this, scrolling, element = document.getElementById(options.data.id), state = {}, timer, vis = {};
		function scroll() {
			scrolling = true;
			if(timer !== null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				scrolling = false;
			}, 100);
		}
		
		element.addEventListener('touchmove', scroll, false);
		element.addEventListener('scroll', scroll, false);
		
		window.setInterval(function(){
			if(!scrolling) {
				for(var i in state) {
					if(vis[i]){
						(function(i){
							var ele = document.getElementById([that.get('id'), '-', i].join('')), v = false, height;
							height = state[i] ? 1 : ele.offsetHeight;
							ele.style.minHeight = height + 'px';
							that.set('visible.' + i, state[i]);
						})(i);
					}
				}
			}
		}, 10);
		
		that.on('visible', function(event, index) {
			var currentState = event.original.visible;
			if((state[index] === true && currentState === false) || (!state[index] && currentState === true)){
				vis[index] = true;
				that.set('renderedOnce.' + index, true);
			}
			state[index] = currentState;
		});
		
	},
	beforeInit: function (options) {
		options.data.id = 'vscroll-' + Math.random().toString(36).substring(7);
		options.data.blockCount = +options.data.blockCount || 50;
	},
	partials: {
		formatter: function(data, parser) {
            return parser.fromId(data.formatter);
        }
	}, data : {
		range : function(idx, count, length, reverse, visible) {
			if(!visible[idx]) return [];
			var start = (reverse ? length : 0) + ( idx * (reverse ? -count : count)) + (reverse ? -1 : 0);
			var end = start + count * (reverse ? -1 : +1) + (reverse ? 1 : -1);
			// console.log(start, end);
			var arr = new Function('i', 'e', 'a', ['for(;i', reverse ? '>=' : '<=', 'e;i+=', reverse ? -1 : 1, ') a.push(i);return a;'].join(''))(start, end, []);
			/*
				Commented below just to avoid repeated condition check for every iteration.
				for(var i = start; reverse ? (i >= end) : (i <= end); i += reverse ? -1 : 1){
					arr.push(i)
				}
			*/
			// console.log(arr);
			return arr;
		}, 
		visible : {},
		renderedOnce : {}
	}, computed : {
		blocks : function() {
			var that = this, len = that.get('list').length, count = that.get('blockCount'), rev = that.get('reverse');
			var arr = new Array(Math.floor(len/count) + (len % count > 0 ? 1 : 0));
			for(var i = 0; i < arr.length; i++){
				arr[i] = i;
			}
			if(rev){
				arr = arr.reverse();
				that.set('visible.' + arr.length - 1, true);
				that.set('renderedOnce.' + arr.length - 1, true);
				
			} else {
				that.set('visible.0', true);
				that.set('renderedOnce.0', true);
			}
			
			return arr;
		}
	}
});


var msg = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut odio. Nam sed est. Nam a risus et est iaculis adipiscing. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer ut justo. In tincidunt viverra nisl. Donec dictum malesuada magna. Curabitur id nibh auctor tellus adipiscing pharetra. Fusce vel justo non orci semper feugiat. Cras eu leo at purus ultrices tristique."; 


var dummyData = [];
for(var i = 0; i < 10000; i++) {
	dummyData.push( i + msg.substring(0, Math.max.apply(Math, [5, ~~(Math.random() * 1e3)]) ))
}

var ractive = new Ractive({
	el: '#body',
	template: "<vScroll list='{{dummyData}}' formatter='listItem' blockCount='100' reverse='false' />",
	data: {
		name: 'Prathap',
		dummyData: dummyData
	}
});