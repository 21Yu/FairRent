export const mainPageStyles = {
  wrapper: `
    flex
    flex-col
    h-[calc(100vh-60px)]
    overflow-hidden
    bg-[#eeeeee]
  `,

  filterBar: `
    flex-shrink-0
    z-10
    shadow-md
  `,

  main: `
    flex
    flex-1
    overflow-hidden
  `,

  sidebar: `
    w-[400px]
    flex-shrink-0
    border-r-2
    border-black
    overflow-hidden
    flex
    flex-col
    bg-white
  `,

  mapSection: `
    flex-1
    relative
    bg-[#d1d1d1]
  `,

  overlay: `
    absolute
    bottom-4
    right-4
    pointer-events-none
    z-[1000]
    bg-black
    text-white
    px-3
    py-1
    text-[10px]
    font-mono
    uppercase
    tracking-widest
    border
    border-[#fbffa7]
  `,
};