import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from './TodoList.module.css'

const getLocalItems = () => {
    let list = localStorage.getItem('list')
    if (list) {
        return JSON.parse(localStorage.getItem('list'))
    }
    else {
        return []
    }
}

const getLocalCheckedItem = () => {
    let checkItem = localStorage.getItem('completedItems')
    if (checkItem) {
        return JSON.parse(localStorage.getItem('completedItems'))
    }
    else {
        return []
    }
}

const Todo = () => {

    const [inputText, setInputText] = useState("")
    const [itemValue, setItemValue] = useState(getLocalItems())
    const [toggleEditBtn, setToggleEditBtn] = useState(true)
    const [isEditItem, setIsEditItem] = useState(null)
    const [completedItems, setCompletedItems] = useState(getLocalCheckedItem())

    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(itemValue))
    }, [itemValue])

    useEffect(() => {
        localStorage.setItem('completedItems', JSON.stringify(completedItems))
    }, [completedItems])

    const addItems = () => {
        if (!inputText) {
            alert("This field cannot be blank")
        }
        else if (inputText && !toggleEditBtn) {
            setItemValue(
                itemValue.map((item) => {
                    if (item.id === isEditItem) {
                        return { ...item, name: inputText }
                    }
                    return item
                })
            )
            setToggleEditBtn(true)
            setInputText('')
            setIsEditItem(null)
        }
        else {
            const allInputData = { id: itemValue.length === 0 ? 1 : itemValue.length + 1, name: inputText }
            setItemValue([...itemValue, allInputData])
            setInputText('')
        }
    }

    const deleteItem = (id) => {
        setItemValue(itemValue.filter((item) => {
            return id !== item.id;
        }))
    }

    const editItem = (id) => {
        const newEditItem = itemValue.find((item) => {
            return item.id === id
        })
        setToggleEditBtn(false)
        setInputText(newEditItem.name)
        setIsEditItem(id)
    }

    const toggleCheckbox = (id) => {
        if (completedItems.includes(id)) {
            setCompletedItems(completedItems.filter((e) => e !== id))
        }
        else {
            setCompletedItems([...completedItems, id])
        }
    }

    return (
        <div className={styles.mainDiv}>
            <div style={{ padding: "10px" }}>
                <h3 className="text-center" style={{
                    fontWeight: "600",
                    color: "green"
                }}>ToDo List</h3>
                <div style={{ display: "flex", marginBottom: "20px" }}>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Add a task..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    {toggleEditBtn
                        ?
                        <button
                            className="btn btn-success ml-2"
                            onClick={addItems}>Add
                        </button>
                        :
                        <button
                            className="btn btn-primary ml-2"
                            onClick={addItems}>Edit
                        </button>
                    }
                </div>
                <ol>
                    {
                        itemValue.map((item) => {
                            return (
                                <li key={item.id} style={{
                                    padding: '20px',
                                    border: '1px solid red',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={completedItems.includes(item.id)}
                                        onChange={() => toggleCheckbox(item.id)}
                                        style={{ marginRight: "10px" }}
                                    />
                                    <label
                                        htmlFor=""
                                        style={{ textTransform: "capitalize", textDecoration: completedItems.includes(item.id) ? "line-through" : "none" }}
                                    >{item.name}</label>
                                    <i
                                        className="bi bi-pencil-square ml-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => editItem(item.id)}></i>
                                    <i
                                        className="bi bi-trash ml-2"
                                        style={{ cursor: "pointer", color: "red" }}
                                        onClick={() => deleteItem(item.id)}>
                                    </i>
                                </li>
                            )
                        })
                    }
                </ol>
            </div>
        </div >
    )
}

export default Todo;