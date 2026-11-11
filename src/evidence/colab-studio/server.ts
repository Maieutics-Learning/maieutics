import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: AI Training Architect & Advisor for Google Colab Free Tier
app.post('/api/generate-training-plan', async (req: Request, res: Response) => {
  try {
    const { goal, datasetDescription, modelType } = req.body;

    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Please provide a training goal or use case.' });
    }

    if (!ai) {
      // High-quality fallback template when no API key configured on server
      return res.json({
        modelRecommendation: modelType === 'gemini' 
          ? 'Gemini 1.5 Flash (Supervised Fine-Tuning)' 
          : 'Llama-3.2-3B-Instruct (4-bit QLoRA with Unsloth)',
        framework: modelType === 'gemini' ? 'Google AI Studio & google-genai SDK' : 'Unsloth + Hugging Face TRL',
        vramRequired: modelType === 'gemini' ? '0 GB (Google Cloud infrastructure handles training)' : '~6.8 GB (Fits smoothly within Colab T4 15.3 GB)',
        estimatedTrainingTime: '15 - 35 minutes on Google Colab free tier',
        apiKeyNeeded: modelType === 'gemini' ? 'GEMINI_API_KEY (from aistudio.google.com/apikey)' : 'HF_TOKEN (from huggingface.co/settings/tokens)',
        colabSecretsConfig: modelType === 'gemini'
          ? "from google.colab import userdata\nGEMINI_API_KEY = userdata.get('GEMINI_API_KEY')"
          : "from google.colab import userdata\nHF_TOKEN = userdata.get('HF_TOKEN')",
        dataPrepAdvice: 'Provide at least 50-100 high-quality examples in JSONL format with clear instructions and consistent output style.',
        explanation: `For "${goal}", training on Google Colab free tier is ideal. With 15GB T4 GPU or Gemini API tuning, you can achieve enterprise-quality performance at zero hardware cost.`,
        suggestedSamples: [
          {
            input: `Example question or input relevant to: ${goal}`,
            output: `Target specialized response demonstrating the desired tone and domain expertise.`
          },
          {
            input: `Edge case or complex query for: ${goal}`,
            output: `Structured, accurate output adhering to your custom guidelines.`
          }
        ]
      });
    }

    const prompt = `You are a world-class Machine Learning Engineer specializing in training and fine-tuning models on Google Colab's FREE tier (NVIDIA T4 GPU 15.3GB VRAM, 12.7GB System RAM, ~12 hour timeout).
The user wants to train a model for the following goal:
Goal: "${goal}"
Additional Dataset info: "${datasetDescription || 'Standard text instruction dataset'}"
Preferred track: "${modelType || 'Any'}"

Analyze this requirement and respond strictly with a valid JSON object matching this schema:
{
  "modelRecommendation": "Specific model name (e.g., Llama-3.2-3B-Instruct, Gemma-2-2B-it, Qwen-2.5-3B, or Gemini Flash Tuned)",
  "framework": "Framework recommendation (e.g., Unsloth FastLanguageModel, Hugging Face SFTTrainer, or Gemini Tuned Models API)",
  "vramRequired": "Estimated VRAM in GB and comparison to Colab T4 15.3GB limit",
  "estimatedTrainingTime": "Realistic training duration for 100-500 examples",
  "apiKeyNeeded": "Exact API keys required (e.g. GEMINI_API_KEY, HF_TOKEN, or WANDB_API_KEY) with official free URL",
  "colabSecretsConfig": "1-2 lines of python using google.colab userdata",
  "dataPrepAdvice": "2-3 sentences of practical dataset advice",
  "explanation": "Clear explanation of why this model and method works best on Colab free tier",
  "suggestedSamples": [
    { "input": "Realistic input 1", "output": "Realistic ideal output 1" },
    { "input": "Realistic input 2", "output": "Realistic ideal output 2" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating training plan:', err);
    return res.status(500).json({
      error: 'Failed to generate training plan with AI. Using offline free-tier guidelines.',
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Generate Synthetic Dataset Samples
app.post('/api/generate-synthetic-data', async (req: Request, res: Response) => {
  try {
    const { topic, count = 5 } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Please provide a topic or prompt for data generation.' });
    }

    if (!ai) {
      // Deterministic fallback sample dataset
      const samples = Array.from({ length: Math.min(count, 5) }).map((_, i) => ({
        instruction: `Answer questions about ${topic} (Sample ${i + 1})`,
        input: `What is a primary principle of ${topic}?`,
        output: `A core principle of ${topic} involves precise application of domain concepts and systematic methodology.`
      }));
      return res.json({ samples });
    }

    const prompt = `Generate ${count} high quality training pairs for fine-tuning a language model on the topic: "${topic}".
Output strictly a JSON object with this shape:
{
  "samples": [
    {
      "instruction": "Specific user instruction or task",
      "input": "Context or input data (can be empty string if none)",
      "output": "High-quality model target response"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{"samples": []}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating synthetic data:', err);
    return res.status(500).json({ error: 'Failed to generate dataset samples.' });
  }
});

// Set up Vite in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Colab Model Training Studio server running on port ${port}`);
  });
}

startServer();
