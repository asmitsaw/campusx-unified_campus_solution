import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [myRequests, setMyRequests]   = useState([]);
  const [toast, setToast]             = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchIssuedBooks = async () => {
    try {
        if (!user) return;
        const response = await fetch(`http://localhost:5000/api/library/my-books?user_id=${user.id}`);
        if (response.ok) {
            const data = await response.json();
            setIssuedBooks(data || []);
        }
    } catch (error) {
        console.error("Error fetching issued books:", error);
    }
  };

  const fetchMyRequests = async () => {
    try {
        if (!user) return;
        const response = await fetch(`http://localhost:5000/api/library/my-requests?user_id=${user.id}`);
        if (response.ok) {
            const data = await response.json();
            setMyRequests(data || []);
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssuedBooks();
      fetchMyRequests();
    }
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/library/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (response.ok) {
            setSearchResults(data || []);
        } else {
            console.error("Search failed:", data);
            setSearchResults([]);
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleRequestBook = async (book) => {
    if (!user) {
        showToast('Please log in to request books.', 'error');
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/api/library/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id:    user.id,
                user_name:  user.name  || null,
                user_email: user.email || null,
                title:  book.title,
                author: book.author,
                image:  book.image
            })
        });
        const result = await response.json();
        if (response.ok) {
            showToast(`Request for "${book.title}" submitted! The librarian will review it.`);
            fetchMyRequests();
            setSearchResults([]);
            setSearchQuery('');
        } else if (response.status === 409) {
            showToast(result.message, 'error');
        } else {
            showToast(`Failed: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error("Error requesting book:", error);
        showToast('Error connecting to server.', 'error');
    }
  };

  return (
    <div className="font-display bg-neo-bg text-neo-black min-h-screen overflow-x-hidden p-6 -m-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 border-3 border-black font-black text-sm shadow-neo
          ${toast.type === 'error' ? 'bg-neo-red text-white' : 'bg-neo-green text-black'}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
        
        {/* Header Section (Replicated from HTML) */}
        <header className="flex h-20 items-center justify-between border-b-3 border-black bg-white px-6 sticky top-0 z-30 shadow-sm hidden">
             {/* This header is usually handled by the main layout, but for exact replication internally: */}
             {/* We will implement the content within the main page area as requested */}
        </header>
        
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter" style={{ textShadow: "2px 2px 0px #A259FF" }}>
                Library Resource Manager
            </h1>
        </div>

        {/* Action Required Section */}
        <div className="grid gap-6 md:grid-cols-12">
            <div className="col-span-12 bg-neo-red border-3 border-black p-0 flex flex-col sm:flex-row shadow-neo">
                <div className="flex-1 p-5 flex gap-4 items-center">
                    <div className="flex size-14 shrink-0 items-center justify-center bg-black text-white border-2 border-white">
                        <span className="material-symbols-outlined text-3xl font-bold">warning</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase mb-1" style={{ textShadow: "2px 2px 0px #000" }}>Action Required</h3>
                        <p className="text-sm font-bold text-black bg-white inline-block px-2 py-1 border-2 border-black">'Introduction to Algorithms' is 3 days overdue. Fine: ₹0.00</p>
                    </div>
                </div>
                <button className="sm:border-l-3 border-t-3 sm:border-t-0 border-black bg-white hover:bg-gray-100 px-8 py-4 font-black text-lg uppercase transition-colors flex items-center justify-center gap-2 group">
                    Pay Now
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Catalog Search */}
                <div className="bg-white p-6 border-3 border-black shadow-neo">
                    <h3 className="font-black text-xl mb-4 uppercase">Catalog Search</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                                <span className="material-symbols-outlined">manage_search</span>
                            </div>
                            <input 
                                className="w-full h-14 border-2 border-black pl-12 pr-4 text-black font-bold placeholder-gray-500 focus:bg-neo-yellow focus:ring-0 transition-colors shadow-sm outline-none" 
                                placeholder="Search by title, author, or publisher..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleSearch}
                                disabled={loading}
                                className="h-14 px-8 border-2 border-black bg-neo-purple text-white font-black hover:bg-purple-600 transition-colors shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none flex items-center gap-2"
                            >
                                {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <span>SEARCH</span>}
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-h-[600px] overflow-y-auto">
                            {searchResults.map((book) => (
                                <div key={book.id || book.title} className="flex gap-4 p-4 border-2 border-black bg-neo-bg hover:shadow-neo-sm transition-all">
                                    <div className="w-20 h-28 shrink-0 bg-gray-200 border-2 border-black overflow-hidden">
                                        <img 
                                            src={book.image || "https://placehold.co/100x150?text=No+Image"} 
                                            alt={book.title} 
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => e.target.src = "https://placehold.co/100x150?text=No+Image"}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1">
                                        <div>
                                            <h4 className="font-black text-lg leading-tight line-clamp-2">{book.title}</h4>
                                            <p className="text-xs font-bold text-gray-600 mt-1">{book.author}</p>
                                            <p className="text-xs mt-1 bg-white inline-block border border-black px-1 font-mono truncate max-w-[150px]">{book.publisher} • {book.year}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleRequestBook(book)}
                                            className="self-start mt-2 bg-neo-blue text-white px-4 py-1.5 text-xs font-black uppercase border-2 border-black hover:bg-neo-green hover:text-black transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">bookmark_add</span>
                                            Request Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {searchQuery && searchResults.length === 0 && !loading && (
                        <div className="text-center py-8 font-bold text-gray-500 uppercase">
                            No books found. Try a different search.
                        </div>
                    )}
                </div>

                {/* My Book Requests */}
                {myRequests.length > 0 && (
                    <div className="flex flex-col bg-white border-3 border-black shadow-neo">
                        <div className="flex items-center gap-3 px-6 py-5 border-b-3 border-black bg-neo-yellow">
                            <div className="bg-black text-black p-1 border-2 border-white shadow-sm">
                                <span className="material-symbols-outlined block text-white">pending_actions</span>
                            </div>
                            <h3 className="text-xl font-black text-black uppercase italic">My Book Requests</h3>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {myRequests.map((req) => {
                                const badgeMap = {
                                    pending:  "bg-neo-yellow text-black",
                                    approved: "bg-neo-green text-black",
                                    rejected: "bg-neo-red text-white",
                                };
                                return (
                                    <div key={req.id} className="flex items-center justify-between px-6 py-4 hover:bg-neo-bg transition-colors">
                                        <div>
                                            <p className="font-black">{req.title}</p>
                                            {req.author && <p className="text-xs font-bold text-gray-500">{req.author}</p>}
                                            <p className="text-xs font-mono mt-1">
                                                {new Date(req.requested_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`inline-block px-3 py-1 border-2 border-black text-xs font-black uppercase ${badgeMap[req.status] || "bg-gray-200"}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Issued Books Table */}
                <div className="flex flex-col bg-white border-3 border-black shadow-neo">
                    <div className="flex items-center justify-between px-6 py-5 border-b-3 border-black bg-neo-blue">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                <span className="material-symbols-outlined block">library_books</span>
                            </div>
                            <h3 className="text-2xl font-black text-black uppercase italic">Issued Books</h3>
                        </div>
                        <button className="text-sm font-bold text-black border-2 border-black bg-white px-3 py-1 hover:bg-black hover:text-white transition-colors shadow-neo-sm">View History</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white text-sm uppercase font-bold border-b-3 border-black">
                                <tr>
                                    <th className="px-6 py-4">Book Details</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Issued On</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Due Date</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-center">Status</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black text-black">
                                {issuedBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center font-bold text-gray-500 uppercase">
                                            No books issued yet.
                                        </td>
                                    </tr>
                                ) : (
                                    issuedBooks.map((book) => {
                                        const dueDate = new Date(book.due_date);
                                        const isOverdue = new Date() > dueDate;
                                        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                                        
                                        return (
                                            <tr key={book.id} className={`group transition-colors ${isOverdue ? "bg-neo-red/10 hover:bg-neo-red/20" : "hover:bg-neo-bg"}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-20 w-14 shrink-0 overflow-hidden border-2 border-black bg-gray-200 shadow-neo-sm group-hover:scale-110 transition-transform">
                                                            <img 
                                                                alt={book.title} 
                                                                className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                                                                src={book.image || "https://placehold.co/100x150?text=No+Image"}
                                                                referrerPolicy="no-referrer"
                                                                onError={(e) => e.target.src = "https://placehold.co/100x150?text=No+Image"}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg">{book.title}</p>
                                                            <p className="text-sm font-bold">{book.author}</p>
                                                            <p className="text-xs mt-1 font-mono bg-white inline-block border border-black px-1">ID: {book.book_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold">{new Date(book.issue_date).toLocaleDateString()}</td>
                                                <td className={`px-6 py-4 font-black ${isOverdue ? "text-neo-red" : "text-neo-black"}`}>
                                                    {dueDate.toLocaleDateString()}
                                                    <br/>
                                                    <span className="text-xs font-normal text-gray-600">
                                                        {isOverdue ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isOverdue ? (
                                                        <span className="inline-flex items-center bg-neo-red border-2 border-black px-3 py-1 text-xs font-black text-white uppercase shadow-neo-sm transform -rotate-2">
                                                            Overdue
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center bg-neo-green border-2 border-black px-3 py-1 text-xs font-black text-black uppercase shadow-neo-sm">
                                                            On Time
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isOverdue ? (
                                                        <button className="border-2 border-black bg-neo-black text-white px-4 py-2 text-sm font-bold hover:bg-neo-red transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">Pay Fine</button>
                                                    ) : (
                                                        <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-yellow transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">Renew</button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 bg-neo-purple border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="material-symbols-outlined text-2xl text-white">book</span>
                        </div>
                        <p className="text-xs font-bold text-white/90 uppercase mb-1">Total Issued</p>
                        <p className="text-4xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>3</p>
                    </div>
                    <div className="col-span-1 bg-neo-green border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="material-symbols-outlined text-2xl text-black">bookmark_add</span>
                        </div>
                        <p className="text-xs font-bold text-black/80 uppercase mb-1">Requested</p>
                        <p className="text-4xl font-black text-black">1</p>
                    </div>
                    <div className="col-span-2 bg-neo-red border-3 border-black p-4 shadow-neo flex items-center justify-between hover:-translate-y-1 transition-transform">
                        <div>
                            <p className="text-xs font-bold text-white uppercase mb-1">Total Fines Due</p>
                            <p className="text-4xl font-black text-white" style={{ textShadow: "3px 3px 0px #000" }}>$1.50</p>
                        </div>
                        <div className="flex size-14 items-center justify-center bg-white border-3 border-black shadow-neo-sm transform rotate-6">
                            <span className="material-symbols-outlined text-3xl text-black">attach_money</span>
                        </div>
                    </div>
                </div>

                {/* Fine Calculator */}
                <div className="bg-white border-3 border-black p-0 shadow-neo">
                    <div className="bg-neo-yellow border-b-3 border-black p-4 flex items-center gap-2">
                        <span className="material-symbols-outlined font-bold">calculate</span>
                        <h3 className="font-black text-lg uppercase">Fine Calculator</h3>
                    </div>
                    <div className="p-5 space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Select Book</label>
                            <select className="w-full border-2 border-black bg-neo-bg py-3 px-4 text-sm font-bold focus:ring-0 focus:border-neo-purple shadow-neo-sm outline-none">
                                <option>Clean Code (Due Tomorrow)</option>
                                <option>Design Patterns</option>
                                <option>Intro to Algorithms</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Days Overdue</label>
                            <div className="flex items-center gap-4 bg-neo-bg border-2 border-black p-2 shadow-neo-sm">
                                <input className="w-full h-3 bg-white rounded-none appearance-none cursor-pointer border-2 border-black accent-neo-purple" max="30" min="0" type="range" defaultValue="3"/>
                                <div className="bg-neo-purple text-white font-black border-2 border-black w-10 h-8 flex items-center justify-center">3</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-black flex items-center justify-between">
                            <span className="text-sm font-bold">Estimated Fine:</span>
                            <span className="text-3xl font-black bg-neo-red text-white px-2 border-2 border-black transform -rotate-2">$1.50</span>
                        </div>
                        <button className="w-full border-2 border-black bg-black text-white py-3 text-sm font-black uppercase hover:bg-neo-purple hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">
                            Check Policy
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-3 border-black p-5 shadow-neo relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-neo-blue rounded-full border-2 border-black"></div>
                    <h3 className="font-black text-lg uppercase mb-4 relative z-10">Quick Actions</h3>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-yellow hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-purple flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                                </div>
                                <span className="text-sm font-bold">Book a Room</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-blue hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-blue flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">recommend</span>
                                </div>
                                <span className="text-sm font-bold">Suggest Purchase</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/lib-attendance')}
                            id="lib-attendance-entry-btn"
                            className="w-full flex items-center justify-between border-[3px] border-black bg-[#39FF14] p-3 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-black flex items-center justify-center text-[#39FF14]">
                                    <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                                </div>
                                <span className="text-sm font-black uppercase">Library Attendance (QR)</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-green hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-green flex items-center justify-center text-black">
                                    <span className="material-symbols-outlined text-sm">help</span>
                                </div>
                                <span className="text-sm font-bold">Librarian Chat</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
