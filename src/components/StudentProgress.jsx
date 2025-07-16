import React, { useState } from 'react'
import { Button } from '../@/components/ui/button'
import { AlignRight, CircleX, HomeIcon, X } from 'lucide-react'
import VideoPlayer from './video-player/video-player'

export default function StudentProgress() {

    const [isOpen, setIsOpen] = useState(true)

    return (
        <>
            <div className='relative'>
                {/* sidebar */}
                <div className={`absolute h-[calc(100vh-80px)] ${isOpen ? "w-[250px]" : "w-0 hidden"} shadow-lg p-4 bg-white`}>
                    <div onClick={() => setIsOpen(!isOpen)} className={`md:hidden flex w-full justify-end mb-3`}>
                        <X />
                    </div>
                    <h2 className='text-xl font-semibold pb-5 md:pt-8'>Modules</h2>
                    <div className='px-4 py-1 mb-2'>Module 1</div>
                    <div className='px-4 py-1 mb-2'>Module 2</div>
                    <div className='px-4 py-1 mb-2'>Module 3</div>
                    <div className='px-4 py-1 mb-2'>Module 4</div>
                    <div className='px-4 py-1 mb-2'>Module 5</div>
                </div>

                {/* main content  */}
                <div className='md:pl-[270px] px-6'>

                    <div className='flex items-center justify-between w-full'>
                        <Button>
                            <HomeIcon size={18} /> Back
                        </Button>
                        <Button
                            className="md:hidden"
                            onClick={() => setIsOpen(!isOpen)}>
                            {
                                isOpen ? (
                                    <CircleX size={18} />
                                ) : (
                                    <AlignRight size={18} />
                                )
                            }
                        </Button>
                    </div>

                    <VideoPlayer url={""} className="w-full h-auto" />
                </div>

            </div>
        </>
    )
}
