import { Prisma } from '@prisma/client';

export const scenarios: Prisma.ScenarioCreateManyInput[] = [
  {
    id: '1',
    title: 'Team Meeting Conflict Resolution',
    description: 'Practice resolving conflicts and maintaining professionalism in team meetings when disagreements arise',
    category: 'communication',
    difficulty: 2,
    duration: 15,
  },
  {
    id: '2',
    title: 'Client Presentation Feedback',
    description: 'Learn to deliver constructive feedback to clients during presentation reviews',
    category: 'communication',
    difficulty: 3,
    duration: 20,
  },
  {
    id: '3',
    title: 'Project Crisis Management',
    description: 'Handle unexpected project setbacks and communicate with stakeholders',
    category: 'problem-solving',
    difficulty: 4,
    duration: 25,
  },
  {
    id: '4',
    title: 'Team Member Onboarding',
    description: 'Practice effective onboarding and integration of new team members',
    category: 'leadership',
    difficulty: 2,
    duration: 15,
  },
  {
    id: '5',
    title: 'Remote Team Collaboration',
    description: 'Navigate challenges in remote team communication and collaboration',
    category: 'teamwork',
    difficulty: 3,
    duration: 18,
  },
];