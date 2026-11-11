import React, { useState } from 'react';
import { Key, ExternalLink, Check, Copy, Sparkles, Shield, Cpu, HelpCircle, ArrowRight } from 'lucide-react';
import { API_KEYS_INFO, ApiKeyGuide as ApiKeyType } from '../data/trainingPresets';

interface ApiKeyGuideProps {
  onSelectTrackForApiKey?: (keyId: string) => void;
}

export const ApiKeyGuide: React.FC<ApiKeyGuideProps> = ({ onSelectTrackForApiKey }) => {
  const [selectedKey, setSelectedKey] = useState<string>('gemini');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const current = API_KEYS_INFO.find((k) => k.id === selectedKey) || API_KEYS_INFO[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
            <Key className="w-4 h-4" />
            <span>Colab Free Tier API Key Directory</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            Which API Key Do You Need to Train in Google Colab?
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Google Colab's free tier provides a free NVIDIA T4 GPU, but depending on how you want to train your model, you'll need one of these free API keys to download models, access datasets, or utilize cloud fine-tuning.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {API_KEYS_INFO.map((item) => {
              const isSelected = item.id === selectedKey;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedKey(item.id)}
                  type="button"
                  className={`text-left p-3.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="text-[11px] font-mono text-amber-400 font-semibold mb-1">{item.envVar}</div>
                  <div className="font-medium text-xs leading-snug line-clamp-1">{item.provider}</div>
                  <div className="mt-2 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{item.cost}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Key Deep-Dive Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-6 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shadow-xs">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{current.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {current.cost}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>Provider: {current.provider}</span>
                <span>·</span>
                <span>Environment Variable: <code className="font-mono font-bold text-slate-800">{current.envVar}</code></span>
              </div>
            </div>
          </div>

          <a
            href={current.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            <span>Get Free Key at {current.provider}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Why & How-to-get Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Why You Need This Key for Colab
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {current.whyNeeded}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Step-by-Step Instructions to Obtain Your Key (100% Free)
              </h4>
              <ol className="space-y-3">
                {current.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Free Tier Allocations</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {current.freeTierDetails}
              </p>
            </div>
          </div>

          {/* Right Column: Code Integration & Colab Secrets Usage */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Colab Python Setup Code
                </h4>
                <button
                  type="button"
                  onClick={() => handleCopy(current.pythonSnippet, current.id)}
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  {copiedKey === current.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap">{current.pythonSnippet}</pre>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h5 className="font-semibold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Never Hardcode Keys in Notebooks</span>
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Always use <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-900">userdata.get('{current.colabSecretKey}')</code>. If you export your notebook to GitHub or share with teammates, your private credentials remain 100% hidden.
              </p>
              {onSelectTrackForApiKey && (
                <button
                  type="button"
                  onClick={() => onSelectTrackForApiKey(current.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <span>View Notebook Template Using This Key</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-lg text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-900 mb-1.5">Do I need to enter a credit card to get these keys?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong>No.</strong> Both Google AI Studio and Hugging Face offer completely free tiers that do not require entering credit card details to get started. You can tune models on Google AI Studio and download weights from Hugging Face on the free tier.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-900 mb-1.5">Can I train a model in Colab without any API key at all?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong>Yes!</strong> If you train a standard PyTorch / DistilBERT classifier or an ungated open model with local dataset files, you don't strictly need an API key. However, for frontier models (Llama 3.2, Gemma 2, Gemini Flash), having an API key allows you to access weights or tune in the cloud.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-900 mb-1.5">What is the difference between Gemini API Key vs Hugging Face Token?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong>Gemini API Key:</strong> Offloads training to Google's server infrastructure (zero local GPU VRAM used).<br />
              <strong>Hugging Face Token:</strong> Used to download model weights (Llama 3.2, Gemma) and run training locally on the Colab T4 GPU using LoRA/Unsloth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-900 mb-1.5">How do I keep my Colab free GPU from disconnecting during training?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Free Colab disconnects if the browser tab is idle for ~60-90 minutes. Keep the browser tab focused, mount Google Drive (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[11px]">from google.colab import drive</code>) to save checkpoints every 10 steps, and set moderate epochs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
