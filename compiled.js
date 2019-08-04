
	var e = import("./@m-3dengine/engine.js");
	var fromMob=false;
	var engine;
	e.then(function(en){
		console.log(en);
		en.default.then(function(response){
			engine = response;
			document.getElementById("loading").style.display = 'none';
			document.getElementById("alert").style.display = 'block';
			engine.initCamara();
		});
		
	});

	function joderlavida(){
		var algo = 'nada';
		function ponerAlgo(){
			return algo;
		}
	}
	var ColorPicker;
	function initColorPicker(){
		var promise = import("./@m-colorPicker/colorPicker.js");
		promise.then(function(val){
			ColorPicker = new val.default();
			ColorPicker.init();
		});

    	
		
	}
	

