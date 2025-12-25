import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import { BlogPost } from '@/types';

const EditorDashboard = () => {
  const { loading, logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      fetchPosts();
    }
  }, [loading]);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const data = await apiFetch('/posts');
      setPosts(data.posts as BlogPost[]);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to load posts');
    }
    setIsLoading(false);
  }

  async function togglePublish(post: BlogPost) {
    try {
      await apiFetch(`/posts/${post.slug}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !post.published })
      });
      toast.success(post.published ? 'Post unpublished' : 'Post published');
      fetchPosts();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update post');
    }
  }

  async function deletePost(slug: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiFetch(`/posts/${slug}`, { method: 'DELETE' });
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete post');
    }
  }

  async function handleSignOut() {
    await logout();
    navigate('/');
  }

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-16 min-h-screen bg-tile">
        <div className="container-wide">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Blog Editor
              </h1>
              <p className="text-muted-foreground">Manage your blog posts</p>
            </div>
            <div className="flex gap-3">
              <Link to="/blog/editor/new">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Link to="/blog/editor/new">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-tile-hover border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-tile-title">Title</th>
                    <th className="text-left p-4 font-semibold text-tile-title hidden md:table-cell">Author</th>
                    <th className="text-left p-4 font-semibold text-tile-title hidden sm:table-cell">Status</th>
                    <th className="text-right p-4 font-semibold text-tile-title">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-border last:border-0 hover:bg-tile-hover/50">
                      <td className="p-4">
                        <span className="font-medium text-tile-title">{post.title}</span>
                        <span className="block text-sm text-tile-desc md:hidden">{post.author}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-tile-desc">{post.author}</td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-tag-veg/10 text-tag-veg' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish(post)}
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Link to={`/blog/editor/edit/${post.slug}`}>
                            <Button variant="ghost" size="sm" title="Edit">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePost(post.slug)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EditorDashboard;
