/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    dest: 'public',
    register: true,
    skipWaiting: true,
    reloadOnOnline: true,
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true,
    }

})

module.exports = withPWA({
    reactStrictMode: false
})