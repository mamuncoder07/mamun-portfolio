const logoFiles = {
  LeetCode: "leetcode.svg",
  GitHub: "github.svg",
  Python: "python.svg",
  SQL: "sql.svg",
  JavaScript: "javascript.svg",
  NumPy: "numpy.svg",
  Pandas: "pandas.svg",
  "Scikit-learn": "scikit-learn.svg",
  Matplotlib: "matplotlib.svg",
  Seaborn: "seaborn.svg",
  Linux: "linux.svg",
  Jupyter: "jupyter.svg",
  "VS Code": "vscode.svg",
  Git: "git.svg",
  LinkedIn: "linkedin.svg",
  "Arch Linux": "arch-linux.svg",
  Instagram: "instagram.svg",
  Facebook: "facebook.svg",
  X: "x.svg",
} as const;

export type BrandName = keyof typeof logoFiles;

const technologyBrandNames: Readonly<Record<string, BrandName>> = {
  Python: "Python",
  SQL: "SQL",
  JavaScript: "JavaScript",
  NumPy: "NumPy",
  Pandas: "Pandas",
  "Scikit-learn": "Scikit-learn",
  Matplotlib: "Matplotlib",
  Seaborn: "Seaborn",
  JupyterLab: "Jupyter",
  "Jupyter Notebook": "Jupyter",
  "VS Code": "VS Code",
  Git: "Git",
  GitHub: "GitHub",
  Linux: "Linux",
  "Arch Linux": "Arch Linux",
};

export function getTechnologyBrand(name: string): BrandName | null {
  return technologyBrandNames[name] ?? null;
}

export function BrandLogo({
  name,
  className = "brand-mark",
  alt = "",
}: {
  name: BrandName;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={className}
      src={`/brand-logos/${logoFiles[name]}`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={128}
      height={128}
      loading="lazy"
      decoding="async"
    />
  );
}
