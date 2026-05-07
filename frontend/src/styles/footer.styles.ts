export const footerStyles = {
  footer: `
    w-full
    bg-black
    text-white
    p-4
    font-sans
    border-t-2
    border-black
  `,

  container: `
    max-w-[1600px]
    mx-auto
    flex
    flex-col
    md:flex-row
    justify-between
    items-center
    gap-4
  `,

  leftSection: `
    flex
    items-center
    gap-4
  `,

  accentBar: `
    h-6
    w-1
    bg-[#fbffa7]
  `,

  copyright: `
    text-[12px]
    font-bold
    uppercase
    tracking-[0.3em]
  `,

  brand: `
    text-[#fbffa7]
  `,

  rightSection: `
    flex
    items-center
    gap-6
  `,

  divider: `
    hidden
    md:block
    h-[1px]
    w-12
    bg-gray-700
  `,

  techStack: `
    text-[10px]
    font-mono
    text-gray-400
    uppercase
    tracking-widest
    flex
    gap-3
  `,

  techItem: `
    text-white
    hover:text-[#0000ff]
    cursor-default
    transition-colors
  `,

  decoration: `
    flex
    gap-1
  `,

  dotGray: `
    w-2
    h-2
    bg-gray-600
  `,

  dotDark: `
    w-2
    h-2
    bg-gray-800
  `,

  dotPulse: `
    w-2
    h-2
    bg-white
    animate-pulse
  `,
};