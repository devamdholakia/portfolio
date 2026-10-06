export type SkillJar = { category: string; items: string[] }

// one jar per category, labels only
export const skills: SkillJar[] = [
  { category: 'Languages', items: ['Java', 'Python', 'C', 'JavaScript (ES6+)', 'SQL'] },
  {
    category: 'Frameworks',
    items: [
      'Spring Boot',
      'React',
      'Next.js',
      'Redux',
      'Node.js (Express)',
      'FastAPI',
      'GraphQL',
      'WebRTC',
      'WebSockets',
    ],
  },
  {
    category: 'ML & Data',
    items: ['XGBoost', 'scikit-learn', 'NumPy', 'pandas', 'PyTorch (QLoRA/PEFT)'],
  },
  {
    category: 'Databases & Infra',
    items: ['PostgreSQL', 'Redis', 'Docker', 'GCP Cloud Run', 'AWS'],
  },
  { category: 'Tools & Testing', items: ['Git/GitHub', 'GitHub Actions', 'JUnit'] },
]
