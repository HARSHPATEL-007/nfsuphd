import { useState, useId, type FormEvent } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Globe, 
  FileCheck, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Shield,
  HelpCircle
} from 'lucide-react';
import { 
  RPCApplication, 
  RPCMode, 
  ScholarType, 
  FeeSemesterRecord, 
  EnclosureChecklist 
} from '../types';
import { 
  getOrdinal, 
  performFullAudit, 
  formatDateIndian 
} from '../utils/complianceEngine';

interface ApplicationFormProps {
  onSave: (app: RPCApplication) => void;
  onCancel: () => void;
  initialData?: RPCApplication;
}

export function ApplicationForm({ onSave, onCancel, initialData }: ApplicationFormProps) {
  // S.N. 1: Guide Details
  const [guideName, setGuideName] = useState(initialData?.guideName || 'Prof. (Dr.) Manjunath Ghate');
  const [guideDesignation, setGuideDesignation] = useState(initialData?.guideDesignation || 'Professor, SPH');
  const [guideSchool, setGuideSchool] = useState(initialData?.guideSchool || 'School of Pharmacy');
  const [guideUniversity, setGuideUniversity] = useState(initialData?.guideUniversity || 'NFSU, Gandhinagar');
  const [guideEmail, setGuideEmail] = useState(initialData?.guideEmail || 'manjunath.ghate@nfsu.ac.in');
  const [guidePhone, setGuidePhone] = useState(initialData?.guidePhone || '+91 98250 12345');

  // S.N. 2: Scholar Details
  const [scholarName, setScholarName] = useState(initialData?.scholarName || 'Ms. Devanshi Lunagariya');
  const [scholarGenderTitle, setScholarGenderTitle] = useState<'Mr.' | 'Ms.' | 'Mx.'>(initialData?.scholarGenderTitle || 'Ms.');
  const [scholarType, setScholarType] = useState<ScholarType>(initialData?.scholarType || 'Full Time');
  const [researchTopic, setResearchTopic] = useState(initialData?.researchTopic || 'Formulation and Evaluation of Novel Targeted Drug Delivery Systems for Neurodegenerative Disorders');

  // S.N. 3 & 4: Registration
  const [registrationNo, setRegistrationNo] = useState(initialData?.registrationNo || 'Ph.D/SDSR/SPH/019/2023');
  const [registrationDate, setRegistrationDate] = useState(initialData?.registrationDate || '2023-09-15');

  // S.N. 5: Last RPC
  const [isFirstRpc, setIsFirstRpc] = useState(initialData ? initialData.currentRpcNumber === 1 : true);
  const [lastRpcNumber, setLastRpcNumber] = useState<number>(initialData?.lastRpcNumber || 0);
  const [lastRpcDate, setLastRpcDate] = useState(initialData?.lastRpcDate || '');

  // S.N. 6, 7, 8, 9: Proposed RPC Details
  const [currentRpcNumber, setCurrentRpcNumber] = useState<number>(initialData?.currentRpcNumber || 1);
  const [proposedRpcDate, setProposedRpcDate] = useState(initialData?.proposedRpcDate || '2025-06-10');
  const [rpcTime, setRpcTime] = useState(initialData?.rpcTime || '12:00 Noon onwards');
  const [mode, setMode] = useState<RPCMode>(initialData?.mode || 'Online');
  const [meetingVenueOrLink, setMeetingVenueOrLink] = useState(initialData?.meetingVenueOrLink || 'Online (Google Meet link will be shared by Guide)');

  // Recipient: School Dean
  const [schoolDeanTitle, setSchoolDeanTitle] = useState(initialData?.schoolDeanTitle || 'Dean');
  const [schoolName, setSchoolName] = useState(initialData?.schoolName || 'School of Pharmacy');
  const [schoolCampus, setSchoolCampus] = useState(initialData?.schoolCampus || 'NFSU, Gandhinagar');

  // S.N. 10: External Member 1
  const [ext1Name, setExt1Name] = useState(initialData?.externalMember1.name || 'Dr. Dhiraj Bhatia');
  const [ext1Desig, setExt1Desig] = useState(initialData?.externalMember1.designation || 'Associate Professor & INYAS-INSA Member');
  const [ext1Affil, setExt1Affil] = useState(initialData?.externalMember1.affiliation || 'Department of Biological Science and Engineering, Indian Institute of Technology Gandhinagar, Gujarat');
  const [ext1Email, setExt1Email] = useState(initialData?.externalMember1.email || 'dhiraj.bhatia@iitgn.ac.in');
  const [ext1Phone, setExt1Phone] = useState(initialData?.externalMember1.contactNo || '+91 79 2395 2500');

  // S.N. 11: External Member 2
  const [ext2Name, setExt2Name] = useState(initialData?.externalMember2.name || 'Dr. Prakash Jha');
  const [ext2Desig, setExt2Desig] = useState(initialData?.externalMember2.designation || 'Professor & Dean');
  const [ext2Affil, setExt2Affil] = useState(initialData?.externalMember2.affiliation || 'School of Applied Material Science, Central University of Gujarat');
  const [ext2Email, setExt2Email] = useState(initialData?.externalMember2.email || 'prakash.jha@cug.ac.in');
  const [ext2Phone, setExt2Phone] = useState(initialData?.externalMember2.contactNo || '+91 79 2975 0280');

  // S.N. 12: Internal Member
  const [intName, setIntName] = useState(initialData?.internalMember.name || 'Dr. Bhoomika Patel');
  const [intDesig, setIntDesig] = useState(initialData?.internalMember.designation || 'Dean (I/C), SPH');
  const [intAffil, setIntAffil] = useState(initialData?.internalMember.affiliation || 'NFSU, Gandhinagar');
  const [intEmail, setIntEmail] = useState(initialData?.internalMember.email || 'bhoomika.patel@nfsu.ac.in');
  const [intPhone, setIntPhone] = useState(initialData?.internalMember.contactNo || '+91 79 2397 7144');

  // S.N. 13: Fee Details
  const [feeDetails, setFeeDetails] = useState<FeeSemesterRecord[]>(
    initialData?.feeDetails || [
      {
        id: 'f-1',
        semesterName: 'Year I / Sem I',
        amount: 25000,
        paymentDate: '2023-09-20',
        receiptNo: '1234',
        isVerified: true
      }
    ]
  );

  // Enclosures Checklist (5 items)
  const [enclosures, setEnclosures] = useState<EnclosureChecklist>(
    initialData?.enclosures || {
      registrationCertificate: true,
      rpcMemberApprovedLetter: true,
      feesReceiptsAllSemester: true,
      attendanceReportSigned: true,
      previousRpcReport: true
    }
  );

  // Quick preset loader
  const loadDevanshiPreset = () => {
    setGuideName('Prof. (Dr.) Manjunath Ghate');
    setGuideDesignation('Professor, SPH');
    setGuideSchool('School of Pharmacy');
    setGuideUniversity('NFSU, Gandhinagar');
    setGuideEmail('manjunath.ghate@nfsu.ac.in');
    setScholarName('Ms. Devanshi Lunagariya');
    setScholarGenderTitle('Ms.');
    setScholarType('Full Time');
    setRegistrationNo('Ph.D/SDSR/SPH/019/2023');
    setRegistrationDate('2023-09-15');
    setIsFirstRpc(true);
    setCurrentRpcNumber(1);
    setProposedRpcDate('2025-06-10');
    setRpcTime('12:00 Noon onwards');
    setMode('Online');
    setMeetingVenueOrLink('Online (Google Meet link will be shared by Guide)');
    setSchoolName('School of Pharmacy');
    setSchoolCampus('NFSU, Gandhinagr');
    setExt1Name('Dr. Dhiraj Bhatia');
    setExt1Desig('Associate Professor & INYAS-INSA Member');
    setExt1Affil('Department of Biological Science and Engineering, Indian Institute of Technology Gandhinagar, Gujarat');
    setExt1Email('dhiraj.bhatia@iitgn.ac.in');
    setExt2Name('Dr. Prakash Jha');
    setExt2Desig('Professor & Dean');
    setExt2Affil('School of Applied Material Science, Central University of Gujarat');
    setExt2Email('prakash.jha@cug.ac.in');
    setIntName('Dr. Bhoomika Patel');
    setIntDesig('Dean (I/C), SPH');
    setIntAffil('NFSU, Gandhinagar');
    setIntEmail('bhoomika.patel@nfsu.ac.in');
    setFeeDetails([
      {
        id: 'f-1',
        semesterName: 'Year I / Sem I',
        amount: 25000,
        paymentDate: '2023-09-20',
        receiptNo: '1234',
        isVerified: true
      },
      {
        id: 'f-2',
        semesterName: 'Sem II',
        amount: 25000,
        paymentDate: '2024-03-22',
        receiptNo: '1254',
        isVerified: true
      }
    ]);
  };

  const loadPrajeshPreset = () => {
    setGuideName('Dr. Prajesh Prajapati');
    setGuideDesignation('Associate Professor, SDSR');
    setGuideSchool('School of Doctoral Studies and Research');
    setGuideUniversity('NFSU, Gandhinagar');
    setGuideEmail('prajesh.prajapati@nfsu.ac.in');
    setScholarName('Mr. ABC');
    setScholarGenderTitle('Mr.');
    setScholarType('Full Time');
    setRegistrationNo('Ph.D/SDSR/DFS/045/22');
    setRegistrationDate('2022-09-20');
    setIsFirstRpc(false);
    setLastRpcNumber(2);
    setLastRpcDate('2024-11-20');
    setCurrentRpcNumber(3);
    setProposedRpcDate('2025-06-15');
    setRpcTime('11:30 am onwards');
    setMode('Hybrid');
    setSchoolName('School of Cyber Security and Digital Forensics');
    setSchoolCampus('NFSU, Gandhinagar');
    setFeeDetails([
      {
        id: 'f-1',
        semesterName: 'Year I / Sem I',
        amount: 25000,
        paymentDate: '2022-09-28',
        receiptNo: '1234',
        isVerified: true
      },
      {
        id: 'f-2',
        semesterName: 'Sem II',
        amount: 25000,
        paymentDate: '2023-03-15',
        receiptNo: '1254',
        isVerified: true
      },
      {
        id: 'f-3',
        semesterName: 'Sem III',
        amount: 25000,
        paymentDate: '2023-09-22',
        receiptNo: '5638',
        isVerified: true
      }
    ]);
  };

  const addFeeRow = () => {
    const nextSemIndex = feeDetails.length + 1;
    setFeeDetails([
      ...feeDetails,
      {
        id: 'fee-' + Date.now(),
        semesterName: `Sem ${nextSemIndex}`,
        amount: 25000,
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNo: '',
        isVerified: false
      }
    ]);
  };

  const removeFeeRow = (id: string) => {
    setFeeDetails(feeDetails.filter(f => f.id !== id));
  };

  const updateFeeRow = (id: string, field: keyof FeeSemesterRecord, value: string | number | boolean) => {
    setFeeDetails(
      feeDetails.map(f => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  // Perform live audit preview
  const liveAudit = performFullAudit(
    currentRpcNumber,
    proposedRpcDate,
    isFirstRpc ? undefined : lastRpcDate,
    registrationDate,
    scholarType,
    feeDetails,
    enclosures
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const ordinal = getOrdinal(currentRpcNumber);
    const dateYear = new Date().getFullYear().toString().slice(-2);
    const randomSeq = Math.floor(10 + Math.random() * 90);
    const generatedRefNo = initialData?.refNo || `NFSU/SDSR/RPC/${randomSeq}/${dateYear}`;

    const newApp: RPCApplication = {
      id: initialData?.id || 'rpc-app-' + Date.now(),
      refNo: generatedRefNo,
      letterDate: formatDateIndian(new Date().toISOString()),
      guideName,
      guideDesignation,
      guideSchool,
      guideUniversity,
      guideEmail,
      guidePhone,
      scholarName,
      scholarGenderTitle,
      scholarType,
      researchTopic,
      registrationNo,
      registrationDate,
      lastRpcDate: isFirstRpc ? undefined : lastRpcDate,
      lastRpcNumber: isFirstRpc ? 0 : lastRpcNumber,
      proposedRpcDate,
      currentRpcNumber,
      currentRpcOrdinal: ordinal,
      rpcTime,
      mode,
      meetingVenueOrLink,
      schoolDeanTitle,
      schoolName,
      schoolCampus,
      externalMember1: {
        name: ext1Name,
        designation: ext1Desig,
        affiliation: ext1Affil,
        email: ext1Email,
        contactNo: ext1Phone,
        roleDescription: 'External Expert Member - 1'
      },
      externalMember2: {
        name: ext2Name,
        designation: ext2Desig,
        affiliation: ext2Affil,
        email: ext2Email,
        contactNo: ext2Phone,
        roleDescription: 'External Expert Member - 2'
      },
      internalMember: {
        name: intName,
        designation: intDesig,
        affiliation: intAffil,
        email: intEmail,
        contactNo: intPhone,
        roleDescription: 'Internal Expert Member'
      },
      feeDetails,
      enclosures,
      complianceAudit: liveAudit,
      status: initialData?.status || 'SDSR_Audit',
      statusHistory: initialData?.statusHistory || [
        {
          status: 'SDSR_Audit',
          timestamp: new Date().toISOString(),
          actor: 'SDSR Intake Desk',
          remarks: 'RPC application recorded and verified against PhD Ordinance criteria.'
        }
      ],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newApp);
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <Building className="w-4 h-4" />
            SDSR Formal Intake Form
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-cinzel">
            RPC Invitation Letter Application
          </h2>
          <p className="text-xs text-slate-500">
            Mandatory details S.N. 1 to 13 & Enclosures Checklist required prior to Dean SDSR Sanction
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadDevanshiPreset}
            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Load Sample: Ms. Devanshi (SPH)
          </button>
          <button
            type="button"
            onClick={loadPrajeshPreset}
            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Load Sample: Dr. Prajesh Prajapati
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Ph.D. Scholar & Guide Details (S.N. 1 to 4) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              1. Ph.D. Scholar & Research Guide Details (S.N. 1 - 4)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Ordinance Clause 3 & 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* S.N. 1: Guide Details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                S.N. 1: Details of the Ph.D. Guide
              </span>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Name of the Guide *</label>
                <input
                  type="text"
                  required
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  placeholder="e.g. Dr. Prajesh Prajapati / Prof. (Dr.) Manjunath Ghate"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Designation</label>
                  <input
                    type="text"
                    value={guideDesignation}
                    onChange={(e) => setGuideDesignation(e.target.value)}
                    placeholder="Professor / Assoc. Prof."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">School / Dept</label>
                  <input
                    type="text"
                    value={guideSchool}
                    onChange={(e) => setGuideSchool(e.target.value)}
                    placeholder="School of Pharmacy"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Guide Email</label>
                  <input
                    type="email"
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                    placeholder="guide@nfsu.ac.in"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">University / Campus</label>
                  <input
                    type="text"
                    value={guideUniversity}
                    onChange={(e) => setGuideUniversity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* S.N. 2, 3, 4: Scholar Details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                S.N. 2, 3 & 4: Details of the Ph.D. Scholar
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Title</label>
                  <select
                    value={scholarGenderTitle}
                    onChange={(e) => setScholarGenderTitle(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Ms.">Ms.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mx.">Mx.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">S.N. 2: Name of Ph.D. Scholar *</label>
                  <input
                    type="text"
                    required
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    placeholder="e.g. Ms. Devanshi Lunagariya"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">S.N. 3: Ph.D. Reg. No. *</label>
                  <input
                    type="text"
                    required
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="Ph.D/SDSR/SPH/019/23"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">S.N. 4: Registration Date *</label>
                  <input
                    type="date"
                    required
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Scholar Type</label>
                  <select
                    value={scholarType}
                    onChange={(e) => setScholarType(e.target.value as ScholarType)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Full Time">Full Time (Attendance required)</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Broad Research Topic</label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="Research title..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: RPC Timing, Sequence & Regulatory Gap (S.N. 5 to 9) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              2. RPC Schedule, Sequence & Mode (S.N. 5 - 9)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Mandatory 6-Month Time Gap Rule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* S.N. 5: Last RPC */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 block text-xs">
                S.N. 5: Last RPC Details
              </span>
              <label className="flex items-center gap-2 cursor-pointer py-1 text-slate-700">
                <input
                  type="checkbox"
                  checked={isFirstRpc}
                  onChange={(e) => {
                    setIsFirstRpc(e.target.checked);
                    if (e.target.checked) {
                      setCurrentRpcNumber(1);
                      setLastRpcDate('');
                      setLastRpcNumber(0);
                    }
                  }}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium">This is the 1st RPC Presentation</span>
              </label>

              {!isFirstRpc && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-600 mb-1">Previous RPC No.</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={lastRpcNumber}
                      onChange={(e) => setLastRpcNumber(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Date of Last RPC *</label>
                    <input
                      type="date"
                      required={!isFirstRpc}
                      value={lastRpcDate}
                      onChange={(e) => setLastRpcDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* S.N. 6 & 7: Current Proposed RPC */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="font-semibold text-slate-800 block text-xs">
                S.N. 6 & 7: Current Proposed RPC
              </span>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  S.N. 7: Current RPC to be held *
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={currentRpcNumber}
                    onChange={(e) => setCurrentRpcNumber(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none font-semibold text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {getOrdinal(n)} RPC Presentation
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  S.N. 6: Date of Proposed RPC *
                </label>
                <input
                  type="date"
                  required
                  value={proposedRpcDate}
                  onChange={(e) => setProposedRpcDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* S.N. 8 & 9: Time and Mode */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="font-semibold text-slate-800 block text-xs">
                S.N. 8 & 9: Time & Delivery Mode
              </span>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">S.N. 8: Time of RPC *</label>
                <input
                  type="text"
                  required
                  value={rpcTime}
                  onChange={(e) => setRpcTime(e.target.value)}
                  placeholder="e.g. 12:00 Noon onwards / 11:30 am onwards"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">S.N. 9: Mode *</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as RPCMode)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Online">Online (Video Conference)</option>
                  <option value="Offline">Offline (In-Person SDSR)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Meeting Venue / Link</label>
                <input
                  type="text"
                  value={meetingVenueOrLink}
                  onChange={(e) => setMeetingVenueOrLink(e.target.value)}
                  placeholder="Google Meet link or Conference Hall..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Time Gap Live Audit Banner */}
          <div className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
            liveAudit.timeGapStatus === 'COMPLIANT' || liveAudit.timeGapStatus === 'FIRST_RPC_VALID'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : liveAudit.timeGapStatus === 'FLAGGED_PREMATURE'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">
                Ordinance Audit: {liveAudit.timeGapStatus === 'COMPLIANT' ? '6-Month Gap Compliant' : liveAudit.timeGapStatus === 'FIRST_RPC_VALID' ? 'Valid First RPC' : 'Regulatory Attention Needed'}
              </div>
              <p className="mt-0.5">{liveAudit.timeGapRemarks}</p>
            </div>
          </div>
        </div>

        {/* Section 3: RPC Members Details (S.N. 10, 11, 12 + School Dean) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              3. RPC Committee Constitution (S.N. 10 - 12 as per approved letter)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Approved Committee Members</span>
          </div>

          {/* Recipient 1: Dean of School */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Recipient 1: Dean Title</label>
              <input
                type="text"
                value={schoolDeanTitle}
                onChange={(e) => setSchoolDeanTitle(e.target.value)}
                placeholder="Dean"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">School Name *</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="School of Pharmacy"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">University / Campus</label>
              <input
                type="text"
                value={schoolCampus}
                onChange={(e) => setSchoolCampus(e.target.value)}
                placeholder="NFSU, Gandhinagar"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* S.N. 10: External Member 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
              S.N. 10: Details of External RPC Member - 1
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Name *</label>
                <input
                  type="text"
                  required
                  value={ext1Name}
                  onChange={(e) => setExt1Name(e.target.value)}
                  placeholder="Dr. Dhiraj Bhatia"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Designation</label>
                <input
                  type="text"
                  value={ext1Desig}
                  onChange={(e) => setExt1Desig(e.target.value)}
                  placeholder="Associate Professor & INYAS-INSA Member"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Affiliation *</label>
              <input
                type="text"
                required
                value={ext1Affil}
                onChange={(e) => setExt1Affil(e.target.value)}
                placeholder="Department of Biological Science and Engineering, IIT Gandhinagar, Gujarat"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Mail ID *</label>
                <input
                  type="email"
                  required
                  value={ext1Email}
                  onChange={(e) => setExt1Email(e.target.value)}
                  placeholder="dhiraj.bhatia@iitgn.ac.in"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Contact No.</label>
                <input
                  type="text"
                  value={ext1Phone}
                  onChange={(e) => setExt1Phone(e.target.value)}
                  placeholder="+91 79 2395 2500"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* S.N. 11: External Member 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
              S.N. 11: Details of External RPC Member - 2
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Name *</label>
                <input
                  type="text"
                  required
                  value={ext2Name}
                  onChange={(e) => setExt2Name(e.target.value)}
                  placeholder="Dr. Prakash Jha"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Designation</label>
                <input
                  type="text"
                  value={ext2Desig}
                  onChange={(e) => setExt2Desig(e.target.value)}
                  placeholder="Professor & Dean"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Affiliation *</label>
              <input
                type="text"
                required
                value={ext2Affil}
                onChange={(e) => setExt2Affil(e.target.value)}
                placeholder="School of Applied Material Science, Central University of Gujarat"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Mail ID *</label>
                <input
                  type="email"
                  required
                  value={ext2Email}
                  onChange={(e) => setExt2Email(e.target.value)}
                  placeholder="prakash.jha@cug.ac.in"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Contact No.</label>
                <input
                  type="text"
                  value={ext2Phone}
                  onChange={(e) => setExt2Phone(e.target.value)}
                  placeholder="+91 79 2975 0280"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* S.N. 12: Internal Member */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
              S.N. 12: Details of Internal RPC Member
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Name *</label>
                <input
                  type="text"
                  required
                  value={intName}
                  onChange={(e) => setIntName(e.target.value)}
                  placeholder="Dr. Bhoomika Patel"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Designation</label>
                <input
                  type="text"
                  value={intDesig}
                  onChange={(e) => setIntDesig(e.target.value)}
                  placeholder="Dean (I/C), SPH"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Affiliation</label>
              <input
                type="text"
                value={intAffil}
                onChange={(e) => setIntAffil(e.target.value)}
                placeholder="NFSU, Gandhinagar"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Mail ID *</label>
                <input
                  type="email"
                  required
                  value={intEmail}
                  onChange={(e) => setIntEmail(e.target.value)}
                  placeholder="bhoomika.patel@nfsu.ac.in"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Contact No.</label>
                <input
                  type="text"
                  value={intPhone}
                  onChange={(e) => setIntPhone(e.target.value)}
                  placeholder="+91 79 2397 7144"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Fees Details (S.N. 13) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                4. S.N. 13: Fees Details (SEM Wise)
              </h3>
              <p className="text-xs text-slate-500">
                SDSR verifies full clearance of all previous and current semester fees receipts prior to RPC approval
              </p>
            </div>
            <button
              type="button"
              onClick={addFeeRow}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Semester
            </button>
          </div>

          {/* Fees Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <th className="p-2.5 font-semibold">Semester</th>
                  <th className="p-2.5 font-semibold">Amount (Rs.)</th>
                  <th className="p-2.5 font-semibold">Payment Date</th>
                  <th className="p-2.5 font-semibold">Receipt No.</th>
                  <th className="p-2.5 font-semibold text-center">Verified</th>
                  <th className="p-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {feeDetails.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={f.semesterName}
                        onChange={(e) => updateFeeRow(f.id, 'semesterName', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-36 focus:outline-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={f.amount}
                        onChange={(e) => updateFeeRow(f.id, 'amount', Number(e.target.value))}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-28 focus:outline-none font-mono"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="date"
                        value={f.paymentDate}
                        onChange={(e) => updateFeeRow(f.id, 'paymentDate', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-36 focus:outline-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        placeholder="Receipt #"
                        value={f.receiptNo}
                        onChange={(e) => updateFeeRow(f.id, 'receiptNo', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-36 focus:outline-none font-mono"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={f.isVerified}
                        onChange={(e) => updateFeeRow(f.id, 'isVerified', e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeFeeRow(f.id)}
                        disabled={feeDetails.length <= 1}
                        className="text-slate-400 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600">
              Audit Status: <strong className="text-slate-900">{liveAudit.feesStatus}</strong> ({liveAudit.feesRemarks})
            </span>
            <span className="text-slate-500 font-mono">
              Total Recorded Fees: Rs.{' '}
              {feeDetails.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Section 5: List of Enclosures (1 to 5) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                5. Mandatory List of Enclosures (Checklist 1 to 5)
              </h3>
              <p className="text-xs text-slate-500">
                All 5 enclosures must be physically or digitally received by SDSR office
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
              {Object.values(enclosures).filter(Boolean).length} of 5 Attached
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={enclosures.registrationCertificate}
                onChange={(e) => setEnclosures({ ...enclosures, registrationCertificate: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">1. Ph.D. Registration Certificate</span>
                <span className="text-slate-500">Issued by SDSR registrar office confirming eligibility and candidate enrolment.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={enclosures.rpcMemberApprovedLetter}
                onChange={(e) => setEnclosures({ ...enclosures, rpcMemberApprovedLetter: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">2. RPC Member Approved Letter from Dean SDSR</span>
                <span className="text-slate-500">Constitution letter duly signed by Dean SDSR authorizing the 2 External + 1 Internal members.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={enclosures.feesReceiptsAllSemester}
                onChange={(e) => setEnclosures({ ...enclosures, feesReceiptsAllSemester: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">3. Fees Receipts for All Semesters</span>
                <span className="text-slate-500">Original / verified e-receipts verifying no outstanding academic tuition dues.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={enclosures.attendanceReportSigned}
                onChange={(e) => setEnclosures({ ...enclosures, attendanceReportSigned: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  4. Attendance Report from Last Date of RPC duly signed by Ph.D. Scholar and endorsed by Guide
                </span>
                <span className="text-slate-500">
                  Required for all Full-Time research scholars (minimum 75% residency requirement).
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={enclosures.previousRpcReport}
                onChange={(e) => setEnclosures({ ...enclosures, previousRpcReport: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">5. Previous RPC Report</span>
                <span className="text-slate-500">
                  Duly signed evaluation and milestone comments from the previous committee meeting. (Baseline if 1st RPC).
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Overall Audit Summary & Submit Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                SDSR Scrutiny Verdict:
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                liveAudit.overallStatus === 'APPROVED_FOR_DEAN'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {liveAudit.overallStatus === 'APPROVED_FOR_DEAN'
                  ? 'Ready to Generate Letter & Forward to Dean'
                  : 'Needs Rectification before Dean Forwarding'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Saving will register the application into the SDSR Office Docket and automatically prepare the official notice Ref No.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              id="save-rpc-application-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Application & Prepare Letter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
