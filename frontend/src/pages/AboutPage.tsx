import Layout from "../components/layout/Layout";

export default function AboutPage() {
    return (
        <Layout>
            <div className="p-6 lg:p-16 max-w-4xl mx-auto space-y-16">
                
                <header className="border-b-4 border-black pb-4 flex justify-between items-baseline">
                    <h1 className="text-[28px] lg:text-[40px] font-bold">About FairRent</h1>
                    <span className="font-mono text-[14px] bg-black text-white px-3 py-1">v2.0</span>
                </header>

                <section className="text-[16px] lg:text-[20px] leading-relaxed font-bold">
                    FairRent is a machine learning platform designed to navigate the rental market. 
                    By comparing real-time listings with predicted market values, 
                    the app identifies whether a rental price is a deal, fair, or overpriced.
                </section>

                <section className="space-y-4">
                    <h2 className="text-[14px] font-bold text-gray-500">Project architecture</h2>
                    <div className="border-t-2 border-black divide-y divide-black font-mono text-[13px]">
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">Frontend</span>
                            <span>React / TS / Tailwind</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">Backend</span>
                            <span>FastAPI / Uvicorn</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">Engine</span>
                            <span>XGBoost / Scikit-learn</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="font-bold">Accuracy (R²)</span>
                            <span className="bg-[#fbffa7] px-2 font-bold text-[#0000ff]">0.7568</span>
                        </div>
                    </div>
                </section>

                <footer className="pt-4">
                    <a 
                        href="https://github.com/21Yu/FairRent" 
                        target="_blank" 
                        rel="noreferrer"
                        className="block text-center w-full py-4 font-bold border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white text-[12px]"
                    >
                        View source code on GitHub
                    </a>
                </footer>

            </div>
        </Layout>
    );
}