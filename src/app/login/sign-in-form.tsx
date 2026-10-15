'use client';

import { useActionState } from 'react';
import { CircleAlert, Info, LoaderCircle } from 'lucide-react';
import { signIn } from '../actions';

export function SignInForm({ next, expired }: { next: string; expired: boolean }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="form-grid" noValidate>
      <div>
        <h2>Sign in</h2>
        <p className="lead">Use the email and password your E7 admin set up for you.</p>
      </div>
      {state?.error ? (
        <div className="alert alert-error" role="alert">
          <CircleAlert size={18} aria-hidden />
          {state.error}
        </div>
      ) : expired ? (
        <div className="alert alert-info" role="status">
          <Info size={18} aria-hidden />
          Your session ended. Sign in again to carry on.
        </div>
      ) : null}
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="text" inputMode="email" autoComplete="username" className="input" defaultValue={state?.email} required autoFocus aria-invalid={Boolean(state?.error)} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" className="input" required aria-invalid={Boolean(state?.error)} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: 6 }}>
        {pending ? <LoaderCircle size={16} className="spin" aria-hidden /> : null}
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="hint">Forgotten your password? Ask an admin to reset it from the Team page.</p>
    </form>
  );
}
