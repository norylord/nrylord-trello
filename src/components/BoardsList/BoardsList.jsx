import React, {useEffect, useState} from 'react';
import './BoardsList.sass'
import Input from "../UI/Input/Input";

const BoardsList = () => {

    const date = new Date()

    const [boards, setBoards] = useState(() => {
        const savedBoards = JSON.parse(localStorage.getItem('boards'))
        if (savedBoards) {
            return savedBoards
        } else {
            return [{id: 1, title: 'Сделать', items: []},
                {
                    id: 2,
                    title: 'Проверить',
                    items: []
                },
                {id: 3, title: 'Сделано', items: []}]
        }
    })

    const [currentBoard, setCurrentBoard] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [task, setTask] = useState('')

    useEffect(() => {
        localStorage.setItem('boards', JSON.stringify(boards))
    }, [boards])


    function createTask() {
        if (task) {
            const newTask = {
                id: date.getTime(),
                title: task
            }
            boards[0].items.push(newTask)
            setBoards(boards => boards)
            setTask('')

        }
    }

    const enterPress = (event) => {
        if (event.key === 'Enter') {
            createTask()
        }
    }

    function dragOverHandler(e) {
        e.preventDefault()
        if (e.target.className === 'board_item') {
            e.target.style.boxShadow = '5px 10px 10px #56cfe1'
        }
    }

    function dragLeaveHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dragStartHandler(e, item, board) {
        setCurrentItem(item)
        setCurrentBoard(board)
    }

    function dragEndHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dropHandler(e, item, board) {
        e.preventDefault()
        e.stopPropagation()
        const currentIndex = currentBoard.items.indexOf(currentItem)
        currentBoard.items.splice(currentIndex, 1)
        const dropIndex = board.items.indexOf(item)
        board.items.splice(dropIndex + 1, 0, currentItem)
        setBoards(boards.map((b) => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
        e.target.style.boxShadow = 'none'
    }

    function dropCardHandler(e, board) {
        board.items.push(currentItem)
        const currentIndex = currentBoard.items.indexOf(currentItem)
        currentBoard.items.splice(currentIndex, 1)
        setBoards(boards.map((b) => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
    }

    return (
        <div className='container'>

            <div className="board_list_info">
                <h1>Nrylord Task Board</h1>
                <Input onChange={e => setTask(e.target.value)} value={task}
                       placeholder='Нажмите Enter, чтобы добавить задачу'
                       onKeyPress={e => enterPress(e)}
                />
            </div>

            <div className='boards_list'>
                {
                    boards.map(board =>
                        <div className='board'
                             onDragOver={(e) => dragOverHandler(e)}
                             onDrop={(e) => dropCardHandler(e, board)}
                        >
                            <div className="board_title">
                                {board.title}
                            </div>
                            <div className="board_items_container">
                                {board.items.map(item =>
                                    <div draggable={true}
                                         onDragOver={(e) => dragOverHandler(e)}
                                         onDragLeave={(e) => dragLeaveHandler(e)}
                                         onDragStart={(e) => dragStartHandler(e, item, board)}
                                         onDragEnd={(e) => dragEndHandler(e)}
                                         onDrop={(e) => dropHandler(e, item, board)}
                                         className='board_item' key={item.id}>
                                        {item.title}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>

    );
};

export default BoardsList;
