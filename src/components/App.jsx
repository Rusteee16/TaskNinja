import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { v4 as uuidv4 } from 'uuid';



export default function App(){
    const [notes, GetNotes] = useState([]);

    function AddNote(newText){
        GetNotes(prevNote => {
            return [
                ...prevNote,
                {
                    ...newText,
                    id: uuidv4()
                }
            ];
        });
    }

    function DeleteNote(id){
        GetNotes(prevNote => {
            return prevNote.filter((note) => {
                return note.id !== id;
            })
        })
    }

    return(
        <>
        <Header />
        <CreateArea onAdd={AddNote}/>
            {notes.map(note => (
                <Note 
                    key= {note.id}
                    id= {note.id}
                    title= {note.title}
                    content= {note.content}
                    onDelete= {DeleteNote}
                />
            ))}
        <Footer />
        </>
    )
};
