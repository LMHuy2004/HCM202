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

// ===== QUIZ DATA =====
const quizData = [
  {
    q: "Theo Tư tưởng Hồ Chí Minh, độc lập dân tộc phải gắn liền với yếu tố nào để sự độc lập đó thực sự có ý nghĩa?",
    opts: ["Sự ủng hộ của quốc tế", "Tự do và hạnh phúc của nhân dân", "Sự phát triển của khoa học công nghệ", "Sức mạnh quân sự vững mạnh"],
    answer: 1,
    explain: "Bác Hồ khẳng định: \"Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.\" Độc lập phải gắn với tự do và hạnh phúc thực sự của nhân dân."
  },
  {
    q: "Chủ tịch Hồ Chí Minh từng nhấn mạnh nguyên tắc: \"Đem sức ta mà tự giải phóng cho ta\". Lời dạy này đề cao tinh thần nào trong cách mạng giải phóng dân tộc?",
    opts: ["Tranh thủ ngoại lực", "Tự lực tự cường", "Đoàn kết quốc tế", "Dựa vào sự giúp đỡ của nước lớn"],
    answer: 1,
    explain: "Người thức tỉnh tinh thần tự lực tự cường: \"Công cuộc giải phóng anh em chỉ có thể thực hiện được bằng sự nỗ lực của bản thân anh em.\" Đây là trụ cột 2.3 trong bài thuyết trình."
  },
  {
    q: "Trong bối cảnh toàn cầu hóa và kỷ nguyên số hiện nay, khái niệm \"độc lập, chủ quyền quốc gia\" được mở rộng thêm khía cạnh nào rất quan trọng?",
    opts: ["Chủ quyền không gian mạng và an ninh kinh tế", "Khép kín nền kinh tế để tự cung tự cấp", "Chỉ sử dụng công nghệ do trong nước tự sản xuất", "Từ chối mọi sự hợp tác quốc tế"],
    answer: 0,
    explain: "\"Chiến trường\" ngày nay không chỉ là lãnh thổ mà còn là kinh tế, công nghệ và dữ liệu số. Độc lập dân tộc hiện nay gắn với chủ quyền số quốc gia — an ninh mạng và kinh tế số."
  },
  {
    q: "Vận dụng bài học \"Tự lực tự cường\" của Bác vào môi trường học tập và làm việc toàn cầu, hành động nào sau đây của sinh viên là ĐÚNG đắn nhất?",
    opts: ["Tự cô lập, không giao tiếp với đồng nghiệp quốc tế", "Sao chép toàn bộ các mẫu thiết kế (template) của nước ngoài cho nhanh", "Phụ thuộc hoàn toàn vào trí tuệ nhân tạo (AI) để làm thay mọi việc", "Chủ động làm chủ công cụ, nâng cao năng lực chuyên môn và tư duy phản biện"],
    answer: 3,
    explain: "Bài học tự chủ cá nhân: chủ động học hỏi công nghệ, biết dùng AI hỗ trợ nhưng không phụ thuộc hay đánh mất tư duy phản biện và bản sắc văn hóa Việt Nam."
  },
  {
    q: "Theo tư tưởng Hồ Chí Minh về xây dựng chủ nghĩa xã hội, đâu là động lực lớn nhất và quan trọng nhất?",
    opts: ["Nguồn tài nguyên thiên nhiên phong phú", "Sự hỗ trợ tài chính từ quốc tế", "Con người (đề cao trí tuệ và năng lực của người lao động)", "Hệ thống máy móc hiện đại"],
    answer: 2,
    explain: "Hồ Chí Minh đề cao vai trò của con người — \"có dân là có tất cả\". Cách mạng là việc chung của toàn dân, sức mạnh nội lực từ trí tuệ và năng lực người lao động là quyết định."
  },
  {
    q: "Khi học hỏi kinh nghiệm xây dựng chủ nghĩa xã hội từ các nước tiên tiến, Bác Hồ đã đặc biệt lưu ý chúng ta điều gì?",
    opts: ["Phải sao chép y nguyên mô hình của họ", "Phải tránh rập khuôn, máy móc và cần xuất phát từ thực tiễn đất nước", "Phải từ bỏ hoàn toàn các giá trị truyền thống", "Chỉ học hỏi các nước có nền văn hóa tương đồng"],
    answer: 1,
    explain: "Độc lập phải là độc lập thật sự, hoàn toàn và triệt để — không rập khuôn máy móc. Tư tưởng HCM luôn gắn với thực tiễn Việt Nam, không sao chép nguyên vẹn mô hình nước ngoài."
  },
  {
    q: "Đối với một người trẻ khi làm việc trong các dự án quốc tế (như phát triển phần mềm, làm game...), làm thế nào để \"hội nhập nhưng không rập khuôn\" như lời Bác dạy?",
    opts: ["Bỏ qua các tiêu chuẩn kỹ thuật quốc tế để làm theo ý mình", "Chỉ sử dụng các chất liệu của nước ngoài để dễ tiếp cận thị trường", "Tiếp thu công nghệ lõi tiên tiến nhưng khéo léo lồng ghép bản sắc văn hóa Việt Nam vào sản phẩm", "Không cần quan tâm đến bản sắc, chỉ cần sản phẩm bán được"],
    answer: 2,
    explain: "Như HCM tiếp thu tinh hoa Đông-Tây nhưng luôn giữ gốc dân tộc — người trẻ tiếp thu công nghệ nhưng lồng ghép bản sắc Việt Nam, hội nhập không hòa tan."
  },
  {
    q: "Để vươn ra môi trường toàn cầu một cách bản lĩnh, phần thuyết trình của nhóm đã đề xuất \"3 trụ cột tự chủ\" của cá nhân bao gồm những gì?",
    opts: ["Tự chủ tư duy – Tự chủ năng lực – Tự chủ văn hóa", "Tự chủ tài chính – Tự chủ thời gian – Tự chủ công nghệ", "Tự chủ ngoại ngữ – Tự chủ giao tiếp – Tự chủ hành động", "Tự chủ học tập – Tự chủ việc làm – Tự chủ tư duy"],
    answer: 0,
    explain: "3 trụ cột tự chủ cá nhân trong bài thuyết trình: Tự chủ tư duy (không để công nghệ định hướng), Tự chủ năng lực (kỹ năng thực sự), Tự chủ văn hóa (giữ bản sắc)."
  },
  {
    q: "Biểu hiện nào sau đây cho thấy một cá nhân đang đánh mất đi \"Sự tự chủ trong tư duy\" trước làn sóng công nghệ hiện nay?",
    opts: ["Biết dùng AI để tìm kiếm tài liệu tham khảo nhanh chóng", "Kiểm chứng lại các thông tin đọc được trên mạng xã hội", "Để các công cụ công nghệ định hướng suy nghĩ và thui chột khả năng phản biện độc lập", "Dùng phần mềm để tối ưu hóa quy trình làm việc cá nhân"],
    answer: 2,
    explain: "Nguy cơ mất tự chủ số: khi phụ thuộc hoàn toàn vào AI và mạng xã hội, tư duy phản biện bị thui chột — đây là \"mất độc lập\" phiên bản cá nhân trong thời đại số."
  },
  {
    q: "Tựu trung lại, khát vọng \"độc lập dân tộc\" của Bác Hồ năm xưa truyền lại cho thế hệ trẻ ngày nay bài học cốt lõi nào khi bước ra thế giới?",
    opts: ["Phải luôn cảnh giác và hạn chế giao lưu quốc tế", "Mỗi cá nhân có tự chủ, có trí tuệ và bản sắc thì quốc gia mới thực sự độc lập, tự cường", "Chỉ cần học giỏi ngoại ngữ là đủ để bảo vệ độc lập dân tộc", "Chờ đợi các quốc gia khác chuyển giao toàn bộ công nghệ tiên tiến cho mình"],
    answer: 1,
    explain: "Tư tưởng HCM về độc lập dân tộc, tự lực tự cường và lấy dân làm gốc vẫn nguyên giá trị trong thời đại AI: mỗi cá nhân tự chủ thì quốc gia mới thực sự độc lập, tự cường."
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
