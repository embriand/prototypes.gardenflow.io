import { useState, useCallback } from 'react';
import { RecognitionResult } from '../types';
// import { ImageRecognitionService } from '../services/imageRecognitionService';

export const useImageRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // const recognitionService = ImageRecognitionService.getInstance();

  const processImage = useCallback(async (imageDataUrl: string): Promise<RecognitionResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      // const recognitionResult = await recognitionService.processImage(imageDataUrl);
      // Temporary mock result to prevent errors
      const recognitionResult: RecognitionResult = {
        zones: [],
        labels: [],
        items: [],
        confidence: 0,
        processingTime: 0
      };
      setResult(recognitionResult);
      setIsProcessing(false);
      return recognitionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image recognition failed';
      setError(errorMessage);
      setIsProcessing(false);
      throw new Error(errorMessage);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    result,
    error,
    processImage,
    clearResult
  };
};