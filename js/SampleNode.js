function SampleNode(coords){
	var samp = document.getElementById('sample');
	var sampleGroup = Node('sampleNode', coords, 30, true, true);
	sampleGroup.sample = samp.options[samp.selectedIndex].value;
	sampleGroup.loop = document.getElementById("loop").checked;
	sampleGroup.effects = []

	fabric.Image.fromURL('/png/file.png', function(oImg){
		oImg.scale(0.7);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2, top: -oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
	
	sampleGroup.setEffect = function (number, value){
		var fxLength = sampleGroup.effects.length;
		if (number < fxLength){
			sampleGroup.effects[number] = value;
		} else {
			sampleGroup.effects.push(value);
		}
		sampleGroup.item(0).set({stroke:'green'});
		canvas.renderAll();
	}
	sampleGroup.delEffect = function (number){
		sampleGroup.effects.splice(number,1);
		if (sampleGroup.effects === undefined || sampleGroup.effects.length === 0){
			sampleGroup.item(0).set({stroke:'black'});
			canvas.renderAll();
		}
	}

	sampleGroup.on('mouseup', function(){
		if (sampleGroup.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === sampleGroup.parentNode[0] && !sampleGroup.intersectsWithObject(obj)){
					sampleGroup.intersected = false;
					sampleGroup.parentNode.pop();
				}
			})
		}
	});
}
