import React, { useState, useEffect } from "react";
import axios from "axios";

export default function List(){

    const [item, setItem] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [list, setList] = useState();
    const [len, setLen] = useState(-1);

    let axiosConfig = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' ,},
    body: new URLSearchParams({ newItem }).toString()
};

    async function getItems(){
        axios.get('http://localhost:3000/todolist').then(res => {
                setItem(res.data);
                setList(item?.map(i => (
                    <div className="item" key={i._id}>
                        <input type="checkbox" name="checkbox" value={i._id} onChange={handleDelete}></input>
                        <p>{i.name}</p>
                    </div>
                )));
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(len !== item.length){
            setLen(item.length);
          getItems();
        }
    }, [item, len]);

    async function handleAdd(){
        axios.post(" http://localhost:3000/addtodolist", { newItem }, axiosConfig)
            .then(res => {
                setItem(res.data);
                setNewItem('');
            })
            .catch(err => console.log(err));
    }

    async function handleDelete(e){
        const itemId = e.target.value;
        axios.post("http://localhost:3000/deleteitem", { itemId }, axiosConfig)
            .then(res => {
                setItem(item.filter(i => i._id !== itemId));
            })
            .catch(err => console.log(err));
    };

    return(
    <>
        <div className="box" id="heading">
            <h1>To-Do List </h1>
        </div>
        
        <div className="box">
            {list}
            
            <input type="text" name="newItem" placeholder="New Item" autoComplete="off" value={newItem} onChange={(e) => setNewItem(e.target.value)}></input>
            <button onClick={handleAdd} className="addButton" name="list" value="">+</button>
            
        </div>
    </>
)
}

