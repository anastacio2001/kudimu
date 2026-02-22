import { useState, useEffect } from 'react';
import { 
  Users, Link as LinkIcon, TrendingUp, DollarSign, Eye, 
  ShoppingCart, Plus, Copy, Check, ExternalLink, Calendar,
  Filter, Download, RefreshCw, AlertCircle, Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';

type AffiliatePanelProps = {
  userEmail?: string;
  userName?: string;
};

type Affiliate = {
  id: string;
  code: string;
  name: string;
  email: string;
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

type Campaign = {
  id: string;
  name: string;
  description: string;
  product_id: string | null;
  link_code: string;
  full_url: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  is_active: boolean;
  created_at: string;
};

type Conversion = {
  id: string;
  order_value: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  product_id: string;
  campaign_id: string;
};

export function AffiliatePanel({ userEmail, userName }: AffiliatePanelProps) {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar dados do afiliado
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateData) {
        setAffiliate(affiliateData);

        // Buscar campanhas
        const { data: campaignsData } = await supabase
          .from('affiliate_campaigns')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false });

        setCampaigns(campaignsData || []);

        // Buscar conversões
        const { data: conversionsData } = await supabase
          .from('affiliate_conversions')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false })
          .limit(20);

        setConversions(conversionsData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const createCampaign = async (campaignData: {
    name: string;
    description: string;
    product_id: string | null;
  }) => {
    if (!affiliate) return;

    try {
      const linkCode = `${affiliate.code}${Date.now().toString(36)}`;
      const baseUrl = window.location.origin;
      const fullUrl = campaignData.product_id
        ? `${baseUrl}?ref=${linkCode}&pid=${campaignData.product_id}`
        : `${baseUrl}?ref=${linkCode}`;

      const { data, error } = await supabase
        .from('affiliate_campaigns')
        .insert({
          affiliate_id: affiliate.id,
          name: campaignData.name,
          description: campaignData.description,
          product_id: campaignData.product_id,
          link_code: linkCode,
          full_url: fullUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      setShowNewCampaignModal(false);
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <Users className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Torne-se um Afiliado
          </h2>
          <p className="text-gray-600 mb-6">
            Registre-se como afiliado e comece a ganhar comissões promovendo nossos produtos!
          </p>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Solicitar Cadastro
          </Button>
        </div>
      </div>
    );
  }

  // Status pendente de aprovação
  if (affiliate.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-20 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-6">
            <Clock className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aguardando Aprovação
          </h2>
          <p className="text-gray-600 mb-6">
            Seu cadastro está em análise. Você receberá um email quando for aprovado.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Seu código:</strong> {affiliate.code}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Solicitado em {new Date(affiliate.created_at).toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Status rejeitado
  if (affiliate.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cadastro Não Aprovado
          </h2>
          <p className="text-gray-600 mb-6">
            Infelizmente seu cadastro não foi aprovado. Entre em contato conosco para mais informações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Painel de Afiliado</h1>
              <p className="text-white/90">Seu código: <span className="font-mono font-bold">{affiliate.code}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Taxa de Comissão</p>
              <p className="text-4xl font-bold">{affiliate.commission_rate}%</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="size-5" />
                <p className="text-sm text-white/80">Total de Cliques</p>
              </div>
              <p className="text-2xl font-bold">{affiliate.total_clicks}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="size-5" />
                <p className="text-sm text-white/80">Vendas Geradas</p>
              </div>
              <p className="text-2xl font-bold">{affiliate.total_sales}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5" />
                <p className="text-sm text-white/80">Taxa de Conversão</p>
              </div>
              <p className="text-2xl font-bold">
                {affiliate.total_clicks > 0 
                  ? ((affiliate.total_sales / affiliate.total_clicks) * 100).toFixed(2)
                  : '0.00'}%
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="size-5" />
                <p className="text-sm text-white/80">Revenue Gerado</p>
              </div>
              <p className="text-2xl font-bold">{Math.floor(affiliate.total_revenue).toLocaleString('pt-PT')} Kz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comissões */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-2">Total de Comissões</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(affiliate.total_commission).toLocaleString('pt-PT')} Kz
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-yellow-200 p-6">
            <p className="text-sm text-yellow-700 mb-2">Comissão Pendente</p>
            <p className="text-3xl font-bold text-yellow-600">
              {Math.floor(affiliate.pending_commission).toLocaleString('pt-PT')} Kz
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-green-200 p-6">
            <p className="text-sm text-green-700 mb-2">Já Recebido</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.floor(affiliate.paid_commission).toLocaleString('pt-PT')} Kz
            </p>
          </div>
        </div>

        {/* Campanhas */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Seus Links de Afiliado</h2>
            <Button
              onClick={() => setShowNewCampaignModal(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="size-4 mr-2" />
              Criar Link
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhuma campanha criada ainda</p>
              <Button
                onClick={() => setShowNewCampaignModal(true)}
                variant="outline"
              >
                Criar Primeira Campanha
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border-2 border-gray-100 rounded-xl p-4 hover:border-red-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.is_active 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={campaign.full_url}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(campaign.full_url, campaign.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copiar link"
                    >
                      {copiedLink === campaign.id ? (
                        <Check className="size-5 text-green-600" />
                      ) : (
                        <Copy className="size-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{campaign.clicks}</p>
                      <p className="text-xs text-gray-600">Cliques</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{campaign.conversions}</p>
                      <p className="text-xs text-gray-600">Conversões</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : '0'}%
                      </p>
                      <p className="text-xs text-gray-600">Taxa Conv.</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.floor(campaign.commission).toLocaleString('pt-PT')}
                      </p>
                      <p className="text-xs text-gray-600">Comissão (Kz)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimas Conversões */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimas Vendas</h2>
          
          {conversions.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma venda registrada ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Comissão</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((conversion) => (
                    <tr key={conversion.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(conversion.created_at).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {Math.floor(conversion.order_value).toLocaleString('pt-PT')} Kz
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-green-600">
                        {Math.floor(conversion.commission_amount).toLocaleString('pt-PT')} Kz
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          conversion.status === 'paid' 
                            ? 'bg-green-100 text-green-700'
                            : conversion.status === 'approved'
                            ? 'bg-blue-100 text-blue-700'
                            : conversion.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {conversion.status === 'paid' ? 'Pago' :
                           conversion.status === 'approved' ? 'Aprovado' :
                           conversion.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Criar Campanha */}
      {showNewCampaignModal && (
        <NewCampaignModal
          onClose={() => setShowNewCampaignModal(false)}
          onCreate={createCampaign}
        />
      )}
    </div>
  );
}

// Modal para criar nova campanha
function NewCampaignModal({ 
  onClose, 
  onCreate 
}: { 
  onClose: () => void; 
  onCreate: (data: any) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, nome')
      .order('nome');
    
    setProducts(data || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      product_id: productId || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Campanha</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome da Campanha *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-600 focus:outline-none"
              placeholder="Ex: Iphone 15"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-600 focus:outline-none resize-none"
              placeholder="Descreva sua campanha..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Produto Específico (Opcional)
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-600 focus:outline-none"
            >
              <option value="">Todos os produtos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Criar Campanha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
