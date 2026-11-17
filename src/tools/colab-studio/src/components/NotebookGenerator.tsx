import React, { useState } from 'react';
import { Download, ExternalLink, Copy, Check, Sliders, Play, Code2, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { TRAINING_TRACKS, TrainingTrack } from '../data/trainingPresets';
import { createJupyterNotebook, downloadNotebookFile } from '../utils/ipynbGenerator';

interface NotebookGeneratorProps {
  initialTrackId?: string;
  onNavigateToApiKeyGuide?: (keyId: string) => void;
}

export const NotebookGenerator: React.FC<NotebookGeneratorProps> = ({
  initialTrackId = 'gemini-tuning',
  onNavigateToApiKeyGuide
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(initialTrackId);

  // Tunable parameters
  const [maxSeqLength, setMaxSeqLength] = useState<number>(2048);
  const [loraRank, setLoraRank] = useState<number>(16);
  const [batchSize, setBatchSize] = useState<number>(2);
  const [gradAccum, setGradAccum] = useState<number>(4);
  const [learningRate, setLearningRate] = useState<string>('2e-4');
  const [maxSteps, setMaxSteps] = useState<number>(60);
  const [selectedBaseModel, setSelectedBaseModel] = useState<string>('unsloth/Llama-3.2-3B-Instruct');

  const [copiedCellIndex, setCopiedCellIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const track = TRAINING_TRACKS.find((t) => t.id === selectedTrackId) || TRAINING_TRACKS[0];

  // Helper to customize code with selected parameters
  const getProcessedCode = (code: string): string => {
    let modified = code;
    if (selectedTrackId === 'unsloth-qlora') {
      modified = modified.replace(/model_name="[^"]*"/, `model_name="${selectedBaseModel}"`);
      modified = modified.replace(/max_seq_length = \d+/, `max_seq_length = ${maxSeqLength}`);
      modified = modified.replace(/r=\d+/, `r=${loraRank}`);
      modified = modified.replace(/per_device_train_batch_size=\d+/, `per_device_train_batch_size=${batchSize}`);
      modified = modified.replace(/gradient_accumulation_steps=\d+/, `gradient_accumulation_steps=${gradAccum}`);
      modified = modified.replace(/learning_rate=[\de\.\-]+/, `learning_rate=${learningRate}`);
      modified = modified.replace(/max_steps=\d+/, `max_steps=${maxSteps}`);
    }
    return modified;
  };

  const handleCopyCell = (code: string, index: number) => {
    navigator.clipboard.writeText(getProcessedCode(code));
    setCopiedCellIndex(index);
    setTimeout(() => setCopiedCellIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const fullScript = track.cells
      .map((c) => `# ==========================================\n# ${c.title}\n# ${c.description}\n# ==========================================\n${getProcessedCode(c.code)}\n`)
      .join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadIpynb = () => {
    const cellsToExport = track.cells.map((c) => ({
      type: c.type,
      content: `# ${c.title}\n# ${c.description}\n\n${getProcessedCode(c.code)}`,
    }));

    const ipynbContent = createJupyterNotebook(cellsToExport);
    downloadNotebookFile(`${track.id}-colab-training.ipynb`, ipynbContent);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Track Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TRAINING_TRACKS.map((t) => {
          const isSelected = t.id === selectedTrackId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTrackId(t.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-xs ring-1 ring-amber-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-amber-100 text-amber-900 font-medium' : 'bg-slate-100 text-slate-700'
                }`}>
                  {t.tag}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
              </div>
              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{t.title}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Main Track Detail Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {track.tag}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600 font-medium">Free Tier Compatible</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{track.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{track.subtitle}</p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied Entire Script' : 'Copy All Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadIpynb}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {downloadSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{downloadSuccess ? 'Notebook Downloaded!' : 'Download .ipynb Notebook'}</span>
              </button>

              <a
                href="https://colab.research.google.com/#create=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Open Colab ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">{track.summary}</p>

          {/* Quick Hardware & Key Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Hardware</span>
              <span className="font-semibold text-slate-800">{track.targetHardware}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Est. VRAM Needed</span>
              <span className="font-semibold text-emerald-700">{track.estimatedVram}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Est. Training Time</span>
              <span className="font-semibold text-slate-800">{track.trainingTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Required API Key</span>
              <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                {track.recommendedApiKey}
                {track.recommendedApiKey !== 'None' && onNavigateToApiKeyGuide && (
                  <button
                    type="button"
                    onClick={() => onNavigateToApiKeyGuide(track.recommendedApiKey.includes('GEMINI') ? 'gemini' : 'huggingface')}
                    className="text-[10px] text-amber-600 hover:underline"
                  >
                    (Get Key)
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Customizer Knobs (for LoRA tracks) */}
        {selectedTrackId === 'unsloth-qlora' && (
          <div className="p-6 bg-amber-50/30 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Customize Colab Hyperparameters (Auto-tuned for 15GB T4 GPU)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Base Model</label>
                <select
                  value={selectedBaseModel}
                  onChange={(e) => setSelectedBaseModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="unsloth/Llama-3.2-3B-Instruct">Llama 3.2 3B Instruct (Best All-Rounder)</option>
                  <option value="unsloth/Llama-3.2-1B-Instruct">Llama 3.2 1B Instruct (Ultra Lightweight)</option>
                  <option value="unsloth/gemma-2-2b-it">Gemma 2 2B Instruct (Google Gemma)</option>
                  <option value="unsloth/Qwen2.5-3B-Instruct">Qwen 2.5 3B Instruct (Coding & Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">LoRA Rank (r)</label>
                <select
                  value={loraRank}
                  onChange={(e) => setLoraRank(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={8}>r = 8 (Lowest VRAM)</option>
                  <option value={16}>r = 16 (Recommended for T4)</option>
                  <option value={32}>r = 32 (Higher Capacity)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Max Sequence Length</label>
                <select
                  value={maxSeqLength}
                  onChange={(e) => setMaxSeqLength(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={1024}>1024 tokens</option>
                  <option value={2048}>2048 tokens (Recommended)</option>
                  <option value={4096}>4096 tokens (Higher VRAM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Batch Size & Grad Accum</label>
                <div className="flex items-center gap-2">
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                  >
                    <option value={1}>Batch 1</option>
                    <option value={2}>Batch 2</option>
                    <option value={4}>Batch 4</option>
                  </select>
                  <span className="text-slate-400">×</span>
                  <select
                    value={gradAccum}
                    onChange={(e) => setGradAccum(Number(e.target.value))}
                    className="w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                  >
                    <option value={2}>Accum 2</option>
                    <option value={4}>Accum 4</option>
                    <option value={8}>Accum 8</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notebook Cells Flow */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-600" />
              <span>Notebook Cells (Run each sequentially in Colab)</span>
            </h4>
            <span className="text-xs text-slate-400">{track.cells.length} Executable Cells</span>
          </div>

          <div className="space-y-5">
            {track.cells.map((cell, idx) => {
              const codeProcessed = getProcessedCode(cell.code);
              const isCopied = copiedCellIndex === idx;

              return (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Cell Header */}
                  <div className="bg-slate-100/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{cell.title}</span>
                      <span className="text-slate-400 text-xs hidden sm:inline">·</span>
                      <span className="text-xs text-slate-500 hidden sm:inline">{cell.description}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCell(cell.code, idx)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Cell</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Cell Code Block */}
                  <div className="p-4 bg-slate-900 font-mono text-xs text-slate-100 overflow-x-auto">
                    <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap">{codeProcessed}</pre>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Upload Instructions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">How to run in Google Colab:</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download the <code className="font-mono text-slate-800">.ipynb</code> file, go to <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">colab.research.google.com</a>, click <strong>File &gt; Upload notebook</strong>, then select <strong>Runtime &gt; Change runtime type &gt; T4 GPU</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadIpynb}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shrink-0"
            >
              Download .ipynb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
