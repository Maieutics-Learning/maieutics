import React, { useState } from 'react';
import {
  Key,
  BookOpen,
  Cpu,
  Database,
  Sparkles,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  GitBranch
} from 'lucide-react';
import { ApiKeyGuide } from './components/ApiKeyGuide';
import { ColabSecretsSimulator } from './components/ColabSecretsSimulator';
import { NotebookGenerator } from './components/NotebookGenerator';
import { VramCalculator } from './components/VramCalculator';
import { DatasetBuilder } from './components/DatasetBuilder';
import { AiTrainingAdvisor } from './components/AiTrainingAdvisor';
import { ColabCheatsheet } from './components/ColabCheatsheet';
import { MaieuticsIntegrationDoc } from './components/MaieuticsIntegrationDoc';

type TabType = 'api-keys' | 'notebooks' | 'vram' | 'dataset' | 'ai-advisor' | 'cheatsheet' | 'maieutics';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('api-keys');
  const [targetApiKeyId, setTargetApiKeyId] = useState<string>('gemini');

  const handleSelectTrackForApiKey = (keyId: string) => {
    setActiveTab('notebooks');
  };

  const handleNavigateToApiKeyGuide = (keyId: string) => {
    setTargetApiKeyId(keyId);
    setActiveTab('api-keys');
  };

  const handleApplyPlan = (plan: any) => {
    setActiveTab('notebooks');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Notification / Context Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-white">Google Colab Free Tier Environment:</span>
            <span className="text-slate-400">NVIDIA Tesla T4 (15.36 GB VRAM) · 12.7 GB System RAM · Free Model Fine-Tuning</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              <span>Get Free Gemini Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium inline-flex items-center gap-1"
            >
              <span>Get Free HF Token</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 shadow-xs">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base tracking-tight text-slate-900">
                    ColabTrain Studio
                  </h1>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Free Tier Edition
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Train AI models on Google Colab free GPU with zero cost
                </p>
              </div>
            </div>

            {/* Direct Colab Launcher */}
            <div className="flex items-center gap-3">
              <a
                href="https://colab.research.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Launch Google Colab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tab Navigation Bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
            <button
              type="button"
              onClick={() => setActiveTab('api-keys')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'api-keys'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Key className="w-4 h-4 text-amber-600" />
              <span>1. API Keys &amp; Colab Secrets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notebooks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'notebooks'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>2. Notebook Generator (.ipynb)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vram')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'vram'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4 text-slate-700" />
              <span>3. VRAM &amp; OOM Estimator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dataset')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'dataset'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4 text-slate-700" />
              <span>4. Dataset Builder (JSONL)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai-advisor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'ai-advisor'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>5. AI Training Architect</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'cheatsheet'
                  ? 'bg-amber-500/15 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>6. Colab Cheatsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('maieutics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'maieutics'
                  ? 'bg-amber-500/20 text-amber-950 font-bold border border-amber-400 ring-1 ring-amber-400'
                  : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100 hover:text-amber-950 border border-amber-200/80'
              }`}
            >
              <GitBranch className="w-4 h-4 text-amber-600" />
              <span>7. Maieutics Integration RFC (for Other AI)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: API Keys & Colab Secrets */}
        {activeTab === 'api-keys' && (
          <div className="space-y-8">
            <ApiKeyGuide onSelectTrackForApiKey={handleSelectTrackForApiKey} />
            <ColabSecretsSimulator />
          </div>
        )}

        {/* TAB 2: Notebook Generator */}
        {activeTab === 'notebooks' && (
          <NotebookGenerator
            initialTrackId="gemini-tuning"
            onNavigateToApiKeyGuide={handleNavigateToApiKeyGuide}
          />
        )}

        {/* TAB 3: VRAM & OOM Estimator */}
        {activeTab === 'vram' && <VramCalculator />}

        {/* TAB 4: Dataset Builder */}
        {activeTab === 'dataset' && <DatasetBuilder />}

        {/* TAB 5: AI Training Architect */}
        {activeTab === 'ai-advisor' && (
          <AiTrainingAdvisor
            onApplyPlan={handleApplyPlan}
            onNavigateToApiKeyGuide={handleNavigateToApiKeyGuide}
          />
        )}

        {/* TAB 6: Colab Cheatsheet */}
        {activeTab === 'cheatsheet' && <ColabCheatsheet />}

        {/* TAB 7: Maieutics Integration RFC */}
        {activeTab === 'maieutics' && <MaieuticsIntegrationDoc />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">ColabTrain Studio</span>
            <span>·</span>
            <span>Built for Google Colab Free Tier (T4 GPU 15.3GB VRAM)</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              Google AI Studio API Keys ↗
            </a>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              Hugging Face Access Tokens ↗
            </a>
            <a
              href="https://colab.research.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              Google Colab ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
