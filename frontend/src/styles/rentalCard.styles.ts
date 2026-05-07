export const rentalCardStyles = {
  listItem: `
    list-none
    mb-6
    group
  `,

  card: `
    border-2
    border-black
    bg-white
    transition-transform
    duration-75
    hover:-translate-y-1
    hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]
  `,

  header: `
    bg-black
    text-white
    p-3
    flex
    justify-between
    items-center
  `,

  title: `
    text-[16px]
    font-bold
    uppercase
    tracking-tight
    truncate
  `,

  unitId: `
    text-[12px]
    font-mono
    bg-[#0000ff]
    px-2
    py-1
  `,

  content: `
    p-4
    flex
    flex-col
    md:flex-row
    gap-6
  `,

  infoSection: `
    flex-1
    space-y-4
  `,

  label: `
    text-[12px]
    font-bold
    text-gray-500
    uppercase
    tracking-widest
  `,

  location: `
    text-[18px]
    font-medium
    leading-none
  `,

  specsWrapper: `
    flex
    gap-8
  `,

  price: `
    text-[24px]
    font-bold
    tabular-nums
    leading-none
  `,

  specs: `
    text-[14px]
    font-bold
    uppercase
    leading-none
    mt-2
  `,

  statusPanel: `
    flex
    flex-col
    gap-2
    min-w-[140px]
    border-l-0
    md:border-l-2
    border-black
    md:pl-6
  `,

  availabilityWrapper: `
    mt-auto
    pt-4
  `,

  availabilityText: `
    text-[10px]
    font-bold
    uppercase
    text-gray-400
  `,

  availabilityDays: `
    text-[12px]
    font-bold
    tabular-nums
  `,

  footerLink: `
    block
    w-full
    border-t-2
    border-black
    p-3
    text-center
    font-bold
    uppercase
    tracking-[0.2em]
    bg-[#fbffa7]
    hover:bg-[#0000ff]
    hover:text-white
    transition-colors
  `,
};

export const statusBadge = (allowed: boolean) => `
  text-[10px]
  font-bold
  uppercase
  px-2
  py-0.5
  border
  border-black
  ${allowed ? "bg-[#b3ffad]" : "bg-[#ffadad] opacity-50"}
`;