import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { Layout } from '@/components/layout';
import { getBlogPostBySlug, getBlogContent } from '@/lib/data';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const post = slug ? getBlogPostBySlug(slug) : null;

  useEffect(() => {
    if (slug) {
      getBlogContent(slug).then(setContent);
    }
  }, [slug]);

  if (!post) {
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

          <header className="mb-12">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">{post.title}</h1>
          </header>

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
