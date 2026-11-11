import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldAlert, HardDrive, RefreshCw, Cpu, Zap } from 'lucide-react';

interface Snippet {
  title: string;
  desc: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    title: '1. Mount Google Drive for Permanent Storage',
    desc: 'Colab free tier deletes all local files when the instance terminates. Always save checkpoints to Drive!',
    code: `from google.colab import drive
drive.mount('/content/drive')
# Your Drive is now at: /content/drive/MyDrive/`
  },
  {
    title: '2. Check Active GPU & VRAM Allocation',
    desc: 'Verify that you have an NVIDIA Tesla T4 assigned with ~15.3GB GDDR6 memory.',
    code: `!nvidia-smi
import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
print(f"Device Name: {torch.cuda.get_device_name(0)}")`
  },
  {
    title: '3. Flush GPU Memory & Clear PyTorch Cache',
    desc: 'If you encounter CUDA Out Of Memory (OOM), run this before restarting the entire runtime.',
    code: `import torch, gc
gc.collect()
torch.cuda.empty_cache()
print("PyTorch CUDA cache cleared!")`
  },
  {
    title: '4. Prevent Idle Disconnection (Browser Console)',
    desc: 'Paste this into your browser developer console (F12 > Console) to keep your Colab tab awake during long training.',
    code: `function keepAlive() {
  console.log("Colab keep-alive ping");
  document.querySelector("colab-connect-button")?.shadowRoot?.querySelector("#connect")?.click();
}
setInterval(keepAlive, 60000);`
  },
  {
    title: '5. Install & Verify Flash Attention / BitsAndBytes',
    desc: 'Check that 4-bit quantization and accelerated kernels are functioning properly.',
    code: `!pip install -q -U bitsandbytes accelerate
import bitsandbytes as bnb
print("BitsAndBytes 4-bit / 8-bit quantization is ready!")`
  }
];

export const ColabCheatsheet: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      <div className="p-6 md:p-8 bg-slate-50/70 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
          <Terminal className="w-4 h-4" />
          <span>Colab Free Tier Power Tools</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Essential Colab One-Liners &amp; Cheatsheet</h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Quick copy-and-paste snippets to mount Google Drive, inspect your NVIDIA T4 GPU, clear memory leaks, and prevent sudden disconnects during model training.
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {SNIPPETS.map((snippet, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-sm text-slate-900">{snippet.title}</h4>
                <button
                  type="button"
                  onClick={() => handleCopy(snippet.code, idx)}
                  className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium shrink-0"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">{snippet.desc}</p>
            </div>

            <div className="rounded-lg bg-slate-900 text-slate-200 p-3 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre-wrap leading-relaxed">{snippet.code}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
