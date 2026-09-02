/**
 * Multi-Source & Bilingual RAG (Retrieval-Augmented Generation) Engine
 * for Smart Parents AI on EdgeOne Makers.
 *
 * Supports parenting knowledge from:
 * 1. "Parenting: Rahasia Membentuk Karakter Anak" (2023) - 12 Chapters (ID)
 * 2. "Positive Discipline & Emotion Coaching" (Dr. Jane Nelsen / Dr. John Gottman) (EN)
 * 3. "The Whole-Brain Child Framework" (Dr. Daniel J. Siegel & Dr. Tina Payne Bryson) (EN)
 * 4. "AAP Pediatric Guidelines on Digital Wellness" (American Academy of Pediatrics) (EN/ID)
 *
 * Designed to be modular and easily extensible with additional PDF sources.
 */

export interface ParentingSource {
  id: string;
  title: string;
  author: string;
  year: number;
  language: 'id' | 'en';
  description: string;
  category: string;
  chaptersCount: number;
}

export interface RagKnowledgeChunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  language: 'id' | 'en';
  chapterNumber?: number;
  chapterTitle: string;
  topic: string;
  keywords: string[];
  ageGroup: string;
  coreConcept: string;
  practicalGuidelines: string[];
  recommendedPhrases: string[];
  phrasesToAvoid: string[];
  citation: string;
}

export const PARENTING_SOURCES: ParentingSource[] = [
  {
    id: 'buku-parenting-karakter-2023',
    title: 'Parenting: Rahasia Membentuk Karakter Anak',
    author: 'Maria Nona Nancy, Sitti Anggraini, Vonny Syafira Hariyanto, Revisndari Widyatiningtyas, Handini Hardianti, Syarifah Zainab, Jefri Setyawan, Florencia Nei, Yuli Rahmawati, Dewi Masithoh, Hanim Nuril Rahmatul Alifia, Amilda Putri Akbari',
    year: 2023,
    language: 'id',
    description: 'Buku komprehensif 12 bab mengenai pembentukan karakter anak, tantrum, era digital, peran ayah, kesiapan mental ibu, dan komunikasi efektif.',
    category: 'Pendidikan Karakter & Pola Asuh Nasional',
    chaptersCount: 12,
  },
  {
    id: 'positive-discipline-emotion-coaching',
    title: 'Positive Discipline & Emotion Coaching Framework',
    author: 'Dr. Jane Nelsen & Dr. John Gottman',
    year: 2021,
    language: 'en',
    description: 'Evidence-based positive discipline, emotional coaching, connection before correction, and mutual respect between parents and children.',
    category: 'Global Emotional Development',
    chaptersCount: 5,
  },
  {
    id: 'whole-brain-child-framework',
    title: 'The Whole-Brain Child: 12 Revolutionary Strategies',
    author: 'Dr. Daniel J. Siegel & Dr. Tina Payne Bryson',
    year: 2020,
    language: 'en',
    description: 'Neuroscience-based strategies to nurture developing minds, handle meltdowns, and integrate upstairs-downstairs brain functions.',
    category: 'Child Neurobiology & Psychology',
    chaptersCount: 6,
  },
  {
    id: 'aap-digital-wellness-guidelines',
    title: 'AAP Clinical Report: Children, Adolescents, and Digital Media',
    author: 'American Academy of Pediatrics (AAP)',
    year: 2023,
    language: 'en',
    description: 'Pediatric guidelines on age-appropriate screen time, digital boundaries, sleep hygiene, and family media use plans.',
    category: 'Pediatric Health & Digital Wellness',
    chaptersCount: 4,
  },
];

export const RAG_KNOWLEDGE_BASE: RagKnowledgeChunk[] = [
  // --- BAB 1 ---
  {
    id: 'rag-id-bab-1-konsep-dasar',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 1,
    chapterTitle: 'Bab 1: Konsep Dasar Parenting & Co-Parenting',
    topic: 'Pola Asuh & Kerjasama Orang Tua',
    keywords: ['gaya pengasuhan', 'pola asuh', 'co-parenting', 'demokratis', 'otoritatif', 'otoriter', 'permisif', 'pengabaian', 'kerjasama suami istri'],
    ageGroup: 'Semua Usia (0-18 tahun)',
    coreConcept: 'Parenting adalah proses interaksi berkelanjutan antara orang tua dan anak yang meliputi aktivitas merawat, mendidik, dan mengarahkan. Pola asuh demokratis (otoritatif) terbukti paling efektif menghasilkan anak mandiri, bertanggung jawab, dan memiliki regulasi emosi sehat. Co-parenting menuntut keselarasan nilai dan konsistensi aturan antara ayah dan ibu tanpa saling menjatuhkan di depan anak.',
    practicalGuidelines: [
      'Terapkan batasan yang jelas namun selalu diimbangi dengan kehangatan dan penjelasan rasional (firm yet kind).',
      'Hindari berdebat atau membatalkan keputusan pasangan di depan anak; diskusikan perbedaan pandangan saat berdua.',
      'Dengarkan sudut pandang anak sebelum menetapkan sanksi konsekuensi logis.',
      'Libatkan anak dalam pembuatan aturan keluarga agar mereka merasa dihargai dan bertanggung jawab.',
    ],
    recommendedPhrases: [
      '"Ayah dan Ibu sudah sepakat, setelah membereskan mainan kita bisa lanjut membaca cerita."',
      '"Ibu paham kamu ingin lanjut bermain, tapi waktu istirahat sudah tiba. Mari kita simpan mainanmu bersama."',
    ],
    phrasesToAvoid: [
      '"Terserah kamu saja, Ibu sudah capek."',
      '"Jangan dengarkan Ayahmu, dia terlalu galak."',
      '"Pokoknya turuti kata Ibu tanpa banyak tanya!"',
    ],
    citation: 'Bab 1: Konsep Dasar Parenting, hlm. 1-9 (Nancy dkk., 2023)',
  },

  // --- BAB 2 ---
  {
    id: 'rag-id-bab-2-toxic-parents',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 2,
    chapterTitle: 'Bab 2: Toxic Parents: Kesalahan yang Sering Dilakukan Orang Tua',
    topic: 'Toxic Parenting & Kesehatan Mental Anak',
    keywords: ['toxic parent', 'kesalahan orang tua', 'membandingkan anak', 'guilt trip', 'gaslighting', 'tuntutan berlebih', 'trauma masa kecil', 'kesehatan mental'],
    ageGroup: 'Semua Usia (Balita hingga Remaja)',
    coreConcept: 'Toxic parents adalah pola pengasuhan disfungsional yang berulang kali meremehkan emosi anak, membanding-bandingkan, menuntut kesempurnaan demi ego orang tua, atau menggunakan manipulasi emosi (guilt trip). Dampaknya memicu self-esteem rendah, kecemasan kronis, depresi, dan hilangnya rasa percaya diri pada anak.',
    practicalGuidelines: [
      'Hentikan membandingkan anak dengan saudara atau anak orang lain; setiap anak memiliki tempo dan keunikan pertumbuhan masing-masing.',
      'Jangan gunakan rasa bersalah (guilt trip) untuk memaksa anak menuruti kemauan orang tua.',
      'Akui kesalahan dan minta maaf secara tulus kepada anak jika orang tua berbuat keliru atau bereaksi berlebihan.',
      'Pisahkan antara perilaku yang salah dengan nilai diri anak (kritik perilakunya, bukan pribadinya).',
    ],
    recommendedPhrases: [
      '"Maafkan Ibu tadi sempat berbicara dengan nada tinggi karena lelah. Ibu salah dan akan belajar lebih tenang."',
      '"Ibu bangga dengan usahamu hari ini, kamu sudah berjuang lebih baik dari kemarin."',
    ],
    phrasesToAvoid: [
      '"Lihat tuh anak tetangga, nilainya selalu bagus tidak seperti kamu."',
      '"Ibu sudah berkorban mati-matian, kenapa kamu bikin kecewa terus?"',
      '"Kamu ini anak nakal dan tidak tahu diuntung!"',
    ],
    citation: 'Bab 2: Toxic Parents: Kesalahan yang Sering Dilakukan Orang Tua, hlm. 10-19 (Nancy dkk., 2023)',
  },

  // --- BAB 3 & 12 ---
  {
    id: 'rag-id-bab-3-12-era-digital-gadget',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 3,
    chapterTitle: 'Bab 3 & 12: Parenting di Era Digital & Manajemen Screen Time',
    topic: 'Gadget, Game Online & Screen Time',
    keywords: ['era digital', 'gadget', 'screen time', 'kecanduan game', 'game online', 'hp', 'smartphone', 'internet', 'asa asuh', 'kontrak gawai'],
    ageGroup: 'Balita (2-6 tahun), Usia Sekolah (7-12 tahun), Remaja (13-18 tahun)',
    coreConcept: 'Gadget bukan pengganti pengasuh (digital babysitter). Di era digital, orang tua harus menerapkan prinsip "Asa-Asuh": mendampingi konten, membatasi durasi berdasarkan usia, serta menyediakan stimulasi motorik dan sosial di dunia nyata. Kecanduan game online dapat dihindari melalui kesepakatan tertulis (kontrak gawai) dan keteladanan orang tua dalam membatasi penggunaan HP sendiri.',
    practicalGuidelines: [
      'Anak di bawah 2 tahun: Nol screen time kecuali video call keluarga.',
      'Anak 2-5 tahun: Maksimal 1 jam per hari dengan konten edukatif berkualitas dan didampingi orang tua.',
      'Terapkan "Zona Bebas Layar" di meja makan dan kamar tidur saat jam tidur malam.',
      'Beri peringatan 5-10 menit sebelum waktu screen time berakhir agar anak siap transisi.',
      'Sediakan alternatif hobi fisik: bersepeda, menggambar, bermain balok, membaca buku cerita bersama.',
    ],
    recommendedPhrases: [
      '"Sisa waktu bermain HP 5 menit lagi ya. Setelah alarm berbunyi, kita taruh HP di meja dan bersiap mandi."',
      '"Yuk kita buat kesepakatan jadwal screen time untuk akhir pekan ini bersama-sama."',
    ],
    phrasesToAvoid: [
      '"Diam ya, nih pegang HP biar gak rewel!"',
      '"Kalau kamu main game terus, HP-nya Ibu banting!"',
    ],
    citation: 'Bab 3 & Bab 12: Parenting di Era Digital & Merespon Anak Gemar Main Gadget, hlm. 20-33, 112-118 (Nancy dkk., 2023)',
  },

  // --- BAB 4 ---
  {
    id: 'rag-id-bab-4-orang-tua-milenial',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 4,
    chapterTitle: 'Bab 4: Gaya Pengasuhan Orang Tua Milenial',
    topic: 'Parenting Milenial & Pendekatan Modern',
    keywords: ['orang tua milenial', 'generasi milenial', 'parenting modern', 'kesetaraan', 'pendekatan dialogis', 'keterbukaan', 'mindful parenting'],
    ageGroup: 'Semua Usia',
    coreConcept: 'Orang tua milenial cenderung mengedepankan pendekatan egaliter, dialogis, terbuka terhadap ilmu psikologi, dan mengutamakan kesehatan emosional anak dibanding kepatuhan buta. Tantangan milenial adalah overthinking informasi parenting di media sosial dan kelelahan membagi peran kerja-rumah tangga.',
    practicalGuidelines: [
      'Gunakan pendekatan dialogis: ajak anak berdiskusi mengenai alasan di balik setiap peraturan keluarga.',
      'Saring informasi parenting di media sosial; fokus pada kebutuhan nyata anak tanpa membandingkan gaya hidup keluarga lain.',
      'Luangkan "Special One-on-One Time" minimal 15-20 menit setiap hari tanpa interupsi pekerjaan atau gawai.',
    ],
    recommendedPhrases: [
      '"Bagaimana perasaanmu tentang kejadian di sekolah tadi? Ceritakan ke Ibu, Ibu siap mendengarkan."',
      '"Menurutmu apa solusi terbaik untuk masalah ini?"',
    ],
    phrasesToAvoid: [
      '"Zaman dulu Ayah tidak pernah manja seperti kamu."',
      '"Kamu harus sempurna seperti anak-anak di Instagram."',
    ],
    citation: 'Bab 4: Gaya Pengasuhan Orang Tua Milenial, hlm. 34-43 (Nancy dkk., 2023)',
  },

  // --- BAB 5 ---
  {
    id: 'rag-id-bab-5-komunikasi-efektif',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 5,
    chapterTitle: 'Bab 5: Model Komunikasi yang Efektif antara Orang Tua dan Anak',
    topic: 'Komunikasi Efektif & Active Listening',
    keywords: ['komunikasi efektif', 'active listening', 'mendengarkan aktif', 'validasi emosi', 'gap generasi', 'bahasa kasih', 'komunikasi asertif'],
    ageGroup: 'Semua Usia (Balita hingga Remaja)',
    coreConcept: 'Komunikasi efektif berpusat pada empati dan active listening (mendengarkan untuk memahami, bukan mendengarkan untuk langsung mendebat atau menasihati). Memvalidasi emosi anak terlebih dahulu membuat anak merasa aman dan kooperatif dalam menerima solusi.',
    practicalGuidelines: [
      'Gunakan teknik "Sejajarkan Mata": jongkok atau duduk setinggi mata anak saat berbicara penting.',
      'Validasi emosi sebelum memberikan arahan: "Ibu lihat kamu sangat kecewa karena rencanamu batal."',
      'Gunakan pernyataan "Saya" (I-Message) daripada "Kamu" yang menyalahkan (contoh: "Ibu khawatir kalau kamu belum pulang jam segini").',
      'Hindari 4 jebakan komunikasi: menggurui, meremehkan perasaan, menyindir (sarkasme), dan mengancam.',
    ],
    recommendedPhrases: [
      '"Ibu mengerti kamu sedih dan marah. Wajar merasa begitu. Ibu di sini menemani kamu sampai tenang."',
      '"Terima kasih sudah jujur menceritakannya kepada Ayah, mari kita cari jalan keluarnya bersama."',
    ],
    phrasesToAvoid: [
      '"Gitu aja kok nangis, cengeng banget!"',
      '"Kamu selalu saja bikin masalah!"',
      '"Dengerin orang tua, kamu masih kecil tahu apa?"',
    ],
    citation: 'Bab 5: Model Komunikasi yang Efektif antara Orang Tua dan Anak, hlm. 44-55 (Nancy dkk., 2023)',
  },

  // --- BAB 6 ---
  {
    id: 'rag-id-bab-6-peran-ayah-fatherhood',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 6,
    chapterTitle: 'Bab 6: Pentingnya Peran Ayah dalam Pembentukan Karakter Anak',
    topic: 'Peran Ayah (Fatherhood) & Keterlibatan Pria',
    keywords: ['peran ayah', 'fatherhood', 'father involvement', 'sosok ayah', 'karakter anak', 'ketahanan mental anak', 'keberanian anak', 'father hunger'],
    ageGroup: 'Semua Usia (0-18 tahun)',
    coreConcept: 'Ayah bukan sekadar pencari nafkah material (breadwinner), melainkan pilar pembentuk identitas diri, keberanian eksplorasi, regulasi risiko, dan ketahanan mental anak. Ketiadaan keterlibatan emosional ayah (father hunger) berisiko memicu masalah perilaku dan kerapuhan emosi pada anak laki-laki maupun perempuan.',
    practicalGuidelines: [
      'Ayah perlu terlibat aktif dalam rutinitas harian: memandikan, mengantar sekolah, bermain fisik (rough-and-tumble play), dan membacakan dongeng.',
      'Tunjukkan keteladanan rasa hormat dan kasih sayang kepada pasangan di hadapan anak.',
      'Dukung rasa ingin tahu dan keberanian anak dalam mencoba hal-hal baru yang menantang secara aman.',
      'Hadir secara utuh (mindful) tanpa distraksi gawai saat mendampingi anak.',
    ],
    recommendedPhrases: [
      '"Ayah bangga sekali melihat kamu berani mencoba hal baru ini."',
      '"Yuk kita bangun benteng balok ini bersama Ayah!"',
    ],
    phrasesToAvoid: [
      '"Urusan anak itu urusan Ibu, Ayah sudah capek cari uang."',
      '"Anak laki-laki tidak boleh cengeng!"',
    ],
    citation: 'Bab 6: Pentingnya Peran Ayah dalam Pembentukan Karakter Anak, hlm. 56-64 (Nancy dkk., 2023)',
  },

  // --- BAB 7 ---
  {
    id: 'rag-id-bab-7-kesiapan-mental-ibu-muda-ppd',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 7,
    chapterTitle: 'Bab 7: Kesiapan Mental Ibu Muda & Postpartum Depression (PPD)',
    topic: 'Kesehatan Mental Ibu & Dukungan Pasangan',
    keywords: ['ibu muda', 'kesiapan mental', 'postpartum depression', 'ppd', 'baby blues', 'depresi pasca melahirkan', 'dukungan suami', 'self-care ibu', 'burnout ibu'],
    ageGroup: 'Ibu Baru & Bayi (0-2 tahun)',
    coreConcept: 'Transisi menjadi ibu baru membawa perubahan hormonal, fisik, dan psikologis drastis. Baby blues (biasanya 1-2 minggu pertama) dan Postpartum Depression (PPD) adalah kondisi medis nyata yang membutuhkan empati, bantuan konkret dari suami/keluarga, dan penanganan profesional jika berlangsung berkepanjangan tanpa stigma negatif.',
    practicalGuidelines: [
      'Suami harus mengambil inisiatif berbagi tugas rumah tangga dan pengasuhan bayi (mengganti popok, menggendong saat rewel di malam hari).',
      'Ibu perlu menyisihkan waktu istirahat dan self-care tanpa merasa bersalah (happy mother = happy baby).',
      'Hindari menuntut kesempurnaan pada diri sendiri; menjadi ibu yang "cukup baik" (good enough mother) jauh lebih sehat daripada berusaha sempurna.',
      'Segera konsultasikan ke psikolog/psikiater jika muncul perasaan hampa berkepanjangan, putus asa, atau dorongan menyakiti diri/bayi.',
    ],
    recommendedPhrases: [
      '"Sayang, istirahatlah dulu. Biar aku yang jaga si kecil malam ini."',
      '"Kamu adalah ibu yang hebat, wajar jika merasa lelah. Kita jalani proses ini bersama."',
    ],
    phrasesToAvoid: [
      '"Kurang bersyukur kamu ini, punya anak kok malah sedih."',
      '"Ibu zaman dulu bisa urus 5 anak sendirian tanpa mengeluh."',
    ],
    citation: 'Bab 7: Kesiapan Mental Ibu Muda dalam Pengasuhan Anak, hlm. 65-75 (Nancy dkk., 2023)',
  },

  // --- BAB 8 ---
  {
    id: 'rag-id-bab-8-pertanyaan-kritis-anak',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 8,
    chapterTitle: 'Bab 8: Kunci Merespon Pertanyaan Anak yang Kritis',
    topic: 'Stimulasi Nalar Kritis & Rasa Ingin Tahu',
    keywords: ['pertanyaan kritis', 'anak banyak bertanya', 'rasa ingin tahu', 'menjawab pertanyaan anak', 'nalar kritis', 'stimulasi kognitif', 'pertanyaan sensitif'],
    ageGroup: 'Anak Usia Dini (3-6 tahun) & Usia Sekolah (7-12 tahun)',
    coreConcept: 'Anak yang banyak bertanya menandakan perkembangan kognitif yang sehat dan rasa ingin tahu tinggi. Menolak atau memarahi pertanyaan anak dapat mematikan daya kritis dan kreativitas mereka. Orang tua tidak harus serba tahu; mengajak anak mencari jawaban bersama adalah metode edukasi terbaik.',
    practicalGuidelines: [
      'Apresiasi setiap pertanyaan: "Pertanyaan yang sangat cerdas! Ayah suka cara berpikirmu."',
      'Jika tidak tahu jawabannya, katakan dengan jujur: "Pertanyaan menarik, Ayah belum tahu pasti. Yuk kita cari tahu bersama di buku/ensiklopedia."',
      'Gunakan metode bertanya balik (metode Socrates): "Menurut kamu, kenapa ya burung bisa terbang tapi kucing tidak?"',
      'Jawab pertanyaan sensitif (seperti seksualitas, kematian, uang) secara jujur, sederhana, dan sesuai dengan tahap usia anak tanpa kebohongan tabu.',
    ],
    recommendedPhrases: [
      '"Pertanyaan yang luar biasa! Mari kita amati dan cari tahu jawabannya bersama-sama."',
      '"Menurut kamu sendiri kenapa hal itu bisa terjadi?"',
    ],
    phrasesToAvoid: [
      '"Bawel banget sih, banyak tanya bikin pusing!"',
      '"Anak kecil gak usah kepo, nanti juga tahu sendiri."',
    ],
    citation: 'Bab 8: Kunci Merespon Pertanyaan Anak yang Kritis, hlm. 76-86 (Nancy dkk., 2023)',
  },

  // --- BAB 9 ---
  {
    id: 'rag-id-bab-9-resiliensi-bouncing-back',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 9,
    chapterTitle: 'Bab 9: Bouncing Back: Menjadi Kuat dalam Situasi Menantang',
    topic: 'Resiliensi & Ketahanan Mental Anak',
    keywords: ['resiliensi', 'bouncing back', 'daya lentur', 'mengatasi kegagalan', 'mental tangguh', 'growth mindset', 'kecewa', 'pantang menyerah'],
    ageGroup: 'Semua Usia (Balita hingga Remaja)',
    coreConcept: 'Resiliensi (daya lentur psikologis) adalah kemampuan anak untuk bangkit kembali setelah mengalami kekecewaan, kegagalan, atau kesulitan. Anak yang selalu dilindungi dari kegagalan (helicopter parenting) akan tumbuh rapuh. Resiliensi tumbuh saat anak didampingi untuk belajar dari kesalahan dalam lingkungan yang aman dan penuh penerimaan.',
    practicalGuidelines: [
      'Beri ruang anak merasakan kekecewaan tanpa terburu-buru mengambil alih atau "menyelamatkan" mereka secara instan.',
      'Tanamkan Growth Mindset: puji proses, strategi, dan kerja keras anak, bukan sekadar bakat alami atau hasil akhir.',
      'Bantu anak menguraikan masalah menjadi langkah-langkah kecil yang dapat dipecahkan.',
      'Jadikan kegagalan sebagai bahan belajar (learning moment), bukan aib yang memalukan.',
    ],
    recommendedPhrases: [
      '"Kalah dalam perlombaan memang bikin sedih, itu wajar. Yang penting kamu sudah berjuang maksimal. Apa yang bisa kita latih lagi untuk lomba berikutnya?"',
      '"Kegagalan bukan akhir, ini tanda otak kita sedang belajar hal baru."',
    ],
    phrasesToAvoid: [
      '"Kamu ini payah sekali, masa begitu saja tidak bisa menang!"',
      '"Sudah jangan sedih, nanti Ayah belikan mainan baru biar kamu senang." (Menyuap emosi)',
    ],
    citation: 'Bab 9: Bouncing Back: Menjadi Kuat dalam Situasi Menantang, hlm. 87-96 (Nancy dkk., 2023)',
  },

  // --- BAB 10 ---
  {
    id: 'rag-id-bab-10-merespon-anak-tantrum',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 10,
    chapterTitle: 'Bab 10: Kunci Merespon Perilaku Anak Tantrum',
    topic: 'Penanganan Tantrum & Regulasi Emosi',
    keywords: ['tantrum', 'anak tantrum', 'amukan anak', 'marah-marah', 'menangis menjerit', 'mengatasi tantrum', 'de-eskalasi emosi', 'regulasi emosi'],
    ageGroup: 'Batita & Balita (1-6 tahun)',
    coreConcept: 'Tantrum adalah ekspresi ketidakmampuan anak kecil meregulasi badai emosi atau menyampaikan keinginan karena keterbatasan bahasa dan kematangan otak (downstairs brain sedang membajak upstairs brain). Tantrum bukan perilaku nakal yang disengaja. Menghadapi tantrum dengan bentakan atau kekerasan fisik justru memperparah eskalasi emosi anak.',
    practicalGuidelines: [
      'Langkah 1 (Tenangkan Diri Orang Tua): Tarik napas dalam, jangan bereaksi dengan amarah atau panik.',
      'Langkah 2 (Jaga Keamanan Fisik): Pastikan anak berada di tempat aman, jauhkan benda berbahaya.',
      'Langkah 3 (Hadir & Validasi Tanpa Banyak Bicara): Tunggu puncak amukan mereda, tawarkan pelukan hangat jika anak bersedia.',
      'Langkah 4 (Jangan Menyerah pada Tuntutan yang Tidak Masuk Akal): Tetap konsisten dengan batasan (firm yet calm) agar anak paham tantrum bukan alat tawar-menawar.',
      'Langkah 5 (Bahas Setelah Tenang): Setelah anak tenang, bantu beri nama emosi yang dirasakan (Name it to tame it).',
    ],
    recommendedPhrases: [
      '"Ibu ada di sini menemanimu. Kamu sedang sangat marah ya? Menangislah dulu sampai tenang, Ibu jaga kamu."',
      '"Ibu tidak bisa mengizinkanmu melempar barang, tapi Ibu siap memelukmu saat kamu siap."',
    ],
    phrasesToAvoid: [
      '"Diam! Kalau gak diam Ibu pukul ya!"',
      '"Malu-maluin aja nangis di depan orang banyak!"',
      '"Ya sudah nih ambil permennya asal kamu diam!" (Memberi hadiah atas amukan)',
    ],
    citation: 'Bab 10: Kunci Merespon Perilaku Anak Tantrum, hlm. 97-105 (Nancy dkk., 2023)',
  },

  // --- BAB 11 ---
  {
    id: 'rag-id-bab-11-pengasuhan-grandparent',
    sourceId: 'buku-parenting-karakter-2023',
    sourceTitle: 'Parenting: Rahasia Membentuk Karakter Anak (2023)',
    language: 'id',
    chapterNumber: 11,
    chapterTitle: 'Bab 11: Gaya Pengasuhan Grandparent (Kakek-Nenek)',
    topic: 'Harmoni Pengasuhan Bersama Kakek-Nenek',
    keywords: ['grandparent', 'kakek nenek', 'mertua', 'beda pola asuh', 'anak dimanjakan kakek', 'pengasuhan lintas generasi', 'konflik mertua'],
    ageGroup: 'Semua Usia (0-12 tahun)',
    coreConcept: 'Kakek-nenek kerap memanjakan cucu karena motif kasih sayang murni tanpa beban tanggung jawab utama mendidik. Perbedaan pola asuh antara orang tua dan kakek-nenek dapat memicu kebingungan aturan pada anak dan ketegangan keluarga. Kuncinya adalah komunikasi santun, apresiasi peran kakek-nenek, serta menetapkan batas aturan krusial secara diplomatis.',
    practicalGuidelines: [
      'Apresiasi niat baik kakek-nenek sebelum menyampaikan kekhawatiran aturan.',
      'Tentukan "Aturan Non-Nego" (misal: kesehatan, keselamatan, jam tidur, batas screen time harian) vs "Aturan Fleksibel" saat bersama kakek-nenek.',
      'Komunikasikan aturan melalui anak kandung (suami bicara ke orang tuanya, istri bicara ke orang tuanya) untuk mencegah gesekan dengan mertua.',
      'Jelaskan alasan medis atau ilmiah secara santun tanpa terkesan menggurui.',
    ],
    recommendedPhrases: [
      '"Terima kasih banyak Nek sudah menjaga si kecil hari ini. Dokter menyarankan cemilan manisnya dibatasi satu kali sehari ya Nek agar giginya tetap sehat."',
      '"Kakek dan Nenek sangat sayang padamu, tapi di rumah kita tetap ikuti aturan jam tidur ya."',
    ],
    phrasesToAvoid: [
      '"Ibu jangan ikut campur mendidik anak saya!"',
      '"Gara-gara kakek nenek anak saya jadi rusak dan manja!"',
    ],
    citation: 'Bab 11: Gaya Pengasuhan Grandparent, hlm. 106-111 (Nancy dkk., 2023)',
  },

  // --- GLOBAL / ENGLISH: Positive Discipline & Whole-Brain Child ---
  {
    id: 'rag-en-whole-brain-child',
    sourceId: 'whole-brain-child-framework',
    sourceTitle: 'The Whole-Brain Child Framework (Siegel & Bryson)',
    language: 'en',
    chapterNumber: 1,
    chapterTitle: 'Connect & Redirect: Integrating Left & Right Brain in Meltdowns',
    topic: 'Neurobiology of Emotion & Meltdowns',
    keywords: ['whole brain child', 'connect and redirect', 'name it to tame it', 'upstairs brain', 'downstairs brain', 'amygdala hijack', 'emotional regulation'],
    ageGroup: 'Toddlers & Kids (2-12 years)',
    coreConcept: 'During intense emotional floods, a child’s emotional right brain and downstairs brain take over. Logical reasoning (left brain) is inaccessible until emotional connection and soothing are established. Once connected emotionally, redirect the child to logical problem-solving.',
    practicalGuidelines: [
      'First connect with empathy and physical comfort (right-to-right brain connection).',
      'Help the child label the emotion: "Name it to tame it" reduces amygdala reactivity.',
      'Do not lecture while the downstairs brain is in control; wait until the child is regulated.',
      'Engage the upstairs brain by asking reflective questions rather than issuing rigid orders.',
    ],
    recommendedPhrases: [
      '"I can see your body feels very overwhelmed right now. Let us take a slow breath together."',
      '"You felt disappointed because your tower fell down. What can we try differently next time?"',
    ],
    phrasesToAvoid: [
      '"Stop crying immediately, it is not a big deal!"',
      '"Why are you acting so irrational right now?"',
    ],
    citation: 'Siegel, D. J., & Bryson, T. P. (2020). The Whole-Brain Child: 12 Revolutionary Strategies.',
  },

  {
    id: 'rag-en-positive-discipline',
    sourceId: 'positive-discipline-emotion-coaching',
    sourceTitle: 'Positive Discipline & Emotion Coaching (Dr. Jane Nelsen)',
    language: 'en',
    chapterNumber: 2,
    chapterTitle: 'Connection Before Correction & Kind yet Firm Parenting',
    topic: 'Positive Discipline & Mutual Respect',
    keywords: ['positive discipline', 'connection before correction', 'kind and firm', 'natural consequences', 'logical consequences', 'mutual respect'],
    ageGroup: 'Preschool, School-age, and Teens',
    coreConcept: 'Children do better when they feel better. Punitive measures lead to rebellion, revenge, or sneaky behavior. True positive discipline focuses on mutual respect, problem-solving, teaching life skills, and holding boundaries with kindness and firmness simultaneously.',
    practicalGuidelines: [
      'Focus on solutions rather than punishments.',
      'Involve children in creating family agreements so they take ownership.',
      'Use natural and logical consequences directly related to the behavior.',
      'Practice regular Family Meetings to celebrate wins and collaboratively resolve grievances.',
    ],
    recommendedPhrases: [
      '"I love you and the answer is no."',
      '"What was our agreement about screen time before dinner?"',
      '"What do you need to do to make this right?"',
    ],
    phrasesToAvoid: [
      '"I am taking everything away until you learn your lesson!"',
      '"Because I said so!"',
    ],
    citation: 'Nelsen, J. (2021). Positive Discipline: The Classic Guide to Helping Children Develop Self-Discipline and Responsibility.',
  },
];

/**
 * Perform relevance matching across multi-source RAG knowledge base.
 */
export function retrieveRagContext(query: string, limit = 3): { chunks: RagKnowledgeChunk[]; promptContext: string } {
  if (!query || !query.trim()) {
    return { chunks: [], promptContext: '' };
  }

  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  // Score each chunk
  const scoredChunks = RAG_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;

    // Direct topic match
    if (normalizedQuery.includes(chunk.topic.toLowerCase())) score += 10;
    if (normalizedQuery.includes(chunk.chapterTitle.toLowerCase())) score += 8;

    // Keyword matching
    for (const kw of chunk.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalizedQuery.includes(kwLower)) {
        score += 6;
      } else {
        const kwParts = kwLower.split(/\s+/);
        for (const kp of kwParts) {
          if (queryTokens.includes(kp)) score += 2;
        }
      }
    }

    // Token frequency in core concept and guidelines
    for (const token of queryTokens) {
      if (chunk.coreConcept.toLowerCase().includes(token)) score += 1.5;
      for (const guide of chunk.practicalGuidelines) {
        if (guide.toLowerCase().includes(token)) score += 1;
      }
    }

    return { chunk, score };
  });

  // Filter and sort by highest score
  const filtered = scoredChunks
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);

  // If no specific match, provide foundational parenting chunk as baseline
  const selectedChunks = filtered.length > 0 ? filtered : [RAG_KNOWLEDGE_BASE[0]];

  // Build structured prompt context for agent
  const promptContext = selectedChunks
    .map((c, i) => {
      return `[RAG KNOWLEDGE REF #${i + 1}]
Source: ${c.sourceTitle} (${c.language.toUpperCase()})
Chapter: ${c.chapterTitle}
Topic: ${c.topic} | Age Group: ${c.ageGroup}
Core Scientific Concept: ${c.coreConcept}
Practical Guidelines:
${c.practicalGuidelines.map(g => ` - ${g}`).join('\n')}
Recommended Phrases to Say:
${c.recommendedPhrases.map(p => ` - ${p}`).join('\n')}
Phrases to Avoid:
${c.phrasesToAvoid.map(p => ` - ${p}`).join('\n')}
Citation: ${c.citation}`;
    })
    .join('\n\n---\n\n');

  return { chunks: selectedChunks, promptContext };
}
