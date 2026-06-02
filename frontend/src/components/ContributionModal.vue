<template>
  <Teleport to="body">
    <div v-if="modelValue" class="cm-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="cm-modal" role="dialog" aria-modal="true">

        <!-- header -->
        <div class="cm-header">
          <div>
            <h2 class="cm-title">{{ $t('components.contributionModal.title') }}</h2>
            <p class="cm-sub">{{ $t('components.contributionModal.subtitle') }}</p>
          </div>
          <button class="cm-close" @click="$emit('update:modelValue', false)" aria-label="Close">
            <XIcon :size="20" />
          </button>
        </div>

        <!-- preview thumbnail -->
        <div v-if="previewImage" class="cm-preview">
          <img :src="previewImage" alt="Your custom furniture preview" class="cm-preview-img" />
        </div>

        <!-- design info -->
        <div class="cm-info-row">
          <span class="cm-badge">{{ furnitureName }}</span>
          <span class="cm-badge cm-badge--area">{{ area }}</span>
          <span class="cm-price">{{ $t('components.contributionModal.total') }} <strong>{{ formattedPrice }}</strong></span>
        </div>

        <!-- description input -->
        <div class="cm-field">
          <label class="cm-label" for="contrib-desc">
            {{ $t('components.contributionModal.description') }} <span class="cm-required">*</span>
          </label>
          <textarea
            id="contrib-desc"
            v-model="description"
            class="cm-textarea"
            rows="4"
            maxlength="500"
            :placeholder="$t('components.contributionModal.descriptionPlaceholder')"
          />
          <span class="cm-char-count">{{ description.length }} / 500</span>
        </div>

        <!-- error -->
        <div v-if="submitError" class="cm-error">{{ submitError }}</div>

        <!-- actions -->
        <div class="cm-actions">
          <button class="cm-btn cm-btn--ghost" @click="$emit('update:modelValue', false)" :disabled="submitting">
            {{ $t('components.contributionModal.cancel') }}
          </button>
          <button class="cm-btn cm-btn--primary" @click="handleSubmit" :disabled="submitting || !description.trim()">
            <span v-if="submitting" class="cm-spinner"></span>
            <span>{{ submitting ? $t('components.contributionModal.submitting') : $t('components.contributionModal.submit') }}</span>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X as XIcon } from '@lucide/vue'
import { formatPrice } from '@/data/furnitureConfigs.js'

const props = defineProps({
  modelValue:    { type: Boolean, default: false },
  previewImage:  { type: String,  default: '' },
  furnitureName: { type: String,  default: '' },
  area:          { type: String,  default: '' },
  totalPrice:    { type: Number,  default: 0  },
  submitting:    { type: Boolean, default: false },
  submitError:   { type: String,  default: '' },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const description = ref('')

const formattedPrice = computed(() => formatPrice(props.totalPrice))

watch(() => props.modelValue, (v) => {
  if (!v) description.value = ''
})

function handleSubmit() {
  if (!description.value.trim() || props.submitting) return
  emit('submit', description.value.trim())
}
</script>

<style scoped>
.cm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 10, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1rem;
  animation: fadeIn 0.18s ease;
}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.cm-modal {
  background: #faf7f2;
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

.cm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.cm-title {
  font-family: 'Times New Roman', serif;
  font-size: 1.35rem;
  color: var(--text-primary, #2c2218);
  margin: 0 0 0.25rem;
}

.cm-sub {
  font-size: var(--fs-base);
  font-family: 'Times New Roman', serif;
  color: #7a6a58;
  margin: 0;
}

.cm-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #7a6a58;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: background 0.15s;
}

.cm-close:hover { background: #f0ebe2; }

.cm-preview {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #c8c1b5;
  overflow: hidden;
  height: 200px;
}

.cm-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cm-preview-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(44, 34, 24, 0.65);
  color: #f0ebe2;
  font-size: var(--fs-xs);
  padding: 3px 10px;
  border-radius: 20px;
}

.cm-info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.cm-badge {
  font-family: 'Times New Roman', serif;
  font-size: var(--fs-sm);
  background: #f5f0e8;
  color: #5a4a3a;
  border: 1px solid #e0d5c5;
  padding: 3px 10px;
  border-radius: 20px;
}

.cm-badge--area { background: #ece5d8; }

.cm-price {
  font-family: 'Times New Roman', serif;
  margin-left: auto;
  font-size: var(--fs-base);
  color: #7a6a58;
}

.cm-price strong { color: #c4a882; }

.cm-field { margin-bottom: 0.75rem; }

.cm-label {
  font-family: 'Times New Roman', serif;
  display: block;
  font-size: var(--fs-base);
  font-weight: 600;
  color: #7a6a58;
  margin-bottom: 0.4rem;
}

.cm-required { color: #c0705a; }

.cm-textarea {
  width: 100%;
  border: 1px solid #e0d5c5;
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-size: var(--fs-base);
  font-family: 'Times New Roman', serif;
  resize: vertical;
  background: #ffffff;
  color: #2c2218;
  transition: border-color 0.15s;
  outline: none;
}

.cm-textarea:focus { border-color: #c4a882; box-shadow: 0 0 0 3px rgba(196, 168, 130, 0.15); }

.cm-char-count {
  font-family: 'Times New Roman', serif;
  display: block;
  text-align: right;
  font-size: var(--fs-xs);
  color: #7a6a58;
  margin-top: 0.25rem;
}

.cm-error {
  font-family: 'Times New Roman', serif;
  background: #fdf0ed;
  border: 1px solid #e8a090;
  color: #9b4030;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: var(--fs-base);
  margin-bottom: 0.75rem;
}

.cm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cm-btn {
  font-family: 'Times New Roman', serif;
  padding: 0.55rem 1.35rem;
  border-radius: 8px;
  font-size: var(--fs-base);
  letter-spacing: 0.05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s;
  border: none;
}

.cm-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.cm-btn--ghost {
  background: transparent;
  border: 1px solid #e0d5c5;
  color: #7a6a58;
}

.cm-btn--ghost:hover:not(:disabled) { background: #f5f0e8; }

.cm-btn--primary {
  background: #1e1a14;
  color: #f0ebe2;
}

.cm-btn--primary:hover:not(:disabled) { background: #8b6f47; }

.cm-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(240, 235, 226, 0.3);
  border-top-color: #f0ebe2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

[data-theme="dark"] .cm-modal       { background: #1e1a14; border: 1px solid var(--color-subtle); }
[data-theme="dark"] .cm-title       { color: #f0ebe2; }
[data-theme="dark"] .cm-badge       { background: #2a241c; color: #c8b89a; border-color: #3a3028; }
[data-theme="dark"] .cm-badge--area { background: #241e18; }
[data-theme="dark"] .cm-textarea    { background: #231e18; color: #f0ebe2; border-color: #3a3028; }
[data-theme="dark"] .cm-btn--ghost        { border-color: #6a5a48; color: #d4c4b0; }
[data-theme="dark"] .cm-btn--ghost:hover:not(:disabled)  { background: #2a241c; }
[data-theme="dark"] .cm-btn--primary     { background: var(--btn-bg); color: var(--btn-color); }
[data-theme="dark"] .cm-btn--primary:hover:not(:disabled) { background: var(--btn-bg-hover); }
</style>
