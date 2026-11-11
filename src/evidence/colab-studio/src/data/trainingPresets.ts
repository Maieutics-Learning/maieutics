export interface ApiKeyGuide {
  id: string;
  name: string;
  envVar: string;
  provider: string;
  portalUrl: string;
  cost: string;
  freeTierDetails: string;
  colabSecretKey: string;
  pythonSnippet: string;
  whyNeeded: string;
  steps: string[];
}

export const API_KEYS_INFO: ApiKeyGuide[] = [
  {
    id: 'gemini',
    name: 'Google AI Studio API Key',
    envVar: 'GEMINI_API_KEY',
    provider: 'Google AI Studio',
    portalUrl: 'https://aistudio.google.com/apikey',
    cost: '100% Free Tier Available',
    freeTierDetails: '15 requests per min, 1,000,000 tokens per min, and free model fine-tuning compute hosted on Google Cloud infrastructure.',
    colabSecretKey: 'GEMINI_API_KEY',
    pythonSnippet: `from google.colab import userdata
import os

GEMINI_API_KEY = userdata.get('GEMINI_API_KEY')
os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY
print("Google AI Studio API Key configured safely!")`,
    whyNeeded: 'Required for supervised fine-tuning of Gemini models (e.g. Gemini 1.5 Flash), downloading datasets, and running fast API-based inference without requiring local GPU VRAM.',
    steps: [
      'Navigate to https://aistudio.google.com/apikey in your browser.',
      'Sign in with your standard Google Account (same account you use for Google Colab).',
      'Click the blue "Create API key" button.',
      'Select or automatically generate a Google Cloud Project.',
      'Copy your 39-character key (starts with AIzaSy...).',
      'In your Google Colab notebook, click the 🔑 Secrets icon on the left toolbar, click "+ Add new secret", enter name "GEMINI_API_KEY", paste the value, and toggle "Notebook access" ON.'
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Access Token',
    envVar: 'HF_TOKEN',
    provider: 'Hugging Face',
    portalUrl: 'https://huggingface.co/settings/tokens',
    cost: '100% Free',
    freeTierDetails: 'Unlimited downloads of public & gated models (Gemma 2, Llama 3.2, Mistral, Qwen) and unlimited model uploads to personal repositories.',
    colabSecretKey: 'HF_TOKEN',
    pythonSnippet: `from google.colab import userdata
from huggingface_hub import login

HF_TOKEN = userdata.get('HF_TOKEN')
login(token=HF_TOKEN)
print("Hugging Face Hub authentication successful!")`,
    whyNeeded: 'Required to download gated open-weights models (like Meta Llama 3.2 and Google Gemma 2) and to push your trained LoRA adapter weights directly to the Hugging Face Hub.',
    steps: [
      'Create or sign in to your free account at https://huggingface.co.',
      'Go to Settings > Access Tokens (https://huggingface.co/settings/tokens).',
      'Click "Create new token".',
      'Set the token type to "Write" (so you can push your trained model back to your account).',
      'Give it a name like "colab-free-tier" and copy the token (starts with hf_...).',
      'Accept the license agreement on the model card of the base model you want to train (e.g., meta-llama/Llama-3.2-3B or google/gemma-2-2b-it).'
    ]
  },
  {
    id: 'wandb',
    name: 'Weights & Biases (W&B) Key',
    envVar: 'WANDB_API_KEY',
    provider: 'Weights & Biases',
    portalUrl: 'https://wandb.ai/authorize',
    cost: '100% Free for Academics & Individuals',
    freeTierDetails: 'Free unlimited private and public project tracking, live loss curves, GPU VRAM monitoring, and interactive run comparisons.',
    colabSecretKey: 'WANDB_API_KEY',
    pythonSnippet: `from google.colab import userdata
import os
import wandb

WANDB_API_KEY = userdata.get('WANDB_API_KEY')
os.environ['WANDB_API_KEY'] = WANDB_API_KEY
wandb.login(key=WANDB_API_KEY)
print("Weights & Biases tracking active!")`,
    whyNeeded: 'Essential for watching your training loss drop in real time without refreshing Colab cells, and keeping your training logs even if your Colab session times out.',
    steps: [
      'Sign in or sign up at https://wandb.ai.',
      'Visit https://wandb.ai/authorize to view your 40-character API key.',
      'Copy the key and save it in Colab Secrets as "WANDB_API_KEY".',
      'Pass `report_to="wandb"` inside your TrainingArguments to track loss in real time.'
    ]
  },
  {
    id: 'kaggle',
    name: 'Kaggle API Key',
    envVar: 'KAGGLE_KEY',
    provider: 'Kaggle',
    portalUrl: 'https://www.kaggle.com/settings',
    cost: '100% Free',
    freeTierDetails: 'Direct download access to millions of free curated datasets directly into Colab memory in seconds.',
    colabSecretKey: 'KAGGLE_KEY',
    pythonSnippet: `from google.colab import userdata
import os

os.environ['KAGGLE_USERNAME'] = userdata.get('KAGGLE_USERNAME')
os.environ['KAGGLE_KEY'] = userdata.get('KAGGLE_KEY')
print("Kaggle CLI configured!")`,
    whyNeeded: 'Allows instant command-line downloading of large curated machine learning datasets without having to download them to your local laptop and re-uploading to Google Drive.',
    steps: [
      'Log into your account at https://www.kaggle.com.',
      'Click your avatar in the top right > Settings.',
      'Scroll down to the "API" section and click "Create New Token".',
      'Open the downloaded kaggle.json file and copy your "username" and "key".',
      'Add both as Colab Secrets (KAGGLE_USERNAME and KAGGLE_KEY).'
    ]
  }
];

export interface TrainingTrack {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  targetHardware: string;
  recommendedApiKey: string;
  estimatedVram: string;
  trainingTime: string;
  summary: string;
  prerequisites: string[];
  cells: {
    title: string;
    description: string;
    type: 'markdown' | 'code';
    code: string;
  }[];
}

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: 'gemini-tuning',
    title: 'Google Gemini Model Fine-Tuning',
    subtitle: 'Official Supervised Fine-Tuning using Google AI Studio API',
    tag: 'Cloud-Compute (Zero GPU VRAM)',
    targetHardware: 'Google Cloud Infrastructure (Colab free CPU or GPU)',
    recommendedApiKey: 'GEMINI_API_KEY',
    estimatedVram: '0 GB (No local GPU required)',
    trainingTime: '10 - 25 minutes (Server-Side)',
    summary: 'The easiest and most powerful way to tune a frontier LLM on Colab free tier. You upload training dataset pairs, and Google Cloud handles all backpropagation, gradient updates, and checkpointing for free on Google TPU/GPU infrastructure.',
    prerequisites: [
      'Google AI Studio API Key (from https://aistudio.google.com/apikey)',
      'At least 20-100 prompt/response training pairs in JSONL format'
    ],
    cells: [
      {
        title: 'Step 1: Install Google GenAI SDK',
        description: 'Install the official Google GenAI Python library.',
        type: 'code',
        code: `!pip install -q -U google-genai pandas`
      },
      {
        title: 'Step 2: Configure Colab Secret API Key',
        description: 'Read the GEMINI_API_KEY securely from Colab Secrets.',
        type: 'code',
        code: `from google.colab import userdata
import os
from google import genai

# Retrieve API key securely from Google Colab Secrets (Key icon in left sidebar)
try:
    gemini_api_key = userdata.get('GEMINI_API_KEY')
    print("Successfully retrieved GEMINI_API_KEY from Colab Secrets!")
except Exception as e:
    print("Secret not found. Please click the Key icon on the left, add 'GEMINI_API_KEY', and enable Notebook access.")
    gemini_api_key = input("Or paste your API key here: ")

client = genai.Client(api_key=gemini_api_key)`
      },
      {
        title: 'Step 3: Prepare the Training Dataset (JSONL)',
        description: 'Create a sample domain-specific dataset formatted according to the official Gemini tuning schema.',
        type: 'code',
        code: `import json

# Format for Gemini Supervised Tuning:
# Each line is a JSON object with 'text_input' and 'output' (or 'messages' structure)
dataset = [
    {
        "text_input": "Summarize the return policy for international orders.",
        "output": "International orders can be returned within 45 days of delivery in original packaging. Return shipping fees apply unless the item is defective."
    },
    {
        "text_input": "How do I request a replacement for a damaged shipment?",
        "output": "Please submit a photo of the damaged package and your order number via the support portal within 7 business days for an immediate replacement."
    },
    {
        "text_input": "Can I modify my shipping address after placing an order?",
        "output": "Address updates can be processed within 60 minutes of placing the order before dispatch. Reach out via priority live chat with your order reference."
    },
    {
        "text_input": "What payment methods are supported for corporate billing?",
        "output": "Corporate accounts can pay via Net-30 invoicing, ACH transfer, wire transfer, or major corporate credit cards."
    }
]

# Write out as JSONL
with open("training_data.jsonl", "w") as f:
    for item in dataset:
        f.write(json.dumps(item) + "\\n")

print(f"Created training_data.jsonl with {len(dataset)} examples ready for tuning!")`
      },
      {
        title: 'Step 4: Launch the Fine-Tuning Job',
        description: 'Submit the tuning job to Google AI Studio. Google will train the model in the cloud for you!',
        type: 'code',
        code: `import time

print("Uploading dataset and initiating fine-tuning job...")

# Create the tuning job
# Base models supporting tuning: 'models/gemini-1.5-flash-001' or latest flash
operation = client.tunings.tune(
    base_model="models/gemini-1.5-flash-001",
    training_dataset="training_data.jsonl",
    config={
        "display_name": "my-colab-tuned-gemini",
        "epoch_count": 5,
        "batch_size": 4,
        "learning_rate": 0.001
    }
)

print(f"Tuning job submitted! Job Name: {operation.name}")

# Poll status until complete
while not operation.done:
    print(f"Waiting for tuning to complete... Checking status...")
    time.sleep(30)
    operation = client.operations.get(operation.name)

print("Tuning complete! Tuned model is now ready to use!")
tuned_model_id = operation.response.model
print(f"Tuned Model ID: {tuned_model_id}")`
      },
      {
        title: 'Step 5: Test Your Tuned Model',
        description: 'Query your newly fine-tuned model and compare its specialized answers.',
        type: 'code',
        code: `# Run inference with your newly tuned model
test_prompt = "Summarize the return policy for international orders."

response = client.models.generate_content(
    model=tuned_model_id,
    contents=test_prompt
)

print("--- TUNED MODEL RESPONSE ---")
print(response.text)`
      }
    ]
  },
  {
    id: 'unsloth-qlora',
    title: 'Unsloth Fast QLoRA (Llama-3.2 / Gemma 2)',
    subtitle: 'Ultra-fast 4-bit LoRA optimized for Colab Free T4 15GB GPU',
    tag: 'Recommended Open Source',
    targetHardware: 'NVIDIA T4 15.3GB (Colab Free GPU)',
    recommendedApiKey: 'HF_TOKEN',
    estimatedVram: '~5.5 - 7.2 GB (Well within 15.3GB limit)',
    trainingTime: '15 - 30 minutes on Colab T4',
    summary: 'Unsloth is the gold standard for training open-weights LLMs (Llama 3.2 1B/3B, Gemma 2 2B/9B, Qwen 2.5) on Google Colab free tier. It provides custom hand-written Triton kernels that run 2x faster and use 70% less memory, guaranteeing zero CUDA OOM on the free T4 GPU.',
    prerequisites: [
      'Colab GPU Runtime: Runtime > Change runtime type > T4 GPU',
      'Hugging Face Access Token (HF_TOKEN) with Accepted Model License'
    ],
    cells: [
      {
        title: 'Step 1: Check GPU & Install Unsloth',
        description: 'Verify your NVIDIA T4 GPU and install Unsloth.',
        type: 'code',
        code: `!nvidia-smi

# Install Unsloth optimized for Colab's PyTorch & CUDA 12.1+
!pip install -q "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
!pip install -q --no-deps "xformers<0.0.29" "trl<0.9.0" peft accelerate bitsandbytes datasets`
      },
      {
        title: 'Step 2: Load Model in 4-bit Quantization',
        description: 'Load Llama-3.2-3B-Instruct (or Gemma-2-2B-it) with pre-quantized 4-bit weights.',
        type: 'code',
        code: `from unsloth import FastLanguageModel
import torch

max_seq_length = 2048  # Supports RoPE scaling automatically
dtype = None           # None for auto detection (Float16 for T4)
load_in_4bit = True    # 4bit quantization fits 3B/7B models in <7GB VRAM

# Load the base model and tokenizer
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-3B-Instruct",
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)

print(f"Model loaded into Colab T4 GPU! Initial VRAM allocated: {torch.cuda.memory_allocated() / 1e9:.2f} GB")`
      },
      {
        title: 'Step 3: Attach LoRA Adapters (PEFT)',
        description: 'Inject trainable parameter adapters without touching base weights.',
        type: 'code',
        code: `model = FastLanguageModel.get_peft_model(
    model,
    r=16,                  # LoRA Rank (16 is ideal for free tier)
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,        # Optimized to 0 for Unsloth
    bias="none",
    use_gradient_checkpointing="unsloth", # Saves massive VRAM!
    random_state=3407,
    use_rslora=False,
    loftq_config=None,
)

print("LoRA adapters attached. Only ~0.5% of parameters are trainable!")`
      },
      {
        title: 'Step 4: Format Dataset & Initialize Trainer',
        description: 'Format data into standard Alpaca instruction template and train using SFTTrainer.',
        type: 'code',
        code: `from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

# Alpaca instruction prompt template
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

def formatting_prompts_func(examples):
    instructions = examples["instruction"]
    inputs       = examples["input"]
    outputs      = examples["output"]
    texts = []
    for instruction, input_text, output in zip(instructions, inputs, outputs):
        text = alpaca_prompt.format(instruction, input_text, output) + tokenizer.eos_token
        texts.append(text)
    return { "text" : texts }

# Load a sample dataset (or load your custom JSONL: load_dataset("json", data_files="my_data.jsonl"))
dataset = load_dataset("yahma/alpaca-cleaned", split="train[:500]")
dataset = dataset.map(formatting_prompts_func, batched=True)

# Training arguments tuned for Google Colab Free T4
training_args = TrainingArguments(
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    warmup_steps=5,
    max_steps=60,          # Adjust steps based on your dataset size
    learning_rate=2e-4,
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    logging_steps=10,
    optim="adamw_8bit",
    weight_decay=0.01,
    lr_scheduler_type="linear",
    seed=3407,
    output_dir="colab_outputs",
)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=False,
    args=training_args,
)

print("Starting training on Google Colab T4...")
trainer_stats = trainer.train()
print(f"Training completed! Final Loss: {trainer_stats.training_loss:.4f}")`
      },
      {
        title: 'Step 5: Test Inference & Save Adapters',
        description: 'Test your fine-tuned model and save the adapter to Google Drive.',
        type: 'code',
        code: `from unsloth import FastLanguageModel

# Enable native fast inference
FastLanguageModel.for_inference(model)

inputs = tokenizer(
[
    alpaca_prompt.format(
        "Give 3 tips for training deep learning models on a budget.", # Instruction
        "", # Context / Input
        "", # Leave blank for generation
    )
], return_tensors="pt").to("cuda")

outputs = model.generate(**inputs, max_new_tokens=128, use_cache=True)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))

# Save the fine-tuned LoRA adapters
model.save_pretrained("my_colab_lora_model")
tokenizer.save_pretrained("my_colab_lora_model")
print("Model saved locally! To push to Hugging Face, run: model.push_to_hub('your-username/my-model', token=userdata.get('HF_TOKEN'))")`
      }
    ]
  },
  {
    id: 'huggingface-peft',
    title: 'Hugging Face PEFT & TRL (Gemma-2-2B-it)',
    subtitle: 'Standard open-source training with Transformers and BitsAndBytes',
    tag: 'Standard Ecosystem',
    targetHardware: 'NVIDIA T4 15.3GB (Colab Free GPU)',
    recommendedApiKey: 'HF_TOKEN',
    estimatedVram: '~7.8 GB',
    trainingTime: '20 - 45 minutes on Colab T4',
    summary: 'The standard industry-wide methodology for fine-tuning transformer models using Hugging Face PEFT, Accelerate, and TRL. Directly pushes your trained weights to your free Hugging Face account.',
    prerequisites: [
      'Colab GPU Runtime (T4)',
      'Hugging Face Access Token (Write permissions)'
    ],
    cells: [
      {
        title: 'Step 1: Install Hugging Face Stack',
        description: 'Install transformers, peft, accelerate, and bitsandbytes.',
        type: 'code',
        code: `!pip install -q -U transformers datasets accelerate peft bitsandbytes trl`
      },
      {
        title: 'Step 2: Authenticate with Hugging Face Token',
        description: 'Login using the HF_TOKEN stored in Colab Secrets.',
        type: 'code',
        code: `from google.colab import userdata
from huggingface_hub import login

try:
    hf_token = userdata.get('HF_TOKEN')
    login(token=hf_token)
    print("Authenticated with Hugging Face Hub successfully!")
except Exception as e:
    print("HF_TOKEN secret not found. Storing token manually...")
    login()`
      },
      {
        title: 'Step 3: Load Model with 4-bit Quantization Config',
        description: 'Configure BitsAndBytes 4-bit NF4 quantization to minimize GPU VRAM consumption.',
        type: 'code',
        code: `import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

model_id = "google/gemma-2-2b-it"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)

peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, peft_config)
model.print_trainable_parameters()`
      },
      {
        title: 'Step 4: Train with SFTTrainer',
        description: 'Execute training using TRL SFTTrainer.',
        type: 'code',
        code: `from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

dataset = load_dataset("timdettmers/openassistant-guanaco", split="train[:300]")

training_args = TrainingArguments(
    output_dir="./gemma-2b-colab",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    logging_steps=10,
    max_steps=50,
    fp16=True,
    optim="paged_adamw_8bit"
)

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=1024,
    args=training_args
)

trainer.train()
print("Training successfully finished!")`
      }
    ]
  },
  {
    id: 'pytorch-classifier',
    title: 'PyTorch / DistilBERT Text Classifier',
    subtitle: 'Lightning-fast 3-minute training for custom categorization or sentiment',
    tag: 'Beginner & Fast',
    targetHardware: 'NVIDIA T4 15.3GB or CPU',
    recommendedApiKey: 'None (Direct PyTorch)',
    estimatedVram: '~1.8 GB',
    trainingTime: '3 - 5 minutes on Colab T4',
    summary: 'The best starter project to verify your Colab GPU environment and learn the fundamental machine learning training loop before diving into large billion-parameter models.',
    prerequisites: [
      'Google Colab Notebook (Free Tier)'
    ],
    cells: [
      {
        title: 'Step 1: Install PyTorch & Transformers',
        description: 'Install standard lightweight libraries.',
        type: 'code',
        code: `!pip install -q transformers datasets evaluate scikit-learn`
      },
      {
        title: 'Step 2: Prepare Dataset and Model',
        description: 'Load IMDb sentiment data and DistilBERT.',
        type: 'code',
        code: `from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
import evaluate
import numpy as np

# Load dataset
dataset = load_dataset("imdb")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=256)

tokenized_datasets = dataset.map(tokenize_function, batched=True)
train_dataset = tokenized_datasets["train"].shuffle(seed=42).select(range(1000))
eval_dataset = tokenized_datasets["test"].shuffle(seed=42).select(range(200))

model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)`
      },
      {
        title: 'Step 3: Train and Evaluate',
        description: 'Train the model in 3 minutes on Colab T4.',
        type: 'code',
        code: `accuracy_metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return accuracy_metric.compute(predictions=predictions, references=labels)

training_args = TrainingArguments(
    output_dir="sentiment_model",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=2,
    weight_decay=0.01,
    fp16=True,
    logging_steps=20
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()
eval_results = trainer.evaluate()
print(f"Validation Accuracy: {eval_results['eval_accuracy'] * 100:.2f}%")`
      }
    ]
  }
];

export const COLAB_FREE_TIER_LIMITS = {
  gpu: {
    name: 'NVIDIA Tesla T4',
    vram: '15.36 GB GDDR6',
    tensorCores: '320 Turing Tensor Cores',
    precision: 'FP16, INT8, INT4',
    notes: 'Free tier users get T4 access. Avoid bf16 (Bfloat16), use fp16 or 4-bit (NF4) quantization instead.'
  },
  ram: {
    size: '12.7 GB System RAM',
    warning: 'Loading datasets larger than 4GB into Python pandas or memory can crash the session (OOM). Use datasets streaming or lazy-loading.'
  },
  disk: {
    size: '~78 GB Free Storage',
    warning: 'Files stored in /content are deleted when the Colab instance terminates. Always mount Google Drive (from google.colab import drive) to save checkpoints.'
  },
  timeout: {
    maxDuration: '12 Hours Maximum',
    idleDisconnect: '60 - 90 Minutes Idle',
    tip: 'Keep the browser tab open while training, and save checkpoints every 5-10 minutes.'
  }
};
