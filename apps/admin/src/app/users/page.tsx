'use client'

import { useState } from 'react'
import AdminLayout from '@/components/Layout'
import { Search, Edit, Trash2, UserPlus, Shield, User } from 'lucide-react'

interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user' | 'reviewer'
  avatarUrl: string | null
  createdAt: string
  lastLoginAt: string | null
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@gov.cn',
    fullName: '系统管理员',
    role: 'admin',
    avatarUrl: null,
    createdAt: '2024-01-01',
    lastLoginAt: '2024-01-15 10:30',
  },
  {
    id: '2',
    email: 'reviewer1@cctv.com',
    fullName: '张审核',
    role: 'reviewer',
    avatarUrl: null,
    createdAt: '2024-01-05',
    lastLoginAt: '2024-01-15 09:15',
  },
  {
    id: '3',
    email: 'user1@sgcc.com',
    fullName: '李制作',
    role: 'user',
    avatarUrl: null,
    createdAt: '2024-01-08',
    lastLoginAt: '2024-01-14 16:45',
  },
  {
    id: '4',
    email: 'user2@cctv.com',
    fullName: '王编导',
    role: 'user',
    avatarUrl: null,
    createdAt: '2024-01-10',
    lastLoginAt: '2024-01-15 08:00',
  },
]

const roleLabels = {
  admin: '管理员',
  user: '普通用户',
  reviewer: '审核员',
}

const roleColors = {
  admin: 'bg-red-100 text-red-700',
  user: 'bg-blue-100 text-blue-700',
  reviewer: 'bg-green-100 text-green-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'user' as User['role'],
    password: '',
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        password: '',
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: '',
        fullName: '',
        role: 'user',
        password: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, email: formData.email, fullName: formData.fullName, role: formData.role }
          : u
      ))
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        avatarUrl: null,
        createdAt: new Date().toISOString().split('T')[0],
        lastLoginAt: null,
      }
      setUsers([...users, newUser])
    }
    
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
            <p className="text-gray-500 mt-1">管理系统用户和权限</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>新增用户</span>
          </button>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
                placeholder="搜索用户邮箱或姓名..."
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input w-32"
            >
              <option value="all">全部角色</option>
              <option value="admin">管理员</option>
              <option value="reviewer">审核员</option>
              <option value="user">普通用户</option>
            </select>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>邮箱</th>
                  <th>角色</th>
                  <th>创建时间</th>
                  <th>最后登录</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>{user.lastLoginAt || '从未登录'}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className={`w-4 h-4 ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser ? '编辑用户' : '新增用户'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">姓名 *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">邮箱 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="label">初始密码 *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    required={!editingUser}
                  />
                </div>
              )}

              <div>
                <label className="label">角色 *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="input"
                >
                  <option value="user">普通用户</option>
                  <option value="reviewer">审核员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingUser ? '保存修改' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
