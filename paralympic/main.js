(function() {
  'use strict';

  let elemCanvas;
  let elemDec;
  let elemInc;
  let ctx;

  const colorLozenge = '#5599DD';

  let num = 12; // ベースとなる多角形の頂点数 (正num角形ベース)
  let numMax = 150;
  let scale;
  let L = [];
  let rects = [];
  let r = [];
  let rr = [];

  let rot_x = 0;
  let rot_y = 0;

  const bTypeColoring = false;

  let countStep1 = 0;
  let countStep2 = 0;
  let countStep2Total = 30;

  let rots = [];
  let cxs = [];
  let cys = [];
  let removeFlags = [];
  let rotateFlags = [];

  let timer;

  let centerX;
  let centerY;

  const OptionType = {
    checkbox: 1,
    radio: 2,
  };

  // for Options
  const options = {
    drawStyle: {type: OptionType.radio, onchange: update},
    showLozenges: {type: OptionType.checkbox, onchange: update},
  };

  window.onload = function() {
    initOptions();

    elemCanvas = document.getElementById('myCanvas');
    elemDec = document.getElementById('buttonDec');
    elemInc = document.getElementById('buttonInc');
    elemDec.addEventListener('click', decNum, false);
    elemInc.addEventListener('click', incNum, false);

    update();
  };

  // オプションの初期化
  function initOptions() {
    for (const optionName in options) {
      const optionType = options[optionName].type;
      const optionOnchange = options[optionName].onchange;
      switch (optionType) {
      case OptionType.checkbox:
        {
          const elem = document.getElementById(`options-${optionName}`);
          options[optionName] = elem.checked;
          elem.addEventListener(
            'change',
            function() {
              options[optionName] = elem.checked;
              optionOnchange();
            },
            false
          );
        }
        break;
      case OptionType.radio:
        {
          const elems = document.getElementsByName(`options-${optionName}`);
          for (const elem of elems) {
            if (elem.checked) {
              options[optionName] = elem.value;
            }
            elem.addEventListener(
              'change',
              function() {
                if (elem.checked) {
                  options[optionName] = elem.value;
                }
                optionOnchange();
              },
              false
            );
          }
        }
        break;
      }
    }
  }

  function update() {
    clearTimeout(timer);
    document.getElementById('num').innerHTML = num + '角形ベース';

    let csize = document.documentElement.clientWidth;
    if (csize <= 0) csize = 400;
    if (csize > 400) csize = 400;
    document.getElementById('container').setAttribute('width', csize);

    elemCanvas.setAttribute('width', csize);
    elemCanvas.setAttribute('height', csize);

    centerX = elemCanvas.width / 2;
    centerY = elemCanvas.height / 2;
    ctx = elemCanvas.getContext('2d');
    ctx.fillStyle = '#004080';
    ctx.translate(centerX, centerY);

    scale = centerX * 3 / 2 / num;
    if (options.drawStyle == 'slow') {
      countStep1 = 0;
      countStep2 = 0;
    } else {
      countStep2 = countStep2Total + 1;
    }

    let points = [];
    for (let i = 0; i < num; i++) {
      points[i] = {
        x: scale * Math.cos(2.0 * Math.PI * i / num),
        y: scale * Math.sin(2.0 * Math.PI * i / num),
      };
    }
    for (let i = 0; i < num / 2; i++) {
      let dx = points[0].x - points[i + 1].x;
      let dy = points[0].y - points[i + 1].y;
      L[i] = Math.sqrt(dx * dx + dy * dy);
    }
    for (let i = 0; i < num / 2 - 1; i++) {
      //θ=0でのw, h
      let w = L[num / 2 - 2 - i];
      let h = L[i];
      rects[i] = {w: w, h: h};
    }
    r[0] = L[num / 2 - 2];
    for (let i = 1; i < num / 2 - 1; i++) {
      r[i] =
        Math.pow(
          Math.pow(r[i - 1] + rects[i - 1].w / 2.0, 2.0) +
            Math.pow(rects[i - 1].h / 2.0, 2.0) -
            Math.pow(rects[i].h / 2.0, 2.0),
          0.5
        ) +
        rects[i].w / 2.0;
    }
    rr[0] = L[num / 2 - 1] / 2.0;
    for (let i = 1; i < num / 2; i++) {
      rr[i] = Math.pow(
        Math.pow(
          Math.pow(
            Math.pow(rr[i - 1], 2.0) - Math.pow(rects[i - 1].h / 2.0, 2.0),
            0.5
          ) + rects[i - 1].w,
          2.0
        ) + Math.pow(rects[i - 1].h / 2.0, 2.0),
        0.5
      );
    }

    rot_x = centerX;
    rot_y =
      (Math.pow(
        Math.pow(rr[num / 2 - 1], 2.0) - Math.pow(r[0] / 2.0, 2.0),
        0.5
      ) +
        rects[0].h / 2.0) /
        2.0 +
      centerY;

    for (let j = 0; j < num / 2 - 1; j++) {
      for (let i = 0; i < num; i++) {
        let index = i * 2 + (j % 2 == 0 ? 0 : 1);
        let rot = 2.0 * Math.PI * index / (num * 2);
        let cx = r[j] * Math.cos(rot) + centerX;
        let cy = r[j] * Math.sin(rot) + centerY;

        const idx = i * num + j;
        cxs[idx] = cx;
        cys[idx] = cy;
        rots[idx] = rot;
        rotateFlags[idx] = false;
        removeFlags[idx] = false;
        if (j + 1 < index && index < num - j) {
          // 下側の回転すべき場所
          rotateFlags[idx] = true;
        } else if (num + j < index && index < 2 * num - j) {
          // 上側の消えるべき場所
          removeFlags[idx] = true;
        }
      }
    }
    draw();
  }

  function drawRect(idx) {
    let rectType = idx % num;
    let cx = cxs[idx];
    let cy = cys[idx];
    let rot = rots[idx];
    let rotateFlag = rotateFlags[idx];
    let removeFlag = removeFlags[idx];

    ctx.save();
    if (removeFlag) {
      if (bTypeColoring) {
        ctx.fillStyle = '#F0B0B0';
      }
      if (countStep2 > 0) {
        let a;
        if (countStep2 > countStep2Total) {
          a = 0;
          //return;
        } else {
          a = (countStep2Total - countStep2) / countStep2Total;
          //ctx.globalAlpha = a;
        }
        ctx.fillStyle = 'rgba(0, 64, 128, ' + a + ')'; // "#004080" + α
      }
    } else if (rotateFlag) {
      if (bTypeColoring) {
        ctx.fillStyle = '#90F0B0';
      }
      if (countStep2 > 0) {
        let rot_add = 0.0;
        if (countStep2 > countStep2Total) {
          rot_add = Math.PI;
        } else {
          rot_add = Math.PI * countStep2 / countStep2Total;
        }
        let cx_old = cx;
        let cy_old = cy;
        cx =
          (cx_old - rot_x) * Math.cos(rot_add) +
          (cy_old - rot_y) * Math.sin(-rot_add) +
          rot_x;
        cy =
          (cx_old - rot_x) * Math.sin(rot_add) +
          (cy_old - rot_y) * Math.cos(rot_add) +
          rot_y;
        rot += rot_add;
      }
    } else {
      if (bTypeColoring) {
        ctx.fillStyle = '#90B0F0';
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillRect(
      -rects[rectType].w / 2,
      -rects[rectType].h / 2,
      rects[rectType].w,
      rects[rectType].h
    );

    if (options.showLozenges) {
      ctx.strokeStyle = colorLozenge;
      ctx.beginPath();
      ctx.moveTo(0, rects[rectType].h);
      ctx.lineTo(rects[rectType].w, 0);
      ctx.lineTo(0, -rects[rectType].h);
      ctx.lineTo(-rects[rectType].w, 0);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(-centerX, -centerY, elemCanvas.width, elemCanvas.height);
    const isSlow = options.drawStyle == 'slow';

    let bStep1Finished = false;
    for (let j = 0; j < num / 2 - 1; j++) {
      for (let i = 0; i < num; i++) {
        if (isSlow && j * num + i >= countStep1) {
          continue;
        }
        drawRect(i * num + j);
        if (j == num / 2 - 2 && i == num - 1) {
          bStep1Finished = true;
        }
      }
    }

    if (isSlow) {
      if (bStep1Finished) {
        if (countStep2 <= countStep2Total) {
          countStep2++;
        }
      }
      countStep1 += Math.floor(num * num / 169) + 1;
    }

    if (isSlow) {
      if (countStep2 <= countStep2Total) {
        timer = setTimeout(function() {
          draw();
        }, 40);
      }
    }
  }

  function incNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    elemDec.style.visibility = 'visible';
    if (num < numMax) {
      num += 2;
      if (num == numMax) {
        elemInc.style.visibility = 'hidden';
      }
      update();
    }
  }

  function decNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    elemInc.style.visibility = 'visible';
    if (num > 4) {
      num -= 2;
      if (num == 4) {
        elemDec.style.visibility = 'hidden';
      }
      update();
    }
  }
})();
