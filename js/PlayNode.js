function PlayNode(coords){
	var play = new fabric.Circle({radius: 30, left:0, stroke:'red', fill:''});
	
	playCenter = play.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 15, height: 15, top:-5, angle: -180, left: playCenter.x + 7.5, top: 0.9, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 15, height: 15, angle: -180, top: 66, left: playCenter.x + 7.5, fill:'', stroke:'black'
	});

	var playGroup = new fabric.Group([play, hand1, hand2],{
		left: coords.x,
		top:coords.y,
		type: 'playNode',
		parentType: '',
		ID: guid(),
		parentNode: [],
		children: [],
		intersected: false,
		note: document.getElementById("note").value,
		duration: document.getElementById("duration").value,
		wave: document.getElementById("wave-type").value
		//attack: document.getElementById("attack").value,
		//release: document.getElementById("release").value,

	})
	fabric.Image.fromURL('/png/musical66.png', function(oImg){
		oImg.scale(0.6);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2 + 2.5, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup); 
}

