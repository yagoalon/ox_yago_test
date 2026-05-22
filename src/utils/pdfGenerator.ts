import { jsPDF } from 'jspdf';
import { Meeting } from '../types';

export function generatePDFReport(meeting: Meeting) {
  // Create a new A4 document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 20;
  let currentY = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  // Colors
  const colors = {
    brand: [13, 148, 136] as [number, number, number], // #0D9488 Teal
    title: [15, 23, 42] as [number, number, number],   // Slate 900
    text: [51, 65, 85] as [number, number, number],    // Slate 700
    lightText: [100, 116, 139] as [number, number, number], // Slate 500
    risk: [225, 29, 72] as [number, number, number],      // Rose 600
  };

  // Helper for adding lines of text
  const addText = (text: string, fontSize = 10, isBold = false, color = colors.text, indent = 0) => {
    // Basic Page break calculation
    if (currentY > 275) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const splitText = doc.splitTextToSize(text, maxLineWidth - indent);
    
    // Check if whole block fits, otherwise page break might happen mid-block
    if (currentY + (splitText.length * (fontSize * 0.4)) > 280) {
      doc.addPage();
      currentY = 20;
    }

    doc.text(splitText, margin + indent, currentY);
    currentY += splitText.length * (fontSize * 0.4) + 2; 
  };

  const addHeader = (title: string) => {
    currentY += 8;
    addText(title, 11, true, colors.brand);
    // Add small underline
    doc.setDrawColor(...colors.brand);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY - 1, margin + 40, currentY - 1);
    currentY += 3;
  };

  // ======================
  // Document Header
  // ======================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...colors.title);
  doc.text("INTELLIGENCE REPORT", margin, currentY);
  currentY += 8;

  addText(meeting.title, 16, true, colors.title);
  currentY += 4;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(...colors.brand);
  doc.roundedRect(margin, currentY, 40, 6, 1, 1, "F");
  doc.text(meeting.category, margin + 20, currentY + 4, { align: "center" });

  currentY += 10;
  addText(`Date: ${meeting.date} | Status: ${meeting.status} | Generated: ${new Date().toLocaleDateString()}`, 9, false, colors.lightText);
  currentY += 5;

  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // ======================
  // Sections
  // ======================
  addHeader("1. EXECUTIVE SUMMARY");
  addText(meeting.summary || "No summary provided", 10, false, colors.text);

  addHeader("2. STRATEGIC INSIGHTS");
  if (meeting.insights && meeting.insights.length > 0) {
    meeting.insights.forEach((insight, i) => {
      addText(`${i + 1}. ${insight}`, 10, false, colors.text, 5);
      currentY += 2;
    });
  } else {
    addText("None extracted.", 10, false, colors.lightText);
  }

  addHeader("3. CRITICAL RISKS");
  if (meeting.risks && meeting.risks.length > 0) {
    meeting.risks.forEach((risk) => {
      addText(`• ${risk}`, 10, true, colors.risk, 5);
      currentY += 2;
    });
  } else {
    addText("None detected.", 10, false, colors.lightText);
  }

  addHeader("4. KEY DIALOGUES");
  if (meeting.talkingPoints && meeting.talkingPoints.length > 0) {
    meeting.talkingPoints.forEach((point, i) => {
      addText(`[Dialogue ${i + 1}]`, 9, true, colors.lightText, 5);
      addText(point, 10, false, colors.text, 5);
      currentY += 3;
    });
  } else {
    addText("None recorded.", 10, false, colors.lightText);
  }

  addHeader("5. UNRESOLVED DELIVERABLES");
  if (meeting.nextSteps && meeting.nextSteps.length > 0) {
    meeting.nextSteps.forEach((step) => {
      const checkbox = step.completed ? "[ X ] " : "[    ] ";
      addText(`${checkbox} ${step.text}`, 10, step.completed ? false : true, colors.text, 5);
      currentY += 2;
    });
  } else {
    addText("No pending action items.", 10, false, colors.lightText);
  }
  
  const safeTitle = meeting.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`Report_${safeTitle}.pdf`);
}
