import { Prisma } from '@prisma/client';

export const dialogues: Prisma.DialogueCreateManyInput[] = [
  // Scenario 1: Team Meeting Conflict Resolution
  {
    id: '1',
    scenarioId: '1',
    role: 'user',
    content: 'I think we should implement Feature A first. It has the highest user demand.',
    timestamp: 1,
  },
  {
    id: '2',
    scenarioId: '1',
    role: 'ai',
    content: 'I understand your point about user demand. However, Feature B has technical dependencies that we need to address first. What if we discuss this with the team?',
    timestamp: 2,
  },
  {
    id: '3',
    scenarioId: '1',
    role: 'user',
    content: 'But if we delay Feature A, we might lose market opportunity!',
    timestamp: 3,
  },
  {
    id: '4',
    scenarioId: '1',
    role: 'ai',
    content: 'That\'s a valid concern. How can we balance technical dependencies with market timing?',
    timestamp: 4,
  },
  
  // Scenario 2: Client Presentation Feedback
  {
    id: '5',
    scenarioId: '2',
    role: 'user',
    content: 'We\'ve completed the presentation as requested. What are your thoughts?',
    timestamp: 1,
  },
  {
    id: '6',
    scenarioId: '2',
    role: 'ai',
    content: 'The presentation structure is good, but I\'d like to see more data visualization and specific metrics. Could you enhance those sections?',
    timestamp: 2,
  },
  {
    id: '7',
    scenarioId: '2',
    role: 'user',
    content: 'I\'ll add more charts and include the KPI data we discussed.',
    timestamp: 3,
  },
  {
    id: '8',
    scenarioId: '2',
    role: 'ai',
    content: 'Perfect! Can you also provide a timeline for implementation?',
    timestamp: 4,
  },
];