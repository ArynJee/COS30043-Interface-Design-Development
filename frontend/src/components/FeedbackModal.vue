<script setup>
import { Star } from '@lucide/vue'

defineProps({
  show: Boolean,
  userFeedback: Object,
  feedbackSubmitted: Boolean,
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
          <h5>Write a Review</h5>

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
          <p>Thank you for your feedback!</p>
        </div>

        <div
          v-else
          class="modal-box-body"
        >
          <!-- name -->
          <div class="mb-3">
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
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>

/* feedback modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 10, 0.65);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-box {
  background: #faf7f2;
  width: 100%;
  max-width: 480px;
  padding: 0;
  overflow: hidden;
}
.modal-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e0d5c5;
}
.modal-box-header h5 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c2218;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7a6a58;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
.modal-close:hover {
  color: #2c2218;
}

.modal-box-body {
  padding: 1.75rem;
}

.modal-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a6a58;
  margin-bottom: 0.5rem;
}
.modal-input {
  width: 100%;
  border: 1px solid #e0d5c5;
  background: #ffffff;
  padding: 0.65rem 0.9rem;
  font-family: 'Times New Roman', serif;
  font-size: 0.9rem;
  color: #2c2218;
  outline: none;
  transition: border-color 0.2s;
  border-radius: 0;
}
.modal-input:focus {
  border-color: #c4a882;
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
  color: #e0d5c5;
  cursor: pointer;
  padding: 0;
  transition:
    color 0.15s,
    transform 0.15s;
}
.rating-star-btn.active {
  color: #c4a882;
}
.rating-star-btn:hover {
  transform: scale(1.2);
}

.modal-submit {
  width: 100%;
  background: #1e1a14;
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  font-family: 'Times New Roman', serif;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s;
}
.modal-submit:hover {
  background: #8b6f47;
}

.modal-success {
  padding: 3rem 1.75rem;
  text-align: center;
  color: #c4a882;
}
.modal-success p {
  font-size: 1rem;
  color: #2c2218;
  margin: 0;
}
</style>