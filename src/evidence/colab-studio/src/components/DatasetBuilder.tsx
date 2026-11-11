import React, { useState } from 'react';
import { Database, Download, Sparkles, AlertCircle, CheckCircle, Plus, Trash2, FileJson, Copy, Check } from 'lucide-react';
import { downloadJsonlFile } from '../utils/ipynbGenerator';

interface DatasetPair {
  instruction: string;
  input: string;
  output: string;
}

const TEMPLATES: Record<string, { label: string; data: DatasetPair[] }> = {
  support: {
    label: 'Customer Support Bot',
    data: [
      {
        instruction: 'Answer customer questions according to company return policy.',
        input: 'Can I return an item purchased during a clearance sale?',
        output: 'Final sale and clearance items marked at 50% or higher discount cannot be returned or refunded unless received defective.'
      },
      {
        instruction: 'Answer customer questions according to company return policy.',
        input: 'My shipment arrived with damaged packaging and broken contents.',
        output: 'We apologize for the inconvenience. Please send photos of the damage and your order number to support@example.com within 5 business days for an immediate free replacement.'
      },
      {
        instruction: 'Answer customer questions according to company return policy.',
        input: 'How long does a refund take to appear on my credit card statement?',
        output: 'Once our warehouse inspects the returned package, refunds are issued within 2-3 business days and appear on your bank statement in 5-10 business days.'
      }
    ]
  },
  coding: {
    label: 'Python Code Refactoring',
    data: [
      {
        instruction: 'Refactor the given Python function to use list comprehensions and type hints.',
        input: 'def get_squares(numbers):\n    res = []\n    for n in numbers:\n        if n % 2 == 0:\n            res.append(n * n)\n    return res',
        output: 'from typing import List\n\ndef get_squares(numbers: List[int]) -> List[int]:\n    """Return squares of even numbers using list comprehension."""\n    return [n * n for n in numbers if n % 2 == 0]'
      },
      {
        instruction: 'Refactor the given code to safely handle missing dictionary keys.',
        input: 'def get_user_city(user_data):\n    return user_data["profile"]["address"]["city"]',
        output: 'from typing import Any, Dict, Optional\n\ndef get_user_city(user_data: Dict[str, Any]) -> Optional[str]:\n    """Safely fetch city with chaining get to avoid KeyError."""\n    return user_data.get("profile", {}).get("address", {}).get("city")'
      }
    ]
  },
  legal: {
    label: 'Contract Clause Summarizer',
    data: [
      {
        instruction: 'Identify the governing law and liability limit from the contractual clause.',
        input: 'This Agreement shall be governed by the laws of the State of Delaware. Neither party shall be liable for aggregate damages exceeding $100,000 USD.',
        output: 'Governing Law: State of Delaware.\nLiability Cap: Maximum aggregate damages are capped at $100,000 USD.'
      },
      {
        instruction: 'Summarize the non-disclosure term length.',
        input: 'Each party agrees to maintain confidentiality of Proprietary Information for a duration of five (5) years following termination of this Agreement.',
        output: 'Confidentiality Duration: 5 years post-termination.'
      }
    ]
  }
};

export const DatasetBuilder: React.FC = () => {
  const [format, setFormat] = useState<'gemini' | 'alpaca'>('gemini');
  const [pairs, setPairs] = useState<DatasetPair[]>(TEMPLATES.support.data);
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAddRow = () => {
    setPairs([...pairs, { instruction: 'Complete the task appropriately.', input: '', output: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    if (pairs.length <= 1) return;
    setPairs(pairs.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, field: keyof DatasetPair, value: string) => {
    const updated = [...pairs];
    updated[index][field] = value;
    setPairs(updated);
  };

  const handleLoadTemplate = (key: string) => {
    if (TEMPLATES[key]) {
      setPairs(TEMPLATES[key].data);
    }
  };

  // Convert pairs into target JSONL string
  const getJsonlString = (): string => {
    if (format === 'gemini') {
      return pairs
        .map((p) => {
          const textInput = p.input ? `${p.instruction}\n\nContext: ${p.input}` : p.instruction;
          return JSON.stringify({
            text_input: textInput,
            output: p.output
          });
        })
        .join('\n');
    } else {
      // Alpaca format
      return pairs
        .map((p) =>
          JSON.stringify({
            instruction: p.instruction,
            input: p.input,
            output: p.output
          })
        )
        .join('\n');
    }
  };

  const handleDownload = () => {
    const content = getJsonlString();
    const filename = format === 'gemini' ? 'gemini_training_dataset.jsonl' : 'alpaca_training_dataset.jsonl';
    downloadJsonlFile(filename, content);
  };

  const handleCopyJsonl = () => {
    navigator.clipboard.writeText(getJsonlString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI-Assisted Data Generation
  const handleGenerateDataWithAI = async () => {
    if (!topicPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-synthetic-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt, count: 4 })
      });
      const data = await res.json();
      if (data.samples && Array.isArray(data.samples) && data.samples.length > 0) {
        setPairs(data.samples);
      }
    } catch (err) {
      console.error('Error generating data:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Metrics
  const validCount = pairs.filter((p) => p.output.trim() && (p.instruction.trim() || p.input.trim())).length;
  const estimatedTokens = Math.round(
    pairs.reduce((acc, p) => acc + (p.instruction.length + p.input.length + p.output.length) / 4, 0)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 bg-slate-50/70 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              <Database className="w-4 h-4" />
              <span>Colab Dataset Builder &amp; JSONL Validator</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Training Dataset Formatter</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Create and validate clean JSONL datasets for <strong>Google Gemini Fine-Tuning</strong> and <strong>Hugging Face LoRA</strong>. Export directly to Google Colab.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyJsonl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSONL'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .jsonl File</span>
            </button>
          </div>
        </div>

        {/* Format Selector & Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Target Schema:</span>
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setFormat('gemini')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  format === 'gemini' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Google Gemini API (text_input / output)
              </button>
              <button
                type="button"
                onClick={() => setFormat('alpaca')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  format === 'alpaca' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hugging Face / Alpaca (instruction / input / output)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Preset Templates:</span>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLoadTemplate(key)}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:border-slate-400 rounded-md text-slate-700 font-medium"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Synthetic Generator Box */}
      <div className="px-6 md:px-8">
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Need sample data for your specific domain?</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Type your topic below and Gemini will generate ready-to-train pairs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Real estate FAQ, Japanese translation, SQL queries..."
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 w-full sm:w-64 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              disabled={isGenerating || !topicPrompt.trim()}
              onClick={handleGenerateDataWithAI}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg font-semibold shrink-0"
            >
              {isGenerating ? 'Generating...' : 'Generate Pairs'}
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Table & Editor */}
      <div className="px-6 md:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-800">Dataset Pairs ({pairs.length})</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {validCount} valid examples
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">~{estimatedTokens} tokens total</span>
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-4">
          {pairs.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Example #{idx + 1}</span>
                {pairs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove example"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                {/* Instruction / User Prompt */}
                <div className="md:col-span-4">
                  <label className="block text-slate-500 font-medium mb-1">
                    {format === 'gemini' ? 'User Prompt / Instruction' : 'Instruction'}
                  </label>
                  <textarea
                    rows={3}
                    value={item.instruction}
                    onChange={(e) => handleUpdateField(idx, 'instruction', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. Summarize the return policy..."
                  />
                </div>

                {/* Optional Context / Input */}
                <div className="md:col-span-3">
                  <label className="block text-slate-500 font-medium mb-1">Context / Input (Optional)</label>
                  <textarea
                    rows={3}
                    value={item.input}
                    onChange={(e) => handleUpdateField(idx, 'input', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:ring-1 focus:ring-amber-500"
                    placeholder="Optional text passage or reference context..."
                  />
                </div>

                {/* Target Output */}
                <div className="md:col-span-5">
                  <label className="block text-slate-500 font-medium mb-1">Target Response / Output</label>
                  <textarea
                    rows={3}
                    value={item.output}
                    onChange={(e) => handleUpdateField(idx, 'output', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:ring-1 focus:ring-amber-500"
                    placeholder="Ideal specialized response..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSONL Preview */}
      <div className="p-6 md:p-8 bg-slate-50/70 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileJson className="w-4 h-4 text-slate-600" />
            <span>Generated JSONL Preview (Exact Colab Format)</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">1 line = 1 JSON training instance</span>
        </div>
        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
          <pre className="leading-relaxed whitespace-pre-wrap">{getJsonlString()}</pre>
        </div>
      </div>
    </div>
  );
};
