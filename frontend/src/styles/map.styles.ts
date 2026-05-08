export const mapStyles = {
  container: `
    border-2
    border-black
  `,

  map: `
    h-[100vh]
  `,

  marker: `
    w-4
    h-4
    bg-[#0000ff]
    border-2
    border-black
  `,

  popup: {
    container: `
      p-2
    `,

    title: `
      text-[12px]
      font-bold
      uppercase
      mb-1
      border-b
      border-black
      pb-1
    `,

    footer: `
      flex
      items-end
    `,

    price: `
      text-[18px]
      font-bold
    `,

    perMonth: `
      text-[10px]
      uppercase
      font-bold
      text-gray-500
    `,

    button: `
      bg-black
      text-white
      text-[10px]
      px-3
      py-1
      font-bold
      uppercase
      hover:bg-[#0000ff]
    `,
  },
};