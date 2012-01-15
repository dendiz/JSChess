/*
 *  Portions of this code was taken from TSCP, and ported to javascript.
 *  Copyright (c) 2011 Deniz Dizman
 *  
 *	Tom Kerrigan's Simple Chess Program (TSCP)
 *
 *	Copyright 1997 Tom Kerrigan
 */
var board = function() {};
board.init_board = function() {
	console.log('board init');
	for (var i=0;i<64;++i) {
		$$.piece[i] = $$.init_piece[i];
		$$.color[i] = $$.init_color[i];
	}
	$$.player_side = $$.LIGHT;
	console.log('player side', $$.player_side);
	$$.side = $$.LIGHT;
	$$.xside = $$.DARK;
	$$.castle = 15; //0x1111
	$$.ply = 0;
	$$.hply = 0;
	$$.ep = -1;
	$$.first_move[0]=0;
}
board.get_color = function() {
	return $$.color;
}
board.get_piece = function() {
	return $$.piece;
}
pawn_op = function(a,b) {
	if ($$.side == $$.LIGHT) {
		return a-b;
	} else {
		return a+b;
	}
}
board.gen = function() {
	$$.first_move[$$.ply+1] = $$.first_move[$$.ply];	
	for (var i=0;i<64;++i) {
		if ($$.color[i] == $$.side) {
			if ($$.piece[i] == $$.PAWN) {
				if ($$.side == $$.LIGHT) {
					if ($$.COL(i) != 0 && $$.color[i - 9] == $$.DARK)
						board.gen_push(i, i - 9, 17);
					if ($$.COL(i) != 7 && $$.color[i - 7] == $$.DARK)
						board.gen_push(i, i - 7, 17);
					if ($$.color[i - 8] == $$.EMPTY) {
						board.gen_push(i, i - 8, 16);
						if (i >= 48 && $$.color[i - 16] == $$.EMPTY)
							board.gen_push(i, i - 16, 24);
					}
				} else {
					if ($$.COL(i) != 0 && $$.color[i + 7] == $$.LIGHT)
						board.gen_push(i, i + 7, 17);
					if ($$.COL(i) != 7 && $$.color[i + 9] == $$.LIGHT)
						board.gen_push(i, i + 9, 17);
					if ($$.color[i + 8] == $$.EMPTY) {
						board.gen_push(i, i + 8, 16);
						if (i <= 15 && $$.color[i + 16] == $$.EMPTY)
							board.gen_push(i, i + 16, 24);
					}
				}
			} else {
				for (var j=0;j<$$.offsets[$$.piece[i]];++j) {
					for (var n=i;;) {
						n = $$.mailbox[$$.mailbox64[n] + $$.offset[$$.piece[i]][j]];
						if (n==-1) break;
						if ($$.color[n] != $$.EMPTY) {
							if ($$.color[n] == $$.xside) { this.gen_push(i,n,1); }
							break;
						}
						this.gen_push(i,n,0);
						if (!$$.slide[$$.piece[i]]) break;
					}
				}
			}
		} //first if..
	}
	//castle
	if ($$.side == $$.LIGHT) {
		$$.castle & 1 && this.gen_push($$.E1, $$.G1, 2);
		$$.castle & 2 && this.gen_push($$.E1, $$.C1, 2);
	} else {
		$$.castle & 4 && this.gen_push($$.E8, $$.G8, 2);
		$$.castle & 8 && this.gen_push($$.E8, $$.C8, 2);
	}
	//en passant
	 if ($$.ep != -1) {
		if ($$.COL($$.ep) != 0 && $$.color[pawn_op($$.ep,7)] == ($$.side == $$.LIGHT ? $$.LIGHT : $$.DARK) 
			&& $$.piece[pawn_op($$.ep,7)] == $$.PAWN) { 
				
				this.gen_push(pawn_op($$.ep,7), $$.ep, 21);
		}
		if ($$.COL($$.ep) != 7 && $$.color[pawn_op($$.ep,9)] == ($$.side == $$.LIGHT ? $$.LIGHT : $$.DARK) 
			&& $$.piece[pawn_op($$.ep,9)] == $$.PAWN) { 
				this.gen_push(pawn_op($$.ep,9), $$.ep, 21);
		}
	 }
}
board.gen_caps = function() {
	$$.first_move[$$.ply+1] = $$.first_move[$$.ply];	
	for (var i=0;i<64;++i) {
		if ($$.color[i] == $$.side) {
			if ($$.piece[i] == $$.PAWN) {
				if ($$.COL(i) != 0 && $$.color[pawn_op(i,9)] == ($$.side == $$.LIGHT ? $$.DARK : $$.LIGHT)) this.gen_push(i,pawn_op(i,9),17);
				if ($$.COL(i) != 7 && $$.color[pawn_op(i,7)] == ($$.side == $$.LIGHT ? $$.DARK : $$.LIGHT)) this.gen_push(i,pawn_op(i,8),17);
				if ($$.color[pawn_op(i,8)] == $$.EMPTY) {
					this.gen_push(i,pawn_op(i,8),16);
					if ((($$.side == $$.LIGHT && i>=48) || ($$.side==$$.DARK && i <= 15)) && $$.color[pawn_op(i,16)] == $$.EMPTY) {
						this.gen_push(i,pawn_op(i,16),24);
					}
				}
			} else {
				for (var j=0;j<$$.offsets[$$.piece[i]];++j) {
					for (var n=i;;) {
						n = $$.mailbox[$$.mailbox64[n] + $$.offset[$$.piece[i]][j]];
						if (n==-1) break;
						if ($$.color[n] != $$.EMPTY) {
							if ($$.color[n] == $$.xside) { this.gen_push(i,n,1); }
							break;
						}
						this.gen_push(i,n,0);
						if (!$$.slide[$$.piece[i]]) break;
					}
				}
			}
		} //first if..
	}
	//en passant
	 if ($$.ep != -1) {
		if ($$.COL($$.ep) != 0 && $$.color[pawn_op($$.ep,7)] == ($$.side == $$.LIGHT ? $$.LIGHT : $$.DARK) 
			&& $$.piece[pawn_op($$.ep,7)] == $$.PAWN) { 
				
				this.gen_push(pawn_op($$.ep,7), $$.ep, 21);
		}
		if ($$.COL($$.ep) != 7 && $$.color[pawn_op($$.ep,9)] == ($$.side == $$.LIGHT ? $$.LIGHT : $$.DARK) 
			&& $$.piece[pawn_op($$.ep,9)] == $$.PAWN) { 
				this.gen_push(pawn_op($$.ep,9), $$.ep, 21);
		}
	 }

}
board.in_check = function(s) {
	for (var i=0;i<64;++i) {
		if ($$.piece[i] == $$.KING && $$.color[i] == s) {
			return this.attack(i, s ^ 1);
		}
	}
}
board.attack = function(sq, s) {
	for (var i =0;i<64;++i) {
		if ($$.color[i] == s) {
			if ($$.piece[i] == $$.PAWN) {
				if (s == $$.LIGHT) {
					if ($$.COL(i) != 0 && i - 9 == sq) return true;
					if ($$.COL(i) != 7 && i - 7 == sq) return true;
				} else {
					if ($$.COL(i) != 0 && i + 7 == sq) return true;
					if ($$.COL(i) != 7 && i + 9 == sq) return true;
				}
			} else {
				for (var j=0;j<$$.offsets[$$.piece[i]]; ++j) {
					for (n = i;;) {
						n = $$.mailbox[$$.mailbox64[n] + $$.offset[$$.piece[i]][j]];
						if (n == -1) break;
						if (n == sq) return true;
						if ($$.color[n] != $$.EMPTY) break;
						if (!$$.slide[$$.piece[i]]) break;
					}
				}
			}
		}
	}
	return false;
}
board.print_board = function() {
	var map ="p n b r q k .".split(" ");
	var y = "8,7,6,5,4,3,2,1".split(",");
	
	var str= "";
	for (var i=0;i<64;++i) {
		if (i % 8 == 0) {
			str += y[$$.ROW(i)] + " ";
		}
		var p = $$.color[i] == $$.LIGHT ? map[$$.piece[i]].toUpperCase() : map[$$.piece[i]];
		str += p+" ";
		if (i % 8 == 7) {
			console.log(str);
			str = "";
		}
	}
	console.log("  a b c d e f g h\n");
}
board.coord_to_index = function(coord) {
	if (coord.length != 2) {
		console.error('invalid coord');
		return;
	}
	coord[0] = coord[0].toLowerCase();
	for (var i=0;i<64;i++) {
		if (board.index_to_coord(i) == coord) {
			return i;
		}
	}
}
board.find_in_gen_dat = function(from, to) {
	if (parseInt(from) == "NaN") {
		from = board.coord_to_index(from);
	}
	if (parseInt(to) == "NaN") {
		to = board.coord_to_index(to);
	}
	if (parseInt(to) == "NaN" || parseInt(from) == "NaN") throw "invalid coordinates"
	console.log('searching in gen_dat from',from,' to',to);
	var res = [];
	for (var i=0;i<$$.gen_dat.length;i++) {
		var item = $$.gen_dat[i].m.b;
		if (item.from == from && item.to == to) {
			console.log('position:',i, $$.gen_dat[i]);
			res.push({i: i, entry:$$.gen_dat[i]});
		}
	}
	return res;
}
board.index_to_coord = function(i) {
	var x = "a,b,c,d,e,f,g,h".split(",");
	var y = "8,7,6,5,4,3,2,1".split(",");
	return x[$$.COL(i)] + "" + y[$$.ROW(i)];
}
board.print_move = function(gen_dat) {
	var from = board.index_to_coord(gen_dat.m.b.from);
	var to = board.index_to_coord(gen_dat.m.b.to);
	console.log('move from',from, ' to', to, ' score ',gen_dat.score);
}
board.gen_push = function(from,to,bits) {
	var s_from = from + "(" + this.index_to_coord(from) + ")";
	var s_to = to + "("+this.index_to_coord(to) + ")";
	var s_bits = bits + "(" + $$.RESOLVE_MOVE_TYPE(bits) + ")";
	//util.puts('add to move stack from:'+s_from+' to:'+s_to+') bits:'+s_bits);
	if (bits & 16 ) { //is it a pawn move?
		if (($$.side == $$.LIGHT && to <= $$.H8) || ($$.side == $$.DARK && to >= $$.A1)) {
			this.gen_promote(from,to,bits);
		}
	}
	var score;
	//FIXME: this considers castling (even when not allow due to pieces in between as a highscore move
	if ($$.color[to] != $$.EMPTY) {
		score = 1000000 + ($$.piece[to] * 10 ) - $$.piece[from];
	} else {
		score = $$.history[from][to];
	}
	var move = this.create_move_object(from,to,bits,0);
	var gen_t = {m: move, score: score};
	var index=$$.first_move[$$.ply+1]++;
	$$.gen_dat[index] = gen_t;
	//console.log(gen_t);
}
board.gen_promote = function(from,to,bits) {
	for (var i = $$.KNIGHT;i <= $$.QUEEN;++i) {
			var move = this.create_move_object(from,to,bits | 32, i);
			var score = 1000000 + (i+10);
			var gen_t = {move: move, score: score};
			var index=$$.first_move[$$.ply+1];
			$$.gen_dat[index++] = gen_t;
	}
}
/*
move_byes = {
	from,
	to,
	promote,
	bits
}

*/
board.makemove = function(m/* move_bytes */) {
	var from,to;
	if (m.bits & 2 ) {
		if (this.in_check($$.side)) return false;
		switch(m.to) {
			case 62:
				if ($$.color[$$.F1] != $$.EMPTY || $$.color[$$.G1] != $$.EMPTY ||
						this.attack($$.F1, $$.xside) || this.attack($$.G1, $$.xside)) 
					return false;
				from = $$.H1;
				to = $$.F1;
				break;
			case 58:
				if ($$.color[$$.B1] != $$.EMPTY || $$.color[$$.C1] != $$.EMPTY || $$.color[$$.D1] != $$.EMPTY ||
						this.attack($$.C1, $$.xside) || this.attack($$.D1, $$.xside))
					return false;
				from = $$.A1;
				to = $$.D1;
				break;
			case 6:
				if ($$.color[$$.F8] != $$.EMPTY || $$.color[$$.G8] != $$.EMPTY ||
						this.attack($$.F8,$$.xside) || this.attack($$.G8, $$.xside))
					return false;
				from = $$.H8;
				to = $$.F8;
				break;
			case 2:
				if ($$.color[$$.B8] != $$.EMPTY || $$.color[$$.C8] != $$.EMPTY || $$.color[$$.D8] != $$.EMPTY ||
						this.attack($$.C8, $$.xside) || this.attack($$.D8, $$.xside))
					return false;
				from = $$.A8;
				to = $$.D8;
				break;
		}
		$$.color[to] = $$.color[from];
		$$.piece[to] = $$.piece[from];
		$$.color[from] = $$.EMPTY;
		$$.piece[from] = $$.EMPTY;
	}//eof castling checking
	var h = $$.hist_dat[$$.hply];
	if (!h) $$.hist_dat[$$.hply] = {};
	h = $$.hist_dat[$$.hply];

	h.m = h.m || {};
	h.m.b = h.m.b || {}

	h.m.b = m;
	h.capture = $$.piece[m.to];
	h.castle = $$.castle;
	h.ep = $$.ep;
	$$.ply++;
	$$.hply++;
	
	$$.castle &= $$.castle_mask[m.from] & $$.castle_mask[m.to];
	if (m.bits & 8) {
		if ($$.side == $$.LIGHT) $$.ep = m.to + 8;
		else $$.ep = m.to - 8;
	} else {
		$$.ep = -1;
	}

	$$.color[m.to] = $$.side;
	if (m.bits & 32) $$.piece[m.to] = m.promote;
	else $$.piece[m.to] = $$.piece[m.from];
	$$.color[m.from] = $$.EMPTY;
	$$.piece[m.from] = $$.EMPTY;
	
	//delete pawn if EP move
	if (m.bits & 4) {
		if ($$.side == $$.LIGHT) {
			$$.color[m.to+8] = $$.EMPTY;
			$$.piece[m.to+8] = $$.EMPTY;
		} else {
			$$.color[m.to-8] = $$.EMPTY;
			$$.piece[m.to-8] = $$.EMPTY;
		}
	}

	//switch sides and test if legal. move leaves king in check?
	$$.side ^= 1;
	$$.xside ^= 1;
	if (this.in_check($$.xside)) {
		board.take_back();
		return false;
	}
	return true;
}
board.take_back = function() {
	var m;
	$$.side ^= 1;
	$$.xside ^= 1;
	$$.ply--;
	$$.hply--;
	var h = $$.hist_dat[$$.hply];
	m = h.m.b;
	$$.castle = h.castle;
	$$.ep = h.ep;
	$$.color[m.from] = $$.side;
	if (m.bits & 32) {
		$$.piece[m.from] = $$.PAWN;
	} else {
		$$.piece[m.from] = $$.piece[m.to];
	}
	if (h.capture == $$.EMPTY) {
		$$.color[m.to] = $$.EMPTY;
		$$.piece[m.to] = $$.EMPTY;
	} else {
		$$.color[m.to] = $$.xside;
		$$.piece[m.to] = h.capture;
	}
	if (m.bits & 2) {
		var from,to;
		switch(m.to) {
			case 62:
				from = $$.F1;
				to = $$.H1;
				break;
			case 58:
				from = $$.D1;
				to = $$.A1;
				break;
			case 6:
				from = $$.F8;
				to = $$.H8;
				break;
			case 2:
				from = $$.D8;
				to = $$.A8;
				break;
		}
		$$.color[to] = $$.side;
		$$.piece[to] = $$.ROOK;
		$$.color[from] = $$.EMPTY;
		$$.piece[from] = $$.EMPTY;
	}
	if (m.bits & 4) {
		if ($$.side == $$.LIGHT) {
			$$.color[m.to + 8] = $$.xside;
			$$.piece[m.to + 8] = $$.PAWN;
		} else {
			$$.color[m.to - 8] = $$.xside;
			$$.piece[m.to - 8] = $$.PAWN;
		}
	}

}
board.create_move_object = function(from,to,bits,promote) {
	promote = promote || 0;
	var move = {b: {
			from: from,
			to: to,
			promote: 0,
			bits: bits
		}, u: 0};
	return move;

}
board.move_str = function(m) {
	var c="",str;
	var letters = "abcdefgh";
	if (m.bits & 32) {
		switch(m.promote) {
			case $$.KNIGHT:
				c = "n";
				break;
			case $$.BISHOP:
				c = "b";
				break;
			case $$.ROOK:
				c = "r";
				break
			default:
				c = "q";
		}
		str = sprintf("%s%d%s%d%s",letters[$$.COL(m.from)], 8-$$.ROW(m.from), letters[$$.COL(m.to)] , 8-$$.ROW(m.to),c);
	} else {
		str = sprintf("%s%d%s%d",letters[$$.COL(m.from)], 8-$$.ROW(m.from), letters[$$.COL(m.to)] , 8-$$.ROW(m.to));
	}
	return str;
}
board.dump_gen_dat = function() {
	$.each($$.gen_dat, function(i,it) {
		board.print_move(it);		
	});
}
//engine
var engine = function() {};
engine.init = function() {
	console.log('engine init');
	$("body").bind('computerturn',$.proxy(engine.think, engine));
}
engine.think = function() {
	console.log("ply      nodes  score  pv");
	var x;
	for (var i=0;i<$$.max_depth;++i) {
		$$.follow_pv = true;
		x = engine.search(-10000,10000,i);
		console.log(sprintf("%3d  %9d  %5d ", i, $$.nodes, x));
		var str = "";
		for (var j=0;j<$$.pv_length[0];++j) {
			str += sprintf(" %s",board.move_str($$.pv[0][j].b));
		}
		if (str != "") console.log(str);
		if (x > 9000 || x < -9000) {
			if (x < -9000) {
				xboard.check_mate('white')
				break;
			} else {
				xboard.check_mate('black')
			}
		}
	}
	if (!$$.pv[0][0]) {
		console.log('no legal moves');
		return;
	}
	console.log('cpu move', board.move_str($$.pv[0][0].b));
	board.makemove($$.pv[0][0].b);
	$$.ply = 0;
	board.gen();
	xboard.draw();
	xboard.mark_dark($$.pv[0][0].b.from,$$.pv[0][0].b.to);
}
engine.search = function(alpha,beta,depth) {
	var f,x,c
	if (!depth)
		return engine.quiesce(alpha,beta);
	++$$.nodes;
	$$.pv_length[$$.ply] = $$.ply;
	if ($$.ply && engine.reps()) return 0;
	if ($$.ply >= $$.MAX_PLY - 1) return evaluate.evaluate();
	if ($$.ply >= $$.HIST_STACK - 1) return evaluate.evaluate();
	c = board.in_check($$.side);
	if (c) ++depth;
	board.gen();
	if ($$.follow_pv) engine.sort_pv();
	f = false;
	for (var i=$$.first_move[$$.ply];i<$$.first_move[$$.ply+1];++i) {
		engine.sort(i);
		if (!board.makemove($$.gen_dat[i].m.b)) continue;
		f = true;
		x = -engine.search(-beta,-alpha, depth-1);
		board.take_back();
		if (x>alpha) {
			$$.history[$$.gen_dat[i].m.b.from][$$.gen_dat[i].m.b.to] += depth;
			if (x >= beta) return beta;
			alpha = x;
			$$.pv[$$.ply][$$.ply] = $$.gen_dat[i].m
			for (var j = $$.ply + 1; j<$$.pv_length[$$.ply + 1]; ++j) {
				$$.pv[$$.ply][j] = $$.pv[$$.ply+1][j];
			}
			$$.pv_length[$$.ply] = $$.pv_length[$$.ply + 1];
		}
	}
	if (!f) {
		if (c) return -10000 + $$.ply;
		else return 0;
	}
	return alpha;
}
engine.quiesce = function(alpha, beta) {
	var x;
	$$.nodes++;
	$$.pv_length[$$.ply] = $$.ply;
	if ($$.ply >= $$.MAX_PLY - 1) return evaluate.evaluate();
	if ($$.ply >= $$.HIST_STACK - 1) return evaluate.evaluate();
	x = evaluate.evaluate();
	if (x>=beta) return beta;
	if (x>alpha) alpha = x;
	board.gen_caps();
	if ($$.follow_pv) engine.sort_pv();
	for (var i=$$.first_move[$$.ply];i<$$.first_move[$$.ply+1];++i) {
		engine.sort(i);
		if (!board.makemove($$.gen_dat[i].m.b)) continue;
		x = -engine.quiesce(-beta,-alpha);
		board.take_back();
		if (x > alpha) {
			if (x >= beta) return beta;
			alpha = x;
			$$.pv[$$.ply][$$.ply] = $$.gen_dat[i].m;
			for (var j =$$.ply + 1;j<$$.pv_length[$$.ply+1];++j) {
				$$.pv[$$.ply][j] = $$.pv[$$.ply+1][j];
			}
			$$.pv_length[$$.ply] = $$.pv_length[$$.ply + 1];
		}
	}
	return alpha;
}
engine.reps = function() {
	//TODO: fifty move rule
	return 0; 
}
engine.compare_moves = function(m1,m2) {
	return m1.b.to == m2.b.to && m1.b.from == m2.b.from;
}
engine.sort_pv = function() {
	$$.follow_pv = false;
	for (var i=$$.first_move[$$.ply];i<$$.first_move[$$.ply+1];++i) {
		if (engine.compare_moves($$.gen_dat[i].m,$$.pv[0][$$.ply])) {
			$$.follow_pv = true;
			$$.gen_dat[i].score += 10000000;
			return;
		}
	}
}
engine.sort = function(from) {
	var bs,bi;
	bs = -1;
	bi = from;
	for (var i=from; i<$$.first_move[$$.ply + 1];++i) {
		if ($$.gen_dat[i].score > bs) {
			bs = $$.gen_dat[i].score;
			bi = i;
		}
	}
	var g = $$.gen_dat[from];
	$$.gen_dat[from] = $$.gen_dat[bi];
	$$.gen_dat[bi] = g;
}
engine.parse_move = function(from,to) {
	for (var i=0;i<$$.first_move[1]; ++i) {
		if ($$.gen_dat[i].m.b.from == from && $$.gen_dat[i].m.b.to == to) {
			//handle promotion
			if ($$.gen_dat[i].m.b.bits & 32) {
				//TODO
			}
			return i;
		}
	}
	return -1;
}
