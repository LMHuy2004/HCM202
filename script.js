// ===== PARTICLES BACKGROUND =====
(function() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 30 : 0;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== NAVIGATION =====
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in, .timeline-item').forEach(el => observer.observe(el));

// ===== MINIGAME =====
const quizData = [
  {
    q: "Câu nói nổi tiếng \"Không có gì quý hơn độc lập, tự do\" của Hồ Chí Minh được đưa ra trong bối cảnh nào?",
    opts: [
      "Tuyên ngôn Độc lập 1945",
      "Lời kêu gọi toàn quốc kháng chiến 1946",
      "Khi đế quốc Mỹ mở rộng chiến tranh ở Việt Nam (1965-1966)",
      "Di chúc 1969"
    ],
    answer: 2,
    explain: "Câu nói này được HCM nêu lên vào năm 1966, trong bối cảnh đế quốc Mỹ leo thang chiến tranh, như một tuyên ngôn bất hủ khát khao nền độc lập, tự do."
  },
  {
    q: "Theo Hồ Chí Minh, độc lập dân tộc phải gắn liền với điều gì?",
    opts: [
      "Quyền lực nhà nước",
      "Tự do, hạnh phúc của nhân dân",
      "Sức mạnh quân sự",
      "Phát triển công nghiệp"
    ],
    answer: 1,
    explain: "\"Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.\" — HCM luôn coi độc lập gắn liền với tự do, hạnh phúc cho nhân dân."
  },
  {
    q: "Năm 1919, Hồ Chí Minh đã gửi tới Hội nghị Véc-xây bản yêu sách nào?",
    opts: [
      "Tuyên ngôn Độc lập",
      "Đường Cách Mệnh",
      "Yêu sách của nhân dân An Nam",
      "Bản án chế độ thực dân Pháp"
    ],
    answer: 2,
    explain: "Bản \"Yêu sách của nhân dân An Nam\" (1919) đòi quyền bình đẳng về mặt pháp lý và các quyền tự do, dân chủ — cho thấy tư tưởng về quyền dân tộc đã sớm hình thành."
  },
  {
    q: "HCM quyết định chọn con đường cách mạng vô sản sau sự kiện nào?",
    opts: [
      "Cách mạng Pháp 1789",
      "Chiến tranh thế giới thứ nhất",
      "Cách mạng Tháng Mười Nga 1917 và đọc Luận cương Lênin 1920",
      "Thành lập Quốc tế Cộng sản"
    ],
    answer: 2,
    explain: "Cách mạng Tháng Mười Nga (1917) ảnh hưởng sâu sắc, và năm 1920 khi đọc Luận cương của Lênin, HCM tìm ra con đường giải phóng dân tộc: đi theo chủ nghĩa Mác-Lênin."
  },
  {
    q: "Trong Chánh cương vắn tắt (1930), HCM xác định mục tiêu cách mạng Việt Nam là gì?",
    opts: [
      "Xây dựng nền dân chủ tư sản",
      "Làm tư sản dân quyền CM và thổ địa CM để đi tới xã hội cộng sản",
      "Thành lập chế độ quân chủ lập hiến",
      "Hợp tác với thực dân Pháp"
    ],
    answer: 1,
    explain: "Chánh cương vắn tắt (1930) xác định: làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản — gắn liền độc lập dân tộc với CNXH."
  },
  {
    q: "Theo HCM, trình tự giải phóng ở Việt Nam khác với châu Âu như thế nào?",
    opts: [
      "Giải phóng giai cấp trước, sau đó giải phóng dân tộc",
      "Giải phóng dân tộc → giai cấp → xã hội → con người",
      "Giải phóng xã hội trước, rồi giải phóng dân tộc",
      "Không có sự khác biệt"
    ],
    answer: 1,
    explain: "Khác với châu Âu (giai cấp → dân tộc), ở VN và các nước thuộc địa, trình tự là: giải phóng dân tộc → giai cấp → xã hội → con người."
  },
  {
    q: "HCM khẳng định cách mạng giải phóng dân tộc ở thuộc địa có thể:",
    opts: [
      "Chỉ thành công khi CM ở chính quốc thắng lợi trước",
      "Phải chờ CM thế giới thắng lợi",
      "Chủ động giành thắng lợi trước CM vô sản ở chính quốc",
      "Không liên quan đến CM ở chính quốc"
    ],
    answer: 2,
    explain: "Đây là luận điểm sáng tạo của HCM, khác với quan điểm thụ động của ĐH VI Quốc tế Cộng sản (1928) — CM thuộc địa có thể chủ động giành thắng lợi trước."
  },
  {
    q: "Theo HCM, lực lượng nào là \"gốc\" của cách mạng?",
    opts: [
      "Giai cấp tư sản dân tộc",
      "Trí thức",
      "Công nhân và nông dân (công nông)",
      "Quân đội"
    ],
    answer: 2,
    explain: "\"Công nông là gốc cách mệnh\" — HCM nhấn mạnh trong tác phẩm Đường Cách Mệnh. Công nhân và nông dân là giai cấp cách mạng nhất, bị bóc lột nặng nề nhất."
  },
  {
    q: "Quan niệm của HCM về chủ nghĩa xã hội, đặc trưng nào sau đây KHÔNG phải là đặc trưng cơ bản?",
    opts: [
      "Chế độ dân chủ, nhân dân làm chủ",
      "Nền kinh tế thị trường tự do hoàn toàn",
      "Trình độ phát triển cao về văn hóa và đạo đức",
      "Chế độ công hữu về tư liệu sản xuất chủ yếu"
    ],
    answer: 1,
    explain: "Theo HCM, XHCN có 4 đặc trưng: dân chủ, kinh tế dựa trên LLSX hiện đại & công hữu TLSX, văn hóa - đạo đức phát triển cao, nhân dân là chủ thể. \"Kinh tế thị trường tự do hoàn toàn\" không phải đặc trưng."
  },
  {
    q: "Trong tư tưởng HCM, động lực mạnh mẽ nhất của CNXH được tạo nên từ sự kết hợp của:",
    opts: [
      "Kinh tế, quân sự, ngoại giao",
      "Lợi ích của dân, dân chủ, đoàn kết toàn dân",
      "Công nghiệp hóa, hiện đại hóa",
      "Đảng, Nhà nước, Quân đội"
    ],
    answer: 1,
    explain: "Trong tư tưởng HCM: lợi ích của dân, dân chủ của dân, đoàn kết toàn dân gắn bó hữu cơ, là cơ sở, là tiền đề của nhau — tạo nên hệ thống động lực mạnh mẽ nhất."
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

function initGame() {
  const progressEl = document.getElementById('gameProgress');
  progressEl.innerHTML = '';
  for (let i = 0; i < quizData.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'game-progress-dot';
    dot.id = 'dot-' + i;
    progressEl.appendChild(dot);
  }
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  const q = quizData[currentQ];
  document.getElementById('gameQNum').textContent = `Câu ${currentQ + 1} / ${quizData.length}`;
  document.getElementById('gameQuestion').textContent = q.q;
  document.getElementById('gameScore').textContent = score;
  document.getElementById('gameTotalQ').textContent = quizData.length;

  const optContainer = document.getElementById('gameOptions');
  optContainer.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'game-option';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span>${opt}</span>`;
    btn.onclick = () => selectAnswer(i, btn);
    optContainer.appendChild(btn);
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

  if (idx === q.answer) {
    btn.classList.add('correct');
    score++;
    document.getElementById('gameScore').textContent = score;
    document.getElementById('dot-' + currentQ).classList.remove('active');
    document.getElementById('dot-' + currentQ).classList.add('correct');
  } else {
    btn.classList.add('wrong');
    allBtns[q.answer].classList.add('correct');
    document.getElementById('dot-' + currentQ).classList.remove('active');
    document.getElementById('dot-' + currentQ).classList.add('wrong');
  }

  const explEl = document.getElementById('gameExplanation');
  explEl.textContent = '💡 ' + q.explain;
  explEl.classList.add('show');

  const nextBtn = document.getElementById('gameNext');
  nextBtn.textContent = currentQ < quizData.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆';
  nextBtn.classList.add('show');
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('gameArea').style.display = 'none';
  const resultEl = document.getElementById('gameResult');
  resultEl.classList.add('show');

  const pct = Math.round((score / quizData.length) * 100);
  document.getElementById('resultScore').textContent = `${score} / ${quizData.length} (${pct}%)`;

  let icon, title, msg;
  if (pct >= 90) {
    icon = '🏆'; title = 'Xuất sắc!';
    msg = 'Bạn hiểu rất sâu về tư tưởng Hồ Chí Minh! Bác Hồ sẽ rất tự hào!';
  } else if (pct >= 70) {
    icon = '🌟'; title = 'Rất giỏi!';
    msg = 'Kiến thức của bạn rất vững! Hãy tiếp tục tìm hiểu thêm nhé.';
  } else if (pct >= 50) {
    icon = '👍'; title = 'Khá tốt!';
    msg = 'Bạn đã nắm được những điểm cơ bản. Hãy ôn lại Chương III để hiểu sâu hơn!';
  } else {
    icon = '📖'; title = 'Cần cố gắng thêm!';
    msg = 'Hãy đọc lại nội dung Chương III và thử lại nhé. Kiến thức sẽ đến qua sự kiên trì!';
  }
  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMsg').textContent = msg;
}

function restartGame() {
  currentQ = 0;
  score = 0;
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('gameResult').classList.remove('show');
  document.querySelectorAll('.game-progress-dot').forEach(d => {
    d.className = 'game-progress-dot';
  });
  loadQuestion();
}

// Init game when section is visible
const gameObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      initGame();
      gameObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
gameObserver.observe(document.getElementById('gameContainer'));
