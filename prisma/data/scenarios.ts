import { Prisma } from '@prisma/client';

export const scenarios: Prisma.ScenarioCreateInput[] = [
  {
    title: 'Team Meeting Conflict Resolution',
    description: 'Practice resolving conflicts and maintaining professionalism in team meetings when disagreements arise',
    category: 'communication',
    difficulty: 2,
    duration: 15,
    dialogues: {
      create: [
        {
          role: 'user',
          content: 'I think we should implement Feature A first. It has the highest user demand.',
          timestamp: 1,
        },
        {
          role: 'ai',
          content: 'I understand your point about user demand. However, Feature B has technical dependencies that we need to address first. What if we discuss this with the team?',
          timestamp: 2,
        },
        {
          role: 'user',
          content: 'But if we delay Feature A, we might lose market opportunity!',
          timestamp: 3,
        },
        {
          role: 'ai',
          content: 'That\'s a valid concern. How can we balance technical dependencies with market timing?',
          timestamp: 4,
        },
      ],
    },
    questions: {
      create: [
        {
          content: 'How would you respond to the concern about losing market opportunity?',
          order: 1,
          options: {
            create: [
              {
                content: 'Insist on implementing Feature A immediately to avoid market loss',
                isCorrect: false,
                order: 1,
              },
              {
                content: 'Acknowledge the concern and propose a hybrid approach that addresses both',
                isCorrect: true,
                order: 2,
              },
              {
                content: 'Suggest we pause the entire project until dependencies are resolved',
                isCorrect: false,
                order: 3,
              },
            ],
          },
        },
        {
          content: 'What approach would you take to balance technical and business priorities?',
          order: 2,
          options: {
            create: [
              {
                content: 'Always prioritize business needs over technical constraints',
                isCorrect: false,
                order: 1,
              },
              {
                content: 'Find a middle ground that balances technical feasibility with business goals',
                isCorrect: true,
                order: 2,
              },
              {
                content: 'Always follow technical dependencies strictly regardless of business needs',
                isCorrect: false,
                order: 3,
              },
            ],
          },
        },
      ],
    },
  },
  {
    title: 'Client Presentation Feedback',
    description: 'Learn to deliver constructive feedback to clients during presentation reviews',
    category: 'communication',
    difficulty: 3,
    duration: 20,
  },
  {
    title: 'Project Crisis Management',
    description: 'Handle unexpected project setbacks and communicate with stakeholders',
    category: 'problem-solving',
    difficulty: 4,
    duration: 25,
  },
  {
    title: 'Team Member Onboarding',
    description: 'Practice effective onboarding and integration of new team members',
    category: 'leadership',
    difficulty: 2,
    duration: 15,
  },
  {
    title: 'Remote Team Collaboration',
    description: 'Navigate challenges in remote team communication and collaboration',
    category: 'teamwork',
    difficulty: 3,
    duration: 18,
  },
];