import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useGetAllUsers } from "../../hooks/useQueries";

export default function UserManagementPage() {
  const { data: users, isLoading } = useGetAllUsers();

  return (
    <div className="space-y-5" data-ocid="users.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          View all registered users
        </p>
      </div>

      <div className="bg-card rounded-lg card-shadow border-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm text-foreground">
            Registered Users
          </span>
          {!isLoading && users && (
            <Badge variant="secondary" className="ml-auto">
              {users.length} total
            </Badge>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="users.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  #
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Username
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Principal ID
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["a", "b", "c", "d", "e"].map((i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={4} className="px-5 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : !users || users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-muted-foreground"
                    data-ocid="users.empty_state"
                  >
                    No registered users yet.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr
                    key={user.userId.toString()}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                    data-ocid={`users.item.${i + 1}`}
                  >
                    <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-header flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {user.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono truncate max-w-[200px] block">
                        {user.userId.toString()}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >
                        user
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
