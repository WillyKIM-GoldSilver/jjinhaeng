// =============================================
// 찐행 — SPA 메인 앱 로직 (PC-First, 장소 중심)
// =============================================

const App = {
  currentPage: 'home',
  currentUser: null,
  writeStep: 1,
  ticketVerified: false,
  locationVerified: false,
  selectedRating: 0,
  reviewViewGrid: true,
  selectedWritePlace: null,
  currentCat: 'all',

  init() {
    this.currentUser = getCurrentUser();
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
          <button class="sheet-btn-primary" onclick="document.getElementById('login-sheet').remove();App.navigate('login')">로그인</button>
          <button class="sheet-btn-secondary" onclick="document.getElementById('login-sheet').remove();App.navigate('register')">회원가입</button>
        </div>
      </div>`;
    document.body.appendChild(sheet);
  },

  navigate(page, params = {}) {
    const authRequired = ['write', 'profile'];
    if (authRequired.includes(page) && !this.currentUser) { this.showLoginSheet(); return; }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (!target) return;
    target.classList.add('active');
    this.currentPage = page;
    window.scrollTo(0, 0);

    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.bottom-nav .nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    this.onPageEnter(page, params);
  },

  onPageEnter(page, params) {
    if (page === 'home')          this.renderHome();
    if (page === 'map')           this.renderMap();
    if (page === 'search')        this.renderSearch(params.query, params.cat);
    if (page === 'place')         this.renderPlace(params.placeId);
    if (page === 'write')         this.initWrite();
    if (page === 'profile')       this.renderProfile();
    if (page === 'review-detail') this.renderDetail(params.reviewId);
  },

  updateUserUI() {
    const u = this.currentUser;
    const sidebarUser = document.getElementById('sidebar-user');
    const topbarRight = document.getElementById('topbar-right');

    if (u) {
      const init = u.nickname.substring(0, 2);
      ['sidebar-avatar', 'topbar-avatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = init;
      });
      const un = document.getElementById('sidebar-username');
      if (un) un.textContent = u.nickname;
      const sub = document.getElementById('sidebar-usersub');
      if (sub) sub.textContent = `광고수익 ₩${u.totalEarnings.toLocaleString()}`;
      if (sidebarUser) { sidebarUser.onclick = () => this.navigate('profile'); }
      if (topbarRight) topbarRight.innerHTML = `
        <div class="topbar-btn" onclick="App.showToast('알림 3개')">🔔<span class="notif-dot"></span></div>
        <div class="topbar-avatar" onclick="App.navigate('profile')">${init}</div>`;
    } else {
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
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => this.navigate(item.dataset.page));
    });
    document.querySelectorAll('.bottom-nav .nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => this.navigate(item.dataset.page));
    });
    // 탑바 검색창 클릭 → 검색 페이지로
    document.getElementById('topbar-search-input')?.addEventListener('click', () => this.navigate('search'));

    // write 버튼
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

    // 티켓 업로드
    document.getElementById('ticket-upload-zone')?.addEventListener('click', () => this.simulateTicketUpload());

    // 검색창 입력 이벤트
    const searchInput = document.getElementById('search-main-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value;
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
        this.doSearch(q, this.currentCat);
      });
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.doSearch(e.target.value, this.currentCat);
      });
    }

    // 장소 검색 (write)
    document.getElementById('write-place-search')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.searchWritePlace();
    });
  },

  // =================== HOME ===================
  renderHome() {
    this.renderHero();
    this.renderHomeCatFilter();
    this.renderPopularPlaces();
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
        <div class="hero-btn-secondary" onclick="App.navigate('map')">🗺️ 지도로 탐색</div>`;
    } else {
      if (greeting) greeting.textContent = '항공권 + GPS 인증으로 믿을 수 있는 장소 후기만';
      if (heroBtns) heroBtns.innerHTML = `
        <div class="hero-btn-primary" onclick="App.navigate('register')">무료로 시작하기</div>
        <div class="hero-btn-secondary" onclick="App.navigate('search')">🔍 장소 검색</div>`;
    }
  },

  renderHomeCatFilter() {
    const el = document.getElementById('home-cat-filter');
    if (!el) return;
    el.innerHTML = PLACE_CATEGORIES.map(c => `
      <div class="cat-filter-chip${c.id === this.currentCat ? ' active' : ''}"
           onclick="App.selectHomeCat('${c.id}')">
        <span>${c.icon}</span><span>${c.label}</span>
      </div>`).join('');
  },

  selectHomeCat(catId) {
    this.currentCat = catId;
    this.renderHomeCatFilter();
    this.renderPopularPlaces();
  },

  renderPopularPlaces(containerId = 'popular-places') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const places = API.getPopularPlaces(6, this.currentCat === 'all' ? null : this.currentCat);
    el.innerHTML = places.map(p => this.buildPlaceCard(p)).join('');
  },

  buildPlaceCard(place) {
    const catColors = {
      '음식점': 'linear-gradient(135deg,#FFE8D0,#FFB380)',
      '카페':   'linear-gradient(135deg,#FFF0D0,#FFD580)',
      '명소':   'linear-gradient(135deg,#D0E8FF,#80B8FF)',
      '쇼핑':   'linear-gradient(135deg,#F0D0FF,#C880FF)',
      '액티비티':'linear-gradient(135deg,#D0FFE8,#80FFB8)',
    };
    const bg = catColors[place.category] || 'linear-gradient(135deg,#E8ECFF,#C8D8FF)';
    const priceStr = place.priceLevel ? '₩'.repeat(place.priceLevel) : '';
    return `
      <div class="place-card" onclick="App.navigate('place',{placeId:'${place.id}'})">
        <div class="place-card-thumb" style="background:${bg}">
          <span class="place-card-emoji">${place.emoji}</span>
          <div class="place-card-cat-badge">${place.category}</div>
        </div>
        <div class="place-card-body">
          <div class="place-card-name">${place.name}</div>
          <div class="place-card-city">📍 ${place.city}, ${place.country}</div>
          <div class="place-card-meta">
            <span class="place-card-rating">⭐ ${place.rating.toFixed(1)}</span>
            <span class="place-card-count">(${place.reviewCount})</span>
            ${priceStr ? `<span class="place-card-price">${priceStr}</span>` : ''}
          </div>
          <div class="place-card-tags">${(place.tags||[]).slice(0,3).map(t=>`<span class="place-tag">#${t}</span>`).join('')}</div>
        </div>
      </div>`;
  },

  renderReviewGrid(reviews = null) {
    const el = document.getElementById('review-feed');
    if (!el) return;
    const list = reviews || API.getRecentReviews(8);
    el.className = `review-grid${this.reviewViewGrid ? '' : ' list-view'}`;
    el.innerHTML = list.map(r => this.buildReviewCard(r)).join('');
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
    const icons = ['🗾','🌏','📸'];
    const cnt = Math.min((review.photos || []).length, 3);

    let photosHtml = '';
    if (cnt > 0) {
      const items = Array.from({length: cnt}, (_, i) => `
        <div class="rc-photo">
          <div class="rc-photo-inner" style="background:${gradients[i%3]}">
            <span style="font-size:${i===0&&cnt===3?'2rem':'1.8rem'}">${icons[i%3]}</span>
          </div>
        </div>`).join('');
      photosHtml = `<div class="rc-photos photos-${cnt}">${items}</div>`;
    }

    const verifyBadges = [
      review.ticketVerified  ? '<span class="verify-chip ticket">✈️ 항공권</span>' : '',
      review.locationVerified? '<span class="verify-chip location">📍 위치</span>' : '',
      review.youtube         ? '<span class="verify-chip youtube">▶ 유튜브</span>' : '',
      review.instagram       ? '<span class="verify-chip instagram">📸 인스타</span>' : '',
    ].filter(Boolean).join('');

    const displayName = user.nickname.length > 10 ? user.nickname.substring(0,10)+'…' : user.nickname;

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
            <div class="rc-place" onclick="event.stopPropagation();App.navigate('place',{placeId:'${review.placeId}'})">📍 ${place?.name || '알 수 없는 장소'}</div>
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
      </article>`;
  },

  buildStars(n) {
    return `<div class="stars">${[1,2,3,4,5].map(i=>`<span class="star${i<=n?' filled':''}">★</span>`).join('')}</div>`;
  },

  renderHomeAd() {
    const el = document.getElementById('home-ad-wrap');
    if (!el) return;
    const ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
    const icons = { flight:'✈️', tour:'🗺️', hotel:'🏨' };
    el.innerHTML = `
      <div class="ad-unit" onclick="App.showToast('광고 클릭! 🎉','success')">
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
    if (btn) btn.textContent = this.reviewViewGrid ? '📋 리스트' : '⊞ 그리드';
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
        if (r.isLiked) this.showToast('좋아요!', 'success');
      });
    });
    document.querySelectorAll('.review-card').forEach(card => {
      card.addEventListener('click', e => {
        if (!e.target.closest('button')) this.navigate('review-detail', { reviewId: card.dataset.reviewId });
      });
    });
  },

  // =================== MAP ===================
  renderMap() {
    this.renderMapCatChips();
    this.renderMapPins();
    this.renderMapPlaceList();
  },

  renderMapCatChips() {
    const el = document.getElementById('map-cat-chips');
    if (!el) return;
    el.innerHTML = PLACE_CATEGORIES.map(c => `
      <div class="map-cat-chip" onclick="App.showToast('${c.label} 필터')">
        ${c.icon} ${c.label}
      </div>`).join('');
  },

  renderMapPins() {
    const el = document.getElementById('map-pins');
    if (!el) return;
    const pinData = [
      { x:'28%', y:'32%', name:'도쿄', hot:true  },
      { x:'25%', y:'41%', name:'오사카', hot:false },
      { x:'49%', y:'63%', name:'방콕', hot:true  },
      { x:'54%', y:'48%', name:'다낭', hot:true  },
      { x:'51%', y:'35%', name:'타이베이', hot:false },
      { x:'30%', y:'36%', name:'제주', hot:true  },
      { x:'34%', y:'30%', name:'부산', hot:false },
      { x:'20%', y:'38%', name:'서울', hot:false },
      { x:'16%', y:'52%', name:'파리', hot:false },
      { x:'43%', y:'45%', name:'홍콩', hot:true  },
    ];
    el.innerHTML = pinData.map(p => `
      <div class="map-pin" style="left:${p.x};top:${p.y}"
           onclick="App.showToast('${p.name} 장소 목록')">
        <div class="pin-bubble${p.hot?' hot':''}">${p.name}</div>
        <div class="pin-tail"></div>
      </div>`).join('');
  },

  renderMapPlaceList() {
    const el = document.getElementById('map-place-list');
    if (!el) return;
    const places = API.getPopularPlaces(10);
    document.getElementById('map-place-count').textContent = `${places.length}개`;
    el.innerHTML = places.map(p => `
      <div class="map-place-item" onclick="App.navigate('place',{placeId:'${p.id}'})">
        <div class="map-place-emoji">${p.emoji}</div>
        <div class="map-place-info">
          <div class="map-place-name">${p.name}</div>
          <div class="map-place-meta">⭐ ${p.rating.toFixed(1)} · ${p.city} · ${p.category}</div>
        </div>
        <span class="map-place-arrow">›</span>
      </div>`).join('');
  },

  // =================== SEARCH ===================
  renderSearch(initQuery = '', initCat = 'all') {
    this.currentCat = initCat || 'all';
    this.renderSearchCatRow();

    // 트렌딩 태그
    const trendEl = document.getElementById('search-trending-tags');
    if (trendEl) {
      trendEl.innerHTML = TRENDING_TAGS.slice(0, 12).map(tag => `
        <div class="trending-chip" onclick="App.quickSearch('${tag}')">#${tag}</div>`).join('');
    }

    // 검색 전 인기 장소
    const popEl = document.getElementById('search-popular-places');
    if (popEl) {
      const places = API.getPopularPlaces(6);
      popEl.innerHTML = places.map(p => this.buildPlaceCard(p)).join('');
    }

    if (initQuery) {
      const inp = document.getElementById('search-main-input');
      if (inp) inp.value = initQuery;
      this.doSearch(initQuery, this.currentCat);
    }
  },

  renderSearchCatRow() {
    const el = document.getElementById('search-cat-row');
    if (!el) return;
    el.innerHTML = PLACE_CATEGORIES.map(c => `
      <div class="search-cat-chip${c.id === this.currentCat ? ' active' : ''}"
           onclick="App.selectSearchCat('${c.id}')">
        ${c.icon} ${c.label}
      </div>`).join('');
  },

  selectSearchCat(catId) {
    this.currentCat = catId;
    this.renderSearchCatRow();
    const q = document.getElementById('search-main-input')?.value || '';
    this.doSearch(q, catId);
  },

  quickSearch(tag) {
    const inp = document.getElementById('search-main-input');
    if (inp) { inp.value = tag; const cb = document.getElementById('search-clear-btn'); if (cb) cb.style.display = 'flex'; }
    this.doSearch(tag, this.currentCat);
  },

  doSearch(q, cat) {
    const defaultEl = document.getElementById('search-default');
    const resultsEl = document.getElementById('search-results');
    const metaEl = document.getElementById('search-result-meta');
    const listEl = document.getElementById('search-result-places');
    const noResultEl = document.getElementById('search-no-result');

    if (!q || !q.trim()) {
      if (defaultEl) defaultEl.style.display = 'block';
      if (resultsEl) resultsEl.style.display = 'none';
      return;
    }

    const catFilter = (cat && cat !== 'all') ? cat : null;
    const places = API.searchPlaces(q, catFilter);

    if (defaultEl) defaultEl.style.display = 'none';
    if (resultsEl) resultsEl.style.display = 'block';
    if (metaEl) metaEl.innerHTML = `<span class="result-keyword">"${q}"</span> 검색 결과 <span class="result-count">${places.length}개</span>`;

    if (places.length === 0) {
      if (listEl) listEl.innerHTML = '';
      if (noResultEl) noResultEl.style.display = 'block';
    } else {
      if (noResultEl) noResultEl.style.display = 'none';
      if (listEl) listEl.innerHTML = places.map(p => this.buildPlaceCard(p)).join('');
    }
  },

  clearSearch() {
    const inp = document.getElementById('search-main-input');
    if (inp) inp.value = '';
    const cb = document.getElementById('search-clear-btn');
    if (cb) cb.style.display = 'none';
    const defaultEl = document.getElementById('search-default');
    const resultsEl = document.getElementById('search-results');
    if (defaultEl) defaultEl.style.display = 'block';
    if (resultsEl) resultsEl.style.display = 'none';
  },

  // =================== PLACE DETAIL ===================
  renderPlace(placeId) {
    const place = API.getPlace(placeId);
    const el = document.getElementById('place-content');
    if (!el || !place) return;

    const reviews = API.getPlaceReviews(placeId);
    const reviewsHtml = reviews.length
      ? reviews.map(r => this.buildReviewCard(r)).join('')
      : `<div style="text-align:center;padding:40px;color:var(--text-secondary)">아직 후기가 없어요. 첫 번째 찐후기를 남겨보세요!</div>`;

    const priceStr = place.priceLevel ? '₩'.repeat(place.priceLevel) : '';
    const catColors = {
      '음식점': 'linear-gradient(135deg,#FFE8D0,#FFB380)',
      '카페':   'linear-gradient(135deg,#FFF0D0,#FFD580)',
      '명소':   'linear-gradient(135deg,#D0E8FF,#80B8FF)',
      '쇼핑':   'linear-gradient(135deg,#F0D0FF,#C880FF)',
      '액티비티':'linear-gradient(135deg,#D0FFE8,#80FFB8)',
    };
    const bg = catColors[place.category] || 'linear-gradient(135deg,#E8ECFF,#C8D8FF)';

    el.innerHTML = `
      <div class="place-detail-page">
        <!-- 헤더 -->
        <div class="place-detail-header" style="background:${bg}">
          <div class="place-detail-back" onclick="App.navigate('search')">‹ 뒤로</div>
          <div class="place-detail-emoji">${place.emoji}</div>
          <div class="place-detail-info">
            <div class="place-detail-cat">${place.category}</div>
            <h1 class="place-detail-name">${place.name}</h1>
            <div class="place-detail-location">📍 ${place.city}, ${place.country}</div>
            <div class="place-detail-meta-row">
              <span class="place-rating-big">⭐ ${place.rating.toFixed(1)}</span>
              <span class="place-review-cnt">(${place.reviewCount}개 후기)</span>
              ${priceStr ? `<span class="place-price">${priceStr}</span>` : ''}
            </div>
            <div class="place-detail-address">🏠 ${place.address}</div>
          </div>
        </div>
        <!-- 태그 -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;padding:0 0 20px">
          ${(place.tags||[]).map(t=>`<span class="place-tag-lg">#${t}</span>`).join('')}
        </div>
        <!-- 광고 -->
        <div class="ad-unit" style="margin-bottom:28px" onclick="App.showToast('광고 클릭! 🎉','success')">
          <span class="ad-label">광고</span>
          <div class="ad-icon">✈️</div>
          <div class="ad-info">
            <div class="ad-title">${MOCK_ADS[0].title}</div>
            <div class="ad-subtitle">${MOCK_ADS[0].subtitle}</div>
            <div class="ad-cta">${MOCK_ADS[0].cta} →</div>
          </div>
        </div>
        <!-- 후기 섹션 -->
        <div class="section-header">
          <div>
            <div class="section-title">📝 찐후기 ${reviews.length}개</div>
            <div class="section-sub">인증된 방문자만 남긴 솔직한 후기</div>
          </div>
          <select class="sort-select" onchange="App.sortPlaceReviews('${placeId}',this.value)">
            <option value="recent">최신순</option>
            <option value="helpful">도움순</option>
            <option value="rating-high">별점높은순</option>
            <option value="rating-low">별점낮은순</option>
          </select>
        </div>
        <div class="review-grid" id="place-review-grid">${reviewsHtml}</div>
      </div>
      <!-- 플로팅 후기 쓰기 버튼 -->
      <div class="place-write-fab" onclick="App.navigate('write')">
        ✏️ 이 장소 후기 쓰기
      </div>`;

    setTimeout(() => this.bindCardEvents(), 50);
  },

  sortPlaceReviews(placeId, sort) {
    const reviews = API.getPlaceReviews(placeId, sort);
    const el = document.getElementById('place-review-grid');
    if (el) { el.innerHTML = reviews.map(r => this.buildReviewCard(r)).join(''); this.bindCardEvents(); }
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
      <div class="trending-tag-item" onclick="App.navigate('search',{query:'${tag}'})">
        <span class="trending-tag-rank${i < 3 ? ' top' : ''}">${i+1}</span>
        <span class="trending-tag-name">${tag}</span>
        <span class="trending-tag-count">${Math.floor(Math.random()*900+100)}개</span>
      </div>`).join('');
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

  // =================== WRITE ===================
  initWrite() {
    this.writeStep = 1;
    this.ticketVerified = false;
    this.locationVerified = false;
    this.selectedRating = 0;
    this.selectedWritePlace = null;
    this.updateWriteUI();
    // 장소 선택 초기화
    const resultsEl = document.getElementById('write-place-results');
    const selectedEl = document.getElementById('write-selected-place');
    if (resultsEl) resultsEl.style.display = 'none';
    if (selectedEl) selectedEl.style.display = 'none';
  },

  updateWriteUI() {
    document.querySelectorAll('.write-step-item').forEach((item, idx) => {
      const n = idx + 1;
      const dot = item.querySelector('.write-step-dot');
      item.classList.remove('active','done');
      dot.classList.remove('active','done');
      if (n < this.writeStep) { item.classList.add('done'); dot.classList.add('done'); dot.textContent = '✓'; }
      else if (n === this.writeStep) { item.classList.add('active'); dot.classList.add('active'); dot.textContent = n; }
      else { dot.textContent = n; }
    });
    for (let i = 1; i <= 3; i++) {
      const line = document.getElementById(`sline-${i}`);
      if (line) line.classList.toggle('done', i < this.writeStep);
    }
    document.querySelectorAll('.write-step-content').forEach(c => c.style.display = 'none');
    const active = document.getElementById(`write-step-${this.writeStep}`);
    if (active) active.style.display = 'flex';
    const prev = document.getElementById('write-prev-btn');
    const next = document.getElementById('write-next-btn');
    const submit = document.getElementById('write-submit-btn');
    if (prev) prev.style.display = this.writeStep > 1 ? 'inline-flex' : 'none';
    if (next) next.style.display = this.writeStep < 4 ? 'inline-flex' : 'none';
    if (submit) submit.style.display = this.writeStep === 4 ? 'inline-flex' : 'none';
  },

  writeNext() {
    if (this.writeStep === 1 && !this.selectedWritePlace) {
      this.showToast('후기를 남길 장소를 선택해 주세요', 'error'); return;
    }
    if (this.writeStep === 2 && !this.ticketVerified) {
      this.showToast('항공권 또는 선박이용권 인증이 필요합니다', 'error'); return;
    }
    if (this.writeStep === 3 && !this.locationVerified) {
      this.showToast('사진의 GPS/EXIF 위치 인증이 필요합니다', 'error'); return;
    }
    if (this.writeStep < 4) { this.writeStep++; this.updateWriteUI(); }
  },

  writePrev() {
    if (this.writeStep > 1) { this.writeStep--; this.updateWriteUI(); }
  },

  searchWritePlace() {
    const q = document.getElementById('write-place-search')?.value?.trim();
    if (!q) { this.showToast('장소 이름을 입력해 주세요', 'error'); return; }
    const places = API.searchPlaces(q);
    const resultsEl = document.getElementById('write-place-results');
    const listEl = document.getElementById('write-place-list');
    if (!listEl || !resultsEl) return;
    resultsEl.style.display = 'block';
    if (places.length === 0) {
      listEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-secondary)">검색 결과가 없어요. 직접 입력하거나 다른 키워드를 시도해 보세요.</div>`;
    } else {
      listEl.innerHTML = places.map(p => `
        <div class="write-place-item" onclick="App.selectWritePlace('${p.id}')">
          <span class="write-place-emoji">${p.emoji}</span>
          <div class="write-place-info">
            <div class="write-place-name">${p.name}</div>
            <div class="write-place-meta">📍 ${p.city}, ${p.country} · ${p.category}</div>
          </div>
          <span>›</span>
        </div>`).join('');
    }
  },

  selectWritePlace(placeId) {
    const place = API.getPlace(placeId);
    if (!place) return;
    this.selectedWritePlace = place;
    const resultsEl = document.getElementById('write-place-results');
    const selectedEl = document.getElementById('write-selected-place');
    const cardEl = document.getElementById('selected-place-card');
    if (resultsEl) resultsEl.style.display = 'none';
    if (selectedEl) selectedEl.style.display = 'block';
    if (cardEl) cardEl.innerHTML = `
      <div class="selected-place-inner">
        <span style="font-size:2rem">${place.emoji}</span>
        <div>
          <div style="font-weight:800;font-size:0.9375rem">${place.name}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:2px">📍 ${place.city}, ${place.country} · ${place.category}</div>
          <div style="font-size:0.75rem;color:var(--secondary-dark);margin-top:4px;font-weight:700">✅ 선택됨</div>
        </div>
      </div>`;
    this.showToast(`"${place.name}" 선택 완료!`, 'success');
  },

  clearWritePlace() {
    this.selectedWritePlace = null;
    const selectedEl = document.getElementById('write-selected-place');
    const inp = document.getElementById('write-place-search');
    if (selectedEl) selectedEl.style.display = 'none';
    if (inp) inp.value = '';
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
      this.showToast('항공권 인증 완료! ✈️', 'success');
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
        this.showToast('사진 위치 인증 완료! 📍', 'success');
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
      this.showToast('찐후기가 등록되었습니다! 🎉', 'success');
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
    const gradients = ['linear-gradient(160deg,#dce9ff,#b8d0ff)','linear-gradient(160deg,#d0fff5,#b8ffe8)','linear-gradient(160deg,#ffe8d0,#ffd0b8)'];
    const icons = ['🗾','🌏','📸'];
    const cnt = Math.min((r.photos||[]).length, 3);

    const media = document.getElementById('detail-media');
    if (media) {
      media.innerHTML = `<div class="detail-media-inner">${Array.from({length:Math.max(cnt,1)},(_,i)=>`<div class="detail-photo${i===0?' main':''}" style="background:${gradients[i%3]};display:flex;align-items:center;justify-content:center;font-size:${i===0?'4rem':'2.5rem'}">${icons[i%3]}</div>`).join('')}</div>`;
    }

    const panel = document.getElementById('detail-content-panel');
    if (!panel) return;
    const linksHtml = [
      r.youtube   ? `<div class="detail-link" onclick="App.showToast('유튜브로 이동')"><span class="link-icon">▶️</span><div class="link-info"><div class="link-title">유튜브 영상 보기</div><div class="link-url">${r.youtube}</div></div><span>›</span></div>` : '',
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
        <div>
          <span class="detail-place-chip" onclick="App.navigate('place',{placeId:'${r.placeId}'})">
            📍 ${place?.name||'장소 정보 없음'}
          </span>
        </div>
        <div class="detail-title">${r.title}</div>
        ${this.buildStars(r.rating)}
        <div class="detail-user-row">
          <div class="detail-avatar">${user.nickname.substring(0,2)}</div>
          <span class="detail-user-name">${user.nickname}</span>
          <span class="detail-date">${this.timeAgo(r.createdAt)}</span>
        </div>
        <div class="detail-verify-row">
          ${r.ticketVerified  ?'<span class="verify-chip ticket">✈️ 항공권 인증됨</span>':''}
          ${r.locationVerified?'<span class="verify-chip location">📍 위치 인증됨</span>':''}
          ${r.youtube         ?'<span class="verify-chip youtube">▶ 유튜브</span>':''}
          ${r.instagram       ?'<span class="verify-chip instagram">📸 인스타</span>':''}
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
