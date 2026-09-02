import jsPDF from 'jspdf';
import type { Message } from '../types';

export function exportChatToPdf(messages: Message[], sessionTitle = 'Percakapan Parenting'): void {
  if (!messages || messages.length === 0) {
    alert('Tidak ada pesan untuk diekspor.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const addHeader = () => {
    // Top Teal Bar Accent
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.rect(margin, cursorY, maxLineWidth, 1.5, 'F');
    cursorY += 7;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('Smart Parents AI', margin, cursorY);

    // Subtitle / Session title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Konsultasi Pola Asuh & Perkembangan Anak • ${dateStr}`, margin, cursorY + 5);

    cursorY += 12;

    // Divider Line
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 8;
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400

    const footerText = 'Smart Parents AI • Crafted by Revo Nando';
    const pageStr = `Hal. ${pageNum} dari ${totalPages}`;

    doc.text(footerText, margin, pageHeight - 10);
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 10);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = margin + 5;
    }
  };

  // Render First Header
  addHeader();

  messages.forEach((msg) => {
    const isUser = msg.role === 'user';
    const senderName = isUser ? 'Orang Tua (Pertanyaan)' : 'Smart Parents AI (Solusi & Rujukan)';

    // Clean markdown characters for crisp PDF text rendering
    const cleanContent = msg.content
      .replace(/### /g, '\n')
      .replace(/## /g, '\n')
      .replace(/# /g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    const textLines = doc.splitTextToSize(cleanContent, maxLineWidth - 8);
    const blockHeight = textLines.length * 4.8 + 12;

    checkPageBreak(Math.min(blockHeight, 35));

    // Role Badge & Box
    if (isUser) {
      doc.setFillColor(241, 245, 249); // Slate 100
      doc.setDrawColor(203, 213, 225); // Slate 300
    } else {
      doc.setFillColor(240, 253, 250); // Teal 50
      doc.setDrawColor(153, 246, 228); // Teal 200
    }

    doc.roundedRect(margin, cursorY, maxLineWidth, 7, 1.5, 1.5, 'FD');

    // Role Label Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(isUser ? 51 : 13, isUser ? 65 : 148, isUser ? 85 : 136);
    doc.text(senderName, margin + 3, cursorY + 4.8);

    cursorY += 10;

    // Message Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59); // Slate 800

    for (let i = 0; i < textLines.length; i++) {
      checkPageBreak(6);
      doc.text(textLines[i], margin + 3, cursorY);
      cursorY += 4.8;
    }

    cursorY += 6; // Spacing after each message
  });

  // Apply page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addFooter(p, totalPages);
  }

  // Save the generated PDF
  const sanitizedTitle = sessionTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'Smart_Parents_Chat';
  doc.save(`${sanitizedTitle}_${Date.now()}.pdf`);
}
