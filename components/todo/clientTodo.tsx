"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/user'; 

type Todo = {
  id: number;
  title: string;
  priority: number;
};

export default function ClientTodo() {
  const supabase = createClient();
  const user = useUser(); 
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);
  console.log("Current user:", user); // kontroll

  useEffect(() => {
    const getTodos = async () => {
      const { data: todosData } = await supabase.from("todos").select();
      setTodos(todosData || []);
    };

    getTodos();
  }, []);

  const addTodo = async () => {
    if (!title || !user) return; 

    const { data, error } = await supabase.from("todos").insert([
      {
        title: title,
        priority: priority,
        user_id: user.id, 
      },
    ]);

    if (error) {
      console.error("Error adding task:", error);
      return;
    }

    setTitle("");
    setPriority(1);
    const updatedTodos = await supabase.from("todos").select();
    setTodos(updatedTodos?.data || []);
    
  };

  const updateTodo = async () => {
    if (!editId) return;

    const { error } = await supabase
      .from("todos")
      .update({ title, priority, updated_at: new Date().toISOString() })
      .eq("id", editId);

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === editId ? { ...todo, title, priority } : todo))
    );

    setEditId(null);
    setTitle("");
    setPriority(1);
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditId(todo.id);
    setTitle(todo.title);
    setPriority(todo.priority);
  };

  if (!todos || todos.length === 0) return <h1>No todos found.</h1>;

  return (
    <Card className="max-w-md mx-auto p-6 mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 mb-6">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <span className="font-semibold">{todo.title}</span> - Priority:{" "}
                <span className="text-blue-500">{todo.priority}</span>
              </div>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing(todo)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todo #1 ..."
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              min={1}
            />
          </div>

          {editId ? (
            <Button type="button" onClick={updateTodo} className="w-full">
              Update Todo
            </Button>
          ) : (
            <Button type="button" onClick={addTodo} className="w-full">
              Add New Todo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
