require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 🔷 Génération texte IA via OpenRouter (Mistral)
 */
app.post('/generate', async (req, res) => {
  const { trend } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `Je veux créer une mini-marque virale autour de la tendance suivante : "${trend}". Donne-moi :
1. Un nom de marque original
2. Un slogan court
3. Une description stylée
4. Une idée d’image ou visuel associé`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://neurobrand.localhost',
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error('❌ Erreur texte IA :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur génération texte IA' });
  }
});

/**
 * 🎨 Génération d’image IA via Hugging Face + upload Cloudinary
 */
app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: { inputs: prompt },
      responseType: 'arraybuffer',
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const cloudResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'neurobrand', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(imageBuffer);
    });

    res.json({ url: cloudResult.secure_url });
  } catch (err) {
    console.error('❌ Erreur image IA / Cloudinary :', err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur génération image IA' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ NeuroBrand (texte + image Cloudinary) actif sur le port ${PORT}`);
});
