export type Certificate = {
  fileName: string;
  title: string;
  pdfPath: string;
  previewPath: string;
  issuer?: string;
  completedAt?: string;
};

const certificateFileNames = [
  "Meander Certificate.pdf",
  "Mindluster_Certificate.pdf",
  "Tata Data Visualisation – Forage.pdf",
  "The_Ultimate_Job_Ready_Data_Science_Course_Certificate.pdf",
  "Walmart Vriddhi Path 5 – Supplier Academy.pdf",
] as const;

function titleFromFileName(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, "")
    .replaceAll("_", " ")
    .trim();
}

export const certificates: Certificate[] = certificateFileNames.map((fileName) => {
  const pdfPath = `/certificates/${encodeURIComponent(fileName)}`;

  return {
    fileName,
    title: titleFromFileName(fileName),
    pdfPath,
    previewPath: `${pdfPath}#page=1&view=FitH&toolbar=0&navpanes=0`,
  };
});
