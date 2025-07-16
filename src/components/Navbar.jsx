import logo_full from "../images/logo_full.png"
import { Link } from 'react-router-dom';
import { Button } from '../@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {

    const { user } = useAuth();

    return (
        <>
            <div className={`z-50 fixed w-full px-10 flex flex-col justify-center bg-white`}>
                <div className='flex  w-full h-20 items-center justify-between'>

                    <img src={logo_full} className='w-36 md:w-48' alt='' />

                    <div className='flex items-center gap-5'>
                        {
                            user ? (<div></div>) : (
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
