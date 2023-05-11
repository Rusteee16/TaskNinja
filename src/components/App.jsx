import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import List from "./List";
import CreateArea from "./CreateArea";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from "axios";



export default function App(){
    const [notes, GetNotes] = useState([]);
    const [list, setList] = useState();
    const [len, setLen] = useState(-1);

    let axiosConfig = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' ,},
  body: new URLSearchParams({ notes }).toString()
};
    async function getItems(){
        axios.get('http://localhost:3000/notes').then(res => {
                GetNotes(res.data);
                setList(notes.map(note => (
                        <Note 
                            key= {note._id}
                            id= {note._id}
                            title= {note.title}
                            content= {note.text}
                            onDelete= {DeleteNote}
                        />
                    )));
            })
            .catch(err => console.log(err));
    }

    useEffect(() => { 
        if(len !== notes.length){
            setLen(notes.length);
          getItems();
        }
    }, [notes, len]);


    function AddNote(newText){
        axios.post("http://localhost:3000/addnotes", { newText }, axiosConfig)
            .then(res => {
                GetNotes(res.data);
            })
            .catch(err => console.log(err));
    }

    function DeleteNote(id){
        axios.post("http://localhost:3000/deletenote", { id }, axiosConfig)
            .then(res => {
                GetNotes(notes.filter(i => i._id !== id));
            })
            .catch(err => console.log(err));
    }

    return(
        <>
        <Header />
        <Box sx={{ width: '98%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item md={9}>
                    <CreateArea onAdd={AddNote}/>
                    {list}
                </Grid>
            <Grid item md={3}>
                <List/>
            </Grid>
            </Grid>
        </Box>
        <Footer />
        </>
    )
};
