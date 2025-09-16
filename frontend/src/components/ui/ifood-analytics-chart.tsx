import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button } from './button';
import { LoadingSpinner } from './loading-spinner';
import { useIFoodStore } from '../../store/ifood';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  RefreshCw
} from 'lucide-react';

interface IFoodAnalyticsChartProps {
  className?: string;
}

export function IFoodAnalyticsChart({ className = '' }: IFoodAnalyticsChartProps) {
  const {
    salesSummary,
    // topProducts,
    getSalesSummary,
    getTopProducts
  } = useIFoodStore();

  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      await Promise.all([
        getSalesSummary({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          groupBy: 'day'
        }),
        getTopProducts({
          limit: 10
        })
      ]);
    } catch {
      toast.error('Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  // Dados mockados para demonstração (substituir pelos dados reais da API)
  const mockSalesData = [
    { date: '2024-01-01', revenue: 1200, orders: 15 },
    { date: '2024-01-02', revenue: 1800, orders: 22 },
    { date: '2024-01-03', revenue: 1500, orders: 18 },
    { date: '2024-01-04', revenue: 2200, orders: 28 },
    { date: '2024-01-05', revenue: 1900, orders: 24 },
    { date: '2024-01-06', revenue: 2500, orders: 32 },
    { date: '2024-01-07', revenue: 2100, orders: 26 },
  ];

  const mockTopProducts = [
    { name: 'Bolo de Chocolate', quantity: 45, revenue: 2250 },
    { name: 'Cupcake de Baunilha', quantity: 38, revenue: 1900 },
    { name: 'Torta de Morango', quantity: 32, revenue: 1600 },
    { name: 'Brigadeiro Gourmet', quantity: 28, revenue: 1400 },
    { name: 'Pão de Mel', quantity: 25, revenue: 1250 },
  ];

  const COLORS = ['#8B5E3C', '#D2B79C', '#EAD9C2', '#F6F0E6', '#68472B'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Carregando analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Analytics do iFood
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-3 py-1 text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Receita Total</p>
              <p className="text-xl font-bold text-green-800">
                {formatCurrency(salesSummary?.totalRevenue || 13200)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Pedidos</p>
              <p className="text-xl font-bold text-blue-800">
                {salesSummary?.totalOrders || 165}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Ticket Médio</p>
              <p className="text-xl font-bold text-purple-800">
                {formatCurrency(salesSummary?.averageOrderValue || 80)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Clientes Únicos</p>
              <p className="text-xl font-bold text-orange-800">
                {Math.floor((salesSummary?.totalOrders || 165) * 0.7)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de vendas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Receita por Dia
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Receita' : 'Pedidos'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5E3C" 
                strokeWidth={3}
                name="Receita"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de produtos mais vendidos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Produtos Mais Vendidos
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTopProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Receita' : 'Quantidade'
                ]}
              />
              <Legend />
              <Bar dataKey="quantity" fill="#8B5E3C" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de pizza - Distribuição de vendas */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Distribuição de Vendas por Produto
        </h4>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockTopProducts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent as number * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {mockTopProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
