'use client'

import { useState } from 'react'
import AdminLayout from '@/components/Layout'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

interface PromptTemplate {
  id: string
  name: string
  category: 'style' | 'transition' | 'scene' | 'character'
  promptContent: string
  description: string
  isActive: boolean
  createdAt: string
}

const mockPrompts: PromptTemplate[] = [
  {
    id: '1',
    name: '新闻开场',
    category: 'scene',
    promptContent: 'news broadcast opening, studio setting, anchor desk, professional lighting, breaking news graphics',
    description: '新闻节目开场场景',
    isActive: true,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: '平滑转场',
    category: 'transition',
    promptContent: 'smooth transition, cross dissolve, seamless blend, gradual fade, motion blur',
    description: '通用平滑转场效果',
    isActive: true,
    createdAt: '2024-01-11',
  },
  {
    id: '3',
    name: '企业人物',
    category: 'character',
    promptContent: 'professional business person, corporate attire, confident expression, office background, soft lighting',
    description: '企业宣传片人物形象',
    isActive: true,
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    name: '科技风格',
    category: 'style',
    promptContent: 'futuristic technology style, holographic elements, blue neon accents, clean modern design, digital interface',
    description: '科技感视觉风格',
    isActive: true,
    createdAt: '2024-01-13',
  },
]

const categoryLabels = {
  style: '画风',
  transition: '转场',
  scene: '场景',
  character: '人物',
}

const categoryColors = {
  style: 'bg-purple-100 text-purple-700',
  transition: 'bg-blue-100 text-blue-700',
  scene: 'bg-green-100 text-green-700',
  character: 'bg-orange-100 text-orange-700',
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState(mockPrompts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'style' as PromptTemplate['category'],
    promptContent: '',
    description: '',
    isActive: true,
  })

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || prompt.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (prompt?: PromptTemplate) => {
    if (prompt) {
      setEditingPrompt(prompt)
      setFormData({
        name: prompt.name,
        category: prompt.category,
        promptContent: prompt.promptContent,
        description: prompt.description,
        isActive: prompt.isActive,
      })
    } else {
      setEditingPrompt(null)
      setFormData({
        name: '',
        category: 'style',
        promptContent: '',
        description: '',
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPrompt(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPrompt) {
      setPrompts(prompts.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...formData }
          : p
      ))
    } else {
      const newPrompt: PromptTemplate = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setPrompts([...prompts, newPrompt])
    }
    
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个提示词模板吗？')) {
      setPrompts(prompts.filter(p => p.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setPrompts(prompts.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">提示词管理</h1>
            <p className="text-gray-500 mt-1">管理AI生成使用的提示词模板</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>新增提示词</span>
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
                placeholder="搜索提示词名称或描述..."
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input w-32"
            >
              <option value="all">全部分类</option>
              <option value="style">画风</option>
              <option value="transition">转场</option>
              <option value="scene">场景</option>
              <option value="character">人物</option>
            </select>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>分类</th>
                  <th>描述</th>
                  <th>提示词内容</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id}>
                    <td className="font-medium">{prompt.name}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[prompt.category]}`}>
                        {categoryLabels[prompt.category]}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">{prompt.description}</td>
                    <td className="max-w-xs truncate text-gray-500">{prompt.promptContent}</td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(prompt.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          prompt.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {prompt.isActive ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td>{prompt.createdAt}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(prompt)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prompt.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPrompt ? '编辑提示词' : '新增提示词'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">分类 *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as PromptTemplate['category'] })}
                  className="input"
                >
                  <option value="style">画风</option>
                  <option value="transition">转场</option>
                  <option value="scene">场景</option>
                  <option value="character">人物</option>
                </select>
              </div>

              <div>
                <label className="label">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[80px]"
                />
              </div>

              <div>
                <label className="label">提示词内容 *</label>
                <textarea
                  value={formData.promptContent}
                  onChange={(e) => setFormData({ ...formData, promptContent: e.target.value })}
                  className="input min-h-[120px]"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">启用此提示词</label>
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
                  {editingPrompt ? '保存修改' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
