import React from 'react';
import { ShieldCheck, MapPin, Heart, ExternalLink, School } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002B19] text-emerald-100 border-t border-[#001F12] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 font-serif font-black text-base border border-white/20">
                LAU
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base block">
                  LAU Student Carpool
                </span>
                <span className="text-[11px] text-emerald-300">
                  Campus Commuter Network • Beirut & Byblos
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md">
              A student-designed carpooling web application to facilitate shared transportation between LAU Beirut and Byblos campuses and residential student areas across Lebanon.
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-200 space-y-1">
              <div className="font-semibold text-amber-300 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Educational Prototype Notice</span>
              </div>
              <p className="text-emerald-300/80">
                This website is an educational engineering prototype built for Lebanese American University student projects and does not imply official university endorsement or administrative responsibility.
              </p>
            </div>
          </div>

          {/* Col 2: Campus Locations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              LAU Campuses
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200">
              <li className="space-y-0.5">
                <span className="font-semibold text-white block">Byblos Campus:</span>
                <span className="text-emerald-300/80 block">Blat, Jbeil, Lebanon</span>
                <span className="text-[11px] text-emerald-400">P.O. Box 36 Byblos</span>
              </li>
              <li className="space-y-0.5 pt-2 border-t border-emerald-900/60">
                <span className="font-semibold text-white block">Beirut Campus:</span>
                <span className="text-emerald-300/80 block">Chouran, Beirut, Lebanon</span>
                <span className="text-[11px] text-emerald-400">P.O. Box 13-5053 Chouran</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Commuter Safety */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Community Safety Rules
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-200/90">
              <li className="flex items-start space-x-1.5">
                <span className="text-amber-300 font-bold">•</span>
                <span>Carry valid LAU Student ID.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-amber-300 font-bold">•</span>
                <span>Coordinate via WhatsApp before departure.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-amber-300 font-bold">•</span>
                <span>Meet at well-lit, public highway footbridges or spots.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-amber-300 font-bold">•</span>
                <span>Respect carpool quiet/music preferences.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-300/70">
          <div>
            © 2026 LAU Student Carpool Project. Visual reference:{' '}
            <a
              href="https://www.lau.edu.lb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline inline-flex items-center space-x-0.5"
            >
              <span>lau.edu.lb</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="flex items-center space-x-1">
            <span>Designed with care for the LAU community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
