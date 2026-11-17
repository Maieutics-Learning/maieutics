import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ExternalLink, GitBranch, Cpu, ShieldCheck, Zap, Share2 } from 'lucide-react';

export const MAIEUTICS_INTEGRATION_MARKDOWN = `# Architecture RFC & Integration Guide: Google Colab Free Tier for Maieutics-Learning

**Target Repository:** \`Maieutics-Learning/maieutics\`  
**Objective:** Integrate Google Colab Free Tier (NVIDIA Tesla T4 GPU, 15.3 GB VRAM) as a zero-cost training, fine-tuning, and interactive learning compute engine for the Maieutics platform.  
**Audience:** AI Coding Agents, Software Engineers, and ML Platform Architects.

---

## 1. Executive Summary & Value Proposition

Maieutics focuses on Socratic dialogue, active inquiry, and personalized adaptive learning. Training or running custom Socratic tutor models (e.g., Llama-3.2, Gemma-2, or Gemini Flash tuned models) on paid cloud servers (AWS EC2, GCP Vertex) can quickly incur thousands of dollars in GPU bills.

By integrating **Google Colab Free Tier**, the Maieutics platform can:
1. **Offload 100% of GPU compute costs** for student fine-tuning and model training to Google's free infrastructure.
2. Provide **1-Click "Open in Colab" interactive learning labs** where students can train, inspect, and converse with their personalized Socratic agents.
3. Establish a **secure dataset pipeline** between the Maieutics web application and Colab using standard JSONL formats and Colab Secrets (\`google.colab.userdata\`).

---

## 2. Recommended Repository Structure for \`Maieutics-Learning/maieutics\`

Add the following directory tree to your repository:

\`\`\`
maieutics/
├── notebooks/                              # Version-controlled Google Colab notebooks
│   ├── README.md                           # Directory documentation with Colab badges
│   ├── 01_socratic_gemini_tuning.ipynb     # Gemini Supervised Fine-Tuning (Cloud compute)
│   ├── 02_unsloth_socratic_tutor.ipynb     # 4-bit LoRA tuning on Colab T4 GPU
│   └── 03_student_dialogue_evaluator.ipynb # Evaluation & loss curves
├── src/
│   ├── services/
│   │   ├── colabIntegration.ts             # Generates Colab URLs, badges, and dataset payloads
│   │   └── datasetExporter.ts              # Exports user dialogues to Gemini/Alpaca JSONL
│   └── components/
│       └── ColabLaunchButton.tsx           # React UI component launching Colab with query params
├── data/
│   └── templates/
│       ├── socratic_gemini_schema.json     # Schema for Gemini fine-tuning pairs
│       └── socratic_alpaca_schema.json     # Schema for Hugging Face Alpaca pairs
└── docs/
    └── COLAB_FREE_TIER_INTEGRATION.md      # This specification file
\`\`\`

---

## 3. The 3 Primary Integration Patterns

### Pattern A: 1-Click Interactive Student Labs (Client-Facing)
Allow students or educators to click an **"Open in Colab"** badge directly from the Maieutics dashboard. Colab loads a version-controlled notebook from GitHub and mounts the student's dataset.

#### GitHub Badge Syntax for \`README.md\` or Frontend UI:
\`\`\`markdown
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Maieutics-Learning/maieutics/blob/main/notebooks/01_socratic_gemini_tuning.ipynb)
\`\`\`

#### React Component (\`src/components/ColabLaunchButton.tsx\`):
\`\`\`tsx
import React from 'react';

interface ColabLaunchButtonProps {
  notebookPath: string; // e.g. "notebooks/01_socratic_gemini_tuning.ipynb"
  datasetUrl?: string;
  label?: string;
}

export const ColabLaunchButton: React.FC<ColabLaunchButtonProps> = ({
  notebookPath,
  datasetUrl,
  label = "Train Socratic Agent in Colab (Free GPU)"
}) => {
  const repo = "Maieutics-Learning/maieutics";
  const branch = "main";
  const colabUrl = \`https://colab.research.google.com/github/\${repo}/blob/\${branch}/\${notebookPath}\`;

  return (
    <a
      href={colabUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
    >
      <img
        src="https://colab.research.google.com/assets/colab-badge.svg"
        alt="Open In Colab"
        className="h-4"
      />
      <span>{label}</span>
    </a>
  );
};
\`\`\`

---

### Pattern B: Dataset Pipeline (Web App -> JSONL -> Colab)

Maieutics collects user Socratic dialogues (Question, Student Attempt, Guiding Hint, Socratic Response). The backend exports these into two standardized schemas:

#### 1. Gemini Supervised Tuning Format (\`socratic_gemini.jsonl\`):
\`\`\`json
{"text_input": "Student asks: 'Why is photosynthesis called endothermic?' Respond socratically.", "output": "Think about energy flow: what enters the chloroplasts from sunlight, and is energy stored in bonds or released to the surroundings?"}
\`\`\`

#### 2. Open-Weights Alpaca Format (\`socratic_alpaca.jsonl\`):
\`\`\`json
{
  "instruction": "Act as a Socratic tutor. Never reveal the direct answer. Ask an inquiry-based question.",
  "input": "Student asks: 'Can you write the quicksort algorithm for me?'",
  "output": "Before writing code, let's explore how quicksort works. How would you choose a pivot element from an unsorted list?"
}
\`\`\`

---

### Pattern C: Colab Secrets Management Standard

**Crucial Security Rule:** Do not pass API keys via notebook code or commit them to GitHub. The Maieutics Colab notebook must instruct the user/agent to store keys in **Colab Secrets** (Key icon in the left toolbar):

\`\`\`python
# Cell 1 in all Maieutics notebooks:
from google.colab import userdata
import os

# 1. Google AI Studio Key (for Gemini Socratic tuning)
try:
    GEMINI_API_KEY = userdata.get('GEMINI_API_KEY')
    os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY
    print("✓ Google AI Studio API Key configured!")
except Exception:
    print("⚠ GEMINI_API_KEY missing in Colab Secrets. Add it via the 🔑 key icon.")

# 2. Hugging Face Access Token (for Llama/Gemma download & upload)
try:
    HF_TOKEN = userdata.get('HF_TOKEN')
    from huggingface_hub import login
    login(token=HF_TOKEN)
    print("✓ Hugging Face Hub authenticated!")
except Exception:
    print("⚠ HF_TOKEN missing. Required only if downloading gated models.")
\`\`\`

---

## 4. Hardware Sizing & Free-Tier Guardrails (NVIDIA T4 15.3GB)

To prevent the other AI from proposing models that crash Colab with \`CUDA out of memory\`, enforce these hyperparameters:

| Parameter | Recommended Setting | Rationale |
| :--- | :--- | :--- |
| **Quantization** | \`load_in_4bit = True\` (NF4) | Reduces 3B/8B model memory footprint by ~70%. |
| **LoRA Rank (\`r\`)** | \`r = 16\`, \`lora_alpha = 16\` | Balances conversational reasoning with minimal VRAM (~0.5% weights). |
| **Batch Size** | \`per_device_train_batch_size = 2\` | Batch size > 4 on a 15GB T4 GPU risks sudden OOM spikes. |
| **Gradient Accumulation** | \`gradient_accumulation_steps = 4\` | Effectively simulates an 8-batch size without extra VRAM. |
| **Max Sequence Length** | \`max_seq_length = 2048\` | Standard context size for multi-turn Socratic inquiry. |
| **Optimizer** | \`optim = "paged_adamw_8bit"\` | Paged 8-bit optimizer pages memory to CPU if spikes occur. |
| **Storage Mount** | \`from google.colab import drive\` | Prevents loss of model weights upon session disconnect. |

---

## 5. Ready-to-Commit Notebook Template for \`maieutics\`

Create \`notebooks/01_socratic_gemini_tuning.ipynb\` with these exact cells:

\`\`\`python
# Cell 1: Environment & Secrets
!pip install -q -U google-genai pandas datasets

from google.colab import userdata
from google import genai
import json, time

client = genai.Client(api_key=userdata.get('GEMINI_API_KEY'))
print("Maieutics Socratic Tutor Engine initialized!")
\`\`\`

\`\`\`python
# Cell 2: Fetch Socratic Dialogue Dataset
# In production, download directly from Maieutics API or GitHub raw
!wget -q -O socratic_data.jsonl https://raw.githubusercontent.com/Maieutics-Learning/maieutics/main/data/templates/socratic_gemini_sample.jsonl

with open("socratic_data.jsonl") as f:
    sample_lines = [json.loads(line) for line in f.readlines()[:3]]
print(f"Loaded dataset preview: {sample_lines}")
\`\`\`

\`\`\`python
# Cell 3: Launch Supervised Fine-Tuning Job (Zero Local GPU Used)
operation = client.tunings.tune(
    base_model="models/gemini-1.5-flash-001",
    training_dataset="socratic_data.jsonl",
    config={
        "display_name": "maieutics-socratic-tutor-v1",
        "epoch_count": 4,
        "batch_size": 4,
        "learning_rate": 0.001
    }
)

print(f"Tuning job submitted! Job Name: {operation.name}")
while not operation.done:
    print("Training Socratic tutor in Google Cloud... (waiting 30s)")
    time.sleep(30)
    operation = client.operations.get(operation.name)

print(f"Training Complete! Tuned Model ID: {operation.response.model}")
\`\`\`

\`\`\`python
# Cell 4: Test Socratic Response
tuned_model = operation.response.model
response = client.models.generate_content(
    model=tuned_model,
    contents="Student asks: 'Why is the sky blue? Just tell me the answer.'"
)
print("--- SOCRATIC AGENT RESPONSE ---")
print(response.text)
\`\`\`

---

## 6. Prompt to Give Directly to Your Other AI

Copy and paste this prompt to the AI agent working on \`Maieutics-Learning/maieutics\`:

> "I want to integrate Google Colab Free Tier (NVIDIA Tesla T4 GPU) into \`Maieutics-Learning/maieutics\` so that our platform can offload Socratic model fine-tuning and student interactive labs with zero GPU hosting bills. Please review the attached integration specification. Specifically:
> 1. Create a \`notebooks/\` directory with \`01_socratic_gemini_tuning.ipynb\` and \`02_unsloth_socratic_tutor.ipynb\`.
> 2. Add an 'Open in Colab' launcher component and README badge pointing to \`https://colab.research.google.com/github/Maieutics-Learning/maieutics/blob/main/notebooks/...\`.
> 3. Implement an exporter in \`src/services/datasetExporter.ts\` that formats Socratic conversations into JSONL using the Gemini Supervised Tuning schema and Alpaca schema.
> 4. Ensure all notebooks retrieve API keys securely via \`google.colab.userdata\` (\`GEMINI_API_KEY\` and \`HF_TOKEN\`) without hardcoding secrets."
`;

export const MaieuticsIntegrationDoc: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(MAIEUTICS_INTEGRATION_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAiPrompt = () => {
    const aiPrompt = `I want to integrate Google Colab Free Tier (NVIDIA Tesla T4 GPU) into Maieutics-Learning/maieutics so that our platform can offload Socratic model fine-tuning and student interactive labs with zero GPU hosting bills. Please review the attached integration specification. Specifically:
1. Create a notebooks/ directory with 01_socratic_gemini_tuning.ipynb and 02_unsloth_socratic_tutor.ipynb.
2. Add an 'Open in Colab' launcher component and README badge pointing to https://colab.research.google.com/github/Maieutics-Learning/maieutics/blob/main/notebooks/...
3. Implement an exporter in src/services/datasetExporter.ts that formats Socratic conversations into JSONL using the Gemini Supervised Tuning schema and Alpaca schema.
4. Ensure all notebooks retrieve API keys securely via google.colab.userdata (GEMINI_API_KEY and HF_TOKEN) without hardcoding secrets.`;
    navigator.clipboard.writeText(aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadDoc = () => {
    const blob = new Blob([MAIEUTICS_INTEGRATION_MARKDOWN], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'COLAB_FREE_TIER_INTEGRATION_FOR_MAIEUTICS.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
              <GitBranch className="w-4 h-4" />
              <span>Target: github.com/Maieutics-Learning/maieutics</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Integration Document for Your Other AI Agent
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              This technical document (RFC) specifies how to integrate Google Colab's Free Tier into the <strong>Maieutics</strong> codebase to enable zero-cost Socratic model fine-tuning, interactive student labs, and automated dataset pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleCopyAiPrompt}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedPrompt ? 'Copied Prompt for AI!' : 'Copy Direct Prompt for Other AI'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Full Markdown' : 'Copy Full .md RFC'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .md</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span>NVIDIA T4 15.3GB GPU (Zero Cloud Bill)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Colab Secrets API Key Isolation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>1-Click GitHub "Open in Colab" Badge</span>
          </div>
        </div>
      </div>

      {/* Document Content Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>COLAB_FREE_TIER_INTEGRATION_FOR_MAIEUTICS.md</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ready for AI Consumption</span>
        </div>

        {/* Formatted Markdown Display */}
        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1">
            <span className="font-bold block">💡 How to feed this to your other AI agent:</span>
            <p>
              Click <strong>"Copy Direct Prompt for Other AI"</strong> above, then paste it directly into your other AI's prompt or ticket system alongside the repository link <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">https://github.com/Maieutics-Learning/maieutics</code>.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 text-slate-200 p-6 font-mono text-xs overflow-x-auto border border-slate-800 max-h-[600px]">
            <pre className="whitespace-pre-wrap leading-relaxed">{MAIEUTICS_INTEGRATION_MARKDOWN}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
