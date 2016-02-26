function PlayNode(coords){

	var playGroup = Node('playNode', coords, true, true);
	playGroup.item(0).set({stroke:'red'});
	playGroup.note = document.getElementById("note").value;
	playGroup.duration = document.getElementById("duration").value;
	playGroup.wave = 'sine';

	// var playGroup = new fabric.Group([play, hand1, hand2],{
	// 	left: coords.x,
	// 	top:coords.y,
	// 	type: 'playNode',
	// 	parentType: '',
	// 	ID: guid(),
	// 	parentNode: [],
	// 	children: [],
	// 	intersected: false,
	// 	note: document.getElementById("note").value,
	// 	duration: document.getElementById("duration").value,
	// 	wave: document.getElementById("wave-type").value
	// 	//attack: document.getElementById("attack").value,
	// 	//release: document.getElementById("release").value,

	// })
	fabric.Image.fromURL('/png/musical66.png', function(oImg){
		oImg.scale(0.6);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2 + 2.5, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup); 
}

// left: coords.x,
// 		top:coords.y,
// 		type: type,
// 		parentType: '',
// 		ID: guid(),
// 		parentNode: [],
// 		children: [],
// 		intersected: false