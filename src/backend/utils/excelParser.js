/**
 * EXCEL PARSER UTILITY
 * Parses uploaded Excel files and extracts audit data
 */

const XLSX = require('xlsx');
const { calculateAuditScore } = require('./scoreCalculator');

// Detect audit type from headers
function detectAuditType(headers) {
  const headerStr = headers.join('|').toLowerCase();
  
  // ILMS indicators
  if (headerStr.includes('web inquiry') || 
      headerStr.includes('advisor') || 
      headerStr.includes('ambassador')) {
    return 'ilms';
  }
  
  // XFE indicators
  if (headerStr.includes('xfe') || 
      headerStr.includes('call date') && headerStr.includes('call time')) {
    return 'xfe';
  }
  
  // Default to store
  return 'store';
}

// Parse store audit
function parseStoreAudit(row, headers) {
  const getField = (patterns) => {
    for (const pattern of patterns) {
      const header = headers.find(h => h.toLowerCase().includes(pattern.toLowerCase()));
      if (header) {
        const index = headers.indexOf(header);
        return row[index];
      }
    }
    return null;
  };

  const storeId = getField(['store code', 'store id', 'storecode']);
  const storeName = getField(['store name', 'storename']);
  const circle = getField(['circle']);
  const location = getField(['location', 'city']);
  const auditorName = getField(['auditor name', 'mystery shopper']);
  const auditorEmail = getField(['email address', 'auditor email']);
  const auditDate = getField(['timestamp', 'date']);
  const score = getField(['score']);
  const month = getField(['month']);
  const year = getField(['year']);
  const address = getField(['store address', 'address']);
  const city = getField(['city']);
  const pincode = getField(['pincode', 'pin code']);

  if (!storeName && !storeId) return null;

  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {});

  const providedScore = score ? parseFloat(score) : null;
  const calculatedScore = calculateAuditScore('store', rawDataObj);
  const finalScore = providedScore || calculatedScore;

  return {
    storeCode: storeId || `STORE-${Date.now()}`,
    storeName: storeName || storeId || 'Unknown Store',
    location: location || circle || 'Unknown',
    auditType: 'store',
    circle: circle || 'Unknown',
    deadline: auditDate ? new Date(auditDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    score: finalScore,
    auditorName: auditorName,
    auditorEmail: auditorEmail,
    month: month,
    year: year,
    storeAddress: address,
    city: city,
    pincode: pincode,
    rawData: rawDataObj,
  };
}

// Parse ILMS audit
function parseILMSAudit(row, headers) {
  const getField = (patterns) => {
    for (const pattern of patterns) {
      const header = headers.find(h => h.toLowerCase().includes(pattern.toLowerCase()));
      if (header) {
        const index = headers.indexOf(header);
        return row[index];
      }
    }
    return null;
  };

  const circle = getField(['circle']);
  const auditorName = getField(['auditor name', 'mystery shopper']);
  const auditorEmail = getField(['email address', 'auditor email']);
  const webInquiryDate = getField(['web inquiry date', 'inquiry date']);
  const webInquiryTime = getField(['web inquiry time', 'inquiry time']);
  const advisorName = getField(['advisor name', 'airtel advisor']);
  const advisorContact = getField(['advisor contact', 'advisor number']);
  const ambassadorName = getField(['ambassador name', 'airtel ambassador']);
  const visitDate = getField(['visit date', 'ambassador visit date']);
  const visitTime = getField(['visit time', 'ambassador visit time']);
  const location = getField(['location', 'city']);
  const pincode = getField(['pincode', 'pin code']);
  const score = getField(['score']);
  const month = getField(['month']);
  const year = getField(['year']);

  if (!auditorName && !advisorName) return null;

  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {});

  const providedScore = score ? parseFloat(score) : null;
  const calculatedScore = calculateAuditScore('ilms', rawDataObj);
  const finalScore = providedScore || calculatedScore;

  return {
    storeCode: `ILMS-${circle}-${Date.now()}`,
    storeName: ambassadorName || advisorName || 'ILMS Audit',
    location: location || circle || 'Unknown',
    auditType: 'ilms',
    circle: circle || 'Unknown',
    deadline: webInquiryDate ? new Date(webInquiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    score: finalScore,
    auditorName: auditorName,
    auditorEmail: auditorEmail,
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
    rawData: rawDataObj,
  };
}

// Parse XFE audit
function parseXFEAudit(row, headers) {
  const getField = (patterns) => {
    for (const pattern of patterns) {
      const header = headers.find(h => h.toLowerCase().includes(pattern.toLowerCase()));
      if (header) {
        const index = headers.indexOf(header);
        return row[index];
      }
    }
    return null;
  };

  const circle = getField(['circle']);
  const auditorName = getField(['auditor name', 'mystery shopper']);
  const auditorEmail = getField(['email address', 'auditor email']);
  const xfeName = getField(['xfe name', 'executive name']);
  const xfeNumber = getField(['xfe number', 'xfe contact', 'executive number']);
  const callDate = getField(['call date', 'date']);
  const callTime = getField(['call time', 'time']);
  const location = getField(['location', 'city']);
  const score = getField(['score']);
  const month = getField(['month']);
  const year = getField(['year']);

  if (!auditorName && !xfeName) return null;

  const rawDataObj = headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {});

  const providedScore = score ? parseFloat(score) : null;
  const calculatedScore = calculateAuditScore('xfe', rawDataObj);
  const finalScore = providedScore || calculatedScore;

  return {
    storeCode: `XFE-${circle}-${Date.now()}`,
    storeName: xfeName || 'XFE Audit',
    location: location || circle || 'Unknown',
    auditType: 'xfe',
    circle: circle || 'Unknown',
    deadline: callDate ? new Date(callDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    score: finalScore,
    auditorName: auditorName,
    auditorEmail: auditorEmail,
    month: month,
    year: year,
    xfeName: xfeName,
    xfeNumber: xfeNumber,
    callDate: callDate ? new Date(callDate) : undefined,
    callTime: callTime,
    rawData: rawDataObj,
  };
}

// Main parser function
function parseExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    if (data.length < 2) {
      throw new Error('Excel file is empty or has no data rows');
    }
    
    // Get headers
    const headers = data[0].map(h => String(h).trim());
    
    // Detect audit type
    const auditType = detectAuditType(headers);
    
    // Parse rows
    const audits = [];
    const errors = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (row.every(cell => !cell || String(cell).trim() === '')) {
        continue;
      }
      
      try {
        let audit = null;
        
        switch (auditType) {
          case 'store':
            audit = parseStoreAudit(row, headers);
            break;
          case 'ilms':
            audit = parseILMSAudit(row, headers);
            break;
          case 'xfe':
            audit = parseXFEAudit(row, headers);
            break;
        }
        
        if (audit) {
          audits.push(audit);
        }
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      auditType,
      audits,
      errors,
      totalRows: data.length - 1,
      successfulRows: audits.length,
      failedRows: errors.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  parseExcelFile,
  detectAuditType
};
