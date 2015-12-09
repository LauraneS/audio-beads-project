var orbit, bead, dur = 1000;
function LoopNode(){
  function createOrbit() {
    orbit = new fabric.Circle({
      radius: 220,
      fill: '',
      stroke: 'rgba(0,192,255,0.5)',
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    canvas.add(orbit);
    orbit.center();
  }

  function createBead(){
    var oCoords = orbit.getCenterPoint();
    bead = new fabric.Circle({
      radius: 5,
      left: oCoords.x - 5,
      top: oCoords.y - orbit.radius - 5,
      fill:'black',
      stroke:'black',
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    canvas.add(bead);
    return bead;
    //bead.center();
  }

  function init() {
    createOrbit();
    createBead();
  }

  init();        
}

function animateBead(bead, dur) {

  var radius = orbit.radius,
      // rotate around canvas center
      cx = canvas.getWidth() / 2 - bead.radius,
      cy = canvas.getHeight() / 2 - bead.radius,
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
        canvas.renderAll();
        
      },
      onComplete: animate
    });
  })();
}



