import React from 'react';

export default function Terms() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.subtitle}>Effective Date: July 2024</p>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p style={styles.text}>
            By accessing or using Tizly, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. These terms apply to all visitors, users, and others who access the service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. User Accounts & Security</h2>
          <p style={styles.text}>
            Tizly uses Firebase Authentication for secure access. You are responsible for maintaining the confidentiality of your account. You agree to provide accurate information and update it as necessary. We reserve the right to suspend accounts that provide false information or violate our community standards.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Marketplace & Third-Party Vendors</h2>
          <p style={styles.text}>
            Tizly operates as a platform connecting pet owners with products and services. 
          </p>
          <ul style={styles.list}>
            <li><strong>Products:</strong> While we curate our shop, some items may be fulfilled by third-party vendors. Tizly is not liable for manufacturing defects but will facilitate returns according to our Refund Policy.</li>
            <li><strong>Vetcare:</strong> Veterinary services are provided by independent licensed professionals. Tizly provides the booking infrastructure but is not a medical provider. Any medical liability rests with the practicing veterinarian.</li>
            <li><strong>Delivery:</strong> We partner with third-party logistics to ensure your treats arrive on time. Delivery windows are estimates and subject to carrier conditions.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Community Guidelines</h2>
          <p style={styles.text}>
            Our Community is a place for love and support. You agree not to post content that is:
          </p>
          <ul style={styles.list}>
            <li>Abusive, defamatory, or harmful to animals or humans.</li>
            <li>Spam or unauthorized commercial solicitations.</li>
            <li>Infringing on the intellectual property of others.</li>
          </ul>
          <p style={styles.text}>We reserve the right to remove any content and ban users who violate these rules.</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Limitation of Liability</h2>
          <p style={styles.text}>
            Tizly and its affiliates will not be liable for any indirect, incidental, or punitive damages resulting from your use of the platform, including but not limited to the advice provided by third-party vets or the quality of third-party products.
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '60px 8%', maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '48px', fontWeight: '800', marginBottom: '10px' },
  subtitle: { color: '#888', fontSize: '16px', fontWeight: '600' },
  content: { backgroundColor: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '22px', fontWeight: '800', marginBottom: '15px' },
  text: { fontSize: '16px', lineHeight: '1.7', color: '#444' },
  list: { paddingLeft: '20px', fontSize: '16px', lineHeight: '2', color: '#444' }
};