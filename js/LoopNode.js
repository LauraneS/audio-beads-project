var orbit, bead, dur = 1000, oCoords;
function LoopNode(coords){
  var loopGroup = Node('loop', coords, 100, true, true);
  canvas.add(loopGroup);

  loopGroup.sortChildren = function(){
    //sort array of centerpoints
    //use comparison function to order them clockwise starting from 12oclock
  }
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



