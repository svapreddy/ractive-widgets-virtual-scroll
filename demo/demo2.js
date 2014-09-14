var ractive2 = new Ractive({
	el: '#grid',
	template: "<vScroll list='{{dummyData}}' formatter='listItem2' blockCount='100' reverse='false' toNumber='{{toNumber}}' edit='{{edit}}'/>",
	data: {
		dummyData: demoData,
		toNumber : function(num){
			// console.log(num);
			num = num.replace(/[$\,]/g, '');
			console.log(~~num);
			return ~~num;
		}, edit : true
	}
});