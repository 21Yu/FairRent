export const mapStyles = {
  container: `
    relative
    border-2
    border-black
  `,

  map: `
    h-[60vh]
    w-full
    grayscale-[0.5]
    contrast-[1.1]
  `,

  overlay: `
    absolute
    top-4
    left-4
    z-[1000]
    bg-white
    border
    border-black
    p-2
    pointer-events-none
  `,

  overlayText: `
    text-[10px]
    font-bold
    uppercase
    tracking-widest
  `,

  marker: `
    w-4
    h-4
    bg-[#0000ff]
    border-2
    border-white
    ring-1
    ring-black
  `,

  popup: {
    container: `
      p-2
      font-sans
      text-black
    `,

    title: `
      text-[12px]
      font-bold
      uppercase
      tracking-widest
      mb-1
      border-b
      border-black
      pb-1
    `,

    location: `
      text-[11px]
      font-medium
      mb-2
    `,

    footer: `
      flex
      justify-between
      items-end
      gap-4
    `,

    price: `
      text-[18px]
      font-bold
      leading-none
      tabular-nums
    `,

    perMonth: `
      text-[10px]
      uppercase
      font-bold
      text-gray-500
    `,

    button: `
      bg-black
      text-white
      text-[10px]
      px-3
      py-1
      font-bold
      uppercase
      tracking-tighter
      hover:bg-[#0000ff]
    `,
  },
};