// change the cafe name here and it updates everywhere
export const CAFE_NAME = 'The Uptime Café'

export const site = {
  cafeName: CAFE_NAME,
  name: 'Devam Dholakia',
  shortName: 'Devam',
  // used for canonical links, sitemap, and the Open Graph image
  url: 'https://TODO-DOMAIN.vercel.app',
  tagline: 'Freshly brewed backend systems, served reliably',
  subline: 'Devam Dholakia · CS @ UCF · Backend & Distributed Systems',
  heroLine: 'CS @ UCF · Backend & Distributed Systems · Orlando, FL',
  role: 'Computer Science student at UCF, focused on backend infrastructure and distributed systems',
  description:
    'Portfolio of Devam Dholakia, a Computer Science student at UCF building backend infrastructure and distributed systems.',
  availability: 'Now Brewing: Open to Summer 2027 opportunities',
  bio: "Hi, I'm Devam. I'm a Computer Science student at UCF (graduating May 2028) who likes building systems that don't fall over: queues, retries, and services that recover on their own. Outside of code, you'll find me at hackathons, on the pickleball court, or travelling.",
  // short badges shown under the name in the hero and in Recruiter Mode
  highlights: ['2x Hackathon Winner', 'GPA 3.93'],
  quickFacts: ['Based in Orlando, FL', "UCF '28", 'GPA 3.93', '2x Hackathon Winner', 'Java/Spring Boot'],
  education: {
    school: 'University of Central Florida',
    degree: 'B.S. Computer Science',
    gpa: '3.93',
    dates: 'Aug 2024 to May 2028',
  },
  // drop a photo in /public and point to it here, e.g. '/dev.jpg'
  photo: '/devam.jpg' as string,
  // cut-out illustration with a transparent background, used in the hero. Leave empty to use the photo there
  avatar: '/avatar.png' as string,
  resumePath: '/resume.pdf',
  links: {
    email: 'devd4312@gmail.com',
    github: 'https://github.com/devamdholakia',
    linkedin: 'https://linkedin.com/in/devam-dholakia',
  },
}

// anything still starting with TODO_ renders as a visible placeholder chip
export const isTodo = (value?: string) => !value || value.startsWith('TODO_')
