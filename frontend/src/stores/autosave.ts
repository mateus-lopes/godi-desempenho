import { defineStore } from 'pinia'
import { ref } from 'vue'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export const useAutosaveStore = defineStore('autosave', () => {
  const status = ref<SaveStatus>('idle')
  const errorMessage = ref<string | null>(null)
  let idleTimer: ReturnType<typeof setTimeout> | null = null

  function markSaving() {
    status.value = 'saving'
    errorMessage.value = null
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
  }

  function markSaved() {
    if (idleTimer) clearTimeout(idleTimer)
    status.value = 'saved'
    errorMessage.value = null
    idleTimer = setTimeout(() => { status.value = 'idle' }, 3000)
  }

  function markError(message?: string) {
    status.value = 'error'
    errorMessage.value = message ?? null
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => { status.value = 'idle'; errorMessage.value = null }, 10_000)
  }

  return { status, errorMessage, markSaving, markSaved, markError }
})
