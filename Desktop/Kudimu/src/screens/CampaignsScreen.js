import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import CampaignFilters from '../components/CampaignFilters';
import './CampaignsScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function CampaignsScreen() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchCampaigns();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Buscar dados de reputação do backend
        const reputationResponse = await fetch(`${API_URL}/reputation/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (reputationResponse.ok) {
          const reputationData = await reputationResponse.json();
          if (reputationData.success) {
            setUserData({
              ...user,
              nivel: reputationData.data.nivel,
              reputacao: reputationData.data.pontos,
              saldo_pontos: user.saldo_pontos || 0
            });
          } else {
            // Se não conseguir buscar reputação, usa dados do localStorage
            setUserData(user);
          }
        } else {
          setUserData(user);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      // Em caso de erro, tenta usar dados do localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns?status=ativa`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
        setFilteredCampaigns(data.data); // Inicialmente sem filtros
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = (campaignId) => {
    navigate(`/questionnaire/${campaignId}`);
  };

  const getProgressPercentage = (atual, alvo) => {
    return Math.min((atual / alvo) * 100, 100);
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleFilterChange = (filters) => {
    let filtered = [...campaigns];

    // Filtrar por tema
    if (filters.tema) {
      filtered = filtered.filter(campaign => 
        campaign.tema?.toLowerCase() === filters.tema.toLowerCase()
      );
    }
