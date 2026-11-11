import React, { useState } from 'react';
import { Cpu, AlertTriangle, CheckCircle, Info, Sparkles, Zap, ShieldAlert } from 'lucide-react';
import { COLAB_FREE_TIER_LIMITS } from '../data/trainingPresets';

export const VramCalculator: React.FC = () => {
  const [modelParams, setModelParams] = useState<number>(3); // Billions
  const [precision, setPrecision] = useState<'4bit' | '8bit' | 'fp16'>('4bit');
  const [seqLength, setSeqLength] = useState<number>(2048);
  const [batchSize, setBatchSize] = useState<number>(2);
  const [tuningType, setTuningType] = useState<'lora' | 'full'>('lora');
  const [gradientCheckpointing, setGradientCheckpointing] = useState<boolean>(true);

  // VRAM calculation math
  // Model weights memory (GB)
  let bytesPerParam = 2; // fp16
  if (precision === '4bit') bytesPerParam = 0.55; // 4-bit with metadata
  if (precision === '8bit') bytesPerParam = 1.1;

  const weightsVram = modelParams * bytesPerParam;

  // Optimizer & gradients memory
  let optimizerVram = 0;
  if (tuningType === 'full') {
    // Standard AdamW keeps FP32 weights, gradients, 1st and 2nd moments (~16 bytes per param)
    optimizerVram = modelParams * 12;
  } else {
    // LoRA only trains ~0.5% - 1% of parameters
    const loraTrainableParams = modelParams * 0.008;
    optimizerVram = loraTrainableParams * 8 + 0.3; // Small footprint
  }

  // Activations & KV Cache memory estimate
  let activationFactor = (seqLength / 2048) * (batchSize / 2);
  if (!gradientCheckpointing) {
    activationFactor *= 2.8; // Without gradient checkpointing activations scale linearly with layers
  }
  const activationsVram = (modelParams >= 7 ? 2.8 : 1.2) * activationFactor;

  // PyTorch runtime overhead & CUDA context buffer
  const runtimeOverhead = 1.1;

  const totalVram = Number((weightsVram + optimizerVram + activationsVram + runtimeOverhead).toFixed(2));
  const t4Limit = 15.36;
  const percentage = Math.min(Math.round((totalVram / t4Limit) * 100), 100);

  const isOOM = totalVram > t4Limit;
  const isTight = totalVram > 13.0 && !isOOM;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 bg-slate-50/70 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
          <Cpu className="w-4 h-4" />
          <span>Colab Free Tier Hardware Advisor</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">VRAM &amp; CUDA OOM Safety Estimator</h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Google Colab free tier gives you a single <strong>NVIDIA Tesla T4 GPU (15.36 GB VRAM)</strong>. Test your training parameters below to ensure you won't crash your training session with a CUDA Out Of Memory error.
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Model Size */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Model Parameter Size</label>
              <select
                value={modelParams}
                onChange={(e) => setModelParams(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value={1}>1 Billion (e.g. Llama 3.2 1B, SmolLM)</option>
                <option value={2}>2 Billion (e.g. Gemma 2 2B, Qwen 1.5B)</option>
                <option value={3}>3 Billion (e.g. Llama 3.2 3B, Qwen 2.5 3B)</option>
                <option value={7}>7 Billion (e.g. Qwen 2.5 7B, Mistral 7B)</option>
                <option value={8}>8 Billion (e.g. Llama 3.1 8B)</option>
                <option value={14}>14 Billion (e.g. Qwen 2.5 14B - Extreme)</option>
              </select>
            </div>

            {/* Quantization */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Quantization / Precision</label>
              <select
                value={precision}
                onChange={(e) => setPrecision(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="4bit">4-bit QLoRA (NF4 / Unsloth) - Recommended</option>
                <option value="8bit">8-bit Quantization (BitsAndBytes)</option>
                <option value="fp16">16-bit Float16 (No Quantization)</option>
              </select>
            </div>

            {/* Tuning Type */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Training Method</label>
              <select
                value={tuningType}
                onChange={(e) => setTuningType(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="lora">LoRA / QLoRA / PEFT (Train ~0.5% weights)</option>
                <option value="full">Full Parameter Fine-Tuning (All weights)</option>
              </select>
            </div>

            {/* Sequence Length */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Context Sequence Length</label>
              <select
                value={seqLength}
                onChange={(e) => setSeqLength(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value={1024}>1024 tokens</option>
                <option value={2048}>2048 tokens (Standard)</option>
                <option value={4096}>4096 tokens (Heavy)</option>
              </select>
            </div>

            {/* Batch Size */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Per-Device Batch Size</label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value={1}>1 (Recommended: use with grad accum)</option>
                <option value={2}>2 (Optimal for 3B models)</option>
                <option value={4}>4</option>
                <option value={8}>8 (High risk of OOM)</option>
              </select>
            </div>

            {/* Gradient Checkpointing */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Gradient Checkpointing</label>
              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="gradCheck"
                  checked={gradientCheckpointing}
                  onChange={(e) => setGradientCheckpointing(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="gradCheck" className="text-xs text-slate-700 cursor-pointer">
                  Enabled (Saves ~40% VRAM)
                </label>
              </div>
            </div>
          </div>

          {/* Tips to avoid Colab Disconnections */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Colab Free Tier Rules of Thumb</span>
            </h5>
            <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
              <li>
                <strong>Always use 4-bit (QLoRA):</strong> Models up to 8B (like Llama 3.1 8B or Gemma 2 9B) fit in Colab T4 only with 4-bit quantization.
              </li>
              <li>
                <strong>Batch Size 1 or 2:</strong> Never set batch size to 8 or 16 for LLMs. Instead, simulate larger batches with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">gradient_accumulation_steps=4</code>.
              </li>
              <li>
                <strong>Avoid Full Fine-Tuning:</strong> Full fine-tuning of even a 3B model requires &gt;36 GB of VRAM, which crashes the 15GB T4 instantly. Always use PEFT/LoRA.
              </li>
            </ul>
          </div>
        </div>

        {/* Output Gauge Column */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated GPU VRAM</span>
              <span className="text-xs font-mono font-bold text-slate-700">T4 Limit: 15.36 GB</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span
                className={`text-4xl font-extrabold tracking-tight ${
                  isOOM ? 'text-rose-600' : isTight ? 'text-amber-600' : 'text-emerald-700'
                }`}
              >
                {totalVram}
              </span>
              <span className="text-slate-500 font-semibold text-lg">GB / 15.36 GB</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOOM ? 'bg-rose-500' : isTight ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs mb-5 ${
                isOOM
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : isTight
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              {isOOM ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : isTight ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-sm block mb-0.5">
                  {isOOM
                    ? 'CUDA Out Of Memory (OOM) Predicted!'
                    : isTight
                    ? 'Borderline Safe (Risk of OOM during peak)'
                    : '100% Free-Tier Safe (Smooth Training)'}
                </span>
                <p className="leading-relaxed">
                  {isOOM
                    ? tuningType === 'full'
                      ? 'Full fine-tuning requires keeping optimizer states for all weights. Switch to LoRA/PEFT or use 4-bit quantization to fit inside 15GB.'
                      : 'The combination of model size, sequence length, and batch size exceeds Colab T4 VRAM. Enable 4-bit precision or reduce sequence length to 2048.'
                    : isTight
                    ? 'This setup will fit, but sudden long sequences may spike VRAM. Enable gradient checkpointing and keep batch size at 1.'
                    : 'This configuration will run effortlessly on Google Colab free tier with low risk of CUDA crash.'}
                </p>
              </div>
            </div>

            {/* Memory breakdown breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Model Base Weights:</span>
                <span className="font-mono font-medium text-slate-800">{weightsVram.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Optimizer &amp; Gradients ({tuningType}):</span>
                <span className="font-mono font-medium text-slate-800">{optimizerVram.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Activations &amp; KV Cache:</span>
                <span className="font-mono font-medium text-slate-800">{activationsVram.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>PyTorch &amp; CUDA Context Overhead:</span>
                <span className="font-mono font-medium text-slate-800">{runtimeOverhead.toFixed(1)} GB</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Based on NVIDIA T4 specifications (SM 7.5 Turing, 16GB GDDR6, Google Colab compute node).
          </div>
        </div>
      </div>
    </div>
  );
};
