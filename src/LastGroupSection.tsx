import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import BulgariaMap, { MapEntry } from './BulgariaMap';
import mapData from './mapData.json';

const data = mapData as MapEntry[];

function relativeTime(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'днес';
  if (diffDays === 1) return 'преди 1 ден';
  if (diffDays < 7) return `преди ${diffDays} дни`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return 'преди 1 седмица';
  if (weeks < 4) return `преди ${weeks} седмици`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return 'преди 1 месец';
  return `преди ${months} месеца`;
}

export default function LastGroupSection() {
  const clients = data.filter(d => d.type === 'client');
  const inquiries = data.filter(d => d.type === 'inquiry');

  const totalInquiryCount = inquiries.reduce((sum, i) => sum + (i.count ?? 1), 0);

  const recentEntries = [...clients]
    .filter(d => d.addedAt)
    .sort((a, b) => new Date(b.addedAt!).getTime() - new Date(a.addedAt!).getTime())
    .slice(0, 3);

  const topInquiries = [...inquiries]
    .sort((a, b) => (b.count ?? 1) - (a.count ?? 1))
    .slice(0, 3);

  const scrollToClosing = () => {
    document.getElementById('zashto-zatvariame')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="container mx-auto max-w-5xl">

        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: '#1a1a00', color: '#FFC400', border: '1px solid #3a3000' }}>
            <MapPin className="w-3.5 h-3.5" />
            Последната група
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-black text-white text-center mb-4">
          Картата се пълни.
        </h2>
        <p className="text-center text-base mb-12 max-w-xl mx-auto" style={{ color: '#9a9a9a' }}>
          Жълтото — фирми, които вече работят с AutoClick. Червеното — последна група преди 18.08. Сивото — градове с активни запитвания.
        </p>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT — Map ~60% */}
          <div className="lg:w-3/5">
            <BulgariaMap data={data} />
          </div>

          {/* RIGHT — Info panel ~40% */}
          <div className="lg:w-2/5 flex flex-col gap-5">

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
                <p className="text-xs mb-2" style={{ color: '#6a6a6a' }}>Активни клиенти</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-white leading-none">{clients.length}</span>
                  <span className="text-sm pb-0.5" style={{ color: '#9a9a9a' }}>фирми</span>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
                <p className="text-xs mb-2" style={{ color: '#6a6a6a' }}>Активни запитвания</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-white leading-none">{totalInquiryCount}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#6a6a6a' }}>от {inquiries.length} града</p>
              </div>
            </div>

            {/* Recent clients */}
            <div>
              <p className="text-xs mb-3" style={{ color: '#6a6a6a' }}>Последни:</p>
              <div className="flex flex-col gap-2">
                {recentEntries.map(entry => {
                  const isRecent = entry.status === 'recent';
                  const borderColor = isRecent ? '#E24B4A' : '#FFC400';
                  const iconColor = isRecent ? '#E24B4A' : '#FFC400';
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 pl-3 py-2 rounded-r-lg"
                      style={{
                        borderLeft: `2px solid ${borderColor}`,
                        backgroundColor: '#161616'
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: iconColor }} />
                      <div>
                        <p className="text-sm text-white font-medium leading-tight">Пътна помощ · {entry.city}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6a6a6a' }}>
                          {entry.addedAt ? relativeTime(entry.addedAt) : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top inquiry cities */}
            <div>
              <p className="text-xs mb-3" style={{ color: '#6a6a6a' }}>Топ градове по запитвания:</p>
              <div className="flex flex-col gap-2">
                {topInquiries.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 pl-3 py-2 rounded-r-lg"
                    style={{
                      borderLeft: '2px solid #6a6a6a',
                      backgroundColor: '#161616'
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#9a9a9a' }} />
                    <div>
                      <p className="text-sm text-white font-medium leading-tight">{entry.city}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6a6a6a' }}>
                        {entry.count === 1 ? '1 запитване' : `${entry.count} запитвания`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #2a2a2a' }}>
          <p className="text-sm mb-6" style={{ color: '#9a9a9a' }}>
            Интересът расте. След 18.08 цената става за клиника.
          </p>
          <button
            onClick={scrollToClosing}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#FFC400', color: '#0d0d0d' }}
          >
            Влез в последната група
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
