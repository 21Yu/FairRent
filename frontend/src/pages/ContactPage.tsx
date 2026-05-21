import Layout from "../components/layout/Layout";

export default function ContactPage() {
    return (
        <Layout>
            <div className="p-6 lg:p-16 max-w-2xl mx-auto space-y-16">
                
                <header className="border-b-4 border-black pb-4 flex justify-between items-baseline">
                    <h1 className="text-[28px] lg:text-[40px] font-bold">Contact</h1>
                    <span className="font-mono text-[14px] bg-black text-white px-3 py-1">Get in touch</span>
                </header>

                <form 
                    onSubmit={(e) => e.preventDefault()} 
                    className="space-y-8 text-[12px] font-bold"
                >
                    <div className="space-y-2">
                        <label className="block">Your name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="ENTER NAME"
                            className="appearance-none w-full bg-white border-2 border-black p-4 uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block tracking-wider">Email address</label>
                        <input 
                            type="email" 
                            required
                            placeholder="NAME@EXAMPLE.COM"
                            className="appearance-none w-full bg-white border-2 border-black p-4 uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block">Message</label>
                        <textarea 
                            rows={5}
                            required
                            placeholder="HOW CAN WE HELP?"
                            className="appearance-none w-full bg-white border-2 border-black p-4 uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 resize-none font-sans normal-case"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white"
                    >
                        Send message
                    </button>
                </form>

                <footer className="border-t border-gray-300 pt-8 font-mono text-[11px] space-y-2 text-gray-500">
                    <div className="flex justify-between">
                        <span>GitHub channels</span>
                        <a href="https://github.com/21Yu" target="_blank" rel="noreferrer" className="text-black underline hover:text-[#0000ff]">@21Yu</a>
                    </div>
                    <div className="flex justify-between">
                        <span>Project instance</span>
                        <span className="text-black">FairRent-Prod-V2</span>
                    </div>
                </footer>

            </div>
        </Layout>
    );
}