export interface Student {
  stt: number;
  name: string;
  cls: string;
  situation: string;
}

export interface SchoolGroup {
  school: string;
  students: Student[];
}

// TỰ SINH — đừng sửa tay. Nguồn: "danh sach nhan hoc bong 2026.xlsx" (nhập ngày 30/7/2026).
// Cập nhật: node scripts/import-hoc-bong.mjs "<đường dẫn file .xlsx>"
// 85 suất học bổng / 14 trường.
export const HOC_BONG_DATA: SchoolGroup[] = [
  {
    school: 'THCS Nguyễn Công Trứ',
    students: [
      { stt: 1, name: 'Nguyễn Trần Ngọc Uyên', cls: '8/2', situation: 'Học lực :Xuất Sắc, Hạnh kiểm :Tốt, Ba mẹ li hôn, ở với ông bà nội.ông bà già yếu, ông phải chăm bà trên bệnh viện, em uyên bản thân mới bị viêm màng não.' },
      { stt: 2, name: 'Nguyễn Ngọc Thái Thiên Hà', cls: '8.5', situation: 'Bố mất, nhà có 3 chị em đang đi học, một mình mẹ đi làm công nhân nuôi 3 chị em. Học lực: Xuất sắc, Hạnh kiểm: Tốt.' },
      { stt: 3, name: 'Võ Minh Thư', cls: '8/2', situation: 'Học lực :khá , Hạnh kiểm :Tốt, Ba mẹ li hôn, ở Trọ với ông bà nội.ông bà già yếu.' },
      { stt: 4, name: 'Doãn Thị Hồng Ngọc', cls: '74', situation: 'Học lực: khá, Hạnh kiểm: Tốt, Ba mẹ li hôn, mẹ bỏ đi xa, ba đi làm xa, ở với ông bà nội.ông bà già yếu.' },
      { stt: 5, name: 'Nguyễn Ngọc Kim Ngân', cls: '83', situation: 'Học lực: Giỏi, Hạnh kiểm:Tốt. Nhà ở bằng gỗ cũ kĩ và chật hẹp, 4 chị em đang đi học, còn nhỏ. Điều kiện kinh tế còn khó khăn.' },
      { stt: 6, name: 'Trần Bình Phương', cls: '91', situation: 'Học lực: Giỏi, Hạnh kiểm: Tốt. Ba mẹ li hôn, nhà có 4 anh em đều đi học, mẹ làm công nhân, đang ở trọ.' },
      { stt: 7, name: 'Mai Bảo Thy', cls: '6.1', situation: 'Học lực giỏi, ba mẹ khuyết tật không có khả năng lao động, ở với bà.' },
      { stt: 8, name: 'Nguyễn Thị Thanh Phúc', cls: '9.3', situation: 'Học sinh xuất sắc, bị vẹo cột sống vô căn, nhà đông con, không có tiền phẫu thuật, mẹ sức khoẻ ko tốt, bố ko có việc làm.' },
    ],
  },
  {
    school: 'Tiểu học Nguyễn Khuyến',
    students: [
      { stt: 9, name: 'Lương Ngọc Thành', cls: '1A', situation: 'Bố mẹ ở trọ, mẹ bán vé số, bố công việc không ổn định. Em sức khỏe yếu nên hàng tháng phải đi bệnh viện để uống thuốc.' },
      { stt: 10, name: 'Đặng Huỳnh Khánh Vân', cls: '1B', situation: 'Bố mẹ bỏ nhau, hiện đang ở nhà thuê, mẹ mới sinh con thứ ba, làm nghề sửa quần áo nuôi 2 bé, bé lớn ở với bà nội.' },
      { stt: 11, name: 'Lại Nguyễn Hoàng Anh', cls: '2C', situation: 'Mồ côi mẹ, ở với bà ngoại đã già yếu.' },
      { stt: 12, name: 'Trần Ngọc Đạt', cls: '2D', situation: 'Ba mẹ li hôn, 1 mình ba đi làm công trình nuôi 3 anh em đi học. Công việc không ổn định, thu nhập thấp.' },
      { stt: 13, name: 'Nguyễn Khánh Bảo Ngân', cls: '3B', situation: 'Mẹ mất sớm, một mình ba nuôi 3 chị em.' },
      { stt: 14, name: 'Nguyễn Thị Thu Ngân', cls: '3A', situation: 'Ba mất sớm, ở với bà ngoại, mẹ làm công nhân, nuôi 3 chị em.' },
      { stt: 15, name: 'Trần Minh Nhật', cls: '4A', situation: 'Bố mẹ li hôn, sống với ông bà nội.' },
      { stt: 16, name: 'Lê Huỳnh Ngọc Anh', cls: '4C', situation: 'Hộ cận nghèo, bố không có việc làm ổn định.' },
    ],
  },
  {
    school: 'TH Nguyễn Tri Phương',
    students: [
      { stt: 17, name: 'Nguyễn Lê Bình An', cls: '1.2', situation: 'Học sinh tiêu biểu. Gia đình khó khăn, ở nhà thuê, mẹ đơn thân nuôi 2 con nhỏ, 1 bé bị bệnh ung thư máu, bé Bình An bị bệnh tim bẩm sinh nặng.' },
      { stt: 18, name: 'Trương Gia Hân', cls: '', situation: 'Nhà 4 chị e, mẹ bỏ đi, cha đi tù mới về , ở với ông bà nội đang ở đất thuê.' },
      { stt: 19, name: 'Trần Mạnh Hùng', cls: '3.4', situation: 'Bố mất sớm, mẹ nuôi 3 người con nhỏ, ở trọ.' },
      { stt: 20, name: 'Tô Nguyễn Khánh Ngọc', cls: '3.5', situation: 'Mẹ ở trọ nuôi 3 con nhỏ, bố bỏ đi.' },
      { stt: 21, name: 'Danh Minh Khang', cls: '4.4', situation: 'Gia đình khó khăn, ở nhà thuê, bố thất nghiệp, mẹ đi làm mướn, có em nhỏ bị bệnh mãn tính.' },
      { stt: 22, name: 'Nguyễn Lê Huy Hoàng', cls: '', situation: 'Mẹ mất, bố làm việc không ổn định, ở với bà đã già yếu.' },
      { stt: 23, name: 'Đặng Thiên Quốc', cls: '1.4', situation: 'Bố mẹ nuôi ông bà và ba con đi học; gia đình là hộ cận nghèo. Đạt danh hiệu học sinh Tiêu biểu.' },
    ],
  },
  {
    school: 'THCS Huỳnh Thúc Kháng',
    students: [
      { stt: 24, name: 'Nguyễn Thị Hương Thơm', cls: '8.1', situation: 'Học lực giỏi. Bố mất, mẹ đi làm nuôi 5 con đang tuổi ăn học, ở nhà thuê, công việc của mẹ không ổn định, bé nhỏ nhất 7 tuổi. Học lực giỏi.' },
      { stt: 25, name: 'Vương Huỳnh Thái An', cls: '7.1', situation: 'Gia đình khó khăn, mẹ là lao động chính, một mình nuôi con và chu cấp nuôi ông bà ngoại ở quê, công việc không ổn định.' },
      { stt: 26, name: 'Lầm Gia Khánh', cls: '6.5', situation: 'Bố mất, mẹ nuôi 2 con đang đi học, mẹ đi làm công ty và ở nhà trọ.' },
    ],
  },
  {
    school: 'MN Hoa Hồng',
    students: [
      { stt: 27, name: 'Phan Lê Phương Anh', cls: 'Chồi', situation: 'Gia đình khó khăn.' },
      { stt: 28, name: 'Thù Bảo Anh', cls: 'Lá', situation: 'Gia đình khó khăn.' },
    ],
  },
  {
    school: 'MN Hoa Anh Đào',
    students: [
      { stt: 29, name: 'Nguyễn Hữu Thiên Đức', cls: 'Chồi', situation: 'Hộ cận nghèo.' },
      { stt: 30, name: 'Nguyễn Hùng Cường', cls: 'Lá', situation: 'Hộ nghèo.' },
    ],
  },
  {
    school: 'MN Hoa Phượng',
    students: [
      { stt: 31, name: 'Hoàng Nguyễn Tâm An', cls: 'Chồi', situation: 'Gia đình khó khăn. Mẹ hay bị bệnh. Một mình bố đi làm nuôi cả gia đình.' },
      { stt: 32, name: 'Phan Ngọc Thành', cls: 'Lá', situation: 'Mẹ bị bệnh một mình nuôi 2 anh em, ở trọ.' },
      { stt: 33, name: 'Nguyễn Thảo Vy', cls: 'Lá', situation: 'Học sinh khuyết tật.' },
    ],
  },
  {
    school: 'THCS Nguyễn Thượng Hiền',
    students: [
      { stt: 34, name: 'Trần Minh Huy', cls: '', situation: 'Hộ cận nghèo. Bố bị liệt. Mẹ bán hotdog ở cổng trường nuôi 2 chị em ăn học.' },
      { stt: 35, name: 'Đỗ Hoàng Trọng Phú', cls: '', situation: 'gia đình khó khăn, ba mẹ công việc tự do, thất thường, bố đau ốm thường xuyêG.' },
      { stt: 36, name: 'Vy Đức Thạch', cls: '', situation: 'gia đình khó khăn, mô côi cha, ở trọ.' },
      { stt: 37, name: 'Bùi Bảo Trâm', cls: '', situation: 'Hoàn cảnh: cha mẹ li hôn, ở với ba , ở trọ. Ba đi làm tự do.' },
      { stt: 38, name: 'Võ Thái Tùng Sơn', cls: '', situation: 'Hoàn cảnh: Ba mẹ ly hôn, ở với bà từ nhỏ, bà tuổi già không có thu nhập.' },
      { stt: 39, name: 'Huỳnh Minh Phương', cls: '', situation: 'Hoàn cảnh: học sinh xuất sắc, ở với mẹ đơn thân việc làm không ổn định, gia đình khó khăn.' },
      { stt: 40, name: 'Nguyễn Văn Phú', cls: '', situation: 'Hoàn cảnh gd: nhà ở trọ, bố mẹ thì công việc thất thường ai thuê gì thì làm cái đó; bố mẹ thì nhiều bệnh hay ốm đau.' },
      { stt: 41, name: 'Huỳnh Thị Nhã Thư', cls: '', situation: 'ba mẹ li hôn, ở với ông bà nội, ông bà nội già yếu.' },
    ],
  },
  {
    school: 'TH Trần Quý Cáp',
    students: [
      { stt: 42, name: 'Trần Thuỷ Tiên', cls: '1D', situation: 'Học sinh Tiêu biểu, nhà đông con, bố mẹ đi làm xa, ở chung với ông bà.' },
      { stt: 43, name: 'Dương Khả Di', cls: '4A', situation: 'HSXS; Hoàn cảnh: Một mẹ một con, sống cùng bà ngoại luôn đau yếu, mẹ sức khỏe kém chỉ làm những công việc thủ công kiếm sống. Thu nhập chính dựa vào ông ngoại đã hơn 60 tuổi.' },
      { stt: 44, name: 'Trương Nguyễn Hoàng Thịnh', cls: '4C', situation: 'HSXS: Hoàn cảnh:Ba đang làm sơn nước công việc cũng không ổn định. Mẹ ở nhà nội trợ do cũng đau ốm thường xuyên, nhà đông con; 4 chị em đi học chị học lớp 9; 3 em lần lượt học lớp 7; lớp 4; lớp 3. hoàn cảnh bấp bênh khó khăn.' },
      { stt: 45, name: 'Nguyễn Hoài An Nhiên', cls: '3A', situation: 'Gia đình khó khăn, bố mẹ bỏ nhau từ nhỏ. Nhà ở trọ. Mẹ làm công nhân. Một mình mẹ nuôi hai anh em và bà ngoại lớn tuổi.' },
      { stt: 46, name: 'Nguyễn Thị Hồng Luyến', cls: '3B', situation: 'Hộ nghèo, mẹ công nhân, bố không có việc làm ổn định.' },
      { stt: 47, name: 'Nguyễn Ngọc Duy Phúc', cls: '1C', situation: 'Bố mẹ làm công nhân nhà 3 con đi học chưa có nhà ở.' },
      { stt: 48, name: 'Phạm Tuấn Khang', cls: '2B', situation: 'Bố không có việc làm,ở trọ, hoàn cảnh khó khăn.' },
      { stt: 49, name: 'Võ Phạm Trúc Linh', cls: '2D', situation: 'Bố mẹ làm công nhân, ở trọ , hoàn cảnh khó khăn.' },
    ],
  },
  {
    school: 'TH Nam Cao',
    students: [
      { stt: 50, name: 'Trần Nguyên Bảo Anh', cls: '1B', situation: 'Hoàn cảnh: cha mẹ li hôn, ở với mẹ và dượng , ở trọ. Mẹ không có việc làm đang nuôi con nhỏ. Học lực: Hoàn thành môn học .Toán 8 điểm ,tiếng việt : 8 điểm.' },
      { stt: 51, name: 'Nguyễn Thị Thảo Nguyên', cls: '1D', situation: 'Ba mất, mẹ bán hàng rong nuôi 5 anh em ăn học, ở trọ.' },
      { stt: 52, name: 'Nguyễn Thị Thuỳ Dương', cls: '2C', situation: 'Đạt HSXS; Hoàn cảnh: Bố mất, mẹ bán vé số, mình mẹ nuôi hai con đi học, đang ở trọ.' },
      { stt: 53, name: 'Nguyễn Ngọc An Nhiên', cls: '2B', situation: 'Đạt HSXS. Hoàn cảnh gia đình khó khăn đang ở trọ, ba mẹ công việc không ổn định, nhà có 3 con nhưng người con út chậm phát triển bị đao đã 4 tuổi nhưng chưa biết đi, chưa biết nói.' },
      { stt: 54, name: 'Trương Gia Kỳ', cls: '3A', situation: 'Bố mẹ làm công nhân, ở trọ , hoàn cảnh khó khăn , em là học sinh khuyết tật không đi lại được.' },
      { stt: 55, name: 'Võ Kim Ngọc', cls: '3B', situation: 'Đạt Học sinh Xuất sắc. Cha bỏ đi từ nhỏ, mình mẹ nuôi 2 con, ở trọ.' },
      { stt: 56, name: 'Nguyễn Thanh Trúc', cls: '4A', situation: 'Bố mất vì tai nạn, mẹ làm công ti tư nhân lương thấp, công việc không ổn định. Một bên tai của mẹ bị bệnh nghe không rõ. Ba mẹ con ở căn phòng nhỏ cùng ông bà nội. Ông bà nội tuổi cao, ông nội bị tai biến nặng. Hoàn cảnh gia đình khó khăn.' },
      { stt: 57, name: 'Nguyễn Khánh Ly', cls: '4D', situation: 'Học sinh xuất sắc, bố mẹ già 70 tuổi, bố bị áp xe phổi, viêm giác mạc, hai con nhỏ, mẹ đi lượm ve chai. Bố mẹ thường xuyên đau ốm.' },
    ],
  },
  {
    school: 'TH An Bình',
    students: [
      { stt: 58, name: 'Mai Đức Thịnh', cls: '1.2', situation: 'Học sinh Tiêu biểu. Bố mẹ câm điếc, hai chị em ở với bà ngoại.' },
      { stt: 59, name: 'Phạm Nguyễn Thành Danh', cls: '1.5', situation: 'Học sinh Tiêu biểu. Bố mẹ bỏ rơi, ở với ông bà đã lớn tuổi.' },
      { stt: 60, name: 'Vũ Ngọc Vân Anh', cls: '2.2', situation: 'Học sinh xuất sắc. Gia đình khó khăn, nhà ở chưa ổn định, nhà đông anh chị em.' },
      { stt: 61, name: 'Trương Tấn Dũng', cls: '2.5', situation: 'Học sinh Tiêu biểu .Cha bị bại liệt, nằm một chỗ. Mẹ là lao động chính, chưa có nhà ở.' },
      { stt: 62, name: 'Đặng Phương Thảo', cls: '3.3', situation: 'Học sinh Tiêu biểu. Bố mẹ ly hôn, ở với ông bà.' },
      { stt: 63, name: 'Nguyễn Thiên Duyên', cls: '3.3', situation: 'Học sinh xuất sắc. Nhà đông con, đang ở trọ.' },
      { stt: 64, name: 'Ngô Thiện Nhân', cls: '4.4', situation: 'Học sinh Tiêu biểu. Mẹ bị bệnh hiểm nghèo, bố công việc không ổn định, nhà đông con.' },
      { stt: 65, name: 'Lê Vũ Hoài Thương', cls: '4.5', situation: 'Học sinh xuất sắc. Mẹ đơn thân nuôi 2 con, ở nhờ nhà ngoại.' },
    ],
  },
  {
    school: 'TH Nguyễn Trãi',
    students: [
      { stt: 66, name: 'Huỳnh Ngọc Anh Thư', cls: '2A1', situation: 'Gia đình khó khăn, ba có công việc không ổn định, đông con, mẹ bị tật ở tay thu nhập bấp bênh, học sinh tiêu biểu.' },
      { stt: 67, name: 'Lê Thanh Hằng', cls: '2A3', situation: 'Gia đình khó khăn, đông con (4 con), hộ nghèo.' },
      { stt: 68, name: 'Nguyễn Trần Thảo Vy', cls: '3A1', situation: 'Bố mất, nhà 2 chị em, mẹ công việc không ổn định.' },
      { stt: 69, name: 'Nguyễn Liêu Gia Nghi', cls: '3B1', situation: 'Mẹ mất, ba đi tù về, công việc đang không ổn định, ở ké nhà chú bỏ hoang.' },
      { stt: 70, name: 'Nguyễn Hoàng Nhã An', cls: '4B1', situation: 'Ba mẹ ly hôn, ở với ba, ba công việc không ổn định, nhà có 7 anh chị em, gia đình thuộc hộ cận nghèo.' },
    ],
  },
  {
    school: 'Song Thạch',
    students: [
      { stt: 71, name: 'Đỗ Thành Đạt', cls: '7', situation: 'Gia đình khó khăn, ở nhà trọ, cộng thêm trong quá trình làm ăn bị thua lỗ.' },
      { stt: 72, name: 'Phan Đình Phong', cls: '3', situation: 'Ba mẹ li hôn, ba bị bệnh tâm thần, em ở với ông bà nội.' },
      { stt: 73, name: 'Phạm Quốc Huy', cls: '6', situation: 'Ba mẹ li hôn, em sống với ba ngoại.' },
      { stt: 74, name: 'Nguyễn Hoàng Minh Ngọc', cls: '7', situation: 'Ba mẹ li hôn, em ở với ông bà ngoại.' },
      { stt: 75, name: 'Võ Ngọc Bảo An', cls: 'Lá', situation: 'Hoàn cảnh gia đình em khó khăn, ba mẹ li hôn, một mình mẹ lo cho gia đình, ba mẹ con ở nhà trọ.' },
      { stt: 76, name: 'Trương Gia Hân', cls: '', situation: 'Ba mẹ li hôn em ở với bà nội, hoàn cảnh gia đình bà khó khăn, hằng ngày bà bán rau để lo cho gia đình.' },
      { stt: 77, name: 'Vũ Hoàng Nhân Eban', cls: '1', situation: 'Em đặt học sinh xuất sắc - Gia đình khó khăn, nhưng ba mẹ vẫn cố gắng cho con được đến trường.' },
    ],
  },
  {
    school: 'THCS Phan Chu Trinh',
    students: [
      { stt: 78, name: 'Hồ Phan Gia Bảo', cls: '6.6', situation: 'Học lực: Khá, Hạnh kiểm: Tốt. Bố mẹ bỏ đi từ nhỏ; em ở với ông bà ngoại (cận nghèo).' },
      { stt: 79, name: 'Nguyễn Hà Phương Hạ', cls: '7.1', situation: 'Học lực: Giỏi, Hạnh kiểm: Tốt. Mồ côi cha mẹ; ở với bà, bà đang bị bệnh (mới phát hiện 2 khối u).' },
      { stt: 80, name: 'Thái Phan Thảo My', cls: '7.2', situation: 'Học lực: Tốt (đạt HSG), Hạnh kiểm: Tốt. Ba, mẹ bán vé số (thuộc hộ nghèo).' },
      { stt: 81, name: 'Trần Hồng Trân', cls: '7.4', situation: 'Học lực: Tốt (đạt HSG), Hạnh kiểm: Tốt. Ba mất; mẹ làm công nuôi 4 chị em ăn học (hộ nghèo).' },
      { stt: 82, name: 'Chế Thị Lan Nhi', cls: '8.1', situation: 'Không có cha; nhà nghèo, một mình mẹ nuôi 3 con ăn học.' },
      { stt: 83, name: 'Huỳnh Tấn Đạt', cls: '8.1', situation: 'Ba mất; mẹ bỏ rơi, ở với ngoại đã già yếu.' },
      { stt: 84, name: 'Nguyễn Hoàng Phương Thảo', cls: '8.1', situation: 'Học lực: Khá, Hạnh kiểm: Tốt. Ba mất; không có nhà, ở trọ; mẹ nuôi 3 con.' },
      { stt: 85, name: 'Trương Khánh Băng', cls: '8.6', situation: 'Nhà nghèo (xã chứng nhận); một mình mẹ nuôi 4 anh em đi học.' },
    ],
  },
];
