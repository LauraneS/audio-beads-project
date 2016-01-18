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
		left: Math.floor((Math.random() * canvas.getWidth()) + 1), 
		top: Math.floor((Math.random() * canvas.getHeight()) + 1),
		type: 'effectNode',
		ID: guid(),
		parentNode: [],
		children: []
	})
	fabric.Image.fromURL('/png/fx.png', function(oImg){
		oImg.scale(0.32);
		fxGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	
	canvas.add(fxGroup); 
	console.log(fxGroup.ID);

}