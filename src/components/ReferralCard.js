import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, ClipboardDocumentIcon, CheckIcon, ShareIcon } from '@heroicons/react/24/outline';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8787'
  : 'https://kudimu-api.l-anastacio001.workers.dev';

const ReferralCard = () => {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (user?.codigo_indicacao) {
      navigator.clipboard.writeText(user.codigo_indicacao);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = () => {
    const text = `Junte-se ao Kudimu e ganhe dinheiro respondendo pesquisas! Use meu código: ${user?.codigo_indicacao}`;
    const url = `https://kudimu.ao?ref=${user?.codigo_indicacao}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Junte-se ao Kudimu',
        text: text,
        url: url
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <UserGroupIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Indique Amigos</h3>
          <p className="text-sm text-blue-100">Ganhe 200 AOA por cada indicação!</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
        <p className="text-xs text-blue-100 mb-2">Seu código de indicação:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 font-mono text-2xl font-bold tracking-wider">
            {user?.codigo_indicacao || 'KUDI-XXXX'}
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-white text-blue-600 rounded-lg px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Copiado!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">200 AOA</div>
          <div className="text-xs text-blue-100">Para você</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">50 AOA</div>
          <div className="text-xs text-blue-100">Para seu amigo</div>
        </div>
      </div>

      <button
        onClick={shareReferralLink}
        className="w-full bg-white text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        <ShareIcon className="w-5 h-5" />
        Compartilhar Código
      </button>

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-blue-100">
          <strong>Como funciona:</strong> Quando seu amigo se cadastrar usando seu código e completar o primeiro questionário, você ganha 200 AOA + 5 pontos de reputação!
        </p>
      </div>
    </motion.div>
  );
};

export default ReferralCard;
