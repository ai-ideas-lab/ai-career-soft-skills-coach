import React, { useState, useEffect } from 'react'

interface Scenario {
  id: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  difficulty: number
  skills: string[]
}

const Scenarios: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const mockScenarios: Scenario[] = [
      {
        id: '1',
        title: 'Team Communication',
        description: 'Practice effective communication in team settings, including active listening and clear expression of ideas.',
        duration: '15-20 minutes',
        level: 'Beginner',
        category: 'Communication',
        difficulty: 3,
        skills: ['Active Listening', 'Clear Communication', 'Team Building']
      },
      {
        id: '2',
        title: 'Conflict Resolution',
        description: 'Handle workplace conflicts professionally by finding win-win solutions and maintaining positive relationships.',
        duration: '20-25 minutes',
        level: 'Intermediate',
        category: 'Conflict Management',
        difficulty: 5,
        skills: ['Conflict Resolution', 'Negotiation', 'Emotional Intelligence']
      },
      {
        id: '3',
        title: 'Leadership Skills',
        description: 'Develop leadership abilities through various scenarios including delegation, motivation, and strategic thinking.',
        duration: '25-30 minutes',
        level: 'Advanced',
        category: 'Leadership',
        difficulty: 7,
        skills: ['Delegation', 'Motivation', 'Strategic Thinking', 'Decision Making']
      },
      {
        id: '4',
        title: 'Presentation Skills',
        description: 'Master the art of public speaking through realistic presentation scenarios with audience interaction.',
        duration: '18-22 minutes',
        level: 'Intermediate',
        category: 'Communication',
        difficulty: 6,
        skills: ['Public Speaking', 'Presentation Design', 'Audience Engagement']
      },
      {
        id: '5',
        title: 'Negotiation Techniques',
        description: 'Learn effective negotiation strategies for business deals, salary discussions, and conflict resolution.',
        duration: '22-28 minutes',
        level: 'Advanced',
        category: 'Negotiation',
        difficulty: 8,
        skills: ['Negotiation', 'Persuasion', 'Value Creation', 'Relationship Building']
      },
      {
        id: '6',
        title: 'Time Management',
        description: 'Develop effective time management skills through realistic workplace scenarios and prioritization challenges.',
        duration: '12-18 minutes',
        level: 'Beginner',
        category: 'Productivity',
        difficulty: 2,
        skills: ['Time Management', 'Prioritization', 'Planning', 'Organization']
      }
    ]
    setScenarios(mockScenarios)
    setFilteredScenarios(mockScenarios)
  }, [])

  useEffect(() => {
    let filtered = scenarios

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(s => s.level === selectedLevel)
    }

    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredScenarios(filtered)
  }, [scenarios, selectedCategory, selectedLevel, searchQuery])

  const categories = ['all', ...Array.from(new Set(scenarios.map(s => s.category)))]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#1976d2' }}>
          Training Scenarios
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          Browse our collection of AI-powered soft skills training scenarios
        </p>

        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search scenarios, skills, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '12px 16px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '10px', fontWeight: '500' }}>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: '10px', fontWeight: '500' }}>Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {filteredScenarios.map((scenario) => (
          <div key={scenario.id} style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: `2px solid ${scenario.level === 'Beginner' ? '#4caf50' : scenario.level === 'Intermediate' ? '#ff9800' : '#f44336'}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{
                padding: '4px 12px',
                backgroundColor: scenario.level === 'Beginner' ? '#4caf50' : scenario.level === 'Intermediate' ? '#ff9800' : '#f44336',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {scenario.level}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < scenario.difficulty ? '#ffc107' : '#e0e0e0',
                      fontSize: '16px',
                      marginRight: i < 4 ? '2px' : '0'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#333' }}>
              {scenario.title}
            </h3>
            
            <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>
              {scenario.description}
            </p>

            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#666', fontSize: '14px', marginRight: '10px' }}>
                ⏱️ {scenario.duration}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {scenario.category}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '8px' }}>
                Skills Practiced:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {scenario.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
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

            <button style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}>
              Start Training
            </button>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
            No scenarios found
          </h3>
          <p style={{ color: '#999' }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  )
}

export default Scenarios