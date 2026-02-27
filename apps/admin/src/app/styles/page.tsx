'use client'

import { useState } from 'react'
import AdminLayout from '@/components/Layout'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'

interface ArtStyle {
  id: string
  name: string
  description: string
  promptTemplate: string
  negativePrompt: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

const mockStyles: ArtStyle[] = [
  {
    id: '1',
    name: '新闻联播风格',
    description: '央视新闻联播经典风格，庄重大气',
    promptTemplate: 'professional news broadcast style, formal atmosphere, studio lighting, 4K quality',
    negativePrompt: 'cartoon, anime, low quality, blurry',
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: '纪录片风格',
    description: '纪录片质感，真实自然',
    promptTemplate: 'documentary style, natural lighting, cinematic, realistic, high detail',
    negativePrompt: 'artificial, staged, low quality',
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-11',
  },
  {
    id: '3',
    name: '宣传片风格',
    description: '企业宣传片风格，现代感强',
    promptTemplate: 'corporate promotional video, modern, sleek, professional, dynamic camera',
    negativePrompt: 'amateur, low quality, shaky',
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    name: '水墨风格',
    description: '中国传统水墨画风格',
    promptTemplate: 'Chinese ink painting style, traditional art, elegant, brush strokes, watercolor',
    negativePrompt: 'modern, digital, photorealistic',
    isActive: false,
    sortOrder: 4,
    createdAt: '2024-01-13',
  },
]

export default function StylesPage() {
  const [styles, setStyles] = useState(mockStyles)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingStyle, setEditingStyle] = useState<ArtStyle | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promptTemplate: '',
    negativePrompt: '',
    isActive: true,
  })

  const filteredStyles = styles.filter(style =>
    style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    style.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (style?: ArtStyle) => {
    if (style) {
      setEditingStyle(style)
      setFormData({
        name: style.name,
        description: style.description,
        promptTemplate: style.promptTemplate,
        negativePrompt: style.negativePrompt,
        isActive: style.isActive,
      })
    } else {
      setEditingStyle(null)
      setFormData({
        name: '',
        description: '',
        promptTemplate: '',
        negativePrompt: '',
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStyle(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingStyle) {
      setStyles(styles.map(s => 
        s.id === editingStyle.id 
          ? { ...s, ...formData }
          : s
      ))
    } else {
      const newStyle: ArtStyle = {
        id: Date.now().toString(),
        ...formData,
        sortOrder: styles.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setStyles([...styles, newStyle])
    }
    
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个画风模板吗？')) {
      setStyles(styles.filter(s => s.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setStyles(styles.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">画风管理</h1>
            <p className="text-gray-500 mt-1">管理AI视频生成的画风模板</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>新增画风</span>
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
                placeholder="搜索画风名称或描述..."
              />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>排序</th>
                  <th>画风名称</th>
                  <th>描述</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStyles.map((style) => (
                  <tr key={style.id}>
                    <td>{style.sortOrder}</td>
                    <td className="font-medium">{style.name}</td>
                    <td className="max-w-xs truncate">{style.description}</td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(style.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          style.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {style.isActive ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td>{style.createdAt}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(style)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(style.id)}
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
                {editingStyle ? '编辑画风' : '新增画风'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">画风名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
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
                <label className="label">提示词模板 *</label>
                <textarea
                  value={formData.promptTemplate}
                  onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                  className="input min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="label">负面提示词</label>
                <textarea
                  value={formData.negativePrompt}
                  onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
                  className="input min-h-[80px]"
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
                <label htmlFor="isActive" className="text-sm text-gray-700">启用此画风</label>
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
                  {editingStyle ? '保存修改' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
