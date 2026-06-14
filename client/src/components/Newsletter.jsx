import React from 'react';

const Newsletter = () => {
    return (
        <section className="py-24 px-4 md:px-16 lg:px-24 xl:px-32 flex justify-center bg-white">
            <div className="flex md:flex-row flex-col border border-gray-200 rounded-3xl shadow-sm items-start md:items-center justify-between gap-10 text-sm max-w-6xl w-full bg-slate-50 p-8 md:p-12">
                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-semibold text-gray-800">Subscribe to our newsletter</h1>
                    <p className="text-gray-500 mt-3 text-base">Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt dolore.</p>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mt-8">
                        <input className="py-3 px-4 w-full outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500 transition border border-gray-300 rounded-xl bg-white text-gray-700" type="email" placeholder="Enter your email" />
                        <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-3 rounded-xl text-white font-medium whitespace-nowrap active:scale-95">Subscribe</button>
                    </div>
                </div>
                <div className="space-y-4 md:max-w-48">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100/50 text-blue-600 w-max p-2.5 rounded-xl">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.834 20.167H9.167c-3.457 0-5.186 0-6.26-1.074s-1.074-2.802-1.074-6.26V11c0-3.457 0-5.185 1.074-6.26 1.074-1.073 2.803-1.073 6.26-1.073h3.667c3.456 0 5.185 0 6.259 1.074s1.074 2.802 1.074 6.26v1.833c0 3.457 0 5.185-1.074 6.259-.599.599-1.401.864-2.593.981M6.417 3.667V2.292m9.167 1.375V2.292m4.125 5.958H9.854m-8.02 0h3.552" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-800">Weekly articles</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">Non laboris consequat cupidatat laborum magna. Eiusmod non irure cupidatat duis commodo amet.</p>
                </div>
                <div className="space-y-4 md:max-w-48">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100/50 text-blue-600 w-max p-2.5 rounded-xl">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.834 3.208v6.875-5.958a1.375 1.375 0 1 1 2.75 0v5.958-3.208a1.375 1.375 0 1 1 2.75 0v7.791a5.5 5.5 0 0 1-5.5 5.5H11.8a5.5 5.5 0 0 1-3.76-1.486l-4.546-4.261a1.594 1.594 0 1 1 2.218-2.291l1.623 1.623V5.958a1.375 1.375 0 1 1 2.75 0v4.125-6.875a1.375 1.375 0 1 1 2.75 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-800">No spam</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">Officia excepteur ullamco ut sint duis proident non adipisicing. Voluptate incididunt anim.</p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
