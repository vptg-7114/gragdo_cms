import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Staff {
  id: string
  name: string
  role: string
  isAvailable: boolean
  avatar?: string
}

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            Staff List
          </h3>
          <Button variant="link" className="text-[#7165e1] text-sm font-sf-pro font-medium p-0">
            Manage
          </Button>
        </div>

        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-sm rounded-xl">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-sf-pro font-semibold text-black text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {member.role}
                  </p>
                </div>
              </div>
              <Badge
                variant={member.isAvailable ? "completed" : "destructive"}
                className="rounded-full text-xs px-3 py-1"
              >
                {member.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}