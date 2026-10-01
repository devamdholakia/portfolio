export type SkillJar = { category: string; items: string[] }

// one jar per category, labels only
export const skills: SkillJar[] = [
  { category: 'Languages', items: ['Java', 'Python', 'C', 'JavaScript', 'TypeScript', 'SQL'] },
  {
    category: 'Frameworks',
    items: ['Spring Boot', 'FastAPI', 'React', 'Next.js', 'Redux', 'Node.js', 'GraphQL', 'WebRTC'],
  },
  {
    category: 'Data & Messaging',
    items: ['PostgreSQL', 'Redis', 'DynamoDB', 'SQS', 'YugabyteDB', 'Cassandra'],
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS', 'GCP Cloud Run', 'Docker', 'GitHub Actions', 'LocalStack'],
  },
  {
    category: 'ML',
    items: ['XGBoost', 'scikit-learn', 'NumPy', 'pandas', 'PyTorch (QLoRA/PEFT)'],
  },
  { category: 'Testing & Perf', items: ['JUnit', 'k6', 'Load and failure-injection testing'] },
]
