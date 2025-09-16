import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertTriangle, Home, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error?: Error;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export default function ErrorPage({ 
  error, 
  title = "Ops! Algo deu errado", 
  message = "Encontramos um problema inesperado. Não se preocupe, nossa equipe foi notificada e está trabalhando para resolver isso.",
  showRetry = true
}: ErrorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {/* Ícone de Erro */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Detalhes do Erro (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">Detalhes do Erro:</h3>
              <p className="text-xs text-red-700 font-mono break-words">
                {error.message}
              </p>
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">
                  Stack Trace
                </summary>
                <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            </div>
          )}

          {/* Informações da Rota (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Informações da Rota:</h3>
              <p className="text-xs text-blue-700 font-mono">
                <strong>Pathname:</strong> {location.pathname}
              </p>
              <p className="text-xs text-blue-700 font-mono">
                <strong>Search:</strong> {location.search || 'Nenhum'}
              </p>
              <p className="text-xs text-blue-700 font-mono">
                <strong>State:</strong> {location.state ? JSON.stringify(location.state) : 'Nenhum'}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-3">
            {showRetry && (
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            )}

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Página Anterior
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-6 py-3 rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Se o problema persistir, entre em contato conosco através do suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
