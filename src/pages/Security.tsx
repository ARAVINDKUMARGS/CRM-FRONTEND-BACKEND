import { useState } from 'react';
import { KeyRound, ShieldCheck, FileSearch, Lock, Save } from 'lucide-react';

type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  ip: string;
};

const mockAudit: AuditEvent[] = [
  { id: '1', at: '2026-01-23T10:12:00Z', actor: 'John Admin', action: 'User role updated', ip: '10.0.0.12' },
  { id: '2', at: '2026-01-23T09:41:00Z', actor: 'Sarah Manager', action: 'Report exported (PDF)', ip: '10.0.0.8' },
  { id: '3', at: '2026-01-22T18:05:00Z', actor: 'Mike Sales', action: 'Deal stage changed', ip: '10.0.0.21' },
];

const Security = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const save = () => {
    setSavedMsg('Saved.');
    window.setTimeout(() => setSavedMsg(''), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Access Control</h1>
          <p className="text-gray-600 mt-1">Password settings, 2FA (mock), and audit logs.</p>
        </div>
        <button onClick={save} className="btn-primary flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <p className="text-xs text-gray-500">Mock UI only (no backend).</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray-700">Enable 2FA for your account.</p>
              <p className="text-sm text-gray-500 mt-1">This is mocked for the frontend demo.</p>
            </div>
            <button
              onClick={() => setTwoFAEnabled((v) => !v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                twoFAEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {twoFAEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Recovery codes</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Generate recovery codes in a real implementation. (Mocked)
            </p>
          </div>
        </div>

        <div className="card lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <FileSearch className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
          </div>
          <div className="space-y-3">
            {mockAudit.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">{e.action}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {e.actor} • {new Date(e.at).toLocaleString()} • {e.ip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
    </div>
  );
};

export default Security;

