function SampleNode(coords){
	var sample = new fabric.Circle({radius: 30, left:0, stroke:'black', fill:''});
	
	sampleCenter = sample.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 10, height: 10, angle: -180, left: sampleCenter.x + 5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 10, height: 10, angle: -180, top: 71, left: sampleCenter.x + 5, fill:'', stroke:'black'
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
	fabric.Image.fromURL('/png/file.png', function(oImg){
		oImg.scale(0.7);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2, top: -oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
}