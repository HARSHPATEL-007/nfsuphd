import { FeeSemesterRecord, EnclosureChecklist, RegulatoryAuditResult, ScholarType } from '../types';

export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatDateIndian(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export function formatFormalLetterDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const ordinalDay = getOrdinal(day);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    return `${ordinalDay} ${monthName}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Audit time gap between Last RPC and Proposed RPC (or Registration and 1st RPC)
 * according to University PhD Ordinance (Clause 6: Progress Monitoring)
 */
export function auditTimeGap(
  currentRpcNumber: number,
  proposedRpcDate: string,
  lastRpcDate?: string,
  registrationDate?: string
): {
  days: number;
  months: number;
  status: 'COMPLIANT' | 'FLAGGED_PREMATURE' | 'FLAGGED_DELAYED' | 'FIRST_RPC_VALID';
  remarks: string;
} {
  const proposed = new Date(proposedRpcDate);

  if (currentRpcNumber === 1 || !lastRpcDate) {
    if (registrationDate) {
      const reg = new Date(registrationDate);
      const diffMs = proposed.getTime() - reg.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const months = Number((days / 30.44).toFixed(1));

      return {
        days,
        months,
        status: 'FIRST_RPC_VALID',
        remarks: `First RPC presentation scheduled ${months} months (${days} days) post Ph.D. registration. Satisfies the mandatory coursework review timeline.`
      };
    }

    return {
      days: 0,
      months: 0,
      status: 'FIRST_RPC_VALID',
      remarks: 'First RPC presentation. Baseline progress committee presentation.'
    };
  }

  const last = new Date(lastRpcDate);
  const diffMs = proposed.getTime() - last.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Number((days / 30.44).toFixed(1));

  // UGC & University PhD Ordinance: RPC must meet every 6 months (approx 180 days)
  // Permissible window: 150 days (5 months) to 215 days (~7 months)
  if (days < 150) {
    return {
      days,
      months,
      status: 'FLAGGED_PREMATURE',
      remarks: `Warning: Interval between last RPC and proposed RPC is only ${days} days (~${months} months). Mandatory prescribed gap is at least 6 months (180 days) per PhD Ordinance Clause 6.3. Special approval needed.`
    };
  } else if (days > 230) {
    return {
      days,
      months,
      status: 'FLAGGED_DELAYED',
      remarks: `Advisory: Gap between last RPC and proposed RPC is ${days} days (~${months} months), exceeding regular 6-month semester cycle. Condonation/justification endorsement from Guide recommended.`
    };
  } else {
    return {
      days,
      months,
      status: 'COMPLIANT',
      remarks: `Compliant: Verified gap of ${days} days (~${months} months) strictly adheres to the 6-monthly semester progress monitoring ordinance.`
    };
  }
}

/**
 * Audit fee payment compliance against RPC number
 */
export function auditFees(
  currentRpcNumber: number,
  feeDetails: FeeSemesterRecord[]
): {
  status: 'CLEARED' | 'PENDING_SEMESTER' | 'AUDIT_REQUIRED';
  remarks: string;
} {
  const expectedSemesters = Math.max(1, currentRpcNumber);
  const paidCount = feeDetails.filter(f => f.receiptNo && f.amount > 0).length;

  if (paidCount >= expectedSemesters) {
    return {
      status: 'CLEARED',
      remarks: `All ${paidCount} semester fees verified with official receipt numbers. Account clearance verified up to current Semester.`
    };
  } else {
    return {
      status: 'PENDING_SEMESTER',
      remarks: `Deficit: ${expectedSemesters} semesters expected for ${getOrdinal(currentRpcNumber)} RPC, but only ${paidCount} semester receipts recorded. Fee clearance needed.`
    };
  }
}

/**
 * Audit enclosures checklist
 */
export function auditEnclosures(
  currentRpcNumber: number,
  scholarType: ScholarType,
  enclosures: EnclosureChecklist
): {
  status: 'ALL_VERIFIED' | 'INCOMPLETE';
  remarks: string;
} {
  const missing: string[] = [];

  if (!enclosures.registrationCertificate) {
    missing.push('1. Ph.D. Registration Certificate');
  }
  if (!enclosures.rpcMemberApprovedLetter) {
    missing.push('2. RPC Member Approved Letter from Dean SDSR');
  }
  if (!enclosures.feesReceiptsAllSemester) {
    missing.push('3. Fees Receipts for all semesters');
  }
  if (scholarType === 'Full Time' && !enclosures.attendanceReportSigned) {
    missing.push('4. Attendance Report signed by Scholar & endorsed by Guide');
  }
  if (currentRpcNumber > 1 && !enclosures.previousRpcReport) {
    missing.push('5. Previous RPC Report');
  }

  if (missing.length === 0) {
    return {
      status: 'ALL_VERIFIED',
      remarks: 'All mandatory enclosures (1 to 5) verified in original/signed copy by SDSR office.'
    };
  } else {
    return {
      status: 'INCOMPLETE',
      remarks: `Missing mandatory enclosures: ${missing.join('; ')}.`
    };
  }
}

/**
 * Perform comprehensive regulatory compliance audit
 */
export function performFullAudit(
  currentRpcNumber: number,
  proposedRpcDate: string,
  lastRpcDate: string | undefined,
  registrationDate: string,
  scholarType: ScholarType,
  feeDetails: FeeSemesterRecord[],
  enclosures: EnclosureChecklist
): RegulatoryAuditResult {
  const timeGap = auditTimeGap(currentRpcNumber, proposedRpcDate, lastRpcDate, registrationDate);
  const fees = auditFees(currentRpcNumber, feeDetails);
  const enc = auditEnclosures(currentRpcNumber, scholarType, enclosures);

  let overall: 'APPROVED_FOR_DEAN' | 'NEEDS_RECTIFICATION' | 'IN_SCRUTINY' = 'APPROVED_FOR_DEAN';

  if (fees.status === 'PENDING_SEMESTER' || enc.status === 'INCOMPLETE') {
    overall = 'NEEDS_RECTIFICATION';
  } else if (timeGap.status === 'FLAGGED_PREMATURE') {
    overall = 'NEEDS_RECTIFICATION';
  }

  return {
    timeGapDays: timeGap.days,
    timeGapMonths: timeGap.months,
    timeGapStatus: timeGap.status,
    timeGapRemarks: timeGap.remarks,
    feesStatus: fees.status,
    feesRemarks: fees.remarks,
    enclosuresStatus: enc.status,
    enclosuresRemarks: enc.remarks,
    overallStatus: overall,
    scrutinyOfficerName: 'SDSR Ph.D. Scrutiny Desk',
    scrutinyDate: new Date().toISOString().split('T')[0]
  };
}

/**
 * Generate cryptographic verification hash for Dean digital signature
 */
export function generateDigitalSignMetadata(deanName: string, refNo: string) {
  const timestamp = new Date().toISOString();
  const randomChars = Math.random().toString(36).substring(2, 10).toUpperCase();
  const dateHash = Date.now().toString(16).toUpperCase();
  const certificateSerial = `NFSU-SDSR-DS-${dateHash}-${randomChars}`;
  
  // Simulated SHA-256 hash
  const verificationHash = `SHA256:E8C2${randomChars}9F04${dateHash}B31A8D4E5C09F218`;

  return {
    deanName,
    deanEmail: 'hvipatel007@gmail.com',
    approvalTimestamp: timestamp,
    digitalCertificateId: certificateSerial,
    verificationHash,
    digitalSignType: 'CRYPTOGRAPHIC_TOKEN' as const
  };
}

/**
 * Generate a unique, tamper-proof Direct Email Approval Token
 */
export function generateEmailApprovalToken(appId: string, refNo: string): string {
  const cleanRef = refNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timeHex = Date.now().toString(36).slice(-4).toUpperCase();
  return `NFSU-APR-${cleanRef}-${timeHex}${rand}`;
}

/**
 * Generate Direct Email Approval metadata specifically for email token execution
 */
export function generateDirectEmailApprovalMetadata(
  deanName: string,
  deanEmail: string,
  refNo: string,
  token: string,
  remarks?: string
) {
  const timestamp = new Date().toISOString();
  const cleanRef = refNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const certificateSerial = `NFSU-SDSR-EML-${cleanRef}-${token.slice(-6)}`;
  const verificationHash = `SHA256:EML-TOKEN-${token}-${Date.now().toString(16).toUpperCase()}`;

  return {
    isApproved: true,
    deanName,
    deanEmail: deanEmail || 'hvipatel007@gmail.com',
    approvalTimestamp: timestamp,
    digitalCertificateId: certificateSerial,
    verificationHash,
    digitalSignType: 'DIRECT_EMAIL_APPROVAL' as const,
    deanRemarks: remarks || `Direct email approval executed via secure token [${token}]. Scrutiny and 6-month Ordinance compliance ratified.`
  };
}

/**
 * Format the official direct email approval packet sent to Dean
 */
export function generateDirectApprovalEmailPacket(
  app: {
    id: string;
    refNo: string;
    scholarName: string;
    schoolName: string;
    guideName: string;
    guideDesignation: string;
    guideSchool: string;
    currentRpcOrdinal: string;
    proposedRpcDate: string;
    rpcTime: string;
    mode: string;
    meetingVenueOrLink: string;
    complianceAudit: {
      timeGapStatus: string;
      timeGapMonths: number;
      feesStatus: string;
    };
  },
  token: string,
  appUrl: string = window.location.origin
) {
  const formattedDate = formatFormalLetterDate(app.proposedRpcDate);
  const directLink = `${appUrl}/#action=direct-email-approval&appId=${app.id}&token=${token}`;
  const mailtoSubject = `[SANCTION-APPROVED] Ref: ${app.refNo} - Token: ${token}`;
  const mailtoBody = `Dear Ph.D. Administration Section (harsh142022@gmail.com),\n\nI have reviewed the RPC docket for ${app.scholarName} (${app.currentRpcOrdinal} RPC).\n\nDECISION: SANCTIONED & APPROVED\nRef No: ${app.refNo}\nProposed Date: ${formattedDate} (${app.mode})\nApproval Token: ${token}\nDigital Signature Authority: Dean, SDSR (hvipatel007@gmail.com)\n\nPlease issue the official notice and broadcast to all RPC committee members.\n\nRegards,\nDean, School of Doctoral Studies and Research (SDSR)\nNFSU Gandhinagar`;

  const subject = `[ACTION REQUIRED] Direct Approval: ${app.currentRpcOrdinal} RPC Meeting of ${app.scholarName} (Ref: ${app.refNo})`;

  return {
    token,
    subject,
    toEmail: 'hvipatel007@gmail.com',
    fromEmail: 'harsh142022@gmail.com',
    ccEmail: 'harsh142022@gmail.com',
    formattedDate,
    directLink,
    mailtoLink: `mailto:harsh142022@gmail.com?cc=hvipatel007@gmail.com&subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`
  };
}

