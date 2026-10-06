import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity,
  FileText,
  Filter,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { MaintenanceWorkOrder } from '../../types/railway';

export const TrainMaintenance: React.FC = () => {
  const { workOrders, trains, createWorkOrder, updateWorkOrderStatus } = useRailway();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Work order form state
  const [trainId, setTrainId] = useState(trains[0]?.id || '');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintenanceWorkOrder['priority']>('HIGH');
  const [component, setComponent] = useState<MaintenanceWorkOrder['component']>('Brakes');
  const [engineer, setEngineer] = useState('Dr. Rameshwar Nath');

  const filteredOrders = workOrders.filter((w) => filterPriority === 'ALL' || w.priority === filterPriority);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = trains.find((tr) => tr.id === trainId);
    if (!t || !issue) return;

    createWorkOrder({
      trainId: t.id,
      trainNumber: t.number,
      issue,
      priority,
      component,
      assignedEngineer: engineer,
    });

    setIsModalOpen(false);
    setIssue('');
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Rolling Stock Maintenance & Depot Work Orders</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Preventive inspections (Trip, PM, IOH, POH) and Carriage & Wagon (C&W) work order tracking for coaching rakes and locos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* Fleet Maintenance Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Under Active Overhaul</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {trains.filter((t) => t.status === 'Under Maintenance').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pit Line 8 / Coaching Depot</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Inspections Due</div>
          <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
            {trains.filter((t) => t.maintenanceStatus === 'Inspection Due').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trip brake test required</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Open Work Orders</div>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
            {workOrders.filter((w) => w.status !== 'COMPLETED').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Depot mechanical team assigned</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Depot Safety Rating</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>99.2% COMPLIANT</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Zero hot-axle incidents</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <span className="text-xs font-semibold text-slate-300">Work Orders List ({filteredOrders.length})</span>
        <div className="flex items-center gap-1 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterPriority === p
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Work Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredOrders.map((wo) => (
          <div
            key={wo.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-lg hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">{wo.id}</span>
                <div className="text-sm font-bold text-amber-300 font-mono">
                  Train {wo.trainNumber} · {wo.component}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  wo.priority === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : wo.priority === 'HIGH'
                    ? 'bg-orange-950 text-orange-300 border border-orange-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {wo.priority}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">{wo.issue}</p>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Engineer:</span>
                <span className="text-slate-200 font-medium">{wo.assignedEngineer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Completion:</span>
                <span className="font-mono text-slate-300">{wo.expectedCompletion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remarks:</span>
                <span className="text-slate-300 truncate max-w-[200px]">{wo.remarks}</span>
              </div>
            </div>

            {/* Status change actions */}
            <div className="flex items-center justify-between pt-1">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  wo.status === 'COMPLETED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : wo.status === 'IN_PROGRESS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {wo.status}
              </span>

              {wo.status !== 'COMPLETED' && (
                <button
                  onClick={() => updateWorkOrderStatus(wo.id, 'COMPLETED')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Issue Maintenance Work Order</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Train</label>
                <select
                  value={trainId}
                  onChange={(e) => setTrainId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                >
                  {trains.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} - {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Detail the mechanical or electrical fault..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Subsystem Component</label>
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    <option value="Brakes">Brakes</option>
                    <option value="Engine">Engine / Traction</option>
                    <option value="Wheels">Wheels / Bogies</option>
                    <option value="Electrical">Electrical / Chopper</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Couplers">CBC Couplers</option>
                    <option value="OHE Pantograph">OHE Pantograph</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
