import { Prisma } from '@prisma/client';

export const options: Prisma.OptionCreateManyInput[] = [
  // Question 1 options
  {
    id: '1',
    questionId: '1',
    content: 'Insist on implementing Feature A immediately to avoid market loss',
    isCorrect: false,
    order: 1,
  },
  {
    id: '2',
    questionId: '1',
    content: 'Acknowledge the concern and propose a hybrid approach that addresses both',
    isCorrect: true,
    order: 2,
  },
  {
    id: '3',
    questionId: '1',
    content: 'Suggest we pause the entire project until dependencies are resolved',
    isCorrect: false,
    order: 3,
  },
  
  // Question 2 options
  {
    id: '4',
    questionId: '2',
    content: 'Always prioritize business needs over technical constraints',
    isCorrect: false,
    order: 1,
  },
  {
    id: '5',
    questionId: '2',
    content: 'Find a middle ground that balances technical feasibility with business goals',
    isCorrect: true,
    order: 2,
  },
  {
    id: '6',
    questionId: '2',
    content: 'Always follow technical dependencies strictly regardless of business needs',
    isCorrect: false,
    order: 3,
  },
  
  // Question 3 options
  {
    id: '7',
    questionId: '3',
    content: 'Refuse and argue that the current presentation is sufficient',
    isCorrect: false,
    order: 1,
  },
  {
    id: '8',
    questionId: '3',
    content: 'Thank the client for the feedback and commit to enhancing the presentation',
    isCorrect: true,
    order: 2,
  },
  {
    id: '9',
    questionId: '3',
    content: 'Get defensive and explain why additional data is not possible',
    isCorrect: false,
    order: 3,
  },
  
  // Question 4 options
  {
    id: '10',
    questionId: '4',
    content: 'Provide a detailed timeline with specific milestones',
    isCorrect: true,
    order: 1,
  },
  {
    id: '11',
    questionId: '4',
    content: 'Give a vague response and promise to figure it out later',
    isCorrect: false,
    order: 2,
  },
  {
    id: '12',
    questionId: '4',
    content: 'Blame other teams for causing delays',
    isCorrect: false,
    order: 3,
  },
  
  // More options for remaining questions...
];