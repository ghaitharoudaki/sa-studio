import { useEffect, useRef, useState } from 'react'
import { createFabric, uploadFabricImage, updateFabric, validateFabricImage, saveFabricColors, fetchFabricColors } from '../data/fabrics'
import CategoryPicker from './CategoryPicker'
import { useSite } from '../context/SiteContext'

const initialForm = {
  name: '',
  reference: '',
  collection: '',
  categories: [],
  description: '',
  featured: false,
  image: '',
  images: [],
  specs: { Width: '', Height: '', Weight: '', Material: '' },
}

const getForm = (fabric) => fabric ? {
  name: fabric.name || '',
  reference: fabric.reference || '',
  collection: fabric.collection || '',
  categories: fabric.categories?.length ? fabric.categories : (fabric.category ? [fabric.category] : []),
  description: fabric.description || '',
  featured: fabric.featured === true,
  image: fabric.image || '',
  images: fabric.images?.length ? fabric.images : (fabric.image ? [fabric.image] : []),
  specs: {
    Width: '',
    Height: '',
    Weight: '',
    Material: '',
    ...(fabric.specs || {}),
  },
} : initialForm

export default function FabricForm({ fabric = null, onSubmit, onCancel, isLoading = false }) {
  const { t } = useSite()
  const [form, setForm] = useState(() => getForm(fabric))
  const [imageFiles, setImageFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState(() => getForm(fabric).images)
  const previewUrlsRef = useRef(previewUrls)
  const [colorVariants, setColorVariants] = useState([])
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    previewUrlsRef.current = previewUrls
  }, [previewUrls])

  useEffect(() => () => {
    previewUrlsRef.current.filter((url) => url.startsWith('blob:')).forEach((url) => URL.revokeObjectURL(url))
  }, [])

  useEffect(() => {
    if (fabric?.id) {
      fetchFabricColors(fabric.id).then((rows) => {
        setColorVariants(rows.map((r) => ({ color_name: r.color_name, image: r.image, file: null })))
      })
    }
  }, [fabric?.id])

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

  const addColorVariant = () => {
    setColorVariants((current) => [...current, { color_name: '', image: '', file: null }])
  }

  const updateColorName = (index, name) => {
    setColorVariants((current) => current.map((c, i) => (i === index ? { ...c, color_name: name } : c)))
  }

  const updateColorImage = (index, file) => {
    const validationError = validateFabricImage(file)
    if (validationError) {
      setMessage(validationError)
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setColorVariants((current) => current.map((c, i) => (i === index ? { ...c, image: previewUrl, file } : c)))
  }

  const removeColorVariant = (index) => {
    setColorVariants((current) => current.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.categories.length) {
      setMessage(t('chooseCategory'))
      return
    }
    if (!fabric && !previewUrls.length) {
      setMessage('Please choose at least one image.')
      return
    }

    setSaving(true)
    setMessage('')
    const imageUploads = await Promise.all(imageFiles.map((imageFile) => uploadFabricImage(imageFile)))
    const failedUpload = imageUploads.find(({ error }) => error)
    if (failedUpload) {
      setSaving(false)
      console.error('Fabric image upload error:', failedUpload.error)
      setMessage(`Image upload failed: ${failedUpload.error.message}`)
      return
    }
    const uploadedUrls = imageUploads.map(({ data }) => data)
    const imageUrls = [...previewUrls.filter((url) => !url.startsWith('blob:')), ...uploadedUrls]

    const payload = {
      ...form,
      image: imageUrls[0] || '',
      images: imageUrls,
      ...(fabric?.id ? { id: fabric.id } : {}),
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

    const savedId = result.data?.id || fabric?.id
    if (savedId && colorVariants.length) {
      const colorUploads = await Promise.all(colorVariants.map((variant) => (
        variant.file ? uploadFabricImage(variant.file) : Promise.resolve({ data: variant.image, error: null })
      )))
      const failedColorUpload = colorUploads.find(({ error }) => error)
      if (failedColorUpload) {
        setMessage(`Color image upload failed: ${failedColorUpload.error.message}`)
        return
      }
      const uploadedColors = colorVariants.map((variant, index) => ({
        color_name: variant.color_name?.trim() || `Color ${index + 1}`,
        image: colorUploads[index].data,
      }))
      const { error: colorError } = await saveFabricColors(savedId, uploadedColors)
      if (colorError) {
        console.error('Color save error:', colorError)
        setMessage(`Fabric saved, but colors failed to save: ${colorError.message}`)
        return
      }
    }

    setForm(initialForm)
    setImageFiles([])
    setPreviewUrls([])
    setColorVariants([])
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
        <label className={labelClass}>{t('fabricName')} *</label>
        <input required value={form.name} onChange={(event) => handleField('name', titleCase(event.target.value))} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t('collection')}</label>
        <input value={form.collection} onChange={(event) => handleField('collection', titleCase(event.target.value))} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{t('reference')} / SKU (optional)</label>
        <input value={form.reference} onChange={(event) => handleField('reference', event.target.value)} className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <CategoryPicker value={form.categories} onChange={(value) => handleField('categories', value)} required />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>{t('image')}s {!fabric && '*'}</label>
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

      {['Width', 'Height', 'Weight', 'Material'].map((key) => (
        <div key={key}>
          <label className={labelClass}>{key}</label>
          <input value={form.specs[key] || ''} onChange={(event) => handleSpec(key, event.target.value)} className={inputClass} />
        </div>
      ))}

      <div className="md:col-span-2">
        <label className={labelClass}>{t('description')}</label>
        <textarea rows={4} value={form.description} onChange={(event) => handleField('description', event.target.value)} className={`${inputClass} resize-none`} />
      </div>

      <label className="md:col-span-2 flex min-h-[44px] items-center gap-3 text-sm text-charcoal">
        <input type="checkbox" checked={form.featured} onChange={(event) => handleField('featured', event.target.checked)} className="h-4 w-4 accent-forest" />
        <span>{t('featured')}</span>
      </label>

      <div className="md:col-span-2">
        <label className={labelClass}>Color Variants (optional)</label>
        <div className="space-y-3">
          {colorVariants.map((variant, index) => (
            <div key={index} className="flex items-center gap-3 border border-cream-dark p-3">
              {variant.image && <img src={variant.image} alt={variant.color_name || 'color variant'} className="h-14 w-14 object-cover shrink-0" />}
              <input
                placeholder="Color name (optional, e.g. Sage Green)"
                value={variant.color_name}
                onChange={(event) => updateColorName(index, event.target.value)}
                className={inputClass}
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) => event.target.files[0] && updateColorImage(index, event.target.files[0])}
                className="text-xs"
              />
              <button type="button" onClick={() => removeColorVariant(index)} className="shrink-0 bg-charcoal/80 px-3 py-2 text-xs text-white">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addColorVariant} className="mt-3 border border-forest text-forest px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-forest hover:text-white transition-colors">
          + Add Color
        </button>
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