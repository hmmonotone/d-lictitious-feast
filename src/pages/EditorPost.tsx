import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  read_time: z.string().min(1, 'Read time is required'),
});

const EditorPost = () => {
  const { slug: editSlug } = useParams();
  const isEditing = Boolean(editSlug);
  const { user, isEditor, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: "d'LITTIcious Team",
    read_time: '5 min read',
    published: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/editor/login');
    } else if (!authLoading && user && !isEditor) {
      toast.error('You do not have editor permissions');
      navigate('/');
    }
  }, [user, isEditor, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && user && isEditor) {
      fetchPost();
    }
  }, [isEditing, user, isEditor]);

  async function fetchPost() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', editSlug)
      .maybeSingle();

    if (error || !data) {
      toast.error('Post not found');
      navigate('/editor');
    } else {
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        read_time: data.read_time,
        published: data.published,
      });
    }
    setIsLoading(false);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = postSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsSaving(true);

    if (isEditing) {
      const { error } = await supabase
        .from('blog_posts')
        .update(formData)
        .eq('slug', editSlug);

      if (error) {
        toast.error('Failed to update post: ' + error.message);
      } else {
        toast.success('Post updated successfully');
        navigate('/editor');
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert([formData]);

      if (error) {
        if (error.code === '23505') {
          toast.error('A post with this slug already exists');
        } else {
          toast.error('Failed to create post: ' + error.message);
        }
      } else {
        toast.success('Post created successfully');
        navigate('/editor');
      }
    }

    setIsSaving(false);
  }

  if (authLoading || !isEditor || (isEditing && isLoading)) {
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
        <div className="container-narrow">
          <Button
            variant="ghost"
            onClick={() => navigate('/editor')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="My Amazing Post"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="my-amazing-post"
                    className="bg-background"
                    disabled={isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                    placeholder="5 min read"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A brief summary of the post..."
                  rows={2}
                  className="bg-background resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content in Markdown..."
                  rows={16}
                  className="bg-background font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    {formData.published ? 'Published' : 'Draft'}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Update Post' : 'Create Post'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditorPost;
