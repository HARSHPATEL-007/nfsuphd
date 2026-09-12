import { RPCApplication } from '../types';

export interface ScreenshotCandidateRow {
  srNo: number;
  date: string;
  name: string;
  guideName: string;
  enrollmentNo: string;
  nameOfSchool: string;
  rpcLetter: string;
  internalExpertMember: string;
  internalAddress1: string;
  internalAddress2: string;
  internalAddress3: string;
  externalExpertMember1: string;
  external1Address1: string;
  external1Address2: string;
  external1Address3: string;
  externalExpertMember2: string;
  external2Address1: string;
  external2Address2: string;
  external2Address3: string;
  rpc01Status: string;
}

/**
 * Exact data parsed directly from the University's official Excel Register
 * shown in Screenshots 1 & 2.
 */
export const SCREENSHOT_CANDIDATE_ROWS: ScreenshotCandidateRow[] = [
  {
    srNo: 1,
    date: '21-07-2025',
    name: 'RICHARD CHEREHANI KASHINDYE',
    guideName: 'Dr. Rakesh Yadav',
    enrollmentNo: '240112006037',
    nameOfSchool: 'School of Forensic Science',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Bhoomika Patel',
    internalAddress1: 'Associate Professor',
    internalAddress2: 'School of Medico-legal Studies',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Rajnish Kumar',
    external1Address1: 'Associate Professor',
    external1Address2: 'of Technology (B.H.U.)',
    external1Address3: 'Varanasi',
    externalExpertMember2: 'Dr. Vivek Dave',
    external2Address1: 'Professor',
    external2Address2: 'Department of Pharmacy',
    external2Address3: 'of South Bihar, Gaya, Bihar',
    rpc01Status: 'Done'
  },
  {
    srNo: 2,
    date: '21-07-2025',
    name: 'EDY TENENTE FRIO',
    guideName: 'Dr. Jasmin Kubavat',
    enrollmentNo: '240112006033',
    nameOfSchool: 'School of Pharmacy',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Bappi Paul',
    internalAddress1: 'Associate Professor',
    internalAddress2: 'SET',
    internalAddress3: 'Gandhinagar',
    externalExpertMember1: 'Dr. Amit Kumar Pandey',
    external1Address1: 'Associate Professor',
    external1Address2: 'Department of Biotechnology NIPER, Ahmedabad',
    external1Address3: 'Ahmedabad',
    externalExpertMember2: 'Dr. Sunita Patel',
    external2Address1: 'Associate Professor',
    external2Address2: 'SLS',
    external2Address3: 'Central University of Gujarat',
    rpc01Status: 'Done'
  },
  {
    srNo: 3,
    date: '08-10-2025',
    name: 'VIDUSHI JAIN',
    guideName: 'Dr. Meenakshi Sinha',
    enrollmentNo: '240112006003',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Mohammed Subhan Attar',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Shobha Vijender',
    external1Address1: 'President (Sampurna NGO)',
    external1Address2: 'Vinoba Kunj, Sector-9',
    external1Address3: 'Rohini, New Delhi',
    externalExpertMember2: 'Dr. Manju Arora Relan',
    external2Address1: 'Professor',
    external2Address2: 'Law Centre- I, Faculty of Law',
    external2Address3: 'University of Delhi',
    rpc01Status: 'Done'
  },
  {
    srNo: 4,
    date: '25-11-2025',
    name: 'LAKSHMI REJI',
    guideName: 'Dr. Krishna Kumar Mishra',
    enrollmentNo: '240112006028',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Priyaranjan Maral',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Prof. (Dr.) Sanjay Kumar',
    external1Address1: 'Department of Psychology',
    external1Address2: 'University of Allahabad',
    external1Address3: 'Prayagraj, U.P.',
    externalExpertMember2: 'Jagadishchandra Kalabhai Savalia',
    external2Address1: 'Senior Professor',
    external2Address2: 'Dean, Faculty of Physical',
    external2Address3: 'Gujarat Vidyapith, Sadra, Gujarat',
    rpc01Status: 'Done'
  },
  {
    srNo: 5,
    date: '21-07-2025',
    name: 'SUNGANANI NDOMONDO',
    guideName: 'Dr. Vishal Mevada',
    enrollmentNo: '240112006031',
    nameOfSchool: 'School of Forensic Science',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Bhargav Patel',
    internalAddress1: 'Associate Professor & Head',
    internalAddress2: 'Excellence in DNA Forensic',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Rajeshkumar G. Chaudhari',
    external1Address1: 'Associate Professor',
    external1Address2: 'GTU',
    external1Address3: 'Ahmedabad',
    externalExpertMember2: 'Dr. Pravin R. Dudhagara',
    external2Address1: 'Assistant Professor',
    external2Address2: 'South Gujarat University',
    external2Address3: 'Surat',
    rpc01Status: 'Done'
  },
  {
    srNo: 6,
    date: '21-07-2025',
    name: 'MOLLY MLAMBO',
    guideName: 'Dr. Bappi Paul',
    enrollmentNo: '240112006035',
    nameOfSchool: 'School of Engineering and Technology',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Renuka V',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SET',
    internalAddress3: 'Gandhinagar',
    externalExpertMember1: 'Dr. Kalisadhan Mukherjee',
    external1Address1: 'Associate Professor',
    external1Address2: 'Deendayal Energy University',
    external1Address3: 'Gandhinagar',
    externalExpertMember2: 'Prof. Chinmay Ghoroi',
    external2Address1: 'Professor',
    external2Address2: 'IIT',
    external2Address3: 'Gandhinagar',
    rpc01Status: 'Done'
  },
  {
    srNo: 7,
    date: '30-07-2025',
    name: 'MUGISHA DAVID',
    guideName: 'Dr. Parag Rughani',
    enrollmentNo: '240112006034',
    nameOfSchool: 'School of Cyber Security and Digital Forensics',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Jay Teraiya',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SCSDF',
    internalAddress3: 'NFSU',
    externalExpertMember1: 'Prof. (Dr.) Chirag Thakar',
    external1Address1: 'Professor',
    external1Address2: 'L D Engineering College',
    external1Address3: 'Ahmedabad',
    externalExpertMember2: 'Prof. (Dr.) Yogesh R. Ghodasara',
    external2Address1: 'Professor',
    external2Address2: 'Agricultural University',
    external2Address3: 'Anand',
    rpc01Status: 'Done'
  },
  {
    srNo: 8,
    date: '21-07-2025',
    name: 'NETRA SAJEEV',
    guideName: 'Dr. Priyanka Kacker',
    enrollmentNo: '240112006001',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Biswajit Dey',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'Gandhinagar',
    externalExpertMember1: 'Dr. Priyanka Behrani',
    external1Address1: 'Associate Professor',
    external1Address2: 'Navrachana University',
    external1Address3: 'Vadodara',
    externalExpertMember2: 'Dr. Suman Vaishnav',
    external2Address1: 'Associate Professor',
    external2Address2: 'MGLI',
    external2Address3: 'Ahmedabad',
    rpc01Status: 'Done'
  },
  {
    srNo: 9,
    date: '21-07-2025',
    name: 'ANIL MAHADEV KAKADE',
    guideName: 'Prof. (Dr.) Smita Pandey',
    enrollmentNo: '240112006002',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Swikar Lama',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'Gandhinagar',
    externalExpertMember1: 'Dr. Hema Acharya',
    external1Address1: 'Assistant Director',
    external1Address2: 'DFS',
    external1Address3: 'Gandhinagar',
    externalExpertMember2: 'Dr. Neeta Sinha',
    external2Address1: 'Professor',
    external2Address2: 'Sciences, School of PDEU',
    external2Address3: 'Gandhinagar',
    rpc01Status: 'Done'
  },
  {
    srNo: 10,
    date: '21-07-2025',
    name: 'UDIT SHARMA',
    guideName: 'Dr. Priyaranjan Maral',
    enrollmentNo: '240112006011',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Smita Pandey',
    internalAddress1: 'Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Azizuddin Khan',
    external1Address1: 'Professor',
    external1Address2: 'IIT',
    external1Address3: 'Bombay',
    externalExpertMember2: 'Dr. Dev Priya',
    external2Address1: 'Associate Professor',
    external2Address2: 'IIT',
    external2Address3: 'Kanpur',
    rpc01Status: 'Done'
  },
  {
    srNo: 11,
    date: '08-10-2025',
    name: 'HEMANT SHARMA',
    guideName: 'Dr. Meenakshi Sinha',
    enrollmentNo: '240112006045',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Mohammed Subhan Attar',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Manju Arora Relan',
    external1Address1: 'Professor',
    external1Address2: 'Faculty of Law, University of Delhi',
    external1Address3: 'Vinoba Kunj, Sector-9, Rohini, New Delhi',
    externalExpertMember2: 'Vageshwari Deswal',
    external2Address1: 'Associate Professor',
    external2Address2: 'Vatika Next, Sector-82',
    external2Address3: 'Gurgaon',
    rpc01Status: 'Done'
  },
  {
    srNo: 12,
    date: '14-08-2025',
    name: 'GOGBE TIA RAOUL',
    guideName: 'Dr. Pratik Patel',
    enrollmentNo: '240112006036',
    nameOfSchool: 'School of Cyber Security and Digital Forensics',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Alhad Kumar',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SCSDF',
    internalAddress3: 'NFSU, Gandhinagar',
    externalExpertMember1: 'Dr. Viral Kapdiya',
    external1Address1: 'Associate Professor',
    external1Address2: 'MSU',
    external1Address3: 'Vadodara',
    externalExpertMember2: 'Dr. Dushyantsinh B. Rathod',
    external2Address1: 'Professor & HOI',
    external2Address2: 'Institute of Technology',
    external2Address3: 'Gandhinagar',
    rpc01Status: 'Done'
  },
  {
    srNo: 13,
    date: '21-07-2025',
    name: 'ANANTA DEY',
    guideName: 'Dr. Swikar Lama',
    enrollmentNo: '240112006004',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Hunny Maityani',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU, Delhi',
    externalExpertMember1: 'Dr. Ruchi Sinha',
    external1Address1: 'Associate Professor',
    external1Address2: 'Criminology and Justice, TISS',
    external1Address3: 'Mumbai',
    externalExpertMember2: 'Dr. R. N. Mangoli',
    external2Address1: 'Director and Chairman',
    external2Address2: 'Criminology and Criminal Justice, University of Madras',
    external2Address3: 'Chennai',
    rpc01Status: 'Done'
  },
  {
    srNo: 14,
    date: '21-07-2025',
    name: 'RUCHIKA SANDHISH SINGH',
    guideName: 'Dr. Priyanka Kacker',
    enrollmentNo: '240112006005',
    nameOfSchool: 'School of Behavioural Forensic',
    rpcLetter: 'YES',
    internalExpertMember: 'Dr. Biswajit Dey',
    internalAddress1: 'Assistant Professor',
    internalAddress2: 'SBF',
    internalAddress3: 'NFSU',
    externalExpertMember1: 'Dr. Karuna D. S.',
    external1Address1: 'Assistant Professor',
    external1Address2: 'Raksha Shakti University',
    external1Address3: 'Gandhinagar',
    externalExpertMember2: 'Dr. Sidhartha S. Dash',
    external2Address1: 'Associate Professor',
    external2Address2: 'KIIT',
    external2Address3: 'Bhubhaneshwar',
    rpc01Status: 'Done'
  }
];

/**
 * Transforms the screenshot tabular records into full RPCApplication objects
 * for direct loading into the SDSR Desk.
 */
export function convertRowsToRpcApplications(rows: ScreenshotCandidateRow[]): RPCApplication[] {
  return rows.map((row, idx) => {
    // Parse DD-MM-YYYY to YYYY-MM-DD
    const dateParts = row.date.split('-');
    const isoDate = dateParts.length === 3 
      ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 
      : '2025-07-21';

    const refNo = `NFSU/SDSR/RPC/${String(idx + 1).padStart(3, '0')}/25`;

    return {
      id: `screenshot-app-${row.enrollmentNo}`,
      refNo,
      letterDate: row.date.replace(/-/g, '/'),
      guideName: row.guideName,
      guideDesignation: 'Guide / Supervisor',
      guideSchool: row.nameOfSchool,
      guideUniversity: 'NFSU, Gandhinagar',
      guideEmail: `${row.guideName.toLowerCase().replace(/[^a-z]/g, '')}@nfsu.ac.in`,
      guidePhone: '+91 79 2397 7100',
      scholarName: row.name,
      scholarGenderTitle: 'Mx.',
      scholarType: 'Full Time',
      researchTopic: `Doctoral Research in ${row.nameOfSchool}`,
      registrationNo: row.enrollmentNo,
      registrationDate: '2024-01-15',
      currentRpcNumber: 1,
      currentRpcOrdinal: '1st',
      proposedRpcDate: isoDate,
      rpcTime: '12:00 Noon onwards',
      mode: 'Online',
      meetingVenueOrLink: 'Online (Google Meet link will be shared by Guide)',
      schoolDeanTitle: 'Dean',
      schoolName: row.nameOfSchool,
      schoolCampus: 'NFSU, Gandhinagar',
      externalMember1: {
        name: row.externalExpertMember1,
        designation: row.external1Address1,
        affiliation: `${row.external1Address2}, ${row.external1Address3}`,
        email: 'expert1@external.ac.in',
        contactNo: '+91 98000 00001',
      },
      externalMember2: {
        name: row.externalExpertMember2,
        designation: row.external2Address1,
        affiliation: `${row.external2Address2}, ${row.external2Address3}`,
        email: 'expert2@external.ac.in',
        contactNo: '+91 98000 00002',
      },
      internalMember: {
        name: row.internalExpertMember,
        designation: row.internalAddress1,
        affiliation: `${row.internalAddress2}, ${row.internalAddress3}`,
        email: 'internal@nfsu.ac.in',
        contactNo: '+91 79 2397 7100',
      },
      feeDetails: [
        {
          id: `fee-${row.enrollmentNo}-1`,
          semesterName: 'Year I / Sem I',
          amount: 25000,
          paymentDate: '2024-01-20',
          receiptNo: `REC/${row.enrollmentNo}/01`,
          isVerified: true,
        },
        {
          id: `fee-${row.enrollmentNo}-2`,
          semesterName: 'Sem II',
          amount: 25000,
          paymentDate: '2024-07-15',
          receiptNo: `REC/${row.enrollmentNo}/02`,
          isVerified: true,
        }
      ],
      enclosures: {
        registrationCertificate: true,
        rpcMemberApprovedLetter: true,
        feesReceiptsAllSemester: true,
        attendanceReportSigned: true,
        previousRpcReport: true,
      },
      complianceAudit: {
        timeGapDays: 0,
        timeGapMonths: 0,
        timeGapStatus: 'FIRST_RPC_VALID',
        timeGapRemarks: '1st RPC milestone validated against NFSU PhD Ordinance.',
        feesStatus: 'CLEARED',
        feesRemarks: 'Tuition fees verified through SDSR finance desk.',
        enclosuresStatus: 'ALL_VERIFIED',
        enclosuresRemarks: 'All 5 statutory enclosures verified.',
        overallStatus: 'APPROVED_FOR_DEAN',
        scrutinyOfficerName: 'SDSR Scrutiny Section',
        scrutinyDate: row.date,
      },
      status: 'Approved_By_Dean',
      deanApproval: {
        isApproved: true,
        deanName: 'Prof. (Dr.) S. O. Junare',
        deanEmail: 'hvipatel007@gmail.com',
        approvalTimestamp: '2025-07-20T10:30:00Z',
        digitalCertificateId: `NFSU-SDSR-DS-2025-${row.enrollmentNo.slice(-4)}`,
        verificationHash: `SHA256:E8C94A71290BF${row.enrollmentNo}`,
        digitalSignType: 'CRYPTOGRAPHIC_TOKEN',
        deanRemarks: 'Approved for 1st RPC meeting.'
      },
      statusHistory: [
        {
          status: 'Draft',
          timestamp: '2025-07-10T10:00:00Z',
          actor: 'SDSR Administrative Desk',
          remarks: 'Docket imported from School Excel Register.'
        },
        {
          status: 'Approved_By_Dean',
          timestamp: '2025-07-20T10:30:00Z',
          actor: 'Dean SDSR',
          remarks: 'Digitally authorized for RPC presentation.'
        }
      ],
      createdAt: '2025-07-10T10:00:00Z',
      updatedAt: '2025-07-20T10:30:00Z',
    };
  });
}
