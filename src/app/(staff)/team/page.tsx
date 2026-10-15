import type { Metadata } from 'next';
import { Info } from 'lucide-react';
import { getCatalog, getMe, getTeam } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/format';
import { updateStaff } from '../../actions';
import { AddStaffForm, ResetPassword } from './forms';

export const metadata: Metadata = { title: 'Team' };

export default async function TeamPage() {
  const me = await getMe();
  if (me.role !== 'admin') {
    return (
      <main className="page page-narrow">
        <div className="panel detail-empty" style={{ padding: 40 }}>
          <div>
            <h1 style={{ fontSize: 20 }}>Only admins can manage the team</h1>
            <p style={{ marginTop: 6 }}>Ask an admin if you need an account added or a password reset.</p>
          </div>
        </div>
      </main>
    );
  }
  const [team, catalog] = await Promise.all([getTeam(), getCatalog()]);

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Team</h1>
          <p>Everyone who can sign in to E7 Internal. Status changes are recorded under each person&rsquo;s name.</p>
        </div>
      </div>

      {me.builtin ? (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          <Info size={18} aria-hidden />
          <span>
            You&rsquo;re signed in with the built-in admin login. Add yourself as an admin below, then sign in with your own account so your
            changes carry your name.
          </span>
        </div>
      ) : null}

      <div className="split">
        <section className="panel" aria-label="Staff accounts">
          {team.length ? (
            <div className="table-wrap">
              <table className="team-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Last signed in</th>
                    <th scope="col">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((s) => {
                    const self = s.id === me.id;
                    return (
                      <tr key={s.id} className={s.active ? '' : 'is-inactive'}>
                        <td>
                          <b style={{ color: s.active ? 'var(--heading)' : undefined }}>{s.name}</b>
                          {self ? <span className="pill pill-muted" style={{ marginLeft: 8 }}>You</span> : null}
                          {!s.active ? <span className="pill pill-closed" style={{ marginLeft: 8 }}>Disabled</span> : null}
                          <span className="sub">{s.email}</span>
                        </td>
                        <td>
                          {catalog.roles[s.role]}
                          <span className="sub">Since {formatDate(s.createdAt!)}</span>
                        </td>
                        <td>{s.lastLoginAt ? formatDateTime(s.lastLoginAt) : <span style={{ color: 'var(--muted)' }}>Never</span>}</td>
                        <td>
                          {self ? (
                            <span className="hint">Change your password from your account page.</span>
                          ) : (
                            <div className="row-actions">
                              <form action={updateStaff}>
                                <input type="hidden" name="id" value={s.id!} />
                                <input type="hidden" name="role" value={s.role === 'admin' ? 'staff' : 'admin'} />
                                <button type="submit" className="btn btn-sm btn-quiet">
                                  {s.role === 'admin' ? 'Make staff' : 'Make admin'}
                                </button>
                              </form>
                              <ResetPassword id={s.id!} name={s.name} />
                              <form action={updateStaff}>
                                <input type="hidden" name="id" value={s.id!} />
                                <input type="hidden" name="active" value={String(!s.active)} />
                                <button type="submit" className={`btn btn-sm ${s.active ? 'btn-danger' : ''}`}>
                                  {s.active ? 'Disable' : 'Enable'}
                                </button>
                              </form>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="list-empty">
              <h3>No staff accounts yet</h3>
              <p>Add the first person with the form. Start with yourself as an admin.</p>
            </div>
          )}
        </section>

        <AddStaffForm roles={catalog.roles} />
      </div>
    </main>
  );
}
