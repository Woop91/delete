# 509 Dashboard - Google Apps Script

Complete union member database and grievance tracking system for Local 509.

## 📋 Table of Contents
- [Overview](#overview)
- [How It Works](#how-it-works)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Detailed Features](#detailed-features)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The 509 Dashboard is a comprehensive Google Sheets-based system for managing union member data and tracking grievances. Built with Google Apps Script, it provides automated deadline calculations, real-time analytics, and centralized data management—all without requiring external databases or complex infrastructure.

**Built for**: Local 509 union organizers, stewards, and administrators
**Platform**: Google Sheets + Google Apps Script
**Data Capacity**: Tested with 20,000 members and 5,000 grievances
**Key Principle**: All metrics derived from real data—no simulated or fake statistics

## 🔧 How It Works

### Core Components

1. **Google Apps Script Engine**: JavaScript-based automation that runs within Google Sheets
2. **Sheet-Based Database**: Uses Google Sheets as a structured database with data validation
3. **Formula-Driven Calculations**: Auto-calculates deadlines, metrics, and status updates
4. **Config-Driven Dropdowns**: Centralized lists ensure data consistency across all sheets

### Data Flow

```
Config Tab (Master Lists)
    ↓
    ├→ Member Directory (31 columns of member data)
    │   ↓
    │   └→ Grievance snapshot fields auto-populate from Grievance Log
    │
    └→ Grievance Log (28 columns of grievance tracking)
        ↓
        ├→ Auto-calculates deadlines based on contract rules
        ├→ Tracks days open and days to deadline
        └→ Feeds data back to Member Directory
        ↓
Dashboard (Real-time metrics and visualizations)
```

### Automation Features

- **On-Open Trigger**: Menu loads automatically when sheet opens
- **Formula-Based Updates**: Calculations refresh automatically when data changes
- **Data Validation**: Dropdowns enforce consistent values from Config tab
- **Batch Processing**: Seeding functions use optimized batch writes for performance

## ✨ Features

✅ **Correct Member Directory** - All 31 required columns exactly as specified
✅ **Complete Grievance Log** - All 28 required columns with auto-calculated deadlines
✅ **Real Data Only** - No fake CPU/memory metrics, all analytics from actual data
✅ **Config Tab** - Centralized dropdown management for consistency
✅ **Auto-Calculations** - Deadline tracking, days open, status snapshots
✅ **Data Seeding** - Generate 20k members + 5k grievances for testing/training
✅ **Custom Menu** - Easy access to all admin functions
✅ **Member Satisfaction Tracking** - Survey data with calculated averages
✅ **Feedback System** - Track system improvements and feature requests

## Setup Instructions

1. Create a new Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy and paste the entire contents of `Code.gs`
5. Save the project
6. Refresh your Google Sheet
7. A new menu **"📊 509 Dashboard"** will appear
8. Click **Admin > Seed 20k Members** and **Seed 5k Grievances**

## 🏗️ Architecture

### File Structure

```
Code.gs
├── Configuration Constants (SHEETS object)
├── Main Setup Function (CREATE_509_DASHBOARD)
├── Sheet Creation Functions
│   ├── createConfigTab()
│   ├── createMemberDirectory()
│   ├── createGrievanceLog()
│   ├── createMainDashboard()
│   ├── createAnalyticsDataSheet()
│   ├── createMemberSatisfactionSheet()
│   └── createFeedbackSheet()
├── Data Management
│   ├── setupDataValidations()
│   ├── setupFormulasAndCalculations()
│   ├── SEED_20K_MEMBERS()
│   └── SEED_5K_GRIEVANCES()
└── User Interface
    ├── onOpen() - Menu creation
    ├── refreshCalculations()
    ├── goToDashboard()
    └── showHelp()
```

### Technical Details

**Language**: Google Apps Script (JavaScript ES6)
**Runtime**: Google Apps Script V8 Runtime
**Permissions Required**:
- Google Sheets API access
- Ability to create/modify sheets
- Ability to add custom menus

**Performance Optimizations**:
- Batch writing (1000 rows at a time for seeding)
- SpreadsheetApp.flush() for immediate updates
- Hidden analytics sheet to reduce visual clutter
- Formula-based calculations instead of script calculations where possible

### Database Design

The system uses a **normalized sheet structure**:

1. **Config** = Master reference tables
2. **Member Directory** = Member entity (1 row = 1 member)
3. **Grievance Log** = Grievance entity (1 row = 1 grievance)
4. **Relationships**: Member Directory ← Member ID → Grievance Log

This prevents data duplication and ensures consistency.

## 📊 Detailed Features

### 1. Config Tab - Centralized Control

**Purpose**: Single source of truth for all dropdown values

**How it works**:
- Each column contains a master list (Job Titles, Locations, Units, etc.)
- Data validation rules reference these ranges
- Changes to Config automatically update all dropdowns
- Prevents typos and inconsistent data entry

**Columns**:
- Job Titles (Coordinator, Analyst, Case Manager, etc.)
- Office Locations (Boston HQ, Worcester Office, etc.)
- Units (Unit A-E with descriptive names)
- Office Days (Monday-Sunday)
- Yes/No (Standard boolean values)
- Supervisors (Master list of supervisor names)
- Managers (Master list of manager names)
- Stewards (Master list of steward/organizer names)
- Grievance Status (Open, Pending Info, Settled, Withdrawn, Closed, Appealed)
- Grievance Step (Informal, Step I, Step II, Step III, Mediation, Arbitration)
- Issue Category (Discipline, Workload, Scheduling, Pay, Discrimination, Safety, Benefits, etc.)
- Articles Violated (Contract articles: Art. 1-30)
- Communication Methods (Email, Phone, Text, In Person)

**Best Practices**:
- Keep lists continuous (no blank rows in middle)
- Add new values at the bottom
- Use Find & Replace if changing existing values
- Don't delete values that are in use

### 2. Member Directory - Complete Member Profiles

**Purpose**: Track all member information and engagement

**31 Columns Explained**:

| Column | Type | Purpose | Auto-Populated? |
|--------|------|---------|----------------|
| Member ID | Text | Unique identifier (e.g., M000001) | Manual |
| First Name | Text | Member's first name | Manual |
| Last Name | Text | Member's last name | Manual |
| Job Title | Dropdown | Current position | Manual (from Config) |
| Work Location (Site) | Dropdown | Primary work location | Manual (from Config) |
| Unit | Dropdown | Bargaining unit | Manual (from Config) |
| Office Days | Text | Days in office (Mon, Tue, etc.) | Manual |
| Email Address | Email | Primary contact email | Manual |
| Phone Number | Phone | Contact number | Manual |
| Is Steward (Y/N) | Dropdown | Whether member is a steward | Manual (from Config) |
| Supervisor (Name) | Dropdown | Direct supervisor | Manual (from Config) |
| Manager (Name) | Dropdown | Manager | Manual (from Config) |
| Assigned Steward (Name) | Dropdown | Primary steward for this member | Manual (from Config) |
| Last Virtual Mtg (Date) | Date | Most recent virtual meeting attendance | Manual |
| Last In-Person Mtg (Date) | Date | Most recent in-person meeting | Manual |
| Last Survey (Date) | Date | Most recent survey completion | Manual |
| Last Email Open (Date) | Date | Most recent email engagement | Manual |
| Open Rate (%) | Number | Email open rate percentage | Manual |
| Volunteer Hours (YTD) | Number | Hours volunteered year-to-date | Manual |
| Interest: Local Actions | Dropdown (Y/N) | Interested in local organizing | Manual |
| Interest: Chapter Actions | Dropdown (Y/N) | Interested in chapter activities | Manual |
| Interest: Allied Chapter Actions | Dropdown (Y/N) | Interested in allied chapter work | Manual |
| Timestamp | Date/Time | Record creation/update time | Manual |
| Preferred Communication Methods | Dropdown | How they prefer contact | Manual (from Config) |
| Best Time(s) to Reach Member | Text | Preferred contact times | Manual |
| **Has Open Grievance?** | **Formula** | **Yes if member has open grievance** | **AUTO** |
| **Grievance Status Snapshot** | **Formula** | **Status of member's grievance** | **AUTO** |
| **Next Grievance Deadline** | **Formula** | **Upcoming deadline for grievance** | **AUTO** |
| Most Recent Steward Contact Date | Date | Last contact from steward | Manual |
| Steward Who Contacted Member | Text | Name of contacting steward | Manual |
| Notes from Steward Contact | Text | Notes from conversation | Manual |

**Key Features**:
- Grievance snapshot fields (columns 26-28) automatically populate from Grievance Log
- Data validation prevents invalid entries
- All engagement metrics in one place for easy analysis

### 3. Grievance Log - Complete Grievance Tracking

**Purpose**: Track every grievance through its lifecycle with automatic deadline calculations

**28 Columns Explained**:

| Column | Type | Purpose | Auto-Calculated? |
|--------|------|---------|------------------|
| Grievance ID | Text | Unique ID (e.g., G-000001) | Manual |
| Member ID | Text | Links to Member Directory | Manual |
| First Name | Text | Member's first name | Manual |
| Last Name | Text | Member's last name | Manual |
| Status | Dropdown | Current status (Open, Pending, Settled, etc.) | Manual (from Config) |
| Current Step | Dropdown | Grievance step (Informal, Step I-III, etc.) | Manual (from Config) |
| Incident Date | Date | When incident occurred | Manual |
| **Filing Deadline (21d)** | **Formula** | **Incident Date + 21 days** | **AUTO** |
| Date Filed (Step I) | Date | When grievance was filed | Manual |
| **Step I Decision Due (30d)** | **Formula** | **Date Filed + 30 days** | **AUTO** |
| Step I Decision Rcvd | Date | When Step I decision received | Manual |
| **Step II Appeal Due (10d)** | **Formula** | **Step I Decision + 10 days** | **AUTO** |
| Step II Appeal Filed | Date | When appealed to Step II | Manual |
| **Step II Decision Due (30d)** | **Formula** | **Step II Appeal + 30 days** | **AUTO** |
| Step II Decision Rcvd | Date | When Step II decision received | Manual |
| **Step III Appeal Due (30d)** | **Formula** | **Step II Decision + 30 days** | **AUTO** |
| Step III Appeal Filed | Date | When appealed to Step III | Manual |
| Date Closed | Date | When grievance closed/resolved | Manual |
| **Days Open** | **Formula** | **Today - Date Filed (or Date Closed - Date Filed)** | **AUTO** |
| **Next Action Due** | **Formula** | **Next upcoming deadline based on current step** | **AUTO** |
| **Days to Deadline** | **Formula** | **Next Action Due - Today** | **AUTO** |
| Articles Violated | Dropdown | Contract articles violated | Manual (from Config) |
| Issue Category | Dropdown | Type of grievance | Manual (from Config) |
| Member Email | Email | Member's email (for reference) | Manual |
| Unit | Dropdown | Member's unit | Manual (from Config) |
| Work Location (Site) | Dropdown | Member's work location | Manual (from Config) |
| Assigned Steward (Name) | Dropdown | Steward handling case | Manual (from Config) |
| Resolution Summary | Text | How grievance was resolved | Manual |

**Deadline Calculation Rules** (Based on standard union contract):
- **Filing Deadline**: Incident Date + 21 days
- **Step I Decision**: Date Filed + 30 days
- **Step II Appeal**: Step I Decision + 10 days
- **Step II Decision**: Step II Appeal + 30 days
- **Step III Appeal**: Step II Decision + 30 days

**Key Features**:
- All deadlines auto-calculate based on contract rules
- "Next Action Due" intelligently selects the relevant deadline based on current step
- "Days to Deadline" shows urgency (negative numbers = overdue)
- Conditional formatting highlights approaching/overdue deadlines

### 4. Dashboard - Real-Time Analytics

**Purpose**: At-a-glance view of key metrics, all derived from real data

**Metrics Displayed**:

**Member Metrics**:
- Total Members: `=COUNTA('Member Directory'!A:A)-1`
- Active Stewards: `=COUNTIF('Member Directory'!J:J,"Yes")`
- Average Open Rate: `=AVERAGE('Member Directory'!R:R)`
- YTD Volunteer Hours: `=SUM('Member Directory'!S:S)`

**Grievance Metrics**:
- Open Grievances: `=COUNTIF('Grievance Log'!E:E,"Open")`
- Pending Info: `=COUNTIF('Grievance Log'!E:E,"Pending Info")`
- Settled This Month: Count of settled grievances with Date Closed in current month
- Average Days Open: `=AVERAGE(FILTER('Grievance Log'!S:S, 'Grievance Log'!E:E="Open"))`

**Engagement Metrics** (Last 30 Days):
- Virtual Meetings Attended
- In-Person Meetings Attended
- Members Interested in Local Actions
- Members Interested in Chapter Actions

**Upcoming Deadlines**:
- Table showing next 10 grievances with approaching deadlines
- Auto-sorted by date

**Key Features**:
- All formulas reference actual data (no hardcoded values)
- Updates automatically when data changes
- Timestamp shows last calculation refresh

### 5. Data Seeding Functions

**Purpose**: Generate realistic test data for training and testing

**SEED_20K_MEMBERS()** - Generates 20,000 member records
- Realistic names from common first/last name lists
- Random but realistic job titles, locations, units
- Varied engagement history (meetings, surveys, volunteer hours)
- Random interest levels in organizing activities
- Valid email addresses (formatted: firstname.lastname###@union.org)
- Phone numbers in (555) format
- Batch writes 1000 rows at a time for performance
- Progress toasts show completion status

**SEED_5K_GRIEVANCES()** - Generates 5,000 grievance records
- Links to existing members via Member ID
- Realistic timeline (incidents 0-365 days ago)
- Various statuses (Open, Pending, Settled, Closed, Withdrawn)
- Different steps (Informal through Arbitration)
- Random but appropriate issue categories and articles
- Closed grievances include resolution summaries
- Batch writes 500 rows at a time
- Auto-calculates all deadline fields after insertion

**Performance**:
- 20k members: ~2-3 minutes
- 5k grievances: ~1-2 minutes

### 6. Member Satisfaction Tracking

**Purpose**: Track and analyze member satisfaction surveys

**Columns**:
- Survey ID
- Member ID (links to Member Directory)
- Member Name
- Date Sent
- Date Completed
- Overall Satisfaction (1-5 scale)
- Steward Support (1-5 scale)
- Communication (1-5 scale)
- Would Recommend Union (Y/N)
- Comments (free text)

**Calculated Metrics**:
- Average Overall Satisfaction
- Average Steward Support
- Average Communication
- % Would Recommend (percentage of Yes responses)

### 7. Feedback & Development

**Purpose**: Track system improvements and feature requests

**Columns**:
- Timestamp
- Submitted By
- Category
- Type (Bug, Feature Request, Improvement)
- Priority (Low, Medium, High, Critical)
- Title
- Description
- Status (New, In Progress, Resolved, Won't Fix)
- Assigned To
- Resolution
- Notes

## Sheet Structure

### Config Tab
Master lists for all dropdowns:
- Job Titles
- Office Locations
- Units
- Supervisors, Managers, Stewards
- Grievance Status & Steps
- Issue Categories
- Articles Violated

### Member Directory
31 columns tracking:
- Basic info (ID, name, contact)
- Work details (job, location, unit, supervisor, manager)
- Steward assignments
- Engagement metrics (meetings, surveys, volunteer hours)
- Interests (local, chapter, allied actions)
- Grievance snapshot (auto-populated)
- Communication preferences

### Grievance Log
28 columns tracking:
- Grievance identification
- Member linkage
- Status and step tracking
- All deadlines (auto-calculated):
  - Filing deadline (incident + 21d)
  - Step I decision (filed + 30d)
  - Step II appeal (decision + 10d)
  - Step II decision (appeal + 30d)
  - Step III appeal (decision + 30d)
- Days open (auto-calculated)
- Days to deadline (auto-calculated)
- Resolution tracking

### Dashboard
Real-time metrics from actual data:
- Total members, active stewards, engagement rates
- Open grievances by status
- Upcoming deadlines
- Member satisfaction scores
- All metrics linked to actual Member Directory and Grievance Log data

### Member Satisfaction
Survey tracking with calculated averages:
- Overall satisfaction
- Steward support ratings
- Communication ratings
- Recommendation percentage

### Feedback & Development
System improvement tracking

## Data Seeding

Generate realistic test data:
- **20,000 Members**: Diverse names, locations, job titles, engagement history
- **5,000 Grievances**: Linked to members, various statuses, realistic timelines

Access via: **📊 509 Dashboard > Admin > Seed Data**

## Key Improvements

✅ **All columns match specifications exactly**
✅ **No fake metrics** (removed CPU usage, memory, innovation index, etc.)
✅ **Real analytics** based on actual Member Directory and Grievance Log data
✅ **Auto-calculated deadlines** follow contract timelines
✅ **Linked data** between Member Directory and Grievance Log
✅ **Data validation** from Config tab prevents inconsistent entries

## Usage

1. **Add Members**: Manually or use seed function
2. **Log Grievances**: Enter incident date, filing date, status, step
3. **Track Progress**: Deadlines calculate automatically
4. **Monitor Dashboard**: Real-time metrics update automatically
5. **Maintain Config**: Add new locations, stewards, etc. in Config tab
6. **Main Function**: Run `CREATE_509_DASHBOARD()` to set up all sheets

## 💡 Usage Examples

### Example 1: Adding a New Member

1. Go to **Member Directory** sheet
2. Click on the first empty row
3. Enter Member ID (e.g., M000123)
4. Fill in name, contact info
5. Use dropdowns for:
   - Job Title (from Config)
   - Work Location (from Config)
   - Unit (from Config)
   - Supervisor, Manager, Assigned Steward (from Config)
6. Fill in engagement data as available
7. Grievance columns (26-28) will auto-populate if the member has grievances

### Example 2: Logging a New Grievance

1. Go to **Grievance Log** sheet
2. Click on the first empty row
3. Enter:
   - Grievance ID (e.g., G-000456)
   - Member ID (must match Member Directory)
   - Member name
   - **Incident Date** (when it happened)
   - **Date Filed** (when you filed it)
4. Select from dropdowns:
   - Status (usually "Open")
   - Current Step (usually "Informal" or "Step I")
   - Issue Category
   - Articles Violated
   - Assigned Steward
5. Watch as the system automatically calculates:
   - Filing Deadline (Incident + 21d)
   - Step I Decision Due (Filed + 30d)
   - Days Open
   - Next Action Due
   - Days to Deadline

### Example 3: Tracking a Grievance Through Steps

**Scenario**: Grievance filed, Step I decision received, now appealing to Step II

1. Find the grievance row in **Grievance Log**
2. Enter **Step I Decision Rcvd** date (column K)
3. System automatically calculates **Step II Appeal Due** (Decision + 10d)
4. When you file Step II appeal:
   - Enter **Step II Appeal Filed** date (column M)
   - Update **Current Step** to "Step II"
   - System calculates **Step II Decision Due** (Appeal + 30d)
5. **Next Action Due** automatically updates to show Step II decision deadline
6. Member Directory grievance snapshot updates automatically

### Example 4: Closing a Grievance

1. Go to the grievance row in **Grievance Log**
2. Update **Status** to "Settled" (or "Withdrawn", "Closed")
3. Enter **Date Closed**
4. Fill in **Resolution Summary** (brief description of outcome)
5. System automatically:
   - Calculates total **Days Open** (Date Closed - Date Filed)
   - Clears **Next Action Due** (no more deadlines)
   - Updates **Member Directory** grievance snapshot
6. Dashboard "Open Grievances" count decreases automatically

### Example 5: Adding a New Location to Config

**Scenario**: Local 509 opens a new office in "Framingham"

1. Go to **Config** tab
2. Find the "Office Locations" column (Column B)
3. Scroll to the first empty cell in that column
4. Type "Framingham Office"
5. Immediately, all dropdowns in:
   - Member Directory → Work Location
   - Grievance Log → Work Location
   ...now include "Framingham Office" as an option

### Example 6: Generating Test Data

**For Training or Testing**:

1. Click **📊 509 Dashboard** menu
2. Select **Admin > Seed 20k Members**
3. Confirm the dialog
4. Wait 2-3 minutes while it generates realistic member data
5. Select **Admin > Seed 5k Grievances**
6. Confirm and wait 1-2 minutes
7. Go to **Dashboard** to see populated metrics
8. Use **Admin > Clear All Data** when done testing

### Example 7: Monthly Report Generation

**Scenario**: You need member engagement stats for the monthly chapter meeting

1. Go to **Dashboard**
2. Note the metrics:
   - Total Members
   - Active Stewards
   - Open Grievances count
   - Engagement metrics (last 30 days)
3. Check **Upcoming Deadlines** table for grievances needing attention
4. Go to **Member Directory** and filter:
   - Interest: Local Actions = "Yes"
   - Last Virtual Mtg >= (30 days ago)
5. Export this filtered list for targeted outreach
6. Go to **Grievance Log** and filter by Status = "Open" to review active cases

### Example 8: Tracking Steward Workload

**Scenario**: Want to see how many open grievances each steward is handling

1. Go to **Grievance Log**
2. Click Data → Create a filter
3. Filter **Status** = "Open"
4. Filter **Assigned Steward** = specific steward name
5. Count visible rows to see their caseload
6. OR use **Analytics Data** sheet (if unhidden) which has pre-calculated steward workloads

## 🐛 Troubleshooting

### Issue: Menu "📊 509 Dashboard" doesn't appear

**Solution**:
- Close and reopen the Google Sheet
- Check that the script is saved: Extensions > Apps Script
- Run `onOpen()` manually from script editor
- Check permissions: Apps Script may need authorization on first run

### Issue: Formulas showing #REF! errors

**Cause**: Sheet names don't match expected names

**Solution**:
- Ensure sheets are named exactly:
  - "Member Directory" (not "Member-Directory" or "Members")
  - "Grievance Log" (not "Grievances")
  - "Config" (not "Configuration")
- Re-run `CREATE_509_DASHBOARD()` to recreate sheets with correct names

### Issue: Dropdowns not showing values from Config

**Cause**: Data validation not set up or Config tab modified

**Solution**:
1. Check **Config** tab has values in the right columns
2. Go to Apps Script editor
3. Run `setupDataValidations()` function manually
4. Or re-run full `CREATE_509_DASHBOARD()` setup

### Issue: Seeding functions timeout or fail

**Cause**: Google Apps Script execution time limit (6 minutes)

**Solution**:
- Reduce batch size in code (change BATCH_SIZE constant)
- Run in smaller chunks (modify functions to seed 5k at a time instead of 20k)
- For very large datasets, consider importing CSV data instead

### Issue: Deadline calculations not working

**Cause**: Formulas not set up in Grievance Log

**Solution**:
1. Go to Apps Script editor
2. Run `setupFormulasAndCalculations()` manually
3. Check that date columns have actual dates (not text)
4. Verify formulas exist in columns H, J, L, N, P, S, T, U

### Issue: Member Directory grievance snapshot not updating

**Cause**: Formulas in columns Z, AA, AB not present or broken

**Solution**:
1. Check row 2 of Member Directory, columns Z-AB
2. Should have formulas like:
   - Column Z: `=IF(COUNTIFS('Grievance Log'!B:B,A2,'Grievance Log'!E:E,"Open")>0,"Yes","No")`
3. If missing, run `setupFormulasAndCalculations()` from script editor
4. Or copy formula from row 2 down to all member rows

### Issue: Dashboard showing #DIV/0! or #N/A errors

**Cause**: No data in Member Directory or Grievance Log yet

**Solution**:
- Errors are normal when sheets are empty
- Add at least one member and one grievance, or
- Run seed functions to populate with test data
- Formulas will calculate correctly once data exists

### Issue: "Cannot read property of null" script error

**Cause**: Sheet doesn't exist

**Solution**:
- Run `CREATE_509_DASHBOARD()` to create all required sheets
- Check that you haven't renamed or deleted any sheets
- Sheet names are case-sensitive

### Issue: Data validation allows invalid values

**Cause**: User typed instead of using dropdown, or validation rule removed

**Solution**:
1. Re-run `setupDataValidations()` from Apps Script
2. Educate users to always use dropdowns, not typing
3. Regularly audit data with filters to find inconsistent values

### Issue: Performance is slow with large datasets

**Optimization tips**:
- Avoid opening all sheets at once
- Use filters instead of scrolling through thousands of rows
- Hide unused sheets
- Clear formatting from unused cells
- Consider archiving old closed grievances to a separate sheet

### Issue: Want to customize deadline timelines (not 21/30/10 days)

**Solution**:
1. Go to Apps Script editor
2. Find `setupFormulasAndCalculations()` function
3. Modify the formulas:
   - Line with `G${row}+21` → change 21 to your filing deadline days
   - Line with `I${row}+30` → change 30 to your Step I decision days
   - Line with `K${row}+10` → change 10 to your Step II appeal days
   - etc.
4. Save and run the function to update all formulas

## 📌 Best Practices

1. **Always use dropdowns** - Don't type values that should come from Config
2. **Keep Config clean** - Remove unused values, fix typos in Config (not in data sheets)
3. **Use consistent Member IDs** - Stick to a format (e.g., M000001, M000002)
4. **Enter dates promptly** - Grievance calculations depend on accurate dates
5. **Review deadlines weekly** - Check Dashboard "Upcoming Deadlines" regularly
6. **Archive old data** - Move closed grievances older than 2 years to archive sheet
7. **Back up regularly** - File > Make a copy periodically
8. **Train users** - Ensure all stewards understand the system before using
9. **Test before production** - Use seed functions to test, then clear before real use
10. **Document customizations** - If you modify Config lists or formulas, document changes

## 🔒 Data Privacy & Security

- **Access Control**: Use Google Sheets sharing settings to control who can view/edit
- **Member Data**: Contains PII (names, emails, phone numbers) - restrict access appropriately
- **Grievance Confidentiality**: Limit access to union staff and authorized stewards only
- **Backup Strategy**: Regular backups recommended (Google Sheets has version history)
- **Export Restrictions**: Be cautious about exporting member lists to CSV/Excel

## 📝 Notes

- Dashboard metrics refresh automatically when data changes
- Grievance deadlines calculated based on contract rules (21/30/10 day timelines)
- Member grievance status auto-populates from Grievance Log
- All dropdowns controlled centrally via Config tab
- No fake data - everything traces back to actual records
- System supports up to ~100,000 rows per sheet (Google Sheets limit: 10M cells total)

## 📞 Support

For issues with the 509 Dashboard:
1. Check this README's Troubleshooting section
2. Review formulas in Apps Script code
3. Test with fresh setup using `CREATE_509_DASHBOARD()`
4. Document bugs in the Feedback & Development sheet

## 📄 License

Created for Local 509. Modify as needed for your union's requirements.
