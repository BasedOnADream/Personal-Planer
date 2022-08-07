//Creator: Aleksy Kosiński
//Version: 1.0
//My Github: https://github.com/AlkosDev

let date = new Date(); // Create a new date
localStorage.index ?? localStorage.setItem("index",0); // Local storage index will be assigned as an ID of an event. If index dosent exist we create it.
var objectindex; // This variable will temporary save an event
const days = [6,0,1,2,3,4,5,5]; // Helps determin position of the event on the table
const lastdaymonth = [31,28,31,30,31,30,31,31,30,31,30,31] // This array is used to check last day of the month

// Assign default values to create an event inuputs
DateInput.value = date.getFullYear()+"-"+(date.getMonth() < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1))+"-"+(date.getDate() < 10 ? "0"+date.getDate() : date.getDate())
timestart.value = (date.getHours() < 10 ? "0"+date.getHours() : date.getHours())+":"+(date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes());
timeend.value = ((date.getHours()+1) < 10 ? "0"+(date.getHours()+1) : (date.getHours()+1))+":"+(date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes());

// This function will update a div that's a line. This line will represt what event you should do currently
let updateline = () =>
{
    let date = new Date();
    line.style.top = (date.getHours() * 41 + 40 + date.getMinutes()*0.67) + "px"
}

updateline(); // Update the line on page load
const lineinterval = setInterval(updateline, 10000); // Make the line update every 10 minutes

// Get First Day of the Month
let MondayMonth = new Date().setDate(1);
let MonthIndex = 1;
while(new Date(MondayMonth).getUTCDay() != 1)
{
    MonthIndex++;
    MondayMonth = new Date().setDate(MonthIndex);
}

// Add 7 days untill we find current week monday
while(new Date(MondayMonth).getDate() <= new Date().getDate())
{
    MonthIndex += 7;
    MondayMonth = new Date().setDate(MonthIndex);
}
MonthIndex -= 7;
MondayMonth = new Date().setDate(MonthIndex);

// Date indexes
let sdayindex = 0;
let edayindex = 6;
let smindex = new Date().getMonth() + 1;
let emindex = new Date().getMonth() + 1;
let syearindex = 0;
let eyearindex = 0;

let RefreshWeek = () =>
{
    WeekStart = (date.getFullYear() + syearindex)+"-"+(smindex < 10 ? "0"+(smindex) : smindex)+"-"+((new Date(MondayMonth).getDate()+sdayindex) < 10 ? "0"+(new Date(MondayMonth).getDate()+sdayindex) : new Date(MondayMonth).getDate()+sdayindex); // Show the start of the week in callendar pop up
    weekstart.textContent = WeekStart;
    WeekEnd = (date.getFullYear() + eyearindex)+"-"+(emindex < 10 ? "0"+(emindex) : emindex)+"-"+(new Date(MondayMonth).getDate()+edayindex < 10 ? "0"+(new Date(MondayMonth).getDate()+edayindex) : new Date(MondayMonth).getDate()+edayindex); // Show the end of the week in callendar pop up
    weekend.textContent = WeekEnd;
}
RefreshWeek();

// Make clicked window appear and close
add.addEventListener("click",()=>{create.style.display = "initial"; createwindow.style.display = "initial";})
document.querySelector("#close").addEventListener("click",()=>{create.style.display = "none"; createwindow.style.display = "none"; infowindow.style.display = "none"; callendarwindow.style.display = "none";})
info.addEventListener("click",()=>{create.style.display = "initial"; infowindow.style.display = "initial";})
callendar.addEventListener("click",()=>{create.style.display = "initial"; callendarwindow.style.display = "initial";})

// Function that will create an object of an event so it could be saved later
function EventObject(title,DateInput,color,timestart,timeend)
{
    this.title = title;
    this.date = DateInput;
    this.color = color;
    this.timestart = timestart;
    this.timeend = timeend;
}

// Show events that are in selected week
let CreateEventFunc = () =>
{
    for(let i = 0; i != localStorage.index; i++) 
    {
        while(localStorage["event"+i] == null && i != localStorage.index) // If event dosen't exist we skip until we found one in the local storage
        {
            i++;
        }
        if(localStorage["event"+i] == null && i == localStorage.index) // If index reaches max value and there isnt an object assign to it, we break the for loop
        {
            break;
        }
        if(JSON.parse(localStorage["event"+i]).date >= WeekStart && JSON.parse(localStorage["event"+i]).date <= WeekEnd) // Check if the event is in selected week
        {
            let CreateEvent = document.createElement("div");
            CreateEvent.style.left = 13.15 * days[(new Date(JSON.parse(localStorage["event"+i]).date)).getUTCDay()] + 8 +"%"
            CreateEvent.style.top = (41 + 41 * ((JSON.parse(localStorage["event"+i]).timestart)).split(":")[0] + ((JSON.parse(localStorage["event"+i]).timestart)).split(":")[1] * 0.67  )+"px"
            CreateEvent.style.height = Math.round(-(41 + 41 * ((JSON.parse(localStorage["event"+i]).timestart)).split(":")[0] + ((JSON.parse(localStorage["event"+i]).timestart)).split(":")[1] * 0.67  )+(41 + 41 * ((JSON.parse(localStorage["event"+i]).timeend)).split(":")[0] + ((JSON.parse(localStorage["event"+i]).timeend)).split(":")[1] * 0.67 ))+"px"
            CreateEvent.textContent = (JSON.parse(localStorage["event"+i]).title)
            CreateEvent.style.backgroundColor = (JSON.parse(localStorage["event"+i]).color)
            CreateEvent.classList.add("box");
            CreateEvent.id = "event"+i;
            document.querySelector("body").appendChild(CreateEvent);
            for(let i of document.querySelectorAll(".box"))
            {
                i.addEventListener("click",()=>
                {
                    deletewindow.style.display = "initial";
                    create.style.display = "initial";
                    yes.addEventListener("click",()=>{localStorage.removeItem(i.id); i.remove(); deletewindow.style.display = "none";create.style.display = "none";});
                    no.addEventListener("click",()=>{deletewindow.style.display = "none";create.style.display = "none";})
                })
            }
        }
    }
}

CreateEventFunc(); // Show events in the current week on the start of the page

// Give a button an ability to create an event
createbutton.addEventListener("click",()=>
{
    // Check inputs
    'use strict'
    if(title.value == "" || color.value == "" || timestart.value == "" || timeend.value == "" || DateInput.value == "") // Check if every input was filled out
    {
        alert("Make sure every input is filled")
    }
    else if((title.value).length > 20)
    {
        alert("Your title is too long, make sure it's not longer that 20 characters")
    }
    else if((timestart.value).split(":")[0] > (timeend.value).split(":")[0] || (((timestart.value).split(":")[0] == (timeend.value).split(":")[0]) && (timestart.value).split(":")[1] > (timeend.value).split(":")[1])) // Make sure event time start isn't higher than time end
    {
        alert("Time start of an event can't be higher than time end")
    }
    else
    {
        objectindex = new EventObject(title.value,DateInput.value,color.value,timestart.value,timeend.value); // Assign the event to an object index
        localStorage.setItem("event"+localStorage.index,JSON.stringify(objectindex)); //Save the event in a localstorage
        localStorage.index++ // Add +1 to object index
        CreateEventFunc(); // Update the events shown on screen
        create.style.display = "none"; createwindow.style.display = "none"; // Close the window
    }
});

// Go to the next week
nextweek.addEventListener("click", ()=>
{
    if(edayindex+8 > lastdaymonth[emindex-1])
    {
        emindex+=1;
        if(emindex==13)
        {
            emindex=1;
            eyearindex+=1;
        }
        edayindex+=7;
        edayindex=edayindex-lastdaymonth[emindex-1];
    }
    else
    {
        edayindex+=7;
    }
    if(sdayindex+8 > lastdaymonth[smindex-1])
    {
        sdayindex+=7;
        sdayindex=sdayindex-lastdaymonth[smindex-1];
        smindex+=1;
        if(smindex==13)
        {
            smindex=1;
            syearindex+=1;
        }
    }
    else
    {
        sdayindex+=7;
    }
    RefreshWeek();
    for(let i of document.querySelectorAll(".box"))
    {
        i.remove()
    }
    CreateEventFunc()
})

// Go back to an previous week
previousweek.addEventListener("click", ()=>
{
    if(edayindex-6 < 1)
    {
        edayindex-=7;
        edayindex=edayindex+lastdaymonth[emindex-1];
        emindex-=1;
    }
    else
    {
        edayindex-=7;
    }
    if(emindex<1)
    {
        eyearindex-=1
        emindex=12;
    }
    if(sdayindex-6 < 1)
    {
        sdayindex-=7;
        sdayindex=sdayindex+lastdaymonth[smindex-1];
        smindex-=1;
    }
    else
    {
        sdayindex-=7;
    }
    if(smindex<1)
    {
        syearindex-=1
        smindex=12;
    }
    RefreshWeek();
    for(let i of document.querySelectorAll(".box"))
    {
        i.remove()
    }
    CreateEventFunc();
})

// Reset the week to the current one
reset.addEventListener("click", ()=>
{
    sdayindex = 0;
    edayindex = 6;
    smindex = new Date().getMonth() + 1;
    emindex = new Date().getMonth() + 1;
    syearindex = 0;
    eyearindex = 0;
    RefreshWeek();
    for(let i of document.querySelectorAll(".box"))
    {
        i.remove()
    }
    CreateEventFunc();
})