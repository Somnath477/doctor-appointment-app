import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CalendarIcon, X, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const doctorsList = Array.from({ length: 50 }, (_, i) => `Dr. ${['Arjun', 'Anita', 'Ravi', 'Pooja', 'Amit', 'Sneha', 'Kiran', 'Meena', 'Raj', 'Simran'][i % 10]} ${['Sharma', 'Verma', 'Patel', 'Reddy', 'Gupta'][i % 5]}`);

const categories = [
  { name: 'Emergency', color: 'bg-blue-400' },
  { name: 'Examination', color: 'bg-yellow-400' },
  { name: 'Consultation', color: 'bg-purple-400' },
  { name: 'Routine Checkup', color: 'bg-red-400' },
  { name: 'Sick Visit', color: 'bg-sky-400' },
];

export default function AppointmentApp() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', time: '', doctor: '', category: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setForm({ name: '', time: '', doctor: '', category: '' });
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleAddOrUpdateAppointment = () => {
    if (!form.name || !form.time || !form.doctor || !form.category) return;
    const newAppt = { ...form, date: selectedDate };
    if (editIndex !== null) {
      const updated = [...appointments];
      updated[editIndex] = newAppt;
      setAppointments(updated);
      toast.success('Appointment updated');
    } else {
      setAppointments([...appointments, newAppt]);
      toast.success('Appointment booked');
    }
    setForm({ name: '', time: '', doctor: '', category: '' });
    setEditIndex(null);
    setModalOpen(false);
  };

  const handleEdit = (appt, index) => {
    setSelectedDate(appt.date);
    setForm({ name: appt.name, time: appt.time, doctor: appt.doctor, category: appt.category });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    const updated = [...appointments];
    updated.splice(index, 1);
    setAppointments(updated);
    toast.success('Appointment deleted');
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-white text-black'} font-sans transition-colors duration-500`}>
      {/* Sidebar */}
      <aside className={`transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-900 shadow-lg min-h-screen p-4`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-6 w-full text-left font-bold text-blue-600 dark:text-blue-300">
          {sidebarOpen ? '⏴ Collapse' : '☰'}
        </button>
        {sidebarOpen && (
          <div className="space-y-4">
            <div className="font-semibold mt-6">Appointments</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 max-h-[300px] overflow-y-auto space-y-2">
              {appointments.length === 0 && <div>No appointments</div>}
              {appointments.map((appt, i) => (
                <div key={i} className="p-2 rounded shadow-sm bg-gray-100 dark:bg-gray-700">
                  <div className="text-xs font-medium">{appt.name}</div>
                  <div className="text-xs italic">{appt.doctor}</div>
                  <div className="text-xs">{appt.time} on {format(new Date(appt.date), 'MMM d')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Doctor Appointment Booking</h1>
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:scale-110 transition-transform">
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-4 py-2 bg-white text-black border rounded shadow hover:scale-105 transition-transform">Prev</button>
          <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-4 py-2 bg-white text-black border rounded shadow hover:scale-105 transition-transform">Next</button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {monthDays.map((date, i) => {
            const appts = appointments.filter((a) => format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
            return (
              <div
                key={i}
                onClick={() => handleDayClick(date)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 hover:ring-2 ring-blue-400 transition-all cursor-pointer"
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-300">{format(date, 'MMM d')}</div>
                <ul className="mt-1 space-y-1">
                  {appts.map((appt, idx) => (
                    <li key={idx} className={`text-xs rounded p-2 ${categories.find(c => c.name === appt.category)?.color} text-white shadow flex flex-col`}>
                      <span>{appt.name} @ {appt.time}</span>
                      <span className="text-[10px] italic">{appt.doctor} ({appt.category})</span>
                      <div className="flex justify-end space-x-1 text-xs mt-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(appt, appointments.indexOf(appt)); }} className="text-white underline">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(appointments.indexOf(appt)); }} className="text-white underline">Del</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Treatment Categories</h3>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${cat.color}`}></div>
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">{editIndex !== null ? 'Edit' : 'Book'} Appointment</Dialog.Title>
              <button onClick={() => setModalOpen(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Patient Name</label>
                <input type="text" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input type="time" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Doctor</label>
                <select className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })}>
                  <option value="">Select a Doctor</option>
                  {doctorsList.map((doc, i) => (
                    <option key={i} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddOrUpdateAppointment} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {editIndex !== null ? 'Update' : 'Book'} Appointment
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
