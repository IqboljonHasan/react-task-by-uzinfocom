"use client"

import React from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="max-w-[1160px] px-5 mx-auto relative">
            <div className="flex flex-col items-center justify-center py-12 md:py-0 md:h-[600px]">
                <h1 className="text-2xl md:text-5xl md:leading-normal font-bold mb-8 text-center">
                    Ваша работа мечты уже ждет вас, <br className="md:block hidden" /> начните сегодня!
                </h1>
                <div className="flex flex-col md:flex-row justify-center items-center mb-8 max-w-md mx-auto">
                    <div className="flex -space-x-2 mb-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar className="border border-white ">
                            <AvatarImage src="https://githusb.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className=' bg-[#5254F1] text-white'>+120</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className="ml-4 mb-4 text-gray-600 leading-6 text-center md:text-left ">человек уже стали участниками групп по своим направлениям</span>
                </div>
                <button className="bg-[#5254F1] text-white px-8 py-3  text-xl font-semibold rounded-lg">
                    Оставить заявку
                </button>

            </div>
            <Image src="/images/html5.png" alt="Flutter" width={50} height={65} className='hidden lg:block absolute right-1/2 top-[40px]' />
            <Image src="/images/figma.png" alt="Flutter" width={50} height={65} className='hidden lg:block absolute left-[0px] top-[140px]' />
            <Image src="/images/python.png" alt="Flutter" width={65} height={65} className='hidden lg:block absolute left-[200px] bottom-[100px]' />
            <Image src="/images/flutter.png" alt="Flutter" width={50} height={65} className='hidden lg:block absolute right-[100px] top-[260px]' />
            <Image src="/images/dart.png" alt="Flutter" width={65} height={65} className='hidden lg:block absolute right-[300px] bottom-[160px]' />
        </section>
    );
}

export default Hero;
