import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { fetchOrdersApi, updateOrderStatusApi, deleteOrderApi } from '../../services/api';
import { OrderCard } from './OrderCard';
import { 
  ShoppingBag, 
  Calendar, 
  Clock3, 
  CheckCircle, 
  DollarSign, 
  Search, 
  RotateCw, 
  Filter, 
  Inbox,
  AlertCircle
} from 'lucide-react';

interface OrdersInboxProps {
  onNotify?: (msg: string) => void;
}

export const OrdersInbox: React.FC<OrdersInboxProps> = ({ onNotify }) => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'booking'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrdersApi(profile.id);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [profile.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatusApi(profile.id, orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (onNotify) onNotify(`Order #${updated.orderNumber} updated to "${newStatus}"`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      await deleteOrderApi(profile.id, orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (onNotify) onNotify('Order record deleted');
    } catch (err: any) {
      alert(err.message || 'Failed to delete order');
    }
  };

  // KPIs
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'new').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders
    .filter(o => o.type === 'order' && o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // Filtered List
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (typeFilter !== 'all' && order.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchItems = order.items.some(it => it.name.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchNum && !matchItems) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-artisan-950 tracking-tight">
            Orders & Bookings Inbox
          </h2>
          <p className="text-xs sm:text-sm text-artisan-600">
            Real-time customer takeout requests and table reservations captured by {businessData.botConfig.botName}.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="btn-secondary !text-xs !py-2 !px-3.5 self-start sm:self-auto flex items-center gap-1.5 shadow-warm-sm"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="card-artisan p-4 space-y-1">
          <div className="flex items-center justify-between text-artisan-500 text-xs">
            <span>Total Requests</span>
            <Inbox className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-artisan-950">{totalCount}</div>
          <p className="text-[11px] text-artisan-400">Captured in AI chat</p>
        </div>

        <div className="card-artisan p-4 space-y-1 border-amber-200 bg-amber-50/40">
          <div className="flex items-center justify-between text-amber-700 text-xs">
            <span>Pending New</span>
            <Clock3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-900">{pendingCount}</div>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting your confirmation</p>
        </div>

        <div className="card-artisan p-4 space-y-1 border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between text-emerald-700 text-xs">
            <span>Confirmed</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900">{confirmedCount}</div>
          <p className="text-[11px] text-emerald-700 font-medium">In preparation / reserved</p>
        </div>

        <div className="card-artisan p-4 space-y-1">
          <div className="flex items-center justify-between text-artisan-500 text-xs">
            <span>Order Value</span>
            <DollarSign className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-artisan-950">
            {profile.currency}{totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-artisan-400">Direct chatbot conversions</p>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="card-artisan p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-warm-sm">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'new', label: `New (${pendingCount})`, highlight: pendingCount > 0 },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? 'bg-terracotta-500 text-white shadow-warm-sm'
                  : tab.highlight
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-artisan-100/70 text-artisan-600 hover:bg-artisan-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Type Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-artisan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone..."
              className="input-artisan !py-1.5 !pl-8 !text-xs w-full"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="input-artisan !py-1.5 !text-xs"
          >
            <option value="all">All Types</option>
            <option value="order">🥐 Takeout Orders</option>
            <option value="booking">📅 Reservations</option>
          </select>

        </div>

      </div>

      {/* Orders List Feed */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-artisan-500">Loading customer orders & reservations...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card-artisan p-12 text-center space-y-3 border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-artisan-100 text-artisan-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-base text-artisan-950">No orders or bookings found</h4>
          <p className="text-xs text-artisan-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try changing your search keywords or filter filters.'
              : 'As customers order or book via the live chat widget, their details will appear here instantly.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};
