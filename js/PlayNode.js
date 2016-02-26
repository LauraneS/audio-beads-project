function PlayNode(coords){

	var playGroup = Node('playNode', coords, true, true);
	playGroup.item(0).set({stroke:'red'});
	playGroup.note = document.getElementById("note").value;
	playGroup.duration = document.getElementById("duration").value;
	playGroup.wave = 'sine';

	fabric.Image.fromURL('/png/musical66.png', function(oImg){
		oImg.scale(0.6);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2 + 2.5, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup); 
}
