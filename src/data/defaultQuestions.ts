import { Question } from '../types/game';

export const DEFAULT_QUESTIONS: Question[] = [
  // ==========================================
  // VẬT LÝ 11 (25 CÂU HỎI TOÀN DIỆN CHỦ ĐỀ)
  // ==========================================
  {
    id: 'phy-1',
    topic: 'Vật Lý 11',
    question: 'Phương trình dao động điều hòa của một vật có dạng x = A.cos(ωt + φ). Đại lượng A được gọi là gì?',
    options: ['Tần số góc của dao động', 'Biên độ dao động', 'Pha ban đầu', 'Li độ tức thời'],
    correctIndex: 1,
    hint: 'A là giá trị cực đại của li độ x, luôn có giá trị dương và đo bằng đơn vị độ dài (cm hoặc m).'
  },
  {
    id: 'phy-2',
    topic: 'Vật Lý 11',
    question: 'Trong dao động điều hòa, vận tốc v biến thiên điều hòa và sớm pha hơn li độ x một góc là bao nhiêu?',
    options: ['π rad (ngược pha)', 'π/2 rad (vuông pha)', 'π/4 rad', 'Cùng pha (0 rad)'],
    correctIndex: 1,
    hint: 'Đạo hàm của x = A.cos(ωt + φ) theo thời gian là v = -ωA.sin(ωt + φ) = ωA.cos(ωt + φ + π/2).'
  },
  {
    id: 'phy-3',
    topic: 'Vật Lý 11',
    question: 'Gia tốc của một vật dao động điều hòa tỉ lệ với li độ và luôn hướng về:',
    options: ['Vị trí biên dương', 'Vị trí biên âm', 'Vị trí cân bằng', 'Hướng chuyển động'],
    correctIndex: 2,
    hint: 'Công thức gia tốc: a = -ω²x. Dấu trừ cho biết vector gia tốc luôn hướng về vị trí cân bằng.'
  },
  {
    id: 'phy-4',
    topic: 'Vật Lý 11',
    question: 'Chu kỳ dao động điều hòa của con lắc đơn có chiều dài l tại nơi có gia tốc trọng trường g là:',
    options: ['T = 2π√(g/l)', 'T = 2π√(l/g)', 'T = (1/2π)√(l/g)', 'T = 2π√(m/k)'],
    correctIndex: 1,
    hint: 'Chu kỳ con lắc đơn tỉ lệ thuận với căn bậc hai chiều dài l và tỉ lệ nghịch với căn g: T = 2π√(l/g).'
  },
  {
    id: 'phy-5',
    topic: 'Vật Lý 11',
    question: 'Một con lắc lò xo có độ cứng k, vật nhỏ khối lượng m. Tần số góc dao động điều hòa ω được tính bằng:',
    options: ['ω = √(k/m)', 'ω = √(m/k)', 'ω = 2π√(k/m)', 'ω = k/m'],
    correctIndex: 0,
    hint: 'Tần số góc của con lắc lò xo phụ thuộc vào độ cứng k và khối lượng m theo hệ thức ω = √(k/m).'
  },
  {
    id: 'phy-6',
    topic: 'Vật Lý 11',
    question: 'Cơ năng của một vật có khối lượng m dao động điều hòa với biên độ A và tần số góc ω là:',
    options: ['W = m.ω.A²', 'W = 1/2 m.ω².A²', 'W = 1/2 m.ω.A', 'W = m.ω².A'],
    correctIndex: 1,
    hint: 'Cơ năng bảo toàn và bằng động năng cực đại: W = 1/2 m.v_max² = 1/2 m.ω².A².'
  },
  {
    id: 'phy-7',
    topic: 'Vật Lý 11',
    question: 'Bước sóng λ là quãng đường mà sóng truyền được trong thời gian:',
    options: ['Một chu kỳ T', 'Nửa chu kỳ (T/2)', 'Một giây', 'Hai chu kỳ (2T)'],
    correctIndex: 0,
    hint: 'Bước sóng là khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha: λ = v.T = v/f.'
  },
  {
    id: 'phy-8',
    topic: 'Vật Lý 11',
    question: 'Sóng cơ học KHÔNG truyền được trong môi trường nào sau đây?',
    options: ['Chất lỏng', 'Chất rắn', 'Chất khí', 'Chân không'],
    correctIndex: 3,
    hint: 'Sóng cơ học lan truyền nhờ sự tương tác đàn hồi giữa các phần tử vật chất, do đó không truyền được trong chân không.'
  },
  {
    id: 'phy-9',
    topic: 'Vật Lý 11',
    question: 'Trong hiện tượng giao thoa sóng cơ của hai nguồn kết hợp cùng pha, điểm dao động với biên độ cực đại có hiệu đường đi d2 - d1 bằng:',
    options: ['d2 - d1 = k.λ (k ∈ Z)', 'd2 - d1 = (k + 0,5).λ', 'd2 - d1 = (2k + 1).λ/4', 'd2 - d1 = k.λ/2'],
    correctIndex: 0,
    hint: 'Cực đại giao thoa xảy ra khi hai sóng đến điểm đó cùng pha, tức hiệu đường đi bằng số nguyên lần bước sóng: d2 - d1 = kλ.'
  },
  {
    id: 'phy-10',
    topic: 'Vật Lý 11',
    question: 'Khoảng cách giữa hai nút sóng liên tiếp hoặc hai bụng sóng liên tiếp trong hiện tượng sóng dừng là:',
    options: ['λ', 'λ / 2', 'λ / 4', '2λ'],
    correctIndex: 1,
    hint: 'Trên dây có sóng dừng, khoảng cách giữa 2 nút hoặc 2 bụng liền kề nhau luôn bằng nửa bước sóng (λ/2).'
  },
  {
    id: 'phy-11',
    topic: 'Vật Lý 11',
    question: 'Độ lớn lực tương tác tĩnh điện giữa hai điện tích điểm q1, q2 đặt cách nhau r trong chân không (Định luật Coulomb) là:',
    options: ['F = k.|q1.q2| / r', 'F = k.|q1.q2| / r²', 'F = k.(q1 + q2) / r²', 'F = k.|q1.q2|² / r'],
    correctIndex: 1,
    hint: 'Lực Coulomb tỉ lệ nghịch với bình phương khoảng cách r giữa hai điện tích: F = k.|q1.q2| / r².'
  },
  {
    id: 'phy-12',
    topic: 'Vật Lý 11',
    question: 'Đơn vị đo của cường độ điện trường E trong hệ SI là gì?',
    options: ['Vôn (V)', 'Vôn trên mét (V/m)', 'Niutơn (N)', 'Jun (J)'],
    correctIndex: 1,
    hint: 'Cường độ điện trường E = F/q hoặc E = U/d, có đơn vị chuẩn là Vôn trên mét (V/m).'
  },
  {
    id: 'phy-13',
    topic: 'Vật Lý 11',
    question: 'Công của lực điện trường dịch chuyển một điện tích q giữa hai điểm có hiệu điện thế U được tính bằng:',
    options: ['A = q / U', 'A = q . U', 'A = U / q', 'A = q . U²'],
    correctIndex: 1,
    hint: 'Công của lực điện chỉ phụ thuộc vào vị trí đầu và cuối: A = q.U.'
  },
  {
    id: 'phy-14',
    topic: 'Vật Lý 11',
    question: 'Điện dung C của tụ điện phẳng tỉ lệ nghịch với đại lượng nào sau đây?',
    options: ['Diện tích đối diện giữa hai bản S', 'Hằng số điện môi ε', 'Khoảng cách giữa hai bản d', 'Hiệu điện thế U'],
    correctIndex: 2,
    hint: 'Công thức tụ điện phẳng: C = (ε.S)/(9.10⁹.4π.d). Khoảng cách d càng lớn thì điện dung C càng nhỏ.'
  },
  {
    id: 'phy-15',
    topic: 'Vật Lý 11',
    question: 'Theo định luật Ohm cho đoạn mạch chỉ chứa điện trở R, cường độ dòng điện I tỉ lệ thuận với:',
    options: ['Điện trở R', 'Hiệu điện thế U đặt vào hai đầu đoạn mạch', 'Chiều dài dây dẫn', 'Nhiệt độ môi trường'],
    correctIndex: 1,
    hint: 'Định luật Ohm: I = U / R, cường độ dòng điện tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R.'
  },
  {
    id: 'phy-16',
    topic: 'Vật Lý 11',
    question: 'Định luật Joule - Lenz cho biết nhiệt lượng Q tỏa ra trên dây dẫn có điện trở R khi dòng điện I chạy qua trong thời gian t là:',
    options: ['Q = I . R . t', 'Q = I² . R . t', 'Q = I . R² . t', 'Q = U . I² . t'],
    correctIndex: 1,
    hint: 'Nhiệt lượng tỏa ra tỉ lệ thuận với bình phương cường độ dòng điện: Q = I²Rt.'
  },
  {
    id: 'phy-17',
    topic: 'Vật Lý 11',
    question: 'Định luật Ohm đối với toàn mạch kín gồm nguồn có suất điện động E, điện trở trong r và điện trở mạch ngoài R là:',
    options: ['I = E / R', 'I = E / (R + r)', 'I = (E - r) / R', 'I = E / r'],
    correctIndex: 1,
    hint: 'Cường độ dòng điện toàn mạch bằng suất điện động chia cho tổng trở toàn phần: I = E / (R + r).'
  },
  {
    id: 'phy-18',
    topic: 'Vật Lý 11',
    question: 'Lực từ tác dụng lên một đoạn dây dẫn mang dòng điện I dài L đặt trong từ trường đều B vuông góc với đường sức từ là:',
    options: ['F = I . B . L', 'F = I . B / L', 'F = B . L / I', 'F = I² . B . L'],
    correctIndex: 0,
    hint: 'Công thức lực Am-pe: F = I.B.L.sin(α). Khi dây vuông góc đường cảm ứng từ thì sin(90°) = 1, nên F = I.B.L.'
  },
  {
    id: 'phy-19',
    topic: 'Vật Lý 11',
    question: 'Lực Lorentz là lực tác dụng của từ trường lên:',
    options: ['Hạt mang điện đứng yên', 'Hạt mang điện chuyển động trong từ trường', 'Một đoạn dây dẫn không có dòng điện', 'Khối kim loại trung hòa điện'],
    correctIndex: 1,
    hint: 'Lực Lorentz f = |q|vB.sin(α) tác dụng lên mọi hạt mang điện chuyển động trong từ trường.'
  },
  {
    id: 'phy-20',
    topic: 'Vật Lý 11',
    question: 'Từ thông Φ gửi qua một khung dây kín có diện tích S đặt trong từ trường đều B được tính theo công thức:',
    options: ['Φ = B . S . sin(α)', 'Φ = B . S . cos(α)', 'Φ = B / S', 'Φ = B . S²'],
    correctIndex: 1,
    hint: 'Từ thông Φ = B.S.cos(α), trong đó α là góc tạo bởi vector cảm ứng từ B và vector pháp tuyến n của mặt khung dây.'
  },
  {
    id: 'phy-21',
    topic: 'Vật Lý 11',
    question: 'Định luật khúc xạ ánh sáng (Định luật Snell) liên hệ giữa góc tới i và góc khúc xạ r theo hệ thức:',
    options: ['n1 . sin(i) = n2 . sin(r)', 'n1 . cos(i) = n2 . cos(r)', 'n1 . sin(r) = n2 . sin(i)', 'sin(i) / sin(r) = n1 / n2'],
    correctIndex: 0,
    hint: 'Tỉ số sin(i) / sin(r) = n2 / n1 hay n1.sin(i) = n2.sin(r), trong đó n1, n2 là chiết suất của hai môi trường.'
  },
  {
    id: 'phy-22',
    topic: 'Vật Lý 11',
    question: 'Điều kiện để xảy ra hiện tượng phản xạ toàn phần là tia sáng phải truyền từ môi trường có chiết suất:',
    options: [
      'Lớn sang môi trường có chiết suất nhỏ hơn và góc tới i ≥ i_gh',
      'Nhỏ sang môi trường có chiết suất lớn hơn và góc tới i ≥ i_gh',
      'Bất kỳ với góc tới i = 90°',
      'Đồng tính vào chân không với mọi góc tới'
    ],
    correctIndex: 0,
    hint: 'Phản xạ toàn phần chỉ xảy ra khi truyền từ môi trường chiết quang hơn sang kém hơn (n1 > n2) và góc tới i ≥ góc giới hạn i_gh (sin(i_gh) = n2/n1).'
  },
  {
    id: 'phy-23',
    topic: 'Vật Lý 11',
    question: 'Thấu kính phân kỳ luôn cho ảnh của một vật thật có tính chất:',
    options: ['Ảnh thật, ngược chiều, lớn hơn vật', 'Ảnh ảo, cùng chiều, nhỏ hơn vật', 'Ảnh ảo, cùng chiều, lớn hơn vật', 'Ảnh thật, cùng chiều, nhỏ hơn vật'],
    correctIndex: 1,
    hint: 'Vật thật đặt trước thấu kính phân kỳ luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật, nằm trong khoảng tiêu cự.'
  },
  {
    id: 'phy-24',
    topic: 'Vật Lý 11',
    question: 'Độ tụ D của một thấu kính có tiêu cự f = 50 cm = 0,5 m là:',
    options: ['+0,5 dp', '+2 dp (điốp)', '+50 dp', '+20 dp'],
    correctIndex: 1,
    hint: 'Độ tụ D = 1 / f (với tiêu cự f đo bằng mét): D = 1 / 0,5 = +2 dp (điốp).'
  },
  {
    id: 'phy-25',
    topic: 'Vật Lý 11',
    question: 'Hiện tượng tán sắc ánh sáng khi đi qua lăng kính chứng minh ánh sáng trắng là:',
    options: [
      'Hỗn hợp của vô số ánh sáng đơn sắc có màu biến thiên liên tục từ đỏ đến tím',
      'Một ánh sáng đơn sắc màu vàng chói',
      'Sóng điện từ không có tần số xác định',
      'Tia sáng bị lăng kính nhuộm màu đỏ'
    ],
    correctIndex: 0,
    hint: 'Thí nghiệm tán sắc ánh sáng của Newton chứng minh ánh sáng mặt trời là ánh sáng phức tạp gồm vô số màu đơn sắc từ đỏ đến tím.'
  },

  // ==========================================
  // TOÁN 11 (15 CÂU HỎI CHỦ ĐỀ)
  // ==========================================
  {
    id: 'math-1',
    topic: 'Toán 11',
    question: 'Cho cấp số cộng (Un) có số hạng đầu u1 = 3 và công sai d = 4. Số hạng thứ hai u2 bằng bao nhiêu?',
    options: ['u2 = 7', 'u2 = 12', 'u2 = -1', 'u2 = 1'],
    correctIndex: 0,
    hint: 'Công thức tổng quát cấp số cộng: u(n) = u(n-1) + d. Do đó u2 = u1 + d = 3 + 4 = 7.'
  },
  {
    id: 'math-2',
    topic: 'Toán 11',
    question: 'Số hạng tổng quát u_n của cấp số cộng có số hạng đầu u1 và công sai d là:',
    options: ['u_n = u1 + n.d', 'u_n = u1 + (n - 1).d', 'u_n = u1 . d^(n-1)', 'u_n = n.u1 + d'],
    correctIndex: 1,
    hint: 'Công thức số hạng thứ n của cấp số cộng: u_n = u1 + (n - 1)d.'
  },
  {
    id: 'math-3',
    topic: 'Toán 11',
    question: 'Cho cấp số nhân (u_n) có u1 = 2 và công bội q = 3. Số hạng thứ 3 (u3) bằng:',
    options: ['6', '8', '18', '24'],
    correctIndex: 2,
    hint: 'Công thức cấp số nhân: u_n = u1 . q^(n-1). Với n = 3 thì u3 = 2 . 3² = 2 . 9 = 18.'
  },
  {
    id: 'math-4',
    topic: 'Toán 11',
    question: 'Đạo hàm của hàm số y = x⁴ là:',
    options: ['y\' = 4x', 'y\' = 4x³', 'y\' = x³', 'y\' = 3x⁴'],
    correctIndex: 1,
    hint: 'Công thức đạo hàm lũy thừa cơ bản: (x^n)\' = n.x^(n-1). Với n = 4 thì (x⁴)\' = 4x³.'
  },
  {
    id: 'math-5',
    topic: 'Toán 11',
    question: 'Đạo hàm của hàm số lượng giác y = sin(x) là:',
    options: ['y\' = -cos(x)', 'y\' = cos(x)', 'y\' = sin(x)', 'y\' = -sin(x)'],
    correctIndex: 1,
    hint: 'Đạo hàm của sin(x) bằng cos(x), trong khi đạo hàm của cos(x) bằng -sin(x).'
  },
  {
    id: 'math-6',
    topic: 'Toán 11',
    question: 'Đạo hàm của hàm số y = cos(2x) là:',
    options: ['y\' = -2.sin(2x)', 'y\' = 2.sin(2x)', 'y\' = -sin(2x)', 'y\' = 2.cos(2x)'],
    correctIndex: 0,
    hint: 'Đạo hàm hàm hợp: [cos(u)]\' = -u\' . sin(u). Với u = 2x thì (2x)\' = 2, do đó y\' = -2.sin(2x).'
  },
  {
    id: 'math-7',
    topic: 'Toán 11',
    question: 'Tập giá trị của hàm số y = sin(x) trên tập số thực R là:',
    options: ['[-1; 1]', '(0; 1]', '[-∞; +∞]', '[0; π]'],
    correctIndex: 0,
    hint: 'Hàm sin và cos luôn dao động trong khoảng bị chặn từ -1 đến 1: -1 ≤ sin(x) ≤ 1.'
  },
  {
    id: 'math-8',
    topic: 'Toán 11',
    question: 'Nghiệm của phương trình lượng giác sin(x) = 0 là:',
    options: ['x = k.2π (k ∈ Z)', 'x = k.π (k ∈ Z)', 'x = π/2 + k.π (k ∈ Z)', 'x = π/4 + k.π'],
    correctIndex: 1,
    hint: 'Sin bằng 0 tại các điểm 0, π, 2π, 3π... tức x = kπ (k ∈ Z).'
  },
  {
    id: 'math-9',
    topic: 'Toán 11',
    question: 'Giới hạn lim (1/n) khi n tiến ra vô cùng (+∞) bằng bao nhiêu?',
    options: ['+∞', '1', '0', '-1'],
    correctIndex: 2,
    hint: 'Khi mẫu số n tăng lên rất lớn vô hạn thì phân số 1/n tiến dần về 0.'
  },
  {
    id: 'math-10',
    topic: 'Toán 11',
    question: 'Giới hạn lim (x² - 4)/(x - 2) khi x tiến dần đến 2 bằng:',
    options: ['0', '2', '4', 'Vô cùng'],
    correctIndex: 2,
    hint: 'Phân tích tử số: x² - 4 = (x - 2)(x + 2). Rút gọn (x - 2), ta được lim (x + 2) khi x → 2 = 2 + 2 = 4.'
  },
  {
    id: 'math-11',
    topic: 'Toán 11',
    question: 'Tung một con xúc xắc cân đối đồng chất 6 mặt. Xác suất để xuất hiện mặt chẵn là:',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correctIndex: 2,
    hint: 'Các mặt chẵn gồm {2, 4, 6} (3 mặt thuận lợi) trên tổng số 6 mặt khả dĩ: P = 3/6 = 1/2.'
  },
  {
    id: 'math-12',
    topic: 'Toán 11',
    question: 'Số hoán vị của một tập hợp có 4 phần tử (P4 = 4!) bằng:',
    options: ['12', '16', '24', '48'],
    correctIndex: 2,
    hint: '4! = 4 x 3 x 2 x 1 = 24.'
  },
  {
    id: 'math-13',
    topic: 'Toán 11',
    question: 'Công thức tính số tổ hợp chập k của n phần tử (C_n^k) là:',
    options: [
      'C_n^k = n! / [k! . (n - k)!]',
      'C_n^k = n! / (n - k)!',
      'C_n^k = (n - k)! / k!',
      'C_n^k = n! . k!'
    ],
    correctIndex: 0,
    hint: 'Số tổ hợp C_n^k = n! / (k!(n - k)!), không tính đến thứ tự sắp xếp.'
  },
  {
    id: 'math-14',
    topic: 'Toán 11',
    question: 'Cho hai biến cố độc lập A và B với P(A) = 0,4 và P(B) = 0,5. Xác suất của biến cố giao P(A ∩ B) bằng:',
    options: ['0,9', '0,2', '0,1', '0,45'],
    correctIndex: 1,
    hint: 'Với hai biến cố độc lập thì P(A ∩ B) = P(A) . P(B) = 0,4 . 0,5 = 0,20.'
  },
  {
    id: 'math-15',
    topic: 'Toán 11',
    question: 'Đạo hàm của hàm số y = 3x² - 5x + 7 tại điểm x = 2 là:',
    options: ['y\'(2) = 7', 'y\'(2) = 12', 'y\'(2) = 9', 'y\'(2) = 5'],
    correctIndex: 0,
    hint: 'y\' = (3x² - 5x + 7)\' = 6x - 5. Thay x = 2: y\'(2) = 6(2) - 5 = 12 - 5 = 7.'
  },

  // ==========================================
  // TIẾNG ANH 11 (15 CÂU HỎI CHỦ ĐỀ)
  // ==========================================
  {
    id: 'eng-1',
    topic: 'Tiếng Anh 11',
    question: 'If it ______ tomorrow, we will stay at home and play video games.',
    options: ['rains', 'rained', 'will rain', 'had rained'],
    correctIndex: 0,
    hint: 'Câu điều kiện loại 1: If + S + V(hiện tại đơn), S + will + V_inf.'
  },
  {
    id: 'eng-2',
    topic: 'Tiếng Anh 11',
    question: 'If I ______ a million dollars right now, I would travel around the universe.',
    options: ['have', 'had', 'will have', 'would have'],
    correctIndex: 1,
    hint: 'Câu điều kiện loại 2 giả định trái ngược với hiện tại: If + S + V2/ed (were), S + would + V_inf.'
  },
  {
    id: 'eng-3',
    topic: 'Tiếng Anh 11',
    question: 'If he had studied harder last semester, he ______ the physics examination.',
    options: ['will pass', 'would pass', 'would have passed', 'passed'],
    correctIndex: 2,
    hint: 'Câu điều kiện loại 3 giả định việc trong quá khứ: If + S + had + V3/ed, S + would have + V3/ed.'
  },
  {
    id: 'eng-4',
    topic: 'Tiếng Anh 11',
    question: 'The man ______ lives next door is an outstanding physics scientist.',
    options: ['which', 'who', 'whose', 'whom'],
    correctIndex: 1,
    hint: 'Đại từ quan hệ thay thế cho danh từ chỉ người làm chủ ngữ là "who".'
  },
  {
    id: 'eng-5',
    topic: 'Tiếng Anh 11',
    question: 'The experiment ______ we carried out in the laboratory was extremely successful.',
    options: ['which', 'who', 'whose', 'where'],
    correctIndex: 0,
    hint: 'Đại từ quan hệ thay thế cho danh từ chỉ vật ("the experiment") là "which" hoặc "that".'
  },
  {
    id: 'eng-6',
    topic: 'Tiếng Anh 11',
    question: 'This is the student ______ project won first prize in the national science competition.',
    options: ['who', 'whom', 'whose', 'which'],
    correctIndex: 2,
    hint: '"whose" là đại từ quan hệ chỉ quyền sở hữu (whose project = project of the student).'
  },
  {
    id: 'eng-7',
    topic: 'Tiếng Anh 11',
    question: 'She suggested ______ to the science museum this weekend.',
    options: ['go', 'to go', 'going', 'went'],
    correctIndex: 2,
    hint: 'Cấu trúc đề xuất: suggest + V-ing.'
  },
  {
    id: 'eng-8',
    topic: 'Tiếng Anh 11',
    question: 'He decided ______ engineering at university after graduating from high school.',
    options: ['study', 'studying', 'to study', 'studied'],
    correctIndex: 2,
    hint: 'Cấu trúc: decide + to V_inf (quyết định làm gì).'
  },
  {
    id: 'eng-9',
    topic: 'Tiếng Anh 11',
    question: 'This famous novel ______ by a Vietnamese author in 2020.',
    options: ['wrote', 'is written', 'was written', 'has written'],
    correctIndex: 2,
    hint: 'Câu bị động ở thì quá khứ đơn (mốc thời gian in 2020): S + was/were + V3/ed.'
  },
  {
    id: 'eng-10',
    topic: 'Tiếng Anh 11',
    question: 'Renewable energy sources ______ widely throughout the city in the near future.',
    options: ['will be used', 'will use', 'were used', 'have used'],
    correctIndex: 0,
    hint: 'Câu bị động thì tương lai đơn: will be + V3/ed.'
  },
  {
    id: 'eng-11',
    topic: 'Tiếng Anh 11',
    question: 'I have known him ______ we were in primary school.',
    options: ['for', 'since', 'during', 'from'],
    correctIndex: 1,
    hint: 'Dùng "since" kết hợp với mốc thời gian hoặc mệnh đề quá khứ trong thì Hiện tại hoàn thành.'
  },
  {
    id: 'eng-12',
    topic: 'Tiếng Anh 11',
    question: 'They have lived in Ho Chi Minh City ______ ten years.',
    options: ['since', 'for', 'ago', 'in'],
    correctIndex: 1,
    hint: 'Dùng "for" kết hợp với khoảng thời gian (for ten years).'
  },
  {
    id: 'eng-13',
    topic: 'Tiếng Anh 11',
    question: 'Never ______ your dreams no matter how challenging the obstacles are.',
    options: ['give up', 'look after', 'take off', 'run into'],
    correctIndex: 0,
    hint: 'Cụm động từ: "give up" có nghĩa là từ bỏ, đầu hàng.'
  },
  {
    id: 'eng-14',
    topic: 'Tiếng Anh 11',
    question: 'The scientists decided to ______ a series of experiments to test the new hypothesis.',
    options: ['carry out', 'bring up', 'get over', 'turn on'],
    correctIndex: 0,
    hint: '"carry out" có nghĩa là tiến hành, thực hiện (thí nghiệm, nghiên cứu).'
  },
  {
    id: 'eng-15',
    topic: 'Tiếng Anh 11',
    question: 'The company had to ______ several job applications due to budget cuts.',
    options: ['turn down', 'look for', 'put on', 'break out'],
    correctIndex: 0,
    hint: '"turn down" có nghĩa là từ chối (bác bỏ đơn ứng tuyển hoặc lời mời).'
  }
];

export const STORAGE_KEY = 'contra_physics_questions_v2';

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check if previous version existed
      const oldRaw = localStorage.getItem('contra_physics_questions_v1');
      if (oldRaw) {
        try {
          const oldList: Question[] = JSON.parse(oldRaw);
          // Merge any custom questions created by the user
          const defaultIds = new Set(DEFAULT_QUESTIONS.map(q => q.id));
          const userCustoms = oldList.filter(q => !defaultIds.has(q.id) && !q.id.startsWith('phy-') && !q.id.startsWith('math-') && !q.id.startsWith('eng-'));
          const merged = [...DEFAULT_QUESTIONS, ...userCustoms];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        } catch {
          // fall through
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUESTIONS));
      return DEFAULT_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load questions from localStorage', err);
  }
  return DEFAULT_QUESTIONS;
}

export function saveStoredQuestions(questions: Question[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions to localStorage', err);
  }
}
