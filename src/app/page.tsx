"use client";
import { DataTable as UserTable } from '@/components/data-table';
import { apiUrl } from '@/lib/constants';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

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
interface ColumnData {
  id: string;
  name: string;
}

interface RowData {
  [key: string]: string | number; // Adjust based on your API response
}

type UserName = {
  avatar: string
  firstName: string
  lastName: string
}

type CountsData = {
  id: string
  name: UserName
  total: number
  [key: string]: any
}

// export const payments: CountsData[] = [
//   {
//     id: "728ed52f",
//     name: {
//       avatar: "https://randomuser.me/api/portraits",
//       first_name: "Maurice",
//       last_name: "Bishop"
//     },
//     category: {
//       id: 1,
//       name: "Category 1"
//     },
//     total: 6000
//   }

// ]
// export const columnsPayments: ColumnDef<Payment>[] = [
//   {
//     id: "name",
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => {
//       const name: DrDsName = row.getValue('name')
//       return <div className="flex items-center gap-x-2">
//         {
//           name.avatarSrc ?
//             <Image width={36} height={36} src={name.avatarSrc} title="Avatar of" alt="" className="rounded-full" />
//             :
//             <div className="flex size-9 items-center justify-center rounded-full border-[0.85px] border-[rgba(23,24,27,0.16)] bg-[rgba(17,24,39,0.08)] px-2 py-1 text-xs" >
//               {name.name[0]}
//             </div>
//         }
//         <div className="flex flex-col items-start" >
//           <div className="text-ellipsis text-nowrap text-xs font-medium" >
//             {name.name}
//           </div>
//           {/* <div className="font-400 flex gap-1 text-xs text-[#6B7280]" >
//                         <ShieldTick variant="Bold" className='size-4 text-green-500' />  {name.verified ? "Profile verified" : ""}
//                     </div> */}
//         </div>

//       </div>
//     },
//   },
//   {
//     accessorKey: "position",
//     header: "Position",
//   },
//   {
//     accessorKey: "salary",
//     header: "Salary",
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("salary"));
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount);
//       return formatted;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status: boolean = row.getValue('status')
//       return <div className="flex items-center gap-x-2">
//         {
//           status ?
//             <div className="flex items-center justify-center rounded border border-[#22C55E1f] bg-[#22C55E1F] px-4 py-1 text-xs font-medium text-[#22C55E]">
//               Paid
//             </div>
//             :
//             <div className="flex items-center justify-center rounded border border-[#DC26261F] bg-[#DC262614] px-4 py-1 text-xs font-medium text-[#DC2626] ">
//               Unpaid
//             </div>
//         }
//       </div>
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => (
//       <Button variant="ghost" className="size-8 p-0">
//         <MoreHorizontal className="size-4" />
//       </Button>
//     ),
//   },
// ];

const LandingPage = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [users, setUsers] = useState<User[]>();
  const [counts, setCounts] = useState<Counts[]>()

  const [category, setCategory] = useState<Category>();
  const [user, setUser] = useState<User>();
  const [count, setCount] = useState<number>();

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
          header: item.name,
          cell: ({ row }) => {
            const count: number = row.getValue(item.id.toString());
            return <div className={"text-center " + (count > 0 ? 'text-green-400' : 'text-red-400')}>{count}</div>;
          },
        }));

        const columns: ColumnDef<CountsData>[] = [
          {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
              const name: UserName = row.getValue("name");
              return <div className="flex items-center gap-x-2">
                {name.avatar && name.avatar.length
                  ? <Image src={name.avatar} width={20} height={20} alt="" className="w-8 h-8 rounded-full" />
                  : name.firstName == 'total' && name.lastName == 'total' ? <></>
                    :
                    <div className="rounded-full bg-green-800 text-white uppercase text-center size-6">{name?.firstName[0]} {name?.lastName[0]}</div>}
                <span>{name.firstName == 'total' && name.lastName == 'total' ? <>Общее</> : <div>{name.firstName} {name.lastName} </div>}</span>
              </div>;
            },
          }
        ];
        columns.push(...categoryColumns);
        columns.push({
          id: "total",
          accessorKey: "total",
          header: "Total",
          cell: ({ row }) => {
            const total: number = row.getValue("total");
            return <div className="text-center">{total}</div>;
          },
        });

        setColumns(columns);


        const data: CountsData[] = usersData.map((user) => {
          const dd = {
            id: user.id.toString(),
            name: {
              avatar: user.avatar,
              firstName: user.first_name,
              lastName: user['last name']
            },
          }
          return dd
        });

        data.push({
          id: "total",
          name: {
            avatar: "",
            firstName: "total",
            lastName: "total"
          },
          total: 0,
        });

        countsData.forEach((count) => {
          const item = data.find((d) => d.id == count.user_id);
          if (item) {
            item[count.category_id] = count.count;
            item.total = (item.total || 0) + count.count;
          }

          const totalRow = data.find((d) => d.id == "total");
          if (totalRow) {
            totalRow[count.category_id] = (totalRow[count.category_id] || 0) + count.count;
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



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ count });

    // let tt = counts?.find((c) => c.user_id == user.id.toString() && c.category_id == category.id.toString());
    // console.log({ tt });
    // const updatedCounts = counts.
    //   map((c) => {
    //     if (c.user_id == user.id.toString() && c.category_id == category.id.toString()) {
    //       return { ...c, count };
    //     }
    //     return c;
    //   });


    // updatedCounts.forEach((countt) => {
    //   const item = data.find((d) => d.id == countt.user_id);
    //   if (item) {
    //     item[countt.category_id] = countt.count;
    //     item.total = (item.total || 0) + countt.count;
    //   }

    //   const totalRow = data.find((d) => d.id == "total");
    //   if (totalRow) {
    //     totalRow[countt.category_id] = (totalRow[countt.category_id] || 0) + countt.count;
    //     totalRow.total = (totalRow.total || 0) + countt.count;
    //   }
    // });

    // setCounts(updatedCounts);
    // setData(data);


    // fetch(`${apiUrl}/counts`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ category_id: category?.id, user_id: user.id, count }),
    // })
    //   .then(res => res.json())
    //   .then(data => console.log(data));
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

  const participants = [
    { id: 1, name: 'Алинов Азал', scores: [500, -300, 600, 0, 1200, 0], total: 6000 },
    { id: 2, name: 'Ркулина Романутко', scores: [500, -400, 600, 1200, 1200, 1800], total: 6000 },
    // Add more participants as needed
  ];

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
            {/* <UserCircle2 className="w-8 h-8 text-blue-500" />
            <UserCircle2 className="w-8 h-8 text-green-500" />
            <UserCircle2 className="w-8 h-8 text-yellow-500" /> */}
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
            <img src="/api/placeholder/200/150" alt="Workspace" className="rounded-lg" />
            <div className="bg-blue-100 rounded-lg flex items-center justify-center">
              {/* <Book className="w-12 h-12 text-blue-600" /> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">
            Aksariyat kompaniyalar ishga joylashishda sizdan ish staji va portfolio so&#39;raydi
          </h2>
          <p className="text-gray-600 mb-4">
            Tabiyki endigini bu sohaga kirib kelayotgan internlarda bular mavjud emas. Ma'lum bir ish stajiga ega bo'lish va turli xil qiziqarli lohiyalardan iborat portfolioni hosil qilish uchun ushbu loyihada amaliyot o'tashni taklif qilamiz.

          </p>
          <p className="text-gray-600 mb-4">
            Amaliyotchilar soni chegaralangan va konkurs asosida saralab olinadi. Eng yuqori ball to'plagan 10 kishi bepul amaliyot o'tash imkoniyatiga ega bo'ladi.
          </p>
          <div className="flex items-center mt-4">
            <img src="/api/placeholder/150/150" alt="Professional" className="rounded-lg" />
            <div className="bg-blue-100 p-4 rounded-lg ml-4">
              {/* <HandshakeIcon className="w-12 h-12 text-blue-600" /> */}
            </div>
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
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg" onClick={handleSubmit}>
            SET
          </button>
        </form>
      </section>

      {/* Participants Rating Table */}
      <section className="max-w-screen-2xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold mb-8">Рейтинг участников</h2>
        {loading ? (
          <Skeleton className="w-full h-96" />
        ) : (
          <UserTable columns={columns} data={data} />
        )}
        <div className="overflow-x-auto hidden">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-600">
                <th className="py-2">#</th>
                <th className="py-2">User</th>
                {[1, 2, 3, 4, 5, 6].map(cat => (
                  <th key={cat} className="py-2">Category {cat}</th>
                ))}
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id} className="border-t">
                  <td className="py-3 text-center">{participant.id}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      {/* <UserCircle2 className="w-6 h-6 mr-2" /> */}
                      {participant.name}
                    </div>
                  </td>
                  {participant.scores.map((score, idx) => (
                    <td key={idx} className="py-3 text-center">
                      <span className={score < 0 ? 'text-red-500' : 'text-green-500'}>
                        {score > 0 ? `+${score}` : score}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 text-center">{participant.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>Copyright ©2025. All rights reserveu</p>
      </footer>
    </div>
  );
};

export default LandingPage;
