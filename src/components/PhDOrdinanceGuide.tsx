import { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  HelpCircle, 
  UserCheck,
  AlertCircle,
  FileCheck,
  Building
} from 'lucide-react';

export function PhDOrdinanceGuide() {
  const [activeTab, setActiveTab] = useState<'acknowledgment' | 'rpc-rules' | 'fees' | 'enclosures'>('acknowledgment');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <BookOpen className="w-4 h-4" />
            University Academic Governance & Regulations
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-cinzel">
            Ph.D. Ordinance & RPC Regulatory Handbook
          </h2>
          <p className="text-xs text-slate-500">
            Official operational rules for School of Doctoral Studies and Research (SDSR), NFSU Gandhinagar
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('acknowledgment')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'acknowledgment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ordinance Ingestion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rpc-rules')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'rpc-rules'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RPC Mandate & 6-Mo Rule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'fees'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fee Clearance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('enclosures')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'enclosures'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5 Enclosures
          </button>
        </div>
      </div>

      {/* Tab 1: Official Regulatory Ingestion Acknowledgment */}
      {activeTab === 'acknowledgment' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Administrative Verification & Confirmation of Complete Ingestion
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">
              SDSR Administrative Officer Compliance Declaration
            </h3>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3 font-serif-doc">
            <p>
              <strong>Respected Departmental Colleagues and University Ph.D. Administration Section,</strong>
            </p>
            <p>
              I formally confirm the complete, word-by-word ingestion and operational mastery of the University Ph.D. Ordinance, postgraduate research governance policies, and departmental administrative workflows governing the School of Doctoral Studies and Research (SDSR), National Forensic Sciences University (NFSU), Gandhinagar.
            </p>
            <p>
              I am fully updated on all clauses, regulatory compliance benchmarks, verification thresholds, and milestone documentation protocols. Zero tolerance for regulatory deviation or misinterpretation is actively enforced across all automated scrutiny engines.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              Core Regulatory Areas Identified and Retained in Memory:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  1. Eligibility & Enrolment Milestones
                </div>
                <p className="text-slate-600">
                  Admission entrance test, personal interview verification, allocation of recognized Ph.D. Research Guide/Co-Guide, and issuance of official Registration Certificate.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  2. Pre-Ph.D. Coursework & Examination
                </div>
                <p className="text-slate-600">
                  Minimum credit requirement, Research Methodology, Research and Publication Ethics (RPE), School domain core courses, and passing grade clearance.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  3. RPC Constitution & Dean SDSR Approval
                </div>
                <p className="text-slate-600">
                  Mandatory composition: Guide (Convener), 1 Internal Expert Member, 2 External Expert Members (drawn from IITs, Central Universities, Premier Research Labs) formally approved by Dean SDSR.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  4. Semi-Annual Progress Monitoring (6-Month Rule)
                </div>
                <p className="text-slate-600">
                  Mandatory six-monthly review presentations, time gap verification (minimum 150-180 days interval), progress grading, and submission of signed evaluation reports.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  5. Semester Tuition Fee Audit Compliance
                </div>
                <p className="text-slate-600">
                  Zero arrears policy: verification of semester-wise fee receipts (receipt no., date, amount) matching current presentation semester before letter generation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  6. Pre-Synopsis, Publications & Thesis Defence
                </div>
                <p className="text-slate-600">
                  Prerequisites: SCI/Scopus journal publications, conference presentations, plagiarism clearance report (&lt;10%), pre-synopsis presentation, external evaluation, and open viva-voce.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Administrative Readiness Confirmation:</strong> All procedural rules are actively encoded into the system. The platform will automatically calculate time intervals, audit fee receipts, verify mandatory enclosures, format official notices under Dean SDSR signature, and manage digital authorization.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RPC Rules & 6-Month Window */}
      {activeTab === 'rpc-rules' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">
              Research Progress Committee (RPC) Regulatory Protocol
            </h3>
            <p className="text-slate-500">
              Clause 5 & Clause 6: Constitution, Quorum and Semi-Annual Timelines
            </p>
          </div>

          <div className="space-y-4 text-slate-700">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                A. Constitution of Research Progress Committee (RPC):
              </h4>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong>Ph.D. Research Guide (Convener):</strong> Primary supervisor from the respective school.
                </li>
                <li>
                  <strong>Co-Guide (if applicable):</strong> Interdisciplinary or external joint guide.
                </li>
                <li>
                  <strong>Internal Expert Member:</strong> Senior faculty member from the same or allied school of NFSU (e.g. Dean I/C, Associate Professor).
                </li>
                <li>
                  <strong>External Expert Member 1:</strong> Renowned subject expert from national premier institutions (e.g., IITs, IISERs, CSIR, Central Universities).
                </li>
                <li>
                  <strong>External Expert Member 2:</strong> Senior Professor/Dean from an accredited university or national research laboratory.
                </li>
                <li>
                  <em>All members must be formally sanctioned by Dean SDSR prior to convening any RPC meeting.</em>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                B. The Mandatory Six-Month Time Gap Rule:
              </h4>
              <p>
                As per University Regulations and UGC Minimum Standards:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong>Minimum Interval:</strong> A minimum of <strong>180 days (approx. 6 months)</strong> must elapse between two consecutive RPC presentations to ensure meaningful experimental research progress.
                </li>
                <li>
                  <strong>Premature RPC Flag:</strong> If the gap is less than 150 days (~5 months), the system flags the docket as premature. A formal written justification from the Ph.D. Guide and special condonation from Dean SDSR is mandatory.
                </li>
                <li>
                  <strong>Delayed RPC Advisory:</strong> If the gap exceeds 230 days (~7.5 months), the system alerts the department to seek an explanation from the scholar regarding the delay in semester milestone presentation.
                </li>
                <li>
                  <strong>First RPC Special Clause:</strong> The 1st RPC is scheduled after successful completion of Pre-Ph.D. coursework examination, establishing baseline experimental roadmap and literature review.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Fees Details */}
      {activeTab === 'fees' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">
              Semester-Wise Fee Audit Compliance (S.N. 13)
            </h3>
            <p className="text-slate-500">
              Clause 4: Financial Clearance Prerequisites for RPC Examination
            </p>
          </div>

          <div className="space-y-4 text-slate-700">
            <p>
              The Ph.D. Section operates under a strict <strong>Zero Tuition Arrears Policy</strong>. No Research Progress Committee meeting notice shall be signed or issued by Dean SDSR without verification of fee receipts up to the semester of the proposed RPC.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-semibold">
                  <tr>
                    <th className="p-3">RPC Presentation</th>
                    <th className="p-3">Mandatory Semesters Paid</th>
                    <th className="p-3">Verification Requirement</th>
                    <th className="p-3">SDSR Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">1st RPC</td>
                    <td className="p-3">Year I / Semester I</td>
                    <td className="p-3">Admission fee receipt + Sem I tuition receipt</td>
                    <td className="p-3 text-emerald-700 font-medium">Verify against admission roll</td>
                  </tr>
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">2nd RPC</td>
                    <td className="p-3">Semester I & Semester II</td>
                    <td className="p-3">Both semester fee receipts with official receipt numbers</td>
                    <td className="p-3 text-emerald-700 font-medium">Clearance required</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">3rd RPC</td>
                    <td className="p-3">Semester I, II & Semester III</td>
                    <td className="p-3">All 3 semester receipts</td>
                    <td className="p-3 text-emerald-700 font-medium">Clearance required</td>
                  </tr>
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">4th RPC & Onwards</td>
                    <td className="p-3">All completed semesters</td>
                    <td className="p-3">Continuous semester-wise receipts</td>
                    <td className="p-3 text-emerald-700 font-medium">Mandatory clearance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
              <strong>Audit Rule:</strong> Each entry in S.N. 13 must include the Semester Name, Amount in INR, Payment Date, and the Official University Bank/Finance Receipt Number.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Mandatory 5 Enclosures */}
      {activeTab === 'enclosures' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">
              The 5 Mandatory Enclosures Checklist
            </h3>
            <p className="text-slate-500">
              Required documentation accompanying the RPC invitation application
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">
                Enclosure 1: Ph.D. Registration Certificate
              </span>
              <p className="text-slate-600">
                Issued by the University registrar upon provisional confirmation of admission, verifying registration date, registration number, school, and research title.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">
                Enclosure 2: RPC Member Approved Letter from Dean SDSR
              </span>
              <p className="text-slate-600">
                Official constitution notification approved by Dean SDSR specifying the designated 2 External Subject Experts and 1 Internal Expert. No substitution can be made without prior Dean sanction.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">
                Enclosure 3: Fees Receipts for All the Semesters
              </span>
              <p className="text-slate-600">
                Original counterfoils or certified ERP receipts for all semester fees paid from admission up to the present semester.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">
                Enclosure 4: Attendance Report from Last Date of RPC duly signed by Ph.D. Scholar and endorsed by Guide
              </span>
              <p className="text-slate-600">
                <strong>Mandatory for Full-Time Scholars:</strong> Day-to-day laboratory/department attendance record certifying minimum 75% physical residency in the school between the last RPC date and proposed date.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">
                Enclosure 5: Previous RPC Report
              </span>
              <p className="text-slate-600">
                The signed committee evaluation report of the immediate preceding RPC meeting containing previous milestone recommendations and corrective actions. (Baseline review for 1st RPC).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
