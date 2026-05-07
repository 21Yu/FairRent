export const headerStyles = {
  header: `
    w-full
    h-[60px]
    bg-white
    border-b-2
    border-black
    flex
    items-center
    justify-between
    px-0
    relative
    z-[2000]
    font-sans
  `,

  logoSection: `
    h-full
    border-r-2
    border-black
    px-8
    flex
    items-center
    hover:bg-black
    hover:text-white
    transition-colors
    group
  `,

  logoWrapper: `
    flex
    items-center
    gap-3
  `,

  logoBars: `
    flex
    gap-[2px]
  `,

  bar: `
    w-[3px]
    h-5
    bg-current
  `,

  title: `
    text-[20px]
    font-bold
    uppercase
    tracking-tighter
  `,

  nav: `
    h-full
    flex
    flex-1
  `,

  navLink: (active: boolean) => `
    px-6
    h-full
    flex
    items-center
    text-[14px]
    font-bold
    uppercase
    tracking-widest
    transition-colors

    ${
      active
        ? "bg-[#0000ff] text-white"
        : "hover:bg-[#eeeeee] text-black"
    }
  `,

  rightSection: `
    h-full
    hidden
    md:flex
    items-center
    border-l-2
    border-black
    px-6
    gap-4
  `,

  statusWrapper: `
    flex
    gap-1
  `,

  statusDot: `
    w-3
    h-3
    rounded-full
    border
    border-black
    bg-[#ff764d]
  `,

  statusText: `
    text-[10px]
    font-bold
    uppercase
  `,
};