function SampleNode(coords){
	var sample = new fabric.Circle({radius: 20, left:0, stroke:'green', fill:''});
	
	sampleCenter = sample.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, top:-5, left: sampleCenter.x - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5, angle: -180, top: 46, left: sampleCenter.x + 2.5, fill:'', stroke:'black'
	});

	var samp = document.getElementById('sample');
	var sampleGroup = new fabric.Group([sample, hand1, hand2],{
		left: coords.x, 
		top: coords.y,
		type: 'sampleNode',
		parentType: '',
		ID: guid(),
		parentNode: [],
		intersected: false,
		children: [],
		sample: samp.options[samp.selectedIndex].value, 
		loop: document.getElementById("loop").checked
	})
	fabric.Image.fromURL('/png/trumpet11.png', function(oImg){
		oImg.scale(0.50);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2 - 5, top: -oImg.getHeight()/2 + 5, angle:-20}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
}