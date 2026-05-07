export const sideBarStyles = {
  container: `
    w-full
    h-full
    bg-[#eeeeee]
    border-r-2
    border-black
    flex
    flex-col
    font-sans
    text-black
  `,

  header: `
    p-4
    bg-[#d1d1d1]
    border-b-2
    border-black
    flex
    items-center
    justify-between
  `,

  title: `
    text-[12px]
    font-bold
    uppercase
    tracking-[0.15em]
  `,

  sortButton: (ascending: boolean) => `
    flex
    items-center
    gap-2
    px-3
    py-1
    border
    border-black
    text-[10px]
    font-bold
    uppercase
    transition-all
    shadow-[2px_2px_0px_rgba(0,0,0,1)]

    ${
      ascending
        ? `
          bg-[#ff764d]
          text-black
        `
        : `
          bg-white
          text-black
          active:shadow-none
          active:translate-x-[1px]
          active:translate-y-[1px]
        `
    }
  `,

  sortLabel: `
    opacity-70
  `,

  content: `
    flex-1
    overflow-y-auto
    p-4
    custom-scrollbar
  `,

  emptyState: `
    mt-20
    text-center
    border-2
    border-dashed
    border-gray-400
    p-8
  `,

  emptyText: `
    text-[11px]
    font-bold
    uppercase
    text-gray-500
    tracking-widest
  `,

  list: `
    space-y-4
  `,

  footer: `
    p-2
    bg-black
    text-[9px]
    text-white
    uppercase
    tracking-widest
    font-mono
    flex
    justify-between
  `,

  cpu: `
    text-[#fbffa7]
  `,
};