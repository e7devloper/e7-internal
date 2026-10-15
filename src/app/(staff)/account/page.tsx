import type { Metadata } from 'next';
import { getCatalog, getMe } from '@/lib/api';
import { PasswordForm } from './password-form';

export const metadata: Metadata = { title: 'Your account' };

export default async function AccountPage() {
  const [me, catalog] = await Promise.all([getMe(), getCatalog()]);
  return (
    <main className="page page-narrow">
      <div className="page-head">
        <div>
          <h1>Your account</h1>
          <p>
            {me.name}
            {me.email ? ` · ${me.email}` : ''} · {catalog.roles[me.role]}
          </p>
        </div>
      </div>
      {me.builtin ? (
        <section className="panel form-card">
          <h2>Built-in admin</h2>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>
            This login comes from the server&rsquo;s <code>ADMIN_USER</code> and <code>ADMIN_PASSWORD</code> settings, so its password is changed
            there, not here. Use it to add staff accounts from the Team page.
          </p>
        </section>
      ) : (
        <PasswordForm />
      )}
    </main>
  );
}
