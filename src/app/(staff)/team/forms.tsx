'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react';
import { addStaff, resetStaffPassword, type FormState } from '../../actions';
import { submitKeepingValues } from '@/lib/forms';
import type { Role } from '@/lib/types';

export function Feedback({ state }: { state: FormState }) {
  if (state?.error)
    return (
      <div className="alert alert-error" role="alert">
        <CircleAlert size={18} aria-hidden />
        {state.error}
      </div>
    );
  if (state?.success)
    return (
      <div className="alert alert-success" role="status">
        <CircleCheck size={18} aria-hidden />
        {state.success}
      </div>
    );
  return null;
}

export function AddStaffForm({ roles }: { roles: Record<Role, string> }) {
  const [state, action, pending] = useActionState(addStaff, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) form.current?.reset();
  }, [state]);

  return (
    <section className="panel form-card" aria-labelledby="add-title">
      <h2 id="add-title">Add a person</h2>
      <p>They sign in with this email and the temporary password, then change it from their account page.</p>
      <form ref={form} action={action} onSubmit={submitKeepingValues(action)} className="form-grid">
        <Feedback state={state} />
        <div className="field">
          <label htmlFor="add-name">Full name</label>
          <input id="add-name" name="name" className="input" required minLength={2} maxLength={80} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="add-email">Work email</label>
          <input id="add-email" name="email" type="email" className="input" required autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="add-role">Role</label>
          <select id="add-role" name="role" className="select" defaultValue="staff">
            {Object.entries(roles).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <span className="hint">Admins can also add people, reset passwords and disable accounts.</span>
        </div>
        <div className="field">
          <label htmlFor="add-password">Temporary password</label>
          <input id="add-password" name="password" type="text" className="input" required minLength={10} maxLength={72} autoComplete="off" spellCheck={false} />
          <span className="hint">At least 10 characters.</span>
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <LoaderCircle size={16} className="spin" aria-hidden /> : null}
          {pending ? 'Adding…' : 'Add to team'}
        </button>
      </form>
    </section>
  );
}

export function ResetPassword({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(resetStaffPassword, undefined);
  const done = Boolean(state?.success);

  if (!open)
    return (
      <button type="button" className="btn btn-sm btn-quiet" onClick={() => setOpen(true)}>
        Reset password
      </button>
    );

  return (
    <div style={{ flexBasis: '100%' }}>
      {done ? (
        <div className="inline-form">
          <Feedback state={state} />
          <button type="button" className="btn btn-sm" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      ) : (
        <form action={action} onSubmit={submitKeepingValues(action)} className="inline-form">
          <input type="hidden" name="id" value={id} />
          <label htmlFor={`pw-${id}`} className="visually-hidden">
            New temporary password for {name}
          </label>
          <input
            id={`pw-${id}`}
            name="password"
            type="text"
            className="input"
            placeholder="New temporary password"
            required
            minLength={10}
            maxLength={72}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <button type="submit" className="btn btn-sm btn-primary" disabled={pending}>
            {pending ? 'Saving…' : 'Set password'}
          </button>
          <button type="button" className="btn btn-sm btn-quiet" onClick={() => setOpen(false)}>
            Cancel
          </button>
          {state?.error ? <Feedback state={state} /> : null}
        </form>
      )}
    </div>
  );
}
