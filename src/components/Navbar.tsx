import { useState } from 'react';
import { 
  Building2, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  UserCheck, 
  ShieldCheck,
  Search,
  Bell,
  FolderDown,
  LogOut,
  Repeat,
  Zap,
  GitCommit,
  Mail
} from 'lucide-react';
import { RPCApplication, AuthenticatedUser, UserRole } from '../types';

interface NavbarProps {
  currentTab: 'desk' | 'workflow' | 'staff-generator' | 'new-form' | 'dean-portal' | 'ordinance' | 'zero-cost' | 'docs-hub' | 'letter-view';
  setCurrentTab: (tab: 'desk' | 'workflow' | 'staff-generator' | 'new-form' | 'dean-portal' | 'ordinance' | 'zero-cost' | 'docs-hub' | 'letter-view') => void;
  currentUser: AuthenticatedUser;
  onSignOut: () => void;
  onSwitchAccount: (role: UserRole) => void;
  applications: RPCApplication[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onSignOut,
  onSwitchAccount,
  applications,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const pendingDeanCount = applications.filter(a => a.status === 'Submitted_To_Dean').length;
  const approvedCount = applications.filter(a => a.status === 'Approved_By_Dean').length;

  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Academic Institution Banner */}
      <div className="bg-slate-950 px-4 py-2 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold tracking-wide text-amber-400">
            <Building2 className="w-3.5 h-3.5" />
            NATIONAL FORENSIC SCIENCES UNIVERSITY
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">School of Doctoral Studies & Research (SDSR)</span>
          <span className="hidden sm:inline text-slate-500">Gandhinagar, Gujarat, India</span>
        </div>

        {/* Authenticated User Status & Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl text-xs">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shadow-inner ${
              currentUser.role === 'DEAN'
                ? 'bg-emerald-600 text-white border border-emerald-400/40'
                : 'bg-amber-600 text-white border border-amber-400/40'
            }`}>
              {currentUser.avatarInitials}
            </div>

            <div className="hidden md:block text-left">
              <span className="font-semibold text-slate-100 block text-[11px] leading-tight flex items-center gap-1.5">
                {currentUser.fullName}
                <span className="text-[10px] text-slate-400 font-mono font-normal">({currentUser.email})</span>
              </span>
              <span className={`text-[10px] font-medium leading-none block ${
                currentUser.role === 'DEAN' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentUser.role === 'DEAN' ? 'Dean, SDSR' : 'Staff Office (Ph.D. Administration)'}
              </span>
            </div>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
              currentUser.role === 'DEAN'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                : 'bg-amber-950 text-amber-300 border border-amber-800/60'
            }`}>
              {currentUser.role}
            </span>
          </div>

          {/* Switch Role Button */}
          <button
            id="navbar-switch-role-btn"
            type="button"
            onClick={() => onSwitchAccount(currentUser.role === 'DEAN' ? 'STAFF' : 'DEAN')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
            title={currentUser.role === 'DEAN' ? 'Switch to Staff Office' : 'Switch to Dean SDSR'}
          >
            <Repeat className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">
              {currentUser.role === 'DEAN' ? 'Switch to Staff' : 'Switch to Dean'}
            </span>
          </button>

          {/* Sign Out Button */}
          <button
            id="navbar-sign-out-btn"
            type="button"
            onClick={onSignOut}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Sign out of portal session"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('desk')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-inner font-cinzel font-bold text-lg border border-amber-400/30">
              Ψ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-lg font-bold tracking-wide text-slate-100">
                  Ph.D. RPC Regulatory Portal
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-medium">
                  SDSR v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Research Progress Committee Scrutiny & Dean Digital Authorization Workflow
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-1.5 text-sm">
            <button
              id="nav-desk-btn"
              type="button"
              onClick={() => setCurrentTab('desk')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'desk'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              SDSR Desk
              <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                {applications.length}
              </span>
            </button>

            <button
              id="nav-workflow-btn"
              type="button"
              onClick={() => setCurrentTab('workflow')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'workflow'
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-300'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <GitCommit className="w-4 h-4 text-indigo-400" />
              Real Workflow & Email Approval
              {pendingDeanCount > 0 && (
                <span className="text-[11px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  {pendingDeanCount}
                </span>
              )}
            </button>

            <button
              id="nav-quick-notice-btn"
              type="button"
              onClick={() => setCurrentTab('staff-generator')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'staff-generator'
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Notice (Staff Input)
            </button>

            <button
              id="nav-new-application-btn"
              type="button"
              onClick={() => setCurrentTab('new-form')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'new-form'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              New RPC Intake
            </button>

            <button
              id="nav-dean-portal-btn"
              type="button"
              onClick={() => setCurrentTab('dean-portal')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 relative ${
                currentTab === 'dean-portal'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Dean Approval
              {pendingDeanCount > 0 ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {pendingDeanCount}
                </span>
              ) : (
                <span className="text-xs bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-full">
                  {approvedCount} signed
                </span>
              )}
            </button>

            <button
              id="nav-docs-hub-btn"
              type="button"
              onClick={() => setCurrentTab('docs-hub')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'docs-hub'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FolderDown className="w-4 h-4 text-amber-400" />
              Example Docs (.docx / Excel)
            </button>

            <button
              id="nav-ordinance-btn"
              type="button"
              onClick={() => setCurrentTab('ordinance')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentTab === 'ordinance'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Ph.D. Ordinance
            </button>

            <button
              id="nav-zero-cost-btn"
              type="button"
              onClick={() => setCurrentTab('zero-cost')}
              className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-xs ${
                currentTab === 'zero-cost'
                  ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700'
                  : 'text-indigo-400 hover:bg-indigo-950/40 hover:text-indigo-300'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Zero Cost FAQ
            </button>
          </nav>
        </div>

        {/* Quick Search on desk view */}
        {currentTab === 'desk' && (
          <div className="py-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                id="search-applications-input"
                type="text"
                placeholder="Search by scholar name, registration no., guide or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <span>
                Active Session: <strong className="text-slate-200">SDSR Academic Year 2024-25</strong>
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">
                Dean SDSR: <strong className="text-slate-200">Prof. (Dr.) S. O. Junare</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
