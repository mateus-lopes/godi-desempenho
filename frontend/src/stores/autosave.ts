import { defineStore } from 'pinia'
import { ref } from 'vue'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export const useAutosaveStore = defineStore('autosave', () => {
  const status = ref<SaveStatus>('idle')
  let idleTimer: ReturnType<typeof setTimeout> | null = null

  function markSaving() {
    status.value = 'saving'
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
  }

  function markSaved() {
    if (idleTimer) clearTimeout(idleTimer)
    status.value = 'saved'
    idleTimer = setTimeout(() => { status.value = 'idle' }, 3000)
  }

  function markError() {
    status.value = 'error'
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
  }

  return { status, markSaving, markSaved, markError }
})
