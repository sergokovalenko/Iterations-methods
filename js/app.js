const calcY = (c, d, m) => {
  const h = (d - c) / m;
  const result = [];

  for (let i = 0; i <= m; i++) {
    result.push(c + i * h);
  }

  return result;
}

window.onload = () => {
  const xiBlock = document.getElementById('xi');
  const yiBlock = document.getElementById('yi');
  const funcsBlock = document.getElementById('funcs');

  const yi = calcY(1, 2, 20);
  const funcs = calcFunctions('(tg(x))^2*x - yx', yi);
  // let results = calculateResultByIntervals(2, 3.5, yi);
  // let results = hordMethod(2, 3.5, yi);
  let results = NewtonMethod(2, yi);
  const resultsStr = convertResultToStrings(results, yi, funcs);

  xiBlock.innerText = resultsStr[0];
  yiBlock.innerText = resultsStr[1];
  funcsBlock.innerText = resultsStr[2];
};

function convertResultToStrings(xi, yi, funcs) {
  let xiStr = '';
  let yiStr = '';
  let funcsStr = ''

  for (let i = 0; i < xi.length; i++) {
    xiStr += `F(${yi[i].toFixed(3)}) = ${(xi[i]).toFixed(3)}\n`;
    yiStr += `y(${i}) = ${yi[i].toFixed(3)}\n`;
    funcsStr += `F = ${funcs[i]}\n`;
  }

  return [xiStr, yiStr, funcsStr];
}

function calcFunctions(func, yArray) {
  const result = [];

  for (let i = 0; i < yArray.length; i++) {
    result.push(func.replace('y', yArray[i].toFixed(3)));
  }

  return result;
}

const F = (x, y) => {
  return Math.tan(x) * Math.tan(x) - y * x;
}

function calculateResultByIntervals(a, b, yi, accurancy = 0.001) {
  let result = [];

  for (let i = 0; i < yi.length; i += 1) {
    getNewInterval(a, b, yi[i]);
  }

  function getNewInterval(a, b, y) {
    const c = (a + b) / 2;
    if (Math.abs(a - b) < accurancy) {
      result.push([a, b]);
      return;
    }

    const fc = F(c, y);
    const fa = F(a, y);
    const fb = F(b, y);

    if (fc * fa < 0) {
      getNewInterval(a, c, y);
    }

    if (fc * fb < 0) {
      getNewInterval(c, b, y);
    }
  }

  return getCorrectAnswer(result);
}

function getCorrectAnswer(arr) {
  const results = [];

  arr.forEach((el) => {
    if (el.length > 0) {
      if (el[0] < 0) {
        results.push(el[1]);
      } else {
        if (el[0] > el[1]) {
          results.push(el[0]);
        } else {
          results.push(el[1]);
        }
      }
    }
  });

  return results;
}

const calcNextValueForHords = (a, b, y) => {
  const fa = F(a, y);
  const fb = F(b, y);

  return b - fb * (b - a) / (fb - fa);
}

function hordMethod(left, right, yi, accurancy = 0.001) {
  const resultArr = [];

  for (let i = 0; i < yi.length; i++) {
    let a = left;
    let b = right;
    let prev = 0;
    b = calcNextValueForHords(a, b, yi[i]);

    while (Math.abs(b - prev) > accurancy) {
      prev = b;
      b = calcNextValueForHords(a, b, yi[i]);
    }

    resultArr.push(b);
  }

  return resultArr;
}

const FfirstDerivative = (x, y) => {
  return 2 * (Math.tan(x) * Math.tan(x) + 1) * Math.tan(x) - y;
}

const calcNextValueForNewton = (prev, y) => {
  return prev - F(prev, y) / FfirstDerivative(prev, y);
}

function NewtonMethod(start, yi, accurancy = 0.001) {
  const resultArr = [];

  for (let i = 0; i < yi.length; i++) {
    let prev = start + accurancy;
    let a = calcNextValueForNewton(start, yi[i]);

    while (Math.abs(a - prev) > accurancy) {
      prev = a;
      a = calcNextValueForNewton(a, yi[i]);
    }

    resultArr.push(a);
  }

  return resultArr;
}
