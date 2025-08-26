
export function makeGame(el, { theme = 'egg', level = 1, onUpdate = () => { }, onEnd = () => { } } = {}) {
  const ranges = { 1: [1, 5], 2: [2, 6], 3: [5, 9] };
  const [min, max] = ranges[level] || ranges[1];
  let time = 60, score = 0, total = 0, wrongs = [], timerId = null, gameOver = false;

  // Images per theme – use correct paths or placeholder URLs
  const IMAGES = {
    egg: ['../../assets/bunnyp.jpg', '../assets/dragonp.jpg', '../assets/foxp.jpg', '../assets/griffinp.jpg', '../assets/owlp.jpg'],
    cook: ['../assets/carrot.jpg', '../assets/apple.jpg', '../assets/milk.jpg'],
    shop: ['../assets/gun.jpg', '../assets/bear.jpg', '../assets/robot.jpg', '../assets/car.jpg', '../assets/dinosaur.jpg', '../assets/dog.jpg']
  };

  el.innerHTML = `
    <div class="card">
      <div class="flex justify-between">
        <div class="kpi">⏱️ <strong data-t>60</strong>s</div>
        <div class="kpi">✅ <strong data-s>0</strong> pts</div>
        <div class="kpi">Lvl <strong>${level}</strong></div>
      </div>
      <div style="margin:30px 0" class="center">
        <div style="font-size:36px;font-weight:700;line-height:1.25" data-q>—</div>
        <div class="opt-grid" data-opts></div>
        <div class="small" style="margin-top:8px" data-feedback></div>
        <div class="flex justify-center mt-4">
        <button id="end-btn" class="btn bg-red-500 text-white px-4 py-2 rounded">End Game</button>
      </div>
      </div>
    </div>`;

  const qEl = el.querySelector('[data-q]');
  const tEl = el.querySelector('[data-t]');
  const sEl = el.querySelector('[data-s]');
  const optsEl = el.querySelector('[data-opts]');
  const fb = el.querySelector('[data-feedback]');
  const endBtn = el.querySelector('#end-btn');

  function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pickImage(theme) {
    const imgs = IMAGES[theme] || ['../assets/bunny.jpg'];
    return imgs[Math.floor(Math.random() * imgs.length)];
  }

  function makeOptions(correct) {
    const set = new Set([correct]);
    while (set.size < 4) {
      const delta = (Math.floor(Math.random() * 7) - 3) || 1;
      const val = Math.max(0, correct + delta);
      set.add(val);
    }
    return [...set].sort(() => Math.random() - 0.5);
  }

  function generate(theme) {
    const op = Math.random() < 0.5 ? '+' : '-';
    let a = randInt(min, max), b = randInt(min, max);
    if (op === '-' && a < b) [a, b] = [b, a];
    const ans = op === '+' ? a + b : a - b;

    const imgSrc = pickImage(theme);

    function repeatImages(count) {
      let html = '';
      for (let i = 0; i < count; i++) {
        html += `<img src="${imgSrc}" alt="img" width="60" style="margin:2px"/>`;
      }
      return html;
    }

    const text = `
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <div class="flex items-center gap-1">
        ${repeatImages(a)}
      </div>
      <div style="font-weight:bold;color:#3b82f6;font-size:50px">${op}</div>
      <div class="flex items-center gap-1">
        ${repeatImages(b)}
      </div>
    </div>
    <!-- Numeric expression below images -->
    <div style="text-align:center;margin-top:10px;font-weight:bold;font-size:40px">
      ${a} ${op} ${b} = ?
    </div>
    
  `;


    const options = makeOptions(ans);
    const expr = `${a} ${op} ${b}`;
    return { text, ans, options, expr };
  }


  function renderQuestion() {
    if (gameOver) return;

    // Stop if max questions reached
    if (total >= 12) {
      endGame();
      return;
    }

    const q = generate(theme);
    qEl.innerHTML = q.text;
    qEl.dataset.ans = String(q.ans);
    qEl.dataset.expr = q.expr;
    optsEl.innerHTML = '';

    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'btn opt';
      b.textContent = String(opt);
      //eta
      b.dataset.value = String(opt);

      // CLICK event
      b.addEventListener('click', () => check(b));
      //eta samma

      // // CLICK event instead of drag/drop
      // b.addEventListener('click', () => {
      //   check(opt); // send the clicked value to check()
      //   //nextBtn.classList.remove('hidden'); // show next button
      // });

      optsEl.appendChild(b);
    });

  }


  function setOptsDisabled(disabled) {
    optsEl.querySelectorAll('button').forEach(b => b.disabled = disabled);
  }

  // function check(selected) {
  //   const ans = Number(qEl.dataset.ans || '0');
  //   total++;
  //   if (Number(selected) === ans) {
  //     score += 10;
  //     sEl.textContent = score;
  //     fb.textContent = 'Great! +10';
  //     fb.style.color = 'var(--ok)';
  //     fb.style.fontSize = '2rem';
  //   } else {
  //     wrongs.push(qEl.dataset.expr || '');
  //     fb.textContent = `Missed! Correct = ${ans}`;
  //     fb.style.color = 'var(--bad)';
  //     fb.style.fontSize = '2rem';
  //   }
  //   onUpdate({ score, total, wrongs });
  //   renderQuestion();
  // }


  function check(selectedEl) {
    const ans = Number(qEl.dataset.ans || '0');
    const selected = Number(selectedEl.dataset.value);
    total++;

    // Disable all options
    setOptsDisabled(true);

    // Reset all buttons' colors first
    optsEl.querySelectorAll('button').forEach(b => {
      b.style.backgroundColor = '';
      b.style.color = '';
    });

    if (selected === ans) {
      score += 10;
      sEl.textContent = score;
      fb.textContent = 'Great! +10';
      fb.style.color = 'var(--ok)';
      fb.style.fontSize = '2rem';

      // Highlight correct option
      selectedEl.style.backgroundColor = 'green';
      selectedEl.style.color = 'white';
    } else {
      wrongs.push(qEl.dataset.expr || '');
      fb.textContent = `Missed! Correct = ${ans}`;
      fb.style.color = 'var(--bad)';
      fb.style.fontSize = '2rem';

      // Highlight wrong option clicked
      selectedEl.style.backgroundColor = 'red';
      selectedEl.style.color = 'white';

      // Highlight correct option
      const correctEl = optsEl.querySelector(`[data-value='${ans}']`);
      if (correctEl) {
        correctEl.style.backgroundColor = 'green';
        correctEl.style.color = 'white';
      }
    }

    onUpdate({ score, total, wrongs });

    // Automatically go to next question after 1 second
    setTimeout(renderQuestion, 1000);
  }

  function tick() {
    if (gameOver) return;
    time--;
    tEl.textContent = time;

    if (time <= 0) {
      clearInterval(timerId);
      gameOver = true;
      setOptsDisabled(true);
      onEnd({ score, total, wrongs });
      fb.textContent = `Time's up!`;
    }
  }
  function endGame() {
    if (gameOver) return;
    clearInterval(timerId);
    gameOver = true;
    setOptsDisabled(true);
    // award points to wallet
    const pts = score; // 1 pt per score
    addWallet(pts);
    onEnd({ score, total, wrongs });
    fb.textContent = `Game ended! You earned ${pts} pts.`;
  }

  // Add click handler for End button
  endBtn.addEventListener('click', endGame);

  renderQuestion();
  timerId = setInterval(tick, 1000);

  return { getSummary: () => ({ score, total, wrongs }) };
}
