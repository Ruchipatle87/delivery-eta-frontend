import React, { useState, useEffect } from 'react';
import { Package, MapPin, CloudRain, Truck, Clock, AlertTriangle } from 'lucide-react';

export default function App() {
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);
    return () => document.head.removeChild(link1);
  }, []);

  const [form, setForm] = useState({
    delivery_person_age: 28,
    delivery_person_rating: 4.5,
    weather: 'Sunny',
    traffic: 'Medium',
    vehicle_condition: 1,
    order_type: 'Snack',
    vehicle_type: 'motorcycle',
    multiple_deliveries: 1,
    festival: 'No',
    city: 'Urban',
    distance_km: 5.2,
    order_day_of_week: 2,
    order_hour: 19,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherOpts = ['Sunny', 'Cloudy', 'Fog', 'Windy', 'Stormy', 'Sandstorms'];
  const trafficOpts = ['Low', 'Medium', 'High', 'Jam'];
  const orderOpts = ['Snack', 'Meal', 'Drinks', 'Buffet'];
  const vehicleOpts = ['motorcycle', 'scooter', 'electric_scooter', 'bicycle'];
  const cityOpts = ['Urban', 'Metropolitian', 'Semi-Urban'];
  const festivalOpts = ['No', 'Yes'];

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Request failed');
      }
      const data = await res.json();
      setResult(data.predicted_time_minutes);
    } catch (e) {
      setError(
        typeof e.message === 'string'
          ? e.message
          : 'Could not reach the dispatch model. Is the FastAPI server running on port 8000?'
      );
    } finally {
      setLoading(false);
    }
  };

  const factorScore = () => {
    const trafficWeight = { Low: 0.15, Medium: 0.4, High: 0.75, Jam: 1 }[form.traffic] ?? 0.4;
    const weatherWeight = { Sunny: 0.1, Cloudy: 0.2, Windy: 0.35, Fog: 0.55, Stormy: 0.8, Sandstorms: 0.9 }[form.weather] ?? 0.2;
    const distWeight = Math.min(form.distance_km / 20, 1);
    return [
      { label: 'Road traffic', value: trafficWeight, icon: Truck },
      { label: 'Distance', value: distWeight, icon: MapPin },
      { label: 'Weather', value: weatherWeight, icon: CloudRain },
    ];
  };

  const dialMax = 60;
  const dialPct = result ? Math.min(result / dialMax, 1) : 0;
  const circumference = 2 * Math.PI * 88;
  const dashOffset = circumference * (1 - dialPct);

  const fieldCls = "w-full bg-[#0B0D10] border border-[#232730] rounded-md px-3 py-2 text-sm text-[#E9EAEC] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D] focus:border-[#FF8A3D] transition-colors";
  const labelCls = "block text-[10px] uppercase tracking-widest text-[#6B7280] mb-1.5 font-medium";

  return (
    <div className="min-h-screen w-full bg-[#0B0D10] text-[#E9EAEC] p-4 md:p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-[#232730] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">Dispatch Console</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mt-1 tracking-tight" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Delivery ETA Predictor
            </h1>
          </div>
          <Package className="w-7 h-7 text-[#56D9C7] hidden md:block" strokeWidth={1.5} />
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-[#14171C] border border-[#232730] rounded-lg p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px flex-1 bg-[#232730]" />
              <span className="text-xs uppercase tracking-widest text-[#6B7280]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Order Ticket</span>
              <div className="h-px flex-1 bg-[#232730]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Distance (km)</label>
                <input type="number" step="0.1" className={fieldCls} value={form.distance_km} onChange={e => update('distance_km', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Order Hour (0-23)</label>
                <input type="number" min="0" max="23" className={fieldCls} value={form.order_hour} onChange={e => update('order_hour', parseInt(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Weather</label>
                <select className={fieldCls} value={form.weather} onChange={e => update('weather', e.target.value)}>
                  {weatherOpts.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Road Traffic</label>
                <select className={fieldCls} value={form.traffic} onChange={e => update('traffic', e.target.value)}>
                  {trafficOpts.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Order Type</label>
                <select className={fieldCls} value={form.order_type} onChange={e => update('order_type', e.target.value)}>
                  {orderOpts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Vehicle Type</label>
                <select className={fieldCls} value={form.vehicle_type} onChange={e => update('vehicle_type', e.target.value)}>
                  {vehicleOpts.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>City Type</label>
                <select className={fieldCls} value={form.city} onChange={e => update('city', e.target.value)}>
                  {cityOpts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Festival Day</label>
                <select className={fieldCls} value={form.festival} onChange={e => update('festival', e.target.value)}>
                  {festivalOpts.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Delivery Person Age</label>
                <input type="number" className={fieldCls} value={form.delivery_person_age} onChange={e => update('delivery_person_age', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Rider Rating</label>
                <input type="number" step="0.1" min="1" max="5" className={fieldCls} value={form.delivery_person_rating} onChange={e => update('delivery_person_rating', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Vehicle Condition (0-3)</label>
                <input type="number" min="0" max="3" className={fieldCls} value={form.vehicle_condition} onChange={e => update('vehicle_condition', parseInt(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Multiple Deliveries</label>
                <input type="number" min="0" max="3" className={fieldCls} value={form.multiple_deliveries} onChange={e => update('multiple_deliveries', parseFloat(e.target.value))} />
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full mt-6 bg-[#FF8A3D] text-[#0B0D10] font-semibold py-2.5 rounded-md text-sm uppercase tracking-wider hover:bg-[#ffa05f] transition-colors disabled:opacity-50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {loading ? 'Dispatching…' : 'Estimate Delivery Time'}
            </button>

            {error && (
              <div className="mt-3 flex items-start gap-2 bg-[#1F1612] border border-[#3D2A1A] text-[#FF8A3D] text-xs rounded-md p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-[#14171C] border border-[#232730] rounded-lg p-5 md:p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 self-stretch">
              <Clock className="w-3.5 h-3.5 text-[#56D9C7]" />
              <span className="text-xs uppercase tracking-widest text-[#6B7280]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Predicted ETA</span>
            </div>

            <div className="relative w-52 h-52 my-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="none" stroke="#232730" strokeWidth="10" />
                <circle cx="100" cy="100" r="88" fill="none" stroke={result ? '#FF8A3D' : '#232730'} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace", color: result ? '#FF8A3D' : '#6B7280' }}>
                  {result ? result.toFixed(0) : '--'}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#6B7280] mt-1">minutes</span>
              </div>
            </div>

            <div className="w-full mt-2">
              <div className="text-[10px] uppercase tracking-widest text-[#6B7280] mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Key Factors</div>
              <div className="space-y-3">
                {factorScore().map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3 text-[#56D9C7]" />
                        <span className="text-xs text-[#9CA3AF]">{label}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-[#0B0D10] rounded-full overflow-hidden">
                      <div className="h-full bg-[#56D9C7] rounded-full transition-all duration-700" style={{ width: `${value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#6B7280] mt-6">
          Powered by a self-trained Random Forest model · SHAP-validated feature importance
        </p>
      </div>
    </div>
  );
}