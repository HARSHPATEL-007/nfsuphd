import { useState, useRef, ChangeEvent } from 'react';
import { 
  FileText, 
  Download, 
  Table, 
  CheckCircle2, 
  Upload, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Info,
  Copy,
  FolderDown,
  Building,
  Users,
  ShieldCheck
} from 'lucide-react';
import { RPCApplication } from '../types';
import { 
  downloadSampleRpcLetterDocx, 
  downloadBlankRpcLetterDocx, 
  generateRpcLetterDocx, 
  triggerFileDownload 
} from '../utils/docxExport';
import { 
  downloadSampleExcelRegister, 
  downloadBlankExcelTemplate, 
  exportApplicationsToExcel,
  parseExcelUpload,
  EXCEL_REGISTER_HEADERS
} from '../utils/excelExport';
import { 
  SCREENSHOT_CANDIDATE_ROWS, 
  convertRowsToRpcApplications 
} from '../data/screenshotCandidates';

interface DocumentFormatsHubProps {
  applications: RPCApplication[];
  onImportApplications: (newApps: RPCApplication[]) => void;
  onSelectApplicationForLetter: (app: RPCApplication) => void;
}

export function DocumentFormatsHub({
  applications,
  onImportApplications,
  onSelectApplicationForLetter
}: DocumentFormatsHubProps) {
  const [activeTab, setActiveTab] = useState<'docx' | 'xlsx'>('docx');
  const [copiedDocxText, setCopiedDocxText] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle sample docx download
  const handleDownloadSampleDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      await downloadSampleRpcLetterDocx();
    } catch (e) {
      console.error(e);
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  // Handle blank docx download
  const handleDownloadBlankDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      await downloadBlankRpcLetterDocx();
    } catch (e) {
      console.error(e);
      alert('Error generating Word template. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  // Handle sample excel download
  const handleDownloadSampleExcel = () => {
    try {
      setIsDownloadingExcel(true);
      downloadSampleExcelRegister();
    } catch (e) {
      console.error(e);
      alert('Error generating Excel file. Please try again.');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  // Handle blank excel download
  const handleDownloadBlankExcel = () => {
    try {
      setIsDownloadingExcel(true);
      downloadBlankExcelTemplate();
    } catch (e) {
      console.error(e);
      alert('Error generating Excel template. Please try again.');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  // Export current active portal applications to Excel
  const handleExportCurrentToExcel = () => {
    exportApplicationsToExcel(applications);
  };

  // Load all 14 candidates from university screenshot into the portal
  const handleLoadScreenshotCandidates = () => {
    const screenshotApps = convertRowsToRpcApplications(SCREENSHOT_CANDIDATE_ROWS);
    onImportApplications(screenshotApps);
    setImportSuccessMessage(
      `Successfully loaded all 14 Ph.D. scholars from the NFSU tracking register into the portal!`
    );
    setTimeout(() => setImportSuccessMessage(null), 5000);
  };

  // Handle file upload of custom excel register
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedRows = await parseExcelUpload(file);
      if (parsedRows.length === 0) {
        alert('No data rows found in uploaded Excel file. Ensure columns match the format.');
        return;
      }

      const importedApps = convertRowsToRpcApplications(parsedRows);
      onImportApplications(importedApps);
      setImportSuccessMessage(
        `Imported ${importedApps.length} candidate dockets directly from "${file.name}"!`
      );
      setTimeout(() => setImportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to parse excel file', err);
      alert('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls spreadsheet.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyLetterFormat = () => {
    const formatSample = `
राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय
(राष्ट्रीय महत्त्व का संस्थान, गृह मंत्रालय, भारत सरकार)
National Forensic Sciences University
(An Institution of National Importance under Ministry of Home Affairs, Government of India)
School of Doctoral Studies and Research (SDSR)

Ref: No: NFSU/SDSR/RPC/    /25                                                Date: 10/06/2025

To,
1.  Dean, School of Pharmacy, NFSU, Gandhinagar
2.  Prof. (Dr.) Manjunath Ghate, Professor, SPH, NFSU
3.  Dr. Bhoomika Patel (Internal Expert Member), Dean (I/C), SPH, NFSU, Gandhinagar
4.  Dr. Dhiraj Bhatia (External Expert Member), Associate Professor & INYAS-INSA Member, Department of Biological Science and Engineering, IIT Gandhinagar, Gujarat
5.  Dr. Prakash Jha (External Expert Member), Professor & Dean, School of Applied Material Science, Central University of Gujarat

Subject: 1st Meeting of the Research Progress Committee (RPC) for Ph.D. Scholar Registered under Prof. (Dr.) Manjunath Ghate, Professor, SPH, NFSU.

Dear Sir/Madam,

The meeting of Research Progress Committee (RPC) for undernoted Ph.D. School of Pharmacy NFSU is scheduled on 10th June, 2025 from 12:00 Noon onwards through online mode.

• Name of Ph.D. Scholar- Ms. Devanshi Lunagariya (1stRPC)

Your presence and valuable suggestions are highly appreciated. Kindly make it convenient to attend the meeting.

Thanking you,

Dean
School of Doctoral Studies and Research

Copy to:
1. Associate Dean- SDSR
    `.trim();

    navigator.clipboard.writeText(formatSample);
    setCopiedDocxText(true);
    setTimeout(() => setCopiedDocxText(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <FolderDown className="w-4 h-4" />
            Official Administrative Documentation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-cinzel">
            Example Documents & Formats (.docx & Excel Sheet)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Download genuine Microsoft Word (.docx) letter templates and Excel (.xlsx) tracking registers matching the School of Doctoral Studies and Research (SDSR) formats.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="download-example-word-top-btn"
            type="button"
            onClick={handleDownloadSampleDocx}
            disabled={isDownloadingDocx}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Example Letter (.docx)
          </button>
          <button
            id="download-example-excel-top-btn"
            type="button"
            onClick={handleDownloadSampleExcel}
            disabled={isDownloadingExcel}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Table className="w-3.5 h-3.5" />
            Download Register (.xlsx)
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {importSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{importSuccessMessage}</span>
        </div>
      )}

      {/* Format Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          id="tab-select-docx-format"
          type="button"
          onClick={() => setActiveTab('docx')}
          className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'docx'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          1. Official RPC Invitation Letter (.docx)
        </button>

        <button
          id="tab-select-excel-format"
          type="button"
          onClick={() => setActiveTab('xlsx')}
          className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'xlsx'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          2. SDSR Tracking Register (Excel Sheet Format)
        </button>
      </div>

      {/* TAB 1: WORD (.DOCX) FORMAT DETAILS */}
      {activeTab === 'docx' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-900 text-xs">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                Formatted strictly according to <strong>National Forensic Sciences University</strong> statutory letterhead with Hindi/English bilingual header, 5-member committee addressing, and Dean SDSR authorization block.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="copy-docx-text-structure-btn"
                type="button"
                onClick={handleCopyLetterFormat}
                className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-medium flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedDocxText ? 'Copied structure!' : 'Copy Letter Text'}
              </button>

              <button
                id="download-sample-docx-btn"
                type="button"
                onClick={handleDownloadSampleDocx}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Populated Letter (.docx)
              </button>

              <button
                id="download-blank-docx-btn"
                type="button"
                onClick={handleDownloadBlankDocx}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Blank Template (.docx)
              </button>
            </div>
          </div>

          {/* Letter Structure Breakdown & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Visual Structure Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                <h3 className="font-bold text-slate-900 text-sm font-cinzel border-b border-slate-100 pb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  Statutory Clauses in the .docx Document
                </h3>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Bilingual University Letterhead</strong>
                      <span>राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय & National Forensic Sciences University, under Ministry of Home Affairs, Govt. of India.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Reference Dispatch No. & Date</strong>
                      <span>E.g., <code>Ref: No: NFSU/SDSR/RPC/ /25</code> and formal letter date.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Five Addressed Recipients (To,)</strong>
                      <span className="block mt-0.5 text-slate-500">
                        1. Dean of Concerned School (e.g. SPH)<br />
                        2. Guide / Supervisor<br />
                        3. Internal Expert Member<br />
                        4. External Expert Member 1<br />
                        5. External Expert Member 2
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Specific Subject Line</strong>
                      <span>Mentions RPC Meeting Ordinal (1st, 2nd, etc.) and Ph.D. Scholar name and Guide title.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      5
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Date, Time, & Presentation Mode</strong>
                      <span>Formal date (e.g. 10th June, 2025), time (12:00 Noon onwards), mode (Online / Offline / Hybrid), and Google Meet URL.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      6
                    </span>
                    <div>
                      <strong className="text-slate-800 block">Dean SDSR Signatory & Copy To</strong>
                      <span>Official sign block by Dean SDSR with copy to Associate Dean and SDSR Records.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Export for Currently Active Applications */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Export Any Active Docket to Word (.docx)
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {applications.map(app => (
                    <div
                      key={app.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 bg-slate-50/70 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{app.scholarName}</p>
                        <p className="text-[11px] text-slate-500">{app.currentRpcOrdinal} RPC • {app.schoolName}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            const blob = await generateRpcLetterDocx(app);
                            triggerFileDownload(blob, `RPC_Letter_${app.scholarName.replace(/\s+/g, '_')}.docx`);
                          }}
                          className="p-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
                          title="Download .docx"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectApplicationForLetter(app)}
                          className="p-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                          title="View in Portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Visual Match of Screenshot 3 */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-900 font-serif leading-relaxed text-xs sm:text-sm">
                {/* Header */}
                <div className="text-center border-b border-slate-900 pb-3 mb-5 font-cinzel">
                  <p className="font-bold text-base text-slate-900">राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय</p>
                  <p className="text-[11px] text-slate-600">(राष्ट्रीय महत्त्व का संस्थान, गृह मंत्रालय, भारत सरकार)</p>
                  <p className="font-bold text-lg text-slate-900 mt-1">National Forensic Sciences University</p>
                  <p className="text-[10px] text-slate-600 italic">(An Institution of National Importance under Ministry of Home Affairs, Government of India)</p>
                  <p className="font-semibold text-xs text-slate-800 uppercase mt-0.5">School of Doctoral Studies and Research (SDSR)</p>
                </div>

                {/* Ref & Date */}
                <div className="flex justify-between items-baseline mb-4 font-sans text-xs">
                  <span><strong>Ref: No:</strong> NFSU/SDSR/RPC/ &nbsp; &nbsp; /25</span>
                  <span><strong>Date:</strong> 10/06/2025</span>
                </div>

                {/* To */}
                <div className="space-y-2 mb-4 font-sans text-xs">
                  <p className="font-bold">To,</p>
                  <div className="pl-3">
                    <p className="font-bold">1. &nbsp; Dean</p>
                    <p className="pl-4">School of Pharmacy, NFSU, Gandhinagar</p>
                  </div>
                  <div className="pl-3">
                    <p className="font-bold">2. &nbsp; Prof. (Dr.) Manjunath Ghate</p>
                    <p className="pl-4">Professor, SPH, NFSU</p>
                  </div>
                  <div className="pl-3">
                    <p className="font-bold">3. &nbsp; Dr. Bhoomika Patel (Internal Expert Member).</p>
                    <p className="pl-4">Dean (I/C), SPH, NFSU, Gandhinagar</p>
                  </div>
                  <div className="pl-3">
                    <p className="font-bold">4. &nbsp; Dr. Dhiraj Bhatia (External Expert Member)</p>
                    <p className="pl-4">Associate Professor & INYAS-INSA Member, IIT Gandhinagar, Gujarat</p>
                  </div>
                  <div className="pl-3">
                    <p className="font-bold">5. &nbsp; Dr. Prakash Jha (External Expert Member).</p>
                    <p className="pl-4">Professor & Dean, Central University of Gujarat</p>
                  </div>
                </div>

                {/* Subject */}
                <div className="bg-slate-50 p-2 rounded font-sans text-xs font-bold border-l-2 border-slate-900 mb-4">
                  Subject: 1st Meeting of the Research Progress Committee (RPC) for Ph.D. Scholar Registered under Prof. (Dr.) Manjunath Ghate, Professor, SPH, NFSU.
                </div>

                {/* Body */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <p>Dear Sir/Madam,</p>
                  <p>
                    The meeting of <strong>Research Progress Committee (RPC)</strong> for undernoted Ph.D. <strong>School of Pharmacy</strong> NFSU is scheduled on <strong>10th June, 2025 from 12:00 Noon onwards</strong> through online mode.
                  </p>
                  <p className="pl-4 font-sans font-bold text-slate-900">
                    • &nbsp; Name of Ph.D. Scholar- Ms. Devanshi Lunagariya (1stRPC)
                  </p>
                  <p>
                    Your presence and valuable suggestions are highly appreciated. Kindly make it convenient to attend the meeting.
                  </p>
                  <p className="pt-1">Thanking you,</p>
                </div>

                {/* Signature */}
                <div className="mt-6 text-right font-sans text-xs">
                  <p className="font-bold text-slate-900">Dean</p>
                  <p className="text-slate-600">School of Doctoral Studies and Research</p>
                </div>

                {/* Copy to */}
                <div className="mt-6 pt-3 border-t border-slate-200 font-sans text-[11px] text-slate-700">
                  <p className="font-bold">Copy to:</p>
                  <p className="pl-3">1. &nbsp; Associate Dean- SDSR</p>
                  <p className="pl-3">2. &nbsp; Concerned School Dean</p>
                  <p className="pl-3">3. &nbsp; Ph.D. Section Record File, SDSR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEL (.XLSX) REGISTER FORMAT */}
      {activeTab === 'xlsx' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-900 text-xs">
              <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                Standardized <strong>20-Column Master Register</strong> used by SDSR Ph.D. Administration to track all scholars, supervisors, enrollment numbers, and 3 internal/external expert committee members.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="load-screenshot-candidates-btn"
                type="button"
                onClick={handleLoadScreenshotCandidates}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load 14 Screenshot Scholars into Portal
              </button>

              <button
                id="download-sample-excel-btn"
                type="button"
                onClick={handleDownloadSampleExcel}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Example Register (.xlsx)
              </button>

              <button
                id="download-blank-excel-btn"
                type="button"
                onClick={handleDownloadBlankExcel}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Blank Template (.xlsx)
              </button>

              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Upload / Import Excel File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 20 Columns Table View of Real Screenshot Data */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-cinzel flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-600" />
                  SDSR Master Tracking Register (14 Real Scholars from Screenshot 2)
                </h3>
                <p className="text-xs text-slate-500">
                  Showing all 20 standard columns: Candidate details, Guide, School, Enrollment No, and Expert Member Addresses.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCurrentToExcel}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Export Currently Active Portal ({applications.length}) to .xlsx
              </button>
            </div>

            {/* Scrollable Horizontal Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-inner max-h-[500px]">
              <table className="min-w-[1800px] divide-y divide-slate-200 text-xs text-slate-700 text-left">
                <thead className="bg-slate-900 text-white font-semibold sticky top-0 z-10">
                  <tr>
                    {EXCEL_REGISTER_HEADERS.map((col, idx) => (
                      <th
                        key={col + idx}
                        className={`px-3 py-2.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
                          col.includes('Internal')
                            ? 'bg-blue-900'
                            : col.includes('External Expert Member - 1')
                            ? 'bg-purple-900'
                            : col.includes('External Expert Member - 2')
                            ? 'bg-indigo-900'
                            : ''
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {SCREENSHOT_CANDIDATE_ROWS.map((row, idx) => (
                    <tr
                      key={row.enrollmentNo + idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-slate-500 text-center">{row.srNo}</td>
                      <td className="px-3 py-2 font-mono whitespace-nowrap">{row.date}</td>
                      <td className="px-3 py-2 font-bold text-slate-900 whitespace-nowrap">{row.name}</td>
                      <td className="px-3 py-2 text-slate-800 whitespace-nowrap">{row.guideName}</td>
                      <td className="px-3 py-2 font-mono text-amber-700 font-semibold">{row.enrollmentNo}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.nameOfSchool}</td>
                      <td className="px-3 py-2 font-semibold text-emerald-700 text-center">{row.rpcLetter}</td>

                      {/* Internal Member */}
                      <td className="px-3 py-2 font-medium text-blue-900 whitespace-nowrap bg-blue-50/30">
                        {row.internalExpertMember}
                      </td>
                      <td className="px-3 py-2 text-slate-600 bg-blue-50/30">{row.internalAddress1}</td>
                      <td className="px-3 py-2 text-slate-600 bg-blue-50/30">{row.internalAddress2}</td>
                      <td className="px-3 py-2 text-slate-600 bg-blue-50/30">{row.internalAddress3}</td>

                      {/* External Member 1 */}
                      <td className="px-3 py-2 font-medium text-purple-900 whitespace-nowrap bg-purple-50/30">
                        {row.externalExpertMember1}
                      </td>
                      <td className="px-3 py-2 text-slate-600 bg-purple-50/30">{row.external1Address1}</td>
                      <td className="px-3 py-2 text-slate-600 bg-purple-50/30">{row.external1Address2}</td>
                      <td className="px-3 py-2 text-slate-600 bg-purple-50/30">{row.external1Address3}</td>

                      {/* External Member 2 */}
                      <td className="px-3 py-2 font-medium text-indigo-900 whitespace-nowrap bg-indigo-50/30">
                        {row.externalExpertMember2}
                      </td>
                      <td className="px-3 py-2 text-slate-600 bg-indigo-50/30">{row.external2Address1}</td>
                      <td className="px-3 py-2 text-slate-600 bg-indigo-50/30">{row.external2Address2}</td>
                      <td className="px-3 py-2 text-slate-600 bg-indigo-50/30">{row.external2Address3}</td>

                      <td className="px-3 py-2 font-semibold text-emerald-700 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                          {row.rpc01Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Single Source of Truth</span>
                <p>
                  Any update to the Ph.D. scholar register in this portal can be exported to .xlsx with one click, preserving compatibility with university legacy spreadsheets.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Batch Import from Department</span>
                <p>
                  Schools or departmental coordinators can share filled Excel registers which the SDSR office uploads to generate batch RPC notices instantly.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Zero-Cost Offline Processing</span>
                <p>
                  The entire Excel parser and generator runs client-side in the web browser without transmitting confidential scholar records to third-party cloud servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
