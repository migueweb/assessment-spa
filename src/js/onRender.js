/* These functions are executed before rendering the page content */
import { navigateTo } from "./router";
import { getEventById } from "./services";
import { $ } from "./util"

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