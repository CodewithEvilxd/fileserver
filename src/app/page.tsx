'use client';
import { Upload } from '@/components/component/Upload';
import Wrapper from '@/components/component/Wrapper';
import clsx from 'clsx';

export default function Home() {
    return (<>

        <main>
            <Wrapper>
                <Upload />
            </Wrapper>
        </main>

    </>
    );
}
