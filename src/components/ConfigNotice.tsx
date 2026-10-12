/** Shown when the Supabase environment variables are missing, e.g. a fresh clone without .env.local. */
export function ConfigNotice() {
  return (
    <div role="alert" className="bg-yellow px-7 py-3 text-center text-[.85rem] text-yellow-fg">
      ScholarSpring isn’t connected to Supabase. Copy <code>.env.example</code> to <code>.env.local</code> and add your
      project URL and anon key (see the README).
    </div>
  )
}
