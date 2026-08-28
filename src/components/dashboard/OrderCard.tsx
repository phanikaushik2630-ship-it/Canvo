import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  CheckCircle, 
  Clock3, 
  CheckCheck, 
  XCircle, 
  Trash2, 
  ChevronDown,
  MessageSquare,
  Banknote,
  QrCode
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onDelete
}) => {
  const { businessData } = useBusiness();
  const { profile } = businessData;
  const [updating, setUpdating] = useState(false);

  const isBooking = order.type === 'booking';

  const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; border: string; icon: any }> = {
    new: {
      label: 'New (Pending)',
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: Clock3
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: CheckCircle
    },
    completed: {
      label: 'Completed',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: CheckCheck
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: XCircle
    }
  };

  const currentStatus = statusConfig[order.status] || statusConfig.new;
  const StatusIcon = currentStatus.icon;

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as OrderStatus;
    if (nextStatus === order.status || updating) return;
    try {
      setUpdating(true);
      await onStatusChange(order.id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`card-artisan p-5 sm:p-6 transition-all duration-200 border-l-4 ${
      order.status === 'new'
        ? 'border-l-amber-500 shadow-warm-md'
        : order.status === 'confirmed'
        ? 'border-l-emerald-500'
        : order.status === 'completed'
        ? 'border-l-blue-400 opacity-90'
        : 'border-l-rose-400 opacity-75'
    }`}>
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-artisan-100">
        
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isBooking ? 'bg-sage-100 text-sage-800' : 'bg-terracotta-100 text-terracotta-800'
          }`}>
            {isBooking ? <Calendar className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif font-bold text-base text-artisan-950">
                #{order.orderNumber}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isBooking ? 'bg-sage-100 text-sage-800' : 'bg-terracotta-100 text-terracotta-800'
              }`}>
                {isBooking ? 'Table Booking' : 'Curbside / Takeout'}
              </span>
              {!isBooking && order.paymentPreference && order.paymentPreference !== 'N/A' && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  order.paymentPreference === 'Cash'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-purple-100 text-purple-800 border border-purple-300'
                }`}>
                  {order.paymentPreference === 'Cash' ? <Banknote className="w-3 h-3" /> : <QrCode className="w-3 h-3" />}
                  <span>{order.paymentPreference}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-artisan-400">{formattedDate}</span>
          </div>
        </div>

        {/* Status Dropdown Controller */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={order.status}
              disabled={updating}
              onChange={handleStatusSelect}
              className={`appearance-none text-xs font-bold pl-7 pr-8 py-1.5 rounded-xl border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} focus:outline-none cursor-pointer`}
            >
              <option value="new">New (Pending)</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <StatusIcon className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${currentStatus.text} pointer-events-none`} />
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 ${currentStatus.text} pointer-events-none`} />
          </div>

          <button
            onClick={() => onDelete(order.id)}
            title="Delete order record"
            className="p-1.5 text-artisan-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Content Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3.5 text-xs text-artisan-700">
        
        {/* Customer Contact */}
        <div className="space-y-1.5 bg-artisan-50 p-3 rounded-2xl border border-artisan-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-artisan-400">Customer Info</div>
          <div className="font-serif font-bold text-sm text-artisan-950 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-terracotta-600" />
            <span>{order.customerName}</span>
          </div>
          <a
            href={`tel:${order.customerPhone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 text-terracotta-600 hover:text-terracotta-800 font-semibold pt-0.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{order.customerPhone}</span>
          </a>
        </div>

        {/* Order Items or Booking Parameters */}
        <div className="md:col-span-2 space-y-2">
          
          {isBooking && order.bookingDetails ? (
            <div className="bg-sage-50/70 p-3 rounded-2xl border border-sage-200/80 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sage-800">Reservation Details</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-artisan-500 block text-[10px]">Party Size</span>
                  <strong className="text-artisan-950 font-serif text-sm">{order.bookingDetails.partySize} Guests</strong>
                </div>
                <div>
                  <span className="text-artisan-500 block text-[10px]">Date</span>
                  <strong className="text-artisan-950 font-serif text-sm">{order.bookingDetails.date}</strong>
                </div>
                <div>
                  <span className="text-artisan-500 block text-[10px]">Time</span>
                  <strong className="text-artisan-950 font-serif text-sm">{order.bookingDetails.time}</strong>
                </div>
              </div>
              {order.bookingDetails.areaPreference && (
                <div className="pt-1.5 border-t border-sage-200/60 text-[11px] text-sage-900">
                  <span>Preference: <strong>{order.bookingDetails.areaPreference}</strong></span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-artisan-50/80 p-3 rounded-2xl border border-artisan-200/80 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-artisan-500 flex justify-between">
                <span>Items Ordered</span>
                <span>Subtotal</span>
              </div>
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-artisan-900">
                    <strong className="font-mono text-terracotta-700">{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="font-mono text-artisan-700 font-semibold">
                    {profile.currency}{(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-artisan-200 flex justify-between items-center text-xs font-bold text-artisan-950">
                <span>Total Amount</span>
                <span className="font-serif text-base text-terracotta-700">
                  {profile.currency}{order.totalAmount.toFixed(2)}
                </span>
              </div>
              {order.paymentPreference && order.paymentPreference !== 'N/A' && (
                <div className="pt-1 flex justify-between items-center text-[11px] text-artisan-500 font-medium border-t border-artisan-100">
                  <span>Payment Method:</span>
                  <span className="font-bold text-artisan-800 flex items-center gap-1">
                    {order.paymentPreference === 'Cash' ? <Banknote className="w-3 h-3 text-emerald-600" /> : <QrCode className="w-3 h-3 text-purple-600" />}
                    <span>{order.paymentPreference} (Pay at pickup)</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Special Instructions Note */}
          {order.specialInstructions && (
            <div className="text-[11px] text-artisan-600 bg-amber-50/70 border border-amber-200/80 px-3 py-1.5 rounded-xl">
              <strong>Note:</strong> {order.specialInstructions}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
