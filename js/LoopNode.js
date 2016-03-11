var orbit, bead, dur = 1000, oCoords;
function LoopNode(coords){
  var loopGroup = Node('loop', coords, 100, true, true);
  canvas.add(loopGroup);

  loopGroup.loopToPointAngle = function(point){
    var loopCenter = loopGroup.getAbsCenter();
    var loopTop = loopGroup.getCircleTopCenter();

    var refVec = {x:loopCenter.x-loopTop.x ,y:loopCenter.y-loopTop.y}
    var ptVec = {x:loopCenter.x-point.x ,y:loopCenter.y-point.y}

    var dir = refVec.x*ptVec.y - refVec.y*ptVec.x
    if (dir < 0){
      return 360 - (Math.acos((refVec.x*ptVec.x + refVec.y*ptVec.y) / (Math.sqrt( (Math.pow(refVec.x,2) + Math.pow(refVec.y,2)) * (Math.pow(ptVec.x, 2)+ Math.pow(ptVec.y,2))))))*(180/Math.PI);
    } else if (dir > 0){
      return (Math.acos((refVec.x*ptVec.x + refVec.y*ptVec.y) / (Math.sqrt( (Math.pow(refVec.x,2) + Math.pow(refVec.y,2)) * (Math.pow(ptVec.x, 2)+ Math.pow(ptVec.y,2))))))*(180/Math.PI);
    } 
    return 0;
    
  }

  loopGroup.sortChildren = function(array){
    var i;
    for (i = 0; i<array.length; i++){
      array[i].angle = loopGroup.loopToPointAngle({x:array[i].x, y:array[i].y});
    }
    array.sort(function (a, b) {
        if (a.angle > b.angle) {
          return 1;
        }
        if (a.angle < b.angle) {
          return -1;
        }
        return 0;
      });
  }

  loopGroup.closestLoopPoint = function(point){
    var loopCenter = loopGroup.getAbsCenter();
    var vect = {x: point.x - loopCenter.x, y:point.y-loopCenter.y};
    var mag = Math.sqrt(Math.pow(vect.x,2)+Math.pow(vect.y,2));
    return {x: loopCenter.x + vect.x/mag * 100 , y:loopCenter.y + vect.y/mag * 100}
  }
  // loopGroup.on('moving', function(e){
  //   var center
  //   
  // }); 
  loopGroup.on('mousedown', function(){
    console.log('down');
    canvas.forEachObject(function(obj){
      if ((obj.type !== 'line'||obj.type!=='startNode'||obj.type!=='loop') && obj.intersected === true && obj.parentNode[0]===loopGroup.ID){
        obj.loopCenter = loopGroup.getCenterPoint();
      }
    })
  });
  loopGroup.on('moving', function(){
    canvas.forEachObject(function(obj){
      if ((obj.type !== 'line'||obj.type!=='startNode'||obj.type!=='loop') && obj.intersected === true && obj.parentNode[0]===loopGroup.ID){
        obj.followLoop(loopGroup.getCenterPoint());
        obj.loopCenter = loopGroup.getCenterPoint();
      }
    })
  })

  loopGroup.on('mouseup', function(){
    console.log('up');
    var newCenter = loopGroup.getCenterPoint();
    canvas.forEachObject(function(obj){
      if ((obj.type !== 'line'||obj.type!=='startNode'||obj.type!=='loop') && obj.intersected === true && obj.parentNode[0]===loopGroup.ID){
        obj.followLoop(newCenter);
      }
    })
  });

}
//   function createOrbit() {
//     orbit = new fabric.Circle({
//       radius: 100,
//       fill: '',
//       stroke: 'black',
//     });
//     oCoords = orbit.getCenterPoint();
//     var hand1 = new fabric.Triangle({
//       width: 10, height: 10, angle: -180, left: oCoords.x + 5, fill:'', stroke:'black'
//     });
//     var hand2 = new fabric.Triangle({
//       width: 10, height: 10,  angle: -180, top: 211, left: oCoords.x + 5, fill:'', stroke:'black'
//     });
//     var loopGroup = new fabric.Group([orbit, hand1, hand2],{
//       left: coords.x, 
//       top: coords.y,
//       ID: guid(),
//       type: 'loop',
//       parentNode: [],
//       parentType: '',
//       children: []
//     });
//     canvas.add(loopGroup);
//     canvas.sendToBack(loopGroup);
//   } 

//   function createBead(){
//     bead = new fabric.Circle({
//       radius: 5,
//       left: oCoords.x - 5,
//       top: oCoords.y - orbit.radius - 5,
//       fill:'black',
//       stroke:'black',
//       lockMovementX: true,
//       lockMovementY: true,
//     });
//     canvas.add(bead);
//     return bead;
//     //bead.center();
//   }

//   function init() {
//     createOrbit();
//     //createBead();
//   }

//   init();   
//   // orbit.on('moving', function(){
//   //   oCoords = orbit.getCenterPoint();
//   //   bead.set({left: oCoords.x - 5, top: oCoords.y - orbit.radius - 5});
//   //   animateBead(bead, 60000/parseInt(canvas.item(1).getText()));
//   // });     
// }

// function animateBead(bead, dur) {

//   var radius = orbit.radius,
//       // rotate around canvas center
//       cx = oCoords.x - bead.radius,
//       cy = oCoords.y - bead.radius,
//       // speed of rotation slows down for further planets
//       duration = dur,
//       // randomize starting angle to avoid planets starting on one line
//       startAngle = fabric.util.getRandomInt(-180, 0),
//       endAngle = startAngle + 359;

//   (function animate() {

//     fabric.util.animate({
//       startValue: startAngle,
//       endValue: endAngle,
//       duration: duration,

//       // linear movement
//       easing: function(t, b, c, d) { return c*t/d + b; },

//       onChange: function(angle) {
//         angle = fabric.util.degreesToRadians(angle);

//         var x = cx + radius * Math.cos(angle);
//         var y = cy + radius * Math.sin(angle);

//         bead.set({ left: x, top: y }).setCoords();
//         canvas.renderAll.bind(canvas)
        
//       },
//       onComplete: animate
//     });
//   })();
// }



