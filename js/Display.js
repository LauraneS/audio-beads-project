document.getElementById("effect-name").oninput = function(){
	var value = document.getElementById("effect-name").value;
	console.log(value);
	var elements = ["effect-echo", "effect-reverb", "effect-distortion", "effect-pingpong"];
	switch (value){
		case 'echo':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-echo'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'reverb':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-reverb'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'distortion':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-distortion'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'pingpong':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-distortion'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
	}
};