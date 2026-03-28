import React, { useState, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Scenario {
  id: string
  title: string
  description: string
  objective: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  dialog: Message[]
  questions: Question[]
}

const Session: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userMessage, setUserMessage] = useState('')
  const [dialog, setDialog] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  useEffect(() => {
    const mockScenario: Scenario = {
      id: '1',
      title: 'Team Communication',
      description: 'Practice effective communication in a team setting',
      objective: 'Develop active listening and clear communication skills',
      difficulty: 'Beginner',
      duration: 15,
      dialog: [
        {
          id: '1',
          role: 'ai',
          content: 'Welcome to the Team Communication scenario! You are a team member in a project meeting where different opinions are being expressed. Your goal is to demonstrate active listening and contribute constructively to the discussion.',
          timestamp: '2026-03-28T10:30:00Z'
        }
      ],
      questions: [
        {
          id: '1',
          text: 'Your team member suggests a different approach to the project. How would you respond?',
          options: [
            'Immediately disagree and explain why your approach is better',
            'Listen carefully to understand their perspective before responding',
            'Change your opinion completely to avoid conflict',
            'Stay silent and let someone else handle it'
          ],
          correctAnswer: 1,
          explanation: 'Active listening involves understanding others\' perspectives before responding. This builds trust and leads to better collaboration.'
        },
        {
          id: '2',
          text: 'The discussion becomes tense with conflicting viewpoints. What should you do?',
          options: [
            'Take sides firmly with your position',
            'Suggest taking a short break to cool down',
            'Interrupt and redirect the conversation',
            'Let the most experienced person make the decision'
          ],
          correctAnswer: 1,
          explanation: 'Recognizing when emotions are running high and suggesting a break helps maintain a constructive environment for discussion.'
        }
      ]
    }
    setScenario(mockScenario)
  }, [])

  const handleSendMessage = () => {
    if (!userMessage.trim() || !scenario) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }

    setDialog([...dialog, newMessage])
    setUserMessage('')

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(userMessage, dialog.length),
        timestamp: new Date().toISOString()
      }
      setDialog(prev => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userMessage: string, step: number): string => {
    const responses = [
      'Great point! I appreciate you sharing your perspective. Can you elaborate on how this approach would address the challenges we discussed earlier?',
      'That\'s an interesting suggestion. To make sure I understand completely, could you walk me through how this would work in practice?',
      'I understand where you\'re coming from. Have you considered how this aligns with our project timeline and resources?',
      'Thank you for that contribution. How do you think this could be implemented while maintaining team collaboration?'
    ]
    return responses[step % responses.length]
  }

  const handleNextQuestion = () => {
    if (!scenario || currentQuestion) return

    if (currentStep < scenario.questions.length) {
      setCurrentQuestion(scenario.questions[currentStep])
    }
  }

  const handleAnswerQuestion = (optionIndex: number) => {
    if (!currentQuestion) return

    setSelectedOption(optionIndex)
    setShowFeedback(true)

    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    setQuestionsAnswered(questionsAnswered + 1)

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedOption(null)
      setCurrentQuestion(null)
      setCurrentStep(currentStep + 1)

      if (currentStep + 1 >= scenario.questions.length) {
        setSessionCompleted(true)
      } else {
        setTimeout(handleNextQuestion, 1000)
      }
    }, 3000)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setDialog([])
    setCurrentQuestion(null)
    setSelectedOption(null)
    setShowFeedback(false)
    setScore(0)
    setQuestionsAnswered(0)
    setSessionCompleted(false)
  }

  if (!scenario) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading scenario...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#1976d2' }}>
          {scenario.title}
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          {scenario.description}
        </p>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <span>📋 {scenario.objective}</span>
          <span>⏱️ {scenario.duration} min</span>
          <span>🎯 {scenario.difficulty}</span>
        </div>
      </div>

      {sessionCompleted ? (
        <div style={{
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#4caf50' }}>
            🎉 Session Completed!
          </h2>
          <div style={{ fontSize: '20px', marginBottom: '20px' }}>
            Your Score: <strong>{Math.round((score / scenario.questions.length) * 100)}%</strong>
          </div>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            You answered {score} out of {scenario.questions.length} questions correctly
          </div>
          <button
            onClick={handleRestart}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            View Dashboard
          </button>
        </div>
      ) : currentQuestion ? (
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
            Question {currentStep + 1} of {scenario.questions.length}
          </h3>
          <p style={{ fontSize: '16px', marginBottom: '25px', lineHeight: '1.5' }}>
            {currentQuestion.text}
          </p>
          
          <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswerQuestion(index)}
                disabled={showFeedback}
                style={{
                  padding: '15px 20px',
                  textAlign: 'left',
                  border: showFeedback && index === currentQuestion.correctAnswer ? '2px solid #4caf50' :
                          showFeedback && index === selectedOption ? '2px solid #f44336' :
                          '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: showFeedback && index === currentQuestion.correctAnswer ? '#e8f5e8' :
                                   showFeedback && index === selectedOption ? '#ffebee' :
                                   'white',
                  fontSize: '16px',
                  cursor: showFeedback ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #4caf50'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '10px', color: '#2e7d32' }}>
                {selectedOption === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>
              Instructions
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              In this scenario, you'll engage in a conversation where you need to demonstrate active listening and clear communication skills. 
              The AI will respond to your messages, and you'll be asked questions about your approach.
            </p>
            <button
              onClick={handleNextQuestion}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Start Training
            </button>
          </div>

          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
              Conversation
            </h3>
            <div style={{ height: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {dialog.length > 0 ? (
                dialog.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: message.role === 'user' ? '#1976d2' : '#f5f5f5',
                        color: message.role === 'user' ? 'white' : '#333',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  The conversation will start here. Click "Start Training" to begin.
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={dialog.length === 0}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userMessage.trim() || dialog.length === 0}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  disabled: !userMessage.trim() || dialog.length === 0
                }}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Session