import Layout from "../components/layout/Layout";

export default function AboutPage() {
    return (
        <Layout>
            <div className="p-6 lg:p-16 max-w-4xl mx-auto space-y-16">
                
                <header className="border-b-4 border-black pb-4 flex justify-between items-baseline">
                    <h1 className="text-[28px] lg:text-[40px] font-bold tracking-widest">ABOUT FAIRRENT</h1>
                    <span className="font-mono text-[14px] bg-black text-white px-3 py-1">V2.0</span>
                </header>

                <section className="text-[16px] lg:text-[20px] leading-relaxed font-bold">
                    FAIRRENT IS A MACHINE LEARNING PLATFORM DESIGNED TO NAVIGATE THE RENTAL MARKET. 
                    BY COMPARING REAL-TIME LISTINGS WITH PREDICTED MARKET VALUES, THE APP IDENTIFIES WHETHER A RENTAL PRICE IS A 
                    <span className="text-[#0000ff]"> DEAL</span>, 
                    <span className="underline decoration-2"> FAIR</span>, OR 
                    <span className="text-gray-400"> OVERPRICED</span>.
                </section>

                <section className="space-y-4">
                    <h2 className="text-[14px] font-bold text-gray-500 tracking-wider">PROJECT ARCHITECTURE</h2>
                    <div className="border-t-2 border-black divide-y divide-black font-mono text-[13px]">
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">FRONTEND</span>
                            <span>REACT / TS / TAILWIND</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">BACKEND</span>
                            <span>FASTAPI / UVICORN</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">ENGINE</span>
                            <span>XGBOOST / SCIKIT-LEARN</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">ACCURACY (R²)</span>
                            <span className="bg-[#fbffa7] px-2 font-bold text-[#0000ff]">0.7568</span>
                        </div>
                    </div>
                </section>

                <footer className="pt-4">
                    <a 
                        href="https://github.com/21Yu/FairRent" 
                        target="_blank" 
                        rel="noreferrer"
                        className="block text-center w-full py-4 font-bold border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white transition-colors text-[12px]"
                    >
                        VIEW SOURCE CODE ON GITHUB
                    </a>
                </footer>

            </div>
        </Layout>
    );
}