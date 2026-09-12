import * as XLSX from 'xlsx';
import { RPCApplication } from '../types';
import { SCREENSHOT_CANDIDATE_ROWS, ScreenshotCandidateRow } from '../data/screenshotCandidates';

export const EXCEL_REGISTER_HEADERS = [
  'Sr.No',
  'Date',
  'Name',
  'Guide Name',
  'Enrollment No',
  'Name of School',
  'RPC Letter',
  'Internal Expert Member',
  'Address 1',
  'Address 2',
  'Address 3',
  'External Expert Member - 1',
  'Address 1',
  'Address 2',
  'Address 3',
  'External Expert Member - 2',
  'Address 1',
  'Address 2',
  'Address 3',
  '01 RPC'
];

/**
 * Converts an application or candidate row into the university's exact 20-column Excel format.
 */
export function applicationToExcelRow(app: RPCApplication, index: number): (string | number)[] {
  // Parse internal affiliation lines
  const internalAffil = app.internalMember.affiliation.split(',').map(s => s.trim());
  const ext1Affil = app.externalMember1.affiliation.split(',').map(s => s.trim());
  const ext2Affil = app.externalMember2.affiliation.split(',').map(s => s.trim());

  // Date format DD-MM-YYYY
  let displayDate = app.letterDate || '21-07-2025';
  if (app.proposedRpcDate && app.proposedRpcDate.includes('-')) {
    const parts = app.proposedRpcDate.split('-');
    if (parts.length === 3) {
      displayDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  return [
    index + 1,
    displayDate.replace(/\//g, '-'),
    app.scholarName.toUpperCase(),
    app.guideName,
    app.registrationNo,
    app.schoolName,
    'YES',
    app.internalMember.name,
    app.internalMember.designation || 'Associate Professor',
    internalAffil[0] || 'SDSR',
    internalAffil[1] || 'NFSU, Gandhinagar',
    app.externalMember1.name,
    app.externalMember1.designation || 'Associate Professor',
    ext1Affil[0] || '',
    ext1Affil[1] || ext1Affil[0] || '',
    app.externalMember2.name,
    app.externalMember2.designation || 'Professor',
    ext2Affil[0] || '',
    ext2Affil[1] || ext2Affil[0] || '',
    app.status === 'Approved_By_Dean' ? 'Done' : 'In Process'
  ];
}

/**
 * Converts screenshot candidate row into array of values
 */
export function candidateRowToArray(r: ScreenshotCandidateRow): (string | number)[] {
  return [
    r.srNo,
    r.date,
    r.name,
    r.guideName,
    r.enrollmentNo,
    r.nameOfSchool,
    r.rpcLetter,
    r.internalExpertMember,
    r.internalAddress1,
    r.internalAddress2,
    r.internalAddress3,
    r.externalExpertMember1,
    r.external1Address1,
    r.external1Address2,
    r.external1Address3,
    r.externalExpertMember2,
    r.external2Address1,
    r.external2Address2,
    r.external2Address3,
    r.rpc01Status
  ];
}

/**
 * Generates an Excel workbook buffer with the exact university format.
 */
export function buildExcelWorkbook(rows: (string | number)[][]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  // Create worksheet from array of arrays
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column width calculations
  const colWidths = [
    { wch: 6 },  // Sr.No
    { wch: 12 }, // Date
    { wch: 28 }, // Name
    { wch: 24 }, // Guide Name
    { wch: 16 }, // Enrollment No
    { wch: 32 }, // Name of School
    { wch: 10 }, // RPC Letter
    { wch: 24 }, // Internal Expert Member
    { wch: 22 }, // Address 1
    { wch: 26 }, // Address 2
    { wch: 22 }, // Address 3
    { wch: 26 }, // External Expert Member - 1
    { wch: 22 }, // Address 1
    { wch: 28 }, // Address 2
    { wch: 22 }, // Address 3
    { wch: 26 }, // External Expert Member - 2
    { wch: 22 }, // Address 1
    { wch: 28 }, // Address 2
    { wch: 22 }, // Address 3
    { wch: 10 }, // 01 RPC
  ];

  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'RPC Master Register');
  return wb;
}

/**
 * Triggers instant browser download of the Excel register with currently active dockets.
 */
export function exportApplicationsToExcel(applications: RPCApplication[], filename: string = 'NFSU_SDSR_RPC_Master_Register.xlsx'): void {
  const rows: (string | number)[][] = [
    EXCEL_REGISTER_HEADERS,
    ...applications.map((app, idx) => applicationToExcelRow(app, idx))
  ];

  const wb = buildExcelWorkbook(rows);
  XLSX.writeFile(wb, filename);
}

/**
 * Downloads the exact example Excel register matching Screenshots 1 & 2
 * with all 14 candidates.
 */
export function downloadSampleExcelRegister(): void {
  const rows: (string | number)[][] = [
    EXCEL_REGISTER_HEADERS,
    ...SCREENSHOT_CANDIDATE_ROWS.map(r => candidateRowToArray(r))
  ];

  const wb = buildExcelWorkbook(rows);
  XLSX.writeFile(wb, 'Example_RPC_Tracking_Register_NFSU_SDSR.xlsx');
}

/**
 * Downloads a blank Excel template ready for departmental data entry.
 */
export function downloadBlankExcelTemplate(): void {
  const rows: (string | number)[][] = [
    EXCEL_REGISTER_HEADERS,
    [
      1,
      '21-07-2025',
      'CANDIDATE FULL NAME',
      'Dr. Guide Name',
      '240112006001',
      'School of Forensic Science',
      'YES',
      'Dr. Internal Member',
      'Associate Professor',
      'School / Department',
      'NFSU, Gandhinagar',
      'Dr. External Member 1',
      'Professor',
      'Department / Institute',
      'City, State',
      'Dr. External Member 2',
      'Professor',
      'Department / Institute',
      'City, State',
      'Done'
    ]
  ];

  const wb = buildExcelWorkbook(rows);
  XLSX.writeFile(wb, 'Template_RPC_Data_Entry_Format.xlsx');
}

/**
 * Reads and parses an uploaded Excel spreadsheet (.xlsx / .xls)
 * and returns candidate rows.
 */
export async function parseExcelUpload(file: File): Promise<ScreenshotCandidateRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawJson: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (rawJson.length <= 1) {
          resolve([]);
          return;
        }

        // Find header row or assume row 0
        const dataRows = rawJson.slice(1);
        const candidates: ScreenshotCandidateRow[] = dataRows
          .filter(row => row && row[2] && String(row[2]).trim() !== '')
          .map((row, idx) => ({
            srNo: Number(row[0]) || idx + 1,
            date: String(row[1] || '21-07-2025').trim(),
            name: String(row[2] || '').trim(),
            guideName: String(row[3] || '').trim(),
            enrollmentNo: String(row[4] || `2401120060${String(idx + 1).padStart(2, '0')}`).trim(),
            nameOfSchool: String(row[5] || 'School of Forensic Science').trim(),
            rpcLetter: String(row[6] || 'YES').trim(),
            internalExpertMember: String(row[7] || '').trim(),
            internalAddress1: String(row[8] || '').trim(),
            internalAddress2: String(row[9] || '').trim(),
            internalAddress3: String(row[10] || '').trim(),
            externalExpertMember1: String(row[11] || '').trim(),
            external1Address1: String(row[12] || '').trim(),
            external1Address2: String(row[13] || '').trim(),
            external1Address3: String(row[14] || '').trim(),
            externalExpertMember2: String(row[15] || '').trim(),
            external2Address1: String(row[16] || '').trim(),
            external2Address2: String(row[17] || '').trim(),
            external2Address3: String(row[18] || '').trim(),
            rpc01Status: String(row[19] || 'Done').trim(),
          }));

        resolve(candidates);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
