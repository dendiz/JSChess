if( typeof window.console == 'undefined'){
    window.console = {
        log:function(){}
    };
}
$(document).ready(function() {
	xboard.init();
	board.init_board();
	engine.init();
	board.gen(); //generate initial moves for white
	xboard.bind();
	xboard.draw();
})
