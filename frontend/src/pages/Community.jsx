import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Share2, PlusCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community/posts');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community/posts', newPost);
      setNewPost({ title: '', content: '', image_url: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) { alert("Error creating post. Please try again."); }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h1 style={styles.title}>Pet Community</h1>
          <p style={styles.subtitle}>Moments from pet parents around the world.</p>
        </div>
        {user && (
          <button className="btn-primary" onClick={() => setShowForm(true)} style={styles.fab}>
            <PlusCircle size={20} /> <span style={styles.fabText}>Share Moment</span>
          </button>
        )}
      </header>

      {/* POST FORM MODAL */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} className="modal-fade-in" onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Create Post</h3>
              <X onClick={() => setShowForm(false)} style={{cursor:'pointer'}}/>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input 
                placeholder="Catchy title..." style={styles.input} required
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
              <textarea 
                placeholder="Tell us about your pet's day..." style={styles.textarea} required
                onChange={e => setNewPost({...newPost, content: e.target.value})}
              />
              <div style={styles.imageInputWrapper}>
                <ImageIcon size={18} color="#888" />
                <input 
                  placeholder="Image URL" style={styles.imgInput}
                  onChange={e => setNewPost({...newPost, image_url: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>Post to Community</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={styles.center}><Loader2 className="spinner" size={40}/></div>
      ) : (
        <div className="community-container">
          {posts.map(post => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.authorRow}>
                <div style={styles.avatar}>{post.author ? post.author[0] : 'P'}</div>
                <div>
                  <p style={styles.authorName}>{post.author || "Anonymous"}</p>
                  <p style={styles.postDate}>{post.date}</p>
                </div>
              </div>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postContent}>{post.content}</p>
              {post.image_url && (
                <div style={styles.imgContainer}>
                  <img src={post.image_url} alt="Pet" style={styles.postImg} />
                </div>
              )}
              <div style={styles.actions}>
                <button style={styles.actionBtn}><Heart size={18}/> {post.likes}</button>
                <button style={styles.actionBtn}><MessageCircle size={18}/> Comment</button>
                <button style={styles.actionBtn}><Share2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '30px 5%', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  titleArea: { flex: 1 },
  title: { fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '900', margin: 0 },
  subtitle: { color: '#666', fontSize: '15px', marginTop: '5px' },
  fab: { borderRadius: '50px', padding: '12px 25px' },
  fabText: { display: window.innerWidth < 600 ? 'none' : 'inline' },
  
  postCard: { backgroundColor: '#fff', borderRadius: '30px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' },
  authorRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  authorName: { margin: 0, fontSize: '15px', fontWeight: '800' },
  postDate: { margin: 0, fontSize: '11px', color: '#aaa', fontWeight: '700' },
  postTitle: { fontSize: '18px', fontWeight: '800', margin: '0 0 10px 0' },
  postContent: { fontSize: '15px', lineHeight: '1.6', color: '#444', marginBottom: '15px' },
  imgContainer: { borderRadius: '20px', overflow: 'hidden', marginBottom: '15px', width: '100%' },
  postImg: { width: '100%', display: 'block' },
  actions: { display: 'flex', gap: '20px', borderTop: '1px solid #f8f8f8', paddingTop: '15px' },
  actionBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#666', fontWeight: '700', fontSize: '14px' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modal: { backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px', padding: '30px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #eee', outline: 'none' },
  textarea: { padding: '15px', borderRadius: '15px', border: '1px solid #eee', outline: 'none', height: '120px', resize: 'none' },
  imageInputWrapper: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px', border: '1px solid #eee', borderRadius: '15px' },
  imgInput: { border: 'none', padding: '15px 0', outline: 'none', flex: 1, fontSize: '14px' },
  center: { display: 'flex', justifyContent: 'center', padding: '100px 0' }
};