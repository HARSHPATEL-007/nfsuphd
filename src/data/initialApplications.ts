import { RPCApplication } from '../types';
import { performFullAudit } from '../utils/complianceEngine';

export const INITIAL_APPLICATIONS: RPCApplication[] = [
  {
    id: 'rpc-app-001',
    refNo: 'NFSU/SDSR/RPC/042/25',
    letterDate: '10/06/2025',
    guideName: 'Prof. (Dr.) Manjunath Ghate',
    guideDesignation: 'Professor, SPH',
    guideSchool: 'School of Pharmacy',
    guideUniversity: 'National Forensic Sciences University (NFSU), Gandhinagar',
    guideEmail: 'manjunath.ghate@nfsu.ac.in',
    guidePhone: '+91 98250 12345',
    scholarName: 'Ms. Devanshi Lunagariya',
    scholarGenderTitle: 'Ms.',
    scholarType: 'Full Time',
    researchTopic: 'Formulation and Evaluation of Novel Targeted Drug Delivery Systems for Neurodegenerative Disorders',
    registrationNo: 'Ph.D/SDSR/SPH/019/2023',
    registrationDate: '2023-09-15',
    lastRpcDate: undefined,
    lastRpcNumber: 0,
    proposedRpcDate: '2025-06-10',
    currentRpcNumber: 1,
    currentRpcOrdinal: '1st',
    rpcTime: '12:00 Noon onwards',
    mode: 'Online',
    meetingVenueOrLink: 'Online (Google Meet link: https://meet.google.com/sph-rpc-devanshi)',
    schoolDeanTitle: 'Dean',
    schoolName: 'School of Pharmacy',
    schoolCampus: 'NFSU, Gandhinagar',
    externalMember1: {
      name: 'Dr. Dhiraj Bhatia',
      designation: 'Associate Professor & INYAS-INSA Member',
      affiliation: 'Department of Biological Science and Engineering, Indian Institute of Technology Gandhinagar, Gujarat',
      email: 'dhiraj.bhatia@iitgn.ac.in',
      contactNo: '+91 79 2395 2500',
      roleDescription: 'External Expert Member - 1'
    },
    externalMember2: {
      name: 'Dr. Prakash Jha',
      designation: 'Professor & Dean',
      affiliation: 'School of Applied Material Science, Central University of Gujarat',
      email: 'prakash.jha@cug.ac.in',
      contactNo: '+91 79 2975 0280',
      roleDescription: 'External Expert Member - 2'
    },
    internalMember: {
      name: 'Dr. Bhoomika Patel',
      designation: 'Dean (I/C), SPH',
      affiliation: 'NFSU, Gandhinagar',
      email: 'bhoomika.patel@nfsu.ac.in',
      contactNo: '+91 79 2397 7144',
      roleDescription: 'Internal Expert Member'
    },
    feeDetails: [
      {
        id: 'fee-1',
        semesterName: 'Year I / Sem I',
        amount: 25000,
        paymentDate: '2023-09-20',
        receiptNo: 'NFSU/REC/2023/8921',
        isVerified: true
      },
      {
        id: 'fee-2',
        semesterName: 'Sem II',
        amount: 25000,
        paymentDate: '2024-03-15',
        receiptNo: 'NFSU/REC/2024/1142',
        isVerified: true
      }
    ],
    enclosures: {
      registrationCertificate: true,
      rpcMemberApprovedLetter: true,
      feesReceiptsAllSemester: true,
      attendanceReportSigned: true,
      previousRpcReport: true
    },
    complianceAudit: performFullAudit(
      1,
      '2025-06-10',
      undefined,
      '2023-09-15',
      'Full Time',
      [
        {
          id: 'fee-1',
          semesterName: 'Year I / Sem I',
          amount: 25000,
          paymentDate: '2023-09-20',
          receiptNo: 'NFSU/REC/2023/8921',
          isVerified: true
        }
      ],
      {
        registrationCertificate: true,
        rpcMemberApprovedLetter: true,
        feesReceiptsAllSemester: true,
        attendanceReportSigned: true,
        previousRpcReport: true
      }
    ),
    status: 'Approved_By_Dean',
    statusHistory: [
      {
        status: 'Draft',
        timestamp: '2025-06-05T10:30:00Z',
        actor: 'Dr. Prajesh Prajapati / Dept Coordinator',
        remarks: 'RPC application initiated with committee details and fee receipts.'
      },
      {
        status: 'SDSR_Audit',
        timestamp: '2025-06-06T14:15:00Z',
        actor: 'SDSR Administrative Scrutiny Desk',
        remarks: 'Verified coursework completion, fee receipts, and approved committee constitution.'
      },
      {
        status: 'Submitted_To_Dean',
        timestamp: '2025-06-08T11:00:00Z',
        actor: 'SDSR Office',
        remarks: 'Docket submitted for Dean SDSR digital authorization.'
      },
      {
        status: 'Approved_By_Dean',
        timestamp: '2025-06-09T16:45:20Z',
        actor: 'Dean, School of Doctoral Studies and Research',
        remarks: 'Digitally signed and approved. Official notice generated for dispatch.'
      }
    ],
    deanApproval: {
      isApproved: true,
      deanName: 'Prof. (Dr.) S. O. Junare',
      deanEmail: 'hvipatel007@gmail.com',
      approvalTimestamp: '2025-06-09T16:45:20Z',
      digitalCertificateId: 'NFSU-SDSR-DS-2025-0428A',
      verificationHash: 'SHA256:7B8F218E940A7C12DF34889CB19460E35',
      digitalSignType: 'CRYPTOGRAPHIC_TOKEN',
      deanRemarks: 'Approved as recommended by SDSR scrutiny. Please dispatch official letter to all committee members and School Dean.'
    },
    createdAt: '2025-06-05T10:30:00Z',
    updatedAt: '2025-06-09T16:45:20Z'
  },
  {
    id: 'rpc-app-002',
    refNo: 'NFSU/SDSR/RPC/058/25',
    letterDate: '15/06/2025',
    guideName: 'Dr. Prajesh Prajapati',
    guideDesignation: 'Associate Professor',
    guideSchool: 'School of Doctoral Studies & Research (SDSR)',
    guideUniversity: 'NFSU, Gandhinagar',
    guideEmail: 'prajesh.prajapati@nfsu.ac.in',
    guidePhone: '+91 94280 87654',
    scholarName: 'Mr. Aarav Sharma',
    scholarGenderTitle: 'Mr.',
    scholarType: 'Full Time',
    researchTopic: 'AI-assisted Digital Forensics and Evidence Integrity Verification in Cloud Storage Infrastructures',
    registrationNo: 'Ph.D/SDSR/FS/031/22',
    registrationDate: '2022-08-22',
    lastRpcDate: '2024-12-05',
    lastRpcNumber: 2,
    proposedRpcDate: '2025-06-18',
    currentRpcNumber: 3,
    currentRpcOrdinal: '3rd',
    rpcTime: '11:30 am onwards',
    mode: 'Hybrid',
    meetingVenueOrLink: 'Board Room, 2nd Floor, SDSR Building, NFSU Gandhinagar & Zoom Conference',
    schoolDeanTitle: 'Dean',
    schoolName: 'School of Forensic Science',
    schoolCampus: 'NFSU, Gandhinagar',
    externalMember1: {
      name: 'Prof. (Dr.) A. K. Saxena',
      designation: 'Professor & Head',
      affiliation: 'Department of Computer Science & Engineering, IIT Delhi',
      email: 'aksaxena@cse.iitd.ac.in',
      contactNo: '+91 11 2659 1234',
      roleDescription: 'External Expert Member - 1'
    },
    externalMember2: {
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Scientist-G & Division Head',
      affiliation: 'Forensic Electronics Division, CFSL Hyderabad',
      email: 'm.sundaram@cfsl.gov.in',
      contactNo: '+91 40 2703 8912',
      roleDescription: 'External Expert Member - 2'
    },
    internalMember: {
      name: 'Dr. Naveen Kumar',
      designation: 'Associate Professor',
      affiliation: 'School of Cyber Security and Digital Forensics, NFSU',
      email: 'naveen.kumar@nfsu.ac.in',
      contactNo: '+91 79 2397 7180',
      roleDescription: 'Internal Expert Member'
    },
    feeDetails: [
      {
        id: 'f-1',
        semesterName: 'Year I / Sem I',
        amount: 25000,
        paymentDate: '2022-08-28',
        receiptNo: 'REC/22/1234',
        isVerified: true
      },
      {
        id: 'f-2',
        semesterName: 'Sem II',
        amount: 25000,
        paymentDate: '2023-02-14',
        receiptNo: 'REC/23/1254',
        isVerified: true
      },
      {
        id: 'f-3',
        semesterName: 'Sem III',
        amount: 25000,
        paymentDate: '2023-08-20',
        receiptNo: 'REC/23/5638',
        isVerified: true
      }
    ],
    enclosures: {
      registrationCertificate: true,
      rpcMemberApprovedLetter: true,
      feesReceiptsAllSemester: true,
      attendanceReportSigned: true,
      previousRpcReport: true
    },
    complianceAudit: performFullAudit(
      3,
      '2025-06-18',
      '2024-12-05',
      '2022-08-22',
      'Full Time',
      [
        {
          id: 'f-1',
          semesterName: 'Year I / Sem I',
          amount: 25000,
          paymentDate: '2022-08-28',
          receiptNo: 'REC/22/1234',
          isVerified: true
        },
        {
          id: 'f-2',
          semesterName: 'Sem II',
          amount: 25000,
          paymentDate: '2023-02-14',
          receiptNo: 'REC/23/1254',
          isVerified: true
        },
        {
          id: 'f-3',
          semesterName: 'Sem III',
          amount: 25000,
          paymentDate: '2023-08-20',
          receiptNo: 'REC/23/5638',
          isVerified: true
        }
      ],
      {
        registrationCertificate: true,
        rpcMemberApprovedLetter: true,
        feesReceiptsAllSemester: true,
        attendanceReportSigned: true,
        previousRpcReport: true
      }
    ),
    status: 'Submitted_To_Dean',
    statusHistory: [
      {
        status: 'Draft',
        timestamp: '2025-06-10T09:00:00Z',
        actor: 'Dr. Prajesh Prajapati',
        remarks: 'Submitted RPC 3 details.'
      },
      {
        status: 'SDSR_Audit',
        timestamp: '2025-06-11T15:20:00Z',
        actor: 'SDSR Scrutiny Section',
        remarks: 'Time gap (195 days) and 3 semesters fees verified.'
      },
      {
        status: 'Submitted_To_Dean',
        timestamp: '2025-06-12T11:45:00Z',
        actor: 'SDSR Administration Officer',
        remarks: 'Dispatched to Dean SDSR email (hvipatel007@gmail.com) for digital signature.'
      }
    ],
    createdAt: '2025-06-10T09:00:00Z',
    updatedAt: '2025-06-12T11:45:00Z'
  }
];
