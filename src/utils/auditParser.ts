import { CreateAuditData } from '../services/audit.service';
import { calculateAuditScore } from './scoreCalculator';

// Helper function to safely parse dates
function safeParseDate(dateValue: any): Date | undefined {
  if (!dateValue) return undefined;
  
  try {
    const date = new Date(dateValue);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Invalid date value: ${dateValue}`);
      return undefined;
    }
    return date;
  } catch (error) {
    console.warn(`⚠️ Error parsing date: ${dateValue}`, error);
    return undefined;
  }
}

// Helper function to safely parse and cap score to 0-100 range
function safeParseScore(scoreValue: any): number {
  if (!scoreValue) return 0;
  
  try {
    const score = parseFloat(scoreValue);
    if (isNaN(score)) {
      console.warn(`⚠️ Invalid score value: ${scoreValue}, defaulting to 0`);
      return 0;
    }
    
    // Cap score to 0-100 range
    if (score > 100) {
      console.warn(`⚠️ Score ${score} exceeds 100, capping to 100`);
      return 100;
    }
    if (score < 0) {
      console.warn(`⚠️ Score ${score} is negative, setting to 0`);
      return 0;
    }
    
    return score;
  } catch (error) {
    console.warn(`⚠️ Error parsing score: ${scoreValue}`, error);
    return 0;
  }
}

// Circle code mapping - Maps human-readable names to backend enum values
const CIRCLE_CODE_MAP: Record<string, string> = {
  // Full names to codes
  'delhi & ncr': 'DEL',
  'delhi': 'DEL',
  'mumbai': 'Mum',
  'kolkata': 'KK',
  'gujarat': 'Guj',
  'up west': 'UPW',
  'up east': 'UPE',
  'rajasthan': 'RAJ',
  'punjab': 'PB',
  'haryana': 'HR',
  'kerala': 'KER',
  'tamil nadu': 'TN',
  'andhra pradesh': 'AP',
  'west bengal': 'WB',
  'bihar': 'BH',
  'orissa': 'OR',
  'odisha': 'OR',
  'mp cg': 'MPCG',
  'madhya pradesh': 'MPCG',
  'j&k': 'JK',
  'jammu kashmir': 'JK',
  'rest of maharashtra': 'ROM',
  'north east': 'NESA',
  'ne sa': 'NESA',
  // Alternative spellings
  'delhi ncr': 'DEL',
  'ncr': 'DEL',
  'up-west': 'UPW',
  'up-east': 'UPE',
  'upwest': 'UPW',
  'upeast': 'UPE',
  'gujrat': 'Guj',
  // Short codes (already correct, but lowercase)
  'del': 'DEL',
  'mum': 'Mum',
  'kk': 'KK',
  'guj': 'Guj',
  'upw': 'UPW',
  'upe': 'UPE',
  'raj': 'RAJ',
  'pb': 'PB',
  'hr': 'HR',
  'ker': 'KER',
  'tn': 'TN',
  'ap': 'AP',
  'wb': 'WB',
  'bh': 'BH',
  'or': 'OR',
  'mpcg': 'MPCG',
  'jk': 'JK',
  'rom': 'ROM',
  'nesa': 'NESA'
};

/**
 * Normalize circle code to match backend enum
 * @param circleInput - Raw circle value from Excel
 * @returns Normalized circle code or original value
 */
function normalizeCircleCode(circleInput: string): string {
  if (!circleInput) return '';
  
  const normalized = circleInput.toLowerCase().trim();
  
  // Check if we have a mapping
  if (CIRCLE_CODE_MAP[normalized]) {
    return CIRCLE_CODE_MAP[normalized];
  }
  
  // Return original if no mapping found (might be already correct)
  return circleInput.trim();
}

// Parse Store audit data
export function parseStoreAudit(row: any, headers: string[]): Partial<CreateAuditData> | null {
  const getField = (fieldNames: string[]) => {
    for (const name of fieldNames) {
      const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
      if (index >= 0 && row[index]) return String(row[index]).trim();
    }
    return '';
  };

  const timestamp = getField(['timestamp']);
  const score = getField(['score']);
  const auditorName = getField(['name of auditor', 'auditor']);
  const circle = getField(['circle']);
  const scenario = getField(['scenario']);
  const storeName = getField(['store name']);
  const storeId = getField(['store id']);
  const storeAddress = getField(['store address']);
  const croName = getField(['name of the cro', 'cro/executive']);
  const tsm = getField(['tsm']);
  const zsm = getField(['zsm']);
  const zbm = getField(['zbm']);
  const month = getField(['month']);
  const year = getField(['year']);
  const auditDate = getField(['audit date']);
  const auditTime = getField(['audit time']);

  // REMOVED VALIDATION - Extract all data regardless of missing fields
  // if (!storeName && !storeId) return null;

  // Build raw data first
  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {} as Record<string, any>);

  // Calculate score (use provided score or auto-calculate) and cap to 0-100
  const providedScore = score ? safeParseScore(score) : null;
  const calculatedScore = safeParseScore(calculateAuditScore('store', rawDataObj));
  const finalScore = providedScore !== null ? providedScore : calculatedScore;

  return {
    storeCode: storeId || `STORE-${Date.now()}`,
    storeName: storeName || storeId || 'Unknown Store',
    location: getField(['location', 'city']) || circle || 'Unknown',
    auditType: 'store',
    circle: normalizeCircleCode(circle) || 'DEL',
    deadline: auditDate ? new Date(auditDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed', // Store audits from Excel are already completed
    score: finalScore,
    auditorName: auditorName,
    
    timestamp: timestamp ? new Date(timestamp) : undefined,
    emailAddress: getField(['email address', 'email']),
    scenario: scenario,
    tsm: tsm,
    zsm: zsm,
    zbm: zbm,
    month: month,
    year: year,
    storeAuditDate: auditDate ? new Date(auditDate) : undefined,
    storeAuditTime: auditTime,
    storeId: storeId,
    storeAddress: storeAddress,
    croExecutiveName: croName,
    
    // Store the entire row for detailed view
    rawData: headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {} as Record<string, any>),
  };
}

// Parse ILMS audit data
export function parseILMSAudit(row: any, headers: string[]): Partial<CreateAuditData> | null {
  const getField = (fieldNames: string[]) => {
    for (const name of fieldNames) {
      const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
      if (index >= 0 && row[index]) return String(row[index]).trim();
    }
    return '';
  };

  const timestamp = getField(['timestamp']);
  const score = getField(['score']);
  const auditorName = getField(['name of auditor', 'auditor']);
  const circle = getField(['circle']);
  const scenario = getField(['scenario']);
  const tsm = getField(['tsm']);
  const zsm = getField(['zsm']);
  const zbm = getField(['zbm']);
  const month = getField(['month']);
  const year = getField(['year']);
  const webInquiryDate = getField(['date of web-inquiry', 'web inquiry date']);
  const webInquiryTime = getField(['time of web-inquiry', 'web inquiry time']);
  const advisorName = getField(['name of airtel advisor', 'advisor name']);
  const advisorContact = getField(['contact number of airtel advisor', 'advisor contact']);
  const ambassadorName = getField(['name of airtel ambassador', 'ambassador name']);
  const visitDate = getField(['date of visit by agent', 'visit date']);
  const visitTime = getField(['time of visit by agent', 'visit time']);
  const pincode = getField(['pincode', 'pin code']);
  const location = getField(['location', 'city']) || circle;

  // REMOVED VALIDATION - Extract all data regardless of missing fields
  // if (!auditorName && !advisorName) return null;

  // Build raw data first
  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {} as Record<string, any>);

  // Calculate score (use provided score or auto-calculate) and cap to 0-100
  const providedScore = score ? safeParseScore(score) : null;
  const calculatedScore = safeParseScore(calculateAuditScore('ilms', rawDataObj));
  const finalScore = providedScore !== null ? providedScore : calculatedScore;

  const normalizedCircle = normalizeCircleCode(circle) || 'DEL';
  
  return {
    storeCode: `ILMS-${normalizedCircle}-${Date.now()}`,
    storeName: ambassadorName || advisorName || 'ILMS Audit',
    location: location || circle || 'Unknown',
    auditType: 'ilms',
    circle: normalizedCircle,
    deadline: webInquiryDate ? new Date(webInquiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed', // ILMS audits from Excel are already completed
    score: finalScore,
    auditorName: auditorName,
    
    timestamp: timestamp ? new Date(timestamp) : undefined,
    emailAddress: getField(['email address', 'email']),
    scenario: scenario,
    tsm: tsm,
    zsm: zsm,
    zbm: zbm,
    month: month,
    year: year,
    webInquiryDate: webInquiryDate ? new Date(webInquiryDate) : undefined,
    webInquiryTime: webInquiryTime,
    advisorName: advisorName,
    advisorContact: advisorContact,
    ambassadorName: ambassadorName,
    visitDate: visitDate ? new Date(visitDate) : undefined,
    visitTime: visitTime,
    pincode: pincode,
    
    // Store the entire row for detailed view
    rawData: rawDataObj,
  };
}

// Parse XFE audit data
export function parseXFEAudit(row: any, headers: string[]): Partial<CreateAuditData> | null {
  const getField = (fieldNames: string[]) => {
    for (const name of fieldNames) {
      const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
      if (index >= 0 && row[index]) return String(row[index]).trim();
    }
    return '';
  };

  const timestamp = getField(['timestamp']);
  const score = getField(['score']);
  const auditorName = getField(['name of auditor', 'auditor']);
  const circle = getField(['circle']);
  const scenario = getField(['scenario']);
  const tsm = getField(['tsm']);
  const zsm = getField(['zsm']);
  const zbm = getField(['zbm']);
  const month = getField(['month']);
  const year = getField(['year']);
  const xfeName = getField(['name of airtel xfe', 'xfe name']);
  const xfeNumber = getField(['number of airtel xfe', 'airtel xfe number', 'xfe number']);
  const callDate = getField(['date of call made', 'call date']);
  const callTime = getField(['time of call made', 'call time']);
  const location = getField(['location', 'city']) || circle;

  // REMOVED VALIDATION - Extract all data regardless of missing fields
  // if (!auditorName && !xfeName) return null;

  // Build raw data first
  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {} as Record<string, any>);

  // Calculate score (use provided score or auto-calculate) and cap to 0-100
  const providedScore = score ? safeParseScore(score) : null;
  const calculatedScore = safeParseScore(calculateAuditScore('xfe', rawDataObj));
  const finalScore = providedScore !== null ? providedScore : calculatedScore;

  const normalizedCircle = normalizeCircleCode(circle) || 'DEL';
  
  return {
    storeCode: `XFE-${normalizedCircle}-${Date.now()}`,
    storeName: xfeName || 'XFE Audit',
    location: location || circle || 'Unknown',
    auditType: 'xfe',
    circle: normalizedCircle,
    deadline: callDate ? new Date(callDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed', // XFE audits from Excel are already completed
    score: finalScore,
    auditorName: auditorName,
    
    timestamp: timestamp ? new Date(timestamp) : undefined,
    emailAddress: getField(['email address', 'email']),
    scenario: scenario,
    tsm: tsm,
    zsm: zsm,
    zbm: zbm,
    month: month,
    year: year,
    xfeName: xfeName,
    xfeNumber: xfeNumber,
    callDate: callDate ? new Date(callDate) : undefined,
    callTime: callTime,
    
    // Store the entire row for detailed view
    rawData: rawDataObj,
  };
}

// Detect audit type from headers
export function detectAuditType(headers: string[]): 'store' | 'ilms' | 'xfe' | 'unknown' {
  const headersLower = headers.map(h => h.toLowerCase());
  
  // Store audit indicators
  if (headersLower.some(h => h.includes('store name') || h.includes('store id') || h.includes('cro'))) {
    return 'store';
  }
  
  // ILMS audit indicators
  if (headersLower.some(h => h.includes('web-inquiry') || h.includes('advisor') || h.includes('ambassador'))) {
    return 'ilms';
  }
  
  // XFE audit indicators
  if (headersLower.some(h => h.includes('xfe') || h.includes('airtel xfe'))) {
    return 'xfe';
  }
  
  return 'unknown';
}

// Smart parser that auto-detects type
export function parseAuditRow(row: any, headers: string[], auditType?: 'store' | 'ilms' | 'xfe'): Partial<CreateAuditData> | null {
  // Detect type if not provided
  const type = auditType || detectAuditType(headers);
  
  switch (type) {
    case 'store':
      return parseStoreAudit(row, headers);
    case 'ilms':
      return parseILMSAudit(row, headers);
    case 'xfe':
      return parseXFEAudit(row, headers);
    default:
      // If type is unknown, default to store audit format
      console.warn('Unknown audit type detected, defaulting to store format');
      return parseStoreAudit(row, headers);
  }
}