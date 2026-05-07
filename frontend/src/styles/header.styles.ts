export const headerStyles = {
  header: `
    w-full
    h-[60px]
    bg-white
    flex
  `,

  logoSection: `
    h-full
    px-8
    flex
    hover:bg-black
    hover:text-white
    transition-colors
    items-center
  `,

  title: `
    text-[20px]
    font-bold
    uppercase
  `,

  nav: `
    h-full
    flex
  `,

  navLink: (active: boolean) => `
    px-12
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
};