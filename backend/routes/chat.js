const express = require('express');
const router = express.Router();

const CHOWHAN_INFO = `
You are an AI assistant for Chowhan Dutta's portfolio website.
Answer questions about Chowhan professionally and helpfully.
Keep answers concise and friendly.

NAME: Chowhan Dutta
EMAIL: chowhandutta2004@gmail.com
PHONE: +91 6304993473
GITHUB: https://github.com/chowhandutta2004-lgtm
LINKEDIN: https://www.linkedin.com/in/chowhan-dutta-5582aa3a4

SUMMARY:
Final-year Computer Science student at SRMIST with a passion 
for generative AI and machine learning. Fast learner who thrives 
on building innovative projects that tackle real-world problems.

EDUCATION:
- B.E. Computer Science (AI-ML) at SRMIST — GPA: 7.6 (2026)
- 12th Grade at WiseWoods IS — 79% (2022)
- 10th Grade at WiseWoods IS — 70% (2020)

SKILLS:
- Programming: Python
- Frameworks: React, TensorFlow, Keras, PyTorch, OpenCV, 
  Pandas, NumPy, Hugging Face Transformers
- Tools: Google Colab, VS Code, Git, GitHub, Jupyter, Vercel
- AI/ML: Neural Networks, GANs, Deep Learning, 
  Computer Vision, NLP, RAG Systems

PROJECTS:
1. Advanced OCR System with CNN and GAN
   - Built OCR system combining CNNs for character detection
     and GANs for data augmentation
   - Achieved real-time recognition with scalable pipeline
   - GitHub: https://github.com/chowhandutta2004-lgtm/Handwritten-Character-Recognition-using-CNN-and-Generative-AI

CERTIFICATIONS:
- Deep Learning & Neural Networks — Udemy
- Computer Architecture — NPTEL
- SRM Hackathon 2024 — Top 10 Internal Round
- Director of Students Affairs — Discipline Committee Head

AVAILABILITY: Actively looking for Gen AI and ML opportunities
`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ 
      error: 'Message is required!' 
    });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: `<|system|>${CHOWHAN_INFO}</s><|user|>${message}</s><|assistant|>`,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.7,
              return_full_text: false,
              wait_for_model: true
            }
          })
      }
    );

    const data = await response.json();
    const aiReply = data[0]?.generated_text || 
                    "Sorry, I couldn't process that. Try again!";

    console.log(`🤖 AI replied to: "${message}"`);

    res.json({ reply: aiReply });

  } catch (error) {
    console.error('Hugging Face error:', error);
    res.status(500).json({ 
      error: 'AI is taking a break! Try again in a moment.' 
    });
  }
});

module.exports = router;