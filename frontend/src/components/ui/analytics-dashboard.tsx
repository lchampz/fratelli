import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from './button';
// import { LoadingSpinner } from './loading-spinner';
import { Alert } from './alert';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  // const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Dados mockados para demonstração
  const mockSalesData = [
    { date: '2024-01-01', revenue: 1200, orders: 15, products: 8 },
    { date: '2024-01-02', revenue: 1800, orders: 22, products: 12 },
    { date: '2024-01-03', revenue: 1500, orders: 18, products: 10 },
    { date: '2024-01-04', revenue: 2200, orders: 28, products: 15 },
    { date: '2024-01-05', revenue: 1900, orders: 24, products: 13 },
    { date: '2024-01-06', revenue: 2500, orders: 32, products: 18 },
    { date: '2024-01-07', revenue: 2100, orders: 26, products: 14 },
  ];

  const mockInventoryData = [
    { name: 'Farinha de Trigo', quantity: 5000, minLevel: 1000, status: 'ok' },
    { name: 'Açúcar Refinado', quantity: 3000, minLevel: 500, status: 'ok' },
    { name: 'Chocolate em Pó', quantity: 1500, minLevel: 200, status: 'ok' },
    { name: 'Ovos', quantity: 120, minLevel: 50, status: 'warning' },
    { name: 'Leite', quantity: 2000, minLevel: 300, status: 'ok' },
    { name: 'Manteiga', quantity: 2000, minLevel: 400, status: 'ok' },
    { name: 'Creme de Leite', quantity: 1500, minLevel: 200, status: 'ok' },
    { name: 'Leite Condensado', quantity: 1000, minLevel: 150, status: 'ok' },
    { name: 'Coco Ralado', quantity: 800, minLevel: 100, status: 'ok' },
    { name: 'Amêndoas', quantity: 1000, minLevel: 200, status: 'ok' },
  ];

  const mockRecipePerformance = [
    { name: 'Bolo de Chocolate', popularity: 85, profitMargin: 65 },
    { name: 'Cupcake de Baunilha', popularity: 78, profitMargin: 70 },
    { name: 'Torta de Morango', popularity: 72, profitMargin: 60 },
    { name: 'Brigadeiro Gourmet', popularity: 90, profitMargin: 80 },
    { name: 'Pão de Mel', popularity: 68, profitMargin: 55 },
  ];

  const mockCostAnalysis = [
    { category: 'Ingredientes', amount: 4500, percentage: 60 },
    { category: 'Mão de Obra', amount: 1800, percentage: 24 },
    { category: 'Embalagem', amount: 600, percentage: 8 },
    { category: 'Outros', amount: 600, percentage: 8 },
  ];

  const COLORS = ['#8B5E3C', '#D2B79C', '#EAD9C2', '#F6F0E6', '#68472B'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getInventoryStatus = (item: { quantity: number; minLevel: number }) => {
    const percentage = (item.quantity / (item.minLevel * 3)) * 100;
    if (percentage < 30) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage < 60) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'ok', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const lowStockItems = mockInventoryData.filter(item => 
    item.quantity <= item.minLevel * 1.5
  );

  const totalRevenue = mockSalesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header com controles */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analytics da Confeitaria
            </h2>
            <p className="text-gray-600">Insights e métricas para tomada de decisão</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="px-4 py-2 text-sm rounded-lg"
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <Button onClick={() => {}} variant="outline" size="sm" className="rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">+8.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageOrderValue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">+5.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Produtos em Estoque</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockInventoryData.length}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  {lowStockItems.length} baixo estoque
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de estoque baixo */}
      {lowStockItems.length > 0 && (
        <Alert variant="warning" title="Atenção: Estoque Baixo">
          <div className="space-y-1">
            {lowStockItems.map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">{item.quantity} unidades</span>
              </div>
            ))}
          </div>
        </Alert>
      )}

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de vendas */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center text-white text-sm">
              📈
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Receita e Pedidos</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <YAxis yAxisId="revenue" orientation="left" />
              <YAxis yAxisId="orders" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Receita' : 'Pedidos'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <Legend />
              <Area 
                yAxisId="revenue"
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5E3C" 
                fill="#8B5E3C"
                fillOpacity={0.3}
                name="Receita"
              />
              <Line 
                yAxisId="orders"
                type="monotone" 
                dataKey="orders" 
                stroke="#D2B79C" 
                strokeWidth={2}
                name="Pedidos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance das receitas */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm">
              🍰
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Performance das Receitas</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRecipePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="popularity" orientation="left" />
              <YAxis yAxisId="profitMargin" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === 'popularity' ? 'Popularidade' : 'Margem de Lucro'
                ]}
              />
              <Legend />
              <Bar 
                yAxisId="popularity"
                dataKey="popularity" 
                fill="#8B5E3C" 
                name="Popularidade (%)"
              />
              <Bar 
                yAxisId="profitMargin"
                dataKey="profitMargin" 
                fill="#D2B79C" 
                name="Margem de Lucro (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análise de custos e estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análise de custos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição de Custos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCostAnalysis}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {mockCostAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status do estoque */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status do Estoque
          </h3>
          <div className="space-y-3">
            {mockInventoryData.slice(0, 6).map((item) => {
              const status = getInventoryStatus(item);
              const percentage = Math.min((item.quantity / (item.minLevel * 3)) * 100, 100);
              
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.quantity} unidades
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status.status === 'critical' ? 'bg-red-500' :
                          status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
