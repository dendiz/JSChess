var evaluate = function() {};
evaluate.DOUBLED_PAWN_PENALTY	=	10;
evaluate.ISOLATED_PAWN_PENALTY	=	20;
evaluate.BACKWARDS_PAWN_PENALTY	=	8;
evaluate.PASSED_PAWN_BONUS		=	20;
evaluate.ROOK_SEMI_OPEN_FILE_BONUS=	10;
evaluate.ROOK_OPEN_FILE_BONUS	=	15;
evaluate.ROOK_ON_SEVENTH_BONUS	=	20;

evaluate.piece_value = [
	100, 300, 300, 500, 900, 0
];

evaluate.pawn_pcsq = [
	  0,   0,   0,   0,   0,   0,   0,   0,
	  5,  10,  15,  20,  20,  15,  10,   5,
	  4,   8,  12,  16,  16,  12,   8,   4,
	  3,   6,   9,  12,  12,   9,   6,   3,
	  2,   4,   6,   8,   8,   6,   4,   2,
	  1,   2,   3, -10, -10,   3,   2,   1,
	  0,   0,   0, -40, -40,   0,   0,   0,
	  0,   0,   0,   0,   0,   0,   0,   0
];

evaluate.knight_pcsq = [
	-10, -10, -10, -10, -10, -10, -10, -10,
	-10,   0,   0,   0,   0,   0,   0, -10,
	-10,   0,   5,   5,   5,   5,   0, -10,
	-10,   0,   5,  10,  10,   5,   0, -10,
	-10,   0,   5,  10,  10,   5,   0, -10,
	-10,   0,   5,   5,   5,   5,   0, -10,
	-10,   0,   0,   0,   0,   0,   0, -10,
	-10, -30, -10, -10, -10, -10, -30, -10
];

evaluate.bishop_pcsq = [
	-10, -10, -10, -10, -10, -10, -10, -10,
	-10,   0,   0,   0,   0,   0,   0, -10,
	-10,   0,   5,   5,   5,   5,   0, -10,
	-10,   0,   5,  10,  10,   5,   0, -10,
	-10,   0,   5,  10,  10,   5,   0, -10,
	-10,   0,   5,   5,   5,   5,   0, -10,
	-10,   0,   0,   0,   0,   0,   0, -10,
	-10, -10, -20, -10, -10, -20, -10, -10
];

evaluate.king_pcsq = [
	-40, -40, -40, -40, -40, -40, -40, -40,
	-40, -40, -40, -40, -40, -40, -40, -40,
	-40, -40, -40, -40, -40, -40, -40, -40,
	-40, -40, -40, -40, -40, -40, -40, -40,
	-40, -40, -40, -40, -40, -40, -40, -40,
	-40, -40, -40, -40, -40, -40, -40, -40,
	-20, -20, -20, -20, -20, -20, -20, -20,
	  0,  20,  40, -20,   0, -20,  40,  20
];

evaluate.king_endgame_pcsq = [
	  0,  10,  20,  30,  30,  20,  10,   0,
	 10,  20,  30,  40,  40,  30,  20,  10,
	 20,  30,  40,  50,  50,  40,  30,  20,
	 30,  40,  50,  60,  60,  50,  40,  30,
	 30,  40,  50,  60,  60,  50,  40,  30,
	 20,  30,  40,  50,  50,  40,  30,  20,
	 10,  20,  30,  40,  40,  30,  20,  10,
	  0,  10,  20,  30,  30,  20,  10,   0
];

evaluate.flip = [
	 56,  57,  58,  59,  60,  61,  62,  63,
	 48,  49,  50,  51,  52,  53,  54,  55,
	 40,  41,  42,  43,  44,  45,  46,  47,
	 32,  33,  34,  35,  36,  37,  38,  39,
	 24,  25,  26,  27,  28,  29,  30,  31,
	 16,  17,  18,  19,  20,  21,  22,  23,
	  8,   9,  10,  11,  12,  13,  14,  15,
	  0,   1,   2,   3,   4,   5,   6,   7
];

evaluate.pawn_rank = [];
for (var i=0;i<2;i++) {
	evaluate.pawn_rank[i] = [];
	for(var j=0;j<10;j++) {
		evaluate.pawn_rank[i][j] = 0;	
	}	
}
evaluate.piece_mat = [];
evaluate.pawn_mat = [];
evaluate.color_tab_index = function(i) {
	return $$.color[i] == $$.LIGHT ? i : evaluate.flip[i];
}
evaluate.evaluate = function() {
	var i,f,score = [];
	for (i=0;i<10;i++) {
		evaluate.pawn_rank[$$.LIGHT][i] = 0;
		evaluate.pawn_rank[$$.DARK][i] = 7;
	}
	evaluate.piece_mat[$$.LIGHT] = 0;
	evaluate.piece_mat[$$.DARK] = 0;
	evaluate.pawn_mat[$$.LIGHT] = 0;
	evaluate.pawn_mat[$$.DARK] = 0;
	for (i =0;i<64;++i) {
		if ($$.color[i] == $$.EMPTY) continue;
		if ($$.piece[i] == $$.PAWN) {
			evaluate.pawn_mat[$$.color[i]] += evaluate.piece_value[$$.PAWN];
			f = $$.COL(i) + 1;
			if ($$.color[i] == $$.LIGHT) {
				if (evaluate.pawn_rank[$$.LIGHT][f] < $$.ROW(i)) {
					evaluate.pawn_rank[$$.LIGHT][f] = $$.ROW(i);
				}
			} else {
				if (evaluate.pawn_rank[$$.DARK][f] > $$.ROW(i)) {
					evaluate.pawn_rank[$$.DARK][f] = $$.ROW(i);
				}
				
			}
		} else {
			evaluate.piece_mat[$$.color[i]] += evaluate.piece_value[$$.piece[i]];
		}
	}
	score[$$.LIGHT] = evaluate.piece_mat[$$.LIGHT] + evaluate.pawn_mat[$$.LIGHT];
	score[$$.DARK] = evaluate.piece_mat[$$.DARK] + evaluate.pawn_mat[$$.DARK];
	for (i = 0;i<64;++i) {
		if ($$.color[i] == $$.EMPTY) continue;
		var current_color = $$.color[i];
		var current_other_color = current_color == $$.LIGHT ? $$.DARK : $$.LIGHT;
		var evaluate_fn = {
			"0_pawn": evaluate.evaluate_light_pawn,
			"1_pawn": evaluate.evaluate_dark_pawn,
			"0_king": evaluate.evaluate_light_king,
			"1_king": evaluate.evaluate_dark_king
		};
		switch($$.piece[i]) {
			case $$.PAWN:
				score[current_color] += evaluate_fn[current_color+"_pawn"](i);
				break;
			case $$.KNIGHT:
				score[current_color] += evaluate.knight_pcsq[evaluate.color_tab_index(i)];
				break;
			case $$.BISHOP:
				score[current_color] += evaluate.bishop_pcsq[evaluate.color_tab_index(i)];
				break;
			case $$.ROOK:
				if (current_color == $$.LIGHT) {
					if (evaluate.pawn_rank[$$.LIGHT][$$.COL(i) + 1] == 0) {
						if (evaluate.pawn_rank[$$.DARK][$$.COL(i) + 1] == 7) {
							score[$$.LIGHT] += evaluate.ROOK_OPEN_FILE_BONUS;
						} else {
							score[$$.LIGHT] += evaluate.ROOK_SEMI_OPEN_FILE_BONUS;
						}
					}
					if($$.ROW(i) == 1) {
						score[$$.LIGHT] += evaluate.ROOK_ON_SEVENTH_BONUS;
					}
					break;
				} else {
					if (evaluate.pawn_rank[$$.DARK][$$.COL(i) + 1] == 7) {
						if (evaluate.pawn_rank[$$.LIGHT][$$.COL(i) + 1] == 0) {
							score[$$.DARK] += evaluate.ROOK_OPEN_FILE_BONUS;
						} else {
							score[$$.DARK] += evaluate.ROOK_SEMI_OPEN_FILE_BONUS;
						}
					}
					if($$.ROW(i) == 6) {
						score[$$.DARK] += evaluate.ROOK_ON_SEVENTH_BONUS;
					}
					break;
				}
				break;
			case $$.KING: 
				if (evaluate.piece_mat[current_other_color] <= 1200) {
					score[current_color] += evaluate.king_endgame_pcsq[evaluate.color_tab_index(i)];
				} else {
					score[current_color] += evaluate_fn[current_color+"_king"](i);
				}
				break;

		}
		if ($$.side == $$.LIGHT) {
			return score[$$.LIGHT] - score[$$.DARK];
		}
		return score[$$.DARK] - score[$$.LIGHT];
	}

}
evaluate.evaluate_light_pawn = function(sq) {
	var r,f;
	r = 0;
	f = $$.COL(sq) + 1;
	r += evaluate.pawn_pcsq[sq];
	if (evaluate.pawn_rank[$$.LIGHT][f] > $$.ROW(sq)) r -= evaluate.DOUBLED_PAWN_PENALTY;

	if (evaluate.pawn_rank[$$.LIGHT][f-1] == 0 &&
			(evaluate.pawn_rank[$$.LIGHT][f+1] == 0 ))
		r -= evaluate.ISOLATED_PAWN_PENALTY;
	else if (evaluate.pawn_rank[$$.LIGHT][f-1] < $$.ROW(sq) &&
			(evaluate.pawn_rank[$$.LIGHT][f+1] < $$.ROW(sq) ))
		r -= evaluate.BACKWARDS_PAWN_PENALTY;
	
	if ((evaluate.pawn_rank[$$.DARK][f - 1] >= $$.ROW(sq)) &&
			(evaluate.pawn_rank[$$.DARK][f] >= $$.ROW(sq)) &&
			(evaluate.pawn_rank[$$.DARK][f + 1] >= $$.ROW(sq)))
		r += (7 - $$.ROW(sq)) * evaluate.PASSED_PAWN_BONUS;
	return r;	
}
evaluate.evaluate_dark_pawn = function(sq) {
	var r,f;
	r = 0;
	f = $$.COL(sq) + 1;
	r += evaluate.pawn_pcsq[evaluate.flip[sq]];
	if (evaluate.pawn_rank[$$.DARK][f] < $$.ROW(sq)) r -= evaluate.DOUBLED_PAWN_PENALTY;

	if (evaluate.pawn_rank[$$.DARK][f-1] == 7 &&
			(evaluate.pawn_rank[$$.DARK][f+1] == 7 ))
		r -= evaluate.ISOLATED_PAWN_PENALTY;
	else if (evaluate.pawn_rank[$$.DARK][f-1] > $$.ROW(sq) &&
			(evaluate.pawn_rank[$$.DARK][f+1] > $$.ROW(sq) ))
		r -= evaluate.BACKWARDS_PAWN_PENALTY;
	
	if ((evaluate.pawn_rank[$$.LIGHT][f - 1] <= $$.ROW(sq)) &&
			(evaluate.pawn_rank[$$.LIGHT][f] <= $$.ROW(sq)) &&
			(evaluate.pawn_rank[$$.LIGHT][f + 1] >= $$.ROW(sq)))
		r += (7 - $$.ROW(sq)) * evaluate.PASSED_PAWN_BONUS;
	return r;	
}
evaluate.evaluate_light_king = function(sq) {
	var evaluate_lkp = function(f) {
		var r = 0;
		if (evaluate.pawn_rank[$$.LIGHT][f] == 6);
		else if (evaluate.pawn_rank[$$.LIGHT][f] == 5)
			r -= 10; 
		else if (evaluate.pawn_rank[$$.LIGHT][f] != 0)
			r -= 20;
		else
			r -= 25;
		if (evaluate.pawn_rank[$$.DARK][f] == 7)
			r -= 15;
		else if (evaluate.pawn_rank[$$.DARK][f] == 5)
			r -= 10;
		else if (evaluate.pawn_rank[$$.DARK][f] == 4)
			r -= 5;
		return r;
	};
	var r,i;
	r = evaluate.king_pcsq[sq];
	if ($$.COL(sq) < 3) {
		r += evaluate_lkp(1);
		r += evaluate_lkp(2);
		r += evaluate_lkp(3) / 2;  
	}
	else if ($$.COL(sq) > 4) {
		r += evaluate_lkp(8);
		r += evaluate_lkp(7);
		r += evaluate_lkp(6) / 2;
	}
	else {
		for (i = $$.COL(sq); i <= $$.COL(sq) + 2; ++i)
			if ((evaluate.pawn_rank[$$.LIGHT][i] == 0) &&
					(evaluate.pawn_rank[$$.DARK][i] == 7))
				r -= 10;
	}
	r *= evaluate.piece_mat[DARK];
	r /= 3100;
	return r;	
}
evaluate.evaluate_dark_king = function(sq){
	var r,i;
	var evaluate_dkp = function(f) {
		var r = 0;
		if (evaluate.pawn_rank[$$.DARK][f] == 1);
		else if (evaluate.pawn_rank[$$.DARK][f] == 2)
			r -= 10;
		else if (evaluate.pawn_rank[$$.DARK][f] != 7)
			r -= 20;
		else
			r -= 25;

		if (evaluate.pawn_rank[$$.LIGHT][f] == 0)
			r -= 15;
		else if (evaluate.pawn_rank[$$.LIGHT][f] == 2)
			r -= 10;
		else if (evaluate.pawn_rank[$$.LIGHT][f] == 3)
			r -= 5;
		return r;

	}
	r = evaluate.king_pcsq[evaluate.flip[sq]];
	if ($$.COL(sq) < 3) {
		r += evaluate_dkp(1);
		r += evaluate_dkp(2);
		r += evaluate_dkp(3) / 2;
	}
	else if ($$.COL(sq) > 4) {
		r += evaluate_dkp(8);
		r += evaluate_dkp(7);
		r += evaluate_dkp(6) / 2;
	}
	else {
		for (i = $$.COL(sq); i <= $$.COL(sq) + 2; ++i)
			if ((evaluate.pawn_rank[$$.LIGHT][i] == 0) &&
					(evaluate.pawn_rank[$$.DARK][i] == 7))
				r -= 10;
	}
	r *= evaluate.piece_mat[$$.LIGHT];
	r /= 3100;
	return r;
}
