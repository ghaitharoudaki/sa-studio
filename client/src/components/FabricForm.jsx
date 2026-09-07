import { useEffect, useState } from 'react'
import { createFabric, uploadFabricImage, updateFabric, validateFabricImage } from '../data/fabrics'
import CategoryPicker from './CategoryPicker'

const initialForm = {
  name: '',
  collection: '',
  category: '',
  description: '',
  image: '',
  specs: { Martindale: '', Weight: '', Width: '' },
}

const getForm = (fabric) => fabric ? {
  name: fabric.name || '',
  collection: fabric.collection || '',
  category: fabric.category || '',
  description: fabric.description || '',
  image: fabric.image || '',
  specs: {
    Martindale: '',
    Weight: '',
    Width: '',
    ...(fabric.specs || {}),
  },
} : initialForm

export default function FabricForm({ fabric = null, onSubmit, onCancel, isLoading = false }) {
  const [form, setForm] = useState(() => getForm(fabric))
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => () => {
    if (previewUrl && !fabric?.image?.includes(previewUrl)) URL.revokeObjectURL(previewUrl)
  }, [previewUrl, fabric])

  const handleField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSpec = (key, value) => setForm((current) => ({
    ...current,
    specs: { ...current.specs, [key]: value },
  }))

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const validationError = validateFabricImage(file)
    if (validationError) {
      setMessage(validationError)
      event.target.value = ''
      return
    }
    setMessage('')
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.category) {
      setMessage('Please choose a category.')
      return
    }
    if (!fabric && !imageFile) {
      setMessage('Please choose an image.')
      return
    }

    setSaving(true)
    setMessage('')
    let imageUrl = form.image

    // Upload new image if provided
    if (imageFile) {
      const { data: uploadedUrl, error: uploadError } = await uploadFabricImage(imageFile)
      if (uploadError) {
        setSaving(false)
        console.error('Fabric image upload error:', uploadError)
        setMessage(`Image upload failed: ${uploadError.message}`)
        return
      }
      imageUrl = uploadedUrl
    }

    const payload = {
      ...form,
      image: imageUrl,
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
    setImageFile(null)
    setPreviewUrl('')
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
        <input required value={form.name} onChange={(event) => handleField('name', event.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Collection</label>
        <input value={form.collection} onChange={(event) => handleField('collection', event.target.value)} className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <CategoryPicker value={form.category} onChange={(value) => handleField('category', value)} required />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Image {!fabric && '*'}</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} className={`${inputClass} file:mr-4 file:border-0 file:bg-forest file:px-4 file:py-2 file:text-white`} />
        {previewUrl && <img src={previewUrl} alt="Selected fabric preview" className="mt-4 h-40 w-full object-cover" />}
      </div>

      {['Martindale', 'Weight', 'Width'].map((key) => (
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
