import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'Ocorreu um erro inesperado'
  } = options;

  const handleError = useCallback((error: unknown, context?: string) => {
    let errorMessage = fallbackMessage;
    let errorDetails: string | undefined;

    // Extrair informações do erro
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Log do erro no console
    if (logError) {
      console.error(`[ErrorHandler${context ? ` - ${context}` : ''}]:`, {
        message: errorMessage,
        details: errorDetails,
        error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    // Mostrar toast de erro
    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    };
  }, [showToast, logError, fallbackMessage]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}
