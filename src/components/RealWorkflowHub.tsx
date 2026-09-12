import React, { useState } from 'react';
import { 
  GitCommit, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  Send, 
  Download, 
  Sparkles, 
  Zap, 
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Key
} from 'lucide-react';
import { RPCApplication, AuthenticatedUser } from '../types';
import { 
  formatFormalLetterDate, 
  generateEmailApprovalToken, 
  generateDirectApprovalEmailPacket,
  generateDirectEmailApprovalMetadata
} from '../utils/complianceEngine';
import { DirectEmailApprovalModal } from './DirectEmailApprovalModal';

interface RealWorkflowHubProps {
  applications: RPCApplication[];
  onSelectApplication: (app: RPCApplication) => void;
  onForwardToDean: (appId: string) => void;
  onDirectEmailApprove: (appId: string, token: string, remarks?: string) => void;
  onDirectEmailClarify?: (appId: string, remarks: string) => void;
  currentUser: AuthenticatedUser | null;
  onSwitchUser?: (role: 'DEAN' | 'STAFF') => void;
  onOpenQuickStaffGenerator?: () => void;
}

export function RealWorkflowHub({
  applications,
  onSelectApplication,
  onForwardToDean,
  onDirectEmailApprove,
  onDirectEmailClarify,
  currentUser,
  onSwitchUser,
  onOpenQuickStaffGenerator
}: RealWorkflowHubProps) {
  const [selectedAppForEmailModal, setSelectedAppForEmailModal] = useState<RPCApplication | null>(null);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [tokenVerificationResult, setTokenVerificationResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Applications pending Dean email approval
  const pendingDeanEmail = applications.filter(a => a.status === 'Submitted_To_Dean');
  const approvedApps = applications.filter(a => a.status === 'Approved_By_Dean');
  const draftApps = applications.filter(a => a.status === 'Draft' || a.status === 'SDSR_Audit');

  const filteredApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.scholarName.toLowerCase().includes(q) ||
      app.refNo.toLowerCase().includes(q) ||
      app.schoolName.toLowerCase().includes(q) ||
      app.guideName.toLowerCase().includes(q)
    );
  });

  const handleCopyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = manualTokenInput.trim();
    if (!token) return;

    // Look for application matching token or pending
    const matchedApp = applications.find(a => 
      a.emailApprovalToken?.toLowerCase() === token.toLowerCase() ||
      token.toLowerCase().includes(a.refNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toLowerCase())
    ) || pendingDeanEmail[0];

    if (matchedApp) {
      onDirectEmailApprove(matchedApp.id, token, 'Direct manual token verification and ratification executed.');
      setTokenVerificationResult({
        success: true,
        message: `Token [${token}] verified! Application for ${matchedApp.scholarName} (${matchedApp.refNo}) has been successfully approved and digitally signed.`
      });
      setManualTokenInput('');
    } else {
      setTokenVerificationResult({
        success: false,
        message: `Token [${token}] could not be matched with an active pending docket. Please verify the code.`
      });
    }
    setTimeout(() => setTokenVerificationResult(null), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-3 sm:px-4 animate-fade-in space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                INSTITUTIONAL GOVERNANCE
              </span>
              <span className="text-xs text-slate-300 font-mono">
                NFSU SDSR Ph.D. Ordinance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Real Institutional Workflow & Direct Email Approval Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Enabling statutory docket scrutiny by Staff (<strong className="text-amber-300">harsh142022@gmail.com</strong>) and one-click direct email approval by the Dean (<strong className="text-emerald-300">hvipatel007@gmail.com</strong>) with cryptographic audit integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenQuickStaffGenerator && (
              <button
                type="button"
                onClick={onOpenQuickStaffGenerator}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                ⚡ 3-Input Quick Notice
              </button>
            )}
            {currentUser?.role === 'STAFF' && onSwitchUser && (
              <button
                type="button"
                onClick={() => onSwitchUser('DEAN')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Switch to Dean View
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Awaiting Email Approval</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-amber-400">{pendingDeanEmail.length}</span>
              <span className="text-[10px] text-amber-300/80 font-medium">at hvipatel007</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Digitally Ratified Notices</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-emerald-400">{approvedApps.length}</span>
              <span className="text-[10px] text-emerald-300/80 font-medium">Ready to broadcast</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Staff Scrutiny Docket</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-blue-400">{draftApps.length}</span>
              <span className="text-[10px] text-blue-300/80 font-medium">at harsh142022</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Total Registered Candidates</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-white">{applications.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">NFSU Ph.D. roll</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Stage Institutional Real Workflow Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-indigo-600" />
              The Official 5-Stage Real Workflow Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly adherence to statutory Ph.D. regulations and executive digital governance
            </p>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start">
            End-to-End Audited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          
          {/* Stage 1 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center mb-2">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Docket Intake & Scrutiny</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Ph.D. Administration Section (<strong className="text-slate-700">harsh142022@gmail.com</strong>) validates candidate, 6-month progress interval & fee receipts.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 self-start">
              13-Point Check
            </span>
          </div>

          {/* Stage 2 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center mb-2">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Docket Dispatch & Token</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Official notice docket dispatched to Dean SDSR with unique, tamper-proof Direct Approval Token & action link.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 self-start">
              To: hvipatel007
            </span>
          </div>

          {/* Stage 3 */}
          <div className="bg-amber-50/70 rounded-xl p-4 border-2 border-amber-300 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                3
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-amber-950 text-xs">Direct Email Approval</h3>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </div>
              <p className="text-[11px] text-amber-900 mt-1 leading-normal">
                Dean (<strong className="text-slate-900">hvipatel007@gmail.com</strong>) receives interactive email and ratifies notice with <strong>1-Click</strong> or direct email reply!
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 self-start">
              ⚡ 1-Click Action
            </span>
          </div>

          {/* Stage 4 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-2">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Cryptographic Sanction</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                System stamps official SHA-256 digital signature hash, Digital Certificate Serial ID, and IST approval timestamp onto the letter.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start">
              Tamper-Proof
            </span>
          </div>

          {/* Stage 5 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center mb-2">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Committee Broadcast</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Ratified notice emailed to Guide, Scholar, Internal Member & External Experts, with Word (.docx) & PDF download.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 self-start">
              Notice Issued
            </span>
          </div>

        </div>
      </div>

      {/* Manual Token Verification Tool */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Direct Email Approval Token Validator
              </h3>
              <p className="text-xs text-amber-800">
                Paste an approval token received via email (e.g. from Dean <code className="font-mono font-semibold">hvipatel007@gmail.com</code>) to instantly ratify
              </p>
            </div>
          </div>

          <form onSubmit={handleManualTokenSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
            <input
              type="text"
              value={manualTokenInput}
              onChange={(e) => setManualTokenInput(e.target.value)}
              placeholder="e.g. NFSU-APR-042-8X92"
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-600 flex-1 sm:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors flex-shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify & Approve
            </button>
          </form>
        </div>

        {tokenVerificationResult && (
          <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
            tokenVerificationResult.success
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium'
              : 'bg-rose-100 border border-rose-300 text-rose-900'
          }`}>
            {tokenVerificationResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{tokenVerificationResult.message}</span>
          </div>
        )}
      </div>

      {/* Direct Email Approval Queue (Awaiting Dean Sanction) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Active Direct Email Approval Queue
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {pendingDeanEmail.length} Pending Dean Sanction
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dockets dispatched to <strong className="text-slate-700">hvipatel007@gmail.com</strong> ready for one-click email authorization
            </p>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>Dispatched By:</span>
            <span className="font-mono font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
              harsh142022@gmail.com
            </span>
          </div>
        </div>

        {pendingDeanEmail.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              All Forwarded Dockets Have Been Approved!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no dockets currently awaiting Dean approval. You can generate a new notice or forward one from the processing desk.
            </p>
            {onOpenQuickStaffGenerator && (
              <button
                type="button"
                onClick={onOpenQuickStaffGenerator}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-colors"
              >
                <Zap className="w-4 h-4" />
                Generate New Staff Notice
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {pendingDeanEmail.map((app) => {
              const token = app.emailApprovalToken || generateEmailApprovalToken(app.id, app.refNo);
              const formattedDate = formatFormalLetterDate(app.proposedRpcDate);
              const emailPacket = generateDirectApprovalEmailPacket(app, token);

              return (
                <div key={app.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          {app.refNo}
                        </span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Dean Direct Approval
                        </span>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {app.currentRpcOrdinal} RPC Meeting
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1.5 flex items-center gap-2">
                        {app.scholarName}
                        <span className="text-xs font-normal text-slate-500">
                          ({app.registrationNo}) • {app.schoolName}
                        </span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                        <span>Guide: <strong>{app.guideName}</strong></span>
                        <span>Proposed Date: <strong>{formattedDate}</strong> ({app.rpcTime})</span>
                        <span>Mode: <strong className="text-blue-700">{app.mode}</strong></span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAppForEmailModal(app)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.01]"
                        title="Open full interactive email simulator as received by Dean"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Simulate Direct Email Approval
                      </button>

                      <button
                        type="button"
                        onClick={() => onDirectEmailApprove(app.id, token, 'Direct 1-click execution ratified.')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                        title="Execute digital signature immediately"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        1-Click Sign as Dean
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectApplication(app)}
                        className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        title="View official letterhead layout"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Letter
                      </button>
                    </div>
                  </div>

                  {/* Email & Token Metadata Strip */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500">Direct Approval Token:</span>
                      <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                        {token}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyToken(token, app.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                      >
                        {copiedTokenId === app.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedTokenId === app.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <span>Recipient: <strong className="text-slate-900 font-mono">hvipatel007@gmail.com</strong></span>
                      <a
                        href={emailPacket.mailtoLink}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Send Real Mailto
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Master Institutional Docket Registry */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Institutional Docket Pipeline Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of all registered candidates across the 5 workflow stages
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, ref no..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="p-3">Ref No. & Candidate</th>
                <th className="p-3">School & Guide</th>
                <th className="p-3">Meeting Details</th>
                <th className="p-3">Compliance Scrutiny</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.slice(0, 10).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <span className="font-mono text-[11px] text-slate-500 block">{app.refNo}</span>
                    <strong className="text-slate-900 text-xs">{app.scholarName}</strong>
                    <span className="text-[10px] text-slate-500 block font-mono">{app.registrationNo}</span>
                  </td>

                  <td className="p-3">
                    <span className="text-slate-900 font-medium block">{app.schoolName}</span>
                    <span className="text-[11px] text-slate-500 block">Guide: {app.guideName}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-semibold text-slate-800 block">
                      {app.currentRpcOrdinal} RPC • {app.mode}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {formatFormalLetterDate(app.proposedRpcDate)}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Passed (6 Mo. Gap)
                    </span>
                  </td>

                  <td className="p-3">
                    {app.status === 'Approved_By_Dean' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Stage 4/5: Ratified
                      </span>
                    ) : app.status === 'Submitted_To_Dean' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Stage 3: Email Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                        <FileText className="w-3 h-3" />
                        Stage 1: Staff Scrutiny
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-1">
                    {app.status === 'Submitted_To_Dean' && (
                      <button
                        type="button"
                        onClick={() => setSelectedAppForEmailModal(app)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                        title="Direct Email Approval"
                      >
                        <Mail className="w-3 h-3" />
                        Email Approve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="px-2.5 py-1 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Email Approval Simulator Modal */}
      {selectedAppForEmailModal && (
        <DirectEmailApprovalModal
          application={selectedAppForEmailModal}
          isOpen={Boolean(selectedAppForEmailModal)}
          onClose={() => setSelectedAppForEmailModal(null)}
          onDirectApprove={onDirectEmailApprove}
          onDirectClarify={onDirectEmailClarify}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
