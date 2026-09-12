import { useState, FormEvent } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { AuthenticatedUser, UserRole } from '../types';
import { DEAN_USER, STAFF_USER } from '../data/authUsers';

interface LoginPortalProps {
  onLogin: (user: AuthenticatedUser) => void;
}

export function LoginPortal({ onLogin }: LoginPortalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEAN');
  const [emailInput, setEmailInput] = useState('hvipatel007@gmail.com');
  const [passwordInput, setPasswordInput] = useState('nfsu@2025');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Switch tabs
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'DEAN') {
      setEmailInput('hvipatel007@gmail.com');
      setPasswordInput('dean@nfsu2025');
    } else {
      setEmailInput('harsh142022@gmail.com');
      setPasswordInput('staff@nfsu2025');
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (selectedRole === 'DEAN') {
        const user = { ...DEAN_USER, lastLoginTimestamp: new Date().toISOString() };
        onLogin(user);
      } else {
        const user = { ...STAFF_USER, lastLoginTimestamp: new Date().toISOString() };
        onLogin(user);
      }
      setIsAuthenticating(false);
    }, 400);
  };

  // Instant login shortcuts
  const handleInstantDeanLogin = () => {
    onLogin({ ...DEAN_USER, lastLoginTimestamp: new Date().toISOString() });
  };

  const handleInstantStaffLogin = () => {
    onLogin({ ...STAFF_USER, lastLoginTimestamp: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top University Identity Header */}
      <div className="max-w-4xl w-full mx-auto text-center space-y-2 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
          <Building2 className="w-3.5 h-3.5" />
          NATIONAL FORENSIC SCIENCES UNIVERSITY (NFSU)
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white tracking-wide">
          School of Doctoral Studies and Research (SDSR)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          An Institution of National Importance under Ministry of Home Affairs, Government of India
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-3xl w-full mx-auto my-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white font-cinzel">
            Institutional Portal Authentication
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select your administrative designation below to access authorized Ph.D. RPC workflows.
          </p>
        </div>

        {/* Dual Role Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card 1: Dean SDSR */}
          <button
            id="login-select-dean-btn"
            type="button"
            onClick={() => handleSelectRole('DEAN')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedRole === 'DEAN'
                ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-lg'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            {selectedRole === 'DEAN' && (
              <span className="absolute top-3 right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}

            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
              Executive Portal
            </div>
            <h3 className="font-bold text-white text-base">Dean, SDSR</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              hvipatel007@gmail.com — Digital Signatures, Statutory Clearance & Executive Sanctions
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digital Token Authority</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">hvipatel007@gmail.com</span>
            </div>
          </button>

          {/* Card 2: Staff Office */}
          <button
            id="login-select-staff-btn"
            type="button"
            onClick={() => handleSelectRole('STAFF')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedRole === 'STAFF'
                ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/20 shadow-lg'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            {selectedRole === 'STAFF' && (
              <span className="absolute top-3 right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}

            <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3">
              <UserCheck className="w-5 h-5" />
            </div>

            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-0.5">
              Operations & Scrutiny
            </div>
            <h3 className="font-bold text-white text-base">Ph.D. Admin Staff</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              harsh142022@gmail.com — 13-Field Docket Intake, Compliance Audit & Notice Generation
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Intake & Audit Scrutiny Desk</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono">harsh142022@gmail.com</span>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {selectedRole === 'DEAN' ? 'Official Dean Email ID' : 'Administrative Staff Email ID'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email-input"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder={selectedRole === 'DEAN' ? 'hvipatel007@gmail.com' : 'harsh142022@gmail.com'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Institutional Access Key / PIN
              </label>
              <span className="text-[11px] text-slate-500">
                Default: <code className="text-amber-400 font-mono">nfsu@2025</code>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isAuthenticating}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              selectedRole === 'DEAN'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            {isAuthenticating
              ? 'Verifying Institutional Credentials...'
              : selectedRole === 'DEAN'
              ? 'Enter as Dean, SDSR'
              : 'Enter as Ph.D. Administration Staff'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick One-Click Switchers for Ease of Demonstration */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-3">
          <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
            Quick One-Click Institutional Access
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="instant-dean-login-btn"
              type="button"
              onClick={handleInstantDeanLogin}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Instant Login: Dean SDSR
            </button>

            <button
              id="instant-staff-login-btn"
              type="button"
              onClick={handleInstantStaffLogin}
              className="px-3.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Instant Login: Staff Office
            </button>
          </div>
        </div>
      </div>

      {/* Zero Cost & Security Footer Note */}
      <div className="max-w-2xl w-full mx-auto text-center text-xs text-slate-500 space-y-1 pb-4">
        <p className="flex items-center justify-center gap-1.5 text-slate-400">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Zero-Cost Campus Intranet Architecture: Operates 100% locally with zero server subscriptions.</span>
        </p>
        <p className="text-[11px] text-slate-600">
          National Forensic Sciences University • Sector 9, Gandhinagar, Gujarat 382007
        </p>
      </div>
    </div>
  );
}
