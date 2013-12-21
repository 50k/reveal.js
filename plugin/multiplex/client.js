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

}());

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
