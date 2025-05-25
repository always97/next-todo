import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
export default function Home() {
  return (
    <div>
      <Header />
      <main className="w-full flex flex-col items-center">
        <TodoInput />
      </main>
    </div>
  );
}
