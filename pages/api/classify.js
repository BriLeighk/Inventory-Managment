export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl,
              },
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(`Google Cloud Vision API error: ${response.status} - ${errorDetail}`);
      return res.status(response.status).json({ message: `Google Cloud Vision API error: ${response.status}`, detail: errorDetail });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error', detail: error.message });
  }
}