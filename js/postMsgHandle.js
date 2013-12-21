window.addEventListener('message', function(event){
	var req = JSON.parse(event.data);
	if(req.cmd == 'get_total'){
		var num = document.querySelectorAll( '.reveal .slides>section' ).length;
		window.parent.postMessage(JSON.stringify({'cmd':'get_total', 'value':num}),'*');
	}else if(req.cmd == 'jump_to'){
		Reveal.slide(req.value);
	}
});

