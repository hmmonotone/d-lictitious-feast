import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { Layout } from '@/components/layout';
import { apiFetch } from '@/lib/api';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/types';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      apiFetch(`/posts/${slug}`)
        .then((data) => {
          const fetchedPost = data.post as BlogPost;
          setPost(fetchedPost);
          setContent(fetchedPost.content || '');
        })
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (!post && !isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pt-32 pb-16">
        <div className="container-narrow">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
          </Link>

          {post ? (
            <header className="mb-12">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.read_time}</span>
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">{post.title}</h1>
            </header>
          ) : (
            <div className="text-muted-foreground mb-12">Loading post...</div>
          )}

          <div 
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
