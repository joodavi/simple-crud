import fs from "fs";
import { v4 as uuid } from 'uuid'

const DBFILE_PATH = "./db"

interface Todo {
    id: string,
    date: string,
    content: string,
    done: boolean
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false
    }

    const todos: Array<Todo> = [
        ...read(),
        todo
    ]

    fs.writeFileSync(DBFILE_PATH, JSON.stringify({
        todos
    }, null, 2))
    return todo
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DBFILE_PATH, "utf-8")
    const db = JSON.parse(dbString || "{}")
    
    if (!db.todos) {
        return []
    }
    return db.todos
}

function update(id: string, partialTodo: Partial<Todo>): Todo {
    let updatedTodo
    const todos = read()

    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id
        if (isToUpdate) {
            Object.assign(currentTodo, partialTodo)
        }
    })

    fs.writeFileSync(DBFILE_PATH, JSON.stringify({
        todos
    }, null, 2))

    if (!updatedTodo) {
        throw new Error("Please, provide another ID")
    }

    return updatedTodo
}

function CLEAR_DB() {
    fs.writeFileSync(DBFILE_PATH, "")
} 

CLEAR_DB()
create("todo 1")
create("todo 2")
const thirdTodo = create("todo 3")
update(thirdTodo.id, {
    done: true
})

console.log(read()) 