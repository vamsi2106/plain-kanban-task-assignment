import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white p-4 ">
            <div className="container mx-auto flex justify-between items-center ">
                <Link to="/" className="text-xl font-bold ml-18">Task Manager</Link>

                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>
                <ul className={`md:flex space-x-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <li><Link to="/" className="hover:text-gray-400 mr-40 font-medium">Projects</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
