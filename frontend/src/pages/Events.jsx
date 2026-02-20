import React from 'react';

export default function Events() {
  return (
    <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        
        {/* Spotlight Section */}
        <section className="@container">
            <div className="relative overflow-hidden border-3 border-neo-black bg-neo-white shadow-neo-lg">
                <div className="flex flex-col lg:flex-row">
                    <div className="relative z-10 flex flex-col items-start gap-6 p-8 md:p-12 lg:w-3/5 lg:p-16 bg-white border-b-3 lg:border-b-0 lg:border-r-3 border-neo-black">
                        <div className="inline-flex items-center gap-2 border-3 border-neo-black bg-red-500 px-4 py-1.5 shadow-neo-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-black"></span>
                            </span>
                            <span className="text-xs font-black uppercase tracking-wider text-white">Live Spotlight</span>
                        </div>
                        <div>
                            <h1 className="font-display text-5xl font-black leading-none text-neo-black md:text-6xl lg:text-7xl">
                                TECHNOVA <span className="block text-neo-primary" style={{ textShadow: "2px 2px 0px #000" }}>HACKATHON</span>
                            </h1>
                            <p className="mt-6 max-w-xl text-lg font-medium text-neo-black border-l-4 border-neo-accent pl-4">
                                Join the biggest coding marathon. <span className="bg-neo-accent px-1 font-bold">Over $10k in prizes</span>, mentorship, and 48 hours of pure innovation.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <button className="flex items-center gap-2 border-3 border-neo-black bg-neo-black px-8 py-3.5 text-sm font-bold uppercase text-white shadow-neo-sm transition-all hover:-translate-y-1 hover:bg-neo-primary hover:shadow-neo hover:text-white">
                                <span>Register Now</span>
                                <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
                            </button>
                            <button className="flex items-center gap-2 border-3 border-neo-black bg-white px-6 py-3.5 text-sm font-bold uppercase text-neo-black shadow-neo-sm transition-all hover:-translate-y-1 hover:bg-neo-bg hover:shadow-neo">
                                <span className="material-symbols-outlined !text-[20px]">info</span>
                                <span>Details</span>
                            </button>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <div className="flex flex-col items-center border-3 border-neo-black bg-neo-accent p-2 w-16 shadow-neo-sm">
                                <span className="text-2xl font-black text-neo-black">02</span>
                                <span className="text-[10px] font-bold uppercase text-neo-black">Days</span>
                            </div>
                            <div className="flex flex-col items-center border-3 border-neo-black bg-neo-blue p-2 w-16 shadow-neo-sm">
                                <span className="text-2xl font-black text-neo-black">14</span>
                                <span className="text-[10px] font-bold uppercase text-neo-black">Hrs</span>
                            </div>
                            <div className="flex flex-col items-center border-3 border-neo-black bg-neo-green p-2 w-16 shadow-neo-sm">
                                <span className="text-2xl font-black text-neo-black">45</span>
                                <span className="text-[10px] font-bold uppercase text-neo-black">Mins</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-2/5 relative min-h-[300px] bg-neo-black">
                        <img alt="Crowd at a technology hackathon event" className="h-full w-full object-cover grayscale mix-blend-hard-light hover:grayscale-0 transition-all duration-500 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-rHDyPz86_qph6Br1otLUq_pIe1J0qTNCWSK2EPHYyXLF0i8thBtfLPkUmn1sqkjWfogH8UmY4zpeVnqN-Ma-Nv8C4cRhQpN0N-CmbGh7RGyDEWbdKf3A4olQUXyYn7CzOtd--niJCqfXZPOnkHpgDDod6IPfYqfOmtvzDW7XtunsBP4SH_MVzk6Phh0Twn0QGcRoa9x-cCwat38KHHPc8TN6Fkmpk3g9oonZNwm70Yt_67ruQ2lQpcrCvIFVQbAg8DC5GB6LXwGT"/>
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
                    </div>
                </div>
            </div>
        </section>

        <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b-3 border-neo-black pb-4">
                <h2 className="text-4xl font-black uppercase text-neo-black tracking-tighter decoration-neo-accent decoration-4 underline underline-offset-4">Upcoming Events</h2>
                <div className="no-scrollbar -mx-6 flex items-center gap-3 overflow-x-auto px-6 md:mx-0 md:px-0 pb-2">
                    <button className="whitespace-nowrap border-3 border-neo-black bg-neo-black px-6 py-2 text-sm font-bold uppercase text-white shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">All Events</button>
                    <button className="whitespace-nowrap border-3 border-neo-black bg-white px-6 py-2 text-sm font-bold uppercase text-neo-black shadow-neo-sm hover:bg-neo-blue hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Technical</button>
                    <button className="whitespace-nowrap border-3 border-neo-black bg-white px-6 py-2 text-sm font-bold uppercase text-neo-black shadow-neo-sm hover:bg-neo-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Cultural</button>
                    <button className="whitespace-nowrap border-3 border-neo-black bg-white px-6 py-2 text-sm font-bold uppercase text-neo-black shadow-neo-sm hover:bg-neo-accent hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Placement</button>
                    <button className="whitespace-nowrap border-3 border-neo-black bg-white px-6 py-2 text-sm font-bold uppercase text-neo-black shadow-neo-sm hover:bg-neo-green hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Workshops</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Event Cards */}
                <article className="group relative flex flex-col border-3 border-neo-black bg-white shadow-neo transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-lg">
                    <div className="relative aspect-[4/3] w-full border-b-3 border-neo-black overflow-hidden">
                        <img alt="Group of people collaborating" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjCEjCAAl8vAFrMLwbeAs4FT1WTW812r9IFsGZe691uIlb7S_v7ZdUf7wrlqaAg7NVmpJJN_x4EqE8aAtJmqZPT8DSIKhLgzfJn9jBh3-rOmOA9pKXfmJmurNX5-TdM6doHq-oG4x_Rpim11zjw6wPWCZ9FxzgnWhPtwzH3tqMKBJwbskpPxJ8i-MesB3tZEyLQ-Zv4zdA6KbYEp35pt_yKNaMCCPLIu1r-jkAblh-MUpIrfZkeGCeWjs7Gz1nRfdYIA4uC6gfjAmm"/>
                        <div className="absolute right-0 top-0 border-b-3 border-l-3 border-neo-black bg-neo-blue px-4 py-1.5 text-xs font-black uppercase text-neo-black">
                            Technical
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 bg-white">
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-neo-black uppercase leading-tight">AI &amp; Robotics Summit</h3>
                            <p className="text-sm font-medium text-gray-600 mt-2 border-l-2 border-neo-black pl-2">Explore the future of automation with experts.</p>
                        </div>
                        <div className="mb-5 flex flex-col gap-2 bg-neo-bg p-3 border-2 border-neo-black">
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">calendar_month</span>
                                <span>OCT 24, 2024</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">schedule</span>
                                <span>10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">location_on</span>
                                <span>Main Auditorium</span>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="text-xs font-black bg-neo-green border-2 border-neo-black px-2 py-1 uppercase text-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">24 Seats left</div>
                            <button className="border-2 border-neo-black bg-neo-black px-4 py-2 text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] hover:bg-neo-primary hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                Register
                            </button>
                        </div>
                    </div>
                </article>

                <article className="group relative flex flex-col border-3 border-neo-black bg-white shadow-neo transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-lg">
                    <div className="relative aspect-[4/3] w-full border-b-3 border-neo-black overflow-hidden">
                        <img alt="Concert crowd" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMgD3-vGJv0uFysQ3yw7aZheZRjk7Fg-CyF58qkmY4wWuhJbxWjx5yZWYlhhIkdjXKqXaDTE4VmGPTicdVZ3IjpNBlm3vZAG5W0BwYMpC-ipGzZZM_JxiB6E6hZ2vYhNzrBRCBtcM4aHYTrLADtbka5zJiQ7818718HwRVvqzExdJvIBI2jwWrc0C-IuEg255tLGKFN4ejTbQxs54Nitg62y2H_CyJNZIDibMEQArrAqyJK8RFv8a2jnIdv77brOSlN988u7O1TuaK"/>
                        <div className="absolute right-0 top-0 border-b-3 border-l-3 border-neo-black bg-neo-secondary px-4 py-1.5 text-xs font-black uppercase text-neo-black">
                            Cultural
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 bg-white">
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-neo-black uppercase leading-tight">Annual Cultural Fest</h3>
                            <p className="text-sm font-medium text-gray-600 mt-2 border-l-2 border-neo-black pl-2">Music, Dance, Drama. A night to remember.</p>
                        </div>
                        <div className="mb-5 flex flex-col gap-2 bg-neo-bg p-3 border-2 border-neo-black">
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">calendar_month</span>
                                <span>NOV 02, 2024</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">schedule</span>
                                <span>6:00 PM Onwards</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">location_on</span>
                                <span>University Grounds</span>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="text-xs font-black bg-neo-accent border-2 border-neo-black px-2 py-1 uppercase text-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Filling Fast</div>
                            <button className="border-2 border-neo-black bg-white px-4 py-2 text-xs font-bold text-neo-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-black hover:text-white transition-all">
                                RSVP
                            </button>
                        </div>
                    </div>
                </article>

                <article className="group relative flex flex-col border-3 border-neo-black bg-white shadow-neo transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-lg">
                    <div className="relative aspect-[4/3] w-full border-b-3 border-neo-black overflow-hidden">
                        <img alt="Business meeting" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpCwlVxYkYxnDBMz6OHy1cAmKmKI7n7BxV7ZLDp85iP6J_GC58C5bX0qjGVSi-eNzLdsCStZQolJNZB3UjUlw1lC7uAf4j8I3Q7VLWCvPW1y2KcnRMQ7D7DOgv9Bn6fCzUbDjH-0S9oeu2vFVuStPstHWhN8lj0tL4x1_lQ6wQO4wSuFcWVph1_xq0oyEMPOdBf_-2UBc_8FPs9-ol39ZGYpj8lmXIt3pAbLE23wBKXhGNaxA77xY9subAdYF9gzhR28oLc8BkL_Wy"/>
                        <div className="absolute right-0 top-0 border-b-3 border-l-3 border-neo-black bg-neo-accent px-4 py-1.5 text-xs font-black uppercase text-neo-black">
                            Placement
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 bg-white">
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-neo-black uppercase leading-tight">Google Recruitment</h3>
                            <p className="text-sm font-medium text-gray-600 mt-2 border-l-2 border-neo-black pl-2">On-campus placement drive for SDE roles.</p>
                        </div>
                        <div className="mb-5 flex flex-col gap-2 bg-neo-bg p-3 border-2 border-neo-black">
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">calendar_month</span>
                                <span>NOV 10, 2024</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">schedule</span>
                                <span>09:00 AM Sharp</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">location_on</span>
                                <span>Placement Cell</span>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="text-xs font-black bg-white border-2 border-neo-black px-2 py-1 uppercase text-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Final Year</div>
                            <button className="border-2 border-neo-black bg-neo-black px-4 py-2 text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] hover:bg-neo-primary hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                Apply
                            </button>
                        </div>
                    </div>
                </article>

                <article className="group relative flex flex-col border-3 border-neo-black bg-white shadow-neo transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-lg">
                    <div className="relative aspect-[4/3] w-full border-b-3 border-neo-black overflow-hidden">
                        <img alt="Design workshop" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUrXcPjZmoWUwDbEg2tKnoZEW552cemShUdv_x4Wp9zt_M8w4YUe-WJZcdvywj5RNOmJfXDZZJct34uBTn6-gKQJOcJMkFsfZem4-SS4N1kjB4ZkvLqlJDpvKB-WAtMhhcltGfYGH7l0_-TP2i_-KQnGlt_Y_lj27uNInfyt5jnshtBSPcRONQVLPAlB48eq7wbyXHgAGsbsuwHj0Rtd21ADIrMVdqXz1fibGtc8kqgYlGgmGKBPLdFy9KijabnQN6_1CjWUruvAEm"/>
                        <div className="absolute right-0 top-0 border-b-3 border-l-3 border-neo-black bg-neo-green px-4 py-1.5 text-xs font-black uppercase text-neo-black">
                            Workshop
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 bg-white">
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-neo-black uppercase leading-tight">UI/UX Design Sprint</h3>
                            <p className="text-sm font-medium text-gray-600 mt-2 border-l-2 border-neo-black pl-2">Learn Figma and design thinking in 4 hours.</p>
                        </div>
                        <div className="mb-5 flex flex-col gap-2 bg-neo-bg p-3 border-2 border-neo-black">
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">calendar_month</span>
                                <span>NOV 12, 2024</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">schedule</span>
                                <span>2:00 PM - 6:00 PM</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                                <span className="material-symbols-outlined !text-[18px]">location_on</span>
                                <span>Design Studio</span>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="text-xs font-black bg-neo-blue border-2 border-neo-black px-2 py-1 uppercase text-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Open for All</div>
                            <button className="border-2 border-neo-black bg-neo-black px-4 py-2 text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] hover:bg-neo-primary hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                Register
                            </button>
                        </div>
                    </div>
                </article>
            </div>
            
            <div className="flex justify-center mt-8">
                <button className="flex items-center gap-2 border-3 border-neo-black bg-neo-white px-8 py-4 text-sm font-bold uppercase text-neo-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-neo-accent transition-all">
                    <span>Load More Events</span>
                    <span className="material-symbols-outlined !text-[24px]">expand_more</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
