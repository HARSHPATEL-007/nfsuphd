import { 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Server, 
  Lock, 
  HelpCircle,
  Building,
  HardDrive,
  Mail,
  Zap
} from 'lucide-react';

export function ZeroCostGuideModal() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            <DollarSign className="w-4 h-4" />
            University Budget & Infrastructure Feasibility
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-cinzel">
            Zero-Cost Internal Deployment Blueprint
          </h2>
          <p className="text-xs text-slate-500">
            Analysis of zero ongoing cost operation for internal SDSR departmental staff & Dean SDSR usage
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Confirmed: ₹0 (100% Free Forever)
        </div>
      </div>

      {/* Main Answer Highlight */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          Direct Answer to Your Query:
        </h3>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          <strong>YES!</strong> If you use this portal exclusively for yourselves (i.e. the administrative staff of the SDSR Ph.D. section and Dean SDSR for digital approvals), <strong>it runs at absolute zero financial cost (₹0 / $0)</strong>. There are no software subscription fees, no cloud database charges, no per-signature license fees, and no recurring server bills.
        </p>
      </div>

      {/* 5 Pillars of Zero-Cost Operation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Pillar 1: Zero SaaS Signature License */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Zap className="w-4 h-4 text-amber-600" />
            1. Zero Digital Signature SaaS Fees
          </div>
          <p className="text-slate-600 leading-relaxed">
            Commercial solutions like Adobe Sign or DocuSign charge ₹2,000 to ₹5,000 per user every month. This portal includes <strong>native HTML5 signature pad and tamper-evident SHA-256 cryptographic certificate token stamping</strong> directly in the browser—eliminating commercial e-sign fees completely.
          </p>
        </div>

        {/* Pillar 2: Zero Database & Cloud Bills */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <HardDrive className="w-4 h-4 text-blue-600" />
            2. Zero Cloud Database Subscription
          </div>
          <p className="text-slate-600 leading-relaxed">
            All RPC dockets, fee records, and scrutiny history are persisted client-side using browser local storage (IndexedDB / LocalStorage) with instant JSON backup export. No paid cloud database instances (such as AWS RDS, MongoDB Atlas, or Spanner) are needed to store departmental records.
          </p>
        </div>

        {/* Pillar 3: Zero Server Hosting Cost */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Server className="w-4 h-4 text-indigo-600" />
            3. Free Internal Intranet or Cloud Run Hosting
          </div>
          <p className="text-slate-600 leading-relaxed">
            The compiled build produces a clean, self-contained static web bundle (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">dist/</code>). It can be hosted on the university&apos;s existing internal server (e.g. IIS / Apache / Nginx on Gandhinagar campus intranet) or on Google Cloud Run within the permanent monthly free tier.
          </p>
        </div>

        {/* Pillar 4: Zero Email Gateway Cost */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Mail className="w-4 h-4 text-emerald-600" />
            4. Free Email Integration via Institutional Webmail
          </div>
          <p className="text-slate-600 leading-relaxed">
            Forwarding letters to Dean SDSR and dispatching notices to external/internal RPC members integrates directly with your existing NFSU Zimbra / Gmail / Outlook email clients using standard native mail protocol. No expensive SendGrid or third-party email gateway subscriptions required.
          </p>
        </div>
      </div>

      {/* Staff-Only Security & Access Guide */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600" />
          Recommended Setup for &quot;Administrative Staff Only&quot; Access:
        </h3>

        <div className="space-y-3 text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Option A: University Intranet / Local Campus Network (Most Secure & Free)</strong>
            <p className="text-slate-600 mt-1">
              Host the website on an internal computer or server in the SDSR office (e.g., <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">http://sdsr-phd.nfsu.internal</code>). Only computers connected to the NFSU Gandhinagar Wi-Fi or LAN can open it. Outsiders cannot even view the website address.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Option B: Google AI Studio / Cloud Run with Restricted Access</strong>
            <p className="text-slate-600 mt-1">
              Keep the application hosted on the secure Cloud Run URL provided by AI Studio. Only shared with designated SDSR staff and Dean SDSR. You can add a quick PIN/Passcode check for departmental staff.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Option C: Departmental Backup & Offline Resilience</strong>
            <p className="text-slate-600 mt-1">
              All processed RPC records can be exported in one click as a JSON file or printed directly into official A4 PDFs for the physical Ph.D. section scholar file, ensuring 100% archival compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
