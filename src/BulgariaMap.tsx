import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

export interface MapEntry {
  id: string;
  type: 'client' | 'inquiry';
  city: string;
  coords: [number, number];
  status?: 'existing' | 'recent';
  addedAt?: string;
  count?: number;
}

interface BulgariaMapProps {
  data: MapEntry[];
}

export default function BulgariaMap({ data }: BulgariaMapProps) {
  return (
    <div className="w-full">
      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          80%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
      `}</style>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [25.5, 42.7], scale: 6000 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === 'Bulgaria')
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1a1a1a"
                  stroke="#3a3a3a"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
          }
        </Geographies>

        {data.map((entry, i) => {
          if (entry.type === 'client') {
            const isRecent = entry.status === 'recent';
            if (isRecent) {
              return (
                <Marker key={entry.id} coordinates={entry.coords}>
                  <circle
                    r={11}
                    fill="#E24B4A"
                    opacity={0.5}
                    style={{
                      transformOrigin: 'center',
                      animation: `ping 1.8s ${i * 0.6}s infinite`,
                    }}
                  />
                  <circle r={5} fill="#E24B4A" stroke="#fff" strokeWidth={0.5} />
                </Marker>
              );
            }
            return (
              <Marker key={entry.id} coordinates={entry.coords}>
                <circle r={4} fill="#FFC400" />
              </Marker>
            );
          }

          if (entry.type === 'inquiry') {
            const count = entry.count ?? 1;
            return (
              <Marker key={entry.id} coordinates={entry.coords}>
                <circle r={4} fill="#9a9a9a" />
                {count > 1 && (
                  <g transform="translate(7, -7)">
                    <circle r={7} fill="#0d0d0d" stroke="#fff" strokeWidth={0.5} />
                    <text
                      textAnchor="middle"
                      dy={3}
                      fontSize={9}
                      fontWeight={500}
                      fill="#fff"
                      style={{ pointerEvents: 'none' }}
                    >
                      {count}
                    </text>
                  </g>
                )}
              </Marker>
            );
          }

          return null;
        })}
      </ComposableMap>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: '#9a9a9a' }}>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FFC400' }} />
          Работят с AutoClick
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E24B4A' }} />
          Последна група
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#9a9a9a' }} />
          Активни запитвания
        </div>
      </div>
    </div>
  );
}
