/**
 * SCORE CALCULATOR UTILITY
 * Calculates audit scores based on responses
 * Same logic as frontend implementation
 */

function isPositiveResponse(value) {
  if (!value) return false;
  const str = String(value).toLowerCase().trim();
  
  const positivePatterns = [
    'yes', 'correct', 'accurate', 'polite', 'clean', 'functional',
    'good', 'excellent', 'professional', 'true', 'agree',
  ];
  
  return positivePatterns.some(pattern => str.includes(pattern));
}

function isNegativeResponse(value) {
  if (!value) return false;
  const str = String(value).toLowerCase().trim();
  
  const negativePatterns = [
    'no', 'not', 'incorrect', 'inaccurate', 'rude', 'dirty',
    'broken', 'poor', 'unprofessional', 'false', 'disagree',
    'denial', 'redirect',
  ];
  
  return negativePatterns.some(pattern => str.includes(pattern));
}

function extractRating(value) {
  if (!value) return null;
  const str = String(value).toLowerCase();
  
  const ratingMatch = str.match(/(\d+)\s*(?:\/|out of)\s*(\d+)/);
  if (ratingMatch) {
    const score = parseInt(ratingMatch[1]);
    const max = parseInt(ratingMatch[2]);
    return (score / max) * 100;
  }
  
  if (str.includes('excellent') || str.includes('5')) return 100;
  if (str.includes('very good') || str.includes('4')) return 80;
  if (str.includes('good') || str.includes('3')) return 60;
  if (str.includes('average') || str.includes('2')) return 40;
  if (str.includes('poor') || str.includes('1')) return 20;
  
  return null;
}

function calculateCategoryScore(rawData, questionPatterns) {
  let totalQuestions = 0;
  let positiveAnswers = 0;
  
  for (const [key, value] of Object.entries(rawData)) {
    const keyLower = key.toLowerCase();
    
    const matches = questionPatterns.some(pattern => 
      keyLower.includes(pattern.toLowerCase())
    );
    
    if (matches) {
      if (keyLower.includes('upload') || 
          keyLower.includes('document') ||
          keyLower.includes('proof') ||
          keyLower.includes('timestamp') ||
          keyLower.includes('email') ||
          keyLower.includes('narrate') ||
          keyLower.includes('experience') && keyLower.includes('please')) {
        continue;
      }
      
      totalQuestions++;
      
      if (isPositiveResponse(value)) {
        positiveAnswers++;
      }
    }
  }
  
  if (totalQuestions === 0) return 0;
  return (positiveAnswers / totalQuestions) * 100;
}

function calculateStoreScore(rawData) {
  const categories = [
    {
      name: 'Store Discovery',
      weight: 0.10,
      patterns: ['google', 'thanks app', 'operating hours', 'navigation', 'maps', 'accurately updated']
    },
    {
      name: 'Store Hygiene',
      weight: 0.20,
      patterns: ['clean', 'hygiene', 'gsb', 'glow sign', 'floor', 'walls', 'ceiling', 'furniture', 'ac', 'temperature', 'odor', 'exterior']
    },
    {
      name: 'Greet & Behavior',
      weight: 0.25,
      patterns: ['greet', 'token', 'called', 'polite', 'attentive', 'listening', 'explain', 'process', 'professional', 'courteous', 'thank']
    },
    {
      name: 'Needs Analysis',
      weight: 0.15,
      patterns: ['probe', 'purpose', 'telecom', 'spend', 'prepaid', 'bb', 'dth', 'black', 'upselling', 'cross-selling', 'knowledgeable', 'nps']
    },
    {
      name: 'Grooming',
      weight: 0.10,
      patterns: ['uniform', 'groomed', 'hair', 'jewellery', 'nails', 'shave', 'attire', 'ironed']
    },
    {
      name: 'Branding',
      weight: 0.10,
      patterns: ['branding', 'campaign', 'wall', 'poster', 'panel', '5g', 'laptop', 'sticker', 'leaflet', 'brochure', 'lookbook', 'vinyl']
    },
    {
      name: 'No Denials',
      weight: 0.05,
      patterns: ['denial', 'redirect', 'customer care']
    },
    {
      name: 'No Illegal Practices',
      weight: 0.05,
      patterns: ['activation charge', 'asked to pay', 'personal number', 'payment']
    }
  ];
  
  const categoryScores = categories.map(cat => {
    let score = calculateCategoryScore(rawData, cat.patterns);
    
    if (cat.name.includes('No ')) {
      score = 100 - score;
    }
    
    return {
      name: cat.name,
      score: Math.round(score),
      weight: cat.weight,
      weightedScore: score * cat.weight
    };
  });
  
  const totalScore = Math.round(
    categoryScores.reduce((sum, cat) => sum + cat.weightedScore, 0)
  );
  
  const overallRating = extractRating(rawData['Please rate your overall experience?']);
  const finalScore = overallRating !== null
    ? Math.round(totalScore * 0.7 + overallRating * 0.3)
    : totalScore;
  
  const allQuestions = Object.entries(rawData).filter(([key]) => {
    const k = key.toLowerCase();
    return !k.includes('timestamp') && !k.includes('email') && 
           !k.includes('upload') && !k.includes('document') &&
           !k.includes('narrate') && !k.includes('name') &&
           !k.includes('score') && !k.includes('month') && !k.includes('year');
  });
  
  const positiveCount = allQuestions.filter(([, value]) => isPositiveResponse(value)).length;
  const negativeCount = allQuestions.filter(([, value]) => isNegativeResponse(value)).length;
  
  return {
    totalScore: finalScore,
    categories: categoryScores,
    details: {
      totalQuestions: allQuestions.length,
      answeredQuestions: allQuestions.filter(([, value]) => value && String(value).trim()).length,
      positiveAnswers: positiveCount,
      negativeAnswers: negativeCount
    }
  };
}

function calculateILMSScore(rawData) {
  const categories = [
    {
      name: 'Response Time',
      weight: 0.15,
      patterns: ['15 minutes', 'call back', 'receive', 'first call', 'timing']
    },
    {
      name: 'Advisor Interaction',
      weight: 0.25,
      patterns: ['advisor', 'introduce', 'greet', 'polite', 'call back', 'preferred time slot']
    },
    {
      name: 'Ambassador Visit',
      weight: 0.25,
      patterns: ['ambassador', 'visit', 'confirmation', 'appointment', 'hour before', 're-schedule', 'preferred time']
    },
    {
      name: 'Grooming',
      weight: 0.10,
      patterns: ['uniform', 'attire', 'canvas', 'badge', 'id card', 'shave', 'hair', 'neat']
    },
    {
      name: 'Needs Analysis',
      weight: 0.15,
      patterns: ['probe', 'telecom needs', 'postpaid', 'broadband', 'dth', 'black', 'benefits', 'pitch sheet', 'thanks app']
    },
    {
      name: 'Process Compliance',
      weight: 0.10,
      patterns: ['document', 'required', 'process', 'tat', 'digital', 'scan']
    }
  ];
  
  const categoryScores = categories.map(cat => {
    const score = calculateCategoryScore(rawData, cat.patterns);
    return {
      name: cat.name,
      score: Math.round(score),
      weight: cat.weight,
      weightedScore: score * cat.weight
    };
  });
  
  const totalScore = Math.round(
    categoryScores.reduce((sum, cat) => sum + cat.weightedScore, 0)
  );
  
  const overallRating = extractRating(rawData['Please rate your overall experience?']);
  const finalScore = overallRating !== null
    ? Math.round(totalScore * 0.7 + overallRating * 0.3)
    : totalScore;
  
  const allQuestions = Object.entries(rawData).filter(([key]) => {
    const k = key.toLowerCase();
    return !k.includes('timestamp') && !k.includes('email') && 
           !k.includes('upload') && !k.includes('document') &&
           !k.includes('narrate') && !k.includes('name') &&
           !k.includes('score') && !k.includes('month') && !k.includes('year');
  });
  
  const positiveCount = allQuestions.filter(([, value]) => isPositiveResponse(value)).length;
  const negativeCount = allQuestions.filter(([, value]) => isNegativeResponse(value)).length;
  
  return {
    totalScore: finalScore,
    categories: categoryScores,
    details: {
      totalQuestions: allQuestions.length,
      answeredQuestions: allQuestions.filter(([, value]) => value && String(value).trim()).length,
      positiveAnswers: positiveCount,
      negativeAnswers: negativeCount
    }
  };
}

function calculateXFEScore(rawData) {
  const categories = [
    {
      name: 'Call Connectivity',
      weight: 0.10,
      patterns: ['connect', 'call', 'receive', 'busy', 'call back']
    },
    {
      name: 'XFE Introduction',
      weight: 0.15,
      patterns: ['introduce', 'greet', 'polite', 'xfe', 'name of airtel']
    },
    {
      name: 'Needs Analysis',
      weight: 0.25,
      patterns: ['probe', 'understand', 'requirement', 'concern', 'asked questions', 'telecom needs']
    },
    {
      name: 'Product Knowledge',
      weight: 0.25,
      patterns: ['inform', 'process', 'product', 'document', 'benefits', 'plan', 'black', 'thanks app', 'ott', 'bill', 'gst']
    },
    {
      name: 'Service Quality',
      weight: 0.15,
      patterns: ['tone', 'rude', 'pushed', 'follow up', 'preferred time', 'busy', 'appointment']
    },
    {
      name: 'Compliance',
      weight: 0.10,
      patterns: ['overcharge', 'extra', 'personal', 'permissible hours', 'discount', 'paytm', 'phonepay', 'tat']
    }
  ];
  
  const categoryScores = categories.map(cat => {
    let score = calculateCategoryScore(rawData, cat.patterns);
    
    if (cat.name === 'Service Quality' || cat.name === 'Compliance') {
      let negativeCount = 0;
      let totalCount = 0;
      
      for (const [key, value] of Object.entries(rawData)) {
        const keyLower = key.toLowerCase();
        const matches = cat.patterns.some(p => keyLower.includes(p.toLowerCase()));
        
        if (matches) {
          totalCount++;
          if (keyLower.includes('rude') || keyLower.includes('overcharge') || keyLower.includes('extra')) {
            if (isPositiveResponse(value)) {
              negativeCount++;
            }
          }
        }
      }
      
      if (totalCount > 0) {
        score = ((totalCount - negativeCount) / totalCount) * 100;
      }
    }
    
    return {
      name: cat.name,
      score: Math.round(score),
      weight: cat.weight,
      weightedScore: score * cat.weight
    };
  });
  
  const totalScore = Math.round(
    categoryScores.reduce((sum, cat) => sum + cat.weightedScore, 0)
  );
  
  const overallRating = extractRating(rawData['Please rate your overall experience?']);
  const finalScore = overallRating !== null
    ? Math.round(totalScore * 0.7 + overallRating * 0.3)
    : totalScore;
  
  const allQuestions = Object.entries(rawData).filter(([key]) => {
    const k = key.toLowerCase();
    return !k.includes('timestamp') && !k.includes('email') && 
           !k.includes('upload') && !k.includes('document') &&
           !k.includes('narrate') && !k.includes('name') &&
           !k.includes('score') && !k.includes('month') && !k.includes('year');
  });
  
  const positiveCount = allQuestions.filter(([, value]) => isPositiveResponse(value)).length;
  const negativeCount = allQuestions.filter(([, value]) => isNegativeResponse(value)).length;
  
  return {
    totalScore: finalScore,
    categories: categoryScores,
    details: {
      totalQuestions: allQuestions.length,
      answeredQuestions: allQuestions.filter(([, value]) => value && String(value).trim()).length,
      positiveAnswers: positiveCount,
      negativeAnswers: negativeCount
    }
  };
}

function calculateAuditScore(auditType, rawData) {
  if (!rawData || Object.keys(rawData).length === 0) {
    return 0;
  }
  
  let breakdown;
  
  switch (auditType) {
    case 'store':
      breakdown = calculateStoreScore(rawData);
      break;
    case 'ilms':
      breakdown = calculateILMSScore(rawData);
      break;
    case 'xfe':
      breakdown = calculateXFEScore(rawData);
      break;
    default:
      return 0;
  }
  
  return breakdown.totalScore;
}

function getScoreBreakdown(auditType, rawData) {
  if (!rawData || Object.keys(rawData).length === 0) {
    return null;
  }
  
  switch (auditType) {
    case 'store':
      return calculateStoreScore(rawData);
    case 'ilms':
      return calculateILMSScore(rawData);
    case 'xfe':
      return calculateXFEScore(rawData);
    default:
      return null;
  }
}

module.exports = {
  calculateAuditScore,
  getScoreBreakdown,
  isPositiveResponse,
  isNegativeResponse,
  extractRating
};
