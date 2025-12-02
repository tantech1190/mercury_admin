# 📊 Multi-Type Audit System Guide - Mercury Mystery Admin

## ✅ **Complete Multi-Type Audit Support**

Your Mercury Mystery Admin now intelligently handles **3 different audit types** with their specific field structures from Excel!

---

## 🎯 **Supported Audit Types**

### **1. STORE Audits** 🏪
Complete store visit audits with branding, cleanliness, CRO interaction, and compliance checks.

### **2. ILMS Audits** 📱
In-Location Marketing Service audits tracking web inquiries, advisor interactions, and home visits.

### **3. XFE Audits** ☎️
Xstream Fiber Expert call audits evaluating customer service over phone interactions.

---

## 🚀 **How It Works**

### **Smart Auto-Detection**
```
Upload Excel File
       ↓
System reads column headers
       ↓
Detects audit type automatically
       ↓
Parses fields specific to that type
       ↓
Stores all data + raw responses
       ↓
✅ Ready for analysis!
```

**No manual selection needed!** The system automatically detects whether your file contains Store, ILMS, or XFE audits based on the column headers.

---

## 📋 **Field Mapping**

### **STORE Audit Fields** (150+ fields supported)

#### **Required Fields:**
- Timestamp
- Email Address
- Score
- Audit Date & Time
- Name of Auditor
- Circle
- Scenario
- Store Name
- Store ID
- Store Address
- Name of CRO/Executive
- TSM, ZSM, ZBM
- Month, Year

#### **Category Fields:**
- **Store Discovery** (4 sections)
  - Google/Thanks App accuracy
  - Operating hours
  - Location/navigation
  
- **Store Hygiene** (7 sections)
  - Exterior cleanliness
  - Glow Sign Board
  - Floor, walls, ceilings
  - Furniture condition
  - AC functionality
  
- **Greet & Behavior** (11 sections)
  - Greeting experience
  - Token generation
  - CRO interaction
  - Professionalism
  - Upselling/cross-selling
  
- **Needs Analysis** (7 sections)
  - Purpose of visit
  - Telecom spend details
  - BB/DTH/BLACK pitching
  - CRO knowledge
  - NPS survey
  
- **Grooming** (10 sections)
  - Uniform standards
  - Male/female grooming
  - Housekeeping uniform
  
- **Branding** (11 sections)
  - Campaign/service walls
  - Poster panels
  - 5G panels
  - Leaflets/brochures
  
- **Denials** (8 sections)
  - Customer care redirects
  - Prepaid connection denials
  - SIM swap denials
  - Network issues
  
- **Illegal Practices** (11 sections)
  - Activation charges
  - SIM change fees
  - Personal payment collection
  - Digital payment encouragement
  
- **Competition** (3 sections)
  - Positive competitor mentions
  - Competitor referrals
  
- **Retention** (3 sections)
  - Retention efforts
  - SR raising
  - Post-to-pre scenarios
  
- **Overall Experience**
  - Rating
  - Narrative experience
  - Supporting documents (11 upload slots)

---

### **ILMS Audit Fields** (60+ fields supported)

#### **Required Fields:**
- Timestamp
- Email Address
- Score
- Name of Auditor
- Circle
- Scenario
- TSM, ZSM, ZBM
- Month, Year

#### **Web Inquiry Section:**
- Date & Time of Web-Inquiry
- Call received status
- Date & Time of first call
- Document information
- Appointment booking
- 15-minute response time
- Call back handling
- Busy handling

#### **Advisor Interaction:**
- Advisor introduction
- Name & Contact
- Polite greeting
- Call back timing
- Experience narrative

#### **Ambassador Visit:**
- Visit confirmation
- Date & Time of call/visit
- Ambassador name
- Pre-visit confirmation call
- Rescheduling flexibility
- Document requirements
- Preferred time slot
- Introduction & greeting

#### **Ambassador Grooming:**
- Standard uniform
- Neat attire
- Red canvas
- Name badge/ID
- Grooming standards

#### **Needs Analysis:**
- Telecom needs probing
- Postpaid plan benefits
- Plan discussion
- LOB/BLACK pitching
- Pitch sheet usage
- Thanks app information

#### **Additional:**
- Overall experience rating
- Narrative experience
- Supporting documents
- Pincode

---

### **XFE Audit Fields** (40+ fields supported)

#### **Required Fields:**
- Timestamp
- Email Address
- Score
- Name of Auditor
- Circle
- Scenario
- TSM, ZSM, ZBM
- Month, Year

#### **Call Details:**
- Date & Time of call
- Connection status
- XFE name & number
- Call back behavior
- Follow-up handling

#### **XFE Interaction:**
- Introduction & greeting
- Requirement probing
- Process explanation
- Document information
- Appointment booking
- Partial KYC handling

#### **Product Pitching:**
- Plan benefits explanation
- Process/product information
- Required documents
- TAT information
- Digital document acceptance
- Airtel Thanks app

#### **Service Quality:**
- Tone & professionalism
- Personal contact sharing
- Permissible hours compliance
- Multiple number calls
- Existing connection handling
- Discount offerings

#### **Competition:**
- Competitor pitching
- Other WiFi pitching

#### **Additional:**
- Overall experience rating
- Narrative experience
- Supporting documents
- Location/City
- XFE Number

---

## 📊 **What Gets Stored**

For every audit, the system stores:

### **1. Common Fields (All Types):**
```typescript
- ID (auto-generated)
- Store Code/Name
- Location
- Audit Type (store/ilms/xfe)
- Circle
- Status (completed for uploaded audits)
- Score (if available)
- Deadline
- Created timestamp
```

### **2. Type-Specific Fields:**

**Store:**
```typescript
- Store ID
- Store Address
- CRO/Executive Name
- Audit Date & Time
```

**ILMS:**
```typescript
- Advisor Name & Contact
- Ambassador Name
- Web Inquiry Date & Time
- Visit Date & Time
- Pincode
```

**XFE:**
```typescript
- XFE Name & Number
- Call Date & Time
- Location/City
```

### **3. Management Team:**
```typescript
- TSM (Territory Sales Manager)
- ZSM (Zonal Sales Manager)
- ZBM (Zonal Business Manager)
```

### **4. Raw Data:**
```typescript
- Complete row data as JSON
- All questions & responses
- Available for detailed view
```

---

## 💡 **Upload Process**

### **Step 1: Prepare Your File**
```
✅ Keep your original Excel format
✅ All your custom columns intact
✅ Score column (if available)
✅ Auditor name column
✅ Circle column
```

### **Step 2: Upload**
```
1. Go to Audits tab
2. Click "Bulk Upload"
3. Choose your XLS/XLSX file
4. System auto-detects type
5. ✅ Upload complete!
```

### **Step 3: Confirmation**
```
✅ Successfully uploaded 60 audits from Store_Audits.xlsx!

📊 Breakdown: 60 STORE
```

Or for mixed uploads:
```
✅ Successfully uploaded 120 audits from All_Audits.xlsx!

📊 Breakdown: 60 STORE, 40 ILMS, 20 XFE
```

---

## 🔍 **Detailed View Features**

### **Click any audit to see:**

#### **Basic Information Section:**
- ID, Name, Circle
- Auditor name
- Month/Year
- Scenario

#### **Type-Specific Details:**

**For STORE audits:**
- Store ID & Address
- CRO/Executive name
- Audit date & time

**For ILMS audits:**
- Advisor name & contact
- Ambassador name
- Web inquiry details
- Visit date & time
- Pincode

**For XFE audits:**
- XFE name & number
- Call date & time
- Location/city

#### **Management Team:**
- TSM, ZSM, ZBM names

#### **Detailed Responses:**
- Expandable section
- All questions & answers
- Scrollable list
- Full audit data

#### **Timeline:**
- Audit submitted (timestamp)
- Added to system
- Completion date

---

## 📈 **Analytics & Reports**

### **New Score-Based Analytics:**

#### **1. Average Score Card**
```
┌─────────────────────────────────┐
│ Score Analytics                 │
│                                 │
│ Average Score: 85.6%            │
│ Based on 60 audits with scores  │
└─────────────────────────────────┘
```

#### **2. Average Score by Audit Type (Bar Chart)**
```
STORE: ████████░░ 78.5%
ILMS:  ██████████ 92.3%
XFE:   █████████░ 88.7%
```

#### **3. Top Circles by Average Score (Horizontal Bar)**
```
Mum: ██████████ 95.2%
DEL: █████████░ 91.8%
KK:  ████████░░ 87.4%
```

#### **4. Auditor Performance by Score (Table)**
| Rank | Auditor      | Audits | Avg Score | Rating |
|------|--------------|--------|-----------|---------|
| 🥇 1 | Rajesh Kumar | 25     | 93.5%     | ✅ Excellent |
| 🥈 2 | Priya Singh  | 18     | 89.2%     | ✅ Excellent |
| 🥉 3 | Amit Sharma  | 22     | 85.7%     | ✅ Excellent |

---

## 🎯 **Use Cases**

### **Use Case 1: Upload 60 Store Audits**
```
1. Have Store_Audits_Dec.xlsx ready
2. File has 150+ columns with store audit data
3. Go to Audits → Bulk Upload
4. Choose file
5. System detects: STORE audit type
6. Parses all 150+ fields
7. ✅ 60 store audits uploaded!
8. View in list, click for details
9. See reports with store-specific analytics
```

### **Use Case 2: Upload 40 ILMS Audits**
```
1. Have ILMS_Audits_Dec.xlsx ready
2. File has 60+ columns with ILMS data
3. Upload same process
4. System detects: ILMS audit type
5. Parses advisor, ambassador, visit data
6. ✅ 40 ILMS audits uploaded!
7. See ILMS-specific details in modal
8. Reports show ILMS scores
```

### **Use Case 3: Upload 20 XFE Audits**
```
1. Have XFE_Audits_Dec.xlsx ready
2. File has 40+ columns with XFE call data
3. Upload same process
4. System detects: XFE audit type
5. Parses call details, XFE info
6. ✅ 20 XFE audits uploaded!
7. See XFE-specific details
8. Reports show XFE scores
```

### **Use Case 4: Analyze Performance**
```
1. Upload all 3 types (120 total)
2. Go to Reports tab
3. See:
   - Overall: 120 audits
   - Breakdown: 60 STORE, 40 ILMS, 20 XFE
   - Avg Score: 85.6%
   - ILMS has highest avg (92.3%)
   - STORE needs improvement (78.5%)
4. Decision: Focus training on Store auditors
```

---

## 🎨 **Visual Indicators**

### **Audit Type Badges:**
- **STORE**: 🔵 Blue badge
- **ILMS**: 🟢 Green badge  
- **XFE**: 🟠 Orange badge

### **Score Colors:**
- **Excellent** (≥80%): 🟢 Green
- **Good** (≥60%): 🟡 Amber
- **Needs Improvement** (<60%): 🔴 Red

### **Status Colors:**
- **Completed**: 🟢 Green
- **In Progress**: 🔵 Blue
- **At Risk**: 🟡 Amber
- **Unassigned**: ⚪ Gray

---

## 🔧 **Technical Details**

### **Smart Parser Features:**
1. ✅ **Auto-detection** - No manual type selection
2. ✅ **Flexible field matching** - Handles variations in column names
3. ✅ **Case-insensitive** - Works with any case
4. ✅ **Fallback logic** - Tries multiple field name variations
5. ✅ **Raw data storage** - Preserves all original data
6. ✅ **Mixed file support** - Can handle multiple types in one file

### **Detection Logic:**
```typescript
Store audits: Looks for "Store Name", "Store ID", "CRO"
ILMS audits: Looks for "Web-Inquiry", "Advisor", "Ambassador"
XFE audits: Looks for "XFE", "Airtel XFE"
```

### **Data Preservation:**
```typescript
audit.rawData = {
  "Timestamp": "11/28/2024 10:30:00",
  "Score": "85",
  "Name of Auditor": "Rajesh Kumar",
  "Circle": "Mum",
  ... // All 150+ fields preserved
}
```

---

## 📊 **Complete Analytics Suite**

### **Available Now:**

#### **Standard Analytics:**
1. ✅ Total audits count
2. ✅ Status distribution
3. ✅ Type distribution
4. ✅ Circle distribution
5. ✅ Auditor performance
6. ✅ Completion rates
7. ✅ Deadline tracking

#### **Score Analytics (NEW!):**
8. ✅ Average score overall
9. ✅ Average score by type
10. ✅ Average score by circle
11. ✅ Auditor score rankings
12. ✅ Score progress bars
13. ✅ Score-based ratings

---

## 🎉 **Summary**

### **What You Can Do:**

✅ **Upload any of 3 audit types** - Store, ILMS, XFE
✅ **Auto-detection** - System identifies type automatically
✅ **Complete field support** - All your Excel columns preserved
✅ **Detailed views** - Click audit to see type-specific fields
✅ **Score analytics** - Performance tracking by score
✅ **Raw data access** - All responses available
✅ **Mixed uploads** - Multiple types in one file
✅ **Comprehensive reports** - 20+ analytics sections

### **Your Workflow:**

```
1. Export audits from your system to Excel
2. Keep original format (Store/ILMS/XFE)
3. Upload to Mercury Mystery Admin
4. System auto-detects and parses
5. View audits in list
6. Click for detailed view
7. Analyze in Reports tab
8. Make data-driven decisions
```

---

## 🚀 **Next Steps**

### **To Get Started:**

1. **Prepare Your Files**
   - Gather Store audit Excel files
   - Gather ILMS audit Excel files
   - Gather XFE audit Excel files

2. **Upload**
   - Go to Audits → Bulk Upload
   - Select file(s)
   - System handles the rest

3. **Explore**
   - Click audits to see details
   - View type-specific fields
   - Check all responses

4. **Analyze**
   - Go to Reports tab
   - See score analytics
   - Compare type performance
   - Rank auditors by score

5. **Decide**
   - Identify top performers
   - Find areas for improvement
   - Allocate resources
   - Track progress

---

## 💡 **Pro Tips**

### **Best Practices:**

1. **Keep Original Format**
   - Don't modify Excel structure
   - Keep all columns
   - System handles variations

2. **Use Scores**
   - Ensure Score column is filled
   - Enables score analytics
   - Better insights

3. **Consistent Auditors**
   - Use same auditor names
   - Enables performance tracking
   - Accurate rankings

4. **Regular Uploads**
   - Upload periodically
   - Track trends over time
   - Monitor improvements

5. **Review Details**
   - Click audits to see full data
   - Review all responses
   - Understand context

---

## 📚 **Field Count Summary**

| Audit Type | Total Fields | Sections |
|-----------|--------------|----------|
| **STORE** | 150+ fields  | 15+ categories |
| **ILMS**  | 60+ fields   | 8+ categories |
| **XFE**   | 40+ fields   | 6+ categories |

**All fields preserved and accessible!**

---

## 🎯 **Complete Feature Set**

Your Mercury Mystery Admin now supports:

### **Core Features:**
1. ✅ Multi-type audit support (Store/ILMS/XFE)
2. ✅ Auto-detection from Excel headers
3. ✅ 150+ field support per audit
4. ✅ Score-based analytics
5. ✅ Type-specific detailed views

### **Upload Features:**
6. ✅ Native Excel upload (.xls, .xlsx)
7. ✅ Smart field parsing
8. ✅ Raw data preservation
9. ✅ Mixed type support
10. ✅ Bulk upload (60+ audits)

### **View Features:**
11. ✅ Type-specific details modal
12. ✅ All questions & responses
13. ✅ Management team info
14. ✅ Timeline visualization
15. ✅ Score display

### **Analytics Features:**
16. ✅ Average score by type
17. ✅ Average score by circle
18. ✅ Auditor score rankings
19. ✅ Score distribution charts
20. ✅ Performance tables
21. ✅ Comprehensive reports

---

**Your complete audit management system with full Store, ILMS, and XFE support is ready! 🚀📊✨**
