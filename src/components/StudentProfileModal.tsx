import React, { useState } from 'react';
import {
  X,
  User,
  School,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Car,
  RotateCcw,
  Check,
  Star,
  Award
} from 'lucide-react';
import type { Campus, Student } from '../types/carpool.ts';

interface StudentProfileModalProps {
  student: Student;
  allStudents: Student[];
  onClose: () => void;
  onUpdateStudent: (updated: Student) => void;
  onSwitchStudent: (student: Student) => void;
  onResetData: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  allStudents,
  onClose,
  onUpdateStudent,
  onSwitchStudent,
  onResetData,
}) => {
  const [name, setName] = useState(student.name);
  const [campus, setCampus] = useState<Campus>(student.campus);
  const [major, setMajor] = useState(student.major);
  const [year, setYear] = useState(student.year);
  const [phone, setPhone] = useState(student.phone);
  const [email, setEmail] = useState(student.email);
  const [whatsapp, setWhatsapp] = useState(student.whatsapp);
  const [carModel, setCarModel] = useState(student.carModel || '');
  const [carColor, setCarColor] = useState(student.carColor || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      name: name.trim(),
      campus,
      major: major.trim(),
      year: year.trim(),
      phone: phone.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      carModel: carModel.trim() || undefined,
      carColor: carColor.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#004D30] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close profile dialog"
            className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-emerald-900/50 hover:bg-emerald-900 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-[#004D30] font-bold text-lg flex items-center justify-center shadow-sm">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2
                id="student-profile-title"
                className="text-lg sm:text-xl font-serif font-bold text-white"
              >
                LAU Student Profile
              </h2>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-200 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified Community Account • {student.campus} Campus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Persona Switcher for Prototype Evaluation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Switch Test Student Persona
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSwitchStudent(s);
                    setName(s.name);
                    setCampus(s.campus);
                    setMajor(s.major);
                    setYear(s.year);
                    setPhone(s.phone);
                    setEmail(s.email);
                    setWhatsapp(s.whatsapp);
                    setCarModel(s.carModel || '');
                    setCarColor(s.carColor || '');
                  }}
                  className={`p-2 rounded-lg text-left border text-xs transition-all ${
                    s.id === student.id
                      ? 'bg-[#004D30] text-white border-[#004D30] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="truncate font-semibold">{s.name}</p>
                  <p className="text-[10px] opacity-80">{s.campus} • {s.major.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Driver Reliability Score Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-bold text-slate-900">
                    {(student.rating || 4.9).toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">
                    • Driver Reliability Score
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {student.reviewCount || student.reviews?.length || 14} student ratings • {student.onTimeRate || 98}% on-time departure rate
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Campus *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCampus('Byblos')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      campus === 'Byblos'
                        ? 'bg-[#004D30] text-white border-[#004D30]'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Byblos
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampus('Beirut')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      campus === 'Beirut'
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Beirut
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Major / Field of Study
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LAU Student Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Driver Vehicle Info (If you offer rides)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Car model (e.g. Honda Civic)"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
                <input
                  type="text"
                  placeholder="Color (e.g. Silver)"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset prototype rides and requests to initial sample data?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004D30] text-white hover:bg-[#003822] text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
