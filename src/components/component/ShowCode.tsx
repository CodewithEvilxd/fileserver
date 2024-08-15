import { Card, CardContent } from '../ui/card'
import QRCode from './qrCode'

function ShowCode({ unique }: { unique: string }) {
    return (
        <Card className={"h-auto w-11/12 max-w-96 flex flex-col items-center justify-center m-auto"}>
            <CardContent className="p-4 m-auto text-center">
                <h1 className="text-4xl font-bold">File Share</h1>
                <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">File uploaded Successfully</p>
            </CardContent>

            <CardContent className="px-4 py-0 text-center">
                <div>
                    <div className="text-xl text-gray-700 dark:text-gray-200 font-mono">
                        Sharing Code <span className='text-primary'>{unique}</span>
                    </div>
                    <QRCode url={`https://fs.sujal.xyz/${unique}`} />
                </div>
            </CardContent>

        </Card >
    )
}

export default ShowCode