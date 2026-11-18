import type { EmotionId, GradeLevel, LibraryFormat, SupportTopic, ContactMethod } from '../types/index.ts';

export const VIBE_IMAGES = {
  hero: '/src/assets/images/hero_vibe_space_1794973373105.jpg',
  calm: '/src/assets/images/calm_corner_breathing_1794973373900.jpg',
  primaryLibrary: '/src/assets/images/library_primary_emotions_1794973374924.jpg',
  teenLibrary: '/src/assets/images/library_teen_resilience_1794973374408.jpg',
};

export interface EmotionMeta {
  id: EmotionId;
  label: string;
  shortDesc: string;
  bgHex: string;
  accentHex: string;
  textHex: string;
  valenceScore: number;
}

export const EMOTIONS: EmotionMeta[] = [
  {
    id: 'vui_ve',
    label: 'Vui vẻ',
    shortDesc: 'Hào hứng, ấm áp, tràn đầy năng lượng',
    bgHex: '#FEF6DF',
    accentHex: '#F4B740',
    textHex: '#805708',
    valenceScore: 5,
  },
  {
    id: 'binh_yen',
    label: 'Bình yên',
    shortDesc: 'Nhẹ nhàng, thư thái, cân bằng',
    bgHex: '#E5F7F0',
    accentHex: '#38B28B',
    textHex: '#155E47',
    valenceScore: 4,
  },
  {
    id: 'buon_ba',
    label: 'Buồn bã',
    shortDesc: 'Chùng xuống, muốn được vỗ về',
    bgHex: '#EAF2FE',
    accentHex: '#5B8DEF',
    textHex: '#1E468C',
    valenceScore: 2,
  },
  {
    id: 'lo_lang',
    label: 'Lo lắng',
    shortDesc: 'Hồi hộp, bồn chồn, nhiều suy nghĩ',
    bgHex: '#F3EEFF',
    accentHex: '#8A6DF1',
    textHex: '#462C9E',
    valenceScore: 2,
  },
  {
    id: 'tuc_gian',
    label: 'Tức giận',
    shortDesc: 'Nóng nảy, khó chịu, cần giải tỏa an toàn',
    bgHex: '#FEECEB',
    accentHex: '#E56B6F',
    textHex: '#8D282C',
    valenceScore: 1,
  },
  {
    id: 'that_vong',
    label: 'Thất vọng',
    shortDesc: 'Hụt hẫng vì chưa đạt điều mong đợi',
    bgHex: '#F4F1F8',
    accentHex: '#8E83A8',
    textHex: '#473D61',
    valenceScore: 2,
  },
  {
    id: 'co_don',
    label: 'Cô đơn',
    shortDesc: 'Thiếu kết nối, cảm thấy tách biệt',
    bgHex: '#EBF3F7',
    accentHex: '#639BB5',
    textHex: '#255369',
    valenceScore: 2,
  },
  {
    id: 'met_moi',
    label: 'Mệt mỏi',
    shortDesc: 'Cạn năng lượng, cần nghỉ ngơi',
    bgHex: '#F6F2EA',
    accentHex: '#B89B72',
    textHex: '#5E4B2E',
    valenceScore: 2,
  },
];

export const EMOTION_MAP: Record<EmotionId, EmotionMeta> = Object.fromEntries(
  EMOTIONS.map((e) => [e.id, e])
) as Record<EmotionId, EmotionMeta>;

export const GRADE_LEVEL_CONFIG: Record<
  GradeLevel,
  {
    id: GradeLevel;
    label: string;
    ageRange: string;
    heroWelcome: string;
    heroSub: string;
    checkInQuestion: string;
    themeAccentBg: string;
    themeHighlight: string;
    toneNote: string;
  }
> = {
  primary: {
    id: 'primary',
    label: 'Tiểu học',
    ageRange: 'Lớp 1 – Lớp 5',
    heroWelcome: 'Chào bạn nhỏ đến với ngôi nhà cảm xúc VIBE SPACE!',
    heroSub: 'Hôm nay trái tim bạn đang mang màu sắc gì? Hãy chọn một gương mặt đáng yêu và cùng khám phá góc bình yên nhé.',
    checkInQuestion: 'Hôm nay bạn nhỏ thấy trong lòng thế nào nhỉ?',
    themeAccentBg: 'bg-[#FEF6DF]',
    themeHighlight: 'Giao diện tươi sáng, câu chữ ngắn gọn & nhiều biểu tượng sinh động',
    toneNote: 'Ngôn ngữ gần gũi, dễ hiểu cho học sinh Tiểu học',
  },
  middle: {
    id: 'middle',
    label: 'THCS',
    ageRange: 'Lớp 6 – Lớp 9',
    heroWelcome: 'Không gian an toàn để hiểu bản thân và làm chủ cảm xúc',
    heroSub: 'Tuổi dậy thì mang đến nhiều cung bậc mới mẻ. VIBE SPACE lắng nghe bạn mà không phán xét.',
    checkInQuestion: 'Ngay lúc này, tâm trạng của bạn đang ở trạng thái nào?',
    themeAccentBg: 'bg-[#E5F7F0]',
    themeHighlight: 'Phong cách trẻ trung, đồng hành cùng những thay đổi tuổi mới lớn',
    toneNote: 'Ngôn ngữ cởi mở, tôn trọng dành cho học sinh THCS',
  },
  high: {
    id: 'high',
    label: 'THPT',
    ageRange: 'Lớp 10 – Lớp 12',
    heroWelcome: 'Khoảng lặng cân bằng giữa học tập, định hướng và kết nối',
    heroSub: 'Nhận diện áp lực, chăm sóc sức khỏe tinh thần và chủ động tìm kiếm sự đồng hành khi cần.',
    checkInQuestion: 'Bạn đang trải qua trạng thái cảm xúc nào hôm nay?',
    themeAccentBg: 'bg-[#F3EEFF]',
    themeHighlight: 'Thiết kế tinh gọn, trưởng thành & nội dung chuyên sâu về stress, định hướng',
    toneNote: 'Ngôn ngữ sâu sắc, tôn trọng sự tự chủ của học sinh THPT',
  },
};

export const SUPPORT_TOPIC_LABELS: Record<SupportTopic, string> = {
  cam_xuc: 'Cảm xúc & tâm trạng',
  hoc_tap: 'Học tập & phương pháp học',
  ban_be: 'Mối quan hệ bạn bè',
  gia_dinh: 'Gia đình & giao tiếp với bố mẹ',
  ap_luc: 'Áp lực thi cử & kỳ vọng',
  ca_nhan: 'Vấn đề cá nhân & tự tin',
  khac: 'Nội dung khác',
};

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  phong_tam_ly: 'Gặp trực tiếp tại Phòng Tâm lý học đường',
  teams_hoc_duong: 'Trao đổi qua Microsoft Teams / Email học đường',
  dien_thoai: 'Trao đổi qua điện thoại với chuyên viên',
  qua_gvcn: 'Nhờ Giáo viên chủ nhiệm kết nối',
};

export const LIBRARY_FORMAT_LABELS: Record<LibraryFormat, string> = {
  bai_viet: 'Bài viết',
  video: 'Video hướng dẫn',
  infographic: 'Infographic',
  tinh_huong: 'Tình huống thực tế',
  bai_tap: 'Bài tập thực hành',
};

export const POSITIVE_AFFIRMATIONS: string[] = [
  'Mọi cảm xúc mình đang có đều xứng đáng được lắng nghe.',
  'Mình không cần phải hoàn hảo để được yêu thương và tôn trọng.',
  'Hôm nay chỉ cần cố gắng từng bước nhỏ thôi là đã rất đáng khen rồi.',
  'Khi thấy quá tải, dừng lại hít thở và nhờ giúp đỡ là biểu hiện của sự dũng cảm.',
  'Một ngày chưa suôn sẻ không làm mất đi những giá trị tốt đẹp bên trong mình.',
  'Mình đang học cách hiểu bản thân hơn qua từng trải nghiệm mỗi ngày.',
];

export const SAFETY_KEYWORDS: string[] = [
  'tự tử',
  'tự sát',
  'không muốn sống',
  'biến mất',
  'kết thúc cuộc đời',
  'tự làm hại',
  'rạch tay',
  'cắt tay',
  'chết đi',
  'bị đánh',
  'bị bạo lực',
  'đe dọa',
  'xâm hại',
  'sợ hãi không an toàn',
];

export const PARENT_GUIDES = [
  {
    id: 'pg-1',
    ageGroup: 'Tiểu học (6 – 10 tuổi)',
    title: 'Đặc điểm tâm lý & cách giúp con gọi tên cảm xúc',
    summary: 'Trẻ Tiểu học thường thể hiện cảm xúc qua hành vi cơ thể (đau bụng, cáu gắt, im lặng) trước khi biết diễn đạt bằng lời.',
    keyPoints: [
      'Tránh phủ nhận cảm xúc của con bằng câu "Có gì đâu mà khóc". Hãy nói: "Bố/mẹ thấy con đang buồn vì chuyện ở lớp".',
      'Tạo thói quen 10 phút trò chuyện trước giờ ngủ về 1 điều vui và 1 điều con thấy khó khăn trong ngày.',
      'Hướng dẫn con phân biệt giữa "cảm xúc tức giận" (được phép có) và "hành vi làm đau người khác" (không được phép).',
    ],
  },
  {
    id: 'pg-2',
    ageGroup: 'THCS (11 – 14 tuổi)',
    title: 'Đồng hành cùng con qua biến động tuổi dậy thì',
    summary: 'Học sinh THCS bắt đầu coi trọng đánh giá của bạn bè và mong muốn có không gian riêng tư hơn.',
    keyPoints: [
      'Lắng nghe nhiều hơn khuyên bảo: Hỏi "Con muốn bố mẹ chỉ lắng nghe hay cùng tìm cách giải quyết?" trước khi góp ý.',
      'Chú ý các dấu hiệu thay đổi kéo dài trên 2 tuần: mất ngủ, né tránh bạn bè, sụt giảm hứng thú học tập bất thường.',
      'Tôn trọng sự riêng tư của con trên không gian số nhưng vẫn giữ kết nối ấm áp trong bữa cơm gia đình.',
    ],
  },
  {
    id: 'pg-3',
    ageGroup: 'THPT (15 – 18 tuổi)',
    title: 'Giảm áp lực kỳ vọng và trò chuyện về tương lai',
    summary: 'Học sinh THPT chịu áp lực lớn từ thi cử, định hướng nghề nghiệp và so sánh bản thân với bạn bè đồng trang lứa.',
    keyPoints: [
      'Tách biệt điểm số với giá trị của con: Tránh so sánh con với bạn khác trong lớp hoặc anh chị em.',
      'Cùng con xây dựng kế hoạch nghỉ ngơi hợp lý và nhìn nhận nhiều phương án nghề nghiệp linh hoạt.',
      'Khi nhận thấy con có biểu hiện kiệt sức, thu mình hoặc lo âu kéo dài, chủ động liên hệ Phòng Tâm lý học đường FPT Hà Nam để phối hợp hỗ trợ.',
    ],
  },
];

export const TEACHER_GUIDES = [
  {
    id: 'tg-1',
    category: 'Nhận diện dấu hiệu sớm',
    title: 'Quan sát và ghi nhận biểu hiện khó khăn tâm lý trong lớp học',
    steps: [
      'Biểu hiện học tập & hành vi: Giảm tập trung đột ngột, thường xuyên gục xuống bàn, phản ứng cảm xúc mạnh bất thường hoặc vắng mặt nhiều.',
      'Biểu hiện xã hội: Tách khỏi nhóm bạn cũ, ngồi một mình giờ ra chơi, hoặc có dấu hiệu bị cô lập/bắt nạt.',
      'Nguyên tắc ghi nhận: Chỉ mô tả khách quan hành vi quan sát được và thời điểm (không tự dán nhãn hay chẩn đoán bệnh lý).',
    ],
  },
  {
    id: 'tg-2',
    category: 'Hỗ trợ ban đầu',
    title: 'Kỹ năng lắng nghe an toàn khi học sinh chia sẻ vấn đề nhạy cảm',
    steps: [
      'Chọn không gian riêng tư, yên tĩnh sau giờ học; giữ giọng nói bình tĩnh, ánh mắt lắng nghe, không ngắt lời hay phán xét.',
      'Khẳng định sự an toàn và ghi nhận: "Cô/thầy cảm ơn em đã tin tưởng chia sẻ. Thầy/cô ở đây để cùng em tìm hướng hỗ trợ".',
      'Không hứa giữ bí mật tuyệt đối nếu nội dung liên quan đến nguy cơ mất an toàn hoặc tự làm hại bản thân.',
    ],
  },
  {
    id: 'tg-3',
    category: 'Phối hợp chuyên môn',
    title: 'Quy trình phối hợp với Phòng Tâm lý học đường FPT Hà Nam',
    steps: [
      'Bước 1 (Tình huống thông thường): Trao đổi nhẹ nhàng khích lệ học sinh tự đăng ký trên VIBE SPACE hoặc xin phép học sinh được giới thiệu tới Phòng Tâm lý.',
      'Bước 2 (Tình huống có dấu hiệu nguy cơ mất an toàn / bạo lực / tự làm hại): Không để học sinh ở một mình; báo ngay trực tiếp cho Cán bộ Phòng Tâm lý và Ban Giám hiệu theo quy trình bảo vệ trẻ em.',
      'Bước 3: Bảo mật tuyệt đối thông tin học sinh, không thảo luận công khai trước lớp hay trong nhóm phụ huynh.',
    ],
  },
];
