import { api } from './api';
import type { 
  IFoodIntegrationConfig
} from '../types/ifood';

export class IFoodService {
  private static readonly BASE_URL = 'https://pos-api.ifood.com.br';

  // Configurar integração com iFood
  static async configureIntegration(config: IFoodIntegrationConfig) {
    try {
      const response = await api.post('/ifood/integration/configure', config);
      return response.data;
    } catch (error) {
      console.error('Erro ao configurar integração iFood:', error);
      throw error;
    }
  }

  // Obter configuração atual
  static async getIntegrationConfig() {
    try {
      const response = await api.get('/ifood/integration/config');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configuração iFood:', error);
      throw error;
    }
  }

  // Sincronizar catálogo de produtos
  static async syncCatalog(products: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    available: boolean;
    imageUrl?: string;
  }>) {
    try {
      const response = await api.post('/ifood/catalog/sync', { products });
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar catálogo:', error);
      throw error;
    }
  }

  // Obter pedidos do iFood
  static async getOrders(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const response = await api.get('/ifood/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter pedidos iFood:', error);
      throw error;
    }
  }

  // Obter detalhes de um pedido específico
  static async getOrderById(orderId: string) {
    try {
      const response = await api.get(`/ifood/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter pedido iFood:', error);
      throw error;
    }
  }

  // Confirmar pedido
  static async confirmOrder(orderId: string, estimatedTime?: number) {
    try {
      const response = await api.post(`/ifood/orders/${orderId}/confirm`, {
        estimatedTime
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      throw error;
    }
  }

  // Cancelar pedido
  static async cancelOrder(orderId: string, reason: string) {
    try {
      const response = await api.post(`/ifood/orders/${orderId}/cancel`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }

  // Marcar pedido como despachado
  static async dispatchOrder(orderId: string) {
    try {
      const response = await api.post(`/ifood/orders/${orderId}/dispatch`);
      return response.data;
    } catch (error) {
      console.error('Erro ao despachar pedido:', error);
      throw error;
    }
  }

  // Obter resumo de vendas
  static async getSalesSummary(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    try {
      const response = await api.get('/ifood/analytics/sales-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter resumo de vendas:', error);
      throw error;
    }
  }

  // Obter produtos mais vendidos
  static async getTopProducts(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    try {
      const response = await api.get('/ifood/analytics/top-products', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produtos mais vendidos:', error);
      throw error;
    }
  }

  // Testar webhook
  static async testWebhook() {
    try {
      const response = await api.post('/ifood/webhook/test');
      return response.data;
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      throw error;
    }
  }

  // Obter status da integração
  static async getIntegrationStatus() {
    try {
      const response = await api.get('/ifood/integration/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status da integração:', error);
      throw error;
    }
  }
}

// Hook para usar o serviço iFood
export const useIFoodService = () => {
  return {
    configureIntegration: IFoodService.configureIntegration,
    getIntegrationConfig: IFoodService.getIntegrationConfig,
    syncCatalog: IFoodService.syncCatalog,
    getOrders: IFoodService.getOrders,
    getOrderById: IFoodService.getOrderById,
    confirmOrder: IFoodService.confirmOrder,
    cancelOrder: IFoodService.cancelOrder,
    dispatchOrder: IFoodService.dispatchOrder,
    getSalesSummary: IFoodService.getSalesSummary,
    getTopProducts: IFoodService.getTopProducts,
    testWebhook: IFoodService.testWebhook,
    getIntegrationStatus: IFoodService.getIntegrationStatus,
  };
};
