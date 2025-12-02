# 🎯 Audit Score Calculation System - Complete Guide

## 📊 **Overview**

The Mercury Mystery Admin automatically calculates scores for all audit types (Store, ILMS, XFE) based on the responses in your Excel files.

### **How It Works:**
1. ✅ Upload Excel file with audit data
2. ✅ System reads all questions and answers
3. ✅ Applies intelligent scoring algorithm
4. ✅ Calculates category-wise scores
5. ✅ Generates overall weighted score (0-100)

### **Score Priority:**
- If your Excel has a **"Score" column** → Uses that score
- If **no Score column** → Auto-calculates based on responses
- **Best of both:** Manual + Auto-calculated

---

## 🏪 **STORE AUDIT SCORING**

### **Categories & Weights:**

| Category | Weight | Focus Area |
|----------|--------|------------|
| **Store Discovery** | 10% | Google/Thanks App accuracy, operating hours |
| **Store Hygiene** | 20% | Cleanliness, GSB, furniture, AC |
| **Greet & Behavior** | 25% | Greeting, CRO interaction, professionalism |
| **Needs Analysis** | 15% | Purpose probing, upselling, knowledge |
| **Grooming** | 10% | Uniform, appearance standards |
| **Branding** | 10% | Campaign walls, posters, materials |
| **No Denials** | 5% | No redirects, no service denials |
| **No Illegal Practices** | 5% | No extra charges, proper payment |
| **TOTAL** | **100%** | |

---

### **Detailed Calculation:**

#### **1. Store Discovery (10%)**
**Questions Analyzed:**
- Is the store address correctly updated on Google?
- Is the store information correctly updated on the Thanks App?
- Are the store operating hours accurately updated?
- Is the store location/navigation accurate on Google Maps?

**Scoring:**
```
Yes answers / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

**Example:**
```
3 Yes, 1 No out of 4 questions
= 75% category score
= 75 × 0.10 = 7.5 points
```

---

#### **2. Store Hygiene (20%)**
**Questions Analyzed:**
- Is the store exterior clean?
- Is the Glow Sign Board clean and intact?
- Is the store floor clean & free of bad odor?
- Are walls and ceilings clean and painted?
- Is the furniture neat and clean?
- Are stairs, mats, railings clean?
- Is the AC functioning properly?
- Is there any discontinued product? (No = Good)
- Was there any renovation activity? (No = Good)

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.20 = Weighted Score
```

**Example:**
```
8 Yes, 1 No out of 9 questions
= 88.9% category score
= 88.9 × 0.20 = 17.78 points
```

---

#### **3. Greet & Behavior (25%)**
**Questions Analyzed:**
- Were you greeted when entered the store?
- Was the intent/token generated?
- Were you called for service by name?
- Were you greeted by CRO at service desk?
- Were you spoken to politely?
- Was the CRO attentive and listening?
- Did the CRO explain the process clearly?
- Did the CRO inform when query will be resolved?
- Was the interaction professional and courteous?
- Did the CRO thank you at the end?
- Was any upselling or cross-selling done?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.25 = Weighted Score
```

**Example:**
```
10 Yes, 1 No out of 11 questions
= 90.9% category score
= 90.9 × 0.25 = 22.73 points
```

---

#### **4. Needs Analysis (15%)**
**Questions Analyzed:**
- Did the CRO ask about purpose of visit?
- Did the CRO ask for telecom spend details?
- Were you approached for new prepaid connection?
- Did the CRO probe for BB/DTH/family plan?
- Were you pitched Airtel BLACK/BB?
- Was the CRO knowledgeable enough?
- Did you receive the NPS survey link?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.15 = Weighted Score
```

**Example:**
```
6 Yes, 1 No out of 7 questions
= 85.7% category score
= 85.7 × 0.15 = 12.86 points
```

---

#### **5. Grooming (10%)**
**Questions Analyzed:**
- Were the CROs in proper uniform?
- Was the uniform clean and ironed?
- Were male CROs well groomed? (Hair, jewellery, nails)
- Were female CROs well groomed? (Hair, jewellery, nails)
- Was housekeeping in standard uniform?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

**Example:**
```
5 Yes out of 5 questions
= 100% category score
= 100 × 0.10 = 10 points
```

---

#### **6. Branding (10%)**
**Questions Analyzed:**
- Was the branding matching with lookbook?
- Campaign Wall present and correct?
- Service Wall present and correct?
- Poster Panels correct?
- Experience 5G Panel correct?
- Laptop Back Panels correct?
- Safety Poster/Glass Sticker present?
- Escalation Matrix present?
- Updated Leaflets/Brochures present?
- Branding visuals in good condition?
- Branding properly pasted and aligned?
- Store timing vinyl sticker present?
- Experience 5G TV functional?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

**Example:**
```
11 Yes, 2 No out of 13 questions
= 84.6% category score
= 84.6 × 0.10 = 8.46 points
```

---

#### **7. No Denials (5%)**
**Questions Analyzed:**
- Did CRO redirect to customer care? (No = Good)
- Any denial for buying prepaid connection? (No = Good)
- Any denial for prepaid SIM swap? (No = Good)
- Any denial for network issues? (No = Good)
- Any denial for new prepaid number? (No = Good)
- Did CRO explain process for End User KYC? (Yes = Good)
- Any denial for COCP? (No = Good)

**Scoring:**
```
No-denial responses / Total questions × 100 = Category Score
Category Score × 0.05 = Weighted Score
```

**Example:**
```
6 "No denial", 1 "Yes denial" out of 7 questions
= 85.7% category score
= 85.7 × 0.05 = 4.29 points
```

---

#### **8. No Illegal Practices (5%)**
**Questions Analyzed:**
- Were you charged for new SIM? (No = Good)
- Were you asked to pay activation charge? (No = Good)
- Was activation fee asked for Pre to Post migration? (No = Good)
- Did CRO take Rs 50 for postpaid SIM change? (No = Good)
- Did CRO share personal number for payments? (No = Good)
- Was payment journey via Work App? (Yes = Good)
- Were you encouraged to use digital payment? (Yes = Good)
- Were you refused when paying with cash? (No = Good)

**Scoring:**
```
Compliant responses / Total questions × 100 = Category Score
Category Score × 0.05 = Weighted Score
```

**Example:**
```
8 compliant out of 8 questions
= 100% category score
= 100 × 0.05 = 5 points
```

---

### **STORE AUDIT - Final Score Calculation:**

```
Final Score = Sum of all weighted scores

= Store Discovery (7.5)
+ Store Hygiene (17.78)
+ Greet & Behavior (22.73)
+ Needs Analysis (12.86)
+ Grooming (10)
+ Branding (8.46)
+ No Denials (4.29)
+ No Illegal Practices (5)

= 88.62 ≈ 89 points
```

### **Overall Experience Adjustment:**
If "Please rate your overall experience?" field exists:
```
Final Score = (Calculated Score × 0.70) + (Overall Rating × 0.30)
```

**Example:**
```
Calculated: 89 points
Overall Rating: 4/5 = 80%

Final = (89 × 0.70) + (80 × 0.30)
      = 62.3 + 24
      = 86.3 ≈ 86 points
```

---

## 📱 **ILMS AUDIT SCORING**

### **Categories & Weights:**

| Category | Weight | Focus Area |
|----------|--------|------------|
| **Response Time** | 15% | 15-min response, call back timing |
| **Advisor Interaction** | 25% | Introduction, greeting, professionalism |
| **Ambassador Visit** | 25% | Confirmation, appointment, timing |
| **Grooming** | 10% | Uniform, appearance, ID card |
| **Needs Analysis** | 15% | Probing, plan explanation, pitch sheet |
| **Process Compliance** | 10% | Document info, appointment booking |
| **TOTAL** | **100%** | |

---

### **Detailed Calculation:**

#### **1. Response Time (15%)**
**Questions Analyzed:**
- Did you receive call within 15 minutes?
- Did you get a call back if you didn't pick?
- Did you get a call back if you said you're busy?
- Was call back as per your preferred time slot?

**Scoring:**
```
Yes answers / Total questions × 100 = Category Score
Category Score × 0.15 = Weighted Score
```

---

#### **2. Advisor Interaction (25%)**
**Questions Analyzed:**
- Did Airtel advisor introduce himself/herself?
- Did Airtel advisor greet you politely?
- Did advisor inform about required documents?
- Did advisor book appointment as per your preference?
- Did you receive call back as requested?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.25 = Weighted Score
```

---

#### **3. Ambassador Visit (25%)**
**Questions Analyzed:**
- Did you get call from Airtel Ambassador?
- Did he visit your place?
- Did Ambassador call for confirmation before visiting?
- Did Ambassador agree to reschedule if requested?
- Did Ambassador inform about documents before visit?
- Did Ambassador visit as per your preferred time slot?
- Did Ambassador introduce himself?
- Did Ambassador greet you politely?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.25 = Weighted Score
```

---

#### **4. Grooming (10%)**
**Questions Analyzed:**
- Wearing Standard Uniform?
- Neat and clean Attire?
- Red Canvas present?
- Name Badge/ID card on lanyard?
- Clean/Trimmed Shave?
- Hair neatly made?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

---

#### **5. Needs Analysis (15%)**
**Questions Analyzed:**
- Did Ambassador probe your telecom needs?
- Did Ambassador explain benefits of postpaid plan?
- Did he discuss only the plan you opted for?
- Did Ambassador pitch about other LOBs/Airtel BLACK?
- Did ambassador use pitch sheet?
- Did Ambassador inform about Airtel thanks app?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.15 = Weighted Score
```

---

#### **6. Process Compliance (10%)**
**Questions Analyzed:**
- Did advisor inform about required documents?
- Did Ambassador inform about documents before visit?
- No asking for digital/scan docs on personal WhatsApp? (No = Good)
- No asking for extra fees on personal number? (No = Good)

**Scoring:**
```
Compliant responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

---

### **ILMS AUDIT - Example Calculation:**

```
Response Time: 100% × 0.15 = 15 points
Advisor Interaction: 90% × 0.25 = 22.5 points
Ambassador Visit: 95% × 0.25 = 23.75 points
Grooming: 100% × 0.10 = 10 points
Needs Analysis: 85% × 0.15 = 12.75 points
Process Compliance: 100% × 0.10 = 10 points

Total Score = 94 points
```

---

## ☎️ **XFE AUDIT SCORING**

### **Categories & Weights:**

| Category | Weight | Focus Area |
|----------|--------|------------|
| **Call Connectivity** | 10% | Connection, call back, response |
| **XFE Introduction** | 15% | Introduction, greeting, professionalism |
| **Needs Analysis** | 25% | Requirement probing, understanding |
| **Product Knowledge** | 25% | Plan explanation, process, benefits |
| **Service Quality** | 15% | Tone, timing, follow-up |
| **Compliance** | 10% | No extra charges, proper process |
| **TOTAL** | **100%** | |

---

### **Detailed Calculation:**

#### **1. Call Connectivity (10%)**
**Questions Analyzed:**
- Were you able to connect with XFE?
- Did he call back if number was busy?
- Did you get follow up call as requested?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

---

#### **2. XFE Introduction (15%)**
**Questions Analyzed:**
- Did Airtel XFE introduce himself/herself?
- Did Airtel XFE greet you politely?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.15 = Weighted Score
```

---

#### **3. Needs Analysis (25%)**
**Questions Analyzed:**
- Did XFE ask questions to understand requirement?
- Did XFE probe about your requirement/concern?
- Did XFE probe about telecom needs and spends?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.25 = Weighted Score
```

---

#### **4. Product Knowledge (25%)**
**Questions Analyzed:**
- Did XFE inform about the process/product?
- Did XFE inform about required documents?
- Did XFE explain about benefits of Airtel BB & BLACK?
- Did XFE inform about Airtel thanks app?
- Did XFE inform about approximate first bill with GST?
- Did XFE inform about OTT correctly?
- Were you informed about the TAT proactively?

**Scoring:**
```
Positive responses / Total questions × 100 = Category Score
Category Score × 0.25 = Weighted Score
```

---

#### **5. Service Quality (15%)**
**Questions Analyzed:**
- Was the tone polite (not rude)?
- Did XFE not push to activate connection?
- Did XFE share contact for future purposes?
- Did XFE not call outside permissible hours?
- Did you not get calls from multiple numbers?

**Scoring:**
```
Quality responses / Total questions × 100 = Category Score
Category Score × 0.15 = Weighted Score
```

---

#### **6. Compliance (10%)**
**Questions Analyzed:**
- Did XFE not overcharge or mention extra fees?
- Did XFE not pitch competition?
- Did XFE not offer discount on Paytm/PhonePay?
- Did XFE agree to process on digital/scan copy?

**Scoring:**
```
Compliant responses / Total questions × 100 = Category Score
Category Score × 0.10 = Weighted Score
```

---

### **XFE AUDIT - Example Calculation:**

```
Call Connectivity: 100% × 0.10 = 10 points
XFE Introduction: 100% × 0.15 = 15 points
Needs Analysis: 80% × 0.25 = 20 points
Product Knowledge: 90% × 0.25 = 22.5 points
Service Quality: 95% × 0.15 = 14.25 points
Compliance: 100% × 0.10 = 10 points

Total Score = 91.75 ≈ 92 points
```

---

## 🧮 **How the System Recognizes Answers**

### **Positive Responses:**
```
✅ "Yes"
✅ "Correct"
✅ "Accurate"
✅ "Polite"
✅ "Clean"
✅ "Functional"
✅ "Good"
✅ "Excellent"
✅ "Professional"
✅ "True"
✅ "Agree"
```

### **Negative Responses:**
```
❌ "No"
❌ "Not"
❌ "Incorrect"
❌ "Inaccurate"
❌ "Rude"
❌ "Dirty"
❌ "Broken"
❌ "Poor"
❌ "Unprofessional"
❌ "False"
❌ "Disagree"
❌ "Denial"
❌ "Redirect"
```

### **Skipped Fields:**
The system automatically skips:
- Timestamp fields
- Email addresses
- Name fields
- Upload/document fields
- Narrative/experience fields (used separately)
- Month/Year fields
- Score fields (if already present)

---

## 📊 **Rating Extraction**

### **From "Overall Experience" Field:**

The system can extract ratings from various formats:

**Format 1: Numeric Rating**
```
Input: "5/5"
Output: 100%

Input: "4/5"
Output: 80%

Input: "3 out of 5"
Output: 60%
```

**Format 2: Text Rating**
```
Input: "Excellent"
Output: 100%

Input: "Very good"
Output: 80%

Input: "Good"
Output: 60%

Input: "Average"
Output: 40%

Input: "Poor"
Output: 20%
```

---

## 🎯 **Score Blending**

### **When Both Exist:**

If your Excel has a "Score" column AND responses:

```
Priority: Manual Score (from Excel)
Fallback: Auto-calculated Score
```

**Example:**
```
Excel has Score: 85
System would calculate: 88

Result: Uses 85 (manual score has priority)
```

### **When Only Responses Exist:**

```
System automatically calculates based on responses
```

**Example:**
```
Excel has no Score column
System calculates from 150+ responses

Result: Auto-calculated score (e.g., 87)
```

---

## 📈 **Score Ranges & Ratings**

### **Performance Ratings:**

| Score Range | Rating | Color |
|-------------|--------|-------|
| **90-100** | 🌟 Outstanding | 🟢 Green |
| **80-89** | ✅ Excellent | 🟢 Green |
| **70-79** | 👍 Very Good | 🟢 Light Green |
| **60-69** | ⚠️ Good | 🟡 Amber |
| **50-59** | ⚠️ Average | 🟡 Amber |
| **40-49** | ❌ Below Average | 🔴 Red |
| **0-39** | ❌ Poor | 🔴 Red |

---

## 💡 **Real-World Examples**

### **Example 1: High-Performing Store Audit**

**Input:**
- All hygiene questions: Yes
- All greeting questions: Yes
- Minor branding issue: 1 No
- No denials: All good
- No illegal practices: All good

**Calculation:**
```
Store Discovery: 100% × 0.10 = 10
Store Hygiene: 100% × 0.20 = 20
Greet & Behavior: 100% × 0.25 = 25
Needs Analysis: 90% × 0.15 = 13.5
Grooming: 100% × 0.10 = 10
Branding: 92% × 0.10 = 9.2
No Denials: 100% × 0.05 = 5
No Illegal: 100% × 0.05 = 5

Total = 97.7 ≈ 98 points
Rating: 🌟 Outstanding
```

---

### **Example 2: Average-Performing ILMS Audit**

**Input:**
- Response time: Delayed (50%)
- Advisor interaction: Good (80%)
- Ambassador visit: Excellent (95%)
- Grooming: Perfect (100%)
- Needs analysis: Basic (60%)
- Compliance: Good (90%)

**Calculation:**
```
Response Time: 50% × 0.15 = 7.5
Advisor Interaction: 80% × 0.25 = 20
Ambassador Visit: 95% × 0.25 = 23.75
Grooming: 100% × 0.10 = 10
Needs Analysis: 60% × 0.15 = 9
Process Compliance: 90% × 0.10 = 9

Total = 79.25 ≈ 79 points
Rating: 👍 Very Good
```

---

### **Example 3: Poor-Performing XFE Audit**

**Input:**
- Call connectivity: Issues (40%)
- XFE introduction: No greeting (50%)
- Needs analysis: Poor probing (30%)
- Product knowledge: Limited (50%)
- Service quality: Rude tone (40%)
- Compliance: Extra charges asked (60%)

**Calculation:**
```
Call Connectivity: 40% × 0.10 = 4
XFE Introduction: 50% × 0.15 = 7.5
Needs Analysis: 30% × 0.25 = 7.5
Product Knowledge: 50% × 0.25 = 12.5
Service Quality: 40% × 0.15 = 6
Compliance: 60% × 0.10 = 6

Total = 43.5 ≈ 44 points
Rating: ❌ Below Average
```

---

## 🔧 **Technical Implementation**

### **Code Location:**
```
/utils/scoreCalculator.ts
```

### **Functions:**
```typescript
calculateStoreScore(rawData) → Returns score breakdown
calculateILMSScore(rawData) → Returns score breakdown
calculateXFEScore(rawData) → Returns score breakdown
calculateAuditScore(type, rawData) → Returns final score
getScoreBreakdown(type, rawData) → Returns detailed breakdown
```

### **Integration:**
```typescript
// During Excel parsing
const rawData = { ...all responses };
const score = calculateAuditScore('store', rawData);

// Score is automatically assigned to audit
audit.score = score;
```

---

## 📊 **Score Breakdown Feature (Future)**

The system can provide detailed breakdowns:

```typescript
{
  totalScore: 87,
  categories: [
    { name: 'Store Hygiene', score: 90, weight: 0.20, weightedScore: 18 },
    { name: 'Greet & Behavior', score: 85, weight: 0.25, weightedScore: 21.25 },
    // ... more categories
  ],
  details: {
    totalQuestions: 150,
    answeredQuestions: 147,
    positiveAnswers: 132,
    negativeAnswers: 15
  }
}
```

This can be used for:
- Showing category-wise performance
- Identifying weak areas
- Training focus areas
- Trend analysis

---

## 🎯 **Best Practices**

### **1. Consistent Response Format**
```
✅ Use "Yes" / "No" consistently
✅ Fill all applicable questions
✅ Provide overall experience rating
```

### **2. Complete Data**
```
✅ Answer all questions
✅ Don't leave critical fields blank
✅ Provide narrative experiences
```

### **3. Quality Over Quantity**
```
✅ Focus on accurate responses
✅ Detailed narrative feedback
✅ Proper documentation
```

---

## 📈 **How Scores Are Used**

### **In the System:**

1. **Audit List** - Shows score badge
2. **Audit Details** - Displays score prominently
3. **Reports Tab** - Analytics:
   - Average score overall
   - Average score by type (Store/ILMS/XFE)
   - Average score by circle
   - Auditor performance rankings
   - Score distribution charts
   - Top/bottom performers

4. **Decision Making** - Identify:
   - High performers (reward)
   - Low performers (training)
   - Problem areas (improvement)
   - Best practices (replication)

---

## 🚀 **Summary**

### **Automatic Score Calculation:**
✅ **STORE Audits** - 8 categories, weighted scoring
✅ **ILMS Audits** - 6 categories, weighted scoring  
✅ **XFE Audits** - 6 categories, weighted scoring

### **Intelligent Recognition:**
✅ Detects Yes/No answers
✅ Understands positive/negative responses
✅ Extracts overall ratings
✅ Skips metadata fields

### **Flexible Priority:**
✅ Uses manual scores if available
✅ Auto-calculates if missing
✅ Blends with overall experience rating

### **Comprehensive Analytics:**
✅ Category-wise breakdown
✅ Weighted scoring
✅ Performance ratings
✅ Detailed insights

---

**Your audits are automatically scored based on intelligent, category-weighted analysis! 🎯📊✨**
