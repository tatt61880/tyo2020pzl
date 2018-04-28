var num = -1; // ベースとなる多角形の頂点数
var num_prev; // コンソールからnumの値を変更してInitした時にも再読み込みされるように。
var pieceNum;
var sin = [];
var cos = [];
var NextId = [];
var pointSize;

var ColorF_Background = '#FFFFFF';
var ColorF_UnusedPiece = '#E0E0E0';
var ColorS_UnusedPiece = '#BBBBBB';
var ColorF_ProperPiece_Default = '#0080D0';
var ColorF_NormalPiece_Default = '#004080';
var ColorF_ProperPiece = ColorF_ProperPiece_Default;
var ColorF_NormalPiece = ColorF_NormalPiece_Default;
var ColorS_TargetPiece = '#BBBB00';
var ColorF_TargetPiece = 'rgba(255, 255, 0, 0.5)';
var ColorF_Point3 = 'rgba(255, 255, 255, 0.7)';
var ColorS_Point3 = '#FF0000';
var ColorF_Point2 = '#00CC00';
var ColorS_Point2 = '#007700';
var ColorS_Lozenge_Default = '#5599DD';
var ColorS_Lozenge = ColorS_Lozenge_Default;
var ColorF_UnusedPieceIndex_Default = '#000000';
var ColorF_ProperPieceIndex_Default = '#FFFF00';
var ColorF_NormalPieceIndex_Default = '#FFFF00';
var ColorF_UnusedPieceIndex = ColorF_UnusedPieceIndex_Default;
var ColorF_ProperPieceIndex = ColorF_ProperPieceIndex_Default;
var ColorF_NormalPieceIndex = ColorF_NormalPieceIndex_Default;

var dataRedo = "";
var dataCurrent = "";

// for Options
var bTargetTopLeft = false;
var bTargetFront = false;
var bTargetBack = false;
var bTargetOther = false;
var bColoredProperPieces = false;
var bShowPoints = false;
var bShowLozenges = false;
var bShowUnusedPieces = false;
var bShowIndex = false;
var bShowLines = false;
var bShapeEllipse = false;
var bShapeOctagram = false;
var bShapeOctangle = false;
var bShapeEspille1 = false;
var bShapeEspille2 = false;
var bShapeCross1 = false;
var bShapeCross2 = false;
var bShapeFlower1 = false;
var bShapeFlower2 = false;
var bShapeRectS = false;
var bShapeRect = false;
var bShapeRects = false;
var bShapePlus1 = false;
var bShapePlus2 = false;
var bShapeCircle1 = false;
var bShapeCircle2 = false;
var bShapeCircle3 = false;
var bShapeCircle4 = false;
var bShapeCircle5 = false;
var bShapeCircle6 = false;
var bShapeLines = false;
var bShapeLines2 = false;
var bShapeNone = false;
var bShowTweetButton = false;

var redoCount = 0;
var clickCount = 0;
var clickCount_red = 0;
var clickCount_green = 0;
var clickCount_fin = 0;
var clickCount_fin_red = 0;
var clickCount_fin_green = 0;
var completedFlag = false;
var notYetCompletedFlag = true;

var Canvas;
var CanvasTarget;
var CenterX;
var CenterY;
var ctx;
var ctxTarget;

var scale;
var r = [];
var rr = [];
var L = [];
var rects = [];

var rectTypes = [];
var rots = [];
var cxs = [];
var cys = [];
var unusedFlags = [];
var properFlags = [];
var properFlags_target = [];

var pairVertex = [];

// 完成状態用
var target_rectTypes = [];
var target_rots = [];
var target_cxs = [];
var target_cys = [];
var target_unusedFlags = [];

var isSmartPhone = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/);

var myImg = new Image();
var bShapeImage = false;
var blobUrl = "";
// 画像ファイル選択時の処理です。
document.getElementById("myFile").addEventListener( "change", function() {
	bShapeImage = true;
	var file = this.files[0];
	//if(blobUrl != "") URL.revokeObjectURL(blobUrl);
	blobUrl = window.URL.createObjectURL(file) ;
	document.getElementById("myFileImg").innerHTML = '<img style="max-width:100%" src="' + blobUrl + '">' ;
	myImg.src = blobUrl;
	myImg.onload = function() {
		Draw();
	}
	//setTimeout("Draw()", 500)
} ) ;

//document.addEventListener('DOMContentLoaded', function(){
// ↑これだと、完成状態のURLを読み込んだときに「twttr is not defined」となってしまうため、'load'を使います。
window.addEventListener('load', function(){
	var dataLoad = "";
	// analyzing url
	{
		var paravalsStr = location.href.split("?")[1];
		if(paravalsStr == null) paravalsStr = "";
		var paravalsArray = paravalsStr.split("&");
		for(var i = 0, len = paravalsArray.length; i < len; i++) {
			var paraval = (paravalsArray[i]).split("=");
			if(paraval.length == 2){
				if(paraval[0] == "level"){
					num = Number(paraval[1]);
				}else if(paraval[0] == "s"){
					dataLoad = paraval[1];
				}
			}
		}
		if(num == -1) num = 12;
		if(isNaN(num)) num = 12;

		var maxLevel = 70;
		if(num % 2 == 1){
			if(window.confirm("奇数レベルには未対応です。申し訳ありません。\n1つ下のレベル(レベル" + (num - 1) + ")を読み込みます。良いですか？\n(キャンセルするとレベル12を読み込みます。)")){
				num--;
			}else{
				num = 12;
			}
		}else if(num > maxLevel){
			window.alert("※レベル" + maxLevel + "より上のレベルは、フリーズ等の対策のため制限しています。\nご了承ください。");
			num = 12;
		}

		if(num == 6 || num == 12){
			document.getElementById("upperTitle").style.display = "block";
			document.getElementById("lowerTitle").style.display = "none";
		}else{
			document.getElementById("RadioButton_TargetTopLeft").checked = false;
			document.getElementById("RadioButton_TargetFront").checked = false;
			document.getElementById("RadioButton_TargetBack").checked = false;
			document.getElementById("RadioButton_TargetOther").checked = false;
			document.getElementById("target_location").style.display = "none";
			document.getElementById("ColoredProperPieces").style.display = "none";
			document.getElementById("Checkbox_ColoredProperPieces").checked = false;
			document.getElementById("upperTitle").style.display = "none";
			document.getElementById("lowerTitle").style.display = "block";
		}
		//console.log("level = " + num);
		num_prev = num;
		NumChanged();

		document.getElementById('Finish').style.display = "none";
		document.getElementById('RadioButton_ModeEasy').checked = (num == 6);
		document.getElementById('RadioButton_ModeNormal').checked = (num == 12);
		document.getElementById('RadioButton_ModeNormal').checked = (num == 12);
		for( var i = 0; i < select_level.length; ++i){
			select_level.options[i].selected = (select_level.options[i].value == num);
		}
	}
	
	document.getElementById("Button_Redo").style.visibility = "hidden";
	Canvas = document.getElementById("Canvas_Puzzle");
	CanvasTarget = document.getElementById("Canvas_Target");
	Canvas.addEventListener(isSmartPhone ? 'touchstart' : 'click', onClick, false);

	updateTargetLocation();
	updateColordProperPieces();
	updateShowPoints();
	updateShowLogenzes();
	updateShowUnusedPieces();
	updateShowIndex();
	updateShowLines();
	updateShapeType();
	updateShowTweetButton();

	var maxStep = 10000;
	var step = dataLoad.length;
	if(step < maxStep){
		LoadData(dataLoad);
	}else{
		window.alert("読み込もうとしたデータは" + step + "手のデータです。\n処理に時間がかかる可能性があるため、" + maxStep +"手以上のデータは自動では読み込みません。\n読み込みたい場合は、セーブデータからロードしてください。");
		LoadData("");
		document.getElementById("Textarea_Savedata").value = dataLoad;
	}
	SetRedoData();
}, false);

// iOSの場合とそれ以外とで画面回転時を判定するイベントを切り替える
var rotateEvent = navigator.userAgent.match(/(iPhone|iPod|iPad)/) ? 'orientationchange' : 'resize';
window.addEventListener(rotateEvent, onOrientationchange, false);

function InitScale(){
	var clientWidth = 600;
	var clientHeight = 600;
	//var clientWidth = document.documentElement.clientWidth;
	//var clientHeight = document.documentElement.clientHeight;
	var canvasSize = clientWidth < clientHeight ? clientWidth : clientHeight;
	var bodyWidth = document.body.clientWidth;
	if(canvasSize <= 0) canvasSize = 400;
	if(num <= 12 && canvasSize > bodyWidth) canvasSize = bodyWidth;
	Canvas.setAttribute('width', canvasSize);
	Canvas.setAttribute('height', canvasSize);
	//Canvas.style.marginLeft = (bodyWidth - canvasSize) / 2 + "px";
	//Canvas.style.marginRight = (bodyWidth - canvasSize) / 2 + "px";
	CanvasTarget.setAttribute('width', canvasSize);
	CanvasTarget.setAttribute('height', canvasSize);
	CenterX = Canvas.width / 2;
	CenterY = Canvas.height / 2;
	ctx = Canvas.getContext('2d');
	ctxTarget = CanvasTarget.getContext('2d');
	scale = CenterX * 3 / 2 / num;
	pointSize = 10 * scale / 25;
	if(pointSize > 15) pointSize = 15;
	if(pointSize < 4) pointSize = 4;
}

function updateTargetLocation(){
	bTargetTopLeft = document.getElementById("RadioButton_TargetTopLeft").checked;
	bTargetFront = document.getElementById("RadioButton_TargetFront").checked;
	bTargetBack = document.getElementById("RadioButton_TargetBack").checked;
	bTargetOther = document.getElementById("RadioButton_TargetOther").checked;
	document.getElementById("TargetCanvas").style.display = bTargetOther ? "block" : "none";
}

function updateColordProperPieces(){
	bColoredProperPieces = document.getElementById("Checkbox_ColoredProperPieces").checked;
}
function updateShowPoints(){
	bShowPoints = document.getElementById("Checkbox_ShowPoints").checked;
}
function updateShowLogenzes(){
	bShowLozenges = document.getElementById("Checkbox_ShowLozenge").checked;
}
function updateShowUnusedPieces(){
	bShowUnusedPieces = document.getElementById("Checkbox_ShowUnusedPieces").checked;
}
function updateShowIndex(){
	bShowIndex = document.getElementById("Checkbox_ShowIndex").checked;
}
function updateShowLines(){
	bShowLines = document.getElementById("Checkbox_ShowLines").checked;
}
function updateShapeType(){
	bShapeEllipse = document.getElementById("RadioButton_ShapeEllipse").checked;
	bShapeOctagram = document.getElementById("RadioButton_ShapeOctagram").checked;
	bShapeOctangle = document.getElementById("RadioButton_ShapeOctangle").checked;
	bShapeEspille1 = document.getElementById("RadioButton_ShapeEspille1").checked;
	bShapeEspille2 = document.getElementById("RadioButton_ShapeEspille2").checked;
	bShapeCross1 = document.getElementById("RadioButton_ShapeCross1").checked;
	bShapeCross2 = document.getElementById("RadioButton_ShapeCross2").checked;
	bShapeFlower1 = document.getElementById("RadioButton_ShapeFlower1").checked;
	bShapeFlower2 = document.getElementById("RadioButton_ShapeFlower2").checked;
	bShapeRectS = document.getElementById("RadioButton_ShapeRectS").checked;
	bShapeRect = document.getElementById("RadioButton_ShapeRect").checked;
	bShapeRects = document.getElementById("RadioButton_ShapeRects").checked;
	bShapePlus1 = document.getElementById("RadioButton_ShapePlus1").checked;
	bShapePlus2 = document.getElementById("RadioButton_ShapePlus2").checked;
	bShapeCircle1 = document.getElementById("RadioButton_ShapeCircle1").checked;
	bShapeCircle2 = document.getElementById("RadioButton_ShapeCircle2").checked;
	bShapeCircle3 = document.getElementById("RadioButton_ShapeCircle3").checked;
	bShapeCircle4 = document.getElementById("RadioButton_ShapeCircle4").checked;
	bShapeCircle5 = document.getElementById("RadioButton_ShapeCircle5").checked;
	bShapeCircle6 = document.getElementById("RadioButton_ShapeCircle6").checked;
	bShapeLines = document.getElementById("RadioButton_ShapeLines").checked;
	bShapeLines2 = document.getElementById("RadioButton_ShapeLines2").checked;
	bShapeNone = document.getElementById("RadioButton_ShapeNone").checked;
}

function updateShowTweetButton(){
	bShowTweetButton = document.getElementById("Checkbox_ShowTweetButton").checked;
	if(bShowTweetButton){
		AddTweetButton(false);
	}
	document.getElementById("Button_Tweet").style.display = bShowTweetButton ? "inline" : "none";
}

function InitializePairVartex(){
	var piece_vertex_x = [];
	var piece_vertex_y = [];
	for(var idx = 0; idx < pieceNum; idx++){
		var x = rects[rectTypes[idx]].w / 2;
		var y = rects[rectTypes[idx]].h / 2;
		var cx = cxs[idx];
		var cy = cys[idx];
		var rot = rots[idx];
		var c = cos[rot];
		var s = sin[rot];
		var xc = x * c;
		var xs = x * s;
		var yc = y * c;
		var ys = y * s;
		piece_vertex_x[idx] = [cx + xc - ys, cx - xc - ys, cx - xc + ys, cx + xc + ys];
		piece_vertex_y[idx] = [cy + xs + yc, cy - xs + yc, cy - xs - yc, cy + xs - yc];
	}

	for(var i = 0; i < pieceNum * 4; i++){
		pairVertex[i] = -1;
	}

	for(var piece1id = 0; piece1id < pieceNum; piece1id++){
		for(var point1id = 0; point1id < 4; point1id++){
			if(pairVertex[piece1id * 4 + point1id] != -1) continue;
			var point1_x = piece_vertex_x[piece1id][point1id];
			var point1_y = piece_vertex_y[piece1id][point1id];
			for(var piece2id = piece1id + 1; piece2id < pieceNum; piece2id++){
				for(var point2id = 0; point2id < 4; point2id++){
					if(nearlyEqual(point1_x, piece_vertex_x[piece2id][point2id]) && nearlyEqual(point1_y, piece_vertex_y[piece2id][point2id])){
						pairVertex[piece1id * 4 + point1id] = piece2id * 4 + point2id;
						pairVertex[piece2id * 4 + point2id] = piece1id * 4 + point1id;
						//goto
						piece2id = pieceNum;
						break;
					}
				}
			}
		}
	}
}

function InitializeState(){
	var rot_x = CenterX;
	var rot_y_ = (Math.pow(Math.pow(rr[num / 2 - 1], 2.0) - Math.pow(r[0] / 2.0, 2.0), 0.5) + rects[0].h / 2.0) / 2.0;
	var rot_y1 = CenterY + rot_y_;
	var rot_y2 = CenterY - rot_y_;

	for(var j = 0; j < num / 2 - 1; j++){
		for(var i = 0; i < num; i++){
			var index = i * 2 + j % 2;
			var rot = index;
			var cx = r[j] * cos[rot] + CenterX;
			var cy = r[j] * sin[rot] + CenterY;

			var idx = j * num + i;
			rectTypes[idx] = (4 * j < num - 2) ? j : (num / 2 - 2 - j);
			cxs[idx] = cx;
			cys[idx] = cy;
			rots[idx] = (4 * j < num - 2) ? rot : ((rot + num / 2) % (2 * num));
			unusedFlags[idx] = false;
			if(j + 1 < index && index < num - j){ // 下側の小円内のピース
				cxs[idx] = 2 * rot_x - cxs[idx];
				cys[idx] = 2 * rot_y1 - cys[idx];
			}else if(num + j < index && index < 2 * num - j){ // 上側の小円内のピース
				unusedFlags[idx] = true;
				cxs[idx] = 2 * rot_x - cxs[idx];
				cys[idx] = 2 * rot_y2 - cys[idx];
			}
		}
	}
	InitializePairVartex();
	CalcClickPoints(-1);
}

function SetTargetState(){
	var rot1_x = [];
	var rot1_y = [];
	var rot2_x = [];
	var rot2_y = [];

	var rx1 = 0.0;
	var ry1 = (Math.pow(Math.pow(rr[num / 2 - 1], 2.0) - Math.pow(r[0] / 2.0, 2.0), 0.5) + rects[0].h / 2.0) / 2.0;

	var theta;
	for(var i = 0; i < 3; i++){
		theta = i * 2 * num / 3.0;
		rot1_x[i] = CenterX + rx1 * cos[theta] - ry1 * sin[theta];
		rot1_y[i] = CenterY + rx1 * sin[theta] + ry1 * cos[theta];
	}

	var rx2_a = L[num / 6] / 2.0;
	var ry2_a = -Math.pow(Math.pow(rr[num / 6], 2.0) - Math.pow(rx2_a, 2.0), 0.5);
	var rx2_b__ = -rx2_a;
	var ry2_b__ =  ry2_a;

	theta = 2;
	var rx2_b_ = (rx2_b__) * cos[theta] - (ry2_b__) * sin[theta];
	var ry2_b_ = (rx2_b__) * sin[theta] + (ry2_b__) * cos[theta];

	theta = num / 3;
	var cx_b = rot1_x[2] - CenterX;
	var cy_b = rot1_y[2] - CenterY;
	var rx2_b = (rx2_b_ - cx_b) * cos[theta] - (ry2_b_ - cy_b) * sin[theta] + cx_b;
	var ry2_b = (rx2_b_ - cx_b) * sin[theta] + (ry2_b_ - cy_b) * cos[theta] + cy_b;
	var rx2 = (rx2_a + rx2_b) / 2;
	var ry2 = (ry2_a + ry2_b) / 2;
	for(var i = 0; i < 3; i++){
		theta = ((i + 1) * 2 * num / 3) % (2 * num);
		rot2_x[i] = CenterX + rx2 * cos[theta] - ry2 * sin[theta];
		rot2_y[i] = CenterY + rx2 * sin[theta] + ry2 * cos[theta];
	}

	for(var j = 0; j < num / 2 - 1; j++){
		for(var i = 0; i < num; i++){
			var index = i * 2 + j % 2;
			var typeNum = 0;
			var unusedFlag = false;
			if(j + 1 < index && index < j + 1 + num / 6 * 2 && index < num - j){
				typeNum = 1;
			}else if(j + 1 < index - num * 2 / 3 && index - num * 2 / 3 < j + 1 + num / 6 * 2 && index - num * 2 / 3 < num - j){
				typeNum = 2;
			}else if(j + 1 < index - num * 4 / 3 && index - num * 4 / 3 < j + 1 + num / 6 * 2 && index - num * 4 / 3 < num - j){
				typeNum = 3;
			}else if(j + 1 < index && index < num - j){
				typeNum = 1;
				unusedFlag = true;
			}else if(j + 1 < index - num * 2 / 3 && index - num * 2 / 3 < num - j){
				typeNum = 2;
				unusedFlag = true;
			}else if(j + 1 < index - num * 4 / 3 && index - num * 4 / 3 < num - j){
				typeNum = 3;
				unusedFlag = true;
			}else if(j + 1 < index + num * 2 / 3 && index + num * 2 / 3 < num - j){
				typeNum = 1;
				unusedFlag = true;
			}

			var idx = j * num + i;
			var rot = index;
			var cx = r[j] * cos[rot] + CenterX;
			var cy = r[j] * sin[rot] + CenterY;

			var posIdx = typeNum - 1;
			if(typeNum != 0){
				var rot_add = num / 3;
				var cx_old = cx;
				var cy_old = cy;
				cx = (cx_old - rot1_x[posIdx]) * cos[rot_add] - (cy_old - rot1_y[posIdx]) * sin[rot_add] + rot1_x[posIdx];
				cy = (cx_old - rot1_x[posIdx]) * sin[rot_add] + (cy_old - rot1_y[posIdx]) * cos[rot_add] + rot1_y[posIdx];
				rot += rot_add;
			}

			for(var n = 0; n < 3; n ++){
				if(j + 1 < index - num * 2 * n / 3 && index - num * 2 * n / 3 < num / 3 + 1 - j){
					unusedFlag = false;
					var rot_add = num;
					var cx_old = cx;
					var cy_old = cy;
					cx = (cx_old - rot2_x[posIdx]) * cos[rot_add] - (cy_old - rot2_y[posIdx]) * sin[rot_add] + rot2_x[posIdx];
					cy = (cx_old - rot2_x[posIdx]) * sin[rot_add] + (cy_old - rot2_y[posIdx]) * cos[rot_add] + rot2_y[posIdx];
					rot += rot_add;
				}
			}
			rot %= 2 * num;

			target_rectTypes[idx] = (4 * j < num - 2) ? j : (num / 2 - 2 - j);
			target_rots[idx] = (4 * j < num - 2) ? rot : ((rot + num / 2) % (2 * num));
			target_cxs[idx] = cx;
			target_cys[idx] = cy;
			target_unusedFlags[idx] = unusedFlag;
		}
	}
}

document.addEventListener('keydown', function(event){
	if(document.getElementById('savedata_str').style.display != "none" && document.getElementById('savedata_str').style.display != "none") return;
	k = event.keyCode;
	if(k == 37){
		if(document.getElementById("Button_Undo").style.visibility == "visible"){
			onButtonClick_SavedataUndo(event);
		}
	}else if(k == 39){
		if(document.getElementById("Button_Redo").style.visibility == "visible"){
			onButtonClick_SavedataRedo(event);
		}
	}
}, false);

function Init(){
	document.getElementById('Text_clickCount').innerHTML='初期化中…';
	if(num_prev != num){
		num_prev = num;
		NumChanged();
	}
	InitScale();

	{
		clickCount = 0;
		clickCount_red = 0;
		clickCount_green = 0;
		completedFlag = false;
		notYetCompletedFlag = true;
	}

	pieceNum = num * num / 2 - num;
	for(var i = 0; i < pieceNum * 4; i++){
		NextId[i] = (((i & 3) == 3) ? (i - 3) : (i + 1));
	}
	for(var i = 0; i < 2 * num; i++){
		sin[i] = Math.sin(i * Math.PI / num);
		cos[i] = Math.cos(i * Math.PI / num);
	}

	AddTweetButton(false);
	dataCurrent = "";
	document.getElementById("Textarea_Savedata").value = "";
	document.getElementById("Button_Undo").style.visibility = "hidden";

	var points = [];
	for(var i = 0; i < num; i++){
		points[i] = {x: scale * cos[2 * i], y: scale * sin[2 * i]};
	}
	for(var i = 0; i < num / 2; i++){
		var dx = points[0].x - points[i + 1].x;
		var dy = points[0].y - points[i + 1].y;
		L[i] = Math.sqrt(dx * dx + dy * dy);
	}
	for(var i = 0; i < num / 2 - 1; i++){
		rects[i] = {w: L[num / 2 - 2 - i], h: L[i]};
	}
	r[0] = L[num / 2 - 2];
	for(var i = 1; i < num / 2 - 1; i++){
		r[i] = Math.pow(Math.pow(r[i - 1] + rects[i - 1].w / 2.0, 2.0) + Math.pow(rects[i - 1].h / 2.0, 2.0) - Math.pow(rects[i].h / 2.0, 2.0), 0.5) + rects[i].w / 2.0;
	}
	rr[0] = L[num / 2 - 1] / 2.0;
	for(var i = 1; i < num / 2; i++){
		rr[i] = Math.pow(Math.pow(Math.pow(Math.pow(rr[i - 1], 2.0) - Math.pow(rects[i - 1].h / 2.0, 2.0), 0.5) + rects[i - 1].w, 2.0) + Math.pow(rects[i - 1].h / 2.0, 2.0), 0.5);
	}

	InitializeState();
	SetTargetState();
	InitProperFlags();
}

function NumChanged(){
	var paravalsStr = location.href.split("?")[1];
	if(paravalsStr == null) paravalsStr = "";
	var paravalsArray = paravalsStr.split("&");
	var num_url = -1;
	for(var i = 0, len = paravalsArray.length; i < len; i++) {
		var paraval = (paravalsArray[i]).split("=");
		if(paraval.length == 2){
			if(paraval[0] == "level"){
				num_url = Number(paraval[1]);
			}
		}
	}
	if(num_url == -1) num_url = 12;
	if(num_url != num){
		location.search = '?level=' + num;
	}
}

function ShowIndex(idx, cx, cy, unusedFlag, bProperFlag){
	ctx.save();
	if(unusedFlag){
		ctx.fillStyle = ColorF_UnusedPieceIndex;
	}else{
		if(bProperFlag){
			ctx.fillStyle = ColorF_ProperPieceIndex;
		}else{
			ctx.fillStyle = ColorF_NormalPieceIndex;
		}
	}
	ctx.fillText(idx, cx - 4, cy + 4);
	ctx.restore();
}

function DrawPiece(idx){
	var rectType = rectTypes[idx];
	var cx = cxs[idx];
	var cy = cys[idx];
	var rot = rots[idx];
	var unusedFlag = unusedFlags[idx];
	var bProperFlag = bColoredProperPieces && properFlags[idx] != -1;

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(cx, cy);
	ctx.rotate(rot * Math.PI / num);

	if(unusedFlag){
		if(bShowUnusedPieces){
			ctx.fillStyle = ColorF_UnusedPiece;
			ctx.strokeStyle = ColorS_UnusedPiece;
			DrawShape(ctx, rectType, true);
		}
	}else{
		if(bColoredProperPieces && bProperFlag){
			ctx.fillStyle = ctx.strokeStyle = ColorF_ProperPiece;
		}else{
			ctx.fillStyle = ctx.strokeStyle = ColorF_NormalPiece;
		}
		DrawShape(ctx, rectType, false);
	}

	if(bShowLozenges){
		ctx.strokeStyle = ColorS_Lozenge;
		ctx.beginPath();
		ctx.moveTo(0, rects[rectType].h);
		ctx.lineTo(rects[rectType].w, 0);
		ctx.lineTo(0, -rects[rectType].h);
		ctx.lineTo(-rects[rectType].w, 0);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.restore();

	if(bShowIndex){
		ShowIndex(idx, cx, cy, unusedFlag, bProperFlag);
	}
}

function DrawShape(ctx, rectType, strokeOn){
	ctx.save();
	ctx.beginPath();
	var h = rects[rectType].h;
	var w = rects[rectType].w;
	if(bShapeImage){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(-w,  0);
		ctx.lineTo( 0,  h);
		ctx.lineTo( w,  0);
		ctx.lineTo( 0, -h);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(myImg, 0, 0, myImg.width, myImg.height, -w, -h, w * 2, h * 2);
		//ctx.drawImage(myImg, 0, 0, myImg.width, myImg.height, -w / Math.sqrt(2), -h / Math.sqrt(2), w * Math.sqrt(2), h * Math.sqrt(2));
		ctx.restore();
	}else if(bShapeEllipse){
		ctx.scale(1, h / w);
		ctx.arc(0, 0, w / Math.sqrt(2.0), 0, 2*Math.PI, false);
	}else if(bShapeOctagram){
		var h_2 = h / 2;
		var w_2 = w / 2;
		ctx.moveTo(0, h);
		ctx.lineTo(w_2, -h_2);
		ctx.lineTo(-w, 0);
		ctx.lineTo(w_2, h_2);
		ctx.lineTo(0, -h);
		ctx.lineTo(-w_2, h_2);
		ctx.lineTo(w, 0);
		ctx.lineTo(-w_2, -h_2);
		ctx.closePath();
	}else if(bShapeOctangle){
		ctx.moveTo( w * 1/3,  h * 2/3);
		ctx.lineTo( w * 2/3,  h * 1/3);
		ctx.lineTo( w * 2/3, -h * 1/3);
		ctx.lineTo( w * 1/3, -h * 2/3);
		ctx.lineTo(-w * 1/3, -h * 2/3);
		ctx.lineTo(-w * 2/3, -h * 1/3);
		ctx.lineTo(-w * 2/3,  h * 1/3);
		ctx.lineTo(-w * 1/3,  h * 2/3);
		ctx.closePath();
	}else if(bShapeEspille1){
		ctx.scale(1, h / w);
		var r = w / Math.sqrt(2.0);
		var pi_4 = Math.PI / 4;
		ctx.arc( 0,  w, r,  5 * pi_4, 7 * pi_4, false);
		ctx.arc( w,  0, r,  3 * pi_4, 5 * pi_4, false);
		ctx.arc( 0, -w, r,  1 * pi_4, 3 * pi_4, false);
		ctx.arc(-w,  0, r, -1 * pi_4, 1 * pi_4, false);
	}else if(bShapeEspille2){
		ctx.scale(1, h / w);
		var r = w;
		var pi_2 = Math.PI / 2;
		ctx.arc( w,  w, r,  2 * pi_2, 3 * pi_2, false);
		ctx.arc( w, -w, r,  1 * pi_2, 2 * pi_2, false);
		ctx.arc(-w, -w, r,  0 * pi_2, 1 * pi_2, false);
		ctx.arc(-w,  w, r, -1 * pi_2, 0 * pi_2, false);
	}else if(bShapeCross1){
		var w_2 = w / 2;
		var r = w;
		ctx.scale(1, h / w);
		var pi_6 = Math.PI / 6;
		ctx.arc( w_2,  w_2, r,  6 * pi_6,  7 * pi_6, false);
		ctx.arc( w_2, -w_2, r,  5 * pi_6,  6 * pi_6, false);
		ctx.arc(-w_2,  w_2, r,  9 * pi_6, 10 * pi_6, false);
		ctx.arc( w_2,  w_2, r,  8 * pi_6,  9 * pi_6, false);
		ctx.arc(-w_2, -w_2, r,  0 * pi_6,  1 * pi_6, false);
		ctx.arc(-w_2,  w_2, r, 11 * pi_6, 12 * pi_6, false);
		ctx.arc( w_2, -w_2, r,  3 * pi_6,  4 * pi_6, false);
		ctx.arc(-w_2, -w_2, r,  2 * pi_6,  3 * pi_6, false);
	}else if(bShapeCross2){
		var r = w * Math.sqrt(2.0);
		ctx.scale(1, h / w);
		var pi_12 = Math.PI / 12;
		ctx.arc( 0,  w, r, 15 * pi_12, 17 * pi_12, false);
		ctx.arc( w,  0, r, 13 * pi_12, 15 * pi_12, false);
		ctx.arc(-w,  0, r, 21 * pi_12, 23 * pi_12, false);
		ctx.arc( 0,  w, r, 19 * pi_12, 21 * pi_12, false);
		ctx.arc( 0, -w, r,  3 * pi_12,  5 * pi_12, false);
		ctx.arc(-w,  0, r, 25 * pi_12, 27 * pi_12, false);
		ctx.arc( w,  0, r,  9 * pi_12, 11 * pi_12, false);
		ctx.arc( 0, -w, r,  7 * pi_12,  9 * pi_12, false);
	}else if(bShapeFlower1){
		var w_2 = w / 2;
		var r = w_2;
		ctx.scale(1, h / w);
		var pi_2 = Math.PI / 2;
		ctx.arc(   0,  w_2, r, 2 * pi_2, 4 * pi_2, false);
		ctx.arc( w_2,    0, r, 1 * pi_2, 3 * pi_2, false);
		ctx.arc(   0, -w_2, r, 0 * pi_2, 2 * pi_2, false);
		ctx.arc(-w_2,    0, r, 3 * pi_2, 1 * pi_2, false);
	}else if(bShapeFlower2){
		var w_2 = w / 2;
		var r = w_2 * Math.sqrt(2.0);
		ctx.scale(1, h / w);
		var pi_4 = Math.PI / 4;
		ctx.arc( w_2,  w_2, r, 3 * pi_4, 7 * pi_4, false);
		ctx.arc( w_2, -w_2, r, 1 * pi_4, 5 * pi_4, false);
		ctx.arc(-w_2, -w_2, r, 7 * pi_4, 3 * pi_4, false);
		ctx.arc(-w_2,  w_2, r, 5 * pi_4, 1 * pi_4, false);
	}else if(bShapeRectS){
		var rate = 0.5;
		ctx.moveTo(0, h * rate);
		ctx.lineTo(w * rate, 0);
		ctx.lineTo(0, -h * rate);
		ctx.lineTo(-w * rate, 0);
		ctx.closePath();
	}else if(bShapeRect){
		var rate = 0.9;
		ctx.moveTo(0, h * rate);
		ctx.lineTo(w * rate, 0);
		ctx.lineTo(0, -h * rate);
		ctx.lineTo(-w * rate, 0);
		ctx.closePath();
	}else if(bShapeRects){
		var paddingRate = 0.1;
		var w_2 = w / 2;
		var h_2 = h / 2;

		{
			ctx.beginPath();
			ctx.moveTo(0, h * (1 - paddingRate));
			ctx.lineTo(w_2 * (1 - paddingRate * 2), h_2);
			ctx.lineTo(0, h * paddingRate);
			ctx.lineTo(-w_2 * (1 - paddingRate * 2), h_2);
			ctx.closePath();
		}
		ctx.fill();
		{
			ctx.beginPath();
			ctx.moveTo(w_2,  h_2 * (1 - paddingRate * 2));
			ctx.lineTo(w * (1 - paddingRate), 0);
			ctx.lineTo(w_2, -h_2 * (1 - paddingRate * 2));
			ctx.lineTo(w * paddingRate, 0);
			ctx.closePath();
		}
		ctx.fill();
		{
			ctx.beginPath();
			ctx.moveTo(0, -h * (1 - paddingRate));
			ctx.lineTo(w_2 * (1 - paddingRate * 2), -h_2);
			ctx.lineTo(0, -h * paddingRate);
			ctx.lineTo(-w_2 * (1 - paddingRate * 2), -h_2);
			ctx.closePath();
		}
		ctx.fill();
		{
			ctx.beginPath();
			ctx.moveTo(-w_2,  h_2 * (1 - paddingRate * 2));
			ctx.lineTo(-w * (1 - paddingRate), 0);
			ctx.lineTo(-w_2, -h_2 * (1 - paddingRate * 2));
			ctx.lineTo(-w * paddingRate, 0);
			ctx.closePath();
		}
		ctx.fill();
		if(strokeOn){
			// TODO 暫定的にコピペで実装しているのをまともなコードに修正する。
			{
				ctx.beginPath();
				ctx.moveTo(0, h * (1 - paddingRate));
				ctx.lineTo(w_2 * (1 - paddingRate * 2), h_2);
				ctx.lineTo(0, h * paddingRate);
				ctx.lineTo(-w_2 * (1 - paddingRate * 2), h_2);
				ctx.closePath();
			}
			ctx.stroke();
			{
				ctx.beginPath();
				ctx.moveTo(w_2,  h_2 * (1 - paddingRate * 2));
				ctx.lineTo(w * (1 - paddingRate), 0);
				ctx.lineTo(w_2, -h_2 * (1 - paddingRate * 2));
				ctx.lineTo(w * paddingRate, 0);
				ctx.closePath();
			}
			ctx.stroke();
			{
				ctx.beginPath();
				ctx.moveTo(0, -h * (1 - paddingRate));
				ctx.lineTo(w_2 * (1 - paddingRate * 2), -h_2);
				ctx.lineTo(0, -h * paddingRate);
				ctx.lineTo(-w_2 * (1 - paddingRate * 2), -h_2);
				ctx.closePath();
			}
			ctx.stroke();
			{
				ctx.beginPath();
				ctx.moveTo(-w_2,  h_2 * (1 - paddingRate * 2));
				ctx.lineTo(-w * (1 - paddingRate), 0);
				ctx.lineTo(-w_2, -h_2 * (1 - paddingRate * 2));
				ctx.lineTo(-w * paddingRate, 0);
				ctx.closePath();
			}
			ctx.stroke();
		}
	}else if(bShapePlus1){
		var widthRate = 0.1;
		var w_2 = w / 2;
		var h_2 = h / 2;
		var rate = 1 - widthRate;
		ctx.moveTo( w_2 * (1 - widthRate),  h_2 * (1 + widthRate));
		ctx.lineTo( w_2 * (1 + widthRate),  h_2 * (1 - widthRate));
		ctx.lineTo(w * widthRate, 0);
		ctx.lineTo( w_2 * (1 + widthRate), -h_2 * (1 - widthRate));
		ctx.lineTo( w_2 * (1 - widthRate), -h_2 * (1 + widthRate));
		ctx.lineTo(0, -h * widthRate);
		ctx.lineTo(-w_2 * (1 - widthRate), -h_2 * (1 + widthRate));
		ctx.lineTo(-w_2 * (1 + widthRate), -h_2 * (1 - widthRate));
		ctx.lineTo(-w * widthRate, 0);
		ctx.lineTo(-w_2 * (1 + widthRate),  h_2 * (1 - widthRate));
		ctx.lineTo(-w_2 * (1 - widthRate),  h_2 * (1 + widthRate));
		ctx.lineTo(0, h * widthRate);
		ctx.closePath();
	}else if(bShapePlus2){
		var widthRate = 0.1 / Math.sqrt(2.0);
		var w_2 = w / 2;
		var h_2 = h / 2;
		var rate = 1 - widthRate;
		ctx.moveTo(-w * widthRate,  h * (1 - widthRate));
		ctx.lineTo( w * widthRate,  h * (1 - widthRate));
		ctx.lineTo( w * widthRate,  h * widthRate);
		ctx.lineTo( w * (1 - widthRate),  h * widthRate);
		ctx.lineTo( w * (1 - widthRate), -h * widthRate);
		ctx.lineTo( w * widthRate, -h * widthRate);
		ctx.lineTo( w * widthRate, -h * (1 - widthRate));
		ctx.lineTo(-w * widthRate, -h * (1 - widthRate));
		ctx.lineTo(-w * widthRate, -h * widthRate);
		ctx.lineTo(-w * (1 - widthRate), -h * widthRate);
		ctx.lineTo(-w * (1 - widthRate),  h * widthRate);
		ctx.lineTo(-w * widthRate,  h * widthRate);
		ctx.closePath();
	}else if(bShapeCircle1){
		ctx.arc( 0, 0, 0.5 * h, 0, 2 * Math.PI, false);
	}else if(bShapeCircle2){
		ctx.arc( 0, 0, w * h / Math.sqrt(w * w + h * h), 0, 2 * Math.PI, false);
	}else if(bShapeCircle3){
		h = rects[0].h;
		ctx.arc( 0, 0, 0.5 * h, 0, 2 * Math.PI, false);
	}else if(bShapeCircle4){
		h = rects[0].h;
		w = rects[0].w;
		ctx.arc( 0, 0, w * h / Math.sqrt(w * w + h * h), 0, 2 * Math.PI, false);
	}else if(bShapeCircle5){
		ctx.arc( 0, 0, h, 0, 2 * Math.PI, false);
	}else if(bShapeCircle6){
		ctx.arc( 0, 0, w, 0, 2 * Math.PI, false);
	}else if(bShapeLines){
		var widthRate = 0.25;
		var rate = 1 - widthRate;
		ctx.beginPath();
		ctx.moveTo(-w * rate,  -h * widthRate);
		ctx.lineTo(-w,          0);
		ctx.lineTo(-w * rate,   h * widthRate);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(-w * widthRate,  h * rate);
		ctx.lineTo( 0,              h);
		ctx.lineTo( w * widthRate,  h * rate);
		ctx.lineTo( w * widthRate, -h * rate);
		ctx.lineTo( 0,             -h);
		ctx.lineTo(-w * widthRate, -h * rate);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(w * rate,  -h * widthRate);
		ctx.lineTo(w,          0);
		ctx.lineTo(w * rate,   h * widthRate);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();

	}else if(bShapeLines2){
		var widthRate = 0.25;
		var rate = 1 - widthRate;
		ctx.beginPath();
		ctx.moveTo(-w * rate,  -h * widthRate);
		ctx.lineTo(-w * rate,   h * widthRate);
		ctx.lineTo(-w * widthRate,  h * rate);
		ctx.lineTo(-w * widthRate, -h * rate);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(w * rate,  -h * widthRate);
		ctx.lineTo(w * rate,   h * widthRate);
		ctx.lineTo(w * widthRate,  h * rate);
		ctx.lineTo(w * widthRate, -h * rate);
		ctx.closePath();
		ctx.fill();
/*
		ctx.beginPath();
		ctx.moveTo(-w * rate,  -h * widthRate);
		ctx.quadraticCurveTo(-w * rate + widthRate * h ^ 2 / w, 0, -w * rate,   h * widthRate);
		ctx.lineTo(-w * widthRate,  h * rate);
		ctx.quadraticCurveTo(-w * widthRate + rate * h ^ 2 / w, 0, -w * widthRate, -h * rate);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(w * rate,  -h * widthRate);
		ctx.lineTo(w * rate,   h * widthRate);
		ctx.lineTo(w * widthRate,  h * rate);
		ctx.lineTo(w * widthRate, -h * rate);
		ctx.closePath();
		ctx.fill();
*/

		ctx.beginPath();

	}else if(bShapeNone){
	}else{
		ctx.rect(-w / 2, -h / 2, w, h);
	}

	if(!bShapeRects && !bShapeImage){
		if(bShapeCircle5 || bShapeCircle6){
			ctx.stroke();
		}else{
			ctx.fill();
			if(strokeOn) ctx.stroke();
		}
	}
	ctx.restore();
}

function DrawTarget(ctx, smallSize, normalColor){
	ctx.save();
	if(!normalColor){
		ctx.strokeStyle = ColorS_TargetPiece;
		ctx.fillStyle = ColorF_TargetPiece;
	}
	for(var idx = 0; idx < pieceNum; idx++){
		if(target_unusedFlags[idx]) continue;
		var rectType = target_rectTypes[idx];
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		if(smallSize) ctx.scale(0.19, 0.19);
		if(normalColor){
			if(bColoredProperPieces && properFlags_target[idx] != -1){
				ctx.fillStyle = ctx.strokeStyle = ColorF_ProperPiece;
			}else{
				ctx.fillStyle = ctx.strokeStyle = ColorF_NormalPiece;
			}
		}
		ctx.translate(target_cxs[idx], target_cys[idx]);
		ctx.rotate(target_rots[idx] * Math.PI / num);
		DrawShape(ctx, rectType, !normalColor);
	}
	ctx.restore();
}

function DrawPoints(){
	ctx.save();
	for(var i = 0; i < pointNum; i++){
		var px = clickPoints[i].px;
		var py = clickPoints[i].py;
		if(clickPoints[i].trio){
			ctx.fillStyle = ColorF_Point3;
			ctx.strokeStyle = ColorS_Point3;
		}else{
			ctx.fillStyle = ColorF_Point2;
			ctx.strokeStyle = ColorS_Point2;
		}
		ctx.beginPath();
		ctx.rect(px - pointSize / 2, py - pointSize / 2, pointSize, pointSize);
		ctx.fill();
		ctx.stroke();
	}
	ctx.restore();
}

function DrawCircle(x, y, rotStart, rotEnd, strokeStyle){
	ctx.save();

	var radius = CenterX / 20.0;
	x *= radius;
	y *= radius;

	ctx.beginPath();
	ctx.arc(x, y, radius, rotStart, rotEnd, false);

	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = radius / 3.0;
	ctx.stroke();

	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = radius / 4.0;
	ctx.stroke();

	ctx.restore();
}

function DrawCongratulations(){
	ctx.save();

	ctx.font = "bold 14px sans-serif";
	ctx.translate(5, 15);
	ctx.fillStyle = "#FF0000";
	ctx.fillText("Congratulations!", 0, 0);

	ctx.fillStyle = "#004080";
	ctx.fillText("TOKYO 2020", 0, 16);
	ctx.restore();

	ctx.save();
	ctx.translate(-3, 45);
	DrawCircle(2 +  0/60, 0,  Math.PI * 0.00, Math.PI * 2.00, "#0000FF");
	DrawCircle(3 + 12/60, 1, -Math.PI * 0.50, Math.PI * 1.40, "#FFAA00");
	DrawCircle(4 + 24/60, 0, -Math.PI * 0.95, Math.PI * 0.95, "#000000");
	DrawCircle(5 + 36/60, 1, -Math.PI * 0.50, Math.PI * 1.40, "#008000");
	DrawCircle(6 + 48/60, 0, -Math.PI * 0.95, Math.PI * 0.95, "#FF0000");
	ctx.restore();
}

function DrawLines(){
	ctx.save();
	ctx.strokeStyle = "#FF80FF";
	for(var i = 0; i < pieceNum * 4; i++){
		var j = pairVertex[i];
		if(j == -1) continue;
		var idx_i = Math.floor(i / 4);
		var idx_j = Math.floor(j / 4);
		ctx.beginPath();
		ctx.moveTo(cxs[idx_i], cys[idx_i]);
		ctx.lineTo(cxs[idx_j], cys[idx_j]);
		ctx.stroke();
	}
	ctx.restore();
}

function Draw(){
	document.getElementById('Text_clickCount').innerHTML="現在"+clickCount+"手目です。 (赤" + clickCount_red + ", 緑" + clickCount_green + ")";
	ctx.fillStyle = ColorF_Background;
	ctx.fillRect(0, 0, Canvas.width, Canvas.height);
	ctxTarget.fillStyle = ColorF_Background;
	ctxTarget.fillRect(0, 0, CanvasTarget.width, CanvasTarget.height);

	if(bTargetTopLeft && !completedFlag){
		DrawTarget(ctx, true, true);
	}else if(bTargetOther){
		DrawTarget(ctxTarget, false, true);
	}else if(bTargetBack){
		DrawTarget(ctx, false, false);
	}
	for(var i = 0; i < pieceNum; i++){
		DrawPiece(i, false);
	}
	if(bTargetFront){
		DrawTarget(ctx, false, false);
	}

	if(bShowPoints){
		DrawPoints();
	}
	if(bShowLines){
		DrawLines();
	}

	if(completedFlag){
		DrawCongratulations();
	}
}

var eps = 0.001;
function nearlyEqual(a, b)
{
	return (Math.abs(a - b) < eps);
}

function nearlyEqual_forRot(a, b, n)
{
	return Math.abs(a - b) % (2 * num / n) == 0;
}

var pointNum;
var clickPoints;
// 次にクリックするID(clickID)がわかっている場合(セーブデータを読み込む場合など)は、計算を途中で打ち切ります。
// そうでない場合は、引数に-1を入れて使用します。
function CalcClickPoints(clickID){
	clickPoints = [];

	var piece_vertex_x = [];
	var piece_vertex_y = [];
	for(var idx = 0; idx < pieceNum; idx++){
		var x = rects[rectTypes[idx]].w / 2;
		var y = rects[rectTypes[idx]].h / 2;
		var cx = cxs[idx];
		var cy = cys[idx];
		var rot = rots[idx];
		var c = cos[rot];
		var s = sin[rot];
		var xc = x * c;
		var xs = x * s;
		var yc = y * c;
		var ys = y * s;
		piece_vertex_x[idx] = [cx + xc - ys, cx - xc - ys, cx - xc + ys, cx + xc + ys];
		piece_vertex_y[idx] = [cy + xs + yc, cy - xs + yc, cy - xs - yc, cy + xs - yc];
	}
	pointNum = 0;
	for(var p11 = 0; p11 < pieceNum * 4; p11++){
		var piece1id = Math.floor(p11 / 4);
		var point1id = (p11 & 3);
		var point1_x = piece_vertex_x[piece1id][point1id];
		var point1_y = piece_vertex_y[piece1id][point1id];

		var p12 = NextId[p11];
		var p21 = pairVertex[p12];
		if(p21 == -1) continue;
		var piece2id = Math.floor(p21 / 4);
		if(piece1id > piece2id) continue;
		var point2id = (p21 & 3);
		var point2_x = piece_vertex_x[piece2id][point2id];
		var point2_y = piece_vertex_y[piece2id][point2id];
		// for swapping 2 objects; (ペア)
		if(unusedFlags[piece1id] != unusedFlags[piece2id]
				&& rectTypes[piece1id] == rectTypes[piece2id]
				&& nearlyEqual_forRot(rots[piece1id], rots[piece2id], (rectTypes[piece1id] + 1) * 4 == num ? 4 : 2)
		  ){
			if(clickID == -1 || pointNum == clickID){
				clickPoints[pointNum] = {px: point2_x, py: point2_y, id1: p12, id2: p21, trio: false};
				if(clickID != -1){
					return;
				}
			}
			pointNum++;
			continue; // ペアになっている時、その2つ+1つの3つでトリオになることはあり得ません。
		}

		var p31 = pairVertex[NextId[p21]];
		if(p31 == -1) continue;
		var piece3id = Math.floor(p31 / 4);
		if(piece1id > piece3id) continue;
		var point3id = (p31 & 3);
		var point3_x = piece_vertex_x[piece3id][point3id];
		var point3_y = piece_vertex_y[piece3id][point3id];

		if(pairVertex[NextId[p31]] == p11){
			if(clickID == -1 || pointNum == clickID){
				// for swapping 3 objects; (トリオ)
				var px = ((cxs[piece1id] + cxs[piece2id] + cxs[piece3id]) * 2 - (point1_x + point2_x + point3_x)) / 3;
				var py = ((cys[piece1id] + cys[piece2id] + cys[piece3id]) * 2 - (point1_y + point2_y + point3_y)) / 3;
				clickPoints[pointNum] = {px: px, py: py, id1: p11, id2: p21, id3: p31, trio: true};
				if(clickID != -1){
					return;
				}
			}
			pointNum++;
		}
	}
}

function onOrientationchange(){
	if(Canvas == null) return;
	InitScale();
	LoadData(dataCurrent);
}

function PieceMatchCheck(targetId, pieceId){
	return (target_rectTypes[targetId] == rectTypes[pieceId]
				&& nearlyEqual(target_cxs[targetId], cxs[pieceId])
				&& nearlyEqual(target_cys[targetId], cys[pieceId])
				&& nearlyEqual_forRot(target_rots[targetId], rots[pieceId], (rectTypes[targetId] + 1) * 4 == num ? 4 : 2));
}

function UpdateProperFlags(pieceId){
	properFlags[pieceId] = -1;
	if(unusedFlags[pieceId]) return;
	for(var targetId = 0; targetId < pieceNum; targetId++){
		if(target_unusedFlags[targetId]) continue;
		if(PieceMatchCheck(targetId, pieceId)){
			properFlags[pieceId] = targetId;
			properFlags_target[targetId] = pieceId;
			return;
		}
	}
}
function InitProperFlags(){
	for(var i = 0; i < pieceNum; i++){
		properFlags[i] = -1;
		properFlags_target[i] = -1;
	}
	for(var pieceId = 0; pieceId < pieceNum; pieceId++){
		UpdateProperFlags(pieceId);
	}
}
function isFinished(){
	for(var targetId = 0; targetId < pieceNum; targetId++){
		if(target_unusedFlags[targetId]) continue;
		if(properFlags_target[targetId] == -1) return false;
	}
	return true;
}

function AddTweetButton(finished){
	if(!finished && !bShowTweetButton) return;
	var buttonID = finished ? "Button_Tweet2" : "Button_Tweet";
	var d = document.getElementById(buttonID);
	while(d.firstChild != null){
		d.removeChild(d.firstChild);
	}

	var ele = document.createElement("a");
	ele.setAttribute("href", "https://twitter.com/share");
	ele.setAttribute("class", "twitter-share-button");
	var title = "";
	if(num == 12){
		title = "「東京オリンピック・エンブレム・パズル」";
	}else if(num == 6){
		title = "「東京オリンピック・エンブレム・パズル(イージーモード)」";
	}else{
		title = "「東京オリンピック・エンブレム・パズル(" + num + "角形ベース)」";
	}
	if(finished){
		ele.setAttribute("data-text", title + "を" + clickCount + "手(赤" + clickCount_red + ", 緑" + clickCount_green + ")で解きました！");
	}else{
		if(clickCount == 0){
			ele.setAttribute("data-text", "今から、" + title + "に挑戦します！");
		}else{
			ele.setAttribute("data-text", title + "に挑戦中！ 現在" + clickCount + "手目(赤" + clickCount_red + ", 緑" + clickCount_green + ")");
		}
	}
	var buf = location.href;
	var question_mark_pos = buf.search('\\?');
	if(question_mark_pos != -1){
		buf = buf.substr(0, question_mark_pos);
	}
	ele.setAttribute("data-url", buf + '?level=' + num + (dataCurrent == '' ? '' : '&s=' + dataCurrent));
	ele.setAttribute("data-via", "tatt61880");
	ele.setAttribute("data-hashtags", "tyo2020pzl");
	var str = document.createTextNode("Tweet");
	ele.appendChild(str);
	d.appendChild(ele);

	twttr.widgets.load();
}

function ItoA(n){
	var c;
	if(n < 10){
		c = n;
	}else if(n < 36){
		c = String.fromCharCode(n - 10 + 65); // A-Z
	}else if(n < 36 + 26){
		c = String.fromCharCode(n - 36 + 97); // a-z
	}else{
		c = '(' + n + ')';
	}
	return c;
}

function UpdateSavedata(clickID){
	var c = ItoA(clickID);
	dataCurrent += c;
	document.getElementById("Textarea_Savedata").value = dataCurrent;
}

function MovePieces(clickID){
	clickCount++;
	UpdateSavedata(clickID);
	document.getElementById("Button_Undo").style.visibility = "visible";

	function f(iId, oId){
		var po = pairVertex[oId];
		if(po != -1) pairVertex[po] = iId;
		pairVertex[iId] = po;
	}
	function g(aId, bId){
		if(aId != -1) pairVertex[aId] = bId;
		if(bId != -1) pairVertex[bId] = aId;
	}
	if(clickPoints[clickID].trio){
		clickCount_red++;
		var px = clickPoints[clickID].px;
		var py = clickPoints[clickID].py;
		var piece1id = Math.floor(clickPoints[clickID].id1 / 4);
		var piece2id = Math.floor(clickPoints[clickID].id2 / 4);
		var piece3id = Math.floor(clickPoints[clickID].id3 / 4);

		cxs[piece1id] = 2 * px - cxs[piece1id];
		cys[piece1id] = 2 * py - cys[piece1id];
		cxs[piece2id] = 2 * px - cxs[piece2id];
		cys[piece2id] = 2 * py - cys[piece2id];
		cxs[piece3id] = 2 * px - cxs[piece3id];
		cys[piece3id] = 2 * py - cys[piece3id];
		if(properFlags[piece1id] != -1) properFlags_target[properFlags[piece1id]] = -1;
		if(properFlags[piece2id] != -1) properFlags_target[properFlags[piece2id]] = -1;
		if(properFlags[piece3id] != -1) properFlags_target[properFlags[piece3id]] = -1;
		UpdateProperFlags(piece1id);
		UpdateProperFlags(piece2id);
		UpdateProperFlags(piece3id);

		var p11 = clickPoints[clickID].id1;
		var p12 = NextId[p11];
		var p13 = NextId[p12];
		var p14 = NextId[p13];
		var p21 = clickPoints[clickID].id2;
		var p22 = NextId[p21];
		var p23 = NextId[p22];
		var p24 = NextId[p23];
		var p31 = clickPoints[clickID].id3;
		var p32 = NextId[p31];
		var p33 = NextId[p32];
		var p34 = NextId[p33];

		f(p11, p34);
		f(p12, p23);
		f(p21, p14);
		f(p22, p33);
		f(p31, p24);
		f(p32, p13);
		g(p13, p34);
		g(p23, p14);
		g(p33, p24);
	}else{
		clickCount_green++;
		var piece1id = Math.floor(clickPoints[clickID].id1 / 4);
		var piece2id = Math.floor(clickPoints[clickID].id2 / 4);
		cxs[piece1id] = [cxs[piece2id], cxs[piece2id] = cxs[piece1id]][0];
		cys[piece1id] = [cys[piece2id], cys[piece2id] = cys[piece1id]][0];
		if(properFlags[piece1id] != -1) properFlags_target[properFlags[piece1id]] = -1;
		if(properFlags[piece2id] != -1) properFlags_target[properFlags[piece2id]] = -1;
		UpdateProperFlags(piece1id);
		UpdateProperFlags(piece2id);

		var p11 = clickPoints[clickID].id1;
		var p12 = NextId[p11];
		var p13 = NextId[p12];
		var p14 = NextId[p13];
		var p21 = clickPoints[clickID].id2;
		var p22 = NextId[p21];
		var p23 = NextId[p22];
		var p24 = NextId[p23];

		var pp11 = pairVertex[p11];
		var pp12 = pairVertex[p12];
		var pp13 = pairVertex[p13];
		var pp14 = pairVertex[p14];
		var pp21 = pairVertex[p21];
		var pp22 = pairVertex[p22];
		var pp23 = pairVertex[p23];
		var pp24 = pairVertex[p24];

		g(p11, pp23);
		g(p12, pp24);
		g(p14, pp22);
		g(p21, pp13);
		g(p22, pp14);
		g(p24, pp12);
		g(p13, p23);
	}

	completedFlag = false;
	if(isFinished()){
		completedFlag = true;
		if(notYetCompletedFlag){
			document.getElementById('Finish').style.display = "block";
			notYetCompletedFlag = false;
			document.getElementById('Text_finishCount').innerHTML=clickCount+"手目に完成！！ (赤" + clickCount_red + ", 緑" + clickCount_green + ")";
			// 完成後のUndoやRedo時に毎回は更新しないようにする。
			if(clickCount != clickCount_fin || clickCount_red != clickCount_fin_red || clickCount_green != clickCount_fin_green){
				clickCount_fin = clickCount;
				clickCount_fin_red = clickCount_red;
				clickCount_fin_green = clickCount_green;
				AddTweetButton(true);
			}
		}
	}
}

function onClick(e){
	var x, y;
	var BcRect = Canvas.getBoundingClientRect();
	if(isSmartPhone){
		x = e.touches[0].clientX - BcRect.left;
		y = e.touches[0].clientY - BcRect.top;
	}else{
		x = e.clientX - BcRect.left;
		y = e.clientY - BcRect.top;
	}

	var minDistance = 1000;
	var clickID = -1;
	for(var i = 0; i < pointNum; i++){
		var px = clickPoints[i].px;
		var py = clickPoints[i].py;
		if(Math.abs(px - x) < 3 * pointSize &&
		   Math.abs(py - y) < 3 * pointSize){
			var distance = Math.abs(x - px) + Math.abs(y - py);
			if(distance < minDistance){ // 条件を満たす点が複数ある場合の対策。一番クリックした位置に近いものを選択します。
				minDistance = distance;
				clickID = i;
			}
		}
	}

	if(clickID != -1){
		MovePieces(clickID);
		CalcClickPoints(-1);
		Draw();
		AddTweetButton(false);
		SetRedoData();
	}
}

function RandomMove(){
	var clickID = Math.floor(Math.random() * clickPoints.length);
	MovePieces(clickID);
	CalcClickPoints(-1);
	Draw();
	AddTweetButton(false);
	SetRedoData();
}

var timerRandom;
var bRandomInterval = false;
var elem_rangeRandom = document.getElementById('RangeRandom');
function onButtonClick_RandomInterval(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	if(!bRandomInterval){
		bRandomInterval = true;
		var randomSpeed = Number(elem_rangeRandom.value);
		timerRandom = setInterval("RandomMove()", randomSpeed);
	}
}
function onButtonClick_RandomIntervalStop(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	bRandomInterval = false;
	clearInterval(timerRandom);
}
function oninput_Range(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。

	if(bRandomInterval){
		clearInterval(timerRandom);
		var randomSpeed = Number(elem_rangeRandom.value);
		timerRandom = setInterval("RandomMove()", randomSpeed);
	}
}

function onButtonClick_Random(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	RandomMove();
}

function LoadData(dataStr){
	Init();
	var calculatedFlag = true;
	for(var i = 0 ; i < dataStr.length; i++){
		var code = dataStr.charCodeAt(i);
		var clickID = 0;
		if(48 <= code && code <= 57){ // 0-9
			clickID = code - 48;
		}else if(65 <= code && code <= 90){ // A-Z
			clickID = code - 65 + 10;
		}else if(97 <= code && code <= 122){ // a-z
			clickID = code - 97 + 36;
		}else if(dataStr.charAt(i) == '('){
			while(i != dataStr.length - 1 && dataStr.charAt(++i) != ')'){
				clickID *= 10;
				clickID += dataStr.charCodeAt(i) - 48;
			}
		}else if(dataStr.charAt(i) == '.'){
			CalcClickPoints(-1);
			calculatedFlag = true;
			clickID = Math.floor(Math.random() * clickPoints.length);
		}else if(dataStr.charAt(i) == '\n' || dataStr.charAt(i) == '\r' || dataStr.charAt(i) == '\t' || dataStr.charAt(i) == ' '){
			continue;
		}else{
			window.alert((i+1) + '文字目(' + dataStr.charAt(i) + ')が想定外です。');
			break;
		}

		if(calculatedFlag){
			calculatedFlag = false;
		}else{
			CalcClickPoints(clickID);
		}
		if(clickPoints[clickID] == null){
			window.alert((i+1) + '文字目(' + dataStr.charAt(i) + ')が不正です。\n※2016/05/18以前のセーブデータの取り扱いに関しては作者@tatt61880に訪ねてください。');
			break;
		}
		MovePieces(clickID);
	}
	CalcClickPoints(-1);
	Draw();
	AddTweetButton(false);
}

function SetRedoData(){
	dataRedo = dataCurrent;
	redoCount = clickCount;
	document.getElementById("Button_Redo").style.visibility = "hidden";
}

// ======================================================================
// セーブデータ
function onButtonClick_SavedataLoad(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	var dataStr = document.getElementById("Textarea_Savedata").value;
	console.time('LoadTimer');
	LoadData(dataStr);
	SetRedoData();
	console.timeEnd('LoadTimer');
}

function onButtonClick_SavedataUndo(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	var dataStr = dataCurrent;
	if(dataStr.length == 0){
		window.alert("0手目です。Undoできません。");
	}else{
		var len = dataStr.length - 1;
		if(dataStr[len] == ')'){
			while(!(dataStr[len] == '(' || len == 0)){
				len--;
			}
		}
		LoadData(dataStr.substr(0, len));
		document.getElementById("Button_Redo").style.visibility = "visible";
	}
}

function onButtonClick_SavedataRedo(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	if(dataRedo.indexOf("(") == -1){
		if(dataRedo.length <= clickCount){
			window.alert("これ以上Redoできません。");
		}else{
			LoadData(dataRedo.substr(0, clickCount + 1));
		}
	}else{
		var len = 0;
		var count = 0;
		while(count++ != clickCount + 1){
			if(len > dataRedo.length){
				window.alert("これ以上Redoできません。");
				return;
			}
			if(dataRedo[len] == '('){
				while(len != dataRedo.length - 1 && dataRedo[++len] != ')'){
				}
			}
			len++;
		}
		LoadData(dataRedo.substr(0, len));
	}

	if(redoCount == clickCount){
		document.getElementById("Button_Redo").style.visibility = "hidden";
	}
}

// ======================================================================
// オプション
function onRadioButtonChange_Target(){
	var scrollDistance = -Math.max.apply(null, [document.body.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);
	updateTargetLocation();
	scrollDistance += Math.max.apply(null, [document.body.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);
	scrollBy(0, scrollDistance);
	Draw();
}

function onCheckboxChange_ColoredProperPieces(){
	updateColordProperPieces();
	Draw();
}
function onCheckboxChange_ShowPoints(){
	updateShowPoints();
	Draw();
}
function onCheckboxChange_ShowLozenge(){
	updateShowLogenzes();
	Draw();
}
function onCheckboxChange_ShowLines(){
	updateShowLines();
	Draw();
}
function onCheckboxChange_ShowUnusedPieces(){
	updateShowUnusedPieces();
	Draw();
}

function onCheckboxChange_ShowIndex(){
	updateShowIndex();
	Draw();
}
function RemoveShapeImage(){
	bShapeImage = false;
	document.getElementById("myFileImg").innerHTML = ''
}
function onRadioButtonChange_Shape(){
	updateShapeType();
	RemoveShapeImage();
	Draw();
}
function onCheckboxChange_ShowTweetButon(){
	updateShowTweetButton();
}

function onButtonClick_ResetShape(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	var elems = document.getElementsByName("RadioButton_Shape");
	var num = elems.length;
	for(var i = 0; i < num; i++){
		elems[i].checked = false;
	}
	onRadioButtonChange_Shape();
}

function onButtonClick_UncheckAll(event){
	event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
	document.getElementById("RadioButton_TargetTopLeft").checked = false;
	document.getElementById("RadioButton_TargetFront").checked = false;
	document.getElementById("RadioButton_TargetBack").checked = false;
	document.getElementById("RadioButton_TargetOther").checked = false;
	document.getElementById("Checkbox_ColoredProperPieces").checked = false;
	document.getElementById("Checkbox_ShowPoints").checked = false;
	document.getElementById("Checkbox_ShowLozenge").checked = false;
	document.getElementById("Checkbox_ShowUnusedPieces").checked = false;
	document.getElementById("Checkbox_ShowIndex").checked = false;
	document.getElementById("Checkbox_ShowLines").checked = false;
	onButtonClick_ResetShape(event);

	onRadioButtonChange_Target();
	onCheckboxChange_ColoredProperPieces();
	onCheckboxChange_ShowPoints();
	onCheckboxChange_ShowLozenge();
	onCheckboxChange_ShowUnusedPieces();
	onCheckboxChange_ShowIndex();
	onCheckboxChange_ShowLines();
	onRadioButtonChange_Shape();
}


// ======================================================================
// レベル
function onRadioButtonChange_Level(){
	if(document.getElementById("RadioButton_ModeNormal").checked){
		num = 12;
	}else if(document.getElementById("RadioButton_ModeEasy").checked){
		num = 6;
	}
	NumChanged();
}
var select_level = document.getElementById('Select_Level');
select_level.onchange = function(){
	var selectedItem = this.options[this.selectedIndex];
	num = Number(selectedItem.value);
	NumChanged();
	}

// ======================================================================
var hue_r  = 120;
var hue_cx;
var hue_cy;
var hue_min_r_ratio = 0.6;
var hue_max_r_ratio = 0.9;
var hue_min_r = hue_r * hue_min_r_ratio;
var hue_max_r = hue_r * hue_max_r_ratio;
var hue_splitNum = 12;
//var hue_splitNum = 120;
var ctxColor;
var CanvasColor;

var sv_size = hue_min_r * Math.sqrt(2);
var sv_x0;
var sv_y0;

function CalcIndexColorText(c1){
	function calc_color_distance(c1, c2){
		return Math.abs((c1[0] - c2[0]) * 299 + (c1[1] - c2[1]) * 587 + (c1[2] - c2[2]) * 114) *
			(Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]));
	}

	var diff = diff_max = 0;
	var c2;
	var c = [0, 0, 0];
	c2 = [  0,   0,   0]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [255,   0,   0]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [  0, 255,   0]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [  0,   0, 255]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [  0, 255, 255]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [255,   0, 255]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [255, 255,   0]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	c2 = [255, 255, 255]; diff = calc_color_distance(c1, c2); if(diff > diff_max){ diff_max = diff; c = c2; }
	return 'rgba('+(c[0])+','+(c[1])+','+(c[2])+','+1.0+')';
}

function hsv2rgb(h, s, v){
	var ii = h / 60 + 60; // ここでiiがマイナスになるようなhには非対応です。
	v = Math.floor(v);
	var f = ii - Math.floor(ii);
	var p = Math.round(v*(1-(s/255)));
	var q = Math.round(v*(1-(s/255)*f));
	var t = Math.round(v*(1-(s/255)*(1-f)));
	switch(Math.floor(ii) % 6){
		case 0: return [v, t, p];
		case 1: return [q, v, p];
		case 2: return [p, v, t];
		case 3: return [p, q, v];
		case 4: return [t, p, v];
		case 5: return [v, p, q];
	}
}

var hue_default = 210;
var hue_rad_default = (hue_default - 60) * Math.PI / 180 - Math.PI / 2;
var sat_default = 255;
var val_default = 128;
var hue_rad = hue_rad_default;
var hue_value = hue_default;
var sat_value = sat_default;
var val_value = val_default;

var HueMode = false;
var SVMode = false;

function getXYonColorCanvas(e){
	var BcRect = CanvasColor.getBoundingClientRect();
	if(isSmartPhone){
		x = e.touches[0].clientX - BcRect.left;
		y = e.touches[0].clientY - BcRect.top;
	}else{
		x = e.clientX - BcRect.left;
		y = e.clientY - BcRect.top;
	}
	return [x, y];
}

function onColorSelectEnd(e){
	HueMode = false;
	SVMode = false;
}
function onColorSelectStart(e){
	HueMode = false;
	SVMode = false;
	var xy = getXYonColorCanvas(e);
	var x = xy[0], y = xy[1];
	var rr = ((hue_cx - x) * (hue_cx - x) + (hue_cy - y) * (hue_cy - y));
	if(hue_min_r * hue_min_r < rr && rr < hue_max_r * hue_max_r){
		HueMode = true;
	}else if(sv_x0 <= x && x <= sv_x0 + sv_size && sv_y0 <= y && y <= sv_y0 + sv_size){
		SVMode = true;
	}
	onColorSelecting(e);
}
function onColorSelecting(e){
	if(!HueMode && !SVMode) return;
	e.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。

	var xy = getXYonColorCanvas(e);
	var x = xy[0], y = xy[1];
	var f = false;
	if(HueMode){
		f = true;
		var rad = Math.atan2(y - hue_cy, x - hue_cx);
		rad += Math.PI / 2; // (0, 1)を0度とするためにπ/2を足します。
		rad += Math.PI / hue_splitNum;
		var hue_i = Math.floor(rad / (2 * Math.PI / hue_splitNum));
		hue_rad = 2 * Math.PI / hue_splitNum * hue_i - Math.PI / 2;
		hue_value = (360 * hue_i / hue_splitNum + 60);
	}else if(SVMode){
		f = true;
		sat_value = Math.max(0, Math.min(255, (x - sv_x0) / sv_size * 255));
		val_value = Math.max(0, Math.min(255, 255 - (y - sv_y0) / sv_size * 255));
	}
	if(f){
		var rgb = hsv2rgb(hue_value, sat_value, val_value);
		var rgb_proper = hsv2rgb(hue_value, sat_value / 2, (val_value + 255) / 2);

		ColorF_ProperPiece = 'rgba('+rgb_proper[0]+','+rgb_proper[1]+','+rgb_proper[2]+','+1.0+')';
		ColorF_NormalPiece = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+1.0+')';
		ColorS_Lozenge = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+0.5+')';
		ColorF_ProperPieceIndex = CalcIndexColorText(rgb_proper);
		ColorF_NormalPieceIndex = CalcIndexColorText(rgb);

		//SetClip();
		ctxColor.clearRect(0, 0, CanvasColor.width, CanvasColor.height);
		DrawHSV();
		Draw();
	}
}

function SetClip(){
	ctxColor.beginPath();
	ctxColor.moveTo(CanvasColor.width, hue_cy);
	ctxColor.lineTo(CanvasColor.width, CanvasColor.height);
	ctxColor.lineTo(0, CanvasColor.height);
	ctxColor.lineTo(0, 0);
	ctxColor.lineTo(CanvasColor.width, 0);
	ctxColor.lineTo(CanvasColor.width, hue_cy);
	ctxColor.arc(hue_cx, hue_cy, hue_max_r, 0, 2 * Math.PI, true);
	ctxColor.arc(hue_cx, hue_cy, hue_min_r, 2 * Math.PI, 0, false);
	ctxColor.closePath();
	ctxColor.clip();
}

function DrawHSV(){
	function DrawSelectedCircle(x, y){
		ctxColor.save();
		ctxColor.strokeStyle = '#000000';
		ctxColor.beginPath();
		ctxColor.arc(x, y, 7, 0, 2 * Math.PI, false);
		ctxColor.stroke();

		ctxColor.strokeStyle = '#FFFFFF';
		ctxColor.beginPath();
		ctxColor.arc(x, y, 8, 0, 2 * Math.PI, false);
		ctxColor.stroke();
		ctxColor.restore();
	}

	function DrawHueCircle(){
		ctxColor.save();
		ctxColor.beginPath();
		ctxColor.arc(hue_cx, hue_cy, hue_min_r, 2 * Math.PI, 0, true);
		ctxColor.arc(hue_cx, hue_cy, hue_max_r, 0, 2 * Math.PI, false);
		ctxColor.clip();

		for(var i = 0; i < hue_splitNum; ++i){
			var currRad = 2 * Math.PI / hue_splitNum * (i - 0.5);
			var nextRad = 2 * Math.PI / hue_splitNum * (i + 0.5);
			var rgb = hsv2rgb((360 * i / hue_splitNum + 60), 255, 255);
			ctxColor.fillStyle = ctxColor.strokeStyle = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';

			ctxColor.beginPath();
			ctxColor.moveTo(hue_cx, hue_cy);
			ctxColor.lineTo(hue_cx + 2 * hue_r * Math.sin(currRad), hue_cy - 2 * hue_r * Math.cos(currRad));
			ctxColor.lineTo(hue_cx + 2 * hue_r * Math.sin(nextRad), hue_cy - 2 * hue_r * Math.cos(nextRad));
			ctxColor.lineTo(hue_cx, hue_cy);
			ctxColor.fill();
			ctxColor.stroke();
		}
		ctxColor.restore();
	}

	function DrawHSVStroke(){
		ctxColor.strokeStyle = '#888888';

		// H
		ctxColor.beginPath();
		ctxColor.arc(hue_cx, hue_cy, hue_min_r, 2 * Math.PI, 0, true);
		ctxColor.stroke();
		ctxColor.beginPath();
		ctxColor.arc(hue_cx, hue_cy, hue_max_r, 0, 2 * Math.PI, true);
		ctxColor.stroke();

		// SV
		ctxColor.strokeRect(sv_x0, sv_y0, sv_size, sv_size);
	}

	function DrawSVRect(){
		ctxColor.save();
		//SetClip();
		var satGrad = ctxColor.createLinearGradient(sv_x0, 0, sv_x0 + sv_size, 0);
		satGrad.addColorStop(0.0, '#FFFFFF');
		var color = hsv2rgb(hue_value, 255, 255);
		satGrad.addColorStop(1.0, 'rgb('+color[0]+','+color[1]+','+color[2]+')');
		ctxColor.fillStyle = satGrad;
		ctxColor.fillRect(sv_x0, sv_y0, sv_size, sv_size);

		var valGrad = ctxColor.createLinearGradient(0, sv_y0, 0, sv_y0 + sv_size);
		valGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
		valGrad.addColorStop(1.0, 'rgba(0, 0, 0, 1)');
		ctxColor.fillStyle = valGrad;
		ctxColor.fillRect(sv_x0, sv_y0, sv_size, sv_size);

		DrawSelectedCircle(sv_x0 + sat_value / 255 * sv_size, sv_y0 + sv_size - val_value / 255 * sv_size);
		ctxColor.restore();
	}

	DrawHueCircle();
	DrawSVRect();
	DrawHSVStroke();
	var r = (hue_min_r + hue_max_r) / 2;
	DrawSelectedCircle(hue_cx + r * Math.cos(hue_rad), hue_cy + r * Math.sin(hue_rad));
}


function DrawColorSelector(){
	ctxColor = document.getElementById("CanvasColor").getContext("2d");
	CanvasColor = document.getElementById("CanvasColor");
	hue_cx = CanvasColor.width / 2;
	hue_cy = CanvasColor.height / 2;
	sv_x0 = hue_cx - sv_size / 2;
	sv_y0 = hue_cy - sv_size / 2;

	CanvasColor.addEventListener(isSmartPhone ? 'touchstart' : 'mousedown', onColorSelectStart, false);
	CanvasColor.addEventListener(isSmartPhone ? 'touchmove' : 'mousemove', onColorSelecting, false);
	CanvasColor.addEventListener(isSmartPhone ? 'touchend' : 'mouseup', onColorSelectEnd, false);
	if(!isSmartPhone){
		CanvasColor.addEventListener('mouseout', onColorSelectEnd, false);
	}
	DrawHSV();
}

function onButtonClick_DefaultColor(event){
	ctxColor.clearRect(0, 0, CanvasColor.width, CanvasColor.height);
	ColorF_ProperPiece = ColorF_ProperPiece_Default;
	ColorF_NormalPiece = ColorF_NormalPiece_Default;
	ColorS_Lozenge = ColorS_Lozenge_Default;
	ColorF_UnusedPieceIndex = ColorF_UnusedPieceIndex_Default;
	ColorF_ProperPieceIndex = ColorF_ProperPieceIndex_Default;
	ColorF_NormalPieceIndex = ColorF_NormalPieceIndex_Default;

	hue_rad = hue_rad_default;
	hue_value = hue_default;
	sat_value = sat_default;
	val_value = val_default;
	DrawColorSelector();
	Draw();
}
