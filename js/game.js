
// // // /*
// // //   Theme-aware 60s math game with multiple choice.
// // // */
// // // export function makeGame(el, { theme = 'egg', level = 1, onUpdate = () => { }, onEnd = () => { } } = {}) {
// // //   const ranges = { 1: [0, 9], 2: [10, 50], 3: [50, 99] };
// // //   const [min, max] = ranges[level] || ranges[1];
// // //   let time = 60, score = 0, total = 0, wrongs = [], timerId = null;

// // //   el.innerHTML = `
// // //     <div class="card">
// // //       <div class="flex" style="justify-content:space-between">
// // //         <div class="kpi">⏱️ <strong data-t>60</strong>s</div>
// // //         <div class="kpi">✅ <strong data-s>0</strong> pts</div>
// // //         <div class="kpi">Lvl <strong>${level}</strong></div>
// // //       </div>
// // //       <div style="margin:50px 0" class="center">
// // //         <div style="font-size:28px;font-weight:700;line-height:1.25" data-q>—</div>
// // //         <div class="opt-grid" data-opts></div>
// // //         <div class="small" style="margin-top:8px" data-feedback></div>
// // //       </div>
// // //     </div>`;

// // //   const qEl = el.querySelector('[data-q]');
// // //   const tEl = el.querySelector('[data-t]');
// // //   const sEl = el.querySelector('[data-s]');
// // //   const optsEl = el.querySelector('[data-opts]');
// // //   const fb = el.querySelector('[data-feedback]');

// // //   function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
// // //   function pickNoun(theme) {
// // //     if (theme === 'egg') return ['egg', 'eggs', '🥚'];
// // //     if (theme === 'cook') return ['carrot', 'carrots', '🥕'];
// // //     if (theme === 'shop') return ['coin', 'coins', '🪙'];
// // //     return ['item', 'items', '•'];
// // //   }
// // //   function makeOptions(correct) {
// // //     const set = new Set([correct]);
// // //     while (set.size < 4) {
// // //       const delta = (Math.floor(Math.random() * 7) - 3) || 1;
// // //       set.add(correct + delta);
// // //     }
// // //     return [...set].sort(() => Math.random() - 0.5);
// // //   }
// // //   function generate(theme) {
// // //     const op = Math.random() < 0.5 ? '+' : '-';
// // //     let a = randInt(min, max), b = randInt(min, max);
// // //     if (op === '-' && a < b) { const t = a; a = b; b = t; }
// // //     const ans = op === '+' ? a + b : a - b;
// // //     const [sing, plural, emoji] = pickNoun(theme);
// // //     const nounA = a === 1 ? sing : plural;
// // //     const nounB = b === 1 ? sing : plural;
// // //     let text;
// // //     if (theme === 'egg') {
// // //       text = `${emoji} Basket has ${a} ${nounA}, you ${op === '+' ? 'find' : 'use'} ${b} ${nounB}. How many now?`;
// // //     } else if (theme === 'cook') {
// // //       text = `🍳 You have ${a} ${nounA}, ${op === '+' ? 'add' : 'use'} ${b} ${nounB} for the recipe. Total ${plural}?`;
// // //     } else if (theme === 'shop') {
// // //       text = `🏪 Wallet has ${a} ${nounA}, you ${op === '+' ? 'earn' : 'spend'} ${b} ${nounB}. How many left?`;
// // //     } else {
// // //       text = `${a} ${op} ${b} = ?`;
// // //     }
// // //     const options = makeOptions(ans);
// // //     const expr = `${a} ${op} ${b}`; // for analytics
// // //     return { text, ans, options, expr };
// // //   }
// // //   function renderQuestion() {
// // //     const q = generate(theme);
// // //     qEl.textContent = q.text;
// // //     qEl.dataset.ans = String(q.ans);
// // //     qEl.dataset.expr = q.expr;
// // //     optsEl.innerHTML = '';
// // //     q.options.forEach(opt => {
// // //       const b = document.createElement('button');
// // //       b.className = 'btn opt';
// // //       b.textContent = String(opt);
// // //       b.addEventListener('click', () => check(opt));
// // //       optsEl.appendChild(b);
// // //     });
// // //   }
// // //   function setOptsDisabled(disabled) { optsEl.querySelectorAll('button').forEach(b => b.disabled = disabled); }
// // //   function check(selected) {
// // //     const ans = Number(qEl.dataset.ans || '0');
// // //     total++;
// // //     if (Number(selected) === ans) {
// // //       score += 10; sEl.textContent = score; fb.textContent = 'Great! +10'; fb.style.color = 'var(--ok)';
// // //     } else {
// // //       wrongs.push(qEl.dataset.expr || ''); fb.textContent = `Missed! Correct = ${ans}`; fb.style.color = 'var(--bad)';
// // //     }
// // //     onUpdate({ score, total, wrongs }); renderQuestion();
// // //   }
// // //   function tick() { time--; tEl.textContent = time; if (time <= 0) { clearInterval(timerId); setOptsDisabled(true); onEnd({ score, total, wrongs }); } }
// // //   renderQuestion(); timerId = setInterval(tick, 1000);
// // //   return { getSummary: () => ({ score, total, wrongs }) };
// // // }

export function makeGame(el, { theme = 'egg', level = 1, onUpdate = () => { }, onEnd = () => { } } = {}) {
  const ranges = { 1: [1, 5], 2: [2, 9], 3: [5, 12] };
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
      </div>
    </div>`;

  const qEl = el.querySelector('[data-q]');
  const tEl = el.querySelector('[data-t]');
  const sEl = el.querySelector('[data-s]');
  const optsEl = el.querySelector('[data-opts]');
  const fb = el.querySelector('[data-feedback]');

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
        html += `<img src="${imgSrc}" alt="img" width="50" style="margin:2px"/>`;
      }
      return html;
    }

    const text = `
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <div class="flex items-center gap-1">
        ${repeatImages(a)}
      </div>
      <div style="font-weight:bold;color:#3b82f6;font-size:24px">${op}</div>
      <div class="flex items-center gap-1">
        ${repeatImages(b)}
      </div>
    </div>
    <!-- Numeric expression below images -->
    <div style="text-align:center;margin-top:10px;font-weight:bold;font-size:18px">
      ${a} ${op} ${b} = ?
    </div>
    <div id="drop-target" style="margin-top:10px;padding:10px;border:2px dashed #3b82f6;width:120px;height:60px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px">Drop Answer Here</div>
    <button id="next-btn" class="hidden mt-2 px-4 py-2 bg-green-500 text-white rounded">Next</button>
  `;

    const options = makeOptions(ans);
    const expr = `${a} ${op} ${b}`;
    return { text, ans, options, expr };
  }


  function renderQuestion() {
    if (gameOver) return;
    const q = generate(theme);
    qEl.innerHTML = q.text;
    qEl.dataset.ans = String(q.ans);
    qEl.dataset.expr = q.expr;
    optsEl.innerHTML = '';

    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'btn opt';
      b.textContent = String(opt);
      b.draggable
        = true;
      b.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', opt));
      optsEl.appendChild(b);
    });

    const dropTarget = document.getElementById('drop-target');
    const nextBtn = document.getElementById('next-btn');

    dropTarget.addEventListener('dragover', e => e.preventDefault());
    dropTarget.addEventListener('drop', e => {
      const val = Number(e.dataTransfer.getData('text/plain'));
      dropTarget.textContent = val; // keep dropped element
      nextBtn.classList.remove('hidden');
      nextBtn.onclick = () => {
        check(val);
      };
    });
  }

  function setOptsDisabled(disabled) {
    optsEl.querySelectorAll('button').forEach(b => b.disabled = disabled);
  }

  function check(selected) {
    const ans = Number(qEl.dataset.ans || '0');
    total++;
    if (Number(selected) === ans) {
      score += 10;
      sEl.textContent = score;
      fb.textContent = 'Great! +10';
      fb.style.color = 'var(--ok)';
    } else {
      wrongs.push(qEl.dataset.expr || '');
      fb.textContent = `Missed! Correct = ${ans}`;
      fb.style.color = 'var(--bad)';
    }
    onUpdate({ score, total, wrongs });
    renderQuestion();
  }

  function tick() {
    time--;
    tEl.textContent = time;
    if (time <= 0) {
      clearInterval(timerId);
      gameOver = true;
      setOptsDisabled(true);
      onEnd({ score, total, wrongs });
    }
  }

  renderQuestion();
  timerId = setInterval(tick, 1000);

  return { getSummary: () => ({ score, total, wrongs }) };
}
