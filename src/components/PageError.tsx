export function PageError({ title, error }: { title: string; error: unknown }) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-xl bg-surface border border-outline-variant rounded-xl p-8">
        <h1 className="font-headline text-headline-md text-on-surface mb-3">{title}</h1>
        <p className="text-body-md text-on-surface-variant break-words">{message}</p>
      </div>
    </div>
  );
}
