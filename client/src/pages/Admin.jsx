import { useEffect, useState } from 'react'
import { createFabric, uploadFabricImage, validateFabricImage } from '../data/fabrics'

const initialForm = {
  name: '',
  collection: '',
  category: '',
  description: '',
  image: '',
  specs: { Martindale: '', Weight: '', Width: '' },
}

export default function Admin() {
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

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
    if (!imageFile) {
      setMessage('Please choose an image.')
      return
    }

    setSaving(true)
    setMessage('')
    const { data: imageUrl, error: uploadError } = await uploadFabricImage(imageFile)
    if (uploadError) {
      setSaving(false)
      console.error('Fabric image upload error:', uploadError)
      setMessage(`Image upload failed: ${uploadError.message}`)
      return
    }

    const payload = {
      ...form,
      image: imageUrl,
      id: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `fabric-${Date.now()}`,
      specs: Object.fromEntries(Object.entries(form.specs).filter(([, value]) => value.trim())),
    }
    const { error } = await createFabric(payload)
    setSaving(false)

    if (error) {
      console.error('Fabric database save error:', error)
      setMessage(`Save failed: ${error.message}`)
      return
    }

    setForm(initialForm)
    setImageFile(null)
    setPreviewUrl('')
    setMessage('Fabric added successfully.')
  }

  const inputClass = 'w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest'
  const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2'

  return (
    <div className="pt-[72px] px-8 lg:px-16 py-16 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="eyebrow mb-4">Admin</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">Add a fabric</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream border border-cream-dark p-6 md:p-8">
        <div className="md:col-span-2">
          <label className={labelClass}>Fabric name *</label>
          <input required value={form.name} onChange={(event) => handleField('name', event.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Collection</label>
          <input value={form.collection} onChange={(event) => handleField('collection', event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input value={form.category} onChange={(event) => handleField('category', event.target.value)} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Image *</label>
          <input required type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} className={`${inputClass} file:mr-4 file:border-0 file:bg-forest file:px-4 file:py-2 file:text-white`} />
          {previewUrl && <img src={previewUrl} alt="Selected fabric preview" className="mt-4 h-40 w-full object-cover" />}
        </div>

        {['Martindale', 'Weight', 'Width'].map((key) => (
          <div key={key}>
            <label className={labelClass}>{key}</label>
            <input value={form.specs[key]} onChange={(event) => handleSpec(key, event.target.value)} className={inputClass} />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea rows={4} value={form.description} onChange={(event) => handleField('description', event.target.value)} className={`${inputClass} resize-none`} />
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
          <button type="submit" disabled={saving} className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors disabled:opacity-60">
            {saving ? 'Uploading...' : 'Add Fabric'}
          </button>
          {message && <p className="text-sm text-charcoal-light">{message}</p>}
        </div>
      </form>
    </div>
  )
}
