export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'))
  } catch (e) {
    return null
  }
}

export const $ = (str) => document.querySelector(str) 