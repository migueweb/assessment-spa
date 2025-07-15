import { getCurrentUser } from "./util"
import { populateEventsTable, setEditEventForm } from "./onRender"

const routes = {
  404: {
    name: 404,
    file: '/views/not_found.html',
    public: true,
    role: null
  },
  '/': {
    file: '/views/index.html',
    public: true,
    role: null,
    logged: "/dashboard"
  },
  '/login': {
    file: '/views/login.html',
    public: true,
    role: null,
    logged: "/dashboard"
  },
  '/singup': {
    file: '/views/sing_up.html',
    public: true,
    role: null,
    logged: "/dashboard"
  },
  '/dashboard': {
    file: '/views/dashboard.html',
    public: false,
    role: null,
    onrender: populateEventsTable
  },
  '/dashboard/events/create': {
    file: '/views/events/create.html',
    public: false,
    role: 'admin'
  },
  '/dashboard/events/edit': {
    file: '/views/events/edit.html',
    public: false,
    role: 'admin',
    onrender: setEditEventForm
  }

}

const app = document.querySelector('#app')

export function router() {

  app.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      event.preventDefault()
    
      window.history.pushState(null, null, event.target.href)

      renderPageBaseOnLocation()
    }
    
  })

  window.addEventListener('popstate', renderPageBaseOnLocation)

  renderPageBaseOnLocation()
} 

export function navigateTo(url) {
  window.history.pushState(null, null, url)
  renderPageBaseOnLocation()
}


export async function renderPageBaseOnLocation() {

  const path = location.pathname

  const route = routes[path] || routes[404]

   const currentUser = getCurrentUser()

  // Authentication
  const requiresRole = !!route.role

  const notLoggedIn = !currentUser
  const hasWrongRole = currentUser?.role !== route.role

  if (!route.public && notLoggedIn) {
    return navigateTo('/login')
  }

  // Authorization
  if (requiresRole && (notLoggedIn || hasWrongRole) ) {
    return navigateTo('/404')
  }

  // If the user is logged in and the route don't exists
  if (!notLoggedIn && route?.name === 404 && !path.includes("404")) {
    return navigateTo('/404')
  }

  // if user try to access to login or singup
  if(!notLoggedIn && route?.logged) {
    return navigateTo(route.logged)
  }


  const html = await fetch(route.file).then(data => data.text())
  
  const wrapper = document.createElement("div")

  app.innerHTML = ""
  
  wrapper.innerHTML = html

  app.appendChild(wrapper)

  if (route?.onrender) {
    route.onrender()
  }
}