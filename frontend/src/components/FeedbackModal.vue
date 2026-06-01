<script setup>
import { Star } from '@lucide/vue'

defineProps({
  show: Boolean,
  userFeedback: Object,
  feedbackSubmitted: Boolean,
  title: { type: String, default: 'Write a Review' },
  submitLabel: { type: String, default: 'Submit Feedback' },
  successMessage: { type: String, default: 'Thank you for your feedback!' },
  showNameField: { type: Boolean, default: true },
})

const emit = defineEmits([
  'close',
  'submit',
  'update:userFeedback',
])
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="modal-backdrop"
      @click.self="$emit('close')"
    >
      <div class="modal-box">
        <div class="modal-box-header">
          <h5>{{ title }}</h5>

          <button
            class="modal-close"
            @click="$emit('close')"
          >
            ×
          </button>
        </div>

        <div
          v-if="feedbackSubmitted"
          class="modal-success"
        >
          <Star
            :size="32"
            fill="currentColor"
            class="fb-star mb-2"
          />
          <p>{{ successMessage }}</p>
        </div>

        <div
          v-else
          class="modal-box-body"
        >
          <!-- name -->
          <div v-if="showNameField" class="mb-3">
            <label class="modal-label">Name</label>

            <input
              :value="userFeedback.name"
              type="text"
              class="modal-input"
              placeholder="Your name"
              @input="
                $emit('update:userFeedback', {
                  ...userFeedback,
                  name: $event.target.value,
                })
              "
            />
          </div>

          <!-- rating -->
          <div class="mb-3">
            <label class="modal-label">Rating</label>

            <div class="rating-picker">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="rating-star-btn"
                :class="{ active: n <= userFeedback.rating }"
                @click="
                  $emit('update:userFeedback', {
                    ...userFeedback,
                    rating: n,
                  })
                "
              >
                ★
              </button>
            </div>
          </div>

          <!-- comment -->
          <div class="mb-4">
            <label class="modal-label">Comment</label>

            <textarea
              :value="userFeedback.comment"
              class="modal-input modal-textarea"
              rows="4"
              placeholder="Tell us about your experience..."
              @input="
                $emit('update:userFeedback', {
                  ...userFeedback,
                  comment: $event.target.value,
                })
              "
            ></textarea>
          </div>

          <button
            class="modal-submit"
            @click="$emit('submit')"
          >
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import "@/styles/main.css";

/* feedback modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 10, 0.65);
  backdrop-filter: blur(3px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-box {
  background: var(--bg-page);
  width: 100%;
  max-width: 480px;
  padding: 0;
  overflow: hidden;
}

[data-theme="dark"] .modal-box{
  border: 1px solid var(--color-subtle);
}
.modal-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border);
}
.modal-box-header h5 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-primary);
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
.modal-close:hover {
  color: var(--color-primary);
}

.modal-box-body {
  padding: 1.75rem;
}

.modal-label {
  display: block;
  font-size: var(--fs-sm);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}
.modal-input {
  width: 100%;
  border: 1px solid var(--border-input);
  background: var(--bg-surface);
  padding: 0.65rem 0.9rem;
  font-family: var(--font-serif);
  font-size: var(--fs-md);
  color: var(--color-primary);
  outline: none;
  transition: border-color 0.2s;
  border-radius: 0;
}
.modal-input:focus {
  border-color: var(--accent);
}
.modal-textarea {
  resize: vertical;
}

.rating-picker {
  display: flex;
  gap: 0.4rem;
}
.rating-star-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--border);
  cursor: pointer;
  padding: 0;
  transition:
    color 0.15s,
    transform 0.15s;
}
.rating-star-btn.active {
  color: var(--accent);
}
.rating-star-btn:hover {
  transform: scale(1.2);
}

.modal-submit {
  width: 100%;
  background: var(--btn-bg);
  color: var(--btn-color);
  border: none;
  padding: 0.85rem;
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s;
}
.modal-submit:hover {
  background: var(--btn-bg-hover);
}

.modal-success {
  padding: 3rem 1.75rem;
  text-align: center;
  color: var(--accent);
}
.modal-success p {
  font-size: var(--fs-lg);
  color: var(--color-primary);
  margin: 0;
}
</style>