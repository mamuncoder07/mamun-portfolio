export const portfolio = {
  name: "Mamun Reja",
  title: "AI/ML Engineer & Data Scientist",
  roles: ["AI/ML Engineer", "Data Scientist", "Machine Learning Enthusiast", "Problem Solver"],
  intro:
    "I am Mamun Reja, an aspiring AI/ML Engineer and Data Science enthusiast passionate about transforming data into intelligent solutions. I enjoy exploring machine learning, developing predictive models, solving challenging problems, and continuously expanding my technical knowledge.",
  heroCopy:
    "Exploring the intersection of Artificial Intelligence, Machine Learning, and Data Science to build intelligent solutions that matter.",
  philosophy: "Never stop learning. Never stop building. Never stop improving.",
  github: "https://github.com/mamuncoder07",
  githubUsername: "mamuncoder07",
  linkedin: "https://www.linkedin.com/in/mamun-reja-269192336",
  email: "mamunreja3057@gmail.com",
  leetcode: "CodewithMamun",
  resume: "",
  availability: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "",
} as const;

export const skillGroups = [
  { name: "Programming", index: "01", skills: ["Python", "SQL", "JavaScript"] },
  {
    name: "Data Science",
    index: "02",
    skills: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Data Cleaning", "Exploratory Data Analysis", "Data Visualization"],
  },
  {
    name: "Machine Learning",
    index: "03",
    skills: ["Scikit-learn", "Regression", "Classification", "Model Evaluation", "Feature Engineering", "Data Preprocessing", "Random Forest"],
  },
  {
    name: "Development Tools",
    index: "04",
    skills: ["JupyterLab", "VS Code", "Git", "GitHub", "Linux", "Arch Linux"],
  },
] as const;

export const projects = [
  {
    number: "01",
    title: "Movie Recommendation System",
    category: "Machine Learning / Recommendation System",
    description: "A content-based recommender turns movie overviews and genres into text vectors, then ranks similar titles using cosine similarity. The Streamlit app presents five recommendations and fetches their posters from TMDb.",
    highlights: ["Content-based recommendations", "CountVectorizer", "Cosine similarity", "Top-5 ranking", "TMDb posters"],
    tags: ["Python", "Pandas", "NumPy", "Scikit-learn", "Streamlit", "Requests"],
    repo: "https://github.com/mamuncoder07/Machine_Learning_Projects/tree/main/movie_recommendation_system",
    metric: "",
    visual: "movie",
  },
  {
    number: "02",
    title: "Unemployment Analysis in India",
    category: "Data Science / Exploratory Data Analysis",
    description: "An exploratory analysis of Indian unemployment data, comparing state averages, rural and urban rates, monthly patterns, and relationships between numeric indicators.",
    highlights: ["State-wise comparison", "Monthly trends", "Rural vs. urban analysis", "Correlation heatmap"],
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter Notebook"],
    repo: "https://github.com/mamuncoder07/CodeAlpha_UnemploymentAnalysis/tree/main",
    metric: "",
    visual: "unemployment",
  },
  {
    number: "03",
    title: "Car Price Prediction",
    category: "Machine Learning / Regression",
    description: "A used-car price model engineers car age, encodes categorical features, and trains a Random Forest Regressor. Its notebook reports an R² score of 0.9594 on the held-out test set.",
    highlights: ["Car age feature", "One-hot encoding", "Random Forest Regressor", "Model evaluation"],
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "Jupyter Notebook"],
    repo: "https://github.com/mamuncoder07/CodeAlpha_CarPricePrediction",
    metric: "95.94%",
    visual: "car",
  },
  {
    number: "04",
    title: "Iris Flower Classification",
    category: "Machine Learning / Classification",
    description: "An Iris species classifier explores sepal and petal measurements with a species-colored pairplot, then evaluates a Random Forest Classifier using a classification report and confusion matrix.",
    highlights: ["Pairplot exploration", "Random Forest Classifier", "Classification report", "Confusion matrix"],
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "Jupyter Notebook"],
    repo: "https://github.com/mamuncoder07/CodeAlpha_IrisFlowerClassification",
    metric: "",
    visual: "iris",
  },
] as const;

export const milestones = [
  "Python and programming fundamentals",
  "Data Structures and Algorithms",
  "Dynamic Arrays and Array Manipulation",
  "Data Analysis and Visualization",
  "Machine Learning Fundamentals",
  "Predictive Modeling",
  "AI/ML Projects",
  "Continuous Technical Exploration",
] as const;
