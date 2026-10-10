import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1>Permission SaaS</h1>
      <h2>Vite + React + Tailwind</h2>
      <button
        className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => setCount((count) => count + 1)}
      >
        Click to increment: {count}
      </button>
    </div>
  );
}

export default App;
