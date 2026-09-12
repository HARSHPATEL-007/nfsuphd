import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  AlignmentType, 
  WidthType, 
  BorderStyle 
} from 'docx';
import { RPCApplication } from '../types';
import { formatFormalLetterDate } from './complianceEngine';

/**
 * Triggers a browser download of a generated Blob.
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates an official .docx document matching the exact format
 * shown in the university letterhead (Screenshot 3).
 */
export async function generateRpcLetterDocx(app: RPCApplication): Promise<Blob> {
  const formattedDate = formatFormalLetterDate(app.proposedRpcDate);

  // Address lines parsing for clean display
  const cleanAffiliation = (affil: string) => {
    return affil.split(',').map(s => s.trim()).filter(Boolean);
  };

  const internalLines = cleanAffiliation(app.internalMember.affiliation);
  const ext1Lines = cleanAffiliation(app.externalMember1.affiliation);
  const ext2Lines = cleanAffiliation(app.externalMember2.affiliation);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Institutional Header / Letterhead
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय',
                font: 'Mangal',
                size: 24, // 12pt
                bold: true,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: '(राष्ट्रीय महत्त्व का संस्थान, गृह मंत्रालय, भारत सरकार)',
                font: 'Mangal',
                size: 18, // 9pt
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'National Forensic Sciences University',
                font: 'Times New Roman',
                size: 28, // 14pt
                bold: true,
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '(An Institution of National Importance under Ministry of Home Affairs, Government of India)',
                font: 'Times New Roman',
                size: 18, // 9pt
                italics: true,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'School of Doctoral Studies and Research (SDSR)',
                font: 'Times New Roman',
                size: 22, // 11pt
                bold: true,
                color: '0F172A',
              }),
            ],
          }),

          // Horizontal Divider Line
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: '0F172A' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ spacing: { after: 120 } })],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 12, color: '0F172A' },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
            ],
          }),

          // Ref No. and Date Table (Two columns)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Ref: No: ',
                            font: 'Times New Roman',
                            size: 22,
                            bold: true,
                          }),
                          new TextRun({
                            text: app.refNo || 'NFSU/SDSR/RPC/    /25',
                            font: 'Times New Roman',
                            size: 22,
                          }),
                        ],
                      }),
                    ],
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: 'Date: ',
                            font: 'Times New Roman',
                            size: 22,
                            bold: true,
                          }),
                          new TextRun({
                            text: app.letterDate || '10/06/2025',
                            font: 'Times New Roman',
                            size: 22,
                          }),
                        ],
                      }),
                    ],
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                ],
              }),
            ],
          }),

          // Spacing
          new Paragraph({ spacing: { after: 180 } }),

          // To,
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'To,',
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),

          // 1. Dean of School
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `1.    ${app.schoolDeanTitle}`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.schoolName,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.schoolCampus || 'NFSU, Gandhinagar',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // 2. Guide
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `2.    ${app.guideName}`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.guideDesignation,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.guideUniversity || 'NFSU',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // 3. Internal Expert Member
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `3.    ${app.internalMember.name} (Internal Expert Member).`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.internalMember.designation,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          ...internalLines.map(line => 
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: line,
                  font: 'Times New Roman',
                  size: 22,
                }),
              ],
            })
          ),
          new Paragraph({ spacing: { after: 80 } }),

          // 4. External Expert Member 1
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `4.    ${app.externalMember1.name} (External Expert Member)`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.externalMember1.designation,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          ...ext1Lines.map(line => 
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: line,
                  font: 'Times New Roman',
                  size: 22,
                }),
              ],
            })
          ),
          new Paragraph({ spacing: { after: 80 } }),

          // 5. External Expert Member 2
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `5.    ${app.externalMember2.name} (External Expert Member).`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: app.externalMember2.designation,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          ...ext2Lines.map(line => 
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: line,
                  font: 'Times New Roman',
                  size: 22,
                }),
              ],
            })
          ),

          // Spacing before Subject
          new Paragraph({ spacing: { after: 180 } }),

          // Subject Line (Bold)
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `Subject: `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `${app.currentRpcOrdinal} Meeting of the Research Progress Committee (RPC) for Ph.D. Scholar Registered under ${app.guideName}, ${app.guideDesignation}, ${app.guideSchool}, ${app.guideUniversity || 'NFSU'}.`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),

          // Salutation
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'Dear Sir/Madam,',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // Body Paragraph
          new Paragraph({
            spacing: { after: 140 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `The meeting of Research Progress Committee (RPC) for undernoted Ph.D. `,
                font: 'Times New Roman',
                size: 22,
              }),
              new TextRun({
                text: `${app.schoolName} `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `NFSU is scheduled on `,
                font: 'Times New Roman',
                size: 22,
              }),
              new TextRun({
                text: `${formattedDate} `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `from `,
                font: 'Times New Roman',
                size: 22,
              }),
              new TextRun({
                text: `${app.rpcTime} `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `through ${app.mode.toLowerCase()} mode.`,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // Scholar Bullet
          new Paragraph({
            spacing: { after: 140 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: `•    Name of Ph.D. Scholar- `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `${app.scholarName} `,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
              new TextRun({
                text: `(${app.currentRpcOrdinal}RPC)`,
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),

          // Meeting Details (if Online or Hybrid)
          ...(app.meetingVenueOrLink ? [
            new Paragraph({
              spacing: { after: 140 },
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: `Meeting Venue / Link: `,
                  font: 'Times New Roman',
                  size: 20,
                  italics: true,
                }),
                new TextRun({
                  text: app.meetingVenueOrLink,
                  font: 'Times New Roman',
                  size: 20,
                  color: '2563EB',
                }),
              ],
            }),
          ] : []),

          // Courteous closing line
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'Your presence and valuable suggestions are highly appreciated. Kindly make it convenient to attend the meeting.',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // Thanking you,
          new Paragraph({
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'Thanking you,',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // Digital signature block if approved
          ...(app.deanApproval?.isApproved ? [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: '[ Digitally Authorized & Approved ]',
                  font: 'Times New Roman',
                  size: 20,
                  bold: true,
                  color: '059669',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: app.deanApproval.deanName || 'Prof. (Dr.) S. O. Junare',
                  font: 'Times New Roman',
                  size: 22,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `Cert ID: ${app.deanApproval.digitalCertificateId || 'NFSU-SDSR-DS-2025-0428A'}`,
                  font: 'Courier New',
                  size: 16,
                  color: '64748B',
                }),
              ],
            }),
          ] : []),

          // Signatory
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'Dean',
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'School of Doctoral Studies and Research',
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),

          // Copy to:
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'Copy to:',
                font: 'Times New Roman',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: '1.    Associate Dean- SDSR',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `2.    Dean, Concerned School (${app.schoolName})`,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 300 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: '3.    Ph.D. Section Record File, SDSR',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),

          // Bottom Footer Line
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '64748B' },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 80, after: 20 },
                        children: [
                          new TextRun({
                            text: 'National Forensic Sciences University',
                            font: 'Times New Roman',
                            size: 16,
                            bold: true,
                            color: '334155',
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 20 },
                        children: [
                          new TextRun({
                            text: 'School of Doctoral Studies & Research',
                            font: 'Times New Roman',
                            size: 15,
                            color: '475569',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Sector-9, Gandhinagar, Gujarat – 382 007',
                            font: 'Times New Roman',
                            size: 15,
                            color: '64748B',
                          }),
                        ],
                      }),
                    ],
                    borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '64748B' }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 80, after: 20 },
                        children: [
                          new TextRun({
                            text: 'Tel: +91-79-23977104, Fax: +91-723247465',
                            font: 'Times New Roman',
                            size: 15,
                            color: '475569',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 20 },
                        children: [
                          new TextRun({
                            text: 'Email: phd@nfsu.ac.in',
                            font: 'Times New Roman',
                            size: 15,
                            color: '475569',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: 'Website: nfsu.ac.in',
                            font: 'Times New Roman',
                            size: 15,
                            color: '2563EB',
                          }),
                        ],
                      }),
                    ],
                    borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '64748B' }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Creates and downloads a sample RPC official invitation letter (.docx)
 * matching Screenshot 3 for Ms. Devanshi Lunagariya.
 */
export async function downloadSampleRpcLetterDocx(): Promise<void> {
  const sampleApp: RPCApplication = {
    id: 'sample-letter-devanshi',
    refNo: 'NFSU/SDSR/RPC/    /25',
    letterDate: '10/06/2025',
    guideName: 'Prof. (Dr.) Manjunath Ghate',
    guideDesignation: 'Professor, SPH',
    guideSchool: 'School of Pharmacy',
    guideUniversity: 'NFSU',
    guideEmail: 'manjunath.ghate@nfsu.ac.in',
    guidePhone: '+91 98250 12345',
    scholarName: 'Ms. Devanshi Lunagariya',
    scholarGenderTitle: 'Ms.',
    scholarType: 'Full Time',
    researchTopic: 'Formulation and Evaluation of Novel Targeted Drug Delivery Systems',
    registrationNo: 'Ph.D/SDSR/SPH/042/22',
    registrationDate: '2022-09-15',
    currentRpcNumber: 1,
    currentRpcOrdinal: '1st',
    proposedRpcDate: '2025-06-10',
    rpcTime: '12:00 Noon onwards',
    mode: 'Online',
    meetingVenueOrLink: 'Online (Google Meet link will be shared by Guide)',
    schoolDeanTitle: 'Dean',
    schoolName: 'School of Pharmacy',
    schoolCampus: 'NFSU, Gandhinagar',
    externalMember1: {
      name: 'Dr. Dhiraj Bhatia',
      designation: 'Associate Professor & INYAS-INSA Member',
      affiliation: 'Department of Biological Science and Engineering, Indian Institute of Technology Gandhinagar, Gujarat',
      email: 'dhiraj.bhatia@iitgn.ac.in',
      contactNo: '+91 79 2395 2500',
    },
    externalMember2: {
      name: 'Dr. Prakash Jha',
      designation: 'Professor & Dean',
      affiliation: 'School of Applied Material Science, Central University of Gujarat',
      email: 'prakash.jha@cug.ac.in',
      contactNo: '+91 79 2975 0280',
    },
    internalMember: {
      name: 'Dr. Bhoomika Patel',
      designation: 'Dean (I/C), SPH',
      affiliation: 'NFSU, Gandhinagar',
      email: 'bhoomika.patel@nfsu.ac.in',
      contactNo: '+91 79 2397 7144',
    },
    feeDetails: [],
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
      timeGapRemarks: '1st RPC milestone valid.',
      feesStatus: 'CLEARED',
      feesRemarks: 'Fees verified.',
      enclosuresStatus: 'ALL_VERIFIED',
      enclosuresRemarks: 'All 5 enclosures present.',
      overallStatus: 'APPROVED_FOR_DEAN',
      scrutinyOfficerName: 'SDSR Scrutiny Section',
      scrutinyDate: '10/06/2025',
    },
    status: 'Approved_By_Dean',
    deanApproval: {
      isApproved: true,
      deanName: 'Prof. (Dr.) S. O. Junare',
      deanEmail: 'hvipatel007@gmail.com',
      approvalTimestamp: '2025-06-09T16:45:20Z',
      digitalCertificateId: 'NFSU-SDSR-DS-2025-0428A',
      verificationHash: 'SHA256:7B8F218E940A7C12DF34889CB19460E35',
      digitalSignType: 'CRYPTOGRAPHIC_TOKEN',
    },
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const blob = await generateRpcLetterDocx(sampleApp);
  triggerFileDownload(blob, 'Example_RPC_Letter_Ms_Devanshi_Lunagariya.docx');
}

/**
 * Creates and downloads a blank RPC letter template (.docx) for departmental use.
 */
export async function downloadBlankRpcLetterDocx(): Promise<void> {
  const blankApp: RPCApplication = {
    id: 'blank-template',
    refNo: 'NFSU/SDSR/RPC/ [Ref No] /25',
    letterDate: 'DD/MM/YYYY',
    guideName: '[Guide Name and Title]',
    guideDesignation: '[Guide Designation]',
    guideSchool: '[School of Guide]',
    guideUniversity: 'NFSU, Gandhinagar',
    guideEmail: 'guide.email@nfsu.ac.in',
    guidePhone: '+91 XXXXX XXXXX',
    scholarName: '[Full Name of Ph.D. Scholar]',
    scholarGenderTitle: 'Mr.',
    scholarType: 'Full Time',
    researchTopic: '[Title of Ph.D. Research Thesis]',
    registrationNo: 'Ph.D/SDSR/[School]/[No]/[Year]',
    registrationDate: 'YYYY-MM-DD',
    currentRpcNumber: 1,
    currentRpcOrdinal: '1st',
    proposedRpcDate: new Date().toISOString().split('T')[0],
    rpcTime: '12:00 Noon onwards',
    mode: 'Online',
    meetingVenueOrLink: '[Google Meet link / SDSR Board Room]',
    schoolDeanTitle: 'Dean',
    schoolName: '[School Name]',
    schoolCampus: 'NFSU, Gandhinagar',
    externalMember1: {
      name: '[External Expert Member 1]',
      designation: '[Designation]',
      affiliation: '[Department, Institution, City, State]',
      email: 'external1@institute.ac.in',
      contactNo: '+91 XXXXX XXXXX',
    },
    externalMember2: {
      name: '[External Expert Member 2]',
      designation: '[Designation]',
      affiliation: '[Department, Institution, City, State]',
      email: 'external2@institute.ac.in',
      contactNo: '+91 XXXXX XXXXX',
    },
    internalMember: {
      name: '[Internal Expert Member]',
      designation: '[Designation]',
      affiliation: '[School, NFSU, Campus]',
      email: 'internal@nfsu.ac.in',
      contactNo: '+91 XXXXX XXXXX',
    },
    feeDetails: [],
    enclosures: {
      registrationCertificate: false,
      rpcMemberApprovedLetter: false,
      feesReceiptsAllSemester: false,
      attendanceReportSigned: false,
      previousRpcReport: false,
    },
    complianceAudit: {
      timeGapDays: 0,
      timeGapMonths: 0,
      timeGapStatus: 'FIRST_RPC_VALID',
      timeGapRemarks: '',
      feesStatus: 'CLEARED',
      feesRemarks: '',
      enclosuresStatus: 'ALL_VERIFIED',
      enclosuresRemarks: '',
      overallStatus: 'APPROVED_FOR_DEAN',
      scrutinyOfficerName: 'SDSR Desk',
      scrutinyDate: '',
    },
    status: 'Draft',
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const blob = await generateRpcLetterDocx(blankApp);
  triggerFileDownload(blob, 'Template_RPC_Official_Letterhead_Blank.docx');
}
