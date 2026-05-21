import Layout from "../components/layout/Layout";

export default function ContactPage() {
    return (
        <Layout>
            <div className="p-6 lg:p-16 max-w-2xl mx-auto space-y-16">
                
                {/* Header Section */}
                <header className="border-b-4 border-black pb-4 flex justify-between items-baseline">
                    <h1 className="text-[28px] lg:text-[40px] font-bold tracking-widest">CONTACT</h1>
                    <span className="font-mono text-[14px] bg-black text-white px-3 py-1">GET IN TOUCH</span>
                </header>

                {/* Form Section */}
                <form 
                    onSubmit={(e) => e.preventDefault()} 
                    className="space-y-8 text-[12px] font-bold"
                >
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="block tracking-wider">YOUR NAME</label>
                        <input 
                            type="text" 
                            required
                            placeholder="ENTER NAME"
                            className="appearance-none w-full bg-white border-2 border-black p-4 tracking-widest uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="block tracking-wider">EMAIL ADDRESS</label>
                        <input 
                            type="email" 
                            required
                            placeholder="NAME@EXAMPLE.COM"
                            className="appearance-none w-full bg-white border-2 border-black p-4 tracking-widest uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
                        />
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <label className="block tracking-wider">MESSAGE</label>
                        <textarea 
                            rows={5}
                            required
                            placeholder="HOW CAN WE HELP?"
                            className="appearance-none w-full bg-white border-2 border-black p-4 tracking-widest uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 resize-none font-sans normal-case"
                        />
                    </div>

                    {/* Action Button */}
                    <button 
                        type="submit"
                        className="w-full py-4 border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white transition-colors tracking-widest"
                    >
                        SEND MESSAGE
                    </button>
                </form>

                {/* Alternate Monospace Channels */}
                <footer className="border-t border-gray-300 pt-8 font-mono text-[11px] space-y-2 text-gray-500">
                    <div className="flex justify-between">
                        <span>GITHUB CHANNELS</span>
                        <a href="https://github.com/21Yu" target="_blank" rel="noreferrer" className="text-black underline hover:text-[#0000ff]">@21Yu</a>
                    </div>
                    <div className="flex justify-between">
                        <span>PROJECT INSTANCE</span>
                        <span className="text-black">FAIRRENT-PROD-V2</span>
                    </div>
                </footer>

            </div>
        </Layout>
    );
}