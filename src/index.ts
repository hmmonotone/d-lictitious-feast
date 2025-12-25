type D1PreparedStatement = {
  bind: (...values: unknown[]) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    first: <T = unknown>() => Promise<T | null>;
    run: () => Promise<{ changes: number }>;
  };
};

type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
};

type Env = {
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  DB?: D1Database;
  AUTH_SECRET?: string;
};

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 310000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url);
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('ASSETS binding missing. Check wrangler.toml', { status: 500 });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let res = await env.ASSETS.fetch(request);

    if (res.status === 404) {
      const spaUrl = new URL(request.url);
      spaUrl.pathname = '/index.html';
      res = await env.ASSETS.fetch(new Request(spaUrl.toString(), request));
    }

    return res;
  }
};

async function handleApi(request: Request, env: Env, url: URL) {
  const path = url.pathname.replace(/^\/api\/?/, '');
  const method = request.method.toUpperCase();

  try {
    if (path === 'posts') {
      if (method === 'GET') {
        return handlePostsList(request, env);
      }
      if (method === 'POST') {
        return handlePostsCreate(request, env);
      }
    }

    if (path.startsWith('posts/')) {
      return handlePostDetail(request, env, path, method);
    }

    if (path === 'login' && method === 'POST') {
      return handleLogin(request, env);
    }

    if (path === 'me' && method === 'GET') {
      const user = await requireAuth(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      return json({ user });
    }

    if (path.startsWith('admin/editors')) {
      return handleEditors(request, env, path, method);
    }

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    return json({ error: (error as Error).message || 'Server error' }, 500);
  }
}

async function handlePostsList(request: Request, env: Env) {
  if (!env.DB) {
    return json({ posts: [] });
  }

  try {
    const authUser = await getAuthUser(request, env);
    const query = authUser && (authUser.role === 'admin' || authUser.role === 'editor')
      ? 'SELECT * FROM blog_posts ORDER BY created_at DESC'
      : 'SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC';

    const { results } = await env.DB.prepare(query).all();
    return json({ posts: results });
  } catch {
    return json({ posts: [] });
  }
}

async function handlePostDetail(request: Request, env: Env, path: string, method: string) {
  const slug = path.split('/').filter(Boolean)[1];
  if (!slug) return json({ error: 'Not found' }, 404);

  if (method === 'GET') {
    if (!env.DB) return json({ post: null });
    try {
      const authUser = await getAuthUser(request, env);
      const query = authUser && (authUser.role === 'admin' || authUser.role === 'editor')
        ? 'SELECT * FROM blog_posts WHERE slug = ?'
        : 'SELECT * FROM blog_posts WHERE slug = ? AND published = 1';

      const post = await env.DB.prepare(query).bind(slug).first();
      if (!post) return json({ error: 'Post not found' }, 404);
      return json({ post });
    } catch {
      return json({ post: null });
    }
  }

  if (method === 'PUT') {
    const authUser = await requireEditor(request, env);
    if (!authUser) return json({ error: 'Unauthorized' }, 401);
    if (!env.DB) return json({ error: 'Database unavailable' }, 503);

    const body = await readJson(request);
    const updates = normalizePostUpdate(body);
    if (!updates) return json({ error: 'No changes provided' }, 400);

    const existing = await env.DB.prepare('SELECT id FROM blog_posts WHERE slug = ?')
      .bind(slug)
      .first();
    if (!existing) return json({ error: 'Post not found' }, 404);

    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(slug);

    await env.DB.prepare(`UPDATE blog_posts SET ${fields.join(', ')} WHERE slug = ?`)
      .bind(...values)
      .run();

    return json({ ok: true });
  }

  if (method === 'DELETE') {
    const authUser = await requireEditor(request, env);
    if (!authUser) return json({ error: 'Unauthorized' }, 401);
    if (!env.DB) return json({ error: 'Database unavailable' }, 503);

    const result = await env.DB.prepare('DELETE FROM blog_posts WHERE slug = ?')
      .bind(slug)
      .run();
    if (!result.changes) return json({ error: 'Post not found' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'Not found' }, 404);
}

async function handlePostsCreate(request: Request, env: Env) {
  const authUser = await requireEditor(request, env);
  if (!authUser) return json({ error: 'Unauthorized' }, 401);
  if (!env.DB) return json({ error: 'Database unavailable' }, 503);

  const body = await readJson(request);
  const payload = normalizePostPayload(body);
  if (!payload) return json({ error: 'Missing required post fields' }, 400);

  const exists = await env.DB.prepare('SELECT 1 FROM blog_posts WHERE slug = ?')
    .bind(payload.slug)
    .first();
  if (exists) return json({ error: 'A post with this slug already exists' }, 409);

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO blog_posts (id, slug, title, excerpt, content, author, read_time, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      payload.slug,
      payload.title,
      payload.excerpt,
      payload.content,
      payload.author,
      payload.read_time,
      payload.published ? 1 : 0,
      now,
      now
    )
    .run();

  return json({ ok: true }, 201);
}

async function handleLogin(request: Request, env: Env) {
  if (!env.DB) return json({ error: 'Database unavailable' }, 503);
  if (!env.AUTH_SECRET) return json({ error: 'Missing AUTH_SECRET' }, 500);

  const body = await readJson(request);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return json({ error: 'Email and password are required' }, 400);
  }

  const user = await env.DB.prepare(
    'SELECT id, email, password_hash, password_salt, role FROM users WHERE email = ?'
  )
    .bind(email)
    .first<{ id: string; email: string; password_hash: string; password_salt: string; role: AuthUser['role'] }>();

  if (!user) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  const isValid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!isValid) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }, env.AUTH_SECRET);

  return json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  });
}

async function handleEditors(request: Request, env: Env, path: string, method: string) {
  const authUser = await requireAuth(request, env);
  if (!authUser) return json({ error: 'Unauthorized' }, 401);
  if (authUser.role !== 'admin') return json({ error: 'Admin access required' }, 403);
  if (!env.DB) return json({ error: 'Database unavailable' }, 503);

  const segments = path.split('/').filter(Boolean);
  const editorId = segments[2];

  if (!editorId && method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, email, role FROM users WHERE role = ? ORDER BY email'
    )
      .bind('editor')
      .all();
    return json({ editors: results });
  }

  if (!editorId && method === 'POST') {
    const body = await readJson(request);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, 400);
    }

    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first();
    if (existing) return json({ error: 'User already exists' }, 409);

    const { hash, salt } = await hashPassword(password);
    await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(crypto.randomUUID(), email, hash, salt, 'editor')
      .run();

    return json({ ok: true }, 201);
  }

  if (editorId && method === 'DELETE') {
    if (editorId === authUser.id) {
      return json({ error: 'Cannot remove your own account' }, 400);
    }
    const result = await env.DB.prepare('DELETE FROM users WHERE id = ? AND role = ?')
      .bind(editorId, 'editor')
      .run();
    if (!result.changes) return json({ error: 'Editor not found' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'Not found' }, 404);
}

async function requireAuth(request: Request, env: Env) {
  return getAuthUser(request, env);
}

async function requireEditor(request: Request, env: Env) {
  const user = await getAuthUser(request, env);
  if (!user) return null;
  if (user.role === 'admin' || user.role === 'editor') return user;
  return null;
}

async function getAuthUser(request: Request, env: Env): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  if (!env.DB || !env.AUTH_SECRET) return null;

  const token = authHeader.slice(7);
  const payload = await verifyToken(token, env.AUTH_SECRET);
  if (!payload) return null;

  const user = await env.DB.prepare('SELECT id, email, role FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<AuthUser>();
  if (!user) return null;

  return user;
}

function normalizePostPayload(body: Record<string, unknown>) {
  const title = String(body.title || '').trim();
  const slug = String(body.slug || '').trim();
  const excerpt = String(body.excerpt || '').trim();
  const content = String(body.content || '').trim();
  const author = String(body.author || '').trim();
  const read_time = String(body.read_time || '').trim();
  const published = Boolean(body.published);

  if (!title || !slug || !excerpt || !content || !author || !read_time) {
    return null;
  }

  return { title, slug, excerpt, content, author, read_time, published };
}

function normalizePostUpdate(body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  const fields = ['title', 'excerpt', 'content', 'author', 'read_time', 'published'];

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = field === 'published' ? Boolean(body[field]) : String(body[field] ?? '').trim();
    }
  }

  return Object.keys(updates).length ? updates : null;
}

async function hashPassword(password: string, salt?: Uint8Array) {
  const saltBytes = salt ?? crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return {
    hash: toBase64(new Uint8Array(derivedBits)),
    salt: toBase64(saltBytes)
  };
}

async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const saltBytes = fromBase64(salt);
  const { hash } = await hashPassword(password, saltBytes);
  return hash === expectedHash;
}

async function signToken(payload: Record<string, unknown>, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encoder = new TextEncoder();
  const headerPart = toBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const data = `${headerPart}.${payloadPart}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signaturePart = toBase64Url(new Uint8Array(signature));

  return `${data}.${signaturePart}`;
}

async function verifyToken(token: string, secret: string) {
  const [headerPart, payloadPart, signaturePart] = token.split('.');
  if (!headerPart || !payloadPart || !signaturePart) return null;

  const encoder = new TextEncoder();
  const data = `${headerPart}.${payloadPart}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const expectedSignature = toBase64Url(new Uint8Array(signature));

  if (expectedSignature !== signaturePart) return null;

  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadPart)));
  if (payload.exp && typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload as { sub: string };
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function toBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64Url(bytes: Uint8Array) {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64: string) {
  const padded = base64.replace(/-/g, '+').replace(/_/g, '/')
    + '='.repeat((4 - (base64.length % 4)) % 4);
  return fromBase64(padded);
}
  
