// ===== PARTICLES =====
(function() {
  const c = document.getElementById('particles-canvas'), ctx = c.getContext('2d');
  let particles = [];
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize); resize();
  class P {
    constructor() { this.reset(); }
    reset() { this.x = Math.random()*c.width; this.y = Math.random()*c.height; this.s = Math.random()*2+0.5; this.sx = (Math.random()-0.5)*0.3; this.sy = (Math.random()-0.5)*0.3; this.o = Math.random()*0.4+0.1; this.h = Math.random()>0.5?30:0; }
    update() { this.x+=this.sx; this.y+=this.sy; if(this.x<0||this.x>c.width||this.y<0||this.y>c.height) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=`hsla(${this.h},60%,70%,${this.o})`; ctx.fill(); }
  }
  for(let i=0;i<60;i++) particles.push(new P());
  (function animate() { ctx.clearRect(0,0,c.width,c.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animate); })();
})();

// ===== NAV =====
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 50);
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

// ===== SCROLL ANIMATIONS =====
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in, .timeline-item').forEach(el => obs.observe(el));

// ===== WEBSOCKET =====
let ws = null;
let leaderboardData = [];

function connectWS() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${proto}//${location.host}`;
  try {
    ws = new WebSocket(url);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'leaderboard') {
        leaderboardData = msg.data;
        renderLeaderboard();
      }
    };
    ws.onclose = () => { setTimeout(connectWS, 3000); };
    ws.onerror = () => {};
  } catch(e) {}
}
connectWS();

function wsSend(obj) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
}

// ===== QR CODE =====
(async function initQR() {
  try {
    const res = await fetch('/api/server-info');
    const info = await res.json();
    const gameUrl = info.url + '#minigame';
    document.getElementById('qrUrl').textContent = gameUrl;
    new QRCode(document.getElementById('qrcode'), {
      text: gameUrl, width: 200, height: 200,
      colorDark: '#1a0a00', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch(e) {
    // Fallback: use current URL
    const gameUrl = location.href.split('#')[0] + '#minigame';
    document.getElementById('qrUrl').textContent = gameUrl;
    try {
      new QRCode(document.getElementById('qrcode'), {
        text: gameUrl, width: 200, height: 200,
        colorDark: '#1a0a00', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e2) {
      document.getElementById('qrcode').innerHTML = '<p style="padding:20px;color:#666;">QR không khả dụng</p>';
    }
  }
})();

// ===== QUIZ DATA (bám sát nội dung thuyết trình) =====
const quizData = [
  {
    q: "Theo phần \"Đặt vấn đề\", tư tưởng \"độc lập dân tộc\" của HCM trong bối cảnh hiện đại có thể liên hệ đến điều gì?",
    opts: ["Chỉ liên quan đến lịch sử", "Tự chủ tư duy, tài chính, kỹ năng của mỗi cá nhân", "Chỉ áp dụng cho lãnh đạo quốc gia", "Không còn phù hợp với thời đại"],
    answer: 1,
    explain: "Bài thuyết trình liên hệ \"độc lập dân tộc\" với tinh thần tự chủ cá nhân: tự chủ tư duy, tài chính, kỹ năng — đây là \"phiên bản cá nhân\" của độc lập."
  },
  {
    q: "Trong phần Cơ sở lý thuyết, HCM đã dẫn nguồn từ hai bản tuyên ngôn nổi tiếng nào để khẳng định quyền dân tộc?",
    opts: ["Tuyên ngôn Cộng sản & Hiến pháp Liên Xô", "Tuyên ngôn Độc lập Mỹ 1776 & Tuyên ngôn Nhân quyền Pháp 1791", "Hiến chương LHQ & Hiệp định Giơnevơ", "Công ước Quốc tế & Tuyên bố Cairo"],
    answer: 1,
    explain: "HCM mở đầu Tuyên ngôn Độc lập 1945 bằng việc trích dẫn Tuyên ngôn Độc lập Mỹ (1776) và Tuyên ngôn Nhân quyền Pháp (1791) để khẳng định quyền bình đẳng của các dân tộc."
  },
  {
    q: "Câu nói nào dưới đây thể hiện trụ cột \"Độc lập gắn liền hạnh phúc nhân dân\" trong bài thuyết trình?",
    opts: ["\"Không có gì quý hơn độc lập, tự do\"", "\"Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì\"", "\"Nước Việt Nam là một, dân tộc Việt Nam là một\"", "\"Đoàn kết, đoàn kết, đại đoàn kết\""],
    answer: 1,
    explain: "Đây là câu nói nổi tiếng của HCM, thể hiện rõ trụ cột thứ 2: độc lập phải đi đôi với cơm ăn, áo mặc, học hành cho nhân dân."
  },
  {
    q: "Theo timeline trong bài, sự kiện nào giúp HCM tìm ra con đường cách mạng vô sản?",
    opts: ["Chiến tranh thế giới thứ nhất (1914)", "CM Tháng Mười Nga 1917 & đọc Luận cương Lênin 1920", "Thành lập Đảng Cộng sản 1930", "Hội nghị Véc-xây 1919"],
    answer: 1,
    explain: "Theo timeline: CM Tháng Mười Nga (1917) ảnh hưởng sâu sắc, và năm 1920 khi đọc Luận cương Lênin, HCM \"vui mừng đến phát khóc lên\" — tìm ra con đường CMVS."
  },
  {
    q: "Chánh cương vắn tắt (1930) xác định mục tiêu gì, được nhấn mạnh trong phần lý thuyết?",
    opts: ["Xây dựng nền dân chủ tư sản", "Làm tư sản dân quyền CM và thổ địa CM để đi tới xã hội cộng sản", "Hợp tác với thực dân Pháp", "Chỉ đấu tranh giải phóng dân tộc"],
    answer: 1,
    explain: "Chánh cương vắn tắt (1930) gắn liền độc lập dân tộc với CNXH — đây là luận điểm then chốt trong bài thuyết trình."
  },
  {
    q: "Phần \"Cơ sở vận dụng\" nhấn mạnh rằng \"chủ quyền\" trong thời đại số bao gồm những gì?",
    opts: ["Chỉ là lãnh thổ, biên giới", "Chủ quyền dữ liệu, an ninh mạng, kinh tế số", "Chỉ là quân sự", "Chỉ là ngoại giao"],
    answer: 1,
    explain: "Bài thuyết trình mở rộng khái niệm chủ quyền: không chỉ lãnh thổ mà còn chủ quyền dữ liệu, an ninh mạng, kinh tế số — yêu cầu làm chủ công nghệ."
  },
  {
    q: "Nguyên tắc \"Hội nhập nhưng không hòa tan\" trong phần Vận dụng lấy cảm hứng từ đặc điểm nào của HCM?",
    opts: ["HCM chỉ học trong nước", "HCM tiếp thu tinh hoa Đông-Tây nhưng luôn giữ gốc dân tộc", "HCM không giao lưu quốc tế", "HCM chỉ theo một học thuyết duy nhất"],
    answer: 1,
    explain: "Bài thuyết trình liên hệ: như HCM tiếp thu Mác-Lênin, văn hóa phương Tây nhưng luôn giữ gốc dân tộc — VN hội nhập nhưng giữ bản sắc."
  },
  {
    q: "Bài học \"Giữ gốc, vươn xa\" trong phần Giải pháp ám chỉ điều gì?",
    opts: ["Không nên ra nước ngoài", "Giữ vững bản sắc, giá trị cốt lõi VN khi bước ra thế giới", "Chỉ tập trung phát triển trong nước", "Từ bỏ văn hóa truyền thống để hội nhập"],
    answer: 1,
    explain: "Như HCM ra đi tìm đường nhưng luôn hướng về Tổ quốc — mỗi cá nhân khi bước ra thế giới cần giữ vững giá trị cốt lõi, bản sắc VN."
  },
  {
    q: "Quan điểm \"xây đi đôi với chống\" của HCM được bài thuyết trình áp dụng cho cá nhân như thế nào?",
    opts: ["Chỉ xây dựng bản thân là đủ", "Xây dựng bản thân đồng thời chống thói xấu: chủ nghĩa cá nhân, lười biếng, lãng phí", "Chỉ cần chống lại kẻ thù bên ngoài", "Không liên quan đến cá nhân"],
    answer: 1,
    explain: "Bài học thứ 6: \"xây\" đi đôi với \"chống\" — xây dựng bản thân đồng thời chống lại những \"tác phong xấu\" như HCM đã dạy."
  },
  {
    q: "Theo bài thuyết trình, hệ thống động lực mạnh mẽ nhất của CNXH được tạo từ 3 yếu tố nào?",
    opts: ["Kinh tế, quân sự, ngoại giao", "Lợi ích của dân, dân chủ, đoàn kết toàn dân", "Đảng, Nhà nước, Quân đội", "Công nghiệp hóa, hiện đại hóa, đô thị hóa"],
    answer: 1,
    explain: "Trong tư tưởng HCM: lợi ích của dân, dân chủ của dân, đoàn kết toàn dân gắn bó hữu cơ — tạo nên hệ thống động lực mạnh mẽ nhất."
  }
];

// ===== GAME STATE =====
let currentQ = 0, score = 0, answered = false;
let timerInterval = null, startTime = 0, elapsedTime = 0;
let playerName = '';

function startGame() {
  const nameInput = document.getElementById('playerName');
  playerName = nameInput.value.trim();
  if (!playerName) { nameInput.style.borderColor = '#e74c3c'; nameInput.focus(); return; }

  document.getElementById('gameIntro').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';

  currentQ = 0; score = 0; elapsedTime = 0;
  startTime = Date.now();

  // Init progress dots
  const prog = document.getElementById('gameProgress');
  prog.innerHTML = '';
  for (let i = 0; i < quizData.length; i++) {
    const d = document.createElement('div');
    d.className = 'game-progress-dot';
    d.id = 'dot-' + i;
    prog.appendChild(d);
  }

  startTimer();
  loadQuestion();
}

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const m = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const s = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('timerValue').textContent = `${m}:${s}`;
  }, 200);
}

function loadQuestion() {
  answered = false;
  const q = quizData[currentQ];
  document.getElementById('gameQNum').textContent = `Câu ${currentQ + 1} / ${quizData.length}`;
  document.getElementById('gameQuestion').textContent = q.q;
  document.getElementById('gameScore').textContent = score;
  document.getElementById('gameTotalQ').textContent = quizData.length;

  const optC = document.getElementById('gameOptions');
  optC.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'game-option';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span>${opt}</span>`;
    btn.onclick = () => selectAnswer(i, btn);
    optC.appendChild(btn);
  });

  document.getElementById('gameExplanation').classList.remove('show');
  document.getElementById('gameNext').classList.remove('show');
  document.getElementById('dot-' + currentQ).classList.add('active');
}

function selectAnswer(idx, btn) {
  if (answered) return;
  answered = true;
  const q = quizData[currentQ];
  const allBtns = document.querySelectorAll('.game-option');
  allBtns.forEach(b => b.classList.add('disabled'));

  const dot = document.getElementById('dot-' + currentQ);
  dot.classList.remove('active');

  if (idx === q.answer) {
    btn.classList.add('correct');
    score++;
    document.getElementById('gameScore').textContent = score;
    dot.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    allBtns[q.answer].classList.add('correct');
    dot.classList.add('wrong');
  }

  const expl = document.getElementById('gameExplanation');
  expl.textContent = '💡 ' + q.explain;
  expl.classList.add('show');

  const nxt = document.getElementById('gameNext');
  nxt.textContent = currentQ < quizData.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆';
  nxt.classList.add('show');
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    showResult();
  }
}

function showResult() {
  document.getElementById('gameArea').style.display = 'none';
  const res = document.getElementById('gameResult');
  res.classList.add('show');

  const pct = Math.round((score / quizData.length) * 100);
  const m = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const s = String(elapsedTime % 60).padStart(2, '0');

  document.getElementById('resultScore').textContent = `${score} / ${quizData.length} (${pct}%)`;
  document.getElementById('resultTime').textContent = `⏱️ Thời gian: ${m}:${s}`;

  let icon, title, msg;
  if (pct >= 90) { icon = '🏆'; title = 'Xuất sắc!'; msg = 'Bạn hiểu rất sâu về tư tưởng HCM!'; }
  else if (pct >= 70) { icon = '🌟'; title = 'Rất giỏi!'; msg = 'Kiến thức rất vững! Tiếp tục phát huy!'; }
  else if (pct >= 50) { icon = '👍'; title = 'Khá tốt!'; msg = 'Hãy ôn lại Chương III để hiểu sâu hơn!'; }
  else { icon = '📖'; title = 'Cần cố gắng!'; msg = 'Đọc lại nội dung và thử lại nhé!'; }

  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMsg').textContent = msg;

  // Submit to leaderboard
  wsSend({ type: 'submit_score', data: { name: playerName, score, time: elapsedTime, total: quizData.length } });

  // Fallback: also store locally
  const local = JSON.parse(localStorage.getItem('hcm202_lb') || '[]');
  local.push({ name: playerName, score, time: elapsedTime, total: quizData.length, ts: Date.now() });
  local.sort((a, b) => b.score !== a.score ? b.score - a.score : a.time - b.time);
  localStorage.setItem('hcm202_lb', JSON.stringify(local.slice(0, 20)));
  if (!leaderboardData.length) { leaderboardData = local; renderLeaderboard(); }
}

function restartGame() {
  document.getElementById('gameResult').classList.remove('show');
  document.getElementById('gameIntro').style.display = 'block';
  document.getElementById('gameArea').style.display = 'none';
  document.querySelectorAll('.game-progress-dot').forEach(d => d.className = 'game-progress-dot');
}

function resetLeaderboard() {
  if (!confirm('Bạn có chắc muốn xóa bảng xếp hạng?')) return;
  wsSend({ type: 'reset' });
  localStorage.removeItem('hcm202_lb');
  leaderboardData = [];
  renderLeaderboard();
}

// ===== RENDER LEADERBOARD =====
function renderLeaderboard() {
  const data = leaderboardData;

  // Podium
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById('podium' + (i + 1));
    if (!el) continue;
    if (data[i]) {
      el.querySelector('.podium-name').textContent = data[i].name;
      const m = String(Math.floor(data[i].time / 60)).padStart(2, '0');
      const s = String(data[i].time % 60).padStart(2, '0');
      el.querySelector('.podium-score-text').textContent = `${data[i].score}/${data[i].total} • ${m}:${s}`;
    } else {
      el.querySelector('.podium-name').textContent = '---';
      el.querySelector('.podium-score-text').textContent = '--';
    }
  }

  // List
  const list = document.getElementById('lbList');
  const empty = document.getElementById('lbEmpty');

  // Remove old rows
  list.querySelectorAll('.lb-row').forEach(r => r.remove());

  if (!data.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  data.forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row';
    row.style.animationDelay = (i * 0.1) + 's';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
    const m = String(Math.floor(entry.time / 60)).padStart(2, '0');
    const s = String(entry.time % 60).padStart(2, '0');
    row.innerHTML = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-player">${entry.name}</span>
      <span class="lb-score-val">${entry.score}/${entry.total}</span>
      <span class="lb-time-val">⏱ ${m}:${s}</span>
    `;
    list.appendChild(row);
  });
}

// Init leaderboard from localStorage if no WS
setTimeout(() => {
  if (!leaderboardData.length) {
    const local = JSON.parse(localStorage.getItem('hcm202_lb') || '[]');
    if (local.length) { leaderboardData = local; renderLeaderboard(); }
  }
}, 2000);

// Auto-scroll to minigame if hash
if (location.hash === '#minigame') {
  setTimeout(() => {
    document.getElementById('minigame').scrollIntoView({ behavior: 'smooth' });
  }, 500);
}
