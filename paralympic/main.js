(function() {
  'use strict';

  let elemCanvas;
  let elemDec;
  let elemInc;
  let ctx;

  const colorLozenge = '#58d';

  let num = 12; // ベースとなる多角形の頂点数 (正num角形ベース)
  const numDiff = 2;
  const numMin = 4;
  const numMax = 150;

  let rotX = 0;
  let rotY = 0;

  let countStep1 = 0;
  let countStep2 = 0;
  let countStep2Total = 30;

  let rects = [];
  let rots = [];
  let cxs = [];
  let cys = [];
  let removeFlags = [];
  let rotateFlags = [];

  let timerId;

  let centerX;
  let centerY;

  const OptionType = {
    checkbox: 1,
    radio: 2,
  };

  const options = {
    drawStyle: {type: OptionType.radio, onchange: update},
    showLozenges: {type: OptionType.checkbox, onchange: update},
    typeColoring: {type: OptionType.checkbox, onchange: update},
    showAllBlock: {type: OptionType.checkbox, onchange: update},
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
    clearTimeout(timerId);
    document.getElementById('num').innerHTML = `${num}角形ベース`;

    let csize = document.documentElement.clientWidth;
    if (csize <= 0) csize = 400;
    if (csize > 400) csize = 400;
    document.getElementById('container').setAttribute('width', csize);

    elemCanvas.setAttribute('width', csize);
    elemCanvas.setAttribute('height', csize);

    centerX = elemCanvas.width / 2;
    centerY = elemCanvas.height / 2;
    ctx = elemCanvas.getContext('2d');
    ctx.fillStyle = '#048';
    ctx.translate(centerX, centerY);

    const scale = centerX * 3 / 2 / num;
    if (options.drawStyle == 'slow') {
      countStep1 = 0;
      countStep2 = -10;
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
    const lengths = [];
    for (let i = 0; i < num / 2; i++) {
      let dx = points[0].x - points[i + 1].x;
      let dy = points[0].y - points[i + 1].y;
      lengths[i] = Math.sqrt(dx * dx + dy * dy);
    }
    for (let i = 0; i < num / 2 - 1; i++) {
      //θ=0でのw, h
      rects[i] = {w: lengths[num / 2 - 2 - i], h: lengths[i]};
    }

    const radius = [lengths[num / 2 - 2]];
    for (let i = 1; i < num / 2 - 1; i++) {
      radius[i] =
        Math.pow(
          Math.pow(radius[i - 1] + rects[i - 1].w / 2.0, 2.0) +
            Math.pow(rects[i - 1].h / 2.0, 2.0) -
            Math.pow(rects[i].h / 2.0, 2.0),
          0.5
        ) +
        rects[i].w / 2.0;
    }

    const radius2 = [lengths[num / 2 - 1] / 2.0];
    for (let i = 1; i < num / 2; i++) {
      radius2[i] = Math.pow(
        Math.pow(
          Math.pow(
            Math.pow(radius2[i - 1], 2.0) - Math.pow(rects[i - 1].h / 2.0, 2.0),
            0.5
          ) + rects[i - 1].w,
          2.0
        ) + Math.pow(rects[i - 1].h / 2.0, 2.0),
        0.5
      );
    }

    {
      rotX = centerX;
      rotY =
        (Math.pow(
          Math.pow(radius2[num / 2 - 1], 2.0) - Math.pow(radius[0] / 2.0, 2.0),
          0.5
        ) +
          rects[0].h / 2.0) /
          2.0 +
        centerY;
    }

    for (let j = 0; j < num / 2 - 1; j++) {
      for (let i = 0; i < num; i++) {
        const index = i * 2 + j % 2;
        let removeFlag = false;
        let rotateFlag = false;
        if (j + 1 < index && index < num - j) {
          // 下側の回転すべき場所
          rotateFlag = true;
        } else if (num + j < index && index < 2 * num - j) {
          // 上側の消えるべき場所
          removeFlag = true;
        }

        const rot = 2.0 * Math.PI * index / (num * 2);
        const cx = radius[j] * Math.cos(rot) + centerX;
        const cy = radius[j] * Math.sin(rot) + centerY;

        const idx = i * num + j;
        cxs[idx] = cx;
        cys[idx] = cy;
        rots[idx] = rot;
        removeFlags[idx] = removeFlag;
        rotateFlags[idx] = rotateFlag;
      }
    }
    draw();
  }

  function drawRect(idx) {
    const rectType = idx % num;
    const removeFlag = removeFlags[idx];
    const rotateFlag = rotateFlags[idx];
    let cx = cxs[idx];
    let cy = cys[idx];
    let rot = rots[idx];

    ctx.save();
    if (removeFlag) {
      if (options.typeColoring) {
        ctx.fillStyle = '#fbb';
      }
      if (countStep2 > 0) {
        let alpha;
        if (countStep2 >= countStep2Total) {
          alpha = 0.0;
        } else {
          alpha = (countStep2Total - countStep2) / countStep2Total;
        }
        if (options.showAllBlock) {
          alpha = Math.max(alpha, 0.25);
        }
        ctx.globalAlpha = alpha;
      }
    } else if (rotateFlag) {
      if (options.typeColoring) {
        ctx.fillStyle = '#8fb';
      }
      if (countStep2 > 0) {
        let rotAdd = 0.0;
        if (countStep2 > countStep2Total) {
          rotAdd = Math.PI;
        } else {
          rotAdd = Math.PI * countStep2 / countStep2Total;
        }
        const cxOld = cx;
        const cyOld = cy;
        cx =
          (cxOld - rotX) * Math.cos(rotAdd) +
          (cyOld - rotY) * Math.sin(-rotAdd) +
          rotX;
        cy =
          (cxOld - rotX) * Math.sin(rotAdd) +
          (cyOld - rotY) * Math.cos(rotAdd) +
          rotY;
        rot += rotAdd;
      }
    } else {
      if (options.typeColoring) {
        ctx.fillStyle = '#8bf';
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
        timerId = setTimeout(draw, 40);
      }
    }
  }

  function incNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    showElem(elemDec);
    if (num < numMax) {
      num += numDiff;
      if (num == numMax) {
        hideElem(elemInc);
      }
      update();
    }
  }

  function decNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    showElem(elemInc);
    if (num > numMin) {
      num -= numDiff;
      if (num == numMin) {
        hideElem(elemDec);
      }
      update();
    }
  }

  function showElem(elem) {
    elem.style.visibility = 'visible';
  }

  function hideElem(elem) {
    elem.style.visibility = 'hidden';
  }
})();
