import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Search, Loader2, Plus, Edit2, Trash2, X,UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

// TypeScript Interfaces for strict type checking
interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  
  // -- Authentication & RBAC --
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';
  
  // -- State Management --
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Filter & Pagination State
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    sort: 'latest',
    page: 1,
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'New',
    source: 'Website'
  });
  const [formLoading, setFormLoading] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mandatory Debounce Feature implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFilters(prev => ({ ...prev, page: 1 })); 
    }, 500); 
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Leads from Backend
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page.toString(),
        sort: filters.sort,
        ...(filters.status && { status: filters.status }),
        ...(filters.source && { source: filters.source }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await api.get(`/leads?${params.toString()}`);
      
      setLeads(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      });
    } catch (error: any) {
      if (error.response?.status === 401) handleLogout();
      else toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // -- CRUD OPERATIONS --

  // Open Modal for Create or Edit
  const openModal = (lead?: Lead) => {
    if (lead) {
      setEditingLeadId(lead._id);
      setFormData({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    } else {
      setEditingLeadId(null);
      setFormData({ name: '', email: '', status: 'New', source: 'Website' });
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLeadId(null);
  };

  // Handle Form Submit (Create & Update) with Validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      return toast.error('Name and Email are required!');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error('Please enter a valid email address!');
    }

    try {
      setFormLoading(true);
      if (editingLeadId) {
        await api.put(`/leads/${editingLeadId}`, formData);
        toast.success('Lead updated successfully!');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully!');
      }
      closeModal();
      fetchLeads(); // Refresh table
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error: any) {
      toast.error('Failed to delete lead');
    }
  };

  // Handle CSV Export
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.source && { source: filters.source }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await api.get(`/leads/export?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'smart-leads-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Smart Leads</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
            {user.role} Panel
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Only Admins see the Manage Users button */}
          {isAdmin && (
            <button onClick={() => navigate('/users')} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              <Shield className="h-4 w-4 mr-1" /> Manage Users
            </button>
          )}
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Lead
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value, page: 1 }))}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                          ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : ''}
                          ${lead.status === 'Lost' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openModal(lead)} className="text-blue-600 hover:text-blue-900 mr-4">
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        {/* RBAC IN ACTION: Only Admin can delete */}
                        {isAdmin && (
                          <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {!loading && leads.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{filters.page}</span> of <span className="font-medium">{pagination.pages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={filters.page === pagination.pages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingLeadId ? 'Edit Lead' : 'Create New Lead'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                    >
                      <option value="Website">Website</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingLeadId ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;