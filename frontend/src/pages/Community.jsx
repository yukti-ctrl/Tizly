import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  PlusCircle, 
  X, 
  Loader2, 
  Trash2, 
  Stethoscope, 
  ShieldCheck, 
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community/posts');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPosts(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setSubmitting(true);
    try {
      await api.post('/community/posts', newPost);
      setNewPost({ title: '', content: '', image_url: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) { 
      alert(err.response?.data?.error || "Error creating post. Please try again."); 
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this moment?")) return;
    try {
      await api.delete(`/community/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete post.");
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h1 style={styles.title}>Pet Community</h1>
          <p style={styles.subtitle}>Stories, moments, and veterinary advice from pet parents and doctors.</p>
        </div>

        {user ? (
          <button className="btn-primary" onClick={() => setShowForm(true)} style={styles.fab}>
            <PlusCircle size={20} /> 
            <span>{user.role === 'vet' ? 'Share Medical/Pet Update' : 'Share Moment'}</span>
          </button>
        ) : (
          <button className="btn-outline" onClick={() => navigate('/login')} style={styles.fab}>
            <LogIn size={18} /> <span>Log in to Share</span>
          </button>
        )}
      </header>

      {/* PUBLIC BANNER IF GUEST */}
      {!user && (
        <div style={styles.guestBanner}>
          <p style={{ margin: 0, fontWeight: '500' }}>
            🐾 You are currently browsing the community as a guest. All posts are public!
          </p>
          <button 
            onClick={() => navigate('/login')} 
            style={styles.guestBannerBtn}
          >
            Log in to post, like, and comment
          </button>
        </div>
      )}

      {/* FEED */}
      {loading ? (
        <div style={styles.center}><Loader2 className="spinner" size={40} /></div>
      ) : (
        <div style={styles.feed}>
          {posts.map(post => {
            const canDelete = user && (user.role === 'admin' || post.author_id === user.id);
            const isDoctor = post.author_role === 'vet';

            return (
              <article key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.authorRow}>
                    <div style={styles.authorAvatar}>
                      {post.author_photo ? (
                        <img src={post.author_photo} alt={post.author} style={styles.avatarImg} />
                      ) : (
                        <UserIcon size={20} color="#777" />
                      )}
                    </div>
                    <div>
                      <div style={styles.nameRow}>
                        <h4 style={styles.authorName}>{post.author}</h4>
                        {isDoctor && (
                          <span style={styles.doctorBadge}>
                            <Stethoscope size={11} /> Vet Specialist
                          </span>
                        )}
                        {post.author_role === 'seller' && (
                          <span style={styles.sellerBadge}>
                            <ShieldCheck size={11} /> Seller
                          </span>
                        )}
                        {post.author_role === 'admin' && (
                          <span style={styles.adminBadge}>Admin</span>
                        )}
                      </div>
                      <span style={styles.postDate}>{post.date}</span>
                    </div>
                  </div>

                  {canDelete && (
                    <button 
                      style={styles.deletePostBtn} 
                      onClick={() => handleDelete(post.id)}
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postContent}>{post.content}</p>

                {post.image_url && (
                  <div style={styles.postImageContainer}>
                    <img src={post.image_url} alt={post.title} style={styles.postImage} />
                  </div>
                )}

                <div style={styles.postFooter}>
                  <button 
                    style={styles.actionBtn} 
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={post.likes > 0 ? '#ff5252' : 'none'} color={post.likes > 0 ? '#ff5252' : '#666'} />
                    <span>{post.likes}</span>
                  </button>
                  <div style={styles.actionItem}>
                    <MessageCircle size={18} />
                    <span>{post.comment_count || 0}</span>
                  </div>
                  <div style={styles.actionItem}>
                    <Share2 size={18} />
                  </div>
                </div>
              </article>
            );
          })}

          {posts.length === 0 && (
            <div style={styles.emptyState}>
              <p>No community moments shared yet. Be the first to share one!</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>
                  {user?.role === 'vet' ? 'Create Medical / Community Post' : 'Share a Moment'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  {user?.role === 'vet' ? 'Share certified pet wellness advice or clinical insights.' : 'Share pet photos, tips, or stories.'}
                </p>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label style={styles.label}>Title *</label>
                <input 
                  placeholder="e.g. Morning walks with Buster..." 
                  style={styles.input} 
                  required
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div>
                <label style={styles.label}>Story / Content *</label>
                <textarea 
                  placeholder="What's happening? Tell the community..." 
                  style={{ ...styles.input, height: '110px', resize: 'vertical' }} 
                  required
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>

              {/* IMAGE UPLOADER FOR SUPABASE STORAGE */}
              <ImageUploader 
                folder="community"
                label="Post Photo (Supabase Storage)"
                value={newPost.image_url}
                onChange={url => setNewPost({ ...newPost, image_url: url })}
              />

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  style={styles.cancelBtn} 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ minWidth: '130px' }}
                >
                  {submitting ? <Loader2 className="spinner" size={18} /> : 'Share Moment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '40px 5%', maxWidth: '900px', margin: '0 auto', minHeight: '85vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' },
  titleArea: { flex: '1 1 300px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#121212', margin: '0 0 6px 0' },
  subtitle: { fontSize: '15px', color: '#666', margin: 0 },
  fab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '30px' },
  guestBanner: {
    backgroundColor: '#FFF8E1',
    border: '1px solid #FFE082',
    color: '#8D6E63',
    padding: '14px 20px',
    borderRadius: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  guestBannerBtn: {
    backgroundColor: '#121212',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' },
  feed: { display: 'flex', flexDirection: 'column', gap: '24px' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #f0f0f0'
  },
  postHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  authorRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  authorAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  nameRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  authorName: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#121212' },
  doctorBadge: {
    backgroundColor: '#E0F2F1',
    color: '#00695C',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  sellerBadge: {
    backgroundColor: '#EDE7F6',
    color: '#512DA8',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  adminBadge: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  postDate: { fontSize: '12px', color: '#888' },
  deletePostBtn: { background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: '6px' },
  postTitle: { fontSize: '18px', fontWeight: '700', color: '#121212', margin: '0 0 10px 0' },
  postContent: { fontSize: '14px', lineHeight: '1.6', color: '#444', margin: '0 0 16px 0' },
  postImageContainer: { borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', maxHeight: '450px' },
  postImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  postFooter: { display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5', paddingTop: '14px', alignItems: 'center' },
  actionBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#666', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  actionItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#888' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' },
  cancelBtn: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }
};