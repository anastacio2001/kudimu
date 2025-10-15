import React, { useEffect, useState } from 'react';
import { getReputationLevel } from './ReputationBadge';
import './NotificationToast.css';

export function LevelUpNotification({ newPoints, onClose }) {
  const [visible, setVisible] = useState(true);
  const level = getReputationLevel(newPoints);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400); // Aguarda animação de saída
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="notification-toast level-up">
      <div className="notification-header">
        <div className="notification-icon-wrapper">
          🎉
        </div>
        <button className="notification-close" onClick={() => setVisible(false)}>
          ×
        </button>
      </div>

      <div className="notification-content">
        <div className="notification-title">
          🎊 Parabéns! Você subiu de nível!
        </div>
        
        <div className="level-info">
          <div className="level-badge">{level.icon}</div>
          <div className="level-details">
            <div className="level-name">{level.name}</div>
            <div className="level-points">{newPoints} pontos de reputação</div>
          </div>
        </div>

        <div className="notification-message">
          Continue participando de campanhas para desbloquear mais benefícios!
        </div>
      </div>

      <div className="notification-progress">
        <div className="notification-progress-bar"></div>
      </div>
    </div>
  );
}

export function MedalNotification({ medal, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="notification-toast medal">
      <div className="notification-header">
        <div className="notification-icon-wrapper">
          🏅
        </div>
        <button className="notification-close" onClick={() => setVisible(false)}>
          ×
        </button>
      </div>

      <div className="notification-content">
        <div className="notification-title">
          🎖️ Nova Medalha Conquistada!
        </div>
        
        <div className="medal-showcase">
          <div className="medal-icon">{medal.icone}</div>
          <div className="medal-info">
            <div className="medal-name">{medal.nome}</div>
            <div className="medal-description">{medal.descricao}</div>
          </div>
        </div>
      </div>

      <div className="notification-progress">
        <div className="notification-progress-bar"></div>
      </div>
    </div>
  );
}

export function RewardNotification({ amount, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="notification-toast reward">
      <div className="notification-header">
        <div className="notification-icon-wrapper">
          💰
        </div>
        <button className="notification-close" onClick={() => setVisible(false)}>
          ×
        </button>
      </div>

      <div className="notification-content">
        <div className="notification-title">
          💵 Recompensa Recebida!
        </div>
        
        <div className="notification-message">
          Você recebeu <strong>{amount} AOA</strong> pela sua participação!
          Acesse a página de recompensas para solicitar o saque.
        </div>
      </div>

      <div className="notification-progress">
        <div className="notification-progress-bar"></div>
      </div>
    </div>
  );
}

export function InfoNotification({ title, message, icon = 'ℹ️', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="notification-toast info">
      <div className="notification-header">
        <div className="notification-icon-wrapper">
          {icon}
        </div>
        <button className="notification-close" onClick={() => setVisible(false)}>
          ×
        </button>
      </div>

      <div className="notification-content">
        <div className="notification-title">{title}</div>
        <div className="notification-message">{message}</div>
      </div>

      <div className="notification-progress">
        <div className="notification-progress-bar"></div>
      </div>
    </div>
  );
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const showLevelUp = (newPoints) => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id,
      type: 'levelup',
      data: { newPoints }
    }]);
  };

  const showMedal = (medal) => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id,
      type: 'medal',
      data: { medal }
    }]);
  };

  const showReward = (amount) => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id,
      type: 'reward',
      data: { amount }
    }]);
  };

  const showInfo = (title, message, icon) => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id,
      type: 'info',
      data: { title, message, icon }
    }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <>
      {notifications.map((notification) => {
        switch (notification.type) {
          case 'levelup':
            return (
              <LevelUpNotification
                key={notification.id}
                newPoints={notification.data.newPoints}
                onClose={() => removeNotification(notification.id)}
              />
            );
          case 'medal':
            return (
              <MedalNotification
                key={notification.id}
                medal={notification.data.medal}
                onClose={() => removeNotification(notification.id)}
              />
            );
          case 'reward':
            return (
              <RewardNotification
                key={notification.id}
                amount={notification.data.amount}
                onClose={() => removeNotification(notification.id)}
              />
            );
          case 'info':
            return (
              <InfoNotification
                key={notification.id}
                title={notification.data.title}
                message={notification.data.message}
                icon={notification.data.icon}
                onClose={() => removeNotification(notification.id)}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );

  return {
    showLevelUp,
    showMedal,
    showReward,
    showInfo,
    NotificationContainer
  };
}
