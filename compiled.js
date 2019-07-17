
	var e = import("./@m-3dengine/engine.js");
	var engine;
	e.then(function(en){
		
		engine = new en.default();
		document.getElementById("loading").style.display = 'none';
		document.getElementById("alert").style.display = 'block';
		engine.initCamara();
	});

	function joderlavida(){
		var algo = 'nada';
		function ponerAlgo(){
			return algo;
		}
	}
	

