import React, { useState } from 'react';
import { Key, Lock, CheckCircle2, Copy, ExternalLink, ShieldCheck, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface SecretItem {
  id: string;
  name: string;
  provider: string;
  url: string;
  placeholder: string;
  sampleKey: string;
  description: string;
  codeSnippet: string;
}

const SECRETS_LIST: SecretItem[] = [
  {
    id: 'gemini',
    name: 'GEMINI_API_KEY',
    provider: 'Google AI Studio',
    url: 'https://aistudio.google.com/apikey',
    placeholder: 'AIzaSyD...',
    sampleKey: 'AIzaSyDexampleKey99182377ColabReady',
    description: 'Powers Google Gemini fine-tuning & Gemini 1.5 Flash API calls without consuming your local GPU memory.',
    codeSnippet: `from google.colab import userdata
from google import genai

# Retrieve secret securely
api_key = userdata.get('GEMINI_API_KEY')
client = genai.Client(api_key=api_key)
print("Connected to Google Gemini API!")`,
  },
  {
    id: 'hf',
    name: 'HF_TOKEN',
    provider: 'Hugging Face',
    url: 'https://huggingface.co/settings/tokens',
    placeholder: 'hf_...',
    sampleKey: 'hf_AbCdEfGhIjKlMnOpQrStUvWxYz12345678',
    description: 'Needed for downloading gated models (Meta Llama 3.2, Google Gemma 2) and pushing trained LoRA adapters.',
    codeSnippet: `from google.colab import userdata
from huggingface_hub import login

# Log in using secure Colab secret
token = userdata.get('HF_TOKEN')
login(token=token)
print("Hugging Face Hub authenticated!")`,
  },
  {
    id: 'wandb',
    name: 'WANDB_API_KEY',
    provider: 'Weights & Biases',
    url: 'https://wandb.ai/authorize',
    placeholder: '40-character hex key',
    sampleKey: '4a9b8c7d6e5f0123456789abcdef0123456789ab',
    description: 'Tracks your training loss curves, GPU VRAM usage, and training checkpoints live on the web.',
    codeSnippet: `from google.colab import userdata
import os
import wandb

os.environ['WANDB_API_KEY'] = userdata.get('WANDB_API_KEY')
wandb.login()
print("Weights & Biases tracking active!")`,
  },
];

export const ColabSecretsSimulator: React.FC = () => {
  const [selectedSecretId, setSelectedSecretId] = useState<string>('gemini');
  const [notebookAccess, setNotebookAccess] = useState<Record<string, boolean>>({
    gemini: true,
    hf: true,
    wandb: false,
  });
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const current = SECRETS_LIST.find((s) => s.id === selectedSecretId) || SECRETS_LIST[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleAccess = (id: string) => {
    setNotebookAccess((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleShowValue = (id: string) => {
    setShowValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Google Colab Secrets Manager (Interactive Simulator)</h3>
            <p className="text-xs text-slate-400">
              The official, secure way to use API keys in Colab without exposing them in your code or commits
            </p>
          </div>
        </div>

        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs rounded-lg transition-colors"
        >
          <span>Get Free {current.name}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Colab Visual Mockup */}
        <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Colab Left Sidebar Mockup</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-600 font-medium normal-case flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Best Practice (Never Hardcode)
              </span>
            </div>
            <span className="text-xs text-slate-400">Click secret to inspect</span>
          </div>

          {/* Colab Notebook UI Shell */}
          <div className="rounded-lg border border-slate-300 bg-white shadow-inner overflow-hidden flex min-h-[340px]">
            {/* Fake Colab Icons Bar */}
            <div className="w-12 bg-slate-100 border-r border-slate-200 flex flex-col items-center py-3 gap-4 text-slate-400 select-none">
              <div className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center cursor-pointer" title="Table of contents">
                <span className="text-xs font-mono">☰</span>
              </div>
              <div className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center cursor-pointer" title="Find and replace">
                <span className="text-xs font-mono">🔍</span>
              </div>
              <div className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center cursor-pointer" title="Code snippets">
                <span className="text-xs font-mono">&lt;&gt;</span>
              </div>
              <div className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center cursor-pointer" title="Files">
                <span className="text-xs font-mono">📁</span>
              </div>
              {/* Highlighted Secrets Key Icon */}
              <div
                className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-amber-400"
                title="Secrets (userdata)"
              >
                <Key className="w-4 h-4" />
              </div>
            </div>

            {/* Fake Colab Secrets Panel */}
            <div className="flex-1 p-4 bg-white flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">Secrets</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">google.colab.userdata</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  onClick={() => handleCopy(current.name, 'name')}
                >
                  <span>+ Add new secret</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Secrets are stored privately in your Google Account. Notebooks can only access secrets when you grant permission.
              </p>

              {/* Secrets List inside Mockup */}
              <div className="space-y-2.5 flex-1">
                {SECRETS_LIST.map((item) => {
                  const isSelected = item.id === selectedSecretId;
                  const isAccessOn = !!notebookAccess[item.id];
                  const isShowing = !!showValues[item.id];

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSecretId(item.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Key className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span className="font-mono text-xs font-semibold text-slate-800">{item.name}</span>
                        </div>
                        {/* Toggle switch */}
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] text-slate-500">Notebook access:</span>
                          <button
                            type="button"
                            onClick={() => toggleAccess(item.id)}
                            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                              isAccessOn ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                isAccessOn ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded border border-slate-100 text-xs font-mono text-slate-600">
                        <span>{isShowing ? item.sampleKey : '••••••••••••••••••••••••••••••••'}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShowValue(item.id);
                          }}
                          className="text-slate-400 hover:text-slate-700 ml-2"
                        >
                          {isShowing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security Banner inside Colab */}
              <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Why use Secrets instead of writing `api_key = "..."`?</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    If you share the notebook, push to GitHub, or run on a public Colab instance, your keys will never leak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: How to Fetch & Use in Python */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                How to use in Colab Code
              </span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                {current.provider}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-base mb-1">{current.name}</h4>
            <p className="text-xs text-slate-600 mb-4">{current.description}</p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <span className="font-medium">Generate Key:</span> Visit{' '}
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline font-semibold"
                  >
                    {current.provider} Key Portal ↗
                  </a>{' '}
                  and copy your free key.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <span className="font-medium">Store in Colab:</span> Click the 🔑 icon on the left of your Colab notebook, add secret named{' '}
                  <code className="px-1 py-0.5 bg-slate-100 rounded font-mono text-slate-900 font-bold">{current.name}</code>, and toggle Notebook access ON.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <span className="font-medium">Access in Python Cell:</span> Paste the code block below into any Colab cell.
                </div>
              </div>
            </div>

            {/* Python Code Snippet Box */}
            <div className="relative rounded-lg bg-slate-900 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-1.5 border-b border-slate-800">
                <span>python (Colab cell)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(current.codeSnippet, 'snippet')}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-sans text-xs"
                >
                  {copiedKey === 'snippet' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-slate-200 leading-relaxed">{current.codeSnippet}</pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need another key?</span>
            <div className="flex items-center gap-1.5">
              {SECRETS_LIST.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSecretId(s.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    selectedSecretId === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
