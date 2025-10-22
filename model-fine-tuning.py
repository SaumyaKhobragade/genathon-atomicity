import torch
import numpy as np
import pandas as pd
from datasets import load_dataset, Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.model_selection import train_test_split
import evaluate
import warnings
import json
import os
from pathlib import Path
# Suppress warnings for cleaner output
warnings.filterwarnings("ignore")

# --- 1. SETUP AND HYPERPARAMETERS FOR BROWSING CONTENT ANALYSIS ---
# Optimized for web content emotion classification
MODEL_CHECKPOINT = "distilbert-base-uncased"  # Fast and efficient for browser extension
NUM_LABELS = 6  # Web browsing emotions: sadness, joy, love, anger, fear, surprise
EPOCHS = 5      # Increased for better web content understanding
BATCH_SIZE = 16 # Optimized batch size
LEARNING_RATE = 3e-5
MAX_LENGTH = 256  # Longer sequences for web content

# Define emotion labels specific to web browsing behavior
EMOTION_LABELS = {
    0: "sadness",    # Negative news, disappointing content
    1: "joy",        # Positive content, achievements, good news
    2: "love",       # Inspiring content, relationships, favorites
    3: "anger",      # Frustrating content, outrageous news
    4: "fear",       # Scary content, anxiety-inducing news
    5: "surprise"    # Unexpected content, breaking news
}

# Create label to ID mapping
LABEL_TO_ID = {label: idx for idx, label in EMOTION_LABELS.items()}
ID_TO_LABEL = {idx: label for idx, label in EMOTION_LABELS.items()}

# --- 2. CREATE WEB CONTENT SPECIFIC DATASET ---
def create_web_content_dataset():
    """Create a dataset with web content examples for emotion classification"""
    
    # Web browsing content examples for each emotion
    web_content_data = [
        # Joy - Positive web content
        {"text": "Amazing breakthrough in renewable energy technology announced today", "label": 1},
        {"text": "Local community comes together to help flood victims", "label": 1},
        {"text": "Scientists discover potential cure for rare disease", "label": 1},
        {"text": "Young entrepreneur builds successful startup from home", "label": 1},
        {"text": "Best vacation spots for 2025 revealed", "label": 1},
        {"text": "Heartwarming story of rescue dog finding forever home", "label": 1},
        {"text": "Technology makes remote work more productive than ever", "label": 1},
        
        # Love - Inspiring, heartwarming content
        {"text": "Couple celebrates 50th wedding anniversary with touching ceremony", "label": 2},
        {"text": "Teacher goes above and beyond to help struggling students", "label": 2},
        {"text": "Beautiful photography captures nature's stunning landscapes", "label": 2},
        {"text": "Family reunites after years of separation", "label": 2},
        {"text": "Acts of kindness during pandemic restore faith in humanity", "label": 2},
        {"text": "Artist creates masterpiece dedicated to healthcare workers", "label": 2},
        
        # Anger - Frustrating, outrageous content
        {"text": "Major corporation caught in environmental scandal", "label": 3},
        {"text": "Politician breaks campaign promises just weeks after election", "label": 3},
        {"text": "Website crashes during important registration deadline", "label": 3},
        {"text": "Company charges hidden fees without customer consent", "label": 3},
        {"text": "System failure causes massive data breach", "label": 3},
        {"text": "Traffic congestion reaches all-time high in city", "label": 3},
        
        # Fear - Anxiety-inducing, scary content
        {"text": "Cybersecurity experts warn of new malware threat", "label": 4},
        {"text": "Economic uncertainty grows as markets fluctuate wildly", "label": 4},
        {"text": "Climate change effects accelerating faster than predicted", "label": 4},
        {"text": "New study reveals concerning health risks", "label": 4},
        {"text": "Personal data stolen in massive security breach", "label": 4},
        {"text": "Job market becomes increasingly competitive", "label": 4},
        
        # Sadness - Disappointing, melancholy content
        {"text": "Local business forced to close after decades of service", "label": 0},
        {"text": "Study shows decline in wildlife populations worldwide", "label": 0},
        {"text": "Beloved community leader passes away unexpectedly", "label": 0},
        {"text": "Historic building demolished despite preservation efforts", "label": 0},
        {"text": "Funding cut for important social programs", "label": 0},
        {"text": "Unemployment rates rise in manufacturing sector", "label": 0},
        
        # Surprise - Unexpected, shocking content
        {"text": "Unexpected discovery changes understanding of ancient history", "label": 5},
        {"text": "Stock market surge surprises financial experts", "label": 5},
        {"text": "Celebrity announces surprise retirement at peak of career", "label": 5},
        {"text": "Weather phenomenon creates spectacular light display", "label": 5},
        {"text": "Technology company unveils revolutionary product ahead of schedule", "label": 5},
        {"text": "Archaeological team makes shocking discovery underground", "label": 5},
    ]
    
    return web_content_data

def augment_with_emotion_dataset():
    """Combine web content data with emotion dataset for better training"""
    print("--- Loading and Augmenting Dataset ---")
    
    # Load the standard emotion dataset
    raw_datasets = load_dataset("emotion")
    
    # Create web content specific examples
    web_data = create_web_content_dataset()
    
    # Convert to pandas DataFrame for easier manipulation
    web_df = pd.DataFrame(web_data)
    
    # Convert existing emotion dataset to DataFrame
    train_df = pd.DataFrame(raw_datasets["train"])
    val_df = pd.DataFrame(raw_datasets["validation"])
    
    # Combine datasets
    combined_train = pd.concat([train_df, web_df], ignore_index=True)
    
    print(f"Original training samples: {len(train_df)}")
    print(f"Web content samples: {len(web_df)}")
    print(f"Combined training samples: {len(combined_train)}")
    
    return combined_train, val_df

# Load and prepare datasets
train_df, val_df = augment_with_emotion_dataset()

# Load the tokenizer
print("--- Loading Tokenizer ---")
tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)

# --- 3. ENHANCED PREPROCESSING FOR WEB CONTENT ---

def preprocess_text(text):
    """Enhanced text preprocessing for web content"""
    if not isinstance(text, str):
        return ""
    
    # Clean web content specific patterns
    text = text.strip()
    # Remove excessive whitespace
    text = ' '.join(text.split())
    # Handle common web content issues
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    return text

def tokenize_function(examples):
    """Enhanced tokenization for web content"""
    # Preprocess texts
    processed_texts = [preprocess_text(text) for text in examples["text"]]
    
    # Tokenize with longer max length for web content
    return tokenizer(
        processed_texts, 
        truncation=True,
        padding=True,
        max_length=MAX_LENGTH
    )

# Convert DataFrames to Datasets
train_dataset = Dataset.from_pandas(train_df)
eval_dataset = Dataset.from_pandas(val_df)

# Apply tokenization
print("--- Tokenizing datasets ---")
train_dataset = train_dataset.map(tokenize_function, batched=True)
eval_dataset = eval_dataset.map(tokenize_function, batched=True)

# Rename label column for Trainer compatibility
if "label" in train_dataset.column_names:
    train_dataset = train_dataset.rename_column("label", "labels")
if "label" in eval_dataset.column_names:
    eval_dataset = eval_dataset.rename_column("label", "labels")

# Use more samples for better web content understanding
train_dataset = train_dataset.shuffle(seed=42).select(range(min(5000, len(train_dataset))))
eval_dataset = eval_dataset.shuffle(seed=42).select(range(min(1000, len(eval_dataset))))

print(f"Final training samples: {len(train_dataset)}")
print(f"Final evaluation samples: {len(eval_dataset)}")

# --- 4. DEFINE METRICS ---
# Define a function to compute performance metrics (Accuracy and F1 Score)

def compute_metrics(eval_pred):
    """Enhanced metrics computation for web content emotion classification"""
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)

    # Calculate comprehensive metrics
    accuracy = accuracy_score(labels, predictions)
    f1_weighted = f1_score(labels, predictions, average='weighted')
    f1_macro = f1_score(labels, predictions, average='macro')
    
    # Calculate per-class metrics for web browsing emotions
    report = classification_report(labels, predictions, output_dict=True, zero_division=0)
    
    # Extract emotion-specific metrics
    emotion_metrics = {}
    for idx, emotion in EMOTION_LABELS.items():
        if str(idx) in report:
            emotion_metrics[f"{emotion}_f1"] = report[str(idx)]["f1-score"]
            emotion_metrics[f"{emotion}_precision"] = report[str(idx)]["precision"]
            emotion_metrics[f"{emotion}_recall"] = report[str(idx)]["recall"]
    
    return {
        "accuracy": accuracy,
        "f1_weighted": f1_weighted,
        "f1_macro": f1_macro,
        **emotion_metrics
    }

# --- 5. INITIALIZE ENHANCED MODEL AND TRAINER ---

print("--- Initializing Model for Web Content Emotion Classification ---")

# Load the pre-trained model optimized for web content
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_CHECKPOINT,
    num_labels=NUM_LABELS,
    problem_type="single_label_classification"
)

# Enhanced training arguments for web content analysis
training_args = TrainingArguments(
    output_dir="./web_emotion_model_results",
    num_train_epochs=EPOCHS,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    gradient_accumulation_steps=2,               # Simulate larger batch size
    warmup_steps=500,
    weight_decay=0.01,
    learning_rate=LEARNING_RATE,
    lr_scheduler_type="cosine",                  # Better learning rate scheduling
    
    # Logging and evaluation
    logging_dir="./web_emotion_logs",
    logging_steps=50,
    evaluation_strategy="steps",                  # More frequent evaluation
    eval_steps=200,
    save_strategy="steps",
    save_steps=200,
    
    # Model selection
    load_best_model_at_end=True,
    metric_for_best_model="f1_weighted",         # Use weighted F1 for imbalanced classes
    greater_is_better=True,
    
    # Performance optimization
    fp16=True,                                   # Mixed precision training
    dataloader_num_workers=4,                    # Parallel data loading
    remove_unused_columns=False,
    
    # Early stopping patience
    save_total_limit=3,                          # Keep only best 3 checkpoints
    
    # Reporting
    report_to=["tensorboard"],
    run_name="web_emotion_classifier",
)

# Custom data collator for better handling
from transformers import DataCollatorWithPadding
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Initialize enhanced trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

print(f"Model initialized with {NUM_LABELS} emotion classes:")
for idx, emotion in EMOTION_LABELS.items():
    print(f"  {idx}: {emotion}")
    
# Print training configuration
print(f"\nTraining Configuration:")
print(f"  - Model: {MODEL_CHECKPOINT}")
print(f"  - Training samples: {len(train_dataset)}")
print(f"  - Evaluation samples: {len(eval_dataset)}")
print(f"  - Epochs: {EPOCHS}")
print(f"  - Batch size: {BATCH_SIZE}")
print(f"  - Learning rate: {LEARNING_RATE}")
print(f"  - Max sequence length: {MAX_LENGTH}")

# --- 6. ENHANCED TRAINING AND DEPLOYMENT PREPARATION ---

def train_and_evaluate():
    """Train the model with comprehensive logging and evaluation"""
    
    print("\n🚀 Starting Web Content Emotion Classification Training...")
    print("=" * 60)
    
    # Train the model
    training_result = trainer.train()
    
    print("\n📊 Training completed! Final metrics:")
    print(f"Training loss: {training_result.training_loss:.4f}")
    
    # Evaluate on the validation set
    print("\n🔍 Running final evaluation...")
    eval_results = trainer.evaluate()
    
    print("\n📈 Final Evaluation Results:")
    print("-" * 40)
    for metric, value in eval_results.items():
        if isinstance(value, float):
            print(f"{metric}: {value:.4f}")
        else:
            print(f"{metric}: {value}")
    
    return training_result, eval_results

def save_model_for_deployment():
    """Save model with comprehensive configuration for browser extension"""
    
    # Define output directory for browser extension
    OUTPUT_DIR = "./browsing_emotion_classifier"
    
    print(f"\n💾 Saving model for browser extension deployment...")
    
    # Save the model and tokenizer
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    # Create model configuration for JavaScript integration
    model_config = {
        "model_name": "Browsing Content Emotion Classifier",
        "version": "1.0.0",
        "num_labels": NUM_LABELS,
        "emotions": EMOTION_LABELS,
        "max_length": MAX_LENGTH,
        "model_checkpoint": MODEL_CHECKPOINT,
        "training_samples": len(train_dataset),
        "evaluation_samples": len(eval_dataset),
        "epochs": EPOCHS,
        "batch_size": BATCH_SIZE,
        "learning_rate": LEARNING_RATE
    }
    
    # Save configuration
    config_path = os.path.join(OUTPUT_DIR, "model_config.json")
    with open(config_path, 'w') as f:
        json.dump(model_config, f, indent=2)
    
    # Create label mapping files for JavaScript
    labels_path = os.path.join(OUTPUT_DIR, "emotion_labels.json")
    with open(labels_path, 'w') as f:
        json.dump({
            "id_to_label": ID_TO_LABEL,
            "label_to_id": LABEL_TO_ID,
            "emotions": EMOTION_LABELS
        }, f, indent=2)
    
    print(f"✅ Model saved to: {OUTPUT_DIR}")
    print(f"📁 Files created:")
    print(f"   - pytorch_model.bin (model weights)")
    print(f"   - config.json (model config)")
    print(f"   - tokenizer.json (tokenizer)")
    print(f"   - model_config.json (training info)")
    print(f"   - emotion_labels.json (label mappings)")
    
    return OUTPUT_DIR

def create_conversion_script():
    """Create script to convert model to TensorFlow.js format"""
    
    conversion_script = '''#!/usr/bin/env python3
"""
Script to convert the trained PyTorch model to TensorFlow.js format
for use in the browser extension.

Usage:
    python convert_to_tfjs.py

Requirements:
    pip install tensorflowjs transformers torch
"""

import os
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import tensorflowjs as tfjs

def convert_model():
    model_dir = "./browsing_emotion_classifier"
    output_dir = "../packages/extension/tfjs_model"
    
    print("Loading PyTorch model...")
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    
    print("Converting to TensorFlow format...")
    tf_model = TFAutoModelForSequenceClassification.from_pretrained(
        model_dir, 
        from_tf=False
    )
    
    print("Converting to TensorFlow.js format...")
    os.makedirs(output_dir, exist_ok=True)
    
    tfjs.converters.save_keras_model(
        tf_model, 
        output_dir,
        quantization_bytes=2  # Compress for browser usage
    )
    
    print(f"Model converted and saved to: {output_dir}")
    print("You can now use this model in your browser extension!")

if __name__ == "__main__":
    convert_model()
'''
    
    with open("convert_to_tfjs.py", 'w') as f:
        f.write(conversion_script)
    
    print("📝 Created conversion script: convert_to_tfjs.py")
    print("   Run this script after training to convert model for browser use")

def test_model_predictions():
    """Test the trained model with sample web content"""
    
    print("\n🧪 Testing model with sample web content...")
    
    test_texts = [
        "Breaking: Amazing scientific breakthrough announced today!",
        "Unfortunately, the local business had to close permanently",
        "This new policy is absolutely ridiculous and unfair",
        "Cybersecurity alert: New malware threatens user data",
        "Heartwarming story of community helping neighbors in need",
        "Unexpected discovery changes everything we knew about space"
    ]
    
    expected_emotions = ["joy", "sadness", "anger", "fear", "love", "surprise"]
    
    print("\nSample predictions:")
    print("-" * 50)
    
    for i, text in enumerate(test_texts):
        # Tokenize
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=MAX_LENGTH)
        
        # Predict
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
            predicted_class_id = predictions.argmax().item()
            confidence = predictions.max().item()
        
        predicted_emotion = EMOTION_LABELS[predicted_class_id]
        expected = expected_emotions[i]
        
        print(f"Text: {text[:50]}...")
        print(f"Expected: {expected} | Predicted: {predicted_emotion} ({confidence:.3f})")
        print(f"Correct: {'✅' if predicted_emotion == expected else '❌'}")
        print()

# Execute training pipeline
if __name__ == "__main__":
    # Train the model
    training_result, eval_results = train_and_evaluate()
    
    # Save for deployment
    model_path = save_model_for_deployment()
    
    # Create conversion utilities
    create_conversion_script()
    
    # Test predictions
    test_model_predictions()
    
    print("\n🎉 Training Complete!")
    print("=" * 60)
    print("Next steps:")
    print("1. Run 'python convert_to_tfjs.py' to convert for browser extension")
    print("2. Copy the tfjs_model folder to your extension directory")
    print("3. Use the emotion-classifier.js we created earlier")
    print("4. The model is ready for web content emotion analysis!")
    print("\n🔗 Model is optimized for:")
    print("   - Web page content analysis")
    print("   - Social media posts")
    print("   - News articles")
    print("   - User-generated content")
    print("   - Real-time browsing emotion detection")
