import React, { useState } from 'react';
import { Sparkles, ArrowRight, Cpu, Key, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface TrainingPlanResponse {
  modelRecommendation: string;
  framework: string;
  vramRequired: string;
  estimatedTrainingTime: string;
  apiKeyNeeded: string;
  colabSecretsConfig: string;
  dataPrepAdvice: string;
  explanation: string;
  suggestedSamples: { input: string; output: string }[];
}

interface AiTrainingAdvisorProps {
  onApplyPlan?: (plan: TrainingPlanResponse) => void;
  onNavigateToApiKeyGuide?: (keyId: string) => void;
}

export const AiTrainingAdvisor: React.FC<AiTrainingAdvisorProps> = ({
  onApplyPlan,
  onNavigateToApiKeyGuide,
}) => {
  const [goal, setGoal] = useState<string>('');
  const [modelType, setModelType] = useState<string>('any');
  const [datasetDescription, setDatasetDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<TrainingPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleGoals = [
    'Fine-tune a customer support agent on 200 company refund policies',
    'Train a model to convert English requests into PostgreSQL queries',
    'Specialize a lightweight model for medical terminology extraction',
    'Train a conversational AI with a sarcastic, humorous persona',
  ];

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          datasetDescription,
          modelType: modelType === 'any' ? undefined : modelType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate training plan');
      }

      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to contact the AI training planner. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Advisor Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>AI Colab Architect</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Custom Training Plan Generator</h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl mb-6">
          Describe what you want your model to learn. Our AI engine analyzes your objective against <strong>Google Colab free tier hardware limits (15.3 GB VRAM T4 GPU)</strong> and recommends the optimal model, API keys, and training parameters.
        </p>

        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              What do you want to train or fine-tune?
            </label>
            <textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I want to fine-tune a model to extract key clauses from legal contracts and output them in structured JSON..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick examples:</span>
            {sampleGoals.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setGoal(sample)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Preferred Model Family</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-amber-500"
              >
                <option value="any">Auto-Detect Best Option for Colab Free Tier</option>
                <option value="gemini">Google Gemini Supervised Tuning (Zero Local GPU)</option>
                <option value="llama">Llama 3.2 / Open-Weights (Unsloth QLoRA)</option>
                <option value="gemma">Google Gemma 2 (2B / 9B)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Dataset Details (Optional)
              </label>
              <input
                type="text"
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
                placeholder="e.g. ~300 question-answer pairs in CSV format"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-slate-950 font-bold text-sm rounded-xl shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Colab Hardware Constraints...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Free Tier Training Architecture</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Generated Architecture Result */}
      {plan && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 bg-slate-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Recommended Architecture
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{plan.modelRecommendation}</h3>
                <p className="text-xs text-slate-400 mt-1">Framework: {plan.framework}</p>
              </div>

              {onApplyPlan && (
                <button
                  type="button"
                  onClick={() => onApplyPlan(plan)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  <span>Load Into Notebook Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>VRAM Footprint</span>
                </div>
                <div className="font-semibold text-emerald-400 text-sm">{plan.vramRequired}</div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Training Time</span>
                </div>
                <div className="font-semibold text-slate-200 text-sm">{plan.estimatedTrainingTime}</div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>API Key Needed</span>
                </div>
                <div className="font-mono font-bold text-amber-300 text-xs truncate">
                  {plan.apiKeyNeeded}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Why this configuration works best in Colab Free Tier
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {plan.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Colab Secrets Python Access</span>
                </h5>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {plan.colabSecretsConfig}
                </pre>
                {onNavigateToApiKeyGuide && (
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToApiKeyGuide(
                        plan.apiKeyNeeded.toLowerCase().includes('gemini') ? 'gemini' : 'huggingface'
                      )
                    }
                    className="text-amber-600 hover:underline font-semibold block pt-1"
                  >
                    View instructions to get this key free ↗
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dataset Preparation Strategy</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">{plan.dataPrepAdvice}</p>
              </div>
            </div>

            {plan.suggestedSamples && plan.suggestedSamples.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Synthetic Dataset Samples for Your Domain
                </h4>
                <div className="space-y-3">
                  {plan.suggestedSamples.map((sample, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                      <div>
                        <span className="font-bold text-slate-700">Input / Prompt: </span>
                        <span className="text-slate-900">{sample.input}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Expected Model Output: </span>
                        <span className="text-slate-800">{sample.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
