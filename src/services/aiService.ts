import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIServiceInput {
  scenarioId: string;
  userId: string;
  userInput: string;
  dialogueContext?: Array<{ role: string; content: string; timestamp: number }>;
}

export interface AIResponse {
  response: string;
  score?: number;
  feedback?: string;
  suggestions?: string[];
}

export class AIService {
  /**
   * Generate scenario-specific dialogue response
   */
  async generateDialogueResponse(input: AIServiceInput): Promise<AIResponse> {
    try {
      // Get scenario details
      const scenario = await prisma.scenario.findUnique({
        where: { id: input.scenarioId },
        include: {
          questions: {
            include: { options: true }
          }
        }
      });

      if (!scenario) {
        throw new Error('Scenario not found');
      }

      // Prepare context for AI
      const context = {
        scenario: {
          title: scenario.title,
          description: scenario.description,
          category: scenario.category,
          difficulty: scenario.difficulty
        },
        dialogue: input.dialogueContext || [],
        userResponse: input.userInput
      };

      const prompt = this.generateDialoguePrompt(context);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(scenario.category, scenario.difficulty)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      
      return {
        response: response || "I understand your response. Let me help you with this scenario.",
        score: this.evaluateResponse(response || "", scenario),
        feedback: this.generateFeedback(response || "", scenario),
        suggestions: this.generateSuggestions(response || "", scenario)
      };
    } catch (error) {
      console.error('AI dialogue generation error:', error);
      return {
        response: "I'm having trouble processing your response right now. Please try again.",
        score: 0,
        feedback: "There was an error processing your response. Please try again later."
      };
    }
  }

  /**
   * Generate multiple-choice question response evaluation
   */
  async evaluateQuestionResponse(input: AIServiceInput, questionId: string): Promise<AIResponse> {
    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { 
          options: true,
          scenario: true 
        }
      });

      if (!question) {
        throw new Error('Question not found');
      }

      const prompt = this.generateQuestionEvaluationPrompt({
        question,
        userResponse: input.userInput,
        dialogueContext: input.dialogueContext
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert career coach evaluating responses to scenario-based questions. Provide constructive feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.6
      });

      const response = completion.choices[0].message.content;
      
      // Check if response matches any correct option
      const correctOption = question.options.find(opt => opt.isCorrect);
      const isCorrect = Boolean(correctOption && input.userInput.toLowerCase().includes(correctOption.content.toLowerCase()));
      
      return {
        response: response || "",
        score: isCorrect ? 10 : (correctOption ? 5 : 0),
        feedback: this.generateQuestionFeedback(response || "", isCorrect, question),
        suggestions: this.generateQuestionSuggestions(response || "", question)
      };
    } catch (error) {
      console.error('AI question evaluation error:', error);
      return {
        response: "Unable to evaluate your response at this time.",
        score: 0,
        feedback: "There was an error evaluating your response."
      };
    }
  }

  /**
   * Generate personalized career coaching feedback
   */
  async generatePersonalizedFeedback(userId: string, scenarioId: string): Promise<string> {
    try {
      // Get user's session history and progress
      const userSessions = await prisma.session.findMany({
        where: { userId, scenarioId },
        include: { 
          scenario: true,
          feedback: true 
        },
        orderBy: { createdAt: 'desc' }
      });

      const overallProgress = await prisma.progress.findMany({
        where: { userId, scenarioId }
      });

      const prompt = this.generateCoachingPrompt({
        userSessions,
        overallProgress,
        userId
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an experienced career coach providing personalized feedback based on user's performance in scenario training."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.8
      });

      return completion.choices[0].message.content || "Unable to generate personalized feedback at this time.";
    } catch (error) {
      console.error('AI coaching feedback error:', error);
      return "Unable to generate personalized feedback at this time.";
    }
  }

  /**
   * Generate personalized AI recommendations for user
   */
  async generateRecommendations(params: {
    progress: any[];
    sessions: any[];
    userId: string;
  }): Promise<any> {
    try {
      const prompt = `
Analyze this user's career soft skills training data and provide personalized recommendations:

Progress Summary:
${params.progress.map((p: any) => `
- Scenario: ${p.scenario.title}
- Status: ${p.completed ? 'Completed' : 'In Progress'}
- Best Score: ${p.score}/10
- Time Spent: ${p.timeSpent} seconds
`).join('\n')}

Session Performance:
${params.sessions.map((s: any) => `
- Scenario: ${s.scenario.title}
- Score: ${s.score}/10
- Progress: ${s.progress}%
- Status: ${s.status}
`).join('\n')}

Based on this data, provide:
1. Recommended scenarios to focus on next
2. Areas for improvement
3. Learning path suggestions
4. Practice frequency recommendations
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI career coach analyzing user performance data to provide personalized learning recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content || "";
      
      return this.parseRecommendations(response);
    } catch (error) {
      console.error('AI recommendations error:', error);
      return {
        scenarios: [],
        improvements: [],
        learningPath: [],
        practiceFrequency: '2-3 times per week'
      };
    }
  }

  /**
   * Generate scenario content dynamically
   */
  async generateScenarioTemplate(category: string, difficulty: number, topic: string): Promise<any> {
    try {
      const prompt = `Generate a career soft skills scenario template with the following specifications:
- Category: ${category}
- Difficulty level: ${difficulty} (1-5, where 1 is beginner, 5 is expert)
- Topic: ${topic}
- Include dialogue elements and multiple-choice questions
- Focus on realistic workplace scenarios
- Provide proper formatting for database insertion`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert instructional designer creating workplace scenario templates for soft skills training."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content || "";
      
      // Parse and format the response
      return this.parseScenarioTemplate(response);
    } catch (error) {
      console.error('Scenario generation error:', error);
      throw new Error('Unable to generate scenario template');
    }
  }

  // Helper methods
  private generateDialoguePrompt(context: any): string {
    return `
Scenario: ${context.scenario.title}
Description: ${context.scenario.description}
Category: ${context.scenario.category}
Difficulty: ${context.scenario.difficulty}/5

Previous dialogue:
${context.dialogue.map((d: any) => `${d.role}: ${d.content}`).join('\n')}

User's latest response: ${context.userResponse}

Please provide an appropriate response that:
1. Maintains professional tone
2. Addresses the scenario context
3. Provides constructive guidance
4. Moves the scenario forward
`;
  }

  private generateQuestionEvaluationPrompt(params: any): string {
    return `
Question: ${params.question.content}
Options: ${params.question.options.map((opt: any) => `${opt.order}. ${opt.content}`).join('\n')}
User's response: ${params.userResponse}

Previous context: ${params.dialogueContext?.map((d: any) => d.content).join(' ') || 'None'}

Evaluate the user's response and provide constructive feedback on:
1. Relevance to the scenario
2. Appropriate tone and professionalism
3. Problem-solving approach
4. Communication effectiveness
`;
  }

  private generateCoachingPrompt(params: any): string {
    return `
Analyze this user's performance in career soft skills training:

Recent sessions:
${params.userSessions.map((session: any) => `
- Scenario: ${session.scenario.title}
- Score: ${session.score}/10
- Progress: ${session.progress}%
- Status: ${session.status}
- Feedback: ${session.feedback.map((f: any) => f.content).join('; ') || 'None'}
`).join('\n')}

Progress tracking:
${params.overallProgress.map((progress: any) => `
- Scenario: ${progress.scenario.title}
- Completed: ${progress.completed}
- Best score: ${progress.score}
- Time spent: ${progress.timeSpent} seconds
`).join('\n')}

Provide personalized coaching feedback highlighting:
1. Strengths demonstrated
2. Areas for improvement
3. Recommended focus areas
4. Overall progression
`;
  }

  private getSystemPrompt(category: string, difficulty: number): string {
    const difficultyPrompts = {
      1: "You are a supportive career coach for beginners. Be encouraging and provide clear guidance.",
      2: "You are an experienced career coach. Provide balanced feedback and practical advice.",
      3: "You are a senior career coach. Challenge the user with thoughtful questions and insights.",
      4: "You are an executive career coach. Provide sophisticated feedback and strategic insights.",
      5: "You are a C-suite career coach. Deliver high-level strategic coaching and mentorship."
    };

    const categoryPrompts = {
      'communication': "Focus on effective communication skills, clarity, and professional interaction.",
      'teamwork': "Emphasize collaboration, team dynamics, and collective problem-solving.",
      'leadership': "Guide towards leadership qualities, decision-making, and team management.",
      'problem-solving': "Focus on analytical thinking, creative solutions, and systematic approaches."
    };

    return `${difficultyPrompts[difficulty as keyof typeof difficultyPrompts]} ${categoryPrompts[category as keyof typeof categoryPrompts]}`;
  }

  private evaluateResponse(response: string, scenario: any): number {
    // Simple scoring based on response length and relevance
    const baseScore = 5;
    const lengthBonus = Math.min(response.length / 50, 3); // Max 3 points for length
    const categoryBonus = this.getCategoryBonus(scenario.category);
    
    return Math.min(baseScore + lengthBonus + categoryBonus, 10);
  }

  private generateFeedback(response: string, scenario: any): string {
    const feedbackTemplates = {
      'communication': "Your response shows good communication skills. Consider focusing on clarity and active listening.",
      'teamwork': "Great teamwork approach! Think about how to better collaborate with different personality types.",
      'leadership': "Strong leadership potential! Focus on decision-making under pressure.",
      'problem-solving': "Good problem-solving approach. Consider more creative alternatives."
    };

    return feedbackTemplates[scenario.category as keyof typeof feedbackTemplates] || "Good effort! Keep practicing to improve your skills.";
  }

  private generateSuggestions(response: string, scenario: any): string[] {
    return [
      "Practice similar scenarios to build confidence",
      "Focus on the specific skills required for this category",
      "Seek feedback from peers or mentors",
      "Reflect on real-world applications of these skills"
    ];
  }

  private generateQuestionFeedback(response: string, isCorrect: boolean, question: any): string {
    if (isCorrect) {
      return "Excellent choice! This demonstrates good understanding of the scenario requirements.";
    } else {
      return "Consider the scenario context and think about the most appropriate response for this situation.";
    }
  }

  private generateQuestionSuggestions(response: string, question: any): string[] {
    return [
      "Read the question carefully and consider all options",
      "Think about the scenario context and professional expectations",
      "Consider the long-term impact of your choices"
    ];
  }

  private getCategoryBonus(category: string): number {
    const bonuses = {
      'communication': 1,
      'teamwork': 1,
      'leadership': 2,
      'problem-solving': 1.5
    };
    return bonuses[category as keyof typeof bonuses] || 1;
  }

  private parseRecommendations(response: string): any {
    try {
      const lines = response.split('\n');
      const recommendations: any = {
        scenarios: [],
        improvements: [],
        learningPath: [],
        practiceFrequency: '2-3 times per week'
      };

      let currentSection = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes('recommended scenarios') || 
            trimmed.toLowerCase().includes('scenarios to focus')) {
          currentSection = 'scenarios';
        } else if (trimmed.toLowerCase().includes('areas for improvement')) {
          currentSection = 'improvements';
        } else if (trimmed.toLowerCase().includes('learning path')) {
          currentSection = 'learningPath';
        } else if (trimmed.toLowerCase().includes('practice frequency')) {
          currentSection = 'frequency';
        } else if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
          if (currentSection === 'scenarios' && trimmed.includes(':')) {
            recommendations.scenarios.push(trimmed);
          } else if (currentSection === 'improvements') {
            recommendations.improvements.push(trimmed);
          } else if (currentSection === 'learningPath') {
            recommendations.learningPath.push(trimmed);
          } else if (currentSection === 'frequency' && trimmed.includes(':')) {
            recommendations.practiceFrequency = trimmed.split(':')[1]?.trim() || recommendations.practiceFrequency;
          }
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Failed to parse recommendations:', error);
      return {
        scenarios: [],
        improvements: [],
        learningPath: [],
        practiceFrequency: '2-3 times per week'
      };
    }
  }

  private parseScenarioTemplate(response: string): any {
    // This is a simplified parser - in production, you'd want more robust parsing
    try {
      const lines = response.split('\n');
      const scenario: any = {
        title: '',
        description: '',
        category: '',
        difficulty: 2,
        duration: 15,
        dialogues: [],
        questions: []
      };

      let currentSection = '';
      for (const line of lines) {
        if (line.includes('Title:')) {
          scenario.title = line.split(':')[1]?.trim() || '';
        } else if (line.includes('Description:')) {
          scenario.description = line.split(':')[1]?.trim() || '';
        } else if (line.includes('Category:')) {
          scenario.category = line.split(':')[1]?.trim() || '';
        }
      }

      return scenario;
    } catch (error) {
      throw new Error('Failed to parse scenario template');
    }
  }
}