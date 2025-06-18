import logo_full from "../images/logo_full.png"
import { Link } from 'react-router-dom';
import { Button } from '../@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Navbar = () => {

    const { user, logout } = useAuth();

    const handleLogout = () => {
        toast.success("Logout Successfully!!")
        logout();
    }

    return (
        <>
            <div className={`z-50 fixed w-full px-10 flex flex-col justify-center bg-white`}>
                <div className='flex  w-full h-20 items-center justify-between'>

                    <Link to={"/"}>
                        <img src={logo_full} className='w-36 md:w-48' alt='' />
                    </Link>

                    <div className='flex items-center gap-5'>
                        {
                            user ? (<div>
                                <div className='flex gap-3'>
                                    <Button
                                        onClick={handleLogout}
                                        className="border-2 border-[#1A6E0A] bg-transparent text-[#1A6E0A] hover:bg-[#1A6E0A] hover:text-white px-3 py-1 text-sm md:px-5 md:py-2 md:text-base">
                                        LogOut
                                    </Button>
                                </div>

                            </div>) : (
                                <div className='flex gap-3 items-center'>
                                    <Link to={"/auth/login"}>
                                        <Button className="bg-[#1A6E0A] hover:bg-[#204718]">Login</Button>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </>
    );
};

export default Navbar;
