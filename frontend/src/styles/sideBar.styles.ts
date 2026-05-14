export const sideBarStyles = {
  container: `
    w-full
    h-screen
    bg-[#eeeeee]
    flex
    flex-col
    overflow-hidden
  `,

  header: `
    p-4
    bg-[#d1d1d1]
    flex
    items-center
    justify-between
  `,

  title: `
    font-bold
    uppercase
    tracking-[0.15em]
  `,

  sortButton: (ascending: boolean) => `
    flex
    gap-2
    px-3
    py-1
    border
    border-black
    text-[10px]
    font-bold
    uppercase
    transition-all

    ${
      ascending
        ? `
          bg-[#ff764d]
          text-black
        `
        : `
          bg-white
          text-black
          active:translate-x-[1px]
          active:translate-y-[1px]
        `
    }
  `,

  content: `
    flex-1
    p-4
    overflow-y-auto
  `,

  emptyText: `
    p-8
    font-bold
    text-center
    uppercase
    text-gray-500
    tracking-widest
  `,

};