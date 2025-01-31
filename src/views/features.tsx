import Image from 'next/image';
import React from 'react';

const Features = () => {
    return (
        <section className="max-w-[1160px] px-5 mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
          <div className="md:w-1/2 flex flex-col gap-8">
            <h2 className="text-2xl md:text-4xl text-center md:text-left md:leading-normal font-bold text-[#252A3B]">
              Сайт рыбатекст поможет дизайнеру, верстальщику
            </h2>
            <p className="text-[#7F8A9E]  md:text-xl text-justify md:text-left">
              Siz IT o&#39;quv kursini tugatdingiz yoki Internet tarmog&#39;i orqali mustaqil o&#39;rgandingiz, ammo ishga joylashishda qiyinchiliklarga uchrayapsizmi? Biz sizga yordam beramiz. Ushbu loyiha qobiliyatli yoshlarni topib, yetuk kadrlar bo&#39;lib yetishishiga yordam berish uchun tashkil qilindi.
            </p>
          </div>
          <div className="flex justify-center md:justify-end md:min-h-[500px]">
            <Image src="/images/consulting.png" width={'500'} height={500} alt="Workspace" className="rounded-lg " />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mt-16 md:mt-24">
          <div className="md:w-1/2 flex justify-center md:justify-start md:min-h-[500px]">
            <Image src="/images/intern-girl-laptop.png" width={'500'} height={500} alt="Workspace" className="rounded-lg" />
          </div>
          {/* <Image src="/images/intern-girl-laptop.png" width={'500'} height={500} alt="Workspace" className="rounded-lg" style={{ height: '100%', width: 'auto' }} /> */}
          <div className="md:w-1/2 flex flex-col gap-8">
            <h2 className="text-2xl md:text-4xl text-center md:text-left md:leading-normal font-bold text-[#252A3B]">
              Aksariyat kompaniyalar ishga joylashishda sizdan ish staji va portfolio so&#39;raydi
            </h2>
            <p className="text-[#7F8A9E]  md:text-xl text-justify md:text-left">
              Tabiyki endigini bu sohaga kirib kelayotgan internlarda bular mavjud emas. Ma&#39;lum bir ish stajiga ega bo&#39;lish va turli xil qiziqarli lohiyalardan iborat portfolioni hosil qilish uchun ushbu loyihada amaliyot o&#39;tashni taklif qilamiz.

            </p>
            <p className="text-[#7F8A9E]  md:text-xl text-justify md:text-left">
              Amaliyotchilar soni chegaralangan va konkurs asosida saralab olinadi. Eng yuqori ball to&#39;plagan 10 kishi bepul amaliyot o&#39;tash imkoniyatiga ega bo&#39;ladi.
            </p>
            <div className="flex items-center mt-4">
            </div>
          </div>

        </div>
      </section>
    );
}

export default Features;
