# How to Upload Your 60 Audits Excel File

## Step 1: Prepare Your Excel File

Your Excel file should have these columns in this exact order:

| StoreCode | StoreName | Location | AuditType | Circle | Deadline |
|-----------|-----------|----------|-----------|--------|----------|
| STR001 | Downtown Branch | Mumbai | store | Mum | 2024-12-15 |
| STR002 | North Plaza | Delhi | ilms | DEL | 2024-12-20 |
| STR003 | East Mall | Kolkata | xfe | KK | 2024-12-18 |

### Column Details:

1. **StoreCode**: Unique store identifier (e.g., STR001, STR002)
2. **StoreName**: Name of the store/branch
3. **Location**: City or area name
4. **AuditType**: Must be one of: `store`, `ilms`, or `xfe` (lowercase)
5. **Circle**: Must be one of the valid circles (see list below)
6. **Deadline**: Date in format YYYY-MM-DD (e.g., 2024-12-31)

### Valid Circles:
- AP (Andhra Pradesh)
- BH (Bihar)
- DEL (Delhi)
- Guj (Gujarat)
- HR (Haryana)
- JK (Jammu & Kashmir)
- KER (Kerala)
- KK (Kolkata)
- MPCG (Madhya Pradesh/Chhattisgarh)
- Mum (Mumbai)
- NESA (North East & Assam)
- OR (Odisha)
- PB (Punjab)
- RAJ (Rajasthan)
- ROM (Rest of Maharashtra)
- TN (Tamil Nadu)
- UPE (Uttar Pradesh East)
- UPW (Uttar Pradesh West)
- WB (West Bengal)

### Valid Audit Types:
- `store` - Store Audit
- `ilms` - ILMS Audit
- `xfe` - XFE Audit

## Step 2: Export from Excel

1. Open your Excel file with the 60 audits
2. Click **File → Save As**
3. Choose **CSV (Comma delimited) (*.csv)** as the file type
4. Save the file
5. Click **Yes** when Excel asks about features

## Step 3: Upload to Application

1. Log in to Mercury Mystery Admin
2. Navigate to **Audits** tab
3. Click **Bulk Upload** button
4. Click **Download Template** to see the exact format (optional)
5. Click **Choose File to Upload**
6. Select your CSV file
7. Wait for the success message showing how many audits were uploaded

## Step 4: Verify Upload

1. Check the audit stats at the top showing total counts
2. Scroll down to see all your audits listed
3. Use the search and filter options to find specific audits
4. Go to **Reports** tab to see analytics and charts

## Troubleshooting

### If upload fails or shows 0 audits:
- Make sure the first row has column headers exactly as shown
- Check that audit types are lowercase (store, ilms, xfe)
- Verify circle codes match the valid list
- Ensure dates are in YYYY-MM-DD format
- Remove any empty rows at the end

### If some audits are missing:
- Check that each row has all required fields
- StoreCode and StoreName cannot be empty
- The system skips rows with missing critical data

## Example CSV File Content:

```csv
StoreCode,StoreName,Location,AuditType,Circle,Deadline
STR001,Galaxy Mall Store,Mumbai,store,Mum,2024-12-15
STR002,Phoenix Plaza,Delhi,store,DEL,2024-12-18
STR003,Express Avenue,Chennai,ilms,TN,2024-12-20
STR004,City Center Mall,Bangalore,xfe,KK,2024-12-22
STR005,Mantri Square,Hyderabad,store,AP,2024-12-25
```

## After Upload

Once uploaded, you can:
- ✅ View all audits in the Audits tab
- ✅ Filter by status (unassigned, open, in-progress, at-risk, completed)
- ✅ Search by store code, name, or location
- ✅ Assign audits to auditors (system filters by matching circle and audit type)
- ✅ Update audit status
- ✅ View analytics in Reports tab:
  - Status distribution pie chart
  - Audit type distribution bar chart
  - Circle distribution bar chart
  - Performance metrics

## Need Help?

Contact the system administrator or refer to the in-app instructions.
