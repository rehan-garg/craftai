import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  ImagePlus,
  LoaderCircle,
  Save,
  Send,
  Sparkles,
  Upload,
} from 'lucide-react';

import {
  buildSavedProduct,
  isDuplicateSavedProduct,
  persistSavedProducts,
  readSavedProducts,
} from '../../utils/savedProducts';

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
  options = [],
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white"
        />
      )}
    </label>
  );
}

function OutputCard({ title, content, onCopy }) {
  const safeContent =
    content === undefined || content === null
      ? ''
      : Array.isArray(content)
        ? content.join(', ')
        : String(content);

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-stone-800">
          {title}
        </h3>

        <button
          onClick={() => onCopy(safeContent)}
          className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700"
          type="button"
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-600">
        {safeContent || 'No information available.'}
      </p>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-stone-600">{label}</span>
        <span className="font-semibold text-stone-800">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-700"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function TagList({ items = [], onCopy }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="flex flex-wrap gap-2">
      {safeItems.map((item, index) => (
        <button
          key={`${item}-${index}`}
          type="button"
          onClick={() => onCopy(item)}
          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:border-amber-400 hover:bg-amber-100"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function ProductStudio() {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Home Decor',
    material: '',
    dimensions: '',
    story: '',
    notes: '',
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    setSaveMessage('');
  }, [generated, results]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file.');
      return;
    }

    setImageFile(file);
    setErrorMessage('');
    setGenerated(false);
    setResults(null);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    handleImageUpload(file);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setErrorMessage('Please upload a product image first.');
      return;
    }

    setIsLoading(true);
    setGenerated(false);
    setErrorMessage('');
    setSaveMessage('');

    const payload = new FormData();

    payload.append('image', imageFile);
    payload.append('product_name', formData.name);
    payload.append('category', formData.category);
    payload.append('material', formData.material);
    payload.append('dimensions', formData.dimensions);
    payload.append('story', formData.story);
    payload.append('notes', formData.notes);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {
        throw new Error('VITE_API_URL is not configured');
      }

      const response = await fetch(
        `${API_URL}/generate`,
        {
          method: 'POST',
          body: payload,
        }
      );

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      setGenerated(true);
    } catch (error) {
      console.error('Generation failed:', error);

      setErrorMessage(
        'Unable to generate the listing. Please check that the AI service is running and try again.'
      );

      setGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(String(text));
      setSaveMessage('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  /*
   * Convert the new AI response into the shape expected
   * by the existing saved-products system.
   *
   * This lets us improve the AI response without breaking
   * the marketplace/storage functionality.
   */
  const getSavedProductData = () => {
    if (!results) return null;

    const listing = results.listing || {};
    const pricing = results.pricing || {};
    const social = results.social_media || {};

    return {
      generatedTitle: listing.title || formData.name || 'Handcrafted Product',

      generatedDescription:
        listing.description || 'Handcrafted artisan product.',

      estimatedPrice:
        pricing.recommended_price
          ? `₹${pricing.recommended_price}`
          : '₹0',

      seoKeywords: Array.isArray(listing.seo_keywords)
        ? listing.seo_keywords
        : [],

      instagramCaption: social.instagram_caption || '',

      facebookCaption: social.facebook_caption || '',

      hashtags: Array.isArray(social.hashtags)
        ? social.hashtags
        : [],
    };
  };

  const handleSaveProduct = () => {
    if (!generated || !results) return;

    const savedData = getSavedProductData();

    if (!savedData) return;

    const existingProducts = readSavedProducts();

    if (
      isDuplicateSavedProduct(
        savedData.generatedTitle,
        existingProducts
      )
    ) {
      setSaveMessage('Already Saved');
      return;
    }

    const newProduct = buildSavedProduct({
      status: 'draft',

      imagePreview,

      originalName: formData.name,
      category: formData.category,
      material: formData.material,
      dimensions: formData.dimensions,
      story: formData.story,
      notes: formData.notes,

      ...savedData,
    });

    const nextProducts = [
      newProduct,
      ...existingProducts,
    ];

    persistSavedProducts(nextProducts);

    setSaveMessage('Saved successfully');
  };

  const handlePublishProduct = () => {
    if (!generated || !results) return;

    const savedData = getSavedProductData();

    if (!savedData) return;

    const existingProducts = readSavedProducts();

    const title = savedData.generatedTitle
      ?.trim()
      .toLowerCase();

    const existingDraft = existingProducts.find((product) => {
      const savedTitle = product.generatedTitle
        ?.trim()
        .toLowerCase();

      return (
        savedTitle &&
        savedTitle === title &&
        (product.status || 'draft') === 'draft'
      );
    });

    if (existingDraft) {
      const nextProducts = existingProducts.map(
        (product) => {
          if (product.id === existingDraft.id) {
            return {
              ...product,
              status: 'published',
            };
          }

          return product;
        }
      );

      persistSavedProducts(nextProducts);

      setSaveMessage('Published successfully');

      return;
    }

    const newProduct = buildSavedProduct({
      status: 'published',

      imagePreview,

      originalName: formData.name,
      category: formData.category,
      material: formData.material,
      dimensions: formData.dimensions,
      story: formData.story,
      notes: formData.notes,

      ...savedData,
    });

    const nextProducts = [
      newProduct,
      ...existingProducts,
    ];

    persistSavedProducts(nextProducts);

    setSaveMessage('Published successfully');
  };

  const analysis = results?.product_analysis || {};
  const marketInsight = results?.market_insight || {};
  const pricing = results?.pricing || {};
  const listing = results?.listing || {};
  const social = results?.social_media || {};

  const materials = Array.isArray(analysis.materials)
    ? analysis.materials
    : [];

  const primaryColors = Array.isArray(analysis.primary_colors)
    ? analysis.primary_colors
    : [];

  const secondaryColors = Array.isArray(
    analysis.secondary_colors
  )
    ? analysis.secondary_colors
    : [];

  const motifs = Array.isArray(
    analysis.patterns_and_motifs
  )
    ? analysis.patterns_and_motifs
    : [];

  const techniques = Array.isArray(
    analysis.visible_techniques
  )
    ? analysis.visible_techniques
    : [];

  const seoKeywords = Array.isArray(listing.seo_keywords)
    ? listing.seo_keywords
    : [];

  const hashtags = Array.isArray(social.hashtags)
    ? social.hashtags
    : [];

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <header className="rounded-4xl border border-amber-100 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            <Sparkles className="h-4 w-4" />
            AI Product Studio
          </div>

          <h1 className="mt-2 text-3xl font-semibold text-stone-800">
            Turn your craft into a market-ready product
          </h1>

          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Upload a product image and let CraftAI analyze,
            price, position, and create your marketplace content.
          </p>
        </div>
      </header>

      {/* MAIN GRID */}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}

        <div className="space-y-6">
          {/* IMAGE */}

          <div className="rounded-4xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Upload className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-stone-800">
                  Upload Product Image
                </h2>

                <p className="text-sm text-stone-500">
                  Your image is the primary source of AI analysis.
                </p>
              </div>
            </div>

            <label
              className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${
                isDragging
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-300 bg-stone-50'
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  handleImageUpload(
                    event.target.files?.[0]
                  )
                }
              />

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-56 w-full rounded-2xl object-cover"
                />
              ) : (
                <>
                  <div className="rounded-2xl bg-white p-3 text-amber-700 shadow-sm">
                    <ImagePlus className="h-7 w-7" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-stone-700">
                    Drag and drop your image here
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    or click to browse from your device
                  </p>
                </>
              )}
            </label>
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="rounded-4xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-stone-800">
                  Product Information
                </h2>

                <p className="text-sm text-stone-500">
                  Add context to help CraftAI create a better listing.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InputField
                label="Product Name"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter product name"
              />

              <InputField
                label="Category"
                value={formData.category}
                onChange={handleChange('category')}
                type="select"
                options={[
                  'Home Decor',
                  'Jewelry',
                  'Textiles',
                  'Furniture',
                  'Ceramics',
                ]}
              />

              <InputField
                label="Material"
                value={formData.material}
                onChange={handleChange('material')}
                placeholder="e.g. Stoneware Clay"
              />

              <InputField
                label="Dimensions"
                value={formData.dimensions}
                onChange={handleChange('dimensions')}
                placeholder="e.g. 4.5 x 4.5 x 4.2 in"
              />
            </div>

            <div className="mt-4 grid gap-4">
              <InputField
                label="Handmade Story"
                value={formData.story}
                onChange={handleChange('story')}
                placeholder="Tell the story behind the piece"
                textarea
              />

              <InputField
                label="Additional Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="Mention gifting, use case, or shipping details"
                textarea
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-amber-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              type="button"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analyzing Product...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze & Generate Listing
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="rounded-4xl border border-stone-200 bg-stone-50 p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">
                AI Product Intelligence
              </h2>

              <p className="text-sm text-stone-500">
                Analysis, pricing and marketplace content
              </p>
            </div>

            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-stone-600 shadow-sm">
              {generated ? 'Ready' : 'Draft'}
            </div>
          </div>

          {/* EMPTY */}

          {!generated && !errorMessage && !isLoading ? (
            <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-amber-500" />

              <p className="mt-4 text-sm font-medium text-stone-700">
                Your AI analysis will appear here.
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Upload a product and start the analysis.
              </p>
            </div>
          ) : null}

          {/* LOADING */}

          {isLoading ? (
            <div className="mt-6 rounded-3xl border border-amber-100 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-stone-800">
                    CraftAI is analyzing your product
                  </p>

                  <p className="text-sm text-stone-500">
                    This may take a few seconds.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                {[
                  'Analyzing product image',
                  'Identifying craft and materials',
                  'Evaluating visual characteristics',
                  'Estimating market value',
                  'Creating marketplace content',
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 text-stone-600"
                  >
                    <LoaderCircle className="h-4 w-4 animate-spin text-amber-600" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* ERROR */}

          {errorMessage ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {/* RESULTS */}

          {generated && results ? (
            <div className="mt-6 space-y-5">
              {/* PRODUCT ANALYSIS */}

              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                      Visual Intelligence
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-stone-800">
                      {analysis.product_type ||
                        'Handcrafted Product'}
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                      {analysis.craft_style ||
                        'Craft style detected from image'}
                    </p>
                  </div>

                  <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {analysis.market_positioning ||
                      'Market Analysis'}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ScoreBar
                    label="Craftsmanship"
                    value={analysis.craftsmanship_score}
                  />

                  <ScoreBar
                    label="Uniqueness"
                    value={analysis.uniqueness_score}
                  />

                  <ScoreBar
                    label="AI Confidence"
                    value={analysis.analysis_confidence}
                  />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Materials
                    </p>

                    <div className="mt-2">
                      <TagList
                        items={materials}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Colors
                    </p>

                    <div className="mt-2">
                      <TagList
                        items={[
                          ...primaryColors,
                          ...secondaryColors,
                        ]}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                </div>

                {motifs.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Patterns & Motifs
                    </p>

                    <div className="mt-2">
                      <TagList
                        items={motifs}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                ) : null}

                {techniques.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Visible Techniques
                    </p>

                    <div className="mt-2">
                      <TagList
                        items={techniques}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                ) : null}
              </section>

              {/* PRICE */}

              <section className="rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                      AI Price Intelligence
                    </p>

                    <p className="mt-2 text-4xl font-bold text-stone-900">
                      ₹
                      {Number(
                        pricing.recommended_price || 0
                      ).toLocaleString('en-IN')}
                    </p>

                    <p className="mt-1 text-sm text-stone-600">
                      Recommended selling price
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-xs text-stone-400">
                      Confidence
                    </p>

                    <p className="font-bold text-amber-700">
                      {pricing.price_confidence || 0}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-white/80 p-3 text-center">
                    <p className="text-xs text-stone-400">
                      Budget
                    </p>

                    <p className="mt-1 font-semibold text-stone-800">
                      ₹
                      {Number(
                        pricing.budget_price || 0
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-xs text-amber-600">
                      Recommended
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                      ₹
                      {Number(
                        pricing.recommended_price || 0
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-3 text-center">
                    <p className="text-xs text-stone-400">
                      Premium
                    </p>

                    <p className="mt-1 font-semibold text-stone-800">
                      ₹
                      {Number(
                        pricing.premium_price || 0
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {pricing.pricing_reason ? (
                  <div className="mt-4 rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Why this price?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {pricing.pricing_reason}
                    </p>
                  </div>
                ) : null}
              </section>

              {/* MARKET INSIGHT */}

              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
                  Market Positioning
                </p>

                <h3 className="mt-2 text-lg font-semibold text-stone-800">
                  {marketInsight.recommended_positioning ||
                    'Recommended market positioning'}
                </h3>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Target Customer
                    </p>

                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      {marketInsight.target_customer ||
                        'Not available'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Strongest Selling Point
                    </p>

                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      {marketInsight.strongest_selling_point ||
                        'Not available'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Content Angle
                    </p>

                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      {marketInsight.content_angle ||
                        'Not available'}
                    </p>
                  </div>
                </div>
              </section>

              {/* LISTING */}

              <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                      Marketplace Listing
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-stone-800">
                      {listing.title ||
                        'Generated Product Listing'}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(listing.title)
                    }
                    className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-600">
                  {listing.description ||
                    'No description generated.'}
                </p>

                {Array.isArray(
                  listing.product_highlights
                ) &&
                listing.product_highlights.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Product Highlights
                    </p>

                    <div className="mt-3 space-y-2">
                      {listing.product_highlights.map(
                        (highlight, index) => (
                          <div
                            key={`${highlight}-${index}`}
                            className="flex items-start gap-2 text-sm text-stone-700"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            {highlight}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : null}

                {seoKeywords.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      SEO Keywords
                    </p>

                    <div className="mt-3">
                      <TagList
                        items={seoKeywords}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                ) : null}
              </section>

              {/* SOCIAL */}

              <section className="grid gap-4">
                <OutputCard
                  title="Instagram Caption"
                  content={social.instagram_caption}
                  onCopy={handleCopy}
                />

                <OutputCard
                  title="Facebook Caption"
                  content={social.facebook_caption}
                  onCopy={handleCopy}
                />

                <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-stone-800">
                      Suggested Hashtags
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(hashtags.join(' '))
                      }
                      className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <TagList
                      items={hashtags}
                      onCopy={handleCopy}
                    />
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleSaveProduct}
          disabled={!generated}
        >
          <Save className="h-4 w-4" />
          Save Product
        </button>

        <button
          className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handlePublishProduct}
          disabled={!generated}
        >
          <Send className="h-4 w-4" />
          Publish to Marketplace
        </button>
      </div>

      {saveMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {saveMessage}
        </div>
      ) : null}
    </div>
  );
}

export default ProductStudio;