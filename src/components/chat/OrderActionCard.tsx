import React, { useState } from 'react';
import { InteractiveOrderPayload, Order, OrderItem, BookingDetails } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { submitOrderApi } from '../../services/api';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  User as UserIcon,
  ChevronRight,
  Banknote,
  QrCode
} from 'lucide-react';

interface OrderActionCardProps {
  payload: InteractiveOrderPayload;
  completedOrder?: Order;
  onOrderCompleted: (order: Order) => void;
}

export const OrderActionCard: React.FC<OrderActionCardProps> = ({
  payload,
  completedOrder,
  onOrderCompleted
}) => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  const isBooking = payload.type === 'booking';

  // Order Items State
  const [items, setItems] = useState<OrderItem[]>(payload.items || []);
  
  // Booking State
  const [booking, setBooking] = useState<BookingDetails>(payload.bookingDetails || {
    partySize: 2,
    date: 'Tomorrow',
    time: '7:00 PM',
    areaPreference: 'Outdoor Patio'
  });

  // Contact & Payment Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'UPI' | 'Cash'>('UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'contact'>('details');

  const totalAmount = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const updateQuantity = (idx: number, delta: number) => {
    setItems(prev => {
      const copy = [...prev];
      const newQty = copy[idx].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== idx);
      }
      copy[idx] = { ...copy[idx], quantity: newQty };
      return copy;
    });
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const created = await submitOrderApi(profile.id, {
        type: payload.type,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        paymentPreference: isBooking ? 'N/A' : paymentPreference,
        items: isBooking ? [] : items,
        bookingDetails: isBooking ? booking : null,
        totalAmount: isBooking ? 0 : totalAmount,
        specialInstructions: specialInstructions.trim()
      });
      onOrderCompleted(created);
    } catch (err: any) {
      alert(err.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already confirmed, render the green receipt card
  if (completedOrder) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300/80 shadow-warm-md text-artisan-950 font-sans space-y-3 animate-scale-up">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                {completedOrder.type === 'booking' ? 'Booking Requested' : 'Order Placed'}
              </span>
              <h4 className="font-serif font-bold text-sm text-emerald-950 leading-tight">
                #{completedOrder.orderNumber}
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
            Pending Confirmation
          </span>
        </div>

        <div className="text-xs space-y-1.5 text-emerald-900">
          <p>
            {completedOrder.type === 'booking' ? (
              <>Thank you, <strong>{completedOrder.customerName}</strong>! Your reservation request has been transmitted directly to <strong>{profile.name}</strong>.</>
            ) : (
              <>Your order has been sent to <strong>{profile.name}</strong> — Payment: <strong>{completedOrder.paymentPreference || 'UPI'}</strong>, pay at pickup.</>
            )}
          </p>
          <p className="text-[11px] text-emerald-800">
            Our host will review and call or text your number at <strong>{completedOrder.customerPhone}</strong> shortly.
          </p>
        </div>

        {completedOrder.type === 'order' && completedOrder.items.length > 0 && (
          <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-200 text-xs space-y-1.5">
            {completedOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{it.quantity}x {it.name}</span>
                <span className="font-bold text-emerald-900">{profile.currency}{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-1.5 mt-1 border-t border-emerald-200/80 flex justify-between font-bold text-emerald-950">
              <span>Total Amount</span>
              <span>{profile.currency}{completedOrder.totalAmount.toFixed(2)}</span>
            </div>
            {completedOrder.paymentPreference && completedOrder.paymentPreference !== 'N/A' && (
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-emerald-200/60 text-emerald-800 font-medium">
                <span>Payment Preference:</span>
                <span className="font-bold">
                  {completedOrder.paymentPreference === 'Cash' ? '💵 Cash' : '📱 UPI'} (Pay at pickup)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 rounded-2xl bg-white border-2 border-terracotta-400 shadow-warm-lg text-artisan-950 font-sans space-y-3 animate-slide-up w-full max-w-full sm:max-w-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-artisan-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-warm-sm">
            {isBooking ? <Calendar className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
              {isBooking ? 'Table / Service Booking' : 'Curbside & Takeout Order'}
            </span>
            <h4 className="font-serif font-bold text-sm text-artisan-950">
              {isBooking ? `Reserve at ${profile.name}` : 'Confirm Your Items'}
            </h4>
          </div>
        </div>

        <span className="text-[10px] text-artisan-500 font-semibold bg-artisan-100 px-2 py-0.5 rounded-full">
          Step {step === 'details' ? '1/2' : '2/2'}
        </span>
      </div>

      {/* Step 1: Details Review */}
      {step === 'details' && (
        <div className="space-y-3">
          
          {/* Order Items List */}
          {!isBooking ? (
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-artisan-400 italic">No items selected yet.</p>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-artisan-50 p-2.5 rounded-xl border border-artisan-200/70 text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-serif font-bold text-artisan-950 truncate">{it.name}</div>
                      <div className="text-[10px] text-artisan-500">{profile.currency}{it.price.toFixed(2)} each</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white border border-artisan-300 rounded-lg overflow-hidden shadow-warm-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-1.5 text-artisan-600 hover:bg-artisan-100 touch-target flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="p-1.5 text-artisan-600 hover:bg-artisan-100 touch-target flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold font-mono text-terracotta-700 min-w-[50px] text-right">
                        {profile.currency}{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {items.length > 0 && (
                <div className="pt-2 border-t border-artisan-200/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-artisan-700">Estimated Total:</span>
                  <span className="font-serif text-base text-terracotta-700">{profile.currency}{totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          ) : (
            /* Booking Details Selector */
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-artisan-600 flex items-center gap-1">
                    <Users className="w-3 h-3 text-terracotta-500" />
                    <span>Party Size</span>
                  </label>
                  <select
                    value={booking.partySize}
                    onChange={(e) => setBooking(prev => ({ ...prev, partySize: parseInt(e.target.value, 10) }))}
                    className="input-artisan !py-1 !text-xs w-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-artisan-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-terracotta-500" />
                    <span>Time</span>
                  </label>
                  <select
                    value={booking.time}
                    onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                    className="input-artisan !py-1 !text-xs w-full"
                  >
                    {['08:00 AM', '10:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '05:00 PM', '06:30 PM', '07:00 PM', '08:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-artisan-600">
                  Day / Date
                </label>
                <input
                  type="text"
                  value={booking.date}
                  onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g. Tomorrow (Saturday)"
                  className="input-artisan !py-1 !text-xs w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-artisan-600">
                  Seating Area Preference
                </label>
                <select
                  value={booking.areaPreference}
                  onChange={(e) => setBooking(prev => ({ ...prev, areaPreference: e.target.value }))}
                  className="input-artisan !py-1 !text-xs w-full"
                >
                  <option value="Botanical Outdoor Patio">Botanical Outdoor Patio (Dog Friendly)</option>
                  <option value="Sunlit Window Banquette">Sunlit Window Banquette</option>
                  <option value="Main Dining Room">Main Dining Room</option>
                  <option value="Espresso Tasting Counter">Espresso Tasting Counter</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep('contact')}
            disabled={!isBooking && items.length === 0}
            className="btn-primary !w-full !text-xs !py-2 shadow-warm-sm flex items-center justify-center gap-1 mt-1"
          >
            <span>Next: Enter Contact Info</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Step 2: Contact Form */}
      {step === 'contact' && (
        <form onSubmit={handleConfirmSubmit} className="space-y-2.5 text-xs">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-artisan-600 flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-terracotta-500" />
              <span>Your Name *</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sophie Laurent"
              className="input-artisan !py-1 !text-xs w-full"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-artisan-600 flex items-center gap-1">
              <Phone className="w-3 h-3 text-terracotta-500" />
              <span>Phone Number * (for SMS confirmation)</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. (555) 382-7491"
              className="input-artisan !py-1 !text-xs w-full"
            />
          </div>

          {/* Payment Preference Selector (Takeout Orders) */}
          {!isBooking && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase text-artisan-600 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Banknote className="w-3 h-3 text-terracotta-500" />
                  <span>Payment Method (Pay at Pickup) *</span>
                </span>
                <span className="text-[10px] text-artisan-400 font-normal">Stated preference</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentPreference('UPI')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-target ${
                    paymentPreference === 'UPI'
                      ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-warm-sm'
                      : 'bg-artisan-50 text-artisan-800 border-artisan-200 hover:bg-artisan-100'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 shrink-0" />
                  <span>UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentPreference('Cash')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-target ${
                    paymentPreference === 'Cash'
                      ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-warm-sm'
                      : 'bg-artisan-50 text-artisan-800 border-artisan-200 hover:bg-artisan-100'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5 shrink-0" />
                  <span>Cash on Pickup</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-artisan-600">
              Special Instructions / Dietary Notes
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Need gluten-free packaging / Extra napkins"
              className="input-artisan !py-1 !text-xs w-full"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-artisan-100">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="btn-secondary !text-xs !py-2 !px-3 touch-target"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()}
              className="btn-primary flex-1 !text-xs !py-2 shadow-warm-sm flex items-center justify-center gap-1 touch-target"
            >
              <Sparkles className="w-3.5 h-3.5 text-honey-300" />
              <span>{isSubmitting ? 'Sending...' : isBooking ? 'Confirm Booking Request' : 'Place Order Now'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
