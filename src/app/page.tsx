import Link from "next/link";

export default function Home() {
  const routes = [
    {
      name: "debug ui",
      path: "/debug-ui",
    },
    {
      name: "geometries",
      path: "/geometries",
    },
    {
      name: "fullscreen and resizing",
      path: "/fullscreen-resizing",
    },
    {
      name: "transform object",
      path: "/transform-object",
    },
    {
      name: "Camera",
      path: "/camera",
    },
    {
      name: "Animations",
      path: "/animation",
    },
    {
      name: "Basic scene",
      path: "/basic-scene",
    },
  ];
  return (
    <main className="grid justify-items-center">
      <div className="sm:p-24 p-8 grid grid-cols-1 sm:grid-cols-2 gap-sm-8 gap-6 h-screen justify-items-center">
        <div className="grid content-center gap-y-4">
          <h1 className="text-xl sm:text-5xl">
            <a href="https://threejs-journey.com/">Three.js Journey</a>
          </h1>
          <p className="text-gray-400 underline">Become a Three.js developer</p>
        </div>
        <nav className="shadow-lg ring-1 ring-slate-900/10 rounded-3xl p-8 max-h-full min-w-full overflow-auto">
          <ul>
            {routes.map((route) => (
              <li
                key={route.path}
                className="hover:underline text-gray-400 hover:decoration-sky-500/30 hover:text-black"
              >
                <Link href={route.path}>{route.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
