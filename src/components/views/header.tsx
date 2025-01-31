"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';

const NAV_ITEMS = [
    { href: "/", label: "Reja" },
    { href: "/requirements", label: "Qabul qilish talablari" },
    { href: "/guidelines", label: "Ko'rsatmalar" },
    { href: "/selection", label: "Saralash" },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="border-b bg-white">
            <div className="max-w-[1160px] px-5 mx-auto flex justify-between items-center py-5">
                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex gap-8">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className="text-[#252A3B] text-lg font-semibold hover:text-blue-600">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Language Selector & Button */}
                <div className="flex gap-4 items-center">
                    <Select defaultValue="uz">
                        <SelectTrigger className="border-none shadow-none">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="border-none">
                            <SelectItem value="uz">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/flag-uz.png" width={16} height={16} alt="Uzbekistan Flag" />
                                    <span className="text-sm font-semibold"> O&apos;zbek Tili</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="en">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/flag-uz.png" width={16} height={16} alt="English Flag" />
                                    <span className="text-sm font-semibold">English</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="ru">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/flag-uz.png" width={16} height={16} alt="Russian Flag" />
                                    <span className="text-sm font-semibold">Russian</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="text-white text-sm md:text-[15px] font-bold rounded-lg py-2 md:py-4">Sinovdan o’ting</Button>
                </div>
            </div>

            {/* Mobile Menu (Animated with Framer Motion) */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden bg-white border-b"
                >
                    <nav className="flex flex-col gap-4 py-4 px-5">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-[#252A3B] text-lg font-semibold hover:text-blue-600"
                                onClick={() => setIsOpen(false)} // Close menu on click
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </motion.div>
            )}
        </header>
    );
}

export default Header;
