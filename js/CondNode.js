function CondNode(coords){
	var c = new fabric.Triangle({width:80, height:60, left:0, stroke:'#CC0063', fill:'white'});
	var hand1, hand2, hand3;
		
		//Left
		hand1 = new fabric.Circle({
			radius: 5, left: -4.5, top:c.height-5.5, fill:'white', stroke:'black'
		});
		//Right
		hand2 = new fabric.Circle({
			radius:5, left:c.width-5.5, top:c.height-5.5, fill:'white', stroke:'black'
		});
		//Top
		hand3 = new fabric.Triangle({
			width:10, height:10, angle: 180, left:c.width/2+6, top: c.getTop(), fill:'white', stroke: 'black'
		});
	var comp = document.getElementById("comp");
	var whichkey = document.getElementById('whichkey');
	var group = new fabric.Group([c, hand1, hand2, hand3],{
			left: coords.x,
			top:coords.y,
			type: 'condition',
			parentType: '',
			ID: guid(),
			parentNode: [],
			loopParent: '',
			leftChildren: [],
			rightChildren:[],
			intersected: false,
			condition:'mouse'
			//mouse:'up',
			//key:whichkey.options[whichkey.selectedIndex].value,
			//rand:[document.getElementById("aInput").value, document.getElementById("bInput").value, comp.options[comp.selectedIndex].value, document.getElementById("cInput").value]
	});

	group.shadow = {
		    color: '#CC0063',
		    blur: 30,    
		    offsetX: 0,
		    offsetY: 0,
		    opacity: 0.4,
		    fillShadow: true, 
		    strokeShadow: true 
	};

	group.getAbsCenter = function(){
		return group.getCenterPoint();
	}

	group.containsTopArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand3.group.getCenterPoint().x + hand3.getCenterPoint().x;
	    var absCenterY = hand3.group.getCenterPoint().y + hand3.getCenterPoint().y;
	    var width = hand3.getWidth();
	    var height = hand3.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}

	group.getTopArrowCenter = function(){
		return {x:hand3.group.getCenterPoint().x + hand3.getCenterPoint().x, y:hand3.group.getCenterPoint().y + hand3.getCenterPoint().y - hand3.getHeight()/2};
	}

	group.containsLeftArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand1.group.getCenterPoint().x + hand1.getCenterPoint().x;
	    var absCenterY = hand1.group.getCenterPoint().y + hand1.getCenterPoint().y;
	    var width = hand1.getWidth();
	    var height = hand1.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}

	group.getLeftArrowCenter = function(){
		return {x:hand1.group.getCenterPoint().x + hand1.getCenterPoint().x, y:hand1.group.getCenterPoint().y + hand1.getCenterPoint().y - hand1.radius};
	}

	group.containsRightArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand2.group.getCenterPoint().x + hand2.getCenterPoint().x;
	    var absCenterY = hand2.group.getCenterPoint().y + hand2.getCenterPoint().y;
	    var width = hand2.getWidth();
	    var height = hand2.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}
	group.getRightArrowCenter = function(){
		return {x:hand2.group.getCenterPoint().x + hand2.getCenterPoint().x, y:hand2.group.getCenterPoint().y + hand2.getCenterPoint().y - hand2.radius};
	}

	group.addShadow = function(){
		c.setShadow(group.shadow);
		canvas.renderAll();
	}

	group.removeShadow = function(){
		c.setShadow(null);
		canvas.renderAll();
	}

	group.deleteParent = function(parentID){
		var index = group.parentNode.indexOf(parentID);
		if (index > -1) {
    		array.splice(index, 1);
		}
	}

	group.followLoop = function(newCenter){
		var offsetLeft = newCenter.x - group.loopCenter.x;
		var offsetTop = newCenter.y - group.loopCenter.y;
		group.set({left:group.left+offsetLeft, top: group.top+offsetTop}).setCoords();
		canvas.renderAll();
	}

	group.hideHands = function(){
		hand1.set({stroke:'', fill:''});
		hand2.set({stroke:'', fill:''});
		hand3.set({stroke:'', fill:''});
	}
	group.findHands = function(){
		hand1.set({stroke:'black', fill:'white'});
		hand2.set({stroke:'black', fill:'white'});
		hand3.set({stroke:'black', fill:'white'});
	}
	group.on('moving', function(){
		if (group.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === group.loopParent && !group.intersectsWithObject(obj)){
					group.intersected = false;
					group.loopParent = '';
					group.findHands();
				}
			})
		}
	});

	canvas.add(group);
}