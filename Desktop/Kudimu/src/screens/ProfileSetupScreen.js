import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSetupScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

const INTERESTS = [
  { id: 'consumo', name: 'Consumo', icon: '🛒', description: 'Produtos e serviços' },
  { id: 'saude', name: 'Saúde', icon: '🏥', description: 'Bem-estar e medicina' },
  { id: 'educacao', name: 'Educação', icon: '📚', description: 'Ensino e formação' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', description: 'Mobilidade urbana' },
  { id: 'tecnologia', name: 'Tecnologia', icon: '💻', description: 'Digital e inovação' },
  { id: 'alimentacao', name: 'Alimentação', icon: '🍕', description: 'Comida e bebidas' },
  { id: 'entretenimento', name: 'Entretenimento', icon: '🎬', description: 'Lazer e diversão' },
  { id: 'financas', name: 'Finanças', icon: '💰', description: 'Bancos e seguros' },
  { id: 'moda', name: 'Moda', icon: '👔', description: 'Roupas e acessórios' },
  { id: 'casa', name: 'Casa', icon: '🏠', description: 'Lar e decoração' }
];

const PROVINCIAS = [
  'Luanda', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Lunda Norte',
  'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
];

const MUNICIPIOS = {
  'Luanda': ['Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Luanda', 'Quiçama', 'Viana'],
  'Bengo': ['Ambriz', 'Bula Atumba', 'Dande', 'Dembos', 'Nambuangongo', 'Pango Aluquém'],
  'Benguela': ['Balombo', 'Baía Farta', 'Benguela', 'Bocoio', 'Caimbambo', 'Catumbela', 'Chongorói', 'Cubal', 'Ganda', 'Lobito'],
  'Huambo': ['Bailundo', 'Cachiungo', 'Caála', 'Ecunha', 'Huambo', 'Londuimbali', 'Longonjo', 'Mungo', 'Chicala-Choloanga', 'Chinjenje', 'Ucuma'],
  // Adicione mais municípios conforme necessário
};

const REWARD_PREFERENCES = [
  { id: 'dinheiro', name: 'Dinheiro (AOA)', icon: '💵', description: 'Receba pagamento em dinheiro via transferência bancária' },
  { id: 'unitel', name: 'Dados Móveis Unitel', icon: '📱', description: 'Recargas de internet para Unitel' },
  { id: 'movicel', name: 'Dados Móveis Movicel', icon: '📲', description: 'Recargas de internet para Movicel' },
  { id: 'ekwanza', name: 'e-Kwanza', icon: '💳', description: 'Transferência para conta e-Kwanza' },
  { id: 'paypay', name: 'PayPay', icon: '💸', description: 'Transferência para conta PayPay' }
];

export default function ProfileSetupScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State para dados do formulário
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [provincia, setProvincia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [rewardPreference, setRewardPreference] = useState('');

  // Validação de cada etapa
  const canProceedStep1 = selectedInterests.length >= 3;
  const canProceedStep2 = provincia && municipio;
  const canProceedStep3 = rewardPreference !== '';

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleProvinciaChange = (newProvincia) => {
    setProvincia(newProvincia);
    setMunicipio(''); // Reset município quando província muda
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && !canProceedStep1) {
      setError('Selecione pelo menos 3 interesses');
      return;
    }
    if (currentStep === 2 && !canProceedStep2) {
      setError('Selecione província e município');
      return;
    }
    if (currentStep === 3 && !canProceedStep3) {
      setError('Selecione uma preferência de recompensa');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSkip = () => {
    // Permitir pular onboarding, mas marcar como incompleto
    navigate('/campaigns');
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const profileData = {
        interesses: selectedInterests,
        provincia,
        municipio,
        preferencia_recompensa: rewardPreference,
        onboarding_completo: true
      };

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar localStorage com dados do perfil
        const updatedUser = {
          ...user,
          ...profileData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Pequeno delay para mostrar animação de sucesso
        setTimeout(() => {
          navigate('/campaigns');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao salvar preferências');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h2 className="step-title">Quais são seus interesses?</h2>
      <p className="step-description">
        Selecione pelo menos 3 áreas de interesse. Isso nos ajudará a recomendar 
        campanhas mais relevantes para você.
      </p>

      <div className="interests-grid">
        {INTERESTS.map(interest => (
          <div
            key={interest.id}
            className={`interest-card ${selectedInterests.includes(interest.id) ? 'selected' : ''}`}
            onClick={() => handleInterestToggle(interest.id)}
          >
            <div className="interest-icon">{interest.icon}</div>
            <div className="interest-name">{interest.name}</div>
            <div className="interest-description">{interest.description}</div>
          </div>
        ))}
      </div>

      {selectedInterests.length > 0 && selectedInterests.length < 3 && (
        <p className="form-hint" style={{ marginTop: '1rem' }}>
          Selecione mais {3 - selectedInterests.length} interesse(s)
        </p>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="step-title">Onde você está localizado?</h2>
      <p className="step-description">
        Informe sua localização para receber campanhas disponíveis na sua região.
      </p>

      <div className="location-form">
        <div className="form-group">
          <label className="form-label">
            📍 Província
          </label>
          <select
            className="form-select"
            value={provincia}
            onChange={(e) => handleProvinciaChange(e.target.value)}
          >
            <option value="">Selecione a província</option>
            {PROVINCIAS.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            🏘️ Município
          </label>
          <select
            className="form-select"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            disabled={!provincia}
          >
            <option value="">Selecione o município</option>
            {provincia && MUNICIPIOS[provincia] ? (
              MUNICIPIOS[provincia].map(mun => (
                <option key={mun} value={mun}>{mun}</option>
              ))
            ) : (
              <option value="">Primeiro selecione a província</option>
            )}
          </select>
          {!provincia && (
            <p className="form-hint">Selecione primeiro uma província</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="step-title">Como prefere receber suas recompensas?</h2>
      <p className="step-description">
        Escolha seu método preferido de pagamento. Você poderá alterar isso depois.
      </p>

      <div className="reward-preferences">
        {REWARD_PREFERENCES.map(pref => (
          <div
            key={pref.id}
            className={`reward-option ${rewardPreference === pref.id ? 'selected' : ''}`}
            onClick={() => setRewardPreference(pref.id)}
          >
            <div className="reward-radio" />
            <div className="reward-icon">{pref.icon}</div>
            <div className="reward-info">
              <div className="reward-name">{pref.name}</div>
              <div className="reward-desc">{pref.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedInterestNames = INTERESTS
      .filter(i => selectedInterests.includes(i.id))
      .map(i => i.name);

    const selectedRewardName = REWARD_PREFERENCES
      .find(p => p.id === rewardPreference)?.name;

    return (
      <div>
        {loading ? (
          <div className="success-animation">
            <div className="success-checkmark">✅</div>
            <h2 className="step-title">Configurando seu perfil...</h2>
            <p className="step-description">Aguarde um momento</p>
          </div>
        ) : (
          <>
            <div className="welcome-message">
              <div className="welcome-icon">🎉</div>
              <h3>Tudo pronto para começar!</h3>
              <p>Revise suas preferências antes de finalizar</p>
            </div>

            <div className="confirmation-summary">
              <div className="summary-section">
                <h3 className="summary-title">
                  💡 Seus Interesses
                </h3>
                <div className="summary-tags">
                  {selectedInterestNames.map(name => (
                    <span key={name} className="summary-tag">{name}</span>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">
                  📍 Localização
                </h3>
                <div className="summary-content">
                  <strong>{provincia}</strong> - {municipio}
                </div>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">
                  💰 Preferência de Recompensa
                </h3>
                <div className="summary-content">
                  {selectedRewardName}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="profile-setup-screen">
      <div className="setup-container">
        <div className="setup-header">
          <h1>👋 Bem-vindo ao Kudimu!</h1>
          <p>Vamos personalizar sua experiência em apenas 4 passos</p>
        </div>

        {/* Progress Stepper */}
        <div className="progress-stepper">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className="step-label">Interesses</div>
          </div>

          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <div className="step-label">Localização</div>
          </div>

          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <div className="step-label">Recompensas</div>
          </div>

          <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 4 ? '✓' : '4'}
            </div>
            <div className="step-label">Confirmação</div>
          </div>
        </div>

        {/* Content */}
        <div className="setup-content">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* Actions */}
        {!loading && (
          <div className="setup-actions">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="button button-back"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                ← Voltar
              </button>
              
              {currentStep < 4 && (
                <button
                  className="button button-skip"
                  onClick={handleSkip}
                >
                  Pular
                </button>
              )}
            </div>

            {currentStep < 4 ? (
              <button
                className="button button-next"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                }
              >
                Próximo →
              </button>
            ) : (
              <button
                className="button button-finish"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" />
                    Salvando...
                  </>
                ) : (
                  <>
                    ✓ Finalizar
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
