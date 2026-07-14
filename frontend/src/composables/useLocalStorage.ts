import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const data = ref(stored ? (JSON.parse(stored) as T) : defaultValue) as Ref<T>
  watch(data, (val) => localStorage.setItem(key, JSON.stringify(val)), { deep: true })
  return data
}
