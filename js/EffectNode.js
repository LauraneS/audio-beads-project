function EffectNode(coords){
	var fx = new fabric.Circle({radius: 20, left:0, stroke:'blue', fill:''});
	
	fxCenter = fx.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, top:-5, left: fxCenter.x - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5,  angle: -180, top: 46, left: fxCenter.x + 2.5, fill:'', stroke:'black'
	});
	var fxname = document.getElementById('effect-name');
	var fxGroup = new fabric.Group([fx, hand1, hand2],{
		left: coords.x, 
		top: coords.y,
		type: 'effectNode',
		effect: fxname.options[fxname.selectedIndex].value,
		ID: guid(),
		parentNode: [],
		parentType: '',
		intersected:false,
		children: [],
		octave: document.getElementById("octave").value, 
		resonance: document.getElementById("resonance").value,
		intensity: document.getElementById("intensity").value, 
		rate: document.getElementById("rate").value,
		rateCho:document.getElementById("rateCho").value,
		delayCho: document.getElementById("delayCho").value,
		delay: document.getElementById("delay").value
	})

	// switch (fxGroup.effect) {
	// 	case 'wahwah': 
	// 		fxGroup.set({octave:document.getElementById("octave").value, resonance: document.getElementById("resonance").value})
	// 		break;
	// 	case 'tremolo':
	// 		//larger roomSize = a longer decay, [0,1]
	// 		fxGroup.set({intensity: document.getElementById("intensity").value, rate: document.getElementById("rate").value});
	// 		break;
	// 	case 'chorus':
	// 		//distortion: [0,1], oversample ['none, '2x', '4x']
	// 		fxGroup.set({rateCho: document.getElementById("rateCho").value, delayCho: document.getElementById("delayCho").value});
	// 		break;
	// 	case 'pingpong':
	// 		//delay = delay between consecutive echos, [0,1]
	// 		fxGroup.set({delay: document.getElementById("delay").value});
	// 		break;
	// }
	fabric.Image.fromURL('/png/fx.png', function(oImg){
		oImg.scale(0.32);
		fxGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	
	canvas.add(fxGroup); 

}