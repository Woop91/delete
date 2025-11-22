# 509 Dashboard - Google Apps Script

Complete union member database and grievance tracking system for Local 509.

## Features

✅ **Correct Member Directory** - All 31 required columns
✅ **Complete Grievance Log** - All 28 required columns with auto-calculated deadlines
✅ **Real Data Only** - No fake CPU/memory metrics
✅ **Config Tab** - Centralized dropdown management
✅ **Auto-Calculations** - Deadline tracking, days open, status snapshots
✅ **Data Seeding** - Generate 20k members + 5k grievances for testing

## Setup Instructions

1. Create a new Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy and paste the entire contents of `Code.gs`
5. Save the project
6. Refresh your Google Sheet
7. A new menu **"📊 509 Dashboard"** will appear
8. Click **Admin > Seed 20k Members** and **Seed 5k Grievances**

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

## Notes

- Dashboard metrics refresh automatically
- Grievance deadlines calculated based on contract rules (21/30/10 day timelines)
- Member grievance status auto-populates from Grievance Log
- All dropdowns controlled centrally via Config tab
- No fake data - everything traces back to actual records
