import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/logo.png';

export default function Header() {
    return (
        <div className='flex justify-center'>
            <Link href='/'>
                <Image
                    src={logo}
                    width={150}
                    height={190}
                    alt="Aarika Gold"
                />
            </Link>
        </div>

    );
}
