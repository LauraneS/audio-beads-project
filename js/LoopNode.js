var orbit, bead, dur = 1000, oCoords;
function LoopNode(){
  function createOrbit() {
    orbit = new fabric.Circle({
      radius: 100,
      left: fabric.util.getRandomInt(0, canvas.getWidth() -99), 
      top: fabric.util.getRandomInt(0, canvas.getHeight() -99),
      fill: '',
      stroke: 'black',
      type: 'loop',
      ID: guid(),
      parent: [],
      children:[]
    });
    canvas.add(orbit);
  }

  function createBead(){
    oCoords = orbit.getCenterPoint();
    bead = new fabric.Circle({
      radius: 5,
      left: oCoords.x - 5,
      top: oCoords.y - orbit.radius - 5,
      fill:'black',
      stroke:'black',
      lockMovementX: true,
      lockMovementY: true,
    });
    canvas.add(bead);
    return bead;
    //bead.center();
  }

  function init() {
    createOrbit();
    //createBead();
  }

  init();   
  // orbit.on('moving', function(){
  //   oCoords = orbit.getCenterPoint();
  //   bead.set({left: oCoords.x - 5, top: oCoords.y - orbit.radius - 5});
  //   animateBead(bead, 60000/parseInt(canvas.item(1).getText()));
  // });     
}

function animateBead(bead, dur) {

  var radius = orbit.radius,
      // rotate around canvas center
      cx = oCoords.x - bead.radius,
      cy = oCoords.y - bead.radius,
      // speed of rotation slows down for further planets
      duration = dur,
      // randomize starting angle to avoid planets starting on one line
      startAngle = fabric.util.getRandomInt(-180, 0),
      endAngle = startAngle + 359;

  (function animate() {

    fabric.util.animate({
      startValue: startAngle,
      endValue: endAngle,
      duration: duration,

      // linear movement
      easing: function(t, b, c, d) { return c*t/d + b; },

      onChange: function(angle) {
        angle = fabric.util.degreesToRadians(angle);

        var x = cx + radius * Math.cos(angle);
        var y = cy + radius * Math.sin(angle);

        bead.set({ left: x, top: y }).setCoords();
        canvas.renderAll.bind(canvas)
        
      },
      onComplete: animate
    });
  })();
}



