import { BsClipboard2Check, BsPlusLg } from "react-icons/bs";
import React, { useState } from 'react';

const Sidebar = ({
  notes,
  onAddNote,
  onDeleteNote,
  activeNote,
  setActiveNote,
}) => {
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);
  const [width, setWidth] = useState(30 + '%'); // Initial width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= window.innerWidth * 0.5) {
        setWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="app-sidebar" style={{ width: `${width}px` }}>
      <div className="app-sidebar-header">
        <h1> <BsClipboard2Check /> Paste_IT</h1>
        <button onClick={onAddNote}> <BsPlusLg /> Add</button>
      </div>
      <div className="drag-handle" onMouseDown={handleMouseDown}></div>
      <div className="app-sidebar-notes">
        {sortedNotes.map(({ id, title, body, lastModified }, i) => (
          <div
            className={`app-sidebar-note ${id === activeNote && "active"}`}
            onClick={() => setActiveNote(id)}
            key={i}
          >
            <div className="sidebar-note-title">
              <strong>{title}</strong>
              <button onClick={(e) => onDeleteNote(id)}>Delete</button>
            </div>

            <p>{body && body.substr(0, 100) + "..."}</p>
            <small className="note-meta">
              Last Modified{" "}
              {new Date(lastModified).toLocaleDateString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;