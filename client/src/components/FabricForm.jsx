import { useEffect, useRef, useState } from 'react'
import { createFabric, uploadFabricImage, updateFabric, validateFabricImage } from '../data/fabrics'
import CategoryPicker from './CategoryPicker'

const initialForm = {
  name: '',
  collection: '',
  category: '',
  description: '',
  image: '',
  images: [],
  specs: { Width: '', Height: '' },
}

const getForm = (fabric) => fabric ? {
  name: fabric.name || '',
  collection: fabric.collection || '',
  category: fabric.category || '',
  description: fabric.description || '',
  image: fabric.image || '',
  images: fabric.images?.length ? fabric.images : (fabric.image ? [fabric.image] : []),
  specs: {
    Width: '',
    Height: '',
    ...(fabric.specs || {}),
  },
} : initialForm

export default function FabricForm({ fabric = null, onSubmit, onCancel, isLoading = false }) {
  const [form, setForm] = useState(() => getForm(fabric))
  const [imageFiles, setImageFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState(() => getForm(fabric).images)
  const previewUrlsRef = useRef(previewUrls)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    previewUrlsRef.current = previewUrls
  }, [previewUrls])

  useEffect(() => () => {
    previewUrlsRef.current.filter((url) => url.startsWith('blob:')).forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const handleField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const titleCase = (value) => value.replace(/\b\w/g, (character) => character.toUpperCase())

  const handleSpec = (key, value) => setForm((current) => ({
    ...current,
    specs: { ...current.specs, [key]: value },
  }))

  const handleImage = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    const validationError = files.map(validateFabricImage).find(Boolean)
    if (validationError) {
      setMessage(validationError)
      event.target.value = ''
      return
    }
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setMessage('')
    setImageFiles((current) => [...current, ...files])
    setPreviewUrls((current) => [...current, ...newPreviewUrls])
    event.target.value = ''
  }

  const removeImage = (index) => {
    const existingCount = previewUrls.length - imageFiles.length
    const fileIndex = index - existingCount
    const removed = previewUrls[index]
    if (removed?.startsWith('blob:')) URL.revokeObjectURL(removed)
    setPreviewUrls((current) => current.filter((_, imageIndex) => imageIndex !== index))
    if (fileIndex >= 0) {
      setImageFiles((current) => current.filter((_, imageIndex) => imageIndex !== fileIndex))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.category) {
      setMessage('Please choose a category.')
      return
    }
    if (!fabric && !previewUrls.length) {
      setMessage('Please choose at least one image.')
      return
    }

    setSaving(true)
    setMessage('')
    const uploadedUrls = []
    for (const imageFile of imageFiles) {
      const { data: uploadedUrl, error: uploadError } = await uploadFabricImage(imageFile)
      if (uploadError) {
        setSaving(false)
        console.error('Fabric image upload error:', uploadError)
        setMessage(`Image upload failed: ${uploadError.message}`)
        return
      }
      uploadedUrls.push(uploadedUrl)
    }
    const imageUrls = [...previewUrls.filter((url) => !url.startsWith('blob:')), ...uploadedUrls]

    const payload = {
      ...form,
      image: imageUrls[0] || '',
      images: imageUrls,
      id: fabric?.id || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `fabric-${Date.now()}`,
      specs: Object.fromEntries(
        Object.entries(form.specs || {})
          .filter(([, value]) => String(value ?? '').trim())
          .map(([key, value]) => [key, String(value).trim()]),
      ),
    }

    let result
    if (fabric) {
      result = await updateFabric(fabric.id, payload)
    } else {
      result = await createFabric(payload)
    }

    setSaving(false)

    if (result.error) {
      console.error('Fabric save error:', result.error)
      setMessage(`Save failed: ${result.error.message}`)
      return
    }

    setForm(initialForm)
    setImageFiles([])
    setPreviewUrls([])
    setMessage(fabric ? 'Fabric updated successfully.' : 'Fabric added successfully.')

    if (onSubmit) {
      setTimeout(() => onSubmit(result.data), 1000)
    }
  }

  const inputClass = 'w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest'
  const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream border border-cream-dark p-6 md:p-8">
      <div className="md:col-span-2">
        <label className={labelClass}>Fabric name *</label>
        <input required value={form.name} onChange={(event) => handleField('name', titleCase(event.target.value))} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Collection</label>
        <input value={form.collection} onChange={(event) => handleField('collection', titleCase(event.target.value))} className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <CategoryPicker value={form.category} onChange={(value) => handleField('category', value)} required />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Images {!fabric && '*'}</label>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} className={`${inputClass} file:mr-4 file:border-0 file:bg-forest file:px-4 file:py-2 file:text-white`} />
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previewUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative">
                <img src={url} alt={`Selected fabric preview ${index + 1}`} className="h-32 w-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 bg-charcoal/80 px-2 py-1 text-xs text-white">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {['Width', 'Height'].map((key) => (
        <div key={key}>
          <label className={labelClass}>{key}</label>
          <input value={form.specs[key] || ''} onChange={(event) => handleSpec(key, event.target.value)} className={inputClass} />
        </div>
      ))}

      <div className="md:col-span-2">
        <label className={labelClass}>Description</label>
        <textarea rows={4} value={form.description} onChange={(event) => handleField('description', event.target.value)} className={`${inputClass} resize-none`} />
      </div>

      <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <button type="submit" disabled={saving || isLoading} className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors disabled:opacity-60">
            {saving ? (fabric ? 'Updating...' : 'Adding...') : (fabric ? 'Update Fabric' : 'Add Fabric')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[44px] px-8 py-3 bg-charcoal-light/20 text-charcoal text-[11px] tracking-[0.2em] uppercase hover:bg-charcoal-light/30 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        {message && <p className={`text-sm ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </form>
  )
}
