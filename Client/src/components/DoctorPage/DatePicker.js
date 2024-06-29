import React, { useEffect, useState } from 'react';
import './DatePicker.css';

const DatePicker = ({ slots, onSelection, preselectedDate, preselectedStartTime, preselectedEndTime }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateIndex, setSelectedDateIndex] = useState(1);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    };
    const getDates = () => {
        let dates = [];
        let tempDate = new Date(currentDate);
        for (let i = 0; i < 5; i++) {
            dates.push(formatDate(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }
        return dates;
    };

    const handleSelection = () => {
        const selectedDate = getDates()[selectedDateIndex];
        if (selectedTimeSlot) {
            onSelection(selectedDate, selectedTimeSlot);
        }
    };

    const selectDate = (index) => {
        setSelectedDateIndex(index);
    };

    const selectTimeSlot = async (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };
    const getTimeSlotsForSelectedDay = () => {
        if (!slots || !Array.isArray(slots)) return [];

        const dayOfWeek = (selectedDateIndex + currentDate.getDay()) % 7;
        const relevantSlots = slots.filter(slot => slot.dayOfWeek === dayOfWeek);

        const timeSlots = relevantSlots.map(slot => {
            let startTime = parseInt(slot.startTime.split(':')[0], 10);
            const endTime = parseInt(slot.endTime.split(':')[0], 10);
            const timeSlotsForSlot = [];

            while (startTime < endTime) {
                // Ensuring double-digit hour format
                const startHourFormatted = startTime < 10 ? `0${startTime}` : `${startTime}`;
                const endHourFormatted = (startTime + 1) < 10 ? `0${startTime + 1}` : `${startTime + 1}`;

                timeSlotsForSlot.push(`${startHourFormatted}:00 - ${endHourFormatted}:00`);
                startTime += 1;
            }

            return timeSlotsForSlot;
        }).flat();
        return timeSlots;
    };


    useEffect(() => {
        if (selectedDateIndex && selectedTimeSlot) {
            handleSelection();
        }
    }, [selectedTimeSlot, selectedDateIndex]);
    const timeSlotsForSelectedDay = getTimeSlotsForSelectedDay();
    console.log("timeSlotsForSelectedDay" + timeSlotsForSelectedDay);
    //date and time prepopulate
    useEffect(() => {
        if (preselectedDate) {
            const preselected = new Date(preselectedDate);
            const startRange = new Date();
            const endRange = new Date();
            endRange.setDate(endRange.getDate() + 4); // Define the end date of the 5-day range

            if (preselected < startRange || preselected > endRange) {
                // Adjust the currentDate to include the preselected date in the range
                setCurrentDate(preselected);
            }
        }
    }, [preselectedDate]);

    // This useEffect hook updates the selectedDateIndex based on the preselected date
    useEffect(() => {
        const dates = getDates();
        const preselectedDateString = formatDate(new Date(preselectedDate));
        const preselectedIndex = dates.findIndex(date => date === preselectedDateString);

        setSelectedDateIndex(preselectedIndex !== -1 ? preselectedIndex : null);
    }, [preselectedDate, currentDate]);

    useEffect(() => {
        if (preselectedStartTime && preselectedEndTime) {
            // Normalize the preselected times to match the UI format (e.g., "13:00")
            const normalizeTime = (time) => time.slice(0, 5);

            const formattedPreselectedStartTime = normalizeTime(preselectedStartTime);
            const formattedPreselectedEndTime = normalizeTime(preselectedEndTime);
            const preselectedTimeSlot = `${formattedPreselectedStartTime} - ${formattedPreselectedEndTime}`;

            // Find and set the matching time slot in the UI
            const timeIndex = timeSlotsForSelectedDay.findIndex(timeSlot => timeSlot.startsWith(preselectedTimeSlot));
            if (timeIndex !== -1) {
                setSelectedTimeSlot(timeSlotsForSelectedDay[timeIndex]);
            }
        }
    }, [preselectedStartTime, preselectedEndTime, selectedDateIndex, slots, currentDate]);
    //date and time prepopulate
    const canGoBackward = () => {
        const tempDate = new Date(currentDate);
        tempDate.setDate(tempDate.getDate() - 5);
        return tempDate >= new Date();
    }
    return (
        <section className="date-time">
            <div className="selection-group">
                <p>Select Date</p>
                <div className="date-options">
                    <button disabled={!canGoBackward()} onClick={() => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 5)))}>
                        ←
                    </button>
                    {getDates().map((date, index) => (
                        <button
                            key={index}
                            className={index === selectedDateIndex ? "active" : ""}
                            onClick={() => selectDate(index)}
                        >
                            {date}
                        </button>
                    ))}
                    <button onClick={() => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 5)))}>
                        →
                    </button>
                </div>

                {timeSlotsForSelectedDay.length > 0 ? (
                    <>
                        <p>Select Time</p>
                        <div className="time-options">
                            {timeSlotsForSelectedDay.map((timeSlot, index) => (
                                <button className={timeSlot === selectedTimeSlot ? "active" : ""} onClick={() => selectTimeSlot(timeSlot)} key={index}>{timeSlot}</button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span className="validation-message">Doctor slots not available</span>
                )}
            </div>
        </section>
    );
}

export default DatePicker;
