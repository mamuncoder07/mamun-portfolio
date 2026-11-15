import { ArrowDownRight, ArrowUpRight, BrainCircuit, Code2, Database, Sparkles } from "lucide-react";
import { portfolio, projects, skillGroups, milestones } from "@/config/portfolio";
import { BrandLogo, getTechnologyBrand, type BrandName } from "@/components/brand-logo";
import { SectionHeading } from "@/components/section-heading";
import { GithubPanel } from "@/components/github-panel";
import { ProjectTilt } from "@/components/project-tilt";
import { ProjectPreview } from "@/components/project-preview";
import { ProfileImage } from "@/components/profile-image";
import { LeetCodeProfile } from "@/components/leetcode-profile";
import moviePreview from "../movie_recommendation_system.png";
import unemploymentPreview from "../state_wise_unemployment_hd.png";
import carPricePreview from "../correlation_heatmap_hd.png";
import irisPreview from "../iris_pairplot_hd.png";

const skillGroupBrands = {
  Programming: ["Python", "SQL", "JavaScript"],
  "Data Science": ["NumPy", "Pandas", "Matplotlib"],
  "Machine Learning": ["Scikit-learn", "Python"],
  "Development Tools": ["Jupyter", "VS Code", "GitHub"],
} as const satisfies Record<(typeof skillGroups)[number]["name"], readonly BrandName[]>;

const projectPreviews = {
  movie: { image: moviePreview, alt: "Movie recommendation system project screenshot" },
  unemployment: { image: unemploymentPreview, alt: "State-wise unemployment rates across India" },
  car: { image: carPricePreview, alt: "Car price prediction correlation heatmap" },
  iris: { image: irisPreview, alt: "Iris flower measurement pairplot grouped by species" },
} as const;

export function AboutSection() {
  return (
    <section className="section section-about" id="about" aria-labelledby="section-title-01">
      <div className="page-width">
        <SectionHeading index="01" eyebrow="A little context" title="Beyond the Code." body="An ongoing exploration of ideas, data and the systems that make them useful." />
        <div className="about-grid">
          <article className="bento-card about-intro">
            <div className="card-topline"><span className="micro-label"><span className="eyebrow-dot" /> Profile</span><span className="card-icon"><BrainCircuit size={19} /></span></div>
            <h3>Curiosity, made<br /><em>practical.</em></h3>
            <p>{portfolio.intro}</p>
            <div className="card-foot"><span>Aspiring AI/ML engineer</span><ArrowUpRight size={16} /></div>
          </article>
          <article className="bento-card about-focus">
            <div className="card-topline"><span className="micro-label">Current focus</span><span className="focus-signal" /></div>
            <h3>From raw data<br />to useful <span>intelligence.</span></h3>
            <p>Machine learning fundamentals, predictive modeling and practical data science projects.</p>
            <div className="focus-tags"><span>AI / ML</span><span>Data science</span><span><BrandLogo name="Python" className="brand-mark focus-brand-mark" />Python</span></div>
          </article>
          <article className="bento-card about-philosophy">
            <span className="micro-label">A working philosophy</span>
            <div className="quote-mark">“</div>
            <blockquote>{portfolio.philosophy}</blockquote>
            <div className="philosophy-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </article>
          <article className="bento-card about-interests">
            <div className="card-topline"><span className="micro-label">Technical interests</span><Code2 size={17} /></div>
            <div className="interest-list">
              <span><BrainCircuit size={15} /> Artificial intelligence</span>
              <span><Database size={15} /> Data analysis & visualization</span>
              <span><BrandLogo name="Linux" className="brand-mark interest-brand-mark" /> Linux & open source</span>
              <span><Sparkles size={15} /> Problem-solving</span>
            </div>
            <p>Learning by building, exploring and improving.</p>
          </article>
          <article className="bento-card about-visual about-profile-card">
            <ProfileImage variant="about" />
            <span className="about-profile-overlay" aria-hidden="true" />
            <span className="about-profile-kicker">Mamun Reja</span>
            <span className="about-profile-id"><strong>Mamun Reja</strong><span>AI/ML Engineer | Data Scientist</span></span>
          </article>
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section className="section section-skills" id="skills" aria-labelledby="section-title-02">
      <div className="page-width">
        <SectionHeading index="02" eyebrow="Tools for the work" title="My Technical Arsenal." body="A growing toolkit for asking better questions and shaping useful answers." />
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.name}>
              <div className="skill-card-head"><span className="skill-index">{group.index} / 04</span><span className="skill-brand-stack" aria-hidden="true">{skillGroupBrands[group.name].map((brand) => <span className="skill-brand-bead" key={brand}><BrandLogo name={brand} className="brand-mark" /></span>)}</span></div>
              <h3>{group.name}</h3>
              <div className="skill-rule" />
              <ul className="skill-list">{group.skills.map((skill) => {
                const brand = getTechnologyBrand(skill);
                return <li key={skill}>{brand ? <BrandLogo name={brand} className="brand-mark skill-item-brand" /> : <span className="skill-check">↗</span>}{skill}</li>;
              })}</ul>
              <div className="skill-card-bottom"><span>Learning in public</span><ArrowDownRight size={15} /></div>
            </article>
          ))}
        </div>
        <p className="honesty-note"><span className="note-line" /> Skills are presented as areas of study, not proficiency scores.</p>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section className="section section-projects" id="projects" aria-labelledby="section-title-03">
      <div className="page-width">
        <div className="projects-heading-row"><SectionHeading index="03" eyebrow="Selected experiments" title="Things I've Built." body="Small steps from questions to working models, visualizations and new questions." /><span className="project-count"><strong>04</strong><span>Projects<br />in view</span></span></div>
        <div className="projects-list">
          {projects.map((project) => (
            <ProjectTilt key={project.number}><article className={`project-card project-${project.visual}`}>
              <div className="project-art">
                <ProjectPreview image={projectPreviews[project.visual].image} imageAlt={projectPreviews[project.visual].alt} projectNumber={project.number} projectTitle={project.title} />
                <span className="project-coordinate">Project {project.number}</span>
                <span className="project-art-label">Click to enlarge</span>
              </div>
              <div className="project-body">
                <div className="project-meta"><span>{project.category}</span></div>
                <div className="project-title-row"><span className="project-number">{project.number}</span><h3 id={`project-title-${project.number}`}>{project.title}</h3></div>
                <p className="project-description">{project.description}</p>
                {project.metric ? <div className="project-metric"><span>Verified R² score</span><strong>{project.metric}</strong></div> : null}
                <div className="project-highlights">{project.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div>
                <div className="project-footer"><div className="tag-row" aria-label="Technologies used">{project.tags.map((tag) => {
                  const brand = getTechnologyBrand(tag);
                  return <span className="project-tech-tag" key={tag}>{brand ? <BrandLogo name={brand} className="brand-mark project-tech-brand" /> : null}{tag}</span>;
                })}</div><a className="project-link" href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} repository on GitHub`}><BrandLogo name="GitHub" className="brand-mark project-link-brand" />View repository <ArrowUpRight size={15} /></a></div>
              </div>
            </article></ProjectTilt>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OpenSourceSection() {
  return (
    <section className="section section-activity" id="activity" aria-labelledby="section-title-04">
      <div className="page-width">
        <div className="activity-header"><SectionHeading index="04" eyebrow="The public workbench" title="Open Source Activity." body="Public activity, pulled from GitHub when available. No numbers are estimated." /><a className="text-link" href={portfolio.github} target="_blank" rel="noreferrer"><BrandLogo name="GitHub" className="brand-mark github-link-brand" />GitHub profile <ArrowUpRight size={15} /></a></div>
        <GithubPanel />
      </div>
    </section>
  );
}

export function LeetCodeSection() {
  return (
    <section className="section section-leetcode" aria-labelledby="section-title-05">
      <div className="page-width leetcode-layout">
        <div><SectionHeading index="05" eyebrow="LeetCode practice" title="Problem Solving Lab." body="A quiet place for the next problem, the next pattern and the next insight." /></div>
        <LeetCodeProfile username={portfolio.leetcode} profileName={portfolio.name} />
      </div>
    </section>
  );
}

export function JourneySection() {
  return (
    <section className="section section-journey" id="journey" aria-labelledby="section-title-06">
      <div className="page-width journey-layout">
        <div className="journey-intro"><SectionHeading index="06" eyebrow="In motion, not finished" title="Always Learning. Always Evolving." body="A collection of topics that keep leading to better questions." /><p className="journey-aside"><span className="journey-aside-rule" /> No dates or completion bars—just the subjects along the way.</p></div>
        <ol className="timeline-list">{milestones.map((milestone, index) => <li key={milestone}><span className="timeline-index">{String(index + 1).padStart(2, "0")}</span><span className="timeline-marker" /><span className="timeline-copy">{milestone}</span><span className="timeline-signal" aria-hidden="true" /></li>)}</ol>
      </div>
    </section>
  );
}
