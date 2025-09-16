import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { LoadingSpinner } from './loading-spinner';
// import { Alert } from './alert';
import { useIFoodStore } from '../../store/ifood';
import { toast } from 'sonner';
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  MapPin, 
  User, 
  CreditCard,
  RefreshCw
} from 'lucide-react';
// import type { IFoodOrder } from '../../types/ifood';

interface IFoodOrdersListProps {
  className?: string;
}

export function IFoodOrdersList({ className = '' }: IFoodOrdersListProps) {
  const {
    orders,
    ordersLoading,
    getOrders,
    confirmOrder,
    cancelOrder,
    dispatchOrder
  } = useIFoodStore();

  // const [selectedOrder, setSelectedOrder] = useState<IFoodOrder | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await getOrders({ limit: 50 });
    } catch {
      toast.error('Erro ao carregar pedidos');
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await confirmOrder(orderId, 30); // 30 minutos estimados
      toast.success('Pedido confirmado!');
      await loadOrders();
    } catch {
      toast.error('Erro ao confirmar pedido');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await cancelOrder(orderId, 'Produto indisponível');
      toast.success('Pedido cancelado');
      await loadOrders();
    } catch {
      toast.error('Erro ao cancelar pedido');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDispatchOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await dispatchOrder(orderId);
      toast.success('Pedido despachado!');
      await loadOrders();
    } catch {
      toast.error('Erro ao despachar pedido');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLACED':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'DISPATCHED':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'Novo Pedido';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'DISPATCHED':
        return 'Despachado';
      case 'DELIVERED':
        return 'Entregue';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'DISPATCHED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (ordersLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Carregando pedidos...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Os pedidos do iFood aparecerão aqui quando chegarem.
          </p>
          <Button onClick={loadOrders} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Pedidos do iFood
          </h3>
          <Button onClick={loadOrders} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Pedido #{order.displayId}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.customer.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.delivery.address.street}, {order.delivery.address.number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.delivery.address.neighborhood}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total.orderTotal)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.payments[0]?.method}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Itens do pedido:</h5>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.status === 'PLACED' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleConfirmOrder(order.id)}
                  disabled={actionLoading === order.id}
                  size="sm"
                  className="flex-1"
                >
                  {actionLoading === order.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Confirmar'
                  )}
                </Button>
                <Button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={actionLoading === order.id}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            )}

            {order.status === 'CONFIRMED' && (
              <Button
                onClick={() => handleDispatchOrder(order.id)}
                disabled={actionLoading === order.id}
                size="sm"
                className="w-full"
              >
                {actionLoading === order.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Marcar como Despachado'
                )}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
