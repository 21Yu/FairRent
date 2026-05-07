export const detailStyles = {
  container: `
    max-w-5xl
    mx-auto
    p-6
    md:p-12
    font-sans
    text-black
  `,

  header: `
    border-b-4
    border-black
    pb-6
    mb-12
    flex
    flex-col
    md:flex-row
    justify-between
    items-baseline
    gap-4
  `,

  title: `
    text-[42px]
    font-bold
    uppercase
    leading-tight
    tracking-tighter
  `,

  subtitle: `
    text-[18px]
    font-medium
    text-gray-500
    uppercase
    tracking-widest
  `,

  idBox: `
    bg-black
    text-white
    px-6
    py-2
    font-mono
    text-[24px]
  `,

  grid: `
    grid
    grid-cols-1
    lg:grid-cols-3
    gap-12
  `,

  main: `
    lg:col-span-2
    space-y-12
  `,

  specsGrid: `
    grid
    grid-cols-3
    gap-1
    border-2
    border-black
    bg-black
  `,

  specCard: `
    bg-white
    p-6
    text-center
  `,

  specLabel: `
    text-[12px]
    font-bold
    uppercase
    tracking-widest
    text-gray-400
    mb-1
  `,

  specValue: `
    text-[32px]
    font-bold
    tabular-nums
  `,

  sectionTitle: `
    text-[14px]
    font-bold
    uppercase
    tracking-widest
    border-b
    border-black
    pb-2
  `,

  technicalGrid: `
    grid
    grid-cols-1
    md:grid-cols-2
    gap-x-12
    gap-y-4
    font-mono
    text-[13px]
    uppercase
  `,

  row: `
    flex
    justify-between
    border-b
    border-gray-200
    py-1
  `,

  allowed: `
    text-[#00ff00]
    font-bold
  `,

  side: `
    bg-[#eeeeee]
    border-2
    border-black
    p-8
    space-y-8
    flex
    flex-col
    h-fit
  `,

  label: `
    text-[12px]
    font-bold
    uppercase
    tracking-widest
    block
    mb-2
  `,

  price: `
    text-[48px]
    font-bold
    tabular-nums
    leading-none
  `,

  smallText: `
    text-[10px]
    font-bold
    text-gray-500
    uppercase
    mt-2
  `,

  button: (loading: boolean) => `
    w-full
    py-4
    font-bold
    uppercase
    tracking-tighter
    border-2
    border-black
    transition-all
    shadow-[4px_4px_0px_rgba(0,0,0,1)]
    active:shadow-none
    active:translate-x-[2px]
    active:translate-y-[2px]

    ${
      loading
        ? "bg-gray-200 animate-pulse"
        : "bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white"
    }
  `,

  predictionBox: `
    mt-6
    bg-black
    text-white
    p-6
    animate-in
    fade-in
    slide-in-from-top-4
    duration-300
  `,

  predictionLabel: `
    text-[10px]
    font-bold
    uppercase
    tracking-[0.2em]
    text-[#fbffa7]
  `,

  barBg: `
    mt-4
    h-1
    w-full
    bg-gray-800
  `,

  barFill: `
    h-full
    bg-[#00ff00]
  `,
};