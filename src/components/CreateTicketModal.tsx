import { fetchApi } from "../lib/api";
import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  FileText,
  Building2,
  User,
  Phone,
  Mail,
  Briefcase,
  Paperclip,
  CheckCircle2,
  Copy,
  Info,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { HABILITATIONS, PLATFORMS, TAX_CENTERS } from '../constants';
import { HabilitationType, PlatformType, TicketObjectType } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  initialObjectType?: TicketObjectType;
  onClose: () => void;
  onTicketCreated: (createdTicketNumber: string) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  initialObjectType = 'SIGNALER UN INCIDENT TECHNIQUE',
  onClose,
  onTicketCreated,
}) => {
  const [objectType, setObjectType] = useState<TicketObjectType>(initialObjectType);
  const [platform, setPlatform] = useState<PlatformType>('SENTAX BACK OFFICE');
  const [platformOther, setPlatformOther] = useState('');

  const [matriculeNinea, setMatriculeNinea] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [habilitation, setHabilitation] = useState<HabilitationType>('Agent d\'Assiette');
  const [bureau, setBureau] = useState('');
  const [centreFiscal, setCentreFiscal] = useState(TAX_CENTERS[0]);
  const [description, setDescription] = useState('');

  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string; url?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{ ticketNumber: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeKb = Math.round(file.size / 1024);
      if (sizeKb > 1024) {
        setErrorMessage("Le fichier est trop volumineux (limite: 1 MB).");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: `${sizeKb} KB`,
            type: file.type || 'document',
            url: base64Url
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!matriculeNinea.trim()) {
      setErrorMessage('Le Matricule / NINEA est obligatoire.');
      return;
    }
    if (!requesterName.trim()) {
      setErrorMessage('Le Prénom, Nom ou Raison Sociale est obligatoire.');
      return;
    }
    if (!position.trim()) {
      setErrorMessage('Le poste occupé est obligatoire.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Le numéro de téléphone est obligatoire.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      return;
    }
    if (!bureau.trim()) {
      setErrorMessage('Le bureau est obligatoire.');
      return;
    }
    if (platform === 'Autre' && !platformOther.trim()) {
      setErrorMessage('Veuillez préciser la plateforme concernée.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetchApi('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectType,
          platform,
          platformOther,
          matriculeNinea,
          requesterName,
          position,
          phone,
          email,
          habilitation,
          bureau,
          centreFiscal,
          description,
          attachments,
        }),
      });

      let data: any;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (text.includes("The page") || text.includes("413") || response.status === 413) {
          throw new Error("Le fichier est trop volumineux pour être envoyé.");
        }
        throw new Error("Erreur serveur: " + text.substring(0, 50));
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du ticket.');
      }

      setSuccessData({ ticketNumber: data.ticketNumber });
      onTicketCreated(data.ticketNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketNumber = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setSuccessData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-3xl overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-auto px-3 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base sm:text-lg">
              DGID
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nouveau Ticket Support SENTAX</h2>
              <p className="text-xs text-slate-400">Direction Générale des Impôts et des Domaines</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successData ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Demande Enregistrée avec Succès !</h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Votre ticket de support technique a été généré et transmis aux équipes d'assistance DSI SENTAX.
              </p>
            </div>

            {/* Ticket Code Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-md mx-auto space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Numéro Unique de Ticket
              </span>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl font-extrabold font-mono text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-200">
                  {successData.ticketNumber}
                </span>
                <button
                  onClick={copyTicketNumber}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-sm transition-colors text-xs font-medium flex items-center space-x-1"
                  title="Copier le numéro"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Statut actuel : <strong className="font-bold">EN ATTENTE</strong></span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-lg mx-auto text-left text-xs text-emerald-900 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Notifications Automatiques Envoyées :</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                <li>Notification administrative envoyée à <code className="font-mono bg-emerald-100 px-1 rounded">support-technique-sentax@dgid.sn</code></li>
                <li>Notification de clôture sera envoyée à votre adresse email : <strong className="font-semibold">{email}</strong></li>
              </ul>
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={handleCloseModal}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1 — Objet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>1. Objet de la Demande <span className="text-rose-500">*</span></span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setObjectType('SIGNALER UN INCIDENT TECHNIQUE')}
                  className={`border rounded-xl p-3.5 cursor-pointer flex items-center space-x-3 transition-all ${
                    objectType === 'SIGNALER UN INCIDENT TECHNIQUE'
                      ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="objectType"
                    checked={objectType === 'SIGNALER UN INCIDENT TECHNIQUE'}
                    onChange={() => setObjectType('SIGNALER UN INCIDENT TECHNIQUE')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-rose-900 block">🔴 SIGNALER UN INCIDENT TECHNIQUE</span>
                    <span className="text-[11px] text-slate-500 block">Problème, bug ou panne bloquante</span>
                  </div>
                </label>

                <label
                  onClick={() => setObjectType('EFFECTUER UNE REQUÊTE')}
                  className={`border rounded-xl p-3.5 cursor-pointer flex items-center space-x-3 transition-all ${
                    objectType === 'EFFECTUER UNE REQUÊTE'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="objectType"
                    checked={objectType === 'EFFECTUER UNE REQUÊTE'}
                    onChange={() => setObjectType('EFFECTUER UNE REQUÊTE')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-sky-900 block">🔵 EFFECTUER UNE REQUÊTE</span>
                    <span className="text-[11px] text-slate-500 block">Demande d'assistance, accès ou information</span>
                  </div>
                </label>
              </div>
            </div>

            {/* SECTION 2 — Plateforme concernée */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>2. La Plateforme Concernée <span className="text-rose-500">*</span></span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-all truncate ${
                      platform === plat
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>

              {platform === 'Autre' && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Précisez la plateforme : <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={platformOther}
                    onChange={(e) => setPlatformOther(e.target.value)}
                    placeholder="Saisissez le nom de la plateforme..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* SECTION 3 — Identification du demandeur */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>3. Identification du Demandeur</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Matricule / NINEA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={matriculeNinea}
                    onChange={(e) => setMatriculeNinea(e.target.value)}
                    placeholder="Ex: DGID-123456 ou NINEA-98765432"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Prénom, Nom ou Raison Sociale <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Ex: Ousmane Sow ou SENEGAL TECH SA"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Poste Occupé <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ex: Agent d'assiette, Chef de bureau..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Téléphone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 123 45 67"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Email de contact <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom.prenom@dgid.sn ou contact@entreprise.sn"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Un e-mail automatique vous sera adressé lorsque votre ticket sera résolu.
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4, 5, 6 — Habilitation, Bureau, Centre Fiscal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  4. Habilitation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={habilitation}
                  onChange={(e) => setHabilitation(e.target.value as HabilitationType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {HABILITATIONS.map((hab) => (
                    <option key={hab} value={hab}>
                      {hab}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  5. Bureau <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bureau}
                  onChange={(e) => setBureau(e.target.value)}
                  placeholder="Ex: Bureau Assiette 1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  6. Centre Fiscal <span className="text-rose-500">*</span>
                </label>
                <select
                  value={centreFiscal}
                  onChange={(e) => setCentreFiscal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {TAX_CENTERS.map((cnt) => (
                    <option key={cnt} value={cnt}>
                      {cnt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION 7 — Description & Attachments */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>7. Précisions de votre requête / Description</span>
                <span className="text-[11px] font-normal text-slate-400">Facultatif</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez en détail le problème rencontré, les codes d'erreur affichés ou la nature exacte de votre demande..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>

              {/* Pièces jointes */}
              <div className="pt-2">
                <span className="text-xs font-medium text-slate-700 block mb-1">
                  Pièces jointes & Captures d'écran (PDF, JPG, PNG)
                </span>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium border border-slate-300 flex items-center space-x-2 transition-colors">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <span>Joindre un fichier</span>
                    <input type="file" onChange={handleFileAdd} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {attachments.length === 0 ? 'Aucun fichier joint' : `${attachments.length} fichier(s) sélectionné(s)`}
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                        <span className="font-mono text-slate-700 truncate">{att.name} ({att.size})</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 shadow-md transition-all hover:shadow-emerald-900/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Enregistrement...' : 'ENVOYER LA DEMANDE'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
