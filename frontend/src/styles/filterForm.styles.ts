export const filterFormStyles = {
  form: `
    bg-[#fbffa7]
    p-10
    mx-auto
  `,

  grid: `
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-4
    gap-8
  `,

  label: `
    block
    text-[14px]
    font-bold
    uppercase
    tracking-wider
    mb-3
  `,

  input: `
    w-full
    bg-white
    border-2
    border-black
    p-3
    focus:bg-[#0000ff]
    focus:text-white
    outline-none
    transition-colors
    duration-100
    font-medium
  `,

  range: `
    w-full
    h-1
    appearance-none
  `,

  valueText: `
    text-[24px]
    font-bold
    tabular-nums
  `,

  buttonWrapper: `
    mt-12
    flex
    justify-start
  `,

  button: `
    bg-[#0000ff]
    text-white
    px-8
    py-3
    font-bold
    uppercase
    tracking-widest
    hover:bg-black
    transition-colors
  `,
};