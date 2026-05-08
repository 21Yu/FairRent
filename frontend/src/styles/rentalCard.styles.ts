export const rentalCardStyles = {
  listItem: `
    mb-6
  `,

  card: `
    border-2
    border-black
    bg-white
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
  `,

  specsWrapper: `
    flex
    gap-8
  `,

  price: `
    text-[24px]
    font-bold
  `,

  specs: `
    text-[14px]
    font-bold
    uppercase
  `,

  statusPanel: `
    flex
    flex-col
    gap-2
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
    bg-[#fbffa7]
    hover:bg-[#0000ff]
    hover:text-white
    transition-colors
  `,
};

export const statusBadge = (allowed: number) => `
  text-[10px]
  font-bold
  uppercase
  px-2
  py-0.5
  border
  border-black
  ${allowed ? "bg-[#b3ffad]" : "bg-[#ffadad] opacity-50"}
`;