export type RPCMode = 'Online' | 'Offline' | 'Hybrid';
export type ScholarType = 'Full Time' | 'Part Time';
export type UserRole = 'DEAN' | 'STAFF';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  avatarInitials: string;
  lastLoginTimestamp: string;
}

export type ApplicationStatus =
  | 'Draft'
  | 'SDSR_Audit'
  | 'Submitted_To_Dean'
  | 'Approved_By_Dean'
  | 'Clarification_Requested'
  | 'Official_Notice_Issued';

export interface RPCMemberDetails {
  name: string;
  designation: string;
  affiliation: string;
  email: string;
  contactNo: string;
  roleDescription?: string;
}

export interface FeeSemesterRecord {
  id: string;
  semesterName: string; // e.g. "Year I / Sem I", "Sem II", "Sem III"
  amount: number;
  paymentDate: string; // YYYY-MM-DD or DD/MM/YYYY
  receiptNo: string;
  isVerified: boolean;
}

export interface EnclosureChecklist {
  registrationCertificate: boolean;
  rpcMemberApprovedLetter: boolean;
  feesReceiptsAllSemester: boolean;
  attendanceReportSigned: boolean; // For full-time scholars
  previousRpcReport: boolean; // N/A if 1st RPC
}

export interface RegulatoryAuditResult {
  timeGapDays: number;
  timeGapMonths: number;
  timeGapStatus: 'COMPLIANT' | 'FLAGGED_PREMATURE' | 'FLAGGED_DELAYED' | 'FIRST_RPC_VALID';
  timeGapRemarks: string;
  feesStatus: 'CLEARED' | 'PENDING_SEMESTER' | 'AUDIT_REQUIRED';
  feesRemarks: string;
  enclosuresStatus: 'ALL_VERIFIED' | 'INCOMPLETE';
  enclosuresRemarks: string;
  overallStatus: 'APPROVED_FOR_DEAN' | 'NEEDS_RECTIFICATION' | 'IN_SCRUTINY';
  scrutinyOfficerName: string;
  scrutinyDate: string;
}

export interface DeanDigitalApproval {
  isApproved: boolean;
  deanName: string;
  deanEmail: string;
  approvalTimestamp: string;
  digitalCertificateId: string;
  verificationHash: string;
  digitalSignType: 'CRYPTOGRAPHIC_TOKEN' | 'E_SIGNATURE_CANVAS' | 'OFFICIAL_DIGITAL_SEAL' | 'DIRECT_EMAIL_APPROVAL';
  signatureDataUrl?: string;
  deanRemarks?: string;
}

export interface RPCApplication {
  id: string;
  refNo: string; // e.g. "NFSU/SDSR/RPC/042/25"
  letterDate: string; // e.g. "10/06/2025"
  
  // 1. Name of Guide
  guideName: string;
  guideDesignation: string;
  guideSchool: string; // e.g. "School of Pharmacy (SPH)"
  guideUniversity: string; // e.g. "National Forensic Sciences University (NFSU), Gandhinagar"
  guideEmail: string;
  guidePhone: string;

  // 2. Name of Scholar
  scholarName: string;
  scholarGenderTitle: 'Mr.' | 'Ms.' | 'Mx.';
  scholarType: ScholarType;
  researchTopic?: string;

  // 3. Ph.D. Registration No.
  registrationNo: string; // e.g. "Ph.D/SDSR/SPH/042/22"

  // 4. Ph.D. Registration Date
  registrationDate: string; // e.g. "15/09/2022"

  // 5. Date and No. of Last RPC
  lastRpcDate?: string; // empty if 1st RPC
  lastRpcNumber?: number; // 0 if 1st RPC

  // 6. Date of proposed RPC
  proposedRpcDate: string; // e.g. "2025-06-10"

  // 7. No. of current RPC to be held
  currentRpcNumber: number; // 1, 2, 3, 4, 5, 6, etc.
  currentRpcOrdinal: string; // "1st", "2nd", "3rd", etc.

  // 8. Time of RPC
  rpcTime: string; // e.g. "12:00 Noon onwards" or "11:30 am onwards"

  // 9. Mode (Online/Offline/Hybrid)
  mode: RPCMode;
  meetingVenueOrLink: string; // e.g. "Online (Google Meet link will be shared by Guide)" or "Conference Hall, SDSR"

  // Recipient 1: Dean of the specific school
  schoolDeanTitle: string; // e.g. "Dean"
  schoolName: string; // e.g. "School of Pharmacy"
  schoolCampus: string; // e.g. "NFSU, Gandhinagar"

  // 10. External RPC Member 1
  externalMember1: RPCMemberDetails;

  // 11. External RPC Member 2
  externalMember2: RPCMemberDetails;

  // 12. Internal RPC Member
  internalMember: RPCMemberDetails;

  // 13. Fees Details (SEM Wise)
  feeDetails: FeeSemesterRecord[];

  // List of Enclosures
  enclosures: EnclosureChecklist;

  // Administrative Audit & Scrutiny
  complianceAudit: RegulatoryAuditResult;

  // Dean SDSR digital sign workflow
  deanApproval?: DeanDigitalApproval;

  // Direct Email Approval Tracking
  emailApprovalToken?: string;
  emailDispatchedAt?: string;
  emailDispatchedTo?: string;

  // Status & Timeline Tracking
  status: ApplicationStatus;
  statusHistory: Array<{
    status: ApplicationStatus;
    timestamp: string;
    actor: string;
    remarks: string;
  }>;

  createdAt: string;
  updatedAt: string;
}
