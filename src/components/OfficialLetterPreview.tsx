import { useState } from 'react';
import { 
  Printer, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Copy, 
  ArrowLeft,
  FileCheck,
  Clock,
  Download,
  AlertTriangle,
  Zap,
  Calendar,
  Globe,
  Building,
  User,
  Edit3
} from 'lucide-react';
import { RPCApplication, RPCMode } from '../types';
import { formatFormalLetterDate } from '../utils/complianceEngine';
import { generateRpcLetterDocx, triggerFileDownload } from '../utils/docxExport';
import { DirectEmailApprovalModal } from './DirectEmailApprovalModal';

interface OfficialLetterPreviewProps {
  application: RPCApplication;
  onBack: () => void;
  onSubmitToDean?: (appId: string, deanEmail: string) => void;
  onOpenDeanPortal?: (appId: string) => void;
  onDirectEmailApprove?: (appId: string, token: string, remarks?: string) => void;
  onOpenWorkflowHub?: () => void;
}

export function OfficialLetterPreview({
  application,
  onBack,
  onSubmitToDean,
  onOpenDeanPortal,
  onDirectEmailApprove,
  onOpenWorkflowHub
}: OfficialLetterPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showEmailApprovalModal, setShowEmailApprovalModal] = useState(false);
  const [deanEmailInput, setDeanEmailInput] = useState('hvipatel007@gmail.com');
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState(false);
  const [showMemberEmailModal, setShowMemberEmailModal] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  // Staff Quick Overrides (Student Name, Date of Meeting, Mode)
  const [scholarName, setScholarName] = useState(application.scholarName);
  const [proposedRpcDate, setProposedRpcDate] = useState(application.proposedRpcDate);
  const [mode, setMode] = useState<RPCMode>(application.mode);
  const [isStaffAdjustOpen, setIsStaffAdjustOpen] = useState(false);

  // Dynamically computed effective application reflecting staff inputs
  const currentApp: RPCApplication = {
    ...application,
    scholarName,
    proposedRpcDate,
    mode,
    meetingVenueOrLink: mode === 'Online'
      ? (application.meetingVenueOrLink.includes('Online')
          ? application.meetingVenueOrLink
          : 'Online (Google Meet link will be shared by Guide)')
      : (application.meetingVenueOrLink.includes('Offline')
          ? application.meetingVenueOrLink
          : 'Offline (Conference Hall / Committee Room, NFSU Gandhinagar)')
  };

  const formattedDate = formatFormalLetterDate(currentApp.proposedRpcDate);

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateRpcLetterDocx(currentApp);
      const safeName = currentApp.scholarName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `RPC_Notice_${safeName}_${currentApp.currentRpcOrdinal}RPC.docx`;
      triggerFileDownload(blob, filename);
    } catch (e) {
      console.error(e);
      alert('Failed to generate Word (.docx) document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textContent = `
Ref: No: ${currentApp.refNo}                                                  Date: ${currentApp.letterDate}

To,
1.    ${currentApp.schoolDeanTitle}
${currentApp.schoolName}
${currentApp.schoolCampus}

2.    ${currentApp.guideName}
${currentApp.guideDesignation}
${currentApp.guideUniversity}

3.    ${currentApp.internalMember.name} (Internal Expert Member)
${currentApp.internalMember.designation}
${currentApp.internalMember.affiliation}

4.    ${currentApp.externalMember1.name} (External Expert Member)
${currentApp.externalMember1.designation}
${currentApp.externalMember1.affiliation}

5.    ${currentApp.externalMember2.name} (External Expert Member)
${currentApp.externalMember2.designation}
${currentApp.externalMember2.affiliation}

Subject: ${currentApp.currentRpcOrdinal} Meeting of the Research Progress Committee (RPC) for Ph.D. Scholar Registered under ${currentApp.guideName}, ${currentApp.guideDesignation}, ${currentApp.guideSchool}, ${currentApp.guideUniversity}.

Dear Sir/Madam,

The meeting of Research Progress Committee (RPC) for undernoted Ph.D. ${currentApp.schoolName} NFSU is scheduled on ${formattedDate} from ${currentApp.rpcTime} through ${currentApp.mode.toLowerCase()} mode.

• Name of Ph.D. Scholar- ${currentApp.scholarName} (${currentApp.currentRpcOrdinal}RPC)
  Research Topic: "${currentApp.researchTopic}"
  Meeting Details: ${currentApp.meetingVenueOrLink}

Your presence and valuable suggestions are highly appreciated. Kindly make it convenient to attend the meeting.

Thanking you,

Dean
School of Doctoral Studies and Research (SDSR)
National Forensic Sciences University, Gandhinagar
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDispatchToDean = () => {
    if (onSubmitToDean) {
      onSubmitToDean(application.id, deanEmailInput);
      setShowDispatchModal(false);
      setDispatchSuccessToast(true);
      setTimeout(() => setDispatchSuccessToast(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          id="letter-back-btn"
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Processing Desk
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          {application.status === 'Approved_By_Dean' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Digitally Approved by Dean SDSR
            </span>
          ) : application.status === 'Submitted_To_Dean' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pending Dean Digital Sign
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
              <FileCheck className="w-3.5 h-3.5" />
              SDSR Draft Stage
            </span>
          )}

          <button
            id="copy-letter-text-btn"
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied to Clipboard!' : 'Copy Letter Text'}
          </button>

          <button
            id="print-letter-btn"
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-1.5 text-xs font-medium shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Notice
          </button>

          <button
            id="download-docx-letter-btn"
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="px-3 py-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isExportingDocx ? 'Generating Word...' : 'Download Word (.docx)'}
          </button>

          {/* If not approved yet, offer dispatch to Dean */}
          {application.status !== 'Approved_By_Dean' && (
            <button
              id="dispatch-to-dean-btn"
              type="button"
              onClick={() => setShowDispatchModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Forward to Dean SDSR
            </button>
          )}

          {/* Quick Dean Portal switch if pending */}
          {application.status === 'Submitted_To_Dean' && onOpenDeanPortal && (
            <button
              id="open-dean-sign-btn"
              type="button"
              onClick={() => onOpenDeanPortal(application.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Open Dean Sign Desk
            </button>
          )}

          {/* Direct Email Approval Trigger */}
          {application.status === 'Submitted_To_Dean' && onDirectEmailApprove && (
            <button
              id="open-email-approval-btn"
              type="button"
              onClick={() => setShowEmailApprovalModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5 text-xs font-bold shadow-sm transition-all hover:scale-[1.01]"
              title="Open Direct Email Approval view as received by Dean (hvipatel007@gmail.com)"
            >
              <Mail className="w-3.5 h-3.5" />
              Direct Email Approve
            </button>
          )}

          {/* If already approved, button to dispatch to committee members */}
          {application.status === 'Approved_By_Dean' && (
            <button
              id="email-committee-btn"
              type="button"
              onClick={() => setShowMemberEmailModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              Dispatch to RPC Members
            </button>
          )}
        </div>
      </div>

      {/* Staff Quick Adjustment Bar: Student Name, Date, Mode (Online/Offline) */}
      <div className="no-print mb-6 bg-white border border-amber-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Staff Quick Parameter Override
              </span>
              <span className="text-[11px] text-slate-500">
                Adjust Student Name, Date, or Mode. The letter below and Word (.docx) update in real-time.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsStaffAdjustOpen(!isStaffAdjustOpen)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
          >
            {isStaffAdjustOpen ? 'Hide Controls' : 'Edit 3 Parameters'}
          </button>
        </div>

        {/* The 3 Inputs */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 ${isStaffAdjustOpen ? 'block' : 'hidden md:grid'}`}>
          {/* 1. Student Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block flex items-center gap-1">
              <User className="w-3 h-3 text-amber-600" />
              1. Student Name
            </label>
            <input
              id="letter-override-student-name"
              type="text"
              value={scholarName}
              onChange={(e) => setScholarName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 bg-amber-50/30"
              placeholder="e.g. Ms. Devanshi Lunagariya"
            />
          </div>

          {/* 2. Meeting Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              2. Meeting Date
            </label>
            <input
              id="letter-override-meeting-date"
              type="date"
              value={proposedRpcDate}
              onChange={(e) => setProposedRpcDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 bg-amber-50/30"
            />
          </div>

          {/* 3. Mode of Meeting: Online / Offline */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-600" />
              3. Mode (Online / Offline)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="letter-mode-online-btn"
                type="button"
                onClick={() => setMode('Online')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                  mode === 'Online'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Globe className="w-3 h-3" />
                Online
              </button>
              <button
                id="letter-mode-offline-btn"
                type="button"
                onClick={() => setMode('Offline')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                  mode === 'Offline'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Building className="w-3 h-3" />
                Offline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {dispatchSuccessToast && (
        <div className="no-print bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm">
            <strong>Letter forwarded successfully!</strong> Official RPC notification docket redirected to Dean SDSR ({deanEmailInput}) for digital authorization.
          </span>
        </div>
      )}

      {/* The Printable Official Letter Document */}
      <div 
        id="official-rpc-letterhead"
        className="print-page bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 text-slate-900 font-serif-doc relative"
      >
        {/* Draft watermark if not approved yet */}
        {application.status !== 'Approved_By_Dean' && (
          <div className="no-print absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="font-cinzel text-7xl font-bold text-slate-800 rotate-[-25deg] uppercase">
              Draft Docket
            </span>
          </div>
        )}

        {/* University Official Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center font-cinzel">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-slate-900 uppercase">
            National Forensic Sciences University
          </h2>
          <p className="text-xs tracking-widest text-slate-700 uppercase mt-0.5">
            (An Institution of National Importance under Ministry of Home Affairs, Govt. of India)
          </p>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 uppercase mt-1 tracking-wide">
            School of Doctoral Studies and Research (SDSR)
          </h3>
          <p className="text-[11px] font-sans text-slate-600 mt-0.5">
            Sector-9, Gandhinagar - 382007, Gujarat | Email: sdsr@nfsu.ac.in | Website: www.nfsu.ac.in
          </p>
        </div>

        {/* Reference Number and Date Line */}
        <div className="flex flex-wrap justify-between items-baseline mb-6 font-sans text-sm font-semibold">
          <div className="text-slate-900">
            <span>Ref: No: </span>
            <span className="underline decoration-slate-400 font-mono tracking-tight text-slate-950">
              {application.refNo}
            </span>
          </div>
          <div className="text-slate-900">
            <span>Date: </span>
            <span className="underline decoration-slate-400 font-mono">
              {application.letterDate}
            </span>
          </div>
        </div>

        {/* Recipients (Addressed To) */}
        <div className="mb-6 space-y-3 font-sans text-xs sm:text-sm leading-relaxed text-slate-900">
          <p className="font-bold mb-1">To,</p>

          {/* 1. Dean of School */}
          <div className="pl-4">
            <p className="font-bold">1. &nbsp; {application.schoolDeanTitle}</p>
            <p>{application.schoolName}</p>
            <p>{application.schoolCampus}</p>
          </div>

          {/* 2. Guide */}
          <div className="pl-4">
            <p className="font-bold">2. &nbsp; {application.guideName}</p>
            <p>{application.guideDesignation}</p>
            <p>{application.guideUniversity}</p>
          </div>

          {/* 3. Internal Expert Member */}
          <div className="pl-4">
            <p className="font-bold">
              3. &nbsp; {application.internalMember.name} (Internal Expert Member).
            </p>
            <p>{application.internalMember.designation}</p>
            <p>{application.internalMember.affiliation}</p>
          </div>

          {/* 4. External Expert Member 1 */}
          <div className="pl-4">
            <p className="font-bold">
              4. &nbsp; {application.externalMember1.name} (External Expert Member)
            </p>
            <p>{application.externalMember1.designation}</p>
            <p>{application.externalMember1.affiliation}</p>
          </div>

          {/* 5. External Expert Member 2 */}
          <div className="pl-4">
            <p className="font-bold">
              5. &nbsp; {application.externalMember2.name} (External Expert Member).
            </p>
            <p>{application.externalMember2.designation}</p>
            <p>{application.externalMember2.affiliation}</p>
          </div>
        </div>

        {/* Subject Line */}
        <div className="mb-6 font-sans text-xs sm:text-sm font-bold leading-normal text-slate-950 bg-slate-50 p-2.5 rounded border-l-4 border-slate-900">
          Subject: {currentApp.currentRpcOrdinal} Meeting of the Research Progress Committee (RPC) for Ph.D. Scholar Registered under {currentApp.guideName}, {currentApp.guideDesignation}, {currentApp.guideSchool}, NFSU.
        </div>

        {/* Salutation and Letter Body */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800 text-justify">
          <p>Dear Sir/Madam,</p>

          <p>
            The meeting of <strong>Research Progress Committee (RPC)</strong> for undernoted Ph.D. <strong>{currentApp.schoolName}</strong> NFSU is scheduled on <strong>{formattedDate} from {currentApp.rpcTime}</strong> through <strong>{currentApp.mode.toLowerCase()}</strong> mode.
          </p>

          {/* Scholar Bullet Highlight */}
          <div className="my-3 pl-4 border-l-2 border-amber-500 py-1 font-sans text-xs sm:text-sm">
            <p className="font-bold text-slate-950">
              • &nbsp; Name of Ph.D. Scholar- {currentApp.scholarName} ({currentApp.currentRpcOrdinal}RPC)
            </p>
            {currentApp.researchTopic && (
              <p className="text-xs text-slate-600 mt-1 italic pl-3">
                Research Topic: &quot;{currentApp.researchTopic}&quot;
              </p>
            )}
            {currentApp.mode === 'Online' && (
              <p className="text-xs text-blue-700 mt-1 pl-3 font-mono">
                Meeting Details: {currentApp.meetingVenueOrLink}
              </p>
            )}
            {currentApp.mode === 'Offline' && (
              <p className="text-xs text-amber-800 mt-1 pl-3 font-medium">
                Campus Venue: {currentApp.meetingVenueOrLink}
              </p>
            )}
          </div>

          <p>
            Your presence and valuable suggestions are highly appreciated. Kindly make it convenient to attend the meeting.
          </p>

          <p className="pt-2">Thanking you,</p>
        </div>

        {/* Signature Section */}
        <div className="mt-8 pt-4 flex flex-col items-end">
          {application.deanApproval?.isApproved ? (
            /* Digitally Signed Stamp Block */
            <div className="border border-emerald-600 bg-emerald-50/50 p-3 rounded-lg max-w-sm text-right font-sans">
              <div className="flex items-center justify-end gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Digitally Signed & Approved
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {application.deanApproval.deanName}
              </p>
              <p className="text-xs text-slate-600">
                Dean, School of Doctoral Studies and Research
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Signed on: {new Date(application.deanApproval.approvalTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
              <p className="text-[9px] text-slate-400 font-mono truncate max-w-xs">
                Cert ID: {application.deanApproval.digitalCertificateId}
              </p>
              <p className="text-[8px] text-slate-400 font-mono truncate max-w-xs">
                Hash: {application.deanApproval.verificationHash}
              </p>
            </div>
          ) : (
            /* Placeholder for signature before approval */
            <div className="w-64 text-center font-sans">
              <div className="h-16 border-b border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 italic">
                (Awaiting Dean SDSR Digital Signature)
              </div>
              <p className="font-bold text-slate-900 text-sm mt-1">Dean</p>
              <p className="text-xs text-slate-700">
                School of Doctoral Studies and Research
              </p>
            </div>
          )}

          {application.deanApproval?.isApproved && (
            <div className="mt-2 text-right font-sans">
              <p className="font-bold text-slate-900 text-sm">Dean</p>
              <p className="text-xs text-slate-700 font-semibold">
                School of Doctoral Studies and Research
              </p>
            </div>
          )}
        </div>

        {/* Copy to Section */}
        <div className="mt-8 pt-4 border-t border-slate-300 font-sans text-xs text-slate-800 space-y-1">
          <p className="font-bold">Copy to:</p>
          <p className="pl-4">1. &nbsp; Associate Dean- SDSR</p>
          <p className="pl-4">2. &nbsp; Dean of the Concerned School ({application.schoolName})</p>
          <p className="pl-4">3. &nbsp; Ph.D. Section Record File, SDSR</p>
        </div>
      </div>

      {/* Dispatch to Dean SDSR Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Forward RPC Letter to Dean SDSR
                  </h4>
                  <p className="text-xs text-slate-500">
                    Automated notification & digital signature request
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Dean, SDSR Email Address:
                </label>
                <input
                  type="email"
                  value={deanEmailInput}
                  onChange={(e) => setDeanEmailInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <p>
                  <strong>Subject:</strong> [Action Required] RPC Letter Approval - {application.scholarName} ({application.currentRpcOrdinal} RPC) - Ref: {application.refNo}
                </p>
                <p>
                  <strong>Attachment:</strong> Verified RPC Docket & Scrutiny Certificate
                </p>
                <p className="text-slate-600">
                  Respected Dean Sir, Kindly review and execute digital approval for the scheduled {application.currentRpcOrdinal} RPC meeting of {application.scholarName} ({application.schoolName}).
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Once forwarded, the Dean receives immediate access in their approval inbox. Upon Dean&apos;s digital signature, the approved status will automatically reflect back in the SDSR office.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchToDean}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Confirm & Dispatch to Dean
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Email Dispatch Modal */}
      {showMemberEmailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Dispatch Approved Notice to RPC Members
                  </h4>
                  <p className="text-xs text-slate-500">
                    Official calendar invitation and formal letter copy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMemberEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="my-4 space-y-2.5 text-xs text-slate-700">
              <p className="font-semibold text-slate-800">Notice will be emailed to all 5 approved members:</p>
              <ul className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <li className="flex items-center justify-between">
                  <span>1. {application.schoolDeanTitle}, {application.schoolName}</span>
                  <span className="text-slate-500 font-mono">dean.{application.schoolName.toLowerCase().replace(/[^a-z]/g, '')}@nfsu.ac.in</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>2. {application.guideName} (Guide)</span>
                  <span className="text-slate-500 font-mono">{application.guideEmail}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>3. {application.internalMember.name} (Internal Expert)</span>
                  <span className="text-slate-500 font-mono">{application.internalMember.email}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>4. {application.externalMember1.name} (External Expert 1)</span>
                  <span className="text-slate-500 font-mono">{application.externalMember1.email}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>5. {application.externalMember2.name} (External Expert 2)</span>
                  <span className="text-slate-500 font-mono">{application.externalMember2.email}</span>
                </li>
                <li className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-500">
                  <span>Copy to: Dean, SDSR</span>
                  <span className="font-mono">hvipatel007@gmail.com</span>
                </li>
                <li className="flex items-center justify-between text-slate-500">
                  <span>Copy to: Ph.D. Administration Staff</span>
                  <span className="font-mono">harsh142022@gmail.com</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowMemberEmailModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Close
              </button>
              <a
                href={`mailto:${application.guideEmail},${application.internalMember.email},${application.externalMember1.email},${application.externalMember2.email}?cc=hvipatel007@gmail.com,harsh142022@gmail.com&subject=${encodeURIComponent(`[Official Notice] ${application.currentRpcOrdinal} Meeting of RPC - ${application.scholarName} (${application.refNo})`)}&body=${encodeURIComponent(`Respected Members,\n\nPlease find attached the official sanctioned notice for the ${application.currentRpcOrdinal} Research Progress Committee (RPC) meeting of Ph.D. Scholar ${application.scholarName} scheduled on ${formattedDate} at ${application.rpcTime}.\n\nMode: ${application.mode} (${application.meetingVenueOrLink})\n\nRef: ${application.refNo}\n\nSchool of Doctoral Studies and Research (SDSR)\nNFSU Gandhinagar`)}`}
                onClick={() => setShowMemberEmailModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Send via Email Client
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Direct Email Approval Simulation Modal (Dean's Email Client View) */}
      {showEmailApprovalModal && onDirectEmailApprove && (
        <DirectEmailApprovalModal
          application={application}
          isOpen={showEmailApprovalModal}
          onClose={() => setShowEmailApprovalModal(false)}
          onDirectApprove={(appId, token, remarks) => {
            onDirectEmailApprove(appId, token, remarks);
            setShowEmailApprovalModal(false);
          }}
          onDirectClarify={(appId, remarks) => {
            setShowEmailApprovalModal(false);
          }}
        />
      )}
    </div>
  );
}
