import ReactMarkdown from "react-markdown";
import { BsClipboard2Check, BsCodeSlash } from "react-icons/bs";
import { VscDebug } from "react-icons/vsc";
import React, { useState, useEffect } from 'react';


function Main({ activeNote, onUpdateNote }) {
    const [height, setHeight] = useState(200); // Initial height in pixels
    const [isResizing, setIsResizing] = useState(false);
    const [isJson, setIsJson] = useState(false);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight >= 100 && newHeight <= window.innerHeight * 0.9) {
                setHeight(newHeight);
            }
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const onEditField = (key, value) => {
        onUpdateNote({
            ...activeNote,
            [key]: value,
            lastmodified: Date.now(),
        })
    };

    const checkIsJson = (value) => {
        try {
            JSON.parse(value);
            setIsJson(true);
        } catch {
            setIsJson(false);
        }
    };


    const handleBodyChange = (e) => {
        const value = e.target.value;
        onEditField("body", value);
        checkIsJson(value);
    };

    const renderFormattedJson = (jsonString) => {
        try {
            const jsonObject = JSON.parse(jsonString);
            return <pre>{JSON.stringify(jsonObject, null, 2)}</pre>;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (activeNote) {
          checkIsJson(activeNote.body);
        }
      }, [activeNote]);

    if (!activeNote) return <div className="no-active-note"> <BsClipboard2Check /> Paste . <VscDebug /> Debug . <BsCodeSlash /> Code</div>;
    return <div className="app-main">
        <div className="app-main-note-edit">
            <input
                type="text"
                id="title"
                value={activeNote.title}
                onChange={(e) => onEditField("title", e.target.value)}
                autoFocus
            />
            <textarea
                id="body"
                placeholder="Paste here..."
                value={activeNote.body ||" "}
                onChange={handleBodyChange} />
        </div>

        <div className="app-main-note-preview" style={{ height: `${height}px` }}>
            <div
                className="vertical-drag-handle"
                onMouseDown={handleMouseDown}
            ></div>
            <h1 className="preview-title">{activeNote.title}</h1>
            {!isJson && (
                <ReactMarkdown className="markdown-preview">
                    {activeNote.body}
                </ReactMarkdown>)}
            {isJson && (
                <div className="json-preview">
                    {renderFormattedJson(activeNote.body)}
                </div>
            )}
        </div>
    </div>;
}

export default Main;
