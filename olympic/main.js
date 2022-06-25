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

  let rot1_x = [];
  let rot1_y = [];
  let rot2_x = [];
  let rot2_y = [];

  const bTypeColoring = false;

  let countStep1 = 0;
  let countStep2 = 0;
  let countStep3 = 0;
  let countStep2Total = 30;
  let countStep3Total = 30;

  let rots = [];
  let cxs = [];
  let cys = [];
  let removeFlags = [];
  let typeNums = [];

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
    ctx.fillStyle = '#004080';
    ctx.translate(centerX, centerY);

    scale = centerX * 3 / 2 / num;
    if (options.drawStyle == 'slow') {
      countStep1 = 0;
      countStep2 = 0;
      countStep3 = 0;
    } else {
      countStep2 = countStep2Total;
      countStep3 = countStep3Total;
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

    {
      let rx1 = 0.0;
      let ry1 =
        (Math.pow(
          Math.pow(rr[num / 2 - 1], 2.0) - Math.pow(r[0] / 2.0, 2.0),
          0.5
        ) +
          rects[0].h / 2.0) /
        2.0;
      for (let i = 0; i < 3; i++) {
        const theta = i * 2.0 * Math.PI / 3.0;
        rot1_x[i] = centerX + rx1 * Math.cos(theta) + ry1 * Math.sin(-theta);
        rot1_y[i] = centerY + rx1 * Math.sin(theta) + ry1 * Math.cos(theta);
      }
    }

    {
      let rx2_a = L[num / 6] / 2.0;
      let ry2_a = -Math.pow(
        Math.pow(rr[num / 6], 2.0) - Math.pow(rx2_a, 2.0),
        0.5
      );
      let rx2_b__ = -rx2_a;
      let ry2_b__ = ry2_a;
      let theta;
      theta = 2 * Math.PI / num;
      let rx2_b_ = rx2_b__ * Math.cos(theta) + ry2_b__ * Math.sin(-theta);
      let ry2_b_ = rx2_b__ * Math.sin(theta) + ry2_b__ * Math.cos(theta);
      theta = Math.PI / 3;
      let cx_b = rot1_x[2] - centerX;
      let cy_b = rot1_y[2] - centerY;
      let rx2_b =
        (rx2_b_ - cx_b) * Math.cos(theta) +
        (ry2_b_ - cy_b) * Math.sin(-theta) +
        cx_b;
      let ry2_b =
        (rx2_b_ - cx_b) * Math.sin(theta) +
        (ry2_b_ - cy_b) * Math.cos(theta) +
        cy_b;
      let rx2 = (rx2_a + rx2_b) / 2;
      let ry2 = (ry2_a + ry2_b) / 2;
      for (let i = 0; i < 3; i++) {
        const theta = (i + 1) * 2.0 * Math.PI / 3.0;
        rot2_x[i] = centerX + rx2 * Math.cos(theta) + ry2 * Math.sin(-theta);
        rot2_y[i] = centerY + rx2 * Math.sin(theta) + ry2 * Math.cos(theta);
      }
    }

    for (let j = 0; j < num / 2 - 1; j++) {
      for (let i = 0; i < num; i++) {
        const index = i * 2 + (j % 2 == 0 ? 0 : 1);
        let typeNum = 0;
        let removeFlag = false;
        if (j + 1 < index && index < j + 1 + num / 6 * 2 && index < num - j) {
          typeNum = 1;
        } else if (
          j + 1 < index - num * 2 / 3 &&
          index - num * 2 / 3 < j + 1 + num / 6 * 2 &&
          index - num * 2 / 3 < num - j
        ) {
          typeNum = 2;
        } else if (
          j + 1 < index - num * 4 / 3 &&
          index - num * 4 / 3 < j + 1 + num / 6 * 2 &&
          index - num * 4 / 3 < num - j
        ) {
          typeNum = 3;
        } else if (j + 1 < index && index < num - j) {
          typeNum = 1;
          removeFlag = true;
        } else if (
          j + 1 < index - num * 2 / 3 &&
          index - num * 2 / 3 < num - j
        ) {
          typeNum = 2;
          removeFlag = true;
        } else if (
          j + 1 < index - num * 4 / 3 &&
          index - num * 4 / 3 < num - j
        ) {
          typeNum = 3;
          removeFlag = true;
        } else if (
          j + 1 < index + num * 2 / 3 &&
          index + num * 2 / 3 < num - j
        ) {
          typeNum = 1;
          removeFlag = true;
        }

        for (let n = 0; n < 3; n++) {
          if (
            j + 1 < index - num * 2 * n / 3 &&
            index - num * 2 * n / 3 < num / 3 + 1 - j
          ) {
            removeFlag = false;
            typeNum += 3;
          }
        }

        const index2 = i * 2 + (j % 2 == 0 ? 0 : 1);
        const rot = 2.0 * Math.PI * index2 / (num * 2);
        const cx = r[j] * Math.cos(rot) + centerX;
        const cy = r[j] * Math.sin(rot) + centerY;

        const idx = i * num + j;
        cxs[idx] = cx;
        cys[idx] = cy;
        rots[idx] = rot;
        removeFlags[idx] = removeFlag;
        typeNums[idx] = typeNum;
      }
    }
    draw();
  }

  function drawRect(idx) {
    const rectType = idx % num;
    const removeFlag = removeFlags[idx];
    const typeNum = typeNums[idx];
    let cx = cxs[idx];
    let cy = cys[idx];
    let rot = rots[idx];

    ctx.save();
    if (removeFlag) {
      if (bTypeColoring) {
        ctx.fillStyle = '#F0B0B0';
      }
      if (countStep2 > 0) {
        if (countStep2 >= countStep2Total) {
          return;
        }

        const a = (countStep2Total - countStep2) / countStep2Total;
        ctx.fillStyle = `rgba(0, 64, 128, ${a})`; // "#004080" + α
      }
    } else if (typeNum == 0) {
      if (bTypeColoring) {
        ctx.fillStyle = '#90B0F0';
      }
    } else {
      if (bTypeColoring) {
        if (typeNum <= 3) {
          ctx.fillStyle = '#90F0B0';
        } else {
          ctx.fillStyle = '#909090';
        }
      }
      let posIdx = (typeNum - 1) % 3;
      if (countStep2 > 0) {
        let rot_add = 0.0;
        const rot_max = Math.PI / 3;
        if (countStep2 >= countStep2Total) {
          rot_add = rot_max;
        } else {
          rot_add = rot_max * countStep2 / countStep2Total;
        }
        const cx_old = cx;
        const cy_old = cy;
        cx =
          (cx_old - rot1_x[posIdx]) * Math.cos(rot_add) +
          (cy_old - rot1_y[posIdx]) * Math.sin(-rot_add) +
          rot1_x[posIdx];
        cy =
          (cx_old - rot1_x[posIdx]) * Math.sin(rot_add) +
          (cy_old - rot1_y[posIdx]) * Math.cos(rot_add) +
          rot1_y[posIdx];
        rot += rot_add;
      }
      if (countStep3 > 0 && typeNum > 3) {
        let rot_add = 0.0;
        const rot_max = Math.PI;
        if (countStep3 >= countStep3Total) {
          rot_add = rot_max;
        } else {
          rot_add = rot_max * countStep3 / countStep3Total;
        }
        const cx_old = cx;
        const cy_old = cy;
        cx =
          (cx_old - rot2_x[posIdx]) * Math.cos(rot_add) +
          (cy_old - rot2_y[posIdx]) * Math.sin(-rot_add) +
          rot2_x[posIdx];
        cy =
          (cx_old - rot2_x[posIdx]) * Math.sin(rot_add) +
          (cy_old - rot2_y[posIdx]) * Math.cos(rot_add) +
          rot2_y[posIdx];
        rot += rot_add;
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
        if (
          isSlow &&
          (num / 2 - 2) * num + num - 1 - (j * num + i) > countStep1
        ) {
          continue;
        }
        drawRect(i * num + j);
        if (j == 0 && i == 0) {
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
      if (countStep2 >= countStep2Total) {
        if (countStep3 <= countStep3Total) {
          countStep3++;
        }
      }
      countStep1 += Math.floor(num * num / 169) + 1;
    }

    if (isSlow) {
      if (countStep3 <= countStep3Total) {
        timer = setTimeout(draw, 40);
      }
    }
  }

  function incNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    elemDec.style.visibility = 'visible';
    if (num < numMax) {
      num += 6;
      if (num == numMax) {
        elemInc.style.visibility = 'hidden';
      }
      update();
    }
  }

  function decNum(event) {
    event.preventDefault(); //iOSで連続でボタンを押しているとダブルクリック判定されて画面が移動してしまったりするので。
    elemInc.style.visibility = 'visible';
    if (num > 6) {
      num -= 6;
      if (num == 6) {
        elemDec.style.visibility = 'hidden';
      }
      update();
    }
  }
})();
