import Layout from "../components/layout/Layout";

export default function AboutPage() {
    return (
        <Layout>
            <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
                <header className="mb-8 border-b border-gray-200 pb-7">
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-500">A clearer view of rent</p>
                    <h1 className="text-4xl font-semibold text-gray-950 md:text-5xl">About FairRent</h1>
                </header>

                <section className="max-w-3xl text-lg leading-relaxed text-gray-700 md:text-xl">
                    FairRent is a machine learning platform designed to navigate the rental market. 
                    By comparing real-time listings with predicted market values, 
                    the app identifies whether a rental price is a deal, fair, or overpriced.
                </section>

                <footer className="mt-10 max-w-sm">
                    <a 
                        href="https://github.com/21Yu/FairRent" 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full rounded-md bg-indigo-300 px-5 py-3 text-center font-semibold text-gray-950 transition hover:bg-indigo-400"
                    >
                        View source code on GitHub
                    </a>
                </footer>

            </div>
        </Layout>
    );
}