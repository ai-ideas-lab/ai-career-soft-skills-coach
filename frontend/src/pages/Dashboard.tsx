import React, { useState, useEffect } from 'react'

interface Session {
  id: string
  scenarioId: string
  scenarioTitle: string
  startTime: string
  endTime?: string
  duration: number
  score: number
  status: 'completed' | 'in-progress' | 'failed'
  skills: string[]
  feedback: string
}

interface Progress {
  totalSessions: number
  completedSessions: number
  averageScore: number
  skillProgress: Record<string, number>
  recentActivity: Session[]
}

const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockProgress: Progress = {
      totalSessions: 15,
      completedSessions: 12,
      averageScore: 78.5,
      skillProgress: {
        'Communication': 85,
        'Leadership': 72,
        'Teamwork': 90,
        'Problem Solving': 68,
        'Time Management': 82,
        'Conflict Resolution': 75
      },
      recentActivity: [
        {
          id: '1',
          scenarioId: '1',
          scenarioTitle: 'Team Communication',
          startTime: '2026-03-28T10:30:00Z',
          endTime: '2026-03-28T10:45:00Z',
          duration: 15,
          score: 88,
          status: 'completed',
          skills: ['Active Listening', 'Clear Communication'],
          feedback: 'Great job on active listening! Focus on asking more clarifying questions.'
        },
        {
          id: '2',
          scenarioId: '2',
          scenarioTitle: 'Conflict Resolution',
          startTime: '2026-03-27T14:20:00Z',
          endTime: '2026-03-27T14:40:00Z',
          duration: 20,
          score: 75,
          status: 'completed',
          skills: ['Conflict Resolution', 'Negotiation'],
          feedback: 'Good approach to the conflict. Consider more collaborative solutions.'
        },
        {
          id: '3',
          scenarioId: '3',
          scenarioTitle: 'Leadership Skills',
          startTime: '2026-03-26T09:15:00Z',
          status: 'in-progress',
          duration: 0,
          score: 0,
          skills: ['Delegation', 'Motivation'],
          feedback: ''
        }
      ]
    }
    setProgress(mockProgress)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50'
      case 'in-progress': return '#ff9800'
      case 'failed': return '#f44336'
      default: return '#666'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#1976d2' }}>
        Training Dashboard
      </h1>

      {progress && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
                {progress.totalSessions}
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>Total Sessions</div>
            </div>
            
            <div style={{
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4caf50', marginBottom: '10px' }}>
                {progress.completedSessions}
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>Completed</div>
            </div>
            
            <div style={{
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff9800', marginBottom: '10px' }}>
                {progress.averageScore.toFixed(1)}%
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>Average Score</div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Skill Progress</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.entries(progress.skillProgress).map(([skill, percentage]) => (
                <div key={skill} style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{skill}</h3>
                    <span style={{ fontSize: '14px', color: '#666' }}>{percentage}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: percentage >= 80 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#2196f3',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Recent Activity</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {progress.recentActivity.map((session) => (
                <div key={session.id} style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${getStatusColor(session.status)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                        {session.scenarioTitle}
                      </h3>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                        <span>📅 {formatDate(session.startTime)}</span>
                        {session.duration > 0 && <span>⏱️ {formatDuration(session.duration)}</span>}
                        <span style={{ color: getStatusColor(session.status) }}>
                          {session.status === 'completed' ? '✅ Completed' : 
                           session.status === 'in-progress' ? '🔄 In Progress' : '❌ Failed'}
                        </span>
                      </div>
                    </div>
                    {session.score > 0 && (
                      <div style={{
                        padding: '8px 16px',
                        backgroundColor: session.score >= 80 ? '#e8f5e8' : session.score >= 60 ? '#fff3e0' : '#ffebee',
                        borderRadius: '20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: session.score >= 80 ? '#2e7d32' : session.score >= 60 ? '#f57c00' : '#c62828'
                      }}>
                        {session.score}%
                      </div>
                    )}
                  </div>
                  
                  {session.skills.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {session.skills.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#f5f5f5',
                              color: '#666',
                              borderRadius: '12px',
                              fontSize: '12px',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {session.feedback && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: '#666',
                      marginTop: '10px'
                    }}>
                      <strong>Feedback:</strong> {session.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard