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

    const event = await getEventById(params.id)

    if (event?.message) {
        navigateTo("/dashboard")
    }
    $("#editEventName").value = ""
    $("#editEventDescription").value = "" 
    $("#editEventDate").value = "2017-06-01"
    $("#editEventCapacity").value = "66" 
}