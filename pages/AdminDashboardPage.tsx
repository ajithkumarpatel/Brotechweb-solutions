
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Briefcase, Users, Trash2, Mail, Calendar, User, FileText, Lock } from 'lucide-react';
import { useCollection, deleteDocument } from '../services/hooks';
import { ContactMessage, JobApplication, Subscriber, PartnerApplication, MeetingRequest } from '../types';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
            <p className="text-slate-500 dark:text-slate-400">Restricted Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Unlock Dashboard
            </button>
            <p className="text-center text-xs text-slate-400">Hint: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      <div className="bg-slate-900 text-white py-6 px-4 md:px-8 flex justify-between items-center shadow-md z-10">
        <div>
           <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">B</div>
             Admin Console
           </h1>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          Logout
        </button>
      </div>
      
      <div className="flex flex-grow flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 flex md:block overflow-x-auto md:overflow-x-visible">
           <div className="p-4 flex md:flex-col gap-2 min-w-max md:min-w-0">
              <SidebarItem id="messages" label="Messages" icon={MessageSquare} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="applications" label="Job Apps" icon={Briefcase} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="subscribers" label="Subscribers" icon={Mail} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="partners" label="Partners" icon={Users} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="meetings" label="Meetings" icon={Calendar} active={activeTab} setActive={setActiveTab} />
           </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-4 md:p-8 overflow-y-auto">
           {activeTab === 'messages' && <MessagesPanel />}
           {activeTab === 'applications' && <ApplicationsPanel />}
           {activeTab === 'subscribers' && <SubscribersPanel />}
           {activeTab === 'partners' && <PartnersPanel />}
           {activeTab === 'meetings' && <MeetingsPanel />}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ id, label, icon: Icon, active, setActive }: any) => (
  <button 
    onClick={() => setActive(id)}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm md:w-full whitespace-nowrap ${
       active === id 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

// Panels

const MessagesPanel = () => {
  // Use generic type any to handle both 'message' and 'text' fields
  const { data: messages, loading } = useCollection<any>('messages');

  if (loading) return <div className="dark:text-white">Loading messages...</div>;

  // Sort by date descending (safely handling null timestamps)
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Inbox ({messages.length})</h2>
      {sortedMessages.length === 0 ? (
        <div className="text-slate-500">No messages found.</div>
      ) : (
        <div className="space-y-4">
          {sortedMessages.map(msg => (
            <div key={msg.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${msg.isAdmin === false ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                     <div>
                       <h3 className="font-bold text-slate-900 dark:text-white">{msg.name || 'Anonymous User'}</h3>
                       <div className="text-sm text-blue-600 dark:text-blue-400">{msg.email}</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => deleteDocument('messages', msg.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
               
               {/* Handle both contact form 'message' and chat 'text' */}
               <p className="text-slate-600 dark:text-slate-300 mt-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg text-sm whitespace-pre-wrap">
                 {msg.message || msg.text || '(No content)'}
               </p>
               
               <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider">{msg.type || (msg.text ? 'LIVE CHAT' : 'CONTACT FORM')}</span>
                  <span>•</span>
                  <span>{msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</span>
                  {msg.userId && <span>• ID: {msg.userId}</span>}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ApplicationsPanel = () => {
  const { data: apps, loading } = useCollection<JobApplication>('jobApplications');
  
  if (loading) return <div className="dark:text-white">Loading applications...</div>;

  const sortedApps = [...apps].sort((a, b) => {
    const timeA = a.submittedAt?.seconds || 0;
    const timeB = b.submittedAt?.seconds || 0;
    return timeB - timeA;
  });

  return (
     <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Job Applications ({apps.length})</h2>
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
           <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                 <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Role / Job ID</th>
                    <th className="p-4">Resume Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                 {sortedApps.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-750">
                       <td className="p-4">
                          <div className="font-bold">{app.name}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                          <div className="text-xs text-slate-500">{app.phone}</div>
                       </td>
                       <td className="p-4 font-medium">{app.jobId}</td>
                       <td className="p-4 truncate max-w-xs">
                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                           <FileText size={12} /> Uploaded
                         </span>
                       </td>
                       <td className="p-4">{app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                       <td className="p-4">
                          <button onClick={() => app.id && deleteDocument('jobApplications', app.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                       </td>
                    </tr>
                 ))}
                 {sortedApps.length === 0 && (
                   <tr>
                     <td colSpan={5} className="p-8 text-center text-slate-500">No applications received yet.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
     </div>
  );
};

const SubscribersPanel = () => {
  const { data: subs, loading } = useCollection<Subscriber>('subscribers');

  if (loading) return <div className="dark:text-white">Loading subscribers...</div>;

  const sortedSubs = [...subs].sort((a, b) => {
    const timeA = a.subscribedAt?.seconds || 0;
    const timeB = b.subscribedAt?.seconds || 0;
    return timeB - timeA;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Newsletter Subscribers ({subs.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSubs.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                   <Mail size={16} />
                </div>
                <div>
                   <div className="text-slate-700 dark:text-slate-300 font-medium">{sub.email}</div>
                   <div className="text-xs text-slate-400">{sub.subscribedAt ? new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString() : ''}</div>
                </div>
             </div>
             <button onClick={() => deleteDocument('subscribers', sub.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PartnersPanel = () => {
   const { data: partners, loading } = useCollection<PartnerApplication>('partner_applications');
   
   if (loading) return <div className="dark:text-white">Loading...</div>;

   return (
      <div className="space-y-4">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Partner Applications ({partners.length})</h2>
         {partners.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative group">
               <button 
                  onClick={() => p.id && deleteDocument('partner_applications', p.id)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
               >
                  <Trash2 size={18} />
               </button>
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{p.name}</h3>
                    <div className="text-sm text-slate-500">{p.email}</div>
                  </div>
                  <span className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-bold">{p.role}</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <div><strong className="text-slate-700 dark:text-slate-300">Rate:</strong> <span className="text-slate-600 dark:text-slate-400">{p.hourlyRate}</span></div>
                  <div><strong className="text-slate-700 dark:text-slate-300">Portfolio:</strong> <a href={p.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">{p.portfolioUrl}</a></div>
                  <div className="col-span-1 md:col-span-2"><strong className="text-slate-700 dark:text-slate-300">Skills:</strong> <span className="text-slate-600 dark:text-slate-400">{p.skills}</span></div>
               </div>
            </div>
         ))}
      </div>
   );
};

const MeetingsPanel = () => {
   const { data: meetings, loading } = useCollection<MeetingRequest>('meeting_requests');
   
   if (loading) return <div className="dark:text-white">Loading...</div>;

   const sortedMeetings = [...meetings].sort((a, b) => {
      // Sort by requestedAt if available, or just push to top
      const timeA = a.requestedAt?.seconds || 0;
      const timeB = b.requestedAt?.seconds || 0;
      return timeB - timeA;
   });

   return (
      <div className="space-y-4">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Meeting Requests ({meetings.length})</h2>
         {sortedMeetings.map(m => (
            <div key={m.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`w-2 h-2 rounded-full ${m.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                     <h3 className="font-bold text-slate-900 dark:text-white">{m.topic}</h3>
                  </div>
                  <p className="text-sm text-slate-500">{m.name} ({m.email})</p>
               </div>
               <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                     <div className="font-bold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">{m.preferredDate}</div>
                     <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">{m.preferredTime}</div>
                  </div>
                  <button onClick={() => m.id && deleteDocument('meeting_requests', m.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded transition-colors"><Trash2 size={18} /></button>
               </div>
            </div>
         ))}
      </div>
   );
};

export default AdminDashboardPage;
