import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  UserProfile,
  EmotionCheckIn,
  DiaryEntry,
  SupportRequest,
  LibraryResource,
  BuddyTalkStep,
  SafetyAlert,
  AuditLogEntry,
  EmotionId,
  GradeLevel,
} from './src/types/index.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'vibespace_demo_db.json');

interface DatabaseState {
  users: (UserProfile & { passwordHash: string })[];
  checkIns: EmotionCheckIn[];
  diaryEntries: DiaryEntry[];
  supportRequests: SupportRequest[];
  libraryResources: LibraryResource[];
  buddyTalkSteps: BuddyTalkStep[];
  safetyAlerts: SafetyAlert[];
  auditLogs: AuditLogEntry[];
}

function hashPassword(pw: string): string {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function daysAgoIso(days: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

function createInitialDb(): DatabaseState {
  const defaultPw = hashPassword('fpt@hanam2026');
  return {
    users: [
      {
        id: 'stu-pri-01',
        username: 'minhan.tieuhoc',
        displayName: 'Nguyễn Minh An (Demo)',
        role: 'student',
        gradeLevel: 'primary',
        classLabel: 'Lớp 4A1',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
      {
        id: 'stu-mid-01',
        username: 'khanhlinh.thcs',
        displayName: 'Trần Khánh Linh (Demo)',
        role: 'student',
        gradeLevel: 'middle',
        classLabel: 'Lớp 7A2',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
      {
        id: 'stu-high-01',
        username: 'hoangnam.thpt',
        displayName: 'Lê Hoàng Nam (Demo)',
        role: 'student',
        gradeLevel: 'high',
        classLabel: 'Lớp 11A3',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
      {
        id: 'parent-01',
        username: 'phuhuynh.demo',
        displayName: 'Phụ huynh Nguyễn Thanh Hà (Demo)',
        role: 'parent',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
      {
        id: 'teacher-01',
        username: 'giaovien.demo',
        displayName: 'Cô Phạm Thu Trang – GVCN (Demo)',
        role: 'teacher',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
      {
        id: 'admin-01',
        username: 'tamly.fpthanam',
        displayName: 'Chuyên viên Phòng Tâm lý (Demo)',
        role: 'admin',
        isDemoAccount: true,
        passwordHash: defaultPw,
      },
    ],
    checkIns: [
      {
        id: 'chk-1',
        studentId: 'stu-pri-01',
        gradeLevel: 'primary',
        emotion: 'vui_ve',
        intensity: 4,
        causePrompt: 'Hôm nay mình được cô giáo khen bài vẽ bầu trời.',
        extraNote: 'Mình muốn khoe với bố mẹ khi về nhà.',
        createdAt: daysAgoIso(6, 8),
        isDemoData: true,
      },
      {
        id: 'chk-2',
        studentId: 'stu-pri-01',
        gradeLevel: 'primary',
        emotion: 'lo_lang',
        intensity: 3,
        causePrompt: 'Sắp có bài kiểm tra đọc hiểu tiếng Việt.',
        extraNote: 'Mình hơi hồi hộp nhưng đã ôn bài rồi.',
        createdAt: daysAgoIso(4, 14),
        isDemoData: true,
      },
      {
        id: 'chk-3',
        studentId: 'stu-pri-01',
        gradeLevel: 'primary',
        emotion: 'binh_yen',
        intensity: 4,
        causePrompt: 'Giờ ra chơi được chơi đá cầu cùng bạn thân.',
        extraNote: '',
        createdAt: daysAgoIso(2, 10),
        isDemoData: true,
      },
      {
        id: 'chk-4',
        studentId: 'stu-pri-01',
        gradeLevel: 'primary',
        emotion: 'vui_ve',
        intensity: 5,
        causePrompt: 'Hoàn thành xong dự án nhóm ở lớp!',
        extraNote: 'Các bạn đều hợp tác rất vui.',
        createdAt: daysAgoIso(0, 9),
        isDemoData: true,
      },
      {
        id: 'chk-5',
        studentId: 'stu-mid-01',
        gradeLevel: 'middle',
        emotion: 'met_moi',
        intensity: 4,
        causePrompt: 'Lịch học tuần này khá dày và mình ngủ hơi muộn.',
        extraNote: 'Cần sắp xếp lại giờ nghỉ trưa.',
        createdAt: daysAgoIso(5, 16),
        isDemoData: true,
      },
      {
        id: 'chk-6',
        studentId: 'stu-mid-01',
        gradeLevel: 'middle',
        emotion: 'that_vong',
        intensity: 3,
        causePrompt: 'Điểm kiểm tra 15 phút Toán chưa như kỳ vọng.',
        extraNote: 'Mình hơi buồn một chút nhưng sẽ xem lại lỗi sai.',
        createdAt: daysAgoIso(3, 15),
        isDemoData: true,
      },
      {
        id: 'chk-7',
        studentId: 'stu-mid-01',
        gradeLevel: 'middle',
        emotion: 'binh_yen',
        intensity: 4,
        causePrompt: 'Nghe nhạc và thực hành bài hít thở 4-4 ở Góc bình yên.',
        extraNote: 'Thấy đầu óc nhẹ nhõm hơn.',
        createdAt: daysAgoIso(1, 11),
        isDemoData: true,
      },
      {
        id: 'chk-8',
        studentId: 'stu-high-01',
        gradeLevel: 'high',
        emotion: 'lo_lang',
        intensity: 4,
        causePrompt: 'Suy nghĩ nhiều về việc chọn tổ hợp môn và định hướng đại học.',
        extraNote: 'Cần tìm hiểu thêm thông tin ngành nghề.',
        createdAt: daysAgoIso(4, 20),
        isDemoData: true,
      },
      {
        id: 'chk-9',
        studentId: 'stu-high-01',
        gradeLevel: 'high',
        emotion: 'co_don',
        intensity: 3,
        causePrompt: 'Cảm thấy khó chia sẻ áp lực với mọi người xung quanh.',
        extraNote: '',
        createdAt: daysAgoIso(2, 19),
        isDemoData: true,
      },
      {
        id: 'chk-10',
        studentId: 'stu-high-01',
        gradeLevel: 'high',
        emotion: 'binh_yen',
        intensity: 4,
        causePrompt: 'Đã nói chuyện với bạn thân và cảm thấy được lắng nghe.',
        extraNote: '',
        createdAt: daysAgoIso(0, 8),
        isDemoData: true,
      },
    ],
    diaryEntries: [
      {
        id: 'dia-1',
        studentId: 'stu-pri-01',
        emotion: 'vui_ve',
        sticker: 'sunbeam',
        feelingToday: 'Hôm nay mình thấy rất vui và háo hức.',
        whatHappened: 'Trong giờ Mỹ thuật, bức tranh về gia đình của mình được treo ở góc lớp.',
        joyOrSadness: 'Điều làm mình vui nhất là bạn ngồi cạnh khen màu sắc rất ấm áp.',
        howICoped: 'Mình đã cảm ơn bạn và chia sẻ bút màu với bạn.',
        gratitude: 'Mình biết ơn cô giáo Mỹ thuật đã luôn khuyến khích cả lớp.',
        positiveNote: 'Mỗi ngày cố gắng một chút là tuyệt lắm rồi!',
        createdAt: daysAgoIso(1, 19),
        isDemoData: true,
      },
      {
        id: 'dia-2',
        studentId: 'stu-mid-01',
        emotion: 'binh_yen',
        sticker: 'lotus',
        feelingToday: 'Tâm trạng hôm nay dịu lại nhiều so với đầu tuần.',
        whatHappened: 'Mình đã hoàn thành bài thuyết trình Lịch sử trước hạn và có thời gian nghỉ ngơi.',
        joyOrSadness: 'Lúc đầu hơi lo vì nói trước lớp, nhưng khi chuẩn bị kỹ thì mình tự tin hơn.',
        howICoped: 'Mình hít thở sâu 4 nhịp trước khi bước lên bảng.',
        gratitude: 'Biết ơn các bạn trong nhóm đã hỗ trợ làm slide rất nhiệt tình.',
        positiveNote: 'Mình có thể bình tĩnh vượt qua từng thử thách nhỏ.',
        createdAt: daysAgoIso(2, 20),
        isDemoData: true,
      },
      {
        id: 'dia-3',
        studentId: 'stu-high-01',
        emotion: 'lo_lang',
        sticker: 'cloud',
        feelingToday: 'Có chút băn khoăn về lịch thi thử sắp tới.',
        whatHappened: 'Tối nay mình làm đề thử và thấy còn một số phần kiến thức chưa chắc.',
        joyOrSadness: 'Áp lực tự đặt ra cho bản thân đôi khi khiến mình căng thẳng.',
        howICoped: 'Mình tạm dừng 15 phút, uống nước ấm và lập kế hoạch ôn từng chuyên đề nhỏ.',
        gratitude: 'Biết ơn anh trai đã gửi lời động viên tối nay.',
        positiveNote: 'Kết quả chỉ là một bước phản hồi, không định nghĩa toàn bộ giá trị của mình.',
        createdAt: daysAgoIso(1, 21),
        isDemoData: true,
      },
    ],
    supportRequests: [
      {
        id: 'sup-demo-1',
        studentId: 'stu-mid-01',
        studentName: 'Trần Khánh Linh (Demo)',
        gradeLevel: 'middle',
        classLabel: 'Lớp 7A2',
        requestType: 'tham_van_ca_nhan',
        topic: 'ap_luc',
        contactMethod: 'phong_tam_ly',
        contactDetail: 'Giờ ra chơi sáng thứ Tư tại Phòng Tâm lý học đường',
        description: 'Em muốn trao đổi về cách cân bằng thời gian học tập và nghỉ ngơi khi gần đến kỳ kiểm tra.',
        status: 'dang_lien_he',
        createdAt: daysAgoIso(2, 10),
        isDemoData: true,
      },
      {
        id: 'sup-demo-2',
        studentId: 'stu-high-01',
        studentName: 'Lê Hoàng Nam (Demo)',
        gradeLevel: 'high',
        classLabel: 'Lớp 11A3',
        requestType: 'ho_tro',
        topic: 'gia_dinh',
        contactMethod: 'teams_hoc_duong',
        contactDetail: 'namlh.demo@fpthanam.edu.vn',
        description: 'Em muốn được tư vấn cách trò chuyện với bố mẹ về định hướng ngành học tương lai khi hai bên còn khác quan điểm.',
        status: 'moi_tiep_nhan',
        createdAt: daysAgoIso(1, 14),
        isDemoData: true,
      },
    ],
    libraryResources: [
      {
        id: 'lib-pri-1',
        title: 'Chiếc hộp gọi tên cảm xúc',
        gradeLevel: 'primary',
        topic: 'Nhận diện và gọi tên cảm xúc',
        format: 'bai_viet',
        readTime: '3 phút đọc',
        summary: 'Mỗi cảm xúc giống như một vị khách ghé thăm. Biết gọi đúng tên sẽ giúp chúng mình hiểu điều trái tim đang nhắn nhủ.',
        content: [
          'Khi vui, đôi mắt mình sáng lên và muốn chia sẻ niềm vui ấy với mọi người. Khi buồn hay thất vọng, cơ thể có thể thấy nặng nề như đám mây xám.',
          'Không có cảm xúc nào là "xấu" cả. Tức giận nhắc mình rằng có điều gì đó chưa công bằng hoặc mình đang cần được bảo vệ. Lo lắng giúp mình chuẩn bị cẩn thận hơn.',
          'Hãy thử đặt tay lên ngực và nói thầm: "À, bạn Lo Lắng đang ghé thăm mình một chút đây mà!" — khi gọi được tên, cảm xúc sẽ bớt đáng sợ đi rất nhiều.'
        ],
        interactiveQuestion: 'Khi bị điểm chưa cao như mong muốn, bạn thường thấy vị khách cảm xúc nào ghé thăm?',
        interactiveChoices: ['Bạn Buồn Bã', 'Bạn Thất Vọng', 'Bạn Lo Lắng', 'Cả ba cùng lúc'],
        practiceExercise: 'Vẽ 3 khuôn mặt cảm xúc mà bạn gặp nhiều nhất tuần này và đặt cho mỗi bạn một màu sắc riêng.',
        isDemoData: true,
      },
      {
        id: 'lib-pri-2',
        title: 'Bí quyết kết bạn và nói lời từ chối lịch sự',
        gradeLevel: 'primary',
        topic: 'Kỹ năng kết bạn & Biết nói lời từ chối',
        format: 'tinh_huong',
        readTime: '4 phút đọc',
        summary: 'Làm sao để giữ tình bạn đẹp mà vẫn bảo vệ được ranh giới an toàn của bản thân?',
        content: [
          'Tình huống: Một bạn rủ bạn trêu chọc bạn mới chuyển lớp hoặc mượn đồ dùng của bạn nhưng chưa hỏi phép.',
          'Bạn có quyền nói "Không" một cách bình tĩnh và rõ ràng mà không làm tổn thương người khác: "Mình không thích trêu bạn ấy đâu, chúng mình chơi trò khác nhé!"',
          'Nếu bạn ấy vẫn ép buộc, hãy đi tìm thầy cô hoặc người lớn đáng tin cậy gần nhất.'
        ],
        interactiveQuestion: 'Nếu một bạn đòi xem bài kiểm tra của bạn trong giờ thi, câu trả lời phù hợp nhất là gì?',
        interactiveChoices: [
          'Đưa cho bạn xem vì sợ bạn giận',
          'Nói nhẹ nhàng: "Mình không thể cho xem bài trong giờ kiểm tra, hết giờ mình cùng ôn nhé"',
          'Quát lớn lên ngay trong lớp'
        ],
        practiceExercise: 'Thực hành đứng trước gương tập nói 2 câu từ chối lịch sự nhưng dứt khoát.',
        isDemoData: true,
      },
      {
        id: 'lib-pri-3',
        title: 'Khám phá siêu năng lực của bản thân',
        gradeLevel: 'primary',
        topic: 'Khám phá điểm mạnh của bản thân',
        format: 'bai_tap',
        readTime: '5 phút thực hành',
        summary: 'Mỗi học sinh FPT Hà Nam đều có những điểm mạnh riêng biệt — có thể là sự kiên nhẫn, biết lắng nghe, vẽ đẹp hoặc tính toán nhanh.',
        content: [
          'Điểm mạnh không chỉ là điểm số trên lớp. Biết an ủi khi bạn buồn, giữ lời hứa, hay dũng cảm nhận lỗi cũng là những siêu năng lực tuyệt vời.',
          'Hãy viết ra 3 điều bạn làm tốt hoặc khiến bạn thấy tự hào trong tháng này.'
        ],
        interactiveQuestion: 'Theo bạn, điều nào sau đây cũng được tính là một điểm mạnh?',
        interactiveChoices: [
          'Biết lắng nghe khi bạn bè chia sẻ',
          'Chịu khó luyện tập dù lúc đầu chưa làm được',
          'Cả hai điều trên đều là điểm mạnh quý giá'
        ],
        practiceExercise: 'Hoàn thành tấm thẻ "3 Siêu Năng Lực Của Tớ" và dán ở góc học tập.',
        isDemoData: true,
      },
      {
        id: 'lib-mid-1',
        title: 'Hiểu những thay đổi cảm xúc tuổi dậy thì',
        gradeLevel: 'middle',
        topic: 'Hiểu bản thân & tuổi dậy thì',
        format: 'infographic',
        readTime: '4 phút đọc',
        summary: 'Tại sao học sinh THCS đôi khi thấy tâm trạng lên xuống nhanh như thời tiết? Đây là một phần tự nhiên của sự phát triển não bộ.',
        content: [
          'Ở tuổi THCS, vùng não xử lý cảm xúc phát triển rất nhanh trong khi vùng kiểm soát lý trí đang tiếp tục hoàn thiện. Vì vậy, bạn dễ nhạy cảm hơn với lời nhận xét hoặc cảm thấy dễ cáu gắt.',
          'Điều này hoàn toàn bình thường. Hiểu cơ chế này giúp bạn không tự trách mình quá mức khi lỡ phản ứng mạnh.',
          'Tạo khoảng dừng 10 giây trước khi trả lời tin nhắn hoặc phản ứng khi đang bực bội là kỹ năng cực kỳ hữu ích.'
        ],
        interactiveQuestion: 'Khi đột nhiên thấy bực bội với người thân dù chuyện rất nhỏ, bước đầu tiên bạn nên thử là gì?',
        interactiveChoices: [
          'Đóng sầm cửa và không nói chuyện nữa',
          'Tạm rời không gian 5 phút, uống nước và nói: "Con cần chút thời gian bình tĩnh lại"',
          'Tự trách bản thân là người ích kỷ'
        ],
        practiceExercise: 'Thử ghi lại 2 lần bạn giữ được bình tĩnh trong tuần này vào Nhật ký cảm xúc.',
        isDemoData: true,
      },
      {
        id: 'lib-mid-2',
        title: 'Ứng phó với áp lực đồng trang lứa (Peer Pressure)',
        gradeLevel: 'middle',
        topic: 'Áp lực đồng trang lứa & Mối quan hệ lành mạnh',
        format: 'tinh_huong',
        readTime: '5 phút đọc',
        summary: 'Làm thế nào để hòa nhập với nhóm bạn nhưng không đánh mất giá trị và sự an toàn của chính mình?',
        content: [
          'Áp lực đồng trang lứa có thể tích cực (cùng nhau cố gắng học tốt, chơi thể thao) hoặc tiêu cực (rủ rê nói xấu bạn khác trên mạng xã hội, thức khuya chơi game quá mức, làm thử điều nguy hiểm).',
          'Bạn không cần phải giống hệt tất cả mọi người mới được công nhận. Những người bạn thực sự sẽ tôn trọng lựa chọn lành mạnh của bạn.'
        ],
        interactiveQuestion: 'Dấu hiệu của một nhóm bạn lành mạnh là gì?',
        interactiveChoices: [
          'Tôn trọng khi bạn nói không với điều bạn không thoải mái',
          'Bắt bạn phải làm theo mọi thử thách mới coi là bạn thân',
          'Thường xuyên chế giễu điểm yếu của nhau'
        ],
        practiceExercise: 'Liệt kê 3 giá trị cá nhân mà bạn luôn muốn giữ gìn trong tình bạn.',
        isDemoData: true,
      },
      {
        id: 'lib-high-1',
        title: 'Quản lý căng thẳng thi cử & áp lực kỳ vọng',
        gradeLevel: 'high',
        topic: 'Quản lý stress và áp lực học tập',
        format: 'bai_viet',
        readTime: '6 phút đọc',
        summary: 'Phân biệt giữa căng thẳng thúc đẩy (eustress) và quá tải kiệt sức (burnout), cùng chiến lược chia nhỏ mục tiêu học tập.',
        content: [
          'Ở bậc THPT, áp lực đến từ điểm số, kỳ thi chuyển cấp/tốt nghiệp và sự so sánh với bạn bè xung quanh.',
          'Khi não bộ quá tải kéo dài, khả năng ghi nhớ thực tế sẽ giảm xuống. Ngủ đủ 7–8 tiếng và nghỉ ngắn 5 phút sau mỗi 45 phút học giúp củng cố trí nhớ tốt hơn việc thức trắng đêm.',
          'Hãy tách biệt "giá trị bản thân" khỏi "điểm số của một bài kiểm tra".'
        ],
        interactiveQuestion: 'Dấu hiệu nào cảnh báo bạn đang bước vào trạng thái quá tải cần nghỉ ngơi và tìm hỗ trợ?',
        interactiveChoices: [
          'Khó ngủ nhiều ngày liên tục, mất hứng thú với cả những việc từng thích',
          'Hơi hồi hộp trước buổi thuyết trình 10 phút',
          'Muốn ôn kỹ hơn một chương chưa vững'
        ],
        practiceExercise: 'Áp dụng quy tắc chia 3 ưu tiên mỗi ngày (1 việc quan trọng nhất, 2 việc hỗ trợ) thay vì danh sách 15 đầu việc gây ngợp.',
        isDemoData: true,
      },
      {
        id: 'lib-high-2',
        title: 'Ranh giới cá nhân trong tình bạn và tình cảm tuổi học trò',
        gradeLevel: 'high',
        topic: 'Tình yêu và ranh giới cá nhân',
        format: 'video',
        readTime: '5 phút xem/đọc',
        summary: 'Xây dựng sự tôn trọng, giao tiếp lành mạnh và bảo vệ không gian riêng tư trong các mối quan hệ ở lứa tuổi THPT.',
        content: [
          'Một mối quan hệ lành mạnh luôn có sự tin tưởng, tôn trọng thời gian học tập, sở thích cá nhân và quyền riêng tư của nhau.',
          'Kiểm soát mật khẩu điện thoại, cô lập bạn khỏi gia đình bạn bè, hoặc đe dọa khi bạn muốn dừng lại là những dấu hiệu không an toàn.',
          'Bạn luôn có quyền đặt ranh giới và tìm đến thầy cô Phòng Tâm lý học đường khi cảm thấy bối rối hoặc không an toàn.'
        ],
        interactiveQuestion: 'Yếu tố cốt lõi của ranh giới lành mạnh là gì?',
        interactiveChoices: [
          'Cả hai đều có không gian riêng và lắng nghe cảm nhận của nhau',
          'Luôn phải trả lời tin nhắn trong vòng 1 phút',
          'Từ bỏ mọi sở thích cá nhân để chiều lòng đối phương'
        ],
        practiceExercise: 'Viết ra 3 ranh giới về thời gian và sự tôn trọng mà bạn kỳ vọng trong các mối quan hệ của mình.',
        isDemoData: true,
      },
    ],
    buddyTalkSteps: [
      {
        id: 'step-1',
        stepOrder: 1,
        gradeLevel: 'all',
        question: 'Chào bạn! Mình là Buddy Talk – người bạn lắng nghe ở VIBE SPACE. Hôm nay bạn cảm thấy thế nào?',
        options: [
          {
            id: 'opt-1-happy',
            label: 'Khá vui và thoải mái',
            nextStepId: 'step-2',
            empathyReply: 'Thật tuyệt khi hôm nay bạn có năng lượng tích cực! Cùng nhìn lại xem điều gì đang nâng đỡ tâm trạng bạn nhé.',
          },
          {
            id: 'opt-1-anxious',
            label: 'Hơi lo lắng, căng thẳng',
            nextStepId: 'step-2',
            empathyReply: 'Cảm ơn bạn đã chia sẻ thật lòng. Cảm giác lo lắng đôi khi xuất hiện khi chúng ta quan tâm nhiều đến một điều gì đó.',
          },
          {
            id: 'opt-1-sad',
            label: 'Buồn, thất vọng hoặc cô đơn',
            nextStepId: 'step-2',
            empathyReply: 'Mình ở đây lắng nghe bạn. Khi thấy buồn hoặc cô đơn, việc bạn dừng lại để nhận diện cảm xúc đã là một bước rất dũng cảm rồi.',
          },
          {
            id: 'opt-1-angry',
            label: 'Khó chịu, tức giận hoặc mệt mỏi',
            nextStepId: 'step-2',
            empathyReply: 'Khi mọi thứ dồn lại, dễ thấy bực bội hoặc cạn năng lượng lắm. Mình cùng từ từ gỡ từng nút thắt nhé.',
          },
        ],
      },
      {
        id: 'step-2',
        stepOrder: 2,
        gradeLevel: 'all',
        question: 'Điều gì khiến bạn cảm thấy như vậy?',
        options: [
          {
            id: 'opt-2-study',
            label: 'Chuyện học tập, bài vở hoặc điểm số',
            nextStepId: 'step-3',
            empathyReply: 'Áp lực học tập là điều rất nhiều bạn học sinh gặp phải. Bạn không hề đơn độc đâu.',
          },
          {
            id: 'opt-2-friends',
            label: 'Mối quan hệ với bạn bè ở lớp',
            nextStepId: 'step-3',
            empathyReply: 'Hiểu lầm hay khoảng cách với bạn bè có thể khiến mình suy nghĩ rất nhiều.',
          },
          {
            id: 'opt-2-family',
            label: 'Chuyện ở nhà hoặc kỳ vọng của gia đình',
            nextStepId: 'step-3',
            empathyReply: 'Đôi khi khoảng cách thế hệ khiến mình cảm thấy khó nói ra điều mình thực sự muốn.',
          },
          {
            id: 'opt-2-unknown',
            label: 'Mình cũng chưa rõ, chỉ thấy trong lòng không ổn',
            nextStepId: 'step-3',
            empathyReply: 'Không sao cả nếu bạn chưa gọi tên rõ được nguyên nhân. Có những ngày tâm trạng tự nhiên chùng xuống mà không cần lý do cụ thể.',
          },
        ],
      },
      {
        id: 'step-3',
        stepOrder: 3,
        gradeLevel: 'all',
        question: 'Cảm xúc này đang ảnh hưởng đến bạn như thế nào?',
        options: [
          {
            id: 'opt-3-focus',
            label: 'Khó tập trung học hoặc làm việc khác',
            nextStepId: 'step-4',
            empathyReply: 'Khi tâm trí bận rộn với cảm xúc, khả năng tập trung tự nhiên giảm đi.',
          },
          {
            id: 'opt-3-body',
            label: 'Cơ thể mệt, căng vai hoặc khó ngủ',
            nextStepId: 'step-4',
            empathyReply: 'Cơ thể luôn phản ánh điều tâm trí đang trải qua. Lắng nghe tín hiệu cơ thể rất quan trọng đấy.',
          },
          {
            id: 'opt-3-quiet',
            label: 'Muốn thu mình lại, ngại nói chuyện với mọi người',
            nextStepId: 'step-4',
            empathyReply: 'Cần không gian yên tĩnh một chút là điều dễ hiểu, miễn là bạn vẫn nhớ mình có nơi để kết nối khi sẵn sàng.',
          },
          {
            id: 'opt-3-okay',
            label: 'Vẫn sinh hoạt bình thường nhưng muốn hiểu mình hơn',
            nextStepId: 'step-4',
            empathyReply: 'Chủ động quan sát bản thân khi mọi thứ còn ổn là thói quen chăm sóc tinh thần rất tốt.',
          },
        ],
      },
      {
        id: 'step-4',
        stepOrder: 4,
        gradeLevel: 'all',
        question: 'Bạn mong muốn điều gì lúc này?',
        options: [
          {
            id: 'opt-4-calm',
            label: 'Muốn bình tĩnh và nhẹ nhõm đầu óc hơn',
            nextStepId: 'step-5',
            empathyReply: 'Một khoảng nghỉ ngắn giúp hệ thần kinh dịu lại sẽ rất phù hợp lúc này.',
          },
          {
            id: 'opt-4-listen',
            label: 'Muốn được ai đó lắng nghe mà không phán xét',
            nextStepId: 'step-5',
            empathyReply: 'Được lắng nghe chân thành giúp gánh nặng nhẹ đi một nửa.',
          },
          {
            id: 'opt-4-plan',
            label: 'Muốn tìm cách giải quyết vấn đề từng bước',
            nextStepId: 'step-5',
            empathyReply: 'Chia nhỏ vấn đề giúp mình lấy lại cảm giác chủ động.',
          },
          {
            id: 'opt-4-adult',
            label: 'Muốn kết nối với thầy cô Phòng Tâm lý hoặc bố mẹ',
            nextStepId: 'support_redirect',
            empathyReply: 'Tìm kiếm sự đồng hành từ người lớn đáng tin cậy là lựa chọn rất sáng suốt. Bạn có thể bấm "Mình cần người hỗ trợ" hoặc gửi phiếu kết nối ngay dưới đây.',
            suggestedAction: 'Mở trang Kết nối hỗ trợ (Get Support)',
          },
        ],
      },
      {
        id: 'step-5',
        stepOrder: 5,
        gradeLevel: 'all',
        question: 'Bạn muốn thử cách nào để cảm thấy dễ chịu hơn?',
        options: [
          {
            id: 'opt-5-breathe',
            label: 'Thực hành bài thở 4-4 ở Góc bình yên (2 phút)',
            nextStepId: 'finish',
            empathyReply: 'Tuyệt vời! Nhịp thở đều đặn sẽ gửi tín hiệu an toàn đến cơ thể bạn. Hãy ghé Góc bình yên nhé.',
            suggestedAction: 'Đi tới Góc bình yên',
          },
          {
            id: 'opt-5-diary',
            label: 'Viết vài dòng vào Nhật ký cảm xúc riêng tư',
            nextStepId: 'finish',
            empathyReply: 'Viết ra giấy hoặc màn hình giúp suy nghĩ được sắp xếp gọn gàng hơn. Nhật ký hoàn toàn riêng tư với bạn.',
            suggestedAction: 'Mở Nhật ký cảm xúc',
          },
          {
            id: 'opt-5-library',
            label: 'Đọc gợi ý kỹ năng phù hợp lứa tuổi ở Thư viện',
            nextStepId: 'finish',
            empathyReply: 'Hiểu thêm về tâm lý lứa tuổi sẽ cho bạn nhiều góc nhìn nhẹ nhàng hơn.',
            suggestedAction: 'Xem Thư viện tâm lý',
          },
          {
            id: 'opt-5-support',
            label: 'Trò chuyện với bố mẹ, GVCN hoặc Phòng Tâm lý',
            nextStepId: 'support_redirect',
            empathyReply: 'Bất cứ khi nào bạn thấy cần một người lớn lắng nghe, Phòng Tâm lý học đường FPT Hà Nam luôn sẵn sàng đồng hành cùng bạn.',
            suggestedAction: 'Đăng ký Kết nối hỗ trợ',
          },
        ],
      },
    ],
    safetyAlerts: [
      {
        id: 'alert-demo-1',
        studentId: 'stu-mid-01',
        studentAlias: 'Học sinh THCS (Mã Demo #M01)',
        gradeLevel: 'middle',
        source: 'manual_help_button',
        triggerSummary: 'Học sinh chủ động nhấn nút "Mình cần người hỗ trợ" khi đang trải nghiệm Buddy Talk.',
        studentMessageExcerpt: 'Em đang cảm thấy hơi áp lực với chuyện bạn bè và muốn nói chuyện với cô tâm lý (Dữ liệu minh họa Demo).',
        status: 'can_xac_minh',
        createdAt: daysAgoIso(1, 15),
        isDemoData: true,
      },
    ],
    auditLogs: [
      {
        id: 'log-demo-1',
        actorId: 'admin-01',
        actorName: 'Chuyên viên Phòng Tâm lý (Demo)',
        actorRole: 'admin',
        action: 'Xem danh sách yêu cầu hỗ trợ (Dữ liệu minh họa)',
        targetType: 'support_request',
        targetId: 'all',
        timestamp: daysAgoIso(0, 8),
      },
    ],
  };
}

function loadDb(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw) as DatabaseState;
    }
  } catch (err) {
    console.error('Error loading DB, recreating initial seed:', err);
  }
  const initial = createInitialDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveDb(state: DatabaseState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

let db: DatabaseState = loadDb();
const sessions = new Map<string, string>(); // token -> userId

interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

function sanitizeUser(u: UserProfile & { passwordHash?: string }): UserProfile {
  const { passwordHash: _, ...rest } = u;
  return rest;
}

function attachUser(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = req.headers['x-vibe-token'];
  if (typeof token === 'string' && sessions.has(token)) {
    const userId = sessions.get(token)!;
    const found = db.users.find((u) => u.id === userId);
    if (found) {
      req.user = sanitizeUser(found);
    }
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: 'Vui lòng đăng nhập để sử dụng chức năng này.' });
    return;
  }
  next();
}

function requireRole(roles: UserProfile['role'][]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Chưa xác thực tài khoản.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Bạn không có quyền truy cập dữ liệu này.' });
      return;
    }
    next();
  };
}

function recordAudit(
  user: UserProfile,
  action: string,
  targetType: AuditLogEntry['targetType'],
  targetId: string
) {
  db.auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actorId: user.id,
    actorName: user.displayName,
    actorRole: user.role,
    action,
    targetType,
    targetId,
    timestamp: new Date().toISOString(),
  });
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDb(db);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(attachUser);

  // Auth routes
  app.get('/api/auth/demo-accounts', (_req, res) => {
    res.json({
      accounts: db.users.map(sanitizeUser),
    });
  });

  app.post('/api/auth/demo-login', (req, res) => {
    const { userId } = req.body as { userId?: string };
    const found = db.users.find((u) => u.id === userId);
    if (!found) {
      res.status(404).json({ error: 'Không tìm thấy tài khoản demo.' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    sessions.set(token, found.id);
    res.json({ token, user: sanitizeUser(found) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
      return;
    }
    const found = db.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!found || found.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu chưa chính xác.' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    sessions.set(token, found.id);
    res.json({ token, user: sanitizeUser(found) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = req.headers['x-vibe-token'];
    if (typeof token === 'string') {
      sessions.delete(token);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      res.status(401).json({ user: null });
      return;
    }
    res.json({ user: req.user });
  });

  // Check-ins (My Feelings) — Student sees own check-ins
  app.get('/api/checkins', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role !== 'student') {
      res.status(403).json({ error: 'Lịch sử check-in cá nhân chỉ hiển thị cho học sinh sở hữu.' });
      return;
    }
    const items = db.checkIns
      .filter((c) => c.studentId === req.user!.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ items });
  });

  app.post('/api/checkins', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role !== 'student') {
      res.status(403).json({ error: 'Chỉ tài khoản học sinh mới thực hiện check-in cảm xúc.' });
      return;
    }
    const { emotion, intensity, causePrompt, extraNote, gradeLevel } = req.body as {
      emotion: EmotionId;
      intensity: number;
      causePrompt?: string;
      extraNote?: string;
      gradeLevel?: GradeLevel;
    };
    const item: EmotionCheckIn = {
      id: `chk-${Date.now()}`,
      studentId: req.user!.id,
      gradeLevel: gradeLevel || req.user!.gradeLevel || 'middle',
      emotion,
      intensity: Math.min(5, Math.max(1, Number(intensity) || 3)),
      causePrompt: (causePrompt || '').slice(0, 500),
      extraNote: (extraNote || '').slice(0, 800),
      createdAt: new Date().toISOString(),
      isDemoData: false,
    };
    db.checkIns.unshift(item);
    saveDb(db);
    res.status(201).json({ item });
  });

  // Emotion Diary — strictly private to owning student
  app.get('/api/diary', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role !== 'student') {
      res.status(403).json({
        error: 'Nhật ký cảm xúc được bảo mật riêng tư và chỉ hiển thị cho học sinh.',
      });
      return;
    }
    const items = db.diaryEntries
      .filter((d) => d.studentId === req.user!.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ items });
  });

  app.post('/api/diary', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role !== 'student') {
      res.status(403).json({ error: 'Chỉ học sinh mới có thể viết nhật ký cảm xúc.' });
      return;
    }
    const body = req.body as Partial<DiaryEntry>;
    const item: DiaryEntry = {
      id: `dia-${Date.now()}`,
      studentId: req.user!.id,
      emotion: body.emotion || 'binh_yen',
      sticker: body.sticker || 'sunbeam',
      feelingToday: (body.feelingToday || '').slice(0, 400),
      whatHappened: (body.whatHappened || '').slice(0, 1000),
      joyOrSadness: (body.joyOrSadness || '').slice(0, 800),
      howICoped: (body.howICoped || '').slice(0, 800),
      gratitude: (body.gratitude || '').slice(0, 500),
      positiveNote: (body.positiveNote || '').slice(0, 400),
      createdAt: new Date().toISOString(),
      isDemoData: false,
    };
    db.diaryEntries.unshift(item);
    saveDb(db);
    res.status(201).json({ item });
  });

  app.delete('/api/diary/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const idx = db.diaryEntries.findIndex(
      (d) => d.id === req.params.id && d.studentId === req.user!.id
    );
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy trang nhật ký.' });
      return;
    }
    db.diaryEntries.splice(idx, 1);
    saveDb(db);
    res.json({ ok: true });
  });

  // Buddy Talk scripted flows + safety alert creation
  app.get('/api/buddytalk/flows', (_req, res) => {
    res.json({ steps: db.buddyTalkSteps });
  });

  app.put('/api/buddytalk/flows', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const { steps } = req.body as { steps?: BuddyTalkStep[] };
    if (!Array.isArray(steps) || steps.length === 0) {
      res.status(400).json({ error: 'Dữ liệu kịch bản không hợp lệ.' });
      return;
    }
    db.buddyTalkSteps = steps;
    saveDb(db);
    res.json({ steps: db.buddyTalkSteps });
  });

  app.post('/api/buddytalk/safety-signal', requireAuth, (req: AuthenticatedRequest, res) => {
    const { source, triggerSummary, studentMessageExcerpt, gradeLevel } = req.body as {
      source: 'buddy_talk' | 'manual_help_button';
      triggerSummary: string;
      studentMessageExcerpt: string;
      gradeLevel?: GradeLevel;
    };
    const alert: SafetyAlert = {
      id: `alert-${Date.now()}`,
      studentId: req.user!.id,
      studentAlias: `${req.user!.displayName}${req.user!.classLabel ? ` · ${req.user!.classLabel}` : ''}`,
      gradeLevel: gradeLevel || req.user!.gradeLevel || 'middle',
      source: source || 'buddy_talk',
      triggerSummary: (triggerSummary || 'Tín hiệu cần xác minh an toàn từ học sinh').slice(0, 300),
      studentMessageExcerpt: (studentMessageExcerpt || '').slice(0, 600),
      status: 'can_xac_minh',
      createdAt: new Date().toISOString(),
      isDemoData: false,
    };
    db.safetyAlerts.unshift(alert);
    saveDb(db);
    res.status(201).json({ alert });
  });

  // Get Support & Counseling Registration
  app.get('/api/support', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role === 'admin') {
      recordAudit(
        req.user!,
        'Truy cập danh sách yêu cầu hỗ trợ & đăng ký tham vấn',
        'support_request',
        'all'
      );
      res.json({ items: db.supportRequests });
      return;
    }
    if (req.user!.role === 'student') {
      const own = db.supportRequests.filter((s) => s.studentId === req.user!.id);
      res.json({ items: own });
      return;
    }
    res.status(403).json({
      error: 'Thông tin đăng ký hỗ trợ chỉ hiển thị cho học sinh gửi yêu cầu và Phòng Tâm lý.',
    });
  });

  app.post('/api/support', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.user!.role !== 'student') {
      res.status(403).json({ error: 'Vui lòng dùng tài khoản học sinh để gửi yêu cầu hỗ trợ.' });
      return;
    }
    const body = req.body as Partial<SupportRequest>;
    if (!body.description || !body.contactDetail) {
      res.status(400).json({ error: 'Vui lòng điền mô tả mong muốn hỗ trợ và thông tin liên hệ.' });
      return;
    }
    const item: SupportRequest = {
      id: `sup-${Date.now()}`,
      studentId: req.user!.id,
      studentName: req.user!.displayName,
      gradeLevel: body.gradeLevel || req.user!.gradeLevel || 'middle',
      classLabel: body.classLabel || req.user!.classLabel || 'FPT Hà Nam',
      requestType: body.requestType || 'ho_tro',
      topic: body.topic || 'cam_xuc',
      contactMethod: body.contactMethod || 'phong_tam_ly',
      contactDetail: body.contactDetail.slice(0, 200),
      description: body.description.slice(0, 1200),
      status: 'moi_tiep_nhan',
      createdAt: new Date().toISOString(),
      isDemoData: false,
    };
    db.supportRequests.unshift(item);
    saveDb(db);
    res.status(201).json({ item });
  });

  app.patch('/api/support/:id', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const item = db.supportRequests.find((s) => s.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Không tìm thấy yêu cầu hỗ trợ.' });
      return;
    }
    const { status } = req.body as { status: SupportRequest['status'] };
    if (status) {
      item.status = status;
      recordAudit(
        req.user!,
        `Cập nhật trạng thái yêu cầu hỗ trợ thành "${status}"`,
        'support_request',
        item.id
      );
      saveDb(db);
    }
    res.json({ item });
  });

  // Psychology Library
  app.get('/api/library', (_req, res) => {
    res.json({ items: db.libraryResources });
  });

  app.post('/api/library', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const body = req.body as Partial<LibraryResource>;
    if (!body.title || !body.summary) {
      res.status(400).json({ error: 'Vui lòng nhập tiêu đề và tóm tắt học liệu.' });
      return;
    }
    const item: LibraryResource = {
      id: `lib-${Date.now()}`,
      title: body.title.slice(0, 160),
      gradeLevel: body.gradeLevel || 'middle',
      topic: body.topic || 'Kỹ năng tâm lý – xã hội',
      format: body.format || 'bai_viet',
      readTime: body.readTime || '4 phút đọc',
      summary: body.summary.slice(0, 400),
      content: Array.isArray(body.content) && body.content.length > 0 ? body.content : [body.summary],
      interactiveQuestion: body.interactiveQuestion || 'Bạn rút ra điều gì cho bản thân sau nội dung này?',
      interactiveChoices:
        Array.isArray(body.interactiveChoices) && body.interactiveChoices.length > 0
          ? body.interactiveChoices
          : ['Áp dụng thử ngay hôm nay', 'Chia sẻ cùng bạn thân hoặc người lớn tin cậy'],
      practiceExercise: body.practiceExercise || 'Dành 3 phút ghi chú lại một ý hữu ích nhất vào nhật ký.',
      isDemoData: false,
    };
    db.libraryResources.unshift(item);
    saveDb(db);
    res.status(201).json({ item });
  });

  app.put('/api/library/:id', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const idx = db.libraryResources.findIndex((r) => r.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy học liệu.' });
      return;
    }
    db.libraryResources[idx] = { ...db.libraryResources[idx], ...req.body, id: req.params.id };
    saveDb(db);
    res.json({ item: db.libraryResources[idx] });
  });

  app.delete('/api/library/:id', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const idx = db.libraryResources.findIndex((r) => r.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy học liệu.' });
      return;
    }
    db.libraryResources.splice(idx, 1);
    saveDb(db);
    res.json({ ok: true });
  });

  // Psychology Dashboard Overview & Safety Alerts & Audit Logs
  app.get('/api/admin/overview', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const studentCount = db.users.filter((u) => u.role === 'student').length;
    const emotions: EmotionId[] = [
      'vui_ve',
      'binh_yen',
      'buon_ba',
      'lo_lang',
      'tuc_gian',
      'that_vong',
      'co_don',
      'met_moi',
    ];
    const emotionDistribution = emotions.map((e) => ({
      emotion: e,
      count: db.checkIns.filter((c) => c.emotion === e).length,
    }));

    const grades: GradeLevel[] = ['primary', 'middle', 'high'];
    const gradeBreakdown = grades.map((g) => ({
      gradeLevel: g,
      checkIns: db.checkIns.filter((c) => c.gradeLevel === g).length,
      supportRequests: db.supportRequests.filter((s) => s.gradeLevel === g).length,
    }));

    const dailyTrend = Array.from({ length: 7 }, (_, i) => {
      const offset = 6 - i;
      const target = new Date();
      target.setDate(target.getDate() - offset);
      const dayKey = target.toISOString().slice(0, 10);
      const dayItems = db.checkIns.filter((c) => c.createdAt.slice(0, 10) === dayKey);
      const positive = dayItems.filter(
        (c) => c.emotion === 'vui_ve' || c.emotion === 'binh_yen'
      ).length;
      return {
        date: `${target.getDate()}/${target.getMonth() + 1}`,
        positive,
        neutralOrLow: dayItems.length - positive,
        total: dayItems.length,
      };
    });

    const containsDemoData =
      db.checkIns.some((c) => c.isDemoData) || db.supportRequests.some((s) => s.isDemoData);

    res.json({
      totalStudentAccounts: studentCount,
      totalCheckIns: db.checkIns.length,
      totalSupportRequests: db.supportRequests.length,
      totalCounselingRegistrations: db.supportRequests.filter(
        (s) => s.requestType === 'tham_van_ca_nhan'
      ).length,
      pendingSafetyAlerts: db.safetyAlerts.filter((a) => a.status === 'can_xac_minh').length,
      emotionDistribution,
      gradeBreakdown,
      dailyTrend,
      containsDemoData,
    });
  });

  app.get('/api/admin/safety-alerts', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    recordAudit(
      req.user!,
      'Xem danh sách cảnh báo an toàn học sinh',
      'safety_alert',
      'all'
    );
    res.json({ items: db.safetyAlerts });
  });

  app.patch('/api/admin/safety-alerts/:id', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const alert = db.safetyAlerts.find((a) => a.id === req.params.id);
    if (!alert) {
      res.status(404).json({ error: 'Không tìm thấy cảnh báo.' });
      return;
    }
    const { status } = req.body as { status: SafetyAlert['status'] };
    alert.status = status;
    alert.verifiedBy = req.user!.displayName;
    recordAudit(
      req.user!,
      `Xác minh cảnh báo an toàn thành "${status}"`,
      'safety_alert',
      alert.id
    );
    saveDb(db);
    res.json({ alert });
  });

  app.get('/api/admin/audit-logs', requireRole(['admin']), (_req, res) => {
    res.json({ items: db.auditLogs });
  });

  app.get('/api/admin/export-csv', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    recordAudit(
      req.user!,
      'Xuất báo cáo thống kê tổng hợp (CSV)',
      'statistics_export',
      'summary-csv'
    );
    const header = 'Nhom_Cam_Xuc,So_Luot_Check_In,Du_Lieu_Mau_Bao_Gom\n';
    const emotions: EmotionId[] = [
      'vui_ve',
      'binh_yen',
      'buon_ba',
      'lo_lang',
      'tuc_gian',
      'that_vong',
      'co_don',
      'met_moi',
    ];
    const rows = emotions
      .map((e) => {
        const count = db.checkIns.filter((c) => c.emotion === e).length;
        return `${e},${count},Co (Demo)`;
      })
      .join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="vibespace-thong-ke-cam-xuc.csv"');
    res.send('\uFEFF' + header + rows);
  });

  // Vite dev / static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VIBE SPACE server running at http://localhost:${PORT}`);
  });
}

startServer();
