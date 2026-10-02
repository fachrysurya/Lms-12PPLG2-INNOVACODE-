type IconProps = {
  name: IconName;
  className?: string;
};

export type IconName =
  | "user"
  | "users"
  | "kelas"
  | "guru"
  | "book"
  | "edit"
  | "trash"
  | "plus"
  | "tugas";

const paths: Record<IconName, React.ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 19.5c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6" />
    </>
  ),

  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3.1 2.7-5.3 6-5.3s6 2.2 6 5.3" />
      <path d="M16.5 5.4a3.2 3.2 0 0 1 0 6.2" />
      <path d="M18 14.6c2 .7 3.4 2.3 3.4 4.4" />
    </>
  ),

  kelas: (
    <>
      <path d="M3.5 8.6 12 4.3l8.5 4.3L12 12.9z" />
      <path d="M7 10.7v5.1c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5.1" />
    </>
  ),

  guru: (
    <>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M5.5 19.5c0-3.2 2.9-5.4 6.5-5.4s6.5 2.2 6.5 5.4" />
      <path d="M17.5 4.5h3v3" />
    </>
  ),

  book: (
    <>
      <path d="M4.5 5.2h5.3c1.2 0 2.2.9 2.2 2.1v11.5c0-1.2-1-2.1-2.2-2.1H4.5z" />
      <path d="M19.5 5.2h-5.3c-1.2 0-2.2.9-2.2 2.1v11.5c0-1.2 1-2.1 2.2-2.1h5.3z" />
    </>
  ),

  edit: (
    <>
      <path d="M12 20h8" />
      <path d="M16.5 3.5a1.8 1.8 0 0 1 2.6 2.6L8.5 16.7 4 18l1.3-4.5z" />
    </>
  ),

  trash: (
    <>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.4 19c.1.8.8 1.5 1.6 1.5h6c.8 0 1.5-.7 1.6-1.5l.9-12.5" />
    </>
  ),

  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),

  tugas: (
    <>
      <path d="M6.5 3.8h11c.8 0 1.5.7 1.5 1.5v13.4c0 .8-.7 1.5-1.5 1.5h-11c-.8 0-1.5-.7-1.5-1.5V5.3c0-.8.7-1.5 1.5-1.5z" />
      <path d="M9 8.5h6" />
      <path d="M9 12h6" />
      <path d="M9 15.5h3.5" />
    </>
  ),
};

export default function Icon({
  name,
  className,
}: IconProps) {
  return (
    <svg
      className={
        className ? `icon ${className}` : "icon"
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
