let num = -1; // ベースとなる多角形の頂点数
let numPrev; // コンソールからnumの値を変更してinitした時にも再読み込みされるように。
let pieceNum;
let sin = [];
let cos = [];
let nextId = [];
let pointSize;

const colorFillBackground = '#FFFFFF';
const colorFillUnusedPiece = '#E0E0E0';
const colorStrokeUnusedPiece = '#BBBBBB';
const colorFillProperPieceDefault = '#0080D0';
const colorFillNormalPieceDefault = '#004080';
const colorStrokeTargetPiece = '#BBBB00';
const colorFillTargetPiece = 'rgba(255, 255, 0, 0.5)';
const colorFillPoint3 = 'rgba(255, 255, 255, 0.7)';
const colorStrokePoint3 = '#FF0000';
const colorFillPoint2 = '#00CC00';
const colorStrokePoint2 = '#007700';
const colorStrokeLozengeDefault = '#5599DD';
const colorFillUnusedPieceIndexDefault = '#000000';
const colorFillProperPieceIndexDefault = '#FFFF00';
const colorFillNormalPieceIndexDefault = '#FFFF00';
let colorFillProperPiece = colorFillProperPieceDefault;
let colorFillNormalPiece = colorFillNormalPieceDefault;
let colorStrokeLozenge = colorStrokeLozengeDefault;
let colorFillUnusedPieceIndex = colorFillUnusedPieceIndexDefault;
let colorFillProperPieceIndex = colorFillProperPieceIndexDefault;
let colorFillNormalPieceIndex = colorFillNormalPieceIndexDefault;

let dataRedo = '';
let dataCurrent = '';

// for Options
let bTargetTopLeft = false;
let bTargetFront = false;
let bTargetBack = false;
let bTargetOther = false;
let bColoredProperPieces = false;
let bShowPoints = false;
let bShowLozenges = false;
let bShowUnusedPieces = false;
let bShowIndex = false;
let bShowLines = false;
let bShapeEllipse = false;
let bShapeOctagram = false;
let bShapeOctangle = false;
let bShapeEspille1 = false;
let bShapeEspille2 = false;
let bShapeCross1 = false;
let bShapeCross2 = false;
let bShapeFlower1 = false;
let bShapeFlower2 = false;
let bShapeRectS = false;
let bShapeRect = false;
let bShapeRects = false;
let bShapePlus1 = false;
let bShapePlus2 = false;
let bShapeCircle1 = false;
let bShapeCircle2 = false;
let bShapeCircle3 = false;
let bShapeCircle4 = false;
let bShapeCircle5 = false;
let bShapeCircle6 = false;
let bShapeLines = false;
let bShapeLines2 = false;
let bShapeNone = false;
let bShowTweetButton = false;

let redoCount = 0;
let clickCount = 0;
let clickCountRed = 0;
let clickCountGreen = 0;
let clickCountFin = 0;
let clickCountFinRed = 0;
let clickCountFinGreen = 0;
let completedFlag = false;
let notYetCompletedFlag = true;

let canvas;
let canvasTarget;
let centerX;
let centerY;
let ctx;
let ctxTarget;

let scale;
let r = [];
let rr = [];
let L = [];
let rects = [];

let rectTypes = [];
let rots = [];
let cxs = [];
let cys = [];
let unusedFlags = [];
let properFlags = [];
let properFlagsTarget = [];

let pairVertex = [];

// 完成状態用
let targetRectTypes = [];
let targetRots = [];
let targetCxs = [];
let targetCys = [];
let targetUnusedFlags = [];

let isSmartPhone = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/);

let myImg = new Image();
let bShapeImage = false;
let blobUrl = '';

let myFile = document.getElementById('myFile');
// 画像ファイル選択時の処理です。
myFile.addEventListener('change', function() {
  bShapeImage = true;
  let file = myFile.files[0];
  blobUrl = window.URL.createObjectURL(file);
  document.getElementById('myFileImg').innerHTML =
    '<img style="max-width:100%" src="' + blobUrl + '">';
  myImg.src = blobUrl;
  myImg.onload = function() {
    draw();
  };
} );

// document.addEventListener('DOMContentLoaded', function(){
// ↑これだと、完成状態のURLを読み込んだときに「twttr is not defined」となってしまうため、'load'を使います。
window.addEventListener('load', onLoad, false);

function initEventListener() {
  // iOSの場合とそれ以外とで画面回転時を判定するイベントを切り替える
  const rotateEvent = navigator.userAgent.match(/(iPhone|iPod|iPad)/) ?
    'orientationchange' : 'resize';
  window.addEventListener(rotateEvent, onOrientationchange, false);

  document.getElementById('buttonLoad').
    addEventListener('click', onButtonClickSavedataLoad, false);
  document.getElementById('buttonUndo').
    addEventListener('click', onButtonClickSavedataUndo, false);
  document.getElementById('buttonRedo').
    addEventListener('click', onButtonClickSavedataRedo, false);
  document.getElementById('buttonDefaultColor').
    addEventListener('click', onButtonClickDefaultColor, false);
  document.getElementById('buttonUncheckAll').
    addEventListener('click', onButtonClickUncheckAll, false);
  document.getElementById('buttonRandom').
    addEventListener('click', onButtonClickRandom, false);
  document.getElementById('buttonRandomInterval').
    addEventListener('click', onButtonClickRandomInterval, false);
  document.getElementById('buttonRandomIntervalStop').
    addEventListener('click', onButtonClickRandomIntervalStop, false);
  document.getElementById('checkboxShowTweetButton').
    addEventListener('click', onCheckboxChangeShowTweetButton, false);
  document.getElementById('buttonResetShape').
    addEventListener('click', onButtonClickResetShape, false);

  document.getElementById('radioButtonModeEasy')
    .onchange = onRadioButtonChangeLevel;
  document.getElementById('radioButtonModeNormal')
    .onchange = onRadioButtonChangeLevel;
  elemRangeRandom = document.getElementById('rangeRandom');
  elemRangeRandom.onchange = oninputRange;
  elemRangeRandom.oninput = oninputRange;
}

function onLoad() {
  initEventListener();

  let dataLoad = '';
  // analyzing url
  {
    let paravalsStr = location.href.split('?')[1];
    if (paravalsStr == null) paravalsStr = '';
    let paravalsArray = paravalsStr.split('&');
    for (let i = 0; i < paravalsArray.length; i++) {
      let paraval = paravalsArray[i].split('=');
      if (paraval.length == 2) {
        if (paraval[0] == 'level') {
          num = Number(paraval[1]);
        } else if (paraval[0] == 's') {
          dataLoad = paraval[1];
        }
      }
    }
    if (num == -1) num = 12;
    if (isNaN(num)) num = 12;

    let maxLevel = 70;
    if (num % 2 == 1) {
      if (window.confirm('奇数レベルには未対応です。申し訳ありません。\n' +
        '1つ下のレベル(レベル' + (num - 1) + ')を読み込みます。良いですか？\n' +
          '(キャンセルするとレベル12を読み込みます。)')) {
            num--;
          } else {
            num = 12;
          }
    } else if (num > maxLevel) {
      window.alert('※レベル' + maxLevel +
        'より上のレベルは、フリーズ等の対策のため制限しています。\n' +
          'ご了承ください。');
      num = 12;
    }

    if (num == 6 || num == 12) {
      document.getElementById('upperTitle').style.display = 'block';
      document.getElementById('lowerTitle').style.display = 'none';
    } else {
      document.getElementById('radioButtonTargetTopLeft').checked = false;
      document.getElementById('radioButtonTargetFront').checked = false;
      document.getElementById('radioButtonTargetBack').checked = false;
      document.getElementById('radioButtonTargetOther').checked = false;
      document.getElementById('targetLocation').style.display = 'none';
      document.getElementById('coloredProperPieces').style.display = 'none';
      document.getElementById('checkboxColoredProperPieces').checked = false;
      document.getElementById('upperTitle').style.display = 'none';
      document.getElementById('lowerTitle').style.display = 'block';
    }
    // console.log("level = " + num);
    numPrev = num;
    numChanged();

    document.getElementById('finish').style.display = 'none';
    document.getElementById('radioButtonModeEasy').checked = (num == 6);
    document.getElementById('radioButtonModeNormal').checked = (num == 12);
    for (let i = 0; i < selectLevel.length; ++i) {
      selectLevel.options[i].selected = (selectLevel.options[i].value == num);
    }
  }

  document.getElementById('buttonRedo').style.visibility = 'hidden';
  canvas = document.getElementById('canvasMain');
  canvasTarget = document.getElementById('canvasTarget');
  canvas.addEventListener(isSmartPhone ? 'touchstart' : 'click',
    onClick, false);

  updateTargetLocation();
  updateColordProperPieces();
  updateShowPoints();
  updateShowLogenzes();
  updateShowUnusedPieces();
  updateShowIndex();
  updateShowLines();
  updateShapeType();
  updateShowTweetButton();

  let maxStep = 10000;
  let step = dataLoad.length;
  if (step < maxStep) {
    loadData(dataLoad);
  } else {
    window.alert('読み込もうとしたデータは' + step + '手のデータです。\n' +
      '処理に時間がかかる可能性があるため、' + maxStep + '手以上のデータは' +
        '自動では読み込みません。\n' +
        '読み込みたい場合は、セーブデータからロードしてください。');
    loadData('');
    document.getElementById('TextareaSavedata').value = dataLoad;
  }
  setRedoData();
}

function initScale() {
  let clientWidth = 600;
  let clientHeight = 600;
  let canvasSize = clientWidth < clientHeight ? clientWidth : clientHeight;
  let bodyWidth = document.body.clientWidth;
  if (canvasSize <= 0) canvasSize = 400;
  if (num <= 12 && canvasSize > bodyWidth) canvasSize = bodyWidth;
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  // canvas.style.marginLeft = (bodyWidth - canvasSize) / 2 + "px";
  // canvas.style.marginRight = (bodyWidth - canvasSize) / 2 + "px";
  canvasTarget.setAttribute('width', canvasSize);
  canvasTarget.setAttribute('height', canvasSize);
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  ctx = canvas.getContext('2d');
  ctxTarget = canvasTarget.getContext('2d');
  scale = centerX * 3 / 2 / num;
  pointSize = 10 * scale / 25;
  if (pointSize > 15) pointSize = 15;
  if (pointSize < 4) pointSize = 4;
}

function updateTargetLocation() {
  bTargetTopLeft = document.getElementById('radioButtonTargetTopLeft').checked;
  bTargetFront = document.getElementById('radioButtonTargetFront').checked;
  bTargetBack = document.getElementById('radioButtonTargetBack').checked;
  bTargetOther = document.getElementById('radioButtonTargetOther').checked;
  document.getElementById('TargetCanvas').style.display =
    bTargetOther ? 'block' : 'none';
}

function updateColordProperPieces() {
  bColoredProperPieces =
    document.getElementById('checkboxColoredProperPieces').checked;
}
function updateShowPoints() {
  bShowPoints =
    document.getElementById('checkboxShowPoints').checked;
}
function updateShowLogenzes() {
  bShowLozenges =
    document.getElementById('checkboxShowLozenge').checked;
}
function updateShowUnusedPieces() {
  bShowUnusedPieces =
    document.getElementById('checkboxShowUnusedPieces').checked;
}
function updateShowIndex() {
  bShowIndex =
    document.getElementById('checkboxShowIndex').checked;
}
function updateShowLines() {
  bShowLines =
    document.getElementById('checkboxShowLines').checked;
}
function updateShapeType() {
  bShapeEllipse = document.getElementById('radioButtonShapeEllipse').checked;
  bShapeOctagram = document.getElementById('radioButtonShapeOctagram').checked;
  bShapeOctangle = document.getElementById('radioButtonShapeOctangle').checked;
  bShapeEspille1 = document.getElementById('radioButtonShapeEspille1').checked;
  bShapeEspille2 = document.getElementById('radioButtonShapeEspille2').checked;
  bShapeCross1 = document.getElementById('radioButtonShapeCross1').checked;
  bShapeCross2 = document.getElementById('radioButtonShapeCross2').checked;
  bShapeFlower1 = document.getElementById('radioButtonShapeFlower1').checked;
  bShapeFlower2 = document.getElementById('radioButtonShapeFlower2').checked;
  bShapeRectS = document.getElementById('radioButtonShapeRectS').checked;
  bShapeRect = document.getElementById('radioButtonShapeRect').checked;
  bShapeRects = document.getElementById('radioButtonShapeRects').checked;
  bShapePlus1 = document.getElementById('radioButtonShapePlus1').checked;
  bShapePlus2 = document.getElementById('radioButtonShapePlus2').checked;
  bShapeCircle1 = document.getElementById('radioButtonShapeCircle1').checked;
  bShapeCircle2 = document.getElementById('radioButtonShapeCircle2').checked;
  bShapeCircle3 = document.getElementById('radioButtonShapeCircle3').checked;
  bShapeCircle4 = document.getElementById('radioButtonShapeCircle4').checked;
  bShapeCircle5 = document.getElementById('radioButtonShapeCircle5').checked;
  bShapeCircle6 = document.getElementById('radioButtonShapeCircle6').checked;
  bShapeLines = document.getElementById('radioButtonShapeLines').checked;
  bShapeLines2 = document.getElementById('radioButtonShapeLines2').checked;
  bShapeNone = document.getElementById('radioButtonShapeNone').checked;
}

function updateShowTweetButton() {
  bShowTweetButton = document.getElementById('checkboxShowTweetButton').checked;
  if (bShowTweetButton) {
    addTweetButton(false);
  }
  document.getElementById('buttonTweet').style.display =
    bShowTweetButton ? 'inline' : 'none';
}

function initializePairVartex() {
  let pieceVertexX = [];
  let pieceVertexY = [];
  for (let idx = 0; idx < pieceNum; idx++) {
    let x = rects[rectTypes[idx]].w / 2;
    let y = rects[rectTypes[idx]].h / 2;
    let cx = cxs[idx];
    let cy = cys[idx];
    let rot = rots[idx];
    let c = cos[rot];
    let s = sin[rot];
    let xc = x * c;
    let xs = x * s;
    let yc = y * c;
    let ys = y * s;
    pieceVertexX[idx] = [cx + xc - ys, cx - xc - ys,
                         cx - xc + ys, cx + xc + ys];
    pieceVertexY[idx] = [cy + xs + yc, cy - xs + yc,
                         cy - xs - yc, cy + xs - yc];
  }

  for (let i = 0; i < pieceNum * 4; i++) {
    pairVertex[i] = -1;
  }

  for (let piece1id = 0; piece1id < pieceNum; piece1id++) {
    for (let point1id = 0; point1id < 4; point1id++) {
      if (pairVertex[piece1id * 4 + point1id] != -1) continue;
      let point1X = pieceVertexX[piece1id][point1id];
      let point1Y = pieceVertexY[piece1id][point1id];
      for (let piece2id = piece1id + 1; piece2id < pieceNum; piece2id++) {
        for (let point2id = 0; point2id < 4; point2id++) {
          if (nearlyEqual(point1X, pieceVertexX[piece2id][point2id]) &&
              nearlyEqual(point1Y, pieceVertexY[piece2id][point2id])) {
            pairVertex[piece1id * 4 + point1id] = piece2id * 4 + point2id;
            pairVertex[piece2id * 4 + point2id] = piece1id * 4 + point1id;
            // goto
            piece2id = pieceNum;
            break;
          }
        }
      }
    }
  }
}

function initializeState() {
  let rotX = centerX;
  let rotY_ = (Math.pow(Math.pow(rr[num / 2 - 1], 2.0) -
               Math.pow(r[0] / 2.0, 2.0), 0.5) + rects[0].h / 2.0) / 2.0;
  let rotY1 = centerY + rotY_;
  let rotY2 = centerY - rotY_;

  for (let j = 0; j < num / 2 - 1; j++) {
    for (let i = 0; i < num; i++) {
      let index = i * 2 + j % 2;
      let rot = index;
      let cx = r[j] * cos[rot] + centerX;
      let cy = r[j] * sin[rot] + centerY;

      let idx = j * num + i;
      rectTypes[idx] = (4 * j < num - 2) ? j : (num / 2 - 2 - j);
      cxs[idx] = cx;
      cys[idx] = cy;
      rots[idx] = (4 * j < num - 2) ? rot : ((rot + num / 2) % (2 * num));
      unusedFlags[idx] = false;
      if (j + 1 < index && index < num - j) { // 下側の小円内のピース
        cxs[idx] = 2 * rotX - cxs[idx];
        cys[idx] = 2 * rotY1 - cys[idx];
      } else if (num + j < index && index < 2 * num - j) { // 上側の小円内のピース
        unusedFlags[idx] = true;
        cxs[idx] = 2 * rotX - cxs[idx];
        cys[idx] = 2 * rotY2 - cys[idx];
      }
    }
  }
  initializePairVartex();
  calcClickPoints(-1);
}

function setTargetState() {
  let rot1X = [];
  let rot1Y = [];
  let rot2X = [];
  let rot2Y = [];

  let rx1 = 0.0;
  let ry1 = (Math.pow(Math.pow(rr[num / 2 - 1], 2.0) -
             Math.pow(r[0] / 2.0, 2.0), 0.5) + rects[0].h / 2.0) / 2.0;

  let theta;
  for (let i = 0; i < 3; i++) {
    theta = i * 2 * num / 3.0;
    rot1X[i] = centerX + rx1 * cos[theta] - ry1 * sin[theta];
    rot1Y[i] = centerY + rx1 * sin[theta] + ry1 * cos[theta];
  }

  let rx2A = L[num / 6] / 2.0;
  let ry2A = -Math.pow(Math.pow(rr[num / 6], 2.0) - Math.pow(rx2A, 2.0), 0.5);
  let rx2BBB = -rx2A;
  let ry2BBB = ry2A;

  theta = 2;
  let rx2BB = (rx2BBB) * cos[theta] - (ry2BBB) * sin[theta];
  let ry2BB = (rx2BBB) * sin[theta] + (ry2BBB) * cos[theta];

  theta = num / 3;
  let cxB = rot1X[2] - centerX;
  let cyB = rot1Y[2] - centerY;
  let rx2B = (rx2BB - cxB) * cos[theta] -
              (ry2BB - cyB) * sin[theta] + cxB;
  let ry2B = (rx2BB - cxB) * sin[theta] +
              (ry2BB - cyB) * cos[theta] + cyB;
  let rx2 = (rx2A + rx2B) / 2;
  let ry2 = (ry2A + ry2B) / 2;
  for (let i = 0; i < 3; i++) {
    theta = ((i + 1) * 2 * num / 3) % (2 * num);
    rot2X[i] = centerX + rx2 * cos[theta] - ry2 * sin[theta];
    rot2Y[i] = centerY + rx2 * sin[theta] + ry2 * cos[theta];
  }

  for (let j = 0; j < num / 2 - 1; j++) {
    for (let i = 0; i < num; i++) {
      let index = i * 2 + j % 2;
      let typeNum = 0;
      let unusedFlag = false;
      if (j + 1 < index && index < j + 1 + num / 6 * 2 && index < num - j) {
        typeNum = 1;
      } else if (j + 1 < index - num * 2 / 3 &&
                         index - num * 2 / 3 < j + 1 + num / 6 * 2 &&
                         index - num * 2 / 3 < num - j) {
        typeNum = 2;
      } else if (j + 1 < index - num * 4 / 3 &&
                         index - num * 4 / 3 < j + 1 + num / 6 * 2 &&
                         index - num * 4 / 3 < num - j) {
        typeNum = 3;
      } else if (j + 1 < index && index < num - j) {
        typeNum = 1;
        unusedFlag = true;
      } else if (j + 1 < index - num * 2 / 3 &&
                         index - num * 2 / 3 < num - j) {
        typeNum = 2;
        unusedFlag = true;
      } else if (j + 1 < index - num * 4 / 3 &&
                         index - num * 4 / 3 < num - j) {
        typeNum = 3;
        unusedFlag = true;
      } else if (j + 1 < index + num * 2 / 3 &&
                         index + num * 2 / 3 < num - j) {
        typeNum = 1;
        unusedFlag = true;
      }

      let idx = j * num + i;
      let rot = index;
      let cx = r[j] * cos[rot] + centerX;
      let cy = r[j] * sin[rot] + centerY;

      let posIdx = typeNum - 1;
      if (typeNum != 0) {
        let rotAdd = num / 3;
        let cxOld = cx;
        let cyOld = cy;
        cx = (cxOld - rot1X[posIdx]) * cos[rotAdd] -
             (cyOld - rot1Y[posIdx]) * sin[rotAdd] + rot1X[posIdx];
        cy = (cxOld - rot1X[posIdx]) * sin[rotAdd] +
             (cyOld - rot1Y[posIdx]) * cos[rotAdd] + rot1Y[posIdx];
        rot += rotAdd;
      }

      for (let n = 0; n < 3; n ++) {
        if (j + 1 < index - num * 2 * n / 3 &&
          index - num * 2 * n / 3 < num / 3 + 1 - j) {
            unusedFlag = false;
            let rotAdd = num;
            let cxOld = cx;
            let cyOld = cy;
            cx = (cxOld - rot2X[posIdx]) * cos[rotAdd] -
                 (cyOld - rot2Y[posIdx]) * sin[rotAdd] + rot2X[posIdx];
            cy = (cxOld - rot2X[posIdx]) * sin[rotAdd] +
                 (cyOld - rot2Y[posIdx]) * cos[rotAdd] + rot2Y[posIdx];
            rot += rotAdd;
          }
      }
      rot %= 2 * num;

      targetRectTypes[idx] = (4 * j < num - 2) ? j : (num / 2 - 2 - j);
      targetRots[idx] = (4 * j < num - 2) ? rot : ((rot + num / 2) % (2 * num));
      targetCxs[idx] = cx;
      targetCys[idx] = cy;
      targetUnusedFlags[idx] = unusedFlag;
    }
  }
}

document.addEventListener('keydown', function(event) {
  if (document.getElementById('savedataStr').style.display != 'none' &&
      document.getElementById('savedataStr').style.display != 'none') return;
  let k = event.keyCode;
  if (k == 37) { // [←]キー
    if (document.getElementById('buttonUndo').style.visibility == 'visible') {
      onButtonClickSavedataUndo(event);
    }
  } else if (k == 39) { // [→]キー
    if (document.getElementById('buttonRedo').style.visibility == 'visible') {
      onButtonClickSavedataRedo(event);
    }
  }
}, false);

function init() {
  document.getElementById('textClickCount').innerHTML='初期化中…';
  if (numPrev != num) {
    numPrev = num;
    numChanged();
  }
  initScale();

  {
    clickCount = 0;
    clickCountRed = 0;
    clickCountGreen = 0;
    completedFlag = false;
    notYetCompletedFlag = true;
  }

  pieceNum = num * num / 2 - num;
  for (let i = 0; i < pieceNum * 4; i++) {
    nextId[i] = (((i & 3) == 3) ? (i - 3) : (i + 1));
  }
  for (let i = 0; i < 2 * num; i++) {
    sin[i] = Math.sin(i * Math.PI / num);
    cos[i] = Math.cos(i * Math.PI / num);
  }

  addTweetButton(false);
  dataCurrent = '';
  document.getElementById('TextareaSavedata').value = '';
  document.getElementById('buttonUndo').style.visibility = 'hidden';

  let points = [];
  for (let i = 0; i < num; i++) {
    points[i] = {x: scale * cos[2 * i], y: scale * sin[2 * i]};
  }
  for (let i = 0; i < num / 2; i++) {
    let dx = points[0].x - points[i + 1].x;
    let dy = points[0].y - points[i + 1].y;
    L[i] = Math.sqrt(dx * dx + dy * dy);
  }
  for (let i = 0; i < num / 2 - 1; i++) {
    rects[i] = {w: L[num / 2 - 2 - i], h: L[i]};
  }
  r[0] = L[num / 2 - 2];
  for (let i = 1; i < num / 2 - 1; i++) {
    r[i] = Math.pow(Math.pow(r[i - 1] + rects[i - 1].w / 2.0, 2.0) +
                    Math.pow(rects[i - 1].h / 2.0, 2.0) -
                    Math.pow(rects[i].h / 2.0, 2.0), 0.5) + rects[i].w / 2.0;
  }
  rr[0] = L[num / 2 - 1] / 2.0;
  for (let i = 1; i < num / 2; i++) {
    rr[i] = Math.pow(Math.pow(Math.pow(
      Math.pow(rr[i - 1], 2.0) -
        Math.pow(rects[i - 1].h / 2.0, 2.0), 0.5) +
        rects[i - 1].w, 2.0) +
        Math.pow(rects[i - 1].h / 2.0, 2.0), 0.5);
  }

  initializeState();
  setTargetState();
  initProperFlags();
}

function numChanged() {
  let paravalsStr = location.href.split('?')[1];
  if (paravalsStr == null) paravalsStr = '';
  let paravalsArray = paravalsStr.split('&');
  let numUrl = -1;
  for (let i = 0, len = paravalsArray.length; i < len; i++) {
    let paraval = (paravalsArray[i]).split('=');
    if (paraval.length == 2) {
      if (paraval[0] == 'level') {
        numUrl = Number(paraval[1]);
      }
    }
  }
  if (numUrl == -1) numUrl = 12;
  if (numUrl != num) location.search = '?level=' + num;
}

function showIndex(idx, cx, cy, unusedFlag, bProperFlag) {
  ctx.save();
  if (unusedFlag) {
    ctx.fillStyle = colorFillUnusedPieceIndex;
  } else {
    if (bProperFlag) {
      ctx.fillStyle = colorFillProperPieceIndex;
    } else {
      ctx.fillStyle = colorFillNormalPieceIndex;
    }
  }
  ctx.fillText(idx, cx - 4, cy + 4);
  ctx.restore();
}

function drawPiece(idx) {
  let rectType = rectTypes[idx];
  let cx = cxs[idx];
  let cy = cys[idx];
  let rot = rots[idx];
  let unusedFlag = unusedFlags[idx];
  let bProperFlag = bColoredProperPieces && properFlags[idx] != -1;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(cx, cy);
  ctx.rotate(rot * Math.PI / num);

  if (unusedFlag) {
    if (bShowUnusedPieces) {
      ctx.fillStyle = colorFillUnusedPiece;
      ctx.strokeStyle = colorStrokeUnusedPiece;
      drawShape(ctx, rectType, true);
    }
  } else {
    if (bColoredProperPieces && bProperFlag) {
      ctx.fillStyle = ctx.strokeStyle = colorFillProperPiece;
    } else {
      ctx.fillStyle = ctx.strokeStyle = colorFillNormalPiece;
    }
    drawShape(ctx, rectType, false);
  }

  if (bShowLozenges) {
    ctx.strokeStyle = colorStrokeLozenge;
    ctx.beginPath();
    ctx.moveTo(0, rects[rectType].h);
    ctx.lineTo(rects[rectType].w, 0);
    ctx.lineTo(0, -rects[rectType].h);
    ctx.lineTo(-rects[rectType].w, 0);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();

  if (bShowIndex) {
    showIndex(idx, cx, cy, unusedFlag, bProperFlag);
  }
}

function drawShape(ctx, rectType, strokeOn) {
  ctx.save();
  ctx.beginPath();
  let h = rects[rectType].h;
  let w = rects[rectType].w;
  if (bShapeImage) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.lineTo( 0, h);
    ctx.lineTo( w, 0);
    ctx.lineTo( 0, -h);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(myImg, 0, 0, myImg.width, myImg.height, -w, -h, w * 2, h * 2);
    ctx.restore();
  } else if (bShapeEllipse) {
    ctx.scale(1, h / w);
    ctx.arc(0, 0, w / Math.sqrt(2.0), 0, 2*Math.PI, false);
  } else if (bShapeOctagram) {
    let hDiv2 = h / 2;
    let wDiv2 = w / 2;
    ctx.moveTo(0, h);
    ctx.lineTo(wDiv2, -hDiv2);
    ctx.lineTo(-w, 0);
    ctx.lineTo(wDiv2, hDiv2);
    ctx.lineTo(0, -h);
    ctx.lineTo(-wDiv2, hDiv2);
    ctx.lineTo(w, 0);
    ctx.lineTo(-wDiv2, -hDiv2);
    ctx.closePath();
  } else if (bShapeOctangle) {
    ctx.moveTo( w * 1/3, h * 2/3);
    ctx.lineTo( w * 2/3, h * 1/3);
    ctx.lineTo( w * 2/3, -h * 1/3);
    ctx.lineTo( w * 1/3, -h * 2/3);
    ctx.lineTo(-w * 1/3, -h * 2/3);
    ctx.lineTo(-w * 2/3, -h * 1/3);
    ctx.lineTo(-w * 2/3, h * 1/3);
    ctx.lineTo(-w * 1/3, h * 2/3);
    ctx.closePath();
  } else if (bShapeEspille1) {
    ctx.scale(1, h / w);
    let r = w / Math.sqrt(2.0);
    let piDiv4 = Math.PI / 4;
    ctx.arc( 0, w, r, 5 * piDiv4, 7 * piDiv4, false);
    ctx.arc( w, 0, r, 3 * piDiv4, 5 * piDiv4, false);
    ctx.arc( 0, -w, r, 1 * piDiv4, 3 * piDiv4, false);
    ctx.arc(-w, 0, r, -1 * piDiv4, 1 * piDiv4, false);
  } else if (bShapeEspille2) {
    ctx.scale(1, h / w);
    let r = w;
    let piDiv2 = Math.PI / 2;
    ctx.arc( w, w, r, 2 * piDiv2, 3 * piDiv2, false);
    ctx.arc( w, -w, r, 1 * piDiv2, 2 * piDiv2, false);
    ctx.arc(-w, -w, r, 0 * piDiv2, 1 * piDiv2, false);
    ctx.arc(-w, w, r, -1 * piDiv2, 0 * piDiv2, false);
  } else if (bShapeCross1) {
    let wDiv2 = w / 2;
    let r = w;
    ctx.scale(1, h / w);
    const piDiv6 = Math.PI / 6;
    ctx.arc( wDiv2, wDiv2, r, 6 * piDiv6, 7 * piDiv6, false);
    ctx.arc( wDiv2, -wDiv2, r, 5 * piDiv6, 6 * piDiv6, false);
    ctx.arc(-wDiv2, wDiv2, r, 9 * piDiv6, 10 * piDiv6, false);
    ctx.arc( wDiv2, wDiv2, r, 8 * piDiv6, 9 * piDiv6, false);
    ctx.arc(-wDiv2, -wDiv2, r, 0 * piDiv6, 1 * piDiv6, false);
    ctx.arc(-wDiv2, wDiv2, r, 11 * piDiv6, 12 * piDiv6, false);
    ctx.arc( wDiv2, -wDiv2, r, 3 * piDiv6, 4 * piDiv6, false);
    ctx.arc(-wDiv2, -wDiv2, r, 2 * piDiv6, 3 * piDiv6, false);
  } else if (bShapeCross2) {
    let r = w * Math.sqrt(2.0);
    ctx.scale(1, h / w);
    let piDiv12 = Math.PI / 12;
    ctx.arc( 0, w, r, 15 * piDiv12, 17 * piDiv12, false);
    ctx.arc( w, 0, r, 13 * piDiv12, 15 * piDiv12, false);
    ctx.arc(-w, 0, r, 21 * piDiv12, 23 * piDiv12, false);
    ctx.arc( 0, w, r, 19 * piDiv12, 21 * piDiv12, false);
    ctx.arc( 0, -w, r, 3 * piDiv12, 5 * piDiv12, false);
    ctx.arc(-w, 0, r, 25 * piDiv12, 27 * piDiv12, false);
    ctx.arc( w, 0, r, 9 * piDiv12, 11 * piDiv12, false);
    ctx.arc( 0, -w, r, 7 * piDiv12, 9 * piDiv12, false);
  } else if (bShapeFlower1) {
    let wDiv2 = w / 2;
    let r = wDiv2;
    ctx.scale(1, h / w);
    let piDiv2 = Math.PI / 2;
    ctx.arc( 0, wDiv2, r, 2 * piDiv2, 4 * piDiv2, false);
    ctx.arc( wDiv2, 0, r, 1 * piDiv2, 3 * piDiv2, false);
    ctx.arc( 0, -wDiv2, r, 0 * piDiv2, 2 * piDiv2, false);
    ctx.arc(-wDiv2, 0, r, 3 * piDiv2, 1 * piDiv2, false);
  } else if (bShapeFlower2) {
    let wDiv2 = w / 2;
    let r = wDiv2 * Math.sqrt(2.0);
    ctx.scale(1, h / w);
    let piDiv4 = Math.PI / 4;
    ctx.arc( wDiv2, wDiv2, r, 3 * piDiv4, 7 * piDiv4, false);
    ctx.arc( wDiv2, -wDiv2, r, 1 * piDiv4, 5 * piDiv4, false);
    ctx.arc(-wDiv2, -wDiv2, r, 7 * piDiv4, 3 * piDiv4, false);
    ctx.arc(-wDiv2, wDiv2, r, 5 * piDiv4, 1 * piDiv4, false);
  } else if (bShapeRectS) {
    let rate = 0.5;
    ctx.moveTo(0, h * rate);
    ctx.lineTo(w * rate, 0);
    ctx.lineTo(0, -h * rate);
    ctx.lineTo(-w * rate, 0);
    ctx.closePath();
  } else if (bShapeRect) {
    let rate = 0.9;
    ctx.moveTo(0, h * rate);
    ctx.lineTo(w * rate, 0);
    ctx.lineTo(0, -h * rate);
    ctx.lineTo(-w * rate, 0);
    ctx.closePath();
  } else if (bShapeRects) {
    let paddingRate = 0.1;
    let wDiv2 = w / 2;
    let hDiv2 = h / 2;

    {
      ctx.beginPath();
      ctx.moveTo(0, h * (1 - paddingRate));
      ctx.lineTo(wDiv2 * (1 - paddingRate * 2), hDiv2);
      ctx.lineTo(0, h * paddingRate);
      ctx.lineTo(-wDiv2 * (1 - paddingRate * 2), hDiv2);
      ctx.closePath();
    }
    ctx.fill();
    {
      ctx.beginPath();
      ctx.moveTo(wDiv2, hDiv2 * (1 - paddingRate * 2));
      ctx.lineTo(w * (1 - paddingRate), 0);
      ctx.lineTo(wDiv2, -hDiv2 * (1 - paddingRate * 2));
      ctx.lineTo(w * paddingRate, 0);
      ctx.closePath();
    }
    ctx.fill();
    {
      ctx.beginPath();
      ctx.moveTo(0, -h * (1 - paddingRate));
      ctx.lineTo(wDiv2 * (1 - paddingRate * 2), -hDiv2);
      ctx.lineTo(0, -h * paddingRate);
      ctx.lineTo(-wDiv2 * (1 - paddingRate * 2), -hDiv2);
      ctx.closePath();
    }
    ctx.fill();
    {
      ctx.beginPath();
      ctx.moveTo(-wDiv2, hDiv2 * (1 - paddingRate * 2));
      ctx.lineTo(-w * (1 - paddingRate), 0);
      ctx.lineTo(-wDiv2, -hDiv2 * (1 - paddingRate * 2));
      ctx.lineTo(-w * paddingRate, 0);
      ctx.closePath();
    }
    ctx.fill();
    if (strokeOn) {
      // TODO 暫定的にコピペで実装しているのをまともなコードに修正する。
      {
        ctx.beginPath();
        ctx.moveTo(0, h * (1 - paddingRate));
        ctx.lineTo(wDiv2 * (1 - paddingRate * 2), hDiv2);
        ctx.lineTo(0, h * paddingRate);
        ctx.lineTo(-wDiv2 * (1 - paddingRate * 2), hDiv2);
        ctx.closePath();
      }
      ctx.stroke();
      {
        ctx.beginPath();
        ctx.moveTo(wDiv2, hDiv2 * (1 - paddingRate * 2));
        ctx.lineTo(w * (1 - paddingRate), 0);
        ctx.lineTo(wDiv2, -hDiv2 * (1 - paddingRate * 2));
        ctx.lineTo(w * paddingRate, 0);
        ctx.closePath();
      }
      ctx.stroke();
      {
        ctx.beginPath();
        ctx.moveTo(0, -h * (1 - paddingRate));
        ctx.lineTo(wDiv2 * (1 - paddingRate * 2), -hDiv2);
        ctx.lineTo(0, -h * paddingRate);
        ctx.lineTo(-wDiv2 * (1 - paddingRate * 2), -hDiv2);
        ctx.closePath();
      }
      ctx.stroke();
      {
        ctx.beginPath();
        ctx.moveTo(-wDiv2, hDiv2 * (1 - paddingRate * 2));
        ctx.lineTo(-w * (1 - paddingRate), 0);
        ctx.lineTo(-wDiv2, -hDiv2 * (1 - paddingRate * 2));
        ctx.lineTo(-w * paddingRate, 0);
        ctx.closePath();
      }
      ctx.stroke();
    }
  } else if (bShapePlus1) {
    let widthRate = 0.1;
    let wDiv2 = w / 2;
    let hDiv2 = h / 2;
    ctx.moveTo( wDiv2 * (1 - widthRate), hDiv2 * (1 + widthRate));
    ctx.lineTo( wDiv2 * (1 + widthRate), hDiv2 * (1 - widthRate));
    ctx.lineTo(w * widthRate, 0);
    ctx.lineTo( wDiv2 * (1 + widthRate), -hDiv2 * (1 - widthRate));
    ctx.lineTo( wDiv2 * (1 - widthRate), -hDiv2 * (1 + widthRate));
    ctx.lineTo(0, -h * widthRate);
    ctx.lineTo(-wDiv2 * (1 - widthRate), -hDiv2 * (1 + widthRate));
    ctx.lineTo(-wDiv2 * (1 + widthRate), -hDiv2 * (1 - widthRate));
    ctx.lineTo(-w * widthRate, 0);
    ctx.lineTo(-wDiv2 * (1 + widthRate), hDiv2 * (1 - widthRate));
    ctx.lineTo(-wDiv2 * (1 - widthRate), hDiv2 * (1 + widthRate));
    ctx.lineTo(0, h * widthRate);
    ctx.closePath();
  } else if (bShapePlus2) {
    let widthRate = 0.1 / Math.sqrt(2.0);
    ctx.moveTo(-w * widthRate, h * (1 - widthRate));
    ctx.lineTo( w * widthRate, h * (1 - widthRate));
    ctx.lineTo( w * widthRate, h * widthRate);
    ctx.lineTo( w * (1 - widthRate), h * widthRate);
    ctx.lineTo( w * (1 - widthRate), -h * widthRate);
    ctx.lineTo( w * widthRate, -h * widthRate);
    ctx.lineTo( w * widthRate, -h * (1 - widthRate));
    ctx.lineTo(-w * widthRate, -h * (1 - widthRate));
    ctx.lineTo(-w * widthRate, -h * widthRate);
    ctx.lineTo(-w * (1 - widthRate), -h * widthRate);
    ctx.lineTo(-w * (1 - widthRate), h * widthRate);
    ctx.lineTo(-w * widthRate, h * widthRate);
    ctx.closePath();
  } else if (bShapeCircle1) {
    ctx.arc( 0, 0, 0.5 * h, 0, 2 * Math.PI, false);
  } else if (bShapeCircle2) {
    ctx.arc( 0, 0, w * h / Math.sqrt(w * w + h * h), 0, 2 * Math.PI, false);
  } else if (bShapeCircle3) {
    h = rects[0].h;
    ctx.arc( 0, 0, 0.5 * h, 0, 2 * Math.PI, false);
  } else if (bShapeCircle4) {
    h = rects[0].h;
    w = rects[0].w;
    ctx.arc( 0, 0, w * h / Math.sqrt(w * w + h * h), 0, 2 * Math.PI, false);
  } else if (bShapeCircle5) {
    ctx.arc( 0, 0, h, 0, 2 * Math.PI, false);
  } else if (bShapeCircle6) {
    ctx.arc( 0, 0, w, 0, 2 * Math.PI, false);
  } else if (bShapeLines) {
    let widthRate = 0.25;
    let rate = 1 - widthRate;
    ctx.beginPath();
    ctx.moveTo(-w * rate, -h * widthRate);
    ctx.lineTo(-w, 0);
    ctx.lineTo(-w * rate, h * widthRate);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-w * widthRate, h * rate);
    ctx.lineTo( 0, h);
    ctx.lineTo( w * widthRate, h * rate);
    ctx.lineTo( w * widthRate, -h * rate);
    ctx.lineTo( 0, -h);
    ctx.lineTo(-w * widthRate, -h * rate);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * rate, -h * widthRate);
    ctx.lineTo(w, 0);
    ctx.lineTo(w * rate, h * widthRate);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
  } else if (bShapeLines2) {
    let widthRate = 0.25;
    let rate = 1 - widthRate;
    ctx.beginPath();
    ctx.moveTo(-w * rate, -h * widthRate);
    ctx.lineTo(-w * rate, h * widthRate);
    ctx.lineTo(-w * widthRate, h * rate);
    ctx.lineTo(-w * widthRate, -h * rate);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * rate, -h * widthRate);
    ctx.lineTo(w * rate, h * widthRate);
    ctx.lineTo(w * widthRate, h * rate);
    ctx.lineTo(w * widthRate, -h * rate);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
  } else if (bShapeNone) {
    1;
  } else {
    ctx.rect(-w / 2, -h / 2, w, h);
  }

  if (!bShapeRects && !bShapeImage) {
    if (bShapeCircle5 || bShapeCircle6) {
      ctx.stroke();
    } else {
      ctx.fill();
      if (strokeOn) ctx.stroke();
    }
  }
  ctx.restore();
}

function drawTarget(ctx, smallSize, normalColor) {
  ctx.save();
  if (!normalColor) {
    ctx.strokeStyle = colorStrokeTargetPiece;
    ctx.fillStyle = colorFillTargetPiece;
  }
  for (let idx = 0; idx < pieceNum; idx++) {
    if (targetUnusedFlags[idx]) continue;
    let rectType = targetRectTypes[idx];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (smallSize) ctx.scale(0.19, 0.19);
    if (normalColor) {
      if (bColoredProperPieces && properFlagsTarget[idx] != -1) {
        ctx.fillStyle = ctx.strokeStyle = colorFillProperPiece;
      } else {
        ctx.fillStyle = ctx.strokeStyle = colorFillNormalPiece;
      }
    }
    ctx.translate(targetCxs[idx], targetCys[idx]);
    ctx.rotate(targetRots[idx] * Math.PI / num);
    drawShape(ctx, rectType, !normalColor);
  }
  ctx.restore();
}

function drawPoints() {
  ctx.save();
  for (let i = 0; i < pointNum; i++) {
    let px = clickPoints[i].px;
    let py = clickPoints[i].py;
    if (clickPoints[i].trio) {
      ctx.fillStyle = colorFillPoint3;
      ctx.strokeStyle = colorStrokePoint3;
    } else {
      ctx.fillStyle = colorFillPoint2;
      ctx.strokeStyle = colorStrokePoint2;
    }
    ctx.beginPath();
    ctx.rect(px - pointSize / 2, py - pointSize / 2, pointSize, pointSize);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawCircle(x, y, rotStart, rotEnd, strokeStyle) {
  ctx.save();

  let radius = centerX / 20.0;
  x *= radius;
  y *= radius;

  ctx.beginPath();
  ctx.arc(x, y, radius, rotStart, rotEnd, false);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = radius / 3.0;
  ctx.stroke();

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = radius / 4.0;
  ctx.stroke();

  ctx.restore();
}

function drawCongratulations() {
  ctx.save();

  ctx.font = 'bold 14px sans-serif';
  ctx.translate(5, 15);
  ctx.fillStyle = '#FF0000';
  ctx.fillText('Congratulations!', 0, 0);

  ctx.fillStyle = '#004080';
  ctx.fillText('TOKYO 2020', 0, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(-3, 45);
  drawCircle(2 + 0/60, 0, Math.PI * 0.00, Math.PI * 2.00, '#0000FF');
  drawCircle(3 + 12/60, 1, -Math.PI * 0.50, Math.PI * 1.40, '#FFAA00');
  drawCircle(4 + 24/60, 0, -Math.PI * 0.95, Math.PI * 0.95, '#000000');
  drawCircle(5 + 36/60, 1, -Math.PI * 0.50, Math.PI * 1.40, '#008000');
  drawCircle(6 + 48/60, 0, -Math.PI * 0.95, Math.PI * 0.95, '#FF0000');
  ctx.restore();
}

function drawLines() {
  ctx.save();
  ctx.strokeStyle = '#FF80FF';
  for (let i = 0; i < pieceNum * 4; i++) {
    let j = pairVertex[i];
    if (j == -1) continue;
    let idxI = Math.floor(i / 4);
    let idxJ = Math.floor(j / 4);
    ctx.beginPath();
    ctx.moveTo(cxs[idxI], cys[idxI]);
    ctx.lineTo(cxs[idxJ], cys[idxJ]);
    ctx.stroke();
  }
  ctx.restore();
}

function draw() {
  document.getElementById('textClickCount').innerHTML = '現在' +
    clickCount + '手目です。' +
    ' (赤' + clickCountRed + ', 緑' + clickCountGreen + ')';
  ctx.fillStyle = colorFillBackground;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctxTarget.fillStyle = colorFillBackground;
  ctxTarget.fillRect(0, 0, canvasTarget.width, canvasTarget.height);

  if (bTargetTopLeft && !completedFlag) {
    drawTarget(ctx, true, true);
  } else if (bTargetOther) {
    drawTarget(ctxTarget, false, true);
  } else if (bTargetBack) {
    drawTarget(ctx, false, false);
  }
  for (let i = 0; i < pieceNum; i++) {
    drawPiece(i, false);
  }
  if (bTargetFront) {
    drawTarget(ctx, false, false);
  }

  if (bShowPoints) {
    drawPoints();
  }
  if (bShowLines) {
    drawLines();
  }

  if (completedFlag) {
    drawCongratulations();
  }
}

let eps = 0.001;
function nearlyEqual(a, b) {
  return (Math.abs(a - b) < eps);
}

function nearlyEqualForRot(a, b, n) {
  return Math.abs(a - b) % (2 * num / n) == 0;
}

let pointNum;
let clickPoints;
// 次にクリックするID(clickID)がわかっている場合(セーブデータを読み込む場合など)は、計算を途中で打ち切ります。
// そうでない場合は、引数に-1を入れて使用します。
function calcClickPoints(clickID) {
  clickPoints = [];

  let pieceVertexX = [];
  let pieceVertexY = [];
  for (let idx = 0; idx < pieceNum; idx++) {
    let x = rects[rectTypes[idx]].w / 2;
    let y = rects[rectTypes[idx]].h / 2;
    let cx = cxs[idx];
    let cy = cys[idx];
    let rot = rots[idx];
    let c = cos[rot];
    let s = sin[rot];
    let xc = x * c;
    let xs = x * s;
    let yc = y * c;
    let ys = y * s;
    pieceVertexX[idx] = [cx + xc - ys, cx - xc - ys,
                         cx - xc + ys, cx + xc + ys];
    pieceVertexY[idx] = [cy + xs + yc, cy - xs + yc,
                         cy - xs - yc, cy + xs - yc];
  }
  pointNum = 0;
  for (let p11 = 0; p11 < pieceNum * 4; p11++) {
    let piece1id = Math.floor(p11 / 4);
    let point1id = (p11 & 3);
    let point1X = pieceVertexX[piece1id][point1id];
    let point1Y = pieceVertexY[piece1id][point1id];

    let p12 = nextId[p11];
    let p21 = pairVertex[p12];
    if (p21 == -1) continue;
    let piece2id = Math.floor(p21 / 4);
    if (piece1id > piece2id) continue;
    let point2id = (p21 & 3);
    let point2X = pieceVertexX[piece2id][point2id];
    let point2Y = pieceVertexY[piece2id][point2id];
    // for swapping 2 objects; (ペア)
    if (unusedFlags[piece1id] != unusedFlags[piece2id]
      && rectTypes[piece1id] == rectTypes[piece2id]
        && nearlyEqualForRot(rots[piece1id], rots[piece2id],
          (rectTypes[piece1id] + 1) * 4 == num ? 4 : 2)) {
      if (clickID == -1 || pointNum == clickID) {
        clickPoints[pointNum] = {
          px: point2X, py: point2Y, id1: p12, id2: p21, trio: false,
        };
        if (clickID != -1) {
          return;
        }
      }
      pointNum++;
      continue; // ペアになっている時、その2つ+1つの3つでトリオになることはあり得ません。
    }

    let p31 = pairVertex[nextId[p21]];
    if (p31 == -1) continue;
    let piece3id = Math.floor(p31 / 4);
    if (piece1id > piece3id) continue;
    let point3id = (p31 & 3);
    let point3X = pieceVertexX[piece3id][point3id];
    let point3Y = pieceVertexY[piece3id][point3id];

    if (pairVertex[nextId[p31]] == p11) {
      if (clickID == -1 || pointNum == clickID) {
        // for swapping 3 objects; (トリオ)
        let px = ((cxs[piece1id] + cxs[piece2id] + cxs[piece3id]) * 2 -
          (point1X + point2X + point3X)) / 3;
        let py = ((cys[piece1id] + cys[piece2id] + cys[piece3id]) * 2 -
          (point1Y + point2Y + point3Y)) / 3;
        clickPoints[pointNum] = {
          px: px, py: py, id1: p11, id2: p21, id3: p31, trio: true,
        };
        if (clickID != -1) {
          return;
        }
      }
      pointNum++;
    }
  }
}

function onOrientationchange() {
  if (canvas == null) return;
  initScale();
  loadData(dataCurrent);
}

function pieceMatchCheck(targetId, pieceId) {
  return (targetRectTypes[targetId] == rectTypes[pieceId]
    && nearlyEqual(targetCxs[targetId], cxs[pieceId])
      && nearlyEqual(targetCys[targetId], cys[pieceId])
      && nearlyEqualForRot(targetRots[targetId], rots[pieceId],
        (rectTypes[targetId] + 1) * 4 == num ? 4 : 2));
}

function updateProperFlags(pieceId) {
  properFlags[pieceId] = -1;
  if (unusedFlags[pieceId]) return;
  for (let targetId = 0; targetId < pieceNum; targetId++) {
    if (targetUnusedFlags[targetId]) continue;
    if (pieceMatchCheck(targetId, pieceId)) {
      properFlags[pieceId] = targetId;
      properFlagsTarget[targetId] = pieceId;
      return;
    }
  }
}
function initProperFlags() {
  for (let i = 0; i < pieceNum; i++) {
    properFlags[i] = -1;
    properFlagsTarget[i] = -1;
  }
  for (let pieceId = 0; pieceId < pieceNum; pieceId++) {
    updateProperFlags(pieceId);
  }
}
function isFinished() {
  for (let targetId = 0; targetId < pieceNum; targetId++) {
    if (targetUnusedFlags[targetId]) continue;
    if (properFlagsTarget[targetId] == -1) return false;
  }
  return true;
}

function addTweetButton(finished) {
  if (!finished && !bShowTweetButton) return;
  let buttonID = finished ? 'buttonTweet2' : 'buttonTweet';
  let d = document.getElementById(buttonID);
  while (d.firstChild != null) d.removeChild(d.firstChild);

  let ele = document.createElement('a');
  ele.setAttribute('href', 'https://twitter.com/share');
  ele.setAttribute('class', 'twitter-share-button');
  let title = '';
  if (num == 12) {
    title = '「東京オリンピック・エンブレム・パズル」';
  } else if (num == 6) {
    title = '「東京オリンピック・エンブレム・パズル(イージーモード)」';
  } else {
    title = '「東京オリンピック・エンブレム・パズル(' + num + '角形ベース)」';
  }
  if (finished) {
    ele.setAttribute('data-text', title + 'を' +
      clickCount + '手(赤' + clickCountRed + ', 緑' + clickCountGreen + ')' +
        'で解きました！');
  } else {
    if (clickCount == 0) {
      ele.setAttribute('data-text', '今から、' + title + 'に挑戦します！');
    } else {
      ele.setAttribute('data-text', title + 'に挑戦中！ 現在' +
        clickCount + '手目(赤' + clickCountRed + ', 緑' + clickCountGreen + ')');
    }
  }
  let buf = location.href;
  let questionPos = buf.search('\\?');
  if (questionPos != -1) {
    buf = buf.substr(0, questionPos);
  }
  ele.setAttribute('data-url', buf + '?level=' + num +
    (dataCurrent == '' ? '' : '&s=' + dataCurrent));
  ele.setAttribute('data-via', 'tatt61880');
  ele.setAttribute('data-hashtags', 'tyo2020pzl');
  let str = document.createTextNode('Tweet');
  ele.appendChild(str);
  d.appendChild(ele);

  twttr.widgets.load();
}

function itoa(n) {
  let c;
  if (n < 10) {
    c = n;
  } else if (n < 36) {
    c = String.fromCharCode(n - 10 + 65); // A-Z
  } else if (n < 36 + 26) {
    c = String.fromCharCode(n - 36 + 97); // a-z
  } else {
    c = '(' + n + ')';
  }
  return c;
}

function updateSavedata(clickID) {
  let c = itoa(clickID);
  dataCurrent += c;
  document.getElementById('TextareaSavedata').value = dataCurrent;
}

function movePieces(clickID) {
  clickCount++;
  updateSavedata(clickID);
  document.getElementById('buttonUndo').style.visibility = 'visible';

  function f(iId, oId) {
    let po = pairVertex[oId];
    if (po != -1) pairVertex[po] = iId;
    pairVertex[iId] = po;
  }
  function g(aId, bId) {
    if (aId != -1) pairVertex[aId] = bId;
    if (bId != -1) pairVertex[bId] = aId;
  }
  if (clickPoints[clickID].trio) {
    clickCountRed++;
    let px = clickPoints[clickID].px;
    let py = clickPoints[clickID].py;
    let piece1id = Math.floor(clickPoints[clickID].id1 / 4);
    let piece2id = Math.floor(clickPoints[clickID].id2 / 4);
    let piece3id = Math.floor(clickPoints[clickID].id3 / 4);

    cxs[piece1id] = 2 * px - cxs[piece1id];
    cys[piece1id] = 2 * py - cys[piece1id];
    cxs[piece2id] = 2 * px - cxs[piece2id];
    cys[piece2id] = 2 * py - cys[piece2id];
    cxs[piece3id] = 2 * px - cxs[piece3id];
    cys[piece3id] = 2 * py - cys[piece3id];
    if (properFlags[piece1id] != -1) {
      properFlagsTarget[properFlags[piece1id]] = -1;
    }
    if (properFlags[piece2id] != -1) {
      properFlagsTarget[properFlags[piece2id]] = -1;
    }
    if (properFlags[piece3id] != -1) {
      properFlagsTarget[properFlags[piece3id]] = -1;
    }
    updateProperFlags(piece1id);
    updateProperFlags(piece2id);
    updateProperFlags(piece3id);

    let p11 = clickPoints[clickID].id1;
    let p12 = nextId[p11];
    let p13 = nextId[p12];
    let p14 = nextId[p13];
    let p21 = clickPoints[clickID].id2;
    let p22 = nextId[p21];
    let p23 = nextId[p22];
    let p24 = nextId[p23];
    let p31 = clickPoints[clickID].id3;
    let p32 = nextId[p31];
    let p33 = nextId[p32];
    let p34 = nextId[p33];

    f(p11, p34);
    f(p12, p23);
    f(p21, p14);
    f(p22, p33);
    f(p31, p24);
    f(p32, p13);
    g(p13, p34);
    g(p23, p14);
    g(p33, p24);
  } else {
    clickCountGreen++;
    let piece1id = Math.floor(clickPoints[clickID].id1 / 4);
    let piece2id = Math.floor(clickPoints[clickID].id2 / 4);
    cxs[piece1id] = [cxs[piece2id], cxs[piece2id] = cxs[piece1id]][0];
    cys[piece1id] = [cys[piece2id], cys[piece2id] = cys[piece1id]][0];
    if (properFlags[piece1id] != -1) {
      properFlagsTarget[properFlags[piece1id]] = -1;
    }
    if (properFlags[piece2id] != -1) {
      properFlagsTarget[properFlags[piece2id]] = -1;
    }
    updateProperFlags(piece1id);
    updateProperFlags(piece2id);

    let p11 = clickPoints[clickID].id1;
    let p12 = nextId[p11];
    let p13 = nextId[p12];
    let p14 = nextId[p13];
    let p21 = clickPoints[clickID].id2;
    let p22 = nextId[p21];
    let p23 = nextId[p22];
    let p24 = nextId[p23];

    let pp12 = pairVertex[p12];
    let pp13 = pairVertex[p13];
    let pp14 = pairVertex[p14];
    let pp22 = pairVertex[p22];
    let pp23 = pairVertex[p23];
    let pp24 = pairVertex[p24];

    g(p11, pp23);
    g(p12, pp24);
    g(p14, pp22);
    g(p21, pp13);
    g(p22, pp14);
    g(p24, pp12);
    g(p13, p23);
  }

  completedFlag = false;
  if (isFinished()) {
    completedFlag = true;
    if (notYetCompletedFlag) {
      document.getElementById('finish').style.display = 'block';
      notYetCompletedFlag = false;
      document.getElementById('TextFinishCount').innerHTML =
        clickCount + '手目に完成！！' +
        ' (赤' + clickCountRed + ', 緑' + clickCountGreen + ')';
      // 完成後のUndoやRedo時に毎回は更新しないようにする。
      if (clickCount != clickCountFin ||
          clickCountRed != clickCountFinRed ||
          clickCountGreen != clickCountFinGreen) {
        clickCountFin = clickCount;
        clickCountFinRed = clickCountRed;
        clickCountFinGreen = clickCountGreen;
        addTweetButton(true);
      }
    }
  }
}

function onClick(e) {
  let x;
  let y;
  let bcRect = canvas.getBoundingClientRect();
  if (typeof e.touches !== 'undefined') {
    x = e.touches[0].clientX - bcRect.left;
    y = e.touches[0].clientY - bcRect.top;
  } else {
    x = e.clientX - bcRect.left;
    y = e.clientY - bcRect.top;
  }

  let minDistance = 1000;
  let clickID = -1;
  for (let i = 0; i < pointNum; i++) {
    let px = clickPoints[i].px;
    let py = clickPoints[i].py;
    if (Math.abs(px - x) < 3 * pointSize &&
      Math.abs(py - y) < 3 * pointSize) {
      let distance = Math.abs(x - px) + Math.abs(y - py);
      if (distance < minDistance) { // 条件を満たす点が複数ある場合の対策。一番クリックした位置に近いものを選択します。
        minDistance = distance;
        clickID = i;
      }
    }
  }

  if (clickID != -1) {
    movePieces(clickID);
    calcClickPoints(-1);
    draw();
    addTweetButton(false);
    setRedoData();
  }
}

function moveRandom() {
  let clickID = Math.floor(Math.random() * clickPoints.length);
  movePieces(clickID);
  calcClickPoints(-1);
  draw();
  addTweetButton(false);
  setRedoData();
}

let timerRandom;
let bRandomInterval = false;
let elemRangeRandom;
function setTimerRandom(event) {
  let randomSpeed = Number(550 - elemRangeRandom.value);
  timerRandom = setInterval('moveRandom()', randomSpeed);
}
function onButtonClickRandomInterval(event) {
  // iOSで連続でボタンを押しているとダブルクリック判定されて
  // 画面が移動してしまったりするので。
  event.preventDefault();
  if (!bRandomInterval) {
    bRandomInterval = true;
    setTimerRandom();
  }
}
function onButtonClickRandomIntervalStop(event) {
  event.preventDefault();
  bRandomInterval = false;
  clearInterval(timerRandom);
}
function oninputRange(event) {
  event.preventDefault();
  if (bRandomInterval) {
    clearInterval(timerRandom);
    setTimerRandom();
  }
}

function onButtonClickRandom(event) {
  event.preventDefault();
  moveRandom();
}

function loadData(dataStr) {
  init();
  let calculatedFlag = true;
  for (let i = 0; i < dataStr.length; i++) {
    let code = dataStr.charCodeAt(i);
    let clickID = 0;
    if (48 <= code && code <= 57) { // 0-9
      clickID = code - 48;
    } else if (65 <= code && code <= 90) { // A-Z
      clickID = code - 65 + 10;
    } else if (97 <= code && code <= 122) { // a-z
      clickID = code - 97 + 36;
    } else if (dataStr.charAt(i) == '(') {
      while (i != dataStr.length - 1 && dataStr.charAt(++i) != ')') {
        clickID *= 10;
        clickID += dataStr.charCodeAt(i) - 48;
      }
    } else if (dataStr.charAt(i) == '.') {
      calcClickPoints(-1);
      calculatedFlag = true;
      clickID = Math.floor(Math.random() * clickPoints.length);
    } else if (dataStr.charAt(i) == '\n' ||
               dataStr.charAt(i) == '\r' ||
               dataStr.charAt(i) == '\t' ||
               dataStr.charAt(i) == ' ') {
      continue;
    } else {
      window.alert((i+1) + '文字目(' + dataStr.charAt(i) + ')が想定外です。');
      break;
    }

    if (calculatedFlag) {
      calculatedFlag = false;
    } else {
      calcClickPoints(clickID);
    }
    if (clickPoints[clickID] == null) {
      window.alert((i+1) + '文字目(' + dataStr.charAt(i) + ')が不正です。\n');
      break;
    }
    movePieces(clickID);
  }
  calcClickPoints(-1);
  draw();
  addTweetButton(false);
}

function setRedoData() {
  dataRedo = dataCurrent;
  redoCount = clickCount;
  document.getElementById('buttonRedo').style.visibility = 'hidden';
}

// ======================================================================
// セーブデータ
function onButtonClickSavedataLoad(event) {
  event.preventDefault();
  let dataStr = document.getElementById('TextareaSavedata').value;
  console.time('LoadTimer');
  loadData(dataStr);
  setRedoData();
  console.timeEnd('LoadTimer');
}

function onButtonClickSavedataUndo(event) {
  event.preventDefault();
  let dataStr = dataCurrent;
  if (dataStr.length == 0) {
    window.alert('0手目です。Undoできません。');
  } else {
    let len = dataStr.length - 1;
    if (dataStr[len] == ')') {
      while (!(dataStr[len] == '(' || len == 0)) {
        len--;
      }
    }
    loadData(dataStr.substr(0, len));
    document.getElementById('buttonRedo').style.visibility = 'visible';
  }
}

function onButtonClickSavedataRedo(event) {
  event.preventDefault();
  if (dataRedo.indexOf('(') == -1) {
    if (dataRedo.length <= clickCount) {
      window.alert('これ以上Redoできません。');
    } else {
      loadData(dataRedo.substr(0, clickCount + 1));
    }
  } else {
    let len = 0;
    let count = 0;
    while (count++ != clickCount + 1) {
      if (len > dataRedo.length) {
        window.alert('これ以上Redoできません。');
        return;
      }
      if (dataRedo[len] == '(') {
        while (len != dataRedo.length - 1 && dataRedo[++len] != ')') ;
      }
      len++;
    }
    loadData(dataRedo.substr(0, len));
  }

  if (redoCount == clickCount) {
    document.getElementById('buttonRedo').style.visibility = 'hidden';
  }
}

// ======================================================================
// オプション
function onRadioButtonChangeTarget() {
  let scrollDistance = -Math.max.apply(null, [
    document.body.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.documentElement.clientHeight]);
  updateTargetLocation();
  scrollDistance += Math.max.apply(null, [
    document.body.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.documentElement.clientHeight]);
  scrollBy(0, scrollDistance);
  draw();
}

function onCheckboxChangeColoredProperPieces() {
  updateColordProperPieces();
  draw();
}
function onCheckboxChangeShowPoints() {
  updateShowPoints();
  draw();
}
function onCheckboxChangeShowLozenge() {
  updateShowLogenzes();
  draw();
}
function onCheckboxChangeShowLines() {
  updateShowLines();
  draw();
}
function onCheckboxChangeShowUnusedPieces() {
  updateShowUnusedPieces();
  draw();
}

function onCheckboxChangeShowIndex() {
  updateShowIndex();
  draw();
}
function removeShapeImage() {
  bShapeImage = false;
  document.getElementById('myFileImg').innerHTML = '';
}
function onRadioButtonChangeShape() {
  updateShapeType();
  removeShapeImage();
  draw();
}
function onCheckboxChangeShowTweetButton() {
  updateShowTweetButton();
}

function onButtonClickResetShape(event) {
  event.preventDefault();
  let elems = document.getElementsByName('radioButtonShape');
  let num = elems.length;
  for (let i = 0; i < num; i++) {
    elems[i].checked = false;
  }
  onRadioButtonChangeShape();
}

function onButtonClickUncheckAll(event) {
  event.preventDefault();
  document.getElementById('radioButtonTargetTopLeft').checked = false;
  document.getElementById('radioButtonTargetFront').checked = false;
  document.getElementById('radioButtonTargetBack').checked = false;
  document.getElementById('radioButtonTargetOther').checked = false;
  document.getElementById('checkboxColoredProperPieces').checked = false;
  document.getElementById('checkboxShowPoints').checked = false;
  document.getElementById('checkboxShowLozenge').checked = false;
  document.getElementById('checkboxShowUnusedPieces').checked = false;
  document.getElementById('checkboxShowIndex').checked = false;
  document.getElementById('checkboxShowLines').checked = false;
  onButtonClickResetShape(event);

  onRadioButtonChangeTarget();
  onCheckboxChangeColoredProperPieces();
  onCheckboxChangeShowPoints();
  onCheckboxChangeShowLozenge();
  onCheckboxChangeShowUnusedPieces();
  onCheckboxChangeShowIndex();
  onCheckboxChangeShowLines();
  onRadioButtonChangeShape();
}


// ======================================================================
// レベル
function onRadioButtonChangeLevel() {
  if (document.getElementById('radioButtonModeNormal').checked) {
    num = 12;
  } else if (document.getElementById('radioButtonModeEasy').checked) {
    num = 6;
  }
  numChanged();
}
let selectLevel = document.getElementById('selectLevel');
selectLevel.onchange = function() {
  let selectedItem = this.options[this.selectedIndex];
  num = Number(selectedItem.value);
  numChanged();
};

// ======================================================================
let hueR = 120;
let hueCx;
let hueCy;
let hueMinR = hueR * 0.6;
let hueMaxR = hueR * 0.9;
let hueSplitNum = 12;
// let hueSplitNum = 120;
let ctxColor;
let canvasForColor;

let svSize = hueMinR * Math.sqrt(2);
let svX0;
let svY0;

function calcIndexColorText(c1) {
  function calcColorDistance(c1, c2) {
    return Math.abs((c1[0] - c2[0]) * 299 +
                    (c1[1] - c2[1]) * 587 +
                    (c1[2] - c2[2]) * 114) *
                      (Math.abs(c1[0] - c2[0]) +
                       Math.abs(c1[1] - c2[1]) +
                       Math.abs(c1[2] - c2[2]));
  }

  let diff = 0;
  let diffMax = 0;
  let c2;
  let c = [0, 0, 0];
  c2 = [0, 0, 0]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [255, 0, 0]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [0, 255, 0]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [0, 0, 255]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [0, 255, 255]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [255, 0, 255]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [255, 255, 0]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  c2 = [255, 255, 255]; diff = calcColorDistance(c1, c2); if (diff > diffMax) {
    diffMax = diff; c = c2;
  }
  return 'rgba('+(c[0])+','+(c[1])+','+(c[2])+','+1.0+')';
}

function hsv2rgb(h, s, v) {
  let ii = h / 60 + 60; // ここでiiがマイナスになるようなhには非対応です。
  v = Math.floor(v);
  let f = ii - Math.floor(ii);
  let p = Math.round(v*(1-(s/255)));
  let q = Math.round(v*(1-(s/255)*f));
  let t = Math.round(v*(1-(s/255)*(1-f)));
  switch (Math.floor(ii) % 6) {
  case 0: return [v, t, p];
  case 1: return [q, v, p];
  case 2: return [p, v, t];
  case 3: return [p, q, v];
  case 4: return [t, p, v];
  case 5: return [v, p, q];
  }
}

let hueDefault = 210;
let hueRadDefault = (hueDefault - 60) * Math.PI / 180 - Math.PI / 2;
let satDefault = 255;
let valDefault = 128;
let hueRad = hueRadDefault;
let hueValue = hueDefault;
let satValue = satDefault;
let valValue = valDefault;

let hueMode = false;
let svMode = false;

function getXYonColorCanvas(e) {
  let bcRect = canvasForColor.getBoundingClientRect();
  let x;
  let y;
  if (typeof e.touches !== 'undefined') {
    x = e.touches[0].clientX - bcRect.left;
    y = e.touches[0].clientY - bcRect.top;
  } else {
    x = e.clientX - bcRect.left;
    y = e.clientY - bcRect.top;
  }
  return [x, y];
}

function onColorSelectEnd() {
  hueMode = false;
  svMode = false;
}
function onColorSelectStart(e) {
  hueMode = false;
  svMode = false;
  let xy = getXYonColorCanvas(e);
  let x = xy[0];
  let y = xy[1];
  let rr = ((hueCx - x) * (hueCx - x) + (hueCy - y) * (hueCy - y));
  if (hueMinR * hueMinR < rr && rr < hueMaxR * hueMaxR) {
    hueMode = true;
  } else if (svX0 <= x && x <= svX0 + svSize &&
             svY0 <= y && y <= svY0 + svSize) {
    svMode = true;
  }
  onColorSelecting(e);
}
function onColorSelecting(e) {
  if (!hueMode && !svMode) return;
  e.preventDefault();

  let xy = getXYonColorCanvas(e);
  let x = xy[0];
  let y = xy[1];
  let f = false;
  if (hueMode) {
    f = true;
    let rad = Math.atan2(y - hueCy, x - hueCx);
    rad += Math.PI / 2; // (0, 1)を0度とするためにπ/2を足します。
    rad += Math.PI / hueSplitNum;
    let hueI = Math.floor(rad / (2 * Math.PI / hueSplitNum));
    hueRad = 2 * Math.PI / hueSplitNum * hueI - Math.PI / 2;
    hueValue = (360 * hueI / hueSplitNum + 60);
  } else if (svMode) {
    f = true;
    satValue = Math.max(0, Math.min(255, (x - svX0) / svSize * 255));
    valValue = Math.max(0, Math.min(255, 255 - (y - svY0) / svSize * 255));
  }
  if (f) {
    let rgb = hsv2rgb(hueValue, satValue, valValue);
    let rgbProper = hsv2rgb(hueValue, satValue / 2, (valValue + 255) / 2);

    colorFillProperPiece =
      'rgba(' + rgbProper[0] + ',' +
                rgbProper[1] + ',' +
                rgbProper[2] + ',' + 1.0 + ')';
    colorFillNormalPiece =
      'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + 1.0 + ')';
    colorStrokeLozenge =
      'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + 0.5 + ')';
    colorFillProperPieceIndex = calcIndexColorText(rgbProper);
    colorFillNormalPieceIndex = calcIndexColorText(rgb);

    ctxColor.clearRect(0, 0, canvasForColor.width, canvasForColor.height);
    drawHSV();
    draw();
  }
}

function drawHSV() {
  function drawSelectedCircle(x, y) {
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

  function drawHueCircle() {
    ctxColor.save();
    ctxColor.beginPath();
    ctxColor.arc(hueCx, hueCy, hueMinR, 2 * Math.PI, 0, true);
    ctxColor.arc(hueCx, hueCy, hueMaxR, 0, 2 * Math.PI, false);
    ctxColor.clip();

    for (let i = 0; i < hueSplitNum; ++i) {
      let currRad = 2 * Math.PI / hueSplitNum * (i - 0.5);
      let nextRad = 2 * Math.PI / hueSplitNum * (i + 0.5);
      let rgb = hsv2rgb((360 * i / hueSplitNum + 60), 255, 255);
      ctxColor.fillStyle = ctxColor.strokeStyle =
        'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';

      ctxColor.beginPath();
      ctxColor.moveTo(hueCx, hueCy);
      ctxColor.lineTo(hueCx + 2 * hueR * Math.sin(currRad),
                      hueCy - 2 * hueR * Math.cos(currRad));
      ctxColor.lineTo(hueCx + 2 * hueR * Math.sin(nextRad),
                      hueCy - 2 * hueR * Math.cos(nextRad));
      ctxColor.lineTo(hueCx, hueCy);
      ctxColor.fill();
      ctxColor.stroke();
    }
    ctxColor.restore();
  }

  function drawHSVStroke() {
    ctxColor.strokeStyle = '#888888';

    // H
    ctxColor.beginPath();
    ctxColor.arc(hueCx, hueCy, hueMinR, 2 * Math.PI, 0, true);
    ctxColor.stroke();
    ctxColor.beginPath();
    ctxColor.arc(hueCx, hueCy, hueMaxR, 0, 2 * Math.PI, true);
    ctxColor.stroke();

    // SV
    ctxColor.strokeRect(svX0, svY0, svSize, svSize);
  }

  function drawSVRect() {
    ctxColor.save();
    let satGrad = ctxColor.createLinearGradient(svX0, 0, svX0 + svSize, 0);
    satGrad.addColorStop(0.0, '#FFFFFF');
    let color = hsv2rgb(hueValue, 255, 255);
    satGrad.addColorStop(1.0, 'rgb('+color[0]+','+color[1]+','+color[2]+')');
    ctxColor.fillStyle = satGrad;
    ctxColor.fillRect(svX0, svY0, svSize, svSize);

    let valGrad = ctxColor.createLinearGradient(0, svY0, 0, svY0 + svSize);
    valGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    valGrad.addColorStop(1.0, 'rgba(0, 0, 0, 1)');
    ctxColor.fillStyle = valGrad;
    ctxColor.fillRect(svX0, svY0, svSize, svSize);

    drawSelectedCircle(svX0 + satValue / 255 * svSize,
                       svY0 + svSize - valValue / 255 * svSize);
    ctxColor.restore();
  }

  drawHueCircle();
  drawSVRect();
  drawHSVStroke();
  let r = (hueMinR + hueMaxR) / 2;
  drawSelectedCircle(hueCx + r * Math.cos(hueRad),
                     hueCy + r * Math.sin(hueRad));
}


function drawColorSelector() {
  ctxColor = document.getElementById('canvasForColor').getContext('2d');
  canvasForColor = document.getElementById('canvasForColor');
  hueCx = canvasForColor.width / 2;
  hueCy = canvasForColor.height / 2;
  svX0 = hueCx - svSize / 2;
  svY0 = hueCy - svSize / 2;

  canvasForColor.addEventListener(
    isSmartPhone ? 'touchstart' : 'mousedown', onColorSelectStart, false);
  canvasForColor.addEventListener(
    isSmartPhone ? 'touchmove' : 'mousemove', onColorSelecting, false);
  canvasForColor.addEventListener(
    isSmartPhone ? 'touchend' : 'mouseup', onColorSelectEnd, false);
  if (!isSmartPhone) {
    canvasForColor.addEventListener('mouseout', onColorSelectEnd, false);
  }
  drawHSV();
}

function onButtonClickDefaultColor() {
  ctxColor.clearRect(0, 0, canvasForColor.width, canvasForColor.height);
  colorFillProperPiece = colorFillProperPieceDefault;
  colorFillNormalPiece = colorFillNormalPieceDefault;
  colorStrokeLozenge = colorStrokeLozengeDefault;
  colorFillUnusedPieceIndex = colorFillUnusedPieceIndexDefault;
  colorFillProperPieceIndex = colorFillProperPieceIndexDefault;
  colorFillNormalPieceIndex = colorFillNormalPieceIndexDefault;

  hueRad = hueRadDefault;
  hueValue = hueDefault;
  satValue = satDefault;
  valValue = valDefault;
  drawColorSelector();
  draw();
}

// vim:set expandtab ts=2 sw=2 sts=2:
