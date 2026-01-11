import React, { useState } from 'react';

export default function BookingCalendar({ dateRange, setDateRange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const handleSelect = (day) => {
    if (day < today) return;
    
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: day, end: null });
    } else {
      if (day < dateRange.start) {
        setDateRange({ start: day, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: day });
      }
    }
  };

  const inRange = (day) => {
    const { start, end } = dateRange;
    if (!start || !end) return false;
    return day >= start && day <= end;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPreviousMonthDisabled = () => {
    if (currentYear < today.getFullYear()) return true;
    if (currentYear === today.getFullYear() && currentMonth <= today.getMonth()) return true;
    return false;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      
      const isPast = date < today;
      const selectedStart = isSameDay(date, dateRange.start);
      const selectedEnd = isSameDay(date, dateRange.end);
      const rangeMid = inRange(date) && !selectedStart && !selectedEnd;
      const isToday = isSameDay(date, today);

      cells.push(
        <div
          key={day}
          className={
            'calendar-day ' +
            (isPast ? 'past ' : '') +
            (isToday ? 'today ' : '') +
            (selectedStart ? 'start ' : '') +
            (selectedEnd ? 'end ' : '') +
            (rangeMid ? 'in-range ' : '')
          }
          onClick={() => !isPast && handleSelect(date)}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="calendar-range">
      <div className="calendar-header">
        <button 
          className="calendar-nav-btn" 
          onClick={goToPreviousMonth}
          disabled={isPreviousMonthDisabled()}
        >
          ‹
        </button>
        <div className="calendar-month-year">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          ›
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {weekDays.map((day, idx) => (
          <div key={idx} className="calendar-weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderCalendar()}
      </div>
    </div>
  );
}