import { useEffect, useRef, useState } from 'react'
import { reconstructPointCloud } from '../utils/reconstructPointCloud'
import { buildPlyString, downloadPly } from '../utils/exportPly'
import './ReconstructionUploader.css'

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

export default function ReconstructionUploader({ onResult }) {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setSelectedFile(null)
      setResult(null)
      setErrorMessage('Please choose a valid image file.')
      onResult?.(null)
      event.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null)
      setResult(null)
      setErrorMessage('Please choose an image smaller than 15MB so the browser can process it smoothly.')
      onResult?.(null)
      event.target.value = ''
      return
    }

    setErrorMessage('')
    setResult(null)
    onResult?.(null)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(nextPreviewUrl)
    event.target.value = ''
  }

  const handleRunReconstruction = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload a Makli photo first.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('Please choose an image smaller than 15MB so the browser can process it smoothly.')
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    let objectUrl = ''

    try {
      objectUrl = URL.createObjectURL(selectedFile)
      const imageElement = new window.Image()

      const loadImage = () => new Promise((resolve, reject) => {
        imageElement.onload = () => resolve()
        imageElement.onerror = () => reject(new Error('The selected file could not be loaded as an image.'))
        imageElement.src = objectUrl
      })

      await loadImage()
      const pointCloud = await reconstructPointCloud(imageElement)
      setResult(pointCloud)
      onResult?.(pointCloud)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error?.message || 'Reconstruction failed. Please try another image.')
      setResult(null)
      onResult?.(null)
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      setIsProcessing(false)
    }
  }

  const handleDownloadPly = () => {
    if (!selectedFile || !result) {
      return
    }

    const baseName = selectedFile.name.replace(/\.[^.]+$/, '')
    const filename = `${baseName}_makli_reconstruction.ply`
    const plyString = buildPlyString(
      result.positions,
      result.colors,
      [
        'Makli Necropolis browser-side reconstruction',
        'JS port of the Python prototype point-cloud workflow',
      ],
    )

    downloadPly(plyString, filename)
  }

  const depthRange = result?.depthRange && Array.isArray(result.depthRange)
    ? result.depthRange.map((value) => Number(value).toFixed(2))
    : ['0.00', '0.00']

  return (
    <div className="reconstruction-uploader" aria-label="Live reconstruction uploader panel">
      <div className="reconstruction-uploader__top">
        <button
          type="button"
          className="reconstruction-uploader__button"
          onClick={openFilePicker}
          aria-label="Upload a Makli photo"
        >
          Upload a Makli Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          aria-label="Choose a Makli image file"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="reconstruction-uploader__button reconstruction-uploader__button--secondary"
          onClick={handleRunReconstruction}
          disabled={!selectedFile || isProcessing}
          aria-label="Run reconstruction on the selected Makli photo"
        >
          {isProcessing ? (
            <span className="reconstruction-uploader__button-content">
              <span className="reconstruction-uploader__spinner" aria-hidden="true" />
              <span>Running Reconstruction…</span>
            </span>
          ) : (
            'Run Reconstruction'
          )}
        </button>
      </div>

      {selectedFile && (
        <div className="reconstruction-uploader__preview-wrap">
          <img className="reconstruction-uploader__preview" src={previewUrl} alt="Selected Makli reconstruction source preview" />
          <div className="reconstruction-uploader__filename" title={selectedFile.name}>{selectedFile.name}</div>
        </div>
      )}

      {result && (
        <div className="reconstruction-uploader__stats" role="status" aria-live="polite">
          <div className="reconstruction-uploader__stat-item">
            <span className="reconstruction-uploader__label">Point count</span>
            <strong>{result.pointCount.toLocaleString()}</strong>
          </div>
          <div className="reconstruction-uploader__stat-item">
            <span className="reconstruction-uploader__label">Sky-masked %</span>
            <strong>{Number(result.skyMaskedPercent).toFixed(2)}</strong>
          </div>
          <div className="reconstruction-uploader__stat-item">
            <span className="reconstruction-uploader__label">Depth range</span>
            <strong>{depthRange[0]} to {depthRange[1]}</strong>
          </div>
        </div>
      )}

      <button
        type="button"
        className="reconstruction-uploader__button reconstruction-uploader__button--download"
        onClick={handleDownloadPly}
        disabled={!result}
        aria-label="Download the reconstructed point cloud as a PLY file"
      >
        Download .ply
      </button>

      {errorMessage && (
        <p className="reconstruction-uploader__error" role="alert">
          {errorMessage}
        </p>
      )}

      <p className="reconstruction-uploader__caption">
        Runs entirely in your browser — no image is uploaded to any server. Same algorithm as our Python prototype, ported to JavaScript.
      </p>
    </div>
  )
}
