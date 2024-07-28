import { Input, InputAdornment, Button } from '@mui/material';
import Styles from './assets/rooms.module.css';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { call } from '../../utility/api';
import { room_action } from '../../store/reducers/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, defaultCalendarStrings } from '@fluentui/react';
import { json, useNavigate } from 'react-router';
import {jwtDecode} from 'jwt-decode';

export default function Rooms() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [room, setRoom] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const { rooms, token } = useSelector((state) => state.roomSlice);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
        } else {
            validateToken(storedToken);
        }
    }, []);

    const validateToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                navigate('/login');
            }
            dispatch(room_action.saveLoginData({ token }));
            fetchData(token);
        } catch (error) {
            console.error("Token validation failed:", error);
            navigate('/login');
        }
    };

    useEffect(() => {
        setFilteredRooms(
            rooms.filter((r) =>
                r.roomName.toLowerCase().includes(room.toLowerCase())
            )
        );
    }, [room, rooms]);

    const fetchData = async (token) => {
        try {
            console.log({ "authorization": token });
            let result = await call("GET", "http://localhost:3000/room/all", { "authorization": token }, {});
            if (result["statusCode"] === 200) {
                console.log(result.data);
                dispatch(room_action.saveRoomData(result["data"]));
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    const handleRoomClick = (room) => {
        console.log(room);
        setSelectedRoom((prev) => (prev === room ? null : room));
        setSelectedSlot(null);
    };

    const handleSlotClick = (slot) => {
        if (selectedRoom && selectedDate) {
            const selectedDateFormatted = formatDate(selectedDate);
            const isBooked = selectedRoom.bookingSlots?.some(slotObj => slotObj[selectedDateFormatted]?.includes(slot));
            
            if (!isBooked) {
                setSelectedSlot((prev) => (prev === slot ? null : slot));
            } else {
                console.error('Slot already booked for the selected date');
            }
        } else {
            console.error('Please select a room first or slot already booked');
        }
    };

    const onSelectDate = (date) => {
        setSelectedDate(date);
    };

    const handleBookSlot = async () => {
        if (selectedRoom && selectedSlot && selectedDate) {
            const formattedDate = formatDate(selectedDate);
            let result = await call("POST", `http://localhost:3000/room/${selectedRoom.roomId}`, { "authorization": token.token  }, { "book_slot": selectedSlot, "booking_date": formattedDate });

            if (result["statusDescription"] === "SLOT_ADDED") {
                const updatedRoom = { ...selectedRoom };
                const bookingSlots = Array.isArray(updatedRoom.bookingSlots) ? [...updatedRoom.bookingSlots] : [];

                let slotObj = bookingSlots.find(slotObj => slotObj[formattedDate]);
                if (!slotObj) {
                    slotObj = { [formattedDate]: [] };
                    bookingSlots.push(slotObj);
                } else {
                    slotObj = { ...slotObj };
                }

                slotObj[formattedDate] = [...(slotObj[formattedDate] || []), selectedSlot];

                const updatedBookingSlots = bookingSlots.map(obj =>
                    obj[formattedDate] ? slotObj : obj
                );

                updatedRoom.bookingSlots = updatedBookingSlots;

                dispatch(room_action.saveRoomData(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room)));
                setSelectedRoom(updatedRoom);
                setSelectedSlot(null);
                alert('Slot booked successfully!');
            } else {
                alert('Failed to book the slot.');
            }
        } else {
            alert('Please select: ' +
                (!selectedRoom ? 'a room, ' : '') +
                (!selectedDate ? 'a date, ' : '') +
                (!selectedSlot ? 'a time slot' : '')
            );
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const renderTimeSlots = () => {
        const slots = [];
        let startHour = 10;
        let startMinute = 0;
        const selectedDateFormatted = formatDate(selectedDate);

        while (startHour < 19 || (startHour === 19 && startMinute === 0)) {
            const endMinute = (startMinute + 30) % 60;
            const endHour = startHour + Math.floor((startMinute + 30) / 60);
            const time = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            const isBooked = selectedRoom && selectedRoom.bookingSlots?.some(slotObj => slotObj[selectedDateFormatted]?.includes(time));
            const slotClass = selectedSlot === time ? Styles.selectedSlot : isBooked ? Styles.disabledSlot : Styles.timeSlot;

            slots.push(
                <div
                    key={time}
                    className={slotClass}
                    onClick={() => !isBooked && handleSlotClick(time)}
                >
                    {time}
                </div>
            );

            startMinute = endMinute;
            startHour = endHour;
        }

        return slots;
    };

    return (
        <div className={Styles.mainContainer}>
            <div className={Styles.pageContainer}>
                <div className={Styles.headerContainer}>
                    <div className={Styles.appName} />
                    <div className={Styles.searchContainer}>
                        <Input
                            id="input-with-icon-adornment"
                            endAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
                            placeholder='Search for meeting rooms'
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>
                </div>
                <div className={Styles.bodyContainer}>
                    <div className={Styles.roomContainer}>
                        {filteredRooms.map((room, index) => (
                            <div
                                className={`${Styles.card} ${selectedRoom === room ? Styles.selectedRoom : ''}`}
                                key={index}
                                onClick={() => handleRoomClick(room)}
                            >
                                <div className={Styles.header}>{room.roomName}</div>
                                <div className={Styles.details}>
                                    <div>Capacity: {room.capacity}</div>
                                    <div>Room Name: {room.roomName}</div>
                                    <div>Amenities: {room.amanities.join(', ')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.calendarContainer}>
                        <div className={Styles.datePicker}>
                            <Calendar
                                showMonthPickerAsOverlay
                                highlightSelectedMonth
                                showGoToToday
                                value={selectedDate}
                                onSelectDate={onSelectDate}
                                strings={defaultCalendarStrings}
                                minDate={new Date()}
                            />
                        </div>
                        <div className={Styles.timeSlotContainer}>
                            {renderTimeSlots()}
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBookSlot}
                            className={Styles.bookButton}
                        >
                            Book Slot
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
