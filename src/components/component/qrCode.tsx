import { QRCode as _QRCode } from 'react-qrcode-logo';
import React from 'react'

function QRCode({ url }: { url: string }) {
    return (
        <_QRCode value={url} quietZone={30} bgColor="hsl(24 9.8% 10%)" fgColor="hsl(142.1 70.6% 45.3%)" qrStyle='dots' eyeRadius={[10, 10, 10, 10]} />
    )
}

export default QRCode   