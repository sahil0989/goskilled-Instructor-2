import { Link } from 'react-router-dom';
import { Pie, PieChart, Tooltip } from 'recharts';
import { Button } from '../@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <h1 className="text-xl md:text-2xl font-bold mb-4">Admin Pannel</h1>

            <Button>
                <Link to={"/student"}>Student Progress</Link>
            </Button>

            <div>
                <PieChart width={400} height={400}>
                    <Pie
                        activeShape={{
                            fill: 'red',
                        }}
                        data={[
                            { name: 'Page A', uv: 590, color: "red" },
                            { name: 'Page B', uv: 590, color: "pink" },
                            { name: 'Page C', uv: 868 },
                        ]}
                        dataKey="uv"
                    />
                    <Tooltip defaultIndex={2} />
                </PieChart>
            </div>
        </>
    )
}
