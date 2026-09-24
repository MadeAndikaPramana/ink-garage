// Marks stand-in stock photos so nobody mistakes them for the studio's work.
export default function DemoTag({ item }) {
  if (!item?.demo) return null
  return (
    <span className="sticker !bg-paper !text-[10px] !py-0.5 !px-2 !shadow-none absolute right-3 top-3">
      Demo photo
    </span>
  )
}
