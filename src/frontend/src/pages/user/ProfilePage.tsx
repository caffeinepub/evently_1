import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Shield, User } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface Props {
  userName: string;
}

export default function ProfilePage({ userName }: Props) {
  const { identity, clear } = useInternetIdentity();

  return (
    <div className="space-y-6 max-w-2xl mx-auto" data-ocid="profile.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your account information
        </p>
      </div>

      <Card className="card-shadow border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-header flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">
                {userName}
              </p>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-100 mt-1"
              >
                <Shield className="mr-1 h-3 w-3" />
                User
              </Badge>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                Display Name
              </p>
              <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{userName}</span>
              </div>
            </div>

            {identity && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                  Principal ID
                </p>
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <code className="text-xs text-muted-foreground font-mono break-all">
                    {identity.getPrincipal().toString()}
                  </code>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={clear}
              data-ocid="profile.logout_button"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
