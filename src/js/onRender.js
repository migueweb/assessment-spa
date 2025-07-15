/* These functions are executed before rendering the page content */
import { navigateTo } from "./router";
import { getEventById, getEvents } from "./services";
import { $, getCurrentUser } from "./util"

export async function setEditEventForm() {
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams);
    
    if (!params.id) {
        navigateTo("/dashboard")
    }

    const eventFound = await getEventById(params.id)

    if (eventFound?.message) {
        navigateTo("/dashboard")
    }


    $("#editEventName").value = eventFound.name
    $("#editEventDescription").value = eventFound.description
    $("#editEventDate").value = eventFound.date
    $("#editEventCapacity").value = eventFound.capacity
    $("#eventId").value = eventFound.id

}

export async function populateEventsTable() {
    //TODO: navbar

    const currentUser = getCurrentUser()
    const $adminButtons = $("#adminBtns")
    const $eventsWrapper = $("#eventsWrapper")
    const $eventTableMessage = $("#eventTableMessage")
    const events = await getEvents()
    
    $adminButtons.innerHTML = `<a href="/dashboard/events/create">Add new Event</a>`

    if (events.length === 0) {
        $eventTableMessage.textContent = "Not events available"
    }

    events.forEach( event => {

        const tableCard = document.createElement("article")
        tableCard.classList.add("card")
        
        const footer = currentUser.role == "admin" 
        ? `
            <footer>
                <a href="/dashboard/events/edit?id=${event.id}">Edit</a>
                <div role="button" data-delete="${event.id}">Delete</div>
            </footer>
        `
        : ""

        const cardInfo = `
            <h2>${event.name}</h2>
            <p>${event.description}</p>
            
            <div>
                 <p>${new Date(event.date).toLocaleDateString()}</p>
                 <p><b>Capacity: </b> ${event.capacity}</p>
            </div>

            ${footer}
        `
    
        tableCard.setAttribute("data-event", event.id)
    
        tableCard.innerHTML = cardInfo

        $eventsWrapper.appendChild(tableCard)
    });

}