"use client";

import { useState, useEffect } from 'react';
import { GenerateScript } from '@/components/ai';

export const useScriptGenerator = () => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('UGC');
  const [outline, setOutline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<object | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const generatedScript = await GenerateScript(
        productName,
        productType,
        website,
        description,
        style,
        outline
      );

      if (typeof generatedScript === 'object' && generatedScript !== null) {
        setScript(generatedScript);
        console.log('Generated script:', generatedScript);
      } else {
        console.error('Generated script is not an object');
      }
    } catch (error) {
      console.error('Error generating script:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (script) {
      const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'viralify_generated_script.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Script downloaded successfully!');
    } else {
      alert('No script to download');
    }
  };

  const handleCopy = () => {
    if (script) {
      navigator.clipboard.writeText(JSON.stringify(script, null, 2)).then(() => {
        alert('Script copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy script. Please try again.');
      });
    } else {
      alert('No script to copy');
    }
  };

  const handleBadGeneration = async () => {
    if (!script) {
      console.error('User email or script is missing');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('entry.1331011511', productName);
    formData.append('entry.873912732', productType);
    formData.append('entry.35334067', website);
    formData.append('entry.1229644029', description);
    formData.append('entry.902682598', style);
    formData.append('entry.536774460', outline);
    formData.append('entry.1100624546', JSON.stringify(script));

    try {
      const response = await fetch('https://docs.google.com/forms/d/1d-UdgD0DgXt43FK4SPvdeMEkPQUNEtq4dPMkXnW2iKM/formResponse', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        console.log('Bad generation report sent successfully');
      } else {
        console.error('Failed to send bad generation report');
      }
    } catch (error) {
      console.error('Error sending bad generation report:', error);
    }
  };

  return {
    productName,
    setProductName,
    productType,
    setProductType,
    website,
    setWebsite,
    description,
    setDescription,
    style,
    setStyle,
    outline,
    setOutline,
    isLoading,
    script,
    handleGenerate,
    handleDownload,
    handleCopy,
  };
};

export default useScriptGenerator;