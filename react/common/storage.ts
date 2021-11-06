export const storage = {
    get(key) {
        return localStorage.getItem(key)
    },
    remove(key) {
        localStorage.removeItem(key)
    },
    put(key, value) {
        localStorage.setItem(key, value)
    }
}