'use client'

import { useState } from 'react'
import { Edit3, Save, X, Trash2 } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface DrawablePolygonProps {
  onPolygonComplete: (points: Point[]) => void
  onClear: () => void
}

export default function DrawablePolygon({ onPolygonComplete, onClear }: DrawablePolygonProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [previewPoint, setPreviewPoint] = useState<Point | null>(null)

  const startDrawing = () => {
    setIsDrawing(true)
    setPoints([])
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPoints([...points, { x, y }])
  }

  const handleCanvasMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPreviewPoint({ x, y })
  }

  const completePolygon = () => {
    if (points.length >= 3) {
      onPolygonComplete(points)
      setIsDrawing(false)
      setPreviewPoint(null)
    }
  }

  const cancelDrawing = () => {
    setIsDrawing(false)
    setPoints([])
    setPreviewPoint(null)
  }

  const clearPolygon = () => {
    setPoints([])
    onClear()
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-sm mb-3 dark:text-white">Draw Building Footprint</h3>
      
      {!isDrawing && points.length === 0 && (
        <button
          onClick={startDrawing}
          className="flex items-center space-x-2 px-4 py-2 bg-sacramento-blue text-white rounded-lg hover:bg-sacramento-darkblue transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Start Drawing</span>
        </button>
      )}

      {isDrawing && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Click to add points ({points.length} points)
          </p>
          <div className="flex space-x-2">
            <button
              onClick={completePolygon}
              disabled={points.length < 3}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Save className="w-3 h-3" />
              <span>Complete</span>
            </button>
            <button
              onClick={cancelDrawing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {!isDrawing && points.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Footprint drawn ({points.length} points)
          </p>
          <div className="flex space-x-2">
            <button
              onClick={startDrawing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-sacramento-blue text-white rounded text-sm hover:bg-sacramento-darkblue"
            >
              <Edit3 className="w-3 h-3" />
              <span>Redraw</span>
            </button>
            <button
              onClick={clearPolygon}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawing canvas overlay */}
      {isDrawing && (
        <div
          className="fixed inset-0 z-50 cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          style={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <svg className="w-full h-full pointer-events-none">
            {/* Draw existing points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={5}
                fill="#0067B1"
                stroke="white"
                strokeWidth={2}
              />
            ))}
            
            {/* Draw lines between points */}
            {points.length > 1 && (
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#0067B1"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}
            
            {/* Preview line to cursor */}
            {points.length > 0 && previewPoint && (
              <line
                x1={points[points.length - 1].x}
                y1={points[points.length - 1].y}
                x2={previewPoint.x}
                y2={previewPoint.y}
                stroke="#FFB81C"
                strokeWidth={2}
                strokeDasharray="3,3"
              />
            )}
            
            {/* Close polygon preview */}
            {points.length > 2 && (
              <line
                x1={points[points.length - 1].x}
                y1={points[points.length - 1].y}
                x2={points[0].x}
                y2={points[0].y}
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="3,3"
              />
            )}
          </svg>
          
          {/* Instructions overlay */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-xl pointer-events-none">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Click to place points • {points.length >= 3 ? 'Click "Complete" when done' : `Need ${3 - points.length} more point(s)`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

