'use client';
import { FileView } from '@/components/component/FileView';
import ShowCode from '@/components/component/ShowCode';
import Wrapper from '@/components/component/Wrapper';

export default function GetFiles({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Wrapper>
            {!id.startsWith('show-') && <FileView code={id} />}
            {id.startsWith('show-') && (
                <ShowCode unique={id.replace('show-', '')} />
            )}
        </Wrapper>
    );
}
