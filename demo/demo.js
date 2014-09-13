var msg = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut odio. Nam sed est. Nam a risus et est iaculis adipiscing. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer ut justo. In tincidunt viverra nisl. Donec dictum malesuada magna. Curabitur id nibh auctor tellus adipiscing pharetra. Fusce vel justo non orci semper feugiat. Cras eu leo at purus ultrices tristique."; 

var dummyData = [];
for(var i = 0; i < 100; i++) {
	dummyData.push( "<b>" + i + "</b> " + msg.substring(0, Math.max.apply(Math, [5, ~~(Math.random() * 1e3)]) ))
}

var ractive1 = new Ractive({
	el: '#body',
	template: "<vScroll list='{{dummyData}}' formatter='listItem' blockCount='100' reverse='true' />",
	data: {
		dummyData: dummyData
	}
});


// Test for Dynamic Data.
var count = 0;
window.setInterval(function(){
	ractive1.push('dummyData', 'some text' + count);
	count++;
}, 10000);


var ractive2 = new Ractive({
	el: '#grid',
	template: "<vScroll list='{{dummyData}}' formatter='listItem2' blockCount='100' reverse='false' />",
	data: {
		dummyData: demoData
	}
});