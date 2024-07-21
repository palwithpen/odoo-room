import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TextField} from '@fluentui/react/lib/TextField';
import { PrimaryButton} from '@fluentui/react/lib/Button';
import { call } from './utility/api';
import { Calendar, defaultCalendarStrings } from '@fluentui/react';

// const TimeSlots = ({ slotsAvailable }) => {
//   return (
//     <div>
//       {slotsAvailable.map((slot, index) => (
//         <span key={index}>{slot}</span>
//       ))}
//     </div>
//   );
// };


function App() {
  
  const [roomData, setRoomData] = useState()
  const [searchQuery, setSearchQuery] = useState()
  const [selectedRoomData, setSelectedRoomData] = useState()
  const [selectedDate,setSelectedDate] = useState() 
  const [timeStamp,setTimeStamp] = useState()
  const [bookingStatus,setBookingState] = useState(false)

  const slotAvailable = ["10:00-10:30","10:30-11:00","11:00-11:30","11:30-12:00","12:00-12:30","12:30-1:00","1:00-1:30","1:30-2:00","2:00-2:30","2:30-3:00","3:00-3:30","3:30-4:00","4:00-4:30","4:30-5:00","5:00-5:30","5:30-6:00",,"6:00-6:30","6:30-7:00"]

  useEffect(()=>{
    getAllRoomsDetails()
  },[])

  async function getAllRoomsDetails() {
    let result = await call("GET","http://127.0.0.1:3000/room/all",{},null)
    setRoomData(result.data)
  }

  function filterRooms() {
    console.log(roomData)
    roomData.map(x=> {
      if (x.roomId==searchQuery){
        setSelectedRoomData(x)
      }
    })
  }

  function selectedTimeStamp(slot){
    console.log(slot)
  }

  function getDateFromCalender(e){
    let date = new Date.parse(e)
    setSelectedDate(date.toLocaleDateString('en-GB'))
  }

  async function bookTheSlot(){
    if(selectedRoomData){
      let result = await call("POST",`http://127.0.0.1:3000/room/${selectedRoomData["roomId"]}`,{},{"book_slot": String(selectedTimeStamp)})
      console.log(result)
      if (result.statusDescription=="SLOT_ADDED"){
        setBookingState(true)
      } else{
        setBookingState(false)
      }
    }
  }

  return (
    <div>
      <TextField placeholder='Please enter room' onChange={(e,v)=>setSearchQuery(v)}/>
      <PrimaryButton text='Search' onClick={()=>filterRooms()}/>
      {(selectedRoomData) ? <div>
      <div>Room: {selectedRoomData["roomName"]|| ""}</div>
      <div>Amanities: {selectedRoomData["amanities"].join(" ") || ""}</div>
      <div>Booking Slots: {((selectedRoomData["bookingSlots"].length >0)? selectedRoomData["bookingSlots"].join(" ") : "No Booking At the Moment")|| ""}</div>
      <div>Capacity : {selectedRoomData["capacity"] || ""}</div>
      </div>:<div>No Data  Available</div>}

      <Calendar
        showGoToToday
        onSelectDate={(e,v)=>getDateFromCalender(e)}
        value={selectedDate}
        strings={defaultCalendarStrings}
      />
      <>Got Dates</>
      <div>
       {slotAvailable.map((slot, index) => (
         <span
         className={selectedDate && selectedRoomData["bookingSlots"].includes(slot) ? "alreadySelected" : ""}
         key={index}
         onClick={() => selectedTimeStamp(slot)}
       >
         {slot}
         <span> </span>
       </span>
       ))}

       <PrimaryButton text='Book The Slot' onClick={()=>bookTheSlot(selectedTimeStamp)}/>
       
     </div>
    </div>
  )
}

export default App
