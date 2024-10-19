import { createClient } from "@/utils/supabase/server";
import ClientTodo from "@/components/todo/clientTodo";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function Index() {
  "use server";
  const supabase = createClient();

  let { data: todos, error } = await supabase.from("todos").select("*");

  if (error) return <h1>Error fetching server todos</h1>;

  async function createTodo() {
    "use server";
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .insert([{ title: "new todo", priority: 1 }])
      .select();

    if (error) return <h1>Error adding server todo</h1>;

    revalidatePath("/todo");
    return JSON.stringify(todos, null, 2);
  }

  async function updateTodo(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .update([{ title: "updated todo", priority: 2 }])
      .eq("id", id);

    if (error) return <h1>Error updating server todo</h1>;
    revalidatePath("/todo");
    return JSON.stringify(todos, null, 2);
  }

  async function deleteTodo(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) return <h1>Error deleting server todo</h1>;
    revalidatePath("/todo");
    return JSON.stringify(todos, null, 2);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Server Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 mb-6">
            {todos &&
              todos.map((todo) => (
                <li key={todo.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <span className="font-semibold">{todo.title}</span> - Priority:{" "}
                    <span className="text-blue-500">{todo.priority}</span>
                  </div>
                  <div className="space-x-2">
                    <form action={deleteTodo} className="inline">
                      <input type="hidden" name="id" value={todo.id} />
                      <Button type="submit" variant="destructive" size="sm">Delete</Button>
                    </form>
                    <form action={updateTodo} className="inline">
                      <input type="hidden" name="id" value={todo.id} />
                      <Button type="submit" variant="outline" size="sm">Update</Button>
                    </form>
                  </div>
                </li>
              ))}
          </ul>
          <form action={createTodo} className="mb-4">
            <Button type="submit" className="w-full">Add Server Todo</Button>
          </form>
        </CardContent>
      </Card>
      <ClientTodo />
    </div>
  );
}
