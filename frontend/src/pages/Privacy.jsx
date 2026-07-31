import React from 'react';

export default function Privacy() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last Updated: July 2026</p>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p style={styles.text}>
            Welcome to Tizly ("we," "our," or "us"). We are committed to protecting the privacy of our pet parents and their furry friends. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Information We Collect</h2>
          <p style={styles.text}>
            To provide you with the best pet care experience, we collect the following types of information:
          </p>
          <ul style={styles.list}>
            <li><strong>Account Data:</strong> Name, email address, and profile photo provided via Firebase Authentication (Google or Email).</li>
            <li><strong>Pet Data:</strong> Pet names, types, and health reasons shared when booking Vetcare appointments.</li>
            <li><strong>Transaction Data:</strong> Shipping addresses and order history for e-commerce purchases.</li>
            <li><strong>Community Data:</strong> Content of your posts, comments, and likes shared in the Tizly Community.</li>
            <li><strong>Interaction Data:</strong> Chatbot logs and support inquiries to improve our automated assistance.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. How We Use Your Information</h2>
          <p style={styles.text}>
            Your data allows us to:
          </p>
          <ul style={styles.list}>
            <li>Process and deliver your pet supply orders.</li>
            <li>Schedule and manage appointments with our expert veterinarians.</li>
            <li>Personalize your experience and recommend products suited for your pet.</li>
            <li>Maintain a safe and engaging community for pet lovers.</li>
            <li>Communicate updates, security alerts, and promotional offers.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Data Sharing & Third Parties</h2>
          <p style={styles.text}>
            We do not sell your personal data. We only share information with trusted partners necessary to run our services:
          </p>
          <ul style={styles.list}>
            <li><strong>Firebase:</strong> For secure authentication and user management.</li>
            <li><strong>Veterinarians:</strong> Your pet's details are shared with the specific vet you book an appointment with.</li>
            <li><strong>Payment Processors:</strong> To safely process your transactions.</li>
            <li><strong>Cloud Providers:</strong> We use AWS to store images and app data securely.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Your Rights</h2>
          <p style={styles.text}>
            You have the right to access, update, or delete your personal information at any time. You can manage your profile settings within the app or contact our support team for a full data deletion request.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Security</h2>
          <p style={styles.text}>
            We implement industry-standard security measures, including SSL encryption and Firebase security protocols, to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Contact Us</h2>
          <p style={styles.text}>
            If you have any questions about this Privacy Policy, please reach out to us at:
          </p>
          <div style={styles.contactCard}>
            <p style={{margin: 0, fontWeight: '700'}}>Tizly Support Team</p>
            <p style={{margin: 0, color: '#666'}}>Coming Soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '60px 8%',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '10px',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: '#888',
    fontSize: '16px',
    fontWeight: '600',
  },
  content: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '15px',
    color: '#121212',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#444',
  },
  list: {
    paddingLeft: '20px',
    fontSize: '16px',
    lineHeight: '2',
    color: '#444',
  },
  contactCard: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#F8F4F0',
    borderRadius: '16px',
    display: 'inline-block',
  }
};