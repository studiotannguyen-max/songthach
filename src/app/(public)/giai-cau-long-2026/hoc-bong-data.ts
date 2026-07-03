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

export const HOC_BONG_DATA: SchoolGroup[] = [
  {
    school: 'THCS Nguyễn Công Trứ',
    students: [
      { stt: 1, name: 'Nguyễn Trần Ngọc Uyên', cls: '8/2', situation: 'Học lực :Xuất Sắc, Hạnh kiểm :Tốt, Ba mẹ li hôn, ở với ông bà nội.ông bà già yếu, ông phải chăm bà trên bệnh viện, em uyên bản thân mới bị viêm màng não.' },
      { stt: 2, name: 'Nguyễn Ngọc Thái Thiên Hà', cls: '8.5', situation: 'Bố mất, nhà có 3 chị em đang đi học, một mình mẹ đi làm công nhân nuôi 3 chị em. Học lực: Xuất sắc, Hạnh kiểm: Tốt' },
      { stt: 3, name: 'Võ Minh Thư', cls: '8/2', situation: 'Học lực :khá , Hạnh kiểm :Tốt, Ba mẹ li hôn, ở Trọ với ông bà nội.ông bà già yếu' },
      { stt: 4, name: 'Doãn Thị Hồng Ngọc', cls: '74', situation: 'Học lực: khá, Hạnh kiểm: Tốt, Ba mẹ li hôn, mẹ bỏ đi xa, ba đi làm xa, ở với ông bà nội.ông bà già yếu' },
      { stt: 5, name: 'Nguyễn Ngọc Kim Ngân', cls: '83', situation: 'Học lực: Giỏi, Hạnh kiểm:Tốt. Nhà ở bằng gỗ cũ kĩ và chật hẹp, 4 chị em đang đi học, còn nhỏ. Điều kiện kinh tế còn khó khăn.' },
      { stt: 6, name: 'Trần Bình Phương', cls: '91', situation: 'Học lực: Giỏi, Hạnh kiểm: Tốt. Ba mẹ li hôn, nhà có 4 anh em đều đi học, mẹ làm công nhân, đang ở trọ' },
      { stt: 7, name: 'Mai Bảo Thy', cls: '6.1', situation: 'Học lực giỏi, ba mẹ khuyết tật không có khả năng lao động, ở với bà' },
      { stt: 8, name: 'Nguyễn Thị Thanh Phúc', cls: '9.3', situation: 'Học sinh xuất sắc, bị vẹo cột sống vô căn, nhà đông con, không có tiền phẫu thuật, mẹ sức khoẻ ko tốt, bố ko có việc làm' },
    ],
  },
  {
    school: 'Tiểu học Nguyễn Khuyến',
    students: [
      { stt: 9, name: 'Lương Ngọc Thành', cls: '1A', situation: 'Bố mẹ ở trọ, mẹ bán vé số, bố công việc không ổn định. Em sức khỏe yếu nên hàng tháng phải đi bệnh viện để uống thuốc' },
      { stt: 10, name: 'Đặng Huỳnh Khánh Vân', cls: '1B', situation: 'Bố mẹ bỏ nhau, hiện đang ở nhà thuê, mẹ mới sinh con thứ ba, làm nghề sửa quần áo nuôi 2 bé, bé lớn ở với bà nội' },
      { stt: 11, name: 'Lại Nguyễn Hoàng Anh', cls: '2C', situation: 'Mồ côi mẹ, ở với bà ngoại đã già yếu.' },
      { stt: 12, name: 'Trần Ngọc Đạt', cls: '2D', situation: 'Ba mẹ li hôn, 1 mình ba đi làm công trình nuôi 3 anh em đi học. Công việc không ổn định, thu nhập thấp' },
      { stt: 13, name: 'Nguyễn Khánh Bảo Ngân', cls: '3B', situation: 'Mẹ mất sớm, một mình ba nuôi 3 chị em.' },
      { stt: 14, name: 'Nguyễn Thị Thu Ngân', cls: '3A', situation: 'Ba mất sớm, ở với bà ngoại, mẹ làm công nhân, nuôi 3 chị em' },
      { stt: 15, name: 'Trần Minh Nhật', cls: '4A', situation: 'Bố mẹ li hôn, sống với ông bà nội' },
      { stt: 16, name: 'Lê Huỳnh Ngọc Anh', cls: '4C', situation: 'Hộ cận nghèo, bố không có việc làm ổn định' },
    ],
  },
  {
    school: 'TH Nguyễn Tri Phương',
    students: [
      { stt: 17, name: 'Nguyễn Lê Bình An', cls: 'Lớp 1.2', situation: 'Học sinh tiêu biểu. Gia đình khó khăn, ở nhà thuê, mẹ đơn thân nuôi 2 con nhỏ, 1 bé bị bệnh ung thư máu, bé Bình An bị bệnh tim bẩm sinh nặng.' },
      { stt: 18, name: 'Trương Gia Hân', cls: 'Lớp', situation: 'Nhà 4 chị e, mẹ bỏ đi, cha đi tù mới về , ở với ông bà nội đang ở đất thuê.' },
      { stt: 19, name: 'Đặng Phương Linh', cls: 'Lớp 2.6', situation: 'Hộ nghèo' },
      { stt: 20, name: 'Trần Mạnh Hùng', cls: 'Lớp 3.4', situation: 'Bố mất sớm, mẹ nuôi 3 người con nhỏ, ở trọ' },
      { stt: 21, name: 'Tô Nguyễn Khánh Ngọc', cls: 'Lớp 3.5', situation: 'Mẹ ở trọ nuôi 3 con nhỏ, bố bỏ đi' },
      { stt: 22, name: 'Danh Minh Khang', cls: 'Lớp 4.4', situation: 'Gia đình khó khăn, ở nhà thuê, bố thất nghiệp, mẹ đi làm mướn, có em nhỏ bị bệnh mãn tính.' },
      { stt: 23, name: 'Nguyễn Lê Huy Hoàng', cls: '', situation: 'Mẹ mất, bố làm việc không ổn định, ở với bà đã già yếu.' },
      { stt: 24, name: 'Đặng Thiên Quốc', cls: '1.4', situation: 'Bố mẹ nuôi ông bà và ba con đi học; gia đình là hộ cận nghèo. Đạt danh hiệu học sinh Tiêu biểu' },
    ],
  },
  {
    school: 'THCS Huỳnh Thúc Kháng',
    students: [
      { stt: 25, name: 'Nguyễn Thị Hương Thơm', cls: 'Lớp 8.1', situation: 'Học lực giỏi. Bố mất, mẹ đi làm nuôi 5 con đang tuổi ăn học, ở nhà thuê, công việc của mẹ không ổn định, bé nhỏ nhất 7 tuổi. Học lực giỏi.' },
      { stt: 26, name: 'Vương Huỳnh Thái An', cls: 'Lớp 7.1', situation: 'Gia đình khó khăn, mẹ là lao động chính, một mình nuôi con và chu cấp nuôi ông bà ngoại ở quê, công việc không ổn định' },
      { stt: 27, name: 'Lầm Gia Khánh', cls: 'Lớp 6.5', situation: 'Bố mất, mẹ nuôi 2 con đang đi học, mẹ đi làm công ty và ở nhà trọ' },
    ],
  },
  {
    school: 'MN Hoa Hồng',
    students: [
      { stt: 28, name: 'Mai Quốc Thiên', cls: 'Mầm', situation: 'Gia đình khó khăn' },
      { stt: 29, name: 'Phan Lê Phương Anh', cls: 'Chồi', situation: 'Gia đình khó khăn' },
      { stt: 30, name: 'Thù Bảo Anh', cls: 'Lá', situation: 'Gia đình khó khăn' },
    ],
  },
  {
    school: 'MN Hoa Anh Đào',
    students: [
      { stt: 31, name: 'Nguyễn Hữu Thiên Đức', cls: 'Chồi', situation: 'Hộ cận nghèo' },
      { stt: 32, name: 'Nguyễn Hùng Cường', cls: 'Lá', situation: 'Hộ nghèo' },
    ],
  },
  {
    school: 'MN Hoa Phượng',
    students: [
      { stt: 33, name: 'Hoàng Nguyễn Tâm An', cls: 'Chồi', situation: 'Gia đình khó khăn. Mẹ hay bị bệnh. Một mình bố đi làm nuôi cả gia đình' },
      { stt: 34, name: 'Phan Ngọc Thành', cls: 'Lá', situation: 'Mẹ bị bệnh một mình nuôi 2 anh em, ở trọ' },
      { stt: 35, name: 'Nguyễn Thảo Vy', cls: 'Lá', situation: 'Học sinh khuyết tật' },
    ],
  },
  {
    school: 'THCS Nguyễn Thượng Hiền',
    students: [
      { stt: 36, name: 'Trần Minh Huy', cls: 'Nguyễn', situation: 'Hộ cận nghèo. Bố bị liệt. Mẹ bán hotdog ở cổng trường nuôi 2 chị em ăn học' },
      { stt: 37, name: 'Đỗ Hoàng Trọng Phú', cls: 'Nguyễn', situation: 'gia đình khó khăn, ba mẹ công việc tự do, thất thường, bố đau ốm thường xuyêG' },
      { stt: 38, name: 'Vy Đức Thạch', cls: 'Nguyễn', situation: 'gia đình khó khăn, mô côi cha, ở trọ' },
      { stt: 39, name: 'Bùi Bảo Trâm', cls: 'Nguyễn', situation: 'Hoàn cảnh: cha mẹ li hôn, ở với ba , ở trọ. Ba đi làm tự do' },
      { stt: 40, name: 'Võ Thái Tùng Sơn', cls: '', situation: 'Hoàn cảnh: Ba mẹ ly hôn, ở với bà từ nhỏ, bà tuổi già không có thu nhập' },
      { stt: 41, name: 'Huỳnh Minh Phương', cls: 'Nguyễn', situation: 'Hoàn cảnh: học sinh xuất sắc, ở với mẹ đơn thân việc làm không ổn định, gia đình khó khăn' },
      { stt: 42, name: 'Nguyễn Văn Phú', cls: 'Nguyễn', situation: 'Hoàn cảnh gd: nhà ở trọ, bố mẹ thì công việc thất thường ai thuê gì thì làm cái đó; bố mẹ thì nhiều bệnh hay ốm đau.' },
      { stt: 43, name: 'Huỳnh Thị Nhã Thư', cls: 'Nguyễn', situation: 'ba mẹ li hôn, ở với ông bà nội, ông bà nội già yếu' },
    ],
  },
  {
    school: 'TH Trần Quý Cáp',
    students: [
      { stt: 44, name: 'Trần Thuỷ Tiên', cls: '1D', situation: 'Học sinh Tiêu biểu, nhà đông con, bố mẹ đi làm xa, ở chung với ông bà.' },
      { stt: 45, name: 'Dương Khả Di', cls: '4A', situation: 'HSXS; Hoàn cảnh: Một mẹ một con, sống cùng bà ngoại luôn đau yếu, mẹ sức khỏe kém chỉ làm những công việc thủ công kiếm sống. Thu nhập chính dựa vào ông ngoại đã hơn 60 tuổi.' },
      { stt: 46, name: 'Trương Nguyễn Hoàng Thịnh', cls: '4C', situation: 'HSXS: Hoàn cảnh:Ba đang làm sơn nước công việc cũng không ổn định. Mẹ ở nhà nội trợ do cũng đau ốm thường xuyên, nhà đông con; 4 chị em đi học chị học lớp 9; 3 em lần lượt học lớp 7; lớp 4; lớp 3. hoàn cảnh bấp bênh khó khăn.' },
      { stt: 47, name: 'Nguyễn Hoài An Nhiên', cls: '3A', situation: 'Gia đình khó khăn, bố mẹ bỏ nhau từ nhỏ. Nhà ở trọ. Mẹ làm công nhân. Một mình mẹ nuôi hai anh em và bà ngoại lớn tuổi.' },
      { stt: 48, name: 'Nguyễn Thị Hồng Luyến', cls: '3B', situation: 'Hộ nghèo, mẹ công nhân, bố không có việc làm ổn định' },
      { stt: 49, name: 'Nguyễn Ngọc Duy Phúc', cls: '1C', situation: 'Bố mẹ làm công nhân nhà 3 con đi học chưa có nhà ở' },
      { stt: 50, name: 'Phạm Tuấn Khang', cls: '2B', situation: 'Bố không có việc làm,ở trọ, hoàn cảnh khó khăn' },
      { stt: 51, name: 'Võ Phạm Trúc Linh', cls: '2D', situation: 'Bố mẹ làm công nhân, ở trọ , hoàn cảnh khó khăn' },
    ],
  },
  {
    school: 'TH Nam Cao',
    students: [
      { stt: 52, name: 'Trần Nguyên Bảo Anh', cls: '1B', situation: 'Hoàn cảnh: cha mẹ li hôn, ở với mẹ và dượng , ở trọ. Mẹ không có việc làm đang nuôi con nhỏ. Học lực: Hoàn thành môn học .Toán 8 điểm ,tiếng việt : 8 điểm' },
      { stt: 53, name: 'Nguyễn Thị Thảo Nguyên', cls: '1D', situation: 'Ba mất, mẹ bán hàng rong nuôi 5 anh em ăn học, ở trọ.' },
      { stt: 54, name: 'Nguyễn Thị Thuỳ Dương', cls: '2C', situation: 'Đạt HSXS; Hoàn cảnh: Bố mất, mẹ bán vé số, mình mẹ nuôi hai con đi học, đang ở trọ.' },
      { stt: 55, name: 'Nguyễn Ngọc An Nhiên', cls: '2B', situation: 'Đạt HSXS. Hoàn cảnh gia đình khó khăn đang ở trọ, ba mẹ công việc không ổn định, nhà có 3 con nhưng người con út chậm phát triển bị đao đã 4 tuổi nhưng chưa biết đi, chưa biết nói.' },
      { stt: 56, name: 'Trương Gia Kỳ', cls: '3A', situation: 'Bố mẹ làm công nhân, ở trọ , hoàn cảnh khó khăn , em là học sinh khuyết tật không đi lại được' },
      { stt: 57, name: 'Võ Kim Ngọc', cls: '3B', situation: 'Đạt Học sinh Xuất sắc. Cha bỏ đi từ nhỏ, mình mẹ nuôi 2 con, ở trọ' },
      { stt: 58, name: 'Nguyễn Thanh Trúc', cls: '4A', situation: 'Bố mất vì tai nạn, mẹ làm công ti tư nhân lương thấp, công việc không ổn định. Một bên tai của mẹ bị bệnh nghe không rõ. Ba mẹ con ở căn phòng nhỏ cùng ông bà nội. Ông bà nội tuổi cao, ông nội bị tai biến nặng. Hoàn cảnh gia đình khó khăn.' },
      { stt: 59, name: 'Nguyễn Khánh Ly', cls: '4D', situation: 'Học sinh xuất sắc, bố mẹ già 70 tuổi, bố bị áp xe phổi, viêm giác mạc, hai con nhỏ, mẹ đi lượm ve chai. Bố mẹ thường xuyên đau ốm.' },
    ],
  },
  {
    school: 'TH An Bình',
    students: [
      { stt: 60, name: 'Mai Đức Thịnh', cls: 'Lớp 1.2', situation: 'Học sinh Tiêu biểu. Bố mẹ câm điếc, hai chị em ở với bà ngoại' },
      { stt: 61, name: 'Phạm Nguyễn Thành Danh', cls: 'Lớp 1.5', situation: 'Học sinh Tiêu biểu. Bố mẹ bỏ rơi, ở với ông bà đã lớn tuổi' },
      { stt: 62, name: 'Vũ Ngọc Vân Anh', cls: 'Lớp 2.2', situation: 'Học sinh xuất sắc. Gia đình khó khăn, nhà ở chưa ổn định, nhà đông anh chị em.' },
      { stt: 63, name: 'Trương Tấn Dũng', cls: 'Lớp 2.5', situation: 'Học sinh Tiêu biểu .Cha bị bại liệt, nằm một chỗ. Mẹ là lao động chính, chưa có nhà ở.' },
      { stt: 64, name: 'Đặng Phương Thảo', cls: 'Lớp 3.3', situation: 'Học sinh Tiêu biểu. Bố mẹ ly hôn, ở với ông bà' },
      { stt: 65, name: 'Nguyễn Thiên Duyên', cls: 'Lớp 3.3', situation: 'Học sinh xuất sắc. Nhà đông con, đang ở trọ' },
      { stt: 66, name: 'Ngô Thiện Nhân', cls: 'Lớp 4.4', situation: 'Học sinh Tiêu biểu. Mẹ bị bệnh hiểm nghèo, bố công việc không ổn định, nhà đông con' },
      { stt: 67, name: 'Lê Vũ Hoài Thương', cls: 'Lớp 4.5', situation: 'Học sinh xuất sắc. Mẹ đơn thân nuôi 2 con, ở nhờ nhà ngoại' },
    ],
  },
  {
    school: 'Song Thạch',
    students: [
      { stt: 68, name: 'Trần Minh Trí', cls: 'Lớp Lá', situation: 'Gia đình khó khăn' },
      { stt: 69, name: 'Nguyễn Thành Thiện', cls: 'Lớp 2', situation: 'Gia đình khó khăn' },
      { stt: 70, name: 'Nguyễn Thành Danh', cls: 'Lớp Lá', situation: 'Gia đình khó khăn, ba mẹ ở nhà trọ' },
      { stt: 71, name: 'Vũ Trương Vũ Ngọc', cls: 'Lớp Lá', situation: 'Gia đình khó khăn' },
      { stt: 72, name: 'Vũ Ngọc Hà Trang', cls: 'Lớp Chồi-', situation: 'Gia đình khó khăn, ba mẹ ở nhà trọ' },
      { stt: 73, name: 'Đỗ Thành Đạt', cls: 'Lớp 7', situation: 'Gia đình khó khăn, ở nhà trọ, cộng thêm trong quá trình làm ăn bị thua lỗ.' },
      { stt: 74, name: 'Phan Đình Phong', cls: 'Lớp 3', situation: 'Ba mẹ li hôn, ba bị bệnh tâm thần, em ở với ông bà nội' },
      { stt: 75, name: 'Phạm Quốc Huy', cls: 'Lớp 6', situation: 'Ba mẹ li hôn, em sống với ba ngoại' },
      { stt: 76, name: 'Trần Anh Tuấn', cls: 'Lớp 2', situation: 'Gia đình khó khăn' },
      { stt: 77, name: 'Nguyễn Hoàng Minh Ngọc', cls: 'Lớp 7-', situation: 'Ba mẹ li hôn, em ở với ông bà ngoại' },
      { stt: 78, name: 'Trần Thiện Nhân', cls: 'Lớp 7', situation: 'Gia đình khó khăn' },
      { stt: 79, name: 'Võ Ngọc Bảo An', cls: 'Lớp Lá', situation: 'Hoàn cảnh gia đình em khó khăn, ba mẹ li hôn, một mình mẹ lo cho gia đình, ba mẹ con ở nhà trọ' },
      { stt: 80, name: 'Trương Gia Hân', cls: 'Lớp', situation: 'Ba mẹ li hôn em ở với bà nội, hoàn cảnh gia đình bà khó khăn, hằng ngày bà bán rau để lo cho gia đình' },
      { stt: 81, name: 'Trần Ngọc Tú Uyên', cls: 'Lớp Lá', situation: 'Ba mẹ li hôn em ở với bà ngoại, hoàn cảnh gia đình khó khăn.' },
      { stt: 82, name: 'Vũ Hoàng Nhân Eban', cls: 'Lớp 1', situation: 'Em đặt học sinh xuất sắc - Gia đình khó khăn, nhưng ba mẹ vẫn cố gắng cho con được đến trường.' },
    ],
  },
];

