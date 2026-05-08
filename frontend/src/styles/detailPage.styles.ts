export const detailStyles = {
  container: `
    md:p-12
  `,

  header: `
    border-b-4
    border-black
    pb-6
    mb-12
    flex
    justify-between
    items-baseline
  `,

  title: `
    text-[42px]
    font-bold
    uppercase
  `,

  subtitle: `
    text-[18px]
    font-medium
    text-gray-500
    uppercase
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
  `,

  specValue: `
    text-[32px]
    font-bold
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

};