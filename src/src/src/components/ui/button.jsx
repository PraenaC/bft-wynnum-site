export function Button({ asChild, className = "", children, ...props }) {
  const Cmp = asChild ? "a" : "button";
  return (
    <Cmp
      className={`px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </Cmp>
  );
}
