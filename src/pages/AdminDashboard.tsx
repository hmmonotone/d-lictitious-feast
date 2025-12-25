import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, LogOut, UserPlus, Trash2 } from 'lucide-react';
import { z } from 'zod';

type Intern = {
  id: string;
  email: string;
  role: 'editor';
};

const internSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminDashboard = () => {
  const { loading, logout } = useAuth();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const sortedInterns = useMemo(
    () => [...interns].sort((a, b) => a.email.localeCompare(b.email)),
    [interns]
  );

  useEffect(() => {
    if (!loading) {
      fetchInterns();
    }
  }, [loading]);

  async function fetchInterns() {
    setIsLoading(true);
    try {
      const data = await apiFetch('/admin/editors');
      setInterns((data.editors ?? []) as Intern[]);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to load interns');
    }
    setIsLoading(false);
  }

  async function handleAddIntern(e: React.FormEvent) {
    e.preventDefault();
    const validation = internSchema.safeParse({ email: email.trim(), password });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsAdding(true);
    try {
      await apiFetch('/admin/editors', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });
      toast.success('Intern added');
      setEmail('');
      setPassword('');
      fetchInterns();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add intern');
    }
    setIsAdding(false);
  }

  async function handleRemoveIntern(intern: Intern) {
    if (!confirm(`Remove editor access for ${intern.email}?`)) return;

    setRemovingUserId(intern.id);
    try {
      await apiFetch(`/admin/editors/${intern.id}`, { method: 'DELETE' });
      toast.success('Intern removed');
      fetchInterns();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to remove intern');
    } finally {
      setRemovingUserId(null);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin Console
              </h1>
              <p className="text-muted-foreground">Add or remove blog editors</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Add Intern
            </h2>
            <p className="text-muted-foreground mb-6">
              Create intern accounts here to grant editor access.
            </p>
            <form onSubmit={handleAddIntern} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="intern-email">Intern Email</Label>
                <Input
                  id="intern-email"
                  type="email"
                  placeholder="intern@dlitticious.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background mt-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="intern-password">Temporary Password</Label>
                <Input
                  id="intern-password"
                  type="password"
                  placeholder="Set a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background mt-2"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90 self-end"
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" /> Add Intern
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Current Editors
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sortedInterns.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No interns with editor access yet.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-tile-hover border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-tile-title">Email</th>
                    <th className="text-right p-4 font-semibold text-tile-title">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInterns.map((intern) => (
                    <tr key={intern.id} className="border-b border-border last:border-0">
                      <td className="p-4 text-tile-desc">{intern.email}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIntern(intern)}
                          className="text-destructive hover:text-destructive"
                          disabled={removingUserId === intern.id}
                        >
                          {removingUserId === intern.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
