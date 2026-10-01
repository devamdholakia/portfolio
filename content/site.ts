// change the cafe name here and it updates everywhere
export const CAFE_NAME = "Dev's Daily Grind"

export const site = {
  cafeName: CAFE_NAME,
  name: 'Devam Dholakia',
  shortName: 'Dev',
  // used for canonical links, sitemap, and the Open Graph image
  url: 'https://TODO-DOMAIN.vercel.app',
  tagline: 'Freshly brewed backend systems, served reliably',
  subline: 'Devam Dholakia · CS @ UCF · Backend & Distributed Systems',
  role: 'Computer Science student at UCF, focused on backend infrastructure and distributed systems',
  description:
    'Portfolio of Devam Dholakia, a Computer Science student at UCF building backend infrastructure and distributed systems.',
  availability: 'Now Brewing: Open to Summer 2027 opportunities',
  bio: "Hi, I'm Dev. I'm a Computer Science student at UCF (graduating May 2028) who likes building systems that don't fall over: queues, retries, and services that recover on their own. Outside of code, you'll find me at hackathons, on the piano, or on the dance floor.",
  quickFacts: ['Based in Orlando, FL', "UCF '28", 'Java/Spring Boot'],
  education: {
    school: 'University of Central Florida',
    degree: 'B.S. Computer Science',
    dates: 'Graduating May 2028',
  },
  // drop a photo in /public and point to it here, e.g. '/dev.jpg'
  photo: '' as string,
  resumePath: '/resume.pdf',
  links: {
    email: 'TODO_EMAIL',
    github: 'https://github.com/devamdholakia',
    linkedin: 'TODO_LINKEDIN',
  },
}

// anything still starting with TODO_ renders as a visible placeholder chip
export const isTodo = (value?: string) => !value || value.startsWith('TODO_')
