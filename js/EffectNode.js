function EffectNode(){
	var fx = new fabric.Circle({radius: 20, left:0, stroke:'blue', fill:''});
	
	fxCenter = fx.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: 90, left:0, top: fxCenter.y - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5, angle: -90, left: 40, top: fxCenter.y + 2.5, fill:'', stroke:'black'
	});

	var fxGroup = new fabric.Group([fx, hand1, hand2],{
		left: fabric.util.getRandomInt(0, canvas.getWidth() + 1), 
		top: fabric.util.getRandomInt(0, canvas.getHeight() + 1),
		type: 'effectNode',
		effect: ['echo', 'reverb', 'distortion', 'pingpong'][fabric.util.getRandomInt(0,4)],
		ID: guid(),
		parentNode: [],
		children: []
	})

	switch (fxGroup.effect) {
		case 'echo': 
			break;
		case 'reverb':
			//larger roomSize = a longer decay, [0,1]
			fxGroup.set({roomSize: 0.7, dampening: 3000});
			break;
		case 'distortion':
			//distortion: [0,1], oversample ['none, '2x', '4x']
			fxGroup.set({distortion: 0.4, oversample: 'none'});
			break;
		case 'pingpong':
			//delay = delay between consecutive echos, [0,1]
			fxGroup.set({delay: 0.25});
			break;
	}
	fabric.Image.fromURL('/png/fx.png', function(oImg){
		oImg.scale(0.32);
		fxGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	
	canvas.add(fxGroup); 

}