
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Settings, Home, User, Phone, Trash2, Edit3, Heart, LogOut, Info, Mic, ChevronRight, X, UserPlus, Save, Lock, Smartphone } from 'lucide-react';
import { THEMES, INITIAL_CONTACTS, DEPARTMENTS } from './constants';
import { Contact, ThemeType, Page, Department } from './types';

const ADMIN_PIN = "2026";

const App: React.FC = () => {
  // State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('neolink_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [activePage, setActivePage] = useState<Page>('home');
  const [themeColor, setThemeColor] = useState<string>(THEMES.aqua);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Stats
  const totalContacts = contacts.length;
  const favoriteContacts = contacts.filter(c => c.isFavorite);

  // Persistence
  useEffect(() => {
    localStorage.setItem('neolink_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Set CSS Variable for Theme
  useEffect(() => {
    document.documentElement.style.setProperty('--neon-color', themeColor);
  }, [themeColor]);

  // Handle PIN Security
  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) {
      setIsLocked(false);
      setPinInput('');
    } else {
      alert("Invalid Access PIN");
      setPinInput('');
    }
  };

  const requestProtectedAction = (action: () => void) => {
    if (isLocked) {
      alert("Please unlock first");
      return;
    }
    action();
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery) ||
        c.contactId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = filterDept === 'All' || c.department === filterDept;
      
      return matchesSearch && matchesDept;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, searchQuery, filterDept]);

  // Actions
  const addContact = (newContact: Omit<Contact, 'id' | 'createdAt' | 'isFavorite'>) => {
    const isDuplicate = contacts.some(c => c.mobile === newContact.mobile);
    if (isDuplicate) {
      alert("Duplicate mobile number detected!");
      return;
    }

    const contact: Contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      isFavorite: false
    };
    setContacts(prev => [contact, ...prev]);
    setActivePage('home');
  };

  const updateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingContact(null);
    setActivePage('home');
  };

  const deleteContact = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    // Simulate voice detection for the UI showcase
    setTimeout(() => {
      setIsVoiceActive(false);
      alert("Voice Search: Recognition feature would use WebSpeech API in a full browser environment.");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--neon-color)] opacity-10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--neon-color)] opacity-5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 px-4 pt-6 max-w-lg mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-neon">NeoLink 2026</h1>
            <p className="text-white/50 text-xs tracking-widest uppercase">Connectivity Reimagined</p>
          </div>
          <button 
            onClick={() => setShowInfo(true)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Info className="w-5 h-5 text-neon" />
          </button>
        </header>

        {/* Dynamic Pages */}
        {activePage === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Name, ID or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 focus:outline-none focus:border-[var(--neon-color)] focus:ring-1 focus:ring-[var(--neon-color)] transition-all glass"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <button 
                onClick={handleVoiceSearch}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isVoiceActive ? 'bg-red-500 text-white animate-pulse' : 'text-neon hover:bg-white/10'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Department Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', ...DEPARTMENTS].map(dept => (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterDept === dept ? 'bg-[var(--neon-color)] text-black font-bold neo-glow' : 'glass text-white/60 hover:text-white'}`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Favorites Section */}
            {favoriteContacts.length > 0 && searchQuery === '' && (
              <div>
                <h2 className="text-sm font-orbitron text-white/50 mb-3 ml-1 tracking-widest uppercase">Favorites</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {favoriteContacts.map(c => (
                    <div key={c.id} className="flex-shrink-0 flex flex-col items-center group cursor-pointer" onClick={() => { setEditingContact(c); setActivePage('add'); }}>
                      <div className="w-16 h-16 rounded-full glass border-2 neo-border p-1 group-hover:scale-110 transition-transform relative">
                        <img src={c.photo || `https://picsum.photos/200/200?u=${c.id}`} className="w-full h-full rounded-full object-cover" alt={c.name} />
                        <div className="absolute -bottom-1 -right-1 bg-[var(--neon-color)] p-1 rounded-full text-black">
                          <Heart className="w-3 h-3 fill-black" />
                        </div>
                      </div>
                      <span className="text-[10px] mt-2 text-white/70 font-medium truncate w-16 text-center">{c.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-sm font-orbitron text-white/50 tracking-widest uppercase">Contacts ({filteredContacts.length})</h2>
                <div className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">Swipe actions enabled</div>
              </div>

              {filteredContacts.map(c => (
                <div 
                  key={c.id} 
                  className="group relative overflow-hidden glass rounded-3xl p-4 flex items-center gap-4 hover:border-[var(--neon-color)]/30 transition-all border border-white/5 active:scale-[0.98]"
                >
                  {/* Hologram Circle Avatar */}
                  <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-[var(--neon-color)] to-transparent flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black/50">
                      <img src={c.photo || `https://picsum.photos/200/200?u=${c.id}`} className="w-full h-full object-cover opacity-80" alt={c.name} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate flex items-center gap-2">
                      {c.name}
                      {c.isFavorite && <Heart className="w-3 h-3 text-[var(--neon-color)] fill-[var(--neon-color)]" />}
                    </h3>
                    <p className="text-white/50 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {c.mobile}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10 text-white/40">{c.contactId}</span>
                      <span className="text-[10px] bg-[var(--neon-color)]/10 px-2 py-0.5 rounded-full text-[var(--neon-color)] border border-[var(--neon-color)]/20">{c.department}</span>
                    </div>
                  </div>

                  {/* Actions (Normally hidden, visible on hover/focus) */}
                  <div className="flex flex-col gap-2">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id); }} className="p-2 glass rounded-xl hover:text-red-400 transition-colors">
                      <Heart className={`w-4 h-4 ${c.isFavorite ? 'fill-[var(--neon-color)] text-[var(--neon-color)]' : 'text-white/30'}`} />
                    </button>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingContact(c); setActivePage('add'); }} 
                        className="p-2 glass rounded-xl text-white/30 hover:text-neon"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); requestProtectedAction(() => deleteContact(c.id)); }} 
                        className="p-2 glass rounded-xl text-white/30 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredContacts.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl opacity-50 italic">
                  No contacts found in sector 2026.
                </div>
              )}
            </div>
          </div>
        )}

        {activePage === 'add' && (
          <ContactForm 
            onSubmit={editingContact ? updateContact : addContact} 
            onCancel={() => { setEditingContact(null); setActivePage('home'); }}
            initialData={editingContact || undefined}
          />
        )}

        {activePage === 'settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Security Section */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-lg font-orbitron mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-neon" /> Admin Security
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-white/50">Admin PIN is required for adding, editing, deleting, or changing sensitive settings.</p>
                {isLocked ? (
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="Enter 4-digit PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      maxLength={4}
                      className="flex-1 h-12 glass border border-white/10 rounded-xl px-4 focus:outline-none focus:border-neon"
                    />
                    <button 
                      onClick={handlePinSubmit}
                      className="bg-neon px-6 rounded-xl text-black font-bold h-12"
                    >
                      Unlock
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLocked(true)}
                    className="w-full h-12 glass border border-red-500/30 text-red-400 rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Lock Admin Access
                  </button>
                )}
              </div>
            </div>

            {/* Theme Customization */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-lg font-orbitron mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-neon" /> Neural Themes
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(THEMES) as [ThemeType, string][]).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setThemeColor(color)}
                    className={`h-16 rounded-2xl border transition-all flex items-center justify-center gap-2 ${themeColor === color ? 'border-neon ring-1 ring-neon' : 'border-white/10 glass'}`}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="capitalize text-sm font-medium">{key}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">Custom Spectrum</label>
                <input 
                  type="color" 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-full h-10 rounded-xl glass p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="glass rounded-3xl p-6 text-center opacity-60">
              <p className="text-xs">NeoLink Core v2.6.4 (Stable)</p>
              <p className="text-[10px] mt-1">Experimental features enabled</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-md:w-[95%] h-20 glass rounded-[32px] border border-white/10 flex items-center justify-around px-4 z-50">
        <NavButton active={activePage === 'home'} icon={<Home />} label="Home" onClick={() => setActivePage('home')} />
        
        {/* Central Pulsating Plus Button */}
        <div className="relative -top-8">
          <button 
            onClick={() => requestProtectedAction(() => setActivePage('add'))}
            className="w-20 h-20 bg-[var(--neon-color)] text-black rounded-full flex items-center justify-center shadow-[0_0_30px_var(--neon-color)] animate-pulse-glow hover:scale-105 transition-transform"
          >
            <Plus className="w-10 h-10 stroke-[3px]" />
          </button>
        </div>

        <NavButton active={activePage === 'settings'} icon={<Settings />} label="Config" onClick={() => setActivePage('settings')} />
      </nav>

      {/* App Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass w-full max-w-sm rounded-[40px] p-8 border border-white/20 relative">
            <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 text-white/50"><X /></button>
            <div className="text-center">
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 neo-border">
                <span className="text-3xl font-orbitron font-bold text-neon">NL</span>
              </div>
              <h2 className="text-2xl font-orbitron text-white mb-2">NeoLink 2026</h2>
              <p className="text-white/50 text-sm mb-8">Next-Gen Personnel Database</p>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/30 text-xs">Version</span>
                  <span className="text-neon text-xs font-orbitron">2.0.26</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/30 text-xs">Developer</span>
                  <span className="text-white text-xs">TD Hasan</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/30 text-xs">Engine</span>
                  <span className="text-white text-xs">Aura-Core 5.0</span>
                </div>
              </div>

              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold font-orbitron tracking-widest hover:bg-neon transition-colors"
              >
                PROCEED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponents

const NavButton: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`transition-all duration-300 ${active ? 'text-neon scale-125' : 'text-white/30 group-hover:text-white/60'}`}>
      {/* Fix: Use React.cloneElement with generic cast to avoid 'size' property error */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
    </div>
    <span className={`text-[10px] font-orbitron transition-all ${active ? 'text-neon opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

interface FormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Contact;
}

const ContactForm: React.FC<FormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    mobile: initialData?.mobile || '',
    contactId: initialData?.contactId || '',
    department: initialData?.department || 'ব্যাগ পিটার' as Department,
    customDepartment: initialData?.customDepartment || '',
    address: initialData?.address || '',
    photo: initialData?.photo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert("Name and Mobile are required!");
      return;
    }
    
    const finalData = {
      ...formData,
      department: formData.department === 'অন্য অন্যান্য' ? (formData.customDepartment as Department) : formData.department,
      id: initialData?.id // Keep ID if editing
    };

    onSubmit(finalData);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-orbitron text-neon flex items-center gap-2">
          {initialData ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {initialData ? 'Modify Entity' : 'New Entity'}
        </h2>
        <button onClick={onCancel} className="p-2 glass rounded-full text-white/30"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hologram Circle for Photo Add */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[var(--neon-color)] to-purple-500 flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-black group cursor-pointer relative">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-neon/40" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Plus className="text-white" />
              </div>
              <input 
                type="text" 
                placeholder="Photo URL" 
                value={formData.photo}
                onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                className="absolute bottom-0 w-full bg-black/80 text-[10px] text-center p-1 focus:outline-none"
              />
            </div>
            <div className="absolute inset-[-10px] border-2 border-dashed border-neon/20 rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-[10px] mt-4 text-white/30 uppercase tracking-[0.2em]">Biometric Imprint</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <FormInput 
            icon={<User />} 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={(val) => setFormData(prev => ({ ...prev, name: val }))} 
          />
          <FormInput 
            icon={<Phone />} 
            placeholder="Mobile Number (Required)" 
            type="tel"
            value={formData.mobile} 
            onChange={(val) => setFormData(prev => ({ ...prev, mobile: val }))} 
          />
          <FormInput 
            icon={<Info />} 
            placeholder="Entity ID (e.g. ID-001)" 
            value={formData.contactId} 
            onChange={(val) => setFormData(prev => ({ ...prev, contactId: val }))} 
          />

          {/* Department Select */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <ChevronRight className="w-5 h-5" />
            </div>
            <select 
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value as Department }))}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 focus:outline-none focus:border-neon appearance-none glass"
            >
              {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
            </select>
            <label className="absolute -top-2 left-4 px-2 bg-black text-[10px] text-neon uppercase tracking-widest font-bold">Department</label>
          </div>

          {formData.department === 'অন্য অন্যান্য' && (
            <FormInput 
              icon={<Edit3 />} 
              placeholder="Enter Custom Department" 
              value={formData.customDepartment} 
              onChange={(val) => setFormData(prev => ({ ...prev, customDepartment: val }))} 
            />
          )}

          <div className="relative">
            <textarea 
              placeholder="Entity Sector / Address"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-neon glass resize-none"
            ></textarea>
            <label className="absolute -top-2 left-4 px-2 bg-black text-[10px] text-neon uppercase tracking-widest font-bold">Location</label>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 rounded-[24px] bg-neon text-black font-bold font-orbitron tracking-[0.2em] neo-glow flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Save className="w-5 h-5" />
          {initialData ? 'UPDATE PROFILE' : 'INITIATE CONTACT'}
        </button>
      </form>
    </div>
  );
}

const FormInput: React.FC<{ icon: React.ReactNode, placeholder: string, value: string, onChange: (v: string) => void, type?: string }> = ({ icon, placeholder, value, onChange, type = "text" }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon transition-colors">
      {/* Fix: Use React.cloneElement with generic cast to avoid 'size' property error */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </div>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all glass"
    />
  </div>
);

export default App;
