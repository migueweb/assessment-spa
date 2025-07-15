import axios from "axios";

export class ErrorResponse {
  constructor(message) {
    this.message = message
  }
}
const API_URL = "http://localhost:3000"

const ENDPOINTS = {
  users: "/users",
  events: "/events",
}

export async function loginService(data) {
  try {

    const user = await axios.get(API_URL+ENDPOINTS.users, {
      params: {email: data.email}
    })

    if (user.data.length === 0) {
      return new ErrorResponse("The current email is not registered")
    }
    
    if(user.data[0].password !== data.password) {
      return new ErrorResponse("The password is wrong")
    }
    
    return user.data[0]
    
  } catch (error) {

    return new ErrorResponse("Something went wrong")
  }
}

export async function singUpService(data) {
  try {
    const user = await axios.get(API_URL+ENDPOINTS.users, {
      params: {email: data.email}
    })

    if (user.data.length > 0) {
      return new ErrorResponse("The current email is registered")
    }
    
    data.role = "visitor"

    const userRegistered = await axios.post(API_URL+ENDPOINTS.users, data) 

    if (userRegistered.status !== 201) {
      return new ErrorResponse("User can't be registered")
    }

    return userRegistered.data
    
  } catch (error) {

    return new ErrorResponse("Something went wrong")
  }
}

export async function getEvents() {
  try {
    const events = await axios.get(API_URL+ENDPOINTS.events)

  
    return events.data
  } catch (error) {
    return new ErrorResponse("something went wrong")
  }
}
export async function createEvent(data) {
  try {
    debugger
    const event = await axios.get(API_URL+ENDPOINTS.events, {
      params: {name: data.name}
    })

    if (event.data.length > 0) {
      return new ErrorResponse("There already exist a event with that name")
    }
    
    const eventCreated = await axios.post(API_URL+ENDPOINTS.events, data) 

    if (eventCreated.status !== 201) {
      return new ErrorResponse("Event can't be created")
    }

    return eventCreated.data
    
  } catch (error) {

    return new ErrorResponse("Something went wrong")
  }
}

export async function getEventById(id) {
    try {

      const eventFound = await axios.get(API_URL+ENDPOINTS.events, {
        params: {id: id}
      })
      
      if(eventFound.data.length === 0) {
        return new ErrorResponse("The event can't be found")
      }
      
      return eventFound.data[0]

    } catch(error) {
      return new ErrorResponse("Something went wrong")
    }

}

export async function updateEvent(id, data) {
  try {
    debugger
    const event = await axios.get(API_URL+ENDPOINTS.events, {
      params: {id: id}
    })

    if (event.data.length === 0) {
      return new ErrorResponse("Event was not found")
    }
    
    const eventUpdated = await axios.put(API_URL+ENDPOINTS.events+ `/${id}`, data) 

    if (eventUpdated.status !== 200) {
      return new ErrorResponse("Event can't be updated")
    }

    return eventUpdated.data
    
  } catch (error) {

    return new ErrorResponse("Something went wrong")
  }
}

export async function deleteEvent(id) {
    try {

        const res = await axios.delete(API_URL + ENDPOINTS.events + `/${id}`)
        if (res.status !== 200) {
            throw new Error()
        }

        return res.data

    } catch (e) {
        return new ErrorResponse("Product could not be deleted. Try it again")
    }
}