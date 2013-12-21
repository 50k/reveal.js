

(function() {

	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

	var number= getParameterByName('num');

	console.log(">>>>> number: " + number);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== socketId) {
			return;
		}

		if( window.location.host === 'localhost:1947' ) return;

		console.log(">>>>"+JSON.stringify(data));
		Reveal.slide(data.indexh, (number-1), data.indexf, 'remote');
		//Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
	});

/*
    //alert('full screen');
	var isFullscreen = ((typeof document.webkitIsFullScreen) !== 'undefined')
		? document.webkitIsFullScreen : document.mozFullScreen;

	if(isFullscreen == false){
		
		var el = document.documentElement
		, rfs = el.requestFullScreen || el.webkitRequestFullScreen
			|| el.mozRequestFullScreen || el.msRequestFullScreen;
		//~ console.log("1123    " +rfs + " s "  + isFullscreen);
		if(typeof rfs!="undefined" && rfs){
			rfs.call(el);
			console.log('onononononon   ' + rfs)		  ;
		}
		else if(typeof window.ActiveXObject!="undefined"){
			// for Internet Explorer
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript!=null) {
				wscript.SendKeys("{F11}");
			}
		}
		//$('#fullscreen').css('opacity','0.7');
	}
	else{
		if (document.cancelFullScreen) { document.cancelFullScreen();}
		else if (document.mozCancelFullScreen) {document.mozCancelFullScreen();}
		else if (document.webkitCancelFullScreen) {document.webkitCancelFullScreen();}
		//$('#fullscreen').css('opacity','0.3');
	}

*/
	enterFullscreen();
}());

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function enterFullscreen() {
	var elem = document.querySelector(document.webkitExitFullscreen ? "#slideels" : "#slideels-container");
  console.log("enterFullscreen()");
  //elem.onwebkitfullscreenchange = onFullScreenEnter;
  //elem.onmozfullscreenchange = onFullScreenEnter;
  //elem.onfullscreenchange = onFullScreenEnter;
  if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else {
      elem.requestFullscreen();
    }
  }
  //document.getElementById('enter-exit-fs').onclick = exitFullscreen;
}
