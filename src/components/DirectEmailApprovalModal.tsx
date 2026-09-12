import React, { useState } from 'react';
import { 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Clock, 
  User, 
  Calendar, 
  Globe, 
  Building, 
  FileText,
  Send,
  Zap,
  Check,
  X
} from 'lucide-react';
import { RPCApplication, AuthenticatedUser } from '../types';
import { 
  formatFormalLetterDate, 
  generateEmailApprovalToken, 
  generateDirectApprovalEmailPacket 
} from '../utils/complianceEngine';

interface DirectEmailApprovalModalProps {
  application: RPCApplication;
  isOpen?: boolean;
  onClose: () => void;
  onDirectApprove: (appId: string, token: string, remarks?: string) => void;
  onDirectClarify?: (appId: string, remarks: string) => void;
  currentUser?: AuthenticatedUser | null;
}

export function DirectEmailApprovalModal({
  application,
  isOpen = true,
  onClose,
  onDirectApprove,
  onDirectClarify,
  currentUser
}: DirectEmailApprovalModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [customRemarks, setCustomRemarks] = useState('');
  const [showClarifyInput, setShowClarifyInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Active or derived token
  const token = application.emailApprovalToken || generateEmailApprovalToken(application.id, application.refNo);
  const emailPacket = generateDirectApprovalEmailPacket(application, token);
  const formattedDate = formatFormalLetterDate(application.proposedRpcDate);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(emailPacket.directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleExecuteApproval = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onDirectApprove(application.id, token, customRemarks || undefined);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  const handleExecuteClarification = () => {
    if (!customRemarks.trim()) return;
    if (onDirectClarify) {
      onDirectClarify(application.id, customRemarks);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Direct Email Approval Simulator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  REAL WORKFLOW
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Delivered to Dean SDSR: <strong className="text-amber-200 font-mono">hvipatel007@gmail.com</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Client Envelope Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs space-y-1.5 font-sans">
          <div className="flex items-center justify-between text-slate-600">
            <span><strong>From:</strong> Ph.D. Administration Section &lt;harsh142022@gmail.com&gt;</span>
            <span className="text-[11px] text-slate-400">Just now (IST)</span>
          </div>
          <div className="text-slate-700">
            <strong>To:</strong> Dean, SDSR &lt;hvipatel007@gmail.com&gt;
          </div>
          <div className="text-slate-700">
            <strong>Subject:</strong> <span className="font-semibold text-slate-900">{emailPacket.subject}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500">Security Token:</span>
            <span className="font-mono text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">
              {token}
            </span>
            <button
              type="button"
              onClick={handleCopyToken}
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedToken ? 'Copied' : 'Copy Token'}
            </button>
          </div>
        </div>

        {/* Email Body Preview */}
        <div className="p-5 max-h-[58vh] overflow-y-auto space-y-4 text-xs text-slate-800">
          
          {/* Institutional Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-1">
              National Forensic Sciences University • SDSR
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Official Docket for Direct Email Sanction
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Ref No: <span className="font-mono text-amber-200 font-semibold">{application.refNo}</span>
            </p>
          </div>

          <p className="leading-relaxed">
            Respected Dean Sir (<strong>hvipatel007@gmail.com</strong>),
          </p>
          <p className="leading-relaxed text-slate-700">
            The Ph.D. Administration Section (<strong>harsh142022@gmail.com</strong>) has scrutinized and verified the eligibility of the undernoted research progress committee docket in accordance with the NFSU Ph.D. Ordinance. Your digital authorization is requested.
          </p>

          {/* Core Application Digest Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Candidate Name</span>
                <strong className="text-slate-900 text-xs">{application.scholarName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Enrollment / Reg No.</span>
                <strong className="text-slate-900 font-mono">{application.registrationNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">School & Campus</span>
                <strong className="text-slate-900">{application.schoolName} ({application.schoolCampus})</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Research Guide</span>
                <strong className="text-slate-900">{application.guideName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Meeting Date & Time</span>
                <strong className="text-slate-900">{formattedDate} from {application.rpcTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mode & Venue</span>
                <span className="font-semibold text-blue-700">{application.mode}</span> — {application.meetingVenueOrLink}
              </div>
            </div>

            {application.researchTopic && (
              <div className="pt-2 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500 block">Research Topic:</span>
                <span className="italic text-slate-800 font-serif">&quot;{application.researchTopic}&quot;</span>
              </div>
            )}
          </div>

          {/* Statutory Scrutiny Status */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong className="block font-semibold text-emerald-950">
                Statutory Ordinance Scrutiny Passed (100% Cleared)
              </strong>
              <div className="text-emerald-800 mt-0.5">
                • 6-Month Semester Progress Gap: <strong>COMPLIANT ({application.complianceAudit.timeGapMonths} Months verified)</strong><br />
                • Semester Fee Receipts: <strong>ALL VERIFIED</strong><br />
                • Committee Quorum: <strong>Guide + Internal Expert + 2 External Members Approved</strong>
              </div>
            </div>
          </div>

          {/* Direct Email Action Trigger Box */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <strong className="text-amber-950 text-xs">
                Direct Dean Email Approval Actions
              </strong>
            </div>

            <p className="text-[11px] text-amber-900 leading-normal">
              As Dean SDSR, you can sanction this meeting notice immediately with one click. The system will cryptographically sign the notice under your name and issue the ratification notice back to staff and committee members.
            </p>

            {/* Primary One-Click Direct Approval Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                id="direct-email-approve-button"
                type="button"
                onClick={handleExecuteApproval}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4" />
                {isProcessing ? 'Executing Digital Sanction...' : '⚡ 1-Click Direct Approve & Sign as Dean'}
              </button>

              <a
                href={emailPacket.mailtoLink}
                className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Open in native email client"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Reply via Mail App
              </a>
            </div>

            {/* Remarks or Clarification */}
            <div className="pt-2 border-t border-amber-200">
              {!showClarifyInput ? (
                <div className="flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowClarifyInput(true)}
                    className="text-amber-800 hover:text-amber-950 underline font-medium"
                  >
                    + Add Dean approval remark or request clarification
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedLink ? 'Link Copied!' : 'Copy Direct Action Link'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Dean Remarks / Clarification Notes:
                  </label>
                  <textarea
                    value={customRemarks}
                    onChange={(e) => setCustomRemarks(e.target.value)}
                    rows={2}
                    placeholder="e.g. Approved as proposed. Ensure external member attendance certificate is filed."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    {onDirectClarify && (
                      <button
                        type="button"
                        onClick={handleExecuteClarification}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-semibold hover:bg-amber-700"
                      >
                        Send Revision Request to Staff
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowClarifyInput(false)}
                      className="text-[11px] text-slate-500 px-2 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-1">
            School of Doctoral Studies and Research (SDSR) • National Forensic Sciences University, Gandhinagar
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>Token expires in 72 hours if unsigned</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            Close Email View
          </button>
        </div>

      </div>
    </div>
  );
}
