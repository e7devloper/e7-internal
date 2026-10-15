'use client';

import { useActionState, useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { changeOwnPassword } from '../../actions';
import { submitKeepingValues } from '@/lib/forms';
import { Feedback } from '../team/forms';

export function PasswordForm() {
  const [state, action, pending] = useActionState(changeOwnPassword, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) form.current?.reset();
  }, [state]);

  return (
    <section className="panel form-card" style={{ maxWidth: 480 }} aria-labelledby="pw-title">
      <h2 id="pw-title">Change password</h2>
      <p>Changing it signs you out on every other device.</p>
      <form ref={form} action={action} onSubmit={submitKeepingValues(action)} className="form-grid">
        <Feedback state={state} />
        <div className="field">
          <label htmlFor="current">Current password</label>
          <input id="current" name="currentPassword" type="password" className="input" required autoComplete="current-password" />
        </div>
        <div className="field">
          <label htmlFor="new">New password</label>
          <input id="new" name="newPassword" type="password" className="input" required minLength={10} maxLength={72} autoComplete="new-password" />
          <span className="hint">At least 10 characters.</span>
        </div>
        <div className="field">
          <label htmlFor="confirm">New password again</label>
          <input id="confirm" name="confirmPassword" type="password" className="input" required autoComplete="new-password" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <LoaderCircle size={16} className="spin" aria-hidden /> : null}
          {pending ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </section>
  );
}
