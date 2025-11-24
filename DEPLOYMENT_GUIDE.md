# 509 Dashboard Deployment Guide - Integrated System

## Overview

This guide will help you deploy the **SEIU Local 509 Dashboard** - a unified system combining:
- **Comprehensive Google Sheets backend** (Member Directory + Grievance tracking with 43 & 32 columns)
- **Google Apps Script automation** with dynamic column mapping and resilience features
- **Web-based terminal-style dashboard** interface for real-time monitoring
- **Production-ready features**: CBA compliance, deadline tracking, priority sorting, data seeding

**NEW**: This guide covers the integrated system that combines the comprehensive 509 Dashboard backend with the terminal-style web interface.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Deploy Google Apps Script](#deploy-google-apps-script)
3. [Deploy Web Dashboard](#deploy-web-dashboard)
4. [Seed Test Data](#seed-test-data)
5. [Access the Dashboard](#access-the-dashboard)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "SEIU 509 Dashboard" or your preferred name

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions > Apps Script**
2. You'll see a code editor with a blank `Code.gs` file

### Step 3: Add the Code

**IMPORTANT**: You must integrate the comprehensive code with web dashboard functions.

**Option A: Use Integration Guide (Recommended)**
1. Follow the step-by-step instructions in **INTEGRATION_GUIDE.md**
2. This merges the comprehensive backend with web dashboard API functions
3. Ensures dynamic column mapping works correctly

**Option B: Quick Manual Integration**
1. Copy your comprehensive 509 Dashboard code (the large file you provided)
2. Paste it into the Apps Script editor
3. Scroll to the bottom and add the web app functions from INTEGRATION_GUIDE.md
4. Update the `onOpen()` function to include web dashboard menu items
5. Click **File > Save** (or Ctrl+S / Cmd+S)
6. Name the project "509 Dashboard System"

**Critical**: The web dashboard requires the integrated code with dynamic column mapping. Do NOT use the simple Code.gs file.

### Step 4: Add the Dashboard HTML

1. In the Apps Script editor, click the **+** button next to "Files"
2. Select **HTML**
3. Name it exactly `Dashboard` (without .html extension)
4. Delete any default content
5. Copy the entire contents of `Dashboard.html` from this repository
6. Paste it into the HTML file
7. Click **File > Save**

Your Apps Script project should now have two files:
- `Code.gs` (the main script)
- `Dashboard.html` (the web interface)

---

## Deploy Google Apps Script

### Step 1: Set Up the Sheets Structure

1. Close the Apps Script editor and return to your Google Sheet
2. Refresh the page (F5 or Cmd+R)
3. You should see a new menu: **📊 509 Dashboard**
4. If you don't see it, wait a few seconds and refresh again

### Step 2: Initialize the Dashboard

1. Click **📊 509 Dashboard > Admin > Seed 20k Members**
2. You may see a permissions dialog:
   - Click **Continue**
   - Select your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to 509 Dashboard System (unsafe)**
   - Click **Allow**
3. Wait 2-3 minutes for the seeding to complete
4. You'll see progress toasts in the bottom-right corner

5. Click **📊 509 Dashboard > Admin > Seed 5k Grievances**
6. Wait 1-2 minutes for completion

You now have a fully populated system with:
- 20,000 test members
- 5,000 test grievances
- All sheets properly formatted with formulas

---

## Deploy Web Dashboard

### Step 1: Deploy as Web App

1. Return to the Apps Script editor (**Extensions > Apps Script**)
2. Click **Deploy > New deployment**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **Web app**

### Step 2: Configure Deployment

Fill in the deployment settings:

- **Description**: "509 Dashboard v1.0"
- **Execute as**: **Me** (your email)
- **Who has access**: Choose one:
  - **Only myself** - Only you can access
  - **Anyone with Google account** - Anyone can access if they have the link
  - **Anyone** - Public access (not recommended for union data)

**Recommended**: Use "Anyone with Google account" for controlled access within your organization.

### Step 3: Deploy

1. Click **Deploy**
2. You may need to authorize again - click **Authorize access**
3. Follow the same authorization steps as before
4. Copy the **Web app URL** that appears
5. Click **Done**

The URL will look like:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**Save this URL!** You'll use it to access the dashboard.

---

## Seed Test Data

If you haven't already seeded data during setup:

### Option 1: Via Menu (Recommended)

1. In Google Sheets, click **📊 509 Dashboard > Admin > Seed 20k Members**
2. Wait for completion
3. Click **📊 509 Dashboard > Admin > Seed 5k Grievances**
4. Wait for completion

### Option 2: Via Apps Script

1. Open Apps Script editor
2. Select `SEED_20K_MEMBERS` from the function dropdown
3. Click **Run** (▶️)
4. Wait for completion
5. Select `SEED_5K_GRIEVANCES`
6. Click **Run** (▶️)
7. Wait for completion

### Verify Data

Check these sheets to confirm data was loaded:
- **Member Directory**: Should have ~20,000 rows
- **Grievance Log**: Should have ~5,000 rows
- **Dashboard**: Should show live metrics

---

## Access the Dashboard

### Method 1: Direct URL

1. Open the Web app URL you copied earlier
2. The dashboard will load with real data from your Google Sheet

### Method 2: Via Menu

1. In Google Sheets, click **📊 509 Dashboard > View Web Dashboard**
2. A dialog will appear with the URL
3. Click the link to open the dashboard

### What You'll See

The dashboard includes:

**Section 1: Executive Status**
- Total active caseload
- Overdue cases
- Win rate statistics
- Escalation tracking

**Section 2: Member & Grievance Metrics**
- Total members and stewards
- Open grievances
- Settled cases this month
- Engagement rates

**Section 3: Active Grievance Log**
- Top 10 priority cases
- Sorted by urgency
- Shows deadlines and days remaining

**Section 4: Steward Workload**
- Case distribution across stewards
- Visual load balancing
- Average resolution times

**Section 5: Upcoming Deadlines**
- Next 14 days of critical deadlines
- Color-coded urgency
- Action items required

All data updates automatically from your Google Sheet!

---

## Troubleshooting

### Dashboard Shows Loading Spinner Forever

**Problem**: Dashboard stuck on "Loading Dashboard Data..."

**Solutions**:
1. Check that you've deployed as a Web App (see Deploy Web Dashboard section)
2. Verify you authorized the script to access your sheets
3. Open browser console (F12) and check for errors
4. Make sure your Google Sheet has data (run seed functions)

### Menu Not Appearing

**Problem**: "📊 509 Dashboard" menu doesn't show

**Solutions**:
1. Refresh the Google Sheet page
2. Wait 10-15 seconds after opening the sheet
3. Check Apps Script editor - make sure code is saved
4. Run `onOpen()` manually from Apps Script editor

### Authorization Errors

**Problem**: "Authorization required" errors

**Solutions**:
1. Go to Apps Script editor
2. Click **Run** on any function
3. Complete the authorization flow
4. Return to Google Sheets and try again

### Data Not Updating

**Problem**: Dashboard shows old data or no data

**Solutions**:
1. Click **📊 509 Dashboard > Refresh All** in Google Sheets
2. Reload the web dashboard page
3. Check that formulas are working in Grievance Log sheet
4. Verify Date Filed and other key fields are populated

### "Script not found" Error

**Problem**: Web app URL returns error

**Solutions**:
1. The deployment may have been deleted
2. Redeploy the web app (Deploy > Manage deployments > Edit > Version > New version > Deploy)
3. Update your saved URL

### Slow Performance

**Problem**: Dashboard takes long to load

**Solutions**:
- Reduce data volume (use fewer test records)
- Check Google Apps Script quotas (Quota limits page)
- Consider archiving old grievances to a separate sheet

---

## Configuration Options

### Adjust Data Volume

To change the number of test records:

1. Open Apps Script editor
2. Modify the seeding functions:
   - Change `20000` in `SEED_20K_MEMBERS()` to your desired number
   - Change `5000` in `SEED_5K_GRIEVANCES()` to your desired number
3. Save and run

### Customize Deadline Timelines

To change contract deadlines (default: 21/30/10 days):

1. Open Apps Script editor
2. Find the `setupFormulasAndCalculations()` function
3. Modify the formula templates:
   - Change `+21` for filing deadline
   - Change `+30` for Step I decision
   - Change `+10` for Step II appeal
   - etc.
4. Save and run `setupFormulasAndCalculations()`

### Update Config Lists

To add new locations, stewards, job titles, etc.:

1. Go to the **Config** tab in Google Sheets
2. Add new values to the bottom of each column
3. Data validation will automatically update everywhere

---

## Security Best Practices

### Recommended Settings

1. **Execute as**: "Me" - Ensures script runs with your permissions
2. **Who has access**: "Anyone with Google account" - Limits to authenticated users
3. **Sheet Sharing**: Share the Google Sheet only with authorized union staff

### Data Privacy

- This system contains PII (names, emails, phone numbers)
- Limit access to union stewards and administrators only
- Consider using Google Workspace if available for better access controls
- Regularly review who has access to the sheet

### Backup Strategy

1. **File > Make a copy** periodically (weekly recommended)
2. Google Sheets has version history (File > Version history)
3. Export important data to CSV for offline backup
4. Store backups in a secure location

---

## Production Use

### Transition from Test Data

When ready for real data:

1. Click **📊 509 Dashboard > Admin > Clear All Data**
2. Confirm the deletion
3. Manually enter real member data in **Member Directory**
4. Manually log real grievances in **Grievance Log**

### Data Entry Best Practices

1. Always use dropdowns (don't type values manually)
2. Enter dates in consistent format (MM/DD/YYYY)
3. Fill required fields: Member ID, Name, Dates
4. Use Config tab to add new values before entering data
5. Review Dashboard regularly to ensure data quality

### Ongoing Maintenance

- **Weekly**: Review upcoming deadlines
- **Monthly**: Check steward workload distribution
- **Quarterly**: Analyze win rates and resolution times
- **Annually**: Archive old closed grievances

---

## Support

### Resources

- Main README: `README.md`
- Code Documentation: Inline comments in `Code.gs`
- Google Apps Script Docs: https://developers.google.com/apps-script

### Common Issues

For most issues:
1. Check this guide's Troubleshooting section
2. Verify all deployment steps were completed
3. Check browser console for JavaScript errors
4. Ensure Google Sheet permissions are correct

### Reporting Issues

Document:
- What you were trying to do
- What happened instead
- Any error messages
- Screenshots if applicable
- Browser and version

---

## Version History

### v1.0 (Current)
- Initial deployment with web dashboard
- 20k member + 5k grievance seeding
- Real-time metrics and analytics
- Steward workload tracking
- Deadline management

---

## Next Steps

After successful deployment:

1. ✅ Test the dashboard with seeded data
2. ✅ Verify all metrics calculate correctly
3. ✅ Share web app URL with key stakeholders for feedback
4. ✅ Train union staff on data entry procedures
5. ✅ Transition to production data when ready
6. ✅ Set up regular backup schedule
7. ✅ Monitor system performance and user adoption

---

## Congratulations!

You've successfully deployed the SEIU Local 509 Dashboard system. The dashboard is now:
- ✅ Tracking real data from Google Sheets
- ✅ Calculating metrics automatically
- ✅ Accessible via web interface
- ✅ Ready for union operations

**Access your dashboard**: Use the Web app URL you saved during deployment.

**Questions?** Refer back to this guide or check the main README.md for detailed feature documentation.
