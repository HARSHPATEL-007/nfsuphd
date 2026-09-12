import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  PenTool, 
  Send, 
  AlertCircle, 
  RotateCcw,
  Check,
  Building2,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { RPCApplication, AuthenticatedUser } from '../types';
import { generateDigitalSignMetadata, formatFormalLetterDate } from '../utils/complianceEngine';

interface DeanApprovalPortalProps {
  applications: RPCApplication[];
  selectedAppId?: string;
  onApprove: (appId: string, approvalData: any) => void;
  onRequestClarification: (appId: string, remarks: string) => void;
  onViewLetter: (app: RPCApplication) => void;
  currentUser?: AuthenticatedUser;
  onSwitchToDeanLogin?: () => void;
}

export function DeanApprovalPortal({
  applications,
  selectedAppId,
  onApprove,
  onRequestClarification,
  onViewLetter,
  currentUser,
  onSwitchToDeanLogin
}: DeanApprovalPortalProps) {
  // Pending applications for Dean approval
  const pendingApps = applications.filter(a => a.status === 'Submitted_To_Dean');
  const approvedApps = applications.filter(a => a.status === 'Approved_By_Dean');

  const [activeAppId, setActiveAppId] = useState<string>(
    selectedAppId || pendingApps[0]?.id || applications[0]?.id || ''
  );

  const [signMethod, setSignMethod] = useState<'TOKEN' | 'CANVAS'>('TOKEN');
  const [deanRemarks, setDeanRemarks] = useState(
    'Approved as recommended. Time gap and semester fee clearance verified in order. Authorized for formal dispatch.'
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSign, setHasDrawnSign] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentApp = applications.find(a => a.id === activeAppId);

  // Clear canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawnSign(false);
      }
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    setIsDrawing(true);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasDrawnSign(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleExecuteApproval = () => {
    if (!currentApp) return;

    let signatureDataUrl: string | undefined = undefined;
    if (signMethod === 'CANVAS' && canvasRef.current) {
      signatureDataUrl = canvasRef.current.toDataURL('image/png');
    }

    const metadata = generateDigitalSignMetadata(
      'Prof. (Dr.) S. O. Junare',
      currentApp.refNo
    );

    const fullApproval = {
      isApproved: true,
      deanName: currentUser?.fullName || 'Prof. (Dr.) S. O. Junare',
      deanEmail: currentUser?.email || 'hvipatel007@gmail.com',
      approvalTimestamp: metadata.approvalTimestamp,
      digitalCertificateId: metadata.digitalCertificateId,
      verificationHash: metadata.verificationHash,
      digitalSignType: signMethod === 'CANVAS' ? 'E_SIGNATURE_CANVAS' : 'CRYPTOGRAPHIC_TOKEN',
      signatureDataUrl,
      deanRemarks
    };

    onApprove(currentApp.id, fullApproval);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Dean Portal Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-2xl shadow-md mb-6 border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-cinzel">
                  Dean SDSR Executive Approval Desk
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  Official Signatory
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                School of Doctoral Studies and Research | Authorized Digital Signature Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center">
              <span className="block text-slate-400 text-[10px]">Awaiting Sign</span>
              <strong className="text-sm font-bold text-amber-400">{pendingApps.length}</strong>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center">
              <span className="block text-slate-400 text-[10px]">Approved Letters</span>
              <strong className="text-sm font-bold text-emerald-400">{approvedApps.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Role State Banner */}
      {currentUser?.role === 'STAFF' && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="block font-semibold text-amber-950">
                Staff Office Monitoring Mode ({currentUser?.fullName || 'Harsh'} • {currentUser?.email || 'harsh142022@gmail.com'})
              </strong>
              <span>
                You are inspecting the Dean's docket queue. Statutory digital signing requires Dean, SDSR authentication.
              </span>
            </div>
          </div>
          {onSwitchToDeanLogin && (
            <button
              id="switch-to-dean-from-portal-btn"
              type="button"
              onClick={onSwitchToDeanLogin}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Switch to Dean Login to Sign
            </button>
          )}
        </div>
      )}

      {currentUser?.role === 'DEAN' && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl mb-6 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              Executive Dean Session: <strong>{currentUser?.fullName || 'Prof. (Dr.) S. O. Junare'}</strong> ({currentUser?.email || 'hvipatel007@gmail.com'}) • Statutory Digital Certificate active for signing dockets.
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
            Signatory Clearance: Granted
          </span>
        </div>
      )}

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <strong className="block text-sm">RPC Notification Digitally Approved!</strong>
            The official letter has been stamped with your digital certificate and Dean SDSR seal. The approved status is now instantaneously reflected back in the SDSR Administration Office.
          </div>
        </div>
      )}

      {/* Split View: Left List of Dockets, Right Detail & Digital Sign */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applications Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Submitted RPC Dockets
            </h3>
            <span className="text-[11px] text-slate-500">Select to review</span>
          </div>

          <div className="space-y-2">
            {applications.map((app) => {
              const isSelected = app.id === activeAppId;
              const isPending = app.status === 'Submitted_To_Dean';
              const isApproved = app.status === 'Approved_By_Dean';

              return (
                <div
                  key={app.id}
                  onClick={() => setActiveAppId(app.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[11px] text-slate-700">
                      {app.refNo}
                    </span>
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Needs Signature
                      </span>
                    ) : isApproved ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Signed & Approved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        {app.status}
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-slate-900 text-sm">{app.scholarName}</p>
                  <p className="text-slate-500">{app.currentRpcOrdinal} RPC Meeting • {app.schoolName}</p>
                  <p className="text-slate-400 text-[11px] mt-1">Guide: {app.guideName}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Docket Review & Digital Sign Console */}
        <div className="lg:col-span-2 space-y-4">
          {currentApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Top Meta info */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {currentApp.refNo}
                    </span>
                    <span className="text-xs text-slate-500">
                      Dated: {currentApp.letterDate}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {currentApp.currentRpcOrdinal} RPC Meeting: {currentApp.scholarName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ph.D. Scholar in {currentApp.schoolName}, NFSU Gandhinagar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onViewLetter(currentApp)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Full Official Letterhead
                </button>
              </div>

              {/* SDSR Administrative Scrutiny Verification Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    SDSR Administration Department Compliance Audit
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Scrutiny Officer: SDSR Desk ({currentApp.complianceAudit.scrutinyDate})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Time gap audit */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Time Gap Compliance
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {currentApp.complianceAudit.timeGapRemarks}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Status: {currentApp.complianceAudit.timeGapStatus}
                    </span>
                  </div>

                  {/* Fee audit */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Fees Clearance
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {currentApp.complianceAudit.feesRemarks}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Status: {currentApp.complianceAudit.feesStatus}
                    </span>
                  </div>

                  {/* Enclosure audit */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      Mandatory Enclosures
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {currentApp.complianceAudit.enclosuresRemarks}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Status: {currentApp.complianceAudit.enclosuresStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Committee Constitution Summary */}
              <div className="text-xs space-y-2">
                <h4 className="font-bold text-slate-800">RPC Committee to be notified:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block">1. School Dean:</span>
                    {currentApp.schoolDeanTitle}, {currentApp.schoolName}, {currentApp.schoolCampus}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block">2. Ph.D. Guide:</span>
                    {currentApp.guideName}, {currentApp.guideDesignation}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block">3. Internal Expert:</span>
                    {currentApp.internalMember.name}, {currentApp.internalMember.designation}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block">4. External Expert 1:</span>
                    {currentApp.externalMember1.name}, {currentApp.externalMember1.affiliation}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
                    <span className="font-semibold text-slate-700 block">5. External Expert 2:</span>
                    {currentApp.externalMember2.name}, {currentApp.externalMember2.affiliation}
                  </div>
                </div>
              </div>

              {/* Digital Signature Action Panel */}
              {currentApp.status === 'Approved_By_Dean' ? (
                /* Already Signed State */
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Digitally Authorized by Dean SDSR
                  </div>
                  <p className="text-emerald-800">
                    Signed by: <strong>{currentApp.deanApproval?.deanName}</strong> ({currentApp.deanApproval?.deanEmail})
                  </p>
                  <p className="text-slate-600 font-mono text-[11px]">
                    Timestamp: {new Date(currentApp.deanApproval?.approvalTimestamp || '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                  <p className="text-slate-600 font-mono text-[11px]">
                    Cert ID: {currentApp.deanApproval?.digitalCertificateId}
                  </p>
                  <p className="text-slate-600 font-mono text-[10px]">
                    Hash: {currentApp.deanApproval?.verificationHash}
                  </p>
                  {currentApp.deanApproval?.deanRemarks && (
                    <p className="text-slate-700 italic pt-1 border-t border-emerald-200">
                      &quot;{currentApp.deanApproval.deanRemarks}&quot;
                    </p>
                  )}
                </div>
              ) : (
                /* Execution Console for Dean */
                <div className="border-t border-slate-200 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-emerald-600" />
                      Executive Digital Authorization
                    </h4>

                    {/* Method Toggle */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setSignMethod('TOKEN')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          signMethod === 'TOKEN'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Cryptographic e-Sign
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignMethod('CANVAS')}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          signMethod === 'CANVAS'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Draw Signature
                      </button>
                    </div>
                  </div>

                  {/* Sign method view */}
                  {signMethod === 'TOKEN' ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Institutional Digital Certificate Token
                      </div>
                      <p className="text-slate-600">
                        Applying digital authorization will bind Dean SDSR official seal and generate a tamper-evident SHA-256 validation record for Ref: <strong>{currentApp.refNo}</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Draw signature in the box below:</span>
                        <button
                          type="button"
                          onClick={handleClearCanvas}
                          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Clear Pad
                        </button>
                      </div>
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-crosshair"
                      />
                    </div>
                  )}

                  {/* Dean remarks */}
                  <div className="text-xs">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Dean Official Endorsement / Sanction Note:
                    </label>
                    <textarea
                      rows={2}
                      value={deanRemarks}
                      onChange={(e) => setDeanRemarks(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Submit Approval */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const note = prompt('Please enter clarification requested for SDSR office:');
                        if (note) onRequestClarification(currentApp.id, note);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                    >
                      Request Clarification
                    </button>
                    <button
                      id="dean-execute-approval-btn"
                      type="button"
                      onClick={handleExecuteApproval}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Approve & Digitally Sign RPC Letter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select an application from the list to review and sign.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
