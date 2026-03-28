import { Prisma } from '@prisma/client';

export const questions: Prisma.QuestionCreateManyInput[] = [
  // Scenario 1 questions
  {
    id: '1',
    scenarioId: '1',
    content: 'How would you respond to the concern about losing market opportunity?',
    order: 1,
  },
  {
    id: '2',
    scenarioId: '1',
    content: 'What approach would you take to balance technical and business priorities?',
    order: 2,
  },
  
  // Scenario 2 questions
  {
    id: '3',
    scenarioId: '2',
    content: 'How would you handle the client\'s request for more data visualization?',
    order: 1,
  },
  {
    id: '4',
    scenarioId: '2',
    content: 'What would you say when asked to provide a timeline for implementation?',
    order: 2,
  },
  
  // Scenario 3 questions
  {
    id: '5',
    scenarioId: '3',
    content: 'How do you communicate project delays to stakeholders?',
    order: 1,
  },
  {
    id: '6',
    scenarioId: '3',
    content: 'What steps would you take to mitigate the impact of the crisis?',
    order: 2,
  },
  
  // Scenario 4 questions
  {
    id: '7',
    scenarioId: '4',
    content: 'How would you welcome a new team member to the project?',
    order: 1,
  },
  {
    id: '8',
    scenarioId: '4',
    content: 'What information would you share to help them integrate quickly?',
    order: 2,
  },
  
  // Scenario 5 questions
  {
    id: '9',
    scenarioId: '5',
    content: 'How would you resolve communication issues in a remote team?',
    order: 1,
  },
  {
    id: '10',
    scenarioId: '5',
    content: 'What tools and practices would you recommend for better remote collaboration?',
    order: 2,
  },
];