import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart2, DollarSign } from "lucide-react"; 
const stats = [
  {
    title: "Total Campaigns",
    value: "1,234",
    icon: BarChart2,
    description: "Projects launched on our platform",
  },
  {
    title: "Total ETH Raised",
    value: "5,678",
    icon: DollarSign,
    description: "Crypto contributed by the community",
  },
  {
    title: "Community Members",
    value: "9,876",
    icon: Users,
    description: "Unique wallets connected",
  },
];

export function PlatformStats() {
  return (
    <section className="bg-muted py-16">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Platform in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="flex flex-row items-center justify-center space-x-2 pb-2">
                <stat.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-extrabold text-primary mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}