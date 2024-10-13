import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import { revalidatePath } from "next/cache";

type Todo = {
  id: number;
  title: string;
  priority: number;
};

export default async function ServerTodo() {
  const supabase = createClient();

  const { data: todos, error } = await supabase.from("todos").select("*");

  if (!todos || todos.length === 0) return <h1>No todos found</h1>;

  const insertTodo = async () => {
    "use server";
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: "test", priority: "2" }])
      .select();

    if (!error) {
      revalidatePath("/todo");
    }
  };

  const updateTodo = async (id: number, newTitle: string) => {
    "use server";
    const { error } = await supabase
      .from("todos")
      .update({ title: newTitle })
      .eq("id", id);

    if (!error) {
      revalidatePath("/todo");
    }
  };

  const deleteTodo = async (id: number) => {
    "use server";
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (!error) {
      revalidatePath("/todo");
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Server-Side Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 mb-6">
          {todos.map((todo: Todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <span className="font-semibold">{todo.title}</span> - Priority:{" "}
                <span className="text-blue-500">{todo.priority}</span>
              </div>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateTodo(todo.id, "Updated Title")}
                >
                  Update
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
        <Button type="button" onClick={insertTodo} className="w-full">
          Insert Todo
        </Button>
      </CardContent>
    </Card>
  );
}
