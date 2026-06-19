// =============================================
// 찐행 - Mock Data (서버 연동 전 프로토타입용)
// 핵심: 개별 장소(플레이스) 단위 리뷰 플랫폼
// =============================================

const MOCK_USERS = [
  {
    id: 'u001',
    nickname: '여행덕후김민준',
    passportName: 'KIM MIN JUN',
    email: 'minjun@example.com',
    avatar: null,
    reviewCount: 24,
    totalEarnings: 48200,
    pendingEarnings: 12400,
    instagram: 'https://instagram.com/travel_minjun',
    youtube: null,
    joinedAt: '2025-03-15',
    verified: true,
  },
  {
    id: 'u002',
    nickname: '세계일주박지영',
    passportName: 'PARK JI YOUNG',
    email: 'jiyoung@example.com',
    avatar: null,
    reviewCount: 87,
    totalEarnings: 203500,
    pendingEarnings: 31200,
    instagram: 'https://instagram.com/jiyoung_world',
    youtube: 'https://youtube.com/@jiyoung_travel',
    joinedAt: '2024-11-08',
    verified: true,
  },
  {
    id: 'u003',
    nickname: '맛집탐방이서준',
    passportName: 'LEE SEO JUN',
    email: 'seojun@example.com',
    avatar: null,
    reviewCount: 41,
    totalEarnings: 78900,
    pendingEarnings: 9800,
    instagram: null,
    youtube: null,
    joinedAt: '2025-08-22',
    verified: true,
  },
];

// 장소(플레이스) — 찐행의 핵심 데이터
const MOCK_PLACES = [
  // ── 도쿄 ──
  {
    id: 'p001', city: '도쿄', country: '일본', emoji: '⛩️',
    name: '츠키지 타마고야키 다이와', category: '음식점',
    address: '일본 도쿄 츠키지 4-16-2',
    lat: 35.6654, lng: 139.7707,
    rating: 4.8, reviewCount: 143,
    tags: ['아침식사', '계란구이', '현지맛집'],
    priceLevel: 1,
  },
  {
    id: 'p002', city: '도쿄', country: '일본', emoji: '⛩️',
    name: '시부야 스크램블 교차로', category: '명소',
    address: '일본 도쿄 시부야구 도겐자카 2-1',
    lat: 35.6595, lng: 139.7004,
    rating: 4.5, reviewCount: 892,
    tags: ['야경', '포토스팟', '도시'],
    priceLevel: 0,
  },
  {
    id: 'p006', city: '도쿄', country: '일본', emoji: '⛩️',
    name: '이치란 라멘 신주쿠점', category: '음식점',
    address: '일본 도쿄 신주쿠구 가부키초 1-22',
    lat: 35.6938, lng: 139.7034,
    rating: 4.7, reviewCount: 567,
    tags: ['라멘', '혼밥', '24시간'],
    priceLevel: 2,
  },
  {
    id: 'p015', city: '도쿄', country: '일본', emoji: '⛩️',
    name: '아사쿠사 카미나리몬', category: '명소',
    address: '일본 도쿄 다이토구 아사쿠사 2-3-1',
    lat: 35.7148, lng: 139.7967,
    rating: 4.6, reviewCount: 1204,
    tags: ['전통', '포토스팟', '역사'],
    priceLevel: 0,
  },

  // ── 오사카 ──
  {
    id: 'p005', city: '오사카', country: '일본', emoji: '🏯',
    name: '도톤보리 이치란 라멘', category: '음식점',
    address: '일본 오사카 주오구 도톤보리 1-7-26',
    lat: 34.6687, lng: 135.5025,
    rating: 4.7, reviewCount: 445,
    tags: ['라멘', '혼밥', '오사카맛집'],
    priceLevel: 2,
  },
  {
    id: 'p007', city: '오사카', country: '일본', emoji: '🏯',
    name: '오사카성 공원', category: '명소',
    address: '일본 오사카 츄오구 오사카조 1-1',
    lat: 34.6873, lng: 135.5262,
    rating: 4.6, reviewCount: 1023,
    tags: ['역사', '포토스팟', '산책'],
    priceLevel: 1,
  },
  {
    id: 'p016', city: '오사카', country: '일본', emoji: '🏯',
    name: '구로몬 시장 이자카야', category: '음식점',
    address: '일본 오사카 주오구 닛폰바시 2-4-1',
    lat: 34.6671, lng: 135.5078,
    rating: 4.5, reviewCount: 389,
    tags: ['해산물', '이자카야', '로컬'],
    priceLevel: 2,
  },

  // ── 제주도 ──
  {
    id: 'p003', city: '제주도', country: '한국', emoji: '🌋',
    name: '흑돼지 거리 원조 강정이네', category: '음식점',
    address: '제주특별자치도 제주시 연동 312-1',
    lat: 33.4890, lng: 126.4983,
    rating: 4.9, reviewCount: 578,
    tags: ['흑돼지', '제주맛집', '현지인추천'],
    priceLevel: 2,
  },
  {
    id: 'p008', city: '제주도', country: '한국', emoji: '🌋',
    name: '협재 해수욕장', category: '명소',
    address: '제주특별자치도 제주시 한림읍 협재리 2497',
    lat: 33.3944, lng: 126.2394,
    rating: 4.8, reviewCount: 342,
    tags: ['해변', '스노클링', '에메랄드'],
    priceLevel: 0,
  },
  {
    id: 'p017', city: '제주도', country: '한국', emoji: '🌋',
    name: '성산일출봉', category: '명소',
    address: '제주특별자치도 서귀포시 성산읍 일출로 284-12',
    lat: 33.4580, lng: 126.9425,
    rating: 4.7, reviewCount: 892,
    tags: ['일출', '등산', '세계유산'],
    priceLevel: 1,
  },

  // ── 다낭 ──
  {
    id: 'p004', city: '다낭', country: '베트남', emoji: '🐉',
    name: '미케비치 선베드 카페', category: '카페',
    address: '베트남 다낭 응우하인선군 호앙사',
    lat: 16.0488, lng: 108.2478,
    rating: 4.6, reviewCount: 234,
    tags: ['해변', '선셋뷰', '코코넛'],
    priceLevel: 1,
  },
  {
    id: 'p009', city: '다낭', country: '베트남', emoji: '🐉',
    name: '바나힐 골든 브릿지', category: '액티비티',
    address: '베트남 다낭 호아방현 호아닌',
    lat: 15.9973, lng: 107.9880,
    rating: 4.4, reviewCount: 189,
    tags: ['황금다리', '케이블카', '인스타'],
    priceLevel: 3,
  },

  // ── 방콕 ──
  {
    id: 'p010', city: '방콕', country: '태국', emoji: '🛕',
    name: '왓 포 사원 (와불)', category: '명소',
    address: '태국 방콕 프라나콘구 타왕 2',
    lat: 13.7465, lng: 100.4930,
    rating: 4.7, reviewCount: 623,
    tags: ['사원', '역사', '와불'],
    priceLevel: 1,
  },
  {
    id: 'p011', city: '방콕', country: '태국', emoji: '🛕',
    name: '짜뚜짝 주말 시장', category: '쇼핑',
    address: '태국 방콕 짜뚜짝구 캄팽펫 2로',
    lat: 13.7999, lng: 100.5500,
    rating: 4.5, reviewCount: 445,
    tags: ['쇼핑', '기념품', '빈티지'],
    priceLevel: 1,
  },

  // ── 파리 ──
  {
    id: 'p012', city: '파리', country: '프랑스', emoji: '🗼',
    name: '에펠탑 야경 뷰포인트 (샤요 광장)', category: '명소',
    address: '프랑스 파리 16구 샤요 광장',
    lat: 48.8584, lng: 2.2945,
    rating: 4.9, reviewCount: 987,
    tags: ['야경', '포토스팟', '랜드마크'],
    priceLevel: 0,
  },
  {
    id: 'p018', city: '파리', country: '프랑스', emoji: '🗼',
    name: '르 말레 팔라펠 L\'As du Fallafel', category: '음식점',
    address: '프랑스 파리 4구 로지에가 34',
    lat: 48.8574, lng: 2.3534,
    rating: 4.8, reviewCount: 312,
    tags: ['팔라펠', '마레지구', '현지맛집'],
    priceLevel: 1,
  },

  // ── 부산 ──
  {
    id: 'p013', city: '부산', country: '한국', emoji: '🌉',
    name: '해운대 암소갈비집', category: '음식점',
    address: '부산광역시 해운대구 중동 1413',
    lat: 35.1587, lng: 129.1604,
    rating: 4.8, reviewCount: 312,
    tags: ['갈비', '부산맛집', '현지인'],
    priceLevel: 3,
  },
  {
    id: 'p014', city: '부산', country: '한국', emoji: '🌉',
    name: '감천문화마을', category: '명소',
    address: '부산광역시 사하구 감천2동 감내2로 203',
    lat: 35.0975, lng: 129.0106,
    rating: 4.6, reviewCount: 521,
    tags: ['포토스팟', '벽화', '예술마을'],
    priceLevel: 0,
  },

  // ── 타이베이 ──
  {
    id: 'p019', city: '타이베이', country: '대만', emoji: '🏮',
    name: '스린 야시장', category: '쇼핑',
    address: '대만 타이베이 스린구 지허로 101',
    lat: 25.0880, lng: 121.5240,
    rating: 4.5, reviewCount: 678,
    tags: ['야시장', '길거리음식', '밤문화'],
    priceLevel: 1,
  },
  {
    id: 'p020', city: '타이베이', country: '대만', emoji: '🏮',
    name: '예류 지질공원', category: '명소',
    address: '대만 신베이시 완리구 예류리 167-1',
    lat: 25.2054, lng: 121.6891,
    rating: 4.4, reviewCount: 289,
    tags: ['지질', '자연', '여왕바위'],
    priceLevel: 1,
  },
];

// =============================================
// 로컬도(localScore) 모델 — "여행지의 로컬" 발견 렌즈
// localScore는 콘텐츠를 거르는 문이 아니라 발견을 돕는 렌즈(0~100 연속값).
// 유명 관광지도 한국인 리뷰를 그대로 받는다 — 토글은 정렬·강조만 바꾼다.
// =============================================
const LOCAL_SCORE_CONFIG = {
  weights: { geo: 0.5, api: 0.3, chain: 0.2 }, // prior 비중 (합=1)
  smoothingK: 8,                                // 신뢰 전환 속도 (8표면 50% 신뢰)
  geoMaxKm: 3,                                  // geoScore 정규화 분모
  buckets: { tourist: 35, local: 65 },         // 라벨 경계 (관광지/혼합/로컬)
  toggleSplit: 50,                             // 관광지/로컬 토글 필터 기준점
};

// 장소별 로컬도 입력 데이터 — 점수는 computeLocalScore가 산출(하드코딩 아님).
// touristApiId: TourAPI 등재 식별자(없으면 null) / isChain: 프랜차이즈 여부
// distToTouristCore: 관광 중심에서의 거리(km) / koreanVerifiedCount: 🇰🇷 인증 방문 수
// localTags: 한국인 인증자 태그 투표(현지인많음 vs 관광객많음)
const PLACE_LOCAL_DATA = {
  p001: { touristApiId: null,     isChain: false, distToTouristCore: 0.6, koreanVerifiedCount: 96,  localTags: { 현지인많음: 71, 관광객많음: 22 } },
  p002: { touristApiId: 'T13002', isChain: false, distToTouristCore: 0.0, koreanVerifiedCount: 540, localTags: { 현지인많음: 8,  관광객많음: 300 } },
  p006: { touristApiId: null,     isChain: true,  distToTouristCore: 0.4, koreanVerifiedCount: 380, localTags: { 현지인많음: 40, 관광객많음: 160 } },
  p015: { touristApiId: 'T13015', isChain: false, distToTouristCore: 0.1, koreanVerifiedCount: 700, localTags: { 현지인많음: 20, 관광객많음: 400 } },
  p005: { touristApiId: null,     isChain: true,  distToTouristCore: 0.2, koreanVerifiedCount: 300, localTags: { 현지인많음: 30, 관광객많음: 140 } },
  p007: { touristApiId: 'T27007', isChain: false, distToTouristCore: 0.1, koreanVerifiedCount: 600, localTags: { 현지인많음: 30, 관광객많음: 320 } },
  p016: { touristApiId: null,     isChain: false, distToTouristCore: 0.7, koreanVerifiedCount: 88,  localTags: { 현지인많음: 60, 관광객많음: 14 } },
  p003: { touristApiId: null,     isChain: false, distToTouristCore: 1.4, koreanVerifiedCount: 210, localTags: { 현지인많음: 150, 관광객많음: 30 } },
  p008: { touristApiId: 'T39008', isChain: false, distToTouristCore: 0.2, koreanVerifiedCount: 280, localTags: { 현지인많음: 40, 관광객많음: 160 } },
  p017: { touristApiId: 'T39017', isChain: false, distToTouristCore: 0.1, koreanVerifiedCount: 500, localTags: { 현지인많음: 30, 관광객많음: 300 } },
  p004: { touristApiId: null,     isChain: false, distToTouristCore: 0.5, koreanVerifiedCount: 120, localTags: { 현지인많음: 50, 관광객많음: 70 } },
  p009: { touristApiId: 'V48009', isChain: false, distToTouristCore: 0.0, koreanVerifiedCount: 150, localTags: { 현지인많음: 5,  관광객많음: 180 } },
  p010: { touristApiId: 'B66010', isChain: false, distToTouristCore: 0.1, koreanVerifiedCount: 400, localTags: { 현지인많음: 20, 관광객많음: 280 } },
  p011: { touristApiId: 'B66011', isChain: false, distToTouristCore: 0.3, koreanVerifiedCount: 200, localTags: { 현지인많음: 90, 관광객많음: 120 } },
  p012: { touristApiId: 'F75012', isChain: false, distToTouristCore: 0.0, koreanVerifiedCount: 700, localTags: { 현지인많음: 10, 관광객많음: 500 } },
  p018: { touristApiId: null,     isChain: false, distToTouristCore: 0.9, koreanVerifiedCount: 140, localTags: { 현지인많음: 95, 관광객많음: 30 } },
  p013: { touristApiId: null,     isChain: false, distToTouristCore: 1.1, koreanVerifiedCount: 160, localTags: { 현지인많음: 120, 관광객많음: 25 } },
  p014: { touristApiId: 'K26014', isChain: false, distToTouristCore: 0.2, koreanVerifiedCount: 350, localTags: { 현지인많음: 30, 관광객많음: 250 } },
  p019: { touristApiId: 'W88019', isChain: false, distToTouristCore: 0.4, koreanVerifiedCount: 240, localTags: { 현지인많음: 100, 관광객많음: 115 } },
  p020: { touristApiId: 'W88020', isChain: false, distToTouristCore: 0.1, koreanVerifiedCount: 130, localTags: { 현지인많음: 15, 관광객많음: 140 } },
};

// 확신 가중(confidence blend): 데이터 추정(prior) → 한국인 행동(tag)으로 이전.
// n=0이면 100% prior(빈 캔버스 방지), 표가 쌓일수록 tagScore로 정밀화.
function computeLocalScore(place) {
  const cfg = LOCAL_SCORE_CONFIG, w = cfg.weights;
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const geoScore   = clamp01((place.distToTouristCore || 0) / cfg.geoMaxKm);
  const apiScore   = place.touristApiId ? 0 : 1; // 등재 관광지면 0
  const chainScore = place.isChain ? 0 : 1;      // 체인이면 0
  const prior = w.geo * geoScore + w.api * apiScore + w.chain * chainScore;
  const tags = place.localTags || {};
  const local = tags['현지인많음'] || 0, tourist = tags['관광객많음'] || 0;
  const votes = local + tourist;
  const tagScore = votes > 0 ? local / votes : prior; // 표 없으면 prior로 폴백
  const n = place.koreanVerifiedCount || 0;
  const c = n / (n + cfg.smoothingK);
  return Math.round(100 * (c * tagScore + (1 - c) * prior));
}

// 점수 → 버킷 라벨 (관광지 / 혼합 / 로컬)
function getLocalBucket(score) {
  const b = LOCAL_SCORE_CONFIG.buckets;
  if (score <= b.tourist) return 'tourist';
  if (score >= b.local)   return 'local';
  return 'mixed';
}

// 로드 시 1회: 입력 데이터 병합 + localScore 캐시
MOCK_PLACES.forEach(p => {
  Object.assign(p, PLACE_LOCAL_DATA[p.id] || {});
  p.localScore = computeLocalScore(p);
  p.localBucket = getLocalBucket(p.localScore);
});

// 리뷰 — 장소(placeId) 중심
const MOCK_REVIEWS = [
  {
    id: 'r001', userId: 'u002', placeId: 'p001',
    title: '도쿄 아침은 츠키지에서 시작해야죠',
    content: '새벽 5시에 가도 이미 줄이 있어요. 타마고야키 달콤하고 따뜻해서 아침에 딱이에요. 참치회도 바로 먹을 수 있고 신선도는 진짜 끝판왕입니다. 줄 서는 게 겁나서 미루다가 마지막날 갔는데 후회됩니다. 이 근처 숙소 잡고 매일 아침 갔으면 좋았을텐데...',
    rating: 5, photos: ['p1','p2','p3'],
    ticketVerified: true, locationVerified: true,
    instagram: 'https://instagram.com/p/example1', youtube: null,
    likes: 234, isLiked: false, adRevenue: 1240,
    createdAt: '2026-06-15T08:23:00Z', helpfulCount: 89,
  },
  {
    id: 'r002', userId: 'u001', placeId: 'p003',
    title: '제주 흑돼지 진짜 여기가 맞아요',
    content: '지인 추천으로 찾아갔습니다. 흑돼지 삼겹살 두 인분에 소주 한 병, 완전 만족. 고기 두께가 두툼하고 육즙이 장난아님. 된장찌개랑 같이 나오는 밑반찬들도 하나같이 퀄리티 있어요. 예약은 필수!!',
    rating: 5, photos: ['p4','p5'],
    ticketVerified: true, locationVerified: true,
    instagram: null, youtube: null,
    likes: 156, isLiked: true, adRevenue: 820,
    createdAt: '2026-06-12T19:45:00Z', helpfulCount: 67,
  },
  {
    id: 'r003', userId: 'u002', placeId: 'p002',
    title: '시부야 스크램블, 반드시 2층 카페에서 보세요',
    content: '교차로 바로 앞 스타벅스 2층 자리가 포토스팟으로 유명한데 아침 10시 전에 가면 자리 잡을 수 있어요. 야경은 진짜 장관입니다. 특히 비 오는 날 우산 쓰고 촬영하면 영화 한 장면 같아요.',
    rating: 4, photos: ['p6','p7'],
    ticketVerified: true, locationVerified: true,
    instagram: 'https://instagram.com/p/example3',
    youtube: 'https://youtube.com/watch?v=example123',
    likes: 412, isLiked: false, adRevenue: 2100,
    createdAt: '2026-06-10T14:12:00Z', helpfulCount: 201,
  },
  {
    id: 'r004', userId: 'u001', placeId: 'p004',
    title: '다낭 미케비치, 노을 맛집 카페 발견!',
    content: '선베드 2시간에 음료 한 잔 포함 2만원도 안 해서 가성비 최고. 코코넛 스무디 진짜 맛있고 바다 뷰가 완벽합니다. 오후 4시쯤 가면 노을이 지는 타이밍이랑 딱 맞아요.',
    rating: 5, photos: ['p8'],
    ticketVerified: true, locationVerified: true,
    instagram: null, youtube: null,
    likes: 98, isLiked: false, adRevenue: 510,
    createdAt: '2026-06-08T16:30:00Z', helpfulCount: 43,
  },
  {
    id: 'r005', userId: 'u003', placeId: 'p005',
    title: '오사카 도톤보리 이치란, 혼밥의 성지',
    content: '칸막이 1인석 시스템이 진짜 신기해요. 집중해서 라멘만 먹는 그 분위기가 좋음. 면 강도, 진함 정도, 파 등 다 커스텀 가능. 저는 진함 MAX + 면 보통으로 먹었는데 국물이 진하고 깊어서 완전 취향저격.',
    rating: 4, photos: ['p9','p10'],
    ticketVerified: true, locationVerified: true,
    instagram: null, youtube: null,
    likes: 187, isLiked: false, adRevenue: 920,
    createdAt: '2026-06-05T12:00:00Z', helpfulCount: 78,
  },
  {
    id: 'r006', userId: 'u003', placeId: 'p012',
    title: '에펠탑 야경은 샤요 광장에서 봐야 제맛',
    content: '에펠탑 정면 맞은편 샤요 광장에서 보는 야경이 진짜예요. 매 정시마다 반짝이는 라이트 쇼 있는데 그때 맞춰서 가면 더 감동적. 돗자리 깔고 와인 한 병 마시면서 보는 파리지앵 감성 완전 추천!',
    rating: 5, photos: ['p11','p12','p13'],
    ticketVerified: true, locationVerified: true,
    instagram: 'https://instagram.com/p/paris1',
    youtube: null,
    likes: 523, isLiked: false, adRevenue: 2680,
    createdAt: '2026-05-28T21:00:00Z', helpfulCount: 234,
  },
  {
    id: 'r007', userId: 'u002', placeId: 'p010',
    title: '왓 포 와불, 예상보다 훨씬 압도적',
    content: '발바닥에 자개로 새겨진 108가지 문양이 정말 아름다워요. 사원 전체가 조용하고 신성한 분위기라 잠깐 명상하듯 앉아 있었어요. 입장료 200바트인데 물 한 병 포함. 아침 일찍 가면 인파 없이 여유롭게 볼 수 있어요.',
    rating: 5, photos: ['p14'],
    ticketVerified: true, locationVerified: true,
    instagram: null, youtube: null,
    likes: 311, isLiked: false, adRevenue: 1560,
    createdAt: '2026-05-20T09:30:00Z', helpfulCount: 145,
  },
  {
    id: 'r008', userId: 'u001', placeId: 'p008',
    title: '협재 해수욕장, 제주 최고 해변 등극',
    content: '에메랄드빛 물색이 동남아랑 비교해도 전혀 안 引けを取りません. 한림항 근처라 주변 식사도 편리하고 물이 맑아서 스노클링 하기 딱이에요. 성수기엔 사람 많으니 평일 오전에 가시길.',
    rating: 5, photos: ['p15','p16'],
    ticketVerified: false, locationVerified: true,
    instagram: 'https://instagram.com/p/jeju1',
    youtube: null,
    likes: 278, isLiked: true, adRevenue: 1390,
    createdAt: '2026-06-01T11:00:00Z', helpfulCount: 112,
  },
];

const TRENDING_TAGS = [
  '#도쿄맛집', '#제주여행', '#오사카', '#다낭', '#방콕',
  '#파리야경', '#혼밥', '#포토스팟', '#현지맛집', '#카페투어',
  '#가성비', '#동남아', '#국내여행', '#야시장', '#숨겨진맛집',
];

const MOCK_ADS = [
  {
    id: 'ad001', advertiser: '에어부산',
    title: '에어부산 특가! 도쿄 왕복 89,000원~',
    subtitle: '6월 한정 특가 · 지금 바로 예약',
    cta: '항공권 보기', category: 'flight',
  },
  {
    id: 'ad002', advertiser: '마이리얼트립',
    title: '현지인이 알려주는 도쿄 투어',
    subtitle: '4.9점 후기 1,200개 · 가이드 투어',
    cta: '투어 보기', category: 'tour',
  },
  {
    id: 'ad003', advertiser: '야놀자',
    title: '오사카 도심 호텔 최저가 보장',
    subtitle: '지금 예약하면 조식 무료 제공',
    cta: '숙소 예약', category: 'hotel',
  },
];

// 카테고리 정의
const PLACE_CATEGORIES = [
  { id: 'all',    label: '전체',    icon: '🌏' },
  { id: '음식점', label: '음식점',  icon: '🍽️' },
  { id: '카페',   label: '카페',    icon: '☕' },
  { id: '명소',   label: '명소',    icon: '📸' },
  { id: '쇼핑',   label: '쇼핑',    icon: '🛍️' },
  { id: '액티비티', label: '액티비티', icon: '🎢' },
];

// ─── API 인터페이스 ───────────────────────────────────────
const API = {
  async login(email, password) {
    await delay(600);
    return { success: true, user: MOCK_USERS[0] };
  },
  async register(data) {
    await delay(800);
    return { success: true, user: { ...MOCK_USERS[0], ...data, id: 'u_' + Date.now() } };
  },
  async verifyIdentity(data) {
    await delay(1200);
    return { success: true, verified: true };
  },
  async searchPlaces(query, category = 'all') {
    await delay(400);
    let results = MOCK_PLACES;
    if (query) results = results.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.city.includes(query) || p.country.includes(query) ||
      p.address.includes(query) || p.tags.some(t => t.includes(query))
    );
    if (category && category !== 'all') results = results.filter(p => p.category === category);
    return { success: true, data: results };
  },
  async getPlace(placeId) {
    await delay(200);
    return { success: true, data: MOCK_PLACES.find(p => p.id === placeId) };
  },
  async getPlaceReviews(placeId, sort = 'recent') {
    await delay(300);
    let reviews = MOCK_REVIEWS.filter(r => r.placeId === placeId);
    if (sort === 'helpful') reviews = [...reviews].sort((a,b) => b.helpfulCount - a.helpfulCount);
    else reviews = [...reviews].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: reviews };
  },
  async getRecentReviews(limit = 10) {
    await delay(300);
    return { success: true, data: [...MOCK_REVIEWS].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit) };
  },
  async getPopularPlaces(limit = 8) {
    await delay(300);
    return { success: true, data: [...MOCK_PLACES].sort((a,b) => b.reviewCount - a.reviewCount).slice(0, limit) };
  },
  async createReview(data) {
    await delay(1000);
    return { success: true, data: { ...data, id: 'r_' + Date.now(), createdAt: new Date().toISOString(), likes: 0, helpfulCount: 0 } };
  },
  async verifyTicket(data) {
    await delay(1500);
    return { success: true, verified: true, passengerName: 'KIM MIN JUN', flightNo: 'KE123' };
  },
  async verifyLocation(exifData) {
    await delay(800);
    return { success: true, verified: true, location: { lat: 35.6654, lng: 139.7707 } };
  },
  async getRevenueStats(userId) {
    await delay(400);
    const reviews = MOCK_REVIEWS.filter(r => r.userId === userId);
    return {
      success: true,
      data: {
        totalEarnings: MOCK_USERS.find(u=>u.id===userId)?.totalEarnings || 0,
        pendingEarnings: MOCK_USERS.find(u=>u.id===userId)?.pendingEarnings || 0,
        reviewRevenue: reviews.map(r => ({ reviewId: r.id, title: r.title, revenue: r.adRevenue })),
      },
    };
  },
};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── 동기 헬퍼 (UI 렌더링용, delay 없음) ─────────────────────────
API.searchPlaces = function(query, category) {
  let results = MOCK_PLACES;
  if (query) results = results.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.city.includes(query) || p.country.includes(query) ||
    (p.address && p.address.includes(query)) ||
    p.tags.some(t => t.includes(query))
  );
  if (category && category !== 'all') results = results.filter(p => p.category === category);
  return results;
};
API.getPlace = function(placeId) {
  return MOCK_PLACES.find(p => p.id === placeId) || null;
};
API.getPlaceReviews = function(placeId, sort) {
  let reviews = MOCK_REVIEWS.filter(r => r.placeId === placeId);
  if (sort === 'helpful')      reviews = [...reviews].sort((a,b) => b.helpfulCount - a.helpfulCount);
  else if (sort === 'rating-high') reviews = [...reviews].sort((a,b) => b.rating - a.rating);
  else if (sort === 'rating-low')  reviews = [...reviews].sort((a,b) => a.rating - b.rating);
  else reviews = [...reviews].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return reviews;
};
API.getRecentReviews = function(limit) {
  return [...MOCK_REVIEWS].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit || 10);
};
API.getPopularPlaces = function(limit, category) {
  let places = [...MOCK_PLACES];
  if (category) places = places.filter(p => p.category === category);
  return places.sort((a,b) => b.reviewCount - a.reviewCount).slice(0, limit || 8);
};

// 통합 헬퍼: 도시 + 관광지/로컬 토글 렌즈.
// mode 'all'     → 전체, 인증순(디폴트)
// mode 'tourist' → score < toggleSplit, 인증 많은 순(유명한 곳 위로)
// mode 'local'   → score >= toggleSplit, 로컬도 높은 순(숨은 곳 발굴)
// ⚠️ 어느 모드에서도 장소를 삭제하지 않음 — 토글은 필터·정렬 렌즈일 뿐.
API.getLocalPlaces = function(city, mode = 'all') {
  const split = LOCAL_SCORE_CONFIG.toggleSplit;
  let places = MOCK_PLACES.slice();
  if (city && city !== 'all') places = places.filter(p => p.city === city);
  if (mode === 'tourist') {
    return places.filter(p => p.localScore < split)
                 .sort((a,b) => b.koreanVerifiedCount - a.koreanVerifiedCount);
  }
  if (mode === 'local') {
    return places.filter(p => p.localScore >= split)
                 .sort((a,b) => b.localScore - a.localScore || b.koreanVerifiedCount - a.koreanVerifiedCount);
  }
  return places.sort((a,b) => b.koreanVerifiedCount - a.koreanVerifiedCount);
};

const SESSION_TIMEOUT = 20 * 60 * 1000; // 20분 (ms)

function getCurrentUser() {
  const s = localStorage.getItem('jjinhaeng_user');
  if (!s) return null;
  const lastActivity = parseInt(localStorage.getItem('jjinhaeng_lastActivity') || '0', 10);
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    // 20분 초과 → 세션 만료
    localStorage.removeItem('jjinhaeng_user');
    localStorage.removeItem('jjinhaeng_lastActivity');
    return null;
  }
  return JSON.parse(s);
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('jjinhaeng_user', JSON.stringify(user));
    localStorage.setItem('jjinhaeng_lastActivity', Date.now().toString());
  } else {
    localStorage.removeItem('jjinhaeng_user');
    localStorage.removeItem('jjinhaeng_lastActivity');
  }
}

function touchSession() {
  if (localStorage.getItem('jjinhaeng_user')) {
    localStorage.setItem('jjinhaeng_lastActivity', Date.now().toString());
  }
}
