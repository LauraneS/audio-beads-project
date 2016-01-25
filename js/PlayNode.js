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
		left: fabric.util.getRandomInt(0, canvas.getWidth() + 1),
		top:fabric.util.getRandomInt(0, canvas.getHeight() + 1),
		type: 'playNode',
		ID: guid(),
		parentNode: [],
		children: [],
		note: 440,
		duration: 1, 
		wave: 'sine',
		attack: 0.5,
		release: 0.5

	})
	fabric.Image.fromURL('/png/playnote.png', function(oImg){
		oImg.scale(0.35);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup); 
}