import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  ShieldCheck,
  Award
} from 'lucide-react';

interface ParentingToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRoleplayChat: (prompt: string) => void;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'Saat anak Anda marah dan menolak mematikan gawai/gadget saat waktu screen time selesai, apa yang biasanya Anda lakukan?',
    options: [
      {
        text: 'Saya ingatkan kesepakatan awal dengan tenang, dampingi proses mematikan, dan tawarkan aktivitas transisi.',
        style: 'Demokratis (Otoritatif)',
        type: 'authoritative',
      },
      {
        text: 'Saya langsung merebut gawainya dan membentak agar dia takut membantah.',
        style: 'Otoriter',
        type: 'authoritarian',
      },
      {
        text: 'Saya biarkan saja dia lanjut bermain daripada menangis dan rewel.',
        style: 'Permisif',
        type: 'permissive',
      },
      {
        text: 'Saya tidak peduli dan membiarkannya bermain sampai kelelahan sendiri.',
        style: 'Pengabaian',
        type: 'neglectful',
      },
    ],
  },
  {
    id: 2,
    question: 'Ketika anak mendapatkan nilai kurang memuaskan atau gagal dalam lomba, bagaimana respon spontan Anda?',
    options: [
      {
        text: 'Memvalidasi kekecewaannya, memuji usahanya, lalu mendiskusikan apa yang bisa dipelajari untuk ke depan.',
        style: 'Demokratis (Otoritatif)',
        type: 'authoritative',
      },
      {
        text: 'Memarahi dan membandingkannya dengan anak lain yang nilainya lebih tinggi.',
        style: 'Otoriter',
        type: 'authoritarian',
      },
      {
        text: 'Menghiburnya dengan membelikan mainan mahal tanpa membahas evaluasi belajarnya.',
        style: 'Permisif',
        type: 'permissive',
      },
      {
        text: 'Mengabaikan karena menganggap urusan sekolah adalah tanggung jawab guru sepenuhnya.',
        style: 'Pengabaian',
        type: 'neglectful',
      },
    ],
  },
  {
    id: 3,
    question: 'Bagaimana keterlibatan Ayah dan Ibu dalam menyepakati aturan pengasuhan keluarga (co-parenting)?',
    options: [
      {
        text: 'Kami rutin berdiskusi berdua untuk menyelaraskan batasan dan saling mendukung di depan anak.',
        style: 'Demokratis (Otoritatif)',
        type: 'authoritative',
      },
      {
        text: 'Salah satu pihak mendominasi total dan melarang pasangan ikut campur.',
        style: 'Otoriter',
        type: 'authoritarian',
      },
      {
        text: 'Bebas saja, siapa yang sedang longgar yang mengatur tanpa ada aturan baku.',
        style: 'Permisif',
        type: 'permissive',
      },
      {
        text: 'Masing-masing lepas tangan dan menyerahkan pengasuhan sepenuhnya pada gawai/asisten.',
        style: 'Pengabaian',
        type: 'neglectful',
      },
    ],
  },
];

const ROLEPLAY_SCENARIOS = [
  {
    id: 'rp-tantrum-mall',
    title: 'Simulasi: Anak Tantrum Minta Mainan di Toko',
    age: 'Anak 3-5 Tahun',
    situation: 'Anak menjerit dan berguling di lantai supermarket karena ingin membeli mainan tambahan padahal sudah ada kesepakatan belanja.',
    prompt: 'Bantu saya menyimulasikan latihan dialog roleplay: Anak saya (4 tahun) sedang tantrum di kasir supermarket minta dibelikan robot baru. Berikan skrip percakapan kata demi kata apa yang harus saya ucapkan dan tindakan tenangnya berdasarkan Bab 10 buku parenting.',
  },
  {
    id: 'rp-screen-time-teen',
    title: 'Simulasi: Negosiasi Game Online dengan Remaja',
    age: 'Anak 10-14 Tahun',
    situation: 'Anak menolak belajar dan bermain game online melebihi batas waktu yang disepakati.',
    prompt: 'Bantu saya simulasi dialog: Bagaimana cara mengajak anak remaja (12 tahun) berdiskusi secara egaliter tentang screen time game online tanpa membuatnya defensif atau memberontak, berdasarkan Bab 3 & 4 buku parenting?',
  },
  {
    id: 'rp-sibling-fight',
    title: 'Simulasi: Menengahi Pertengkaran Kakak-Adik',
    age: 'Anak 4 & 7 Tahun',
    situation: 'Kakak dan adik saling berebut mainan hingga menangis dan saling memukul.',
    prompt: 'Bantu saya simulasi dialog: Dua anak saya (4 dan 7 tahun) sedang bertengkar hebat berebut mainan. Berikan langkah de-eskalasi emosi dan dialog resolusi damai tanpa memihak salah satu anak sesuai Bab 5 komunikasi efektif.',
  },
];

export const ParentingToolkitModal: React.FC<ParentingToolkitModalProps> = ({
  isOpen,
  onClose,
  onStartRoleplayChat,
}) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'roleplay'>('assessment');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleSelectAnswer = (qId: number, type: string) => {
    setAnswers(prev => ({ ...prev, [qId]: type }));
  };

  const handleCalculateAssessment = () => {
    setShowResult(true);
  };

  const handleResetAssessment = () => {
    setAnswers({});
    setShowResult(false);
  };

  const countAuthoritative = Object.values(answers).filter(v => v === 'authoritative').length;
  const isCompleted = Object.keys(answers).length === ASSESSMENT_QUESTIONS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Parenting Toolkit Interaktif
              </h3>
              <p className="text-xs text-slate-500">
                Latihan simulasi dialog & asesmen gaya asuh mandiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Refleksi Gaya Asuh (3 Menit)
          </button>
          <button
            onClick={() => setActiveTab('roleplay')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'roleplay'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Simulasi Roleplay Dialog
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'assessment' ? (
            <div className="space-y-5">
              {!showResult ? (
                <>
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/70 text-xs text-teal-900 leading-relaxed">
                    <strong>Petunjuk:</strong> Pilih respon yang paling menggambarkan kebiasaan Anda sehari-hari saat berinteraksi dengan anak untuk mengetahui kecenderungan gaya pengasuhan Anda.
                  </div>

                  <div className="space-y-4">
                    {ASSESSMENT_QUESTIONS.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2.5">
                        <div className="text-xs font-bold text-slate-900">
                          {idx + 1}. {q.question}
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = answers[q.id] === opt.type;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(q.id, opt.type)}
                                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                </span>
                                <span className="flex-1">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCalculateAssessment}
                    disabled={!isCompleted}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    Lihat Hasil Evaluasi Pola Asuh
                  </button>
                </>
              ) : (
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-indigo-950">
                      Hasil Evaluasi: {countAuthoritative >= 2 ? 'Kecenderungan Otoritatif (Demokratis Sehat)' : 'Perlu Penguatan Konsistensi & Empati'}
                    </h4>
                    <p className="text-xs text-indigo-800/80 mt-1 max-w-md mx-auto leading-relaxed">
                      {countAuthoritative >= 2 
                        ? 'Luar biasa! Anda menunjukkan pendekatan pengasuhan yang seimbang antara kehangatan cinta dan ketegasan batasan (firm yet kind).'
                        : 'Anda memiliki niat baik yang besar. Konsistensi aturan dan validasi emosi anak sebelum bertindak dapat terus diperkuat.'}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={handleResetAssessment}
                      className="px-3.5 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-medium text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Ulangi Tes
                    </button>
                    <button
                      onClick={() => {
                        onStartRoleplayChat('Berdasarkan hasil refleksi gaya asuh saya, bantu saya mendalami cara memperkuat pola asuh demokratis (otoritatif) dan konsistensi co-parenting di rumah.');
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      Konsultasikan Hasil ke AI
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-xs text-indigo-900 leading-relaxed">
                Pilih skenario situasi menantang di bawah ini untuk memulai simulasi percakapan interaktif langkah-demi-langkah bersama AI Parenting.
              </div>

              <div className="space-y-3">
                {ROLEPLAY_SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-sm transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs md:text-sm text-slate-900">
                        {scenario.title}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {scenario.age}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scenario.situation}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          onStartRoleplayChat(scenario.prompt);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        Mulai Latihan Dialog
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Pendekatan Ilmiah & Parenting Positif</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
