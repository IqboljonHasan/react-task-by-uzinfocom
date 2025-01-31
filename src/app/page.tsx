"use client";
import { DataTable as UserTable } from '@/components/data-table';
import { apiUrl } from '@/lib/constants';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';

const NAV_ITEMS = [
  { href: "/", label: "Reja" },
  { href: "/requirements", label: "Qabul qilish talablari" },
  { href: "/guidelines", label: "Ko'rsatmalar" },
  { href: "/selection", label: "Saralash" },
];
interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  "last name": string;
  avatar: string;
}
interface Counts {
  category_id: string;
  user_id: string;
  count: number;
}

type UserName = {
  id: string
  avatar: string
  firstName: string
  lastName: string
}

type CountsData = {
  id: string
  name: UserName
  total: number
  [key: string]: unknown
}

const LandingPage = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [users, setUsers] = useState<User[]>();
  const [counts, setCounts] = useState<Counts[]>()

  const [category, setCategory] = useState<Category>();
  const [user, setUser] = useState<User>();
  const [count, setCount] = useState<number>();
  const [formError, setFormError] = useState<string>();

  const [columns, setColumns] = useState<ColumnDef<CountsData>[]>([]);
  const [data, setData] = useState<CountsData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {

    async function fetchColumns() {
      try {
        const categoriesResponse = await fetch(apiUrl + "/categories");
        const categoriesData: Category[] = await categoriesResponse.json();

        const usersResponse = await fetch(apiUrl + "/users");
        const usersData: User[] = await usersResponse.json();

        const countsResponse = await fetch(apiUrl + "/counts");
        const countsData: Counts[] = await countsResponse.json();

        setCategories(categoriesData);
        setUsers(usersData);
        setCounts(countsData);

        const categoryColumns: ColumnDef<CountsData>[] = categoriesData.map((item) => ({
          id: item.id.toString(),
          accessorKey: item.id.toString(),
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {item.name}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const count: number = row.getValue(item.id.toString());
            return <div className={"text-center " + (count > 0 ? 'text-green-400' : 'text-red-400')}>{count || 0}</div>;
          },
          sortingFn: (rowA, rowB, columnId) => {
            const a = Number(rowA.getValue(columnId)) || 0;
            const b = Number(rowB.getValue(columnId)) || 0;
            return a - b;
          },
          footer: ({ table }) => {
            const total = table
              .getColumn(item.id.toString())
              ?.getFacetedRowModel()
              .flatRows.reduce((sum, row) => sum + (Number(row.getValue(item.id.toString())) || 0), 0);

            return typeof total === "number" ? (
              <div className="text-center ">{total}</div>
            ) : null;
          }
        }));

        const columns: ColumnDef<CountsData>[] = [
          {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => {
              const name: UserName = row.getValue("name");
              return <div className="flex items-center gap-x-2">
                {name.avatar && name.avatar.length
                  ? <Image src={name.avatar} width={20} height={20} alt="" className="w-8 h-8 rounded-full" />
                  : name.id == 'subtotal' ? <></>
                    : <div className="rounded-full bg-green-800 text-white uppercase text-center size-6">
                      {name?.firstName[0]} {name?.lastName[0]}
                    </div>
                }
                <span className='text-nowrap'>{name.id == 'subtotal' ? <>Общее  (Category&apos;s total)</> : <div>{name.firstName} {name.lastName} </div>}</span>
              </div>;
            },
            footer: () =>
              <div className="">Sub Total</div>
          }
        ];

        columns.push(...categoryColumns);

        columns.push({
          id: "total",
          accessorKey: "total",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                (User&apos;s) Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const total: number = row.getValue("total");
            return <div className="text-center">{total}</div>;
          },
          footer: ({ table }) => {
            const total = table
              .getColumn("total")
              ?.getFacetedRowModel()
              .flatRows.reduce((sum, row) => sum + (Number(row.getValue('total')) || 0), 0);

            return typeof total === "number" ? (
              <div className="text-center ">{total}</div>
            ) : null;
          }
        });

        setColumns(columns);


        const data: CountsData[] = usersData.map((user) => {
          const dd: CountsData = {
            id: user.id.toString(),
            name: {
              id: user.id.toString(),
              avatar: user.avatar,
              firstName: user.first_name,
              lastName: user['last name']
            },
            total: 0,
          }
          return dd;
        });

        // data.push({
        //   id: "subtotal",
        //   name: {
        //     id: "subtotal",
        //     avatar: "",
        //     firstName: "subtotal",
        //     lastName: "subtotal"
        //   },
        //   total: 0,
        // });

        countsData.forEach((count) => {
          const item = data.find((d) => d.id == count.user_id);
          if (item) {
            item[count.category_id] = count.count || 0;
            item.total = (item.total || 0) + count.count;
          }

          const totalRow = data.find((d) => d.id == "total");
          if (totalRow) {
            totalRow[count.category_id] = ((totalRow[count.category_id] as number) || 0) + count.count;
            totalRow.total = (totalRow.total || 0) + count.count;
          }
        });

        setData(data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchColumns();
  }, []);



  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!user || !category || count === undefined) {
      setFormError(
        !user ? "Please select a user" :
          !category ? "Please select a category" :
            "Please enter a count value"
      );
      return;
    }
    setFormError("");

    // fetch(`${apiUrl}/counts`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ category_id: category?.id, user_id: user.id, count }),
    // })
    //   .then(res => res.json())
    //   .then(data => console.log(data));

    let oldCount: number
    const updatedData = data.map((c) => {
      if (c.name.id == user.id.toString()) {
        console.log({ c });
        oldCount = Number(c[category.id.toString()]) || 0;
        c.total = (c.total || 0) - oldCount + count;
        c[category.id.toString()] = count;

      }
      if (c.name.id == "subtotal") {
        console.log({ c });
        const oldSubTotal = (Number(c[category.id.toString()]) || 0);
        c[category.id.toString()] = oldSubTotal - oldCount + count;
        c.total = (c.total || 0) - oldCount + count;
      }
      // 31623   -13573   -160426
      return c;
    });

    setData(updatedData);

  };

  useEffect(() => {
    console.log({ user, category, counts });

    if (user && category && counts) {
      const item = counts.find((c: Counts) => c.user_id == user?.id.toString() && c.category_id == category?.id.toString());
      console.log({ item });
      if (item) {
        setCount(item?.count);
      }
      else {
        console.log("resetting count");

        setCount(0);
      }
    }
  }, [user, category, counts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="max-w-[1160px] px-5 mx-auto relative">
        <div className="flex flex-col items-center justify-center h-[600px]">
          <h1 className="text-2xl md:text-5xl leading-normal font-bold mb-8 text-center">
            Ваша работа мечты уже ждет вас, <br /> начните сегодня!
          </h1>
          <div className="flex justify-center items-center mb-8 max-w-md mx-auto">
            <div className="flex -space-x-2">
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
            <span className="ml-4 text-gray-600 leading-6">человек уже стали участниками групп по своим направлениям</span>
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



      {/* Features Section */}
      <section className="max-w-[1160px] px-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl md:text-4xl leading-normal font-bold mb-4 text-[#252A3B]">
              Сайт рыбатекст поможет дизайнеру, верстальщику
            </h2>
            <p className="text-[#7F8A9E]  md:text-xl">
              Siz IT o&#39;quv kursini tugatdingiz yoki Internet tarmog&#39;i orqali mustaqil o&#39;rgandingiz, ammo ishga joylashishda qiyinchiliklarga uchrayapsizmi? Biz sizga yordam beramiz. Ushbu loyiha qobiliyatli yoshlarni topib, yetuk kadrlar bo&#39;lib yetishishiga yordam berish uchun tashkil qilindi.
            </p>
          </div>
          <div className="flex justify-end min-h-[500px">
            <Image src="/images/consulting.png" width={'500'} height={500} alt="Workspace" className="rounded-lg" style={{ height: '100%', width: 'auto' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-24">
          <Image src="/images/intern-girl-laptop.png" width={'500'} height={500} alt="Workspace" className="rounded-lg" style={{ height: '100%', width: 'auto' }} />
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl md:text-4xl leading-normal font-bold mb-4 text-[#252A3B]">
              Aksariyat kompaniyalar ishga joylashishda sizdan ish staji va portfolio so&#39;raydi
            </h2>
            <p className="text-[#7F8A9E] md:text-xl">
              Tabiyki endigini bu sohaga kirib kelayotgan internlarda bular mavjud emas. Ma&#39;lum bir ish stajiga ega bo&#39;lish va turli xil qiziqarli lohiyalardan iborat portfolioni hosil qilish uchun ushbu loyihada amaliyot o&#39;tashni taklif qilamiz.

            </p>
            <p className="text-[#7F8A9E] md:text-xl">
              Amaliyotchilar soni chegaralangan va konkurs asosida saralab olinadi. Eng yuqori ball to&#39;plagan 10 kishi bepul amaliyot o&#39;tash imkoniyatiga ega bo&#39;ladi.
            </p>
            <div className="flex items-center mt-4">
            </div>
          </div>

        </div>
      </section>

      {/* Application Form */}
      <section className="relative w-full overflow-hidden mt-20 min-h-[400px] md:h-[600px]">
        <div className="hidden md:block w-[calc(100vw+100px)] absolute top-0 -left-[50px]">
          <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className='w-full'>
            <ellipse cx="100" cy="30" rx="100" ry="30" fill="#F3F7F9" />
          </svg>
        </div>
        <div className="bg-[#F3F7F9] w-full h-[400px] absolute md:top-[200px] left-0">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-2xl md:text-4xl pt-12 leading-normal font-bold text-center text-[#252A3B]">
              Форма заявки
            </h2>
            <form className="space-y-4 min-w-[300px] md:min-w-[500px]">
              <div className="space-y-2">
                <select className="w-full p-3 border rounded-lg" value={user?.id} title="Select User" onChange={e => setUser(users?.find(u => u.id === parseInt(e.target.value)))}>
                  <option value="">User</option>
                  {users && users.map(u => (
                    <option value={u.id} key={u.id}>{u.first_name} {u['last name']}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <select className="w-full p-3 border rounded-lg" title="Select Category" onChange={e => setCategory(categories?.find(c => c.id === parseInt(e.target.value)))}>
                  <option value="">Category</option>
                  {categories && categories.map(category => (
                    <option value={category.id} key={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <input type="number" placeholder="Count" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
              </div>
              {formError && <p className="text-red-500">{formError}</p>}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg" onClick={handleSubmit}>
                SET
              </button>
            </form>

          </div>
        </div>
        <div className="max-w-md mx-auto py-20 z-10 relative">

        </div>

      </section>

      {/* Participants Rating Table */}
      <section className="container mx-auto px-4 py-20 relative  bg-white">
        <h2 className="text-4xl leading-normal font-bold mb-8">Рейтинг участников</h2>
        {loading ? (
          <Skeleton className="w-full h-96" />
        ) : (
          <UserTable columns={columns} data={data} />
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#252A3B] md:text-xl text-white py-8 md:py-12 text-center">
        <p>Copyright ©2025. All rights reserveu</p>
      </footer>
    </div>
  );
};

export default LandingPage;
