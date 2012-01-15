$$ = {};
$$.init_color = [
	1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0];

$$.init_piece = [
	3, 1, 2, 4, 5, 2, 1, 3,
	0, 0, 0, 0, 0, 0, 0, 0,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	3, 1, 2, 4, 5, 2, 1, 3];

$$.color = [];
$$.piece = [];
$$.first_move = [];
$$.DARK=1;
$$.LIGHT=0;
$$.side=null;
$$.xside=null;
$$.castle=null;
$$.ep=null;
$$.hply=null;
$$.ply=null;
$$.nodes=0;
$$.HIST_STACK=400;
$$.PAWN=0;
$$.KNIGHT=1;
$$.BISHOP=2;
$$.ROOK=3;
$$.QUEEN=4;
$$.KING=5;
$$.EMPTY=6;

$$.A1=56;
$$.B1=57;
$$.C1=58;
$$.D1=59;
$$.E1=60;
$$.F1=61;
$$.G1=62;
$$.H1=63;
$$.A8=0;
$$.B8=1;
$$.C8=2;
$$.D8=3;
$$.E8=4;
$$.F8=5;
$$.G8=6;
$$.H8=7;

$$.COL=function(x) {
	return x & 7;
}
$$.ROW=function(x) {
	return x >> 3;
}
/* This is the basic description of a move. promote is what
   piece to promote the pawn to, if the move is a pawn
   promotion. bits is a bitfield that describes the move,
   with the following bits:
   1	capture
   2	castle
   4	en passant capture
   8	pushing a pawn 2 squares
   16	pawn move
   32	promote
*/
$$.RESOLVE_MOVE_TYPE = function(bits) {
	var str = "";
	if (bits & 1) str += "capture|";
	if (bits & 2) str += "castle|";
	if (bits & 4) str += "en passant capture|";
	if (bits & 8) str += "pawn 2 squares|";
	if (bits & 16) str += "pawn move|";
	if (bits & 32) str += "promotion|";
	return str;
}
$$.slide = [false,false,true,true,true,false];
$$.offsets = [0,8,4,4,8,8];
$$.offset = [
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ -21, -19, -12, -8, 8, 12, 19, 21 ],
	[ -11, -9, 9, 11, 0, 0, 0, 0 ],
	[ -10, -1, 1, 10, 0, 0, 0, 0 ],
	[ -11, -10, -9, -1, 1, 9, 10, 11 ],
	[ -11, -10, -9, -1, 1, 9, 10, 11 ]
];

$$.mailbox = [
	 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	 -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
	 -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
	 -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
	 -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
	 -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
	 -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
	 -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
	 -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
	 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

$$.mailbox64 = [
	21, 22, 23, 24, 25, 26, 27, 28,
	31, 32, 33, 34, 35, 36, 37, 38,
	41, 42, 43, 44, 45, 46, 47, 48,
	51, 52, 53, 54, 55, 56, 57, 58,
	61, 62, 63, 64, 65, 66, 67, 68,
	71, 72, 73, 74, 75, 76, 77, 78,
	81, 82, 83, 84, 85, 86, 87, 88,
	91, 92, 93, 94, 95, 96, 97, 98
];
$$.castle_mask = [
	 7, 15, 15, 15,  3, 15, 15, 11,
	15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15,
	13, 15, 15, 15, 12, 15, 15, 14
];
$$.gen_dat = [];
$$.hist_dat = [];
$$.history = [];
for (var i=0;i<64;i++) {
	$$.history[i] = [];
	for (var j=0;j<64;j++) {
		$$.history[i][j] = 0;
	}
}
$$.player_side = null;
$$.max_depth = 4;
$$.MAX_PLY = 32;
$$.pv = [];
for (var i=0;i<$$.MAX_PLY;++i) {
	$$.pv[i] = [];
	for (var j=0;j<$$.MAX_PLY;++j) {
		$$.pv[i][j] = {b:{to: null, from: null}};
	}
}
$$.follow_pv = false;
$$.pv_length = [];
