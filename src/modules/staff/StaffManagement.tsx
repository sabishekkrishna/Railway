import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Shield,
  Briefcase,
  Clock,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Staff } from '../../types/railway';

export const StaffManagement: React.FC = () => {
  const { staff } = useRailway();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['ALL', 'Traffic / Operating', 'Mechanical', 'Electrical', 'Civil / Track', 'Security / RPF', 'Commercial', 'Safety'];

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Station Operations & Engineering Staff Roster</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control directory across Station Superintendents, Traffic Controllers, Loco Pilots, RPF Inspectors, and C&W Engineers.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          TOTAL ACTIVE ROSTER: {staff.length} PERSONNEL
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by employee ID, name, or role..."
            className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                deptFilter === dept
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">{member.employeeId}</span>
                <h4 className="font-bold text-sm text-slate-100">{member.name}</h4>
                <div className="text-xs font-medium text-slate-300">{member.role}</div>
              </div>
              <span
                className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                  member.available
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {member.available ? 'ON DUTY' : 'ASSIGNED'}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{member.department} · {member.qualification}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Shift: {member.shift}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-mono text-slate-300">{member.phone}</span>
              </div>
            </div>

            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Current Assignment:</span>
              <span>{member.currentAssignment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
