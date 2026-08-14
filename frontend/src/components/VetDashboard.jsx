import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

export default function VetDashboard() {
  return (
    <div>
      <h3 style={{marginBottom: '20px'}}>Vet Schedule</h3>
      <div style={{backgroundColor: '#fff', padding: '40px', borderRadius: '32px', textAlign:'center'}}>
        <Calendar size={48} color="#ccc" style={{marginBottom:'15px'}} />
        <p style={{color: '#888'}}>No upcoming appointments for today.</p>
      </div>
    </div>
  );
}