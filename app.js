const navGroups = [{ label: 'View', items: [['Profile', '#/dashboard'], ['UAN Card', '#/dashboard'], ['Passbook Lite', '#/passbook'], ['Passbook', '#/passbook']] }, { label: 'Manage', items: [['Joint Declaration', '#/dashboard'], ['Contact Details', '#/dashboard'], ['KYC', '#/dashboard'], ['e-Nomination', '#/dashboard'], ['Mark Exit', '#/dashboard']] }, { label: 'Account', items: [['Account Settings', '#/dashboard'], ['Change Password', '#/dashboard']] }, { label: 'Online Services', items: [['Scheme Certificate Surrender', '#/claims'], ['Member Service History', '#/service-history'], ['Claim (Form-31, 19 & 10C)', '#/claims'], ['Request for Transfer of Account', '#/claims'], ['Track Claim Status', '#/claims']] }, { label: 'PMVBRY', items: [['Dashboard', '#/dashboard'], ['Financial Literacy Course', '#/dashboard'], ['FLC Certificate', '#/dashboard']] }];
const app = document.querySelector('#main-content'); const desktopNav = document.querySelector('#desktopNav'); const mobileNav = document.querySelector('#mobileNav');
const linkList = group => group.items.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
desktopNav.innerHTML = navGroups.map((g, i) => `<div class="nav-group"><button type="button" aria-expanded="false" aria-controls="nav-dropdown-${i}">${g.label}<span aria-hidden="true">⌄</span></button><div class="nav-dropdown" id="nav-dropdown-${i}" hidden>${linkList(g)}</div></div>`).join('');
mobileNav.innerHTML = navGroups.map((g, i) => `<section class="mobile-nav-group"><button type="button" aria-expanded="false" aria-controls="mobile-group-${i}">${g.label}<span aria-hidden="true">⌄</span></button><div id="mobile-group-${i}" hidden>${linkList(g)}</div></section>`).join('');
document.querySelectorAll('.nav-group > button').forEach(b => b.addEventListener('click', () => { const open = b.getAttribute('aria-expanded') === 'true'; document.querySelectorAll('.nav-group > button').forEach(x => { x.setAttribute('aria-expanded', 'false'); x.nextElementSibling.hidden = true; }); b.setAttribute('aria-expanded', String(!open)); b.nextElementSibling.hidden = open; }));
document.querySelectorAll('.mobile-nav-group button').forEach(b => b.addEventListener('click', () => { const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!open)); b.nextElementSibling.hidden = open; }));

const passbookData = { 2026: { balances: [['Employee Share', '₹ 1,192'], ['Employer Share', '₹ 3,415'], ['Pension Share', '₹ 26,507']], activity: [['Contributions', '₹ 7,838'], ['Withdrawals', '₹ 17,500'], ['Transfer-ins / VDRs', '₹ 0'], ['Interest', 'N/A']], contribution: [['Employee contribution', 38, '₹ 2,976'], ['Employer contribution', 24, '₹ 1,862'], ['Pension contribution', 38, '₹ 3,000']], transactions: [['Jun 2026', '19 Jul 2026', 'Claim', 'Claim settlement (Form 31)', '0', '0', '−₹ 1,764', '−₹ 0', '−₹ 0'], ['May 2026', '22 Jun 2026', 'Contribution', 'Contribution for due month 05/2026', '₹ 15,000', '₹ 15,000', '₹ 604', '₹ 185', '₹ 419'], ['Apr 2026', '21 May 2026', 'Contribution', 'Contribution for due month 04/2026', '₹ 15,000', '₹ 15,000', '₹ 604', '₹ 185', '₹ 419'], ['Mar 2026', '20 Apr 2026', 'Contribution', 'Contribution for due month 03/2026', '₹ 15,000', '₹ 15,000', '₹ 604', '₹ 185', '₹ 419']] }, 2025: { balances: [['Employee Share', '₹ 2,352'], ['Employer Share', '₹ 4,106'], ['Pension Share', '₹ 23,507']], activity: [['Contributions', '₹ 9,426'], ['Withdrawals', '₹ 0'], ['Transfer-ins / VDRs', '₹ 3,250'], ['Interest', '₹ 486']], contribution: [['Employee contribution', 37, '₹ 3,576'], ['Employer contribution', 24, '₹ 2,350'], ['Pension contribution', 39, '₹ 3,500']], transactions: [['Mar 2025', '20 Apr 2025', 'Contribution', 'Contribution for due month 03/2025', '₹ 14,500', '₹ 14,500', '₹ 596', '₹ 175', '₹ 405'], ['Feb 2025', '20 Mar 2025', 'Contribution', 'Contribution for due month 02/2025', '₹ 14,500', '₹ 14,500', '₹ 596', '₹ 175', '₹ 405'], ['Jan 2025', '19 Feb 2025', 'Transfer-in', 'Transfer-in / VDR receipt', '—', '—', '₹ 1,250', '₹ 1,000', '₹ 1,000'], ['Dec 2024', '20 Jan 2025', 'Contribution', 'Contribution for due month 12/2024', '₹ 14,500', '₹ 14,500', '₹ 596', '₹ 175', '₹ 405']] } };
const claims = [
  { id: 'active', type: 'Final Settlement', form: 'Form 19', date: 'Submitted 19 Jul 2026', submitted: '19 July 2026', amount: '₹ 17,500', status: 'Processing', reference: 'CLM-2026-04821', stage: 2, activity: [['19 Jul 2026', 'Claim submitted', 'Your Form 19 claim was successfully submitted.'], ['20 Jul 2026', 'Under review', 'Your claim details were reviewed.'], ['22 Jul 2026', 'Processing', 'Your claim has moved forward for processing.']] },
  { id: 'advance', type: 'Advance Claim', form: 'Form 31', date: 'Submitted 12 Mar 2026', submitted: '12 March 2026', amount: '₹ 10,000', status: 'Settled', reference: 'CLM-2026-03129', stage: 3, activity: [['12 Mar 2026', 'Claim submitted', 'Your advance claim was successfully submitted.'], ['13 Mar 2026', 'Under review', 'Your claim details were reviewed.'], ['15 Mar 2026', 'Settled', 'Your claim has been settled.']] },
  { id: 'transfer', type: 'Transfer Claim', form: 'Form 13', date: 'Submitted 08 Dec 2025', submitted: '08 December 2025', amount: '₹ 15,000', status: 'Settled', reference: 'CLM-2025-12084', stage: 3, activity: [['08 Dec 2025', 'Claim submitted', 'Your transfer request was successfully submitted.'], ['10 Dec 2025', 'Under review', 'Your service details were reviewed.'], ['15 Dec 2025', 'Settled', 'Your transfer request was completed.']] },
  { id: 'action', type: 'Advance Claim', form: 'Form 31', date: 'Submitted 22 Sep 2025', submitted: '22 September 2025', amount: '₹ 4,500', status: 'Requires Action', reference: 'CLM-2025-09221', stage: 1, note: 'Additional information is required.', activity: [['22 Sep 2025', 'Claim submitted', 'Your advance claim was successfully submitted.'], ['23 Sep 2025', 'Under review', 'We need additional information to continue this claim.']] }
];
const statusClass = status => status.toLowerCase().replace(/\s+/g, '-');
let currentDemoAccount = 1; // 1 = Demo Member, 2 = Demo Member 2

const dashboardView = () => {
  const isDemo2 = currentDemoAccount === 2;
  const memberName = isDemo2 ? 'Demo Member 2' : 'Demo Member';

  const kycItem = isDemo2
    ? `<div class="journey-item"><span class="journey-icon pending">!</span><div><strong data-i18n="dash.kyc">KYC</strong><small style="color:var(--orange-800)">PAN missing</small></div></div>`
    : `<div class="journey-item"><span class="journey-icon complete">✓</span><div><strong data-i18n="dash.kyc">KYC</strong><small data-i18n="dash.verified">Verified</small></div></div>`;

  return `<div class="shell"><div class="breadcrumb"><span>Member Portal</span><span>/</span><strong data-i18n="nav.dashboard">Dashboard</strong></div><div class="welcome-row"><div><p class="eyebrow" data-i18n="dash.eyebrow">MEMBER DASHBOARD</p><h1><span data-i18n="dash.greeting">Good morning</span>, ${memberName}</h1><p data-i18n="dash.intro">Here is a simple view of your EPF account and available services.</p></div><p class="last-login">Last login: 25 Aug 2026, 10:30 AM</p></div><div class="dashboard-grid"><div class="dashboard-col-left" style="display:flex;flex-direction:column;gap:18px;"><section class="primary-experience"><div class="panel-heading"><div><p class="eyebrow teal" data-i18n="dash.journey">MY EPF JOURNEY</p><h2 data-i18n="dash.journeyTitle">Your account at a glance</h2><p data-i18n="dash.journeyDesc">Keep track of the key steps that help your EPF account stay ready when you need it.</p></div><span class="panel-status"><span></span> <span data-i18n="dash.active">Account active</span></span></div><div class="journey-statuses"><div class="journey-item"><span class="journey-icon complete">✓</span><div><strong data-i18n="dash.profile">Profile</strong><small data-i18n="dash.complete">Complete</small></div></div>${kycItem}<div class="journey-item"><span class="journey-icon pending">!</span><div><strong data-i18n="dash.enom">e-Nomination</strong><small data-i18n="dash.actionNeeded">Action needed</small></div></div><div class="journey-item"><span class="journey-icon neutral">—</span><div><strong data-i18n="dash.claims">Claims</strong><small data-i18n="dash.noClaims">No active claims</small></div></div></div><div class="next-step"><div><p class="eyebrow teal" data-i18n="dash.nba">NEXT BEST ACTION</p><h3 data-i18n="dash.nbaTitle">Complete your e-Nomination</h3><p data-i18n="dash.nbaDesc">Add a nominee to help secure your family’s EPF benefits.</p></div><a href="#/dashboard" class="primary-button" data-i18n="dash.nbaBtn">Start e-Nomination →</a></div><div class="experience-footer"><span><b>●</b> <span data-i18n="dash.accountActive">Your account is active</span></span><span data-i18n="dash.lastUpdated">Last updated today</span></div></section><section class="quick-actions" style="margin:0;padding:20px;"><div class="section-heading"><div><p class="eyebrow teal" data-i18n="dash.services">COMMON SERVICES</p><h2 data-i18n="dash.quickActions">Quick actions</h2></div></div><div class="action-grid"><a class="action-card" href="#/dashboard"><span class="action-icon">◈</span><span><strong>PMVBRY</strong><small data-i18n="quick.pmvbryDesc">Access your PMVBRY dashboard.</small></span><b>→</b></a><a class="action-card" href="#/passbook"><span class="action-icon">▤</span><span><strong data-i18n="quick.passbook">Passbook</strong><small data-i18n="quick.passbookDesc">View contribution details.</small></span><b>→</b></a><a class="action-card" href="#/claims" data-guide-target="nav.claims"><span class="action-icon">▱</span><span><strong data-i18n="quick.claims">File Claim</strong><small data-i18n="quick.claimsDesc">Apply for eligible claims.</small></span><b>→</b></a><a class="action-card" href="#/claims"><span class="action-icon">⌕</span><span><strong data-i18n="quick.trackClaim">Track Claim</strong><small data-i18n="quick.trackClaimDesc">Check claim status.</small></span><b>→</b></a><a class="action-card" href="#/dashboard"><span class="action-icon">✓</span><span><strong data-i18n="dash.enom">e-Nomination</strong><small data-i18n="quick.enomDesc">Add nominee details.</small></span><b>→</b></a><a class="action-card" href="#/service-history"><span class="action-icon">◫</span><span><strong data-i18n="quick.service">Member Service History</strong><small data-i18n="quick.serviceDesc">Review service history.</small></span><b>→</b></a></div></section></div><div class="dashboard-col-right" style="display:flex;flex-direction:column;gap:18px;"><aside class="profile-card"><div class="profile-top"><div class="avatar">DM</div><div><p class="eyebrow" data-i18n="dash.memberProfile">MEMBER PROFILE</p><h2>${memberName}</h2><p>UAN: XXXX XXXX 4821</p></div></div><div class="completion"><div><span data-i18n="dash.profileComp">Profile completion</span><strong>${isDemo2 ? '65%' : '80%'}</strong></div><div class="progress"><span style="${isDemo2 ? 'width: 65%' : 'width: 80%'}"></span></div></div><a href="#/dashboard" class="profile-link"><span data-i18n="dash.viewProfile">View profile</span> <span>→</span></a></aside><aside class="profile-card claims-overview-card"><div class="profile-top" style="border-bottom:none; padding-bottom:5px"><div class="avatar" style="background:#eaf4fa;color:#075d80;font-size:18px">📄</div><div><p class="eyebrow teal" style="letter-spacing:1px; margin-bottom:2px" data-i18n="dash.claimsOverview">CLAIMS OVERVIEW</p><h2 style="font-size:16px; margin:0" data-i18n="dash.noActiveClaims">No active claims</h2></div></div><div style="padding-top:0"><p style="color:var(--muted);font-size:13px;margin:5px 0 15px" data-i18n="dash.noActiveClaimsDesc">You don't have any active claims at the moment.</p><a href="#/claims" style="font-size:13px;color:var(--ink);font-weight:bold;text-decoration:none"><span data-i18n="dash.goToClaims">Go to Claims Hub</span> <span>→</span></a></div></aside></div></div></div>`;
};
const passbookView = () => `<div class="shell passbook-page"><div class="breadcrumb"><span>${window.t('nav.memberPortal')}</span><span>/</span><strong data-i18n="nav.passbook">Passbook</strong></div><header class="passbook-header"><div><p class="eyebrow teal" data-i18n="passbook.epfAccount">EPF ACCOUNT</p><h1 data-i18n="passbook.title">Passbook</h1><p data-i18n="passbook.desc">View your EPF contributions, withdrawals, and account balance.</p></div><label class="year-select"><span data-i18n="passbook.fy">Financial year</span> <select id="financialYear"><option value="2026">FY 2026–27</option><option value="2025">FY 2025–26</option></select></label></header><section class="balance-section"><div class="section-heading"><div><p class="eyebrow teal" data-i18n="passbook.closingBalance">CLOSING BALANCE</p><h2 data-i18n="passbook.yourBalance">Your EPF balance</h2></div><span class="updated-text" id="balanceDate"></span></div><div class="balance-grid" id="balanceGrid"></div></section><div class="passbook-grid"><section class="activity-summary"><p class="eyebrow teal" data-i18n="passbook.selectedYear">SELECTED YEAR</p><h2 data-i18n="passbook.activity">Activity summary</h2><div class="activity-rows" id="activityRows"></div></section><section class="breakdown"><p class="eyebrow teal" data-i18n="passbook.breakdown">CONTRIBUTION BREAKDOWN</p><h2 data-i18n="passbook.whereContributions">Where your contributions go</h2><p class="breakdown-note" data-i18n="passbook.selectedYearNote">For the selected financial year</p><div id="contributionBreakdown"></div></section></div><section class="recent-activity"><div class="section-heading"><div><p class="eyebrow teal" data-i18n="passbook.latest">LATEST ENTRIES</p><h2 data-i18n="passbook.recent">Recent activity</h2></div><span class="entry-count" id="entryCount"></span></div><div class="transaction-preview" id="transactionPreview"></div><div class="passbook-actions"><button class="primary-button" id="openPassbook" data-i18n="passbook.viewFull">View Full Passbook →</button><button class="secondary-button" id="downloadSummary" data-i18n="passbook.downloadPdf">Download PDF</button></div></section></div><section class="passbook-overlay" id="passbookOverlay" role="dialog" aria-modal="true" aria-labelledby="fullPassbookTitle" aria-hidden="true"><div class="full-passbook"><header class="full-passbook-header"><button class="back-button" id="closePassbook" data-i18n="passbook.back">← Back</button><div><p class="eyebrow" data-i18n="passbook.official">OFFICIAL MEMBER RECORD</p><h2 id="fullPassbookTitle" data-i18n="passbook.fullPassbook">Full Passbook</h2><p id="fullPassbookMeta"></p></div><button class="secondary-button" id="downloadFull" data-i18n="passbook.downloadPdf">Download PDF</button></header><p class="swipe-hint" data-i18n="passbook.swipe">Swipe horizontally to view all details →</p><div class="table-wrap"><table><thead><tr><th data-i18n="passbook.wageMonth">Wage Month</th><th data-i18n="passbook.transDate">Transaction Date</th><th data-i18n="passbook.transType">Transaction Type</th><th data-i18n="passbook.particulars">Particulars</th><th data-i18n="passbook.epfWages">EPF Wages</th><th data-i18n="passbook.epsWages">EPS Wages</th><th data-i18n="passbook.employeeShare">Employee Share</th><th data-i18n="passbook.employerShare">Employer Share</th><th data-i18n="passbook.pensionShare">Pension Share</th></tr></thead><tbody id="fullPassbookRows"></tbody><tfoot id="fullPassbookTotals"></tfoot></table></div></div></section>`;
const claimDetailView = claim => { const stages = [window.t('claims.stepSub'), window.t('claims.stepRev'), window.t('claims.stepPro'), window.t('claims.stepSet')]; const stageMeta = ['19 Jul 2026', '20 Jul 2026', claim.status === 'Processing' ? window.t('cd.currStage') : claim.stage > 2 ? window.t('dash.complete') : 'Pending', claim.status === 'Settled' ? window.t('dash.complete') : 'Pending']; const stateText = claim.status === 'Requires Action' ? window.t('cd.actionReq') : claim.status === 'Settled' ? 'Your claim has been settled successfully.' : 'Your claim has completed the initial review and is currently being processed for settlement. No action is required from you at this stage.'; return `<div class="shell claim-detail-page"><div class="breadcrumb"><span>${window.t('nav.memberPortal')}</span><span>/</span><a href="#/claims" data-i18n="claims.title">Claims</a><span>/</span><strong data-i18n="cd.details">Claim Details</strong></div><a class="back-to-claims" href="#/claims" data-i18n="cd.back">← Back to Claims</a><section class="claim-detail-hero"><div><p class="eyebrow teal" data-i18n="cd.hero">CLAIM DETAILS</p><h1>${claim.type}</h1><p>${claim.form}</p></div><span class="claim-status ${statusClass(claim.status)}"><b>●</b> ${claim.status}</span><div class="detail-hero-grid"><div><span data-i18n="claims.reference">Claim reference</span><strong>${claim.reference}</strong></div><div><span data-i18n="claims.submitted">Submitted</span><strong>${claim.submitted}</strong></div><div><span data-i18n="claims.amount">Claim amount</span><strong>${claim.amount}</strong></div><div><span data-i18n="cd.currStage">Current stage</span><strong>${claim.status}</strong></div></div></section>${claim.status === 'Requires Action' ? `<section class="action-required"><div><strong data-i18n="cd.actionReq">Action required</strong><p>${claim.note}</p></div><button class="primary-button" id="requiredAction" data-i18n="cd.viewAction">View required action →</button></section>` : ''}<section class="claim-tracking" id="claimTracking" tabindex="-1"><div class="section-heading"><div><p class="eyebrow teal" data-i18n="cd.progress">CLAIM PROGRESS</p><h2 data-i18n="cd.track">Track your claim</h2></div><span class="claim-status ${statusClass(claim.status)}"><b>●</b> ${claim.status}</span></div><ol class="detail-stepper">${stages.map((stage, index) => `<li class="${index < claim.stage ? 'complete' : index === claim.stage ? 'current' : ''}"><span>${index < claim.stage ? '✓' : index + 1}</span><div><strong>${stage}</strong><small>${stageMeta[index]}</small></div></li>`).join('')}</ol></section><section class="now-explainer"><h2 data-i18n="cd.whatsNow">What’s happening now?</h2><p>${stateText}</p><div><strong data-i18n="cd.whatsNext">What happens next:</strong> ${claim.status === 'Requires Action' ? 'Submit the requested information so this claim can continue.' : claim.status === 'Settled' ? 'The settlement amount will be reflected in your account.' : 'Once processing is completed, the claim will move to settlement.'}</div></section><div class="claim-detail-grid"><section class="claim-activity"><p class="eyebrow teal" data-i18n="cd.updates">UPDATES</p><h2 data-i18n="cd.claimAct">Claim activity</h2><div class="activity-timeline">${claim.activity.map((item, index) => `<article class="${index === claim.activity.length - 1 ? 'latest' : ''}"><span></span><div><small>${item[0]}</small><h3>${item[1]}</h3><p>${item[2]}</p></div></article>`).join('')}</div></section><section class="claim-information"><p class="eyebrow teal" data-i18n="cd.official">OFFICIAL RECORD</p><h2 data-i18n="cd.claimInfo">Claim information</h2><dl><div><dt data-i18n="claims.type">Claim type</dt><dd>${claim.type}</dd></div><div><dt data-i18n="cd.form">Form</dt><dd>${claim.form}</dd></div><div><dt data-i18n="claims.reference">Claim reference</dt><dd>${claim.reference}</dd></div><div><dt data-i18n="claims.submitted">Submitted on</dt><dd>${claim.submitted}</dd></div><div><dt data-i18n="claims.amount">Claimed amount</dt><dd>${claim.amount}</dd></div><div><dt data-i18n="cd.status">Status</dt><dd>${claim.status}</dd></div></dl></section></div><section class="claim-documents"><div><p class="eyebrow teal" data-i18n="cd.documents">DOCUMENTS</p><h2 data-i18n="cd.ack">Claim acknowledgement</h2><p><span data-i18n="claims.submitted">Submitted</span> ${claim.submitted}</p></div><button class="secondary-button" id="downloadAcknowledgement" data-i18n="cd.download">Download</button></section></div>`; };
const claimsView = () => `<div class="shell claims-page"><div class="breadcrumb"><span>${window.t('nav.memberPortal')}</span><span>/</span><strong data-i18n="claims.title">Claims</strong></div><header class="claims-header"><div><p class="eyebrow teal" data-i18n="claims.epfServices">EPF SERVICES</p><h1 data-i18n="claims.title">Claims</h1><p data-i18n="claims.subtitle">File, track, and manage your EPF claims.</p></div><button class="primary-button file-claim-button" data-guide-target="claim.start">+ <span data-i18n="claims.fileNew">File a Claim</span></button></header><section class="active-claim"><div class="active-claim-heading"><div><p class="eyebrow teal" data-i18n="claims.currentReq">CURRENT REQUEST</p><h2 data-i18n="claims.activeClaim">Active claim</h2></div><span class="claim-status processing"><b>●</b> <span data-i18n="claims.processing">Processing</span></span></div><div class="claim-overview"><div><span data-i18n="claims.type">Claim type</span><strong>Final Settlement / Form 19</strong></div><div><span data-i18n="claims.reference">Claim reference</span><strong>CLM-2026-04821</strong></div><div><span data-i18n="claims.submitted">Submitted</span><strong>19 July 2026</strong></div><div><span data-i18n="claims.amount">Claim amount</span><strong>₹ 17,500</strong></div></div><ol class="claim-stepper"><li class="complete"><span>✓</span><strong data-i18n="claims.stepSub">Submitted</strong></li><li class="complete"><span>✓</span><strong data-i18n="claims.stepRev">Under Review</strong></li><li class="current"><span>3</span><strong data-i18n="claims.stepPro">Processing</strong></li><li><span>4</span><strong data-i18n="claims.stepSet">Settled</strong></li></ol><div class="claim-actions"><a href="#/claim/active" class="primary-button" data-i18n="claims.viewDetails">View Claim Details</a><a href="#/claim/active?track" class="secondary-button" data-i18n="claims.track">Track Claim</a></div></section><section class="claim-stat-grid"><article><span data-i18n="claims.statusActive">Active</span><strong>1</strong></article><article><span data-i18n="claims.statusSettled">Settled</span><strong>3</strong></article><article><span data-i18n="claims.totalClaimed">Total claimed</span><strong>₹ 42,500</strong></article></section><section class="recent-claims"><div class="section-heading"><div><p class="eyebrow teal" data-i18n="claims.activity">CLAIM ACTIVITY</p><h2 data-i18n="claims.recent">Recent claims</h2><p data-i18n="claims.showingRecent">Showing your most recent claims</p></div></div><div class="claim-list" id="claimList"></div><a href="#/claims" class="view-all-claims" data-i18n="claims.viewAll">View All Claim History →</a></section><section class="claim-guidance"><div><p class="eyebrow teal" data-i18n="claims.getStarted">GET STARTED</p><h2 data-i18n="claims.needToFile">Need to file a claim?</h2><p data-i18n="claims.checkAvailable">Check your available claim options and submit a request based on your eligibility.</p></div><button class="secondary-button" data-i18n="claims.explore">Explore Claim Options →</button></section></div>`;
const claimTypes = [
  { name: 'PF Final Settlement', form: 'Form 19', text: 'Withdraw your eligible PF balance when you meet the applicable conditions.', amount: '₹ 17,500' },
  { name: 'Pension Withdrawal Benefit', form: 'Form 10C', text: 'Claim eligible pension withdrawal benefits.', amount: '₹ 8,200' },
  { name: 'PF Advance', form: 'Form 31', text: 'Apply for an eligible advance from your PF account.', amount: '₹ 10,000' }
];

const claimTypeExplainer = {
  en: {
    text: `<ul>
      <li><strong>Final PF Settlement — Form 19</strong><br>For withdrawing your PF settlement after leaving your job.</li>
      <li><strong>Pension Withdrawal — Form 10C</strong><br>For claiming an eligible pension/EPS-related amount.</li>
      <li><strong>PF Advance — Form 31</strong><br>For taking an eligible advance from your PF for specific needs.</li>
    </ul>
    <p>Select the option that best matches what you need, and I'll guide you step by step.</p>`,
    voice: "I have highlighted your options on the screen. Form 19 is for PF settlement, Form 10C is for pension withdrawal, and Form 31 is for PF advance. Which claim do you want to file?"
  },
  hinglish: {
    text: `<ul>
      <li><strong>Final PF Settlement — Form 19</strong><br>Job chhodne ke baad PF settlement withdraw karne ke liye.</li>
      <li><strong>Pension Withdrawal — Form 10C</strong><br>Eligible pension/EPS-related amount claim karne ke liye.</li>
      <li><strong>PF Advance — Form 31</strong><br>Specific needs ke liye PF se eligible advance lene ke liye.</li>
    </ul>
    <p>Jo option aapki need se match karta hai use select kijiye, phir main aapko step by step guide karunga.</p>`,
    voice: "Maine aapke options screen par highlight kar diye hain. Form 19 PF settlement ke liye hai, Form 10C pension ke liye, aur Form 31 PF advance ke liye hai. Aap kaunsa claim file karna chahte hain?"
  }
};

const claimFlow = {
  step: 1,
  showInfo: false,
  bankAccount: '', bankVerified: false, verifyingBank: false,
  selected: null,
  addressConfirmed: false,
  agreedInfo: false, agreedAadhaar: false,
  otpSent: false, otpValue: '',
  submitting: false, submitted: null,
  activeAi: null,
  advanceReason: '', advanceAmount: ''
};

function getFlowSteps(form) {
  if (form === 'Form 10C') return ['Bank', 'Claim', 'Eligibility', 'Pension', 'Address', 'Declarations', 'OTP', 'Submit'];
  if (form === 'Form 31') return ['Bank', 'Claim', 'Reason', 'Eligibility', 'Amount', 'Review', 'Declarations', 'OTP', 'Submit'];
  return ['Bank', 'Claim', 'Details', 'Address', 'Declarations', 'OTP', 'Submit'];
}

function renderAiGuidance(id, text) {
  if (claimFlow.activeAi !== id) return '';
  return `<div class="ai-guidance-panel"><div class="ai-guidance-header"><strong>✨ AI Guidance</strong><button class="text-action close-ai" data-ai="close">✕</button></div><p>${text}</p></div>`;
}

function aiHook(id, label) {
  return `<button class="ai-hook" data-ai="${id}">✨ ${label}</button>`;
}

function fileClaimView() {
  const type = claimFlow.selected !== null ? claimTypes[claimFlow.selected] : null;
  const flowSteps = getFlowSteps(type?.form);
  const stepName = flowSteps[claimFlow.step - 1];

  const stepsHtml = `<ol class="flow-stepper">${flowSteps.map((x, i) => `<li class="${i + 1 < claimFlow.step ? 'complete' : i + 1 === claimFlow.step ? 'current' : ''}"><span>${i + 1 < claimFlow.step ? '✓' : i + 1}</span><strong>${x}</strong></li>`).join('')}</ol>`;

  let content = '';

  if (stepName === 'Bank') {
    content = `<h2 data-i18n="step.bankTitle">Confirm your bank account</h2><p data-i18n="step.bankDesc">Before you file your claim, we need to verify the bank account linked to your EPFO record.</p>${aiHook('bank', 'Why do I need to verify this?')}${renderAiGuidance('bank', 'EPFO needs to confirm that the bank account you are entering matches the one currently associated with your UAN to prevent fraud and ensure successful transfer of funds.')}<div class="bank-verification-card">${!claimFlow.bankVerified ? `<label class="input-label" data-i18n="step.accNo">Account Number</label><input type="password" id="bankAccountInput" class="text-control w-full" value="${claimFlow.bankAccount}" placeholder="Enter account number" data-i18n-placeholder="step.accNo" data-guide-target="claim.bankAccount"><button class="secondary-button mt-10" id="verifyBankBtn" ${claimFlow.verifyingBank ? 'disabled' : ''} data-guide-target="claim.verifyBank">${claimFlow.verifyingBank ? window.t('file.submitting') : window.t('step.verifyAcc')}</button>` : `<div class="verified-summary"><span class="verified-badge">✓ <span data-i18n="step.bankVerified">Bank account verified</span></span><strong>State Bank of India</strong><span><span data-i18n="step.accEnding">Account ending in</span> ${claimFlow.bankAccount.slice(-4) || 'XXXX'}</span><small>IFSC: SBINXXXXXX</small></div>`}</div>`;
  } else if (stepName === 'Claim') {
    const lang = (typeof voiceEngine !== 'undefined' && voiceEngine.agentContext.language === 'hinglish') ? 'hinglish' : 'en';
    const explainer = claimTypeExplainer[lang];
    const infoModal = claimFlow.showInfo ? `<div class="claim-info-modal" style="background:var(--white); border:1px solid var(--gray-200); border-radius:8px; padding:16px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.1); position:relative"><button id="closeClaimInfo" style="position:absolute; top:12px; right:12px; background:none; border:none; font-size:18px; cursor:pointer" aria-label="Close information">✕</button><div style="font-size:14px; line-height:1.5">${explainer.text}</div><div style="margin-top:12px"><button class="secondary-button" id="readAloudBtn">🔊 Read aloud</button></div></div>` : '';
    content = `<div style="position:relative"><h2 data-i18n="step.claimTypeTitle">Select Claim Type <button id="claimInfoBtn" class="text-action" style="font-size:14px; margin-left:8px; border-radius:50%; width:20px; height:20px; border:1px solid currentColor; display:inline-flex; align-items:center; justify-content:center; text-decoration:none" title="Help me choose" aria-label="Help me choose">ℹ</button></h2><p data-i18n="step.claimTypeDesc">Choose the type of service that best matches your requirement.</p>${infoModal}${aiHook('claim_type', 'Not sure which claim applies to you?')}${renderAiGuidance('claim_type', 'Based on the information available, you have left employment and your account is active. PF Final Settlement (Form 19) may be relevant if you want to withdraw your full eligible PF balance.')}<div class="claim-type-grid">${claimTypes.map((x, i) => `<button class="claim-type-card ${claimFlow.selected === i ? 'selected' : ''}" data-type="${i}" data-guide-target="claim.type.${x.form.toLowerCase().replace(' ', '')}"><span>◇</span><strong>${x.name} <span class="form-badge">${x.form}</span></strong><small>${x.text}</small></button>`).join('')}</div></div>`;
  } else if (stepName === 'Details') { // Form 19
    content = `<h2 data-i18n="step.reviewTitle">Your claim</h2><p data-i18n="step.reviewDesc">Please review the details for your selected claim.</p><div class="flow-review"><div><span data-i18n="claims.type">Claim type</span><strong>${type.name}</strong><small>${type.form}</small></div><div><span data-i18n="step.pan">PAN</span><strong>XXXXX1234X</strong><small data-i18n="dash.verified">Verified</small></div><div style="grid-column: 1 / -1"><span data-i18n="step.estEligible">Estimated eligible claim amount</span><strong class="large-amount d-block">${type.amount}</strong><small data-i18n="step.finalAmountNote">The final amount may change during processing at the EPFO office.</small></div></div><div class="tax-info-card"><strong data-i18n="step.taxApplies">Tax may apply to your settlement</strong><p data-i18n="step.taxDesc">Based on your service period and claim amount, tax rules (TDS) may apply.</p>${aiHook('tax', 'Ask AI to explain')}${renderAiGuidance('tax', 'Since your service period is less than 5 years and the amount might exceed ₹50,000, TDS may be deducted. Providing your PAN helps keep this deduction at a lower rate.')}</div>`;
  } else if (stepName === 'Eligibility') { // Form 10C & 31
    const form31 = type.form === 'Form 31';
    content = `<h2 data-i18n="step.eligibilityTitle">Eligibility check</h2><p data-i18n="step.eligibilityDesc">We've reviewed your account against the requirements for this claim.</p>
      <div class="flow-review">
        <div><span class="status-badge active" style="margin-bottom:8px" data-i18n="step.ready">Ready to continue ✓</span></div>
        ${form31 ? `
          <div><span data-i18n="step.purposeSelected">Claim purpose selected</span><strong>${claimFlow.advanceReason}</strong></div>
          <div><span data-i18n="step.serviceRev">Service details reviewed</span><strong>Current employer active</strong></div>
          <div><span data-i18n="step.eligibleBal">Eligible balance available</span><strong>₹ 1,12,000</strong></div>
        ` : `
          <div><span data-i18n="step.idVer">Identity verified</span><strong>Aadhaar linked</strong></div>
          <div><span data-i18n="step.bankAvail">Bank account available</span><strong data-i18n="dash.verified">Verified</strong></div>
          <div><span data-i18n="step.serviceRec">Service records</span><strong>Minimum 6 months completed</strong></div>
        `}
      </div>`;
  } else if (stepName === 'Pension') { // Form 10C
    content = `<h2 data-i18n="step.pensionTitle">Review pension claim</h2><p data-i18n="step.pensionDesc">Please review your service details for the Pension Withdrawal Benefit.</p><div class="flow-review"><div><span data-i18n="claims.type">Claim type</span><strong>${type.name}</strong><small>${type.form}</small></div><div><span data-i18n="step.servicePeriod">Service period</span><strong>3 years, 2 months</strong></div><div style="grid-column: 1 / -1"><span data-i18n="step.estEligible">Estimated eligible amount</span><strong class="large-amount d-block">${type.amount}</strong><small data-i18n="step.finalAmountNote">Final amount is subject to verification and processing.</small></div></div>`;
  } else if (stepName === 'Reason') { // Form 31
    const reasons = ['Medical treatment', 'Education', 'Marriage', 'Housing-related purpose'];
    content = `<h2 data-i18n="step.reasonTitle">Choose the reason for advance</h2><p data-i18n="step.reasonDesc">The selected purpose determines what the system checks and what information may be required.</p>
      <div class="claim-type-grid">
        ${reasons.map(r => `<button class="claim-type-card ${claimFlow.advanceReason === r ? 'selected' : ''}" data-reason="${r}" data-guide-target="claim.reason"><strong>${r}</strong><small>We’ll check your available records and eligibility before you submit your request.</small></button>`).join('')}
      </div>`;
  } else if (stepName === 'Amount') { // Form 31
    content = `<h2 data-i18n="step.amountTitle">Claim amount</h2><p data-i18n="step.amountDesc">The maximum eligible amount depends on your claim purpose and EPFO rules.</p>
      <div class="flow-review mb-20">
        <div><span data-i18n="step.availBal">Available PF balance</span><strong>₹ 1,12,000</strong></div>
        <div><span data-i18n="step.estMax">Estimated maximum available</span><strong>Up to ${type.amount}</strong></div>
      </div>
      <label class="input-label" data-i18n="step.howMuch">How much would you like to claim?</label>
      <div class="input-with-icon" style="position:relative">
        <span style="position:absolute; left:12px; top:10px; font-weight:bold; color:var(--ink)">₹</span>
        <input type="number" id="advanceAmountInput" class="text-control w-full" style="padding-left:28px" value="${claimFlow.advanceAmount}" placeholder="Enter amount" data-i18n-placeholder="step.enterAmount" data-guide-target="claim.amount">
      </div>
      ${claimFlow.advanceAmount && Number(claimFlow.advanceAmount) <= 10000 ? `<small style="color:var(--teal-700); font-weight:bold; display:block; margin-top:8px">✓ Amount is within the estimated eligible limit</small>` : claimFlow.advanceAmount ? `<small style="color:#d9534f; font-weight:bold; display:block; margin-top:8px">⚠️ The amount entered is higher than the estimated eligible limit.</small>` : ''}
    `;
  } else if (stepName === 'Review') { // Form 31
    content = `<h2 data-i18n="step.reviewAdvanceTitle">Review details</h2><p data-i18n="step.reviewAdvanceDesc">Please review the details for your PF Advance claim.</p>
      <div class="flow-review">
        <div><span data-i18n="claims.type">Claim type</span><strong>${type.name} (${type.form})</strong></div>
        <div><span data-i18n="step.reason">Reason</span><strong>${claimFlow.advanceReason}</strong></div>
        <div><span data-i18n="step.reqAmount">Requested amount</span><strong class="large-amount d-block">₹ ${claimFlow.advanceAmount}</strong></div>
        <div style="grid-column: 1 / -1"><span data-i18n="step.estLimit">Estimated eligible limit</span>: ${type.amount}<small data-i18n="step.finalAmountNote">Final eligibility and amount may be determined during EPFO processing.</small></div>
      </div>`;
  } else if (stepName === 'Address') {
    content = `<h2 data-i18n="step.addressTitle">Confirm your address</h2><p data-i18n="step.addressDesc">We found these details in your EPFO profile. Please review them before continuing.</p>${aiHook('address', 'Why do I need to confirm this?')}${renderAiGuidance('address', 'Your address is required for official correspondence and record keeping. We prefill this from your profile to save you time.')}<div class="address-card"><div class="address-details"><div><strong data-i18n="step.locality">Locality:</strong> <span>Demo Locality, Phase 1</span></div><div><strong data-i18n="step.city">City:</strong> <span>Demo City</span></div><div><strong data-i18n="step.state">State:</strong> <span>Demo State</span></div><div><strong data-i18n="step.pin">PIN:</strong> <span>400001</span></div></div><label class="ack mt-10"><input type="checkbox" id="confirmAddress" ${claimFlow.addressConfirmed ? 'checked' : ''} data-guide-target="claim.address.confirm"> <span data-i18n="step.confAddress">I confirm my address is correct.</span></label></div>`;
  } else if (stepName === 'Declarations') {
    content = `<h2 data-i18n="step.decTitle">Review and confirm</h2><p data-i18n="step.decDesc">Please complete the required declarations.</p><div class="declaration-section"><strong data-i18n="step.confInfoTitle">1. Confirm your information</strong><p class="declaration-text" data-i18n="step.confInfoDesc">I confirm that I have carefully reviewed the details associated with my EPFO claim and that the required information is correct.</p><label class="ack"><input type="checkbox" id="agreeInfo" ${claimFlow.agreedInfo ? 'checked' : ''} data-guide-target="claim.declaration.info"> <span data-i18n="step.confInfoAck">I confirm the above information.</span></label></div><div class="declaration-section" style="border:0"><strong data-i18n="step.consentTitle">2. Consent to Aadhaar-based authentication</strong><p class="declaration-text" data-i18n="step.consentDesc">EPFO requires identity verification before your claim can be submitted.</p>${aiHook('consent', 'What am I agreeing to?')}${renderAiGuidance('consent', 'You are allowing EPFO to use your Aadhaar number to verify your identity through a One-Time Password (OTP). This is securely processed and replaces physical signatures.')}<label class="ack mt-10"><input type="checkbox" id="agreeAadhaar" ${claimFlow.agreedAadhaar ? 'checked' : ''} data-guide-target="claim.declaration.aadhaar"> <span data-i18n="step.consentAck">I consent to the required Aadhaar-based authentication process for establishing my identity and submitting this claim.</span></label></div>`;
  } else if (stepName === 'OTP') {
    content = `<h2><span data-i18n="form.verifyTitle">Verify your identity</span></h2><p data-i18n="form.verifyDesc">We'll send a one-time password to the mobile number registered for Aadhaar authentication.</p><div class="otp-card"><strong class="phone-number">+91 •••••• 4821</strong>${!claimFlow.otpSent ? `<button class="secondary-button" id="sendOtpBtn" data-guide-target="claim.otp.send"><span data-i18n="form.sendOtp">Send OTP</span></button>` : `<label class="input-label" data-i18n="form.enterOtp">Enter the 6-digit code</label><input type="text" id="otpInput" class="text-control w-full" value="${claimFlow.otpValue}" placeholder="XXXXXX" maxlength="6" data-guide-target="claim.otp.input"><small class="resend-timer mt-10">Resend available in 00:43</small>`}</div>${aiHook('otp', "Didn't receive the OTP?")}${renderAiGuidance('otp', 'It may take up to a minute for the OTP to arrive. If you still do not receive it, ensure your mobile is connected to the network, or you can request a resend when the timer expires.')}`;
  } else if (stepName === 'Submit') {
    const amountHtml = type.form === 'Form 31' ? `<strong data-i18n="step.reqAmount">Requested amount</strong><span class="large-amount d-block">₹ ${claimFlow.advanceAmount}</span>` : `<strong data-i18n="step.estEligible">Estimated eligible amount</strong><span class="large-amount d-block">${type.amount}</span>`;
    content = `<h2 data-i18n="step.submitTitle">Ready to submit</h2><p data-i18n="step.submitDesc">Review your claim summary.</p><div class="flow-confirm"><span><strong><span data-i18n="claims.title">Claim</span></strong><br>${type.name} (${type.form})</span><span><strong><span data-i18n="step.bankAvail">Bank account</span></strong><br><span data-i18n="dash.verified">Verified</span> ✓</span>${type.form !== 'Form 31' ? `<span><strong><span data-i18n="step.addressTitle">Address</span></strong><br>Confirmed ✓</span>` : `<span><strong><span data-i18n="step.reason">Reason</span></strong><br>${claimFlow.advanceReason}</span>`}<span><strong><span data-i18n="step.auth">Authentication</span></strong><br>OTP verified ✓</span><span><strong><span data-i18n="step.decs">Declarations</span></strong><br>Completed ✓</span><div style="grid-column: 1 / -1; padding-top:15px; margin-top:15px; border-top:1px solid #dce4e1;">${amountHtml}<small data-i18n="step.finalAmountNote">Final amount may change during processing.</small></div></div>`;
  }

  const isStep1Disabled = stepName === 'Bank' && !claimFlow.bankVerified;
  const isStep2Disabled = stepName === 'Claim' && claimFlow.selected === null;
  const isStepReasonDisabled = stepName === 'Reason' && !claimFlow.advanceReason;
  const isStepAmountDisabled = stepName === 'Amount' && (!claimFlow.advanceAmount || Number(claimFlow.advanceAmount) > 10000);
  const isStep4Disabled = stepName === 'Address' && !claimFlow.addressConfirmed;
  const isStep5Disabled = stepName === 'Declarations' && !(claimFlow.agreedInfo && claimFlow.agreedAadhaar);
  const isStep6Disabled = stepName === 'OTP' && claimFlow.otpValue.length !== 6;

  const btnDisabled = (isStep1Disabled || isStep2Disabled || isStepReasonDisabled || isStepAmountDisabled || isStep4Disabled || isStep5Disabled || isStep6Disabled || claimFlow.submitting) ? 'disabled' : '';
  const btnText = claimFlow.submitting ? window.t('file.submitting') : (stepName === 'Submit' ? window.t('file.submitBtn') : window.t('file.continue'));

  return `<div class="shell claim-flow-page"><div class="breadcrumb"><span>${window.t('nav.memberPortal')}</span><span>/</span><a href="#/claims" data-i18n="claims.title">Claims</a><span>/</span><strong data-i18n="file.fileClaim">File a Claim</strong></div><a class="back-to-claims" href="#/claims" data-i18n="claims.backToHub">← Back to Claims Hub</a><header><p class="eyebrow teal" data-i18n="file.guided">GUIDED CLAIM SERVICE</p><h1 data-i18n="file.fileClaim">File a Claim</h1><p data-i18n="file.chooseService">Choose the service you need and we'll guide you through the process.</p></header>${stepsHtml}<section class="flow-content">${content}</section><div class="flow-actions">${claimFlow.step > 1 ? `<button class="secondary-button" id="flowBack" data-i18n="file.back">Back</button>` : '<span></span>'}<button class="primary-button" id="flowContinue" ${btnDisabled} data-guide-target="claim.continue">${btnText}</button></div></div>`;
}

function successView() {
  const c = claimFlow.submitted;
  return `<div class="shell claim-flow-page success-page"><div class="success-icon">🎉</div><p class="eyebrow teal">CLAIM SUBMITTED</p><h1>Your claim has been submitted successfully</h1><p>We've received your request and it is now being processed.</p><section class="success-reference"><span>Claim reference number</span><strong>${c.reference}</strong><small>${c.type} (${c.form})</small>${c.reason ? `<small>Reason: ${c.reason}</small>` : ''}<small>Submitted ${c.submitted} · Status: ${c.status}</small></section><div class="flow-actions"><a href="#/claim/${c.id}" class="primary-button">Track my claim</a><a href="#/claims" class="secondary-button">Back to Claims Hub</a></div></div>`;
}

function bindFlow() {
  document.querySelector('.file-claim-button')?.addEventListener('click', () => { location.hash = '#/file-claim'; });

  document.querySelector('#claimInfoBtn')?.addEventListener('click', () => { claimFlow.showInfo = !claimFlow.showInfo; renderRoute(); });
  document.querySelector('#closeClaimInfo')?.addEventListener('click', () => { claimFlow.showInfo = false; renderRoute(); });
  document.querySelector('#readAloudBtn')?.addEventListener('click', () => {
    if (typeof voiceEngine !== 'undefined') {
      const lang = voiceEngine.agentContext.language === 'hinglish' ? 'hinglish' : 'en';
      voiceEngine.speakResponse(claimTypeExplainer[lang].voice);
    }
  });

  document.querySelectorAll('.ai-hook').forEach(btn => btn.addEventListener('click', () => { claimFlow.activeAi = btn.dataset.ai === claimFlow.activeAi ? null : btn.dataset.ai; renderRoute(); }));
  document.querySelectorAll('.close-ai').forEach(btn => btn.addEventListener('click', () => { claimFlow.activeAi = null; renderRoute(); }));

  document.querySelector('#bankAccountInput')?.addEventListener('input', e => { claimFlow.bankAccount = e.target.value; });
  document.querySelector('#verifyBankBtn')?.addEventListener('click', () => { if (!claimFlow.bankAccount) return; claimFlow.verifyingBank = true; renderRoute(); setTimeout(() => { claimFlow.verifyingBank = false; claimFlow.bankVerified = true; renderRoute(); }, 1000); });

  document.querySelectorAll('.claim-type-card[data-type]').forEach(x => x.addEventListener('click', () => {
    const type = Number(x.dataset.type);
    claimFlow.selected = type;
    const formType = type === 0 ? 'FORM_19' : type === 1 ? 'FORM_10C' : 'FORM_31';
    const journeyId = type === 0 ? 'file_pf_claim' : type === 1 ? 'file_form10c_claim' : 'file_form31_claim';

    console.log(`[Guide] Claim type selected: ${formType}`);
    console.log(`[Guide] Resolving journey: ${journeyId}`);

    if (typeof voiceEngine !== 'undefined') {
      voiceEngine.agentContext.pendingAction = null;
      voiceEngine.agentContext.selectedClaimType = formType;
    }

    if (guideState.mode === 'claim_type_selection') {
      guideState.mode = 'idle';
      console.log('[Guide] Resetting step index');
      claimFlow.step = 1; // Reset to the actual first step
      renderRoute();
      console.log('[Guide] Starting journey from first step');
      guideEngine.startJourney(journeyId);
    } else {
      renderRoute();
    }
  }));

  document.querySelectorAll('.claim-type-card[data-reason]').forEach(x => x.addEventListener('click', () => { claimFlow.advanceReason = x.dataset.reason; renderRoute(); }));

  document.querySelector('#advanceAmountInput')?.addEventListener('input', e => { claimFlow.advanceAmount = e.target.value; renderRoute(); });

  document.querySelector('#confirmAddress')?.addEventListener('change', e => { claimFlow.addressConfirmed = e.target.checked; renderRoute(); });
  document.querySelector('#agreeInfo')?.addEventListener('change', e => { claimFlow.agreedInfo = e.target.checked; renderRoute(); });
  document.querySelector('#agreeAadhaar')?.addEventListener('change', e => { claimFlow.agreedAadhaar = e.target.checked; renderRoute(); });

  document.querySelector('#sendOtpBtn')?.addEventListener('click', () => { claimFlow.otpSent = true; renderRoute(); });
  document.querySelector('#otpInput')?.addEventListener('input', e => { claimFlow.otpValue = e.target.value; if (claimFlow.otpValue.length === 6) renderRoute(); });

  document.querySelector('#flowBack')?.addEventListener('click', () => { claimFlow.step--; claimFlow.activeAi = null; renderRoute(); });
  document.querySelector('#flowContinue')?.addEventListener('click', () => {
    if (claimFlow.submitting) return;

    if (claimFlow.step === 2 && currentDemoAccount === 2) {
      // Show prerequisite blocking modal for Demo Member 2
      const popup = document.getElementById('prerequisitePopup');
      const overlay = document.getElementById('prerequisitePopupOverlay');
      if (popup && overlay) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
      }
      return; // Stop progression without breaking state
    }

    if (guideState.journeyId === 'file_form31_claim') {
      console.log(`[Form31 Guide] Continue target clicked`);
      console.log(`[Form31 Guide] Advancing from step ${claimFlow.step}`);
    }
    const type = claimTypes[claimFlow.selected];
    const maxSteps = getFlowSteps(type?.form).length;

    if (claimFlow.step < maxSteps) { claimFlow.step++; claimFlow.activeAi = null; renderRoute(); } else {
      claimFlow.submitting = true; renderRoute();
      setTimeout(() => {
        const id = `new-${Date.now()}`;
        const amt = type.form === 'Form 31' ? `₹ ${claimFlow.advanceAmount}` : type.amount;
        const reason = type.form === 'Form 31' ? claimFlow.advanceReason : null;
        const submitted = { id, type: type.name, form: type.form, date: 'Submitted today', submitted: '26 August 2026', amount: amt, status: 'Submitted', reference: `CLM-2026-${String(Date.now()).slice(-6)}`, stage: 0, reason, activity: [['26 Aug 2026', 'Claim submitted', 'Your claim was successfully submitted.']] };
        claims.unshift(submitted);
        claimFlow.submitted = submitted;

        claimFlow.submitting = false; claimFlow.step = 1; claimFlow.bankAccount = ''; claimFlow.bankVerified = false; claimFlow.selected = null; claimFlow.addressConfirmed = false; claimFlow.agreedInfo = false; claimFlow.agreedAadhaar = false; claimFlow.otpSent = false; claimFlow.otpValue = ''; claimFlow.activeAi = null; claimFlow.advanceReason = ''; claimFlow.advanceAmount = '';

        location.hash = '#/claim-success';
      }, 1500);
    }
  });
}
function renderPassbook(year) { const data = passbookData[year]; const kind = value => value === 'Claim' ? 'withdrawal' : 'contribution'; document.querySelector('#balanceDate').textContent = `As on 31 Mar ${Number(year) + 1}`; document.querySelector('#balanceGrid').innerHTML = data.balances.map(([x, y]) => `<article class="balance-card"><p>${x}</p><strong>${y}</strong><small>Closing balance</small></article>`).join(''); document.querySelector('#activityRows').innerHTML = data.activity.map(([x, y]) => `<div><span>${x}</span><strong>${y}</strong></div>`).join(''); document.querySelector('#contributionBreakdown').innerHTML = data.contribution.map(([x, y, z]) => `<div class="breakdown-row"><div><span>${x}</span><strong>${z}</strong></div><div class="breakdown-track"><span style="width:${y}%"></span></div></div>`).join(''); document.querySelector('#transactionPreview').innerHTML = data.transactions.slice(0, 3).map(([month, date, type, detail, , , amount]) => `<article class="transaction-row"><div><strong>${month}</strong><small>${date}</small></div><div><span class="type-badge ${kind(type)}"><b>${type === 'Claim' ? '−' : '+'}</b> ${type}</span><small>${detail}</small></div><strong class="transaction-amount ${kind(type)}">${amount}</strong></article>`).join(''); document.querySelector('#entryCount').textContent = `${data.transactions.length} entries this year`; document.querySelector('#fullPassbookMeta').textContent = `FY ${year}–${String(Number(year) + 1).slice(-2)} · ${data.transactions.length} transactions`; document.querySelector('#fullPassbookRows').innerHTML = data.transactions.map(row => `<tr class="${kind(row[2])}">${row.map((x, i) => `<td${i > 3 ? ' class="number"' : ''}>${x}</td>`).join('')}</tr>`).join(''); document.querySelector('#fullPassbookTotals').innerHTML = data.activity.map(([x, y]) => `<tr><th colspan="6">${x}</th><td colspan="3" class="number">${y}</td></tr>`).join('') + `<tr class="closing-total"><th colspan="6">Closing balance</th><td colspan="3" class="number">${data.balances.map(x => x[1]).join(' / ')}</td></tr>`; }
function bindPassbook() { const select = document.querySelector('#financialYear'); renderPassbook(select.value); select.addEventListener('change', e => renderPassbook(e.target.value)); const overlay = document.querySelector('#passbookOverlay'); const setOpen = open => { overlay.classList.toggle('open', open); overlay.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('modal-open', open); }; document.querySelector('#openPassbook').addEventListener('click', () => setOpen(true)); document.querySelector('#closePassbook').addEventListener('click', () => setOpen(false)); document.querySelectorAll('#downloadSummary,#downloadFull').forEach(x => x.addEventListener('click', () => window.print())); }
function bindClaims() { document.querySelector('#claimList').innerHTML = claims.map(c => `<a href="#/claim/${c.id}" class="claim-row"><div class="claim-row-main"><strong>${c.type}</strong><small>${c.date}</small>${c.note ? `<small class="claim-note">${c.note}</small>` : ''}</div><strong class="claim-amount">${c.amount}</strong><span class="claim-status ${statusClass(c.status)}"><b>●</b> ${c.status}</span><span class="claim-chevron">›</span></a>`).join(''); }
function bindClaimDetails(track) { document.querySelector('#downloadAcknowledgement').addEventListener('click', () => window.print()); document.querySelector('#requiredAction')?.addEventListener('click', () => alert('Demo: Please upload the requested supporting information to continue this claim.')); if (track) { const section = document.querySelector('#claimTracking'); section.focus(); requestAnimationFrame(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' })); } }

const serviceHistoryData = [
  { id: 'emp-1', employer: 'ABC Technologies Pvt. Ltd.', joined: '01 Apr 2023', exit: null, status: 'Active', duration: '2 years, 4 months', memberId: 'MH/BAN/XXXX/12345', establishmentId: 'MHBAN0001234000', office: 'Bandra, Mumbai', transferEligible: false },
  { id: 'emp-2', employer: 'XYZ Solutions Pvt. Ltd.', joined: '15 Jan 2020', exit: '15 Mar 2023', status: 'Completed', duration: '3 years, 2 months', memberId: 'MH/PUN/XXXX/67890', establishmentId: 'MHPUN0005678000', office: 'Pune', transferEligible: true, gapBeforeNext: '1 month' },
  { id: 'emp-3', employer: 'Startup Corp Pvt. Ltd.', joined: '10 Feb 2018', exit: '05 Jan 2020', status: 'Completed', duration: '1 year, 11 months', memberId: 'DL/NDL/XXXX/11223', establishmentId: 'DLNDL0009988000', office: 'New Delhi', transferEligible: true, gapBeforeNext: '10 days' }
];
const serviceHistoryState = { expanded: null, activeAi: null };

const aiAnswers = {
  totalService: 'Total service is the sum of all your completed and active employment periods. Gaps between jobs are excluded.',
  multipleIds: 'A new Member ID is generated by your new employer when you change jobs. Your UAN links all these IDs together.',
  transfer: 'Transferring older PF accounts consolidates your balance into your current active account, maximizing compounding interest.',
  gap: 'An employment gap is a period without an active EPF contribution. Short gaps are normal when switching jobs.',
  active: 'Your current active record is the one where your latest employer is depositing contributions.'
};

function renderServiceAiGuidance() {
  if (!serviceHistoryState.activeAi) return '';
  const text = aiAnswers[serviceHistoryState.activeAi];
  return `<div class="ai-guidance-panel mt-10"><div class="ai-guidance-header"><strong>✨ AI Guidance</strong><button class="text-action close-sh-ai">✕</button></div><p>${text}</p></div>`;
}

function serviceHistoryView() {
  const records = serviceHistoryData.map((emp, idx) => {
    const isExpanded = serviceHistoryState.expanded === emp.id;
    const isCurrent = emp.exit === null;
    let gapHtml = '';
    if (emp.gapBeforeNext) {
      gapHtml = `<div class="service-gap"><span>${emp.gapBeforeNext} between employment records</span></div>`;
    }

    let expandedHtml = '';
    if (isExpanded) {
      expandedHtml = `
        <div class="service-expanded-content">
          <dl class="service-details-grid">
            <div><dt>Date of joining</dt><dd>${emp.joined}</dd></div>
            <div><dt>Date of exit</dt><dd>${emp.exit || 'N/A'}</dd></div>
            <div><dt>Member ID</dt><dd>${emp.memberId}</dd></div>
            <div><dt>Establishment ID</dt><dd>${emp.establishmentId}</dd></div>
            <div><dt>PF Office</dt><dd>${emp.office}</dd></div>
          </dl>
          ${emp.transferEligible ? `
            <div class="transfer-hint">
              <strong>PF account from this employment may be eligible for transfer.</strong>
              <button class="secondary-button mt-10" onclick="alert('Demo: Redirecting to Transfer Request journey...')">Review transfer options →</button>
            </div>
          ` : ''}
        </div>
      `;
    }

    return `
      ${gapHtml}
      <article class="service-card ${isExpanded ? 'expanded' : ''}" data-id="${emp.id}">
        <div class="service-card-header">
          <div class="service-card-main">
            ${isCurrent ? `<span class="current-badge">Current employment</span>` : ''}
            <h3>${emp.employer}</h3>
            <p>${emp.joined} — ${emp.exit || 'Present'} · ${emp.duration}</p>
            <span class="status-badge ${isCurrent ? 'active' : 'completed'}">
              ${isCurrent ? '🟢 Active' : 'Completed'}
            </span>
            <small>Member ID: ${emp.memberId.replace(/([A-Z/]+XXXX\/)\d{2}/, '$1**')}</small>
          </div>
          <button class="expand-btn">${isExpanded ? '↑' : '↓'}</button>
        </div>
        ${expandedHtml}
      </article>
    `;
  }).join('');

  return `
    <div class="shell service-history-page">
      <div class="breadcrumb"><span>Member Portal</span><span>/</span><strong>Service History</strong></div>
      <header class="service-history-header">
        <div>
          <p class="eyebrow teal">MEMBER RECORD</p>
          <h1>Your Service History</h1>
          <p>See your employment journey, EPF service periods, and account details in one place.</p>
        </div>
      </header>

      <div class="service-history-grid">
        <div class="timeline-column">
          <section class="service-summary">
            <div class="summary-stats">
              <div><span>Total service</span><strong>7 years, 5 months</strong></div>
              <div><span>Employment records</span><strong>3 employers</strong></div>
            </div>
            <div class="active-employment-summary">
              <span>Currently employed at</span>
              <strong>ABC Technologies Pvt. Ltd.</strong>
              <small>Joined: Apr 2023</small>
            </div>
          </section>

          <section class="service-timeline">
            ${records}
          </section>
        </div>

        <aside class="ai-column">
          <div class="ai-context-panel">
            <p class="eyebrow teal">UNDERSTAND YOUR SERVICE</p>
            <h2>Not sure how your service records affect your EPF benefits?</h2>
            <p>The AI assistant can help explain your total recorded service, breaks between employment, and active accounts.</p>
            <div class="ai-chips">
              <button class="ai-chip" data-ai="totalService">✨ How is my total service calculated?</button>
              <button class="ai-chip" data-ai="multipleIds">✨ Why do I have multiple Member IDs?</button>
              <button class="ai-chip" data-ai="transfer">✨ Do I need to transfer my old PF account?</button>
              <button class="ai-chip" data-ai="gap">✨ What does this employment gap mean?</button>
              <button class="ai-chip" data-ai="active">✨ Which service record is currently active?</button>
            </div>
            ${renderServiceAiGuidance()}
          </div>
        </aside>
      </div>
    </div>
  `;
}

function bindServiceHistory() {
  document.querySelectorAll('.service-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const id = header.parentElement.dataset.id;
      serviceHistoryState.expanded = serviceHistoryState.expanded === id ? null : id;
      renderRoute();
    });
  });

  document.querySelectorAll('.ai-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      serviceHistoryState.activeAi = btn.dataset.ai === serviceHistoryState.activeAi ? null : btn.dataset.ai;
      renderRoute();
    });
  });

  document.querySelector('.close-sh-ai')?.addEventListener('click', () => {
    serviceHistoryState.activeAi = null;
    renderRoute();
  });
}

function renderRoute() { const rawRoute = location.hash.replace('#/', '') || 'dashboard'; const [route, query] = rawRoute.split('?'); const claimId = route.startsWith('claim/') ? route.split('/')[1] : null; const claim = claims.find(item => item.id === claimId) || claims[0]; app.innerHTML = route === 'passbook' ? passbookView() : route === 'claims' ? claimsView() : route === 'file-claim' ? fileClaimView() : route === 'claim-success' && claimFlow.submitted ? successView() : route === 'service-history' ? serviceHistoryView() : claimId ? claimDetailView(claim) : dashboardView(); document.querySelector('.nav-home').classList.toggle('active', route === 'dashboard'); if (route === 'passbook') bindPassbook(); if (route === 'claims' || route === 'file-claim') bindFlow(); if (route === 'claims') bindClaims(); if (route === 'service-history') bindServiceHistory(); if (claimId) bindClaimDetails(query === 'track'); if (mobileMenu.classList.contains('open')) setMobileMenu(false); if (route === 'dashboard') checkWelcomeMessage(); window.applyTranslations?.(); }
const menuToggle = document.querySelector('#menuToggle'); const mobileMenu = document.querySelector('#mobileMenu'); const backdrop = document.querySelector('#menuBackdrop'); const setMobileMenu = open => { mobileMenu.classList.toggle('open', open); backdrop.classList.toggle('open', open); mobileMenu.setAttribute('aria-hidden', String(!open)); menuToggle.setAttribute('aria-expanded', String(open)); if (open) document.querySelector('#closeMenu').focus(); }; menuToggle.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open'))); document.querySelector('#closeMenu').addEventListener('click', () => setMobileMenu(false)); backdrop.addEventListener('click', () => setMobileMenu(false)); document.addEventListener('keydown', e => { if (e.key === 'Escape') { const overlay = document.querySelector('#passbookOverlay'); if (overlay?.classList.contains('open')) { overlay.classList.remove('open'); document.body.classList.remove('modal-open'); } else setMobileMenu(false); } }); window.addEventListener('hashchange', renderRoute); if (!location.hash) location.hash = '#/dashboard'; else renderRoute();

// MULTILINGUAL DROPDOWN LOGIC
const langToggleBtn = document.getElementById('langToggleBtn');
const langDropdown = document.getElementById('langDropdown');
const langSecondary = document.getElementById('langSecondary');
const langPrimary = document.querySelector('.lang-primary');
const langMap = { 'తెలుగు': 'te', 'ಕನ್ನಡ': 'kn', 'हिन्दी': 'hi', 'English': 'en' };

if (langToggleBtn && langDropdown) {
  langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', () => {
    langDropdown.style.display = 'none';
  });
  langDropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (langSecondary) langSecondary.textContent = btn.textContent;
      if (window.setLanguage) window.setLanguage(langMap[btn.textContent] || 'en');
    });
  });
  if (langPrimary) {
    langPrimary.style.cursor = 'pointer';
    langPrimary.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.setLanguage) window.setLanguage('en');
    });
  }
  if (langSecondary) {
    langSecondary.style.cursor = 'pointer';
    langSecondary.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.setLanguage) window.setLanguage(langMap[langSecondary.textContent] || 'te');
    });
  }
}

// ONE-TIME NATIVE GEOLOCATION REQUEST
if (!sessionStorage.getItem('epfo_loc_requested')) {
  sessionStorage.setItem('epfo_loc_requested', 'true');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => { /* Silently receive coords */ },
      (err) => { /* Silently ignore errors */ }
    );
  }
}

// FEATURE 1: DISCLAIMER BANNER
const initDisclaimer = () => {
  const banner = document.getElementById('disclaimerBanner');
  if (!banner || sessionStorage.getItem('epfo_disclaimer_closed')) return;

  banner.style.display = 'block';

  const closeBanner = () => {
    banner.classList.add('fade-out');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 400); // match transition
    sessionStorage.setItem('epfo_disclaimer_closed', 'true');
  };

  document.getElementById('closeDisclaimer')?.addEventListener('click', closeBanner);

  // Auto hide after 5 seconds
  setTimeout(closeBanner, 5000);
};
initDisclaimer();

// FEATURE 2: LANGUAGE INFO POPUP
const initLangPopup = () => {
  const toggleBtn = document.getElementById('langToggleBtn');
  const popup = document.getElementById('langInfoPopup');
  const overlay = document.getElementById('langInfoPopupOverlay');
  const closeBtn = document.getElementById('closeLangPopup');
  const closeX = document.getElementById('closeLangPopupX');

  if (!toggleBtn || !popup || !overlay) return;

  const closePopup = () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  };

  // We add an intercept to the toggle button. Since the original click listener is still active,
  // we just trigger the popup alongside it.
  toggleBtn.addEventListener('click', () => {
    // Only show if they haven't seen it in this session (optional, but good UX)
    if (!sessionStorage.getItem('epfo_lang_popup_seen')) {
      popup.style.display = 'block';
      overlay.style.display = 'block';
      sessionStorage.setItem('epfo_lang_popup_seen', 'true');
    }
  });

  closeBtn?.addEventListener('click', closePopup);
  closeX?.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);
};
initLangPopup();

// ACCOUNT SWITCHER & PREREQUISITE POPUP LOGIC
const initDemoAccountSwitcher = () => {
  const accountSelect = document.getElementById('demoAccountSelect');
  if (!accountSelect) return;

  accountSelect.addEventListener('change', (e) => {
    currentDemoAccount = Number(e.target.value);

    // Update header Name and UAN
    const headerName = document.getElementById('headerMemberName');
    const headerUan = document.getElementById('headerUan');
    if (headerName) headerName.textContent = currentDemoAccount === 2 ? 'Demo Member 2' : 'Demo Member';
    if (headerUan) headerUan.textContent = currentDemoAccount === 2 ? 'UAN: XXXX XXXX 5932' : 'UAN: XXXX XXXX 4821';

    // Reset claim flow state so no bleed-over
    claimFlow.step = 1;
    claimFlow.selected = null;
    claimFlow.submitting = false;

    // Ensure popup is closed
    const popup = document.getElementById('prerequisitePopup');
    const overlay = document.getElementById('prerequisitePopupOverlay');
    if (popup) popup.style.display = 'none';
    if (overlay) overlay.style.display = 'none';

    // Re-render current route to reflect new state
    renderRoute();
  });
};
initDemoAccountSwitcher();

const initPrerequisitePopup = () => {
  const popup = document.getElementById('prerequisitePopup');
  const overlay = document.getElementById('prerequisitePopupOverlay');
  const closeBtn = document.getElementById('closePrerequisiteBtn');
  const goBtn = document.getElementById('goToKycBtn');

  if (!popup || !overlay) return;

  const closePopup = () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  };

  closeBtn?.addEventListener('click', closePopup);
  overlay?.addEventListener('click', closePopup);

  goBtn?.addEventListener('click', () => {
    alert("Demo Simulation: Redirecting to KYC Portal...");
    closePopup();
  });
};
initPrerequisitePopup();
function checkWelcomeMessage() {
  if (sessionStorage.getItem('epfoWelcomePlayed')) return;

  const isDesktopViewport = window.innerWidth >= 1024;

  const doPlay = () => {
    if (sessionStorage.getItem('epfoWelcomePlayed')) return;

    const utterance = voiceEngine.speakResponse("Hi Demo Member! I can help you with your EPF account, claims, or guide you through any step. How can I assist you today? Choose an option in the chat box, or give me a voice message by tapping the microphone.", "en");
    if (!utterance) return;

    let hasStarted = false;
    const voiceFab = document.getElementById('aiVoiceFab');
    const guideFab = document.getElementById('aiGuideFab');

    const clearHighlight = () => {
      if (voiceFab) voiceFab.classList.remove('welcome-highlight');
      if (guideFab) guideFab.classList.remove('welcome-highlight');
    };

    utterance.onstart = () => {
      hasStarted = true;
      sessionStorage.setItem('epfoWelcomePlayed', 'true');
      if (voiceFab) voiceFab.classList.add('welcome-highlight');
      if (guideFab) guideFab.classList.add('welcome-highlight');
    };

    utterance.onend = clearHighlight;
    utterance.onerror = (e) => {
      clearHighlight();
      if (!hasStarted) {
        setupInteractionFallback();
      }
    };

    // Safety timeout in case onstart doesn't fire but synthesis is active
    setTimeout(() => {
      if (!hasStarted && window.speechSynthesis && window.speechSynthesis.speaking) {
        hasStarted = true;
        sessionStorage.setItem('epfoWelcomePlayed', 'true');
        if (voiceFab) voiceFab.classList.add('welcome-highlight');
        if (guideFab) guideFab.classList.add('welcome-highlight');
        setTimeout(clearHighlight, 12000);
      } else if (!hasStarted && !isDesktopViewport) {
        setupInteractionFallback();
      }
    }, 500);
  };

  const setupInteractionFallback = () => {
    if (sessionStorage.getItem('epfoWelcomePlayed') || window.welcomeListenerAttached) return;
    window.welcomeListenerAttached = true;

    const interactionHandler = () => {
      document.removeEventListener('click', interactionHandler, true);
      document.removeEventListener('touchstart', interactionHandler, true);
      if (!sessionStorage.getItem('epfoWelcomePlayed')) {
        doPlay();
      }
    };

    document.addEventListener('click', interactionHandler, true);
    document.addEventListener('touchstart', interactionHandler, true);
  };

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    const isReady = typeof voiceEngine !== 'undefined' && typeof guideState !== 'undefined';

    // On desktop, we wait until the panel is fully open.
    // On mobile, the panel is closed by default, so we just need engine to be ready.
    const isDesktopReady = isReady && isDesktopViewport && guideState.isOpen && !guideState.isActive;
    const isMobileReady = isReady && !isDesktopViewport;

    if (isDesktopReady || isMobileReady) {
      clearInterval(interval);
      doPlay();
    } else if (attempts > 50) {
      clearInterval(interval);
    }
  }, 100);
}

// ==========================================
// AI GUIDANCE FOUNDATION
// ==========================================

const guideState = {
  isOpen: false,
  isActive: false,
  journeyId: null,
  stepIndex: 0,
  paused: false,
  mode: 'idle'
};

const guideRegistry = {
  intents: [
    { text: "▶ Continue guiding me", action: () => { if (typeof voiceEngine !== 'undefined') { voiceEngine.resumeGuideDeterministically(); } } },
    { text: "I want to apply for my PF", action: () => { if (typeof voiceEngine !== 'undefined') { voiceEngine.presentClaimTypeChoices(voiceEngine.agentContext.language || 'en'); } else { guideEngine.startJourney('file_pf_claim'); } guideEngine.closePanel(); } },
    { text: "Check my claim status", action: () => { location.hash = '#/claims'; guideEngine.closePanel(); } },
    { text: "Explain this page", action: () => { alert('Demo: Explaining current page...'); guideEngine.closePanel(); } }
  ],
  journeys: {
    'file_pf_claim': {
      id: 'file_pf_claim',
      title: 'File a Claim',
      steps: [
        {
          id: 'nav_claims',
          route: 'dashboard',
          targetId: 'nav.claims',
          instruction: "Let's start your claim. Select File Claim to continue.",
          completion: () => location.hash.includes('#/claims') || location.hash.includes('#/file-claim')
        },
        {
          id: 'start_claim',
          route: 'claims',
          targetId: 'claim.start',
          instruction: "Select + File a Claim to begin the process.",
          completion: () => location.hash.includes('#/file-claim')
        },
        {
          id: 'enter_bank',
          route: 'file-claim',
          targetId: 'claim.bankAccount',
          instruction: "First, enter the bank account linked to your EPFO record.",
          completion: () => claimFlow.bankVerified || (claimFlow.bankAccount && claimFlow.bankAccount.length >= 5)
        },
        {
          id: 'verify_bank',
          route: 'file-claim',
          targetId: 'claim.verifyBank',
          instruction: "Now select Verify Account. We'll check that this account matches your EPFO record.",
          completion: () => claimFlow.bankVerified
        },
        {
          id: 'bank_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Your bank account is verified. Click Continue.",
          completion: () => claimFlow.step > 1
        },
        {
          id: 'select_form19',
          route: 'file-claim',
          targetId: 'claim.type.form19',
          instruction: "Select PF Final Settlement, Form 19, if this is the claim you want to make.",
          completion: () => claimFlow.selected !== null
        },
        {
          id: 'claim_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Click Continue to review your claim details.",
          completion: () => claimFlow.step > 2
        },
        {
          id: 'details_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Review your eligible claim amount and click Continue.",
          completion: () => claimFlow.step > 3
        },
        {
          id: 'confirm_address',
          route: 'file-claim',
          targetId: 'claim.address.confirm',
          instruction: "Review your pre-filled address and check the box to confirm it's correct.",
          completion: () => claimFlow.addressConfirmed
        },
        {
          id: 'address_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Click Continue to proceed to declarations.",
          completion: () => claimFlow.step > 4
        },
        {
          id: 'agree_info',
          route: 'file-claim',
          targetId: 'claim.declaration.info',
          instruction: "Review and accept the declaration to confirm your information.",
          completion: () => claimFlow.agreedInfo
        },
        {
          id: 'agree_aadhaar',
          route: 'file-claim',
          targetId: 'claim.declaration.aadhaar',
          instruction: "Check this box to consent to Aadhaar-based authentication.",
          completion: () => claimFlow.agreedAadhaar
        },
        {
          id: 'decl_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Click Continue to verify your identity.",
          completion: () => claimFlow.step > 5
        },
        {
          id: 'send_otp',
          route: 'file-claim',
          targetId: 'claim.otp.send',
          instruction: "Click Send OTP to receive a code on your Aadhaar-linked mobile number.",
          completion: () => claimFlow.otpSent
        },
        {
          id: 'enter_otp',
          route: 'file-claim',
          targetId: 'claim.otp.input',
          instruction: "Enter the 6-digit OTP you received.",
          completion: () => claimFlow.otpValue && claimFlow.otpValue.length === 6
        },
        {
          id: 'otp_continue',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "Click Continue to finalize.",
          completion: () => claimFlow.step > 6
        },
        {
          id: 'submit_claim',
          route: 'file-claim',
          targetId: 'claim.continue',
          instruction: "You're all set. Click Validate & Submit Claim to finalize your request.",
          completion: () => claimFlow.submitting || location.hash.includes('#/claim-success')
        }
      ]
    },
    'file_form10c_claim': {
      id: 'file_form10c_claim',
      title: 'File a Form 10C Claim',
      steps: [
        { id: 'nav_claims', route: 'dashboard', targetId: 'nav.claims', instruction: "Let's start your claim. Select File Claim to continue.", completion: () => location.hash.includes('#/claims') || location.hash.includes('#/file-claim') },
        { id: 'start_claim', route: 'claims', targetId: 'claim.start', instruction: "Select + File a Claim to begin the process.", completion: () => location.hash.includes('#/file-claim') },
        { id: 'enter_bank', route: 'file-claim', targetId: 'claim.bankAccount', instruction: "First, enter the bank account linked to your EPFO record.", completion: () => claimFlow.bankVerified || (claimFlow.bankAccount && claimFlow.bankAccount.length >= 5) },
        { id: 'verify_bank', route: 'file-claim', targetId: 'claim.verifyBank', instruction: "Now select Verify Account. We'll check that this account matches your EPFO record.", completion: () => claimFlow.bankVerified },
        { id: 'bank_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Your bank account is verified. Click Continue.", completion: () => claimFlow.step > 1 },
        { id: 'select_form10c', route: 'file-claim', targetId: 'claim.type.form10c', instruction: "Select Pension Withdrawal Benefit, Form 10C, if this is the claim you want to make.", completion: () => claimFlow.selected !== null },
        { id: 'claim_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to review your claim details.", completion: () => claimFlow.step > 2 },
        { id: 'details_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Review your eligible claim amount and click Continue.", completion: () => claimFlow.step > 3 },
        { id: 'confirm_address', route: 'file-claim', targetId: 'claim.address.confirm', instruction: "Review your pre-filled address and check the box to confirm it's correct.", completion: () => claimFlow.addressConfirmed },
        { id: 'address_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to proceed to declarations.", completion: () => claimFlow.step > 4 },
        { id: 'agree_info', route: 'file-claim', targetId: 'claim.declaration.info', instruction: "Review and accept the declaration to confirm your information.", completion: () => claimFlow.agreedInfo },
        { id: 'agree_aadhaar', route: 'file-claim', targetId: 'claim.declaration.aadhaar', instruction: "Check this box to consent to Aadhaar-based authentication.", completion: () => claimFlow.agreedAadhaar },
        { id: 'decl_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to verify your identity.", completion: () => claimFlow.step > 5 },
        { id: 'send_otp', route: 'file-claim', targetId: 'claim.otp.send', instruction: "Click Send OTP to receive a code on your Aadhaar-linked mobile number.", completion: () => claimFlow.otpSent },
        { id: 'enter_otp', route: 'file-claim', targetId: 'claim.otp.input', instruction: "Enter the 6-digit OTP you received.", completion: () => claimFlow.otpValue && claimFlow.otpValue.length === 6 },
        { id: 'otp_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to finalize.", completion: () => claimFlow.step > 6 },
        { id: 'submit_claim', route: 'file-claim', targetId: 'claim.continue', instruction: "You're all set. Click Validate & Submit Claim to finalize your request.", completion: () => claimFlow.submitting || location.hash.includes('#/claim-success') }
      ]
    },
    'file_form31_claim': {
      id: 'file_form31_claim',
      title: 'File a Form 31 Claim',
      steps: [
        { id: 'nav_claims', route: 'dashboard', targetId: 'nav.claims', instruction: "Let's start your claim. Select File Claim to continue.", completion: () => location.hash.includes('#/claims') || location.hash.includes('#/file-claim') },
        { id: 'start_claim', route: 'claims', targetId: 'claim.start', instruction: "Select + File a Claim to begin the process.", completion: () => location.hash.includes('#/file-claim') },
        { id: 'enter_bank', route: 'file-claim', targetId: 'claim.bankAccount', instruction: "First, enter the bank account linked to your EPFO record.", completion: () => claimFlow.bankVerified || (claimFlow.bankAccount && claimFlow.bankAccount.length >= 5) },
        { id: 'verify_bank', route: 'file-claim', targetId: 'claim.verifyBank', instruction: "Now select Verify Account. We'll check that this account matches your EPFO record.", completion: () => claimFlow.bankVerified },
        { id: 'bank_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Your bank account is verified. Click Continue.", completion: () => claimFlow.step > 1 },
        { id: 'select_form31', route: 'file-claim', targetId: 'claim.type.form31', instruction: "Select PF Advance, Form 31, if this is the claim you want to make.", completion: () => claimFlow.selected !== null },
        { id: 'claim_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to choose your advance reason.", completion: () => claimFlow.step > 2 },
        { id: 'select_reason', route: 'file-claim', targetId: 'claim.reason', instruction: "Choose the reason for your PF advance.", completion: () => claimFlow.advanceReason !== '' },
        { id: 'reason_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue.", completion: () => claimFlow.step > 3 },
        { id: 'eligibility_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Review your eligibility and click Continue.", completion: () => claimFlow.step > 4 },
        { id: 'enter_amount', route: 'file-claim', targetId: 'claim.amount', instruction: "Enter the amount you wish to claim.", completion: () => claimFlow.advanceAmount !== '' },
        { id: 'amount_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue.", completion: () => claimFlow.step > 5 },
        { id: 'review_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Review your details and click Continue.", completion: () => claimFlow.step > 6 },
        { id: 'agree_info', route: 'file-claim', targetId: 'claim.declaration.info', instruction: "Review and accept the declaration to confirm your information.", completion: () => claimFlow.agreedInfo },
        { id: 'agree_aadhaar', route: 'file-claim', targetId: 'claim.declaration.aadhaar', instruction: "Check this box to consent to Aadhaar-based authentication.", completion: () => claimFlow.agreedAadhaar },
        { id: 'decl_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to verify your identity.", completion: () => claimFlow.step > 7 },
        { id: 'send_otp', route: 'file-claim', targetId: 'claim.otp.send', instruction: "Click Send OTP to receive a code on your Aadhaar-linked mobile number.", completion: () => claimFlow.otpSent },
        { id: 'enter_otp', route: 'file-claim', targetId: 'claim.otp.input', instruction: "Enter the 6-digit OTP you received.", completion: () => claimFlow.otpValue && claimFlow.otpValue.length === 6 },
        { id: 'otp_continue', route: 'file-claim', targetId: 'claim.continue', instruction: "Click Continue to finalize.", completion: () => claimFlow.step > 8 },
        { id: 'submit_claim', route: 'file-claim', targetId: 'claim.continue', instruction: "You're all set. Click Validate & Submit Claim to finalize your request.", completion: () => claimFlow.submitting || location.hash.includes('#/claim-success') }
      ]
    }
  }
};

const guideEngine = {
  interval: null,

  init() {
    this.injectUI();
    this.bindEvents();

    const isDesktopViewport = window.innerWidth >= 1200;
    const isHomepage = location.hash === '' || location.hash === '#/' || location.hash.includes('dashboard');

    if (isDesktopViewport && isHomepage) {
      guideState.isOpen = true;
      document.getElementById('aiGuidePanel').classList.add('open');
    }
  },

  injectUI() {
    const ui = document.createElement('div');
    ui.innerHTML = `
      <div class="desktop-ai-assistant-area" id="desktopAiAssistantArea">
        <div class="ai-guide-panel" id="aiGuidePanel">
          <div class="ai-guide-panel-header">
            <div class="ai-guide-header-brand">
              <span class="bot-icon">✨</span>
              <div>
                <h3>EPFO Guide</h3>
                <span class="online-status">● Online</span>
              </div>
            </div>
            <button class="ai-guide-panel-close" id="aiGuideClose">✕</button>
          </div>
          <div class="ai-guide-panel-body">
            <div class="ai-chat-bubble bot-bubble">
              <strong>Hi Demo Member! 👋</strong>
              <p>I can help you with your EPF account, claims, or guide you through any step.<br>How can I assist you today?</p>
            </div>
            <div class="ai-intent-list" id="aiIntentList">
              ${guideRegistry.intents.map((intent, i) => {
      let btnText = intent.text;
      if (btnText.includes('Continue guiding')) {
        return `<div class="continue-guide-wrapper"><button class="ai-intent-btn continue-btn" data-intent="${i}">▶ Continue guiding me</button><small class="continue-hint">ⓘ Resume guidance from where you left</small></div>`;
      }
      return `<button class="ai-intent-btn" data-intent="${i}">${btnText.replace(/^[“”]/, '').replace(/[“”]$/, '')}</button>`;
    }).join('')}
            </div>
          </div>
          <div class="ai-guide-panel-footer desktop-only-footer">
            <div class="ai-input-wrapper">
              <input type="text" placeholder="Type your message..." data-i18n-placeholder="chat.typeMsg" disabled>
              <button class="ai-dummy-mic">🎙️</button>
            </div>
            <small class="ai-mic-hint">🎙️ <span data-i18n="chat.clickMic">Click mic to speak</span></small>
          </div>
        </div>
        <div class="ai-guide-controls">
          <button class="ai-voice-fab" id="aiVoiceFab" title="Voice Guide">🎙️</button>
          <button class="ai-guide-fab" id="aiGuideFab">✨ <span data-i18n="chat.askGuide">Ask EPFO Guide</span></button>
        </div>
      </div>
      <div class="ai-spotlight-overlay" id="aiSpotlightOverlay"></div>
      <div class="ai-spotlight-ring" id="aiSpotlightRing"></div>
      <div class="ai-cursor" id="aiCursor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="#e17e00" stroke="#fff" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="ai-guide-bubble" id="aiGuideBubble">
        <div class="ai-bubble-header">
          <span id="aiBubbleStep">Step 1 of X</span>
          <div class="ai-bubble-controls">
            <button id="aiBubblePause" data-i18n="chat.pause">⏸ Pause</button>
            <button id="aiBubbleStop" data-i18n="chat.stop">✕ Stop</button>
          </div>
        </div>
        <div class="ai-bubble-content" id="aiBubbleContent"></div>
      </div>
      <div class="ai-voice-feedback" id="aiVoiceFeedback">
        <h4 id="aiVoiceStatus">Listening...</h4>
        <p id="aiVoiceMessage">Speak now.</p>
        <div class="ai-voice-feedback-transcript" id="aiVoiceTranscript" style="display:none"></div>
        <button id="aiVoiceStopBtn" style="display:none">Stop Recording</button>
      </div>
    `;
    document.body.appendChild(ui);
  },

  bindEvents() {
    document.getElementById('aiGuideFab').addEventListener('click', () => this.togglePanel());
    document.getElementById('aiGuideClose').addEventListener('click', () => this.closePanel());
    document.querySelectorAll('.ai-intent-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const intent = guideRegistry.intents[e.target.dataset.intent];
        if (intent.journey) this.startJourney(intent.journey);
        if (intent.action) intent.action();
      });
    });

    document.getElementById('aiBubblePause').addEventListener('click', () => this.togglePause());
    document.getElementById('aiBubbleStop').addEventListener('click', () => this.stopGuidance());
  },

  togglePanel() {
    guideState.isOpen = !guideState.isOpen;
    document.getElementById('aiGuidePanel').classList.toggle('open', guideState.isOpen);
  },

  closePanel() {
    guideState.isOpen = false;
    document.getElementById('aiGuidePanel').classList.remove('open');
  },

  startJourney(journeyId) {
    this.closePanel();
    guideState.isActive = true;
    guideState.journeyId = journeyId;
    guideState.stepIndex = 0;
    guideState.paused = false;

    document.getElementById('aiSpotlightOverlay').classList.add('active');
    document.getElementById('aiSpotlightRing').classList.add('active');
    document.getElementById('aiCursor').classList.add('active');
    document.getElementById('aiGuideBubble').classList.add('active');

    this.startTick();
  },

  resumeJourneyFromPosition(journeyId, resolvedStepIndex) {
    this.closePanel();

    // Safely clear active guide without wiping journeyId before re-setting
    if (this.interval) clearInterval(this.interval);
    guideState.paused = false;

    const overlay = document.getElementById('aiSpotlightOverlay');
    const ring = document.getElementById('aiSpotlightRing');
    const cursor = document.getElementById('aiCursor');
    const bubble = document.getElementById('aiGuideBubble');
    const pauseBtn = document.getElementById('aiBubblePause');
    if (overlay) { overlay.classList.remove('active'); overlay.style.opacity = ''; }
    if (ring) { ring.classList.remove('active'); ring.style.opacity = ''; }
    if (cursor) { cursor.classList.remove('active'); cursor.style.opacity = ''; }
    if (bubble) { bubble.classList.remove('active'); bubble.style.opacity = ''; }
    if (pauseBtn) pauseBtn.textContent = '⏸ Pause';

    // Now set up the new position and activate
    guideState.isActive = true;
    guideState.journeyId = journeyId;
    guideState.stepIndex = resolvedStepIndex;
    guideState.paused = false;

    if (overlay) overlay.classList.add('active');
    if (ring) ring.classList.add('active');
    if (cursor) cursor.classList.add('active');
    if (bubble) bubble.classList.add('active');

    this.startTick();
  },

  stopGuidance() {
    // Preserve context before clearing active state
    voiceEngine.saveLastContext();

    guideState.isActive = false;
    guideState.journeyId = null;
    guideState.paused = false;

    const overlay = document.getElementById('aiSpotlightOverlay');
    const ring = document.getElementById('aiSpotlightRing');
    const cursor = document.getElementById('aiCursor');
    const bubble = document.getElementById('aiGuideBubble');
    const pauseBtn = document.getElementById('aiBubblePause');

    if (overlay) { overlay.classList.remove('active'); overlay.style.opacity = ''; }
    if (ring) { ring.classList.remove('active'); ring.style.opacity = ''; }
    if (cursor) { cursor.classList.remove('active'); cursor.style.opacity = ''; }
    if (bubble) { bubble.classList.remove('active'); bubble.style.opacity = ''; }
    if (pauseBtn) pauseBtn.textContent = '⏸ Pause';

    if (this.interval) clearInterval(this.interval);
  },

  togglePause() {
    guideState.paused = !guideState.paused;
    const pauseBtn = document.getElementById('aiBubblePause');
    const cursor = document.getElementById('aiCursor');
    const ring = document.getElementById('aiSpotlightRing');
    const overlay = document.getElementById('aiSpotlightOverlay');
    const content = document.getElementById('aiBubbleContent');
    const stepLabel = document.getElementById('aiBubbleStep');

    if (guideState.paused) {
      pauseBtn.textContent = '▶ Resume';
      if (cursor) cursor.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
      if (overlay) overlay.style.opacity = '0';

      const journey = guideRegistry.journeys[guideState.journeyId];
      const totalSteps = journey ? journey.steps.length : 'X';

      stepLabel.textContent = '🤖 EPFO Guide';
      content.innerHTML = `<div style="margin-bottom: 4px; font-weight: bold;">Guidance paused</div>You're currently on Step ${guideState.stepIndex + 1} of ${totalSteps}.`;
    } else {
      pauseBtn.textContent = '⏸ Pause';
      if (cursor) cursor.style.opacity = '';
      if (ring) ring.style.opacity = '';
      if (overlay) overlay.style.opacity = '';

      this.tick();
    }
  },

  startTick() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 200);
  },

  tick() {
    if (!guideState.isActive || guideState.paused) return;

    const journey = guideRegistry.journeys[guideState.journeyId];
    if (!journey) return this.stopGuidance();

    // Evaluate the active step reactively on every tick
    let activeStepIndex = -1;
    let evalLogs = [];
    for (let i = 0; i < journey.steps.length; i++) {
      let result = !journey.steps[i].completion || !journey.steps[i].completion();
      if (journey.id === 'file_form31_claim') {
        evalLogs.push(`Step ${i} (${journey.steps[i].id}): ${!result}`);
      }
      if (result) {
        activeStepIndex = i;
        break;
      }
    }

    if (journey.id === 'file_form31_claim') {
      console.log(`[Form31 Guide] Evaluated steps. activeStepIndex=${activeStepIndex}. Details:`, evalLogs);
    }

    if (activeStepIndex === -1) {
      console.log('[DEBUG] Guide stopped: activeStepIndex is -1. All steps completed.');
      return this.stopGuidance(); // All steps completed
    }

    guideState.stepIndex = activeStepIndex;
    if (activeStepIndex !== guideState._lastStepIndex) {
      if (journey.id === 'file_form31_claim') {
        if (guideState._lastStepIndex !== undefined && guideState._lastStepIndex !== -1) {
          console.log(`[Form31 Guide] Application transition detected`);
        }
        console.log(`[Form31 Guide] Next step resolved: step ${activeStepIndex}`);
        console.log(`[Form31 Guide] Step ${activeStepIndex} active`);
        console.log(`[Form31 Guide] Waiting for target`);
      }
      guideState._lastStepIndex = activeStepIndex;
    }
    const step = journey.steps[guideState.stepIndex];

    const targetEl = document.querySelector(`[data-guide-target="${step.targetId}"]`);
    const cursor = document.getElementById('aiCursor');
    const ring = document.getElementById('aiSpotlightRing');
    const overlay = document.getElementById('aiSpotlightOverlay');
    const bubble = document.getElementById('aiGuideBubble');

    if (!targetEl) {
      console.log(`[DEBUG] Guide hidden: targetEl ${step.targetId} not found for step ${step.id}`);
      // Target is not on screen, hide elements temporarily
      if (cursor) cursor.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
      if (overlay) overlay.style.opacity = '0';
      if (bubble) bubble.style.opacity = '0';
      return;
    } else {
      if (journey.id === 'file_form31_claim' && targetEl !== guideState._lastTarget) {
        console.log(`[Form31 Guide] Target found`);
        console.log(`[Guide Resume] Target found: ${targetEl.id}`);
        console.log(`[Form31 Guide] Cursor resumed`);
        guideState._lastTarget = targetEl;
      }
      // Restore opacity allowing CSS classes to take over
      if (cursor) cursor.style.opacity = '';
      if (ring) ring.style.opacity = '';
      if (overlay) overlay.style.opacity = '';
      if (bubble) bubble.style.opacity = '';
    }

    const rect = targetEl.getBoundingClientRect();

    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    ring.style.top = (rect.top - 4) + 'px';
    ring.style.left = (rect.left - 4) + 'px';
    ring.style.width = (rect.width + 8) + 'px';
    ring.style.height = (rect.height + 8) + 'px';

    cursor.style.transform = `translate(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2 + 10}px)`;

    document.getElementById('aiBubbleStep').textContent = `Step ${guideState.stepIndex + 1} of ${journey.steps.length}`;
    document.getElementById('aiBubbleContent').innerHTML = step.instruction;

    let bTop = rect.bottom + 20;
    let bLeft = rect.left;
    if (bTop + 150 > window.innerHeight) {
      bTop = rect.top - 160;
    }
    if (bTop < 0) bTop = 20;

    if (bLeft + 280 > window.innerWidth) {
      bLeft = window.innerWidth - 300;
    }

    bubble.style.transform = `translate(${bLeft}px, ${bTop}px)`;
  }
};

const voiceEngine = {
  mediaRecorder: null,
  audioChunks: [],
  isRecording: false,

  agentContext: {
    language: 'en',
    pendingAction: null,
    selectedClaimType: null
  },

  init() {
    this.bindEvents();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  },

  bindEvents() {
    const fab = document.getElementById('aiVoiceFab');
    const stopBtn = document.getElementById('aiVoiceStopBtn');
    if (fab) fab.addEventListener('click', () => this.toggleRecording());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stopRecording());
  },

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  },

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => this.processAudio();

      this.mediaRecorder.start();
      this.isRecording = true;
      this.updateUI('listening');
    } catch (err) {
      this.updateUI('error', 'Microphone access denied.');
    }
  },

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      this.isRecording = false;
      this.updateUI('processing');
    }
  },

  saveLastContext() {
    // Deprecated: Context is now dynamically resolved via resolveCurrentGuideContext
  },

  resolveCurrentGuideContext() {
    let resolvedJourneyId = null;
    let resolvedStepIndex = -1;

    // Step 1: Determine journey from the most reliable signals first
    // Priority A: claimFlow.selected tells us exactly which form was selected
    if (location.hash.includes('#/file-claim') && typeof claimFlow !== 'undefined') {
      if (claimFlow.selected === 0) {
        resolvedJourneyId = 'file_pf_claim';
      } else if (claimFlow.selected === 1) {
        resolvedJourneyId = 'file_form10c_claim';
      } else if (claimFlow.selected === 2) {
        resolvedJourneyId = 'file_form31_claim';
      } else if (claimFlow.selected === null && guideState.journeyId) {
        // User is on file-claim but hasn't selected yet — use last known journey from guideState
        resolvedJourneyId = guideState.journeyId;
      }
    } else if (location.hash.includes('#/claims')) {
      // On claims listing page — heading towards a claim
      resolvedJourneyId = guideState.journeyId || 'file_pf_claim';
    } else if (location.hash.includes('#/claim-success')) {
      return null; // Completed — nothing to resume
    } else if (location.hash.includes('#/dashboard') || location.hash === '' || location.hash === '#/') {
      // On dashboard — if there's an active journey, resume it; otherwise nothing to resolve
      if (guideState.journeyId) {
        resolvedJourneyId = guideState.journeyId;
      } else {
        return null;
      }
    }

    if (!resolvedJourneyId) return null;

    const journey = guideRegistry.journeys[resolvedJourneyId];
    if (!journey) return null;

    // Step 2: Find the first incomplete step by evaluating completions against live DOM/state
    // A step is incomplete if its completion() returns falsy
    for (let i = 0; i < journey.steps.length; i++) {
      const step = journey.steps[i];
      // A step is "done" if it has a completion fn AND it returns true
      const isDone = step.completion && step.completion();
      if (!isDone) {
        resolvedStepIndex = i;
        break;
      }
    }

    // If all steps are done, return last step so user can see where they are
    if (resolvedStepIndex === -1 && journey.steps.length > 0) {
      resolvedStepIndex = journey.steps.length - 1;
    }

    console.log(`[Guide Resume] resolveCurrentGuideContext: journey=${resolvedJourneyId} step=${resolvedStepIndex} ("${journey.steps[resolvedStepIndex]?.instruction || 'n/a'}")`);

    return {
      journeyId: resolvedJourneyId,
      stepIndex: resolvedStepIndex,
      instruction: resolvedStepIndex !== -1 ? journey.steps[resolvedStepIndex].instruction : '',
      targetId: resolvedStepIndex !== -1 ? journey.steps[resolvedStepIndex].targetId : ''
    };
  },

  getAppContext() {
    let currentInstruction = '';
    let currentTarget = '';
    let totalSteps = 0;

    let activeJourney = guideState.journeyId;
    let activeStep = guideState.stepIndex !== -1 ? guideState.stepIndex : null;

    if (guideState.isActive && !guideState.paused) {
      if (activeJourney && guideRegistry.journeys[activeJourney]) {
        const j = guideRegistry.journeys[activeJourney];
        totalSteps = j.steps.length;
        if (activeStep !== null && activeStep >= 0 && activeStep < totalSteps) {
          currentInstruction = j.steps[activeStep].instruction;
          currentTarget = j.steps[activeStep].targetId;
        }
      }
    } else {
      // Guide is paused or stopped. Dynamically resolve context based on actual portal state
      const resolved = this.resolveCurrentGuideContext();
      if (resolved) {
        activeJourney = resolved.journeyId;
        activeStep = resolved.stepIndex;
        currentInstruction = resolved.instruction;
        currentTarget = resolved.targetId;
        if (guideRegistry.journeys[activeJourney]) {
          totalSteps = guideRegistry.journeys[activeJourney].steps.length;
        }

        if (resolved.journeyId === 'file_form31_claim') {
          console.log(`[Guide Resume] Voice request received`);
          console.log(`[Guide Resume] Current route/page: ${location.hash.replace('#/', '') || 'dashboard'}`);
          console.log(`[Guide Resume] Current claim type: FORM_31`);
          console.log(`[Guide Resume] Stored journey state: ${this.agentContext.lastJourneyStep}`);
          console.log(`[Guide Resume] Detected journey: ${resolved.journeyId}`);
          console.log(`[Guide Resume] Detected step: ${resolved.stepIndex}`);
          console.log(`[Guide Resume] Guide status: ${guideState.isActive ? (guideState.paused ? 'paused' : 'active') : 'stopped'}`);
        }
      } else {
        // Fallback if we can't resolve (e.g. on dashboard)
        activeJourney = activeJourney;
        currentInstruction = currentInstruction;
        currentTarget = currentTarget;
        activeStep = activeStep;
      }
    }

    const currentRoute = location.hash.replace('#/', '') || 'dashboard';
    const currentPage = document.querySelector('h1')?.innerText || currentRoute;

    return {
      currentRoute: currentRoute,
      currentPage: currentPage,
      activeJourney: activeJourney,
      currentStep: activeStep !== null ? activeStep + 1 : null,
      totalSteps: totalSteps,
      guideStatus: guideState.isActive ? (guideState.paused ? 'paused' : 'active') : 'stopped',
      currentInstruction: currentInstruction,
      currentTarget: currentTarget,
      ...this.agentContext
    };
  },

  async processAudio() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'mic-record.webm');
    formData.append('context', JSON.stringify(this.getAppContext()));

    try {
      const res = await fetch('/api/voice-command', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        this.updateUI('understood', data);
        if (data.shouldSpeak) this.speakResponse(data.response, data.language);
        this.executeAgentAction(data);
      } else {
        this.updateUI('error', "I couldn't hear that clearly. Please try again.");
      }
    } catch (err) {
      console.error('VOICE PIPELINE FRONTEND ERROR:');
      console.error('Request URL: http://localhost:4173/api/voice-command');
      console.error('Actual JavaScript error:', err);
      this.updateUI('error', "Network error. Please check your connection.");
    }
  },

  speakResponse(text, language) {
    if (!text || !window.speechSynthesis) return null;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (language === 'hi' || language === 'hinglish') {
      const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.toLowerCase().includes('hindi'));
      if (hiVoice) utterance.voice = hiVoice;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  presentClaimTypeChoices(language) {
    console.log('[Guide] Entering claim type selection');
    // Stop and reset current journey completely
    guideEngine.stopGuidance();
    console.log('[Guide] Previous journey cleared');

    // Reset claim flow step explicitly to show the grid
    claimFlow.step = 2;
    claimFlow.selected = null;
    this.agentContext.pendingAction = 'CHOOSE_CLAIM_TYPE';
    this.agentContext.selectedClaimType = null;

    guideState.mode = 'claim_type_selection';

    const renderAndExplain = () => {
      renderRoute();
      console.log('[Guide] Claim options rendered');

      const grid = document.querySelector('.claim-type-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Point to grid generally, not auto selecting
      guideEngine.pointToTarget('claim.type.form19');
      console.log('[Guide] Cursor activated on claim options');

      const langKey = (language === 'hi' || language === 'hinglish') ? 'hinglish' : 'en';
      const explainer = claimTypeExplainer[langKey];

      document.getElementById('aiBubbleMessage').innerHTML = `<div style="font-size:14px; line-height:1.4">${explainer.text}</div>`;
      console.log('[Guide] Deterministic explanation displayed');

      this.speakResponse(explainer.voice, language);
      console.log('[Guide] TTS triggered');
      console.log('[Guide] Waiting for FORM_19 / FORM_10C / FORM_31');
    };

    if (!location.hash.includes('#/file-claim')) {
      location.hash = '#/file-claim';
      setTimeout(renderAndExplain, 300);
    } else {
      renderAndExplain();
    }
  },

  resumeGuideDeterministically() {
    console.log('[Guide Resume] Deterministic catch-up initiated via UI Button');
    guideEngine.closePanel();

    // Use voiceEngine's resolver (where it lives)
    const resolved = this.resolveCurrentGuideContext();
    const lang = this.agentContext.language || 'en';

    if (resolved && resolved.journeyId && resolved.stepIndex !== -1) {
      console.log(`[Guide Resume] Resolved: journey=${resolved.journeyId} step=${resolved.stepIndex}`);

      const msgText = lang === 'hinglish'
        ? "Theek hai, mujhe pata chal gaya aap kis step par hain. Main yahin se guide karta hoon."
        : "I found where you are. I'll continue guiding you from here.";
      this.updateUI('understood', { response: msgText, language: lang });
      this.speakResponse(msgText, lang);

      // Small delay so the chat message is visible before cursor appears
      setTimeout(() => {
        guideEngine.resumeJourneyFromPosition(resolved.journeyId, resolved.stepIndex);
      }, 800);
      setTimeout(() => this.updateUI('idle'), 4500);
    } else {
      console.log('[Guide Resume] Could not resolve current step');
      const msgText = lang === 'hinglish'
        ? "Main samajh nahi paaya ki aap abhi kis step par hain. Kripya claim section mein jaayein aur wahan se guide shuru karein."
        : "I couldn't confidently identify the current step. Go back to the claim section and I'll guide you from there.";
      this.updateUI('understood', { response: msgText, language: lang });
      this.speakResponse(msgText, lang);
      setTimeout(() => this.updateUI('idle'), 6000);
    }
  },

  executeAgentAction(data) {
    const { action, journeyId, claimType } = data;

    setTimeout(() => this.updateUI('idle'), 5000);

    switch (action) {
      case 'START_JOURNEY':
        if (claimType) {
          claimFlow.selected = claimType === 'FORM_19' ? 0 : claimType === 'FORM_10C' ? 1 : 2;
          this.agentContext.selectedClaimType = claimType;
        }
        if (guideState.mode === 'claim_type_selection') {
          guideState.mode = 'idle';
          console.log('[Guide] Resetting step index');
          claimFlow.step = 1;
          renderRoute();
        }
        if (journeyId && guideRegistry.journeys[journeyId]) {
          console.log(`[Guide] Starting journey from first step`);
          guideEngine.startJourney(journeyId);
        }
        break;
      case 'CHOOSE_CLAIM_TYPE':
        this.presentClaimTypeChoices(data.language);
        break;
      case 'GUIDE_NEXT_STEP':
        if (journeyId === 'file_form31_claim') {
          console.log(`[Guide Resume] Resuming journey dynamically from state`);
        }
        if (!guideState.isActive) {
          if (journeyId && guideRegistry.journeys[journeyId]) {
            // Restart from context if available
            guideEngine.startJourney(journeyId);
          }
        } else if (guideState.paused) {
          guideEngine.togglePause();
        }
        break;
      case 'EXPLAIN_CURRENT_FIELD':
      case 'EXPLAIN_CURRENT_PAGE':
      case 'ANSWER_GENERAL_QUESTION':
        // The bubble speaks the response. We don't advance the journey or unpause automatically.
        break;
      case 'PAUSE_GUIDANCE':
        if (guideState.isActive && !guideState.paused) guideEngine.togglePause();
        break;
      case 'RESUME_GUIDANCE':
        if (guideState.isActive && guideState.paused) guideEngine.togglePause();
        break;
      case 'STOP_GUIDANCE':
        guideEngine.stopGuidance();
        break;
      case 'TRACK_CLAIM':
        window.location.hash = '#/claims';
        break;
      case 'UNKNOWN':
      default:
        break;
    }
  },

  updateUI(state, data = null) {
    const fab = document.getElementById('aiVoiceFab');
    const panel = document.getElementById('aiVoiceFeedback');
    const status = document.getElementById('aiVoiceStatus');
    const msg = document.getElementById('aiVoiceMessage');
    const transcript = document.getElementById('aiVoiceTranscript');
    const stopBtn = document.getElementById('aiVoiceStopBtn');

    if (!fab || !panel) return;

    if (state === 'idle') {
      fab.classList.remove('listening');
      panel.classList.remove('active');
    } else if (state === 'listening') {
      fab.classList.add('listening');
      panel.classList.add('active');
      status.innerText = 'Listening...';
      msg.innerText = 'Speak now.';
      transcript.style.display = 'none';
      stopBtn.style.display = 'block';
    } else if (state === 'processing') {
      fab.classList.remove('listening');
      status.innerText = 'Processing...';
      msg.innerText = 'Analyzing your request...';
      stopBtn.style.display = 'none';
    } else if (state === 'understood') {
      status.innerText = 'Understood';
      msg.innerText = data.response;
      transcript.innerText = '“' + data.transcript + '”';
      transcript.style.display = 'block';
    } else if (state === 'error') {
      status.innerText = 'Error';
      msg.innerText = data;
      setTimeout(() => this.updateUI('idle'), 4000);
    }
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  guideEngine.init();
  voiceEngine.init();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    guideEngine.init();
    voiceEngine.init();
  });
}

// FEATURE: DEMO WARNING BANNER LOGIC
const checkDemoWarning = () => {
  const demoBanner = document.getElementById('demoWarningBanner');
  if (demoBanner) {
    const rawRoute = location.hash.replace('#/', '') || 'dashboard';
    const [route] = rawRoute.split('?');
    // Display only when actively in a filing flow (Form 19, 10C, 31 use 'file-claim')
    demoBanner.style.display = route === 'file-claim' ? 'flex' : 'none';
  }
};
window.addEventListener('hashchange', checkDemoWarning);
// Check on initial load too
setTimeout(checkDemoWarning, 0);

// ==========================================
// FEATURE: IDLE HELP REMINDER
// ==========================================

const IDLE_HELP_DELAY = 7000;         // ms before showing the reminder
const IDLE_HELP_COOLDOWN = 30000;     // ms before it can fire again
const IDLE_HELP_AUTO_DISMISS = 9000;  // ms before popup auto-dismisses

const idleHelp = {
  _timer: null,
  _autoDismissTimer: null,
  _highlightTimer: null,
  _lastFired: 0,
  _popupEl: null,

  // ---- Guards ----

  canShow() {
    // Guide actively guiding
    if (typeof guideState !== 'undefined' && guideState.isActive) return false;
    // Voice recording active
    if (typeof voiceEngine !== 'undefined' && voiceEngine.isRecording) return false;
    // Speech synthesis speaking (welcome message / TTS ongoing)
    if (window.speechSynthesis && window.speechSynthesis.speaking) return false;
    // Chat panel is open and user is interacting with it
    const panel = document.getElementById('aiGuidePanel');
    if (panel && panel.classList.contains('open') && guideState.isOpen) return false;
    // Prerequisite modal is visible
    const prereqPopup = document.getElementById('prerequisitePopup');
    if (prereqPopup && prereqPopup.style.display !== 'none') return false;
    // Lang popup is visible
    const langPopup = document.getElementById('langInfoPopup');
    if (langPopup && langPopup.style.display !== 'none') return false;
    // Cooldown not yet elapsed
    if (Date.now() - this._lastFired < IDLE_HELP_COOLDOWN) return false;
    return true;
  },

  // ---- Timer management ----

  resetTimer() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.show(), IDLE_HELP_DELAY);
  },

  stopTimer() {
    clearTimeout(this._timer);
    this._timer = null;
  },

  // ---- Highlight helpers ----

  addHighlight() {
    const voiceFab = document.getElementById('aiVoiceFab');
    const guideFab = document.getElementById('aiGuideFab');
    if (voiceFab) voiceFab.classList.add('welcome-highlight');
    if (guideFab) guideFab.classList.add('welcome-highlight');
  },

  removeHighlight() {
    const voiceFab = document.getElementById('aiVoiceFab');
    const guideFab = document.getElementById('aiGuideFab');
    if (voiceFab) voiceFab.classList.remove('welcome-highlight');
    if (guideFab) guideFab.classList.remove('welcome-highlight');
  },

  // ---- Popup ----

  createPopup() {
    // Remove any stale popup
    const old = document.getElementById('idleHelpPopup');
    if (old) old.remove();

    const el = document.createElement('div');
    el.id = 'idleHelpPopup';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = [
      'position:fixed',
      'bottom:90px',
      'right:24px',
      'z-index:9997',
      'background:#fff',
      'border:1px solid #dce4e1',
      'border-top:3px solid #1e3a5f',
      'border-radius:10px',
      'box-shadow:0 6px 24px rgba(22,50,45,0.18)',
      'padding:14px 16px 12px',
      'max-width:280px',
      'min-width:220px',
      'font-family:inherit',
      'color:#1e3a5f',
      'animation:idle-popup-in 0.2s ease-out'
    ].join(';');

    el.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
        <div>
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.3px;">Need help?</p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#2c5282;">You need any help? Ask me by tapping the mic or click Ask EPFO Guide. I'll guide you from here.</p>
        </div>
        <button id="idleHelpClose" aria-label="Close help reminder" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6b7c93;padding:0;margin-top:-2px;flex-shrink:0;">×</button>
      </div>
    `;

    document.body.appendChild(el);
    this._popupEl = el;

    // Close button
    document.getElementById('idleHelpClose').addEventListener('click', () => this.hide());
    return el;
  },

  // ---- Show / Hide ----

  show() {
    if (!this.canShow()) return;
    this._lastFired = Date.now();

    this.addHighlight();
    this.createPopup();

    // Browser TTS — purely frontend, no external API
    try {
      if (typeof voiceEngine !== 'undefined' && window.speechSynthesis) {
        const utterance = voiceEngine.speakResponse(
          "You need any help? Ask me by tapping the mic or click Ask EPFO Guide. I'll guide you from here.",
          'en'
        );
        if (utterance) {
          utterance.onend = () => this.removeHighlight();
          utterance.onerror = () => this.removeHighlight();
        }
      }
    } catch (e) {
      // Fail silently — popup is still shown
    }

    // Auto-dismiss
    clearTimeout(this._autoDismissTimer);
    this._autoDismissTimer = setTimeout(() => this.hide(), IDLE_HELP_AUTO_DISMISS);

    // Safety: always remove highlight after a maximum duration
    clearTimeout(this._highlightTimer);
    this._highlightTimer = setTimeout(() => this.removeHighlight(), 12000);
  },

  hide() {
    clearTimeout(this._autoDismissTimer);
    clearTimeout(this._highlightTimer);
    this.removeHighlight();
    if (this._popupEl) {
      this._popupEl.remove();
      this._popupEl = null;
    }
  },

  // ---- Init ----

  init() {
    // Activity events that should reset the timer
    const activityEvents = ['click', 'keydown', 'touchstart', 'scroll', 'change', 'input'];
    const onActivity = () => {
      // If popup is visible, hide it when user resumes activity
      if (this._popupEl) this.hide();
      this.resetTimer();
    };

    activityEvents.forEach(ev => {
      document.addEventListener(ev, onActivity, { passive: true, capture: true });
    });

    // When navigation happens, reset timer (new page = fresh session)
    window.addEventListener('hashchange', () => {
      this.hide();
      this.resetTimer();
    });

    // Start the initial timer
    this.resetTimer();
  }
};

// Add popup slide-in animation (tiny, isolated keyframe)
(function injectIdleHelpStyles() {
  if (document.getElementById('idleHelpStyles')) return;
  const s = document.createElement('style');
  s.id = 'idleHelpStyles';
  s.textContent = `@keyframes idle-popup-in {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }`;
  document.head.appendChild(s);
})();

// Start idle help reminder after engines are ready
(function startIdleHelp() {
  const tryStart = () => {
    if (typeof guideState !== 'undefined' && typeof voiceEngine !== 'undefined') {
      idleHelp.init();
    } else {
      setTimeout(tryStart, 300);
    }
  };
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(tryStart, 500);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(tryStart, 500));
  }
})();
