export type SkillJar = { category: string; items: string[] }

// one jar per category, labels only
export const skills: SkillJar[] = [
  { category: 'Languages', items: ['Java', 'Python', 'TypeScript', 'SQL'] },
  { category: 'Frameworks', items: ['Spring Boot', 'FastAPI', 'Next.js', 'React'] },
  {
    category: 'Data & Messaging',
    items: ['DynamoDB', 'SQS', 'Redis', 'YugabyteDB', 'Cassandra'],
  },
  { category: 'Cloud & Infra', items: ['AWS', 'GCP', 'Docker', 'LocalStack'] },
  { category: 'ML', items: ['XGBoost', 'NumPy', 'QLoRA / LLaMA fine-tuning'] },
  { category: 'Testing & Perf', items: ['k6', 'Load and failure-injection testing'] },
]
