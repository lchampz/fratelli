import React, { useEffect } from 'react';
import { IFoodIntegrationCard } from '../components/ui/ifood-integration-card';
import { IFoodOrdersList } from '../components/ui/ifood-orders-list';
import { IFoodAnalyticsChart } from '../components/ui/ifood-analytics-chart';
import { useIFoodStore } from '../store/ifood';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { Alert } from '../components/ui/alert';
import { 
  Smartphone, 
  BarChart3, 
  ShoppingBag,
  Settings
} from 'lucide-react';

export default function IFoodPage() {
  const {
    isIntegrationActive,
    integrationStatus,
    getIntegrationStatus,
    getOrders,
    getSalesSummary,
    getTopProducts
  } = useIFoodStore();

  useEffect(() => {
    // Carregar dados iniciais
    const loadInitialData = async () => {
      try {
        await getIntegrationStatus();
        
        if (isIntegrationActive) {
          await Promise.all([
            getOrders({ limit: 20 }),
            getSalesSummary({ groupBy: 'day' }),
            getTopProducts({ limit: 10 })
          ]);
        }
      } catch {
        // Erro ao carregar dados iniciais
      }
    };

    loadInitialData();
  }, [isIntegrationActive]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Integração iFood
            </h1>
          </div>
          <p className="text-gray-600">
            Gerencie pedidos, analytics e configurações da sua confeitaria no iFood
          </p>
        </div>

        {/* Status da integração */}
        {integrationStatus === 'loading' && (
          <div className="mb-6">
            <Alert variant="info" title="Carregando integração">
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Verificando status da integração...
              </div>
            </Alert>
          </div>
        )}

        {/* Configuração da integração */}
        <div className="mb-8">
          <IFoodIntegrationCard />
        </div>

        {/* Conteúdo principal - só mostra se a integração estiver ativa */}
        {isIntegrationActive ? (
          <div className="space-y-8">
            {/* Analytics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Analytics e Relatórios
                </h2>
              </div>
              <IFoodAnalyticsChart />
            </div>

            {/* Pedidos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Pedidos Recentes
                </h2>
              </div>
              <IFoodOrdersList />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Configure a integração
              </h3>
              <p className="text-gray-600 mb-6">
                Para começar a receber pedidos do iFood e visualizar analytics, 
                configure sua integração acima.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="font-medium text-gray-900 mb-2">
                  Benefícios da integração:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Recebimento automático de pedidos</li>
                  <li>• Confirmação e gestão de pedidos</li>
                  <li>• Analytics detalhados de vendas</li>
                  <li>• Sincronização de catálogo</li>
                  <li>• Relatórios de performance</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Como funciona a integração?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Configure</h4>
              <p className="text-sm text-gray-600">
                Insira suas credenciais do iFood Developer para conectar sua confeitaria
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Receba</h4>
              <p className="text-sm text-gray-600">
                Pedidos chegam automaticamente via webhook e aparecem em tempo real
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Gerencie</h4>
              <p className="text-sm text-gray-600">
                Confirme, despache e acompanhe pedidos com analytics detalhados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
