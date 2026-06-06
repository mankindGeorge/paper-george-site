<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
    <div
      class="w-full max-w-lg bg-newsprint border-2 border-ink p-8 relative"
      :class="{ 'animate-slide-out': submitted }"
    >
      <h2 class="font-headline text-3xl font-black text-center mb-2">LETTER TO THE EDITOR</h2>
      <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">CORRESPONDENCE &amp; INQUIRIES</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Your Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Your Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Message</label>
          <textarea
            v-model="form.body"
            rows="5"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          class="w-full border-2 border-ink bg-ink text-newsprint py-3 font-headline text-lg uppercase tracking-wider hover:bg-stamp hover:border-stamp transition-colors active:scale-95"
          :disabled="sending"
        >
          {{ sending ? 'SENDING...' : 'STAMP & SEND' }}
        </button>
      </form>

      <div v-if="submitted" class="absolute inset-0 flex items-center justify-center bg-newsprint">
        <div class="text-center animate-stamp">
          <StampSeal text="SENT" size="lg" />
          <p class="font-mono text-sm mt-4">Your letter has been received.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { post } = useApi()

const form = reactive({ name: '', email: '', subject: '', body: '' })
const sending = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  sending.value = true
  try {
    await post('/api/messages', form)
    submitted.value = true
  } catch (e) {
    console.error(e)
  } finally {
    sending.value = false
  }
}
</script>
