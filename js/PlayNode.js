function PlayNode(){
	var play = new fabric.Circle({radius: 20, left:0, stroke:'red', fill:''});
	
	playCenter = play.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: 90, left:0, top: playCenter.y - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5, angle: -90, left: 41.5, top: playCenter.y + 2.5, fill:'', stroke:'black'
	});

	var playGroup = new fabric.Group([play, hand1, hand2],{
		left: Math.floor((Math.random() * canvas.getWidth()) + 1), 
		top: Math.floor((Math.random() * canvas.getHeight()) + 1),
		type: 'playNode',
		ID: guid(),
		parentNode: [],
		children: [],
		frequency: Math.floor(Math.random() * (800-50)+50),
		duration: Math.floor(Math.random()*(10-1)+1) 
	})
	fabric.Image.fromURL('/svg/playnote.png', function(oImg){
		oImg.scale(0.35);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup); 
}