function Node(type, coords, radius, topArrow, bottomArrow){
	this.type = type;

	var c = new fabric.Circle({radius: radius, left:0, stroke:'black', fill:'white'});
	var cCenter = c.getCenterPoint();
	var hand1, hand2;
	
		hand1 = new fabric.Triangle({
			width: 10, height: 10, angle: -180, left: cCenter.x + 5, fill:'', stroke:'black'
		});

		hand2 = new fabric.Triangle({
			width: 10, height: 10, angle: -180, top: 2*radius+11, left: cCenter.x + 5, fill:'', stroke:'black'
		});
	var group = new fabric.Group([c, hand1, hand2],{
			left: coords.x,
			top:coords.y,
			type: type,
			parentType: '',
			ID: guid(),
			parentNode: [],
			loopParent: '',
			children: [],
			intersected: false, 
	});
	if (!topArrow){
		group = new fabric.Group([c, hand2],{
			left: coords.x,
			top:coords.y,
			type: type,
			parentType: '',
			ID: guid(),
			parentNode: [],
			children: [],
			intersected: false
		}); 
	}

	group.getAbsCenter = function(){
		return group.getCenterPoint();
	}
	group.getCircleTopCenter = function(){
		return {x:group.getAbsCenter().x, y:group.getAbsCenter().y-c.radius}
	}

	group.contains = function(point){
	    var x = point.x;
	    var y = point.y;
	    var center_x = group.getCenterPoint().x;
	    var center_y = group.getCenterPoint().y;
	    if (Math.pow(x-center_x,2) + Math.pow(y-center_y,2) < 900){
	        return true;
	    }
	}
	group.containsTopArrow = function(point){
		if (!topArrow) return;
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

	group.containsBottomArrow = function(point){
		if (!bottomArrow) return;
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

	group.getBottomArrowCenter = function(){
		return {x:hand2.group.getCenterPoint().x + hand2.getCenterPoint().x, y:hand2.group.getCenterPoint().y + hand2.getCenterPoint().y + hand2.getHeight()/2};
	}

	group.getTopArrowCenter = function(){
		return {x:hand1.group.getCenterPoint().x + hand1.getCenterPoint().x, y:hand1.group.getCenterPoint().y + hand1.getCenterPoint().y - hand1.getHeight()/2};
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

	return group;
}
