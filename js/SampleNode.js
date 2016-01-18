function SampleNode(){
	var sample = new fabric.Circle({radius: 20, left:0, stroke:'green', fill:''});
	
	sampleCenter = sample.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: 90, left:0, top: sampleCenter.y - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5, angle: -90, left: 41.5, top: sampleCenter.y + 2.5, fill:'', stroke:'black'
	});

	
	var sampleGroup = new fabric.Group([sample, hand1, hand2],{
		left: Math.floor((Math.random() * canvas.getWidth()) + 1), 
		top: Math.floor((Math.random() * canvas.getHeight()) + 1),
		type: 'sampleNode',
		ID: guid(),
		parentNode: [],
		children: [],
		sample: whichSample(Math.floor(Math.random()*2 + 1))
	})
	fabric.Image.fromURL('/png/file.png', function(oImg){
		oImg.scale(0.30);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
}

function whichSample(arg){
	switch(arg){
		case 1:
			return 'hihat-plain.wav';
			break;
		case 2:
			return 'kick-big.wav';
			break;
	}
}