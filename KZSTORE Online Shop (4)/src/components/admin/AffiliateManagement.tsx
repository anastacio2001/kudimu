import { useState, useEffect } from 'react';
import {
  Users, CheckCircle, XCircle, Clock, DollarSign, TrendingUp,
  Eye, Search, Filter, Download, Mail, Phone, Calendar, Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../utils/supabase/client';

type Affiliate = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commission_rate: number;
  total_clicks: number;
  total_sales: number;
  total_revenue: number;
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
  created_at: string;
  approved_at: string | null;
};

export function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    loadAffiliates();
  }, []);

  useEffect(() => {
    filterAffiliates();
  }, [searchQuery, statusFilter, affiliates]);

  const loadAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAffiliates(data || []);
    } catch (error) {
      console.error('Erro ao carregar afiliados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAffiliates = () => {
    let filtered = affiliates;

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAffiliates(filtered);
  };

  const approveAffiliate = async (affiliateId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('affiliates')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', affiliateId);

      if (error) throw error;

      // Atualizar lista local
      setAffiliates(affiliates.map(a =>
        a.id === affiliateId
          ? { ...a, status: 'approved', approved_at: new Date().toISOString() }
          : a
      ));

      setShowApprovalModal(false);
      setSelectedAffiliate(null);

      // Enviar email de aprovação (implementar depois)
      // sendApprovalEmail(affiliate.email);
    } catch (error) {
      console.error('Erro ao aprovar afiliado:', error);
    }
  };

  const rejectAffiliate = async (affiliateId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', affiliateId);

      if (error) throw error;

      setAffiliates(affiliates.map(a =>
        a.id === affiliateId ? { ...a, status: 'rejected' } : a
      ));

      setShowApprovalModal(false);
      setSelectedAffiliate(null);
    } catch (error) {
      console.error('Erro ao rejeitar afiliado:', error);
    }
  };

  const updateCommissionRate = async (affiliateId: string, newRate: number) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ commission_rate: newRate })
        .eq('id', affiliateId);

      if (error) throw error;

      setAffiliates(affiliates.map(a =>
        a.id === affiliateId ? { ...a, commission_rate: newRate } : a
      ));
    } catch (error) {
      console.error('Erro ao atualizar taxa de comissão:', error);
    }
  };

  const stats = {
    total: affiliates.length,
    pending: affiliates.filter(a => a.status === 'pending').length,
    approved: affiliates.filter(a => a.status === 'approved').length,
    rejected: affiliates.filter(a => a.status === 'rejected').length,
    totalCommission: affiliates.reduce((sum, a) => sum + a.total_commission, 0),
    pendingCommission: affiliates.reduce((sum, a) => sum + a.pending_commission, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Afiliados</h2>
        <p className="text-gray-600">Aprovar afiliados e processar pagamentos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-5 text-gray-600" />
            <p className="text-sm text-gray-600">Total Afiliados</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="size-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div className="bg-green-50 rounded-xl border-2 border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-5 text-green-600" />
            <p className="text-sm text-green-700">Aprovados</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>

        <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="size-5 text-blue-600" />
            <p className="text-sm text-blue-700">Comissão Pendente</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {Math.floor(stats.pendingCommission).toLocaleString('pt-PT')} Kz
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, email ou código..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-600 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-600 focus:outline-none"
          >
            <option value="all">Todos Status</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Rejeitados</option>
            <option value="suspended">Suspensos</option>
          </select>

          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Afiliado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Código</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Taxa</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliques</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vendas</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Comissão</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    Nenhum afiliado encontrado
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{affiliate.name}</p>
                        <p className="text-sm text-gray-600">{affiliate.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        {affiliate.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        affiliate.status === 'approved' 
                          ? 'bg-green-100 text-green-700'
                          : affiliate.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : affiliate.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {affiliate.status === 'approved' && <CheckCircle className="size-3" />}
                        {affiliate.status === 'pending' && <Clock className="size-3" />}
                        {affiliate.status === 'rejected' && <XCircle className="size-3" />}
                        {affiliate.status === 'approved' ? 'Aprovado' :
                         affiliate.status === 'pending' ? 'Pendente' :
                         affiliate.status === 'rejected' ? 'Rejeitado' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={affiliate.commission_rate}
                        onChange={(e) => updateCommissionRate(affiliate.id, parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border rounded focus:border-red-600 focus:outline-none"
                        step="0.5"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-600 ml-1">%</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">{affiliate.total_clicks}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">{affiliate.total_sales}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-bold text-green-600">
                          {Math.floor(affiliate.pending_commission).toLocaleString('pt-PT')} Kz
                        </p>
                        <p className="text-xs text-gray-600">
                          Total: {Math.floor(affiliate.total_commission).toLocaleString('pt-PT')} Kz
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {affiliate.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedAffiliate(affiliate);
                                setShowApprovalModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Aprovar"
                            >
                              <CheckCircle className="size-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAffiliate(affiliate);
                                // Show rejection modal
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rejeitar"
                            >
                              <XCircle className="size-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedAffiliate(affiliate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Aprovar Afiliado
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Nome</p>
              <p className="font-medium text-gray-900 mb-3">{selectedAffiliate.name}</p>
              
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900 mb-3">{selectedAffiliate.email}</p>
              
              <p className="text-sm text-gray-600 mb-1">Código</p>
              <p className="font-mono font-bold text-gray-900">{selectedAffiliate.code}</p>
            </div>

            <p className="text-gray-700 mb-6">
              Tem certeza que deseja aprovar este afiliado? Ele poderá criar links e começar a ganhar comissões.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedAffiliate(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => approveAffiliate(selectedAffiliate.id)}
              >
                <CheckCircle className="size-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
