import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/types';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    apiFetch('/posts')
      .then((data) => {
        const nextPosts = Array.isArray(data.posts) ? (data.posts as BlogPost[]) : [];
        setPosts(nextPosts);
        setErrorMessage('');
      })
      .catch((error) => {
        setPosts([]);
        setErrorMessage((error as Error).message || 'Failed to load posts');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-warm">
        <div className="container-narrow text-center">
          <span className="text-primary font-medium mb-2 block">Our Blog</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">Stories & Updates</h1>
          <p className="text-xl text-muted-foreground">Discover the rich culinary heritage of Bihar</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3" />
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading posts...</div>
          ) : errorMessage ? (
            <div className="text-center text-muted-foreground">{errorMessage}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground">No posts yet.</div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-card rounded-2xl p-6 md:p-8 border border-border hover:shadow-warm-lg hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.read_time}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
