import Image from "next/image";
import { profile } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={profile.author.image}
                alt={profile.author.name}
                width={120}
                height={120}
                className="rounded-full"
              />
              <h1 className="text-3xl font-bold">{profile.author.name}</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-center text-muted-foreground">
                {profile.author.bio}
              </p>
              <div className="mt-8">
                <h2 className="text-xl font-semibold">About {profile.name}</h2>
                <p className="mt-2 text-muted-foreground">
                  {profile.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}