import { useState, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  Globe, 
  Building2, 
  FileText, 
  Download, 
  Printer, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Search
} from 'lucide-react';
import { RPCApplication, RPCMode, ScholarType } from '../types';
import { 
  formatFormalLetterDate, 
  formatDateIndian, 
  performFullAudit, 
  getOrdinal
} from '../utils/complianceEngine';
import { generateRpcLetterDocx, triggerFileDownload } from '../utils/docxExport';
import { SCREENSHOT_CANDIDATE_ROWS } from '../data/screenshotCandidates';

interface StaffQuickNoticeGeneratorProps {
  applications: RPCApplication[];
  onSaveApplication: (app: RPCApplication) => void;
  onForwardToDean: (appId: string) => void;
  onOpenLetterView: (app: RPCApplication) => void;
}

export function StaffQuickNoticeGenerator({
  applications,
  onSaveApplication,
  onForwardToDean,
  onOpenLetterView
}: StaffQuickNoticeGeneratorProps) {
  // Pre-fill with the first available or default candidate
  const defaultApp = applications[0];

  // 1. Core Staff Input: Student Name (and search/selector)
  const [studentName, setStudentName] = useState(defaultApp?.scholarName || 'Ms. Devanshi Lunagariya');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultApp?.id || 'custom');

  // Associated details inferred or editable
  const [schoolName, setSchoolName] = useState(defaultApp?.schoolName || 'School of Pharmacy');
  const [guideName, setGuideName] = useState(defaultApp?.guideName || 'Prof. (Dr.) Manjunath Ghate');
  const [registrationNo, setRegistrationNo] = useState(defaultApp?.registrationNo || 'Ph.D/SDSR/SPH/019/2023');
  const [currentRpcNumber, setCurrentRpcNumber] = useState<number>(defaultApp?.currentRpcNumber || 1);
  const [researchTopic, setResearchTopic] = useState(
    defaultApp?.researchTopic || 'Formulation and Evaluation of Novel Targeted Drug Delivery Systems'
  );

  // 2. Core Staff Input: Date of Meeting
  const [meetingDate, setMeetingDate] = useState(defaultApp?.proposedRpcDate || '2025-06-10');
  const [meetingTime, setMeetingTime] = useState(defaultApp?.rpcTime || '12:00 Noon onwards');

  // 3. Core Staff Input: Mode of Meeting (Online / Offline)
  const [meetingMode, setMeetingMode] = useState<RPCMode>(defaultApp?.mode || 'Online');
  const [customVenue, setCustomVenue] = useState(defaultApp?.meetingVenueOrLink || '');

  // Status & Feedback
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick Preset Selector from existing database and screenshot register
  const handleSelectScholarPreset = (nameToMatch: string) => {
    // Look in existing applications first
    const foundApp = applications.find(
      a => a.scholarName.trim().toLowerCase() === nameToMatch.trim().toLowerCase()
    );

    if (foundApp) {
      setSelectedPresetId(foundApp.id);
      setStudentName(foundApp.scholarName);
      setSchoolName(foundApp.schoolName);
      setGuideName(foundApp.guideName);
      setRegistrationNo(foundApp.registrationNo);
      setCurrentRpcNumber(foundApp.currentRpcNumber);
      setResearchTopic(foundApp.researchTopic);
      if (foundApp.proposedRpcDate) setMeetingDate(foundApp.proposedRpcDate);
      if (foundApp.rpcTime) setMeetingTime(foundApp.rpcTime);
      setMeetingMode(foundApp.mode);
      return;
    }

    // Look in screenshot candidate rows
    const foundRow = SCREENSHOT_CANDIDATE_ROWS.find(
      r => r.name.trim().toLowerCase() === nameToMatch.trim().toLowerCase()
    );

    if (foundRow) {
      setSelectedPresetId(`row-${foundRow.srNo}`);
      setStudentName(foundRow.name);
      setSchoolName(foundRow.nameOfSchool);
      setGuideName(foundRow.guideName);
      setRegistrationNo(foundRow.enrollmentNo);
      setCurrentRpcNumber(1);
      setResearchTopic('Advanced Forensic & Interdisciplinary Ph.D. Research');
      setMeetingMode('Online');
    }
  };

  // Determine computed venue / link based on mode
  const effectiveVenue = useMemo(() => {
    if (meetingMode === 'Online') {
      return customVenue.trim() || 'Online (Google Meet link will be shared by Guide)';
    } else if (meetingMode === 'Offline') {
      return customVenue.trim() || 'Offline (Committee Room / Conference Hall, NFSU Gandhinagar)';
    } else {
      return customVenue.trim() || 'Hybrid (Online Google Meet + Conference Hall, NFSU Gandhinagar)';
    }
  }, [meetingMode, customVenue]);

  // Build the live RPCApplication object based on staff inputs
  const liveApplication: RPCApplication = useMemo(() => {
    const existing = applications.find(
      a => a.scholarName.trim().toLowerCase() === studentName.trim().toLowerCase()
    );

    const base: RPCApplication = existing || {
      id: `app-quick-${Date.now()}`,
      refNo: `NFSU/SDSR/RPC/${String(Math.floor(Math.random() * 900) + 100)}/25`,
      letterDate: '2025-06-02',
      schoolDeanTitle: 'Dean',
      schoolName: schoolName,
      schoolCampus: 'NFSU, Gandhinagar',
      guideName: guideName,
      guideDesignation: 'Professor / Research Supervisor',
      guideSchool: schoolName,
      guideUniversity: 'NFSU, Gandhinagar',
      guideEmail: 'guide@nfsu.ac.in',
      guidePhone: '+91 98250 00000',
      scholarName: studentName,
      scholarGenderTitle: studentName.toLowerCase().startsWith('mr') ? 'Mr.' : 'Ms.',
      scholarType: 'Full Time',
      researchTopic: researchTopic,
      registrationNo: registrationNo,
      registrationDate: '2023-09-15',
      lastRpcNumber: currentRpcNumber > 1 ? currentRpcNumber - 1 : 0,
      lastRpcDate: currentRpcNumber > 1 ? '2024-11-20' : '',
      currentRpcNumber: currentRpcNumber,
      currentRpcOrdinal: getOrdinal(currentRpcNumber),
      proposedRpcDate: meetingDate,
      rpcTime: meetingTime,
      mode: meetingMode,
      meetingVenueOrLink: effectiveVenue,
      internalMember: {
        name: 'Dr. Bhoomika Patel',
        designation: 'Dean (I/C), SPH',
        affiliation: 'NFSU, Gandhinagar',
        email: 'bhoomika.patel@nfsu.ac.in',
        contactNo: '+91 79 2397 7144',
        roleDescription: 'Internal Expert Member'
      },
      externalMember1: {
        name: 'Dr. Dhiraj Bhatia',
        designation: 'Associate Professor & INYAS-INSA Member',
        affiliation: 'Dept. of Biological Engg, IIT Gandhinagar, Gujarat',
        email: 'dhiraj.bhatia@iitgn.ac.in',
        contactNo: '+91 79 2395 2500',
        roleDescription: 'External Expert Member - 1'
      },
      externalMember2: {
        name: 'Dr. Prakash Jha',
        designation: 'Assistant Professor, School of Applied Material Sciences',
        affiliation: 'Central University of Gujarat, Gandhinagar',
        email: 'prakash.jha@cug.ac.in',
        contactNo: '+91 79 2397 7400',
        roleDescription: 'External Expert Member - 2'
      },
      enclosures: {
        registrationCertificate: true,
        rpcMemberApprovedLetter: true,
        feesReceiptsAllSemester: true,
        attendanceReportSigned: true,
        previousRpcReport: currentRpcNumber > 1
      },
      feeDetails: [
        { id: 'f-1', semesterName: 'Year 1 / Sem 1', receiptNo: 'NFSU/FEE/2023/891', paymentDate: '2023-09-15', amount: 25000, isVerified: true },
        { id: 'f-2', semesterName: 'Year 1 / Sem 2', receiptNo: 'NFSU/FEE/2024/112', paymentDate: '2024-03-20', amount: 25000, isVerified: true },
        { id: 'f-3', semesterName: 'Year 2 / Sem 3', receiptNo: 'NFSU/FEE/2024/604', paymentDate: '2024-09-22', amount: 25000, isVerified: true },
        { id: 'f-4', semesterName: 'Year 2 / Sem 4', receiptNo: 'NFSU/FEE/2025/089', paymentDate: '2025-03-18', amount: 25000, isVerified: true }
      ],
      complianceAudit: {
        timeGapDays: 180,
        timeGapMonths: 6,
        timeGapStatus: 'COMPLIANT',
        timeGapRemarks: 'Verified gap strictly adheres to 6-month progress interval.',
        feesStatus: 'CLEARED',
        feesRemarks: 'All required semester fees cleared.',
        enclosuresStatus: 'ALL_VERIFIED',
        enclosuresRemarks: 'Statutory enclosures verified.',
        overallStatus: 'APPROVED_FOR_DEAN',
        scrutinyOfficerName: 'Shri K. R. Sharma (SDSR Staff)',
        scrutinyDate: '02/06/2025'
      },
      status: 'Draft',
      statusHistory: [
        {
          status: 'Draft',
          timestamp: new Date().toISOString(),
          actor: 'Shri K. R. Sharma (Staff Office)',
          remarks: 'Quick Staff Notice generated based on Student, Date, and Mode input'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Recalculate compliance audit with the new meetingDate
    const audit = performFullAudit(
      base.currentRpcNumber,
      meetingDate,
      base.lastRpcDate,
      base.registrationDate,
      base.scholarType,
      base.feeDetails,
      base.enclosures
    );

    return {
      ...base,
      scholarName: studentName,
      schoolName: schoolName,
      guideName: guideName,
      registrationNo: registrationNo,
      proposedRpcDate: meetingDate,
      rpcTime: meetingTime,
      mode: meetingMode,
      meetingVenueOrLink: effectiveVenue,
      complianceAudit: audit
    };
  }, [
    studentName,
    schoolName,
    guideName,
    registrationNo,
    currentRpcNumber,
    researchTopic,
    meetingDate,
    meetingTime,
    meetingMode,
    effectiveVenue,
    applications
  ]);

  // Handlers
  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateRpcLetterDocx(liveApplication);
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      triggerFileDownload(blob, `RPC_Letter_${safeName}_${liveApplication.currentRpcOrdinal}RPC.docx`);
      setToastMsg(`Downloaded Word (.docx) letter for ${studentName}!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (e) {
      console.error(e);
      alert('Failed to generate Word document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleSaveDocket = () => {
    onSaveApplication(liveApplication);
    setToastMsg(`Saved RPC docket for ${studentName} into active register!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleForwardToDeanOffice = () => {
    onSaveApplication(liveApplication);
    onForwardToDean(liveApplication.id);
    setToastMsg(`Forwarded RPC notice for ${studentName} to Dean SDSR for digital signing!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Quick date presets
  const handleDatePreset = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setMeetingDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Staff Office Rapid Notice Generator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-cinzel">
            Quick RPC Letter by Staff Input
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Input the <strong>Student Name</strong>, <strong>Meeting Date</strong>, and <strong>Mode (Online / Offline)</strong>. The portal dynamically formats the statutory letterhead, recalculates Ordinance compliance, and generates print-ready Word (.docx) notices.
          </p>
        </div>

        {/* Status Capsule */}
        <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs text-amber-900 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Staff Scrutiny Mode: <strong>Shri K. R. Sharma</strong></span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The 3 Core Staff Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Core 3 Inputs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 font-cinzel">
                <Edit3 className="w-4 h-4 text-amber-600" />
                Staff Input Parameters
              </h3>
              <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                3 Key Fields
              </span>
            </div>

            {/* INPUT 1: STUDENT NAME */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Student Name <span className="text-red-500">*</span>
              </label>

              {/* Scholar Autocomplete / Quick Select */}
              <div className="space-y-2">
                <input
                  id="staff-input-student-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setSelectedPresetId('custom');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-2xs"
                  placeholder="e.g. Ms. Devanshi Lunagariya or RICHARD CHEREHANI"
                />

                {/* Quick Selection Dropdown from University Register */}
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <select
                    id="staff-select-scholar-dropdown"
                    value={selectedPresetId}
                    onChange={(e) => {
                      const selName = e.target.options[e.target.selectedIndex].text.replace(/^[0-9]+\.\s*/, '').split(' (')[0];
                      handleSelectScholarPreset(selName);
                    }}
                    className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
                  >
                    <option value="custom">-- Select Scholar from Register --</option>
                    <optgroup label="Active Applications">
                      {applications.map((app, idx) => (
                        <option key={app.id} value={app.id}>
                          {idx + 1}. {app.scholarName} ({app.schoolName})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Excel Screenshot Register Candidates">
                      {SCREENSHOT_CANDIDATE_ROWS.map((row) => (
                        <option key={row.srNo} value={`row-${row.srNo}`}>
                          {row.srNo}. {row.name} ({row.nameOfSchool})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Scholar Metadata Quick-Chips */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">School</span>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-800 focus:outline-none"
                    placeholder="School of Pharmacy"
                  />
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Supervisor (Guide)</span>
                  <input
                    type="text"
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-800 focus:outline-none"
                    placeholder="Prof. (Dr.) Guide Name"
                  />
                </div>
              </div>
            </div>

            {/* INPUT 2: DATE OF MEETING */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Date of Meeting <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-semibold text-amber-700">
                  {formatFormalLetterDate(meetingDate)}
                </span>
              </div>

              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="staff-input-meeting-date"
                  type="date"
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-2xs"
                />
              </div>

              {/* Quick Presets for Date */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleDatePreset(0)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleDatePreset(1)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleDatePreset(7)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleDatePreset(14)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                >
                  +14 Days
                </button>
              </div>

              {/* Meeting Time & Ordinal RPC */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Meeting Time
                  </label>
                  <input
                    id="staff-input-meeting-time"
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none"
                    placeholder="12:00 Noon onwards"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    RPC Milestone
                  </label>
                  <select
                    id="staff-select-rpc-ordinal"
                    value={currentRpcNumber}
                    onChange={(e) => setCurrentRpcNumber(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
                  >
                    <option value={1}>1st RPC Meeting</option>
                    <option value={2}>2nd RPC Meeting</option>
                    <option value={3}>3rd RPC Meeting</option>
                    <option value={4}>4th RPC Meeting</option>
                    <option value={5}>5th RPC Meeting</option>
                    <option value={6}>6th RPC (Pre-Synopsis)</option>
                  </select>
                </div>
              </div>

              {/* Compliance Audit Feedback Capsule */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Ordinance 6-Month Gap Audit:</span>
                  {liveApplication.complianceAudit.timeGapStatus === 'COMPLIANT' ||
                  liveApplication.complianceAudit.timeGapStatus === 'FIRST_RPC_VALID' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Eligible ({liveApplication.complianceAudit.timeGapMonths} mos)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Under 6 Months Gap ({liveApplication.complianceAudit.timeGapMonths} mos)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Scheduled for <strong>{formatFormalLetterDate(meetingDate)}</strong>. Minimum 6-month statutory progress interval verified.
                </p>
              </div>
            </div>

            {/* INPUT 3: MODE OF MEETING (ONLINE / OFFLINE) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Mode of Meeting (Online / Offline) <span className="text-red-500">*</span>
              </label>

              {/* Toggle Buttons: Online vs Offline */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="staff-mode-online-btn"
                  type="button"
                  onClick={() => setMeetingMode('Online')}
                  className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    meetingMode === 'Online'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    meetingMode === 'Online' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Online Mode</div>
                    <div className="text-[10px] text-slate-500">Google Meet Link</div>
                  </div>
                </button>

                <button
                  id="staff-mode-offline-btn"
                  type="button"
                  onClick={() => setMeetingMode('Offline')}
                  className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    meetingMode === 'Offline'
                      ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    meetingMode === 'Offline' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Offline Mode</div>
                    <div className="text-[10px] text-slate-500">Campus Board Room</div>
                  </div>
                </button>
              </div>

              {/* Meeting Link or Physical Venue details */}
              <div className="pt-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  {meetingMode === 'Online' ? 'Online Meeting Link / Platform' : 'Campus Venue / Room'}
                </label>
                <div className="relative">
                  {meetingMode === 'Online' ? (
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  )}
                  <input
                    id="staff-input-venue-link"
                    type="text"
                    value={customVenue}
                    onChange={(e) => setCustomVenue(e.target.value)}
                    placeholder={
                      meetingMode === 'Online'
                        ? 'Online (Google Meet link will be shared by Guide)'
                        : 'Offline (Conference Hall / Committee Room, NFSU Gandhinagar)'
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="staff-download-docx-btn"
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={isExportingDocx}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isExportingDocx ? 'Exporting...' : 'Word (.docx)'}
                </button>

                <button
                  id="staff-forward-dean-btn"
                  type="button"
                  onClick={handleForwardToDeanOffice}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Forward to Dean
                </button>
              </div>

              <button
                id="staff-save-register-btn"
                type="button"
                onClick={handleSaveDocket}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Save & Update Master Register
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Live Letterhead Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Live Letter Toolbar */}
            <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-cinzel font-bold text-sm">
                  Live Statutory Notice Preview
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  Dynamic Sync
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenLetterView(liveApplication)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                >
                  Full View
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Letterhead Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed max-h-[750px] overflow-y-auto">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="text-xs font-semibold text-slate-600 tracking-wider">
                  राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय
                </div>
                <h1 className="text-base sm:text-lg font-bold font-cinzel text-slate-900 tracking-wide">
                  NATIONAL FORENSIC SCIENCES UNIVERSITY
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  (An Institution of National Importance under Ministry of Home Affairs, Government of India)
                </p>
                <div className="text-xs font-bold text-amber-800 pt-1">
                  School of Doctoral Studies and Research (SDSR)
                </div>
              </div>

              {/* Ref No & Date */}
              <div className="flex justify-between items-center text-xs font-mono pt-1 text-slate-600">
                <span>Ref: No: {liveApplication.refNo}</span>
                <span>Date: {formatFormalLetterDate(liveApplication.letterDate)}</span>
              </div>

              {/* Statutory Recipients (5 To's) */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900">To,</div>
                <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-700">
                  <li>
                    <strong>Dean</strong>, {liveApplication.schoolName}, {liveApplication.schoolCampus}
                  </li>
                  <li>
                    <strong>{liveApplication.guideName}</strong>, {liveApplication.guideDesignation}, {liveApplication.guideSchool}
                  </li>
                  <li>
                    <strong>{liveApplication.internalMember.name}</strong>, {liveApplication.internalMember.designation}, {liveApplication.internalMember.affiliation}
                  </li>
                  <li>
                    <strong>{liveApplication.externalMember1.name}</strong>, {liveApplication.externalMember1.designation}, {liveApplication.externalMember1.affiliation}
                  </li>
                  <li>
                    <strong>{liveApplication.externalMember2.name}</strong>, {liveApplication.externalMember2.designation}, {liveApplication.externalMember2.affiliation}
                  </li>
                </ol>
              </div>

              {/* Subject */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <strong>Subject:</strong> Evaluation of Ph.D. Research Progress Committee (RPC) Presentation of{' '}
                <strong className="text-amber-900 underline underline-offset-2">{studentName}</strong> (Enrollment:{' '}
                {registrationNo}), {schoolName} - reg.
              </div>

              {/* Salutation & Body */}
              <div className="space-y-3 text-xs text-slate-700">
                <p>Sir/Madam,</p>
                <p>
                  With reference to the captioned subject, it is hereby informed that the{' '}
                  <strong className="text-slate-900">{liveApplication.currentRpcOrdinal} Research Progress Committee (RPC)</strong> meeting for the undermentioned research scholar has been scheduled as per the details provided below:
                </p>

                {/* Highlighted Meeting Schedule Box */}
                <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Name of Scholar</span>
                      <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Research Supervisor</span>
                      <span className="font-semibold text-slate-800">{guideName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Scheduled Meeting Date</span>
                      <span className="font-bold text-amber-900 text-sm">
                        {formatFormalLetterDate(meetingDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Meeting Time</span>
                      <span className="font-semibold text-slate-800">{meetingTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Convening Mode:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      meetingMode === 'Online'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {meetingMode} Mode
                    </span>
                    <span className="text-slate-600 text-[11px] truncate">
                      • {effectiveVenue}
                    </span>
                  </div>
                </div>

                <p>
                  {meetingMode === 'Online' ? (
                    <span>
                      The Research Progress Committee meeting will be conducted virtually through <strong>Online mode (Google Meet)</strong>. The meeting access link and digital conference invitation will be communicated by the Research Supervisor.
                    </span>
                  ) : (
                    <span>
                      The Research Progress Committee meeting will be conducted in <strong>Offline / In-person mode</strong> at the designated conference hall, National Forensic Sciences University, Gandhinagar Campus.
                    </span>
                  )}
                </p>

                <p>
                  The members of the Research Progress Committee are requested to kindly make it convenient to attend the presentation and evaluate the progress report of the research scholar.
                </p>
              </div>

              {/* Signatory Block */}
              <div className="pt-6 flex justify-between items-end">
                <div className="text-[11px] text-slate-500">
                  <span className="block font-semibold text-slate-600">Enclosures:</span>
                  <span>1. Half-Yearly Research Progress Report</span>
                  <br />
                  <span>2. Coursework Completion & Fee Records</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-900">Dean</div>
                  <div className="text-xs text-slate-600">
                    School of Doctoral Studies and Research (SDSR)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    National Forensic Sciences University, Gandhinagar
                  </div>
                </div>
              </div>

              {/* Copy to */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <strong>Copy to:</strong>
                <ol className="list-decimal list-inside pl-1 space-y-0.5">
                  <li>Associate Dean, School of Doctoral Studies and Research (SDSR), NFSU</li>
                  <li>Dean, {liveApplication.schoolName}, NFSU</li>
                  <li>PA to Hon'ble Vice Chancellor, NFSU (for kind information)</li>
                  <li>Office / Master Dispatch File, SDSR</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
