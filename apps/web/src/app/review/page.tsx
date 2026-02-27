'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/Layout'
import { Check, X, RefreshCw, ChevronLeft, ChevronRight, Image, Video, Filter } from 'lucide-react'

type ReviewItem = {
  id: string
  type: 'image' | 'video'
  projectName: string
  prompt: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const mockItems: ReviewItem[] = [
  { id: '1', type: 'image', projectName: '国家电网宣传片', prompt: '现代化变电站，蓝天白云背景，专业摄影风格', status: 'pending', createdAt: '2024-01-15 10:30' },
  { id: '2', type: 'image', projectName: '国家电网宣传片', prompt: '智能电网调度中心，大屏幕显示数据', status: 'pending', createdAt: '2024-01-15 10:32' },
  { id: '3', type: 'video', projectName: '央视纪录片', prompt: '城市天际线延时摄影，日出场景', status: 'pending', createdAt: '2024-01-15 11:00' },
  { id: '4', type: 'image', projectName: '央视纪录片', prompt: '传统工艺制作场景，温暖光线', status: 'approved', createdAt: '2024-01-15 09:15' },
  { id: '5', type: 'video', projectName: '新能源专题', prompt: '风力发电场航拍，云层流动', status: 'rejected', createdAt: '2024-01-14 16:20' },
]

export default function ReviewPage() {
  const [items, setItems] = useState(mockItems)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [comment, setComment] = useState('')

  const filteredItems = items.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false
    if (selectedType !== 'all' && item.type !== selectedType) return false
    return true
  })

  const currentItem = filteredItems[currentIndex]

  const handleApprove = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ))
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    setComment('')
  }

  const handleReject = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ))
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    setComment('')
  }

  const handleRegenerate = (id: string) => {
    alert(`已提交重新生成请求: ${id}`)
  }

  const pendingCount = items.filter(i => i.status === 'pending').length
  const approvedCount = items.filter(i => i.status === 'approved').length
  const rejectedCount = items.filter(i => i.status === 'rejected').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">人工审核</h1>
            <p className="text-gray-500 mt-1">审核AI生成的图片和视频内容</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 font-medium">{pendingCount}</span>
              <span className="text-yellow-600 text-sm">待审核</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
              <span className="text-green-600 font-medium">{approvedCount}</span>
              <span className="text-green-600 text-sm">已通过</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-lg">
              <span className="text-red-600 font-medium">{rejectedCount}</span>
              <span className="text-red-600 text-sm">已拒绝</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as typeof filter)
                setCurrentIndex(0)
              }}
              className="input w-32"
            >
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setSelectedType('all')
                setCurrentIndex(0)
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedType === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => {
                setSelectedType('image')
                setCurrentIndex(0)
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                selectedType === 'image' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>图片</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('video')
                setCurrentIndex(0)
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                selectedType === 'video' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>视频</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentItem ? (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentItem.type === 'image' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {currentItem.type === 'image' ? '图片' : '视频'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentItem.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : currentItem.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {currentItem.status === 'pending' ? '待审核' : currentItem.status === 'approved' ? '已通过' : '已拒绝'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  {currentItem.type === 'image' ? (
                    <Image className="w-16 h-16 text-gray-600" />
                  ) : (
                    <Video className="w-16 h-16 text-gray-600" />
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-500">项目名称</span>
                    <p className="font-medium text-gray-900">{currentItem.projectName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">生成提示词</span>
                    <p className="text-gray-700">{currentItem.prompt}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">创建时间</span>
                    <p className="text-gray-700">{currentItem.createdAt}</p>
                  </div>
                </div>

                {currentItem.status === 'pending' && (
                  <>
                    <div className="mb-4">
                      <label className="label">审核备注（可选）</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input min-h-[80px]"
                        placeholder="输入审核意见或修改建议..."
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleApprove(currentItem.id)}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2"
                      >
                        <Check className="w-5 h-5" />
                        <span>通过</span>
                      </button>
                      <button
                        onClick={() => handleReject(currentItem.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-5 h-5" />
                        <span>拒绝</span>
                      </button>
                      <button
                        onClick={() => handleRegenerate(currentItem.id)}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>重新生成</span>
                      </button>
                    </div>
                  </>
                )}

                {currentItem.status !== 'pending' && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleRegenerate(currentItem.id)}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>重新生成</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>上一个</span>
                  </button>
                  <button
                    onClick={() => setCurrentIndex(Math.min(filteredItems.length - 1, currentIndex + 1))}
                    disabled={currentIndex === filteredItems.length - 1}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <span>下一个</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">暂无待审核内容</h3>
                <p className="text-gray-500 mt-2">所有内容都已审核完成</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">审核队列</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    index === currentIndex
                      ? 'bg-primary-50 border border-primary-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.type === 'image' ? (
                        <Image className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Video className="w-4 h-4 text-purple-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {item.projectName}
                      </span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'pending' ? 'bg-yellow-500' :
                      item.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
