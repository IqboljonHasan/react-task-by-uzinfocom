"use client";

import { DataTable as UserTable } from '@/components/data-table';
import { apiUrl } from '@/lib/constants';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Category, Counts, CountsData, User, UserName } from '@/lib/interfaces';
import { TableSkeleton } from '@/components/table-skeleton';
import Hero from '@/components/views/hero';
import Features from '@/components/views/features';

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
    async function initData() {
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
            return <div className={"text-center p-4 leading-8 font-semibold text-sm " + (count > 0 ? "" : count == 0 ? 'bg-green-100 text-green-400' : 'bg-red-100 text-red-400')}>{count > 0 ? ("+" + count) : count}</div>;
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
            id: "number",
            accessorKey: "number",
            header: "№",
            cell: ({ row }) => {
              return <div className="px-4 text-center font-semibold text-sm">{row.index + 1}</div>;
            },
          },
          {
            id: "name",
            accessorKey: "name",
            header: "",
            cell: ({ row }) => {
              const name: UserName = row.getValue("name");
              return <div className="flex items-center gap-x-2 py-4 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={name.avatar} alt="@shadcn" />
                  <AvatarFallback>{name?.firstName[0]} {name?.lastName[0]}</AvatarFallback>
                </Avatar>
                {/* {name.avatar && name.avatar.length
                  ? <Image src={name.avatar} width={20} height={20} alt="" className="w-8 h-8 rounded-full" />
                  : name.id == 'subtotal' ? <></>
                    : <div className="rounded-full bg-green-800 text-white uppercase text-xs flex items-center justify-center size-6 tracking-tighter">
                      {name?.firstName[0]} {name?.lastName[0]}
                    </div>
                } */}
                <span className='text-nowrap font-semibold text-sm '>{name.id == 'subtotal' ? <>Общее  (Category&apos;s total)</> : <div>{name.firstName} {name.lastName} </div>}</span>
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
            return <div className="text-center font-semibold text-sm">{total}</div>;
          },
          footer: ({ table }) => {
            const total = table
              .getColumn("total")
              ?.getFacetedRowModel()
              .flatRows.reduce((sum, row) => sum + (Number(row.getValue('total')) || 0), 0);

            return typeof total === "number" ? (
              <div className="text-center font-semibold text-sm">{total}</div>
            ) : null;
          }
        });

        setColumns(columns);


        const userDataTable: CountsData[] = usersData.map((user) => ({
          id: user.id.toString(),
          name: {
            id: user.id.toString(),
            avatar: user.avatar,
            firstName: user.first_name,
            lastName: user['last name']
          },
          total: 0,
        }));
        console.log(userDataTable);
        userDataTable.forEach((user) => {
          categoriesData.forEach((category) => {
            user[category.id.toString()] = 0;
          });
        });

        countsData.forEach((count) => {
          const item = userDataTable.find((d) => d.id == count.user_id);
          if (item) {
            item[count.category_id] = count.count || 0;
            item.total = (item.total || 0) + count.count;
          }

          const totalRow = userDataTable.find((d) => d.id == "total");
          if (totalRow) {
            totalRow[count.category_id] = ((totalRow[count.category_id] as number) || 0) + count.count;
            totalRow.total = (totalRow.total || 0) + count.count;
          }
        });

        setData(userDataTable);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    initData();
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
    if (user && category && counts) {
      const item = counts.find((c: Counts) => c.user_id == user?.id.toString() && c.category_id == category?.id.toString());
      if (item) {
        setCount(item?.count);
      }
      else {
        setCount(0);
      }
    }
  }, [user, category, counts]);

  return (
    <>
      <Hero />
      <Features />

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

      </section>

      {/* Participants Table */}
      <section className="xl:max-w-screen-2xl mx-auto px-4 py-20 relative  bg-white">
        <h2 className="text-4xl leading-normal font-bold mb-8">Рейтинг участников</h2>
        {loading ? (
          <TableSkeleton />
        ) : (
          <UserTable columns={columns} data={data} />
        )}
      </section>
    </>
  );
};

export default LandingPage;
