import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    localizacao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          navigate('/campaigns');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h1>📝 Criar Conta</h1>
          <p>Junte-se à comunidade Kudimu Insights</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ Conta criada com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-field">
            <label>Nome Completo *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="João Silva"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Senha * (mínimo 8 caracteres)</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              placeholder="••••••••"
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Telefone</label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              placeholder="+244 923 456 789"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Localização</label>
            <input
              type="text"
              value={formData.localizacao}
              onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
              placeholder="Luanda"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-signup"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : '🚀 Criar Conta'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Já tem uma conta?{' '}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              Entrar
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 20px;
        }

        .signup-box {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 500px;
          padding: 40px;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .signup-header h1 {
          font-size: 32px;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .signup-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-error {
          background: #fee;
          color: #c33;
          border-left: 4px solid #c33;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border-left: 4px solid #28a745;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .form-field input {
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-field input:focus {
          outline: none;
          border-color: #f5576c;
        }

        .form-field input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .btn-signup {
          padding: 16px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 10px;
        }

        .btn-signup:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(245, 87, 108, 0.3);
        }

        .btn-signup:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signup-footer {
          text-align: center;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #e0e0e0;
        }

        .signup-footer p {
          color: #666;
          font-size: 14px;
        }

        .signup-footer a {
          color: #f5576c;
          font-weight: 600;
          text-decoration: none;
        }

        .signup-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
