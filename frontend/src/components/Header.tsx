import React from 'react'

const Header: React.FC = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '16px',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>AI Career Soft Skills Coach</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Enhance your professional skills with AI-powered training</p>
        </div>
        <nav>
          <span style={{ marginRight: '20px', cursor: 'pointer' }}>Home</span>
          <span style={{ marginRight: '20px', cursor: 'pointer' }}>Scenarios</span>
          <span style={{ marginRight: '20px', cursor: 'pointer' }}>Dashboard</span>
          <span style={{ cursor: 'pointer' }}>Profile</span>
        </nav>
      </div>
    </header>
  )
}

export default Header