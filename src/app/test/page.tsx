import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
];

const data: User[] = [
    { id: 1, name: "Ali", email: "ali@test.com", role: "Admin" },
    { id: 2, name: "Ahmed", email: "ahmed@test.com", role: "User" },
];

export default function UsersPage() {
    return (
        <DataTable
            columns={columns}
            data={data}
            initialColumnVisibility={{
                id: false,
                email: false,
                hAFF:false       
                
            }}
        />
    );
}