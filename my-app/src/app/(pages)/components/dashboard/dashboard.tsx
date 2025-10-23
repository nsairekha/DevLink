import React from 'react'

import './dashboard.css'

import Sidebar from '../sidebar/sidebar'

const Dashboard = ({ children } : any) => {
  return (
    <div className="DashboardComponent">    
        <div className="DashboardComponent-in">
            <div className="dashboard-one">
                <Sidebar />
            </div>
            <div className="dashboard-two">
                {children}
            </div>
        </div>
    </div>
  )
}

export default Dashboard