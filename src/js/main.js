import '../css/main.css'
import { router, navigateTo } from './router'
import { createEvent, deleteEvent, loginService, singUpService, updateEvent } from './services'

const $ = (str) => document.querySelector(str)
const app = $("#app")

router()


app.addEventListener("submit", handleOnSubmit)
app.addEventListener("click", handleOnClick)


async function handleOnSubmit(event) {
  event.preventDefault()

  if(event.target.matches('#loginForm')) {
    
    // fetching form data
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)  
    const userLogged = await loginService(data)

    if (userLogged?.message) {
      alert(userLogged.message)
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
      alert("passwords are not the same")
      return 
    }

    delete data.confirmPassword

    const userRegistered = await singUpService(data)


    if (userRegistered?.message) {
      alert(userRegistered.message)
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
      alert("Description max characters lenght is 500")
      return
    }

    console.log(data)

    const eventCreated = await createEvent(data)


    if (eventCreated?.message) {
      alert(eventCreated.message)
      return
    }

    navigateTo("/dashboard")
    alert("Event created succesfully")
  }

  if (event.target.matches('#editEventForm')) {
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    const eventId = data.id
    delete data.id

    data.name = data.name.trim()
    data.description = data.description.trim()
    data.capacity = parseInt(data.capacity)


    if(data.description.length > 500) {
      alert("Description max characters length is 500")
      return
    }

    const eventUpdated = await updateEvent(eventId, data)


    if (eventUpdated?.message) {
      alert(eventUpdated.message)
      return
    }

    alert("Event updated succesfully")
    console.log(data)
    navigateTo("/dashboard")
  }

}

async function handleOnClick(event) {

  if(event.target.matches('#logOut')) { 
    localStorage.clear()
    navigateTo("/")
  }

  if(event.target.matches('[data-delete]')) {
    
    const eventId = event.target.getAttribute("data-delete")
    
    if(confirm("Do you want to delete the event?")) {
      const eventDeleted = await deleteEvent(eventId)
      if (eventDeleted?.message) {
        alert(eventDeleted.message)
      }
      alert("Event Deleted")
      navigateTo('/dashboard')
      return
    }

  }
}