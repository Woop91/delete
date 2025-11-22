/****************************************************
 * 509 DASHBOARD - FIXED VERSION
 * All issues addressed, real data only, 20k members + 5k grievances
 ****************************************************/

/* ===================== CONFIGURATION ===================== */
const SHEETS = {
  CONFIG: "Config",
  MEMBER_DIR: "Member Directory",
  GRIEVANCE_LOG: "Grievance Log",
  DASHBOARD: "Dashboard",
  ANALYTICS: "Analytics Data",
  FEEDBACK: "Feedback & Development",
  MEMBER_SATISFACTION: "Member Satisfaction"
};

/* ===================== ONE-CLICK SETUP ===================== */
function CREATE_509_DASHBOARD() {
  const ss = SpreadsheetApp.getActive();

  SpreadsheetApp.getActive().toast("🚀 Creating 509 Dashboard...", "Starting", -1);

  try {
    createConfigTab();
    SpreadsheetApp.getActive().toast("✅ Config created", "15%", 2);

    createMemberDirectory();
    SpreadsheetApp.getActive().toast("✅ Member Directory created", "30%", 2);

    createGrievanceLog();
    SpreadsheetApp.getActive().toast("✅ Grievance Log created", "45%", 2);

    createMainDashboard();
    SpreadsheetApp.getActive().toast("✅ Dashboard created", "60%", 2);

    createAnalyticsDataSheet();
    createMemberSatisfactionSheet();
    createFeedbackSheet();
    SpreadsheetApp.getActive().toast("✅ All sheets created", "75%", 2);

    setupDataValidations();
    setupFormulasAndCalculations();
    SpreadsheetApp.getActive().toast("✅ Validations & formulas ready", "90%", 2);

    onOpen();

    SpreadsheetApp.getActive().toast("✅ Dashboard ready! Use menu to seed data.", "Complete!", 5);
    ss.getSheetByName(SHEETS.DASHBOARD).activate();

  } catch (error) {
    SpreadsheetApp.getActive().toast("❌ Error: " + error.toString(), "Error", 10);
    console.error(error);
  }
}

/* ===================== CONFIG TAB ===================== */
function createConfigTab() {
  const ss = SpreadsheetApp.getActive();
  let config = ss.getSheetByName(SHEETS.CONFIG);

  if (!config) {
    config = ss.insertSheet(SHEETS.CONFIG);
  }
  config.clear();

  const configData = [
    ["Job Titles", "Office Locations", "Units", "Office Days", "Yes/No",
     "Supervisors", "Managers", "Stewards", "Grievance Status", "Grievance Step",
     "Issue Category", "Articles Violated", "Communication Methods"],

    ["Coordinator", "Boston HQ", "Unit A - Administrative", "Monday", "Yes",
     "Sarah Johnson", "Michael Chen", "Jane Smith", "Open", "Informal",
     "Discipline", "Art. 1 - Recognition", "Email"],

    ["Analyst", "Worcester Office", "Unit B - Technical", "Tuesday", "No",
     "Mike Wilson", "Lisa Anderson", "John Doe", "Pending Info", "Step I",
     "Workload", "Art. 2 - Union Security", "Phone"],

    ["Case Manager", "Springfield Branch", "Unit C - Support Services", "Wednesday", "",
     "Emily Davis", "Robert Brown", "Mary Johnson", "Settled", "Step II",
     "Scheduling", "Art. 3 - Management Rights", "Text"],

    ["Specialist", "Cambridge Office", "Unit D - Operations", "Thursday", "",
     "Tom Harris", "Jennifer Lee", "Bob Wilson", "Withdrawn", "Step III",
     "Pay", "Art. 4 - No Discrimination", "In Person"],

    ["Senior Analyst", "Lowell Center", "Unit E - Field Services", "Friday", "",
     "Amanda White", "David Martinez", "Alice Brown", "Closed", "Mediation",
     "Discrimination", "Art. 5 - Union Business", ""],

    ["Team Lead", "Quincy Station", "", "Saturday", "",
     "Chris Taylor", "Susan Garcia", "Tom Davis", "Appealed", "Arbitration",
     "Safety", "Art. 23 - Grievance Procedure", ""],

    ["Director", "Remote/Hybrid", "", "Sunday", "",
     "Patricia Moore", "James Wilson", "Sarah Martinez", "", "",
     "Benefits", "Art. 24 - Discipline", ""],

    ["Manager", "Brockton Office", "", "", "",
     "Kevin Anderson", "Nancy Taylor", "Kevin Jones", "", "",
     "Training", "Art. 25 - Hours of Work", ""],

    ["Assistant", "Lynn Location", "", "", "",
     "Michelle Lee", "Richard White", "Linda Garcia", "", "",
     "Other", "Art. 26 - Overtime", ""],

    ["Associate", "Salem Office", "", "", "",
     "Brandon Scott", "Angela Moore", "Daniel Kim", "", "",
     "Harassment", "Art. 27 - Seniority", ""],

    ["Technician", "", "", "", "",
     "Jessica Green", "Christopher Lee", "Rachel Adams", "", "",
     "Equipment", "Art. 28 - Layoff", ""],

    ["Administrator", "", "", "", "",
     "Andrew Clark", "Melissa Wright", "", "", "",
     "Leave", "Art. 29 - Sick Leave", ""],

    ["Support Staff", "", "", "", "",
     "Rachel Brown", "Timothy Davis", "", "", "",
     "Grievance Process", "Art. 30 - Vacation", ""]
  ];

  config.getRange(1, 1, configData.length, configData[0].length).setValues(configData);

  config.getRange(1, 1, 1, configData[0].length)
    .setFontWeight("bold")
    .setBackground("#4A5568")
    .setFontColor("#FFFFFF");

  for (let i = 1; i <= configData[0].length; i++) {
    config.autoResizeColumn(i);
  }

  config.setFrozenRows(1);
  config.setTabColor("#2563EB");
}

/* ===================== MEMBER DIRECTORY - ALL CORRECT COLUMNS ===================== */
function createMemberDirectory() {
  const ss = SpreadsheetApp.getActive();
  let memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);

  if (!memberDir) {
    memberDir = ss.insertSheet(SHEETS.MEMBER_DIR);
  }
  memberDir.clear();

  // EXACT columns as specified by user
  const headers = [
    "Member ID",
    "First Name",
    "Last Name",
    "Job Title",
    "Work Location (Site)",
    "Unit",
    "Office Days",
    "Email Address",
    "Phone Number",
    "Is Steward (Y/N)",
    "Supervisor (Name)",
    "Manager (Name)",
    "Assigned Steward (Name)",
    "Last Virtual Mtg (Date)",
    "Last In-Person Mtg (Date)",
    "Last Survey (Date)",
    "Last Email Open (Date)",
    "Open Rate (%)",
    "Volunteer Hours (YTD)",
    "Interest: Local Actions",
    "Interest: Chapter Actions",
    "Interest: Allied Chapter Actions",
    "Timestamp",
    "Preferred Communication Methods",
    "Best Time(s) to Reach Member",
    "Has Open Grievance?",
    "Grievance Status Snapshot",
    "Next Grievance Deadline",
    "Most Recent Steward Contact Date",
    "Steward Who Contacted Member",
    "Notes from Steward Contact"
  ];

  memberDir.getRange(1, 1, 1, headers.length).setValues([headers]);

  memberDir.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#059669")
    .setFontColor("#FFFFFF")
    .setWrap(true);

  memberDir.setFrozenRows(1);
  memberDir.setRowHeight(1, 50);
  memberDir.setColumnWidth(1, 90);
  memberDir.setColumnWidth(8, 180);
  memberDir.setColumnWidth(31, 250);

  memberDir.setTabColor("#059669");
}

/* ===================== GRIEVANCE LOG - ALL CORRECT COLUMNS ===================== */
function createGrievanceLog() {
  const ss = SpreadsheetApp.getActive();
  let grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);

  if (!grievanceLog) {
    grievanceLog = ss.insertSheet(SHEETS.GRIEVANCE_LOG);
  }
  grievanceLog.clear();

  // EXACT columns as specified by user
  const headers = [
    "Grievance ID",
    "Member ID",
    "First Name",
    "Last Name",
    "Status",
    "Current Step",
    "Incident Date",
    "Filing Deadline (21d)",
    "Date Filed (Step I)",
    "Step I Decision Due (30d)",
    "Step I Decision Rcvd",
    "Step II Appeal Due (10d)",
    "Step II Appeal Filed",
    "Step II Decision Due (30d)",
    "Step II Decision Rcvd",
    "Step III Appeal Due (30d)",
    "Step III Appeal Filed",
    "Date Closed",
    "Days Open",
    "Next Action Due",
    "Days to Deadline",
    "Articles Violated",
    "Issue Category",
    "Member Email",
    "Unit",
    "Work Location (Site)",
    "Assigned Steward (Name)",
    "Resolution Summary"
  ];

  grievanceLog.getRange(1, 1, 1, headers.length).setValues([headers]);

  grievanceLog.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#DC2626")
    .setFontColor("#FFFFFF")
    .setWrap(true);

  grievanceLog.setFrozenRows(1);
  grievanceLog.setRowHeight(1, 50);
  grievanceLog.setColumnWidth(1, 110);
  grievanceLog.setColumnWidth(22, 180);
  grievanceLog.setColumnWidth(28, 250);

  grievanceLog.setTabColor("#DC2626");
}

/* ===================== DASHBOARD - ONLY REAL DATA ===================== */
function createMainDashboard() {
  const ss = SpreadshgetApp.getActive();
  let dashboard = ss.getSheetByName(SHEETS.DASHBOARD);

  if (!dashboard) {
    dashboard = ss.insertSheet(SHEETS.DASHBOARD);
  }
  dashboard.clear();

  // Title
  dashboard.getRange("A1:L2").merge()
    .setValue("📊 LOCAL 509 DASHBOARD")
    .setFontSize(18)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground("#7C3AED")
    .setFontColor("#FFFFFF");

  dashboard.getRange("A3:L3").merge()
    .setFormula('="Last Updated: " & TEXT(NOW(), "MM/DD/YYYY HH:MM:SS")')
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setFontColor("#6B7280");

  // MEMBER METRICS - ALL REAL DATA
  dashboard.getRange("A5:L5").merge()
    .setValue("👥 MEMBER METRICS")
    .setFontWeight("bold")
    .setBackground("#E0E7FF")
    .setFontSize(12);

  const memberMetrics = [
    ["Total Members", "=COUNTA('Member Directory'!A:A)-1", "👥"],
    ["Active Stewards", "=COUNTIF('Member Directory'!J:J,\"Yes\")", "🛡️"],
    ["Avg Open Rate", "=TEXT(AVERAGE('Member Directory'!R:R)/100,\"0.0%\")", "📧"],
    ["YTD Vol. Hours", "=SUM('Member Directory'!S:S)", "🙋"]
  ];

  let col = 1;
  memberMetrics.forEach(m => {
    dashboard.getRange(6, col, 1, 3).merge()
      .setValue(m[2] + " " + m[0])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#F3F4F6");

    dashboard.getRange(7, col, 1, 3).merge()
      .setFormula(m[1])
      .setFontSize(20)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    col += 3;
  });

  // GRIEVANCE METRICS - ALL REAL DATA
  dashboard.getRange("A10:L10").merge()
    .setValue("📋 GRIEVANCE METRICS")
    .setFontWeight("bold")
    .setBackground("#FEE2E2")
    .setFontSize(12);

  const grievanceMetrics = [
    ["Open Grievances", "=COUNTIF('Grievance Log'!E:E,\"Open\")", "🔴"],
    ["Pending Info", "=COUNTIF('Grievance Log'!E:E,\"Pending Info\")", "🟡"],
    ["Settled (This Mo.)", "=COUNTIFS('Grievance Log'!E:E,\"Settled\",'Grievance Log'!R:R,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1))", "🟢"],
    ["Avg Days Open", "=ROUND(AVERAGE(FILTER('Grievance Log'!S:S,'Grievance Log'!E:E=\"Open\")),0)", "⏱️"]
  ];

  col = 1;
  grievanceMetrics.forEach(m => {
    dashboard.getRange(11, col, 1, 3).merge()
      .setValue(m[2] + " " + m[0])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#F3F4F6");

    dashboard.getRange(12, col, 1, 3).merge()
      .setFormula(m[1])
      .setFontSize(20)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    col += 3;
  });

  // ENGAGEMENT METRICS - REAL DATA
  dashboard.getRange("A15:L15").merge()
    .setValue("📈 ENGAGEMENT METRICS (Last 30 Days)")
    .setFontWeight("bold")
    .setBackground("#DCFCE7")
    .setFontSize(12);

  const engagementMetrics = [
    ["Virtual Mtgs", "=COUNTIF('Member Directory'!N:N,\">=\"&TODAY()-30)"],
    ["In-Person Mtgs", "=COUNTIF('Member Directory'!O:O,\">=\"&TODAY()-30)"],
    ["Local Interest", "=COUNTIF('Member Directory'!T:T,\"Yes\")"],
    ["Chapter Interest", "=COUNTIF('Member Directory'!U:U,\"Yes\")"]
  ];

  col = 1;
  engagementMetrics.forEach(m => {
    dashboard.getRange(16, col, 1, 3).merge()
      .setValue(m[0])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#F3F4F6");

    dashboard.getRange(17, col, 1, 3).merge()
      .setFormula(m[1])
      .setFontSize(18)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    col += 3;
  });

  // UPCOMING DEADLINES
  dashboard.getRange("A20:L20").merge()
    .setValue("⏰ UPCOMING DEADLINES (Next 14 Days)")
    .setFontWeight("bold")
    .setBackground("#FEF3C7")
    .setFontSize(12);

  const deadlineHeaders = ["Grievance ID", "Member", "Next Action", "Days Until", "Status"];
  dashboard.getRange(21, 1, 1, 5).setValues([deadlineHeaders])
    .setFontWeight("bold")
    .setBackground("#F3F4F6");

  dashboard.setTabColor("#7C3AED");
}

/* ===================== ANALYTICS DATA SHEET ===================== */
function createAnalyticsDataSheet() {
  const ss = SpreadsheetApp.getActive();
  let analytics = ss.getSheetByName(SHEETS.ANALYTICS);

  if (!analytics) {
    analytics = ss.insertSheet(SHEETS.ANALYTICS);
  }
  analytics.clear();

  analytics.getRange("A1").setValue("ANALYTICS DATA - Calculated from Member Directory & Grievance Log");
  analytics.getRange("A1").setFontWeight("bold").setBackground("#6366F1").setFontColor("#FFFFFF");

  // Grievances by Status
  analytics.getRange("A3").setValue("Grievances by Status");
  analytics.getRange("A4:B4").setValues([["Status", "Count"]]).setFontWeight("bold");

  // Grievances by Unit
  analytics.getRange("D3").setValue("Grievances by Unit");
  analytics.getRange("D4:E4").setValues([["Unit", "Count"]]).setFontWeight("bold");

  // Members by Location
  analytics.getRange("G3").setValue("Members by Location");
  analytics.getRange("G4:H4").setValues([["Location", "Count"]]).setFontWeight("bold");

  // Steward Workload
  analytics.getRange("J3").setValue("Steward Workload");
  analytics.getRange("J4:K4").setValues([["Steward", "Open Cases"]]).setFontWeight("bold");

  analytics.hideSheet();
}

/* ===================== MEMBER SATISFACTION ===================== */
function createMemberSatisfactionSheet() {
  const ss = SpreadsheetApp.getActive();
  let satisfaction = ss.getSheetByName(SHEETS.MEMBER_SATISFACTION);

  if (!satisfaction) {
    satisfaction = ss.insertSheet(SHEETS.MEMBER_SATISFACTION);
  }
  satisfaction.clear();

  satisfaction.getRange("A1:J1").merge()
    .setValue("😊 MEMBER SATISFACTION TRACKING")
    .setFontSize(14)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#10B981")
    .setFontColor("#FFFFFF");

  const headers = [
    "Survey ID",
    "Member ID",
    "Member Name",
    "Date Sent",
    "Date Completed",
    "Overall Satisfaction (1-5)",
    "Steward Support (1-5)",
    "Communication (1-5)",
    "Would Recommend Union (Y/N)",
    "Comments"
  ];

  satisfaction.getRange(3, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#F3F4F6");

  satisfaction.setFrozenRows(3);

  satisfaction.getRange("A10:E10").merge()
    .setValue("SATISFACTION METRICS")
    .setFontWeight("bold")
    .setBackground("#E0E7FF");

  const metrics = [
    ["Average Overall Satisfaction:", "=IFERROR(AVERAGE(F4:F1000),\"-\")"],
    ["Average Steward Support:", "=IFERROR(AVERAGE(G4:G1000),\"-\")"],
    ["Average Communication:", "=IFERROR(AVERAGE(H4:H1000),\"-\")"],
    ["% Would Recommend:", "=IFERROR(TEXT(COUNTIF(I4:I1000,\"Y\")/COUNTA(I4:I1000),\"0.0%\"),\"-\")"]
  ];

  satisfaction.getRange(11, 1, metrics.length, 2).setValues(metrics);
  satisfaction.setTabColor("#10B981");
}

/* ===================== FEEDBACK & DEVELOPMENT ===================== */
function createFeedbackSheet() {
  const ss = SpreadsheetApp.getActive();
  let feedback = ss.getSheetByName(SHEETS.FEEDBACK);

  if (!feedback) {
    feedback = ss.insertSheet(SHEETS.FEEDBACK);
  }
  feedback.clear();

  feedback.getRange("A1:K1").merge()
    .setValue("💡 FEEDBACK & DEVELOPMENT")
    .setFontSize(14)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#F59E0B")
    .setFontColor("#FFFFFF");

  const headers = [
    "Timestamp",
    "Submitted By",
    "Category",
    "Type",
    "Priority",
    "Title",
    "Description",
    "Status",
    "Assigned To",
    "Resolution",
    "Notes"
  ];

  feedback.getRange(3, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#F3F4F6");

  feedback.setFrozenRows(3);
  feedback.setTabColor("#F59E0B");
}

/* ===================== DATA VALIDATIONS ===================== */
function setupDataValidations() {
  const ss = SpreadsheetApp.getActive();
  const config = ss.getSheetByName(SHEETS.CONFIG);
  const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);
  const grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);

  // Member Directory validations
  const memberValidations = [
    { col: 4, configCol: 1 },   // Job Title
    { col: 5, configCol: 2 },   // Work Location
    { col: 6, configCol: 3 },   // Unit
    { col: 10, configCol: 5 },  // Is Steward
    { col: 11, configCol: 6 },  // Supervisor
    { col: 12, configCol: 7 },  // Manager
    { col: 13, configCol: 8 },  // Assigned Steward
    { col: 20, configCol: 5 },  // Interest: Local
    { col: 21, configCol: 5 },  // Interest: Chapter
    { col: 22, configCol: 5 },  // Interest: Allied
    { col: 24, configCol: 13 }  // Comm Methods
  ];

  memberValidations.forEach(v => {
    const configRange = config.getRange(2, v.configCol, 50, 1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(configRange, true)
      .setAllowInvalid(false)
      .build();
    memberDir.getRange(2, v.col, 5000, 1).setDataValidation(rule);
  });

  // Grievance Log validations
  const grievanceValidations = [
    { col: 5, configCol: 9 },   // Status
    { col: 6, configCol: 10 },  // Current Step
    { col: 22, configCol: 12 }, // Articles Violated
    { col: 23, configCol: 11 }, // Issue Category
    { col: 25, configCol: 3 },  // Unit
    { col: 26, configCol: 2 },  // Work Location
    { col: 27, configCol: 8 }   // Assigned Steward
  ];

  grievanceValidations.forEach(v => {
    const configRange = config.getRange(2, v.configCol, 50, 1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(configRange, true)
      .setAllowInvalid(false)
      .build();
    grievanceLog.getRange(2, v.col, 5000, 1).setDataValidation(rule);
  });
}

/* ===================== FORMULAS ===================== */
function setupFormulasAndCalculations() {
  const ss = SpreadsheetApp.getActive();
  const grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);
  const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);

  // Grievance Log formulas
  for (let row = 2; row <= 100; row++) {
    // Filing Deadline (Incident Date + 21 days)
    grievanceLog.getRange(row, 8).setFormula(
      `=IF(G${row}<>"",G${row}+21,"")`
    );

    // Step I Decision Due (Date Filed + 30 days)
    grievanceLog.getRange(row, 10).setFormula(
      `=IF(I${row}<>"",I${row}+30,"")`
    );

    // Step II Appeal Due (Step I Decision Rcvd + 10 days)
    grievanceLog.getRange(row, 12).setFormula(
      `=IF(K${row}<>"",K${row}+10,"")`
    );

    // Step II Decision Due (Step II Appeal Filed + 30 days)
    grievanceLog.getRange(row, 14).setFormula(
      `=IF(M${row}<>"",M${row}+30,"")`
    );

    // Step III Appeal Due (Step II Decision Rcvd + 30 days)
    grievanceLog.getRange(row, 16).setFormula(
      `=IF(O${row}<>"",O${row}+30,"")`
    );

    // Days Open
    grievanceLog.getRange(row, 19).setFormula(
      `=IF(I${row}<>"",IF(R${row}<>"",R${row}-I${row},TODAY()-I${row}),"")`
    );

    // Next Action Due
    grievanceLog.getRange(row, 20).setFormula(
      `=IF(E${row}="Open",IF(F${row}="Step I",J${row},IF(F${row}="Step II",N${row},IF(F${row}="Step III",P${row},H${row}))),"")`
    );

    // Days to Deadline
    grievanceLog.getRange(row, 21).setFormula(
      `=IF(T${row}<>"",T${row}-TODAY(),"")`
    );
  }

  // Member Directory formulas
  for (let row = 2; row <= 100; row++) {
    // Has Open Grievance?
    memberDir.getRange(row, 26).setFormula(
      `=IF(COUNTIFS('Grievance Log'!B:B,A${row},'Grievance Log'!E:E,"Open")>0,"Yes","No")`
    );

    // Grievance Status Snapshot
    memberDir.getRange(row, 27).setFormula(
      `=IFERROR(INDEX('Grievance Log'!E:E,MATCH(A${row},'Grievance Log'!B:B,0)),"")`
    );

    // Next Grievance Deadline
    memberDir.getRange(row, 28).setFormula(
      `=IFERROR(INDEX('Grievance Log'!T:T,MATCH(A${row},'Grievance Log'!B:B,0)),"")`
    );
  }
}

/* ===================== MENU ===================== */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("📊 509 Dashboard")
    .addItem("🔄 Refresh All", "refreshCalculations")
    .addSeparator()
    .addSubMenu(ui.createMenu("⚙️ Admin")
      .addItem("Seed 20k Members", "SEED_20K_MEMBERS")
      .addItem("Seed 5k Grievances", "SEED_5K_GRIEVANCES")
      .addItem("Clear All Data", "clearAllData"))
    .addSeparator()
    .addItem("📊 Dashboard", "goToDashboard")
    .addItem("❓ Help", "showHelp")
    .addToUi();
}

function refreshCalculations() {
  SpreadsheetApp.flush();
  const ss = SpreadsheetApp.getActive();
  const dashboard = ss.getSheetByName(SHEETS.DASHBOARD);
  if (dashboard) {
    dashboard.getRange("A3").setFormula('="Last Updated: " & TEXT(NOW(), "MM/DD/YYYY HH:MM:SS")');
  }
  SpreadsheetApp.getActive().toast("✅ Refreshed", "Complete", 2);
}

function goToDashboard() {
  const ss = SpreadsheetApp.getActive();
  ss.getSheetByName(SHEETS.DASHBOARD).activate();
}

function showHelp() {
  const helpText = `
📊 509 DASHBOARD

SHEETS:
• Config - Master dropdown lists
• Member Directory - All member data
• Grievance Log - All grievances with auto-calculated deadlines
• Dashboard - Real-time metrics
• Member Satisfaction - Survey tracking
• Feedback & Development - System improvements

DATA SEEDING:
Use Admin menu to:
• Seed 20k Members
• Seed 5k Grievances

All metrics use REAL data from Member Directory and Grievance Log.
No fake CPU/memory metrics - everything tracks actual union activity.
  `;

  SpreadsheetApp.getUi().alert("Help", helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ===================== SEED 20,000 MEMBERS ===================== */
function SEED_20K_MEMBERS() {
  const ss = SpreadsheetApp.getActive();
  const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);
  const config = ss.getSheetByName(SHEETS.CONFIG);

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Seed 20,000 Members',
    'This will add 20,000 member records. This may take 2-3 minutes. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  SpreadsheetApp.getActive().toast("🚀 Seeding 20,000 members...", "Processing", -1);

  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"];

  const jobTitles = config.getRange("A2:A14").getValues().flat().filter(String);
  const locations = config.getRange("B2:B14").getValues().flat().filter(String);
  const units = config.getRange("C2:C7").getValues().flat().filter(String);
  const supervisors = config.getRange("F2:F14").getValues().flat().filter(String);
  const managers = config.getRange("G2:G14").getValues().flat().filter(String);
  const stewards = config.getRange("H2:H14").getValues().flat().filter(String);
  const commMethods = ["Email", "Phone", "Text", "In Person"];
  const times = ["Mornings", "Afternoons", "Evenings", "Weekends", "Flexible"];

  const BATCH_SIZE = 1000;
  let data = [];

  for (let i = 1; i <= 20000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const memberID = "M" + String(i).padStart(6, '0');
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const unit = units[Math.floor(Math.random() * units.length)];
    const officeDays = ["Mon", "Tue", "Wed", "Thu", "Fri"][Math.floor(Math.random() * 5)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@union.org`;
    const phone = `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const isSteward = Math.random() > 0.95 ? "Yes" : "No";
    const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
    const manager = managers[Math.floor(Math.random() * managers.length)];
    const assignedSteward = stewards[Math.floor(Math.random() * stewards.length)];

    const daysAgo = Math.floor(Math.random() * 90);
    const lastVirtual = Math.random() > 0.7 ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : "";
    const lastInPerson = Math.random() > 0.8 ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : "";
    const lastSurvey = Math.random() > 0.6 ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : "";
    const lastEmailOpen = Math.random() > 0.5 ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : "";

    const openRate = Math.floor(Math.random() * 40) + 60;
    const volHours = Math.floor(Math.random() * 50);
    const localInterest = Math.random() > 0.5 ? "Yes" : "No";
    const chapterInterest = Math.random() > 0.6 ? "Yes" : "No";
    const alliedInterest = Math.random() > 0.8 ? "Yes" : "No";
    const timestamp = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const commMethod = commMethods[Math.floor(Math.random() * commMethods.length)];
    const bestTime = times[Math.floor(Math.random() * times.length)];

    const row = [
      memberID, firstName, lastName, jobTitle, location, unit, officeDays,
      email, phone, isSteward, supervisor, manager, assignedSteward,
      lastVirtual, lastInPerson, lastSurvey, lastEmailOpen, openRate, volHours,
      localInterest, chapterInterest, alliedInterest, timestamp, commMethod, bestTime,
      "No", "", "", "", "", ""
    ];

    data.push(row);

    if (data.length === BATCH_SIZE) {
      memberDir.getRange(memberDir.getLastRow() + 1, 1, data.length, row.length).setValues(data);
      SpreadsheetApp.getActive().toast(`Added ${i} of 20,000 members...`, "Progress", 1);
      data = [];
      SpreadsheetApp.flush();
    }
  }

  if (data.length > 0) {
    memberDir.getRange(memberDir.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
  }

  SpreadsheetApp.getActive().toast("✅ 20,000 members added!", "Complete", 5);
}

/* ===================== SEED 5,000 GRIEVANCES ===================== */
function SEED_5K_GRIEVANCES() {
  const ss = SpreadsheetApp.getActive();
  const grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);
  const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);
  const config = ss.getSheetByName(SHEETS.CONFIG);

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Seed 5,000 Grievances',
    'This will add 5,000 grievance records. This may take 1-2 minutes. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  SpreadsheetApp.getActive().toast("🚀 Seeding 5,000 grievances...", "Processing", -1);

  const memberIDs = memberDir.getRange("A2:A").getValues().flat().filter(String);
  const statuses = config.getRange("I2:I8").getValues().flat().filter(String);
  const steps = config.getRange("J2:J7").getValues().flat().filter(String);
  const articles = config.getRange("L2:L14").getValues().flat().filter(String);
  const categories = config.getRange("K2:K12").getValues().flat().filter(String);
  const stewards = config.getRange("H2:H14").getValues().flat().filter(String);

  const BATCH_SIZE = 500;
  let data = [];

  for (let i = 1; i <= 5000; i++) {
    const memberID = memberIDs[Math.floor(Math.random() * Math.min(memberIDs.length, 20000))];
    const memberData = memberDir.getRange(`A2:Z${memberDir.getLastRow()}`).getValues()
      .find(row => row[0] === memberID);

    if (!memberData) continue;

    const grievanceID = "G-" + String(i).padStart(6, '0');
    const firstName = memberData[1];
    const lastName = memberData[2];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const step = steps[Math.floor(Math.random() * steps.length)];

    const daysAgo = Math.floor(Math.random() * 365);
    const incidentDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const dateFiled = new Date(incidentDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);

    const article = articles[Math.floor(Math.random() * articles.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const email = memberData[7];
    const unit = memberData[5];
    const location = memberData[4];
    const assignedSteward = stewards[Math.floor(Math.random() * stewards.length)];

    const isClosed = status === "Closed" || status === "Settled" || status === "Withdrawn";
    const dateClosed = isClosed ? new Date(dateFiled.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000) : "";
    const resolution = isClosed ? ["Resolved favorably", "Withdrawn by member", "Settled with compromise", "No violation found"][Math.floor(Math.random() * 4)] : "";

    const row = [
      grievanceID, memberID, firstName, lastName, status, step,
      incidentDate, "", dateFiled, "", "", "", "", "", "", "", "",
      dateClosed, "", "", "", article, category, email, unit, location,
      assignedSteward, resolution
    ];

    data.push(row);

    if (data.length === BATCH_SIZE) {
      grievanceLog.getRange(grievanceLog.getLastRow() + 1, 1, data.length, row.length).setValues(data);
      SpreadsheetApp.getActive().toast(`Added ${i} of 5,000 grievances...`, "Progress", 1);
      data = [];
      SpreadsheetApp.flush();
    }
  }

  if (data.length > 0) {
    grievanceLog.getRange(grievanceLog.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
  }

  SpreadsheetApp.getActive().toast("✅ 5,000 grievances added!", "Complete", 5);
}

function clearAllData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Clear All Data',
    'This will delete all members and grievances. Are you sure?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActive();
  const memberDir = ss.getSheetByName(SHEETS.MEMBER_DIR);
  const grievanceLog = ss.getSheetByName(SHEETS.GRIEVANCE_LOG);

  if (memberDir.getLastRow() > 1) {
    memberDir.getRange(2, 1, memberDir.getLastRow() - 1, memberDir.getLastColumn()).clear();
  }

  if (grievanceLog.getLastRow() > 1) {
    grievanceLog.getRange(2, 1, grievanceLog.getLastRow() - 1, grievanceLog.getLastColumn()).clear();
  }

  SpreadsheetApp.getActive().toast("✅ All data cleared", "Complete", 3);
}
