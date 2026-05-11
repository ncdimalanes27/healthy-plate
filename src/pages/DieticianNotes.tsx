import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { supabaseService } from '../lib/supabaseService';
import type { Profile, DieticianNote } from '../types';
import {
  Send, AlertCircle, Info, TrendingUp, CheckCircle,
  MessageSquare, Clock, Pencil, Trash2, X, Save
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Recommendation', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'Warning', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'Progress', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'General', icon: CheckCircle, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
];

export default function DieticianNotes() {
  const [patients, setPatients] = useState<Profile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentNotes, setSentNotes] = useState<DieticianNote[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSentNotes = useCallback(async (dietitianId: string) => {
    const { data } = await supabaseService.getDietitianSentNotes(dietitianId);
    if (data) setSentNotes(data);
  }, []);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'patient').then(({ data }) => {
      if (data) setPatients(data as Profile[]);
    });
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        fetchSentNotes(user.id);
      }
    });
  }, [fetchSentNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !content) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('dietician_notes').insert({
        dietitian_id: user?.id,
        patient_id: selectedPatient,
        content,
        category,
      });
      if (error) throw error;
      showToast('Note sent to patient!', 'success');
      setContent('');
      if (user?.id) fetchSentNotes(user.id);
    } catch (err: any) {
      showToast(err.message || 'Failed to send note.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note: DieticianNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditCategory(note.category || 'General');
    setDeleteConfirmId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditCategory('General');
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editContent.trim()) return;
    setEditLoading(true);
    try {
      const { error } = await supabaseService.updateNote(noteId, {
        content: editContent.trim(),
        category: editCategory,
      });
      if (error) throw error;
      setSentNotes(prev =>
        prev.map(n => n.id === noteId ? { ...n, content: editContent.trim(), category: editCategory } : n)
      );
      showToast('Note updated successfully!', 'success');
      cancelEdit();
    } catch (err: any) {
      showToast(err.message || 'Failed to update note.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeleteLoading(true);
    try {
      const { error } = await supabaseService.deleteNote(noteId);
      if (error) throw error;
      setSentNotes(prev => prev.filter(n => n.id !== noteId));
      showToast('Note deleted.', 'success');
      setDeleteConfirmId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete note.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPatientName = (id: string) => patients.find((p) => p.id === id)?.name || 'Patient';
  const getCategoryStyle = (cat: string) => CATEGORIES.find((c) => c.id === cat) || CATEGORIES[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20"
    >
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
          <MessageSquare size={14} />
          <span>Clinical Communication</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Clinical <span className="gradient-text">Notes</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Send personalized feedback and recommendations to your patients.</p>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm shadow-sm ${
              toast.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compose Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
        <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">Compose Note</h2>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Patient</label>
          <select
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all appearance-none text-sm"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
          >
            <option value="">Choose a patient...</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 md:p-4 rounded-2xl border-2 transition-all ${
                  category === cat.id ? `${cat.border} ${cat.bg}` : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <cat.icon className={category === cat.id ? cat.color : 'text-slate-400'} size={18} />
                <span className={`text-[10px] font-black ${category === cat.id ? cat.color : 'text-slate-400'}`}>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
          <textarea
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 h-36 outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white font-medium text-slate-700 transition-all resize-none text-sm"
            placeholder="Write your clinical advice, recommendation, or observation here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-xl shadow-primary/20 text-sm"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <><Send size={17} /> Send Note to Patient</>
          )}
        </button>
      </form>

      {/* Sent Notes History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-widest">
            <Clock size={16} className="text-primary" />
            Sent Notes
          </div>
          {sentNotes.length > 0 && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sentNotes.length} notes</span>
          )}
        </div>

        {sentNotes.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-12 text-center space-y-2">
            <MessageSquare size={32} className="mx-auto text-slate-200" />
            <p className="text-slate-400 font-bold text-sm">No notes sent yet.</p>
            <p className="text-slate-300 text-xs font-medium">Notes you send will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentNotes.map((note, i) => {
              const catStyle = getCategoryStyle(note.category || 'General');
              const isEditing = editingId === note.id;
              const isConfirmDelete = deleteConfirmId === note.id;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm"
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between gap-3 p-4 md:p-5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 ${catStyle.bg} rounded-xl shrink-0`}>
                        <catStyle.icon className={catStyle.color} size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-sm truncate">{getPatientName(note.patient_id)}</p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {new Date(note.created_at).toLocaleDateString('en-PH', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {note.category && !isEditing && (
                        <span className={`hidden sm:inline text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl ${catStyle.bg} ${catStyle.color}`}>
                          {note.category}
                        </span>
                      )}
                      {!isEditing && !isConfirmDelete && (
                        <>
                          <button
                            onClick={() => startEdit(note)}
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                            title="Edit note"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => { setDeleteConfirmId(note.id); setEditingId(null); }}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Delete note"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                      {isEditing && (
                        <button
                          onClick={cancelEdit}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                          title="Cancel edit"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Note Body */}
                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    {isEditing ? (
                      <div className="space-y-3">
                        {/* Edit Category */}
                        <div className="grid grid-cols-4 gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setEditCategory(cat.id)}
                              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                                editCategory === cat.id ? `${cat.border} ${cat.bg}` : 'border-slate-100'
                              }`}
                            >
                              <cat.icon className={editCategory === cat.id ? cat.color : 'text-slate-300'} size={14} />
                              <span className={`text-[9px] font-black ${editCategory === cat.id ? cat.color : 'text-slate-300'}`}>
                                {cat.id}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Edit Text */}
                        <textarea
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-28 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white font-medium text-slate-700 transition-all resize-none text-sm"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          autoFocus
                        />

                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={editLoading || !editContent.trim()}
                          className="w-full bg-primary text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50 text-sm"
                        >
                          {editLoading
                            ? <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <><Save size={15} /> Save Changes</>
                          }
                        </button>
                      </div>
                    ) : isConfirmDelete ? (
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
                        <p className="text-red-700 font-bold text-sm">Delete this note permanently?</p>
                        <p className="text-red-500 text-xs font-medium line-clamp-2 italic">"{note.content}"</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(note.id)}
                            disabled={deleteLoading}
                            className="flex-1 bg-red-500 text-white font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-red-600 transition-all disabled:opacity-50"
                          >
                            {deleteLoading
                              ? <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              : <><Trash2 size={14} /> Yes, Delete</>
                            }
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{note.content}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
