'use client'
import { createClient } from "@/utils/supabase/server";
import ClientTodo from "@/components/todo/clientTodo";
//import ServerTodo from "@/components/todo/serverTodo";
import { UserProvider } from "@/context/user";

export default async function Todo() {
  return (
    <UserProvider>
      <div>
        {/* <ServerTodo /> */}
        <ClientTodo />
      </div>
    </UserProvider>
  );
}
