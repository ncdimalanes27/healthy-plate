import { useState, useEffect } from 'react';
import { getAllPatients, getNotesForPatient, insertNote, deleteNote } from '../lib/supabaseService';
import { Send, Trash2, AlertTriangle, TrendingUp, MessageSquare, Star } from 'lucide-react';

interface Props { user: { id: string; name: string } | null; }

const categories = [
  { value: 'recommendation', label: 'Recommendation', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Star },
  { value: 'warning', label: 'Warning', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: AlertTriangle },
  { value: 'progress', label: 'Progress', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: TrendingUp },
  { value: 'general', label: 'General', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', icon: MessageSquare },
];

export default function DieticianNotes({ user }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('recommendation');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getAllPatients().then((data) => {
      setPatients(data);
      if (data.length > 0) setSelectedPatient(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedPatient) getNotesForPatient(selectedPatient).then(setNotes);
  }, [selectedPatient]);

  const patient = patients.find((p) => p.id === selectedPatient);

  const handleSend = async () => {
    if (!content.trim() || !user) return;
    await insertNote({ dietician_id: user.id, dietician_name: user.name, patient_id: selectedPatient, content: content.trim(), category });
    const updated = await getNotesForPatient(selectedPatient);
    setNotes(updated);
    setContent('');
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const getCategoryStyle = (cat: string) => categories.find((c) => c.value === cat) || categories[3];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Notes & Recommendations</h1>
        <p className="text-gray-400 text-sm mt-1">Send clinical notes and dietary recommendations to your patients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Select Patient</p>
          {patients.map((p) => (
            <button key={p.id} onClick={() => setSelectedPatient(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedPatient === p.id ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.health_conditions?.length ? p.health_conditions[0] : 'No conditions'}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              New note for <span className="text-green-600">{patient?.name}</span>
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map(({ value, label, color, bg, icon: Icon }) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === value ? `${bg} ${color} border-current` : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <Icon className="w-3 h-3" />{label}
                </button>
              ))}
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Write your recommendation or note here..." rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" />
            <button onClick={handleSend} disabled={!content.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${sent ? 'bg-green-100 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-40'}`}>
              <Send className="w-4 h-4" />
              {sent ? 'Note Sent!' : 'Send Note'}
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Previous Notes ({notes.length})</p>
            {notes.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-gray-400 text-sm">No notes yet for this patient.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => {
                  const style = getCategoryStyle(note.category);
                  const Icon = style.icon;
                  return (
                    <div key={note.id} className={`border rounded-2xl p-4 ${style.bg}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                          <span className={`text-xs font-semibold uppercase tracking-wide ${style.color}`}>{style.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{new Date(note.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <button onClick={() => handleDelete(note.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-2">— {note.dietician_name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
