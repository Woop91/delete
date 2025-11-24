# 509 Dashboard Integration Guide

## Overview

This guide explains how to integrate the **web dashboard** with the **comprehensive 509 Dashboard backend** code.

## Problem Statement

You have two codebases:
1. **Simple Code.gs** (~1200 lines) - Basic system with my added web dashboard API
2. **Comprehensive Code** (~5000+ lines) - Production-ready system with dynamic column mapping, resilience features, and advanced functionality

**Goal**: Merge them so the web dashboard uses the comprehensive backend's dynamic column mapping.

---

## Integration Strategy

### Option 1: Manual Merge (Recommended for Production)

**Step 1**: Start with the comprehensive code as your base
Copy your full comprehensive 509 Dashboard code into Code.gs

**Step 2**: Add web app functions at the END of the file
Scroll to the bottom and add these functions:

```javascript
/* ===================== WEB APP INTEGRATION ===================== */

/**
 * Serves the HTML dashboard as a web app
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('SEIU 509 Unified Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Main function to gather all dashboard data for web interface
 * Uses dynamic column mapping for resilience
 */
function getDashboardData() {
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
    Logger.log('Error in getDashboardData: ' + error.message);
    throw new Error('Failed to load dashboard data: ' + error.toString());
  }
}

// Helper functions using dynamic column mapping
function getMemberDataWeb(sheet, M_COL) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return data.filter(row => row[M_COL.ID]);
}

function getGrievanceDataWeb(sheet, G_COL) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return data.filter(row => row[G_COL.ID]);
}

function calculateExecutiveMetricsWeb(grievances, G_COL) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  let overdue = 0, dueThisWeek = 0, escalations = 0, arbitrations = 0;

  openGrievances.forEach(g => {
    const currentStep = g[G_COL.CURRENT_STEP];
    const daysToDeadline = g[G_COL.DAYS_TO_DEADLINE];

    if (typeof daysToDeadline === 'number' && daysToDeadline < 0) overdue++;
    if (typeof daysToDeadline === 'number' && daysToDeadline >= 0 && daysToDeadline <= 7) dueThisWeek++;

    if (currentStep && (currentStep.includes('III') || currentStep === 'Mediation' || currentStep === 'Arbitration' || currentStep === 'In Arbitration')) {
      escalations++;
      if (currentStep === 'Arbitration' || currentStep === 'In Arbitration') arbitrations++;
    }
  });

  const resolved = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && status.toString().startsWith("Resolved");
  });

  const won = grievances.filter(g => g[G_COL.STATUS] === "Resolved - Won").length;
  const winRate = resolved.length > 0 ? Math.round((won / resolved.length) * 100) : 0;

  let totalDays = 0, countDays = 0;
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

function calculateMemberMetricsWeb(members, M_COL) {
  const stewards = members.filter(m => m[M_COL.IS_STEWARD] === "Yes").length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let recentContacts = 0;
  members.forEach(m => {
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

function calculateGrievanceMetricsWeb(grievances, G_COL) {
  const open = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  }).length;

  const pendingInfo = grievances.filter(g => g[G_COL.STATUS] === "Pending Info").length;

  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const settledThisMonth = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    const step3Decision = g[G_COL.STEP_III_DECISION_DATE];
    return status === "Resolved - Settled" && step3Decision && step3Decision >= firstOfMonth;
  }).length;

  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  let totalDays = 0, countDays = 0;
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

function getTopPriorityGrievancesWeb(grievances, G_COL, limit = 10) {
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  const sorted = openGrievances.sort((a, b) => {
    const daysA = typeof a[G_COL.DAYS_TO_DEADLINE] === 'number' ? a[G_COL.DAYS_TO_DEADLINE] : 999;
    const daysB = typeof b[G_COL.DAYS_TO_DEADLINE] === 'number' ? b[G_COL.DAYS_TO_DEADLINE] : 999;
    return daysA - daysB;
  });

  return sorted.slice(0, limit).map(g => ({
    id: g[G_COL.ID],
    member: g[G_COL.FIRST_NAME] + ' ' + g[G_COL.LAST_NAME],
    issue: g[G_COL.GRIEVANCE_TYPE] || 'N/A',
    step: g[G_COL.CURRENT_STEP] || 'N/A',
    deadline: g[G_COL.NEXT_ACTION_DUE] ? formatDateWeb(g[G_COL.NEXT_ACTION_DUE]) : 'N/A',
    daysToDeadline: typeof g[G_COL.DAYS_TO_DEADLINE] === 'number' ? g[G_COL.DAYS_TO_DEADLINE] : 0
  }));
}

function calculateStewardWorkloadWeb(grievances, G_COL) {
  const openGrievances = grievances.filter(g => {
    const status = g[G_COL.STATUS];
    return status && (status.toString().startsWith("Filed") || status === "Pending Decision");
  });

  const workload = {};

  openGrievances.forEach(g => {
    const steward = g[G_COL.STEWARD_NAME] || 'Unassigned';
    if (!workload[steward]) {
      workload[steward] = { cases: 0, totalDays: 0, count: 0 };
    }
    workload[steward].cases++;

    const daysOpen = g[G_COL.DAYS_OPEN];
    if (typeof daysOpen === 'number' && !isNaN(daysOpen)) {
      workload[steward].totalDays += daysOpen;
      workload[steward].count++;
    }
  });

  return Object.keys(workload).map(name => ({
    name: name,
    cases: workload[name].cases,
    avgDays: workload[name].count > 0 ?
      Math.round(workload[name].totalDays / workload[name].count) : 0
  })).sort((a, b) => b.cases - a.cases);
}

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

  upcoming.sort((a, b) => a[G_COL.DAYS_TO_DEADLINE] - b[G_COL.DAYS_TO_DEADLINE]);

  return upcoming.map(g => ({
    grievanceId: g[G_COL.ID],
    member: g[G_COL.FIRST_NAME] + ' ' + g[G_COL.LAST_NAME],
    action: getNextActionTypeWeb(g[G_COL.CURRENT_STEP], g[G_COL.NEXT_ACTION_DUE]),
    deadline: g[G_COL.NEXT_ACTION_DUE] ? formatDateWeb(g[G_COL.NEXT_ACTION_DUE]) : 'N/A',
    daysLeft: g[G_COL.DAYS_TO_DEADLINE]
  }));
}

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
 * Open web dashboard access dialog
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
```

**Step 3**: Update the `onOpen()` function
Find your existing `onOpen()` function stub in the comprehensive code and replace it with:

```javascript
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

function goToDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName(SHEETS.DASHBOARD);
  if (dashboard) {
    dashboard.activate();
  } else {
    SpreadsheetApp.getUi().alert('Dashboard sheet not found. Run CREATE_509_DASHBOARD() first.');
  }
}

function showHelp() {
  const helpText = `
509 DASHBOARD - INTEGRATED SYSTEM

SHEETS:
• Config - Master dropdown lists & timeline rules
• Member Directory - All member data (43 columns with toggles)
• Grievance Log - All grievances with auto-calculated deadlines (32 columns)
• Dashboard - Real-time metrics and charts
• Steward Workload - Automated workload tracking

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

GETTING STARTED:
1. Run CREATE_509_DASHBOARD() to initialize
2. Seed test data via Admin menu
3. Deploy web app (see Web Dashboard menu)
4. Access terminal dashboard via browser
  `;

  SpreadsheetApp.getUi().alert("509 Dashboard Help", helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}
```

---

### Option 2: Quick Test Integration (For Testing)

If you just want to test quickly:

1. Keep your comprehensive Code.gs as-is
2. Add the web app functions from Option 1 at the end
3. Keep Dashboard.html unchanged
4. Deploy and test

---

## Key Differences Explained

### Original Web API (Hardcoded):
```javascript
// OLD - Fragile
const openGrievances = grievances.filter(g => g[4] === 'Open');
const currentStep = g[5];
const daysToDeadline = g[20];
```

### Integrated Web API (Dynamic):
```javascript
// NEW - Resilient
const G_COL = ensureGrievanceColInitialized();
const openGrievances = grievances.filter(g => g[G_COL.STATUS] === 'Open');
const currentStep = g[G_COL.CURRENT_STEP];
const daysToDeadline = g[G_COL.DAYS_TO_DEADLINE];
```

---

## Benefits of Integration

✅ **Resilient**: Column indices dynamically mapped from headers
✅ **Maintainable**: Change column structure without breaking code
✅ **Production-Ready**: Uses comprehensive backend features
✅ **Feature-Rich**: Access to all 94+ comprehensive features
✅ **Web Interface**: Terminal-style dashboard for real-time monitoring

---

## Testing Checklist

After integration:

1. ✅ Run `CREATE_509_DASHBOARD()` to initialize sheets
2. ✅ Seed test data via **509 Dashboard > Admin > Seed Data**
3. ✅ Deploy as web app
4. ✅ Open web dashboard via menu
5. ✅ Verify metrics display correctly
6. ✅ Check that dynamic column mapping works
7. ✅ Test recalculation functions
8. ✅ Verify priority sorting

---

## Troubleshooting

**Problem**: `getDashboardData is not defined`
**Solution**: Make sure you added all web app functions to Code.gs

**Problem**: Column mapping errors
**Solution**: Run `invalidateColumnMapping()` to clear cache

**Problem**: Web dashboard shows wrong data
**Solution**: Run **Data Management > Recalc All** to refresh calculations

**Problem**: Menu doesn't show web dashboard option
**Solution**: Refresh Google Sheets or manually run `onOpen()`

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│    User's Browser                   │
│  ┌───────────────────────────────┐  │
│  │  Dashboard.html               │  │
│  │  - Terminal UI                │  │
│  │  - Real-time metrics          │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ google.script.run.getDashboardData()
               ↓
┌─────────────────────────────────────┐
│    Code.gs (Comprehensive)          │
│  ┌───────────────────────────────┐  │
│  │  Web App Functions            │  │
│  │  - doGet()                    │  │
│  │  - getDashboardData()         │  │
│  │  - Uses dynamic COL mapping   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Dynamic Column Mapping       │  │
│  │  - ensureMemberColInit()      │  │
│  │  - ensureGrievanceColInit()   │  │
│  │  - Header-based indexing      │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ SpreadsheetApp API
               ↓
┌─────────────────────────────────────┐
│         Google Sheets               │
│  ┌───────────────────────────────┐  │
│  │  Member Directory (43 cols)   │  │
│  │  Grievance Log (32 cols)      │  │
│  │  Config, Dashboard, etc.      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Next Steps

1. **Merge the code** using Option 1 (manual merge)
2. **Test the integration** with seed data
3. **Deploy as web app** following DEPLOYMENT_GUIDE.md
4. **Access dashboard** via **509 Dashboard > View Web Dashboard** menu
5. **Verify all features** work correctly
6. **Document any custom changes** you make

---

## Support

For issues:
- Check this integration guide
- Review DEPLOYMENT_GUIDE.md for deployment steps
- Test with fresh `CREATE_509_DASHBOARD()` setup
- Verify column mapping with `Logger.log(G_COL)` tests

---

**Created by**: Claude Code
**Version**: Integrated v1.0
**Date**: 2025-11-24
