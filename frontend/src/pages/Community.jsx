import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Heart, MessageCircle, Share2, PlusCircle } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/community/posts').then(res => setPosts(res.data));
  }, []);

  return (
    <div style={{ padding: '40px 8%', maxWidth: '900px', margin: '0 auto' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800' }}>Pet Community</h1>
          <p style={{ color: '#666' }}>Share your best moments with your furry friends.</p>
        </div>
        <button className="btn-primary">
          <PlusCircle size={20} /> Share a Moment
        </button>
      </header>

      <div style={styles.feed}>
        {posts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.authorRow}>
              <div style={styles.avatar}>{post.author[0]}</div>
              <div>
                <p style={{ fontWeight: '700' }}>{post.author}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>{post.date}</p>
              </div>
            </div>
            
            <h3 style={styles.postTitle}>{post.title}</h3>
            <p style={styles.postContent}>{post.content}</p>
            
            {post.image_url && (
              <img src={post.image_url} alt="Pet" style={styles.postImg} />
            )}

            <div style={styles.interactions}>
              <button style={styles.iconBtn}><Heart size={20} /> {post.likes}</button>
              <button style={styles.iconBtn}><MessageCircle size={20} /> Comment</button>
              <button style={styles.iconBtn}><Share2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' },
  feed: { display: 'flex', flexDirection: 'column', gap: '30px' },
  postCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
  authorRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  postTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '10px' },
  postContent: { lineHeight: '1.6', color: '#444', marginBottom: '20px' },
  postImg: { width: '100%', borderRadius: '18px', marginBottom: '20px' },
  interactions: { display: 'flex', gap: '25px', borderTop: '1px solid #eee', paddingTop: '15px' },
  iconBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#666', fontWeight: '600' }
};