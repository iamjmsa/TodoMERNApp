import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const TodoCalendar = ({ task = [] }) => {
  const calendar = task.map((todo) => ({
    id: todo._id,
    title: todo.task,
    start: new Date(todo.due),
    allDay: true,
    backgroundColor: `${
      todo.importance === "high"
        ? "#EB5353"
        : todo.importance === "medium"
        ? "#F9D923"
        : "#36AE7C"
    }`,
    extendedProps: {
      status: todo.status,
    },
  }));

  return (
    <div style={{ padding: "20px", height: "600px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendar}
        height="auto"
        eventDisplay="block"
        eventContent={(arg) => {
          const isDone = arg.event.extendedProps.status === "completed";

          return (
            <div
              style={{
                textDecoration: isDone ? "line-through" : "none",
                color: isDone ? "#fff" : "#fff",
                padding: "2px 4px",
                borderRadius: "4px",
                backgroundColor: arg.event.backgroundColor,
              }}
            >
              {arg.event.title}
            </div>
          );
        }}
      />
    </div>
  );
};

export default TodoCalendar;
