import { useState, useRef, ChangeEvent } from 'react';
import { 
  FileText, 
  Send, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Calendar,
  Building,
  User,
  ArrowRight,
  Download,
  Table,
  Upload,
  Sparkles,
  Zap,
  Mail,
  GitCommit
} from 'lucide-react';
import { RPCApplication, ApplicationStatus } from '../types';
import { formatFormalLetterDate } from '../utils/complianceEngine';
import { exportApplicationsToExcel, parseExcelUpload } from '../utils/excelExport';
import { generateRpcLetterDocx, triggerFileDownload } from '../utils/docxExport';
import { SCREENSHOT_CANDIDATE_ROWS, convertRowsToRpcApplications } from '../data/screenshotCandidates';
import { DirectEmailApprovalModal } from './DirectEmailApprovalModal';

interface SDSRDeskProps {
  applications: RPCApplication[];
  onSelectApplication: (app: RPCApplication) => void;
  onNewApplication: () => void;
  onForwardToDean: (appId: string) => void;
  onOpenDeanPortal: (appId: string) => void;
  onDeleteApplication: (appId: string) => void;
  onOpenDocsHub?: () => void;
  onImportApplications?: (newApps: RPCApplication[]) => void;
  onOpenStaffGenerator?: () => void;
  onOpenWorkflowHub?: () => void;
  onDirectEmailApprove?: (appId: string, token: string, remarks?: string) => void;
}

export function SDSRDesk({
  applications,
  onSelectApplication,
  onNewApplication,
  onForwardToDean,
  onOpenDeanPortal,
  onDeleteApplication,
  onOpenDocsHub,
  onImportApplications,
  onOpenStaffGenerator,
  onOpenWorkflowHub,
  onDirectEmailApprove
}: SDSRDeskProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [schoolFilter, setSchoolFilter] = useState<string>('ALL');
  const [exportingDocxId, setExportingDocxId] = useState<string | null>(null);
  const [deskToast, setDeskToast] = useState<string | null>(null);
  const [directEmailModalApp, setDirectEmailModalApp] = useState<RPCApplication | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metrics
  const totalApps = applications.length;
  const pendingDean = applications.filter(a => a.status === 'Submitted_To_Dean').length;
  const approvedApps = applications.filter(a => a.status === 'Approved_By_Dean').length;
  const draftOrAudit = applications.filter(a => a.status === 'Draft' || a.status === 'SDSR_Audit').length;

  const handleExportExcel = () => {
    exportApplicationsToExcel(applications);
    setDeskToast('Exported Master Register to Excel (.xlsx)!');
    setTimeout(() => setDeskToast(null), 4000);
  };

  const handleCardDocxDownload = async (app: RPCApplication) => {
    try {
      setExportingDocxId(app.id);
      const blob = await generateRpcLetterDocx(app);
      const safeName = app.scholarName.replace(/[^a-zA-Z0-9]/g, '_');
      triggerFileDownload(blob, `RPC_Letter_${safeName}_${app.currentRpcOrdinal}RPC.docx`);
      setDeskToast(`Downloaded Word (.docx) letter for ${app.scholarName}!`);
      setTimeout(() => setDeskToast(null), 4000);
    } catch (e) {
      console.error(e);
      alert('Error generating Word document.');
    } finally {
      setExportingDocxId(null);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportApplications) return;

    try {
      const parsedRows = await parseExcelUpload(file);
      if (parsedRows.length === 0) {
        alert('No data rows found in uploaded Excel file.');
        return;
      }
      const importedApps = convertRowsToRpcApplications(parsedRows);
      onImportApplications(importedApps);
      setDeskToast(`Imported ${importedApps.length} candidate dockets from "${file.name}"!`);
      setTimeout(() => setDeskToast(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to parse Excel file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Filtered
  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (schoolFilter !== 'ALL' && app.schoolName !== schoolFilter) return false;
    return true;
  });

  const uniqueSchools = Array.from(new Set(applications.map(a => a.schoolName)));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Toast */}
      {deskToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{deskToast}</span>
        </div>
      )}

      {/* Top Welcome / Overview Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <Building className="w-4 h-4" />
            Ph.D. Administration Section
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-cinzel">
            Research Progress Committee (RPC) Processing Desk
          </h2>
          <p className="text-xs text-slate-500">
            Verify 6-month time gaps, fee receipts, and mandatory enclosures before generating Dean SDSR sanction letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onOpenWorkflowHub && (
            <button
              id="desk-open-workflow-btn"
              type="button"
              onClick={onOpenWorkflowHub}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 shadow-xs"
            >
              <GitCommit className="w-3.5 h-3.5 text-indigo-600" />
              Real Workflow Hub
            </button>
          )}

          {onOpenStaffGenerator && (
            <button
              id="desk-quick-staff-notice-btn"
              type="button"
              onClick={onOpenStaffGenerator}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-200" />
              ⚡ Quick Notice (Student, Date, Mode)
            </button>
          )}

          {onOpenDocsHub && (
            <button
              id="desk-docs-formats-btn"
              type="button"
              onClick={onOpenDocsHub}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Example Docs (.docx / Excel)
            </button>
          )}

          <button
            id="desk-export-excel-btn"
            type="button"
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Table className="w-3.5 h-3.5 text-emerald-700" />
            Export Register (.xlsx)
          </button>

          {onImportApplications && (
            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Import .xlsx
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}

          <button
            id="desk-new-intake-btn"
            type="button"
            onClick={onNewApplication}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New RPC Intake
          </button>
        </div>
      </div>

      {/* Staff Rapid Dispatch Banner */}
      {onOpenStaffGenerator && (
        <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-slate-950 text-white p-4 rounded-2xl border border-amber-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                Staff Office Rapid Notice Generator
                <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.2 rounded font-mono">
                  3 Inputs
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate statutory RPC letters based on <strong>Student Name</strong>, <strong>Meeting Date</strong>, and <strong>Mode (Online / Offline)</strong> with live Word (.docx) & Dean forward.
              </p>
            </div>
          </div>
          <button
            id="banner-open-staff-generator-btn"
            type="button"
            onClick={onOpenStaffGenerator}
            className="whitespace-nowrap px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all self-stretch sm:self-auto justify-center"
          >
            Launch 3-Field Generator
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total RPC Dockets</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalApps}</span>
            <span className="text-[10px] text-slate-400 font-medium">Active Session</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">In SDSR Scrutiny</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{draftOrAudit}</span>
            <span className="text-[10px] text-amber-600 font-semibold">Audit stage</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Awaiting Dean Signature</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">{pendingDean}</span>
            <span className="text-[10px] text-blue-600 font-semibold animate-pulse">Submitted</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Digitally Sanctioned</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{approvedApps}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Ready to Dispatch</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {['ALL', 'SDSR_Audit', 'Submitted_To_Dean', 'Approved_By_Dean'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'All Stages'
                : st === 'SDSR_Audit'
                ? 'SDSR Scrutiny'
                : st === 'Submitted_To_Dean'
                ? 'Pending Dean'
                : 'Approved by Dean'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">School:</span>
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 text-slate-800"
          >
            <option value="ALL">All Schools</option>
            {uniqueSchools.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List Cards */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            No RPC applications match the selected filter.
          </div>
        ) : (
          filteredApps.map((app) => {
            const isApproved = app.status === 'Approved_By_Dean';
            const isPendingDean = app.status === 'Submitted_To_Dean';
            const scheduledDate = formatFormalLetterDate(app.proposedRpcDate);

            return (
              <div
                key={app.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {app.refNo}
                    </span>
                    <span className="text-xs text-slate-500">
                      Letter Date: <strong className="text-slate-700">{app.letterDate}</strong>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Digitally Sanctioned by Dean SDSR
                      </span>
                    ) : isPendingDean ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        Submitted to Dean SDSR for e-Sign
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Under SDSR Scrutiny
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Scholar & Committee Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Scholar Details */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      Ph.D. Scholar
                    </span>
                    <p className="font-bold text-sm text-slate-900">{app.scholarName}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{app.registrationNo}</p>
                    <p className="text-slate-500">{app.schoolName}</p>
                  </div>

                  {/* Guide & Presentation Timing */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      RPC Meeting Schedule
                    </span>
                    <p className="font-semibold text-slate-900">
                      {app.currentRpcOrdinal} RPC Meeting
                    </p>
                    <p className="text-slate-600">
                      {scheduledDate} from {app.rpcTime}
                    </p>
                    <p className="text-slate-500">
                      Guide: <strong>{app.guideName}</strong> ({app.mode} mode)
                    </p>
                  </div>

                  {/* Regulatory Compliance Badges */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      SDSR Compliance Audit
                    </span>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">Time Gap:</span>
                      <span className="font-semibold text-emerald-700">
                        {app.complianceAudit.timeGapStatus === 'FIRST_RPC_VALID'
                          ? '1st RPC Valid'
                          : `${app.complianceAudit.timeGapMonths} mos (${app.complianceAudit.timeGapDays}d)`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">Fee Status:</span>
                      <span className="font-semibold text-emerald-700">
                        {app.feeDetails.filter(f => f.receiptNo).length} Sems Cleared
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">Enclosures:</span>
                      <span className="font-semibold text-slate-700">
                        {Object.values(app.enclosures).filter(Boolean).length}/5 Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pending Email Approval Status Banner */}
                {isPendingDean && (
                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <div>
                        <span className="text-slate-700">
                          Dispatched to Dean: <strong className="text-slate-900">{app.emailDispatchedTo || 'hvipatel007@gmail.com'}</strong>
                        </span>
                        {app.emailApprovalToken && (
                          <span className="ml-2 font-mono text-[11px] bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-bold shadow-2xs">
                            Token: {app.emailApprovalToken}
                          </span>
                        )}
                      </div>
                    </div>

                    {onDirectEmailApprove && (
                      <button
                        type="button"
                        onClick={() => setDirectEmailModalApp(app)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.01]"
                        title="Simulate Direct Email Approval as received by hvipatel007@gmail.com"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Simulate Direct Email Approval
                      </button>
                    )}
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <div className="text-[11px] text-slate-500">
                    {isApproved && app.deanApproval ? (
                      <span className="text-emerald-700 font-mono">
                        Certificate ID: {app.deanApproval.digitalCertificateId}
                      </span>
                    ) : (
                      <span>External Experts: {app.externalMember1.name}, {app.externalMember2.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Download Word Docx */}
                    <button
                      type="button"
                      onClick={() => handleCardDocxDownload(app)}
                      disabled={exportingDocxId === app.id}
                      className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Download Word (.docx) Letter"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-700" />
                      {exportingDocxId === app.id ? 'Saving...' : 'Word (.docx)'}
                    </button>

                    {/* View Official Letter */}
                    <button
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Official Letter
                    </button>

                    {/* Forward to Dean button if not submitted or approved */}
                    {app.status !== 'Approved_By_Dean' && app.status !== 'Submitted_To_Dean' && (
                      <button
                        type="button"
                        onClick={() => onForwardToDean(app.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Forward to Dean SDSR
                      </button>
                    )}

                    {/* Shortcut for Dean to sign if in pending */}
                    {isPendingDean && (
                      <button
                        type="button"
                        onClick={() => onOpenDeanPortal(app.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Sign as Dean
                      </button>
                    )}

                    {/* Delete docket if needed */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove RPC docket for ${app.scholarName}?`)) {
                          onDeleteApplication(app.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete docket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Direct Email Approval Simulation Modal */}
      {directEmailModalApp && onDirectEmailApprove && (
        <DirectEmailApprovalModal
          application={directEmailModalApp}
          isOpen={Boolean(directEmailModalApp)}
          onClose={() => setDirectEmailModalApp(null)}
          onDirectApprove={(appId, token, remarks) => {
            onDirectEmailApprove(appId, token, remarks);
            setDirectEmailModalApp(null);
          }}
          onDirectClarify={() => {
            setDirectEmailModalApp(null);
          }}
        />
      )}
    </div>
  );
}
