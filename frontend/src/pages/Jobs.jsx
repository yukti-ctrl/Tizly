import React, { useState } from 'react';
import { Briefcase, Stethoscope, Code, Heart, ArrowRight } from 'lucide-react';

export default function Jobs() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // In the future, this will hit your /contact or /newsletter endpoint
    }
  };

  const careerPaths = [
    { 
      title: "Veterinary Care", 
      icon: <Stethoscope size={24} />, 
      desc: "Help us provide top-tier health services to our furry community." 
    },
    { 
      title: "Technology & Product", 
      icon: <Code size={24} />, 
      desc: "Build the future of pet-tech and seamless e-commerce experiences." 
    },
    { 
      title: "Operations & Logistics", 
      icon: <Briefcase size={24} />, 
      desc: "Ensure treats and essentials reach every pet parent on time." 
    },
    { 
      title: "Customer Happiness", 
      icon: <Heart size={24} />, 
      desc: "Be the voice of Tizly and help pet parents solve any problem." 
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.badge}>Hiring Soon</div>
        <h1 style={styles.title}>Join the Tizly Pack</h1>
        <p style={styles.subtitle}>
          We’re building the world's most loved pet care platform. <br />
          While our team is currently full, we’re always looking for talented pet lovers.
        </p>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.grid}>
          {careerPaths.map((path, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.iconBox}>{path.icon}</div>
              <h3 style={styles.cardTitle}>{path.title}</h3>
              <p style={styles.cardDesc}>{path.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.notifySection}>
          {submitted ? (
            <div style={styles.success}>
              <h3 style={{color: '#4db6ac'}}>Woof! You're on the list.</h3>
              <p>We'll email you as soon as new positions open up.</p>
            </div>
          ) : (
            <>
              <h3 style={{marginBottom: '10px'}}>Want to be the first to know?</h3>
              <p style={{color: '#666', marginBottom: '25px'}}>Leave your email and we'll notify you when we start hiring.</p>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                  type="email" 
                  placeholder="yourname@email.com" 
                  style={styles.input} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">
                  Notify Me <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '60px 8%', maxWidth: '1100px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '60px' },
  badge: { 
    backgroundColor: '#E9DCC9', 
    color: '#121212', 
    padding: '6px 16px', 
    borderRadius: '50px', 
    fontSize: '12px', 
    fontWeight: '800', 
    display: 'inline-block',
    marginBottom: '20px',
    textTransform: 'uppercase'
  },
  title: { fontSize: '56px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-2px' },
  subtitle: { fontSize: '18px', color: '#666', lineHeight: '1.6' },
  mainContent: { display: 'flex', flexDirection: 'column', gap: '40px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: '30px', 
    borderRadius: '32px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    textAlign: 'left'
  },
  iconBox: { 
    width: '50px', 
    height: '50px', 
    backgroundColor: '#F8F4F0', 
    borderRadius: '15px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: '20px',
    color: '#121212'
  },
  cardTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '10px' },
  cardDesc: { fontSize: '14px', color: '#666', lineHeight: '1.5' },
  notifySection: { 
    backgroundColor: '#121212', 
    color: '#fff', 
    padding: '50px', 
    borderRadius: '40px', 
    textAlign: 'center',
    marginTop: '20px'
  },
  form: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '15px', 
    flexWrap: 'wrap' 
  },
  input: { 
    padding: '14px 25px', 
    borderRadius: '12px', 
    border: 'none', 
    width: '100%', 
    maxWidth: '350px',
    fontSize: '16px',
    outline: 'none'
  },
  success: { padding: '20px' }
};