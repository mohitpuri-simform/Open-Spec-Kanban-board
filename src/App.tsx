import { FC, useEffect } from "react";
import Board from "./components/Board";
import { useWorkspacesState } from "./hooks/useBoardState";

const App: FC = () => {
  const {
    state,
    activeWorkspace,
    setActiveWorkspace,
    createAndActivateWorkspace,
    renameActiveWorkspace,
    updateActiveBoard,
  } = useWorkspacesState();

  useEffect(() => {
    if (!activeWorkspace) return;
    document.title = activeWorkspace.name;
  }, [activeWorkspace]);

  if (!state || !activeWorkspace) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-white/70 bg-white/80 px-6 py-4 text-base font-medium text-slate-700 shadow-lg backdrop-blur">
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col p-4 md:p-6">
      <section className="grid min-h-[calc(100vh-2rem)] grid-cols-1 overflow-hidden rounded-3xl border border-white/80 bg-[#fffdf8]/90 shadow-2xl backdrop-blur md:grid-cols-[290px_1fr]">
        <aside className="border-b border-amber-100 bg-gradient-to-b from-amber-50 to-orange-50 p-4 md:border-b-0 md:border-r md:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-teal-700">
              Workspaces
            </h2>
            <button
              type="button"
              onClick={createAndActivateWorkspace}
              className="rounded-lg border border-teal-700/20 bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              aria-label="Create workspace"
            >
              + New
            </button>
          </div>

          <nav aria-label="Workspace list">
            <ul className="space-y-2">
              {state.workspaceOrder.map((workspaceId) => {
                const workspace = state.workspaces[workspaceId];
                if (!workspace) return null;
                const isActive = workspaceId === state.activeWorkspaceId;

                return (
                  <li key={workspaceId}>
                    <button
                      type="button"
                      onClick={() => setActiveWorkspace(workspaceId)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                        isActive
                          ? "bg-teal-700 text-white shadow-card"
                          : "bg-white/70 text-slate-700 hover:bg-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {workspace.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <Board
          workspaceName={activeWorkspace.name}
          onRenameWorkspace={renameActiveWorkspace}
          state={activeWorkspace.board}
          onBoardStateChange={updateActiveBoard}
        />
      </section>
    </main>
  );
};

export default App;
