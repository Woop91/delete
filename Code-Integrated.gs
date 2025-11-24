/**
 * ============================================================================
 * 509 DASHBOARD - INTEGRATED WEB + COMPREHENSIVE BACKEND
 * ============================================================================
 *
 * This is the comprehensive 509 Dashboard with integrated web dashboard.
 *
 * INTEGRATION NOTES:
 * - Web dashboard API functions updated to use dynamic column mapping
 * - All hardcoded column indices replaced with COL map lookups
 * - Web app serves Dashboard.html for terminal-style interface
 * - Menu system includes web dashboard access
 *
 * KEY INTEGRATION POINTS:
 * 1. doGet() - Serves HTML dashboard
 * 2. getDashboardData() - Main API using dynamic columns
 * 3. Helper functions refactored for column mapping
 * 4. onOpen() menu includes web dashboard link
 *
 * TO USE THIS INTEGRATED VERSION:
 * 1. Replace your current Code.gs with this file
 * 2. Keep Dashboard.html as-is
 * 3. Deploy as web app
 * 4. Use menu: 509 Dashboard > View Web Dashboard
 *
 * ============================================================================
 */

// Paste the ENTIRE comprehensive 509 Dashboard code here (all ~5000+ lines)
// Then ADD the integrated web dashboard functions at the end

// ... (Full comprehensive code would go here - too large to show in one response)
// For demonstration, I'll show the KEY INTEGRATION modifications:

/* ===================== WEB APP INTEGRATION (ADD AT END) ===================== */

/**
 * Serves the HTML dashboard as a web app
 * INTEGRATION: Uses HtmlService to serve Dashboard.html
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('SEIU 509 Unified Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Main function to gather all dashboard data for web interface
 * INTEGRATION: Refactored to use dynamic column mapping
 * Called from Dashboard.html via google.script.run
 */
function getDashboardDataWeb() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);
    const grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);

    if (!memberDir || !grievanceLog) {
      throw new Error('Required sheets not found');
    }

    // Initialize column mappings
    const M_COL = ensureMemberColInitialized();
    const G_COL = ensureGrievanceColInitialized();

    // Get all data using dynamic columns
    const memberData = getMemberDataWeb(memberDir, M_COL);
    const grievanceData = getGrievanceDataWeb(grievanceLog, G_COL);

    // Calculate metrics using dynamic columns
    const executiveMetrics = calculateExecutiveMetricsWeb(grievanceData, G_COL);
    const memberMetrics = calculateMemberMetricsWeb(memberData, M_COL);
    const grievanceMetrics = calculateGrievanceMetricsWeb(grievanceData, G_COL);
    const grievanceList = getTopPriorityGrievancesWeb(grievanceData, G_COL, 10);
    const stewardWorkload = calculateStewardWorkloadWeb(grievanceData, G_COL);
    const upcomingDeadlines = getUpcomingDeadlinesWeb(grievanceData, G_COL, 14);

    return {
      executive: executiveMetrics,
      members: memberMetrics,
      grievances: grievanceMetrics,
      grievanceList: grievanceList,
      stewardWorkload: stewardWorkload,
      upcomingDeadlines: upcomingDeadlines,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    Logger.log('Error in getDashboardDataWeb: ' + error.message);
    throw new Error('Failed to load dashboard data: ' + error.toString());
  }
}

/**
 * Get member data with dynamic columns
 */
function getMemberDataWeb(sheet, M_COL) {
  if (!sheet || sheet.getLastRow() <= 1) return [];

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return data.filter(row => row[M_COL.ID]); // Filter by Member ID column
}

/**
 * Get grievance data with dynamic columns
 */
function getGrievanceDataWeb(sheet, G_COL) {
  if (!sheet || sheet.getLastRow() <= 1) return [];

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return data.filter(row => row[G_COL.ID]); // Filter by Grievance ID column
}

/**
 * Calculate executive-level metrics with dynamic columns
 * INTEGRATION FIX: Uses G_COL instead of hardcoded indices
 */
function calculateExecutiveMetricsWeb(grievances, G_COL) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter open grievances using dynamic column
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  let overdue = 0;
  let dueThisWeek = 0;
  let escalations = 0;
  let arbitrations = 0;

  openGrievances.forEach(g => {
    const currentStep = g[G_COL.CURRENT_STEP];
    const daysToDeadline = g[G_COL.DAYS_TO_DEADLINE];

    // Count overdue
    if (typeof daysToDeadline === 'number' && daysToDeadline < 0) {
      overdue++;
    }

    // Count due this week
    if (typeof daysToDeadline === 'number' && daysToDeadline >= 0 && daysToDeadline <= 7) {
      dueThisWeek++;
    }

    // Count escalations (Step III or higher)
    if (currentStep && (currentStep.includes('III') || currentStep === 'Mediation' || currentStep === 'Arbitration' || currentStep === 'In Arbitration')) {
      escalations++;
      if (currentStep === 'Arbitration' || currentStep === 'In Arbitration') {
        arbitrations++;
      }
    }
  });

  // Calculate win rate (resolved won vs total resolved)
  const resolved = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && status.toString().startsWith("Resolved");
  });

  const won = grievances.filter(g => g[G_COL.STATUS] === "Resolved - Won").length;
  const winRate = resolved.length > 0 ? Math.round((won / resolved.length) * 100) : 0;

  // Calculate average days to close
  let totalDays = 0;
  let countDays = 0;
  resolved.forEach(g => {
    const daysOpen = g[G_COL.DAYS_OPEN];
    if (typeof daysOpen === 'number' && !isNaN(daysOpen)) {
      totalDays += daysOpen;
      countDays++;
    }
  });
  const avgDaysToClose = countDays > 0 ? Math.round(totalDays / countDays) : 0;

  return {
    activeCases: openGrievances.length,
    overdue: overdue,
    dueThisWeek: dueThisWeek,
    highRisk: overdue + escalations,
    winRate: winRate,
    avgDaysToClose: avgDaysToClose,
    escalations: escalations,
    arbitrations: arbitrations
  };
}

/**
 * Calculate member-related metrics with dynamic columns
 * INTEGRATION FIX: Uses M_COL instead of hardcoded indices
 */
function calculateMemberMetricsWeb(members, M_COL) {
  const stewards = members.filter(m => m[M_COL.IS_STEWARD] === "Yes").length;

  // Calculate engagement (members with recent activity)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let recentContacts = 0;
  members.forEach(m => {
    // Check various engagement date fields
    const lastStewardContact = m[M_COL.LAST_STEWARD_CONTACT];
    const lastUpdated = m[M_COL.LAST_UPDATED];

    if ((lastStewardContact && lastStewardContact > thirtyDaysAgo) ||
        (lastUpdated && lastUpdated > thirtyDaysAgo)) {
      recentContacts++;
    }
  });

  const engagementRate = members.length > 0 ? Math.round((recentContacts / members.length) * 100) : 0;

  return {
    total: members.length,
    stewards: stewards,
    engagementRate: engagementRate,
    recentContacts: recentContacts
  };
}

/**
 * Calculate grievance-related metrics with dynamic columns
 * INTEGRATION FIX: Uses G_COL instead of hardcoded indices
 */
function calculateGrievanceMetricsWeb(grievances, G_COL) {
  const open = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  }).length;

  const pendingInfo = grievances.filter(g => g[G_COL.STATUS] === "Pending Info").length;

  // Settled this month
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const settledThisMonth = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    const step3Decision = g[G_COL.STEP_III_DECISION_DATE];
    return status === "Resolved - Settled" && step3Decision && step3Decision >= firstOfMonth;
  }).length;

  // Average days open for open grievances
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  let totalDays = 0;
  let countDays = 0;

  openGrievances.forEach(g => {
    const daysOpen = g[G_COL.DAYS_OPEN];
    if (typeof daysOpen === 'number' && !isNaN(daysOpen)) {
      totalDays += daysOpen;
      countDays++;
    }
  });

  const avgDaysOpen = countDays > 0 ? Math.round(totalDays / countDays) : 0;

  return {
    open: open,
    pendingInfo: pendingInfo,
    settledThisMonth: settledThisMonth,
    avgDaysOpen: avgDaysOpen
  };
}

/**
 * Get top priority grievances with dynamic columns
 * INTEGRATION FIX: Uses G_COL instead of hardcoded indices
 */
function getTopPriorityGrievancesWeb(grievances, G_COL, limit = 10) {
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  // Sort by days to deadline (ascending, so overdue comes first)
  const sorted = openGrievances.sort((a, b) => {
    const daysA = typeof a[G_COL.DAYS_TO_DEADLINE] === 'number' ? a[G_COL.DAYS_TO_DEADLINE] : 999;
    const daysB = typeof b[G_COL.DAYS_TO_DEADLINE] === 'number' ? b[G_COL.DAYS_TO_DEADLINE] : 999;
    return daysA - daysB;
  });

  // Return top N
  return sorted.slice(0, limit).map(g => ({
    id: g[G_COL.ID],
    member: g[G_COL.FIRST_NAME] + ' ' + g[G_COL.LAST_NAME],
    issue: g[G_COL.GRIEVANCE_TYPE] || 'N/A',
    step: g[G_COL.CURRENT_STEP] || 'N/A',
    deadline: g[G_COL.NEXT_ACTION_DUE] ? formatDateWeb(g[G_COL.NEXT_ACTION_DUE]) : 'N/A',
    daysToDeadline: typeof g[G_COL.DAYS_TO_DEADLINE] === 'number' ? g[G_COL.DAYS_TO_DEADLINE] : 0
  }));
}

/**
 * Calculate steward workload with dynamic columns
 * INTEGRATION FIX: Uses G_COL instead of hardcoded indices
 */
function calculateStewardWorkloadWeb(grievances, G_COL) {
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  const workload = {};

  // Count cases per steward
  openGrievances.forEach(g => {
    const steward = g[G_COL.STEWARD_NAME] || 'Unassigned';
    if (!workload[steward]) {
      workload[steward] = {
        cases: 0,
        totalDays: 0,
        count: 0
      };
    }
    workload[steward].cases++;

    const daysOpen = g[G_COL.DAYS_OPEN];
    if (typeof daysOpen === 'number' && !isNaN(daysOpen)) {
      workload[steward].totalDays += daysOpen;
      workload[steward].count++;
    }
  });

  // Convert to array and calculate averages
  return Object.keys(workload).map(name => ({
    name: name,
    cases: workload[name].cases,
    avgDays: workload[name].count > 0 ?
      Math.round(workload[name].totalDays / workload[name].count) : 0
  })).sort((a, b) => b.cases - a.cases); // Sort by case count descending
}

/**
 * Get upcoming deadlines with dynamic columns
 * INTEGRATION FIX: Uses G_COL instead of hardcoded indices
 */
function getUpcomingDeadlinesWeb(grievances, G_COL, daysAhead = 14) {
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = openGrievances.filter(g => {
    const daysToDeadline = g[G_COL.DAYS_TO_DEADLINE];
    return typeof daysToDeadline === 'number' && daysToDeadline >= 0 && daysToDeadline <= daysAhead;
  });

  // Sort by days left
  upcoming.sort((a, b) => a[G_COL.DAYS_TO_DEADLINE] - b[G_COL.DAYS_TO_DEADLINE]);

  return upcoming.map(g => ({
    grievanceId: g[G_COL.ID],
    member: g[G_COL.FIRST_NAME] + ' ' + g[G_COL.LAST_NAME],
    action: getNextActionTypeWeb(g[G_COL.CURRENT_STEP], g[G_COL.NEXT_ACTION_DUE]),
    deadline: g[G_COL.NEXT_ACTION_DUE] ? formatDateWeb(g[G_COL.NEXT_ACTION_DUE]) : 'N/A',
    daysLeft: g[G_COL.DAYS_TO_DEADLINE]
  }));
}

/**
 * Determine what type of action is coming up
 */
function getNextActionTypeWeb(currentStep, nextActionDate) {
  if (!currentStep) return 'Action Required';

  if (currentStep === 'Informal') return 'File Step I';
  if (currentStep.includes('Step I')) return 'Step I Decision Due';
  if (currentStep.includes('Step II')) return 'Step II Decision Due';
  if (currentStep.includes('Step III')) return 'Step III Decision Due';
  if (currentStep === 'Mediation') return 'Mediation Session';
  if (currentStep === 'Arbitration' || currentStep === 'In Arbitration') return 'Arbitration Hearing';

  return 'Next Action';
}

/**
 * Format date to MM/DD/YYYY
 */
function formatDateWeb(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
}

/**
 * INTEGRATION: Update onOpen() menu to include web dashboard
 * This replaces the stub onOpen() from the comprehensive code
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("📊 509 Dashboard")
    .addItem("🌐 View Web Dashboard", "openWebDashboard")
    .addItem("📊 View Main Dashboard", "goToDashboard")
    .addSeparator()
    .addSubMenu(ui.createMenu("🔄 Data Management")
      .addItem("Recalc All Grievances", "recalcAllGrievances")
      .addItem("Recalc All Members", "recalcAllMembers")
      .addItem("Rebuild Dashboard", "rebuildDashboard")
      .addItem("Sort by Priority", "sortGrievancesByPriority"))
    .addSeparator()
    .addSubMenu(ui.createMenu("⚙️ Admin")
      .addItem("Seed 20k Members", "SEED_20K_MEMBERS")
      .addItem("Seed 5k Grievances", "SEED_5K_GRIEVANCES")
      .addItem("Nuke Seed Data", "nukeSeedData"))
    .addSeparator()
    .addSubMenu(ui.createMenu("📊 Reports")
      .addItem("Generate Executive Summary", "showExecutiveSummary")
      .addItem("Steward Performance", "showStewardPerformance")
      .addItem("Location Analysis", "showLocationAnalysis"))
    .addSeparator()
    .addItem("❓ Help", "showHelp")
    .addToUi();
}

/**
 * Open web dashboard in dialog
 */
function openWebDashboard() {
  try {
    const url = ScriptApp.getService().getUrl();
    const html = `
      <html>
        <head>
          <base target="_blank">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .btn { background: #7C3AED; color: white; padding: 10px 20px;
                   text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
            .instruction { background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h2>🌐 509 Dashboard Web Interface</h2>
          <p><strong>Your Dashboard URL:</strong></p>
          <p><a href="${url}" class="btn" target="_blank">Open Dashboard →</a></p>
          <p style="font-size: 12px; color: #666;">${url}</p>

          <div class="instruction">
            <strong>⚠️ First Time Setup Required:</strong>
            <ol>
              <li>Go to <strong>Extensions > Apps Script</strong></li>
              <li>Click <strong>Deploy > New deployment</strong></li>
              <li>Click gear icon ⚙️ next to "Select type"</li>
              <li>Choose <strong>Web app</strong></li>
              <li>Set <strong>Execute as:</strong> Me</li>
              <li>Set <strong>Who has access:</strong> Anyone with Google account</li>
              <li>Click <strong>Deploy</strong></li>
              <li>Authorize the app when prompted</li>
              <li>Copy the web app URL and bookmark it</li>
            </ol>
          </div>

          <p><strong>Features:</strong></p>
          <ul>
            <li>✅ Real-time metrics and KPIs</li>
            <li>✅ Active grievance tracking</li>
            <li>✅ Steward workload visualization</li>
            <li>✅ Critical deadline monitoring</li>
            <li>✅ Terminal-style interface</li>
          </ul>
        </body>
      </html>
    `;

    const htmlOutput = HtmlService.createHtmlOutput(html)
      .setWidth(600)
      .setHeight(500);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, '509 Web Dashboard Access');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error opening web dashboard: ' + error.message);
  }
}

/**
 * Navigate to main dashboard sheet
 */
function goToDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName(SHEETS.DASHBOARD);
  if (dashboard) {
    dashboard.activate();
  } else {
    SpreadsheetApp.getUi().alert('Dashboard sheet not found. Run CREATE_509_DASHBOARD() first.');
  }
}

/**
 * Show help dialog
 */
function showHelp() {
  const helpText = `
509 DASHBOARD - INTEGRATED SYSTEM

SHEETS:
• Config - Master dropdown lists & timeline rules
• Member Directory - All member data (43 columns with toggles)
• Grievance Log - All grievances with auto-calculated deadlines (32 columns)
• Dashboard - Real-time metrics and charts
• Steward Workload - Automated workload tracking
• Analytics Data - Pre-calculated analytics

WEB DASHBOARD:
• Terminal-style web interface
• Real-time metrics from Google Sheets
• Active grievance tracking
• Steward workload visualization
• Critical deadline monitoring

KEY FEATURES:
✓ Dynamic column mapping (resilient to changes)
✓ CBA-compliant deadline tracking
✓ Automated calculations
✓ Priority sorting
✓ Data seeding for testing
✓ Comprehensive menu system

GETTING STARTED:
1. Run CREATE_509_DASHBOARD() to initialize
2. Seed test data via Admin menu
3. Deploy web app (see Web Dashboard menu)
4. Access terminal dashboard via browser

All metrics use REAL data from Member Directory and Grievance Log.
No fake CPU/memory metrics - everything tracks actual union activity.
  `;

  SpreadsheetApp.getUi().alert("509 Dashboard Help", helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}
