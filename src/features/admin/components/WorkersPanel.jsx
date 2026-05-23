// WorkersPanel.jsx
// Renders worker management UI for active/inactive staff and worker creation.
export function WorkersPanel({
  activeWorkers,
  inactiveWorkers,
  workerName,
  setWorkerName,
  loading,
  handleAddWorker,
  handleToggleStatus,
}) {
  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-brew-line bg-white px-5 py-4">
        <h2 className="text-xl font-black">Worker management</h2>
        <p className="mt-2 text-sm text-brew-muted">
          Add or deactivate workers. This is useful for owners managing staff access.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
            value={workerName}
            onChange={(event) => setWorkerName(event.target.value)}
            placeholder="New worker name"
            type="text"
          />
          <button
            type="button"
            className="min-h-12 rounded-md bg-brew-coffee px-4 text-base font-black text-white disabled:bg-slate-300"
            onClick={handleAddWorker}
            disabled={!workerName.trim() || loading}
          >
            Add worker
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-brew-line bg-white p-4">
          <h3 className="text-lg font-black">Active workers</h3>
          <div className="mt-3 space-y-3">
            {activeWorkers.length ? (
              activeWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between gap-3 rounded-md border border-brew-line bg-slate-50 px-4 py-3">
                  <span className="font-black">{worker.name}</span>
                  <button
                    type="button"
                    className="rounded-md border border-brew-line bg-white px-3 py-2 text-sm font-bold text-brew-ink"
                    onClick={() => handleToggleStatus(worker.id, false)}
                    disabled={loading}
                  >
                    Deactivate
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-brew-muted">No active workers yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-brew-line bg-white p-4">
          <h3 className="text-lg font-black">Inactive workers</h3>
          <div className="mt-3 space-y-3">
            {inactiveWorkers.length ? (
              inactiveWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between gap-3 rounded-md border border-brew-line bg-slate-50 px-4 py-3">
                  <span className="font-black">{worker.name}</span>
                  <button
                    type="button"
                    className="rounded-md border border-brew-line bg-white px-3 py-2 text-sm font-bold text-brew-ink"
                    onClick={() => handleToggleStatus(worker.id, true)}
                    disabled={loading}
                  >
                    Activate
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-brew-muted">No inactive workers.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
