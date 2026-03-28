import React, { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  joinedDate: string
  level: number
  experience: number
  totalSessions: number
  completedScenarios: string[]
  skills: {
    name: string
    level: number
    progress: number
  }[]
  preferences: {
    language: string
    difficulty: string
    focusAreas: string[]
  }
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: '',
    difficulty: '',
    focusAreas: [] as string[]
  })

  useEffect(() => {
    const mockProfile: UserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatar.jpg',
      joinedDate: '2026-01-15',
      level: 5,
      experience: 1250,
      totalSessions: 15,
      completedScenarios: ['Team Communication', 'Conflict Resolution', 'Time Management'],
      skills: [
        { name: 'Communication', level: 3, progress: 85 },
        { name: 'Leadership', level: 2, progress: 72 },
        { name: 'Teamwork', level: 4, progress: 90 },
        { name: 'Problem Solving', level: 3, progress: 68 },
        { name: 'Time Management', level: 3, progress: 82 }
      ],
      preferences: {
        language: 'English',
        difficulty: 'Adaptive',
        focusAreas: ['Communication', 'Leadership']
      }
    }
    setProfile(mockProfile)
    setFormData({
      name: mockProfile.name,
      email: mockProfile.email,
      language: mockProfile.preferences.language,
      difficulty: mockProfile.preferences.difficulty,
      focusAreas: [...mockProfile.preferences.focusAreas]
    })
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFocusAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const handleSave = () => {
    if (profile) {
      setProfile({
        ...profile,
        name: formData.name,
        email: formData.email,
        preferences: {
          language: formData.language,
          difficulty: formData.difficulty,
          focusAreas: formData.focusAreas
        }
      })
      setIsEditing(false)
    }
  }

  const getLevelProgress = (currentExp: number) => {
    const levelExp = currentExp % 1000
    const nextLevelExp = 1000
    return (levelExp / nextLevelExp) * 100
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading profile...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#1976d2' }}>
        Profile
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        <div>
          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#e0e0e0',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#666'
            }}>
              {profile.name.charAt(0)}
            </div>
            
            <h2 style={{ fontSize: '24px', marginBottom: '5px', color: '#333' }}>
              {profile.name}
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              {profile.email}
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Level {profile.level}
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
                    width: `${getLevelProgress(profile.experience)}%`,
                    height: '100%',
                    backgroundColor: '#1976d2',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {profile.experience % 1000}/1000 XP to next level
              </div>
            </div>

            <div style={{ display: 'grid', gap: '15px', fontSize: '14px' }}>
              <div>
                <strong>Joined:</strong> {new Date(profile.joinedDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Sessions:</strong> {profile.totalSessions}
              </div>
              <div>
                <strong>Completed:</strong> {profile.completedScenarios.length} scenarios
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', color: '#333' }}>
                {isEditing ? 'Edit Profile' : 'Account Information'}
              </h2>
              <button
                onClick={handleEditToggle}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isEditing ? '#4caf50' : '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Adaptive">Adaptive</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Focus Areas</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                    {['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management', 'Conflict Resolution'].map((area) => (
                      <label key={area} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.focusAreas.includes(area)}
                          onChange={() => handleFocusAreaToggle(area)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px' }}>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <strong>Name:</strong> {profile.name}
                </div>
                <div>
                  <strong>Email:</strong> {profile.email}
                </div>
                <div>
                  <strong>Language:</strong> {profile.preferences.language}
                </div>
                <div>
                  <strong>Difficulty:</strong> {profile.preferences.difficulty}
                </div>
                <div>
                  <strong>Focus Areas:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {profile.preferences.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
              Skills Progress
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${skill.level >= 3 ? '#4caf50' : skill.level >= 2 ? '#ff9800' : '#2196f3'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                      {skill.name}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: skill.level >= 3 ? '#e8f5e8' : skill.level >= 2 ? '#fff3e0' : '#e3f2fd',
                      color: skill.level >= 3 ? '#2e7d32' : skill.level >= 2 ? '#f57c00' : '#1976d2',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Level {skill.level}
                    </span>
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
                        width: `${skill.progress}%`,
                        height: '100%',
                        backgroundColor: skill.progress >= 80 ? '#4caf50' : skill.progress >= 60 ? '#ff9800' : '#2196f3',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {skill.progress}% mastery
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile