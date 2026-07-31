import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Heart, MessageCircle, Share2, PlusCircle, X } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });

  const fetchPosts = () => api.get('/community/posts').then(res => setPosts(res.data));

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community/posts', newPost);
      setNewPost({ title: '', content: '', image_url: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) { alert("Login required to post!"); }
  };

  return (
    <div style={{ padding: '40px 8%', maxWidth: '800px', margin: '0 auto' }}>
      <header style={styles.header}>
        <h1>Pet Community</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <PlusCircle size={20} /> Share a Moment
        </button>
      </header>

      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '20px'}}>
              <h2>New Post</h2>
              <X onClick={() => setShowForm(false)} style={{cursor:'pointer'}} />
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input 
                placeholder="Title" 
                style={styles.input} 
                onChange={e => setNewPost({...newPost, title: e.target.value})} 
                required 
              />
              <textarea 
                placeholder="What's on your mind?" 
                style={{...styles.input, height: '100px'}} 
                onChange={e => setNewPost({...newPost, content: e.target.value})} 
                required 
              />
              <input 
                placeholder="Image URL (optional)" 
                style={styles.input} 
                onChange={e => setNewPost({...newPost, image_url: e.target.value})} 
              />
              <button type="submit" className="btn-primary">Post to Feed</button>
            </form>
          </div>
        </div>
      )}

      <div style={styles.feed}>
        {posts.map(post => (
          /* ... existing post card code ... */
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
            {post.image_url && <img src={post.image_url} alt="Pet" style={styles.postImg} />}
            <div style={styles.interactions}>
              <button style={styles.iconBtn}><Heart size={20} /> {post.likes}</button>
              <button style={styles.iconBtn}><MessageCircle size={20} /> Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  /* ... add these to existing styles ... */
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '30px', borderRadius: '30px', width: '90%', maxWidth: '500px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', fontSize: '14px' },
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