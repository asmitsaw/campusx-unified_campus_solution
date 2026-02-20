import React, { useState } from "react";
import { BookOpen, Search, Plus, AlertTriangle, RotateCcw, ArrowRight } from "lucide-react";

const BOOKS = [
    { id: "BK001", title: "Introduction to Algorithms", author: "Cormen, Leiserson", isbn: "978-0262033848", copies: 5, available: 2, category: "Computer Science" },
    { id: "BK002", title: "Design Patterns", author: "Erich Gamma et al.", isbn: "978-0201633610", copies: 3, available: 1, category: "Computer Science" },
    { id: "BK003", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", copies: 4, available: 0, category: "Computer Science" },
    { id: "BK004", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", copies: 6, available: 4, category: "Literature" },
    { id: "BK005", title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0553380163", copies: 3, available: 3, category: "Science" },
];

const OVERDUE = [
    { student: "Rahul Kumar", book: "Intro to Algorithms", dueDate: "Feb 10, 2026", fine: "₹75" },
    { student: "Ananya Gupta", book: "Clean Code", dueDate: "Feb 12, 2026", fine: "₹50" },
    { student: "Deepak Joshi", book: "Design Patterns", dueDate: "Feb 15, 2026", fine: "₹25" },
];

export default function ManageLibrary() {
    const [search, setSearch] = useState("");
    const [showIssue, setShowIssue] = useState(false);

    const filtered = BOOKS.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()) ||
            b.isbn.includes(search)
    );

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #A259FF" }}
                    >
                        Manage Library
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowIssue(!showIssue)}
                            className="bg-neo-green text-black border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                        >
                            <ArrowRight className="w-5 h-5" /> Issue Book
                        </button>
                        <button className="bg-neo-purple text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Add Book
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Books</p>
                        <p className="text-3xl font-black">{BOOKS.reduce((a, b) => a + b.copies, 0)}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Available</p>
                        <p className="text-3xl font-black">{BOOKS.reduce((a, b) => a + b.available, 0)}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Issued</p>
                        <p className="text-3xl font-black">{BOOKS.reduce((a, b) => a + (b.copies - b.available), 0)}</p>
                    </div>
                    <div className="bg-neo-red border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/90 mb-1">Overdue</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{OVERDUE.length}</p>
                    </div>
                </div>

                {/* Issue Form */}
                {showIssue && (
                    <div className="bg-white border-3 border-black shadow-neo p-6">
                        <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black pb-3">Issue / Return Book</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Student ID</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="CS2101" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Book ISBN</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="978-0262033848" />
                            </div>
                            <div className="flex items-end gap-3">
                                <button className="flex-1 bg-neo-green border-3 border-black py-3 font-black uppercase shadow-neo-sm hover:bg-green-400 active:shadow-none active:translate-y-[2px] transition-all">
                                    Issue
                                </button>
                                <button className="flex-1 bg-neo-yellow border-3 border-black py-3 font-black uppercase shadow-neo-sm hover:bg-yellow-300 active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-1">
                                    <RotateCcw className="w-4 h-4" /> Return
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Catalog */}
                    <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-purple">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white p-1 border-2 border-white">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic">Book Catalog</h3>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-2 border-black pl-9 pr-3 py-1.5 text-sm font-bold outline-none shadow-neo-sm"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black text-white text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-3">Book</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Category</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Copies</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Available</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {filtered.map((book) => (
                                        <tr key={book.id} className="group hover:bg-neo-bg transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-black">{book.title}</p>
                                                <p className="text-xs font-bold text-slate-500">{book.author}</p>
                                                <p className="text-xs font-mono bg-white border border-black px-1 inline-block mt-1">{book.isbn}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-sm">{book.category}</td>
                                            <td className="px-6 py-4 font-black">{book.copies}</td>
                                            <td className="px-6 py-4 font-black">{book.available}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${book.available > 0 ? "bg-neo-green" : "bg-neo-red text-white"}`}>
                                                    {book.available > 0 ? "Available" : "All Issued"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Overdue Books */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-red">
                            <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Overdue Books
                            </h3>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {OVERDUE.map((item, i) => (
                                <div key={i} className="px-5 py-4 hover:bg-neo-red/10 transition-colors">
                                    <p className="font-black text-sm">{item.student}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1">📖 {item.book}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs font-mono font-bold bg-white border border-black px-1">{item.dueDate}</span>
                                        <span className="text-sm font-black bg-neo-red text-white px-2 border-2 border-black">{item.fine}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
