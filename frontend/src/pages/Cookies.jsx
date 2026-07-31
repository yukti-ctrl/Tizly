import React from 'react';

export default function Cookies() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Cookie Policy</h1>
        <p style={styles.subtitle}>How we use "digital treats" to improve your experience.</p>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. What Are Cookies?</h2>
          <p style={styles.text}>
            Cookies are small text files stored on your device. They help us remember your preferences and ensure the website functions correctly. At Tizly, we use them to keep your pet's favorite items in the cart even if you refresh the page.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How Tizly Uses Cookies</h2>
          <p style={styles.text}>
            We categorize our cookies into the following:
          </p>
          <ul style={styles.list}>
            <li><strong>Essential Cookies:</strong> Used by Firebase to keep you logged in and by our Shop to manage your shopping cart.</li>
            <li><strong>Performance Cookies:</strong> These help us understand which pet products are the most popular so we can stock up.</li>
            <li><strong>Functional Cookies:</strong> These remember your settings, like your preferred vet or your pet's name.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Third-Party Cookies</h2>
          <p style={styles.text}>
            As we integrate with more services, some cookies are set by third parties:
          </p>
          <ul style={styles.list}>
            <li><strong>Google/Firebase:</strong> To analyze traffic and handle secure logins.</li>
            <li><strong>Stripe/Payment Partners:</strong> To prevent fraud during the checkout process.</li>
            <li><strong>AWS:</strong> To deliver images of pets and products quickly across the globe.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Managing Your Preferences</h2>
          <p style={styles.text}>
            Most web browsers allow you to control cookies through their settings. Please note that disabling essential cookies may prevent you from placing orders or accessing your vet appointments on Tizly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Updates to this Policy</h2>
          <p style={styles.text}>
            We may update our Cookie Policy as we introduce new features like personalized pet health tracking. We encourage you to check this page periodically.
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