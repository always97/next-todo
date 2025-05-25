import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
export default function Home() {
  return (
    <div>
      <Header />
      <main className="w-full flex flex-col items-center">
        <TodoInput />

        <div className="mt-6 w-full flex justify-center gap-8">
          <TodoList title="TODO" />
          <TodoList title="DONE" />
        </div>
      </main>
    </div>
  );
}
