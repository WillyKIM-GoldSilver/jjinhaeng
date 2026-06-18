// =============================================
// 찐행 - Mock Data (서버 연동 전 프로토타입용)
// 실제 서비스 시 API 호출로 교체
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
];

const MOCK_DESTINATIONS = [
  { id: 'd001', country: '일본', city: '도쿄', code: 'TYO', lat: 35.6762, lng: 139.6503, reviewCount: 1243, trending: true },
  { id: 'd002', country: '일본', city: '오사카', code: 'OSA', lat: 34.6937, lng: 135.5023, reviewCount: 987, trending: true },
  { id: 'd003', country: '태국', city: '방콕', code: 'BKK', lat: 13.7563, lng: 100.5018, reviewCount: 763, trending: false },
  { id: 'd004', country: '베트남', city: '다낭', code: 'DAD', lat: 16.0544, lng: 108.2022, reviewCount: 542, trending: true },
  { id: 'd005', country: '대만', city: '타이베이', code: 'TPE', lat: 25.0330, lng: 121.5654, reviewCount: 631, trending: false },
  { id: 'd006', country: '싱가포르', city: '싱가포르', code: 'SIN', lat: 1.3521, lng: 103.8198, reviewCount: 445, trending: false },
  { id: 'd007', country: '한국', city: '제주도', code: 'CJU', lat: 33.4996, lng: 126.5312, reviewCount: 2134, trending: true },
  { id: 'd008', country: '한국', city: '부산', code: 'PUS', lat: 35.1796, lng: 129.0756, reviewCount: 1567, trending: false },
  { id: 'd009', country: '프랑스', city: '파리', code: 'CDG', lat: 48.8566, lng: 2.3522, reviewCount: 389, trending: false },
  { id: 'd010', country: '스페인', city: '바르셀로나', code: 'BCN', lat: 41.3851, lng: 2.1734, reviewCount: 312, trending: false },
];

const MOCK_PLACES = [
  {
    id: 'p001',
    destinationId: 'd001',
    name: '츠키지 시장 타마고야키 가게',
    category: '음식점',
    address: '일본 도쿄 츠키지',
    lat: 35.6654,
    lng: 139.7707,
    rating: 4.8,
    reviewCount: 143,
    tags: ['아침식사', '해산물', '현지맛집'],
    verified: true,
  },
  {
    id: 'p002',
    destinationId: 'd001',
    name: '시부야 스크램블 교차로',
    category: '명소',
    address: '일본 도쿄 시부야구',
    lat: 35.6595,
    lng: 139.7004,
    rating: 4.5,
    reviewCount: 892,
    tags: ['야경', '도시', '포토스팟'],
    verified: true,
  },
  {
    id: 'p003',
    destinationId: 'd007',
    name: '흑돼지 거리 맛집 원조 강정이네',
    category: '음식점',
    address: '제주특별자치도 제주시 연동',
    lat: 33.4890,
    lng: 126.4983,
    rating: 4.9,
    reviewCount: 578,
    tags: ['흑돼지', '제주맛집', '현지인추천'],
    verified: true,
  },
  {
    id: 'p004',
    destinationId: 'd004',
    name: '미케비치 선베드 카페',
    category: '카페',
    address: '베트남 다낭 미케비치',
    lat: 16.0488,
    lng: 108.2478,
    rating: 4.6,
    reviewCount: 234,
    tags: ['해변', '카페', '일몰'],
    verified: true,
  },
  {
    id: 'p005',
    destinationId: 'd002',
    name: '도톤보리 이치란 라멘',
    category: '음식점',
    address: '일본 오사카 도톤보리',
    lat: 34.6687,
    lng: 135.5025,
    rating: 4.7,
    reviewCount: 445,
    tags: ['라멘', '혼밥', '오사카맛집'],
    verified: true,
  },
];

const MOCK_REVIEWS = [
  {
    id: 'r001',
    userId: 'u002',
    placeId: 'p001',
    destinationId: 'd001',
    title: '도쿄 아침은 츠키지에서 시작해야죠',
    content: '새벽 5시에 가도 이미 줄이 있어요. 타마고야키 달콤하고 따뜻해서 아침에 딱이에요. 참치회도 바로 먹을 수 있고 신선도는 진짜 끝판왕입니다. 인근 커피집 퀄리티도 놀라울 정도. 줄 서는 게 겁나서 미루다가 마지막날 갔는데 후회됩니다. 이 근처 숙소 잡고 매일 아침 갔으면 좋았을텐데... 꼭 일찍 가세요!',
    rating: 5,
    photos: ['mock_photo_1', 'mock_photo_2', 'mock_photo_3'],
    ticketVerified: true,
    locationVerified: true,
    instagram: 'https://instagram.com/p/example1',
    youtube: null,
    likes: 234,
    isLiked: false,
    adRevenue: 1240,
    createdAt: '2026-06-15T08:23:00Z',
    tags: ['아침식사', '해산물', '현지맛집'],
    helpfulCount: 89,
  },
  {
    id: 'r002',
    userId: 'u001',
    placeId: 'p003',
    destinationId: 'd007',
    title: '제주 흑돼지 진짜 여기가 맞아요',
    content: '제주도 출장 겸 여행으로 갔는데 지인 추천으로 찾아갔습니다. 흑돼지 삼겹살 두 인분에 소주 한 병, 완전 만족. 고기 두께가 두툼하고 육즙이 장난아님. 된장찌개랑 같이 나오는 밑반찬들도 하나같이 퀄리티 있어요. 제주 올레시장 근처라 시장 구경하고 저녁에 여기 오면 딱이에요. 예약은 필수!!',
    rating: 5,
    photos: ['mock_photo_4', 'mock_photo_5'],
    ticketVerified: true,
    locationVerified: true,
    instagram: null,
    youtube: null,
    likes: 156,
    isLiked: true,
    adRevenue: 820,
    createdAt: '2026-06-12T19:45:00Z',
    tags: ['흑돼지', '제주맛집', '현지인추천'],
    helpfulCount: 67,
  },
  {
    id: 'r003',
    userId: 'u002',
    placeId: 'p002',
    destinationId: 'd001',
    title: '시부야 스크램블, 반드시 2층 카페에서 보세요',
    content: '교차로 바로 앞 스타벅스 2층 자리가 포토스팟으로 유명한데 아침 10시 전에 가면 자리 잡을 수 있어요. 저는 평일 오후에 갔다가 자리를 못 잡아서 그냥 교차로 한복판에서 찍었는데 그것도 나름 재밌었어요. 야경은 진짜 장관입니다. 특히 비 오는 날 우산 쓰고 촬영하면 영화 한 장면 같아요. 유튜브 링크도 달아뒀으니 영상도 같이 봐주세요!',
    rating: 4,
    photos: ['mock_photo_6', 'mock_photo_7'],
    ticketVerified: true,
    locationVerified: true,
    instagram: 'https://instagram.com/p/example3',
    youtube: 'https://youtube.com/watch?v=example123',
    likes: 412,
    isLiked: false,
    adRevenue: 2100,
    createdAt: '2026-06-10T14:12:00Z',
    tags: ['야경', '도시', '포토스팟', '카페'],
    helpfulCount: 201,
  },
  {
    id: 'r004',
    userId: 'u001',
    placeId: 'p004',
    destinationId: 'd004',
    title: '다낭 미케비치, 노을 맛집 카페 발견!',
    content: '베트남 다낭 여행 3일차에 발견한 숨겨진 카페예요. 선베드 2시간에 음료 한 잔 포함 2만원도 안 해서 가성비 최고. 코코넛 스무디 진짜 맛있고 바다 뷰가 완벽합니다. 오후 4시쯤 가면 노을이 지는 타이밍이랑 딱 맞아요. 인스타 감성 사진 찍기 좋고 직원들도 친절해요. 다낭 또 가면 무조건 재방문할 곳!',
    rating: 5,
    photos: ['mock_photo_8'],
    ticketVerified: true,
    locationVerified: true,
    instagram: null,
    youtube: null,
    likes: 98,
    isLiked: false,
    adRevenue: 510,
    createdAt: '2026-06-08T16:30:00Z',
    tags: ['해변', '카페', '일몰', '가성비'],
    helpfulCount: 43,
  },
];

const TRENDING_TAGS = [
  '#도쿄맛집', '#제주여행', '#오사카', '#다낭', '#방콕',
  '#혼여행', '#커플여행', '#가성비여행', '#포토스팟', '#현지맛집',
  '#유럽여행', '#동남아', '#국내여행', '#제주흑돼지', '#시부야',
];

const MOCK_ADS = [
  {
    id: 'ad001',
    advertiser: '에어부산',
    title: '에어부산 특가! 도쿄 왕복 89,000원~',
    subtitle: '6월 한정 특가 · 지금 바로 예약',
    cta: '항공권 보기',
    type: 'banner',
    category: 'flight',
  },
  {
    id: 'ad002',
    advertiser: '마이리얼트립',
    title: '현지인이 알려주는 도쿄 투어',
    subtitle: '4.9점 후기 1,200개 · 가이드 투어',
    cta: '투어 보기',
    type: 'banner',
    category: 'tour',
  },
  {
    id: 'ad003',
    advertiser: '야놀자',
    title: '오사카 도심 호텔 최저가 보장',
    subtitle: '지금 예약하면 조식 무료 제공',
    cta: '숙소 예약',
    type: 'banner',
    category: 'hotel',
  },
];

// API 인터페이스 설계 (추후 서버 연동 시 이 함수들을 실제 fetch로 교체)
const API = {
  // Auth
  async register(userData) {
    await delay(800);
    return { success: true, user: { ...MOCK_USERS[0], ...userData, id: 'u_new_' + Date.now() } };
  },
  async login(email, password) {
    await delay(600);
    return { success: true, user: MOCK_USERS[0], token: 'mock_token_' + Date.now() };
  },
  async verifyIdentity(data) {
    await delay(1200);
    return { success: true, verified: true };
  },

  // Reviews
  async getReviews(filters = {}) {
    await delay(400);
    let reviews = [...MOCK_REVIEWS];
    if (filters.destinationId) reviews = reviews.filter(r => r.destinationId === filters.destinationId);
    return { success: true, data: reviews, total: reviews.length };
  },
  async createReview(reviewData) {
    await delay(1000);
    const newReview = { ...reviewData, id: 'r_' + Date.now(), createdAt: new Date().toISOString(), likes: 0, helpfulCount: 0 };
    return { success: true, data: newReview };
  },
  async verifyTicket(ticketData) {
    await delay(1500);
    // 실제: OCR API + 이름 매칭 로직
    return { success: true, verified: true, passengerName: 'KIM MIN JUN', flightNo: 'KE123' };
  },
  async verifyLocation(exifData) {
    await delay(800);
    // 실제: EXIF GPS 데이터 파싱 및 장소 매칭
    return { success: true, verified: true, location: { lat: 35.6654, lng: 139.7707 } };
  },

  // Places
  async getPlaces(destinationId) {
    await delay(300);
    return { success: true, data: MOCK_PLACES.filter(p => p.destinationId === destinationId) };
  },
  async searchPlaces(query) {
    await delay(500);
    return { success: true, data: MOCK_PLACES.filter(p => p.name.includes(query) || p.address.includes(query)) };
  },

  // Destinations
  async getDestinations() {
    await delay(300);
    return { success: true, data: MOCK_DESTINATIONS };
  },

  // Revenue
  async getRevenueStats(userId) {
    await delay(400);
    return {
      success: true,
      data: {
        totalEarnings: 48200,
        pendingEarnings: 12400,
        monthlyEarnings: [3200, 4100, 5600, 4800, 6200, 7100, 5400, 4900, 6800, 7200, 8100, 5400],
        reviewRevenue: MOCK_REVIEWS.filter(r => r.userId === userId).map(r => ({
          reviewId: r.id,
          title: r.title,
          revenue: r.adRevenue,
        })),
      },
    };
  },
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 현재 로그인 유저 (로컬 스토리지에서 관리)
function getCurrentUser() {
  const stored = localStorage.getItem('jjinhaeng_user');
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  if (user) localStorage.setItem('jjinhaeng_user', JSON.stringify(user));
  else localStorage.removeItem('jjinhaeng_user');
}
