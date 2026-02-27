'use client'

import { useState, useCallback } from 'react'
import DashboardLayout from '@/components/Layout'
import { Upload, FileVideo, Sparkles, Save, RefreshCw } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface AnalysisResult {
  stylePrompt: string
  transitionPrompt: string
  keyFrames: string[]
}

export default function LearnPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setAnalysisResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1
  })

  const handleAnalyze = async () => {
    if (!uploadedFile) return
    
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    setAnalysisResult({
      stylePrompt: 'cinematic lighting, professional color grading, 4K quality, documentary style, smooth camera movement, shallow depth of field, warm tones, high contrast',
      transitionPrompt: 'smooth fade transition, cross dissolve, seamless blend between scenes, gradual color shift, motion blur effect',
      keyFrames: [
        'frame_001.jpg',
        'frame_002.jpg',
        'frame_003.jpg',
        'frame_004.jpg',
      ]
    })
    
    setIsAnalyzing(false)
  }

  const handleSaveAsTemplate = async () => {
    alert('画风模板保存成功！')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI视频学习</h1>
          <p className="text-gray-500 mt-1">上传视频，AI自动分析画风和转场提示词</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">上传视频</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-primary-600">松开鼠标上传视频</p>
              ) : (
                <div>
                  <p className="text-gray-600">拖拽视频文件到此处，或点击选择</p>
                  <p className="text-sm text-gray-400 mt-2">支持 MP4, MOV, AVI, MKV 格式</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileVideo className="w-8 h-8 text-primary-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg bg-black"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-4 btn-gov w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>分析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>开始分析</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">分析结果</h2>
            
            {!analysisResult ? (
              <div className="text-center py-12 text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>上传视频并点击分析后，结果将显示在这里</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="label">画风提示词</label>
                  <textarea
                    defaultValue={analysisResult.stylePrompt}
                    className="input min-h-[100px]"
                  />
                  <button
                    onClick={handleSaveAsTemplate}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存为画风模板</span>
                  </button>
                </div>

                <div>
                  <label className="label">转场提示词</label>
                  <textarea
                    defaultValue={analysisResult.transitionPrompt}
                    className="input min-h-[80px]"
                  />
                  <button
                    onClick={handleSaveAsTemplate}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存为转场模板</span>
                  </button>
                </div>

                <div>
                  <label className="label">关键帧</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">帧 {i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">快速操作</h3>
                  <div className="flex space-x-3">
                    <button className="btn-primary flex-1">
                      应用到新项目
                    </button>
                    <button className="btn-secondary flex-1">
                      导出报告
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">历史学习记录</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <FileVideo className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">视频_{i}.mp4</p>
                    <p className="text-sm text-gray-500">2024-01-{10 + i} 分析完成</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    已保存
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
