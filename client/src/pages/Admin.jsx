import { useEffect, useState } from 'react'
import { createFabric, uploadFabricImage, validateFabricImage } from '../data/fabrics'

const initialForm = {
  name: '',
  collection: '',
  category: '',
  description: '',
  image: '',
  images: [],
  specs: { Width: '', Height: '' },
}

export default function Admin() {
  const [form, setForm] = useState(initialForm)
  const [imageFiles, setImageFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => () => {
    previewUrls.filter((url) => url.startsWith('blob:')).forEach((url) => URL.revokeObjectURL(url))
  }, [previewUrls])

  const handleField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const titleCase = (value) => value.toUpperCase()

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
    setMessage('')
    setImageFiles(files)
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!imageFiles.length) {
      setMessage('Please choose at least one image.')
      return
    }

    setSaving(true)
    setMessage('')
    const imageUrls = []
    for (const imageFile of imageFiles) {
      const { data: imageUrl, error: uploadError } = await uploadFabricImage(imageFile)
      if (uploadError) {
        setSaving(false)
        console.error('Fabric image upload error:', uploadError)
        setMessage(`Image upload failed: ${uploadError.message}`)
        return
      }
      imageUrls.push(imageUrl)
    }

    const payload = {
      ...form,
      image: imageUrls[0],
      images: imageUrls,
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
    setImageFiles([])
    setPreviewUrls([])
    setMessage('Fabric added successfully.')
  }

  const inputClass = 'w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest'
  const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2'

  return (
    <div className="px-8 lg:px-16 py-16 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="eyebrow mb-4">Admin</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">Add a fabric</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream border border-cream-dark p-6 md:p-8">
        <div className="md:col-span-2">
          <label className={labelClass}>Fabric name *</label>
          <input required value={form.name} onChange={(event) => handleField('name', titleCase(event.target.value))} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Collection</label>
          <input value={form.collection} onChange={(event) => handleField('collection', titleCase(event.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input value={form.category} onChange={(event) => handleField('category', event.target.value)} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Image *</label>
          <input required type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} className={`${inputClass} file:mr-4 file:border-0 file:bg-forest file:px-4 file:py-2 file:text-white`} />
          {previewUrls.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{previewUrls.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Selected fabric preview ${index + 1}`} className="h-32 w-full object-cover" />)}</div>}
        </div>

        {['Width', 'Height'].map((key) => (
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
