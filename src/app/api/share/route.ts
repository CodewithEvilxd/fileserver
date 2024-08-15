// app/api/share/route.ts
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

function generateUniqueCode() {
    const alphabets = 'abcdefghijkmnopqrstuvwxyz';
    const twoAlphabets = alphabets[Math.floor(Math.random() * 25)] + alphabets[Math.floor(Math.random() * 25)];
    const twoNumbers = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10);
    return twoAlphabets + twoNumbers;
}

export async function POST(req: NextRequest) {
    let newUnique;
    try {
        const formData = await req.formData();
        const pb = new PocketBase('https://evilxd.pockethost.io');

        do {
            newUnique = generateUniqueCode();
        } while (await pb.collection('files').getFirstListItem(`unique="${newUnique}"`).catch(() => null));

        formData.append('unique', newUnique);
        await pb.collection('files').create(formData);


    } catch (error: any) {
        console.error('Error handling shared content:', error?.message);
        newUnique = "";
        return redirect('https://file-share-server-ten.vercel.app/');
    } finally {
        if (newUnique === "") {
            return redirect('https://file-share-server-ten.vercel.app/');
        } else {
            return redirect('https://file-share-server-ten.vercel.app/show-' + newUnique);
        }
    }
}