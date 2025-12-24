import { Scenario } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";

export async function exportScenarioPDF(
  scenario: Scenario,
  type: string,
  title?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 20;

  const addText = (
    text: string,
    fontSize: number = 12,
    isBold: boolean = false
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");

    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });

    yPosition += 5;
  };

  const addSection = (title: string, content: string) => {
    addText(title, 14, true);
    addText(content, 11, false);
    yPosition += 5;
  };

  // En-Tête
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("🚒 SCENARIO D'INTERVENTION", pageWidth / 2, 15, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text("SDIS 68 - Formation secours à Personne", pageWidth / 2, 22, {
    align: "center",
  });

  yPosition = 40;
  doc.setTextColor(0, 0, 0);

  // Informations générales
  addText(`Type: ${type.toUpperCase()}`, 12, true);
  if (title) {
    addText(`Titre: ${title}`, 12, false);
  }
  addText(
    `Date: ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`,
    11,
    false
  );
  yPosition += 5;

  // Ligne de séparation
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Situation
  addSection("📍 SITUATION", scenario.situation);

  // Bilan initial
  addText("🏥 BILAN INITIAL", 14, true);
  addText(`Conscience: ${scenario.bilan_initial.conscience}`, 11, false);
  addText(
    `FC: ${scenario.bilan_initial.fc} bpm | FR: ${scenario.bilan_initial.fr}/min`,
    11,
    false
  );
  addText(
    `TA: ${scenario.bilan_initial.ta} mmHg | SpO2: ${scenario.bilan_initial.spo2}`,
    11,
    false
  );
  addText(`Température: ${scenario.bilan_initial.temp}`, 11, false);
  yPosition += 5;

  // Evolution
  addText("📊 EVOLUTION", 14, true);
  scenario.evolution.forEach((step, index) => {
    addText(`⏱ ${step.minute} minutes:`, 12, true);
    addText(step.description, 11, false);

    const constantes: string[] = [];
    if (step.fc) constantes.push(`FC: ${step.fc}`);
    if (step.fr) constantes.push(`FR: ${step.fr}`);
    if (step.ta) constantes.push(`TA: ${step.ta}`);
    if (step.spo2) constantes.push(`SpO2: ${step.spo2}`);

    if (constantes.length > 0) {
      addText(constantes.join(" | "), 10, false);
    }

    if (index < scenario.evolution.length - 1) {
      yPosition += 3;
    }
  });
  yPosition += 5;

  // Objectif pédagogique
  addSection("🎯 OBJECTIF PÉDAGOGIQUE", scenario.objectif_pedagogique);

  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} / ${totalPages} - Généré le ${format(
        new Date(),
        "dd/MM/yyyy à HH:mm"
      )}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Télécharger
  const filename = `scenario_${type}_${format(
    new Date(),
    "yyyyMMdd_HHmmss"
  )}.pdf`;
  doc.save(filename);
}
