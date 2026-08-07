import React, { useEffect, useState } from 'react';
import { X, Mail, CheckCircle2, Clock, Send, Shield, AlertCircle } from 'lucide-react';
import { EmailNotification } from '../types';

interface EmailHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailHubModal: React.FC<EmailHubModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails');
      const data = await res.json();
      setEmails(data);
      if (data.length > 0) {
        setSelectedEmail(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-4xl overflow-hidden my-6 transform transition-all h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-600 text-white font-bold flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Journal des Emails Système SENTAX</h2>
              <p className="text-xs text-slate-400">Simulation & Suivi des notifications automatiques transmises</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          {/* Email List Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-white overflow-y-auto shrink-0">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Notifications ({emails.length})
              </span>
              <button
                onClick={fetchEmails}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                Actualiser
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Chargement...</div>
            ) : emails.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">Aucun email envoyé pour le moment.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {emails.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedEmail(mail)}
                    className={`w-full text-left p-3 text-xs transition-colors block ${
                      selectedEmail?.id === mail.id
                        ? 'bg-emerald-50 text-emerald-950 font-medium border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>{mail.ticketNumber}</span>
                      <span>{new Date(mail.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="font-bold text-slate-900 truncate mb-0.5">{mail.subject}</div>
                    <div className="text-[11px] text-slate-500 truncate">À: {mail.recipient}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Email Preview Pane */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {selectedEmail ? (
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {selectedEmail.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(selectedEmail.sentAt).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{selectedEmail.subject}</h3>

                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                    <div>
                      <strong>Destinataire :</strong> <span className="font-mono text-emerald-700">{selectedEmail.recipient}</span>
                    </div>
                    <div>
                      <strong>Expéditeur :</strong> <span className="font-mono text-slate-700">no-reply-support@dgid.sn</span>
                    </div>
                  </div>
                </div>

                {/* HTML Body Display */}
                <div className="border border-slate-200 rounded-xl p-6 shadow-sm bg-white space-y-4">
                  <div className="text-xs text-slate-500 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Aperçu du contenu transmis :</span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Statut: ENVOYÉ</span>
                    </span>
                  </div>

                  <div
                    className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-2"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Sélectionnez une notification pour afficher les détails du message.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
