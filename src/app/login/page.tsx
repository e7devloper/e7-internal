import type { Metadata } from 'next';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; expired?: string }> }) {
  const { next, expired } = await searchParams;
  return (
    <main className="auth">
      <section className="auth-brand" aria-label="E7 Entertainments">
        <div>
          <div className="auth-logo">
            <img src="/logo-sm.png" alt="E7 Entertainments" width={80} height={80} />
          </div>
        </div>
        <div>
          <h1>E7 Internal</h1>
          <p>Park requests from the E7 Parks app, the clients waiting on them, and the team answering.</p>
        </div>
      </section>
      <section className="auth-form">
        <SignInForm next={next ?? ''} expired={expired === '1'} />
      </section>
    </main>
  );
}
