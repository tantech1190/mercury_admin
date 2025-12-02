import { useState } from 'react';
import { Brain, Upload, FileText, CheckCircle, XCircle, AlertTriangle, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';

interface AuditScore {
  appointmentScheduling: number;
  communicationSoftSkills: number;
  probingPitching: number;
  leadClosure: number;
  overall: number;
  withoutFatal: number;
  customerExperience: number;
}

interface FatalFlag {
  detected: boolean;
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

interface CoachingPoint {
  category: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  auditorName: string;
  circle: string;
  score: AuditScore;
  fatalFlags: FatalFlag[];
  coachingPoints: CoachingPoint[];
  summary: string;
  timestamp: Date;
}

export function AIAuditAnalysis() {
  const [transcript, setTranscript] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [circle, setCircle] = useState('');
  const [scenario, setScenario] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeTranscript = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call OpenAI/Claude API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis based on the rubric
    const analysis: AnalysisResult = {
      auditorName,
      circle,
      score: {
        appointmentScheduling: detectAppointmentScore(transcript),
        communicationSoftSkills: detectCommunicationScore(transcript),
        probingPitching: detectProbingScore(transcript, scenario),
        leadClosure: detectClosureScore(transcript),
        overall: 0,
        withoutFatal: 0,
        customerExperience: 2,
      },
      fatalFlags: detectFatalFlags(transcript, scenario),
      coachingPoints: generateCoachingPoints(transcript, scenario),
      summary: generateSummary(transcript, scenario),
      timestamp: new Date(),
    };

    // Calculate overall score
    const avgScore = (
      analysis.score.appointmentScheduling +
      analysis.score.communicationSoftSkills +
      analysis.score.probingPitching +
      analysis.score.leadClosure
    ) / 4;

    analysis.score.withoutFatal = Math.round(avgScore);
    analysis.score.overall = analysis.fatalFlags.some(f => f.severity === 'critical') ? 0 : Math.round(avgScore);

    setResult(analysis);
    setIsAnalyzing(false);
  };

  const detectAppointmentScore = (text: string): number => {
    const lower = text.toLowerCase();
    if (lower.includes('tat') || lower.includes('technician') || lower.includes('visit')) {
      return 100;
    }
    return 50;
  };

  const detectCommunicationScore = (text: string): number => {
    const lower = text.toLowerCase();
    let score = 0;
    
    if (lower.includes('namaste') || lower.includes('good morning') || lower.includes('good afternoon')) {
      score += 30;
    }
    if (lower.includes('airtel')) {
      score += 20;
    }
    if (!lower.includes('unprofessional') && !lower.includes('rude')) {
      score += 50;
    }
    
    return Math.min(score, 100);
  };

  const detectProbingScore = (text: string, scenario: string): number => {
    const lower = text.toLowerCase();
    let probingQuestions = 0;

    // Check for probing questions
    const probingKeywords = [
      'since when', 'kab se', 'which device', 'kaun sa device',
      'speed', 'light', 'router', 'fiber', 'issue',
      'problem kya hai', 'details', 'explain'
    ];

    probingKeywords.forEach(keyword => {
      if (lower.includes(keyword)) probingQuestions++;
    });

    if (probingQuestions >= 4) return 100;
    if (probingQuestions >= 2) return 50;
    return 0;
  };

  const detectClosureScore = (text: string): number => {
    const lower = text.toLowerCase();
    let score = 0;

    if (lower.includes('next step') || lower.includes('aage') || lower.includes('process')) {
      score += 50;
    }
    if (lower.includes('summary') || lower.includes('confirm') || lower.includes('samjh')) {
      score += 50;
    }

    return score;
  };

  const detectFatalFlags = (text: string, scenario: string): FatalFlag[] => {
    const flags: FatalFlag[] = [];
    const lower = text.toLowerCase();

    // Churn behavior detection
    if ((lower.includes('new connection') || lower.includes('naya connection')) &&
        (lower.includes('deactivate') || lower.includes('band karo') || lower.includes('close karo'))) {
      flags.push({
        detected: true,
        type: 'CHURN_BEHAVIOR',
        description: 'Recommended deactivating existing Airtel connection to sell new one - classic churn pattern',
        severity: 'critical'
      });
    }

    // Misleading claims
    if (lower.includes('complaint free') || lower.includes('problem nahi') || lower.includes('guarantee')) {
      flags.push({
        detected: true,
        type: 'MISLEADING_CLAIM',
        description: 'Made unrealistic promises like "complaint free" service',
        severity: 'high'
      });
    }

    // No ownership of complaint
    if ((lower.includes('call 121') || lower.includes('121 par call karo')) &&
        !lower.includes('main raise kar dunga') && !lower.includes('i will raise')) {
      flags.push({
        detected: true,
        type: 'NO_OWNERSHIP',
        description: 'Redirected customer to 121 instead of taking ownership of complaint',
        severity: 'high'
      });
    }

    // Selling instead of fixing
    if (scenario.toLowerCase().includes('disconnect') || scenario.toLowerCase().includes('problem')) {
      if ((lower.includes('air fiber') || lower.includes('new plan')) &&
          !lower.includes('pehle fix') && !lower.includes('first resolve')) {
        flags.push({
          detected: true,
          type: 'PITCH_BEFORE_FIX',
          description: 'Pitched new product instead of resolving existing issue first',
          severity: 'critical'
        });
      }
    }

    // No proper probing
    if (!lower.includes('since when') && !lower.includes('kab se') && 
        !lower.includes('router') && !lower.includes('speed')) {
      flags.push({
        detected: true,
        type: 'INSUFFICIENT_PROBING',
        description: 'Did not probe properly before suggesting solution',
        severity: 'medium'
      });
    }

    return flags;
  };

  const generateCoachingPoints = (text: string, scenario: string): CoachingPoint[] => {
    const points: CoachingPoint[] = [];
    const lower = text.toLowerCase();

    // Always add "Fix first, then pitch"
    if (scenario.toLowerCase().includes('problem') || scenario.toLowerCase().includes('disconnect')) {
      points.push({
        category: 'Process Adherence',
        issue: 'Did not follow "Fix First, Then Pitch" rule',
        recommendation: 'Always prioritize resolving current issues before suggesting new products. Customer came with a problem, not to buy.',
        priority: 'high'
      });
    }

    // Probing coaching
    if (!lower.includes('since when') && !lower.includes('kab se')) {
      points.push({
        category: 'Probing & Diagnosis',
        issue: 'Insufficient technical probing',
        recommendation: 'Ask minimum 4-5 probing questions: Since when? All devices or specific? Router lights status? Recent changes? Wi-Fi or link issue?',
        priority: 'high'
      });
    }

    // Ownership coaching
    if (lower.includes('call 121')) {
      points.push({
        category: 'Complaint Ownership',
        issue: 'Did not take ownership of complaint',
        recommendation: 'Offer to raise complaint yourself. Say: "Main aapka complaint raise kar deta hoon, technician ka TAT batata hoon." Build trust.',
        priority: 'high'
      });
    }

    // No misleading promises
    if (lower.includes('complaint free') || lower.includes('guarantee')) {
      points.push({
        category: 'Honest Communication',
        issue: 'Made unrealistic promises',
        recommendation: 'Never guarantee "complaint free" service. Explain benefits honestly: better coverage, faster speeds, etc. Set realistic expectations.',
        priority: 'high'
      });
    }

    // Proper closure
    if (!lower.includes('next step') && !lower.includes('summary')) {
      points.push({
        category: 'Call Closure',
        issue: 'No clear closure or next steps',
        recommendation: 'Always summarize: "Abhi maine kya kiya / aage kya hoga / aapko kis time tak update milega." Confirm understanding.',
        priority: 'medium'
      });
    }

    // Greeting
    if (!lower.includes('namaste') && !lower.includes('good morning') && !lower.includes('hello')) {
      points.push({
        category: 'Communication Skills',
        issue: 'Did not greet customer properly',
        recommendation: 'Start every call with: "Namaste/Good afternoon, main [Name] bol raha hoon, Airtel se." First impression matters.',
        priority: 'medium'
      });
    }

    return points;
  };

  const generateSummary = (text: string, scenario: string): string => {
    return `Call analysis reveals concerning patterns. XFE received a customer complaint about service disruption but failed to follow proper resolution protocol. Instead of diagnosing the technical issue and taking ownership of the complaint, the XFE immediately pivoted to selling a new product. This behavior indicates potential churn tactics and poor customer service standards. The approach violated the fundamental "Fix First, Then Pitch" principle and demonstrates insufficient training in complaint handling and technical troubleshooting.`;
  };

  const handleReset = () => {
    setResult(null);
    setTranscript('');
    setAuditorName('');
    setCircle('');
    setScenario('');
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="p-3 rounded-2xl shadow-lg" style={{ background: '#E0F7F4' }}>
            <Brain className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: '#111827', fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: '700', letterSpacing: '-0.03em' }}>AI Audit Analysis</h2>
            <p className="m-0 text-base sm:text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>Intelligent XFE call transcript analysis with automated scoring</p>
          </div>
        </div>
      </div>

      {!result ? (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 border border-white/50">
          <div className="space-y-5 sm:space-y-6">
            {/* Auditor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block mb-2 sm:mb-3" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
                  Auditor Name *
                </label>
                <input
                  type="text"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="e.g., Deepak Kumar"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 sm:mb-3" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
                  Circle *
                </label>
                <input
                  type="text"
                  value={circle}
                  onChange={(e) => setCircle(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="e.g., UP West"
                  required
                />
              </div>
            </div>

            {/* Scenario */}
            <div>
              <label className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
                Audit Scenario *
              </label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
                style={{ borderColor: '#e6f7ed' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00a63e';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e6f7ed';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                placeholder='e.g., "Mera broadband bar-bar disconnect hota hai, aap problem solve karoge ya naya suggest karoge?"'
                rows={3}
                required
              />
            </div>

            {/* Transcript */}
            <div>
              <label className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
                Call Transcript *
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50 font-mono text-sm"
                style={{ borderColor: '#e6f7ed' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00a63e';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e6f7ed';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                placeholder="Paste the full call transcript here (Hindi/Hinglish supported)..."
                rows={12}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={analyzeTranscript}
                disabled={!transcript || !auditorName || !circle || !scenario || isAnalyzing}
                className="flex-1 flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(0,166,62,0.3)] hover:shadow-[0_15px_40px_rgba(0,166,62,0.4)] relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #00a63e 0%, #008532 50%, #00a63e 100%)', backgroundSize: '200% 100%', fontWeight: '600' }}
                onMouseEnter={(e) => !isAnalyzing && (e.currentTarget.style.backgroundPosition = '100% 0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = '0% 0')}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {/* Header Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 border border-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="mb-1" style={{ color: '#00a63e', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700' }}>
                  {result.auditorName}
                </h3>
                <p className="m-0 text-sm sm:text-base" style={{ color: '#6b7280', fontWeight: '500' }}>
                  {result.circle} • Analyzed {result.timestamp.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm self-start sm:self-auto"
                style={{ borderColor: '#00a63e', color: '#008532', backgroundColor: 'white', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                New Analysis
              </button>
            </div>

            {/* Score Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-xl text-center" style={{ background: result.score.overall === 0 ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : 'linear-gradient(135deg, #e6f7ed, #d1f4e0)' }}>
                <div className="mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '700', color: result.score.overall === 0 ? '#dc2626' : '#00a63e' }}>
                  {result.score.overall}%
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#4b5563', fontWeight: '600' }}>Overall Score</div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
                <div className="mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '700', color: '#2563eb' }}>
                  {result.score.appointmentScheduling}%
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#4b5563', fontWeight: '600' }}>Appointment</div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                <div className="mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '700', color: '#d97706' }}>
                  {result.score.communicationSoftSkills}%
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#4b5563', fontWeight: '600' }}>Communication</div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)' }}>
                <div className="mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '700', color: '#9333ea' }}>
                  {result.score.probingPitching}%
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#4b5563', fontWeight: '600' }}>Probing</div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #ffedd5, #fed7aa)' }}>
                <div className="mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '700', color: '#ea580c' }}>
                  {result.score.leadClosure}%
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#4b5563', fontWeight: '600' }}>Closure</div>
              </div>
            </div>
          </div>

          {/* Fatal Flags */}
          {result.fatalFlags.length > 0 && (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 border-2 border-red-500">
              <div className="flex items-center gap-3 mb-5">
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                <h3 className="m-0" style={{ color: '#dc2626', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700' }}>
                  Fatal Flags Detected ({result.fatalFlags.length})
                </h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {result.fatalFlags.map((flag, index) => (
                  <div key={index} className="p-4 sm:p-5 rounded-xl border-2" style={{ 
                    backgroundColor: flag.severity === 'critical' ? 'rgba(254, 226, 226, 0.5)' : flag.severity === 'high' ? 'rgba(254, 243, 199, 0.5)' : 'rgba(254, 249, 195, 0.3)',
                    borderColor: flag.severity === 'critical' ? '#dc2626' : flag.severity === 'high' ? '#f59e0b' : '#fbbf24'
                  }}>
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${flag.severity === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase" style={{
                            backgroundColor: flag.severity === 'critical' ? '#dc2626' : flag.severity === 'high' ? '#f59e0b' : '#fbbf24',
                            color: 'white'
                          }}>
                            {flag.severity}
                          </span>
                          <span className="text-xs sm:text-sm font-mono" style={{ color: '#6b7280', fontWeight: '600' }}>
                            {flag.type}
                          </span>
                        </div>
                        <p className="m-0 text-sm sm:text-base break-words" style={{ color: '#1f2937', fontWeight: '500' }}>
                          {flag.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00a63e' }} />
              <h3 className="m-0" style={{ color: '#00a63e', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700' }}>
                AI Summary
              </h3>
            </div>
            <p className="m-0 text-sm sm:text-base leading-relaxed break-words" style={{ color: '#4b5563', fontWeight: '500' }}>
              {result.summary}
            </p>
          </div>

          {/* Coaching Points */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00a63e' }} />
              <h3 className="m-0" style={{ color: '#00a63e', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700' }}>
                Coaching Recommendations ({result.coachingPoints.length})
              </h3>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {result.coachingPoints.map((point, index) => (
                <div key={index} className="p-4 sm:p-5 rounded-xl border-2 transition-all hover:shadow-lg" style={{ 
                  backgroundColor: point.priority === 'high' ? 'rgba(254, 243, 199, 0.3)' : 'rgba(249, 250, 251, 0.5)',
                  borderColor: point.priority === 'high' ? '#f59e0b' : '#e5e7eb'
                }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase" style={{
                      backgroundColor: point.priority === 'high' ? '#dc2626' : point.priority === 'medium' ? '#f59e0b' : '#10b981',
                      color: 'white'
                    }}>
                      {point.priority} Priority
                    </span>
                    <span className="text-xs sm:text-sm" style={{ color: '#00a63e', fontWeight: '700' }}>
                      {point.category}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs sm:text-sm mb-1" style={{ color: '#6b7280', fontWeight: '600' }}>Issue:</div>
                    <p className="m-0 text-sm sm:text-base break-words" style={{ color: '#1f2937', fontWeight: '600' }}>{point.issue}</p>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm mb-1" style={{ color: '#6b7280', fontWeight: '600' }}>Recommendation:</div>
                    <p className="m-0 text-sm sm:text-base break-words" style={{ color: '#059669', fontWeight: '500' }}>{point.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}