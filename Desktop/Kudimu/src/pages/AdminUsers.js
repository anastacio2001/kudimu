import React, { useState, useEffect } from 'react';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [perfilFilter, setPerfilFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, perfilFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (perfilFilter) params.append('perfil', perfilFilter);

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || 'Erro ao carregar usuários');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Usuário atualizado com sucesso!');
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro ao atualizar usuário');
    }
  };

  const toggleUserStatus = (user) => {
    const newStatus = user.ativo === 1 ? 0 : 1;
    if (confirm(`Deseja ${newStatus === 1 ? 'ativar' : 'desativar'} ${user.nome}?`)) {
      handleUpdateUser(user.id, { ativo: newStatus });
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>👥 Gerenciar Usuários</h1>
        <p>Total: {pagination?.total || 0} usuários cadastrados</p>
      </header>

      {/* Filtros e Busca */}
      <section className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-primary">🔍 Buscar</button>
        </form>

        <div className="filters-row">
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>

          <select 
            value={perfilFilter} 
            onChange={(e) => { setPerfilFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">Todos os Perfis</option>
            <option value="cidadao">Cidadão</option>
            <option value="empresa">Empresa</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </section>

      {/* Tabela de Usuários */}
      {loading ? (
        <div className="loading">Carregando usuários...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Reputação</th>
                  <th>Respostas</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={user.ativo === 0 ? 'user-inactive' : ''}>
                    <td>
                      <strong>{user.nome}</strong>
                      {user.perfil === 'admin' && <span className="badge-admin">👑 Admin</span>}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge-perfil badge-${user.perfil}`}>
                        {user.perfil}
                      </span>
                    </td>
                    <td>
                      <span className="reputation-badge">
                        ⭐ {user.reputacao}
                      </span>
                    </td>
                    <td>{user.total_respostas || 0}</td>
                    <td>
                      <span className={`status-badge ${user.ativo === 1 ? 'active' : 'inactive'}`}>
                        {user.ativo === 1 ? '✓ Ativo' : '✗ Inativo'}
                      </span>
                    </td>
                    <td>{new Date(user.data_cadastro).toLocaleDateString('pt-AO')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="btn-icon"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className="btn-icon"
                          title={user.ativo === 1 ? 'Desativar' : 'Ativar'}
                        >
                          {user.ativo === 1 ? '🚫' : '✅'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-pagination"
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="btn-pagination"
              >
                Próximo →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de Edição */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    perfil: user.perfil,
    reputacao: user.reputacao,
    saldo_pontos: user.saldo_pontos,
    ativo: user.ativo
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Usuário</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={user.nome} disabled className="input-disabled" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={user.email} disabled className="input-disabled" />
          </div>

          <div className="form-group">
            <label>Perfil</label>
            <select
              value={formData.perfil}
              onChange={(e) => setFormData({...formData, perfil: e.target.value})}
              className="form-select"
            >
              <option value="cidadao">Cidadão</option>
              <option value="empresa">Empresa</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reputação</label>
              <input
                type="number"
                value={formData.reputacao}
                onChange={(e) => setFormData({...formData, reputacao: parseInt(e.target.value)})}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Saldo Pontos</label>
              <input
                type="number"
                value={formData.saldo_pontos}
                onChange={(e) => setFormData({...formData, saldo_pontos: parseFloat(e.target.value)})}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.ativo === 1}
                onChange={(e) => setFormData({...formData, ativo: e.target.checked ? 1 : 0})}
              />
              <span>Usuário Ativo</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              💾 Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
