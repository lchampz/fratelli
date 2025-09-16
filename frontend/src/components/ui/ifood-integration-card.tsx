import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Alert } from './alert';
import { LoadingSpinner } from './loading-spinner';
import { useIFoodStore } from '../../store/ifood';
import { toast } from 'sonner';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface IFoodIntegrationCardProps {
  className?: string;
}

export function IFoodIntegrationCard({ className = '' }: IFoodIntegrationCardProps) {
  const {
    integrationConfig,
    isIntegrationActive,
    integrationStatus,
    configureIntegration,
    getIntegrationStatus,
    testWebhook
  } = useIFoodStore();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState({
    merchantId: integrationConfig?.merchantId || '',
    clientId: integrationConfig?.clientId || '',
    clientSecret: integrationConfig?.clientSecret || '',
    webhookUrl: integrationConfig?.webhookUrl || '',
  });

  const handleConfigure = async () => {
    setIsConfiguring(true);
    try {
      await configureIntegration({
        ...config,
        isActive: true
      });
      toast.success('Integração com iFood configurada com sucesso!');
    } catch {
      toast.error('Erro ao configurar integração com iFood');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    try {
      await testWebhook();
      toast.success('Webhook testado com sucesso!');
    } catch {
      toast.error('Erro ao testar webhook');
    } finally {
      setIsTesting(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await getIntegrationStatus();
      toast.success('Status atualizado!');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusIcon = () => {
    switch (integrationStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <LoadingSpinner size="sm" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (integrationStatus) {
      case 'connected':
        return 'Conectado';
      case 'error':
        return 'Erro na conexão';
      case 'loading':
        return 'Conectando...';
      default:
        return 'Desconectado';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Smartphone className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Integração iFood
            </h3>
            <p className="text-sm text-gray-500">
              Conecte sua confeitaria com o iFood
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStatus}
            className="ml-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isIntegrationActive ? (
        <div className="space-y-4">
          <Alert variant="info" title="Configure a integração">
            Para receber pedidos do iFood, configure suas credenciais abaixo.
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant ID
              </label>
              <Input
                value={config.merchantId}
                onChange={(e) => setConfig(prev => ({ ...prev, merchantId: e.target.value }))}
                placeholder="Seu ID de merchant no iFood"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client ID
              </label>
              <Input
                value={config.clientId}
                onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Client ID da API"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Secret
              </label>
              <Input
                type="password"
                value={config.clientSecret}
                onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Client Secret da API"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <Input
                value={config.webhookUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://seudominio.com/webhook/ifood"
              />
            </div>
          </div>

          <Button
            onClick={handleConfigure}
            disabled={isConfiguring || !config.merchantId || !config.clientId}
            className="w-full"
          >
            {isConfiguring ? (
              <>
                <LoadingSpinner size="sm" />
                Configurando...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Configurar Integração
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Alert variant="success" title="Integração ativa">
            Sua confeitaria está conectada ao iFood e recebendo pedidos automaticamente.
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <p className="text-lg font-semibold text-green-600">Ativo</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Merchant ID</span>
              </div>
              <p className="text-sm font-mono text-gray-600">
                {integrationConfig?.merchantId}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Webhook</span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {integrationConfig?.webhookUrl}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleTestWebhook}
              disabled={isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Testando...
                </>
              ) : (
                'Testar Webhook'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setConfig(prev => ({ ...prev, isActive: false }))}
              className="flex-1"
            >
              Desconectar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
