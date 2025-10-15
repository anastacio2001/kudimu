import React, { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isUserSubscribed,
  showLocalNotification,
  NotificationTypes
} from '../utils/pushNotifications';
import './NotificationSettings.css';

export default function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    newCampaigns: true,
    levelUp: true,
    medals: true,
    rewards: true,
    reminders: true
  });

  useEffect(() => {
    checkNotificationStatus();
    loadPreferences();
  }, []);

  const checkNotificationStatus = async () => {
    const isSupported = isNotificationSupported();
    setSupported(isSupported);

    if (isSupported) {
      const perm = getNotificationPermission();
      setPermission(perm);

      if (perm === 'granted') {
        const isSub = await isUserSubscribed();
        setSubscribed(isSub);
      }
    }
  };

  const loadPreferences = () => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPrefs));
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        await subscribeToPushNotifications();
        setPermission('granted');
        setSubscribed(true);

        // Mostra notificação de boas-vindas
        await showLocalNotification(
          '🎉 Notificações Ativadas!',
          {
            body: 'Você será notificado sobre novas campanhas e recompensas.',
            tag: 'welcome',
            requireInteraction: false
          }
        );
      } else {
        setPermission('denied');
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      alert('Erro ao ativar notificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      
      if (success) {
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Erro ao desativar notificações:', error);
      alert('Erro ao desativar notificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = (key) => {
    const newPrefs = {
      ...preferences,
      [key]: !preferences[key]
    };
    savePreferences(newPrefs);
  };

  const handleTestNotification = async () => {
    try {
      await showLocalNotification(
        '🧪 Notificação de Teste',
        {
          body: 'Se você está vendo isso, as notificações estão funcionando! 🎉',
          tag: 'test',
          requireInteraction: false
        }
      );
    } catch (error) {
      console.error('Erro ao testar notificação:', error);
      alert('Erro ao enviar notificação de teste.');
    }
  };

  if (!supported) {
    return (
      <div className="notification-settings">
        <div className="not-supported">
          <h3>❌ Notificações Não Suportadas</h3>
          <p>Seu navegador não suporta notificações push.</p>
          <p className="suggestion">
            Tente usar Chrome, Firefox, Edge ou Safari mais recentes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h2>🔔 Configurações de Notificações</h2>
        <p>Gerencie como você recebe notificações do Kudimu Insights</p>
      </div>

      {/* Status */}
      <div className="notification-status">
        <div className="status-card">
          <div className="status-icon">
            {permission === 'granted' && subscribed ? '✅' : permission === 'denied' ? '❌' : '⚠️'}
          </div>
          <div className="status-info">
            <h3>Status das Notificações</h3>
            <p className={`status-text ${permission}`}>
              {permission === 'granted' && subscribed && 'Ativadas e funcionando'}
              {permission === 'granted' && !subscribed && 'Permissão concedida, mas não subscrito'}
              {permission === 'denied' && 'Bloqueadas pelo navegador'}
              {permission === 'default' && 'Aguardando permissão'}
            </p>
          </div>
        </div>

        {permission === 'denied' && (
          <div className="help-box denied">
            <h4>📌 Como desbloquear notificações:</h4>
            <ol>
              <li>Clique no ícone de cadeado/informação na barra de endereço</li>
              <li>Encontre "Notificações" nas configurações</li>
              <li>Altere para "Permitir"</li>
              <li>Recarregue a página</li>
            </ol>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="notification-actions">
        {permission === 'default' && (
          <button 
            onClick={handleEnableNotifications}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Ativando...' : '🔔 Ativar Notificações'}
          </button>
        )}

        {permission === 'granted' && !subscribed && (
          <button 
            onClick={handleEnableNotifications}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Subscrevendo...' : '✅ Subscrever Notificações'}
          </button>
        )}

        {permission === 'granted' && subscribed && (
          <>
            <button 
              onClick={handleDisableNotifications}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Desativando...' : '🔕 Desativar Notificações'}
            </button>

            <button 
              onClick={handleTestNotification}
              className="btn-test"
            >
              🧪 Testar Notificação
            </button>
          </>
        )}
      </div>

      {/* Preferências */}
      {permission === 'granted' && subscribed && (
        <div className="notification-preferences">
          <h3>⚙️ Preferências de Notificações</h3>
          <p>Escolha que tipos de notificações você deseja receber:</p>

          <div className="preferences-list">
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🎯</span>
                <div>
                  <h4>Novas Campanhas</h4>
                  <p>Notificações quando campanhas relevantes estiverem disponíveis</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.newCampaigns}
                  onChange={() => handleTogglePreference('newCampaigns')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🎉</span>
                <div>
                  <h4>Subida de Nível</h4>
                  <p>Notificações quando você alcançar um novo nível de reputação</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.levelUp}
                  onChange={() => handleTogglePreference('levelUp')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🏅</span>
                <div>
                  <h4>Medalhas Conquistadas</h4>
                  <p>Notificações quando você ganhar novas medalhas</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.medals}
                  onChange={() => handleTogglePreference('medals')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">💰</span>
                <div>
                  <h4>Recompensas Recebidas</h4>
                  <p>Notificações sobre recompensas e pagamentos processados</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.rewards}
                  onChange={() => handleTogglePreference('rewards')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">⏰</span>
                <div>
                  <h4>Lembretes</h4>
                  <p>Lembretes periódicos sobre campanhas pendentes</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.reminders}
                  onChange={() => handleTogglePreference('reminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="notification-info">
        <h4>ℹ️ Sobre as Notificações</h4>
        <ul>
          <li>As notificações funcionam mesmo quando o site está fechado</li>
          <li>Você pode desativar a qualquer momento</li>
          <li>Respeitamos sua privacidade e não enviamos spam</li>
          <li>Notificações são enviadas apenas para eventos importantes</li>
        </ul>
      </div>
    </div>
  );
}
