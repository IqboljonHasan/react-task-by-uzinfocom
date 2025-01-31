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

export type { Category, User, Counts, UserName, CountsData }