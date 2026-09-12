import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SDSRDesk } from './components/SDSRDesk';
import { ApplicationForm } from './components/ApplicationForm';
import { OfficialLetterPreview } from './components/OfficialLetterPreview';
import { DeanApprovalPortal } from './components/DeanApprovalPortal';
import { PhDOrdinanceGuide } from './components/PhDOrdinanceGuide';
import { ZeroCostGuideModal } from './components/ZeroCostGuideModal';
import { DocumentFormatsHub } from './components/DocumentFormatsHub';
import { LoginPortal } from './components/LoginPortal';
import { StaffQuickNoticeGenerator } from './components/StaffQuickNoticeGenerator';
import { RealWorkflowHub } from './components/RealWorkflowHub';
import { RPCApplication, DeanDigitalApproval, AuthenticatedUser, UserRole } from './types';
import { INITIAL_APPLICATIONS } from './data/initialApplications';
import { DEAN_USER, STAFF_USER } from './data/authUsers';
import { generateEmailApprovalToken, generateDirectEmailApprovalMetadata } from './utils/complianceEngine';
import { CheckCircle2, ShieldCheck, Mail, X } from 'lucide-react';

const STORAGE_KEY = 'nfsu_sdsr_rpc_applications_v2';
const AUTH_USER_STORAGE_KEY = 'nfsu_sdsr_auth_user_v2';

export default function App() {
  const [applications, setApplications] = useState<RPCApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved applications', e);
    }
    return INITIAL_APPLICATIONS;
  });

  const [currentTab, setCurrentTab] = useState<
    'desk' | 'workflow' | 'staff-generator' | 'new-form' | 'dean-portal' | 'ordinance' | 'zero-cost' | 'letter-view' | 'docs-hub'
  >('desk');

  const [approvalToast, setApprovalToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Authenticated User State (Dean or Staff Office)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load authenticated user session', e);
    }
    // Return default session or null to show login portal
    return null;
  });

  const [selectedApplication, setSelectedApplication] = useState<RPCApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to localStorage whenever applications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save applications to localStorage', e);
    }
  }, [applications]);

  // Auth Handler: Login
  const handleLogin = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user session', e);
    }
    if (user.role === 'DEAN') {
      setCurrentTab('dean-portal');
    } else {
      setCurrentTab('desk');
    }
  };

  // Auth Handler: Sign Out
  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  // Auth Handler: Switch Account
  const handleSwitchAccount = (targetRole: UserRole) => {
    const userToSet = targetRole === 'DEAN' 
      ? { ...DEAN_USER, lastLoginTimestamp: new Date().toISOString() }
      : { ...STAFF_USER, lastLoginTimestamp: new Date().toISOString() };
    handleLogin(userToSet);
  };

  // Handler: Batch import applications (e.g. from Excel or screenshot data)
  const handleImportApplications = (newApps: RPCApplication[]) => {
    const existingIds = new Set(applications.map(a => a.id));
    const toAdd = newApps.filter(a => !existingIds.has(a.id));
    const merged = [...toAdd, ...applications];
    setApplications(merged);
  };

  // Handler: Save application (create or update)
  const handleSaveApplication = (newApp: RPCApplication) => {
    const existsIndex = applications.findIndex(a => a.id === newApp.id);
    let updated: RPCApplication[];
    if (existsIndex >= 0) {
      updated = [...applications];
      updated[existsIndex] = newApp;
    } else {
      updated = [newApp, ...applications];
    }
    setApplications(updated);
    setSelectedApplication(newApp);
    setCurrentTab('letter-view');
  };

  // Handler: Forward docket to Dean SDSR with unique Direct Email Approval Token
  const handleForwardToDean = (appId: string, deanEmail: string = 'hvipatel007@gmail.com') => {
    let assignedToken = '';
    const updated = applications.map(app => {
      if (app.id === appId) {
        assignedToken = app.emailApprovalToken || generateEmailApprovalToken(app.id, app.refNo);
        const history = [
          ...(app.statusHistory || []),
          {
            status: 'Submitted_To_Dean' as const,
            timestamp: new Date().toISOString(),
            actor: 'Ph.D. Administration Section (harsh142022@gmail.com)',
            remarks: `Official docket Ref: ${app.refNo} redirected to Dean SDSR (${deanEmail}) with Direct Approval Token [${assignedToken}].`
          }
        ];
        return {
          ...app,
          status: 'Submitted_To_Dean' as const,
          emailApprovalToken: assignedToken,
          emailDispatchedAt: new Date().toISOString(),
          emailDispatchedTo: deanEmail,
          statusHistory: history,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication?.id === appId) {
      setSelectedApplication(updated.find(a => a.id === appId) || null);
    }
    setApprovalToast({
      type: 'info',
      message: `Docket dispatched to Dean SDSR (${deanEmail}) with Direct Email Approval Token [${assignedToken}]!`
    });
    setTimeout(() => setApprovalToast(null), 6000);
  };

  // Handler: Direct Email Approval execution (e.g. from 1-click email link or token)
  const handleDirectEmailApprove = (appId: string, token: string, remarks?: string) => {
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp) return;

    const approvalMeta = generateDirectEmailApprovalMetadata(
      'Prof. (Dr.) S. O. Junare',
      'hvipatel007@gmail.com',
      targetApp.refNo,
      token,
      remarks
    );

    const updated = applications.map(app => {
      if (app.id === appId) {
        const history = [
          ...(app.statusHistory || []),
          {
            status: 'Approved_By_Dean' as const,
            timestamp: approvalMeta.approvalTimestamp,
            actor: 'Dean SDSR (hvipatel007@gmail.com) via Direct Email Token',
            remarks: `Officially sanctioned via Direct Email Token [${token}]. Certificate ID: ${approvalMeta.digitalCertificateId}. ${remarks || ''}`
          }
        ];
        return {
          ...app,
          status: 'Approved_By_Dean' as const,
          deanApproval: approvalMeta,
          statusHistory: history,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updated);
    const approvedApp = updated.find(a => a.id === appId) || null;
    setSelectedApplication(approvedApp);

    setApprovalToast({
      type: 'success',
      message: `✅ Direct Email Approval Verified! ${targetApp.scholarName} (${targetApp.refNo}) has been sanctioned by Dean SDSR (hvipatel007@gmail.com).`
    });
    setTimeout(() => setApprovalToast(null), 7000);
  };

  // Listen for direct email approval links in URL hash
  useEffect(() => {
    const checkHashAction = () => {
      const hash = window.location.hash;
      if (hash.includes('action=direct-email-approval')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const appId = params.get('appId');
        const token = params.get('token');
        if (appId && token) {
          handleDirectEmailApprove(appId, token);
          window.location.hash = '';
          setCurrentTab('letter-view');
        }
      }
    };

    checkHashAction();
    window.addEventListener('hashchange', checkHashAction);
    return () => window.removeEventListener('hashchange', checkHashAction);
  }, [applications]);

  // Handler: Dean executes digital approval inside portal
  const handleDeanApprove = (appId: string, approvalData: DeanDigitalApproval) => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        const history = [
          ...(app.statusHistory || []),
          {
            status: 'Approved_By_Dean' as const,
            timestamp: approvalData.approvalTimestamp,
            actor: `Dean SDSR (${approvalData.deanName})`,
            remarks: `Digitally authorized with certificate serial ${approvalData.digitalCertificateId}. ${approvalData.deanRemarks || ''}`
          }
        ];
        return {
          ...app,
          status: 'Approved_By_Dean' as const,
          deanApproval: approvalData,
          statusHistory: history,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication?.id === appId) {
      setSelectedApplication(updated.find(a => a.id === appId) || null);
    }
  };

  // Handler: Dean requests clarification
  const handleDeanClarification = (appId: string, remarks: string) => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        const history = [
          ...(app.statusHistory || []),
          {
            status: 'Clarification_Requested' as const,
            timestamp: new Date().toISOString(),
            actor: 'Dean SDSR',
            remarks: `Returned to SDSR Office for clarification: ${remarks}`
          }
        ];
        return {
          ...app,
          status: 'Clarification_Requested' as const,
          statusHistory: history,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication?.id === appId) {
      setSelectedApplication(updated.find(a => a.id === appId) || null);
    }
  };

  // Handler: Delete application
  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter(a => a.id !== appId);
    setApplications(updated);
    if (selectedApplication?.id === appId) {
      setSelectedApplication(null);
      setCurrentTab('desk');
    }
  };

  // Filter applications by search query
  const searchedApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.scholarName.toLowerCase().includes(q) ||
      app.registrationNo.toLowerCase().includes(q) ||
      app.guideName.toLowerCase().includes(q) ||
      app.schoolName.toLowerCase().includes(q) ||
      app.refNo.toLowerCase().includes(q)
    );
  });

  // If no user is authenticated, render the dedicated institutional login portal
  if (!currentUser) {
    return <LoginPortal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab === 'letter-view' ? 'desk' : currentTab}
        setCurrentTab={(tab) => {
          setSelectedApplication(null);
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSwitchAccount={handleSwitchAccount}
        applications={applications}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Notification Toast for Docket Dispatch & Email Approvals */}
      {approvalToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-slide-in">
          <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 ${
            approvalToast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {approvalToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed">
              <strong className="block font-bold text-sm mb-0.5">
                {approvalToast.type === 'success' ? 'Institutional Direct Approval Executed' : 'Docket Dispatched'}
              </strong>
              {approvalToast.message}
            </div>
            <button
              type="button"
              onClick={() => setApprovalToast(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab: Real Institutional Workflow & Direct Email Approval */}
        {currentTab === 'workflow' && (
          <RealWorkflowHub
            applications={searchedApplications}
            onSelectApplication={(app) => {
              setSelectedApplication(app);
              setCurrentTab('letter-view');
            }}
            onForwardToDean={(appId) => handleForwardToDean(appId)}
            onDirectEmailApprove={handleDirectEmailApprove}
            onDirectEmailClarify={handleDeanClarification}
            currentUser={currentUser}
            onSwitchUser={handleSwitchAccount}
            onOpenQuickStaffGenerator={() => setCurrentTab('staff-generator')}
          />
        )}

        {/* Tab: SDSR Processing Desk */}
        {currentTab === 'desk' && (
          <SDSRDesk
            applications={searchedApplications}
            onSelectApplication={(app) => {
              setSelectedApplication(app);
              setCurrentTab('letter-view');
            }}
            onNewApplication={() => setCurrentTab('new-form')}
            onForwardToDean={(appId) => handleForwardToDean(appId)}
            onOpenDeanPortal={(appId) => {
              setSelectedApplication(applications.find(a => a.id === appId) || null);
              setCurrentTab('dean-portal');
            }}
            onDeleteApplication={handleDeleteApplication}
            onOpenDocsHub={() => setCurrentTab('docs-hub')}
            onImportApplications={handleImportApplications}
            onOpenStaffGenerator={() => setCurrentTab('staff-generator')}
            onOpenWorkflowHub={() => setCurrentTab('workflow')}
            onDirectEmailApprove={handleDirectEmailApprove}
          />
        )}

        {/* Tab: Rapid Notice by Staff Input (Student Name, Date, Mode) */}
        {currentTab === 'staff-generator' && (
          <StaffQuickNoticeGenerator
            applications={applications}
            onSaveApplication={(app) => {
              handleSaveApplication(app);
            }}
            onForwardToDean={(appId) => {
              handleForwardToDean(appId);
            }}
            onOpenLetterView={(app) => {
              setSelectedApplication(app);
              setCurrentTab('letter-view');
            }}
          />
        )}

        {/* Tab: Example Documents (.docx & Excel Sheet Formats) */}
        {currentTab === 'docs-hub' && (
          <DocumentFormatsHub
            applications={applications}
            onImportApplications={handleImportApplications}
            onSelectApplicationForLetter={(app) => {
              setSelectedApplication(app);
              setCurrentTab('letter-view');
            }}
          />
        )}

        {/* Tab: New / Edit Application Form (13 Fields + 5 Enclosures) */}
        {currentTab === 'new-form' && (
          <ApplicationForm
            onSave={handleSaveApplication}
            onCancel={() => setCurrentTab('desk')}
            initialData={selectedApplication || undefined}
          />
        )}

        {/* Tab: View Formatted Official Letterhead */}
        {currentTab === 'letter-view' && selectedApplication && (
          <OfficialLetterPreview
            application={selectedApplication}
            onBack={() => setCurrentTab('desk')}
            onSubmitToDean={(appId, deanEmail) => handleForwardToDean(appId, deanEmail)}
            onOpenDeanPortal={() => {
              setCurrentTab('dean-portal');
            }}
            onDirectEmailApprove={handleDirectEmailApprove}
            onOpenWorkflowHub={() => setCurrentTab('workflow')}
          />
        )}

        {/* Tab: Dean SDSR Digital Sign Portal */}
        {currentTab === 'dean-portal' && (
          <DeanApprovalPortal
            applications={applications}
            selectedAppId={selectedApplication?.id}
            onApprove={handleDeanApprove}
            onRequestClarification={handleDeanClarification}
            onViewLetter={(app) => {
              setSelectedApplication(app);
              setCurrentTab('letter-view');
            }}
            currentUser={currentUser}
            onSwitchToDeanLogin={() => handleSwitchAccount('DEAN')}
          />
        )}

        {/* Tab: Ph.D. Ordinance Regulatory Handbook */}
        {currentTab === 'ordinance' && <PhDOrdinanceGuide />}

        {/* Tab: Zero Cost Deployment Guide */}
        {currentTab === 'zero-cost' && <ZeroCostGuideModal />}
      </main>

      {/* Institutional Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              School of Doctoral Studies and Research (SDSR)
            </p>
            <p className="text-slate-400 text-[11px]">
              National Forensic Sciences University, Gandhinagar - 382007, Gujarat
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>Ph.D. Ordinance Compliance Desk</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentTab('ordinance')}
              className="hover:text-amber-400 transition-colors"
            >
              Regulatory Clauses
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentTab('zero-cost')}
              className="hover:text-emerald-400 transition-colors"
            >
              Zero-Cost Architecture
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset application dockets to default sample data?')) {
                  localStorage.removeItem(STORAGE_KEY);
                  setApplications(INITIAL_APPLICATIONS);
                  setSelectedApplication(null);
                  setCurrentTab('desk');
                }
              }}
              className="hover:text-red-400 transition-colors"
            >
              Reset Sample Dockets
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
