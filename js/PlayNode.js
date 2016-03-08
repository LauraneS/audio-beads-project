function PlayNode(coords){

	var playGroup = Node('playNode', coords, true, true);
	playGroup.item(0).set({stroke:'red'});
	playGroup.note = document.getElementById("note").value;
	playGroup.duration = document.getElementById("duration").value;
	var wave = document.getElementById('wave-type')
	playGroup.wave = wave.options[wave.selectedIndex].value;
	playGroup.effects = [];

	fabric.Image.fromURL('/png/musical66.png', function(oImg){
		oImg.scale(0.6);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2 + 2.5, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(playGroup);

	playGroup.setEffect = function (number, value){
		var fxLength = playGroup.effects.length;
		if (number < fxLength){
			playGroup.effects[number] = value;
		} else {
			playGroup.effects.push(value);
		}
		canvas.getActiveObject().item(0).set({stroke:'blue'});
    	canvas.renderAll();
	}
	playGroup.delEffect = function (number){
		playGroup.effects.splice(number,1);
		if (playGroup.effects === undefined || playGroup.effects.length === 0){
			playGroup.item(0).set({stroke:'red'});
			canvas.renderAll();
		}
	}
}
