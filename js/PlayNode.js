function PlayNode(coords){

	var playGroup = Node('playNode', coords, 30, true, true);
	playGroup.item(0).set({stroke:'#FE9601'});
	playGroup.note = document.getElementById("note").value;
	playGroup.duration = document.getElementById("duration").value;
	var wave = document.getElementById('wave-type')
	playGroup.wave = wave.options[wave.selectedIndex].value;
	playGroup.effects = [];
	playGroup.shadow = {
		    color: '#FE9601',
		    blur: 30,    
		    offsetX: 0,
		    offsetY: 0,
		    opacity: 0.4,
		    fillShadow: true, 
		    strokeShadow: true 
	};

	fabric.Image.fromURL('/png/playNote.png', function(oImg){
		oImg.scale(0.6);
		playGroup.add(oImg.set({left: -oImg.getWidth()/2 - 2, top:-oImg.getHeight()/2}));
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
		canvas.getActiveObject().item(0).set({stroke:'#00D2F1'});
		playGroup.shadow.color = '#00D2F1';
		playGroup.addShadow();
    	canvas.renderAll();
	}
	playGroup.delEffect = function (number){
		playGroup.effects.splice(number,1);
		if (playGroup.effects === undefined || playGroup.effects.length === 0){
			playGroup.item(0).set({stroke:'#FE9601'});
			playGroup.shadow.color = '#FE9601';
			playGroup.addShadow();
			canvas.renderAll();
		}
	}
	playGroup.on('moving', function(){
		if (playGroup.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === playGroup.loopParent && !playGroup.intersectsWithObject(obj)){
					playGroup.intersected = false;
					playGroup.loopParent = '';
					playGroup.findHands();
				}
			})
		}
	});
}
