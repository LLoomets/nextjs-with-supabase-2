import { createClient } from "@/utils/supabase/server";
import ClientTodo from "@/components/todo/clientTodo";
//import ServerTodo from "@/components/todo/serverTodo";

export default async function Todo() {
  return (
    <div>
      {/* <ServerTodo /> */}
      <ClientTodo />
    </div>
  );
}
