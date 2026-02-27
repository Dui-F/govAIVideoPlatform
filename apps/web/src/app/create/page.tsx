'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/Layout'
import { Sparkles, Image, Video, RefreshCw, Download, ChevronRight } from 'lucide-react'

interface ArtStyle {
  id: string
  name: string
  preview: string
}

const artStyles: ArtStyle[] = [
  { id: '1', name: '新闻联播风格', preview: '/styles/news.png' },
  { id: '2', name: '纪录片风格', preview: '/styles/documentary.png' },
  { id: '3', name: '宣传片风格', preview: '/styles/promo.png' },
  { id: '4', name: '动画风格', preview: '/styles/animation.png' },
  { id: '5', name: '水墨风格', preview: '/styles/ink.png' },
  { id: '6', name: '科技风格', preview: '/styles/tech.png' },
]

const steps = [
  { id: 1, name: '生成脚本', description: '输入主题，AI生成视频脚本' },
  { id: 2, name: '选择画风', description: '选择适合的视频风格' },
  { id: 3, name: '批量出图', description: '根据脚本生成图片' },
  { id: 4, name: '批量生视频', description: '将图片转换为视频' },
]

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [scriptTopic, setScriptTopic] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])

  const handleGenerateScript = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGeneratedScript(`【视频脚本】

场景一：开场
画面：城市天际线，晨光初现
旁白：在这片充满希望的土地上，新时代的画卷正在徐徐展开...

场景二：发展成就
画面：现代化工厂、高铁飞驰、港口繁忙
旁白：高质量发展迈出坚实步伐，现代化产业体系加快构建...

场景三：民生福祉
画面：社区服务中心、医院、学校
旁白：坚持以人民为中心，民生福祉持续改善...

场景四：展望未来
画面：科技园区、创新实验室
旁白：站在新的历史起点，我们满怀信心，砥砺前行...`)
    setIsGenerating(false)
    setCurrentStep(2)
  }

  const handleSelectStyle = (styleId: string) => {
    setSelectedStyle(styleId)
  }

  const handleGenerateImages = async () => {
    if (!selectedStyle) return
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setImages([
      '/placeholder-image-1.jpg',
      '/placeholder-image-2.jpg',
      '/placeholder-image-3.jpg',
      '/placeholder-image-4.jpg',
    ])
    setIsGenerating(false)
    setCurrentStep(4)
  }

  const handleGenerateVideos = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 4000))
    setVideos([
      '/placeholder-video-1.mp4',
      '/placeholder-video-2.mp4',
      '/placeholder-video-3.mp4',
      '/placeholder-video-4.mp4',
    ])
    setIsGenerating(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI视频制作</h1>
          <p className="text-gray-500 mt-1">从脚本到成片，一站式AI视频制作</p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                currentStep >= step.id 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? 'bg-primary-600 text-white' : 'bg-gray-300 text-white'
                }`}>
                  {step.id}
                </span>
                <span className="font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">第一步：生成脚本</h2>
            <div className="space-y-4">
              <div>
                <label className="label">视频主题</label>
                <textarea
                  value={scriptTopic}
                  onChange={(e) => setScriptTopic(e.target.value)}
                  className="input min-h-[100px]"
                  placeholder="请输入视频主题，例如：介绍国家电网在新能源领域的发展成就..."
                />
              </div>
              <button
                onClick={handleGenerateScript}
                disabled={isGenerating || !scriptTopic.trim()}
                className="btn-gov flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? '生成中...' : '生成脚本'}</span>
              </button>
            </div>

            {generatedScript && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">生成的脚本</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-600">{generatedScript}</pre>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">第二步：选择画风</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {artStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelectStyle(style.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-video bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{style.name}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                上一步
              </button>
              <button
                onClick={handleGenerateImages}
                disabled={isGenerating || !selectedStyle}
                className="btn-gov flex items-center space-x-2 disabled:opacity-50"
              >
                <Image className="w-5 h-5" />
                <span>{isGenerating ? '生成中...' : '批量出图'}</span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">第三步：批量出图</h2>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600">正在生成图片，请稍候...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">第四步：批量生视频</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                    场景 {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerateVideos}
              disabled={isGenerating}
              className="btn-gov flex items-center space-x-2 disabled:opacity-50"
            >
              <Video className="w-5 h-5" />
              <span>{isGenerating ? '生成中...' : '批量生成视频'}</span>
            </button>

            {videos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">生成的视频</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
