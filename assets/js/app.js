// =============================================
// 찐행 — SPA 메인 앱 로직 (PC-First)
// =============================================

const App = {
  currentPage: 'home',
  currentUser: null,
  writeStep: 1,
  ticketVerified: false,
  locationVerified: false,
  selectedRating: 0,
  reviewViewGrid: true,

  init() {
    this.currentUser = getCurrentUser(); // null이면 비로그인 상태
    this.updateUserUI();
    this.bindGlobalEvents();
    this.renderRightPanel();
    setTimeout(() => this.hideLoading(), 1300);
  },

  hideLoading() {
    const el = document.getElementById('app-loading');
    el.classList.add('fade-out');
    setTimeout(() => { el.style.display = 'none'; this.renderHome(); }, 450);
  },

  requireLogin(action) {
    if (this.currentUser) { action && action(); return; }
    this.showLoginSheet();
  },

  showLoginSheet() {
    const existing = document.getElementById('login-sheet');
    if (existing) existing.remove();
    const sheet = document.createElement('div');
    sheet.id = 'login-sheet';
    sheet.innerHTML = `
      <div class="login-sheet-backdrop" onclick="document.getElementById('login-sheet').remove()"></div>
      <div class="login-sheet-panel">
        <div class="login-sheet-icon">✍️</div>
        <div class="login-sheet-title">로그인이 필요해요</div>
        <div class="login-sheet-desc">후기를 쓰면 내 글에 붙는 광고 수익이<br>자동으로 내 계정에 쌓여요</div>
        <div class="login-sheet-btns">
          <button class="sheet-btn-primary" onclick="document.getElementById('login-sheet').remove(); App.navigate('login')">로그인</button>
          <button class="sheet-btn-secondary" onclick="document.getElementById('login-sheet').remove(); App.navigate('register')">회원가입</button>
        </div>
      </div>`;
    document.body.appendChild(sheet);
  },

  navigate(page, params = {}) {
    // 로그인 필요 페이지 차단
    const authRequired = ['write', 'profile', 'saved'];
    if (authRequired.includes(page) && !this.currentUser) {
      this.showLoginSheet();
      return;
    }
    // 로그인/회원가입은 fixed overlay
    const overlayPages = ['login', 'register'];
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (!target) return;
    target.classList.add('active');
    this.currentPage = page;
    window.scrollTo(0, 0);

    // 사이드바 활성 상태
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    // 바텀 네비
    document.querySelectorAll('.bottom-nav .nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    this.onPageEnter(page, params);
  },

  onPageEnter(page, params) {
    if (page === 'home') this.renderHome();
    if (page === 'feed') this.renderFeed();
    if (page === 'write') this.initWrite();
    if (page === 'profile') this.renderProfile();
    if (page === 'review-detail') this.renderDetail(params.reviewId);
  },

  updateUserUI() {
    const u = this.currentUser;
    const sidebarUser = document.getElementById('sidebar-user');
    const topbarRight = document.getElementById('topbar-right');

    if (u) {
      // 로그인 상태
      const init = u.nickname.substring(0, 2);
      ['sidebar-avatar', 'topbar-avatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = init;
      });
      const un = document.getElementById('sidebar-username');
      if (un) un.textContent = u.nickname;
      const sub = document.getElementById('sidebar-usersub');
      if (sub) sub.textContent = `광고수익 ₩${u.totalEarnings.toLocaleString()}`;
      if (sidebarUser) sidebarUser.onclick = () => this.navigate('profile');
      if (topbarRight) topbarRight.innerHTML = `<div class="topbar-avatar" id="topbar-avatar" onclick="App.navigate('profile')">${init}</div>`;
    } else {
      // 비로그인 상태
      if (sidebarUser) {
        sidebarUser.onclick = null;
        sidebarUser.innerHTML = `
          <div class="sidebar-guest-banner" onclick="App.navigate('login')">
            <div class="guest-banner-icon">✍️</div>
            <div class="guest-banner-text">
              <div class="guest-banner-title">찐후기 쓰고</div>
              <div class="guest-banner-sub">내 후기로 수익 만들기 →</div>
            </div>
          </div>`;
      }
      if (topbarRight) topbarRight.innerHTML = `
        <button class="topbar-login-btn" onclick="App.navigate('login')">로그인</button>
        <button class="topbar-join-btn" onclick="App.navigate('register')">회원가입</button>`;
    }
  },

  bindGlobalEvents() {
    // 사이드바 네비
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => this.navigate(item.dataset.page));
    });
    // 바텀 네비
    document.querySelectorAll('.bottom-nav .nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => this.navigate(item.dataset.page));
    });
    // 검색
    document.getElementById('topbar-search-input')?.addEventListener('input', e => {
      if (this.currentPage === 'home') this.handleSearch(e.target.value);
    });
    // write 이벤트
    document.getElementById('write-next-btn')?.addEventListener('click', () => this.writeNext());
    document.getElementById('write-prev-btn')?.addEventListener('click', () => this.writePrev());
    document.getElementById('write-submit-btn')?.addEventListener('click', () => this.submitReview());
    // 텍스트 카운터
    document.getElementById('review-text')?.addEventListener('input', e => {
      const len = e.target.value.length;
      const el = document.getElementById('text-counter');
      if (el) { el.textContent = `${len}/500`; el.className = 'char-counter' + (len > 450 ? (len >= 500 ? ' limit' : ' warn') : ''); }
    });
    // 별점
    document.querySelectorAll('.rating-star').forEach((star, idx) => {
      star.addEventListener('click', () => {
        this.selectedRating = idx + 1;
        document.querySelectorAll('.rating-star').forEach((s, i) => s.classList.toggle('active', i <= idx));
      });
    });
    // 사진 슬롯
    document.querySelectorAll('.photo-slot').forEach((slot, i) => {
      slot.addEventListener('click', () => this.simulatePhotoUpload(i));
    });
    // 티켓 업로드 클릭
    document.getElementById('ticket-upload-zone')?.addEventListener('click', () => this.simulateTicketUpload());
  },

  // =================== HOME ===================
  renderHome() {
    this.renderHero();
    this.renderDestChips();
    this.renderReviewGrid();
    this.renderHomeAd();
  },

  renderHero() {
    const greeting = document.getElementById('hero-greeting');
    const heroBtns = document.getElementById('hero-btns');
    if (this.currentUser) {
      if (greeting) greeting.textContent = `안녕하세요, ${this.currentUser.nickname}님 👋`;
      if (heroBtns) heroBtns.innerHTML = `
        <div class="hero-btn-primary" onclick="App.navigate('write')">✏️ 찐 후기 쓰기</div>
        <div class="hero-btn-secondary" onclick="App.navigate('feed')">🗺️ 지도로 탐색</div>`;
    } else {
      if (greeting) greeting.textContent = '항공권 + GPS 인증으로 믿을 수 있는 후기만';
      if (heroBtns) heroBtns.innerHTML = `
        <div class="hero-btn-primary" onclick="App.navigate('register')">무료로 시작하기</div>
        <div class="hero-btn-secondary" onclick="App.navigate('feed')">🗺️ 지도로 탐색</div>`;
    }
  },

  renderDestChips() {
    const el = document.getElementById('destination-chips');
    if (!el) return;
    const chipData = [
      { dest: MOCK_DESTINATIONS[0], bg: 'linear-gradient(135deg,#FFB7C5,#FF7BAC)', icon: '⛩️' },  // 도쿄 - 메이지신궁 도리이
      { dest: MOCK_DESTINATIONS[1], bg: 'linear-gradient(135deg,#FFCF77,#FF9F43)', icon: '🏯' },  // 오사카 - 오사카성
      { dest: MOCK_DESTINATIONS[3], bg: 'linear-gradient(135deg,#A8E6CF,#3DC6A0)', icon: '🐉' },  // 다낭 - 용교
      { dest: MOCK_DESTINATIONS[6], bg: 'linear-gradient(135deg,#B8D8FF,#5BA3FF)', icon: '🌋' },  // 제주도 - 한라산
      { dest: MOCK_DESTINATIONS[4], bg: 'linear-gradient(135deg,#D4AAFF,#9C59F7)', icon: '🏮' },  // 타이베이 - 야시장 홍등
      { dest: MOCK_DESTINATIONS[2], bg: 'linear-gradient(135deg,#FFD6A5,#FF8C42)', icon: '🛕' },  // 방콕 - 왓아룬 사원
      { dest: MOCK_DESTINATIONS[7], bg: 'linear-gradient(135deg,#CAFFBF,#52C41A)', icon: '🌉' },  // 부산 - 광안대교
      { dest: MOCK_DESTINATIONS[8], bg: 'linear-gradient(135deg,#BDE0FE,#4A90D9)', icon: '🗼' },  // 파리 - 에펠탑
    ];
    el.innerHTML = chipData.map(({ dest, bg, icon }) => `
      <div class="destination-chip${dest.trending ? ' trending' : ''}" onclick="App.navigate('feed')">
        <div class="chip-icon" style="background:${bg}">${icon}</div>
        <div class="chip-name">${dest.city}</div>
        <div class="chip-count">${dest.reviewCount.toLocaleString()}개</div>
        ${dest.trending ? '<div class="chip-hot">🔥</div>' : ''}
      </div>
    `).join('');
  },

  renderReviewGrid(reviews = MOCK_REVIEWS) {
    const el = document.getElementById('review-feed');
    if (!el) return;
    el.className = `review-grid${this.reviewViewGrid ? '' : ' list-view'}`;
    el.innerHTML = reviews.map(r => this.buildReviewCard(r)).join('');
    this.bindCardEvents();
  },

  buildReviewCard(review) {
    const user = MOCK_USERS.find(u => u.id === review.userId) || MOCK_USERS[0];
    const place = MOCK_PLACES.find(p => p.id === review.placeId);
    const gradients = [
      'linear-gradient(135deg,#E8F0FF,#C8D8FF)',
      'linear-gradient(135deg,#E8FFF8,#C8F5E8)',
      'linear-gradient(135deg,#FFF0E8,#FFD0B8)',
    ];
    const icons = ['🗾', '🌏', '📸'];
    const cnt = Math.min((review.photos || []).length, 3);

    let photosHtml = '';
    if (cnt > 0) {
      const items = Array.from({length: cnt}, (_, i) => `
        <div class="rc-photo">
          <div class="rc-photo-inner" style="background:${gradients[i % 3]}">
            <span style="font-size:${i===0&&cnt===3?'2rem':'1.8rem'}">${icons[i]}</span>
            <span style="font-size:0.75rem;color:var(--text-tertiary);font-weight:600">사진 ${i+1}</span>
          </div>
        </div>`).join('');
      photosHtml = `<div class="rc-photos photos-${cnt}">${items}</div>`;
    }

    const verifyBadges = [
      review.ticketVerified ? '<span class="verify-chip ticket">✈️ 항공권</span>' : '',
      review.locationVerified ? '<span class="verify-chip location">📍 위치</span>' : '',
      review.youtube ? '<span class="verify-chip youtube">▶ 유튜브</span>' : '',
      review.instagram ? '<span class="verify-chip instagram">📸 인스타</span>' : '',
    ].filter(Boolean).join('');

    const displayName = user.nickname.length > 10 ? user.nickname.substring(0, 10) + '…' : user.nickname;

    return `
      <article class="review-card" data-review-id="${review.id}">
        <div class="rc-header">
          <div class="rc-avatar">${user.nickname.substring(0,2)}</div>
          <div class="rc-user-info">
            <div class="rc-user-name">${displayName}</div>
            <div class="rc-verify-row">${verifyBadges || '<span style="color:var(--text-tertiary);font-size:0.75rem">인증없음</span>'}</div>
          </div>
          <div class="rc-stars-wrap">
            ${this.buildStars(review.rating)}
            <div class="rc-place">📍 ${place?.name || '알 수 없는 장소'}</div>
          </div>
        </div>
        ${photosHtml}
        <div class="rc-body">
          <div class="rc-title">${review.title}</div>
          <div class="rc-text">${review.content}</div>
        </div>
        <div class="rc-footer">
          <button class="rc-action like-btn${review.isLiked?' liked':''}" data-rid="${review.id}">
            ${review.isLiked?'❤️':'🤍'} ${review.likes}
          </button>
          <button class="rc-action" onclick="event.stopPropagation();App.navigate('review-detail',{reviewId:'${review.id}'})">
            💬 ${review.helpfulCount}
          </button>
          <button class="rc-action" onclick="event.stopPropagation();App.shareReview('${review.id}')">🔗 공유</button>
          <span class="rc-date">${this.timeAgo(review.createdAt)}</span>
        </div>
      </article>
    `;
  },

  buildStars(n) {
    return `<div class="stars">${[1,2,3,4,5].map(i=>`<span class="star${i<=n?' filled':''}" >★</span>`).join('')}</div>`;
  },

  renderHomeAd() {
    const el = document.getElementById('home-ad-wrap');
    if (!el) return;
    const ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
    const icons = { flight:'✈️', tour:'🗺️', hotel:'🏨' };
    el.innerHTML = `
      <div class="ad-unit" onclick="App.showToast('광고 클릭! 수익 적립 🎉','success')">
        <span class="ad-label">광고</span>
        <div class="ad-icon">${icons[ad.category]}</div>
        <div class="ad-info">
          <div class="ad-title">${ad.title}</div>
          <div class="ad-subtitle">${ad.subtitle}</div>
          <div class="ad-cta">${ad.cta} →</div>
        </div>
      </div>`;
  },

  toggleReviewView() {
    this.reviewViewGrid = !this.reviewViewGrid;
    const btn = document.getElementById('toggle-view-btn');
    if (btn) btn.textContent = this.reviewViewGrid ? '📋 리스트 보기' : '⊞ 그리드 보기';
    this.renderReviewGrid();
  },

  bindCardEvents() {
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!this.currentUser) { this.showLoginSheet(); return; }
        const r = MOCK_REVIEWS.find(r => r.id === btn.dataset.rid);
        if (!r) return;
        r.isLiked = !r.isLiked; r.likes += r.isLiked ? 1 : -1;
        btn.innerHTML = `${r.isLiked?'❤️':'🤍'} ${r.likes}`;
        btn.classList.toggle('liked', r.isLiked);
        if (r.isLiked) this.showToast('좋아요를 눌렀습니다!', 'success');
      });
    });
    document.querySelectorAll('.review-card').forEach(card => {
      card.addEventListener('click', e => {
        if (!e.target.closest('button')) this.navigate('review-detail', { reviewId: card.dataset.reviewId });
      });
    });
  },

  handleSearch(q) {
    if (!q.trim()) { this.renderReviewGrid(); return; }
    const filtered = MOCK_REVIEWS.filter(r =>
      r.title.includes(q) || r.content.includes(q) ||
      (MOCK_PLACES.find(p=>p.id===r.placeId)?.name||'').includes(q)
    );
    this.renderReviewGrid(filtered.length ? filtered : MOCK_REVIEWS);
  },

  // =================== RIGHT PANEL ===================
  renderRightPanel() {
    this.renderRightAd();
    this.renderTrendingTags();
    this.renderHotReviews();
  },

  renderRightAd() {
    const el = document.getElementById('right-ad-slot');
    if (!el) return;
    const ad = MOCK_ADS[1];
    const icons = { flight:'✈️', tour:'🗺️', hotel:'🏨' };
    el.innerHTML = `
      <div class="ad-unit" onclick="App.showToast('광고 클릭!')">
        <span class="ad-label">광고</span>
        <div class="ad-icon" style="width:44px;height:44px;font-size:1.3rem">${icons[ad.category]}</div>
        <div class="ad-info">
          <div class="ad-title" style="font-size:0.875rem">${ad.title}</div>
          <div class="ad-subtitle" style="font-size:0.75rem">${ad.subtitle}</div>
          <div class="ad-cta" style="font-size:0.8125rem">${ad.cta} →</div>
        </div>
      </div>`;
  },

  renderTrendingTags() {
    const el = document.getElementById('trending-tags-list');
    if (!el) return;
    el.innerHTML = TRENDING_TAGS.slice(0, 8).map((tag, i) => `
      <div class="trending-tag-item" onclick="App.showToast('${tag} 검색')">
        <span class="trending-tag-rank${i < 3 ? ' top' : ''}">${i + 1}</span>
        <span class="trending-tag-name">${tag}</span>
        <span class="trending-tag-count">${Math.floor(Math.random()*900+100)}개</span>
      </div>
    `).join('');
  },

  renderHotReviews() {
    const el = document.getElementById('hot-reviews-list');
    if (!el) return;
    const top = [...MOCK_REVIEWS].sort((a,b) => b.likes - a.likes).slice(0, 4);
    const gradients = ['linear-gradient(135deg,#E8F0FF,#C8D8FF)','linear-gradient(135deg,#E8FFF8,#C8F5E8)','linear-gradient(135deg,#FFF0E8,#FFD0B8)','linear-gradient(135deg,#F5E8FF,#E8D0FF)'];
    const icons = ['🗾','🌏','📸','🏝️'];
    el.innerHTML = top.map((r, i) => {
      const place = MOCK_PLACES.find(p => p.id === r.placeId);
      return `
        <div class="mini-review" onclick="App.navigate('review-detail',{reviewId:'${r.id}'})">
          <div class="mini-review-thumb" style="background:${gradients[i]}">${icons[i]}</div>
          <div class="mini-review-info">
            <div class="mini-review-title">${r.title}</div>
            <div class="mini-review-meta">❤️ ${r.likes} · 📍 ${place?.name?.substring(0,10)||'장소'}</div>
          </div>
        </div>`;
    }).join('');
  },

  // =================== FEED ===================
  renderFeed() {
    this.renderMapPins();
    this.renderFeedList();
  },

  renderMapPins() {
    const el = document.getElementById('map-pins');
    if (!el) return;
    const pins = [
      {x:'28%',y:'32%',label:'도쿄',hot:true},{x:'25%',y:'40%',label:'오사카'},
      {x:'49%',y:'62%',label:'방콕',hot:true},{x:'54%',y:'48%',label:'다낭',hot:true},
      {x:'51%',y:'35%',label:'타이베이'},{x:'30%',y:'36%',label:'제주',hot:true},
      {x:'34%',y:'30%',label:'부산'},{x:'20%',y:'38%',label:'서울'},
    ];
    el.innerHTML = pins.map(p => `
      <div class="map-pin" style="left:${p.x};top:${p.y}" onclick="App.showToast('${p.label} 후기 보기')">
        <div class="pin-bubble${p.hot?' hot':''}">${p.label}</div>
        <div class="pin-tail"></div>
      </div>`).join('');
  },

  renderFeedList() {
    const el = document.getElementById('feed-list');
    if (!el) return;
    const gradients = ['linear-gradient(135deg,#E8F0FF,#C8D8FF)','linear-gradient(135deg,#E8FFF8,#C8F5E8)','linear-gradient(135deg,#FFF0E8,#FFD0B8)','linear-gradient(135deg,#F5E8FF,#E8D0FF)'];
    const icons = ['🗾','🌏','📸','🏝️'];
    const adHtml = `
      <div class="ad-unit" style="margin-bottom:4px" onclick="App.showToast('광고 클릭 🎉')">
        <span class="ad-label">광고</span>
        <div class="ad-icon" style="width:44px;height:44px;font-size:1.3rem">✈️</div>
        <div class="ad-info">
          <div class="ad-title" style="font-size:0.875rem">${MOCK_ADS[0].title}</div>
          <div class="ad-cta" style="font-size:0.8125rem">${MOCK_ADS[0].cta} →</div>
        </div>
      </div>`;
    el.innerHTML = adHtml + MOCK_REVIEWS.map((r, i) => {
      const user = MOCK_USERS.find(u=>u.id===r.userId)||MOCK_USERS[0];
      const place = MOCK_PLACES.find(p=>p.id===r.placeId);
      return `
        <div class="feed-card" onclick="App.navigate('review-detail',{reviewId:'${r.id}'})">
          <div class="feed-card-thumb" style="background:${gradients[i%4]}">${icons[i%4]}</div>
          <div class="feed-card-body">
            <div class="feed-card-title">${r.title}</div>
            <div class="feed-card-place">📍 ${place?.name||'장소'} · ${this.buildStars(r.rating).replace(/<[^>]+>/g,'').trim()}</div>
          </div>
          <div class="feed-card-footer">
            <div style="display:flex;gap:4px">${r.ticketVerified?'<span class="verify-chip ticket">✈️</span>':''}${r.locationVerified?'<span class="verify-chip location">📍</span>':''}</div>
            <span style="font-size:0.75rem;color:var(--text-tertiary);margin-left:auto">${this.timeAgo(r.createdAt)}</span>
          </div>
        </div>`;
    }).join('');
  },

  // =================== WRITE ===================
  initWrite() {
    this.writeStep = 1;
    this.ticketVerified = false;
    this.locationVerified = false;
    this.selectedRating = 0;
    this.updateWriteUI();
  },

  updateWriteUI() {
    // 스텝 도트 업데이트
    document.querySelectorAll('.write-step-item').forEach((item, idx) => {
      const n = idx + 1;
      const dot = item.querySelector('.write-step-dot');
      item.classList.remove('active','done');
      dot.classList.remove('active','done');
      if (n < this.writeStep) { item.classList.add('done'); dot.classList.add('done'); dot.textContent = '✓'; }
      else if (n === this.writeStep) { item.classList.add('active'); dot.classList.add('active'); dot.textContent = n; }
      else { dot.textContent = n; }
    });
    // 스텝 라인
    for (let i = 1; i <= 3; i++) {
      const line = document.getElementById(`sline-${i}`);
      if (line) line.classList.toggle('done', i < this.writeStep);
    }
    // 스텝 콘텐츠
    document.querySelectorAll('.write-step-content').forEach(c => c.style.display = 'none');
    const active = document.getElementById(`write-step-${this.writeStep}`);
    if (active) active.style.display = 'flex';
    // 버튼
    const prev = document.getElementById('write-prev-btn');
    const next = document.getElementById('write-next-btn');
    const submit = document.getElementById('write-submit-btn');
    if (prev) prev.style.display = this.writeStep > 1 ? 'inline-flex' : 'none';
    if (next) next.style.display = this.writeStep < 4 ? 'inline-flex' : 'none';
    if (submit) submit.style.display = this.writeStep === 4 ? 'inline-flex' : 'none';
  },

  writeNext() {
    if (this.writeStep === 1 && !this.ticketVerified) { this.showToast('항공권 또는 선박이용권 인증이 필요합니다', 'error'); return; }
    if (this.writeStep === 2 && !this.locationVerified) { this.showToast('사진의 GPS/EXIF 위치 인증이 필요합니다', 'error'); return; }
    if (this.writeStep < 4) { this.writeStep++; this.updateWriteUI(); }
  },

  writePrev() {
    if (this.writeStep > 1) { this.writeStep--; this.updateWriteUI(); }
  },

  simulateTicketUpload() {
    const zone = document.getElementById('ticket-upload-zone');
    if (!zone || zone.classList.contains('verified')) return;
    zone.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%"><div class="skeleton" style="width:80px;height:80px;border-radius:12px"></div><div class="skeleton" style="width:60%;height:16px;border-radius:6px"></div><div style="color:var(--text-secondary);font-size:0.875rem">인증 중...</div></div>`;
    setTimeout(() => {
      this.ticketVerified = true;
      zone.classList.add('verified');
      zone.innerHTML = `
        <div class="verify-result success" style="width:100%">
          <div class="result-icon">✅</div>
          <div><div class="result-title">항공권 인증 완료</div><div class="result-sub">승객명: KIM MIN JUN · KE123 · 도쿄행</div></div>
        </div>
        <div style="font-size:0.8rem;color:var(--secondary-dark);text-align:center">개인정보는 이름 비교 후 즉시 삭제됩니다</div>`;
      this.showToast('항공권이 인증되었습니다! ✈️', 'success');
    }, 1600);
  },

  simulatePhotoUpload(slotIdx) {
    const slots = document.querySelectorAll('.photo-slot');
    const slot = slots[slotIdx];
    if (!slot || slot.classList.contains('filled')) return;
    const gradients = ['linear-gradient(135deg,#E8F0FF,#C8D8FF)','linear-gradient(135deg,#E8FFF8,#C8F5E8)','linear-gradient(135deg,#FFF0E8,#FFD0B8)'];
    const emojis = ['🗾','🌏','📸'];
    const hasGPS = Math.random() > 0.25;
    slot.classList.add('filled');
    slot.innerHTML = `
      <div style="width:100%;height:100%;background:${gradients[slotIdx%3]};display:flex;align-items:center;justify-content:center;font-size:2.2rem">${emojis[slotIdx%3]}</div>
      ${hasGPS ? '<span class="exif-badge">GPS ✓</span>' : ''}
      <div class="remove-photo" onclick="event.stopPropagation();App.removePhoto(${slotIdx})">✕</div>`;
    if (hasGPS && !this.locationVerified) {
      setTimeout(() => {
        this.locationVerified = true;
        const el = document.getElementById('location-verify-result');
        if (el) el.innerHTML = `<div class="verify-result success"><div class="result-icon">📍</div><div><div class="result-title">위치 인증 완료</div><div class="result-sub">GPS: 35.6654, 139.7707 · 도쿄 츠키지 근방 확인됨</div></div></div>`;
        this.showToast('사진 위치 정보가 확인되었습니다! 📍', 'success');
      }, 700);
    }
  },

  removePhoto(i) {
    const slots = document.querySelectorAll('.photo-slot');
    const slot = slots[i];
    if (!slot) return;
    slot.classList.remove('filled');
    slot.innerHTML = '<span class="slot-icon">+</span>';
  },

  submitReview() {
    const title = document.getElementById('review-title')?.value?.trim();
    const text = document.getElementById('review-text')?.value?.trim();
    if (!title) { this.showToast('제목을 입력해 주세요', 'error'); return; }
    if (!text) { this.showToast('후기 내용을 입력해 주세요', 'error'); return; }
    if (this.selectedRating === 0) { this.showToast('별점을 선택해 주세요', 'error'); return; }
    const btn = document.getElementById('write-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = '등록 중...'; }
    setTimeout(() => {
      this.showToast('후기가 등록되었습니다! 🎉', 'success');
      setTimeout(() => this.navigate('home'), 1000);
    }, 1200);
  },

  // =================== PROFILE ===================
  renderProfile() {
    const u = this.currentUser || MOCK_USERS[0];
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('profile-name', u.nickname);
    setEl('profile-passport', u.passportName);
    setEl('profile-initials', u.nickname.substring(0, 2));
    setEl('total-earnings', u.totalEarnings.toLocaleString());
    setEl('pending-earnings', u.pendingEarnings.toLocaleString());
    setEl('profile-review-count', u.reviewCount);
  },

  // =================== DETAIL ===================
  renderDetail(reviewId) {
    const r = MOCK_REVIEWS.find(r => r.id === reviewId);
    if (!r) return;
    const user = MOCK_USERS.find(u => u.id === r.userId) || MOCK_USERS[0];
    const place = MOCK_PLACES.find(p => p.id === r.placeId);
    const dest = MOCK_DESTINATIONS.find(d => d.id === r.destinationId);
    const gradients = ['linear-gradient(160deg,#dce9ff,#b8d0ff)','linear-gradient(160deg,#d0fff5,#b8ffe8)','linear-gradient(160deg,#ffe8d0,#ffd0b8)'];
    const icons = ['🗾','🌏','📸'];
    const cnt = Math.min((r.photos||[]).length, 3);

    // 미디어 패널
    const media = document.getElementById('detail-media');
    if (media) {
      const photoItems = Array.from({length: Math.max(cnt,1)}, (_, i) => `
        <div class="detail-photo${i===0?' main':''}" style="background:${gradients[i%3]};display:flex;align-items:center;justify-content:center;font-size:${i===0?'4rem':'2.5rem'}">${icons[i%3]}</div>
      `).join('');
      media.innerHTML = `<div class="detail-media-inner">${photoItems}</div>`;
    }

    // 콘텐츠 패널
    const panel = document.getElementById('detail-content-panel');
    if (!panel) return;
    const linksHtml = [
      r.youtube ? `<div class="detail-link" onclick="App.showToast('유튜브로 이동')"><span class="link-icon">▶️</span><div class="link-info"><div class="link-title">유튜브 영상 보기</div><div class="link-url">${r.youtube}</div></div><span>›</span></div>` : '',
      r.instagram ? `<div class="detail-link" onclick="App.showToast('인스타그램으로 이동')"><span class="link-icon">📸</span><div class="link-info"><div class="link-title">인스타그램에서 보기</div><div class="link-url">${r.instagram}</div></div><span>›</span></div>` : '',
    ].filter(Boolean).join('');

    panel.innerHTML = `
      <div class="detail-ad-slot">
        <div class="ad-unit" onclick="App.showToast('광고 클릭!')">
          <span class="ad-label">광고</span>
          <div class="ad-icon" style="width:44px;height:44px;font-size:1.2rem">✈️</div>
          <div class="ad-info">
            <div class="ad-title" style="font-size:0.875rem">${MOCK_ADS[0].title}</div>
            <div class="ad-subtitle" style="font-size:0.75rem">${MOCK_ADS[0].subtitle}</div>
            <div class="ad-cta" style="font-size:0.8125rem">${MOCK_ADS[0].cta} →</div>
          </div>
        </div>
      </div>
      <div class="detail-body">
        <div class="detail-back" onclick="App.navigate('home')">‹ 목록으로</div>
        <div><span class="detail-place-chip">📍 ${place?.name||'장소 정보 없음'}</span></div>
        <div class="detail-title">${r.title}</div>
        ${this.buildStars(r.rating)}
        <div class="detail-user-row">
          <div class="detail-avatar">${user.nickname.substring(0,2)}</div>
          <span class="detail-user-name">${user.nickname}</span>
          <span class="detail-date">${this.timeAgo(r.createdAt)}</span>
        </div>
        <div class="detail-verify-row">
          ${r.ticketVerified?'<span class="verify-chip ticket">✈️ 항공권 인증됨</span>':''}
          ${r.locationVerified?'<span class="verify-chip location">📍 위치 인증됨</span>':''}
          ${r.youtube?'<span class="verify-chip youtube">▶ 유튜브</span>':''}
          ${r.instagram?'<span class="verify-chip instagram">📸 인스타</span>':''}
        </div>
        <div class="detail-content">${r.content}</div>
        ${linksHtml ? `<div style="display:flex;flex-direction:column;gap:8px">${linksHtml}</div>` : ''}
        <div class="detail-actions">
          <button class="detail-action-btn${r.isLiked?' liked':''}" onclick="App.toggleLike('${r.id}',this)">
            ${r.isLiked?'❤️':'🤍'} 좋아요 ${r.likes}
          </button>
          <button class="detail-action-btn" onclick="App.shareReview('${r.id}')">🔗 공유</button>
          <button class="detail-action-btn" onclick="App.showToast('신고 접수')">🚩 신고</button>
        </div>
      </div>`;
  },

  toggleLike(id, btn) {
    if (!this.currentUser) { this.showLoginSheet(); return; }
    const r = MOCK_REVIEWS.find(r => r.id === id);
    if (!r) return;
    r.isLiked = !r.isLiked; r.likes += r.isLiked ? 1 : -1;
    btn.className = `detail-action-btn${r.isLiked?' liked':''}`;
    btn.innerHTML = `${r.isLiked?'❤️':'🤍'} 좋아요 ${r.likes}`;
    if (r.isLiked) this.showToast('좋아요!', 'success');
  },

  // =================== 인증 ===================
  doLogin() {
    // MVP: 이메일/비밀번호 무관하게 MOCK_USERS[0]으로 로그인
    this.currentUser = MOCK_USERS[0];
    setCurrentUser(this.currentUser);
    this.updateUserUI();
    this.showToast(`${this.currentUser.nickname}님, 환영해요! 🎉`, 'success');
    this.navigate('home');
  },

  doLogout() {
    this.currentUser = null;
    setCurrentUser(null);
    this.updateUserUI();
    this.renderHome();
    this.showToast('로그아웃 되었습니다', 'default');
    this.navigate('home');
  },

  // =================== 유틸 ===================
  shareReview(id) {
    if (navigator.share) navigator.share({ title:'찐행', url: location.href });
    else this.showToast('링크가 복사되었습니다!', 'success');
  },

  timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff/60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff/3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff/86400)}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR', { month:'short', day:'numeric' });
  },

  showToast(msg, type = 'default') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast${type !== 'default' ? ` ${type}` : ''}`;
    const icons = { success:'✓', error:'✕', warning:'⚠️', default:'' };
    t.innerHTML = `${icons[type]?`<span>${icons[type]}</span>`:''}${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
