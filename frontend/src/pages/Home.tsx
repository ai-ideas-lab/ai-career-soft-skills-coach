import React from 'react'

const Home: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#1976d2' }}>
          AI Career Soft Skills Coach
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Master essential soft skills through AI-powered interactive training scenarios. 
          Enhance your communication, leadership, and teamwork skills.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
            Start Training
          </button>
          <button style={{
            padding: '12px 24px',
            backgroundColor: 'white',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
            Learn More
          </button>
        </div>
      </section>

      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>
            Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              {
                title: 'AI-Powered Training',
                description: 'Realistic workplace scenarios with intelligent feedback'
              },
              {
                title: 'Personalized Learning',
                description: 'Adaptive training based on your skill level and goals'
              },
              {
                title: 'Comprehensive Skills',
                description: 'Cover communication, leadership, teamwork, and more'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#1976d2' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>
            Training Scenarios
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {[
              {
                title: 'Team Communication',
                description: 'Practice effective communication in team settings',
                duration: '15-20 minutes',
                level: 'Beginner'
              },
              {
                title: 'Conflict Resolution',
                description: 'Handle workplace conflicts professionally',
                duration: '20-25 minutes',
                level: 'Intermediate'
              },
              {
                title: 'Leadership Skills',
                description: 'Develop leadership abilities in various scenarios',
                duration: '25-30 minutes',
                level: 'Advanced'
              }
            ].map((scenario, index) => (
              <div key={index} style={{
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: `2px solid ${index % 2 === 0 ? '#1976d2' : '#dc004e'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: index % 2 === 0 ? '#1976d2' : '#dc004e',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {scenario.level}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {scenario.duration}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                  {scenario.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  {scenario.description}
                </p>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: index % 2 === 0 ? '#1976d2' : '#dc004e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  Start Scenario
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home