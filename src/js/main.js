import '../css/main.css'
import { router, navigateTo } from './router'
import { createEvent, loginService, singUpService } from './services'

const $ = (str) => document.querySelector(str)
const app = $("#app")

router()

app.addEventListener("submit", handleOnSubmit)

async function handleOnSubmit(event) {
  event.preventDefault()
  if(event.target.matches('#loginForm')) {
    // fetching form data
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)  
    const userLogged = await loginService(data)

    if (userLogged?.message) {
      console.error(userLogged.message)
      return
    }

    localStorage.setItem("currentUser", JSON.stringify(userLogged))

    navigateTo('/dashboard')
  }

  if(event.target.matches('#singUpForm')) {
    // fetching form data
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)  

    data.email = data.email.trim()
    
    if (data.password !== data.confirmPassword) {
      console.error("passwords are not the same")
      return 
    }

    delete data.confirmPassword

    const userRegistered = await singUpService(data)


    if (userRegistered?.message) {
      console.error(userRegistered.message)
      return
    }

    localStorage.setItem("currentUser", JSON.stringify(userRegistered))

    navigateTo('/dashboard')
  }

  if (event.target.matches('#createEventForm')) {
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    data.name = data.name.trim()
    data.description = data.description.trim()
    data.capacity = parseInt(data.capacity)
    data.assistants = []

    if(data.description.length > 500) {
      console.error("Description max characters lenght is 500")
      return
    }

    console.log(data)

    const eventCreated = await createEvent(data)


    if (eventCreated?.message) {
      console.error(eventCreated.message)
      return
    }

    console.warn("Event created succesfully")
    console.log(data)
  }

}
