const classifyImage = async (imageUrl) => {
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorDetail}`);
  }

  const result = await response.json();
  return result;
};

export { classifyImage };
