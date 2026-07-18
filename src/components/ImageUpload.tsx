import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImage: string
  onImageChange: (imageUrl: string) => void
  onImageDelete?: () => void
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  onImageDelete 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file: File) => {
    setIsUploading(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      onImageChange(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview('')
    onImageChange('')
    if (onImageDelete) {
      onImageDelete()
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
        Imagen de la Rutina
      </label>
      
      {preview ? (
        <div className="relative group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-xl border border-[#EFE9E4]"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full h-48 border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all
            ${isDragging 
              ? 'border-amber-500 bg-amber-50' 
              : 'border-[#EFE9E4] bg-[#FAF7F2] hover:border-amber-400 hover:bg-amber-50/50'
            }
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-500">Subiendo imagen...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600">
                  Arrastra una imagen aquí
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  o haz clic para seleccionar
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <p className="text-[10px] text-gray-400">
        Formatos: JPG, PNG, WEBP. Máximo 5MB.
      </p>
    </div>
  )
}
