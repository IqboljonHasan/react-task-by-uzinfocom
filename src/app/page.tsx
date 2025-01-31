"use client";
import { DataTable as UserTable } from '@/components/data-table';
import { apiUrl } from '@/lib/constants';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
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
      <header className="border-b flex items-center justify-center">
        <div className="container flex justify-between items-center py-4">
          <nav className="flex gap-8">
            <a href="#" className="text-[#252A3B] text-lg font-semibold">Reja</a>
            <a href="#" className="text-[#252A3B] text-lg font-semibold">Qabul qilish talablari</a>
            <a href="#" className="text-[#252A3B] text-lg font-semibold">Ko&#39;rsatmalar</a>
            <a href="#" className="text-[#252A3B] text-lg font-semibold">Saralash</a>
          </nav>
          <div className="flex space-x-4">
            <select className="bg-transparent" title="Select Language">
              <option>O&#39;zbek Tili</option>
              <option>English</option>
            </select>
            <button className="bg-[#252A3B] text-white text-[15px] font-bold px-4 py-2 rounded">
              Sinovdan o&#39;ting
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto text-center py-20 relative">
        <Image src="/images/flutter.png" alt="Flutter" width={50} height={58} className='absolute left-[100px] top-[244px]' />
        <Image src="/images/dart.png" alt="Flutter" width={50} height={58} className='absolute left-[300px] top-[844px]' />
        <Image src="/images/figma.png" alt="Flutter" width={50} height={58} className='absolute right-[100px] top-[244px]' />
        <Image src="/images/html5.png" alt="Flutter" width={50} height={58} className='absolute right-[300px] top-[844px]' />
        <Image src="/images/python.png" alt="Flutter" width={50} height={58} className='absolute left-[800px] top-[100px]' />

        <h1 className="text-4xl font-bold mb-8">
          Ваша работа мечты уже ждет вас, начните сегодня!
        </h1>
        <div className="flex justify-center items-center mb-8">
          <div className="flex -space-x-2">
          </div>
          <span className="ml-4 text-gray-600">человек уже стали участниками групп по своим направлениям</span>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
          Оставить заявку
        </button>
      </section>



      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">
            Сайт рыбатекст поможет дизайнеру, верстальщику
          </h2>
          <p className="text-gray-600 mb-4">
            Siz IT o&#39;quv kursini tugatdingiz yoki Internet tarmog&#39;i orqali mustaqil o&#39;rgandingiz, ammo ishga joylashishda qiyinchiliklarga uchrayapsizmi? Biz sizga yordam beramiz. Ushbu loyiha qobiliyatli yoshlarni topib, yetuk kadrlar bo&#39;lib yetishishiga yordam berish uchun tashkil qilindi.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image src="/images/consulting.png" width={300} height={500} alt="Workspace" className="rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">
            Aksariyat kompaniyalar ishga joylashishda sizdan ish staji va portfolio so&#39;raydi
          </h2>
          <p className="text-gray-600 mb-4">
            Tabiyki endigini bu sohaga kirib kelayotgan internlarda bular mavjud emas. Ma&#39;lum bir ish stajiga ega bo&#39;lish va turli xil qiziqarli lohiyalardan iborat portfolioni hosil qilish uchun ushbu loyihada amaliyot o&#39;tashni taklif qilamiz.

          </p>
          <p className="text-gray-600 mb-4">
            Amaliyotchilar soni chegaralangan va konkurs asosida saralab olinadi. Eng yuqori ball to&#39;plagan 10 kishi bepul amaliyot o&#39;tash imkoniyatiga ega bo&#39;ladi.
          </p>
          <div className="flex items-center mt-4">
            <Image src="/images/intern-girl-laptop.png" width={300} height={500} alt="Workspace" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-md mx-auto py-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Форма заявки</h2>
        <form className="space-y-4">
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
      </section>

      {/* Participants Rating Table */}
      <section className=" mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold mb-8">Рейтинг участников</h2>
        {loading ? (
          <Skeleton className="w-full h-96" />
        ) : (
          <UserTable columns={columns} data={data} />
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>Copyright ©2025. All rights reserveu</p>
      </footer>
    </div>
  );
};

export default LandingPage;
