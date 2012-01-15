var xboard = function() {}

xboard.toggle_thinking = function() {
	var it=$("#engine-thinking");
	if (it.is(':visible')) {
		it.fadeOut(400);
	} else {
		it.show();
	}
}
xboard.init= function() {
	$("#invalid-move").hide();
	$("#invalid-turn").hide();
	$("#engine-thinking").hide();
	$("#checkmate").hide();
	var root = $("#board");
	var rows = [8,7,6,5,4,3,2,1];
	for (var i = 0; i<64; ++i) {
		var sq,color;
		if ($$.ROW(i) % 2 == 0) {
			color = i %2 == 0 ? "light":"dark";
		} else {
			color = i % 2 == 0 ? "dark":"light";
		}
		if (i % 8 == 0) {
			var t = '<div class="y-coord"><div class="">'+(rows[$$.ROW(i)])+'</div></div>';
			sq = $(t);
			root.append(sq);
		}
		sq = $("<div></div>").addClass("sq " + color).attr('sq-id',i).html("");	
		root.append(sq);
		if (i%8 == 7) {
			sq = $("<div></div>").addClass("clearer");	
			root.append(sq);
		}
	}
	var letters = "a b c d e f g h".split(" ");
	$.each(letters, function(i,it) {
		var c = i == 0 ? "coord first" : "coord"
		root.append($("<div></div>").addClass(c).html(it));
	});
	xboard.bind_debugger_tools();
}
xboard.check_mate = function(winner) {
	$("#checkmate").html(winner + " wins").show();
}
xboard.bind_debugger_tools = function() {
	$("#index-to-coordinate-btn").click(function() {
		var c = $("#index-to-coordinate").val();
		$("#conversion-result").html(board.index_to_coord(c));
	});
	$("#coordinate-to-index-btn").click(function() {
		var c = $("#coordinate-to-index").val();
		$("#conversion-result").html(board.coord_to_index(c));
	});
	$("#gen_dat-search-btn").click(function() {
		var to = $("#gen_dat-to").val();
		var from = $("#gen_dat-from").val();
		console.log("from", from, "to",to);
		var res = board.find_in_gen_dat(from,to);
		console.log('res', res);
		var str = "";
		$.each(res, function(i,it) {
			str += "gen_dat["+it.i + "] to:" + it.entry.m.b.to + " from:"+it.entry.m.b.from+" score:"+it.entry.score +"\n";
		})
		$("#gen_dat-result").html("<pre>"+str+"</pre>");
	});
	$("#board-dump-result").hide();
	$("#board-dump-btn").click(function() {
		$("#color-dump").val("$$.color = ["+$$.color+"];\n $$.piece=["+$$.piece+"];");
		$("#board-dump-result").toggle();
	});
}
xboard.bind = function() {
	var sq = $('.sq');
	var selected_sq1 = null;
	if (sq.length != 64 ) {
		console.error('no squares found. did you init xboard?');
		return;
	}
	$("body").unbind('click').click(function(event) {
		$(".sq").removeClass('selected');
		selected_sq1 = null;
	})
	sq.unbind('click').click(function(event) {
		event.stopImmediatePropagation();
		if ($$.side != $$.player_side) {
			console.log('not your turn');
			$("#invalid-turn").show().fadeOut(2000);
			return;
		}
		$(this).addClass('selected');
		var i = $(this).attr('sq-id');
		if ($$.color[i] != $$.player_side && selected_sq1 == null) {
			$(".sq").removeClass('selected');
			return;
		} //click on opp piece or empty sq without first selecting a piece
		if (selected_sq1 == null ) {
			selected_sq1 = i;
			return;
		}
		if ($$.color[i] == $$.player_side && selected_sq1 != null) {
			selected_sq1 = null;
			$(".sq").removeClass('selected');
			return;
		}
		console.log('making move:', board.index_to_coord(selected_sq1), ' to ', board.index_to_coord(i));
		var move = engine.parse_move(selected_sq1,i);
		if (move == -1 || !board.makemove($$.gen_dat[move].m.b)) {
			console.log('invalid move');
			$("#invalid-move").show().fadeOut(2000);
			$(".sq").removeClass('selected');
			selected_sq1 = null;
			return;
		} else {
			xboard.toggle_thinking();
			$(".sq").removeClass('selected');
			selected_sq1 = null;
			xboard.draw();	
			$$.ply = 0;
			board.gen();
			//setTimeout(function() {$("body").trigger('computerturn');}, 500);
			setTimeout($.proxy(engine.think,engine), 200);
			xboard.toggle_thinking();

		}
	});
}
xboard.mark_dark= function(from,to) {
	$(".sq").removeClass('selected');
	$(".sq[sq-id="+from+"]").addClass('selected');
	$(".sq[sq-id="+to+"]").addClass('selected');
}
xboard.draw = function() {
	$('.sq').attr("style","");
	for (var i=0;i<64;++i) {
		var sel = ".sq[sq-id='"+i+"']";
		$(sel).css(xboard._get_piece_css(i));
	}
}
xboard._get_piece_css = function(i /*square*/) {
	var color;
	var p = ["pawn","knight","bishop","rook","queen","king"];
	if ($$.color[i] == $$.LIGHT) {
		color="white"
	} else if ($$.color[i] == $$.DARK){
		color="black";
	} else {
		return {};
	}
	var p_name = p[$$.piece[i]];
	var img = color + "-" + p_name;
	var img_url = "url(img/"+img+".gif)";
	return {'background-image': img_url, 
		'background-position':'center center', 
		'background-repeat' :'no-repeat'}

}
