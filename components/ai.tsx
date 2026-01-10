// Client-side function that calls the server-side API route
export const GenerateScript = async (
  productName: string,
  productType: string,
  website: string,
  description: string,
  style: string,
  outline: string
): Promise<{ [key: string]: string }> => {
  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        productType,
        website,
        description,
        style,
        outline,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to generate script');
    }

    const data = await response.json();
    return data.script;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};