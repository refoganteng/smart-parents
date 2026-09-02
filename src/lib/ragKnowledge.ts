/**
 * Frontend RAG Knowledge & Source Catalog
 * Supports multi-source & bilingual parenting knowledge (Indonesian & English).
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
    author: 'Maria Nona Nancy, Sitti Anggraini, dkk. (EP-LPPSDM)',
    year: 2023,
    language: 'id',
    description: 'Buku panduan komprehensif 12 bab mengenai pembentukan karakter anak, penanganan tantrum, manajemen gawai, peran ayah, kesiapan mental ibu, dan komunikasi efektif.',
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

export const POPULAR_TOPICS = [
  {
    id: 'tantrum',
    title: 'Penanganan Anak Tantrum',
    titleEn: 'Handling Child Meltdowns & Tantrums',
    chapter: 'Bab 10 & Whole-Brain Child',
    ageGroup: '1-6 Tahun',
    prompt: 'Bagaimana langkah konkret dan tenang mengatasi anak balita yang sedang tantrum di tempat umum tanpa harus membentak atau menuruti tuntutan yang salah?',
    icon: 'Flame',
    color: 'amber',
  },
  {
    id: 'gadget-screentime',
    title: 'Screen Time & Gadget Sehat',
    titleEn: 'Digital Wellness & Screen Time',
    chapter: 'Bab 3, Bab 12 & AAP Guidelines',
    ageGroup: 'Semua Usia',
    prompt: 'Bagaimana cara membuat kontrak dan batasan screen time gadget yang efektif untuk anak agar tidak kecanduan game online?',
    icon: 'Smartphone',
    color: 'teal',
  },
  {
    id: 'komunikasi-efektif',
    title: 'Komunikasi & Validasi Emosi',
    titleEn: 'Empathetic Communication',
    chapter: 'Bab 5 & Positive Discipline',
    ageGroup: '3-16 Tahun',
    prompt: 'Bagaimana teknik active listening dan validasi emosi saat anak marah, kecewa, atau menolak diajak bicara?',
    icon: 'MessageSquareQuote',
    color: 'indigo',
  },
  {
    id: 'peran-ayah',
    title: 'Peran Ayah (Fatherhood)',
    titleEn: 'Fatherhood & Character Building',
    chapter: 'Bab 6: Pentingnya Peran Ayah',
    ageGroup: '0-18 Tahun',
    prompt: 'Apa saja bentuk keterlibatan ayah yang paling berdampak positif dalam membentuk karakter dan ketahanan mental anak laki-laki maupun perempuan?',
    icon: 'ShieldCheck',
    color: 'sky',
  },
  {
    id: 'mental-ibu-ppd',
    title: 'Kesehatan Mental Ibu & PPD',
    titleEn: 'Maternal Health & Postpartum Support',
    chapter: 'Bab 7: Kesiapan Mental Ibu Muda',
    ageGroup: 'Ibu Baru & Bayi',
    prompt: 'Saya merasa sangat lelah dan cemas setelah melahirkan. Bagaimana mengenali tanda Postpartum Depression (PPD) dan bagaimana suami bisa memberi dukungan nyata?',
    icon: 'HeartHandshake',
    color: 'rose',
  },
  {
    id: 'toxic-parents',
    title: 'Memutus Pola Toxic Parents',
    titleEn: 'Breaking Toxic Parenting Cycles',
    chapter: 'Bab 2: Kesalahan yang Sering Dilakukan',
    ageGroup: 'Refleksi Orang Tua',
    prompt: 'Bagaimana cara orang tua menyadari jika tanpa sengaja melakukan toxic parenting (seperti membandingkan anak atau guilt tripping) dan memperbaikinya?',
    icon: 'AlertTriangle',
    color: 'orange',
  },
  {
    id: 'pertanyaan-kritis',
    title: 'Menjawab Pertanyaan Kritis Anak',
    titleEn: 'Responding to Inquisitive Children',
    chapter: 'Bab 8: Kunci Merespon Pertanyaan',
    ageGroup: '4-12 Tahun',
    prompt: 'Bagaimana cara terbaik merespon anak yang terus bertanya kritis tentang hal-hal rumit atau sensitif agar daya nalarnya berkembang?',
    icon: 'HelpCircle',
    color: 'emerald',
  },
  {
    id: 'grandparent-harmony',
    title: 'Harmoni Pola Asuh Kakek-Nenek',
    titleEn: 'Grandparenting & Generational Harmony',
    chapter: 'Bab 11: Gaya Pengasuhan Grandparent',
    ageGroup: 'Keluarga Multigenerasi',
    prompt: 'Bagaimana cara menyampaikan batasan aturan anak kepada kakek-nenek atau mertua yang sering memanjakan cucu tanpa menyinggung perasaan mereka?',
    icon: 'Users',
    color: 'purple',
  },
  {
    id: 'resiliensi-anak',
    title: 'Membangun Resiliensi Anak',
    titleEn: 'Fostering Resilience & Grit',
    chapter: 'Bab 9: Bouncing Back Menjadi Kuat',
    ageGroup: '5-18 Tahun',
    prompt: 'Bagaimana cara melatih anak agar memiliki daya lentur (resilience), tidak mudah putus asa, dan berani mencoba lagi saat mengalami kegagalan?',
    icon: 'Sparkles',
    color: 'blue',
  },
];
